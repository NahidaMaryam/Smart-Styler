
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, User } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AvatarRenderer from './AvatarRenderer';
import MannequinSelector from './MannequinSelector';
import ZmoAiTryOn from './ZmoAiTryOn';
import ReadyPlayerMeCreator from '../profile/ReadyPlayerMeCreator';
import { useUserData } from '@/hooks/useUserData';

interface VirtualTryOnProps {
  userItems: any[];
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ userItems }) => {
  const [activeTab, setActiveTab] = useState("mannequin");
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [savedLooks, setSavedLooks] = useState<any[]>([]);
  const [lookName, setLookName] = useState("");
  const [isZmoAiTryOnOpen, setIsZmoAiTryOnOpen] = useState(false);
  const [isReadyPlayerMeOpen, setIsReadyPlayerMeOpen] = useState(false);
  const [mannequinSettings, setMannequinSettings] = useState({
    type: "female",
    bodyType: "medium"
  });
  const { toast } = useToast();
  const { userData, updateUserData } = useUserData();

  useEffect(() => {
    // Load saved looks from localStorage
    const savedLooksData = localStorage.getItem('savedAvatarLooks');
    if (savedLooksData) {
      setSavedLooks(JSON.parse(savedLooksData));
    }
  }, []);

  const tryOnOutfit = (itemId: string) => {
    setSelectedOutfit(itemId);
    toast({
      title: "Outfit Applied",
      description: "Your virtual mannequin is now wearing this outfit!",
    });
  };

  const handleMannequinSelect = (type: string, bodyType: string) => {
    setMannequinSettings({
      type,
      bodyType
    });
    toast({
      title: "Mannequin Updated",
      description: `Changed to ${type} mannequin with ${bodyType} body type.`,
    });
  };

  const saveAvatar = () => {
    if (!lookName.trim()) {
      toast({
        title: "Name Required",
        description: "Please give your look a name before saving.",
        variant: "destructive",
      });
      return;
    }
    
    const newLook = {
      id: Date.now().toString(),
      name: lookName,
      outfit: selectedOutfit,
      avatarUrl: userData.avatarUrl,
      zmoAvatarUrl: userData.zmoAvatarUrl,
      mannequinType: mannequinSettings.type,
      mannequinBodyType: mannequinSettings.bodyType
    };
    
    const updatedLooks = [...savedLooks, newLook];
    setSavedLooks(updatedLooks);
    localStorage.setItem('savedAvatarLooks', JSON.stringify(updatedLooks));
    setLookName("");
    
    toast({
      title: "Look Saved",
      description: "Your outfit and mannequin settings have been saved.",
    });
  };

  const loadSavedLook = (look: any) => {
    setSelectedOutfit(look.outfit);
    
    if (look.mannequinType && look.mannequinBodyType) {
      setMannequinSettings({
        type: look.mannequinType,
        bodyType: look.mannequinBodyType
      });
    }
    
    toast({
      title: "Look Applied",
      description: `Applied "${look.name}" to your mannequin.`,
    });
  };

  const handleZmoAvatarCreated = (avatarUrl: string) => {
    updateUserData({ zmoAvatarUrl: avatarUrl });
    
    toast({
      title: "Virtual Try-On Avatar Created",
      description: "Your ZMO.ai avatar has been saved and can now be used with your wardrobe items!",
    });
    
    setIsZmoAiTryOnOpen(false);
  };

  const handleRpmAvatarCreated = (avatarUrl: string) => {
    updateUserData({ avatarUrl });
    
    toast({
      title: "3D Avatar Created",
      description: "Your Ready Player Me avatar has been saved and can now be used with your wardrobe items!",
    });
    
    setIsReadyPlayerMeOpen(false);
  };

  // Sample outfits for demonstration
  const SAMPLE_OUTFITS = [
    { id: "casual1", name: "Casual Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Casual+1" },
    { id: "formal1", name: "Formal Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Formal+1" },
    { id: "sport1", name: "Sports Outfit 1", image: "https://placehold.co/200x300/e2e8f0/1e293b?text=Sports+1" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Virtual Try-On
        </CardTitle>
        <CardDescription>
          Try on clothes with our virtual mannequin or AI avatars
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
                    outfit={selectedOutfit}
                    avatarUrl={activeTab === "3d" ? userData.avatarUrl : undefined}
                    zmoAvatarUrl={activeTab === "ai" ? userData.zmoAvatarUrl : undefined}
                    mannequinType={activeTab === "mannequin" ? mannequinSettings.type : undefined}
                    mannequinBodyType={activeTab === "mannequin" ? mannequinSettings.bodyType : undefined}
                    className="transform scale-[1.8] translate-y-[20%]"
                  />
                ) : (
                  <AvatarRenderer
                    avatarUrl={activeTab === "3d" ? userData.avatarUrl : undefined}
                    zmoAvatarUrl={activeTab === "ai" ? userData.zmoAvatarUrl : undefined}
                    mannequinType={activeTab === "mannequin" ? mannequinSettings.type : undefined}
                    mannequinBodyType={activeTab === "mannequin" ? mannequinSettings.bodyType : undefined}
                    className="transform scale-125"
                  />
                )}
              </div>
            </div>
            
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  onClick={() => setIsReadyPlayerMeOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  {userData.avatarUrl ? "Change 3D Avatar" : "Create 3D Avatar"}
                </Button>
                
                <Button 
                  onClick={() => setIsZmoAiTryOnOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  {userData.zmoAvatarUrl ? "Change Try-On Avatar" : "Create Try-On Avatar"}
                </Button>
              </div>

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
                                outfit={look.outfit}
                                avatarUrl={look.avatarUrl}
                                zmoAvatarUrl={look.zmoAvatarUrl}
                                mannequinType={look.mannequinType}
                                mannequinBodyType={look.mannequinBodyType}
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
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="mannequin">
                  <User className="w-4 h-4 mr-2" />
                  Mannequin
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Shirt className="w-4 h-4 mr-2" />
                  AI Try-On
                </TabsTrigger>
                <TabsTrigger value="3d">
                  <User className="w-4 h-4 mr-2" />
                  3D Avatar
                </TabsTrigger>
              </TabsList>
              
              {/* Mannequin Tab */}
              <TabsContent value="mannequin" className="space-y-4 animate-fade-in">
                <MannequinSelector 
                  onSelect={handleMannequinSelect} 
                  selected={mannequinSettings} 
                />
              </TabsContent>
              
              {/* AI Try-On Tab */}
              <TabsContent value="ai" className="space-y-4 animate-fade-in">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {userData.zmoAvatarUrl ? (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Your AI-generated try-on avatar is ready. Try on outfits from the panel below.
                      </p>
                      <Button onClick={() => setIsZmoAiTryOnOpen(true)}>
                        Create New AI Avatar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Create an AI-powered try-on avatar by uploading your photo.
                      </p>
                      <Button onClick={() => setIsZmoAiTryOnOpen(true)}>
                        Create AI Try-On Avatar
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* 3D Avatar Tab */}
              <TabsContent value="3d" className="space-y-4 animate-fade-in">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {userData.avatarUrl ? (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Your 3D avatar is ready. Try on outfits from the panel below.
                      </p>
                      <Button onClick={() => setIsReadyPlayerMeOpen(true)}>
                        Create New 3D Avatar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Create a 3D avatar with Ready Player Me integration.
                      </p>
                      <Button onClick={() => setIsReadyPlayerMeOpen(true)}>
                        Create 3D Avatar
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Try On Your Wardrobe Items</h3>
              
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
                  Add items to your wardrobe to try them on your mannequin!
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
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-contain"
                      />
                      {selectedOutfit === outfit.id && 
                        <div className="absolute top-1 right-1 bg-primary rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      }
                    </div>
                    <p className="text-xs text-center">{outfit.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* ZMO.ai Virtual Try-On Dialog */}
      <ZmoAiTryOn 
        isOpen={isZmoAiTryOnOpen}
        onClose={() => setIsZmoAiTryOnOpen(false)}
        onAvatarCreated={handleZmoAvatarCreated}
        userItems={userItems}
      />

      {/* Ready Player Me Avatar Creator Dialog */}
      <ReadyPlayerMeCreator
        isOpen={isReadyPlayerMeOpen}
        onClose={() => setIsReadyPlayerMeOpen(false)}
        onAvatarCreated={handleRpmAvatarCreated}
      />
    </Card>
  );
};

export default VirtualTryOn;
