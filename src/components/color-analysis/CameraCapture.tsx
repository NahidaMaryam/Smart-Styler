
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onImageCapture: (imageDataUrl: string) => void;
}

const CameraCapture = ({ onImageCapture }: CameraCaptureProps) => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

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
        onImageCapture(imageDataUrl);
        
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        setCameraActive(false);
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

  return (
    <div className="flex flex-col items-center">
      {!cameraActive && (
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
    </div>
  );
};

export default CameraCapture;
