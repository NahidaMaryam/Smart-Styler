
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Index";
import ColorAnalysis from "./pages/ColorAnalysis";
import AIStylist from "./pages/AIStylist";
import Wardrobe from "./pages/Wardrobe";
import Profile from "./pages/Profile";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import OnboardingContainer from "./pages/Onboarding/OnboardingContainer";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [isSignedUp, setIsSignedUp] = useState(localStorage.getItem('isSignedUp') === 'true');
  const [onboardingCompleted, setOnboardingCompleted] = useState(localStorage.getItem('onboardingCompleted') === 'true');
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('isLoggedIn');
          setIsLoggedIn(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
            <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/" /> : <ForgotPassword />} />
            
            {/* Onboarding */}
            <Route 
              path="/onboarding" 
              element={
                isSignedUp && !onboardingCompleted ? 
                <OnboardingContainer /> : 
                (isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />)
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/color-analysis" 
              element={isLoggedIn ? <ColorAnalysis /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/ai-stylist" 
              element={isLoggedIn ? <AIStylist /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/wardrobe" 
              element={isLoggedIn ? <Wardrobe /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/history" 
              element={isLoggedIn ? <History /> : <Navigate to="/login" />} 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
