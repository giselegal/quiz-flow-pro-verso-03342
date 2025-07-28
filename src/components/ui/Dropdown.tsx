
import React from 'react';
import { Dropdown as AntDropdown } from 'antd';
import type { DropdownProps as AntDropdownProps, MenuProps } from 'antd';

export interface DropdownProps extends Omit<AntDropdownProps, 'menu'> {
  items: MenuProps['items'];
  trigger?: ('click' | 'hover' | 'contextMenu')[];
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  items,
  trigger = ['hover'],
  className = '',
  children,
  ...props 
}) => {
  const menu: MenuProps = {
    items,
    className: 'bg-white border border-gray-200 rounded-md shadow-lg z-50'
  };

  return (
    <AntDropdown
      menu={menu}
      trigger={trigger}
      className={className}
      {...props}
    >
      {children}
    </AntDropdown>
  );
};

export default Dropdown;
