// @ts-nocheck
'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ProductionLine, MachineCell } from '@/lib/factory-os/types';
import { getUtilizationStatus, getStatusFill, getStatusClasses } from '@/lib/factory-os/colors';
import { StatusDot } from './StatusBadge';

interface UtilizationHeatmapProps {
  lines: ProductionLine[];
  onSelectCell?: (lineId: string, cellId: string) => void;
  className?: string;
}

export function UtilizationHeatmap({
  lines,
  onSelectCell,
  className,
}: UtilizationHeatmapProps) {
  // Get all unique cell types for column headers
  const cellTypes = useMemo(() => {
    const types = new Set<MachineCell['type']>();
    lines.forEach(line => {
      line.cells.forEach(cell => types.add(cell.type));
    });
    return Array.from(types);
  }, [lines]);

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-xs font-medium text-zinc-500 w-32">
              Line
            </th>
            {cellTypes.map((type) => (
              <th key={type} className="p-2 text-center text-xs font-medium text-zinc-500">
                {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id} className="border-t border-zinc-800">
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={line.status} showPulse={line.status === 'warning' || line.status === 'fault'} />
                  <span className="text-sm text-zinc-300">{line.name}</span>
                </div>
              </td>
              {cellTypes.map((type) => {
                const cell = line.cells.find(c => c.type === type);
                if (!cell) {
                  return (
                    <td key={type} className="p-2">
                      <div className="w-full h-10 bg-zinc-900 rounded" />
                    </td>
                  );
                }

                const status = getUtilizationStatus(cell.utilization);
                const color = getStatusFill(status);
                const isBottleneck = cell.id === line.bottleneckCellId;

                return (
                  <td key={type} className="p-2">
                    <button
                      onClick={() => onSelectCell?.(line.id, cell.id)}
                      className={cn(
                        'w-full h-10 rounded flex items-center justify-center',
                        'transition-all hover:scale-105 hover:z-10 relative',
                        isBottleneck && 'ring-2 ring-red-500 ring-offset-1 ring-offset-zinc-950'
                      )}
                      style={{
                        backgroundColor: `${color}30`,
                        border: `1px solid ${color}50`,
                      }}
                      title={`${cell.name}: ${cell.utilization.toFixed(0)}%`}
                    >
                      <span className="text-xs font-mono text-zinc-200">
                        {cell.utilization.toFixed(0)}%
                      </span>
                      {isBottleneck && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Compact grid heatmap for preview
interface MiniHeatmapProps {
  values: { id: string; value: number; label?: string }[];
  cols?: number;
  size?: number;
  className?: string;
}

export function MiniHeatmap({
  values,
  cols = 4,
  size = 32,
  className,
}: MiniHeatmapProps) {
  return (
    <div
      className={cn('grid gap-1', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}
    >
      {values.map((item) => {
        const status = getUtilizationStatus(item.value);
        const color = getStatusFill(status);

        return (
          <div
            key={item.id}
            className="rounded flex items-center justify-center"
            style={{
              width: size,
              height: size,
              backgroundColor: `${color}30`,
              border: `1px solid ${color}50`,
            }}
            title={item.label ? `${item.label}: ${item.value.toFixed(0)}%` : `${item.value.toFixed(0)}%`}
          >
            <span className="text-[10px] font-mono text-zinc-300">
              {item.value.toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
