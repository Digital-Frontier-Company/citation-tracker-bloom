import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, BarChart3, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { KPIs } from "@/types/dashboard";

interface KPICardsProps {
  data: {
    kpis: KPIs;
    lastUpdatedAt: string;
  };
}

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  iconName: string;
  trend: "up" | "down";
}

const iconMap = {
  Target,
  BarChart3,
  Users,
  Award,
};

const KPICard = ({ title, value, change, iconName, trend }: KPICardProps) => {
  const Icon = iconMap[iconName as keyof typeof iconMap] || Target;
  return (
    <Card className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            
            <div className="flex items-center space-x-1">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-accent" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-accent" : "text-destructive"
              )}>
                {change > 0 ? "+" : ""}{change}%
              </span>
              <span className="text-sm text-muted-foreground">from last month</span>
            </div>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const KPICards = ({ data }: KPICardsProps) => {
  const kpiData = [
    {
      title: "Total AI Citations",
      value: data.kpis.totalCitations.value.toLocaleString(),
      change: data.kpis.totalCitations.change * 100, // Convert to percentage
      icon: "Target",
      trend: data.kpis.totalCitations.changeDirection === "up" ? "up" : "down"
    },
    {
      title: "Share of Voice",
      value: `${(data.kpis.shareOfVoice.value * 100).toFixed(1)}%`,
      change: data.kpis.shareOfVoice.change * 100,
      icon: "BarChart3", 
      trend: data.kpis.shareOfVoice.changeDirection === "up" ? "up" : "down"
    },
    {
      title: "Citation-Driven Traffic",
      value: data.kpis.trafficFromCitations.value.toLocaleString(),
      change: data.kpis.trafficFromCitations.change * 100,
      icon: "Users",
      trend: data.kpis.trafficFromCitations.changeDirection === "up" ? "up" : "down"
    },
    {
      title: "Citation Quality Score",
      value: `${data.kpis.citationQualityScore.value}/100`,
      change: data.kpis.citationQualityScore.change,
      icon: "Award",
      trend: data.kpis.citationQualityScore.changeDirection === "up" ? "up" : "down"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <div 
          key={kpi.title} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <KPICard
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            iconName={kpi.icon}
            trend={kpi.trend as "up" | "down"}
          />
        </div>
      ))}
    </div>
  );
};