import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyInputProps } from '../interfaces/PropertyEditor';
import { cn } from '@/lib/utils';

export const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  errorMessage,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label className={cn(
        "text-sm font-medium",
        required && "after:content-['*'] after:text-red-500 after:ml-1",
        error && "text-red-600"
      )}>
        {label}
      </Label>
      
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          error && "border-red-500 focus:border-red-500",
          "transition-colors"
        )}
      />
      
      {error && errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
