import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import { styled } from 'styled-components';

const StyledButton = styled(AntButton)`
  &.ant-btn {
    border-radius: var(--radius);
    font-weight: 500;
    transition: all 0.2s ease;

    &-primary {
      background: var(--brand-primary);
      border-color: var(--brand-primary);
      color: var(--primary-foreground);

      &:hover {
        background: var(--brand-accent);
        border-color: var(--brand-accent);
      }
    }

    &-default {
      border-color: var(--border);
      background-color: var(--background);
      color: var(--foreground);

      &:hover {
        border-color: var(--brand-primary);
        color: var(--brand-primary);
        background-color: var(--accent);
      }
    }
  }
`;

export interface ButtonProps extends Omit<AntButtonProps, 'size' | 'type'> {
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

  // Cores para variantes especiais
  const getVariantStyles = (variant: ButtonProps['variant']) => {
    switch (variant) {
      case 'success':
        return {
          style: { backgroundColor: '#52c41a', borderColor: '#52c41a' }
        };
      case 'warning':
        return {
          style: { backgroundColor: '#faad14', borderColor: '#faad14' }
        };
      case 'danger':
        return {
          danger: true
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <AntButton
      type={getAntType(variant)}
      size={getAntSize(size)}
      loading={loading}
      block={fullWidth}
      className={className}
      {...variantStyles}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
