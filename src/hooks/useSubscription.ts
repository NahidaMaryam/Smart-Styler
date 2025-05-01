
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
      // Call the Supabase Edge Function to create a RazorPay checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.order_id) {
        // Initialize RazorPay checkout
        const options = {
          key: "rzp_test_YOUR_KEY_HERE", // Replace with your actual test key
          amount: data.amount,
          currency: data.currency,
          name: "Fashion Styler",
          description: `${planId.replace('_', ' ')} Subscription`,
          order_id: data.order_id,
          handler: function (response: any) {
            // Call the verify-payment edge function to verify the payment
            verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
          },
          prefill: {
            email: data.email || "",
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error('No order ID returned');
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

  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { 
          payment_id: paymentId, 
          order_id: orderId, 
          signature: signature 
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.success) {
        toast({
          title: "Payment Successful",
          description: "Your subscription has been activated!",
        });
        
        // Refresh subscription status
        await checkSubscriptionStatus();
        
        // Redirect to subscription page
        window.location.href = '/subscription?success=true';
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to verify payment",
        variant: "destructive"
      });
      console.error('Error verifying payment:', error);
    }
  };

  const manageSubscription = async () => {
    setIsLoading(true);
    try {
      // Call Supabase Edge Function that creates a RazorPay subscription management portal
      const { data, error } = await supabase.functions.invoke('subscription-portal', {
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
