import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import React from 'react';

interface PropertySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  showValue?: boolean;
}

export const PropertySlider: React.FC<PropertySliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  required = false,
  error = false,
  errorMessage,
  disabled = false,
  showValue = true,
}) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label
          className={cn(
            'text-sm font-medium',
            required && "after:content-['*'] after:text-red-500 after:ml-1",
            error && 'text-red-600'
          )}
        >
          {label}
        </Label>
        {showValue && (
          <span className="text-sm text-gray-600 font-mono">
            {value}{unit}
          </span>
        )}
      </div>

      <div className="px-1">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(error && 'opacity-60')}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>

      {error && errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
