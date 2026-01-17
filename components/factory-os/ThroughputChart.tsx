// @ts-nocheck
'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TimeSeriesPoint } from '@/lib/factory-os/types';
import { CHART_COLORS } from '@/lib/factory-os/colors';

interface ThroughputChartProps {
  data: TimeSeriesPoint[];
  targetValue?: number;
  height?: number;
  showTarget?: boolean;
  color?: string;
  className?: string;
}

export function ThroughputChart({
  data,
  targetValue,
  height = 200,
  showTarget = true,
  color = CHART_COLORS.primary,
  className,
}: ThroughputChartProps) {
  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      index,
      value: point.value,
      time: new Date(point.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    }));
  }, [data]);

  if (data.length < 2) {
    return (
      <div
        className={`flex items-center justify-center text-zinc-500 text-sm ${className}`}
        style={{ height }}
      >
        Collecting data...
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
            vertical={false}
          />
          <XAxis
            dataKey="index"
            tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_COLORS.tooltip,
              border: '1px solid #27272a',
              borderRadius: '6px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#a1a1aa', fontSize: 11 }}
            itemStyle={{ color: '#f4f4f5', fontSize: 12 }}
            formatter={(value: number) => [`${value.toFixed(1)} units/hr`, 'Throughput']}
            labelFormatter={(index: number) => chartData[index]?.time || ''}
          />
          {showTarget && targetValue && (
            <ReferenceLine
              y={targetValue}
              stroke={CHART_COLORS.quaternary}
              strokeDasharray="5 5"
              label={{
                value: 'Target',
                fill: CHART_COLORS.quaternary,
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: CHART_COLORS.tooltip }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Stacked chart for comparing multiple lines
interface StackedThroughputChartProps {
  lines: {
    name: string;
    data: TimeSeriesPoint[];
    color: string;
  }[];
  height?: number;
  className?: string;
}

export function StackedThroughputChart({
  lines,
  height = 250,
  className,
}: StackedThroughputChartProps) {
  const chartData = useMemo(() => {
    const maxLength = Math.max(...lines.map(l => l.data.length));
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const point: Record<string, number | string> = { index: i };
      let hasData = false;

      for (const line of lines) {
        if (line.data[i]) {
          point[line.name] = line.data[i].value;
          hasData = true;
        }
      }

      if (hasData) result.push(point);
    }

    return result;
  }, [lines]);

  if (chartData.length < 2) {
    return (
      <div
        className={`flex items-center justify-center text-zinc-500 text-sm ${className}`}
        style={{ height }}
      >
        Collecting data...
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
            vertical={false}
          />
          <XAxis
            dataKey="index"
            tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_COLORS.tooltip,
              border: '1px solid #27272a',
              borderRadius: '6px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#a1a1aa', fontSize: 11 }}
            itemStyle={{ fontSize: 12 }}
            formatter={(value: number) => `${value.toFixed(1)} units/hr`}
          />
          {lines.map((line) => (
            <Line
              key={line.name}
              type="monotone"
              dataKey={line.name}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: line.color, stroke: CHART_COLORS.tooltip }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
