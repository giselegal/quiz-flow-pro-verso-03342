import React from 'react';
import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps } from 'antd';

const { Option } = AntSelect;

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<AntSelectProps, 'size' | 'options'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  options?: SelectOption[];
  loading?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
}

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

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  size = 'medium',
  fullWidth = true,
  options = [],
  loading = false,
  searchable = false,
  multiple = false,
  clearable = true,
  className = '',
  placeholder = 'Selecione uma opção',
  children,
  ...props
}) => {
  const combinedClassName = [
    fullWidth ? 'w-full' : '',
    error ? 'border-red-500' : '',
    className
  ].filter(Boolean).join(' ');

  const selectProps: AntSelectProps = {
    size: getAntSize(size),
    className: combinedClassName,
    placeholder,
    loading,
    showSearch: searchable,
    mode: multiple ? 'multiple' : undefined,
    allowClear: clearable,
    status: error ? 'error' : undefined,
    style: { width: fullWidth ? '100%' : undefined },
    filterOption: searchable ? (input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    : false,
    ...props
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <AntSelect {...selectProps}>
        {children || options.map(option => (
          <Option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            label={option.label}
          >
            <div className="flex items-center gap-2">
              {option.icon && option.icon}
              {option.label}
            </div>
          </Option>
        ))}
      </AntSelect>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// Componente específico para múltipla seleção
export const MultiSelect: React.FC<Omit<SelectProps, 'multiple'>> = (props) => {
  return <Select {...props} multiple={true} />;
};

// Componente específico para seleção com busca
export const SearchableSelect: React.FC<Omit<SelectProps, 'searchable'>> = (props) => {
  return <Select {...props} searchable={true} />;
};

export { Option };
export default Select;
