// @ts-nocheck
'use client';

import { Play, Pause, RotateCcw, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { StatusLevel } from '@/lib/factory-os/types';

interface FactoryOSHeaderProps {
  title: string;
  status: StatusLevel;
  isRunning: boolean;
  alertCount: number;
  efficiency: number;
  onToggleSimulation: () => void;
  onReset: () => void;
  className?: string;
}

export function FactoryOSHeader({
  title,
  status,
  isRunning,
  alertCount,
  efficiency,
  onToggleSimulation,
  onReset,
  className,
}: FactoryOSHeaderProps) {
  return (
    <header className={cn('flex items-center justify-between py-4', className)}>
      {/* Left: Title and Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
        <StatusBadge status={status} showPulse />
      </div>

      {/* Right: Metrics and Controls */}
      <div className="flex items-center gap-6">
        {/* Efficiency */}
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-400" />
          <span className="text-sm text-zinc-400">Efficiency</span>
          <span className={cn(
            'text-sm font-mono font-medium',
            efficiency >= 80 ? 'text-green-400' : efficiency >= 60 ? 'text-yellow-400' : 'text-red-400'
          )}>
            {efficiency.toFixed(1)}%
          </span>
        </div>

        {/* Alerts */}
        {alertCount > 0 && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">
              {alertCount} {alertCount === 1 ? 'Alert' : 'Alerts'}
            </span>
          </div>
        )}

        {/* Simulation Controls */}
        <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
          <button
            onClick={onToggleSimulation}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              isRunning
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
            )}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
