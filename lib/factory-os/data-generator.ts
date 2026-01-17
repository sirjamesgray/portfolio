// @ts-nocheck
// FactoryOS Home Lab - Data Simulation Engine
// Automated pipeline: Research → Design → Print → Market → Sell

import {
  HomeLab,
  ProductOpportunity,
  PrintJob,
  MarketingCampaign,
  Sale,
  Printer,
  StageMetrics,
  Alert,
  TimeSeriesPoint,
  Marketplace,
  ProductStatus,
  SimulationConfig,
  MaterialInventory,
  MaterialOrder,
  AdBudget,
  DailyDataPoint,
  TrendingKeyword,
  TrendingProduct,
} from './types';

// Default simulation configuration
const DEFAULT_CONFIG: SimulationConfig = {
  updateInterval: 1000,
  opportunityRate: 2,
  printSpeed: 1,
  saleRate: 0.5,
  errorRate: 0.02,
};

// Random utilities
function randomId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomInRange(min, max + 1));
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Product name generation
const PRODUCT_ADJECTIVES = ['Minimal', 'Ergonomic', 'Compact', 'Premium', 'Sleek', 'Modern', 'Custom', 'Pro', 'Ultra'];
const PRODUCT_NOUNS = [
  'Phone Stand', 'Cable Organizer', 'Desk Tray', 'Headphone Hook', 'Pen Holder',
  'Monitor Riser', 'Laptop Stand', 'Drawer Divider', 'Wall Mount', 'Shelf Bracket',
  'Switch Plate', 'Cord Clip', 'Key Holder', 'Plant Pot', 'Bookend',
  'Coaster Set', 'Hook Rack', 'Soap Dish', 'Toothbrush Holder', 'Spice Rack',
];
const CATEGORIES = ['Home Office', 'Kitchen', 'Bathroom', 'Organization', 'Tech Accessories', 'Home Decor'];
const MARKETPLACES: Marketplace[] = ['amazon', 'etsy', 'ebay', 'aliexpress'];
const PLATFORMS: MarketingCampaign['platform'][] = ['etsy', 'ebay', 'shopify'];
const MATERIALS: PrintJob['materialType'][] = ['PLA', 'PETG', 'ABS', 'TPU'];
const MATERIAL_COLORS = ['White', 'Black', 'Gray', 'Natural', 'Blue', 'Green', 'Red'];
const SUPPLIERS = ['Amazon', 'MatterHackers', 'Prusa', 'Overture', 'eSUN'];

function generateProductName(): string {
  return `${randomChoice(PRODUCT_ADJECTIVES)} ${randomChoice(PRODUCT_NOUNS)}`;
}

// Generate a product opportunity
function generateOpportunity(): ProductOpportunity {
  const sourcePrice = randomInRange(15, 80);
  const estimatedCost = randomInRange(2, sourcePrice * 0.3);
  const profitMargin = ((sourcePrice * 0.6 - estimatedCost) / (sourcePrice * 0.6)) * 100;

  return {
    id: randomId(),
    name: generateProductName(),
    category: randomChoice(CATEGORIES),
    sourceMarketplace: randomChoice(MARKETPLACES),
    sourceUrl: '#',
    sourcePrice,
    estimatedCost,
    profitMargin: Math.max(10, profitMargin),
    demandScore: randomInt(30, 95),
    competitionScore: randomInt(20, 80),
    discoveredAt: Date.now() - randomInt(0, 24 * 60 * 60 * 1000),
    status: 'researching',
  };
}

// Generate a print job
function generatePrintJob(product: ProductOpportunity): PrintJob {
  const estimatedMinutes = randomInt(45, 240);
  return {
    id: randomId(),
    productId: product.id,
    productName: product.name,
    status: 'queued',
    progress: 0,
    estimatedMinutes,
    elapsedMinutes: 0,
    materialGrams: randomInt(20, 150),
    materialType: randomChoice(MATERIALS),
    printerName: '',
    layerHeight: randomChoice([0.1, 0.15, 0.2, 0.28]),
    infillPercent: randomChoice([15, 20, 25, 30]),
  };
}

