// @ts-nocheck
'use client';

import { Search, Palette, Printer, Megaphone, DollarSign, ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StageMetrics } from '@/lib/factory-os/types';
import { PIPELINE_COLORS, STAGE_STATUS_COLORS } from '@/lib/factory-os/colors';
import { StageStatusBadge } from './StatusBadge';

interface PipelineViewProps {
  stages: StageMetrics[];
  onStageClick?: (stage: 'research' | 'print' | 'market' | 'sales') => void;
  className?: string;
}

const STAGE_CONFIG = {
  research: { icon: Search, label: 'Research', color: PIPELINE_COLORS.research },
  design: { icon: Palette, label: 'Design', color: PIPELINE_COLORS.design },
  print: { icon: Printer, label: 'Print', color: PIPELINE_COLORS.print },
  market: { icon: Megaphone, label: 'Market', color: PIPELINE_COLORS.market },
  sales: { icon: DollarSign, label: 'Sales', color: PIPELINE_COLORS.sales },
} as const;

export function PipelineView({ stages, onStageClick, className }: PipelineViewProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      {stages.map((stage, index) => {
        const config = STAGE_CONFIG[stage.stage];
        const Icon = config.icon;
        const isClickable = stage.stage !== 'design' && onStageClick;

        return (
          <div key={stage.stage} className="flex items-center flex-1">
            {/* Stage Card */}
            <button
              onClick={() => isClickable && onStageClick(stage.stage as 'research' | 'print' | 'market' | 'sales')}
              disabled={!isClickable}
              className={cn(
                'flex-1 rounded-lg border p-4 transition-all',
                isClickable && 'hover:border-primary/30 hover:bg-muted/50 cursor-pointer',
                !isClickable && 'cursor-default',
                'border-border bg-card/50'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: config.color }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{config.label}</span>
                </div>
                <StageStatusBadge status={stage.status} showPulse size="sm" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Processing</span>
                  <p className="text-lg font-mono font-semibold text-foreground">
                    {stage.itemsProcessing}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed</span>
                  <p className="text-lg font-mono font-semibold text-foreground">
                    {stage.itemsCompleted}
                  </p>
                </div>
              </div>

              {/* Throughput */}
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Throughput</span>
                  <span className="text-foreground/80 font-mono">
                    {stage.throughputPerHour.toFixed(1)}/hr
                  </span>
                </div>
              </div>
            </button>

            {/* Arrow connector (except for last item) */}
            {index < stages.length - 1 && (
              <div className="flex-shrink-0 px-1">
                <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Compact pipeline for header
export function PipelineMini({ stages, className }: { stages: StageMetrics[]; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stages.map((stage, index) => {
        const config = STAGE_CONFIG[stage.stage];
        const statusColor = STAGE_STATUS_COLORS[stage.status].fill;

        return (
          <div key={stage.stage} className="flex items-center">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20` }}
              title={`${config.label}: ${stage.itemsProcessing} processing`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
            </div>
            {index < stages.length - 1 && (
              <ArrowRight className="h-3 w-3 text-muted-foreground/50 mx-0.5" />
            )}
          </div>
        );
      })}
    </div>
  );
}
