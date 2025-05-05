
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, TShirt, Edit, Scissors, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define avatar parts and options
const HAIR_STYLES = ["short", "medium", "long", "curly", "wavy"];
const SKIN_TONES = ["light", "medium", "tan", "dark"];
const FACE_SHAPES = ["oval", "round", "square", "heart"];

// Define sample outfits for the avatar to try on
const SAMPLE_OUTFITS = [
  { id: "casual1", name: "Casual Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Casual+1" },
  { id: "formal1", name: "Formal Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Formal+1" },
  { id: "sport1", name: "Sports Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Sports+1" },
];

interface AvatarCreatorProps {
  userItems: any[];
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ userItems }) => {
  const [activeTab, setActiveTab] = useState("customize");
  const [hairStyle, setHairStyle] = useState("medium");
  const [skinTone, setSkinTone] = useState("medium");
  const [faceShape, setFaceShape] = useState("oval");
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate avatar preview URL based on current settings
  const avatarUrl = `https://placehold.co/300x300/e2e8f0/1e293b?text=Avatar+Preview%0AHair:+${hairStyle}%0ASkin:+${skinTone}%0AFace:+${faceShape}`;

  const tryOnOutfit = (itemId: string) => {
    setSelectedOutfit(itemId);
    toast({
      title: "Outfit Applied",
      description: "Your virtual avatar is now wearing this outfit!",
    });
  };

  const saveAvatar = () => {
    toast({
      title: "Avatar Saved",
      description: "Your avatar customizations have been saved.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Virtual Avatar
        </CardTitle>
        <CardDescription>
          Customize your avatar and try on clothes from your wardrobe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-4 bg-secondary rounded-lg overflow-hidden">
              <img 
                src={selectedOutfit ? SAMPLE_OUTFITS.find(o => o.id === selectedOutfit)?.image : avatarUrl} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <Button onClick={saveAvatar} className="w-full">Save Avatar</Button>
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
                  <TShirt className="w-4 h-4 mr-2" />
                  Try On Outfits
                </TabsTrigger>
              </TabsList>
              
              {/* Customize Tab */}
              <TabsContent value="customize" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hair Style</label>
                  <Select value={hairStyle} onValueChange={setHairStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hair style" />
                    </SelectTrigger>
                    <SelectContent>
                      {HAIR_STYLES.map(style => (
                        <SelectItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skin Tone</label>
                  <Select value={skinTone} onValueChange={setSkinTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select skin tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKIN_TONES.map(tone => (
                        <SelectItem key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Face Shape</label>
                  <Select value={faceShape} onValueChange={setFaceShape}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select face shape" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACE_SHAPES.map(shape => (
                        <SelectItem key={shape} value={shape}>
                          {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              {/* Try On Tab */}
              <TabsContent value="tryOn">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2">Your Wardrobe Items</h3>
                  
                  {userItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {userItems.map(item => (
                        <div 
                          key={item.id} 
                          className="p-2 border rounded-lg cursor-pointer hover:bg-accent/20"
                          onClick={() => tryOnOutfit(item.id)}
                        >
                          <img 
                            src={item.image} 
                            alt={item.type} 
                            className="w-full h-20 object-contain mb-1"
                          />
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
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_OUTFITS.map(outfit => (
                      <div 
                        key={outfit.id} 
                        className="p-2 border rounded-lg cursor-pointer hover:bg-accent/20"
                        onClick={() => tryOnOutfit(outfit.id)}
                      >
                        <img 
                          src={outfit.image} 
                          alt={outfit.name} 
                          className="w-full h-20 object-contain mb-1"
                        />
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

export default AvatarCreator;
