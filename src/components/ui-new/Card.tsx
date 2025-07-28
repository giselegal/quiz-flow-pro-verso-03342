import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { styled } from 'styled-components';

const StyledCard = styled(AntCard)<{ $variant?: string; $hoverable?: boolean }>`
  border-radius: 12px;
  border-color: rgba(184, 155, 122, 0.2);
  transition: all 0.2s ease;

  ${({ $variant }) => {
    switch ($variant) {
      case 'component':
        return `
          cursor: pointer;
          
          &:hover {
            border-color: #B89B7A;
            box-shadow: 0 4px 12px rgba(184, 155, 122, 0.15);
            transform: translateY(-2px);
          }
        `;
      case 'page':
        return `
          border-left: 4px solid #B89B7A;
          
          &:hover {
            background: rgba(184, 155, 122, 0.05);
          }
        `;
      default:
        return '';
    }
  }}

  ${({ $hoverable }) => $hoverable && `
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }
  `}

  .ant-card-head {
    border-bottom-color: rgba(184, 155, 122, 0.2);
    
    .ant-card-head-title {
      color: #432818;
      font-weight: 600;
    }
  }

  .ant-card-body {
    color: #8F7A6A;
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
