
import React from 'react';
import { Alert as AntAlert } from 'antd';
import type { AlertProps as AntAlertProps } from 'antd';

export interface AlertProps extends AntAlertProps {
  variant?: 'success' | 'info' | 'warning' | 'error';
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  className = '',
  ...props
}) => {
  return (
    <AntAlert
      type={variant}
      className={className}
      {...props}
    />
  );
};

export default Alert;
