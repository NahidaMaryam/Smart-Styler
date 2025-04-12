
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import WelcomePage from './Steps/WelcomePage';
import StylingPreferencesPage from './Steps/StylingPreferencesPage';
import PersonalInfoPage from './Steps/PersonalInfoPage';
import MeasurementsPage from './Steps/MeasurementsPage';
import NotificationsPage from './Steps/NotificationsPage';
import { useToast } from '@/components/ui/use-toast';

const OnboardingSteps = () => {
  const { currentStep, goToNextStep, goToPreviousStep, totalSteps, onboardingData } = useOnboarding();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomePage />;
      case 2:
        return <StylingPreferencesPage />;
      case 3:
        return <PersonalInfoPage />;
      case 4:
        return <MeasurementsPage />;
      case 5:
        return <NotificationsPage />;
      default:
        return <WelcomePage />;
    }
  };
  
  const handleNext = () => {
    // Validation logic for each step
    if (currentStep === 2 && onboardingData.stylePreferences.length === 0) {
      toast({
        title: "Please select at least one styling preference",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 3 && !onboardingData.gender) {
      toast({
        title: "Please select your gender",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 4 && !onboardingData.skipMeasurements && (!onboardingData.height || !onboardingData.weight)) {
      toast({
        title: "Please enter your measurements or skip this step",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === totalSteps) {
      // Save onboarding data to localStorage for now
      // In a real app, this would be saved to a database
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      localStorage.setItem('onboardingCompleted', 'true');
      
      toast({
        title: "Profile setup complete!",
        description: "Welcome to Smart Styler",
      });
      
      // Navigate to the home page
      navigate('/');
      return;
    }
    
    goToNextStep();
  };
  
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      {currentStep > 1 && (
        <div className="px-4 pt-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>
      )}
      
      {/* Content area */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {renderStep()}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="p-4 flex justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={goToPreviousStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <div></div> // Empty div for spacing
        )}
        
        <Button onClick={handleNext}>
          {currentStep === totalSteps ? 'Finish' : 'Next'} 
          {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSteps;
