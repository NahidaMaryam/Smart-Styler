
import React, { createContext, useContext, useState } from 'react';

type StylePreference = 
  | "Casual Everyday Looks"
  | "Formal & Professional Attire"
  | "Trendy / Seasonal Outfits"
  | "Minimalist Styling"
  | "Ethnic / Traditional Wear";

type Gender = "Male" | "Female" | "Non-binary" | "Prefer not to say";

type BodyShape = 
  | "Pear"
  | "Apple"
  | "Rectangle"
  | "Hourglass"
  | "Inverted Triangle"
  | "Athletic"
  | "Not sure";

type NotificationType = 
  | "Styling tips"
  | "Color updates"
  | "Seasonal fashion alerts"
  | "Outfit suggestions";

interface OnboardingData {
  stylePreferences: StylePreference[];
  gender: Gender | null;
  age: string;
  bodyShape: BodyShape | null;
  height: string;
  weight: string;
  skipMeasurements: boolean;
  notifications: NotificationType[];
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  totalSteps: number;
}

const defaultOnboardingData: OnboardingData = {
  stylePreferences: [],
  gender: null,
  age: "",
  bodyShape: null,
  height: "",
  weight: "",
  skipMeasurements: false,
  notifications: []
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        totalSteps
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
