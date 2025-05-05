
import React from 'react';

interface AvatarRendererProps {
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  faceShape: string;
  facialHair: string;
  eyeColor: string;
  outfit?: string;
  className?: string;
}

const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  hairStyle,
  hairColor,
  skinTone,
  faceShape,
  facialHair,
  eyeColor,
  outfit,
  className = ""
}) => {
  // Get color values for rendering
  const skinToneColor = getColorForTone(skinTone);
  const hairColorValue = getColorForHair(hairColor);
  const eyeColorValue = getColorForEye(eyeColor);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Base face shape */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-b z-10`}
        style={{ backgroundColor: skinToneColor }}
      />
      
      {/* Facial features based on face shape */}
      <div className="absolute inset-0 z-20">
        {renderFace(faceShape, eyeColorValue)}
      </div>
      
      {/* Hair style */}
      <div className="absolute inset-0 z-30">
        {renderHair(hairStyle, hairColorValue)}
      </div>
      
      {/* Facial hair if any */}
      {facialHair !== 'none' && (
        <div className="absolute inset-0 z-25">
          {renderFacialHair(facialHair, hairColorValue)}
        </div>
      )}
      
      {/* Outfit visualization if available */}
      {outfit && (
        <div className="absolute -bottom-[130%] left-0 right-0 z-5 h-[130%]">
          {renderOutfit(outfit)}
        </div>
      )}
    </div>
  );
};

// Helper function to get skin tone color
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

// Helper function to get hair color
function getColorForHair(color: string): string {
  const hairColors: Record<string, string> = {
    'black': '#090806',
    'brown': '#6A4E42',
    'blonde': '#FFC66E',
    'red': '#9C3D20',
    'white': '#E8E8E8',
    'gray': '#7C7C7C',
    'purple': '#9370DB',
    'blue': '#4682B4',
    'pink': '#FFB6C1'
  };
  return hairColors[color] || '#6A4E42';
}

// Helper function to get eye color
function getColorForEye(color: string): string {
  const eyeColors: Record<string, string> = {
    'brown': '#634e34',
    'blue': '#2c82c9',
    'green': '#3d9970',
    'hazel': '#977547',
    'gray': '#7c8c8d'
  };
  return eyeColors[color] || '#634e34';
}

// Render face features based on face shape
function renderFace(faceShape: string, eyeColor: string) {
  // Base styles for all face types
  const eyeBaseStyle = `absolute w-[18%] h-[12%] bg-white rounded-full overflow-hidden flex justify-center items-center`;
  const eyePupilStyle = `w-[60%] h-[60%] rounded-full`;
  const mouthStyle = `absolute w-[30%] h-[8%] bottom-[25%] left-[35%] bg-[#cc9999] rounded-full`;
  
  // Adjust eye positions based on face shape
  let eyePositions = {
    left: 'left-[25%] top-[35%]',
    right: 'right-[25%] top-[35%]'
  };
  
  // Adjust mouth based on face shape
  let mouthAdjust = '';
  
  switch(faceShape) {
    case 'round':
      mouthAdjust = 'h-[6%] w-[35%] left-[32.5%]';
      break;
    case 'square':
      eyePositions = {
        left: 'left-[25%] top-[32%]',
        right: 'right-[25%] top-[32%]'
      };
      mouthAdjust = 'h-[7%] w-[32%] left-[34%] bottom-[28%]';
      break;
    case 'heart':
      eyePositions = {
        left: 'left-[24%] top-[36%]',
        right: 'right-[24%] top-[36%]'
      };
      mouthAdjust = 'h-[6%] w-[28%] left-[36%] bottom-[22%]';
      break;
    case 'diamond':
      eyePositions = {
        left: 'left-[22%] top-[33%]',
        right: 'right-[22%] top-[33%]'
      };
      mouthAdjust = 'h-[7%] w-[30%] left-[35%] bottom-[26%]';
      break;
    case 'oval':
      // Default positions
      break;
    case 'triangle':
      eyePositions = {
        left: 'left-[28%] top-[34%]',
        right: 'right-[28%] top-[34%]'
      };
      mouthAdjust = 'h-[7%] w-[25%] left-[37.5%] bottom-[22%]';
      break;
  }
  
  return (
    <>
      {/* Left eye */}
      <div className={`${eyeBaseStyle} ${eyePositions.left}`}>
        <div className={eyePupilStyle} style={{ backgroundColor: eyeColor }}></div>
      </div>
      
      {/* Right eye */}
      <div className={`${eyeBaseStyle} ${eyePositions.right}`}>
        <div className={eyePupilStyle} style={{ backgroundColor: eyeColor }}></div>
      </div>
      
      {/* Nose */}
      <div className="absolute w-[8%] h-[15%] top-[42%] left-[46%] bg-transparent">
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-current opacity-20 rounded-full"></div>
      </div>
      
      {/* Mouth */}
      <div className={`${mouthStyle} ${mouthAdjust}`}></div>
    </>
  );
}

// Render hair based on hair style
function renderHair(hairStyle: string, hairColor: string) {
  // Base container for all hair styles
  const baseContainer = `absolute inset-0`;
  
  // Map of hair styles to their JSX representation
  switch(hairStyle) {
    case 'short':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-0 left-0 right-0 h-[35%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[15%] left-[-5%] w-[110%] h-[35%] rounded-full"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    case 'medium':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-0 left-0 right-0 h-[40%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[20%] left-[-10%] w-[120%] h-[40%] rounded-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[40%] left-[-5%] w-[15%] h-[40%] rounded-b-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[40%] right-[-5%] w-[15%] h-[40%] rounded-b-full"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    case 'long':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-0 left-0 right-0 h-[40%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[20%] left-[-10%] w-[120%] h-[40%] rounded-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[40%] left-[-8%] w-[18%] h-[60%] rounded-b-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[40%] right-[-8%] w-[18%] h-[60%] rounded-b-full"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    case 'curly':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-[-10%] left-[-15%] right-[-15%] h-[50%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[15%] left-[-20%] w-[140%] h-[45%] rounded-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div className="absolute top-[25%] left-[-15%] right-[-15%] h-[20%]">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[25%] h-[80%] rounded-full"
                style={{ 
                  backgroundColor: hairColor,
                  left: `${i * 12.5}%`,
                  transform: i % 2 ? 'translateY(-10%) rotate(15deg)' : 'translateY(5%) rotate(-15deg)'
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    
    case 'wavy':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-0 left-0 right-0 h-[40%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[20%] left-[-10%] w-[120%] h-[40%] rounded-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div className="absolute top-[40%] h-[60%] w-full">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[15%] h-[80%] rounded-b-full"
                style={{ 
                  backgroundColor: hairColor,
                  left: `${i * 17}%`,
                  height: `${60 + (i % 3) * 10}%`
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    
    case 'afro':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-[-25%] left-[-25%] w-[150%] h-[150%] rounded-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[15%] left-[10%] w-[80%] h-[80%] rounded-full"
            style={{ backgroundColor: 'transparent', boxShadow: `0 0 0 20px ${hairColor}` }}
          ></div>
        </div>
      );
    
    case 'braids':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-0 left-0 right-0 h-[35%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div className="absolute top-[30%] h-[100%] w-full">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[10%] rounded-b-full"
                style={{ 
                  backgroundColor: hairColor,
                  left: `${5 + i * 12}%`,
                  height: `${70 + (i % 4) * 10}%`
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    
    case 'bald':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-0 left-[10%] right-[10%] h-[20%] rounded-t-full opacity-10"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    default:
      // Default to short hair
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-0 left-0 right-0 h-[35%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute top-[15%] left-[-5%] w-[110%] h-[35%] rounded-full"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
  }
}

// Render facial hair based on style
function renderFacialHair(facialHair: string, hairColor: string) {
  // Base container for all facial hair styles
  const baseContainer = `absolute inset-0`;
  
  switch(facialHair) {
    case 'beard':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute bottom-[15%] left-[20%] right-[20%] h-[25%] rounded-b-full"
            style={{ backgroundColor: hairColor }}
          ></div>
          <div 
            className="absolute bottom-[30%] left-[20%] right-[20%] h-[10%]"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    case 'goatee':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute bottom-[15%] left-[40%] right-[40%] h-[15%] rounded-b-full"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    case 'mustache':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute top-[53%] left-[35%] right-[35%] h-[5%] rounded-t-full"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    case 'stubble':
      return (
        <div className={baseContainer}>
          <div 
            className="absolute bottom-[15%] left-[20%] right-[20%] h-[25%] rounded-b-full opacity-30"
            style={{ backgroundColor: hairColor }}
          ></div>
        </div>
      );
    
    default:
      return null;
  }
}

// Render outfit
function renderOutfit(outfitId: string) {
  // This would ideally use actual outfit images, but for now we create placeholder shapes
  // that are more visually appealing than just a colored box
  
  const outfits: Record<string, { color: string, type: string }> = {
    'casual1': { color: '#3498db', type: 'casual' },
    'formal1': { color: '#2c3e50', type: 'formal' },
    'sport1': { color: '#e74c3c', type: 'sport' },
    'casual2': { color: '#27ae60', type: 'casual' },
    'formal2': { color: '#8e44ad', type: 'formal' },
    'sport2': { color: '#f39c12', type: 'sport' }
  };
  
  const outfit = outfits[outfitId] || { color: '#95a5a6', type: 'casual' };
  
  switch(outfit.type) {
    case 'formal':
      return (
        <div className="relative w-full h-full">
          {/* Suit jacket */}
          <div 
            className="absolute top-0 left-[10%] right-[10%] h-[60%] rounded-t-lg"
            style={{ backgroundColor: outfit.color }}
          />
          {/* Collar */}
          <div 
            className="absolute top-0 left-[30%] right-[30%] h-[20%] bg-white"
            style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' }}
          />
          {/* Shirt */}
          <div 
            className="absolute top-[15%] left-[40%] right-[40%] h-[45%] bg-white"
          />
          {/* Pants */}
          <div 
            className="absolute bottom-0 left-[25%] right-[25%] h-[40%] rounded-b-md"
            style={{ backgroundColor: outfit.color }}
          />
        </div>
      );
    
    case 'sport':
      return (
        <div className="relative w-full h-full">
          {/* Athletic top */}
          <div 
            className="absolute top-0 left-[15%] right-[15%] h-[50%] rounded-t-md"
            style={{ backgroundColor: outfit.color }}
          />
          {/* Shorts */}
          <div 
            className="absolute bottom-[10%] left-[20%] right-[20%] h-[35%] rounded-md"
            style={{ backgroundColor: `${outfit.color}cc` }}
          />
          {/* Stripe decoration */}
          <div 
            className="absolute top-[15%] left-[15%] w-[5%] h-[35%] bg-white opacity-50"
          />
          <div 
            className="absolute top-[15%] right-[15%] w-[5%] h-[35%] bg-white opacity-50"
          />
        </div>
      );
    
    case 'casual':
    default:
      return (
        <div className="relative w-full h-full">
          {/* T-shirt */}
          <div 
            className="absolute top-0 left-[15%] right-[15%] h-[50%] rounded-t-md"
            style={{ backgroundColor: outfit.color }}
          />
          {/* Sleeves */}
          <div 
            className="absolute top-[5%] left-[5%] w-[15%] h-[15%] rounded-l-full"
            style={{ backgroundColor: outfit.color }}
          />
          <div 
            className="absolute top-[5%] right-[5%] w-[15%] h-[15%] rounded-r-full"
            style={{ backgroundColor: outfit.color }}
          />
          {/* Jeans/pants */}
          <div 
            className="absolute bottom-0 left-[25%] right-[25%] h-[45%] rounded-b-sm"
            style={{ backgroundColor: '#3498db' }}
          />
        </div>
      );
  }
}

export default AvatarRenderer;
