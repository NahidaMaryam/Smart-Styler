
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileUpload} 
      />
      
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        className="mb-4 gap-2"
      >
        <Upload className="w-4 h-4" />
        Select Photo
      </Button>
    </>
  );
};

export default ImageUploader;
