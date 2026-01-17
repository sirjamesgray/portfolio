// @ts-nocheck
'use client';

import { useMemo } from 'react';
import { Package, AlertTriangle, Truck, Plus, ShoppingCart, TrendingDown, Calendar } from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';
import { MaterialInventory, MaterialOrder } from '@/lib/factory-os/types';

interface MaterialsViewProps {
  materials: MaterialInventory[];
  orders: MaterialOrder[];
  totalMaterialCost: number;
  materialUsageHistory?: { date: string; type: string; gramsUsed: number }[];
  className?: string;
}

// Calculate days until material runs out based on recent usage
function calculateDaysUntilEmpty(
  material: MaterialInventory,
  usageHistory: { date: string; type: string; gramsUsed: number }[]
): number | null {
  const materialUsage = usageHistory.filter(u => u.type === material.type);
  if (materialUsage.length < 7) return null; // Need at least a week of data

  // Calculate average daily usage from last 14 days
  const last14Days = materialUsage.slice(-14);
  const totalUsed = last14Days.reduce((sum, u) => sum + u.gramsUsed, 0);
  const avgDailyUsage = totalUsed / 14;

  if (avgDailyUsage <= 0) return null;

  return Math.floor(material.gramsRemaining / avgDailyUsage);
}

// Generate burndown projection data
function generateBurndownData(
  materials: MaterialInventory[],
  usageHistory: { date: string; type: string; gramsUsed: number }[]
): { date: string; displayDate: string; remaining: number; projected: number }[] {
  // Aggregate total inventory
  const totalRemaining = materials.reduce((sum, m) => sum + m.gramsRemaining, 0);

  // Get last 30 days of actual usage
  const last30Days = usageHistory.slice(-30);
  const dailyTotals = new Map<string, number>();
  last30Days.forEach(u => {
    dailyTotals.set(u.date, (dailyTotals.get(u.date) || 0) + u.gramsUsed);
  });

  // Calculate average daily consumption
  const avgDaily = last30Days.length > 0
    ? last30Days.reduce((sum, u) => sum + u.gramsUsed, 0) / Math.min(30, new Set(last30Days.map(u => u.date)).size)
    : 50;

  const data: { date: string; displayDate: string; remaining: number; projected: number }[] = [];

  // Historical data (running total backwards)
  let runningTotal = totalRemaining;
  const sortedDates = Array.from(dailyTotals.keys()).sort().reverse();
  const historicalData: typeof data = [];

  sortedDates.forEach(date => {
    const usage = dailyTotals.get(date) || 0;
    runningTotal += usage; // Add back what was used
    const d = new Date(date);
    historicalData.unshift({
      date,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      remaining: runningTotal,
      projected: 0,
    });
  });

  data.push(...historicalData);

  // Current day
  const today = new Date();
  data.push({
    date: today.toISOString().split('T')[0],
    displayDate: 'Today',
    remaining: totalRemaining,
    projected: totalRemaining,
  });

  // Future projection (next 30 days)
  let projectedRemaining = totalRemaining;
  for (let i = 1; i <= 30; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    projectedRemaining = Math.max(0, projectedRemaining - avgDaily);
    data.push({
      date: futureDate.toISOString().split('T')[0],
      displayDate: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      remaining: 0,
      projected: projectedRemaining,
    });
  }

  return data;
}

