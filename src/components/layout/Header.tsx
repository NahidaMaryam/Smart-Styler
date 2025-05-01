
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, User, Crown, Star } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { currentPlan, checkSubscriptionStatus } = useSubscription();
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkSubscriptionStatus();
        setIsSubscribed(status);
      } catch (error) {
        console.error("Error checking subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
  }, [checkSubscriptionStatus]);

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
            "flex items-center gap-1 px-2 py-1 rounded-md text-sm",
            isSubscribed 
              ? "bg-accent/10 text-accent border border-accent/20" 
              : "bg-muted/50 text-muted-foreground border border-border"
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
