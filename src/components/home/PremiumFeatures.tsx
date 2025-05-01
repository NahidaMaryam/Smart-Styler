
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const PremiumFeatures: React.FC = () => {
  const benefits = [
    "Unlimited personalized outfit recommendations",
    "Advanced color analysis and seasonal palette suggestions",
    "Virtual try-on for complete outfits",
    "Unlimited wardrobe item storage",
    "24/7 AI fashion assistant chatbot",
    "Personalized trend matching and shopping suggestions",
    "Unlimited event-based styling plans"
  ];
  
  return (
    <Card className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-yellow-500">✨</span> 
          Upgrade Your Style Experience
        </CardTitle>
        <CardDescription>
          Unlock premium features to get more from Fashion Styler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/subscription">
            Upgrade to Premium
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumFeatures;
