// @ts-nocheck
'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { cn } from '@/lib/utils';
import { DailyDataPoint, TimeSeriesPoint } from '@/lib/factory-os/types';

interface RevenueChartProps {
  dailyHistory: DailyDataPoint[];
  className?: string;
}

export function RevenueChart({
  dailyHistory,
  className,
}: RevenueChartProps) {
  const data = useMemo(() => {
    return dailyHistory.map(d => ({
      date: d.date,
      displayDate: formatDate(d.date),
      revenue: d.revenue,
      profit: d.profit,
      // Costs shown as negative (below zero line)
      cost: -d.cost,
    }));
  }, [dailyHistory]);

  if (data.length < 2) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-muted-foreground text-sm', className)}>
        Collecting data...
      </div>
    );
  }

  // Calculate domain for Y axis with nice intervals
  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.profit)));
  const minValue = Math.min(...data.map(d => d.cost));

  // Round to nice intervals
  const yMax = Math.ceil(maxValue / 100) * 100;
  const yMin = Math.floor(minValue / 50) * 50;

  // Generate tick values
  const generateTicks = (min: number, max: number, count: number = 5) => {
    const range = max - min;
    const step = Math.ceil(range / count / 50) * 50;
    const ticks: number[] = [];
    for (let i = min; i <= max; i += step) {
      ticks.push(i);
    }
    // Ensure 0 is included
    if (!ticks.includes(0) && min < 0 && max > 0) {
      ticks.push(0);
      ticks.sort((a, b) => a - b);
    }
    return ticks;
  };

  const yTicks = generateTicks(yMin, yMax);

  return (
    <div className={cn('h-64', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="costGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="displayDate"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            interval="preserveStartEnd"
            tickCount={7}
            angle={-45}
            textAnchor="end"
            height={40}
          />
          <YAxis
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickFormatter={(value) => value >= 0 ? `$${value}` : `-$${Math.abs(value)}`}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            width={55}
            domain={[yMin, yMax]}
            ticks={yTicks}
          />
          {/* Zero reference line - prominent */}
          <ReferenceLine
            y={0}
            stroke="hsl(var(--foreground))"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'hsl(var(--foreground))',
            }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
            formatter={(value: number, name: string) => {
              const absValue = Math.abs(value);
              const prefix = value < 0 ? '-' : '';
              return [
                `${prefix}$${absValue.toFixed(2)}`,
                name === 'cost' ? 'Costs' : name.charAt(0).toUpperCase() + name.slice(1),
              ];
            }}
            labelFormatter={(label) => label}
          />
          {/* Revenue area (positive, above zero) */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            animationDuration={500}
          />
          {/* Profit area (positive, above zero) */}
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#profitGradient)"
            animationDuration={500}
          />
          {/* Costs area (negative, below zero) */}
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#costGradient)"
            animationDuration={500}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 text-xs mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-green-500 rounded" />
          <span className="text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-blue-500 rounded" />
          <span className="text-muted-foreground">Profit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-red-500 rounded" />
          <span className="text-muted-foreground">Costs (below $0)</span>
        </div>
      </div>
    </div>
  );
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Compact sparkline version
interface RevenueSparklineProps {
  history: TimeSeriesPoint[];
  color?: string;
  className?: string;
}

export function RevenueSparkline({ history, color = '#22c55e', className }: RevenueSparklineProps) {
  const data = useMemo(() => history.map((p, i) => ({ x: i, y: p.value })), [history]);

  if (data.length < 2) return null;

  return (
    <div className={cn('h-8', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparklineGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sparklineGradient-${color.replace('#', '')})`}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