export function MaterialsView({ materials, orders, totalMaterialCost, materialUsageHistory = [], className }: MaterialsViewProps) {
  const lowStockMaterials = materials.filter(m => m.gramsRemaining < m.reorderThreshold);
  const pendingOrders = orders.filter(o => o.status !== 'delivered');

  // Calculate restock predictions for each material
  const restockPredictions = useMemo(() => {
    return materials.map(m => ({
      material: m,
      daysUntilEmpty: calculateDaysUntilEmpty(m, materialUsageHistory),
    })).filter(p => p.daysUntilEmpty !== null && p.daysUntilEmpty < 30)
      .sort((a, b) => (a.daysUntilEmpty || 999) - (b.daysUntilEmpty || 999));
  }, [materials, materialUsageHistory]);

  // Generate burndown chart data
  const burndownData = useMemo(() => {
    return generateBurndownData(materials, materialUsageHistory);
  }, [materials, materialUsageHistory]);

  // Find the reorder threshold line (aggregate of all materials)
  const totalReorderThreshold = materials.reduce((sum, m) => sum + m.reorderThreshold, 0);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Cost Summary */}
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Input Costs</h3>
          <span className="text-lg font-mono font-semibold text-red-400">
            -${totalMaterialCost.toFixed(2)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Spools in stock</span>
            <p className="text-foreground font-medium">{materials.length}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Low stock alerts</span>
            <p className={cn('font-medium', lowStockMaterials.length > 0 ? 'text-orange-400' : 'text-green-400')}>
              {lowStockMaterials.length}
            </p>
          </div>
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Material Burndown
          </h3>
          <span className="text-xs text-muted-foreground">30-day projection</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={burndownData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="remainingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="displayDate"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                height={40}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}kg`}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value, name) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  return [
                    `${(numValue / 1000).toFixed(2)}kg`,
                    name === 'remaining' ? 'Actual' : 'Projected'
                  ];
                }}
              />
              {/* Reorder threshold line */}
              <ReferenceLine
                y={totalReorderThreshold}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{ value: 'Reorder', position: 'right', fill: '#ef4444', fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="remaining"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#remainingGradient)"
                animationDuration={500}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#projectedGradient)"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-green-500 rounded" />
            <span className="text-muted-foreground">Historical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-orange-500 rounded" style={{ background: 'repeating-linear-gradient(90deg, #f97316 0, #f97316 4px, transparent 4px, transparent 8px)' }} />
            <span className="text-muted-foreground">Projected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-red-500 rounded" style={{ background: 'repeating-linear-gradient(90deg, #ef4444 0, #ef4444 4px, transparent 4px, transparent 8px)' }} />
            <span className="text-muted-foreground">Reorder Line</span>
          </div>
        </div>
      </div>

      {/* Restock Predictions */}
      {restockPredictions.length > 0 && (
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
          <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Restock Needed Soon
          </h3>
          <div className="space-y-2">
            {restockPredictions.slice(0, 3).map((pred, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {pred.material.type} {pred.material.color}
                </span>
                <span className={cn(
                  'font-mono',
                  pred.daysUntilEmpty! < 7 ? 'text-red-400' : 'text-orange-400'
                )}>
                  {pred.daysUntilEmpty} days
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Material Inventory */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Filament Inventory</h3>
        <div className="space-y-2">
          {materials.map((material, index) => (
            <MaterialCard key={index} material={material} />
          ))}
        </div>
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Incoming Orders ({pendingOrders.length})
          </h3>
          <div className="space-y-2">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Order Button */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-muted/30 transition-colors">
        <ShoppingCart className="h-4 w-4" />
        <span className="text-sm">Order Materials</span>
      </button>
    </div>
  );
}

// Single material card
function MaterialCard({ material }: { material: MaterialInventory }) {
  const percentRemaining = (material.gramsRemaining / material.gramsTotal) * 100;
  const isLow = material.gramsRemaining < material.reorderThreshold;

  const colorMap: Record<string, string> = {
    White: '#f4f4f5',
    Black: '#27272a',
    Gray: '#71717a',
    Natural: '#d4d4d8',
    Blue: '#3b82f6',
    Green: '#22c55e',
    Red: '#ef4444',
  };

  return (
    <div className={cn(
      'rounded-lg border bg-card/50 p-3',
      isLow ? 'border-orange-500/50' : 'border-border'
    )}>
      <div className="flex items-center gap-3">
        {/* Color swatch */}
        <div
          className="w-8 h-8 rounded-md border border-border flex-shrink-0"
          style={{ backgroundColor: colorMap[material.color] || '#71717a' }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {material.type} {material.color}
            </span>
            {isLow && (
              <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{material.gramsRemaining}g / {material.gramsTotal}g</span>
            <span>•</span>
            <span>${material.costPerKg}/kg</span>
          </div>
        </div>

        {/* Usage bar */}
        <div className="w-16 flex-shrink-0">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isLow ? 'bg-orange-400' : 'bg-green-400'
              )}
              style={{ width: `${percentRemaining}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-right mt-0.5">
            {percentRemaining.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// Order card
function OrderCard({ order }: { order: MaterialOrder }) {
  const daysUntilDelivery = Math.ceil((order.estimatedDelivery - Date.now()) / (24 * 60 * 60 * 1000));

  return (
    <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
      <div className="flex items-center gap-3">
        <Package className="h-4 w-4 text-blue-400" />
        <div>
          <p className="text-sm text-foreground">
            {order.materialType} {order.color} • {order.quantity}g
          </p>
          <p className="text-xs text-muted-foreground">
            {order.status === 'shipped' ? `Arrives in ${daysUntilDelivery}d` : 'Processing'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono text-foreground/80">${order.cost.toFixed(2)}</p>
        <p className={cn(
          'text-xs capitalize',
          order.status === 'shipped' ? 'text-blue-400' : 'text-yellow-400'
        )}>
          {order.status}
        </p>
      </div>
    </div>
  );
}

// Compact materials mini view
interface MaterialsMiniProps {
  materials: MaterialInventory[];
  className?: string;
}

export function MaterialsMini({ materials, className }: MaterialsMiniProps) {
  const lowStock = materials.filter(m => m.gramsRemaining < m.reorderThreshold).length;
  const totalGrams = materials.reduce((sum, m) => sum + m.gramsRemaining, 0);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Package className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/80">{(totalGrams / 1000).toFixed(1)}kg total</span>
          {lowStock > 0 && (
            <span className="flex items-center gap-1 text-orange-400">
              <AlertTriangle className="h-3 w-3" />
              {lowStock} low
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
