
import React from 'react';
import { Progress as AntProgress } from 'antd';
import type { ProgressProps as AntProgressProps } from 'antd';

export interface ProgressProps extends AntProgressProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const Progress: React.FC<ProgressProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  const getVariantColor = (variant: ProgressProps['variant']) => {
    switch (variant) {
      case 'success':
        return '#52c41a';
      case 'warning':
        return '#faad14';
      case 'error':
        return '#ff4d4f';
      default:
        return undefined;
    }
  };

  return (
    <AntProgress
      className={className}
      strokeColor={getVariantColor(variant)}
      {...props}
    />
  );
};

export default Progress;
