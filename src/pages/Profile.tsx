
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserData } from '@/hooks/useUserData';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';
import StylePreferencesCard from '@/components/profile/StylePreferencesCard';
import NotificationsCard from '@/components/profile/NotificationsCard';
import PrivacyCard from '@/components/profile/PrivacyCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { userData, updateUserData, toggleNotification } = useUserData();
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if this is a new user that needs to complete their profile
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (!savedUserData || Object.keys(JSON.parse(savedUserData)).length === 0) {
      setIsNewUser(true);
      setActiveTab("profile"); // Force the profile tab for new users
    }
  }, []);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error logging out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Clear local storage items related to authentication
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        
        // Redirect to login page
        navigate('/login');
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
          <p className="text-muted-foreground mb-8">
            Manage your personal information and style preferences.
          </p>
          
          {isNewUser && (
            <Alert variant="default" className="mb-6 border-primary">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Complete your profile</AlertTitle>
              <AlertDescription>
                Please complete your profile information to get personalized style recommendations.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Style Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-fade-in">
              <PersonalInfoCard 
                userData={userData} 
                updateUserData={updateUserData} 
                isNewUser={isNewUser}
              />
            </TabsContent>
            
            {/* Style Preferences Tab */}
            <TabsContent value="preferences" className="animate-fade-in">
              <StylePreferencesCard 
                stylePreferences={userData.stylePreferences} 
                updateUserData={updateUserData}
              />
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="animate-fade-in">
              <NotificationsCard 
                notifications={userData.notifications} 
                toggleNotification={toggleNotification} 
              />
            </TabsContent>
            
            {/* Privacy Tab */}
            <TabsContent value="privacy" className="animate-fade-in">
              <PrivacyCard />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Profile;
