import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React from 'react';
import { PropertyInputProps } from '../interfaces/PropertyEditor';

interface PropertySelectProps extends PropertyInputProps {
  options: string[];
}

export const PropertySelect: React.FC<PropertySelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  error = false,
  errorMessage,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label
        className={cn(
          'text-sm font-medium',
          required && "after:content-['*'] after:text-red-500 after:ml-1",
          error && 'text-red-600'
        )}
      >
        {label}
      </Label>

      <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(error && 'border-red-500 focus:border-red-500', 'transition-colors')}
        >
          <SelectValue placeholder={placeholder || `Selecione ${label.toLowerCase()}...`} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter(option => option && option !== '')
            .map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {error && errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
};
