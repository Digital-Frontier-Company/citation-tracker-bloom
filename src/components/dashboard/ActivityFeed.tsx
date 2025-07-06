import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  Target,
  ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityEvent } from "@/types/dashboard";

interface ActivityFeedProps {
  activities: ActivityEvent[];
}

const getIcon = (type: string) => {
  switch (type) {
    case "new_citation":
      return CheckCircle;
    case "competitor_alert":
      return TrendingUp;
    case "traffic_increase":
      return TrendingUp;
    case "new_source":
      return Target;
    case "citation_lost":
      return AlertCircle;
    default:
      return Target;
  }
};

const getStatusColor = (type: string) => {
  switch (type) {
    case "new_citation":
    case "traffic_increase":
    case "new_source":
      return "text-accent";
    case "competitor_alert":
    case "citation_lost":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "new_citation":
      return "default";
    case "competitor_alert":
      return "secondary";
    case "traffic_increase":
      return "default";
    case "new_source":
      return "outline";
    case "citation_lost":
      return "destructive";
    default:
      return "secondary";
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Activity */}
      <div className="lg:col-span-2">
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {activities.map((item, index) => {
              const Icon = getIcon(item.type);
              
              return (
                <div 
                  key={item.id}
                  className={cn(
                    "flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:border-border transition-all duration-200 bg-card/50 hover:bg-card animate-fade-in group"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Avatar className="h-10 w-10 bg-muted">
                    <AvatarFallback className="bg-primary/10">
                      <Icon className={cn("h-5 w-5", getStatusColor(item.type))} />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <Badge variant={getBadgeVariant(item.type)} className="text-xs">
                        {item.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="space-y-6">
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-foreground">
              Today's Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AI Citations Today</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="font-semibold text-accent">+23</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Citation Quality</span>
              <span className="font-semibold text-foreground">8.7/10</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Missed Opportunities</span>
              <Badge variant="destructive" className="text-xs">3</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary border-0 shadow-glow text-white">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold text-lg mb-2">AEO Insights Ready</h3>
            <p className="text-sm opacity-90 mb-4">
              Get AI-powered recommendations to increase your citation potential
            </p>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 border-0 text-white"
            >
              View AEO Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};