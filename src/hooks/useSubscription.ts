
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseSubscriptionReturn {
  createCheckoutSession: (planId: string) => Promise<void>;
  manageSubscription: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<boolean>;
  isLoading: boolean;
  currentPlan: string;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const { toast } = useToast();

  const createCheckoutSession = async (planId: string) => {
    setIsLoading(true);
    try {
      // This will need to call a Supabase Edge Function that creates a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive"
      });
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const manageSubscription = async () => {
    setIsLoading(true);
    try {
      // This will need to call a Supabase Edge Function that creates a Stripe customer portal session
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: {}
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error: any) {
      toast({
        title: "Portal Error",
        description: error.message || "Failed to access subscription portal",
        variant: "destructive"
      });
      console.error('Error accessing subscription portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This will need to call a Supabase Edge Function that checks the subscription status
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {}
      });
      
      if (error) throw new Error(error.message);
      
      if (data) {
        setCurrentPlan(data.subscribed ? 
          (data.subscription_tier?.toLowerCase() === 'premium annual' ? 'styler_plus_annual' : 'styler_plus') : 
          'free');
        return data.subscribed;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Subscription Check Error",
        description: error.message || "Failed to check subscription status",
        variant: "destructive"
      });
      console.error('Error checking subscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    manageSubscription,
    checkSubscriptionStatus,
    isLoading,
    currentPlan
  };
};
