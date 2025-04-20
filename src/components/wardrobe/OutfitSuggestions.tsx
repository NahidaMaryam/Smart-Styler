
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Wand, RefreshCw, Star } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

interface ClothingItem {
  id: string;
  image: string;
  type: string;
  color: string;
  season: string;
  tags: string[];
}

interface OutfitSuggestionsProps {
  items: ClothingItem[];
}

const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({ items }) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [outfits, setOutfits] = useState<{top?: ClothingItem, bottom?: ClothingItem, shoes?: ClothingItem}[]>([]);
  const [occasion, setOccasion] = useState("casual");
  const [preference, setPreference] = useState("");
  const { userData } = useUserData();
  
  const generateOutfits = () => {
    setGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        // Filter items by type
        const tops = items.filter(item => item.type === "tops");
        const bottoms = items.filter(item => item.type === "bottoms");
        const shoes = items.filter(item => item.type === "shoes");
        
        if (tops.length === 0 || bottoms.length === 0) {
          toast({
            title: "Not enough clothes",
            description: "Please add at least one top and one bottom to generate outfits.",
            variant: "destructive"
          });
          setGenerating(false);
          return;
        }
        
        // Generate 1-3 outfits based on user's wardrobe
        const newOutfits = [];
        const outfitCount = Math.min(3, Math.max(1, Math.floor(tops.length / 2)));
        
        for (let i = 0; i < outfitCount; i++) {
          // Simple algorithm to find matching clothes
          // In a real app, this would use more sophisticated matching based on color theory, style, etc.
          let selectedTop;
          let selectedBottom;
          let selectedShoes;
          
          // Find matches based on occasion and color compatibility
          if (occasion === "formal") {
            selectedTop = tops.find(item => item.tags.includes("formal") || item.color === "white" || item.color === "black") || 
                         tops[Math.floor(Math.random() * tops.length)];
            selectedBottom = bottoms.find(item => item.tags.includes("formal") || item.color === "black" || item.color === "navy") || 
                            bottoms[Math.floor(Math.random() * bottoms.length)];
          } else if (occasion === "casual") {
            selectedTop = tops.find(item => item.tags.includes("casual") || !item.tags.includes("formal")) || 
                         tops[Math.floor(Math.random() * tops.length)];
            selectedBottom = bottoms.find(item => item.tags.includes("casual") || item.color === "blue") || 
                            bottoms[Math.floor(Math.random() * bottoms.length)];
          } else {
            // Random selection with preference for current season
            const currentSeason = userData.colorAnalysis.season.toLowerCase();
            selectedTop = tops.find(item => item.season.toLowerCase() === currentSeason) || 
                         tops[Math.floor(Math.random() * tops.length)];
            selectedBottom = bottoms.find(item => item.season.toLowerCase() === currentSeason) || 
                            bottoms[Math.floor(Math.random() * bottoms.length)];
          }
          
          // Add shoes if available
          if (shoes.length > 0) {
            selectedShoes = shoes[Math.floor(Math.random() * shoes.length)];
          }
          
          // Add the outfit
          newOutfits.push({
            top: selectedTop,
            bottom: selectedBottom,
            shoes: selectedShoes
          });
        }
        
        setOutfits(newOutfits);
        
        toast({
          title: "Outfits generated",
          description: `Created ${newOutfits.length} outfit suggestions for you.`
        });
        
      } catch (error) {
        console.error("Error generating outfits:", error);
        toast({
          title: "Error",
          description: "Something went wrong while generating outfits.",
          variant: "destructive"
        });
      } finally {
        setGenerating(false);
      }
    }, 2000);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand className="h-5 w-5 text-accent" />
          Outfit Suggestions
        </CardTitle>
        <CardDescription>
          Get AI-powered outfit suggestions using clothes from your wardrobe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Occasion
              </label>
              <Select 
                value={occasion} 
                onValueChange={setOccasion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Additional preferences (optional)
              </label>
              <Input
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                placeholder="e.g., 'colorful', 'minimalist', 'comfortable'"
              />
            </div>
          </div>
          
          <Button 
            onClick={generateOutfits} 
            disabled={generating || items.length < 2}
            className="w-full gap-2"
          >
            {generating ? 
              <RefreshCw className="h-4 w-4 animate-spin" /> : 
              <Wand className="h-4 w-4" />
            }
            {generating ? "Generating outfits..." : "Generate Outfit Suggestions"}
          </Button>
          
          {outfits.length > 0 && (
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Suggested Outfits</h3>
              <div className="space-y-6">
                {outfits.map((outfit, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        Outfit {index + 1}
                      </h4>
                      <span className="text-sm text-muted-foreground capitalize">{occasion}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {outfit.top && (
                        <div className="aspect-square relative border rounded-md overflow-hidden">
                          <img 
                            src={outfit.top.image} 
                            alt="Top" 
                            className="object-contain w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-center text-xs">
                            Top
                          </div>
                        </div>
                      )}
                      {outfit.bottom && (
                        <div className="aspect-square relative border rounded-md overflow-hidden">
                          <img 
                            src={outfit.bottom.image} 
                            alt="Bottom" 
                            className="object-contain w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-center text-xs">
                            Bottom
                          </div>
                        </div>
                      )}
                      {outfit.shoes && (
                        <div className="aspect-square relative border rounded-md overflow-hidden">
                          <img 
                            src={outfit.shoes.image} 
                            alt="Shoes" 
                            className="object-contain w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-center text-xs">
                            Shoes
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      <p>This outfit works well for {occasion} occasions.</p>
                      {preference && <p className="mt-1">Matches your preference for {preference} style.</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {outfits.length === 0 && items.length >= 2 && !generating && (
            <div className="text-center py-6 text-muted-foreground">
              <p>Click the button above to generate outfit suggestions</p>
            </div>
          )}
          
          {items.length < 2 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>Add at least one top and one bottom to your wardrobe to generate outfits</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitSuggestions;
