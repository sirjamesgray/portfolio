// @ts-nocheck
'use client';

import { Printer as PrinterIcon, Thermometer, Clock, Box, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PrintJob, Printer } from '@/lib/factory-os/types';
import { getPrintProgressColor } from '@/lib/factory-os/colors';
import { StatusDot } from './StatusBadge';

interface PrintQueueViewProps {
  printers: Printer[];
  queue: PrintJob[];
  onPrinterClick?: (printerId: string) => void;
  className?: string;
}

export function PrintQueueView({ printers, queue, onPrinterClick, className }: PrintQueueViewProps) {
  const activeJobs = queue.filter(j => j.status === 'printing');
  const queuedJobs = queue.filter(j => j.status === 'queued');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Printers */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Printers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {printers.map((printer) => {
            const currentJob = queue.find(j => j.id === printer.currentJobId);
            const statusColor = printer.status === 'printing' ? '#22c55e' :
                               printer.status === 'error' ? '#ef4444' :
                               printer.status === 'maintenance' ? '#f97316' : '#71717a';

            return (
              <button
                key={printer.id}
                onClick={() => onPrinterClick?.(printer.id)}
                className="w-full text-left rounded-lg border border-border bg-card/50 p-4 hover:border-primary/30 hover:bg-card transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PrinterIcon className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="font-medium text-foreground">{printer.name}</p>
                      <p className="text-xs text-muted-foreground">{printer.model}</p>
                    </div>
                  </div>
                  <StatusDot color={statusColor} pulse={printer.status === 'printing'} />
                </div>

                {/* Current Job */}
                {currentJob && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground truncate">{currentJob.productName}</span>
                      <span className="text-foreground/80 font-mono">{currentJob.progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${currentJob.progress}%`,
                          backgroundColor: getPrintProgressColor(currentJob.progress),
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>{currentJob.materialType} • {currentJob.materialGrams}g</span>
                      <span>{Math.ceil(currentJob.estimatedMinutes - currentJob.elapsedMinutes)}m left</span>
                    </div>
                  </div>
                )}

                {/* Temps */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-red-400" />
                    <span className="text-muted-foreground">Nozzle:</span>
                    <span className={cn(
                      'font-mono',
                      printer.nozzleTemp > 50 ? 'text-orange-400' : 'text-muted-foreground'
                    )}>
                      {printer.nozzleTemp.toFixed(0)}°C
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Box className="h-3 w-3 text-blue-400" />
                    <span className="text-muted-foreground">Bed:</span>
                    <span className={cn(
                      'font-mono',
                      printer.bedTemp > 30 ? 'text-blue-400' : 'text-muted-foreground'
                    )}>
                      {printer.bedTemp.toFixed(0)}°C
                    </span>
                  </div>
                </div>

                {/* Idle state */}
                {printer.status === 'idle' && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Ready • {printer.totalPrints} prints • {printer.successRate.toFixed(0)}% success
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Queue */}
      {queuedJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Queue ({queuedJobs.length})</h3>
          <div className="space-y-2">
            {queuedJobs.map((job, index) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground/60">#{index + 1}</span>
                  <div>
                    <p className="text-sm text-foreground">{job.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.materialType} • {job.materialGrams}g • ~{job.estimatedMinutes}m
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Queued</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {queue.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <PrinterIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No print jobs in queue</p>
        </div>
      )}
    </div>
  );
}

// Mini print status for overview
interface PrintStatusMiniProps {
  printers: Printer[];
  queue: PrintJob[];
  className?: string;
}

export function PrintStatusMini({ printers, queue, className }: PrintStatusMiniProps) {
  const activePrinters = printers.filter(p => p.status === 'printing').length;
  const activeJob = queue.find(j => j.status === 'printing');

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <PrinterIcon className="h-4 w-4 text-orange-400" />
      <div className="flex-1 min-w-0">
        {activeJob ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/80 truncate">{activeJob.productName}</span>
              <span className="text-muted-foreground font-mono ml-2">{activeJob.progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${activeJob.progress}%`,
                  backgroundColor: getPrintProgressColor(activeJob.progress),
                }}
              />
            </div>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">No active prints</span>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {activePrinters}/{printers.length}
      </div>
    </div>
  );
}
