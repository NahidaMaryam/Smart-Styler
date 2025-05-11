
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shirt, RefreshCw, Camera, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AvatarRenderer from './AvatarRenderer';

interface OutfitRecommendationsProps {
  userItems: any[];
}

const OutfitRecommendations: React.FC<OutfitRecommendationsProps> = ({ userItems }) => {
  const [occasion, setOccasion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<null | {
    title: string;
    description: string;
    imageUrl: string;
    items: string[];
    outfitType: string;
  }>(null);
  const { toast } = useToast();

  // Hardcoded recommendations to simulate AI responses
  const recommendationOptions = [
    {
      title: "Business Casual Look",
      description: "A professional but comfortable outfit combining navy blazer, white shirt, and beige pants. Perfect for office meetings or casual business events.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Business+Casual+Outfit",
      items: ["blazer", "shirt", "pants"],
      outfitType: "formal1"
    },
    {
      title: "Evening Date Night",
      description: "A stylish combination for a romantic evening featuring black shirt and dark jeans. Add your leather jacket for a touch of sophistication.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Date+Night+Outfit",
      items: ["shirt", "jeans", "jacket"],
      outfitType: "casual1"
    },
    {
      title: "Weekend Brunch Look",
      description: "A relaxed yet put-together outfit with light blue shirt and khaki shorts. Perfect for a weekend brunch with friends or family gatherings.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Weekend+Brunch+Outfit",
      items: ["shirt", "shorts", "sneakers"],
      outfitType: "casual2"
    },
    {
      title: "Office Interview",
      description: "A professional outfit featuring a crisp white shirt, charcoal suit, and polished shoes to make a great first impression.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Interview+Outfit",
      items: ["suit", "shirt", "dress shoes"],
      outfitType: "formal2"
    },
    {
      title: "Summer Festival",
      description: "A colorful and comfortable outfit perfect for outdoor festivals with a graphic tee, denim shorts, and comfortable sneakers.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Festival+Outfit",
      items: ["t-shirt", "shorts", "hat", "sunglasses"],
      outfitType: "sport1"
    }
  ];

  const generateRecommendation = () => {
    if (!occasion.trim()) {
      toast({
        title: "Please specify an occasion",
        description: "Tell us what event you need an outfit for.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Choose a random recommendation from options
      const randomRecommendation = recommendationOptions[Math.floor(Math.random() * recommendationOptions.length)];
      setRecommendation(randomRecommendation);
      setIsGenerating(false);
      
      toast({
        title: "Outfit Generated",
        description: "We've created a personalized outfit suggestion for your occasion!",
      });
    }, 1500);
  };

  const tryOnAvatar = () => {
    toast({
      title: "Outfit Applied to Avatar",
      description: "You can now see this outfit on your avatar!",
    });
  };

  const capturePhoto = () => {
    toast({
      title: "Photo Captured",
      description: "Your avatar photo has been saved to your gallery!",
    });
  };

  // Default avatar appearance for recommendation previews
  const defaultAvatarProps = {
    hairStyle: "medium",
    hairColor: "brown",
    skinTone: "medium",
    faceShape: "oval",
    facialHair: "none",
    eyeColor: "brown"
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shirt className="mr-2 h-5 w-5" />
          AI Outfit Recommendations
        </CardTitle>
        <CardDescription>
          Get personalized outfit suggestions for any occasion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">What's the occasion?</label>
          <Textarea
            placeholder="Example: Wedding ceremony, job interview, casual Friday at work..."
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={generateRecommendation} 
            disabled={isGenerating || !occasion.trim()}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Outfit Suggestion"
            )}
          </Button>
          
          {recommendation && (
            <Button 
              variant="outline" 
              onClick={() => setRecommendation(null)}
              className="sm:w-24"
            >
              Clear
            </Button>
          )}
        </div>
        
        {recommendation && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="bg-secondary/50 p-4 rounded-lg border">
              <h3 className="font-medium text-lg mb-2 text-primary">{recommendation.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
              
              <div className="flex justify-center mb-4">
                {/* Enhanced 3D Avatar container */}
                <div className="h-64 w-64 rounded-lg relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-1 shadow-lg overflow-hidden perspective-container">
                  <div className="absolute inset-0 bg-white/80 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center transform-wrapper">
                      <AvatarRenderer
                        {...defaultAvatarProps}
                        outfit={recommendation.outfitType}
                        className="w-44 h-44 transform scale-150 hover:scale-[1.55] transition-transform duration-500 avatar-3d-effect"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {recommendation.items && recommendation.items.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Suggested Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.items.map((item, index) => (
                      <div key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center">
                        <Check className="w-3 h-3 mr-1" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={tryOnAvatar} variant="outline" className="flex-1">
                  Try on your avatar
                </Button>
                <Button onClick={capturePhoto} variant="outline" className="flex-1">
                  <Camera className="w-4 h-4 mr-2" /> Capture photo
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutfitRecommendations;
