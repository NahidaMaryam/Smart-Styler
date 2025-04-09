
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from '@/components/ui/avatar';
import { User, Edit2, Save, Bell, ShieldCheck, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // Mock user data (in a real app would come from auth/database)
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    colorAnalysis: {
      skinTone: "Medium",
      undertone: "Warm",
      season: "Autumn"
    },
    stylePreferences: {
      favoriteColors: ["Blue", "Green", "Brown"],
      preferredStyles: ["Casual", "Business Casual"],
      favoriteItems: ["Blazers", "Sneakers", "Jeans"]
    },
    notifications: {
      appNotifications: true,
      emailNotifications: false,
      styleUpdates: true,
      newFeatures: true
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  
  const handleSaveProfile = () => {
    setUserData({
      ...userData,
      name
    });
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  const toggleNotification = (key: keyof typeof userData.notifications) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [key]: !userData.notifications[key]
      }
    });
  };
  
  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground mb-8">
            Manage your personal information and style preferences.
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Style Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <User className="h-12 w-12" />
                      </Avatar>
                      <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        {isEditing ? (
                          <Input value={name} onChange={(e) => setName(e.target.value)} />
                        ) : (
                          <div className="text-lg">{userData.name}</div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <div className="text-lg">{userData.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Color Analysis Results</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <div className="font-medium text-sm mb-1">Skin Tone</div>
                        <div className="text-lg">{userData.colorAnalysis.skinTone}</div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <div className="font-medium text-sm mb-1">Undertone</div>
                        <div className="text-lg">{userData.colorAnalysis.undertone}</div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <div className="font-medium text-sm mb-1">Season</div>
                        <div className="text-lg">{userData.colorAnalysis.season}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <Link to="/color-analysis" className="underline">Re-analyze your colors</Link>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="ghost" onClick={() => {
                        setIsEditing(false);
                        setName(userData.name);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Style Preferences Tab */}
            <TabsContent value="preferences" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Style Preferences</CardTitle>
                  <CardDescription>
                    Customize your style preferences to get better recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Favorite Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.stylePreferences.favoriteColors.map((color, index) => (
                        <div key={index} className="px-3 py-1 rounded-full bg-secondary">
                          {color}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Preferred Styles</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.stylePreferences.preferredStyles.map((style, index) => (
                        <div key={index} className="px-3 py-1 rounded-full bg-secondary">
                          {style}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Favorite Clothing Items</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.stylePreferences.favoriteItems.map((item, index) => (
                        <div key={index} className="px-3 py-1 rounded-full bg-secondary">
                          {item}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and updates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">App Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications within the app
                      </p>
                    </div>
                    <Switch 
                      checked={userData.notifications.appNotifications} 
                      onCheckedChange={() => toggleNotification('appNotifications')}
                    />
                  </div>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch 
                      checked={userData.notifications.emailNotifications} 
                      onCheckedChange={() => toggleNotification('emailNotifications')}
                    />
                  </div>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Style Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified about seasonal style trends
                      </p>
                    </div>
                    <Switch 
                      checked={userData.notifications.styleUpdates} 
                      onCheckedChange={() => toggleNotification('styleUpdates')}
                    />
                  </div>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">New Features</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn about new app features and improvements
                      </p>
                    </div>
                    <Switch 
                      checked={userData.notifications.newFeatures} 
                      onCheckedChange={() => toggleNotification('newFeatures')}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Privacy Tab */}
            <TabsContent value="privacy" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Manage your data and privacy preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <ShieldCheck className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium mb-2">Your Data is Private</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Smart Styler respects your privacy. Your photos and personal information are used only to provide you with personalized style recommendations.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        We do not share your data with third parties or use it for advertising purposes.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Management Options</h3>
                    
                    <div>
                      <Button variant="outline" size="sm" className="mr-2">
                        Download My Data
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Profile;
