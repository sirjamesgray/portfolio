'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Package,
  Bell,
  Home,
  ChevronRight,
  Search,
  Printer,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Boxes,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/lib/factory-os/hooks/useSimulation';
import { useDrillDown } from '@/lib/factory-os/hooks/useDrillDown';
import { PrintQueueView, PrintStatusMini } from '@/components/factory-os/PrintQueueView';
import { OpportunitiesView } from '@/components/factory-os/OpportunitiesView';
import { SalesView } from '@/components/factory-os/SalesView';
import { RevenueChart } from '@/components/factory-os/RevenueChart';
import { MaterialsView, MaterialsMini } from '@/components/factory-os/MaterialsView';
import { AdCampaignView, AdSpendMini } from '@/components/factory-os/AdCampaignView';
import { KanbanView } from '@/components/factory-os/KanbanView';
import { ProductDetailDrawer } from '@/components/factory-os/ProductDetailDrawer';
import { ThemeToggle } from '@/components/theme-toggle';
import { PIPELINE_COLORS } from '@/lib/factory-os/colors';

export default function HomeLabPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const {
    lab,
    alerts,
    reset,
  } = useSimulation({ printerCount: 2, autoStart: true });

  const {
    currentView,
    breadcrumbs,
    goToOverview,
    goToStage,
    goToBreadcrumb,
  } = useDrillDown();

  // Get selected product for detail view
  const selectedProduct = selectedProductId
    ? lab?.opportunities.find(o => o.id === selectedProductId) ?? null
    : null;

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home, color: '#71717a' },
    { id: 'research', label: 'Research', icon: Search, color: PIPELINE_COLORS.research },
    { id: 'print', label: 'Print Queue', icon: Printer, color: PIPELINE_COLORS.print },
    { id: 'materials', label: 'Materials', icon: Boxes, color: '#f97316' },
    { id: 'market', label: 'Ads', icon: Megaphone, color: PIPELINE_COLORS.market },
    { id: 'sales', label: 'Sales', icon: DollarSign, color: PIPELINE_COLORS.sales },
  ];

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => (
    <nav className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
          <button
            onClick={() => goToBreadcrumb(index)}
            disabled={index === breadcrumbs.length - 1}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors',
              index === breadcrumbs.length - 1
                ? 'text-foreground cursor-default'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {item.type === 'home' && <Home className="h-4 w-4" />}
            <span>{item.name}</span>
          </button>
        </div>
      ))}
    </nav>
  );

  // Render the main content view
  const renderView = () => {
    if (!lab) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Initializing simulation...
        </div>
      );
    }

    switch (currentView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Concept Description */}
            <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card/50 to-pink-500/10 p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Automated Arbitrage Pipeline
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    <span className="text-purple-400 font-medium">Research</span> overpriced products on marketplaces like Amazon, Etsy, and AliExpress.
                    <span className="text-orange-400 font-medium"> 3D print</span> cheaper alternatives at home.
                    <span className="text-pink-400 font-medium"> Flood the market</span> with better-priced listings.
                    <span className="text-green-400 font-medium"> Collapse equilibrium prices</span> while capturing profit margins of 40-70%.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">Undercut Temu</span>
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">Disrupt pricing</span>
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">Automated fulfillment</span>
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">24/7 production</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Total Revenue" value={`$${lab.totalRevenue.toFixed(0)}`} icon={DollarSign} color="#22c55e" />
              <MetricCard label="Total Profit" value={`$${lab.totalProfit.toFixed(0)}`} icon={TrendingUp} color="#3b82f6" />
              <MetricCard label="Material Costs" value={`-$${lab.totalMaterialCost.toFixed(0)}`} icon={Boxes} color="#f97316" />
              <MetricCard label="Ad Spend" value={`-$${lab.totalAdSpend.toFixed(0)}`} icon={Megaphone} color="#ec4899" />
            </div>

            {/* Revenue Chart */}
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Revenue Over Time (90 Days)</h3>
              <RevenueChart dailyHistory={lab.dailyHistory} />
            </div>

            {/* Kanban Pipeline View */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Product Pipeline</h2>
              <KanbanView
                opportunities={lab.opportunities}
                printJobs={lab.printQueue}
                campaigns={lab.campaigns}
                sales={lab.recentSales}
                materials={lab.materials}
                onProductClick={(productId) => setSelectedProductId(productId)}
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Print Status */}
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Print Status</h3>
                  <button onClick={() => goToStage('print')} className="text-xs text-orange-400 hover:text-orange-300">
                    View →
                  </button>
                </div>
                <PrintStatusMini printers={lab.printers} queue={lab.printQueue} />
              </div>

              {/* Materials */}
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Materials</h3>
                  <button onClick={() => goToStage('materials' as 'research')} className="text-xs text-orange-400 hover:text-orange-300">
                    View →
                  </button>
                </div>
                <MaterialsMini materials={lab.materials} />
              </div>

              {/* Ads */}
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Ad Campaigns</h3>
                  <button onClick={() => goToStage('market')} className="text-xs text-pink-400 hover:text-pink-300">
                    View →
                  </button>
                </div>
                <AdSpendMini totalAdSpend={lab.totalAdSpend} activeCampaigns={lab.campaigns.filter(c => c.status === 'active').length} />
              </div>
            </div>
          </div>
        );

      case 'research':
        // Filter to only show items in research phase
        return (
          <OpportunitiesView
            opportunities={lab.opportunities.filter(o => o.status === 'researching')}
            trendingKeywords={lab.trendingKeywords}
            trendingProducts={lab.trendingProducts}
          />
        );

      case 'print':
        return <PrintQueueView printers={lab.printers} queue={lab.printQueue} />;

      case 'materials':
        return <MaterialsView materials={lab.materials} orders={lab.materialOrders} totalMaterialCost={lab.totalMaterialCost} materialUsageHistory={lab.materialUsageHistory} />;

      case 'market':
        return <AdCampaignView campaigns={lab.campaigns} adBudgets={lab.adBudgets} totalAdSpend={lab.totalAdSpend} />;

      case 'sales':
        return <SalesView campaigns={lab.campaigns} sales={lab.recentSales} />;

      default:
        return null;
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/experiments"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="hidden md:block">
              {renderBreadcrumbs()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Reset */}
            <button
              onClick={reset}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Reset simulation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside
          className={cn(
            'flex-shrink-0 border-r border-border bg-background transition-all duration-300 overflow-hidden',
            leftSidebarOpen ? 'w-56' : 'w-0 lg:w-14'
          )}
        >
          <div className={cn('flex flex-col h-full', leftSidebarOpen ? 'w-56' : 'w-14')}>
            {/* Sidebar toggle */}
            <div className="p-2 border-b border-border hidden lg:flex justify-end">
              <button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {leftSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedProductId(null); // Clear product selection when navigating
                      item.id === 'overview' ? goToOverview() : goToStage(item.id as 'research' | 'print' | 'market' | 'sales');
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                    title={!leftSidebarOpen ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" style={{ color: isActive ? item.color : undefined }} />
                    {leftSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            {/* Quick stats in collapsed left sidebar */}
            {!leftSidebarOpen && lab && (
              <div className="p-2 border-t border-border space-y-2">
                <div className="text-center" title="Active printers">
                  <Printer className="h-4 w-4 mx-auto text-orange-400" />
                  <span className="text-xs text-muted-foreground">{lab.printers.filter(p => p.status === 'printing').length}</span>
                </div>
                <div className="text-center" title="Revenue">
                  <DollarSign className="h-4 w-4 mx-auto text-green-400" />
                  <span className="text-xs text-muted-foreground">${lab.totalRevenue.toFixed(0)}</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-6xl mx-auto">
            {/* Mobile breadcrumbs */}
            <div className="md:hidden mb-4">
              {renderBreadcrumbs()}
            </div>
            {renderView()}
          </div>
        </main>

        {/* Right Sidebar - Alerts & Stats */}
        <aside
          className={cn(
            'flex-shrink-0 border-l border-border bg-background transition-all duration-300 overflow-hidden hidden lg:block',
            rightSidebarOpen ? 'w-72' : 'w-14'
          )}
        >
          <div className={cn('flex flex-col h-full', rightSidebarOpen ? 'w-72' : 'w-14')}>
            {/* Sidebar toggle */}
            <div className="p-2 border-b border-border flex justify-start">
              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {rightSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </button>
            </div>

            {rightSidebarOpen ? (
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Alerts */}
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Alerts
                    </h3>
                    {unacknowledgedAlerts.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                        {unacknowledgedAlerts.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {unacknowledgedAlerts.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4 text-center">No new alerts</p>
                    )}
                    {unacknowledgedAlerts.slice(0, 6).map((alert) => {
                      // Extract money amount from title if present
                      const moneyMatch = alert.title.match(/\+?\$[\d.]+/);
                      const moneyAmount = moneyMatch?.[0] ?? null;
                      const titleWithoutMoney = moneyAmount ? alert.title.replace(moneyAmount, '').replace(/💰\s*/, '').trim() : alert.title;

                      return (
                        <div
                          key={alert.id}
                          className={cn(
                            'rounded-lg px-3 py-2.5 text-sm border shadow-sm',
                            alert.severity === 'success' && 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/30',
                            alert.severity === 'info' && 'bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30',
                            alert.severity === 'warning' && 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/30',
                            alert.severity === 'error' && 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'font-medium text-sm',
                                alert.severity === 'success' && 'text-green-700 dark:text-green-400',
                                alert.severity === 'info' && 'text-blue-700 dark:text-blue-400',
                                alert.severity === 'warning' && 'text-yellow-700 dark:text-yellow-400',
                                alert.severity === 'error' && 'text-red-700 dark:text-red-400'
                              )}>
                                {titleWithoutMoney || 'Sale'}
                              </p>
                              <p className={cn(
                                'text-xs mt-0.5',
                                alert.severity === 'success' && 'text-green-600/80 dark:text-green-400/70',
                                alert.severity === 'info' && 'text-blue-600/80 dark:text-blue-400/70',
                                alert.severity === 'warning' && 'text-yellow-600/80 dark:text-yellow-400/70',
                                alert.severity === 'error' && 'text-red-600/80 dark:text-red-400/70'
                              )}>
                                {alert.description}
                              </p>
                            </div>
                            {moneyAmount && (
                              <span className={cn(
                                'font-mono font-bold text-sm flex-shrink-0',
                                alert.severity === 'success' && 'text-green-600 dark:text-green-400',
                                alert.severity === 'info' && 'text-blue-600 dark:text-blue-400',
                                alert.severity === 'warning' && 'text-yellow-600 dark:text-yellow-400',
                                alert.severity === 'error' && 'text-red-600 dark:text-red-400'
                              )}>
                                {moneyAmount}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                {lab && (
                  <div className="rounded-lg border border-border bg-card/50 p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h3>
                    <div className="space-y-3 text-sm">
                      <StatRow label="Printers" value={`${lab.printers.filter(p => p.status === 'printing').length}/${lab.printers.length} active`} />
                      <StatRow label="Print Queue" value={`${lab.printQueue.length} jobs`} />
                      <StatRow label="Campaigns" value={`${lab.campaigns.filter(c => c.status === 'active').length} active`} />
                      <StatRow label="Products" value={`${lab.opportunities.filter(o => o.status === 'researching').length} researching`} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Collapsed right sidebar icons */
              <div className="flex-1 p-2 space-y-3">
                <button
                  onClick={() => setRightSidebarOpen(true)}
                  className="w-full flex flex-col items-center py-2 rounded-md hover:bg-muted/50 transition-colors"
                  title="Alerts"
                >
                  <div className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unacknowledgedAlerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-[10px] font-medium flex items-center justify-center">
                        {unacknowledgedAlerts.length}
                      </span>
                    )}
                  </div>
                </button>
                {lab && (
                  <>
                    <div className="text-center py-2" title={`${lab.printers.filter(p => p.status === 'printing').length} printers active`}>
                      <Printer className="h-5 w-5 mx-auto text-orange-400" />
                      <span className="text-[10px] text-muted-foreground">{lab.printers.filter(p => p.status === 'printing').length}/{lab.printers.length}</span>
                    </div>
                    <div className="text-center py-2" title={`$${lab.totalProfit.toFixed(0)} profit`}>
                      <DollarSign className="h-5 w-5 mx-auto text-green-400" />
                      <span className="text-[10px] text-muted-foreground">${lab.totalProfit.toFixed(0)}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedProductId(null);
                  item.id === 'overview' ? goToOverview() : goToStage(item.id as 'research' | 'print' | 'market' | 'sales');
                }}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" style={{ color: isActive ? item.color : undefined }} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Product Detail Drawer */}
      {lab && (
        <ProductDetailDrawer
          product={selectedProduct}
          printJobs={lab.printQueue}
          campaigns={lab.campaigns}
          sales={lab.recentSales}
          isOpen={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}

// Metric card component
function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-mono font-semibold text-foreground">{value}</p>
    </div>
  );
}

// Stat row for sidebar
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
