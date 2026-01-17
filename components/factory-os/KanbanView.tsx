// @ts-nocheck
'use client';

import { Search, Palette, Printer, Megaphone, DollarSign, TrendingUp, Package, Target, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductOpportunity, PrintJob, MarketingCampaign, Sale, MaterialInventory } from '@/lib/factory-os/types';
import { Product3DRender } from './Product3DRender';
import { PIPELINE_COLORS, getProfitMarginColor, MARKETPLACE_COLORS } from '@/lib/factory-os/colors';

interface KanbanViewProps {
  opportunities: ProductOpportunity[];
  printJobs?: PrintJob[];
  campaigns?: MarketingCampaign[];
  sales?: Sale[];
  materials?: MaterialInventory[];
  onProductClick?: (productId: string) => void;
  className?: string;
}

const KANBAN_COLUMNS = [
  { id: 'researching', label: 'Research', icon: Search, color: PIPELINE_COLORS.research, statuses: ['researching'] as const },
  { id: 'designing', label: 'Design', icon: Palette, color: PIPELINE_COLORS.design, statuses: ['designing'] as const },
  { id: 'printing', label: 'Print', icon: Printer, color: PIPELINE_COLORS.print, statuses: ['printing'] as const },
  { id: 'marketing', label: 'Market', icon: Megaphone, color: PIPELINE_COLORS.market, statuses: ['marketing'] as const },
  { id: 'selling', label: 'Selling', icon: DollarSign, color: PIPELINE_COLORS.sales, statuses: ['selling'] as const },
];

export function KanbanView({
  opportunities,
  printJobs = [],
  campaigns = [],
  sales = [],
  materials = [],
  onProductClick,
  className
}: KanbanViewProps) {
  // Calculate KPIs for each column
  const getColumnKPIs = (columnId: string, items: ProductOpportunity[]) => {
    switch (columnId) {
      case 'researching': {
        const avgDemand = items.length > 0
          ? Math.round(items.reduce((sum, i) => sum + i.demandScore, 0) / items.length)
          : 0;
        const avgMargin = items.length > 0
          ? Math.round(items.reduce((sum, i) => sum + i.profitMargin, 0) / items.length)
          : 0;
        return { primary: `${avgMargin}% avg margin`, secondary: `${avgDemand} demand` };
      }
      case 'designing': {
        const avgMargin = items.length > 0
          ? Math.round(items.reduce((sum, i) => sum + i.profitMargin, 0) / items.length)
          : 0;
        return { primary: `${avgMargin}% avg margin`, secondary: null };
      }
      case 'printing': {
        const activePrints = printJobs.filter(j => j.status === 'printing').length;
        const totalGrams = printJobs.reduce((sum, j) => sum + j.materialGrams, 0);
        const lowStock = materials.filter(m => m.gramsRemaining < m.reorderThreshold).length;
        return {
          primary: `${activePrints} active`,
          secondary: lowStock > 0 ? `${lowStock} low stock` : `${totalGrams}g queued`
        };
      }
      case 'marketing': {
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
        const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
        return {
          primary: `${activeCampaigns} campaigns`,
          secondary: `${(totalImpressions / 1000).toFixed(1)}k impr`
        };
      }
      case 'selling': {
        const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
        const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
        return {
          primary: `$${totalRevenue.toFixed(0)} rev`,
          secondary: `$${totalProfit.toFixed(0)} profit`
        };
      }
      default:
        return { primary: null, secondary: null };
    }
  };

  return (
    <div className={cn('flex gap-3 overflow-x-auto pb-4', className)}>
      {KANBAN_COLUMNS.map((column) => {
        const Icon = column.icon;
        const items = opportunities.filter(o => (column.statuses as readonly string[]).includes(o.status));
        const kpis = getColumnKPIs(column.id, items);

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-56 rounded-lg border border-border bg-card/50"
          >
            {/* Column Header */}
            <div
              className="px-3 py-2 border-b border-border"
              style={{ borderTopColor: column.color, borderTopWidth: 2 }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: column.color }} />
                <span className="text-sm font-medium text-foreground">{column.label}</span>
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {items.length}
                </span>
              </div>
              {/* KPI Row */}
              {(kpis.primary || kpis.secondary) && (
                <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                  {kpis.primary && (
                    <span className="text-foreground/70">{kpis.primary}</span>
                  )}
                  {kpis.secondary && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <span className={cn(
                        'text-muted-foreground',
                        kpis.secondary.includes('low stock') && 'text-orange-400'
                      )}>
                        {kpis.secondary}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Column Items */}
            <div className="p-2 space-y-2">
              {items.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No items</p>
              )}
              {items.map((item) => {
                const itemPrintJobs = printJobs.filter(j => j.productId === item.id);
                const itemCampaigns = campaigns.filter(c => c.productId === item.id);
                const itemSales = sales.filter(s => s.productId === item.id);
                const itemRevenue = itemSales.reduce((sum, s) => sum + s.revenue, 0);
                const marketplaceColor = MARKETPLACE_COLORS[item.sourceMarketplace] || '#71717a';

                return (
                  <button
                    key={item.id}
                    onClick={() => onProductClick?.(item.id)}
                    className="w-full text-left rounded-md border border-border bg-background p-2.5 hover:border-primary/50 hover:bg-accent/50 transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <Product3DRender productName={item.name} category={item.category} size="sm" className="w-10 h-10" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate group-hover:text-primary">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {item.category}
                        </p>

                        {/* Detailed Stats */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5">
                          {/* Marketplace Badge */}
                          <span
                            className="px-1 py-0.5 rounded text-[9px] font-medium capitalize"
                            style={{ backgroundColor: `${marketplaceColor}20`, color: marketplaceColor }}
                          >
                            {item.sourceMarketplace}
                          </span>

                          {/* Profit Margin */}
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: getProfitMarginColor(item.profitMargin) }}
                          >
                            {item.profitMargin.toFixed(0)}%
                          </span>

                          {/* Estimated Cost */}
                          <span className="text-[10px] text-orange-400/80">
                            ${item.estimatedCost.toFixed(0)}
                          </span>
                        </div>

                        {/* Status-specific info */}
                        {column.id === 'printing' && itemPrintJobs.length > 0 && (
                          <div className="mt-1.5">
                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-400 rounded-full transition-all"
                                style={{ width: `${itemPrintJobs[0].progress}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-muted-foreground mt-0.5">
                              {itemPrintJobs[0].progress.toFixed(0)}% • {itemPrintJobs[0].materialType}
                            </p>
                          </div>
                        )}

                        {column.id === 'marketing' && itemCampaigns.length > 0 && (
                          <p className="text-[9px] text-muted-foreground mt-1">
                            {itemCampaigns[0].impressions} impr • {itemCampaigns[0].clicks} clicks
                          </p>
                        )}

                        {column.id === 'selling' && itemRevenue > 0 && (
                          <p className="text-[10px] text-green-500 font-mono mt-1">
                            ${itemRevenue.toFixed(0)} revenue
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Compact horizontal kanban for overview
interface KanbanMiniProps {
  opportunities: ProductOpportunity[];
  className?: string;
}

export function KanbanMini({ opportunities, className }: KanbanMiniProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {KANBAN_COLUMNS.map((column) => {
        const count = opportunities.filter(o => (column.statuses as readonly string[]).includes(o.status)).length;

        return (
          <div
            key={column.id}
            className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
            title={`${column.label}: ${count} items`}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                backgroundColor: column.color,
                width: count > 0 ? '100%' : '0%',
                opacity: count > 0 ? 0.6 + (count * 0.1) : 0.2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
