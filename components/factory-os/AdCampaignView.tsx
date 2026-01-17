// @ts-nocheck
'use client';

import { Megaphone, DollarSign, TrendingUp, Pause, Play, Plus, Target, Eye, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketingCampaign, AdBudget } from '@/lib/factory-os/types';
import { PLATFORM_COLORS } from '@/lib/factory-os/colors';

interface AdCampaignViewProps {
  campaigns: MarketingCampaign[];
  adBudgets: AdBudget[];
  totalAdSpend: number;
  className?: string;
}

export function AdCampaignView({ campaigns, adBudgets, totalAdSpend, className }: AdCampaignViewProps) {
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalROI = activeCampaigns.length > 0
    ? activeCampaigns.reduce((sum, c) => sum + c.roi, 0) / activeCampaigns.length
    : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Ad Spend Summary */}
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Ad Spend</h3>
          <span className="text-lg font-mono font-semibold text-pink-400">
            -${totalAdSpend.toFixed(2)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Active campaigns</span>
            <p className="text-foreground font-medium">{activeCampaigns.length}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Avg ROI</span>
            <p className={cn(
              'font-medium',
              totalROI >= 100 ? 'text-green-400' :
              totalROI >= 0 ? 'text-yellow-400' : 'text-red-400'
            )}>
              {totalROI.toFixed(0)}%
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Total revenue</span>
            <p className="text-green-400 font-medium">
              ${campaigns.reduce((sum, c) => sum + c.revenue, 0).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Active Campaigns</h3>
        <div className="space-y-3">
          {activeCampaigns.map((campaign) => {
            const budget = adBudgets.find(b => b.campaignId === campaign.id);
            return (
              <CampaignControlCard
                key={campaign.id}
                campaign={campaign}
                budget={budget}
              />
            );
          })}
        </div>
        {activeCampaigns.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No active campaigns</p>
        )}
      </div>

      {/* Create Campaign Button */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-muted/30 transition-colors">
        <Plus className="h-4 w-4" />
        <span className="text-sm">Create Campaign</span>
      </button>
    </div>
  );
}

// Campaign control card with budget controls
interface CampaignControlCardProps {
  campaign: MarketingCampaign;
  budget?: AdBudget;
}

function CampaignControlCard({ campaign, budget }: CampaignControlCardProps) {
  const platformColor = PLATFORM_COLORS[campaign.platform] || '#71717a';
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  const cvr = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground truncate">{campaign.productName}</p>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
              style={{ backgroundColor: `${platformColor}20`, color: platformColor }}
            >
              {campaign.platform}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{campaign.listingTitle}</p>
        </div>
        {/* Toggle button */}
        <button
          className={cn(
            'p-1.5 rounded-md transition-colors',
            campaign.status === 'active'
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
        <div className="text-center p-2 rounded-md bg-muted/50">
          <Eye className="h-3 w-3 mx-auto text-muted-foreground mb-1" />
          <p className="font-mono font-semibold text-foreground">{formatNumber(campaign.impressions)}</p>
          <span className="text-[10px] text-muted-foreground">views</span>
        </div>
        <div className="text-center p-2 rounded-md bg-muted/50">
          <MousePointer className="h-3 w-3 mx-auto text-muted-foreground mb-1" />
          <p className="font-mono font-semibold text-foreground">{ctr.toFixed(1)}%</p>
          <span className="text-[10px] text-muted-foreground">CTR</span>
        </div>
        <div className="text-center p-2 rounded-md bg-muted/50">
          <Target className="h-3 w-3 mx-auto text-muted-foreground mb-1" />
          <p className="font-mono font-semibold text-green-400">{campaign.conversions}</p>
          <span className="text-[10px] text-muted-foreground">sales</span>
        </div>
        <div className="text-center p-2 rounded-md bg-muted/50">
          <TrendingUp className="h-3 w-3 mx-auto text-muted-foreground mb-1" />
          <p className={cn(
            'font-mono font-semibold',
            campaign.roi >= 100 ? 'text-green-400' :
            campaign.roi >= 0 ? 'text-yellow-400' : 'text-red-400'
          )}>
            {campaign.roi.toFixed(0)}%
          </p>
          <span className="text-[10px] text-muted-foreground">ROI</span>
        </div>
      </div>

      {/* Budget controls */}
      {budget && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Daily budget</span>
            <div className="flex items-center gap-2">
              <button className="w-6 h-6 rounded bg-muted hover:bg-muted/80 text-muted-foreground flex items-center justify-center">
                -
              </button>
              <span className="font-mono text-foreground">${budget.dailyBudget.toFixed(0)}</span>
              <button className="w-6 h-6 rounded bg-muted hover:bg-muted/80 text-muted-foreground flex items-center justify-center">
                +
              </button>
            </div>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 rounded-full"
              style={{ width: `${Math.min(100, (budget.spent / budget.totalBudget) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
            <span>${budget.spent.toFixed(0)} spent</span>
            <span>${budget.totalBudget.toFixed(0)} budget</span>
          </div>
        </div>
      )}

      {/* Revenue */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm">
        <span className="text-muted-foreground">Revenue</span>
        <span className="font-mono font-semibold text-green-400">${campaign.revenue.toFixed(2)}</span>
      </div>
    </div>
  );
}

// Helper function
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Mini ad spend display
interface AdSpendMiniProps {
  totalAdSpend: number;
  activeCampaigns: number;
  className?: string;
}

export function AdSpendMini({ totalAdSpend, activeCampaigns, className }: AdSpendMiniProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Megaphone className="h-4 w-4 text-pink-400" />
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/80">{activeCampaigns} active</span>
          <span className="text-pink-400 font-mono">-${totalAdSpend.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
