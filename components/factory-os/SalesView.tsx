// @ts-nocheck
'use client';

import { DollarSign, TrendingUp, Eye, MousePointer, ShoppingCart, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketingCampaign, Sale } from '@/lib/factory-os/types';
import { PLATFORM_COLORS, CHART_COLORS } from '@/lib/factory-os/colors';

interface SalesViewProps {
  campaigns: MarketingCampaign[];
  sales: Sale[];
  className?: string;
}

export function SalesView({ campaigns, sales, className }: SalesViewProps) {
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCVR = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Eye}
          label="Impressions"
          value={formatNumber(totalImpressions)}
          color={CHART_COLORS.impressions}
        />
        <StatCard
          icon={MousePointer}
          label="CTR"
          value={`${avgCTR.toFixed(1)}%`}
          color="#3b82f6"
        />
        <StatCard
          icon={ShoppingCart}
          label="Conversions"
          value={totalConversions.toString()}
          subValue={`${avgCVR.toFixed(1)}% CVR`}
          color={CHART_COLORS.conversions}
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={`$${totalRevenue.toFixed(0)}`}
          color={CHART_COLORS.revenue}
        />
      </div>

      {/* Active Campaigns */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Active Campaigns ({activeCampaigns.length})
        </h3>
        <div className="space-y-3">
          {activeCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        {activeCampaigns.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No active campaigns</p>
        )}
      </div>

      {/* Recent Sales */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Recent Sales ({sales.length})
        </h3>
        <div className="space-y-2">
          {sales.slice(0, 10).map((sale) => (
            <SaleRow key={sale.id} sale={sale} />
          ))}
        </div>
        {sales.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No sales yet</p>
        )}
      </div>
    </div>
  );
}

// Stat card component
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, subValue, color }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-mono font-semibold text-foreground">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
    </div>
  );
}

// Campaign card
interface CampaignCardProps {
  campaign: MarketingCampaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const platformColor = PLATFORM_COLORS[campaign.platform] || '#71717a';
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  const cvr = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{campaign.productName}</p>
          <p className="text-xs text-muted-foreground truncate">{campaign.listingTitle}</p>
        </div>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium capitalize ml-2"
          style={{ backgroundColor: `${platformColor}20`, color: platformColor }}
        >
          {campaign.platform}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-4 text-xs">
        <div>
          <span className="text-muted-foreground">Price</span>
          <p className="font-mono font-semibold text-foreground">${campaign.price.toFixed(0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Impressions</span>
          <p className="font-mono font-semibold text-foreground">{formatNumber(campaign.impressions)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">CTR</span>
          <p className="font-mono font-semibold text-foreground">{ctr.toFixed(1)}%</p>
        </div>
        <div>
          <span className="text-muted-foreground">Sales</span>
          <p className="font-mono font-semibold text-green-400">{campaign.conversions}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Revenue</span>
          <p className="font-mono font-semibold text-green-400">${campaign.revenue.toFixed(0)}</p>
        </div>
      </div>

      {/* ROI */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">ROI</span>
        <span className={cn(
          'text-sm font-mono font-semibold',
          campaign.roi >= 100 ? 'text-green-400' :
          campaign.roi >= 0 ? 'text-yellow-400' : 'text-red-400'
        )}>
          {campaign.roi.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

// Sale row
interface SaleRowProps {
  sale: Sale;
}

function SaleRow({ sale }: SaleRowProps) {
  const platformColor = PLATFORM_COLORS[sale.platform] || '#71717a';
  const statusConfig = {
    pending: { icon: Package, color: '#eab308', label: 'Pending' },
    shipped: { icon: Truck, color: '#3b82f6', label: 'Shipped' },
    delivered: { icon: CheckCircle, color: '#22c55e', label: 'Delivered' },
    refunded: { icon: XCircle, color: '#ef4444', label: 'Refunded' },
  };
  const status = statusConfig[sale.status];
  const StatusIcon = status.icon;

  const timeAgo = formatTimeAgo(sale.orderedAt);

  return (
    <div className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ backgroundColor: `${platformColor}20` }}
        >
          <span className="text-xs font-medium" style={{ color: platformColor }}>
            {sale.platform.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm text-foreground">{sale.productName}</p>
          <p className="text-xs text-muted-foreground">
            {sale.quantity}x • {timeAgo}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-mono text-green-400">${sale.revenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">+${sale.profit.toFixed(2)} profit</p>
        </div>
        <div className="flex items-center gap-1" style={{ color: status.color }}>
          <StatusIcon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Compact revenue display
interface RevenueMiniProps {
  revenue: number;
  profit: number;
  className?: string;
}

export function RevenueMini({ revenue, profit, className }: RevenueMiniProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div>
        <span className="text-xs text-muted-foreground">Revenue</span>
        <p className="text-lg font-mono font-semibold text-green-400">${revenue.toFixed(0)}</p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Profit</span>
        <p className="text-lg font-mono font-semibold text-blue-400">${profit.toFixed(0)}</p>
      </div>
    </div>
  );
}
