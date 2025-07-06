import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Target, 
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const navigationItems = [
  { icon: BarChart3, label: "Dashboard", active: true, href: "/" },
  { icon: Target, label: "Citations", active: false, href: "/citations" },
  { icon: TrendingUp, label: "Analytics", active: false, href: "/analytics" },
  { icon: FileText, label: "Reports", active: false, href: "/reports" },
  { icon: Users, label: "Competitors", active: false, href: "/competitors" },
  { icon: Settings, label: "Settings", active: false, href: "/settings" },
];

export const Sidebar = ({ collapsed, onCollapse }: SidebarProps) => {
  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-card border-r border-border z-50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">CitationTracker</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapse(!collapsed)}
          className="p-2 hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "w-full justify-start transition-all duration-200",
              collapsed ? "px-2" : "px-4",
              item.active && "bg-primary text-primary-foreground shadow-glow"
            )}
            size={collapsed ? "sm" : "default"}
          >
            <item.icon className={cn(
              "h-5 w-5",
              collapsed ? "mr-0" : "mr-3"
            )} />
            {!collapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </Button>
        ))}
      </nav>

      {/* Pro Badge */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-primary rounded-lg p-4 text-white">
            <div className="text-sm font-semibold mb-1">Upgrade to Pro</div>
            <div className="text-xs opacity-90 mb-3">
              Get unlimited citations tracking and advanced analytics
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              className="w-full bg-white/20 hover:bg-white/30 border-0"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};