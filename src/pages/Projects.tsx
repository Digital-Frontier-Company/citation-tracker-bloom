import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Globe, Trash2, BarChart3 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkAndFixUserProfile } from "@/utils/profileUtils";

const Projects = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('projects');
      if (error) throw error;
      return data;
    }
  });

  const addProjectMutation = useMutation({
    mutationFn: async (projectData: { domain: string; display_name?: string }) => {
      // Make sure user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log('Calling projects function with data:', projectData);
      
      const { data, error } = await supabase.functions.invoke('projects', {
        method: 'POST', // Explicitly specify POST method
        body: JSON.stringify(projectData), // Explicitly stringify the body
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}` // Explicitly include auth token
        }
      });
      
      console.log('Function response:', { data, error });
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsAddDialogOpen(false);
      setNewDomain("");
      setNewDisplayName("");
      toast({
        title: "Project added",
        description: "Your new project has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add project",
        variant: "destructive",
      });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase.functions.invoke(`projects/${projectId}`, {
        method: 'DELETE'
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project deleted",
        description: "The project has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  });

  const handleAddProject = async () => {
    if (!newDomain.trim()) return;
    
    try {
      // First, ensure user profile is set up correctly
      console.log('Checking user profile before adding project...');
      await checkAndFixUserProfile();
      console.log('Profile check completed successfully');
      
      // Now proceed with adding the project
      addProjectMutation.mutate({
        domain: newDomain.trim(),
        display_name: newDisplayName.trim() || undefined
      });
    } catch (error: any) {
      console.error('Profile check failed:', error);
      toast({
        title: "Profile Setup Error",
        description: error.message || "Failed to set up user profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const filteredProjects = projects?.filter((project: any) =>
    project.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground">Manage the domains you're tracking</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="domain">Domain *</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="display_name">Display Name (optional)</Label>
                    <Input
                      id="display_name"
                      placeholder="My Website"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddProject} 
                    disabled={!newDomain.trim() || addProjectMutation.isPending}
                    className="w-full"
                  >
                    {addProjectMutation.isPending ? "Adding..." : "Add Project"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-4"></div>
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: any) => (
                <Card key={project.id} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{project.display_name || project.domain}</CardTitle>
                          {project.display_name && (
                            <p className="text-sm text-muted-foreground">{project.domain}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={deleteProjectMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={project.is_active ? "default" : "secondary"}>
                          {project.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {project.monitoring_frequency || 'Daily'}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Added {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-card border-0 shadow-custom-md text-center py-12">
              <CardContent>
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first domain to start tracking AI citations.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Projects;