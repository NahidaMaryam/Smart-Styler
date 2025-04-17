import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Save, X } from 'lucide-react';
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
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

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

  const handleCameraCapture = async () => {
    try {
      if (cameraActive && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setImage(imageDataUrl);
        
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        setCameraActive(false);
        
        simulateAnalysis();
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" },
          audio: false 
        });
        
        setCameraStream(stream);
        setCameraActive(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        toast({
          title: "Camera Access Granted",
          description: "Your camera is now active. Center your face and click 'Take Photo'.",
        });
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access in your browser settings to use this feature.",
        variant: "destructive"
      });
    }
  };

  const handleCameraCancel = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      
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
                  Use your device's camera to take a well-lit photo. You'll need to grant camera permission.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {!cameraActive && !image && (
                  <Button onClick={handleCameraCapture} className="gap-2 mb-4">
                    <Camera className="w-4 h-4" />
                    {cameraStream ? "Take Photo" : "Access Camera"}
                  </Button>
                )}
                
                {cameraActive && (
                  <div className="relative w-full max-w-sm">
                    <div className="bg-black rounded-md overflow-hidden">
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="flex gap-2 mt-4 justify-center">
                      <Button onClick={handleCameraCapture} className="gap-2">
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </Button>
                      <Button variant="outline" onClick={handleCameraCancel} className="gap-2">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {!cameraActive && image && (
                  <div className="relative max-w-sm">
                    <img 
                      src={image} 
                      alt="Camera capture" 
                      className="rounded-md max-h-[300px] object-contain mx-auto" 
                    />
                    <Button 
                      variant="secondary" 
                      className="mt-4"
                      onClick={() => {
                        setImage(null);
                        setResults(null);
                      }}
                    >
                      Retake Photo
                    </Button>
                  </div>
                )}
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
