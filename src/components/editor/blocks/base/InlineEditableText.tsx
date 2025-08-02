
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface InlineEditableTextProps {
  text: string;
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
  onEdit?: () => void;
  minHeight?: string;
  maxWidth?: string;
  responsive?: boolean | Record<string, any>;
}

const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  text,
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
  isEditing = false,
  onEdit,
  minHeight,
  maxWidth,
  responsive
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.setSelectionRange) {
        const len = value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditing, value]);

  const handleClick = () => {
    if (!disabled && !isEditing) {
      setIsEditing(true);
      onEdit?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      setValue(newValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(text);
      setIsEditing(false);
    }
  };

  const fontSizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const fontWeightClasses = {
    'light': 'font-light',
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold'
  };

  const textAlignClasses = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify'
  };

  const baseClasses = cn(
    'transition-all duration-200 outline-none',
    fontSizeClasses[fontSize],
    fontWeightClasses[fontWeight],
    textAlignClasses[textAlign],
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    isEditing ? 'cursor-text' : '',
    className
  );

  const displayValue = value || placeholder;

  if (isEditing) {
    const Component = multiline ? 'textarea' : 'input';
    return (
      <Component
        ref={inputRef as any}
        value={value}
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
          ...style
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
        ...style
      }}
    >
      {displayValue}
    </div>
  );
};

export default InlineEditableText;
