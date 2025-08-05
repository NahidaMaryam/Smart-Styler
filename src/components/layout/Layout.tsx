import React from 'react';
import Header from './Header';
import MobileNav from './MobileNav';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between md:hidden px-4 py-3 border-b border-border shadow-sm">
        <MobileNav />
        <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Smart Styler</span>
        <div className="w-10"></div> {/* Spacer for layout balance */}
      </div>
      <div className="hidden md:block sticky top-0 z-10 backdrop-blur-sm border-b border-border">
        <Header />
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
