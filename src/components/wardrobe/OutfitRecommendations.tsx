
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shirt, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  }>(null);
  const { toast } = useToast();

  // Hardcoded recommendations to simulate AI responses
  const recommendationOptions = [
    {
      title: "Business Casual Look",
      description: "A professional but comfortable outfit combining your navy blazer, white shirt, and beige pants. Perfect for office meetings or casual business events.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Business+Casual+Outfit"
    },
    {
      title: "Evening Date Night",
      description: "A stylish combination for a romantic evening featuring your black shirt and dark jeans. Add your leather jacket for a touch of sophistication.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Date+Night+Outfit"
    },
    {
      title: "Weekend Brunch Look",
      description: "A relaxed yet put-together outfit with your light blue shirt and khaki shorts. Perfect for a weekend brunch with friends or family gatherings.",
      imageUrl: "https://placehold.co/300x400/e2e8f0/1e293b?text=Weekend+Brunch+Outfit"
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
          />
        </div>
        
        <Button 
          onClick={generateRecommendation} 
          disabled={isGenerating || !occasion.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating recommendation...
            </>
          ) : (
            "Generate Outfit Suggestion"
          )}
        </Button>
        
        {recommendation && (
          <div className="mt-6 space-y-4">
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">{recommendation.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
              <div className="flex justify-center mb-4">
                <img 
                  src={recommendation.imageUrl} 
                  alt="Outfit Recommendation" 
                  className="h-48 object-contain rounded-md"
                />
              </div>
              <Button onClick={tryOnAvatar} variant="outline" className="w-full">
                Try on your avatar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutfitRecommendations;
