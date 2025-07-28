import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

export interface ButtonProps extends Omit<AntButtonProps, 'size'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  ...props
}) => {
  // Mapear variant para type do Ant Design
  const getAntType = (variant: ButtonProps['variant']) => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'success':
        return 'primary';
      case 'warning':
        return 'primary';
      case 'danger':
        return 'primary';
      case 'ghost':
        return 'text';
      case 'link':
        return 'link';
      default:
        return 'default';
    }
  };

  // Mapear size para size do Ant Design
  const getAntSize = (size: ButtonProps['size']) => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'middle';
      case 'large':
        return 'large';
      default:
        return 'middle';
    }
  };

  // Classes customizadas para diferentes variants
  const getVariantClasses = (variant: ButtonProps['variant']) => {
    const baseClasses = 'font-medium transition-all duration-200';
    
    switch (variant) {
      case 'success':
        return `${baseClasses} bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600`;
      case 'warning':
        return `${baseClasses} bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600`;
      case 'danger':
        return `${baseClasses} bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600`;
      case 'ghost':
        return `${baseClasses} bg-transparent border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500`;
      default:
        return baseClasses;
    }
  };

  const combinedClassName = [
    getVariantClasses(variant),
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <AntButton
      type={getAntType(variant)}
      size={getAntSize(size)}
      loading={loading}
      className={combinedClassName}
      block={fullWidth}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
