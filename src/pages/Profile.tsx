
import React, { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // Get onboarding data from localStorage
  const [onboardingDataString, setOnboardingDataString] = useState(localStorage.getItem('onboardingData') || '{}');
  const parsedOnboardingData = JSON.parse(onboardingDataString);
  
  // Mock user data combined with onboarding data
  const [userData, setUserData] = useState({
    name: localStorage.getItem('userName') || "Fashion Lover",
    email: "user@example.com",
    colorAnalysis: {
      skinTone: "Medium",
      undertone: "Warm",
      season: "Autumn"
    },
    stylePreferences: {
      favoriteColors: ["Blue", "Green", "Brown"],
      preferredStyles: parsedOnboardingData.stylePreferences || [],
      favoriteItems: ["Blazers", "Sneakers", "Jeans"]
    },
    notifications: {
      appNotifications: true,
      emailNotifications: false,
      styleUpdates: true,
      newFeatures: true
    },
    // Add onboarding data
    gender: parsedOnboardingData.gender || "",
    age: parsedOnboardingData.age || "",
    bodyShape: parsedOnboardingData.bodyShape || "",
    height: parsedOnboardingData.height || "",
    weight: parsedOnboardingData.weight || ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  const [isBodyShapeDialogOpen, setIsBodyShapeDialogOpen] = useState(false);
  
  const bodyShapeForm = useForm({
    defaultValues: {
      bodyShape: userData.bodyShape || ""
    }
  });
  
  const handleSaveProfile = () => {
    setUserData({
      ...userData,
      name
    });
    setIsEditing(false);
    
    // Update localStorage
    localStorage.setItem('userName', name);
    
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
  
  const handleBodyShapeSubmit = (data: { bodyShape: string }) => {
    setUserData({
      ...userData,
      bodyShape: data.bodyShape
    });
    
    // Update localStorage
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    onboardingData.bodyShape = data.bodyShape;
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    
    setIsBodyShapeDialogOpen(false);
    
    toast({
      title: "Body Shape Updated",
      description: "Your body shape has been updated successfully.",
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium mb-1 block">Gender</label>
                      <div className="text-lg">{userData.gender || "Not specified"}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium mb-1 block">Age</label>
                      <div className="text-lg">{userData.age || "Not specified"}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium mb-1 block">Body Shape</label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsBodyShapeDialogOpen(true)}
                          className="text-xs h-7"
                        >
                          {userData.bodyShape ? "Change" : "Add"}
                        </Button>
                      </div>
                      <div className="text-lg">
                        {userData.bodyShape || "Not specified"}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium mb-1 block">Height & Weight</label>
                      <div className="text-lg">
                        {userData.height && userData.weight 
                          ? `${userData.height} cm, ${userData.weight} kg` 
                          : "Not specified"}
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
      
      {/* Body Shape Dialog */}
      <Dialog open={isBodyShapeDialogOpen} onOpenChange={setIsBodyShapeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Body Shape</DialogTitle>
            <DialogDescription>
              Select the body shape that best represents you to get better style recommendations.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...bodyShapeForm}>
            <form onSubmit={bodyShapeForm.handleSubmit(handleBodyShapeSubmit)} className="space-y-6">
              <FormField
                control={bodyShapeForm.control}
                name="bodyShape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Shape</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a body shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pear">Pear</SelectItem>
                        <SelectItem value="Apple">Apple</SelectItem>
                        <SelectItem value="Rectangle">Rectangle</SelectItem>
                        <SelectItem value="Hourglass">Hourglass</SelectItem>
                        <SelectItem value="Inverted Triangle">Inverted Triangle</SelectItem>
                        <SelectItem value="Athletic">Athletic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us recommend clothing that flatters your body type.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profile;
