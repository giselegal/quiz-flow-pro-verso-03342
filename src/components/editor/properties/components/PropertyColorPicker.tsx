import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React from 'react';

interface PropertyColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  allowTransparent?: boolean;
}

export const PropertyColorPicker: React.FC<PropertyColorPickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  errorMessage,
  disabled = false,
  allowTransparent = true,
}) => {
  const displayValue = value === 'transparent' ? '#ffffff' : value;

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === 'transparent' || inputValue.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(inputValue);
    }
  };

  const handleTransparent = () => {
    onChange('transparent');
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

      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={displayValue}
            onChange={handleColorChange}
            disabled={disabled || value === 'transparent'}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
          {value === 'transparent' && (
            <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">TR</span>
            </div>
          )}
        </div>

        <Input
          value={value}
          onChange={handleInputChange}
          placeholder="#000000"
          disabled={disabled}
          className={cn(
            'flex-1',
            error && 'border-red-500 focus:border-red-500'
          )}
        />
      </div>

      {allowTransparent && (
        <button
          type="button"
          onClick={handleTransparent}
          disabled={disabled || value === 'transparent'}
          className="text-xs text-blue-600 hover:text-blue-800 underline disabled:text-gray-400 disabled:no-underline"
        >
          {value === 'transparent' ? 'Transparente (ativo)' : 'Tornar transparente'}
        </button>
      )}

      {error && errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
