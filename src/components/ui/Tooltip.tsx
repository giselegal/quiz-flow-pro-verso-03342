
import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import type { TooltipProps as AntTooltipProps } from 'antd';

export interface TooltipProps extends AntTooltipProps {
  variant?: 'default' | 'dark' | 'light';
}

export const Tooltip: React.FC<TooltipProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  const getVariantProps = (variant: TooltipProps['variant']) => {
    switch (variant) {
      case 'dark':
        return { color: '#000' };
      case 'light':
        return { color: '#fff' };
      default:
        return {};
    }
  };

  return (
    <AntTooltip
      className={className}
      {...getVariantProps(variant)}
      {...props}
    />
  );
};

export default Tooltip;
