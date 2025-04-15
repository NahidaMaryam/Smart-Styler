
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  isLoading?: boolean;
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ 
  open, 
  onOpenChange, 
  imageUrl,
  isLoading = false
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
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Skeleton className="w-full h-[50vh] rounded-lg" />
          </div>
        ) : imageUrl ? (
          <div className="flex justify-center p-4">
            <img 
              src={imageUrl} 
              alt="Generated outfit suggestion" 
              className="rounded-lg max-h-[60vh] w-auto object-contain"
            />
          </div>
        ) : (
          <div className="flex justify-center p-4 text-center text-muted-foreground">
            <p>No image available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
