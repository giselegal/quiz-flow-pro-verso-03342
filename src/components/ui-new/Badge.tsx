import React from 'react';
import { Tag } from 'antd';
import type { TagProps } from 'antd';

export interface BadgeProps extends Omit<TagProps, 'color'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  size = 'medium',
  children,
  ...props
}) => {
  // Mapear variant para cor do Ant Design
  const getColor = (variant: BadgeProps['variant']) => {
    switch (variant) {
      case 'primary':
        return 'blue';
      case 'secondary':
        return 'default';
      case 'success':
        return 'green';
      case 'warning':
        return 'orange';
      case 'danger':
        return 'red';
      case 'info':
        return 'cyan';
      default:
        return 'default';
    }
  };

  return (
    <Tag
      color={getColor(variant)}
      {...props}
    >
      {children}
    </Tag>
  );
};

// Variantes especializadas
export const StatusBadge: React.FC<BadgeProps & { status: 'online' | 'offline' | 'processing' }> = ({
  status,
  ...props
}) => {
  const variant = status === 'online' ? 'success' : status === 'offline' ? 'danger' : 'warning';
  return <Badge variant={variant} {...props} />;
};

export const DifficultyBadge: React.FC<BadgeProps & { difficulty: 'easy' | 'medium' | 'hard' }> = ({
  difficulty,
  ...props
}) => {
  const variant = difficulty === 'easy' ? 'success' : difficulty === 'medium' ? 'warning' : 'danger';
  return <Badge variant={variant} {...props} />;
};

export const CategoryBadge: React.FC<BadgeProps & { category: string }> = ({
  category,
  ...props
}) => {
  return <Badge variant="info" {...props} />;
};

export type { BadgeProps };
export type StatusBadgeProps = BadgeProps & { status: 'online' | 'offline' | 'processing' };
export type DifficultyBadgeProps = BadgeProps & { difficulty: 'easy' | 'medium' | 'hard' };
export type CategoryBadgeProps = BadgeProps & { category: string };

export default Badge;
