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

interface ActivityItem {
  id: string;
  type: "citation" | "competitor" | "alert" | "report";
  title: string;
  description: string;
  timestamp: string;
  status: "positive" | "negative" | "neutral";
  source?: string;
}

const activityData: ActivityItem[] = [
  {
    id: "1",
    type: "citation",
    title: "New AI citation detected",
    description: "Your content was cited by ChatGPT in response about Answer Engine Optimization",
    timestamp: "2 hours ago",
    status: "positive",
    source: "ChatGPT"
  },
  {
    id: "2", 
    type: "competitor",
    title: "Competitor gained citation",
    description: "CompetitorX was cited by Google SGE in 3 new responses about AI search",
    timestamp: "4 hours ago",
    status: "negative",
    source: "Google SGE"
  },
  {
    id: "3",
    type: "alert",
    title: "Citation opportunity missed",
    description: "Perplexity cited competitors but not your content for target keyword",
    timestamp: "6 hours ago",
    status: "negative"
  },
  {
    id: "4",
    type: "report",
    title: "Weekly AEO report ready",
    description: "Your Answer Engine Optimization performance summary is available",
    timestamp: "1 day ago",
    status: "neutral"
  },
  {
    id: "5",
    type: "citation",
    title: "High-authority AI citation",
    description: "Bing Chat cited your content as authoritative source in 12 responses",
    timestamp: "2 days ago",
    status: "positive",
    source: "Bing Chat"
  }
];

const getIcon = (type: string, status: string) => {
  switch (type) {
    case "citation":
      return status === "positive" ? CheckCircle : Target;
    case "competitor":
      return TrendingUp;
    case "alert":
      return AlertCircle;
    case "report":
      return Eye;
    default:
      return Target;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "positive":
      return "text-accent";
    case "negative":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "citation":
      return "default";
    case "competitor":
      return "secondary";
    case "alert":
      return "destructive";
    case "report":
      return "outline";
    default:
      return "secondary";
  }
};

export const ActivityFeed = () => {
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
            {activityData.map((item, index) => {
              const Icon = getIcon(item.type, item.status);
              
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
                      <Icon className={cn("h-5 w-5", getStatusColor(item.status))} />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <Badge variant={getBadgeVariant(item.type)} className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </span>
                      {item.source && (
                        <div className="flex items-center space-x-1 text-xs text-primary">
                          <span>{item.source}</span>  
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      )}
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