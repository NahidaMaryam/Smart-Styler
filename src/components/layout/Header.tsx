
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, User, Crown, Star } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { currentPlan, checkSubscriptionStatus } = useSubscription();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkAttempts, setCheckAttempts] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Only show loading for the first attempt
        if (checkAttempts === 0) {
          setIsLoading(true);
        }
        
        const status = await checkSubscriptionStatus();
        setIsSubscribed(status);
        setIsLoading(false);
        // Reset attempts counter on success
        setCheckAttempts(0);
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setIsLoading(false);
        
        // Only retry up to 3 times to prevent infinite loops
        if (checkAttempts < 3) {
          setCheckAttempts(prev => prev + 1);
        }
      }
    };
    
    checkStatus();
    
    // Set up interval for periodic checks, but only if we haven't exceeded attempts
    const intervalId = checkAttempts < 3 ? 
      setInterval(checkStatus, 300000) : // Check every 5 minutes if successful
      null;
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkSubscriptionStatus, checkAttempts]);

  return (
    <header className="w-full py-4 px-6 bg-background border-b border-border flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <Logo />
          <span className="ml-2 text-xl font-bold text-fashion-navy dark:text-fashion-cream">
            Smart Styler
          </span>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/color-analysis" className="nav-link">Color Analysis</Link>
        <Link to="/ai-stylist" className="nav-link">AI Stylist</Link>
        <Link to="/wardrobe" className="nav-link">My Wardrobe</Link>
      </nav>

      <div className="flex items-center space-x-4">
        {!isLoading && (
          <Link to="/subscription" className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            isSubscribed 
              ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30" 
              : "bg-muted/40 text-muted-foreground/90 border border-muted-foreground/20 hover:bg-muted/60"
          )}>
            {isSubscribed ? (
              <>
                <Crown className="h-3 w-3 text-yellow-500" />
                <span>{currentPlan.replace('_', ' ')}</span>
              </>
            ) : (
              <>
                <Star className="h-3 w-3" />
                <span>Free Plan</span>
              </>
            )}
          </Link>
        )}
        <Link to="/history">
          <Button variant="ghost" size="icon">
            <Clock className="w-5 h-5" />
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
