import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import SeasonalTips from '@/components/home/SeasonalTips';
import WeatherStyleTips from '@/components/home/WeatherStyleTips';
import PlanStatusBanner from '@/components/subscription/PlanStatusBanner';
import PremiumFeatures from '@/components/home/PremiumFeatures';
import { supabase } from '@/integrations/supabase/client';
import useBackgroundImage from '@/hooks/useBackgroundImage';

const HomePage = () => {
  const [username, setUsername] = useState("Fashion Lover");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(false);
  const currentSeason = "Spring"; // This would be determined based on current date

  // Array of background image URLs - fashion and style related
  const backgroundImages = [
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80"
  ];

  // Use the custom hook to get a random background image
  const backgroundImage = useBackgroundImage(backgroundImages);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session?.user) {
        // Get user profile to display name
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (data?.full_name) {
          setUsername(data.full_name.split(' ')[0] || "Fashion Lover");
        }

        // Show premium features upsell for free users (50% chance)
        // This creates a simple A/B testing scenario
        if (!localStorage.getItem('premium_shown')) {
          const showUpsell = Math.random() > 0.5;
          setShowPremiumFeatures(showUpsell);
          localStorage.setItem('premium_shown', JSON.stringify(showUpsell));
        } else {
          setShowPremiumFeatures(JSON.parse(localStorage.getItem('premium_shown') || 'false'));
        }
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <Layout>
      <div className="pb-10">
        <PageContainer>
          {/* Hero Section */}
          <HeroSection username={username} backgroundImage={backgroundImage} />

          {/* Subscription Status Banner - only shown for authenticated users */}
          {isAuthenticated && <PlanStatusBanner />}

          {/* Weather-based styling tips */}
          <WeatherStyleTips />

          {/* Features Grid */}
          <FeaturesGrid />

          {/* Premium Features Upsell - only shown to free users with 50% probability */}
          {isAuthenticated && showPremiumFeatures && <PremiumFeatures />}

          {/* Seasonal Tips Section */}
          <SeasonalTips currentSeason={currentSeason} />
        </PageContainer>
      </div>
    </Layout>
  );
};

export default HomePage;
