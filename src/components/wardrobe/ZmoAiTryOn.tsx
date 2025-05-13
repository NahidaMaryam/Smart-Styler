
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CameraCapture from "@/components/color-analysis/CameraCapture";
import { Camera, Upload, Loader2, Save, Image as ImageIcon } from "lucide-react";

interface ZmoAiTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarCreated: (avatarUrl: string) => void;
  userItems: any[];
}

const ZmoAiTryOn: React.FC<ZmoAiTryOnProps> = ({ 
  isOpen, 
  onClose, 
  onAvatarCreated,
  userItems 
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle camera capture
  const handleCameraCapture = (imageDataUrl: string) => {
    setPreviewUrl(imageDataUrl);
    setActiveTab("upload"); // Switch to upload tab to show the captured image
    
    toast({
      title: "Photo Captured",
      description: "Your photo has been captured successfully. Select an outfit to try on.",
    });
  };

  // Process the image with ZMO.ai API
  const processImage = async () => {
    if (!previewUrl) {
      toast({
        title: "No image selected",
        description: "Please upload or capture an image first",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOutfit) {
      toast({
        title: "No outfit selected",
        description: "Please select an outfit to try on",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call to ZMO.ai
      // In a real implementation, you would:
      // 1. Create a FormData object with the image
      // 2. Send it to your backend which would call ZMO.ai API
      // 3. Get back the processed image URL

      // For demonstration, we'll simulate a delay and then use a placeholder URL
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulating success response with a placeholder image
      const mockGeneratedAvatarUrl = "https://placehold.co/400x600/e2e8f0/1e293b?text=Virtual+Try-On+Result";
      setGeneratedAvatarUrl(mockGeneratedAvatarUrl);
      
      toast({
        title: "Avatar generated",
        description: "Your virtual try-on avatar has been created successfully!",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing failed",
        description: "An error occurred while processing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Save the generated avatar
  const saveAvatar = () => {
    if (generatedAvatarUrl) {
      onAvatarCreated(generatedAvatarUrl);
      toast({
        title: "Avatar saved",
        description: "Your virtual try-on avatar has been saved to your profile",
      });
      handleClose();
    }
  };

  // Clean up when closing the dialog
  const handleClose = () => {
    // Clean up any object URLs to prevent memory leaks
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedOutfit(null);
    setGeneratedAvatarUrl(null);
    setActiveTab("upload");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Virtual Try-On</DialogTitle>
          <DialogDescription>
            Upload your photo and try on clothes from your wardrobe
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!generatedAvatarUrl ? (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </TabsTrigger>
                  <TabsTrigger value="camera">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload" 
                      className="flex flex-col items-center justify-center cursor-pointer h-40"
                    >
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="h-full object-contain"
                        />
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="camera" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <CameraCapture onImageCapture={handleCameraCapture} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select outfit to try on:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                  {userItems.length > 0 ? (
                    userItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`cursor-pointer p-2 border rounded-md text-center ${selectedOutfit === item.id ? 'border-primary bg-primary/10' : 'hover:bg-accent/20'}`}
                        onClick={() => setSelectedOutfit(item.id)}
                      >
                        <div className="aspect-square relative mb-1">
                          <img 
                            src={item.image} 
                            alt={item.name || item.type} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-xs truncate">
                          {item.name || `${item.color} ${item.type}`}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-sm text-muted-foreground">
                      No wardrobe items available. Add items to your wardrobe first.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={processImage} 
                  disabled={!previewUrl || !selectedOutfit || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Try On Outfit"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <img 
                    src={generatedAvatarUrl} 
                    alt="Virtual Try-On Result" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setGeneratedAvatarUrl(null)}>
                  Try Another
                </Button>
                <Button onClick={saveAvatar}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Avatar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZmoAiTryOn;
