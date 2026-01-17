// @ts-nocheck
'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getUtilizationStatus, getStatusFill } from '@/lib/factory-os/colors';

interface UtilizationGaugeProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function UtilizationGauge({
  value,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
  label,
  className,
}: UtilizationGaugeProps) {
  const status = getUtilizationStatus(value);
  const color = getStatusFill(status);

  const { circumference, offset, rotation } = useMemo(() => {
    const radius = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * radius;
    // Gauge shows 270 degrees (3/4 of circle)
    const gaugeCirc = circ * 0.75;
    const clampedValue = Math.max(0, Math.min(100, value));
    const off = gaugeCirc - (clampedValue / 100) * gaugeCirc;

    return {
      circumference: gaugeCirc,
      offset: off,
      rotation: 135, // Start from bottom-left
    };
  }, [size, strokeWidth, value]);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} className="transform -rotate-0">
        {/* Background arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={0}
          transform={`rotate(${rotation} ${center} ${center})`}
        />
        {/* Value arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(${rotation} ${center} ${center})`}
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>

      {/* Center text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingTop: size * 0.05 }}
      >
        <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
          {value.toFixed(0)}%
        </span>
        {showLabel && (
          <span className="text-xs text-zinc-500 mt-0.5">{label || 'Utilization'}</span>
        )}
      </div>
    </div>
  );
}

// Mini gauge for compact displays
interface MiniGaugeProps {
  value: number;
  size?: number;
  className?: string;
}

export function MiniGauge({ value, size = 48, className }: MiniGaugeProps) {
  const status = getUtilizationStatus(value);
  const color = getStatusFill(status);
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.max(0, Math.min(100, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute text-xs font-mono font-medium text-zinc-200 tabular-nums">
        {value.toFixed(0)}
      </span>
    </div>
  );
}

// Linear progress bar alternative
interface UtilizationBarProps {
  value: number;
  height?: number;
  showValue?: boolean;
  className?: string;
}

export function UtilizationBar({
  value,
  height = 8,
  showValue = true,
  className,
}: UtilizationBarProps) {
  const status = getUtilizationStatus(value);
  const color = getStatusFill(status);
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="flex-1 bg-zinc-800 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
      {showValue && (
        <span className="text-sm font-mono text-zinc-300 tabular-nums w-12 text-right">
          {value.toFixed(0)}%
        </span>
      )}
    </div>
  );
}
