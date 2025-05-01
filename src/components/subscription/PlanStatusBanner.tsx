
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Star, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

const PlanStatusBanner: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const { checkSubscriptionStatus, currentPlan } = useSubscription();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkSubscriptionStatus();
        setIsSubscribed(status);
      } catch (error) {
        console.error("Error checking subscription status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    checkStatus();
  }, [checkSubscriptionStatus]);
  
  if (isCheckingStatus) {
    return null; // Don't show anything while checking status
  }
  
  return (
    <Card className={cn(
      "mt-6 mb-4 transition-all duration-300", 
      isSubscribed ? "border-accent bg-accent/5" : "border-muted"
    )}>
      <CardContent className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <>
                <Crown className="h-5 w-5 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-medium">
                    You're on the {currentPlan.replace('_', ' ')} plan!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enjoy all premium features and unlimited styling
                  </p>
                </div>
              </>
            ) : (
              <>
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium">
                    You're on the free plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Styler+ for unlimited outfit recommendations and more
                  </p>
                </div>
              </>
            )}
          </div>
          
          {!isSubscribed && (
            <Button asChild>
              <Link to="/subscription">
                Upgrade to Premium
              </Link>
            </Button>
          )}
          
          {isSubscribed && (
            <Button asChild variant="outline">
              <Link to="/subscription">
                Manage Subscription
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanStatusBanner;
