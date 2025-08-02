import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'full', 
  size = 'md',
  onClick 
}) => {
  const sizeClasses = {
    sm: 'h-6 text-sm',
    md: 'h-8 text-lg',
    lg: 'h-10 text-xl',
    xl: 'h-12 text-2xl'
  };

  const logoIcon = (
    <div className={cn(
      "flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold rounded-lg",
      sizeClasses[size].split(' ')[0], // pega apenas a altura
      size === 'sm' ? 'w-6 text-xs' : 
      size === 'md' ? 'w-8 text-sm' : 
      size === 'lg' ? 'w-10 text-base' : 'w-12 text-lg'
    )}>
      CQ
    </div>
  );

  const logoText = (
    <span className={cn(
      "font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",
      sizeClasses[size].split(' ')[1] // pega apenas o tamanho do texto
    )}>
      CaktoQuiz
    </span>
  );

  const content = () => {
    switch (variant) {
      case 'icon':
        return logoIcon;
      case 'text':
        return logoText;
      case 'full':
      default:
        return (
          <div className="flex items-center gap-2">
            {logoIcon}
            {logoText}
          </div>
        );
    }
  };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center hover:opacity-80 transition-opacity",
          className
        )}
      >
        {content()}
      </button>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      {content()}
    </div>
  );
};

export default Logo;
