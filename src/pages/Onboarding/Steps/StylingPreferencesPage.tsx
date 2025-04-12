
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt, Briefcase, Sparkles, Minimize2, Palette } from 'lucide-react';

type StylePreference = 
  | "Casual Everyday Looks"
  | "Formal & Professional Attire"
  | "Trendy / Seasonal Outfits"
  | "Minimalist Styling"
  | "Ethnic / Traditional Wear";

const styleOptions = [
  {
    id: "casual",
    label: "Casual Everyday Looks" as StylePreference,
    description: "Comfortable yet stylish outfits for daily wear",
    icon: <Shirt className="h-6 w-6" />
  },
  {
    id: "formal",
    label: "Formal & Professional Attire" as StylePreference,
    description: "Polished looks for the workplace and formal events",
    icon: <Briefcase className="h-6 w-6" />
  },
  {
    id: "trendy",
    label: "Trendy / Seasonal Outfits" as StylePreference,
    description: "The latest fashion trends for each season",
    icon: <Sparkles className="h-6 w-6" />
  },
  {
    id: "minimal",
    label: "Minimalist Styling" as StylePreference,
    description: "Clean, simple, and timeless outfits",
    icon: <Minimize2 className="h-6 w-6" />
  },
  {
    id: "ethnic",
    label: "Ethnic / Traditional Wear" as StylePreference,
    description: "Cultural and traditional clothing options",
    icon: <Palette className="h-6 w-6" />
  }
];

const StylingPreferencesPage = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  const toggleStylePreference = (preference: { label: StylePreference }) => {
    const currentPreferences = [...onboardingData.stylePreferences];
    const index = currentPreferences.indexOf(preference.label);
    
    if (index > -1) {
      currentPreferences.splice(index, 1);
    } else {
      currentPreferences.push(preference.label);
    }
    
    updateOnboardingData({ stylePreferences: currentPreferences });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Styling Preferences</h2>
        <p className="text-muted-foreground">What's your styling goal? Select one or multiple options.</p>
      </div>
      
      <div className="space-y-3">
        {styleOptions.map((option) => {
          const isSelected = onboardingData.stylePreferences.includes(option.label);
          
          return (
            <Card 
              key={option.id} 
              className={`cursor-pointer hover:border-primary transition-colors ${isSelected ? 'border-2 border-primary bg-primary/5' : ''}`}
              onClick={() => toggleStylePreference(option)}
            >
              <CardContent className="flex items-center p-4">
                <div className={`mr-4 p-2 rounded-full ${isSelected ? 'bg-primary/20' : 'bg-secondary'}`}>
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-medium">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StylingPreferencesPage;
