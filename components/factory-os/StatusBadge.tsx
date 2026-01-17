// @ts-nocheck
'use client';

import { cn } from '@/lib/utils';
import { StageStatus, ProductStatus } from '@/lib/factory-os/types';
import { getStageStatusClasses, getProductStatusClasses, STAGE_STATUS_COLORS, PRODUCT_STATUS_COLORS } from '@/lib/factory-os/colors';

interface StageStatusBadgeProps {
  status: StageStatus;
  label?: string;
  showPulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const STAGE_LABELS: Record<StageStatus, string> = {
  idle: 'Idle',
  running: 'Running',
  completed: 'Done',
  error: 'Error',
  queued: 'Queued',
};

const SIZE_CLASSES = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function StageStatusBadge({
  status,
  label,
  showPulse = false,
  size = 'md',
  className,
}: StageStatusBadgeProps) {
  const statusClasses = getStageStatusClasses(status);
  const displayLabel = label ?? STAGE_LABELS[status];
  const shouldPulse = showPulse && status === 'running';
  const colors = STAGE_STATUS_COLORS[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        statusClasses,
        SIZE_CLASSES[size],
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {shouldPulse && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: colors.fill }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: colors.fill }}
        />
      </span>
      {displayLabel}
    </span>
  );
}

// Product status badge
interface ProductStatusBadgeProps {
  status: ProductStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PRODUCT_LABELS: Record<ProductStatus, string> = {
  researching: 'Researching',
  designing: 'Designing',
  printing: 'Printing',
  marketing: 'Marketing',
  selling: 'Selling',
  paused: 'Paused',
  retired: 'Retired',
};

export function ProductStatusBadge({
  status,
  label,
  size = 'md',
  className,
}: ProductStatusBadgeProps) {
  const statusClasses = getProductStatusClasses(status);
  const displayLabel = label ?? PRODUCT_LABELS[status];
  const colors = PRODUCT_STATUS_COLORS[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        statusClasses,
        SIZE_CLASSES[size],
        className
      )}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: colors.fill }}
      />
      {displayLabel}
    </span>
  );
}

// Simple status dot
interface StatusDotProps {
  color: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusDot({ color, pulse = false, size = 'md', className }: StatusDotProps) {
  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  return (
    <span className={cn('relative flex', dotSizes[size], className)}>
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className={cn('relative inline-flex rounded-full', dotSizes[size])}
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
