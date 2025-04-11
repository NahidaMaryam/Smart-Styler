
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`container max-w-7xl py-10 md:py-12 px-4 md:px-8 lg:px-10 animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
