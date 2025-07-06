import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { DateRangeOption } from "@/types/dashboard";
import { TrendingUp, Target, Users, Award } from "lucide-react";

const Analytics = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeOption>("last_30_days");

  // Mock analytics data - in real app this would come from API
  const citationTrends = [
    { date: "Jan 1", citations: 45, quality: 38, traffic: 1200 },
    { date: "Jan 8", citations: 52, quality: 44, traffic: 1450 },
    { date: "Jan 15", citations: 48, quality: 41, traffic: 1300 },
    { date: "Jan 22", citations: 61, quality: 53, traffic: 1680 },
    { date: "Jan 29", citations: 58, quality: 49, traffic: 1590 },
  ];

  const engineDistribution = [
    { name: "Google SGE", value: 45, color: "#6366f1" },
    { name: "Perplexity", value: 28, color: "#10b981" },
    { name: "ChatGPT", value: 18, color: "#8b5cf6" },
    { name: "Bing Chat", value: 9, color: "#f59e0b" },
  ];

  const qualityBreakdown = [
    { category: "Authority Score", current: 22, previous: 19 },
    { category: "Relevance Score", current: 24, previous: 22 },
    { category: "Context Score", current: 21, previous: 20 },
    { category: "Position Score", current: 19, previous: 17 },
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">Deep dive into your AI citation performance</p>
            </div>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
          </div>

          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList>
              <TabsTrigger value="trends">Performance Trends</TabsTrigger>
              <TabsTrigger value="sources">Source Analysis</TabsTrigger>
              <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
              <TabsTrigger value="keywords">Keyword Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-card border-0 shadow-custom-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Citations</p>
                        <p className="text-2xl font-bold text-foreground">264</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-accent">+12.5%</span>
                        </div>
                      </div>
                      <Target className="h-8 w-8 text-primary opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-custom-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Quality Score</p>
                        <p className="text-2xl font-bold text-foreground">86</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-accent">+3.2%</span>
                        </div>
                      </div>
                      <Award className="h-8 w-8 text-primary opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-custom-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Citation Traffic</p>
                        <p className="text-2xl font-bold text-foreground">7,420</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-accent">+24.1%</span>
                        </div>
                      </div>
                      <Users className="h-8 w-8 text-primary opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-custom-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Position</p>
                        <p className="text-2xl font-bold text-foreground">2.1</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-accent">Improved</span>
                        </div>
                      </div>
                      <Target className="h-8 w-8 text-primary opacity-60" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle>Citation Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={citationTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Line type="monotone" dataKey="citations" stroke="#6366f1" strokeWidth={3} />
                        <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-0 shadow-custom-md">
                  <CardHeader>
                    <CardTitle>Citations by AI Engine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={engineDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {engineDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-custom-md">
                  <CardHeader>
                    <CardTitle>Engine Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {engineDistribution.map((engine) => (
                      <div key={engine.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: engine.color }}></div>
                          <span className="font-medium">{engine.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{engine.value}%</div>
                          <div className="text-sm text-muted-foreground">of citations</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle>Quality Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={qualityBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                        <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip />
                        <Bar dataKey="current" fill="#6366f1" name="Current Period" />
                        <Bar dataKey="previous" fill="#e2e8f0" name="Previous Period" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Analytics;