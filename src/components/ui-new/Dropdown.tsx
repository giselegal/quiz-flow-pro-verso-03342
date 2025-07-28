import React from 'react';
import { Dropdown as AntDropdown, DropdownProps as AntDropdownProps, Menu } from 'antd';
import { styled } from 'styled-components';

const StyledMenu = styled(Menu)`
  .ant-dropdown-menu-item {
    color: #432818;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(184, 155, 122, 0.1);
      color: #432818;
    }
  }
  
  .ant-dropdown-menu-item-danger {
    color: #ff4d4f;
    
    &:hover {
      background: rgba(255, 77, 79, 0.1);
      color: #ff4d4f;
    }
  }
`;

interface DropdownProps extends Omit<AntDropdownProps, 'overlay'> {
  items: {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    danger?: boolean;
    onClick?: () => void;
  }[];
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  items,
  children,
  ...props 
}) => {
  const menu = (
    <StyledMenu
      items={items.map(item => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        danger: item.danger,
        onClick: item.onClick,
      }))}
    />
  );

  return (
    <AntDropdown overlay={menu} {...props}>
      {children}
    </AntDropdown>
  );
};

export default Dropdown;
