
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-fashion-navy dark:bg-fashion-cream">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-fashion-cream dark:text-fashion-navy"
      >
        <path d="M12 3.5a1 1 0 0 1 .914.593l1.694 3.434 3.786.55a1 1 0 0 1 .555 1.706l-2.742 2.67.647 3.773a1 1 0 0 1-1.45 1.054L12 14.943l-3.404 1.79a1 1 0 0 1-1.45-1.054l.647-3.773-2.742-2.67a1 1 0 0 1 .555-1.706l3.786-.55 1.694-3.434a1 1 0 0 1 .914-.593Z" />
      </svg>
    </div>
  );
};

export default Logo;
