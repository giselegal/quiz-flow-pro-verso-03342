import React from 'react';
import { cn } from '../../../../lib/utils';

interface ButtonInlineBlockProps {
  text?: string;
  action?: 'next-step' | 'submit-form' | 'custom-url' | 'calculate-result';
  url?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
  [key: string]: any;
}

const ButtonInlineBlock: React.FC<ButtonInlineBlockProps> = ({
  text = 'Continuar',
  action = 'next-step',
  url = '#',
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  className,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const handleClick = () => {
    if (action === 'custom-url' && url) {
      window.open(url, '_blank');
    } else if (action === 'next-step') {
      console.log('Next step triggered');
    } else if (action === 'submit-form') {
      console.log('Form submit triggered');
    } else if (action === 'calculate-result') {
      console.log('Calculate result triggered');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {text}
    </button>
  );
};

export default ButtonInlineBlock;
