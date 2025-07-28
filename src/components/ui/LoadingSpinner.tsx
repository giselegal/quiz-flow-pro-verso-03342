
import React from 'react';
import { Spin } from 'antd';
import type { SpinProps } from 'antd';

export interface LoadingSpinnerProps extends SpinProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  text,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spin size={size} tip={text} {...props} />
    </div>
  );
};

export default LoadingSpinner;
