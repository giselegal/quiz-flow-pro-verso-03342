import React from 'react';
import { Dropdown as AntDropdown, DropdownProps as AntDropdownProps, Menu } from 'antd';
import { styled } from 'styled-components';

const StyledMenu = styled(Menu)`
  background-color: var(--background);
  border-radius: var(--radius);
  border: 1px solid var(--border);

  .ant-dropdown-menu-item {
    color: var(--foreground);
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--accent);
      color: var(--accent-foreground);
    }
  }
  
  .ant-dropdown-menu-item-danger {
    color: var(--destructive);
    
    &:hover {
      background: var(--destructive);
      color: var(--destructive-foreground);
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
