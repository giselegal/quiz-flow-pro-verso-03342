import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface InlineEditableTextProps {
  text?: string;
  value?: string; // Compatibilidade com props value
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  multiline?: boolean;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: React.CSSProperties;
  // Additional props for compatibility
  isEditing?: boolean;
  isPreviewing?: boolean; // Desabilita edição no modo preview
  onEdit?: () => void;
  minHeight?: string;
  maxWidth?: string;
  responsive?: boolean | Record<string, any>;
  maxLines?: number;
}

const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  text,
  value,
  onChange,
  placeholder = 'Digite aqui...',
  className = '',
  fontSize = 'base',
  fontWeight = 'normal',
  color,
  textAlign = 'left',
  multiline = false,
  maxLength,
  disabled = false,
  autoFocus = false,
  onFocus,
  onBlur,
  style,
  isEditing: editingProp = false,
  isPreviewing = false,
  onEdit,
  minHeight,
  maxWidth,
  responsive: _responsive,
  maxLines: _maxLines = 3,
}) => {
  // Compatibilidade: usar value se fornecido, senão text
  const displayText = value !== undefined ? value : text || '';

  const [isEditing, setIsEditing] = useState(editingProp);
  const [internalValue, setInternalValue] = useState(displayText);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setInternalValue(displayText);
  }, [displayText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.setSelectionRange) {
        const len = internalValue.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditing, internalValue]);

  const handleClick = () => {
    if (!disabled && !isEditing && !isPreviewing) {
      setIsEditing(true);
      onEdit?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      setInternalValue(newValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(internalValue);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setInternalValue(displayText);
      setIsEditing(false);
    }
  };

  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const baseClasses = cn(
    'transition-all duration-200 outline-none',
    fontSizeClasses[fontSize],
    fontWeightClasses[fontWeight],
    textAlignClasses[textAlign],
    disabled ? 'cursor-not-allowed opacity-50' : isPreviewing ? 'cursor-default' : 'cursor-pointer',
    isEditing && !isPreviewing ? 'cursor-text' : '',
    className
  );

  const displayValue = internalValue || placeholder;

  if (isEditing) {
    const Component = multiline ? 'textarea' : 'input';
    return (
      <Component
        ref={inputRef as any}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        className={cn(
          baseClasses,
          'border-none bg-transparent resize-none',
          multiline ? 'min-h-[1.5em]' : 'h-auto'
        )}
        style={{
          color,
          minHeight,
          maxWidth,
          ...style,
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        rows={multiline ? 1 : undefined}
      />
    );
  }

  return (
    <div
      className={cn(baseClasses, 'min-h-[1em]')}
      onClick={handleClick}
      style={{
        color,
        minHeight,
        maxWidth,
        ...style,
      }}
    >
      {displayValue}
    </div>
  );
};

export default InlineEditableText;
