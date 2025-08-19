import React from 'react';

interface QuizFlowProLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const QuizFlowProLogo: React.FC<QuizFlowProLogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-4xl'
  };

  const iconSize = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64
  };

  const LogoIcon = () => (
    <svg 
      width={iconSize[size]} 
      height={iconSize[size]} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="25%" stopColor="#FFA500" />
          <stop offset="50%" stopColor="#FF8C00" />
          <stop offset="75%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="goldGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFED4E" />
          <stop offset="25%" stopColor="#FFB84D" />
          <stop offset="50%" stopColor="#FF9F40" />
          <stop offset="75%" stopColor="#E6B800" />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
      </defs>
      
      {/* Círculo externo com gradiente dourado */}
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill="url(#goldGradient)" 
        className="transition-all duration-300 hover:fill-[url(#goldGradientHover)]" 
      />
      
      {/* Círculo interno */}
      <circle 
        cx="24" 
        cy="24" 
        r="18" 
        fill="#FEFEFE" 
      />
      
      {/* Ícone Q estilizado */}
      <path 
        d="M16 18C16 14.6863 18.6863 12 22 12H26C29.3137 12 32 14.6863 32 18V26C32 29.3137 29.3137 32 26 32H24L28 36H25L21 32H22C18.6863 32 16 29.3137 16 26V18Z" 
        fill="url(#goldGradient)"
      />
      
      {/* Ponto do Q */}
      <circle 
        cx="24" 
        cy="22" 
        r="3" 
        fill="#FEFEFE" 
      />
      
      {/* Elementos decorativos - pontos flutuantes */}
      <circle cx="12" cy="12" r="1.5" fill="url(#goldGradient)" opacity="0.6" />
      <circle cx="36" cy="12" r="1" fill="url(#goldGradient)" opacity="0.4" />
      <circle cx="12" cy="36" r="1" fill="url(#goldGradient)" opacity="0.4" />
      <circle cx="36" cy="36" r="1.5" fill="url(#goldGradient)" opacity="0.6" />
    </svg>
  );

  const LogoText = () => (
    <span 
      className={`font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent ${textSizes[size]}`}
    >
      QuizFlow <span className="font-light">Pro</span>
    </span>
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
      <LogoText />
    </div>
  );
};

export default QuizFlowProLogo;