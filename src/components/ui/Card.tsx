
import React from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';

export interface CardProps extends AntCardProps {
  variant?: 'default' | 'component' | 'page';
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  ...props 
}) => {
  const getVariantClasses = (variant: CardProps['variant']) => {
    switch (variant) {
      case 'component':
        return 'border-2 border-dashed border-gray-300 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200';
      case 'page':
        return 'border-l-4 border-l-blue-500 hover:bg-gray-50 transition-all duration-200';
      default:
        return 'border border-gray-200 hover:shadow-md transition-all duration-200';
    }
  };

  const combinedClassName = [
    getVariantClasses(variant),
    className
  ].filter(Boolean).join(' ');

  return (
    <AntCard
      hoverable={hoverable || variant === 'component'}
      className={combinedClassName}
      {...props}
    >
      {children}
    </AntCard>
  );
};

export default Card;
