import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  allowTransparent?: boolean;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label = 'Cor',
  allowTransparent = true,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Cores pré-definidas para o quiz
  const presetColors = [
    { color: '#432818', name: 'Marrom Escuro' },
    { color: '#B89B7A', name: 'Bege Dourado' },
    { color: '#A08766', name: 'Bege Escuro' },
    { color: '#F5F5DC', name: 'Bege Claro' },
    { color: '#FFFFFF', name: 'Branco' },
    { color: '#000000', name: 'Preto' },
    { color: '#374151', name: 'Cinza Escuro' },
    { color: '#6B7280', name: 'Cinza Médio' },
    { color: '#9CA3AF', name: 'Cinza Claro' },
    { color: '#aa6b5d', name: 'Vermelho' },
    { color: '#10B981', name: 'Verde' },
    { color: '#B89B7A', name: 'Azul' },
  ];

  const displayValue = value === 'transparent' ? 'Transparente' : value;
  const isTransparent = value === 'transparent';

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium text-[#432818]">{label}</Label>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-10 justify-start border-[#B89B7A]/30 hover:bg-[#B89B7A]/10"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-4 h-4 rounded border border-gray-300',
                  isTransparent && 'bg-transparent border-dashed'
                )}
                style={{
                  backgroundColor: isTransparent ? 'transparent' : value,
                }}
              />
              <span className="text-sm">{isTransparent ? 'Transparente' : displayValue}</span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Cores Pré-definidas</Label>
              <div className="grid grid-cols-4 gap-2">
                {presetColors.map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-10 h-10 rounded border-2 hover:scale-110 transition-transform',
                      value === color
                        ? 'border-[#B89B7A] ring-2 ring-[#B89B7A]/30'
                        : 'border-gray-300'
                    )}
                    style={{ backgroundColor: color }}
                    title={name}
                    aria-label={`Selecionar cor ${name}`}
                  />
                ))}
              </div>
            </div>

            {allowTransparent && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Transparente</Label>
                <button
                  onClick={() => {
                    onChange('transparent');
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full h-10 rounded border-2 border-dashed hover:bg-gray-50 transition-colors flex items-center justify-center',
                    value === 'transparent' ? 'border-[#B89B7A] bg-[#B89B7A]/10' : 'border-gray-300'
                  )}
                  aria-label="Selecionar cor transparente"
                >
                  <span style={{ color: '#6B4F43' }}>Sem cor de fundo</span>
                </button>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium mb-2 block">Cor Personalizada</Label>
              <input
                type="color"
                value={isTransparent ? '#432818' : value}
                onChange={e => {
                  onChange(e.target.value);
                  setIsOpen(false);
                }}
                style={{ borderColor: '#E5DDD5' }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
