/**
 * 🎯 EDITABLE COLOR COMPONENT
 * 
 * Componente de seleção de cor para customização
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface EditableColorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PRESET_COLORS = [
  '#fef3c7', // yellow-100
  '#fed7d7', // red-100  
  '#d1fae5', // green-100
  '#dbeafe', // blue-100
  '#fce7f3', // pink-100
  '#e0e7ff', // indigo-100
  '#c6f6d5', // green-200
  '#fed7fe', // purple-100
  '#f3f4f6', // gray-100
  '#92400e', // yellow-800
  '#c53030', // red-600
  '#065f46', // green-800
  '#1e40af', // blue-700
  '#be185d', // pink-700
  '#3730a3', // indigo-700
  '#2d3748', // gray-800
  '#7c2d12', // orange-800
];

export const EditableColor: React.FC<EditableColorProps> = ({
  label,
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState(value);

  const handlePresetSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
      >
        <div 
          className="w-4 h-4 rounded border border-stone-300"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm">{label}</span>
        <Palette className="w-3 h-3 text-stone-500" />
      </button>

      {/* Color picker dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-stone-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          {/* Custom color input */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Cor personalizada:
            </label>
            <input
              type="color"
              value={customValue}
              onChange={handleCustomChange}
              className="w-full h-8 border border-stone-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={customValue}
              onChange={(e) => {
                setCustomValue(e.target.value);
                onChange(e.target.value);
              }}
              className="w-full mt-1 px-2 py-1 border border-stone-300 rounded text-xs"
              placeholder="#000000"
            />
          </div>

          {/* Preset colors */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-stone-700 mb-2">
              Cores predefinidas:
            </label>
            <div className="grid grid-cols-6 gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handlePresetSelect(color)}
                  className={cn(
                    'w-6 h-6 rounded border-2 transition-transform hover:scale-110',
                    value === color ? 'border-stone-800' : 'border-stone-300'
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableColor;