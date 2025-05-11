
import React, { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shirt, Footprints, Tag, Upload, Plus, RefreshCw } from 'lucide-react';
import OutfitSuggestions from '@/components/wardrobe/OutfitSuggestions';
import AvatarCreator from '@/components/wardrobe/AvatarCreator';
import OutfitRecommendations from '@/components/wardrobe/OutfitRecommendations';

interface ClothingItem {
  id: string;
  image: string;
  type: string;
  color: string;
  season: string;
  tags: string[];
}

const Wardrobe = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState("tops");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [customTag, setCustomTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const colorOptions = ["Red", "Blue", "Green", "Black", "White", "Navy", "Brown", "Gray", "Beige"];
  const seasonOptions = ["Spring", "Summer", "Fall", "Winter", "All Seasons"];
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProcessing(true);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          const imageUrl = reader.result as string;
          
          const newItem: ClothingItem = {
            id: Date.now().toString(),
            image: imageUrl,
            type: selectedType,
            color: selectedColor,
            season: selectedSeason,
            tags: customTag ? [customTag] : []
          };
          
          setItems(prev => [...prev, newItem]);
          setProcessing(false);
          
          if (fileInputRef.current) fileInputRef.current.value = '';
          setCustomTag("");
          
          toast({
            title: "Item Added",
            description: "Your clothing item has been added to your wardrobe.",
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const filteredItems = items.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });
  
  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case "tops":
        return <Shirt className="w-5 h-5" />;
      case "bottoms":
        return <Tag className="w-5 h-5 rotate-90" />;
      case "shoes":
        return <Footprints className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };
  
  return (
    <Layout>
      <PageContainer>
        <h1 className="text-3xl font-bold mb-2">My Wardrobe</h1>
        <p className="text-muted-foreground mb-8">
          Upload and manage your clothing items for personalized style recommendations.
        </p>
        
        {/* Avatar Creator and Virtual Try-On Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AvatarCreator userItems={items} />
          <OutfitRecommendations userItems={items} />
        </div>
        
        {items.length > 0 && (
          <OutfitSuggestions items={items} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add New Item</CardTitle>
                <CardDescription>
                  Upload a photo of your clothing item. Our AI will automatically remove the background.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Item Type</label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="bottoms">Bottoms</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Color</label>
                    <Select
                      value={selectedColor}
                      onValueChange={setSelectedColor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(color => (
                          <SelectItem key={color} value={color.toLowerCase()}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Season</label>
                    <Select
                      value={selectedSeason}
                      onValueChange={setSelectedSeason}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasonOptions.map(season => (
                          <SelectItem key={season} value={season.toLowerCase()}>
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Custom Tag (Optional)</label>
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="e.g., 'favorite', 'work', 'casual'"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full gap-2"
                      disabled={processing || !selectedType || !selectedColor || !selectedSeason}
                    >
                      {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {processing ? "Processing..." : "Upload Photo"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tops">Tops</TabsTrigger>
                <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                <TabsTrigger value="shoes">Shoes</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
                <TabsTrigger value="outerwear">Outerwear</TabsTrigger>
              </TabsList>
              
              {["all", "tops", "bottoms", "shoes", "accessories", "outerwear"].map((tab) => (
                <TabsContent key={tab} value={tab} className="animate-fade-in">
                  {filteredItems.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-10">
                          <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-muted-foreground opacity-70" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No items yet</h3>
                          <p className="text-muted-foreground mb-4">
                            {tab === "all" 
                              ? "Your wardrobe is empty. Upload some items to get started!" 
                              : `You don't have any ${tab} in your wardrobe yet.`}
                          </p>
                          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                            Add Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="aspect-square bg-secondary relative">
                            <img 
                              src={item.image} 
                              alt={`${item.color} ${item.type}`}
                              className="object-contain w-full h-full p-2"
                            />
                            <div className="absolute top-2 left-2 bg-background rounded-full p-1 shadow-sm">
                              {getItemTypeIcon(item.type)}
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="capitalize text-sm font-medium">
                                {item.color} {item.type.replace(/s$/, '')}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {item.season}
                              </div>
                            </div>
                            {item.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.tags.map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-0.5 bg-secondary rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Wardrobe;
