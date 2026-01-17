// @ts-nocheck
'use client';

import { Component, MachineCell } from '@/lib/factory-os/types';
import { FactoryCard, SectionHeader, Metric, MetricGrid } from './FactoryOSLayout';
import { StatusBadge } from './StatusBadge';
import { Sparkline } from './DrillDownCard';
import { getStatusFill } from '@/lib/factory-os/colors';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Thermometer, Activity, Gauge } from 'lucide-react';

interface ComponentViewProps {
  component: Component;
  cell: MachineCell;
}

// Component type configurations
const COMPONENT_CONFIG = {
  motor: { icon: '⚙️', description: 'Electric motor providing rotational force' },
  actuator: { icon: '🔄', description: 'Linear or rotary motion control' },
  sensor: { icon: '📡', description: 'Environmental and position sensing' },
  controller: { icon: '🎛️', description: 'PLC/logic controller unit' },
  conveyor: { icon: '➡️', description: 'Material transport belt system' },
  gripper: { icon: '🦾', description: 'End effector for part manipulation' },
} as const;

export function ComponentView({ component, cell }: ComponentViewProps) {
  const config = COMPONENT_CONFIG[component.type];
  const lastMaintenanceDate = new Date(component.lastMaintenance);
  const daysSinceMaintenance = Math.floor((Date.now() - component.lastMaintenance) / (24 * 60 * 60 * 1000));

  return (
    <div className="space-y-6">
      {/* Component Header */}
      <FactoryCard>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{component.name}</h2>
              <p className="text-sm text-zinc-500">{config.description}</p>
              <p className="text-xs text-zinc-600 mt-1">Part of {cell.name}</p>
            </div>
          </div>
          <StatusBadge status={component.status} showPulse />
        </div>

        <MetricGrid>
          <Metric
            label="Utilization"
            value={component.utilization}
            unit="%"
          />
          <Metric
            label="Temperature"
            value={component.temperature}
            unit="°C"
          />
          <Metric
            label="Cycle Time"
            value={component.cycleTime}
            unit="ms"
          />
          <Metric
            label="Sensors"
            value={component.sensors.length}
          />
        </MetricGrid>

        {/* Maintenance Info */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock className="h-4 w-4" />
            <span>Last maintenance: {daysSinceMaintenance} days ago</span>
          </div>

          {/* Predictive Failure Warning */}
          {component.predictedFailure && (
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-purple-500/20 border border-purple-500/30">
              <AlertTriangle className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-purple-400">
                Predicted failure in {Math.floor((component.predictedFailure - Date.now()) / (60 * 60 * 1000))}h
              </span>
            </div>
          )}
        </div>
      </FactoryCard>

      {/* Sensor Readings */}
      <div>
        <SectionHeader
          title="Sensor Readings"
          subtitle="Real-time telemetry data"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {component.sensors.map((sensor) => {
            const valuePercent = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;

            return (
              <FactoryCard key={sensor.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-zinc-100">{sensor.name}</h3>
                    <p className="text-xs text-zinc-500">
                      Range: {sensor.min} - {sensor.max} {sensor.unit}
                    </p>
                  </div>
                  <StatusBadge status={sensor.status} size="sm" />
                </div>

                {/* Current Value */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-mono font-semibold text-zinc-100 tabular-nums">
                    {sensor.value.toFixed(1)}
                  </span>
                  <span className="text-sm text-zinc-500">{sensor.unit}</span>
                </div>

                {/* Value Bar */}
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      sensor.status === 'optimal' && 'bg-blue-500',
                      sensor.status === 'nominal' && 'bg-green-500',
                      sensor.status === 'constrained' && 'bg-yellow-500',
                      sensor.status === 'warning' && 'bg-orange-500',
                      sensor.status === 'fault' && 'bg-red-500',
                      sensor.status === 'offline' && 'bg-gray-500'
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, valuePercent))}%` }}
                  />
                </div>

                {/* History Sparkline */}
                {sensor.history.length > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="text-xs text-zinc-500">History</span>
                    <Sparkline
                      data={sensor.history.map(p => p.value)}
                      height={24}
                      color={getStatusFill(sensor.status)}
                    />
                  </div>
                )}
              </FactoryCard>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <FactoryCard>
        <SectionHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded-md bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Run Diagnostics
          </button>
          <button className="px-3 py-2 rounded-md bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Thermal Scan
          </button>
          <button className="px-3 py-2 rounded-md bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Calibrate
          </button>
          <button className="px-3 py-2 rounded-md bg-orange-500/20 border border-orange-500/30 text-sm text-orange-400 hover:bg-orange-500/30 transition-colors flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedule Maintenance
          </button>
        </div>
      </FactoryCard>
    </div>
  );
}
