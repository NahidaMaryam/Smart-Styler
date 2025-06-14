
import { useState, useCallback } from 'react';
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
      console.log("Creating checkout session for plan:", planId);
      
      // Get the current user's session first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error("Session error:", sessionError);
        toast({
          title: "Authentication Required",
          description: "Please log in to complete this action",
          variant: "destructive"
        });
        setTimeout(() => {
          window.location.href = '/login?redirect=/subscription';
        }, 1500);
        return;
      }
      
      // Call the Supabase Edge Function to create a RazorPay checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });
      
      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "Failed to create checkout session");
      }
      
      console.log("Checkout session created:", data);
      
      if (!data?.order_id) {
        throw new Error('No order ID returned from the server');
      }
      
      // Initialize RazorPay checkout
      const options = {
        key: data.key_id, 
        amount: data.amount,
        currency: data.currency,
        name: "Fashion Styler",
        description: `${planId.replace('_', ' ')} Subscription`,
        order_id: data.order_id,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          // Call the verify-payment edge function to verify the payment
          verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
        },
        prefill: {
          email: data.email || "",
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window. You can try again anytime.",
            });
            setIsLoading(false);
          }
        }
      };

      // Check if RazorPay is available
      if (window && (window as any).Razorpay) {
        console.log("Opening RazorPay modal");
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        console.error("RazorPay script not loaded");
        toast({
          title: "Payment System Not Ready",
          description: "Please wait while we load the payment system or try refreshing the page.",
          variant: "destructive"
        });
        
        // Try loading the script again
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.id = 'razorpay-script-retry';
        script.async = true;
        script.onload = () => {
          console.log("RazorPay script loaded on retry");
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
        
        setTimeout(() => setIsLoading(false), 5000);
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    try {
      console.log("Verifying payment:", paymentId, orderId);
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { 
          payment_id: paymentId, 
          order_id: orderId, 
          signature: signature 
        }
      });
      
      if (error) {
        console.error("Verification error:", error);
        throw new Error(error.message);
      }
      
      console.log("Payment verification response:", data);
      
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
      console.error('Error verifying payment:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to verify payment",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const manageSubscription = async () => {
    setIsLoading(true);
    try {
      // Check authentication first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage your subscription",
          variant: "destructive"
        });
        setTimeout(() => {
          window.location.href = '/login?redirect=/subscription';
        }, 1500);
        return;
      }
      
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

  const checkSubscriptionStatus = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Checking subscription status");
      // Check authentication first
      const { data: sessionData } = await supabase.auth.getSession();
      
      // If not authenticated, return false but don't show error
      if (!sessionData.session) {
        console.log("No active session found");
        setCurrentPlan('free');
        setIsLoading(false);
        return false;
      }
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {}
      });
      
      if (error) {
        // Don't show toast for authentication errors, just handle gracefully
        console.log('Subscription check error:', error);
        setCurrentPlan('free');
        setIsLoading(false);
        return false;
      }
      
      console.log("Subscription status response:", data);
      
      if (data) {
        setCurrentPlan(data.subscribed ? 
          (data.subscription_tier?.toLowerCase() === 'premium annual' ? 'styler_plus_annual' : 'styler_plus') : 
          'free');
        setIsLoading(false);
        return data.subscribed;
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      // Log the error but don't show a toast to avoid continuous alerts
      console.error('Error checking subscription:', error);
      setCurrentPlan('free');
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    createCheckoutSession,
    manageSubscription,
    checkSubscriptionStatus,
    isLoading,
    currentPlan
  };
};
