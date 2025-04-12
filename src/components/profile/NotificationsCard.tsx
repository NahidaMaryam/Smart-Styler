
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

interface NotificationSettings {
  appNotifications: boolean;
  emailNotifications: boolean;
  styleUpdates: boolean;
  newFeatures: boolean;
}

interface NotificationsCardProps {
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications, toggleNotification }) => {
  return (
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
            checked={notifications.appNotifications} 
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
            checked={notifications.emailNotifications} 
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
            checked={notifications.styleUpdates} 
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
            checked={notifications.newFeatures} 
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
  );
};

export default NotificationsCard;
