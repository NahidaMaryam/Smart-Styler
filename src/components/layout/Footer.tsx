
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, Twitter } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border mt-10">
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Logo />
              <span className="ml-2 text-lg font-bold">Smart Styler</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your personal AI-powered fashion assistant for personalized style recommendations.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/color-analysis" className="text-muted-foreground hover:text-accent transition-colors">
                  Color Analysis
                </Link>
              </li>
              <li>
                <Link to="/ai-stylist" className="text-muted-foreground hover:text-accent transition-colors">
                  AI Stylist
                </Link>
              </li>
              <li>
                <Link to="/wardrobe" className="text-muted-foreground hover:text-accent transition-colors">
                  My Wardrobe
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-accent transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-muted-foreground hover:text-accent transition-colors">
                  History
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>© {currentYear} Smart Styler. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