// Generate a marketing campaign
function generateCampaign(product: ProductOpportunity): MarketingCampaign {
  const price = product.sourcePrice * randomInRange(0.5, 0.7);
  return {
    id: randomId(),
    productId: product.id,
    productName: product.name,
    platform: randomChoice(PLATFORMS),
    status: 'draft',
    listingTitle: `${product.name} - 3D Printed, Fast Shipping`,
    price,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spend: 0,
    revenue: 0,
    roi: 0,
    createdAt: Date.now(),
    impressionHistory: [],
  };
}

// Generate a sale
function generateSale(campaign: MarketingCampaign, product: ProductOpportunity): Sale {
  const quantity = randomInt(1, 3);
  const revenue = campaign.price * quantity;
  const cost = product.estimatedCost * quantity;
  return {
    id: randomId(),
    productId: product.id,
    productName: product.name,
    platform: campaign.platform,
    quantity,
    revenue,
    cost,
    profit: revenue - cost,
    status: 'pending',
    orderedAt: Date.now(),
  };
}

// Generate a printer
function generatePrinter(index: number): Printer {
  const models = ['Ender 3 V2', 'Prusa Mini+', 'Bambu Lab P1S', 'Anycubic Kobra'];
  return {
    id: randomId(),
    name: `Printer ${index + 1}`,
    model: randomChoice(models),
    status: 'idle',
    bedTemp: 60,
    nozzleTemp: 200,
    uptime: randomInt(100, 2000),
    totalPrints: randomInt(50, 500),
    successRate: randomInRange(92, 99),
  };
}

// Generate material inventory
function generateMaterial(type: MaterialInventory['type'], color: string): MaterialInventory {
  const costPerKgMap = { PLA: 20, PETG: 25, ABS: 22, TPU: 35, Resin: 45 };
  const gramsTotal = 1000; // 1kg spool
  return {
    type,
    color,
    gramsRemaining: randomInt(100, 900),
    gramsTotal,
    costPerKg: costPerKgMap[type],
    reorderThreshold: 200,
    supplier: randomChoice(SUPPLIERS),
  };
}

// Generate material order
function generateMaterialOrder(material: MaterialInventory): MaterialOrder {
  const quantity = 1000; // 1kg
  return {
    id: randomId(),
    materialType: material.type,
    color: material.color,
    quantity,
    cost: (quantity / 1000) * material.costPerKg,
    status: randomChoice(['pending', 'shipped']),
    orderedAt: Date.now() - randomInt(0, 5 * 24 * 60 * 60 * 1000),
    estimatedDelivery: Date.now() + randomInt(1, 5) * 24 * 60 * 60 * 1000,
  };
}

// Generate ad budget for campaign
function generateAdBudget(campaign: MarketingCampaign): AdBudget {
  const dailyBudget = randomInRange(5, 25);
  const totalBudget = dailyBudget * randomInt(7, 30);
  return {
    campaignId: campaign.id,
    dailyBudget,
    totalBudget,
    spent: campaign.spend,
    status: campaign.status === 'active' ? 'active' : 'paused',
    platform: campaign.platform,
  };
}

