
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Ruler } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MeasurementsPage = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  // Update both onboarding context and Supabase profile
  const handleUpdateData = async (data: any) => {
    // Update onboarding context
    updateOnboardingData(data);
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && !data.skipMeasurements) {
        // Map our data to profiles table structure
        const profileUpdateData: any = {};
        
        if (data.height) profileUpdateData.height = data.height;
        if (data.weight) profileUpdateData.weight = data.weight;
        
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
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Ruler className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Body Measurements</h2>
        <p className="text-muted-foreground">Help us recommend the perfect fit for you.</p>
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="skip-measurements" className="text-sm font-medium">
          I prefer not to share this information
        </Label>
        <Switch 
          id="skip-measurements" 
          checked={onboardingData.skipMeasurements} 
          onCheckedChange={(checked) => handleUpdateData({ skipMeasurements: checked })}
        />
      </div>
      
      {!onboardingData.skipMeasurements && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input 
              id="height" 
              type="number" 
              placeholder="e.g., 170" 
              value={onboardingData.height}
              onChange={(e) => handleUpdateData({ height: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input 
              id="weight" 
              type="number" 
              placeholder="e.g., 65" 
              value={onboardingData.weight}
              onChange={(e) => handleUpdateData({ weight: e.target.value })}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            Your measurements are confidential and used only to provide accurate size recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default MeasurementsPage;
