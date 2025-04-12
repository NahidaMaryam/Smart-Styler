
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Bell, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const notificationOptions = [
  {
    id: "styling-tips",
    label: "Styling tips",
    description: "Get daily and weekly style advice"
  },
  {
    id: "color-updates",
    label: "Color updates",
    description: "Learn about colors that match your profile"
  },
  {
    id: "seasonal-alerts",
    label: "Seasonal fashion alerts",
    description: "Stay updated with seasonal trends"
  },
  {
    id: "outfit-suggestions",
    label: "Outfit suggestions",
    description: "Receive personalized outfit ideas"
  }
];

const NotificationsPage = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  const toggleNotification = (notification: string) => {
    const currentNotifications = [...onboardingData.notifications];
    const index = currentNotifications.indexOf(notification as any);
    
    if (index > -1) {
      currentNotifications.splice(index, 1);
    } else {
      currentNotifications.push(notification as any);
    }
    
    updateOnboardingData({ notifications: currentNotifications });
  };
  
  const selectAll = () => {
    updateOnboardingData({ 
      notifications: notificationOptions.map(option => option.label) as any 
    });
  };
  
  const clearAll = () => {
    updateOnboardingData({ notifications: [] });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Stay Updated</h2>
        <p className="text-muted-foreground">Choose what notifications you'd like to receive.</p>
      </div>
      
      <div className="flex justify-between text-sm">
        <button 
          type="button" 
          onClick={selectAll} 
          className="text-primary hover:underline"
        >
          Select all
        </button>
        <button 
          type="button" 
          onClick={clearAll} 
          className="text-muted-foreground hover:underline"
        >
          Clear all
        </button>
      </div>
      
      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const isChecked = onboardingData.notifications.includes(option.label as any);
          
          return (
            <div key={option.id} className="flex items-center space-x-3">
              <Checkbox 
                id={option.id} 
                checked={isChecked}
                onCheckedChange={() => toggleNotification(option.label)}
              />
              <div className="grid gap-1">
                <Label htmlFor={option.id} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <p className="text-sm">
            You can always adjust your notification preferences later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
