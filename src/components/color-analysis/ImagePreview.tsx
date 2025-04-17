
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  imageSrc: string;
  onRemove: () => void;
  buttonText?: string;
}

const ImagePreview = ({ imageSrc, onRemove, buttonText = "Remove Photo" }: ImagePreviewProps) => {
  return (
    <div className="relative max-w-sm">
      <img 
        src={imageSrc} 
        alt="Preview" 
        className="rounded-md max-h-[300px] object-contain mx-auto" 
      />
      <Button 
        variant="secondary" 
        className="mt-4"
        onClick={onRemove}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ImagePreview;
