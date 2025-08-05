import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MessageSquare, Shirt, Palette } from 'lucide-react';
import WeatherStyleTips from '@/components/home/WeatherStyleTips';

const HomePage = () => {
  const username = "Fashion Lover"; // This would come from user authentication
  const currentSeason = "Spring"; // This would be determined based on current date

  const features = [
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

  const seasonalTips = [
    `Layer light fabrics for transitional ${currentSeason} weather`,
    `Incorporate pastel colors into your ${currentSeason} wardrobe`,
    `Try floral patterns for a classic ${currentSeason} look`,
    `Light denim is perfect for casual ${currentSeason} outings`
  ];

  return (
    <Layout>
      <div className="pb-10">
        <PageContainer>
          {/* Hero Section */}
          <section className="py-10 md:py-16 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
              Welcome back, <span className="text-accent">{username}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
              Your personal AI stylist is here to help you look your best every day with smart recommendations tailored just for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <Button asChild size="lg">
                <Link to="/color-analysis">Analyze My Colors</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ai-stylist">Ask Stylist</Link>
              </Button>
            </div>
          </section>

          {/* Weather-based styling tips */}
          <WeatherStyleTips />

          {/* Features Grid */}
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

          {/* Seasonal Tips Section */}
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
        </PageContainer>
      </div>
    </Layout>
  );
};

export default HomePage;
