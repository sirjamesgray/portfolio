// @ts-nocheck
'use client';

import { ProductionLine, Facility } from '@/lib/factory-os/types';
import { FactoryCard, SectionHeader, Metric, MetricGrid, CardGrid } from './FactoryOSLayout';
import { DrillDownCard, Sparkline } from './DrillDownCard';
import { StatusBadge } from './StatusBadge';
import { getStatusFill, getDefectRateStatus } from '@/lib/factory-os/colors';

interface ProductionLineViewProps {
  line: ProductionLine;
  facility: Facility;
  onSelectCell: (cellId: string) => void;
}

export function ProductionLineView({ line, facility, onSelectCell }: ProductionLineViewProps) {
  const bottleneckCell = line.bottleneckCellId
    ? line.cells.find(c => c.id === line.bottleneckCellId)
    : null;

  return (
    <div className="space-y-6">
      {/* Line Overview */}
      <FactoryCard>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{line.name}</h2>
            <p className="text-sm text-zinc-500">Part of {facility.name}</p>
          </div>
          <StatusBadge status={line.status} showPulse />
        </div>

        <MetricGrid>
          <Metric
            label="Throughput"
            value={line.throughput}
            unit="units/hr"
          />
          <Metric
            label="Target"
            value={line.targetThroughput}
            unit="units/hr"
          />
          <Metric
            label="Efficiency"
            value={line.efficiency}
            unit="%"
            trend={line.efficiency >= 80 ? 'up' : line.efficiency >= 60 ? 'stable' : 'down'}
          />
          <Metric
            label="Utilization"
            value={line.utilization}
            unit="%"
          />
        </MetricGrid>

        {/* Defect Rate */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Metric label="Defect Rate" value={line.defectRate} unit="%" />
            <StatusBadge
              status={getDefectRateStatus(line.defectRate)}
              size="sm"
            />
          </div>

          {/* Throughput Sparkline */}
          {line.throughputHistory.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Trend</span>
              <Sparkline
                data={line.throughputHistory.map(p => p.value)}
                height={28}
                color={getStatusFill(line.status)}
              />
            </div>
          )}
        </div>

        {/* Bottleneck Warning */}
        {bottleneckCell && (
          <div className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
              </span>
              <span className="text-sm font-medium text-red-400">Bottleneck Detected</span>
            </div>
            <p className="text-xs text-red-400/80 mt-1">
              {bottleneckCell.name} operating at {bottleneckCell.efficiency.toFixed(1)}% efficiency
            </p>
          </div>
        )}
      </FactoryCard>

      {/* Machine Cells */}
      <div>
        <SectionHeader
          title="Machine Cells"
          subtitle={`${line.cells.length} cells in sequence`}
        />
        <CardGrid>
          {line.cells.map((cell) => (
            <DrillDownCard
              key={cell.id}
              title={cell.name}
              subtitle={cell.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              status={cell.status}
              metrics={[
                { label: 'Throughput', value: cell.throughput, unit: 'u/hr' },
                { label: 'Efficiency', value: cell.efficiency, unit: '%' },
                { label: 'Utilization', value: cell.utilization, unit: '%' },
                { label: 'Components', value: cell.components.length },
              ]}
              alertCount={cell.activeAlerts}
              isBottleneck={cell.id === line.bottleneckCellId}
              onClick={() => onSelectCell(cell.id)}
            />
          ))}
        </CardGrid>
      </div>
    </div>
  );
}
