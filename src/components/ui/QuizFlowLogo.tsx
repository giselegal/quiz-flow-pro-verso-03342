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
          <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#00FF7F" />
          </linearGradient>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A2E9F" />
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

        {/* Background circle with subtle gradient - represents learning space */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="url(#primaryGradient)"
          opacity="0.08"
          className="animate-pulse duration-3000"
        />

        {/* Main design centered at 50,50 */}
        <g filter="url(#shadow)">
          {/* Q letter body - perfect circle representing completeness of knowledge */}
          <circle
            cx="50"
            cy="48"
            r="22"
            fill="none"
            stroke="url(#primaryGradient)"
            strokeWidth="5"
            filter="url(#glow)"
            className="animate-pulse duration-4000"
          />

          {/* Growth Arrow integrated into Q tail - starts from inside Q and grows upward/outward */}
          <g stroke="url(#growthGradient)" strokeWidth="4" strokeLinecap="round" filter="url(#glow)">
            {/* Arrow shaft - diagonal growth trajectory */}
            <line x1="64" y1="62" x2="78" y2="48" className="animate-pulse duration-2000" />

            {/* Arrow head - pointing up and right (growth direction) */}
            <polyline
              points="72,52 78,48 74,42"
              fill="none"
              strokeLinejoin="round"
              className="animate-pulse duration-2000"
            />

            {/* Small growth indicators - ascending dots */}
            <circle cx="68" cy="57" r="1.5" fill="url(#growthGradient)" opacity="0.8" />
            <circle cx="73" cy="52" r="1.2" fill="url(#growthGradient)" opacity="0.9" />
            <circle cx="78" cy="47" r="1" fill="url(#growthGradient)" />
          </g>

          {/* Inner knowledge symbol - question mark essence */}
          <g fill="#FFFFFF" opacity="0.95">
            <circle cx="50" cy="42" r="2" />
            <path
              d="M50 48 Q48 52 50 56"
              stroke="#4A2E9F"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="50" cy="58" r="1.5" fill="#4A2E9F" />
          </g>
        </g>

        {/* Flow indicators - represents learning journey */}
        <g opacity="0.5" stroke="url(#flowGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          {/* Progressive flow lines - getting stronger as they move forward */}
          <path d="M15 30 Q25 25 35 28 Q45 25 55 28" opacity="0.4" />
          <path d="M45 72 Q55 75 65 72 Q75 75 85 72" opacity="0.6" />
          <path d="M20 50 Q30 47 40 50" opacity="0.3" />
        </g>

        {/* Achievement indicators - corner elements suggesting progress */}
        <g opacity="0.7">
          <circle cx="20" cy="20" r="1.8" fill="#00BFFF">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="20" r="1.5" fill="#00FF7F">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="80" r="1.2" fill="#FF00FF">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
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
