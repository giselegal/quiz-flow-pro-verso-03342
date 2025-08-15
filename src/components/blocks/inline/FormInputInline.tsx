/**
 * FormInputInline - Componente de input de formulário inline
 * Suporta captura de dados do usuário (nome, email, etc.)
 */

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputInlineProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  required?: boolean;
  name?: string;
  defaultValue?: string;
  maxLength?: number;
  
  // Layout properties
  marginTop?: number;
  marginBottom?: number;
  spacing?: 'small' | 'medium' | 'large';
  containerWidth?: 'small' | 'medium' | 'large' | 'full';
  
  // Style properties
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // Event handlers
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

const FormInputInline: React.FC<FormInputInlineProps> = ({
  label = "Nome",
  placeholder = "Digite seu nome...",
  type = "text",
  required = false,
  name = "user_input",
  defaultValue = "",
  maxLength = 100,
  marginTop = 0,
  marginBottom = 16,
  spacing = 'medium',
  containerWidth = 'medium',
  backgroundColor = 'transparent',
  textColor = 'inherit',
  borderColor = 'hsl(var(--border))',
  onValueChange,
  onSubmit,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit?.(value.trim());
      
      // Emitir evento customizado para integração com quiz
      if (name === 'userName' || name === 'user_name') {
        const event = new CustomEvent('quiz-form-complete', {
          detail: {
            formData: { name: value.trim() },
            fieldName: name,
          }
        });
        window.dispatchEvent(event);
      }
    }
  }, [value, onSubmit, name]);

  const getContainerWidth = () => {
    switch (containerWidth) {
      case 'small': return 'max-w-xs';
      case 'medium': return 'max-w-sm';
      case 'large': return 'max-w-md';
      case 'full': return 'w-full';
      default: return 'max-w-sm';
    }
  };

  const getSpacing = () => {
    switch (spacing) {
      case 'small': return 'space-y-1';
      case 'medium': return 'space-y-2';
      case 'large': return 'space-y-4';
      default: return 'space-y-2';
    }
  };

  return (
    <div 
      className={`flex flex-col items-center ${getContainerWidth()} mx-auto ${getSpacing()}`}
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        backgroundColor,
        color: textColor,
      }}
    >
      {label && (
        <Label 
          htmlFor={name} 
          className="text-center font-medium"
          style={{ color: textColor }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="text-center"
        style={{
          borderColor,
          color: textColor,
          backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
        }}
      />
      
      {value.trim() && (
        <div className="text-xs text-muted-foreground text-center">
          Pressione Enter para continuar
        </div>
      )}
    </div>
  );
};

export default FormInputInline;