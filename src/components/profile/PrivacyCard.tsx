
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { ShieldCheck } from 'lucide-react';

const PrivacyCard: React.FC = () => {
  return (
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
  );
};

export default PrivacyCard;
