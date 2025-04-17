
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Prefer not to say", label: "Prefer not to say" }
];

const bodyShapeOptions = [
  { value: "Pear", label: "Pear" },
  { value: "Apple", label: "Apple" },
  { value: "Rectangle", label: "Rectangle" },
  { value: "Hourglass", label: "Hourglass" },
  { value: "Inverted Triangle", label: "Inverted Triangle" },
  { value: "Athletic", label: "Athletic" },
  { value: "Not sure", label: "Not sure" }
];

const PersonalInfoPage = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  // Update both onboarding context and Supabase profile
  const handleUpdateData = async (data: any) => {
    // Update onboarding context
    updateOnboardingData(data);
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Map our data to profiles table structure
        const profileUpdateData: any = {};
        
        if (data.gender) profileUpdateData.gender = data.gender;
        if (data.age) profileUpdateData.age = data.age;
        if (data.bodyShape) profileUpdateData.body_shape = data.bodyShape;
        
        // Update the profile in Supabase
        await supabase
          .from('profiles')
          .update(profileUpdateData)
          .eq('id', session.user.id);
      }
    } catch (error) {
      console.error('Error updating profile during onboarding:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Tell Us About Yourself</h2>
        <p className="text-muted-foreground">This helps us personalize your styling recommendations.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>What's your gender?</Label>
          <RadioGroup 
            value={onboardingData.gender || ""}
            onValueChange={(value) => handleUpdateData({ gender: value as any })}
            className="grid grid-cols-2 gap-2"
          >
            {genderOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                <Label htmlFor={`gender-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input 
            id="age" 
            type="number" 
            placeholder="Enter your age" 
            value={onboardingData.age}
            onChange={(e) => handleUpdateData({ age: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="body-shape">Body Shape</Label>
          <Select 
            value={onboardingData.bodyShape || ""} 
            onValueChange={(value) => handleUpdateData({ bodyShape: value as any })}
          >
            <SelectTrigger id="body-shape">
              <SelectValue placeholder="Select your body shape" />
            </SelectTrigger>
            <SelectContent>
              {bodyShapeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Not sure? Select "Not sure" and we'll help you determine it later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
