
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import { Shirt, Footprints, Tag, Upload, Plus, RefreshCw, Image } from 'lucide-react';

interface ClothingItem {
  id: string;
  image: string;
  type: string;
  color: string;
  season: string;
  tags: string[];
}

interface WardrobeItemsProps {
  items: ClothingItem[];
  onAddItem: (item: ClothingItem) => void;
  onSelectItemForTryOn: (itemId: string) => void;
}

const WardrobeItems: React.FC<WardrobeItemsProps> = ({ items, onAddItem, onSelectItemForTryOn }) => {
  const [itemsTab, setItemsTab] = useState("all");
  const [processing, setProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState("tops");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
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
          
          onAddItem(newItem);
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
    if (itemsTab === "all") return true;
    return item.type === itemsTab;
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Collapsible open={isUploadOpen} onOpenChange={setIsUploadOpen} className="w-full">
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setIsUploadOpen(!isUploadOpen)}>
              <CollapsibleTrigger asChild>
                <div className="flex justify-between items-center w-full">
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Add New Item
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {isUploadOpen ? 
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                        <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                     : 
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                        <path d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    }
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CardDescription>
                Upload a photo of your clothing item. Our AI will automatically remove the background.
              </CardDescription>
            </CardHeader>
            
            <CollapsibleContent>
              <CardContent className="space-y-4">
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
                      {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
                      {processing ? "Processing..." : "Upload Photo"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
      
      <div className="lg:col-span-2">
        <Tabs value={itemsTab} onValueChange={setItemsTab}>
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
                      <Button size="sm" onClick={() => {
                        setIsUploadOpen(true);
                        if (tab !== "all") setSelectedType(tab);
                        fileInputRef.current?.click();
                      }}>
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
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => onSelectItemForTryOn(item.id)}
                          >
                            Try On
                          </Button>
                        </div>
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
  );
};

export default WardrobeItems;
