
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, RefreshCw, AlertTriangle } from 'lucide-react';

const Subscription = () => {
  const { 
    createCheckoutSession, 
    manageSubscription, 
    checkSubscriptionStatus,
    isLoading, 
    currentPlan 
  } = useSubscription();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      setError(null);
      try {
        const status = await checkSubscriptionStatus();
        setIsSubscribed(status);
      } catch (err: any) {
        setError(err.message || 'Failed to check subscription status');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkStatus();
  }, []);

  const handleSelectPlan = async (plan: string) => {
    await createCheckoutSession(plan);
  };

  return (
    <Layout>
      <PageContainer>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Fashion Stylist Premium</h1>
              <p className="text-muted-foreground">
                Unlock advanced fashion features with our premium subscription
              </p>
            </div>
            
            {isSubscribed && (
              <Button 
                onClick={manageSubscription} 
                variant="outline" 
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                Manage Subscription
              </Button>
            )}
          </div>

          {isChecking ? (
            <div className="flex justify-center my-12">
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Checking subscription status...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              {isSubscribed && (
                <Card className="mb-8 border-accent border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Crown className="h-6 w-6 text-yellow-500" />
                      <CardTitle>Premium Subscriber</CardTitle>
                    </div>
                    <CardDescription>
                      You're currently on the {currentPlan.replace('_', ' ')} plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Thank you for subscribing to Fashion Stylist Premium! You have access to all premium features including unlimited wardrobe storage, advanced color analysis, and AI-powered outfit recommendations.
                    </p>
                  </CardContent>
                </Card>
              )}

              <SubscriptionPlans
                currentPlan={currentPlan}
                onSelectPlan={handleSelectPlan}
              />
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Compare Plans</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-2">Feature</th>
                        <th className="text-center py-4 px-2">Free</th>
                        <th className="text-center py-4 px-2 bg-accent/10">Styler+</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-2">Wardrobe Items</td>
                        <td className="text-center py-3 px-2">Up to 10</td>
                        <td className="text-center py-3 px-2 bg-accent/10">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-2">Outfit Suggestions</td>
                        <td className="text-center py-3 px-2">3-5 per week</td>
                        <td className="text-center py-3 px-2 bg-accent/10">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-2">Color Analysis</td>
                        <td className="text-center py-3 px-2">Basic</td>
                        <td className="text-center py-3 px-2 bg-accent/10">Advanced</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-2">AI Stylist Chat</td>
                        <td className="text-center py-3 px-2">10 questions</td>
                        <td className="text-center py-3 px-2 bg-accent/10">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-2">Event Styling</td>
                        <td className="text-center py-3 px-2">1 per month</td>
                        <td className="text-center py-3 px-2 bg-accent/10">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-2">Virtual Try-On</td>
                        <td className="text-center py-3 px-2">Top-wear only</td>
                        <td className="text-center py-3 px-2 bg-accent/10">Full body</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Subscription;
