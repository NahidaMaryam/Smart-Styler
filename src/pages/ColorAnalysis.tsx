
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ColorAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<null | {
    skinTone: string;
    undertone: string;
    season: string;
    colorsToWear: string[];
    colorsToAvoid: string[];
  }>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would trigger the device camera
    // For now, we'll just show a message that it's not implemented
    toast({
      title: "Camera Feature",
      description: "The camera feature would be implemented with device camera access",
    });
  };

  const simulateAnalysis = () => {
    setAnalyzing(true);
    // Simulate analysis delay (in a real app, this would be an actual ML process)
    setTimeout(() => {
      setAnalyzing(false);
      
      // Mock results - in a real app, these would come from ML model
      setResults({
        skinTone: "Medium",
        undertone: "Warm",
        season: "Autumn",
        colorsToWear: ["Olive Green", "Terracotta", "Rust", "Gold", "Mustard"],
        colorsToAvoid: ["Bright Blue", "Fuchsia", "Neon Colors", "Pure White"]
      });
    }, 3000);
  };

  const handleSaveResults = () => {
    toast({
      title: "Results Saved",
      description: "Your color analysis results have been saved to your profile.",
    });
  };

  const renderColorBox = (color: string) => {
    // Map color names to actual color values
    const colorMap: Record<string, string> = {
      "Olive Green": "#556B2F",
      "Terracotta": "#E2725B",
      "Rust": "#B7410E",
      "Gold": "#D4AF37",
      "Mustard": "#E1AD01",
      "Bright Blue": "#0096FF",
      "Fuchsia": "#FF00FF",
      "Neon Colors": "#39FF14",
      "Pure White": "#FFFFFF"
    };
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className="w-12 h-12 rounded-md border"
          style={{ backgroundColor: colorMap[color] || color }}
        ></div>
        <span className="text-xs mt-1">{color}</span>
      </div>
    );
  };

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
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
                
                {!image ? (
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="mb-4 gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Select Photo
                  </Button>
                ) : (
                  <div className="relative max-w-sm">
                    <img 
                      src={image} 
                      alt="Uploaded face" 
                      className="rounded-md max-h-[300px] object-contain mx-auto" 
                    />
                    <Button 
                      variant="secondary" 
                      className="mt-4"
                      onClick={() => {
                        setImage(null);
                        setResults(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Remove Photo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="camera" className="animate-fade-in">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Take a Photo</CardTitle>
                <CardDescription>
                  Use your device's camera to take a well-lit photo.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Button onClick={handleCameraCapture} className="gap-2 mb-4">
                  <Camera className="w-4 h-4" />
                  Open Camera
                </Button>
                <div className="w-full max-w-sm h-[200px] bg-muted rounded-md flex items-center justify-center">
                  <Camera className="w-10 h-10 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {analyzing && (
          <div className="max-w-3xl mx-auto">
            <Card className="animate-pulse">
              <CardHeader>
                <CardTitle>Analyzing your image...</CardTitle>
                <CardDescription>
                  Our AI is processing your photo to detect your skin tone and color palette.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <div className="h-8 w-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {results && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Your Color Analysis Results</CardTitle>
                <CardDescription>
                  Based on your photo, we've analyzed your skin tone and determined your seasonal color palette.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <h3 className="font-medium text-sm mb-2">Skin Tone</h3>
                    <p className="text-xl font-semibold">{results.skinTone}</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <h3 className="font-medium text-sm mb-2">Undertone</h3>
                    <p className="text-xl font-semibold">{results.undertone}</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <h3 className="font-medium text-sm mb-2">Season</h3>
                    <p className="text-xl font-semibold">{results.season}</p>
                  </div>
                </div>
                
                <div className="mt-8 space-y-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Colors That Complement You</h3>
                    <div className="flex flex-wrap gap-4">
                      {results.colorsToWear.map((color, index) => (
                        <div key={`wear-${index}`}>
                          {renderColorBox(color)}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Colors To Avoid</h3>
                    <div className="flex flex-wrap gap-4">
                      {results.colorsToAvoid.map((color, index) => (
                        <div key={`avoid-${index}`}>
                          {renderColorBox(color)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="gap-2" onClick={handleSaveResults}>
                  <Save className="w-4 h-4" />
                  Save Results
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default ColorAnalysis;
