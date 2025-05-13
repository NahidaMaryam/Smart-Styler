import { useState, useEffect } from 'react';

interface ColorAnalysis {
  skinTone: string;
  undertone: string;
  season: string;
}

interface StylePreference {
  id: string;
  name: string;
  enabled: boolean;
}

interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  enabled: boolean;
}

export interface UserData {
  name: string;
  email: string;
  gender: string;
  age: string;
  bodyShape: string;
  height: string;
  weight: string;
  avatarUrl?: string;  // Ready Player Me avatar URL
  zmoAvatarUrl?: string; // ZMO.ai avatar URL
  colorAnalysis: ColorAnalysis;
  stylePreferences: StylePreference[];
  notifications: NotificationSetting[];
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    gender: '',
    age: '',
    bodyShape: '',
    height: '',
    weight: '',
    avatarUrl: '',
    zmoAvatarUrl: '',
    colorAnalysis: {
      skinTone: 'Medium',
      undertone: 'Neutral',
      season: 'Summer',
    },
    stylePreferences: [
      { id: '1', name: 'Casual', enabled: true },
      { id: '2', name: 'Formal', enabled: false },
      { id: '3', name: 'Bohemian', enabled: false },
      { id: '4', name: 'Minimalist', enabled: true },
      { id: '5', name: 'Streetwear', enabled: false },
      { id: '6', name: 'Vintage', enabled: false },
    ],
    notifications: [
      { 
        id: '1', 
        type: 'New Style Recommendations', 
        description: 'Get notified when new personalized style recommendations are available', 
        enabled: true 
      },
      { 
        id: '2', 
        type: 'Seasonal Updates', 
        description: 'Receive alerts about seasonal style changes and wardrobe updates', 
        enabled: true 
      },
      { 
        id: '3', 
        type: 'Color Analysis Tips', 
        description: 'Get tips related to your color analysis results', 
        enabled: false 
      },
      { 
        id: '4', 
        type: 'News & Offers', 
        description: 'Stay updated with the latest fashion news and special offers', 
        enabled: false 
      },
    ]
  });

  useEffect(() => {
    // Try to load saved user data from localStorage
    const savedUserData = localStorage.getItem('userData');
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const onboardingData = localStorage.getItem('onboardingData');
    
    if (savedUserData) {
      // If there's complete saved data, use it
      setUserData(JSON.parse(savedUserData));
    } else {
      // Otherwise patch together data from different sources
      const newUserData = { ...userData };
      
      if (savedName) newUserData.name = savedName;
      if (savedEmail) newUserData.email = savedEmail;
      
      if (onboardingData) {
        const parsedOnboardingData = JSON.parse(onboardingData);
        if (parsedOnboardingData.gender) newUserData.gender = parsedOnboardingData.gender;
        if (parsedOnboardingData.age) newUserData.age = parsedOnboardingData.age;
        if (parsedOnboardingData.bodyShape) newUserData.bodyShape = parsedOnboardingData.bodyShape;
        if (parsedOnboardingData.height) newUserData.height = parsedOnboardingData.height;
        if (parsedOnboardingData.weight) newUserData.weight = parsedOnboardingData.weight;
        if (parsedOnboardingData.avatarUrl) newUserData.avatarUrl = parsedOnboardingData.avatarUrl;
        if (parsedOnboardingData.zmoAvatarUrl) newUserData.zmoAvatarUrl = parsedOnboardingData.zmoAvatarUrl;
      }
      
      setUserData(newUserData);
    }
  }, []);

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (newData: Partial<UserData>) => {
    console.log("Updating user data:", newData);
    setUserData(prevUserData => ({ ...prevUserData, ...newData }));
  };

  const toggleNotification = (id: string) => {
    setUserData(prevUserData => {
      const updatedNotifications = prevUserData.notifications.map(notification => 
        notification.id === id 
          ? { ...notification, enabled: !notification.enabled } 
          : notification
      );
      
      return {
        ...prevUserData,
        notifications: updatedNotifications
      };
    });
  };

  return { userData, updateUserData, toggleNotification };
};
