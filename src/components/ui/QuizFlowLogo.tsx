import React from 'react';

interface QuizFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  theme?: 'light' | 'dark';
}

const QuizFlowLogo: React.FC<QuizFlowLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  theme = 'light'
}) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-12 h-12', text: 'text-xl' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl' },
    xl: { icon: 'w-24 h-24', text: 'text-4xl' }
  };

  const LogoIcon = () => (
    <div className={`${sizeClasses[size].icon} relative flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
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
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,191,255,0.3)" />
          </filter>
        </defs>

        {/* Background circle with subtle gradient */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#primaryGradient)"
          opacity="0.1"
          className="animate-pulse"
        />

        {/* Main Q shape - modern and professional */}
        <g filter="url(#shadow)">
          {/* Outer ring */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="3"
            opacity="0.8"
          />

          {/* Q letter - clean circle */}
          <circle
            cx="50"
            cy="45"
            r="18"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="4"
            filter="url(#glow)"
          />

          {/* Q tail - diagonal line */}
          <line
            x1="60"
            y1="55"
            x2="68"
            y2="63"
            stroke="url(#primaryGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Inner accent - small quiz indicator */}
          <circle cx="50" cy="45" r="6" fill="white" opacity="0.9" />
          <circle cx="50" cy="42" r="1.5" fill="#4A2E9F" />
          <circle cx="50" cy="48" r="1" fill="#4A2E9F" />
        </g>

        {/* Flow indicators - elegant curved lines */}
        <g opacity="0.6">
          <path
            d="M20 25 Q35 20 50 30 Q65 20 80 25"
            stroke="url(#accentGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M20 75 Q35 80 50 70 Q65 80 80 75"
            stroke="url(#accentGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Corner accent dots */}
        <circle cx="15" cy="15" r="1.5" fill="#00BFFF" opacity="0.7" />
        <circle cx="85" cy="15" r="1.5" fill="#FF00FF" opacity="0.7" />
        <circle cx="15" cy="85" r="1.5" fill="#FF00FF" opacity="0.7" />
        <circle cx="85" cy="85" r="1.5" fill="#00BFFF" opacity="0.7" />
      </svg>
    </div>
  );

  const LogoText = () => {
    const textColor = theme === 'dark' ? 'text-white' : 'text-brand-darkBlue';

    return (
      <div className="flex items-center">
        <span className={`font-bold ${sizeClasses[size].text} ${textColor} tracking-tight`}>
          Quiz<span className="bg-gradient-to-r from-brand-brightBlue via-brand-lightBlue to-brand-brightPink bg-clip-text text-transparent">Flow</span>
        </span>
        <span className={`ml-2 text-xs ${textColor} opacity-70 font-semibold px-2 py-1 bg-gradient-to-r from-brand-brightBlue/10 to-brand-brightPink/10 rounded-full border border-brand-lightBlue/20`}>
          PRO
        </span>
      </div>
    );
  };

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  // Full logo (default)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};

export default QuizFlowLogo;
