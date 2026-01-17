// @ts-nocheck
'use client';

import { Facility } from '@/lib/factory-os/types';
import { FactoryCard, SectionHeader, Metric, MetricGrid, CardGrid } from './FactoryOSLayout';
import { DrillDownCard, Sparkline } from './DrillDownCard';
import { getStatusFill } from '@/lib/factory-os/colors';

interface FacilityViewProps {
  facility: Facility;
  onSelectLine: (lineId: string) => void;
}

export function FacilityView({ facility, onSelectLine }: FacilityViewProps) {
  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <FactoryCard>
        <SectionHeader title="Facility Overview" subtitle="Real-time production metrics" />
        <MetricGrid>
          <Metric
            label="Total Throughput"
            value={facility.totalThroughput}
            unit="units/hr"
            trend={facility.overallEfficiency >= 80 ? 'up' : 'down'}
          />
          <Metric
            label="Overall Efficiency"
            value={facility.overallEfficiency}
            unit="%"
          />
          <Metric
            label="Energy Consumption"
            value={facility.energyConsumption}
            unit="kWh"
          />
          <Metric
            label="Active Alerts"
            value={facility.activeAlerts}
          />
        </MetricGrid>

        {/* Throughput Sparkline */}
        {facility.throughputHistory.length > 1 && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500">Throughput Trend (last 60 ticks)</span>
              <Sparkline
                data={facility.throughputHistory.map(p => p.value)}
                height={32}
                color={getStatusFill(facility.status)}
              />
            </div>
          </div>
        )}
      </FactoryCard>

      {/* Production Lines */}
      <div>
        <SectionHeader
          title="Production Lines"
          subtitle={`${facility.lines.length} lines operational`}
        />
        <CardGrid>
          {facility.lines.map((line) => (
            <DrillDownCard
              key={line.id}
              title={line.name}
              subtitle={`${line.cells.length} machine cells`}
              status={line.status}
              metrics={[
                { label: 'Throughput', value: line.throughput, unit: 'u/hr' },
                { label: 'Efficiency', value: line.efficiency, unit: '%' },
                { label: 'Utilization', value: line.utilization, unit: '%' },
                { label: 'Defect Rate', value: line.defectRate, unit: '%' },
              ]}
              alertCount={line.activeAlerts}
              isBottleneck={!!line.bottleneckCellId}
              onClick={() => onSelectLine(line.id)}
            />
          ))}
        </CardGrid>
      </div>
    </div>
  );
}
