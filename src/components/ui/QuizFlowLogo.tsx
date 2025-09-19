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
        viewBox="0 0 120 120"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradientes mais vibrantes */}
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="50%" stopColor="#4A2E9F" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>

          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="50%" stopColor="#00FF7F" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>

          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BFFF" opacity="0.1" />
            <stop offset="100%" stopColor="#FF00FF" opacity="0.05" />
          </linearGradient>

          <filter id="glowEffect">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="dropShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,191,255,0.4)" />
          </filter>
        </defs>

        {/* Fundo circular moderno */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="url(#bgGradient)"
          className="animate-pulse"
          style={{ animationDuration: '3s' }}
        />

        {/* Logo principal com filtros */}
        <g filter="url(#dropShadow)">
          {/* Q moderno - círculo principal */}
          <circle
            cx="60"
            cy="55"
            r="25"
            fill="none"
            stroke="url(#mainGradient)"
            strokeWidth="6"
            filter="url(#glowEffect)"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />

          {/* Seta de crescimento integrada - mais proeminente */}
          <g stroke="url(#arrowGradient)" strokeWidth="5" strokeLinecap="round" filter="url(#glowEffect)">
            {/* Linha principal da seta - diagonal ascendente */}
            <line
              x1="73"
              y1="70"
              x2="95"
              y2="48"
              className="animate-pulse"
              style={{ animationDuration: '2s' }}
            />

            {/* Ponta da seta - mais definida */}
            <polyline
              points="87,52 95,48 91,40"
              fill="none"
              strokeLinejoin="round"
              strokeWidth="4"
              className="animate-pulse"
              style={{ animationDuration: '2s' }}
            />

            {/* Indicadores de progresso */}
            <circle cx="78" cy="65" r="2" fill="url(#arrowGradient)" opacity="0.8" />
            <circle cx="85" cy="58" r="2.5" fill="url(#arrowGradient)" opacity="0.9" />
            <circle cx="92" cy="51" r="3" fill="url(#arrowGradient)" />
          </g>

          {/* Símbolo interno do Quiz - mais claro */}
          <g fill="#FFFFFF" opacity="1">
            {/* Ponto de interrogação estilizado */}
            <circle cx="60" cy="48" r="3" />
            <path
              d="M60 55 Q57 60 60 65"
              stroke="#4A2E9F"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="60" cy="68" r="2" fill="#4A2E9F" />
          </g>
        </g>

        {/* Elementos de fluxo melhorados */}
        <g opacity="0.6" stroke="url(#mainGradient)" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M20 35 Q35 30 50 35 Q65 30 80 35" className="animate-pulse" style={{ animationDuration: '5s' }} />
          <path d="M40 85 Q55 90 70 85 Q85 90 100 85" className="animate-pulse" style={{ animationDuration: '6s' }} />
        </g>

        {/* Pontos de destaque nos cantos */}
        <g>
          <circle cx="25" cy="25" r="3" fill="#00BFFF" opacity="0.8">
            <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="95" cy="25" r="2.5" fill="#00FF7F" opacity="0.8">
            <animate attributeName="r" values="1.5;3.5;1.5" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="25" cy="95" r="2" fill="#FF00FF" opacity="0.8">
            <animate attributeName="r" values="1;3;1" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  ); const LogoText = () => {
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
