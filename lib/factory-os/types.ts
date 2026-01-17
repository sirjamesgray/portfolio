// @ts-nocheck
// FactoryOS Home Lab - Type Definitions
// Automated pipeline: Research → Design → Print → Market → Sell

// Pipeline stage status
export type StageStatus =
  | 'idle'           // Not active
  | 'running'        // Currently processing
  | 'completed'      // Stage done
  | 'error'          // Failed
  | 'queued';        // Waiting to start

// Overall product status in pipeline
export type ProductStatus =
  | 'researching'    // Finding opportunity
  | 'designing'      // Creating 3D model
  | 'printing'       // Manufacturing
  | 'marketing'      // Spinning up ads/listings
  | 'selling'        // Live and generating revenue
  | 'paused'         // Temporarily stopped
  | 'retired';       // No longer active

// Marketplace source
export type Marketplace = 'amazon' | 'etsy' | 'ebay' | 'aliexpress' | 'thingiverse';

// Time series data point
export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

// Daily revenue data point for charts
export interface DailyDataPoint {
  date: string; // YYYY-MM-DD
  revenue: number;
  cost: number;
  profit: number;
}

// Trending keyword for research
export interface TrendingKeyword {
  keyword: string;
  searchVolume: number;
  trend: 'rising' | 'stable' | 'falling';
  changePercent: number;
}

// Trending product opportunity
export interface TrendingProduct {
  id: string;
  name: string;
  category: string;
  marketplace: Marketplace;
  avgPrice: number;
  searchVolume: number;
  competitionLevel: 'low' | 'medium' | 'high';
  profitPotential: number;
}

// Discovered product opportunity
export interface ProductOpportunity {
  id: string;
  name: string;
  category: string;
  sourceMarketplace: Marketplace;
  sourceUrl: string;
  sourcePrice: number;
  estimatedCost: number;       // Materials + time
  profitMargin: number;        // Percentage
  demandScore: number;         // 0-100
  competitionScore: number;    // 0-100 (lower is better)
  discoveredAt: number;
  status: ProductStatus;
  thumbnail?: string;
}

// 3D print job
export interface PrintJob {
  id: string;
  productId: string;
  productName: string;
  status: 'queued' | 'printing' | 'completed' | 'failed' | 'paused';
  progress: number;            // 0-100
  estimatedMinutes: number;
  elapsedMinutes: number;
  materialGrams: number;
  materialType: 'PLA' | 'PETG' | 'ABS' | 'TPU' | 'Resin';
  printerName: string;
  layerHeight: number;
  infillPercent: number;
  startedAt?: number;
  completedAt?: number;
}

// Marketing campaign
export interface MarketingCampaign {
  id: string;
  productId: string;
  productName: string;
  platform: 'etsy' | 'ebay' | 'shopify' | 'instagram' | 'tiktok' | 'facebook';
  status: 'draft' | 'active' | 'paused' | 'ended';
  listingTitle: string;
  price: number;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  roi: number;
  createdAt: number;
  impressionHistory: TimeSeriesPoint[];
}

// Sale/Order
export interface Sale {
  id: string;
  productId: string;
  productName: string;
  platform: MarketingCampaign['platform'];
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  status: 'pending' | 'shipped' | 'delivered' | 'refunded';
  orderedAt: number;
  shippedAt?: number;
}

// Pipeline stage metrics
export interface StageMetrics {
  stage: 'research' | 'design' | 'print' | 'market' | 'sales';
  status: StageStatus;
  itemsProcessing: number;
  itemsCompleted: number;
  itemsFailed: number;
  avgProcessingTime: number;   // minutes
  throughputPerHour: number;
}

// 3D Printer status
export interface Printer {
  id: string;
  name: string;
  model: string;
  status: 'idle' | 'printing' | 'paused' | 'error' | 'maintenance';
  currentJobId?: string;
  bedTemp: number;
  nozzleTemp: number;
  uptime: number;              // hours
  totalPrints: number;
  successRate: number;         // percentage
}

// Home Lab overall state
export interface HomeLab {
  id: string;
  name: string;
  // Pipeline stages
  stages: StageMetrics[];
  // Resources
  printers: Printer[];
  materials: MaterialInventory[];
  materialOrders: MaterialOrder[];
  adBudgets: AdBudget[];
  // Active items
  opportunities: ProductOpportunity[];
  printQueue: PrintJob[];
  campaigns: MarketingCampaign[];
  recentSales: Sale[];
  // Metrics
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalMaterialCost: number;
  totalAdSpend: number;
  productsLaunched: number;
  activeListings: number;
  // Time series (real-time)
  revenueHistory: TimeSeriesPoint[];
  profitHistory: TimeSeriesPoint[];
  costHistory: TimeSeriesPoint[];
  // Daily historical data (90 days)
  dailyHistory: DailyDataPoint[];
  // Research data
  trendingKeywords: TrendingKeyword[];
  trendingProducts: TrendingProduct[];
  // Materials usage tracking
  materialUsageHistory: { date: string; type: string; gramsUsed: number }[];
}

// Navigation breadcrumb
export interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'home' | 'research' | 'print' | 'materials' | 'market' | 'sales' | 'product' | 'printer';
}

// Drill-down navigation state
export interface DrillDownState {
  path: BreadcrumbItem[];
  view: 'overview' | 'research' | 'print' | 'materials' | 'market' | 'sales' | 'product' | 'printer';
  selectedId?: string;
}

// Alert/Notification
export interface Alert {
  id: string;
  timestamp: number;
  type: 'opportunity' | 'print_complete' | 'sale' | 'error' | 'milestone';
  severity: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  productId?: string;
  acknowledged: boolean;
}

// Material inventory
export interface MaterialInventory {
  type: 'PLA' | 'PETG' | 'ABS' | 'TPU' | 'Resin';
  color: string;
  gramsRemaining: number;
  gramsTotal: number;
  costPerKg: number;
  reorderThreshold: number;
  supplier: string;
}

// Material order
export interface MaterialOrder {
  id: string;
  materialType: MaterialInventory['type'];
  color: string;
  quantity: number;          // grams
  cost: number;
  status: 'pending' | 'shipped' | 'delivered';
  orderedAt: number;
  estimatedDelivery: number;
}

// Ad campaign budget/controls
export interface AdBudget {
  campaignId: string;
  dailyBudget: number;
  totalBudget: number;
  spent: number;
  status: 'active' | 'paused' | 'depleted';
  platform: MarketingCampaign['platform'];
}

// Simulation configuration
export interface SimulationConfig {
  updateInterval: number;
  opportunityRate: number;     // New opportunities per hour
  printSpeed: number;          // Multiplier
  saleRate: number;            // Sales per hour per listing
  errorRate: number;           // Failure probability
}
