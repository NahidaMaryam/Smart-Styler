
import React, { useState } from 'react';
import { User } from 'lucide-react';

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
  zmoAvatarUrl?: string; // New prop for ZMO.ai avatar URL
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
  zmoAvatarUrl
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // Handle image load errors
  const handleImageError = () => {
    console.error("Failed to load avatar image:", zmoAvatarUrl);
    setImageError(true);
  };
  
  // If we have a ZMO.ai avatar URL, prioritize rendering that
  if (zmoAvatarUrl && !imageError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <img 
          src={zmoAvatarUrl}
          alt="Your Virtual Try-On Avatar" 
          className="w-full h-full object-contain"
          onError={handleImageError}
        />
      </div>
    );
  }
  
  // If no ZMO avatar but we have Ready Player Me avatar URL, render that
  if (avatarUrl) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <img 
          src={avatarUrl}
          alt="Your 3D Avatar" 
          className="w-full h-full object-contain"
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
