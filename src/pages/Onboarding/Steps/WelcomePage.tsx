
import React from 'react';
import { Palette } from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Palette className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-4 gradient-text">Smart Styler</h1>
      <h2 className="text-2xl font-semibold mb-6">Welcome!</h2>
      <p className="text-lg mb-8">
        Your Deep Learning Driven Styling Assistant is ready to help you look your best every day.
      </p>
      <p className="text-muted-foreground">
        Let's set up your profile to personalize your styling experience.
      </p>
    </div>
  );
};

export default WelcomePage;
