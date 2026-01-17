// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Factory, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Facility } from '@/lib/factory-os/types';
import { generateFacility, updateFacility } from '@/lib/factory-os/data-generator';
import { StatusBadge, StatusDot } from './StatusBadge';
import { MiniGauge } from './UtilizationGauge';
import { MiniHeatmap } from './UtilizationHeatmap';
import { Sparkline } from './DrillDownCard';
import { getStatusFill } from '@/lib/factory-os/colors';

interface FactoryOSPreviewProps {
  className?: string;
}

export function FactoryOSPreview({ className }: FactoryOSPreviewProps) {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  // Initialize
  useEffect(() => {
    setFacility(generateFacility(4));
  }, []);

  // Update loop
  useEffect(() => {
    if (!isRunning || !facility) return;

    const interval = setInterval(() => {
      setFacility(prev => prev ? updateFacility(prev) : prev);
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning, facility]);

  if (!facility) {
    return (
      <div className={cn('animate-pulse bg-zinc-900 rounded-xl h-64', className)} />
    );
  }

  // Get utilization values for mini heatmap
  const heatmapValues = facility.lines.flatMap(line =>
    line.cells.map(cell => ({
      id: cell.id,
      value: cell.utilization,
      label: cell.name,
    }))
  ).slice(0, 20);

  return (
    <div className={cn('rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Factory className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">FactoryOS Control Plane</h3>
            <p className="text-xs text-zinc-500">Industrial Robotics Dashboard</p>
          </div>
        </div>
        <StatusBadge status={facility.status} showPulse size="sm" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-4 gap-4">
          {/* Efficiency Gauge */}
          <div className="flex flex-col items-center">
            <MiniGauge value={facility.overallEfficiency} size={56} />
            <span className="text-xs text-zinc-500 mt-1">Efficiency</span>
          </div>

          {/* Throughput */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-mono font-semibold text-zinc-100 tabular-nums">
              {facility.totalThroughput.toFixed(0)}
            </span>
            <span className="text-xs text-zinc-500">units/hr</span>
          </div>

          {/* Energy */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-lg font-mono font-semibold text-zinc-100 tabular-nums">
                {facility.energyConsumption.toFixed(0)}
              </span>
            </div>
            <span className="text-xs text-zinc-500">kWh</span>
          </div>

          {/* Alerts */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              {facility.activeAlerts > 0 ? (
                <AlertTriangle className="h-4 w-4 text-orange-400" />
              ) : (
                <span className="h-4 w-4" />
              )}
              <span className={cn(
                'text-lg font-mono font-semibold tabular-nums',
                facility.activeAlerts > 0 ? 'text-orange-400' : 'text-green-400'
              )}>
                {facility.activeAlerts}
              </span>
            </div>
            <span className="text-xs text-zinc-500">alerts</span>
          </div>
        </div>

        {/* Production Lines */}
        <div className="space-y-2">
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Production Lines</div>
          <div className="grid grid-cols-2 gap-2">
            {facility.lines.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between p-2 rounded-md bg-zinc-800/50 border border-zinc-700/50"
              >
                <div className="flex items-center gap-2">
                  <StatusDot status={line.status} showPulse={!!line.bottleneckCellId} />
                  <span className="text-sm text-zinc-300">{line.name}</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {line.efficiency.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Utilization Heatmap */}
        <div className="space-y-2">
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Cell Utilization</div>
          <MiniHeatmap values={heatmapValues} cols={5} size={28} />
        </div>

        {/* Throughput Trend */}
        {facility.throughputHistory.length > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">Throughput Trend</span>
            <Sparkline
              data={facility.throughputHistory.map(p => p.value)}
              height={28}
              color={getStatusFill(facility.status)}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <Link
        href="/experiments/factory-os"
        className="flex items-center justify-center gap-2 p-3 border-t border-zinc-800 text-sm text-green-400 hover:bg-green-500/10 transition-colors"
      >
        Open Full Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
