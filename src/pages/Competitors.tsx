import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Search, TrendingUp, TrendingDown, Eye, ExternalLink, Trash2, Users } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Competitors = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [newCompetitorDomain, setNewCompetitorDomain] = useState("");
  const [newCompetitorName, setNewCompetitorName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('projects');
      if (error) throw error;
      return data;
    }
  });

  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors', selectedDomainId],
    queryFn: async () => {
      const params = selectedDomainId ? `?domain_id=${selectedDomainId}` : '';
      const { data, error } = await supabase.functions.invoke(`competitors${params}`);
      if (error) throw error;
      return data;
    }
  });

  const addCompetitorMutation = useMutation({
    mutationFn: async (competitorData: { competitor_domain: string; competitor_name?: string; domain_id: string }) => {
      const { data, error } = await supabase.functions.invoke('competitors', {
        body: competitorData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      setIsAddDialogOpen(false);
      setNewCompetitorDomain("");
      setNewCompetitorName("");
      toast({
        title: "Competitor added",
        description: "The competitor has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add competitor",
        variant: "destructive",
      });
    }
  });

  const deleteCompetitorMutation = useMutation({
    mutationFn: async (competitorId: string) => {
      const { error } = await supabase.functions.invoke(`competitors/${competitorId}`, {
        method: 'DELETE'
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      toast({
        title: "Competitor removed",
        description: "The competitor has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove competitor",
        variant: "destructive",
      });
    }
  });

  const handleAddCompetitor = () => {
    if (!newCompetitorDomain.trim() || !selectedDomainId) return;
    
    addCompetitorMutation.mutate({
      competitor_domain: newCompetitorDomain.trim(),
      competitor_name: newCompetitorName.trim() || undefined,
      domain_id: selectedDomainId
    });
  };

  const handleDeleteCompetitor = (competitorId: string) => {
    if (confirm("Are you sure you want to remove this competitor?")) {
      deleteCompetitorMutation.mutate(competitorId);
    }
  };

  const filteredCompetitors = competitors?.filter((competitor: any) =>
    competitor.competitor_domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    competitor.competitor_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!projects || projects.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Competitor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project">Select Project *</Label>
                    <Select value={selectedDomainId} onValueChange={setSelectedDomainId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects?.map((project: any) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.display_name || project.domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="competitor_domain">Competitor Domain *</Label>
                    <Input
                      id="competitor_domain"
                      placeholder="competitor.com"
                      value={newCompetitorDomain}
                      onChange={(e) => setNewCompetitorDomain(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="competitor_name">Competitor Name (optional)</Label>
                    <Input
                      id="competitor_name"
                      placeholder="Competitor Company"
                      value={newCompetitorName}
                      onChange={(e) => setNewCompetitorName(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddCompetitor} 
                    disabled={!newCompetitorDomain.trim() || !selectedDomainId || addCompetitorMutation.isPending}
                    className="w-full"
                  >
                    {addCompetitorMutation.isPending ? "Adding..." : "Add Competitor"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
              <CardTitle>Competitors Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCompetitors.length > 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Analytics and comparison charts will be available once citation data is collected.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Add competitors to see comparison analytics here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCompetitors.length > 0 ? (
            <div className="grid gap-6">
              {filteredCompetitors.map((competitor: any) => (
                <Card key={competitor.id} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {competitor.competitor_name || competitor.competitor_domain}
                          </h3>
                          <Badge variant="outline">{competitor.competitor_domain}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                          Tracking against: {competitor.monitored_domains?.display_name || competitor.monitored_domains?.domain}
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCompetitor(competitor.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">-</div>
                        <div className="text-sm text-muted-foreground">Total Citations</div>
                        <div className="text-xs text-muted-foreground mt-1">Data collection in progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">-</div>
                        <div className="text-sm text-muted-foreground">Share of Voice</div>
                        <div className="text-xs text-muted-foreground mt-1">Data collection in progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">-</div>
                        <div className="text-sm text-muted-foreground">Quality Score</div>
                        <div className="text-xs text-muted-foreground mt-1">Data collection in progress</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Added {new Date(competitor.created_at).toLocaleDateString()}</span>
                      <Badge variant={competitor.is_active ? "default" : "secondary"}>
                        {competitor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-card border-0 shadow-custom-md text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Competitors Added</h3>
                <p className="text-muted-foreground mb-4">
                  {!projects || projects.length === 0 
                    ? "Add a project first, then add competitors to track their performance."
                    : "Add competitors to monitor how they're performing against your content."
                  }
                </p>
                {projects && projects.length > 0 && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Competitor
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Competitors;