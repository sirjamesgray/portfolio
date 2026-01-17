// @ts-nocheck
'use client';

import { Alert } from '@/lib/factory-os/types';
import { cn } from '@/lib/utils';
import { X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface AlertTimelineProps {
  alerts: Alert[];
  maxItems?: number;
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  className?: string;
}

const SEVERITY_CONFIG = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dotColor: 'bg-blue-400' },
  success: { icon: Check, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', dotColor: 'bg-green-400' },
  warning: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dotColor: 'bg-orange-400' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dotColor: 'bg-red-400' },
} as const;

export function AlertTimeline({
  alerts,
  maxItems = 10,
  onAcknowledge,
  onDismiss,
  className,
}: AlertTimelineProps) {
  const displayAlerts = alerts.slice(0, maxItems);

  if (displayAlerts.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8 text-zinc-500 text-sm', className)}>
        No active alerts
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {displayAlerts.map((alert) => {
        const config = SEVERITY_CONFIG[alert.severity];
        const Icon = config.icon;
        const timeAgo = formatTimeAgo(alert.timestamp);

        return (
          <div
            key={alert.id}
            className={cn(
              'relative p-3 rounded-lg border transition-all',
              config.bg,
              config.border,
              alert.acknowledged && 'opacity-60'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={cn('flex-shrink-0 mt-0.5', config.color)}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-sm font-medium', config.color)}>
                    {alert.title}
                  </span>
                  <span className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)} />
                </div>
                <p className="text-xs text-zinc-400 mb-1">
                  {alert.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>{alert.type}</span>
                  <span>•</span>
                  <span>{timeAgo}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!alert.acknowledged && onAcknowledge && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="p-1 rounded hover:bg-zinc-700 transition-colors"
                    title="Acknowledge"
                  >
                    <Check className="h-4 w-4 text-green-400" />
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="p-1 rounded hover:bg-zinc-700 transition-colors"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4 text-zinc-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Acknowledged indicator */}
            {alert.acknowledged && (
              <div className="absolute top-2 right-2">
                <Check className="h-3 w-3 text-green-400" />
              </div>
            )}
          </div>
        );
      })}

      {alerts.length > maxItems && (
        <div className="text-center py-2">
          <span className="text-xs text-zinc-500">
            +{alerts.length - maxItems} more alerts
          </span>
        </div>
      )}
    </div>
  );
}

// Helper to format relative time
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Compact alert badge for headers
interface AlertBadgeProps {
  count: number;
  severity?: 'info' | 'success' | 'warning' | 'error';
  onClick?: () => void;
  className?: string;
}

export function AlertBadge({
  count,
  severity = 'warning',
  onClick,
  className,
}: AlertBadgeProps) {
  if (count === 0) return null;

  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-md border text-sm font-medium transition-colors',
        config.bg,
        config.border,
        config.color,
        'hover:opacity-80',
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{count}</span>
    </button>
  );
}
