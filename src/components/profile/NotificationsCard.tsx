
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  enabled: boolean;
}

interface NotificationsCardProps {
  notifications: NotificationSetting[];
  toggleNotification: (id: string) => void;
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications, toggleNotification }) => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated successfully."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive notifications and updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{notification.type}</h3>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <Switch 
                checked={notification.enabled} 
                onCheckedChange={() => toggleNotification(notification.id)}
              />
            </div>
            <Separator />
          </React.Fragment>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsCard;
