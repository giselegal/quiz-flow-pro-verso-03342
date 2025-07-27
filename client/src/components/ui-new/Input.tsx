import React from 'react';
import { Input as AntInput, InputNumber } from 'antd';
import type { InputProps as AntInputProps, InputNumberProps } from 'antd';

const { TextArea, Search, Password } = AntInput;

export interface InputProps extends Omit<AntInputProps, 'size'> {
  label?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  helperText?: string;
}

export interface TextAreaProps extends React.ComponentProps<typeof TextArea> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export interface NumberInputProps extends Omit<InputNumberProps, 'size'> {
  label?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  helperText?: string;
}

export interface SearchInputProps extends React.ComponentProps<typeof Search> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export interface PasswordInputProps extends React.ComponentProps<typeof Password> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

// Componente base para wrapper comum
const InputWrapper: React.FC<{
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}> = ({ label, error, helperText, children }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// Função para mapear size
const getAntSize = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return 'small';
    case 'medium':
      return 'middle';
    case 'large':
      return 'large';
    default:
      return 'middle';
  }
};

// Input padrão
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'medium',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const combinedClassName = [
    fullWidth ? 'w-full' : '',
    error ? 'border-red-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <InputWrapper label={label} error={error} helperText={helperText}>
      <AntInput
        size={getAntSize(size)}
        className={combinedClassName}
        status={error ? 'error' : undefined}
        {...props}
      />
    </InputWrapper>
  );
};

// TextArea
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const combinedClassName = [
    fullWidth ? 'w-full' : '',
    error ? 'border-red-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <InputWrapper label={label} error={error} helperText={helperText}>
      <AntInput.TextArea
        className={combinedClassName}
        status={error ? 'error' : undefined}
        {...props}
      />
    </InputWrapper>
  );
};

// Input Number
export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  error,
  helperText,
  size = 'medium',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const combinedClassName = [
    fullWidth ? 'w-full' : '',
    error ? 'border-red-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <InputWrapper label={label} error={error} helperText={helperText}>
      <InputNumber
        size={getAntSize(size)}
        className={combinedClassName}
        status={error ? 'error' : undefined}
        style={{ width: fullWidth ? '100%' : undefined }}
        {...props}
      />
    </InputWrapper>
  );
};

// Search Input
export const SearchInput: React.FC<SearchInputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const combinedClassName = [
    fullWidth ? 'w-full' : '',
    error ? 'border-red-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <InputWrapper label={label} error={error} helperText={helperText}>
      <AntInput.Search
        className={combinedClassName}
        status={error ? 'error' : undefined}
        {...props}
      />
    </InputWrapper>
  );
};

// Password Input
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const combinedClassName = [
    fullWidth ? 'w-full' : '',
    error ? 'border-red-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <InputWrapper label={label} error={error} helperText={helperText}>
      <AntInput.Password
        className={combinedClassName}
        status={error ? 'error' : undefined}
        {...props}
      />
    </InputWrapper>
  );
};

export default Input;
