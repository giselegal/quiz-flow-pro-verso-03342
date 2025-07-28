import React from 'react';
import { Tabs as AntTabs, TabsProps as AntTabsProps } from 'antd';
import { styled } from 'styled-components';

const StyledTabs = styled(AntTabs)`
  .ant-tabs-nav {
    background: linear-gradient(to right, rgba(184, 155, 122, 0.1), rgba(170, 107, 93, 0.1));
    border-radius: 8px;
    padding: 4px;
    margin-bottom: 16px;
  }

  .ant-tabs-tab {
    border-radius: 6px !important;
    border: none !important;
    color: #8F7A6A !important;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: #432818 !important;
      background: rgba(184, 155, 122, 0.1) !important;
    }
  }

  .ant-tabs-tab-active {
    background: #B89B7A !important;
    color: white !important;
    box-shadow: 0 2px 4px rgba(184, 155, 122, 0.3);

    &:hover {
      color: white !important;
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
