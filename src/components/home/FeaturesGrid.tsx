
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, MessageSquare, Shirt, Palette } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const FeaturesGrid: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Color Analysis",
      description: "Discover your perfect color palette based on your skin tone",
      icon: <Palette className="w-12 h-12 text-accent" />,
      link: "/color-analysis"
    },
    {
      title: "AI Stylist",
      description: "Get personalized outfit recommendations from our AI assistant",
      icon: <MessageSquare className="w-12 h-12 text-accent" />,
      link: "/ai-stylist"
    },
    {
      title: "My Wardrobe",
      description: "Upload and organize your clothing for smarter styling",
      icon: <Shirt className="w-12 h-12 text-accent" />,
      link: "/wardrobe"
    },
    {
      title: "Photo Analysis",
      description: "Take a photo or upload an image for instant style feedback",
      icon: <Camera className="w-12 h-12 text-accent" />,
      link: "/color-analysis"
    }
  ];

  return (
    <section className="py-10">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
        Style Smarter, Not Harder
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Link to={feature.link} key={index}>
            <Card className="feature-card h-full animate-fade-in" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-4 mt-2">
                  {feature.icon}
                </div>
                <CardTitle className="mb-2">{feature.title}</CardTitle>
                <CardDescription className="flex-grow">
                  {feature.description}
                </CardDescription>
                <div className="mt-4 text-sm font-medium text-accent hover:underline">
                  Get Started →
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
