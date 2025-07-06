import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Calendar, FileText, TrendingUp, Mail } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

const Reports = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const reports = [
    {
      id: 1,
      name: "Weekly Citation Summary",
      type: "summary",
      schedule: "weekly",
      lastGenerated: "2025-01-15",
      status: "active",
      recipients: 3
    },
    {
      id: 2,
      name: "Monthly Performance Report",
      type: "performance",
      schedule: "monthly",
      lastGenerated: "2025-01-01",
      status: "active",
      recipients: 5
    },
    {
      id: 3,
      name: "Competitor Analysis",
      type: "competitor",
      schedule: "bi-weekly",
      lastGenerated: "2025-01-10",
      status: "paused",
      recipients: 2
    }
  ];

  const templates = [
    {
      name: "Executive Summary",
      description: "High-level overview of citation performance",
      icon: TrendingUp,
      features: ["KPI overview", "Trend analysis", "Key insights"]
    },
    {
      name: "Detailed Analytics",
      description: "In-depth analysis with charts and metrics",
      icon: FileText,
      features: ["Full metrics", "Charts & graphs", "Recommendations"]
    },
    {
      name: "Competitor Insights",
      description: "Competitive analysis and benchmarking",
      icon: TrendingUp,
      features: ["Market share", "Competitor performance", "Opportunities"]
    }
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">Automated reporting and insights</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>

          <Tabs defaultValue="reports" className="space-y-6">
            <TabsList>
              <TabsTrigger value="reports">My Reports</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4">
                {reports.map((report) => (
                  <Card key={report.id} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg text-foreground">{report.name}</h3>
                            <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                              {report.status}
                            </Badge>
                            <Badge variant="outline">{report.type}</Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Every {report.schedule}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span>Last: {report.lastGenerated}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{report.recipients} recipients</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                  <Card key={index} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                        <template.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                      <p className="text-muted-foreground">{template.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {template.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full">Use Template</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle>Upcoming Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Weekly Citation Summary</h4>
                        <p className="text-sm text-muted-foreground">Due in 2 days</p>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Competitor Analysis</h4>
                        <p className="text-sm text-muted-foreground">Due in 5 days</p>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
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

export default Reports;