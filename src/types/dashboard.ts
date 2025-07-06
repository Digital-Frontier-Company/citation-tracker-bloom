// CitationTracker Pro API Types - Official Specification
export type DateRangeOption = "last_7_days" | "last_30_days" | "last_90_days" | "this_year";

export interface KPI {
  value: number;
  change: number;
  changeDirection: "up" | "down" | "stable";
}

export interface KPIs {
  totalCitations: KPI;
  shareOfVoice: KPI;
  trafficFromCitations: KPI;
  citationQualityScore: KPI;
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface PerformanceTrends {
  citations: TrendDataPoint[];
  traffic: TrendDataPoint[];
  conversions: TrendDataPoint[];
}

export interface ActivityEvent {
  id: string;
  type: "new_citation" | "competitor_alert" | "traffic_increase" | "new_source" | "citation_lost";
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardAPIResponse {
  data: {
    lastUpdatedAt: string;
    kpis: KPIs;
    performanceTrends: PerformanceTrends;
    recentActivity: ActivityEvent[];
  };
}

export interface APIError {
  error: {
    message: string;
  };
}

// Legacy interfaces for backward compatibility
export interface KPIData {
  title: string;
  value: string;
  change: number;
  icon: string;
  trend: "up" | "down";
}

export interface ChartDataPoint {
  month: string;
  citations: number;
  traffic: number;
  conversions: number;
}

export interface ActivityItem {
  id: string;
  type: "citation" | "competitor" | "alert" | "report";
  title: string;
  description: string;
  timestamp: string;
  status: "positive" | "negative" | "neutral";
  source?: string;
}

export interface DashboardData {
  kpis: KPIData[];
  chartData: ChartDataPoint[];
  activities: ActivityItem[];
  dateRange: string;
}