// Generate 90 days of daily historical data
function generateDailyHistory(): DailyDataPoint[] {
  const history: DailyDataPoint[] = [];
  const now = new Date();

  // Start with some base values and grow over time
  let baseRevenue = randomInRange(50, 150);
  let baseCost = randomInRange(20, 50);

  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Add some natural growth + variation
    const growthFactor = 1 + (90 - i) * 0.008; // ~0.8% daily growth
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;

    // Random daily variation
    const revenueVariation = randomInRange(0.6, 1.4);
    const costVariation = randomInRange(0.7, 1.3);

    // Occasional spikes (big sale days)
    const spike = Math.random() < 0.08 ? randomInRange(1.5, 3) : 1;

    const revenue = baseRevenue * growthFactor * weekendFactor * revenueVariation * spike;
    const cost = baseCost * growthFactor * costVariation * (spike > 1 ? spike * 0.7 : 1);
    const profit = revenue - cost;

    history.push({
      date: dateStr,
      revenue: Math.round(revenue * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      profit: Math.round(profit * 100) / 100,
    });

    // Gradually increase base values
    baseRevenue *= 1.002;
    baseCost *= 1.001;
  }

  return history;
}

// Generate trending keywords
function generateTrendingKeywords(): TrendingKeyword[] {
  const keywords = [
    'desk organizer', 'cable management', 'phone stand', 'headphone hook',
    'plant pot', 'wall mount', 'drawer divider', 'key holder', 'laptop stand',
    'monitor riser', 'pen holder', 'coaster set', 'hook rack', 'shelf bracket',
    'spice rack', 'soap dish', 'toothbrush holder', 'cable clip', 'switch plate',
  ];

  return keywords.slice(0, randomInt(8, 15)).map(keyword => ({
    keyword,
    searchVolume: randomInt(1000, 50000),
    trend: randomChoice(['rising', 'rising', 'stable', 'falling']) as TrendingKeyword['trend'],
    changePercent: randomInRange(-20, 80),
  })).sort((a, b) => b.searchVolume - a.searchVolume);
}

// Generate trending products
function generateTrendingProducts(): TrendingProduct[] {
  const products: TrendingProduct[] = [];

  for (let i = 0; i < randomInt(6, 12); i++) {
    products.push({
      id: randomId(),
      name: generateProductName(),
      category: randomChoice(CATEGORIES),
      marketplace: randomChoice(MARKETPLACES),
      avgPrice: randomInRange(15, 80),
      searchVolume: randomInt(500, 25000),
      competitionLevel: randomChoice(['low', 'medium', 'high']) as TrendingProduct['competitionLevel'],
      profitPotential: randomInRange(30, 75),
    });
  }

  return products.sort((a, b) => b.profitPotential - a.profitPotential);
}

// Generate material usage history (past 30 days)
function generateMaterialUsageHistory(materials: MaterialInventory[]): { date: string; type: string; gramsUsed: number }[] {
  const history: { date: string; type: string; gramsUsed: number }[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Random usage for each material type
    materials.forEach(m => {
      if (Math.random() < 0.7) { // 70% chance of using each material on a given day
        history.push({
          date: dateStr,
          type: m.type,
          gramsUsed: randomInt(10, 80),
        });
      }
    });
  }

  return history;
}

