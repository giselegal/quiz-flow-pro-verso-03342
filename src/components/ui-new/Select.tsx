import React from 'react';
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import { styled } from 'styled-components';

const StyledSelect = styled(AntSelect)`
  .ant-select-selector {
    border-radius: 8px !important;
    border-color: rgba(184, 155, 122, 0.3) !important;
    transition: all 0.2s ease;

    &:hover {
      border-color: #B89B7A !important;
    }
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #B89B7A !important;
    box-shadow: 0 0 0 2px rgba(184, 155, 122, 0.2) !important;
  }

  .ant-select-selection-placeholder {
    color: #8F7A6A !important;
  }

  .ant-select-arrow {
    color: #8F7A6A !important;
  }

  &.ant-select-open .ant-select-arrow {
    color: #B89B7A !important;
  }
`;

interface SelectProps extends AntSelectProps {
  variant?: 'default' | 'borderless';
}

export const Select: React.FC<SelectProps> = ({ 
  variant = 'default',
  ...props 
}) => {
  return (
    <StyledSelect
      variant={variant === 'borderless' ? 'borderless' : undefined}
      {...props}
    />
  );
};

export default Select;
