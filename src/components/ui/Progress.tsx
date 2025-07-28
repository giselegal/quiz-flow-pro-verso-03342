
import React from 'react';
import { Progress as AntProgress } from 'antd';
import type { ProgressProps as AntProgressProps } from 'antd';

export interface ProgressProps extends AntProgressProps {
  variant?: 'line' | 'circle' | 'dashboard';
  size?: 'small' | 'default' | 'large';
}

export const Progress: React.FC<ProgressProps> = ({
  variant = 'line',
  size = 'default',
  className = '',
  ...props
}) => {
  const getSizeProps = (size: ProgressProps['size']) => {
    switch (size) {
      case 'small':
        return { strokeWidth: 6, width: 80 };
      case 'large':
        return { strokeWidth: 12, width: 120 };
      default:
        return { strokeWidth: 8, width: 100 };
    }
  };

  const sizeProps = variant !== 'line' ? getSizeProps(size) : {};

  return (
    <AntProgress
      type={variant}
      className={className}
      {...sizeProps}
      {...props}
    />
  );
};

export default Progress;
