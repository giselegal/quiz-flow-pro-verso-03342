import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { styled } from 'styled-components';

const StyledCard = styled(AntCard)<{ $variant?: string; $hoverable?: boolean }>`
  border-radius: var(--radius);
  border-color: var(--border);
  background-color: var(--card);
  color: var(--card-foreground);
  transition: all 0.2s ease;

  ${({ $variant }) => {
    switch ($variant) {
      case 'component':
        return `
          cursor: pointer;
          
          &:hover {
            border-color: var(--brand-primary);
            box-shadow: 0 4px 12px var(--ring);
            transform: translateY(-2px);
          }
        `;
      case 'page':
        return `
          border-left: 4px solid var(--brand-primary);
          
          &:hover {
            background: var(--accent);
          }
        `;
      default:
        return '';
    }
  }}

  ${({ $hoverable }) => $hoverable && `
    &:hover {
      box-shadow: 0 2px 8px var(--ring);
    }
  `}

  .ant-card-head {
    border-bottom-color: var(--border);
    
    .ant-card-head-title {
      color: var(--brand-secondary);
      font-weight: 600;
    }
  }

  .ant-card-body {
    color: var(--muted-foreground);
  }
`;

interface CardProps extends AntCardProps {
  variant?: 'default' | 'component' | 'page';
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'default',
  hoverable = false,
  ...props 
}) => {
  return (
    <StyledCard
      $variant={variant}
      $hoverable={hoverable}
      hoverable={variant === 'component'}
      {...props}
    />
  );
};

export default Card;
