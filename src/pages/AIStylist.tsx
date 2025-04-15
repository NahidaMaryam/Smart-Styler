
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { useAIStylistChat } from '@/hooks/useAIStylistChat';
import ChatContainer from '@/components/ai-stylist/ChatContainer';
import ChatInput from '@/components/ai-stylist/ChatInput';
import ImagePreviewDialog from '@/components/ai-stylist/ImagePreviewDialog';

const AIStylist = () => {
  const [showGeneratedImage, setShowGeneratedImage] = useState(false);
  const [currentGeneratedImage, setCurrentGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const { 
    messages, 
    input, 
    isTyping, 
    apiError,
    fileInputRef,
    handleInputChange, 
    handleImageUpload, 
    handleUploadClick, 
    handleSubmit,
    handleRetry
  } = useAIStylistChat();

  const handleViewGeneratedImage = (imageUrl: string) => {
    setIsImageLoading(true);
    setCurrentGeneratedImage(imageUrl);
    setShowGeneratedImage(true);
    
    // Simulate image loading
    const img = new Image();
    img.onload = () => {
      setIsImageLoading(false);
    };
    img.onerror = () => {
      setIsImageLoading(false);
    };
    img.src = imageUrl;
  };
  
  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">AI Stylist Assistant</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get personalized outfit suggestions for any occasion, season, or style preference with Gemini 2.0. Just ask or upload an image!
            </p>
          </div>
          
          <Card className="border-2 h-[70vh] flex flex-col shadow-lg">
            <CardContent className="flex-grow overflow-y-auto p-0 h-full flex flex-col">
              <ChatContainer 
                messages={messages}
                isTyping={isTyping}
                apiError={apiError}
                onViewGeneratedImage={handleViewGeneratedImage}
                onRetry={handleRetry}
              />
              <ChatInput 
                input={input}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onUploadClick={handleUploadClick}
                fileInputRef={fileInputRef}
                onImageUpload={handleImageUpload}
                disabled={isTyping}
              />
            </CardContent>
          </Card>
          
          <ImagePreviewDialog
            open={showGeneratedImage}
            onOpenChange={setShowGeneratedImage}
            imageUrl={currentGeneratedImage}
            isLoading={isImageLoading}
          />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default AIStylist;