// Generate initial home lab
export function generateHomeLab(printerCount = 2): HomeLab {
  const printers = Array.from({ length: printerCount }, (_, i) => generatePrinter(i));

  // Generate material inventory
  const materials: MaterialInventory[] = [
    generateMaterial('PLA', 'White'),
    generateMaterial('PLA', 'Black'),
    generateMaterial('PETG', 'Natural'),
    generateMaterial('TPU', 'Black'),
  ];

  // Generate some pending material orders for low stock
  const materialOrders: MaterialOrder[] = materials
    .filter(m => m.gramsRemaining < m.reorderThreshold * 1.5)
    .slice(0, 2)
    .map(m => generateMaterialOrder(m));

  // Generate some initial opportunities at various stages
  const opportunities: ProductOpportunity[] = [];
  const printQueue: PrintJob[] = [];
  const campaigns: MarketingCampaign[] = [];
  const recentSales: Sale[] = [];

  // Add products at various pipeline stages
  // More items in research (6-8 items)
  for (let i = 0; i < randomInt(6, 8); i++) {
    const opp = generateOpportunity();
    opp.status = 'researching';
    opportunities.push(opp);
  }

  for (let i = 0; i < 2; i++) {
    const opp = generateOpportunity();
    opp.status = 'printing';
    opportunities.push(opp);
    const job = generatePrintJob(opp);
    job.status = i === 0 ? 'printing' : 'queued';
    job.progress = i === 0 ? randomInt(10, 60) : 0;
    job.printerName = i === 0 ? printers[0].name : '';
    if (i === 0) {
      printers[0].status = 'printing';
      printers[0].currentJobId = job.id;
    }
    printQueue.push(job);
  }

  for (let i = 0; i < 2; i++) {
    const opp = generateOpportunity();
    opp.status = 'selling';
    opportunities.push(opp);
    const campaign = generateCampaign(opp);
    campaign.status = 'active';
    campaign.impressions = randomInt(500, 5000);
    campaign.clicks = Math.floor(campaign.impressions * randomInRange(0.02, 0.08));
    campaign.conversions = randomInt(1, 10);
    campaign.revenue = campaign.conversions * campaign.price;
    campaign.spend = randomInRange(5, 30);
    campaign.roi = ((campaign.revenue - campaign.spend) / campaign.spend) * 100;
    campaigns.push(campaign);
  }

  // Generate some recent sales
  for (let i = 0; i < 5; i++) {
    const sellingProduct = opportunities.find(o => o.status === 'selling');
    const campaign = campaigns.find(c => c.productId === sellingProduct?.id);
    if (sellingProduct && campaign) {
      const sale = generateSale(campaign, sellingProduct);
      sale.status = randomChoice(['pending', 'shipped', 'delivered']);
      sale.orderedAt = Date.now() - randomInt(0, 7 * 24 * 60 * 60 * 1000);
      recentSales.push(sale);
    }
  }

  const totalRevenue = recentSales.reduce((sum, s) => sum + s.revenue, 0);
  const totalCost = recentSales.reduce((sum, s) => sum + s.cost, 0);
  const totalAdSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalMaterialCost = materials.reduce((sum, m) => sum + ((m.gramsTotal - m.gramsRemaining) / 1000) * m.costPerKg, 0);

  // Generate ad budgets for active campaigns
  const adBudgets: AdBudget[] = campaigns.map(c => generateAdBudget(c));

  return {
    id: randomId(),
    name: 'Home Lab',
    stages: [
      { stage: 'research', status: 'running', itemsProcessing: opportunities.filter(o => o.status === 'researching').length, itemsCompleted: 12, itemsFailed: 1, avgProcessingTime: 30, throughputPerHour: 2 },
      { stage: 'design', status: 'running', itemsProcessing: 1, itemsCompleted: 10, itemsFailed: 2, avgProcessingTime: 45, throughputPerHour: 1.3 },
      { stage: 'print', status: 'running', itemsProcessing: printQueue.length, itemsCompleted: 8, itemsFailed: 1, avgProcessingTime: 120, throughputPerHour: 0.5 },
      { stage: 'market', status: 'running', itemsProcessing: campaigns.filter(c => c.status === 'active').length, itemsCompleted: 6, itemsFailed: 0, avgProcessingTime: 15, throughputPerHour: 4 },
      { stage: 'sales', status: 'running', itemsProcessing: 2, itemsCompleted: recentSales.length, itemsFailed: 0, avgProcessingTime: 0, throughputPerHour: 0.8 },
    ],
    printers,
    materials,
    materialOrders,
    adBudgets,
    opportunities,
    printQueue,
    campaigns,
    recentSales,
    totalRevenue,
    totalCost,
    totalProfit: totalRevenue - totalCost,
    totalMaterialCost,
    totalAdSpend,
    productsLaunched: opportunities.filter(o => o.status === 'selling').length,
    activeListings: campaigns.filter(c => c.status === 'active').length,
    revenueHistory: [],
    profitHistory: [],
    costHistory: [],
    // New data for enhanced views
    dailyHistory: generateDailyHistory(),
    trendingKeywords: generateTrendingKeywords(),
    trendingProducts: generateTrendingProducts(),
    materialUsageHistory: generateMaterialUsageHistory(materials),
  };
}

