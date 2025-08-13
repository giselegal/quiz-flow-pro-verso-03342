import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PropertyInputProps } from '../interfaces/PropertyEditor';
import { cn } from '@/lib/utils';

export const PropertyCheckbox: React.FC<PropertyInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  errorMessage,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`checkbox-${label}`}
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked)}
          disabled={disabled}
          className={cn(
            error && "border-red-500",
            "transition-colors"
          )}
        />
        <Label 
          htmlFor={`checkbox-${label}`}
          className={cn(
            "text-sm font-medium cursor-pointer",
            required && "after:content-['*'] after:text-red-500 after:ml-1",
            error && "text-red-600",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label}
        </Label>
      </div>
      
      {error && errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
