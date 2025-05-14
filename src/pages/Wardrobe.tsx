
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, User } from 'lucide-react';
import WardrobeItems from '@/components/wardrobe/WardrobeItems';
import VirtualTryOn from '@/components/wardrobe/VirtualTryOn';
import OutfitSuggestions from '@/components/wardrobe/OutfitSuggestions';
import OutfitRecommendations from '@/components/wardrobe/OutfitRecommendations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface ClothingItem {
  id: string;
  image: string;
  type: string;
  color: string;
  season: string;
  tags: string[];
}

const Wardrobe = () => {
  const [mainTab, setMainTab] = useState<"items" | "avatar" | "outfits">("items");
  const [items, setItems] = useState<ClothingItem[]>([]);
  const { toast } = useToast();

  const handleAddItem = (item: ClothingItem) => {
    setItems(prev => [...prev, item]);
  };

  const handleTryOnItem = (itemId: string) => {
    setMainTab("avatar");
    toast({
      title: "Try-On Ready",
      description: "Switch to the virtual try-on tab to try on this item."
    });
  };

  return (
    <Layout>
      <PageContainer>
        <h1 className="text-3xl font-bold mb-2">My Wardrobe</h1>
        <p className="text-muted-foreground mb-8">
          Upload and manage your clothing items for personalized style recommendations.
        </p>
        
        {/* Main Navigation Tabs */}
        <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as "items" | "avatar" | "outfits")} className="w-full mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="items">
              <Shirt className="w-4 h-4 mr-2" />
              My Items
            </TabsTrigger>
            <TabsTrigger value="avatar">
              <User className="w-4 h-4 mr-2" />
              Virtual Try-On
            </TabsTrigger>
            <TabsTrigger value="outfits">
              <Shirt className="w-4 h-4 mr-2" />
              Outfit Ideas
            </TabsTrigger>
          </TabsList>
          
          {/* Items Tab Content */}
          <TabsContent value="items" className="animate-fade-in">
            <WardrobeItems 
              items={items} 
              onAddItem={handleAddItem} 
              onSelectItemForTryOn={handleTryOnItem}
            />
          </TabsContent>
          
          {/* Virtual Try-On Tab Content */}
          <TabsContent value="avatar" className="animate-fade-in">
            <VirtualTryOn userItems={items} />
          </TabsContent>
          
          {/* Outfits Tab Content */}
          <TabsContent value="outfits" className="animate-fade-in">
            <div className="space-y-8">
              {items.length > 0 ? (
                <>
                  <OutfitSuggestions items={items} />
                  <OutfitRecommendations userItems={items} />
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-10">
                      <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-70"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No items yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add items to your wardrobe to get outfit suggestions.
                      </p>
                      <Button size="sm" onClick={() => {
                        setMainTab("items");
                      }}>
                        Add Items
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </Layout>
  );
};

export default Wardrobe;
