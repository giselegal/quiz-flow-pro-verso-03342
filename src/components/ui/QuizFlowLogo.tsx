import React from 'react';

interface QuizFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const QuizFlowLogo: React.FC<QuizFlowLogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const LogoIcon = () => (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00BFFF" />
          <stop offset="50%" stopColor="#4A2E9F" />
          <stop offset="100%" stopColor="#FF00FF" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00BFFF" />
          <stop offset="100%" stopColor="#FF00FF" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      {/* Background Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#primaryGradient)" 
        opacity="0.1"
      />
      
      {/* Main Q Shape */}
      <path 
        d="M25 35 Q25 25 35 25 L65 25 Q75 25 75 35 L75 55 Q75 65 65 65 L45 65 L55 75 L45 75 L35 65 Q25 65 25 55 Z" 
        fill="url(#primaryGradient)" 
        filter="url(#glow)"
      />
      
      {/* Inner Circle (Quiz bubble) */}
      <circle 
        cx="50" 
        cy="45" 
        r="12" 
        fill="white" 
        opacity="0.9"
      />
      
      {/* Flow Lines */}
      <path 
        d="M20 20 Q30 15 40 20 Q50 25 60 20 Q70 15 80 20" 
        stroke="url(#accentGradient)" 
        strokeWidth="2" 
        fill="none" 
        opacity="0.6"
      />
      <path 
        d="M20 80 Q30 85 40 80 Q50 75 60 80 Q70 85 80 80" 
        stroke="url(#accentGradient)" 
        strokeWidth="2" 
        fill="none" 
        opacity="0.6"
      />
      
      {/* Tech dots */}
      <circle cx="15" cy="50" r="2" fill="#00BFFF" opacity="0.8" />
      <circle cx="85" cy="50" r="2" fill="#FF00FF" opacity="0.8" />
      <circle cx="50" cy="15" r="1.5" fill="#4A2E9F" opacity="0.6" />
      <circle cx="50" cy="85" r="1.5" fill="#4A2E9F" opacity="0.6" />
    </svg>
  );

  const LogoText = () => (
    <div className={`font-bold ${textSizes[size]} bg-gradient-to-r from-brand-brightBlue via-brand-lightBlue to-brand-brightPink bg-clip-text text-transparent`}>
      QuizFlow Pro
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoIcon />
      <div>
        <LogoText />
        <p className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} text-brand-darkBlue/70 -mt-1 font-medium`}>
          Interactive Marketing
        </p>
      </div>
    </div>
  );
};

export default QuizFlowLogo;