import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { User, Bell, Shield, CreditCard, Globe, Mail, Smartphone } from "lucide-react";

const Settings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState({
    newCitations: true,
    competitorAlerts: true,
    weeklyReport: true,
    qualityDrops: true
  });

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Tech Corp",
    timezone: "UTC-8"
  });

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>New Citations</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new AI citations are detected
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newCitations}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newCitations: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Competitor Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when competitors gain new citations
                      </p>
                    </div>
                    <Switch
                      checked={notifications.competitorAlerts}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, competitorAlerts: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly performance summaries
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Quality Drops</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when citation quality scores drop
                      </p>
                    </div>
                    <Switch
                      checked={notifications.qualityDrops}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, qualityDrops: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domains" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Monitored Domains</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium">example.com</div>
                      <div className="text-sm text-muted-foreground">Primary domain</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>Active</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add New Domain
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Billing & Subscription</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Current Plan</div>
                      <div className="text-sm text-muted-foreground">Pro Plan - $99/month</div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Citations Tracked</span>
                      <span>2,847 / 10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domains Monitored</span>
                      <span>1 / 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Members</span>
                      <span>1 / 10</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button>Upgrade Plan</Button>
                    <Button variant="outline">View Billing History</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Change Password</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="password" placeholder="Current password" />
                        <Input type="password" placeholder="New password" />
                      </div>
                      <Button size="sm">Update Password</Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Active Sessions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="font-medium">Current Session</div>
                          <div className="text-sm text-muted-foreground">Chrome on MacOS</div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
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

export default Settings;