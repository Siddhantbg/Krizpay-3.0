// components/icons/KrizPayIcon.tsx
import React from 'react';

interface KrizPayIconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const KrizPayIcon: React.FC<KrizPayIconProps> = ({ 
  className = "", 
  size = 24, 
  color = "currentColor" 
}) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {/* Option 1: Use your SVG file directly */}
      <img 
        src="/KrizPay.svg" 
        alt="KrizPay Logo"
        width={size}
        height={size}
        className="object-contain"
        style={{ filter: color !== 'currentColor' ? `drop-shadow(0 0 0 ${color})` : undefined }}
      />
      
      {/* Option 2: Inline SVG (replace with your actual SVG content) */}
      {/* 
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block"
      >
        <!-- Your SVG paths here -->
        <path d="YOUR_SVG_PATH_DATA" fill={color} />
      </svg>
      */}
    </div>
  );
};

// Alternative: Simple wrapper for direct SVG usage
export const KrizPayLogo: React.FC<KrizPayIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <img 
      src="/KrizPay.svg" 
      alt="KrizPay"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
};