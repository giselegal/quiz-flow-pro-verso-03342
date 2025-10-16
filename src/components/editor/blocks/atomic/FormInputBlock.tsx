/**
 * 🎨 FORM INPUT BLOCK - Atomic Component
 * 
 * Input de formulário com label e validação
 */

import { memo, useState } from 'react';
import { cn } from '@/lib/utils';

export interface FormInputBlockProps {
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  inputType?: 'text' | 'email' | 'tel' | 'number';
  value?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  className?: string;
  mode?: 'edit' | 'preview';
}

export const FormInputBlock = memo(({
  id = 'input',
  label = 'Label',
  placeholder = '',
  required = false,
  inputType = 'text',
  value = '',
  onChange,
  errorMessage = '',
  className = '',
  mode = 'preview'
}: FormInputBlockProps) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-base md:text-lg font-semibold text-gray-800"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={inputType}
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        required={required}
        disabled={mode === 'edit'}
        className={cn(
          'w-full p-4 text-base border-2 rounded-xl transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent',
          'placeholder:text-gray-400',
          errorMessage && 'border-red-500'
        )}
      />
      
      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
});

FormInputBlock.displayName = 'FormInputBlock';
