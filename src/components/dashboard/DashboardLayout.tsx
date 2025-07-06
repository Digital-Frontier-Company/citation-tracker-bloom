import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { KPICards } from "./KPICards";
import { PerformanceChart } from "./PerformanceChart";
import { ActivityFeed } from "./ActivityFeed";
import { DateRangeFilter } from "./DateRangeFilter";
import { ErrorState } from "./ErrorState";
import { KPICardsSkeleton, PerformanceChartSkeleton, ActivityFeedSkeleton } from "./LoadingSkeleton";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DateRangeOption } from "@/types/dashboard";
import { useToast } from "@/hooks/use-toast";

export const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeOption>("last_30_days");
  const { toast } = useToast();
  
  const { data: apiResponse, isLoading, error, refetch } = useDashboardData(dateRange);

  useEffect(() => {
    if (error && !apiResponse) {
      toast({
        title: "Connection Issue",
        description: "Using demo data while API is unavailable.",
        variant: "default",
      });
    }
  }, [error, apiResponse, toast]);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onCollapse={setSidebarCollapsed} 
      />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header />
        
        <main className="p-6 space-y-6">
          {/* Date Range Filter */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
          </div>

          {/* Error State - Only show if no data at all */}
          {error && !apiResponse && (
            <ErrorState onRetry={() => refetch()} />
          )}

          {/* Loading State */}
          {isLoading && (
            <>
              <div className="animate-slide-up">
                <KPICardsSkeleton />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <PerformanceChartSkeleton />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <ActivityFeedSkeleton />
              </div>
            </>
          )}

          {/* Data Loaded State - Show data even if there was an error (fallback to mock data) */}
          {apiResponse && (
            <>
              {/* KPI Cards Section */}
              <div className="animate-slide-up">
                <KPICards data={apiResponse.data} />
              </div>
              
              {/* Performance Chart Section */}
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <PerformanceChart data={apiResponse.data.performanceTrends} />
              </div>
              
              {/* Activity Feed Section */}
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <ActivityFeed activities={apiResponse.data.recentActivity} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};