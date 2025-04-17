
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useColorAnalysis } from '@/hooks/useColorAnalysis';

// Import the smaller components we've created
import ImageUploader from '@/components/color-analysis/ImageUploader';
import CameraCapture from '@/components/color-analysis/CameraCapture';
import ImagePreview from '@/components/color-analysis/ImagePreview';
import ResultsDisplay from '@/components/color-analysis/ResultsDisplay';
import LoadingIndicator from '@/components/color-analysis/LoadingIndicator';

const ColorAnalysis = () => {
  const {
    image, 
    analyzing, 
    results, 
    handleImageUpload, 
    handleImageRemove
  } = useColorAnalysis();

  return (
    <Layout>
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6">Face Color Analysis</h1>
        <p className="text-muted-foreground mb-8">
          Discover the colors that complement your skin tone and enhance your natural beauty.
          Upload a well-lit photo of your face for best results.
        </p>
        
        <Tabs defaultValue="upload" className="max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload Photo</TabsTrigger>
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="animate-fade-in">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Upload a Photo</CardTitle>
                <CardDescription>
                  Select a clear, well-lit photo of your face without makeup for the most accurate results.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {!image ? (
                  <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                  <ImagePreview 
                    imageSrc={image}
                    onRemove={handleImageRemove}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="camera" className="animate-fade-in">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Take a Photo</CardTitle>
                <CardDescription>
                  Use your device's camera to take a well-lit photo. You'll need to grant camera permission.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {!image ? (
                  <CameraCapture onImageCapture={handleImageUpload} />
                ) : (
                  <ImagePreview 
                    imageSrc={image}
                    onRemove={handleImageRemove}
                    buttonText="Retake Photo"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {analyzing && <LoadingIndicator />}
        
        {results && <ResultsDisplay results={results} />}
      </PageContainer>
    </Layout>
  );
};

export default ColorAnalysis;
