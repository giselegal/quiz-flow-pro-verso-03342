
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  multiline?: boolean;
}

const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange,
  placeholder = 'Digite aqui...',
  fontSize = 'base',
  fontWeight = 'normal',
  className = '',
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      setIsEditing(false);
      onChange(localValue);
    }
  };

  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const fontWeightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const baseClasses = cn(
    fontSizeClasses[fontSize],
    fontWeightClasses[fontWeight],
    'cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors',
    className
  );

  if (isEditing) {
    return multiline ? (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(baseClasses, 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none')}
        autoFocus
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(baseClasses, 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500')}
        autoFocus
      />
    );
  }

  return (
    <div onClick={handleClick} className={baseClasses}>
      {value || placeholder}
    </div>
  );
};

export default InlineEditableText;
