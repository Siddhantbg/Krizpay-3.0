// components/KrizPayLogo.tsx
import React from 'react';
import Image from 'next/image';

interface KrizPayLogoProps {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  variant?: 'default' | 'white' | 'dark' | 'gradient';
  priority?: boolean;
  alt?: string;
}

export const KrizPayLogo: React.FC<KrizPayLogoProps> = ({
  size = 32,
  width,
  height,
  className = '',
  variant = 'default',
  priority = false,
  alt = 'KrizPay Logo'
}) => {
  // Determine dimensions
  const logoWidth = width || size;
  const logoHeight = height || size;

  // Style variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'white':
        return 'brightness-0 invert'; // Makes logo white
      case 'dark':
        return 'brightness-0'; // Makes logo black
      case 'gradient':
        return 'drop-shadow-lg'; // Adds gradient shadow effect
      default:
        return ''; // Original colors
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Image
        src="/KrizPay.svg"
        alt={alt}
        width={typeof logoWidth === 'string' ? parseInt(logoWidth) : logoWidth}
        height={typeof logoHeight === 'string' ? parseInt(logoHeight) : logoHeight}
        priority={priority}
        className={`object-contain transition-all duration-300 ${getVariantStyles()}`}
        style={{
          width: logoWidth,
          height: logoHeight,
        }}
      />
    </div>
  );
};

// Brand component with logo and text
export const KrizPayBrand: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  logoVariant?: 'default' | 'white' | 'dark' | 'gradient';
  showText?: boolean;
  className?: string;
  textColor?: string;
}> = ({
  size = 'md',
  logoVariant = 'default',
  showText = true,
  className = '',
  textColor = 'gradient-text'
}) => {
  const sizeConfig = {
    sm: { logo: 24, text: 'text-lg', container: 'w-10 h-10' },
    md: { logo: 32, text: 'text-xl', container: 'w-12 h-12' },
    lg: { logo: 48, text: 'text-2xl', container: 'w-16 h-16' },
    xl: { logo: 64, text: 'text-3xl', container: 'w-20 h-20' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${config.container} rounded-2xl hero-gradient flex items-center justify-center shadow-lg shadow-primary-purple/20`}>
        <KrizPayLogo size={config.logo} variant="white" />
      </div>
      {showText && (
        <div>
          <h1 className={`font-bold ${textColor} ${config.text}`}>KrizPay</h1>
          <p className="text-text-secondary text-sm">The Future of Finance</p>
        </div>
      )}
    </div>
  );
};

// Icon-only version for compact spaces
export const KrizPayIcon: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white' | 'dark' | 'gradient';
  className?: string;
}> = ({
  size = 'md',
  variant = 'white',
  className = ''
}) => {
  const sizeConfig = {
    xs: { logo: 16, container: 'w-8 h-8' },
    sm: { logo: 20, container: 'w-10 h-10' },
    md: { logo: 24, container: 'w-12 h-12' },
    lg: { logo: 32, container: 'w-16 h-16' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.container} rounded-xl hero-gradient flex items-center justify-center shadow-lg shadow-primary-purple/20 ${className}`}>
      <KrizPayLogo size={config.logo} variant={variant} />
    </div>
  );
};