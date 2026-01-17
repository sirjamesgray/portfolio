// @ts-nocheck
'use client';

import { ChevronRight, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusLevel } from '@/lib/factory-os/types';
import { StatusDot } from './StatusBadge';
import { getStatusClasses } from '@/lib/factory-os/colors';

interface DrillDownCardProps {
  title: string;
  subtitle?: string;
  status: StatusLevel;
  metrics: {
    label: string;
    value: number | string;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  alertCount?: number;
  onClick: () => void;
  className?: string;
  isBottleneck?: boolean;
}

export function DrillDownCard({
  title,
  subtitle,
  status,
  metrics,
  alertCount = 0,
  onClick,
  className,
  isBottleneck = false,
}: DrillDownCardProps) {
  const statusColors = getStatusClasses(status);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-lg border bg-zinc-900/50 p-4 transition-all',
        'hover:bg-zinc-900 hover:border-zinc-700',
        'focus:outline-none focus:ring-2 focus:ring-green-500/50',
        isBottleneck && 'ring-2 ring-red-500/50 border-red-500/30',
        !isBottleneck && 'border-zinc-800',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusDot status={status} showPulse={status === 'warning' || status === 'fault'} />
          <div>
            <h3 className="font-medium text-zinc-100">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-zinc-600" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-0.5">
            <p className="text-xs text-zinc-500">{metric.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-mono font-medium text-zinc-200 tabular-nums">
                {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
              </span>
              {metric.unit && (
                <span className="text-xs text-zinc-500">{metric.unit}</span>
              )}
              {metric.trend && (
                <span className="ml-auto">
                  {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                  {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-400" />}
                  {metric.trend === 'stable' && <Minus className="h-3 w-3 text-zinc-500" />}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {(alertCount > 0 || isBottleneck) && (
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
          {alertCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{alertCount} alert{alertCount !== 1 ? 's' : ''}</span>
            </div>
          )}
          {isBottleneck && (
            <div className="flex items-center gap-1 text-xs text-red-400 ml-auto">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
              </span>
              <span>Bottleneck</span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

// Mini sparkline for cards
interface SparklineProps {
  data: number[];
  height?: number;
  className?: string;
  color?: string;
}

export function Sparkline({ data, height = 24, className, color = '#22c55e' }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 80;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
