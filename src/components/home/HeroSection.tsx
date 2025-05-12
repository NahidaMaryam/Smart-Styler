
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  username: string;
  backgroundImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ username, backgroundImage }) => {
  return (
    <section className="py-10 md:py-16 flex flex-col items-center text-center relative rounded-2xl overflow-hidden">
      {/* Background image container with adjusted transparency */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0" 
        style={{ 
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: 'center 30%'
        }}
      >
        {/* Overlay gradient for better text readability while maintaining visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/60"></div>
      </div>
      {/* Content container */}
      <div className="relative z-10 px-4 py-8 md:py-12 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in text-gradient">
          Welcome back, <span className="text-accent">{username}</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          Your personal AI stylist is here to help you look your best every day with smart recommendations tailored just for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <Button asChild size="lg" className="button-hover">
            <Link to="/color-analysis">Analyze My Colors</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="button-hover">
            <Link to="/ai-stylist">Ask Stylist</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
