
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
    <div className={`container max-w-7xl py-8 px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
