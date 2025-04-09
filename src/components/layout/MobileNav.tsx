
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import Logo from './Logo';

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[80%]">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-10 pt-4">
            <Logo />
            <span className="ml-2 text-xl font-bold">Smart Styler</span>
          </div>
          
          <nav className="flex flex-col space-y-5">
            <Link 
              to="/" 
              className="text-lg font-medium hover:text-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/color-analysis" 
              className="text-lg font-medium hover:text-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              Color Analysis
            </Link>
            <Link 
              to="/ai-stylist" 
              className="text-lg font-medium hover:text-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              AI Stylist
            </Link>
            <Link 
              to="/wardrobe" 
              className="text-lg font-medium hover:text-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              My Wardrobe
            </Link>
            <Link 
              to="/profile" 
              className="text-lg font-medium hover:text-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link 
              to="/history" 
              className="text-lg font-medium hover:text-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              History
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
