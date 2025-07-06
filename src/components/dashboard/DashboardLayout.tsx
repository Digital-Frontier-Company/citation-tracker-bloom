import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { KPICards } from "./KPICards";
import { PerformanceChart } from "./PerformanceChart";
import { ActivityFeed } from "./ActivityFeed";

export const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          {/* KPI Cards Section */}
          <div className="animate-slide-up">
            <KPICards />
          </div>
          
          {/* Performance Chart Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <PerformanceChart />
          </div>
          
          {/* Activity Feed Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  );
};