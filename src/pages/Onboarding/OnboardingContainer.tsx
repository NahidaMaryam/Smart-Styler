
import React from 'react';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingSteps from './OnboardingSteps';

const OnboardingContainer = () => {
  return (
    <OnboardingProvider>
      <OnboardingSteps />
    </OnboardingProvider>
  );
};

export default OnboardingContainer;
