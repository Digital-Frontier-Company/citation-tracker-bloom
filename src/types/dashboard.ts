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

export type DateRangeOption = "last_7_days" | "last_30_days" | "last_90_days" | "last_year";