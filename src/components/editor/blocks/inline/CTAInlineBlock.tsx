import React from 'react';
import { cn } from '../../../../lib/utils';
import { ArrowRight, Zap } from 'lucide-react';

interface CTAInlineBlockProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonAction?: string;
  buttonUrl?: string;
  variant?: 'primary' | 'secondary' | 'urgent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  [key: string]: any;
}

const CTAInlineBlock: React.FC<CTAInlineBlockProps> = ({
  title = 'Não Perca Esta Oportunidade!',
  subtitle = 'Comece sua transformação agora mesmo',
  buttonText = 'Começar Agora',
  buttonAction = 'next-step',
  buttonUrl = '#',
  variant = 'primary',
  size = 'lg',
  className,
  ...props
}) => {
  const variantStyles = {
    primary: {
      bg: 'bg-gradient-to-r from-blue-600 to-purple-600',
      text: 'text-white',
      button: 'bg-white text-blue-600 hover:bg-gray-50',
    },
    secondary: {
      bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
      text: 'text-gray-900',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    urgent: {
      bg: 'bg-gradient-to-r from-red-600 to-orange-600',
      text: 'text-white',
      button: 'bg-white text-red-600 hover:bg-gray-50',
    },
  };

  const sizeStyles = {
    sm: {
      padding: 'p-4',
      title: 'text-lg',
      subtitle: 'text-sm',
      button: 'px-4 py-2 text-sm',
    },
    md: {
      padding: 'p-6',
      title: 'text-xl',
      subtitle: 'text-base',
      button: 'px-6 py-3 text-base',
    },
    lg: {
      padding: 'p-8',
      title: 'text-2xl',
      subtitle: 'text-lg',
      button: 'px-8 py-4 text-lg',
    },
    xl: {
      padding: 'p-10',
      title: 'text-3xl',
      subtitle: 'text-xl',
      button: 'px-10 py-5 text-xl',
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const handleClick = () => {
    if (buttonAction === 'custom-url' && buttonUrl) {
      window.open(buttonUrl, '_blank');
    } else if (buttonAction === 'next-step') {
      // Handle next step logic
      console.log('Next step triggered');
    }
  };

  return (
    <div
      className={cn(
        'w-full rounded-xl text-center',
        currentVariant.bg,
        currentVariant.text,
        currentSize.padding,
        className,
      )}
      {...props}
    >
      <div className="space-y-4">
        {variant === 'urgent' && (
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium uppercase tracking-wide">Oferta Limitada</span>
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
        )}

        <h3 className={cn('font-bold leading-tight', currentSize.title)}>{title}</h3>

        <p className={cn('opacity-90 leading-relaxed', currentSize.subtitle)}>{subtitle}</p>

        <button
          onClick={handleClick}
          className={cn(
            'inline-flex items-center space-x-2 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50',
            currentVariant.button,
            currentSize.button,
          )}
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CTAInlineBlock;
