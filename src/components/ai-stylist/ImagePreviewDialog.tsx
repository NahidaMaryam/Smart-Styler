
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ 
  open, 
  onOpenChange, 
  imageUrl 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggested Outfit</DialogTitle>
          <DialogDescription>
            Here's an outfit suggestion based on our conversation.
          </DialogDescription>
        </DialogHeader>
        {imageUrl && (
          <div className="flex justify-center p-4">
            <img 
              src={imageUrl} 
              alt="Generated outfit suggestion" 
              className="rounded-lg max-h-[60vh] w-auto object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
