// @ts-nocheck
'use client';

import { MachineCell, ProductionLine } from '@/lib/factory-os/types';
import { FactoryCard, SectionHeader, Metric, MetricGrid, CardGrid } from './FactoryOSLayout';
import { DrillDownCard, Sparkline } from './DrillDownCard';
import { StatusBadge } from './StatusBadge';
import { getStatusFill } from '@/lib/factory-os/colors';
import { cn } from '@/lib/utils';

interface MachineCellViewProps {
  cell: MachineCell;
  line: ProductionLine;
  onSelectComponent: (componentId: string) => void;
}

// Cell type icons/colors
const CELL_TYPE_CONFIG = {
  'robotic-arm': { emoji: '🦾', color: 'text-blue-400' },
  'welding': { emoji: '⚡', color: 'text-orange-400' },
  'assembly': { emoji: '🔧', color: 'text-green-400' },
  'inspection': { emoji: '👁️', color: 'text-purple-400' },
  'packaging': { emoji: '📦', color: 'text-yellow-400' },
  'cnc': { emoji: '⚙️', color: 'text-cyan-400' },
} as const;

export function MachineCellView({ cell, line, onSelectComponent }: MachineCellViewProps) {
  const cellConfig = CELL_TYPE_CONFIG[cell.type];

  return (
    <div className="space-y-6">
      {/* Cell Overview */}
      <FactoryCard>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cellConfig.emoji}</span>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{cell.name}</h2>
              <p className="text-sm text-zinc-500">
                {cell.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • {line.name}
              </p>
            </div>
          </div>
          <StatusBadge status={cell.status} showPulse />
        </div>

        <MetricGrid>
          <Metric
            label="Throughput"
            value={cell.throughput}
            unit="units/hr"
          />
          <Metric
            label="Target"
            value={cell.targetThroughput}
            unit="units/hr"
          />
          <Metric
            label="Efficiency"
            value={cell.efficiency}
            unit="%"
            trend={cell.efficiency >= 80 ? 'up' : cell.efficiency >= 60 ? 'stable' : 'down'}
          />
          <Metric
            label="Utilization"
            value={cell.utilization}
            unit="%"
          />
        </MetricGrid>

        {/* Throughput Chart */}
        {cell.throughputHistory.length > 1 && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Throughput History</span>
              <Sparkline
                data={cell.throughputHistory.map(p => p.value)}
                height={36}
                color={getStatusFill(cell.status)}
              />
            </div>
          </div>
        )}
      </FactoryCard>

      {/* Components List */}
      <div>
        <SectionHeader
          title="Components"
          subtitle={`${cell.components.length} components installed`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cell.components.map((component) => (
            <DrillDownCard
              key={component.id}
              title={component.name}
              subtitle={component.type.charAt(0).toUpperCase() + component.type.slice(1)}
              status={component.status}
              metrics={[
                { label: 'Utilization', value: component.utilization, unit: '%' },
                { label: 'Temperature', value: component.temperature, unit: '°C' },
                { label: 'Cycle Time', value: component.cycleTime, unit: 'ms' },
                { label: 'Sensors', value: component.sensors.length },
              ]}
              onClick={() => onSelectComponent(component.id)}
            />
          ))}
        </div>
      </div>

      {/* Cell Health Summary */}
      <FactoryCard>
        <SectionHeader title="Health Summary" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cell.components.map((comp) => (
            <div
              key={comp.id}
              className={cn(
                'p-2 rounded-md border',
                comp.status === 'fault' && 'bg-red-500/10 border-red-500/30',
                comp.status === 'warning' && 'bg-orange-500/10 border-orange-500/30',
                comp.status === 'nominal' && 'bg-green-500/10 border-green-500/30',
                comp.status === 'optimal' && 'bg-blue-500/10 border-blue-500/30',
                (comp.status === 'constrained' || comp.status === 'offline' || comp.status === 'predictive') && 'bg-zinc-800/50 border-zinc-700'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 truncate">{comp.name}</span>
                <StatusBadge status={comp.status} size="sm" label="" />
              </div>
              <div className="text-sm font-mono text-zinc-200 mt-1">
                {comp.utilization.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </FactoryCard>
    </div>
  );
}
