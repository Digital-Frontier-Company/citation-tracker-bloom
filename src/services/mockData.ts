import { DashboardAPIResponse, DateRangeOption, DashboardData } from "@/types/dashboard";

// New API format mock data
export const getMockAPIData = (dateRange: DateRangeOption): Promise<DashboardAPIResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          lastUpdatedAt: "2025-07-15T10:45:00Z",
          kpis: {
            totalCitations: {
              value: 248,
              change: 0.12,
              changeDirection: "up"
            },
            shareOfVoice: {
              value: 0.42,
              change: 0.08,
              changeDirection: "up"
            },
            trafficFromCitations: {
              value: 5400,
              change: 0.24,
              changeDirection: "up"
            },
            citationQualityScore: {
              value: 86,
              change: -3,
              changeDirection: "down"
            }
          },
          performanceTrends: {
            citations: [
              { date: "2025-01-01", value: 20 },
              { date: "2025-01-08", value: 42 },
              { date: "2025-01-15", value: 35 },
              { date: "2025-01-22", value: 45 },
              { date: "2025-01-29", value: 60 },
              { date: "2025-02-05", value: 75 },
              { date: "2025-02-12", value: 82 }
            ],
            traffic: [
              { date: "2025-01-01", value: 800 },
              { date: "2025-01-08", value: 1500 },
              { date: "2025-01-15", value: 1200 },
              { date: "2025-01-22", value: 1800 },
              { date: "2025-01-29", value: 2500 },
              { date: "2025-02-05", value: 4300 },
              { date: "2025-02-12", value: 5400 }
            ],
            conversions: [
              { date: "2025-01-01", value: 5 },
              { date: "2025-01-08", value: 12 },
              { date: "2025-01-15", value: 9 },
              { date: "2025-01-22", value: 15 },
              { date: "2025-01-29", value: 22 },
              { date: "2025-02-05", value: 31 },
              { date: "2025-02-12", value: 38 }
            ]
          },
          recentActivity: [
            {
              id: "evt_1",
              type: "new_citation",
              title: "New citation detected",
              description: "'How to Optimize Content for AI Search' on Google SGE",
              timestamp: "2025-07-15T10:35:00Z"
            },
            {
              id: "evt_2",
              type: "competitor_alert",
              title: "Competitor alert",
              description: "TechInsider gained 5 new citations for 'AI SEO'",
              timestamp: "2025-07-15T09:45:00Z"
            },
            {
              id: "evt_3",
              type: "traffic_increase",
              title: "Traffic increase detected",
              description: "+32% traffic from UX Pilot citations",
              timestamp: "2025-07-15T07:45:00Z"
            },
            {
              id: "evt_4",
              type: "new_source",
              title: "New AI source added",
              description: "Now tracking citations on Perplexity.ai",
              timestamp: "2025-07-15T05:45:00Z"
            },
            {
              id: "evt_5",
              type: "citation_lost",
              title: "Citation lost",
              description: "'AI Marketing Guide' no longer cited on UX Pilot",
              timestamp: "2025-07-14T18:00:00Z"
            }
          ]
        }
      });
    }, 1000);
  });
};

// Legacy mock data for backward compatibility
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