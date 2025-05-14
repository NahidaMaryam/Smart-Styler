
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface AvatarRendererProps {
  hairStyle?: string;
  hairColor?: string;
  skinTone?: string;
  faceShape?: string;
  facialHair?: string;
  eyeColor?: string;
  outfit?: string;
  className?: string;
  avatarUrl?: string; // URL for Ready Player Me avatar
  zmoAvatarUrl?: string; // URL for ZMO.ai avatar URL
  showTryOnOverlay?: boolean;
}

const AvatarRenderer: React.FC<AvatarRendererProps> = ({ 
  hairStyle = "medium",
  hairColor = "brown",
  skinTone = "medium",
  faceShape = "oval",
  facialHair = "none",
  eyeColor = "brown",
  outfit,
  className = "",
  avatarUrl,
  zmoAvatarUrl,
  showTryOnOverlay = false
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [rpmImageError, setRpmImageError] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle image load errors
  const handleZmoImageError = () => {
    console.error("Failed to load ZMO.ai avatar image:", zmoAvatarUrl);
    setImageError(true);
    toast({
      title: "Avatar Load Error",
      description: "Failed to load your try-on avatar. Please try generating it again.",
      variant: "destructive"
    });
  };
  
  const handleRpmImageError = () => {
    console.error("Failed to load Ready Player Me avatar image:", avatarUrl);
    setRpmImageError(true);
    toast({
      title: "Avatar Load Error",
      description: "Failed to load your 3D avatar. Please try generating it again.",
      variant: "destructive"
    });
  };
  
  // If we have a ZMO.ai avatar URL, prioritize rendering that
  if (zmoAvatarUrl && !imageError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <img 
            src={zmoAvatarUrl}
            alt="Your Virtual Try-On Avatar" 
            className="w-full h-full object-contain"
            onError={handleZmoImageError}
          />
          
          {showTryOnOverlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 flex items-end justify-center pb-2">
              <span className="text-white text-xs font-medium px-2 py-1 bg-black/30 rounded-full">
                Try-On Avatar
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // If no ZMO avatar but we have Ready Player Me avatar URL, render that
  if (avatarUrl && !rpmImageError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <img 
            src={avatarUrl}
            alt="Your 3D Avatar" 
            className="w-full h-full object-contain"
            onError={handleRpmImageError}
          />
          
          {outfit && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src={typeof outfit === 'string' && outfit.startsWith('http') 
                  ? outfit 
                  : `https://placehold.co/400x500/e2e8f0/1e293b?text=Outfit+${outfit}`}
                alt="Outfit"
                className="w-full h-full object-contain opacity-90"
              />
            </div>
          )}
          
          {showTryOnOverlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 flex items-end justify-center pb-2">
              <span className="text-white text-xs font-medium px-2 py-1 bg-black/30 rounded-full">
                3D Avatar
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default basic avatar rendering
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <div 
        className="rounded-full overflow-hidden" 
        style={{ 
          backgroundColor: getColorForTone(skinTone)
        }}
      >
        <User strokeWidth={1} className="w-full h-full p-2" />
      </div>
      
      {outfit && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={typeof outfit === 'string' && outfit.startsWith('http') 
              ? outfit 
              : `https://placehold.co/400x500/e2e8f0/1e293b?text=Outfit+${outfit}`}
            alt="Outfit"
            className="w-full h-full object-contain opacity-90"
          />
        </div>
      )}
    </div>
  );
};

// Helper function to get color values for skin tones
function getColorForTone(tone: string): string {
  const toneColors: Record<string, string> = {
    'light': '#FFF6E7',
    'fair': '#FFEAD0',
    'medium': '#F1C27D',
    'olive': '#E0AC69',
    'tan': '#C68642',
    'brown': '#8D5524',
    'dark': '#5A3921'
  };
  return toneColors[tone] || '#F1C27D';
}

export default AvatarRenderer;
