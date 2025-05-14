
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AvatarRendererProps {
  hairStyle?: string;
  hairColor?: string;
  skinTone?: string;
  faceShape?: string;
  facialHair?: string;
  eyeColor?: string;
  outfit?: string;
  className?: string;
  zmoAvatarUrl?: string; // URL for ZMO.ai avatar URL
  showTryOnOverlay?: boolean;
  mannequinType?: string;
  mannequinBodyType?: string;
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
  zmoAvatarUrl,
  showTryOnOverlay = false,
  mannequinType = "female",
  mannequinBodyType = "medium"
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [mannequinImageError, setMannequinImageError] = useState<boolean>(false);
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
  
  const handleMannequinImageError = () => {
    console.error("Failed to load mannequin image");
    setMannequinImageError(true);
    
    // Only show toast on initial error, not on every render
    if (!mannequinImageError) {
      toast({
        title: "Mannequin Load Error",
        description: "Failed to load the mannequin. Using fallback display.",
        variant: "destructive"
      });
    }
  };

  // Get the mannequin image URL with fallback
  const getMannequinImage = () => {
    // Use placeholder images if actual images aren't available
    if (mannequinType === 'male') {
      return mannequinImageError ? 
        `https://placehold.co/300x600/e2e8f0/1e293b?text=Male+${mannequinBodyType}+Mannequin` : 
        `/images/mannequin-${mannequinType}-${mannequinBodyType}.png`;
    } else {
      return mannequinImageError ? 
        `https://placehold.co/300x600/f9e0e9/1e293b?text=Female+${mannequinBodyType}+Mannequin` : 
        `/images/mannequin-${mannequinType}-${mannequinBodyType}.png`;
    }
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
  
  // Render the mannequin with outfit overlay
  if (mannequinType) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <img 
            src={getMannequinImage()}
            alt={`${mannequinType} ${mannequinBodyType} mannequin`}
            className="w-full h-full object-contain"
            onError={handleMannequinImageError}
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
                Virtual Try-On
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
