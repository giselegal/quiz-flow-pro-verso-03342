import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';
import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  showSubtitle?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * 🎨 LOGO DA MARCA - Componente de identidade visual
 *
 * Logo profissional e consistente para uso em toda aplicação
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showSubtitle = false,
  theme = 'light',
}) => {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-sm',
      subtitle: 'text-xs',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-lg',
      subtitle: 'text-xs',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-2xl',
      subtitle: 'text-sm',
    },
  };

  const themeClasses = {
    light: {
      text: 'text-brand-text',
      subtitle: 'text-brand-text/60',
      gradient: 'from-brand-primary to-brand-dark',
    },
    dark: {
      text: 'text-white',
      subtitle: 'text-white/60',
      gradient: 'from-brand-light to-brand-primary',
    },
  };

  const iconElement = (
    <div
      className={cn(
        'bg-gradient-to-r rounded-lg flex items-center justify-center shadow-md transition-all duration-200 hover:shadow-lg',
        themeClasses[theme].gradient,
        sizeClasses[size].icon
      )}
    >
      <Sparkles
        className={cn(
          'text-white',
          size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'
        )}
      />
    </div>
  );

  const textElement = (
    <div className="flex flex-col">
      <div
        className={cn(
          'font-semibold flex items-center gap-2',
          themeClasses[theme].text,
          sizeClasses[size].text
        )}
      >
        QuizQuest
        <div className="flex items-center gap-1">
          <div
            className={cn(
              'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded px-1.5 py-0.5 flex items-center gap-1',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm'
            )}
          >
            <Zap className={cn(size === 'sm' ? 'h-2 w-2' : 'h-3 w-3')} />
            Pro
          </div>
        </div>
      </div>
      {showSubtitle && (
        <p
          className={cn('leading-tight', themeClasses[theme].subtitle, sizeClasses[size].subtitle)}
        >
          Sistema integrado de criação de quizzes
        </p>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <div className={cn('flex items-center', className)}>{iconElement}</div>;
  }

  if (variant === 'text') {
    return <div className={cn('flex items-center', className)}>{textElement}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {iconElement}
      {textElement}
    </div>
  );
};

export default BrandLogo;
