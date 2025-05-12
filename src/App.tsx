
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from 'react';

// Pages
import HomePage from './pages/Index';
import ColorAnalysis from './pages/ColorAnalysis';
import Wardrobe from './pages/Wardrobe';
import AIStylist from './pages/AIStylist';
import Profile from './pages/Profile';
import History from './pages/History';
import NotFound from './pages/NotFound';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import OnboardingContainer from './pages/Onboarding/OnboardingContainer';
import Subscription from './pages/Subscription';
import { useToast } from './components/ui/use-toast';

// RazorPay script component
const RazorPayScript = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  useEffect(() => {
    // Check if we need to load the script on this page
    const needsRazorPay = location.pathname.includes('subscription') || 
                          location.pathname.includes('checkout') ||
                          new URLSearchParams(location.search).has('payment');
    
    if (needsRazorPay && !scriptLoaded && loadAttempts < 3) {
      // Remove any existing script to avoid duplicates
      const existingScript = document.getElementById('razorpay-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      console.log("Loading RazorPay script...");
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-script';
      script.async = true;
      
      script.onload = () => {
        console.log('RazorPay script loaded successfully');
        setScriptLoaded(true);
        // Show success notification if this was a retry attempt
        if (loadAttempts > 0) {
          toast({
            title: "Payment System Ready",
            description: "The payment system has been loaded successfully."
          });
        }
      };
      
      script.onerror = () => {
        console.error('RazorPay script failed to load');
        setScriptLoaded(false);
        setLoadAttempts(prev => prev + 1);
        
        if (loadAttempts >= 2) {
          toast({
            title: "Payment System Error",
            description: "Failed to load the payment system. Please try again later or check your internet connection.",
            variant: "destructive"
          });
          
          const searchParams = new URLSearchParams(location.search);
          if (!searchParams.has('payment_error')) {
            navigate(`${location.pathname}?payment_error=script_load_failed`);
          }
        } else {
          // Try again after a short delay
          setTimeout(() => {
            setLoadAttempts(prev => prev); // Trigger re-render
          }, 3000);
        }
      };
      
      document.body.appendChild(script);
    }
    
    // Clean up function
    return () => {
      if (!needsRazorPay) {
        const script = document.getElementById('razorpay-script');
        if (script) {
          document.body.removeChild(script);
          setScriptLoaded(false);
        }
      }
    };
  }, [location.pathname, navigate, location.search, toast, scriptLoaded, loadAttempts]);

  return null;
};

function App() {
  return (
    <Router>
      <RazorPayScript />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/color-analysis" element={<ColorAnalysis />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/ai-stylist" element={<AIStylist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<OnboardingContainer />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