// Update simulation
export function updateHomeLab(lab: HomeLab, config: SimulationConfig = DEFAULT_CONFIG): HomeLab {
  const now = Date.now();

  // Clone state
  let opportunities = [...lab.opportunities];
  let printQueue = [...lab.printQueue];
  let campaigns = [...lab.campaigns];
  let recentSales = [...lab.recentSales];
  let printers = [...lab.printers];

  // 1. Maybe discover new opportunity
  if (Math.random() < config.opportunityRate / 3600) {
    const newOpp = generateOpportunity();
    opportunities.push(newOpp);
  }

  // 2. Progress researching items to printing
  opportunities = opportunities.map(opp => {
    if (opp.status === 'researching' && Math.random() < 0.02) {
      // Move to printing
      const job = generatePrintJob(opp);
      printQueue.push(job);
      return { ...opp, status: 'printing' as ProductStatus };
    }
    return opp;
  });

  // 3. Update print jobs
  printQueue = printQueue.map(job => {
    if (job.status === 'printing') {
      const newProgress = Math.min(100, job.progress + (100 / job.estimatedMinutes) * config.printSpeed);
      const newElapsed = job.elapsedMinutes + config.printSpeed;

      if (newProgress >= 100) {
        // Print complete - free up printer
        printers = printers.map(p =>
          p.currentJobId === job.id ? { ...p, status: 'idle' as const, currentJobId: undefined } : p
        );
        return { ...job, status: 'completed' as const, progress: 100, elapsedMinutes: newElapsed, completedAt: now };
      }

      // Maybe fail
      if (Math.random() < config.errorRate * 0.1) {
        printers = printers.map(p =>
          p.currentJobId === job.id ? { ...p, status: 'idle' as const, currentJobId: undefined } : p
        );
        return { ...job, status: 'failed' as const };
      }

      return { ...job, progress: newProgress, elapsedMinutes: newElapsed };
    }

    // Start queued job if printer available
    if (job.status === 'queued') {
      const availablePrinter = printers.find(p => p.status === 'idle');
      if (availablePrinter) {
        printers = printers.map(p =>
          p.id === availablePrinter.id ? { ...p, status: 'printing' as const, currentJobId: job.id } : p
        );
        return { ...job, status: 'printing' as const, printerName: availablePrinter.name, startedAt: now };
      }
    }

    return job;
  });

  // 4. Move completed prints to marketing
  printQueue.forEach(job => {
    if (job.status === 'completed') {
      const product = opportunities.find(o => o.id === job.productId);
      if (product && product.status === 'printing') {
        // Create campaign
        const campaign = generateCampaign(product);
        campaign.status = 'active';
        campaigns.push(campaign);

        // Update product status
        opportunities = opportunities.map(o =>
          o.id === product.id ? { ...o, status: 'selling' as ProductStatus } : o
        );
      }
    }
  });

  // Remove completed/failed jobs from queue after processing
  printQueue = printQueue.filter(job => job.status !== 'completed' && job.status !== 'failed');

  // 5. Update campaigns and generate sales
  campaigns = campaigns.map(campaign => {
    if (campaign.status !== 'active') return campaign;

    // Add impressions
    const newImpressions = campaign.impressions + randomInt(5, 50);
    const newClicks = campaign.clicks + (Math.random() < 0.1 ? randomInt(1, 5) : 0);

    // Maybe generate sale
    const product = opportunities.find(o => o.id === campaign.productId);
    if (Math.random() < config.saleRate / 3600 && product) {
      const sale = generateSale(campaign, product);
      recentSales.unshift(sale);
      if (recentSales.length > 20) recentSales.pop();

      const newRevenue = campaign.revenue + sale.revenue;
      const newConversions = campaign.conversions + 1;
      const roi = ((newRevenue - campaign.spend) / Math.max(1, campaign.spend)) * 100;

      return {
        ...campaign,
        impressions: newImpressions,
        clicks: newClicks,
        conversions: newConversions,
        revenue: newRevenue,
        roi,
        impressionHistory: [
          ...campaign.impressionHistory,
          { timestamp: now, value: newImpressions },
        ].slice(-60),
      };
    }

    return {
      ...campaign,
      impressions: newImpressions,
      clicks: newClicks,
      impressionHistory: [
        ...campaign.impressionHistory,
        { timestamp: now, value: newImpressions },
      ].slice(-60),
    };
  });

  // 6. Update printer temps (cosmetic)
  printers = printers.map(p => ({
    ...p,
    bedTemp: p.status === 'printing' ? clamp(p.bedTemp + randomInRange(-1, 1), 55, 65) : 25,
    nozzleTemp: p.status === 'printing' ? clamp(p.nozzleTemp + randomInRange(-2, 2), 195, 215) : 25,
  }));

  // 7. Update stage metrics
  const stages: StageMetrics[] = [
    {
      stage: 'research',
      status: 'running',
      itemsProcessing: opportunities.filter(o => o.status === 'researching').length,
      itemsCompleted: lab.stages[0].itemsCompleted + (opportunities.some(o => o.status === 'printing') ? 1 : 0),
      itemsFailed: lab.stages[0].itemsFailed,
      avgProcessingTime: 30,
      throughputPerHour: config.opportunityRate,
    },
    {
      stage: 'design',
      status: 'running',
      itemsProcessing: 0,
      itemsCompleted: lab.stages[1].itemsCompleted,
      itemsFailed: lab.stages[1].itemsFailed,
      avgProcessingTime: 45,
      throughputPerHour: 1,
    },
    {
      stage: 'print',
      status: printQueue.some(j => j.status === 'printing') ? 'running' : 'idle',
      itemsProcessing: printQueue.filter(j => j.status === 'printing').length,
      itemsCompleted: lab.stages[2].itemsCompleted,
      itemsFailed: printQueue.filter(j => j.status === 'failed').length,
      avgProcessingTime: 120,
      throughputPerHour: 0.5 * printers.filter(p => p.status === 'printing').length,
    },
    {
      stage: 'market',
      status: campaigns.some(c => c.status === 'active') ? 'running' : 'idle',
      itemsProcessing: campaigns.filter(c => c.status === 'active').length,
      itemsCompleted: campaigns.filter(c => c.conversions > 0).length,
      itemsFailed: 0,
      avgProcessingTime: 15,
      throughputPerHour: 4,
    },
    {
      stage: 'sales',
      status: 'running',
      itemsProcessing: recentSales.filter(s => s.status === 'pending').length,
      itemsCompleted: recentSales.length,
      itemsFailed: recentSales.filter(s => s.status === 'refunded').length,
      avgProcessingTime: 0,
      throughputPerHour: config.saleRate,
    },
  ];

  // 8. Update totals
  const totalRevenue = recentSales.reduce((sum, s) => sum + s.revenue, 0);
  const totalCost = recentSales.reduce((sum, s) => sum + s.cost, 0);
  const totalAdSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalMaterialCost = lab.materials.reduce((sum, m) => sum + ((m.gramsTotal - m.gramsRemaining) / 1000) * m.costPerKg, 0);
  const totalProfit = totalRevenue - totalCost - totalAdSpend;

  // Add variability to make the chart more interesting
  // Revenue fluctuates with random spikes (simulating sales)
  const revenueVariance = randomInRange(-5, 15) + (Math.random() < 0.15 ? randomInRange(10, 50) : 0);
  const baseRevenue = lab.revenueHistory.length > 0
    ? lab.revenueHistory[lab.revenueHistory.length - 1].value
    : 0;
  const smoothedRevenue = Math.max(0, baseRevenue + revenueVariance);

  // Costs fluctuate more gradually
  const costVariance = randomInRange(-2, 8) + (Math.random() < 0.1 ? randomInRange(5, 20) : 0);
  const baseCost = lab.costHistory.length > 0
    ? lab.costHistory[lab.costHistory.length - 1].value
    : 0;
  const smoothedCost = Math.max(0, baseCost + costVariance);

  // Profit is derived from revenue and cost
  const smoothedProfit = smoothedRevenue - smoothedCost;

  const revenueHistory: TimeSeriesPoint[] = [
    ...lab.revenueHistory,
    { timestamp: now, value: smoothedRevenue },
  ].slice(-60);

  const profitHistory: TimeSeriesPoint[] = [
    ...lab.profitHistory,
    { timestamp: now, value: smoothedProfit },
  ].slice(-60);

  const costHistory: TimeSeriesPoint[] = [
    ...lab.costHistory,
    { timestamp: now, value: smoothedCost },
  ].slice(-60);

  return {
    ...lab,
    stages,
    printers,
    opportunities,
    printQueue,
    campaigns,
    recentSales,
    totalRevenue,
    totalCost,
    totalProfit,
    totalMaterialCost,
    totalAdSpend,
    productsLaunched: opportunities.filter(o => o.status === 'selling').length,
    activeListings: campaigns.filter(c => c.status === 'active').length,
    revenueHistory,
    profitHistory,
    costHistory,
  };
}

