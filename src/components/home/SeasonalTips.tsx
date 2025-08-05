
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface SeasonalTipsProps {
  currentSeason: string;
}

const SeasonalTips: React.FC<SeasonalTipsProps> = ({ currentSeason }) => {
  const seasonalTips = [
    `Layer light fabrics for transitional ${currentSeason} weather`,
    `Incorporate pastel colors into your ${currentSeason} wardrobe`,
    `Try floral patterns for a classic ${currentSeason} look`,
    `Light denim is perfect for casual ${currentSeason} outings`
  ];

  return (
    <section className="py-10">
      <Card className="animate-fade-in" style={{animationDelay: '0.4s'}}>
        <CardHeader>
          <CardTitle>
            {currentSeason} Style Tips
          </CardTitle>
          <CardDescription>
            Stay fashionable with these seasonal recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {seasonalTips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block h-6 w-6 mr-2 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" asChild className="text-sm">
            <Link to="/ai-stylist">Get more personalized recommendations →</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SeasonalTips;
