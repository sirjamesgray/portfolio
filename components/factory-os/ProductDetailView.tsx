// @ts-nocheck
'use client';

import { ArrowLeft, ExternalLink, DollarSign, TrendingUp, Package, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductOpportunity, PrintJob, MarketingCampaign, Sale } from '@/lib/factory-os/types';
import { Product3DRender } from './Product3DRender';
import { ProductStatusBadge } from './StatusBadge';
import { getProfitMarginColor, MARKETPLACE_COLORS, PLATFORM_COLORS } from '@/lib/factory-os/colors';

interface ProductDetailViewProps {
  product: ProductOpportunity;
  printJobs?: PrintJob[];
  campaigns?: MarketingCampaign[];
  sales?: Sale[];
  onBack?: () => void;
  className?: string;
}

export function ProductDetailView({
  product,
  printJobs = [],
  campaigns = [],
  sales = [],
  onBack,
  className,
}: ProductDetailViewProps) {
  const productPrintJobs = printJobs.filter(j => j.productId === product.id);
  const productCampaigns = campaigns.filter(c => c.productId === product.id);
  const productSales = sales.filter(s => s.productId === product.id);

  const totalRevenue = productSales.reduce((sum, s) => sum + s.revenue, 0);
  const totalProfit = productSales.reduce((sum, s) => sum + s.profit, 0);

  const marketplaceColor = MARKETPLACE_COLORS[product.sourceMarketplace] || '#71717a';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </button>
      )}

      {/* Product Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 3D Render */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative">
              <Product3DRender
                productName={product.name}
                category={product.category}
                size="lg"
                animate={true}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-foreground/5 rounded-full blur-sm" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <ProductStatusBadge status={product.status} />
            </div>

            {/* Source Info */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-2 py-1 rounded text-xs font-medium capitalize"
                style={{ backgroundColor: `${marketplaceColor}20`, color: marketplaceColor }}
              >
                {product.sourceMarketplace}
              </span>
              <span className="text-sm text-muted-foreground">
                Source price: <span className="text-foreground font-mono">${product.sourcePrice.toFixed(2)}</span>
              </span>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox
                icon={DollarSign}
                label="Est. Cost"
                value={`$${product.estimatedCost.toFixed(2)}`}
                color="#f97316"
              />
              <MetricBox
                icon={TrendingUp}
                label="Profit Margin"
                value={`${product.profitMargin.toFixed(0)}%`}
                color={getProfitMarginColor(product.profitMargin)}
              />
              <MetricBox
                icon={Tag}
                label="Demand"
                value={product.demandScore.toString()}
                color="#3b82f6"
              />
              <MetricBox
                icon={Package}
                label="Competition"
                value={product.competitionScore.toString()}
                color={product.competitionScore < 50 ? '#22c55e' : '#ef4444'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Summary (if selling) */}
      {product.status === 'selling' && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Revenue Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-mono font-bold text-green-500">${totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-blue-500">${totalProfit.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Profit</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-foreground">{productSales.length}</p>
              <p className="text-xs text-muted-foreground">Units Sold</p>
            </div>
          </div>
        </div>
      )}

      {/* Print Jobs */}
      {productPrintJobs.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Print Jobs</h3>
          <div className="space-y-2">
            {productPrintJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                <div>
                  <p className="text-sm text-foreground">{job.printerName || 'Queued'}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.materialType} • {job.materialGrams}g
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-foreground">{job.progress.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground capitalize">{job.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns */}
      {productCampaigns.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Marketing Campaigns</h3>
          <div className="space-y-2">
            {productCampaigns.map((campaign) => {
              const platformColor = PLATFORM_COLORS[campaign.platform] || '#71717a';
              return (
                <div key={campaign.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
                      style={{ backgroundColor: `${platformColor}20`, color: platformColor }}
                    >
                      {campaign.platform}
                    </span>
                    <span className="text-sm text-foreground">${campaign.price.toFixed(0)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-green-500">${campaign.revenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{campaign.conversions} sales</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Sales */}
      {productSales.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Sales</h3>
          <div className="space-y-2">
            {productSales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                <div>
                  <p className="text-sm text-foreground">{sale.quantity}x @ ${(sale.revenue / sale.quantity).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground capitalize">{sale.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-green-500">+${sale.profit.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">profit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Small metric box
function MetricBox({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-md bg-muted/50 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-mono font-semibold text-foreground">{value}</p>
    </div>
  );
}
