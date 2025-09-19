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

        {/* Fundo sutil e profissional */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="url(#bgGradient)"
          opacity="0.6"
        />

        {/* Logo principal com filtros */}
        <g filter="url(#dropShadow)">
          {/* Q profissional - forma geométrica perfeita */}
          <g>
            {/* Corpo principal do Q - círculo perfeito */}
            <circle
              cx="60"
              cy="55"
              r="22"
              fill="none"
              stroke="url(#mainGradient)"
              strokeWidth="4.5"
              filter="url(#glowEffect)"
              opacity="0.95"
            />

            {/* Cauda do Q - linha diagonal elegante integrada */}
            <line
              x1="75"
              y1="70"
              x2="82"
              y2="77"
              stroke="url(#mainGradient)"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#glowEffect)"
              opacity="0.95"
            />
          </g>

          {/* Seta de crescimento moderna - separada e bem definida */}
          <g stroke="url(#arrowGradient)" strokeLinecap="round" filter="url(#glowEffect)">
            {/* Shaft principal da seta */}
            <line
              x1="85"
              y1="72"
              x2="98"
              y2="45"
              strokeWidth="3.5"
              opacity="0.9"
            />

            {/* Ponta da seta - triangular profissional */}
            <path
              d="M94 49 L98 45 L94 41"
              fill="none"
              strokeWidth="3.5"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Indicadores de progresso sutis */}
            <circle cx="88" cy="67" r="1.5" fill="url(#arrowGradient)" opacity="0.7" />
            <circle cx="92" cy="59" r="2" fill="url(#arrowGradient)" opacity="0.8" />
            <circle cx="96" cy="51" r="2.5" fill="url(#arrowGradient)" opacity="0.9" />
          </g>

          {/* Centro do Q - símbolo minimalista */}
          <g opacity="0.8">
            {/* Ponto central - representa o núcleo do conhecimento */}
            <circle cx="60" cy="55" r="8" fill="url(#mainGradient)" opacity="0.15" />

            {/* Símbolo interno - questionamento inteligente */}
            <g fill="#FFFFFF" opacity="0.9">
              <circle cx="60" cy="50" r="2" />
              <circle cx="60" cy="60" r="1.5" />
            </g>
          </g>
        </g>

        {/* Elementos de fluxo profissionais - linhas sutis */}
        <g opacity="0.4" stroke="url(#mainGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M25 40 Q40 35 55 40" />
          <path d="M65 80 Q80 85 95 80" />
        </g>

        {/* Pontos de destaque minimalistas */}
        <g opacity="0.5">
          <circle cx="30" cy="30" r="2" fill="#00BFFF" />
          <circle cx="90" cy="30" r="1.5" fill="#00FF7F" />
          <circle cx="30" cy="90" r="1" fill="#FF00FF" />
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
