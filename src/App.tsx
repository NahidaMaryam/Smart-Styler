
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";

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

function App() {
  return (
    <Router>
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
