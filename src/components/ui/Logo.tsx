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
    sm: { height: 'h-6', width: 'w-6', iconText: 'text-xs', logoText: 'text-sm' },
    md: { height: 'h-8', width: 'w-8', iconText: 'text-sm', logoText: 'text-lg' },
    lg: { height: 'h-10', width: 'w-10', iconText: 'text-base', logoText: 'text-xl' },
    xl: { height: 'h-12', width: 'w-12', iconText: 'text-lg', logoText: 'text-2xl' }
  };

  const logoIcon = (
    <div className={cn(
      "flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold rounded-lg",
      sizeClasses[size].height,
      sizeClasses[size].width,
      sizeClasses[size].iconText
    )}>
      CQ
    </div>
  );

  const logoText = (
    <span className={cn(
      "font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",
      sizeClasses[size].logoText
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
