
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shirt, Edit, Scissors, Image, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AvatarRenderer from './AvatarRenderer';

// Define avatar parts and options
const HAIR_STYLES = ["short", "medium", "long", "curly", "wavy", "afro", "braids", "bald"];
const SKIN_TONES = ["light", "fair", "medium", "olive", "tan", "brown", "dark"];
const FACE_SHAPES = ["oval", "round", "square", "heart", "diamond", "triangle"];
const FACIAL_HAIR = ["none", "stubble", "mustache", "beard", "goatee"];
const EYE_COLORS = ["brown", "blue", "green", "hazel", "gray"];
const HAIR_COLORS = ["black", "brown", "blonde", "red", "white", "gray", "purple", "blue", "pink"];

// Define sample outfits for the avatar to try on
const SAMPLE_OUTFITS = [
  { id: "casual1", name: "Casual Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Casual+1" },
  { id: "formal1", name: "Formal Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Formal+1" },
  { id: "sport1", name: "Sports Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Sports+1" },
  { id: "casual2", name: "Casual Outfit 2", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Casual+2" },
  { id: "formal2", name: "Formal Outfit 2", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Formal+2" },
  { id: "sport2", name: "Sports Outfit 2", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Sports+2" },
];

interface AvatarCreatorProps {
  userItems: any[];
}

// Avatar component
const AvatarCreator: React.FC<AvatarCreatorProps> = ({ userItems }) => {
  const [activeTab, setActiveTab] = useState("customize");
  const [customizeSection, setCustomizeSection] = useState("hair");
  const [hairStyle, setHairStyle] = useState("medium");
  const [hairColor, setHairColor] = useState("brown");
  const [skinTone, setSkinTone] = useState("medium");
  const [faceShape, setFaceShape] = useState("oval");
  const [facialHair, setFacialHair] = useState("none");
  const [eyeColor, setEyeColor] = useState("brown");
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [savedLooks, setSavedLooks] = useState<any[]>([]);
  const [lookName, setLookName] = useState("");
  const { toast } = useToast();

  const tryOnOutfit = (itemId: string) => {
    setSelectedOutfit(itemId);
    toast({
      title: "Outfit Applied",
      description: "Your virtual avatar is now wearing this outfit!",
    });
  };

  const saveAvatar = () => {
    if (!lookName.trim()) {
      toast({
        title: "Name Required",
        description: "Please give your avatar look a name before saving.",
        variant: "destructive",
      });
      return;
    }
    
    const newLook = {
      id: Date.now().toString(),
      name: lookName,
      hairStyle, 
      hairColor, 
      skinTone, 
      faceShape,
      facialHair,
      eyeColor,
      outfit: selectedOutfit,
    };
    
    setSavedLooks(prev => [...prev, newLook]);
    setLookName("");
    
    toast({
      title: "Look Saved",
      description: "Your avatar customizations have been saved.",
    });
  };

  const loadSavedLook = (look: any) => {
    setHairStyle(look.hairStyle);
    setHairColor(look.hairColor);
    setSkinTone(look.skinTone);
    setFaceShape(look.faceShape);
    setFacialHair(look.facialHair);
    setEyeColor(look.eyeColor);
    if (look.outfit) setSelectedOutfit(look.outfit);
    
    toast({
      title: "Look Applied",
      description: `Applied "${look.name}" to your avatar.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          My Instagram Avatar
        </CardTitle>
        <CardDescription>
          Customize your avatar and try on clothes from your wardrobe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center lg:w-1/3">
            <div className="relative w-64 h-64 mb-4 bg-gradient-to-br from-purple-500 to-violet-800 rounded-full overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105">
              <div className="absolute inset-1 rounded-full bg-white/95 overflow-hidden flex items-center justify-center">
                {selectedOutfit ? (
                  <AvatarRenderer
                    hairStyle={hairStyle}
                    hairColor={hairColor}
                    skinTone={skinTone}
                    faceShape={faceShape}
                    facialHair={facialHair}
                    eyeColor={eyeColor}
                    outfit={selectedOutfit}
                    className="transform scale-[1.8] translate-y-[20%]"
                  />
                ) : (
                  <AvatarRenderer
                    hairStyle={hairStyle}
                    hairColor={hairColor}
                    skinTone={skinTone}
                    faceShape={faceShape}
                    facialHair={facialHair}
                    eyeColor={eyeColor}
                    className="transform scale-125"
                  />
                )}
              </div>
            </div>
            
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Name this look..."
                  value={lookName}
                  onChange={(e) => setLookName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button onClick={saveAvatar} className="w-24">Save</Button>
              </div>
              
              {savedLooks.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Saved Looks</h4>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {savedLooks.map((look) => (
                        <CarouselItem key={look.id} className="basis-1/3">
                          <div 
                            className="p-1 cursor-pointer" 
                            onClick={() => loadSavedLook(look)}
                          >
                            <div className="aspect-square rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary">
                              <AvatarRenderer
                                hairStyle={look.hairStyle}
                                hairColor={look.hairColor}
                                skinTone={look.skinTone}
                                faceShape={look.faceShape}
                                facialHair={look.facialHair}
                                eyeColor={look.eyeColor}
                                outfit={look.outfit}
                              />
                            </div>
                            <p className="text-xs text-center mt-1 truncate">{look.name}</p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 h-7 w-7" />
                    <CarouselNext className="-right-4 h-7 w-7" />
                  </Carousel>
                </div>
              )}
            </div>
          </div>
          
          {/* Customization Controls */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="customize">
                  <Edit className="w-4 h-4 mr-2" />
                  Customize Avatar
                </TabsTrigger>
                <TabsTrigger value="tryOn">
                  <Shirt className="w-4 h-4 mr-2" />
                  Try On Outfits
                </TabsTrigger>
              </TabsList>
              
              {/* Customize Tab */}
              <TabsContent value="customize" className="space-y-4 animate-fade-in">
                <Tabs value={customizeSection} onValueChange={setCustomizeSection}>
                  <TabsList className="mb-4 flex-wrap">
                    <TabsTrigger value="hair">Hair</TabsTrigger>
                    <TabsTrigger value="face">Face</TabsTrigger>
                    <TabsTrigger value="skin">Skin</TabsTrigger>
                    <TabsTrigger value="eyes">Eyes</TabsTrigger>
                    <TabsTrigger value="facial">Facial Hair</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="hair" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hair Style</label>
                      <div className="grid grid-cols-4 gap-2">
                        {HAIR_STYLES.map(style => (
                          <div 
                            key={style}
                            className={`cursor-pointer p-2 border rounded-lg text-center text-sm relative ${hairStyle === style ? 'border-primary bg-primary/10' : 'hover:bg-accent/20'}`}
                            onClick={() => setHairStyle(style)}
                          >
                            {hairStyle === style && <Check className="absolute top-1 right-1 w-3 h-3 text-primary" />}
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hair Color</label>
                      <div className="grid grid-cols-5 gap-2">
                        {HAIR_COLORS.map(color => (
                          <div 
                            key={color}
                            className={`cursor-pointer aspect-square rounded-full border-2 ${hairColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setHairColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Face Tab */}
                  <TabsContent value="face" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Face Shape</label>
                      <div className="grid grid-cols-3 gap-2">
                        {FACE_SHAPES.map(shape => (
                          <div 
                            key={shape}
                            className={`cursor-pointer p-2 border rounded-lg text-center text-sm relative ${faceShape === shape ? 'border-primary bg-primary/10' : 'hover:bg-accent/20'}`}
                            onClick={() => setFaceShape(shape)}
                          >
                            {faceShape === shape && <Check className="absolute top-1 right-1 w-3 h-3 text-primary" />}
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Skin Tab */}
                  <TabsContent value="skin" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Skin Tone</label>
                      <div className="grid grid-cols-7 gap-2">
                        {SKIN_TONES.map(tone => (
                          <div 
                            key={tone}
                            className={`cursor-pointer aspect-square rounded-full border ${skinTone === tone ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            style={{ backgroundColor: getColorForTone(tone) }}
                            onClick={() => setSkinTone(tone)}
                          />
                        ))}
                      </div>
                      <div className="text-center text-sm mt-2">
                        {skinTone.charAt(0).toUpperCase() + skinTone.slice(1)}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Eyes Tab */}
                  <TabsContent value="eyes" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Eye Color</label>
                      <div className="grid grid-cols-5 gap-2">
                        {EYE_COLORS.map(color => (
                          <div 
                            key={color}
                            className={`cursor-pointer aspect-square rounded-full border ${eyeColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEyeColor(color)}
                          />
                        ))}
                      </div>
                      <div className="text-center text-sm mt-2">
                        {eyeColor.charAt(0).toUpperCase() + eyeColor.slice(1)}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Facial Hair Tab */}
                  <TabsContent value="facial" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Facial Hair</label>
                      <div className="grid grid-cols-3 gap-2">
                        {FACIAL_HAIR.map(style => (
                          <div 
                            key={style}
                            className={`cursor-pointer p-2 border rounded-lg text-center text-sm relative ${facialHair === style ? 'border-primary bg-primary/10' : 'hover:bg-accent/20'}`}
                            onClick={() => setFacialHair(style)}
                          >
                            {facialHair === style && <Check className="absolute top-1 right-1 w-3 h-3 text-primary" />}
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              {/* Try On Tab */}
              <TabsContent value="tryOn" className="animate-fade-in">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2">Your Wardrobe Items</h3>
                  
                  {userItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {userItems.map(item => (
                        <div 
                          key={item.id} 
                          className={`p-2 border rounded-lg cursor-pointer hover:bg-accent/20 transition-all ${selectedOutfit === item.id ? 'border-primary bg-primary/10' : ''}`}
                          onClick={() => tryOnOutfit(item.id)}
                        >
                          <div className="aspect-square bg-secondary relative rounded-md overflow-hidden mb-1">
                            <img 
                              src={item.image} 
                              alt={item.type} 
                              className="w-full h-full object-contain"
                            />
                            {selectedOutfit === item.id && 
                              <div className="absolute top-1 right-1 bg-primary rounded-full p-1">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            }
                          </div>
                          <p className="text-xs text-center truncate">
                            {item.color.charAt(0).toUpperCase() + item.color.slice(1)} {item.type.replace(/s$/, '')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Add items to your wardrobe to try them on your avatar!
                    </p>
                  )}
                  
                  <h3 className="text-sm font-medium mb-2 mt-4">Sample Outfits</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {SAMPLE_OUTFITS.map(outfit => (
                      <div 
                        key={outfit.id} 
                        className={`p-2 border rounded-lg cursor-pointer hover:bg-accent/20 transition-all ${selectedOutfit === outfit.id ? 'border-primary bg-primary/10' : ''}`}
                        onClick={() => tryOnOutfit(outfit.id)}
                      >
                        <div className="aspect-square bg-secondary relative rounded-md overflow-hidden mb-1">
                          {/* Replace placeholder with outfit visualization */}
                          <div className="w-full h-full flex items-center justify-center">
                            <AvatarRenderer
                              hairStyle={hairStyle}
                              hairColor={hairColor}
                              skinTone={skinTone}
                              faceShape={faceShape}
                              facialHair={facialHair}
                              eyeColor={eyeColor}
                              outfit={outfit.id}
                              className="transform scale-[0.6]"
                            />
                          </div>
                          {selectedOutfit === outfit.id && 
                            <div className="absolute top-1 right-1 bg-primary rounded-full p-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          }
                        </div>
                        <p className="text-xs text-center">{outfit.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
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

export default AvatarCreator;
