// @ts-nocheck
'use client';

import { TrendingUp, TrendingDown, Minus, ExternalLink, Package, Users, DollarSign, Search, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductOpportunity, TrendingKeyword, TrendingProduct } from '@/lib/factory-os/types';
import { ProductStatusBadge } from './StatusBadge';
import { Product3DRender } from './Product3DRender';
import { getProfitMarginColor, getDemandColor, MARKETPLACE_COLORS } from '@/lib/factory-os/colors';

interface OpportunitiesViewProps {
  opportunities: ProductOpportunity[];
  trendingKeywords?: TrendingKeyword[];
  trendingProducts?: TrendingProduct[];
  onProductClick?: (productId: string) => void;
  className?: string;
}

export function OpportunitiesView({
  opportunities,
  trendingKeywords = [],
  trendingProducts = [],
  onProductClick,
  className
}: OpportunitiesViewProps) {
  const researching = opportunities.filter(o => o.status === 'researching');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Trending Keywords */}
      {trendingKeywords.length > 0 && (
        <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card/50 to-pink-500/10 p-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Trending Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.slice(0, 12).map((kw, idx) => (
              <TrendingKeywordBadge key={idx} keyword={kw} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Products - High Profit Opportunities */}
      {trendingProducts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            Hot Opportunities ({trendingProducts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {trendingProducts.slice(0, 6).map((product) => (
              <TrendingProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Currently Researching */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Being Researched ({researching.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researching.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onClick={() => onProductClick?.(opp.id)}
            />
          ))}
        </div>
        {researching.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No products being researched</p>
        )}
      </div>
    </div>
  );
}

// Trending keyword badge
function TrendingKeywordBadge({ keyword }: { keyword: TrendingKeyword }) {
  const TrendIcon = keyword.trend === 'rising' ? TrendingUp :
                   keyword.trend === 'falling' ? TrendingDown : Minus;
  const trendColor = keyword.trend === 'rising' ? 'text-green-400' :
                    keyword.trend === 'falling' ? 'text-red-400' : 'text-muted-foreground';

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 hover:bg-card hover:border-purple-500/30 transition-colors cursor-pointer">
      <span className="text-sm text-foreground">{keyword.keyword}</span>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">
          {(keyword.searchVolume / 1000).toFixed(0)}k
        </span>
        <TrendIcon className={cn('h-3 w-3', trendColor)} />
        <span className={cn('text-[10px]', trendColor)}>
          {keyword.changePercent > 0 ? '+' : ''}{keyword.changePercent}%
        </span>
      </div>
    </div>
  );
}

// Trending product card
function TrendingProductCard({ product }: { product: TrendingProduct }) {
  const marketplaceColor = MARKETPLACE_COLORS[product.marketplace] || '#71717a';
  const competitionColor = product.competitionLevel === 'low' ? '#22c55e' :
                          product.competitionLevel === 'medium' ? '#f59e0b' : '#ef4444';

  return (
    <div className="rounded-lg border border-border bg-card/50 p-3 hover:border-yellow-500/30 hover:bg-card transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Product3DRender productName={product.name} category={product.category} size="sm" className="w-10 h-10" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-yellow-400 transition-colors">
            {product.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{product.category}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
          style={{ backgroundColor: `${marketplaceColor}20`, color: marketplaceColor }}
        >
          {product.marketplace}
        </span>
        <span className="text-xs text-muted-foreground">
          ~${product.avgPrice.toFixed(0)}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border text-xs">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">
            {(product.searchVolume / 1000).toFixed(0)}k searches
          </span>
          <span style={{ color: competitionColor }} className="capitalize">
            {product.competitionLevel}
          </span>
        </div>
        <span className="font-mono font-semibold text-green-400">
          +{product.profitPotential}%
        </span>
      </div>

      {/* Research button */}
      <button className="w-full mt-2 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-muted/50 text-xs text-muted-foreground hover:bg-purple-500/20 hover:text-purple-400 transition-colors">
        <Search className="h-3 w-3" />
        Research
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

// Single opportunity card
interface OpportunityCardProps {
  opportunity: ProductOpportunity;
  onClick?: () => void;
}

function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const marketplaceColor = MARKETPLACE_COLORS[opportunity.sourceMarketplace] || '#71717a';

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border border-border bg-card/50 p-4 hover:border-primary/30 hover:bg-card transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{opportunity.name}</p>
          <p className="text-xs text-muted-foreground">{opportunity.category}</p>
        </div>
        <ProductStatusBadge status={opportunity.status} size="sm" />
      </div>

      {/* Source */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <span
          className="px-1.5 py-0.5 rounded capitalize"
          style={{ backgroundColor: `${marketplaceColor}20`, color: marketplaceColor }}
        >
          {opportunity.sourceMarketplace}
        </span>
        <span className="text-muted-foreground">
          ${opportunity.sourcePrice.toFixed(0)} → ${(opportunity.sourcePrice * 0.6).toFixed(0)}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Margin
          </span>
          <p
            className="font-mono font-semibold"
            style={{ color: getProfitMarginColor(opportunity.profitMargin) }}
          >
            {opportunity.profitMargin.toFixed(0)}%
          </p>
        </div>
        <div>
          <span className="text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Demand
          </span>
          <p
            className="font-mono font-semibold"
            style={{ color: getDemandColor(opportunity.demandScore) }}
          >
            {opportunity.demandScore}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Comp
          </span>
          <p className={cn(
            'font-mono font-semibold',
            opportunity.competitionScore < 40 ? 'text-green-400' :
            opportunity.competitionScore < 60 ? 'text-yellow-400' : 'text-red-400'
          )}>
            {opportunity.competitionScore}
          </p>
        </div>
      </div>

      {/* Cost */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Est. cost</span>
        <span className="text-foreground/80 font-mono">${opportunity.estimatedCost.toFixed(2)}</span>
      </div>
    </button>
  );
}

// Compact list for sidebar
interface OpportunitiesListProps {
  opportunities: ProductOpportunity[];
  maxItems?: number;
  className?: string;
}

export function OpportunitiesList({ opportunities, maxItems = 5, className }: OpportunitiesListProps) {
  const items = opportunities.slice(0, maxItems);

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((opp) => (
        <div
          key={opp.id}
          className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">{opp.name}</p>
            <p className="text-xs text-muted-foreground">{opp.category}</p>
          </div>
          <span
            className="text-xs font-mono ml-2"
            style={{ color: getProfitMarginColor(opp.profitMargin) }}
          >
            {opp.profitMargin.toFixed(0)}%
          </span>
        </div>
      ))}
      {opportunities.length > maxItems && (
        <p className="text-xs text-muted-foreground text-center">
          +{opportunities.length - maxItems} more
        </p>
      )}
    </div>
  );
}
