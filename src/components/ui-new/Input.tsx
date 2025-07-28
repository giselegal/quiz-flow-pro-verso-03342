import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { styled } from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';

const StyledInput = styled(AntInput)`
  &.ant-input {
    border-radius: var(--radius);
    border-color: var(--border);
    background-color: var(--background);
    color: var(--foreground);
    padding: 8px 12px;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--brand-primary);
    }

    &:focus {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 2px var(--ring);
    }

    &::placeholder {
      color: var(--muted-foreground);
    }
  }
`;

const StyledSearch = styled(AntInput.Search)`
  .ant-input {
    border-radius: var(--radius);
    border-color: var(--border);
    background-color: var(--background);
    color: var(--foreground);
    padding: 8px 12px;
    font-size: 14px;

    &:hover {
      border-color: var(--brand-primary);
    }

    &:focus {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 2px var(--ring);
    }
  }

  .ant-btn {
    background: var(--brand-primary);
    border-color: var(--brand-primary);
    border-radius: 0 var(--radius) var(--radius) 0;

    &:hover {
      background: var(--brand-accent);
      border-color: var(--brand-accent);
    }
  }
`;

interface InputProps extends AntInputProps {
  variant?: 'default' | 'search';
}

export const Input: React.FC<InputProps> = ({ 
  variant = 'default',
  ...props 
}) => {
  if (variant === 'search') {
    return (
      <StyledSearch
        placeholder="Buscar..."
        enterButton={<SearchOutlined />}
        {...props}
      />
    );
  }

  return <StyledInput {...props} />;
};

export default Input;