// Generate alerts with actual revenue/money amounts
export function generateAlert(lab: HomeLab): Alert | null {
  if (Math.random() > 0.08) return null;

  // Pick a random recent sale for sale alerts
  const recentSale = lab.recentSales.length > 0 ? randomChoice(lab.recentSales) : null;
  const recentCampaign = lab.campaigns.find(c => c.status === 'active');
  const recentOpportunity = lab.opportunities.find(o => o.status === 'researching');

  const alertTypes = [
    {
      type: 'sale' as const,
      severity: 'success' as const,
      title: recentSale ? `+$${recentSale.revenue.toFixed(2)} Sale!` : 'New Sale!',
      desc: recentSale ? `${recentSale.productName} • +$${recentSale.profit.toFixed(2)} profit` : 'Order received'
    },
    {
      type: 'sale' as const,
      severity: 'success' as const,
      title: `💰 +$${randomInRange(15, 80).toFixed(2)}`,
      desc: recentCampaign ? `${recentCampaign.productName} sold on ${recentCampaign.platform}` : 'Etsy order received'
    },
    {
      type: 'opportunity' as const,
      severity: 'info' as const,
      title: 'High-margin product found',
      desc: recentOpportunity ? `${recentOpportunity.name} • ${recentOpportunity.profitMargin.toFixed(0)}% margin` : '65% profit margin detected'
    },
    {
      type: 'print_complete' as const,
      severity: 'success' as const,
      title: 'Print completed',
      desc: `Ready to ship • $${randomInRange(8, 40).toFixed(2)} material cost`
    },
    {
      type: 'milestone' as const,
      severity: 'info' as const,
      title: `$${(Math.floor(lab.totalRevenue / 100) * 100 + 100)} Revenue Milestone`,
      desc: `Total profit: $${lab.totalProfit.toFixed(0)}`
    },
  ];

  // Weight towards sale alerts (money focus)
  const weights = [0.35, 0.25, 0.15, 0.15, 0.1];
  let r = Math.random();
  let alertIndex = 0;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      alertIndex = i;
      break;
    }
  }
  const alertType = alertTypes[alertIndex];

  return {
    id: randomId(),
    timestamp: Date.now(),
    type: alertType.type,
    severity: alertType.severity,
    title: alertType.title,
    description: alertType.desc,
    acknowledged: false,
  };
}
