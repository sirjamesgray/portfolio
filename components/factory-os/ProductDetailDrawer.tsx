// @ts-nocheck
'use client';

import { X, ExternalLink, DollarSign, TrendingUp, Package, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductOpportunity, PrintJob, MarketingCampaign, Sale } from '@/lib/factory-os/types';
import { Product3DRender } from './Product3DRender';
import { ProductStatusBadge } from './StatusBadge';
import { getProfitMarginColor, MARKETPLACE_COLORS, PLATFORM_COLORS } from '@/lib/factory-os/colors';

interface ProductDetailDrawerProps {
  product: ProductOpportunity | null;
  printJobs?: PrintJob[];
  campaigns?: MarketingCampaign[];
  sales?: Sale[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailDrawer({
  product,
  printJobs = [],
  campaigns = [],
  sales = [],
  isOpen,
  onClose,
}: ProductDetailDrawerProps) {
  if (!product) return null;

  const productPrintJobs = printJobs.filter(j => j.productId === product.id);
  const productCampaigns = campaigns.filter(c => c.productId === product.id);
  const productSales = sales.filter(s => s.productId === product.id);

  const totalRevenue = productSales.reduce((sum, s) => sum + s.revenue, 0);
  const totalProfit = productSales.reduce((sum, s) => sum + s.profit, 0);

  const marketplaceColor = MARKETPLACE_COLORS[product.sourceMarketplace] || '#71717a';

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 transform transition-transform duration-300 ease-out overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Product Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Product Header with 3D Render */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Product3DRender
                productName={product.name}
                category={product.category}
                size="lg"
                animate={true}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-foreground/5 rounded-full blur-sm" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <div className="mt-2">
              <ProductStatusBadge status={product.status} />
            </div>
          </div>

          {/* Source Info */}
          <div className="flex items-center justify-center gap-3">
            <span
              className="px-2 py-1 rounded text-xs font-medium capitalize"
              style={{ backgroundColor: `${marketplaceColor}20`, color: marketplaceColor }}
            >
              {product.sourceMarketplace}
            </span>
            <span className="text-sm text-muted-foreground">
              Source: <span className="text-foreground font-mono">${product.sourcePrice.toFixed(2)}</span>
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
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
              label="Demand Score"
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

          {/* Revenue Summary (if selling) */}
          {product.status === 'selling' && (
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Revenue Summary</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-mono font-bold text-green-500">${totalRevenue.toFixed(0)}</p>
                  <p className="text-[10px] text-muted-foreground">Revenue</p>
                </div>
                <div>
                  <p className="text-lg font-mono font-bold text-blue-500">${totalProfit.toFixed(0)}</p>
                  <p className="text-[10px] text-muted-foreground">Profit</p>
                </div>
                <div>
                  <p className="text-lg font-mono font-bold text-foreground">{productSales.length}</p>
                  <p className="text-[10px] text-muted-foreground">Sold</p>
                </div>
              </div>
            </div>
          )}

          {/* Print Jobs */}
          {productPrintJobs.length > 0 && (
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Print Jobs</h4>
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
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Marketing Campaigns</h4>
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
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Sales</h4>
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
      </div>
    </>
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
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-mono font-semibold text-foreground">{value}</p>
    </div>
  );
}
