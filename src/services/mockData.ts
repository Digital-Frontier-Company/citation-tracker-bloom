import { DashboardData, DateRangeOption } from "@/types/dashboard";

const generateMockKPIs = (dateRange: DateRangeOption) => {
  const multiplier = dateRange === "last_7_days" ? 0.3 : 
                    dateRange === "last_30_days" ? 1 : 
                    dateRange === "last_90_days" ? 2.5 : 4;
  
  return [
    {
      title: "Total AI Citations",
      value: Math.round(2847 * multiplier).toLocaleString(),
      change: 12.5,
      icon: "Target",
      trend: "up" as const,
    },
    {
      title: "Share of Voice",
      value: "34.2%",
      change: 8.1,
      icon: "BarChart3",
      trend: "up" as const,
    },
    {
      title: "Citation-Driven Traffic",
      value: Math.round(18429 * multiplier).toLocaleString(),
      change: -2.4,
      icon: "Users",
      trend: "down" as const,
    },
    {
      title: "Citation Quality Score",
      value: "8.7/10",
      change: 5.3,
      icon: "Award",
      trend: "up" as const,
    },
  ];
};

const generateMockChartData = (dateRange: DateRangeOption) => {
  const months = dateRange === "last_7_days" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] :
                 dateRange === "last_30_days" ? ["Week 1", "Week 2", "Week 3", "Week 4"] :
                 dateRange === "last_90_days" ? ["Month 1", "Month 2", "Month 3"] :
                 ["Q1", "Q2", "Q3", "Q4"];
  
  return months.map((month, index) => ({
    month,
    citations: Math.round(1200 + (index * 200) + Math.random() * 300),
    traffic: Math.round(8500 + (index * 1500) + Math.random() * 2000),
    conversions: Math.round(145 + (index * 30) + Math.random() * 50),
  }));
};

const mockActivities = [
  {
    id: "1",
    type: "citation" as const,
    title: "New AI citation detected",
    description: "Your content was cited by ChatGPT in response about Answer Engine Optimization",
    timestamp: "2 hours ago",
    status: "positive" as const,
    source: "ChatGPT"
  },
  {
    id: "2", 
    type: "competitor" as const,
    title: "Competitor gained citation",
    description: "CompetitorX was cited by Google SGE in 3 new responses about AI search",
    timestamp: "4 hours ago",
    status: "negative" as const,
    source: "Google SGE"
  },
  {
    id: "3",
    type: "alert" as const,
    title: "Citation opportunity missed",
    description: "Perplexity cited competitors but not your content for target keyword",
    timestamp: "6 hours ago",
    status: "negative" as const
  },
  {
    id: "4",
    type: "report" as const,
    title: "Weekly AEO report ready",
    description: "Your Answer Engine Optimization performance summary is available",
    timestamp: "1 day ago",
    status: "neutral" as const
  },
  {
    id: "5",
    type: "citation" as const,
    title: "High-authority AI citation",
    description: "Bing Chat cited your content as authoritative source in 12 responses",
    timestamp: "2 days ago",
    status: "positive" as const,
    source: "Bing Chat"
  }
];

export const getMockDashboardData = (dateRange: DateRangeOption): Promise<DashboardData> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        kpis: generateMockKPIs(dateRange),
        chartData: generateMockChartData(dateRange),
        activities: mockActivities,
        dateRange,
      });
    }, 1000);
  });
};