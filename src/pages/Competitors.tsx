import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Search, TrendingUp, TrendingDown, Eye, ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

const Competitors = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const competitors = [
    {
      id: 1,
      name: "TechInsider",
      domain: "techinsider.com",
      citations: 342,
      shareOfVoice: 28.5,
      trend: "up",
      change: "+12%",
      qualityScore: 84,
      topKeywords: ["AI technology", "Machine learning", "Tech trends"]
    },
    {
      id: 2,
      name: "Digital Marketing Hub",
      domain: "digitalmarketinghub.com",
      citations: 289,
      shareOfVoice: 22.1,
      trend: "up",
      change: "+8%",
      qualityScore: 79,
      topKeywords: ["Digital marketing", "SEO", "Content strategy"]
    },
    {
      id: 3,
      name: "Innovation Today",
      domain: "innovationtoday.net",
      citations: 195,
      shareOfVoice: 15.8,
      trend: "down",
      change: "-3%",
      qualityScore: 76,
      topKeywords: ["Innovation", "Startups", "Technology"]
    }
  ];

  const competitorTrends = [
    { date: "Jan 1", yours: 248, techinsider: 312, dmhub: 267, innovation: 203 },
    { date: "Jan 8", yours: 262, techinsider: 325, dmhub: 275, innovation: 198 },
    { date: "Jan 15", yours: 271, techinsider: 338, dmhub: 284, innovation: 195 },
    { date: "Jan 22", yours: 285, techinsider: 342, dmhub: 289, innovation: 192 },
    { date: "Jan 29", yours: 298, techinsider: 356, dmhub: 295, innovation: 188 },
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Competitors</h1>
              <p className="text-muted-foreground">Monitor your competitive landscape</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search competitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card className="bg-gradient-card border-0 shadow-custom-md mb-6">
            <CardHeader>
              <CardTitle>Citation Trends Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={competitorTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="yours" stroke="#6366f1" strokeWidth={3} name="Your Site" />
                    <Line type="monotone" dataKey="techinsider" stroke="#10b981" strokeWidth={2} name="TechInsider" />
                    <Line type="monotone" dataKey="dmhub" stroke="#8b5cf6" strokeWidth={2} name="DM Hub" />
                    <Line type="monotone" dataKey="innovation" stroke="#f59e0b" strokeWidth={2} name="Innovation Today" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {competitors.map((competitor) => (
              <Card key={competitor.id} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{competitor.name}</h3>
                        <Badge variant="outline">{competitor.domain}</Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        {competitor.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-accent" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-sm font-medium ${competitor.trend === "up" ? "text-accent" : "text-destructive"}`}>
                          {competitor.change} this month
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Analyze
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{competitor.citations}</div>
                      <div className="text-sm text-muted-foreground">Total Citations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{competitor.shareOfVoice}%</div>
                      <div className="text-sm text-muted-foreground">Share of Voice</div>
                      <Progress value={competitor.shareOfVoice} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{competitor.qualityScore}</div>
                      <div className="text-sm text-muted-foreground">Quality Score</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Top Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {competitor.topKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Competitors;