
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
import OnboardingContainer from "./pages/Onboarding/OnboardingContainer";

const queryClient = new QueryClient();

const App = () => {
  // Basic auth check - in a real app, this would use Supabase auth
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
  const isSignedUp = localStorage.getItem('isSignedUp') === 'true';

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
