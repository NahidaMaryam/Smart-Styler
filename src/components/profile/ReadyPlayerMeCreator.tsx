
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ReadyPlayerMeCreatorProps {
  onAvatarCreated: (avatarUrl: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ReadyPlayerMeCreator: React.FC<ReadyPlayerMeCreatorProps> = ({ onAvatarCreated, onClose, isOpen }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for messages from the Ready Player Me iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source !== 'readyplayerme') {
        return;
      }
      
      console.log('Received message from Ready Player Me:', event.data);
      
      // Handle different message types
      switch (event.data.eventName) {
        case 'v1.frame.ready':
          setIsLoading(false);
          break;
          
        case 'v1.avatar.exported':
          // Avatar has been created and exported
          const avatarUrl = event.data.data.url;
          console.log('Avatar URL received:', avatarUrl);
          setAvatarUrl(avatarUrl);
          toast({
            title: "Avatar Created",
            description: "Your avatar has been successfully created!",
          });
          break;
          
        case 'v1.user.set':
          console.log('User set:', event.data);
          break;
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [toast]);
  
  const handleSaveAvatar = () => {
    if (avatarUrl) {
      onAvatarCreated(avatarUrl);
      toast({
        title: "Avatar Saved",
        description: "Your avatar has been saved to your profile.",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogTitle>Create Your Avatar</DialogTitle>
        <DialogDescription>
          Customize your 3D avatar using Ready Player Me
        </DialogDescription>
        
        <div className="relative flex-1 min-h-[500px] mt-4 rounded-md overflow-hidden border">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-2 text-lg font-medium">Loading avatar creator...</span>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src="https://readyplayer.me/avatar?frameApi"
            className="w-full h-full border-0"
            allow="camera; microphone; accelerometer; orientation"
            title="Ready Player Me Avatar Creator"
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAvatar} 
            disabled={!avatarUrl}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Avatar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadyPlayerMeCreator;
