import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React from 'react';
import { PropertyInputProps } from '../interfaces/PropertyEditor';

interface PropertyNumberProps extends PropertyInputProps {
  min?: number;
  max?: number;
  step?: number;
}

export const PropertyNumber: React.FC<PropertyNumberProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  required = false,
  error = false,
  errorMessage,
  placeholder,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    onChange(clampedValue);
  };

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

      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={value || ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(error && 'border-red-500 focus:border-red-500', 'transition-colors')}
        />
        <span className="text-xs text-gray-500">
          ({min}-{max})
        </span>
      </div>

      {error && errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
};
