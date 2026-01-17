'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HomeLab, Alert, SimulationConfig } from '../types';
import { generateHomeLab, updateHomeLab, generateAlert } from '../data-generator';

const DEFAULT_CONFIG: SimulationConfig = {
  updateInterval: 1000,
  opportunityRate: 2,
  printSpeed: 1,
  saleRate: 0.5,
  errorRate: 0.02,
};

interface UseSimulationOptions {
  printerCount?: number;
  config?: Partial<SimulationConfig>;
  autoStart?: boolean;
}

export function useSimulation(options: UseSimulationOptions = {}) {
  const { printerCount = 2, config: configOverrides = {}, autoStart = true } = options;

  const config: SimulationConfig = { ...DEFAULT_CONFIG, ...configOverrides };

  const [lab, setLab] = useState<HomeLab | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [tickCount, setTickCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize lab
  useEffect(() => {
    setLab(generateHomeLab(printerCount));
  }, [printerCount]);

  // Simulation loop
  useEffect(() => {
    if (!isRunning || !lab) return;

    intervalRef.current = setInterval(() => {
      setLab((prev) => {
        if (!prev) return prev;
        return updateHomeLab(prev, config);
      });

      // Maybe generate a new alert
      setLab((prev) => {
        if (!prev) return prev;
        const newAlert = generateAlert(prev);
        if (newAlert) {
          setAlerts((prevAlerts) => [newAlert, ...prevAlerts].slice(0, 30));
        }
        return prev;
      });

      setTickCount((prev) => prev + 1);
    }, config.updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, lab, config]);

  // Control functions
  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((prev) => !prev), []);

  const reset = useCallback(() => {
    setLab(generateHomeLab(printerCount));
    setAlerts([]);
    setTickCount(0);
  }, [printerCount]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  // Adjust simulation speed
  const setSpeed = useCallback((speed: number) => {
    config.printSpeed = speed;
    config.saleRate = DEFAULT_CONFIG.saleRate * speed;
    config.opportunityRate = DEFAULT_CONFIG.opportunityRate * speed;
  }, [config]);

  return {
    lab,
    alerts,
    isRunning,
    tickCount,
    start,
    pause,
    toggle,
    reset,
    acknowledgeAlert,
    dismissAlert,
    setSpeed,
  };
}
