
import React from 'react';
import { Tabs as AntTabs } from 'antd';
import type { TabsProps as AntTabsProps } from 'antd';

export interface TabsProps extends Omit<AntTabsProps, 'size'> {
  size?: 'small' | 'middle' | 'large';
  variant?: 'default' | 'card' | 'editable-card';
}

export const Tabs: React.FC<TabsProps> = ({ 
  size = 'middle',
  variant = 'default',
  className = '',
  ...props 
}) => {
  const combinedClassName = [
    'ant-tabs-custom',
    className
  ].filter(Boolean).join(' ');

  return (
    <AntTabs
      size={size}
      type={variant === 'default' ? 'line' : variant}
      className={combinedClassName}
      {...props}
    />
  );
};

export default Tabs;
