
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from 'react';

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

// RazorPay script component
const RazorPayScript = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only load RazorPay if on subscription or checkout pages
    if (location.pathname.includes('subscription') || location.pathname.includes('checkout')) {
      if (!document.getElementById('razorpay-script')) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.id = 'razorpay-script';
        script.async = true;
        script.onload = () => console.log('RazorPay script loaded');
        script.onerror = () => {
          console.error('RazorPay script failed to load');
          const searchParams = new URLSearchParams(location.search);
          if (!searchParams.has('payment_error')) {
            navigate(`${location.pathname}?payment_error=script_load_failed`);
          }
        };
        document.body.appendChild(script);
      }
    }
    
    // Clean up function
    return () => {
      const script = document.getElementById('razorpay-script');
      if (script && !location.pathname.includes('subscription') && !location.pathname.includes('checkout')) {
        document.body.removeChild(script);
      }
    };
  }, [location.pathname, navigate, location.search]);

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
