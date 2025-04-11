
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MessageSquare, Shirt, Palette, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HomePage = () => {
  const username = "Fashion Lover"; // This would come from user authentication
  const currentSeason = "Spring"; // This would be determined based on current date

  const features = [
    {
      title: "Color Analysis",
      description: "Discover your perfect color palette based on your skin tone",
      icon: <Palette className="w-8 h-8 text-white" />,
      link: "/color-analysis",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      title: "AI Stylist",
      description: "Get personalized outfit recommendations from our AI assistant",
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      link: "/ai-stylist",
      gradient: "from-pink-500 to-accent"
    },
    {
      title: "My Wardrobe",
      description: "Upload and organize your clothing for smarter styling",
      icon: <Shirt className="w-8 h-8 text-white" />,
      link: "/wardrobe",
      gradient: "from-accent to-orange-500"
    },
    {
      title: "Photo Analysis",
      description: "Take a photo or upload an image for instant style feedback",
      icon: <Camera className="w-8 h-8 text-white" />,
      link: "/color-analysis",
      gradient: "from-emerald-500 to-teal-500"
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
      {/* Decorative elements */}
      <div className="decorative-dot dot-1"></div>
      <div className="decorative-dot dot-2"></div>
      
      <div className="bg-gradient-to-b from-background to-secondary/20 pb-10 relative overflow-hidden">
        <PageContainer className="relative z-10">
          {/* Hero Section */}
          <section className="py-10 md:py-16 flex flex-col items-center text-center">
            <Badge variant="outline" className="mb-4 py-1.5 px-4 text-sm font-medium bg-background/50 backdrop-blur-sm border-border/50 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI-Powered Fashion
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome back, <span className="text-gradient gradient-text">{username}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
              Your personal AI stylist is here to help you look your best every day with smart recommendations tailored just for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <Button asChild size="lg" className="rounded-full shadow-lg">
                <Link to="/color-analysis">Analyze My Colors</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/ai-stylist">Ask Stylist</Link>
              </Button>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
              Style Smarter, Not Harder
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Link to={feature.link} key={index}>
                  <Card className="enhanced-card h-full card-hover animate-fade-in border-border/50" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
                    <CardHeader className="pb-4">
                      <div className={`feature-icon bg-gradient-to-br ${feature.gradient}`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="mb-2">{feature.title}</CardTitle>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                        Get Started <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Seasonal Tips Section */}
          <section className="py-10">
            <Card className="animate-fade-in glass shadow-lg border-border/50" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="inline-block p-2 mr-3 rounded-full bg-accent/10">
                    <Shirt className="w-5 h-5 text-accent" />
                  </span>
                  {currentSeason} Style Tips
                </CardTitle>
                <CardDescription>
                  Stay fashionable with these seasonal recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {seasonalTips.map((tip, index) => (
                    <li key={index} className="flex items-start p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200">
                      <span className="inline-flex items-center justify-center h-6 w-6 mr-3 rounded-full bg-accent/20 text-accent flex-shrink-0 text-sm">
                        {index + 1}
                      </span>
                      <span className="text-foreground/90">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="text-sm hover:text-accent">
                  <Link to="/ai-stylist" className="flex items-center">
                    Get more personalized recommendations
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
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
