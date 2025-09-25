/**
 * 🎨 ColorPicker - Componente visual intuitivo para seleção de cores
 * Sistema padronizado com paleta organizada e preview em tempo real
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Palette } from 'lucide-react';
import { useState } from 'react';
import { COLOR_GROUPS, ColorOption, ColorUtils, POPULAR_COLORS } from '../../config/colorPalette';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  presetColors?: string[];
  showCustomInput?: boolean;
  showPreview?: boolean;
  className?: string;
}

export function ColorPicker({
  value,
  onChange,
  label,
  disabled = false,

  showCustomInput = true,
  showPreview = true,
  className = '',
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue === 'transparent' || newValue.match(/^#[0-9A-F]{6}$/i)) {
      onChange(newValue);
    }
  };

  const handleColorSelect = (colorValue: string) => {
    setInputValue(colorValue);
    onChange(colorValue);
    setIsOpen(false);
  };

  const isValidColor = value === 'transparent' || value.match(/^#[0-9A-F]{6}$/i);

  // Renderizar preview da cor atual
  const ColorPreview = ({ color, size = 'w-10 h-10' }: { color: string; size?: string }) => (
    <div
      className={cn(
        size,
        'rounded-md border-2 border-gray-200 shadow-sm flex items-center justify-center relative overflow-hidden cursor-pointer transition-transform hover:scale-105',
        color === 'transparent' && 'bg-gradient-to-br from-gray-100 to-gray-200'
      )}
      style={{
        backgroundColor: color === 'transparent' ? 'transparent' : color,
      }}
      onClick={() => !disabled && setIsOpen(true)}
    >
      {color === 'transparent' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 0 4px, 4px -4px, 4px 0px',
          }}
        />
      )}
      {!isValidColor && <Palette className="w-4 h-4 text-gray-400" />}
    </div>
  );

  // Renderizar swatch de cor
  const ColorSwatch = ({ colorOption }: { colorOption: ColorOption }) => {
    const isSelected = value === colorOption.value;

    return (
      <button
        onClick={() => handleColorSelect(colorOption.value)}
        className={cn(
          'group relative flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-all',
          isSelected && 'bg-brand-brightPink/10 ring-2 ring-brand-brightPink'
        )}
        title={colorOption.label}
      >
        <div className="relative">
          <ColorPreview color={colorOption.value} size="w-8 h-8" />
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-3 h-3 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
        <span className="text-brand-darkBlue text-xs">{colorOption.label}</span>
      </button>
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="flex gap-2">
        {/* Preview da cor atual */}
        <ColorPreview color={value} />

        {/* Input de texto */}
        <Input
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          placeholder="#FF1CC0 ou transparent"
          className="font-mono text-sm flex-1"
          disabled={disabled}
        />

        {/* Popover com seletor */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" disabled={disabled} className="flex-shrink-0">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {/* Informações da cor atual */}
              <div className="flex items-center gap-3 p-3 bg-brand-background rounded-lg border border-brand-brightPink/20">
                <ColorPreview color={value} size="w-8 h-8" />
                <div className="flex-1">
                  <div className="text-brand-darkBlue font-medium">{ColorUtils.getColorLabel(value)}</div>
                  <div className="text-brand-darkBlue/60 text-sm font-mono">
                    {value === 'transparent' ? 'Transparente' : value}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-brand-darkBlue/5 rounded-lg">
                <button
                  onClick={() => setActiveTab('popular')}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    activeTab === 'popular'
                      ? 'bg-gradient-to-r from-brand-brightPink to-brand-brightBlue text-white shadow-sm'
                      : 'text-brand-darkBlue hover:text-brand-brightPink'
                  )}
                >
                  Populares
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-brand-brightPink to-brand-brightBlue text-white shadow-sm'
                      : 'text-brand-darkBlue hover:text-brand-brightPink'
                  )}
                >
                  Paleta
                </button>
                {showCustomInput && (
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={cn(
                      'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      activeTab === 'custom'
                        ? 'bg-gradient-to-r from-brand-brightPink to-brand-brightBlue text-white shadow-sm'
                        : 'text-brand-darkBlue hover:text-brand-brightPink'
                    )}
                  >
                    Custom
                  </button>
                )}
              </div>

              {/* Content */}
              {activeTab === 'popular' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Cores Mais Usadas</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {POPULAR_COLORS.map(colorOption => (
                      <ColorSwatch key={colorOption.value} colorOption={colorOption} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'all' && (
                <div className="space-y-4">
                  {COLOR_GROUPS.map(group => (
                    <div key={group.id}>
                      <Label className="text-sm font-medium mb-2 block">{group.name}</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {group.colors.map(colorOption => (
                          <ColorSwatch key={colorOption.value} colorOption={colorOption} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'custom' && showCustomInput && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Seletor Nativo</Label>
                    <input
                      type="color"
                      value={isValidColor && value !== 'transparent' ? value : '#FF1CC0'}
                      onChange={e => handleColorSelect(e.target.value)}
                      className="w-full h-10 rounded-md border border-brand-brightPink/30 cursor-pointer"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Código Personalizado</Label>
                    <Input
                      value={inputValue}
                      onChange={e => handleInputChange(e.target.value)}
                      placeholder="#FF1CC0, transparent, etc."
                      className="font-mono text-sm"
                    />
                    {!isValidColor && inputValue && (
                      <p className="text-brand-darkBlue/70 text-xs mt-1">Use formato #RRGGBB ou "transparent"</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleColorSelect('transparent')}
                    className="w-full px-3 py-2 text-sm font-medium border border-brand-brightPink/30 rounded-md hover:bg-brand-brightPink/10 text-brand-darkBlue transition-colors"
                  >
                    Usar Transparente
                  </button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Preview Area */}
      {showPreview && isValidColor && (
        <div className="flex items-center justify-between p-3 bg-brand-background rounded-lg border border-brand-brightPink/20">
          <div className="text-brand-darkBlue/70 text-sm">
            <span>Preview:</span>
            <div
              className="px-3 py-1 rounded-md font-medium transition-colors mt-1"
              style={{
                backgroundColor: value === 'transparent' ? '#FF1CC0' : value,
                color: ColorUtils.getContrastColor(value === 'transparent' ? '#FF1CC0' : value),
              }}
            >
              Texto de Exemplo
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
