import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { styled } from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';

const StyledInput = styled(AntInput)`
  &.ant-input {
    border-radius: 8px;
    border-color: rgba(184, 155, 122, 0.3);
    padding: 8px 12px;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      border-color: #B89B7A;
    }

    &:focus {
      border-color: #B89B7A;
      box-shadow: 0 0 0 2px rgba(184, 155, 122, 0.2);
    }

    &::placeholder {
      color: #8F7A6A;
    }
  }
`;

const StyledSearch = styled(AntInput.Search)`
  .ant-input {
    border-radius: 8px;
    border-color: rgba(184, 155, 122, 0.3);
    padding: 8px 12px;
    font-size: 14px;

    &:hover {
      border-color: #B89B7A;
    }

    &:focus {
      border-color: #B89B7A;
      box-shadow: 0 0 0 2px rgba(184, 155, 122, 0.2);
    }
  }

  .ant-btn {
    background: #B89B7A;
    border-color: #B89B7A;
    border-radius: 0 8px 8px 0;

    &:hover {
      background: #A68960;
      border-color: #A68960;
    }
  }
`;

interface InputProps extends AntInputProps {
  variant?: 'default' | 'search';
}

export const Input: React.FC<InputProps> = ({ 
  variant = 'default',
  allowClear,
  ...props 
}) => {
  if (variant === 'search') {
    return (
      <StyledSearch
        placeholder="Buscar..."
        enterButton={<SearchOutlined />}
        allowClear={allowClear}
        {...props}
      />
    );
  }

  return <StyledInput allowClear={allowClear} {...props} />;
};

export default Input;
