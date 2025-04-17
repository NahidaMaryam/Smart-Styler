
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define the user data interface
export interface UserData {
  name: string;
  email: string;
  colorAnalysis: {
    skinTone: string;
    undertone: string;
    season: string;
  };
  stylePreferences: {
    favoriteColors: string[];
    preferredStyles: string[];
    favoriteItems: string[];
  };
  notifications: {
    appNotifications: boolean;
    emailNotifications: boolean;
    styleUpdates: boolean;
    newFeatures: boolean;
  };
  gender: string;
  age: string;
  bodyShape: string;
  height: string;
  weight: string;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    colorAnalysis: {
      skinTone: "Medium",
      undertone: "Warm",
      season: "Autumn"
    },
    stylePreferences: {
      favoriteColors: [],
      preferredStyles: [],
      favoriteItems: []
    },
    notifications: {
      appNotifications: true,
      emailNotifications: false,
      styleUpdates: true,
      newFeatures: true
    },
    gender: "",
    age: "",
    bodyShape: "",
    height: "",
    weight: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch user data from Supabase on initial render
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session, try to load from localStorage as fallback
          loadFromLocalStorage();
          return;
        }
        
        // Get profile data from Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          loadFromLocalStorage();
          return;
        }
        
        if (profileData) {
          // Map the profile data to our UserData structure
          const updatedData: UserData = {
            name: profileData.full_name || localStorage.getItem('userName') || "Fashion Lover",
            email: profileData.email || session.user.email || "user@example.com",
            colorAnalysis: {
              skinTone: profileData.skin_tone || "Medium",
              undertone: profileData.undertone || "Warm",
              season: profileData.season || "Autumn"
            },
            stylePreferences: {
              favoriteColors: ["Blue", "Green", "Brown"],
              preferredStyles: [],
              favoriteItems: ["Blazers", "Sneakers", "Jeans"]
            },
            notifications: {
              appNotifications: true,
              emailNotifications: false,
              styleUpdates: true,
              newFeatures: true
            },
            gender: profileData.gender || "",
            age: profileData.age || "",
            bodyShape: profileData.body_shape || "",
            height: profileData.height || "",
            weight: profileData.weight || ""
          };
          
          // Get onboarding data from localStorage to merge
          const onboardingDataString = localStorage.getItem('onboardingData') || '{}';
          const parsedOnboardingData = JSON.parse(onboardingDataString);
          
          // Merge with onboarding data if available
          if (parsedOnboardingData.stylePreferences) {
            updatedData.stylePreferences.preferredStyles = parsedOnboardingData.stylePreferences;
          }
          
          if (parsedOnboardingData.gender && !updatedData.gender) {
            updatedData.gender = parsedOnboardingData.gender;
          }
          
          if (parsedOnboardingData.age && !updatedData.age) {
            updatedData.age = parsedOnboardingData.age;
          }
          
          if (parsedOnboardingData.bodyShape && !updatedData.bodyShape) {
            updatedData.bodyShape = parsedOnboardingData.bodyShape;
          }
          
          // Use localStorage data for other fields if available
          const localUserDataString = localStorage.getItem('userData');
          if (localUserDataString) {
            try {
              const localUserData = JSON.parse(localUserDataString);
              updatedData.stylePreferences = {
                ...updatedData.stylePreferences,
                ...localUserData.stylePreferences
              };
              updatedData.notifications = {
                ...updatedData.notifications,
                ...localUserData.notifications
              };
            } catch (e) {
              console.error('Error parsing saved user data:', e);
            }
          }
          
          setUserData(updatedData);
        } else {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Fallback function to load from localStorage
  const loadFromLocalStorage = () => {
    // First check if there's already saved userData
    const savedUserDataString = localStorage.getItem('userData');
    
    if (savedUserDataString) {
      try {
        setUserData(JSON.parse(savedUserDataString));
        return;
      } catch (e) {
        console.error('Error parsing saved user data:', e);
      }
    }
    
    // If no saved userData, use onboarding data + defaults
    const onboardingDataString = localStorage.getItem('onboardingData') || '{}';
    const parsedOnboardingData = JSON.parse(onboardingDataString);
    
    setUserData({
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
      gender: parsedOnboardingData.gender || "",
      age: parsedOnboardingData.age || "",
      bodyShape: parsedOnboardingData.bodyShape || "",
      height: parsedOnboardingData.height || "",
      weight: parsedOnboardingData.weight || ""
    });
  };
  
  // Update user data in both Supabase and localStorage
  const updateUserData = async (newData: Partial<UserData>) => {
    try {
      const updatedData = {
        ...userData,
        ...newData
      };
      
      setUserData(updatedData);
      
      // Save to localStorage as a fallback
      localStorage.setItem('userData', JSON.stringify(updatedData));
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Map our UserData structure to the profiles table structure
        const profileUpdateData: any = {};
        
        if (newData.name) profileUpdateData.full_name = newData.name;
        if (newData.email) profileUpdateData.email = newData.email;
        if (newData.gender) profileUpdateData.gender = newData.gender;
        if (newData.age) profileUpdateData.age = newData.age;
        if (newData.bodyShape) profileUpdateData.body_shape = newData.bodyShape;
        if (newData.height) profileUpdateData.height = newData.height;
        if (newData.weight) profileUpdateData.weight = newData.weight;
        
        if (newData.colorAnalysis) {
          if (newData.colorAnalysis.skinTone) profileUpdateData.skin_tone = newData.colorAnalysis.skinTone;
          if (newData.colorAnalysis.undertone) profileUpdateData.undertone = newData.colorAnalysis.undertone;
          if (newData.colorAnalysis.season) profileUpdateData.season = newData.colorAnalysis.season;
        }
        
        // Add updated_at timestamp
        profileUpdateData.updated_at = new Date().toISOString();
        
        // Update the profile in Supabase
        const { error } = await supabase
          .from('profiles')
          .update(profileUpdateData)
          .eq('id', session.user.id);
        
        if (error) {
          console.error('Error updating profile:', error);
          toast({
            title: "Error updating profile",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Error in updateUserData:', error);
      toast({
        title: "Error updating profile",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Toggle notification settings
  const toggleNotification = (key: keyof UserData['notifications']) => {
    setUserData(prevData => {
      const updatedData = {
        ...prevData,
        notifications: {
          ...prevData.notifications,
          [key]: !prevData.notifications[key]
        }
      };
      
      // Save to localStorage
      localStorage.setItem('userData', JSON.stringify(updatedData));
      
      return updatedData;
    });
  };
  
  return { userData, updateUserData, toggleNotification, isLoading };
};
