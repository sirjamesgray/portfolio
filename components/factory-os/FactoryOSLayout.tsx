// @ts-nocheck
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FactoryOSLayoutProps {
  nav: ReactNode;
  header: ReactNode;
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export function FactoryOSLayout({
  nav,
  header,
  children,
  sidebar,
  className,
}: FactoryOSLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-zinc-950 text-zinc-100', className)}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1600px] px-6">
          {/* Navigation breadcrumbs */}
          <div className="border-b border-zinc-800/50 py-2">
            {nav}
          </div>
          {/* Header with title and controls */}
          {header}
        </div>
      </div>

      {/* Main content area */}
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <div className={cn('flex gap-6', sidebar && 'justify-between')}>
          {/* Main content */}
          <main className={cn('flex-1', sidebar && 'max-w-[calc(100%-320px)]')}>
            {children}
          </main>

          {/* Optional sidebar */}
          {sidebar && (
            <aside className="w-[300px] flex-shrink-0">
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

// Card component for consistent styling
interface FactoryCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function FactoryCard({ children, className, onClick, interactive = false }: FactoryCardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'rounded-lg border border-zinc-800 bg-zinc-900/50 p-4',
        interactive && 'hover:border-zinc-700 hover:bg-zinc-900 transition-colors cursor-pointer',
        onClick && 'w-full text-left',
        className
      )}
    >
      {children}
    </Component>
  );
}

// Section header component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Metric display component
interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function Metric({ label, value, unit, trend, className }: MetricProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-zinc-100 font-mono tabular-nums">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        {unit && <span className="text-sm text-zinc-500">{unit}</span>}
        {trend && (
          <span className={cn(
            'text-xs ml-1',
            trend === 'up' && 'text-green-400',
            trend === 'down' && 'text-red-400',
            trend === 'stable' && 'text-zinc-500'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
}

// Grid layout helpers
export function MetricGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  );
}

export function CardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  );
}
