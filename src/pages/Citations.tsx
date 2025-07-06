import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, ExternalLink, TrendingUp, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Citations = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: citations, isLoading } = useQuery({
    queryKey: ['citations'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('citations');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Citations</h1>
              <p className="text-muted-foreground">Track when your content gets cited by AI engines</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Keywords
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Citations</TabsTrigger>
                <TabsTrigger value="google-sge">Google SGE</TabsTrigger>
                <TabsTrigger value="perplexity">Perplexity</TabsTrigger>
                <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
                <TabsTrigger value="bing">Bing Chat</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search citations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="grid gap-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-full mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {citations?.map((citation: any) => (
                    <Card key={citation.id} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{citation.ai_engine}</Badge>
                              <Badge variant={citation.quality_score > 75 ? "default" : "secondary"}>
                                Quality: {citation.quality_score}/100
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Position #{citation.position}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg text-foreground">{citation.query}</h3>
                            <p className="text-muted-foreground">{citation.citation_text}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {citation.source_url && (
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4 text-accent" />
                                <span className="text-sm font-medium text-accent">+{citation.confidence}%</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(citation.discovered_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <Card className="bg-gradient-card border-0 shadow-custom-md text-center py-12">
                      <CardContent>
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Citations Found</h3>
                        <p className="text-muted-foreground mb-4">
                          Start by adding keywords to monitor for AI citations.
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Keywords
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Citations;