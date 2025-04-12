
import { useState, useEffect } from 'react';

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
  // Get onboarding data from localStorage
  const onboardingDataString = localStorage.getItem('onboardingData') || '{}';
  const parsedOnboardingData = JSON.parse(onboardingDataString);
  
  // Initial user data
  const [userData, setUserData] = useState<UserData>({
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
  
  // Effect to persist userData to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);
  
  // Update user data
  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      
      return updatedData;
    });
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
      
      return updatedData;
    });
  };
  
  return { userData, updateUserData, toggleNotification };
};
