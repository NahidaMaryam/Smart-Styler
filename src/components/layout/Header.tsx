
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, User } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
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
