
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserData } from '@/hooks/useUserData';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';
import StylePreferencesCard from '@/components/profile/StylePreferencesCard';
import NotificationsCard from '@/components/profile/NotificationsCard';
import PrivacyCard from '@/components/profile/PrivacyCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { userData, updateUserData, toggleNotification } = useUserData();
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Check if this is a new user that needs to complete their profile
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (!savedUserData || Object.keys(JSON.parse(savedUserData)).length === 0) {
      setIsNewUser(true);
      setActiveTab("profile"); // Force the profile tab for new users
    }
  }, []);
  
  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
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
