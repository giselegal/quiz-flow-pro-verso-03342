import React from 'react';
import { Button } from '@/components/ui/button';
import { BRAND_STYLES } from '@/styles/brandColors';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;
}

const GoldButton: React.FC<GoldButtonProps> = ({
  children,
  onClick,
  size = 'md',
  variant = 'solid',
  className = ''
}) => {
  const baseClasses = 'font-semibold transition-all duration-300 transform hover:scale-105';
  const variantClasses = {
    solid: `${BRAND_STYLES.buttonPrimary} text-white shadow-lg hover:shadow-xl`,
    outline: 'border-2 border-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-orange-500 hover:to-yellow-600 hover:text-white',
    ghost: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 hover:bg-gradient-to-r hover:from-yellow-400/10 hover:via-orange-500/10 hover:to-yellow-600/10'
  };

  // Mapeia 'md' -> 'default' para o componente Button
  const sizeMap = { sm: 'sm', md: 'default', lg: 'lg' } as const;
  const buttonSize = sizeMap[size];

  return (
    <Button
      onClick={onClick}
      size={buttonSize}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Button>
  );
};

export default GoldButton;