// =====================================================================
// components/editor/components/ColorPicker.tsx - Seletor de cores avançado
// =====================================================================

import React, { useState, useCallback } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const defaultPresets = [
  '#000000',
  '#374151',
  '#6B7280',
  '#9CA3AF',
  '#D1D5DB',
  '#F3F4F6',
  '#FFFFFF',
  '#7F1D1D',
  '#B91C1C',
  '#432818',
  '#aa6b5d',
  '#F87171',
  '#FCA5A5',
  '#FEE2E2',
  '#92400E',
  '#D97706',
  '#F59E0B',
  '#FBBF24',
  '#FCD34D',
  '#FDE68A',
  '#FEF3C7',
  '#365314',
  '#65A30D',
  '#84CC16',
  '#A3E635',
  '#BEF264',
  '#D9F99D',
  '#ECFCCB',
  '#064E3B',
  '#047857',
  '#059669',
  '#10B981',
  '#34D399',
  '#6EE7B7',
  '#A7F3D0',
  '#155E75',
  '#0891B2',
  '#0EA5E9',
  '#B89B7A',
  '#60A5FA',
  '#93C5FD',
  '#DBEAFE',
  '#581C87',
  '#aa6b5d',
  '#B89B7A',
  '#B89B7A',
  '#C084FC',
  '#DDD6FE',
  '#EDE9FE',
  '#BE185D',
  '#DB2777',
  '#EC4899',
  '#F472B6',
  '#F9A8D4',
  '#FBCFE8',
  '#FCE7F3',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  presets = defaultPresets,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleColorChange = useCallback(
    (color: string) => {
      setInputValue(color);
      onChange(color);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Validate hex color
      if (/^#[0-9A-F]{6}$/i.test(newValue) || /^#[0-9A-F]{3}$/i.test(newValue)) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const handleInputBlur = useCallback(() => {
    // If invalid color, revert to original value
    if (!/^#[0-9A-F]{6}$/i.test(inputValue) && !/^#[0-9A-F]{3}$/i.test(inputValue)) {
      setInputValue(value);
    }
  }, [inputValue, value]);

  return (
    <div className="flex items-center space-x-2 mt-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-8 p-0 border-2"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Escolher cor</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette style={{ color: '#8B7355' }} />
              <span className="text-sm font-medium">Escolher Cor</span>
            </div>

            {/* Native color picker */}
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={value}
                onChange={e => handleColorChange(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <span style={{ color: '#8B7355' }}>Seletor nativo</span>
            </div>

            {/* Preset colors grid */}
            <div>
              <span style={{ color: '#6B4F43' }}>Cores predefinidas</span>
              <div className="grid grid-cols-7 gap-1">
                {presets.map(preset => (
                  <button
                    key={preset}
                    onClick={() => handleColorChange(preset)}
                    className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                      value === preset ? 'border-gray-900 shadow-md' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: preset }}
                    title={preset}
                  />
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleColorChange('#FFFFFF')}
                className="text-xs"
              >
                Branco
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleColorChange('#000000')}
                className="text-xs"
              >
                Preto
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleColorChange('transparent')}
                className="text-xs"
              >
                Transparente
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="#000000"
        className="flex-1 font-mono text-sm"
      />
    </div>
  );
};
