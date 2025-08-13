import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PropertyInputProps } from '../interfaces/PropertyEditor';
import { cn } from '@/lib/utils';

export const PropertyTextarea: React.FC<PropertyInputProps> = ({
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
      
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        className={cn(
          error && "border-red-500 focus:border-red-500",
          "transition-colors resize-none"
        )}
      />
      
      {error && errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
