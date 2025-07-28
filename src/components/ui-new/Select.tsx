import React from 'react';
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import { styled } from 'styled-components';

const StyledSelect = styled(AntSelect)`
  .ant-select-selector {
    border-radius: var(--radius) !important;
    border-color: var(--border) !important;
    background-color: var(--background) !important;
    color: var(--foreground) !important;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--brand-primary) !important;
    }
  }

  &.ant-select-focused .ant-select-selector {
    border-color: var(--brand-primary) !important;
    box-shadow: 0 0 0 2px var(--ring) !important;
  }

  .ant-select-selection-placeholder {
    color: var(--muted-foreground) !important;
  }

  .ant-select-arrow {
    color: var(--muted-foreground) !important;
  }

  &.ant-select-open .ant-select-arrow {
    color: var(--brand-primary) !important;
  }

  .ant-select-dropdown {
    border-radius: var(--radius) !important;
    border-color: var(--border) !important;
    background-color: var(--background) !important;
  }

  .ant-select-item {
    color: var(--foreground) !important;

    &-option-selected {
      background-color: var(--accent) !important;
    }

    &-option-active {
      background-color: var(--accent) !important;
    }
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
