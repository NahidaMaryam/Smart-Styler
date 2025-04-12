
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

const PrivacyCard: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleDownloadData = () => {
    // Get all user data from localStorage
    const userData = localStorage.getItem('userData');
    const onboardingData = localStorage.getItem('onboardingData');
    
    // Create a JSON blob with the data
    const dataBlob = new Blob(
      [JSON.stringify({ userData: JSON.parse(userData || '{}'), onboarding: JSON.parse(onboardingData || '{}') }, null, 2)], 
      { type: 'application/json' }
    );
    
    // Create a download link and trigger download
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-styler-user-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Downloaded",
      description: "Your data has been downloaded successfully."
    });
  };
  
  const handleDeleteAccount = () => {
    // Clear all localStorage data
    localStorage.removeItem('userData');
    localStorage.removeItem('onboardingData');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('isSignedUp');
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Account Deleted",
      description: "All your data has been removed. You will be signed out."
    });
    
    // Redirect to login after a brief delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };
  
  return (
    <>
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
              <Button variant="outline" size="sm" className="mr-2" onClick={handleDownloadData}>
                <Download className="w-4 h-4 mr-2" />
                Download My Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your personal data and style preferences will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? You'll lose:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
              <li>Your personal profile information</li>
              <li>Style preferences and color analysis results</li>
              <li>Saved outfits and style history</li>
            </ul>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrivacyCard;
