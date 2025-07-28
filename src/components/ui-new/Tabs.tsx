import React from 'react';
import { Tabs as AntTabs, TabsProps as AntTabsProps } from 'antd';
import { styled } from 'styled-components';

const StyledTabs = styled(AntTabs)`
  .ant-tabs-nav {
    background: var(--accent);
    border-radius: var(--radius);
    padding: 4px;
    margin-bottom: 16px;
  }

  .ant-tabs-tab {
    border-radius: calc(var(--radius) * 0.75) !important;
    border: none !important;
    color: var(--muted-foreground) !important;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: var(--foreground) !important;
      background: var(--accent) !important;
    }
  }

  .ant-tabs-tab-active {
    background: var(--brand-primary) !important;
    color: var(--primary-foreground) !important;
    box-shadow: var(--shadow-sm);

    &:hover {
      color: var(--primary-foreground) !important;
    }
  }

  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-content-holder {
    padding: 0;
  }
`;

interface TabsProps extends Omit<AntTabsProps, 'size'> {
  size?: 'small' | 'middle' | 'large';
  variant?: 'default' | 'card' | 'editable-card';
}

export const Tabs: React.FC<TabsProps> = ({ 
  size = 'middle',
  variant = 'default',
  ...props 
}) => {
  return (
    <StyledTabs
      size={size}
      type={variant === 'default' ? 'line' : variant}
      {...props}
    />
  );
};

export default Tabs;
