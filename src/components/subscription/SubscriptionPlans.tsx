
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

interface SubscriptionPlansProps {
  currentPlan?: string;
  onSelectPlan: (plan: string) => Promise<void>;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  currentPlan = 'free',
  onSelectPlan
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  const plans: SubscriptionPlan[] = [
    {
      name: "Free",
      price: "₹0/month",
      description: "Basic styling features for everyone",
      features: [
        "Limited color analysis",
        "Basic AI styling tips",
        "Up to 10 wardrobe items",
        "3-5 outfit suggestions per week",
        "Basic tone detection"
      ],
      buttonText: currentPlan === "free" ? "Current Plan" : "Continue Free"
    },
    {
      name: "Styler+",
      price: "₹49/month",
      description: "Advanced AI styling for fashion enthusiasts",
      highlighted: true,
      features: [
        "Unlimited wardrobe items",
        "Unlimited curated outfits",
        "Full seasonal color matching",
        "Virtual try-on for tops",
        "Unlimited AI chatbot conversations",
        "Personalized trend matching",
        "Unlimited event styling"
      ],
      buttonText: currentPlan === "styler_plus" ? "Current Plan" : "Subscribe Now"
    },
    {
      name: "Styler+ Annual",
      price: "₹549/year",
      description: "Save 2 months with annual billing",
      features: [
        "All Styler+ features",
        "Priority customer support",
        "Early access to new features",
        "Full-body virtual try-on",
        "Advanced style evolution tracker",
        "Exclusive seasonal look books"
      ],
      buttonText: currentPlan === "styler_plus_annual" ? "Current Plan" : "Subscribe Now"
    }
  ];
  
  const handleSelectPlan = async (planName: string) => {
    if (planName.toLowerCase() === currentPlan) {
      toast({
        title: "Current Plan",
        description: `You are already subscribed to the ${planName} plan.`
      });
      return;
    }
    
    if (planName.toLowerCase() === "free") {
      toast({
        title: "Free Plan",
        description: "You can continue using the free features."
      });
      return;
    }
    
    setIsProcessing(planName);
    try {
      // Convert plan name to ID format the backend expects
      const planId = planName.toLowerCase().replace(" ", "_");
      console.log(`Selecting plan: ${planName}, sending ID: ${planId}`);
      await onSelectPlan(planId);
    } catch (error) {
      toast({
        title: "Subscription Error",
        description: "Failed to process your subscription. Please try again.",
        variant: "destructive"
      });
      console.error("Subscription error:", error);
    } finally {
      setIsProcessing(null);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card 
          key={plan.name}
          className={`flex flex-col h-full ${
            plan.highlighted ? 'border-accent shadow-md relative' : ''
          }`}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Most Popular
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>
              <div className="text-xl font-bold">{plan.price}</div>
              <p className="mt-2">{plan.description}</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleSelectPlan(plan.name)}
              className="w-full"
              variant={currentPlan === plan.name.toLowerCase().replace(" ", "_") ? "outline" : "default"}
              disabled={currentPlan === plan.name.toLowerCase().replace(" ", "_") || isProcessing !== null}
            >
              {isProcessing === plan.name ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : plan.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
