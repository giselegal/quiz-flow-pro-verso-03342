/**
 * 🎨 GRID OPTIONS BLOCK - Atomic Component
 * 
 * Grid de opções para quiz (com imagens ou texto)
 */

import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface GridOption {
  id: string;
  text?: string;
  label?: string;
  imageUrl?: string;
  image?: string;
}

export interface GridOptionsBlockProps {
  options?: GridOption[];
  columns?: number;
  gap?: string;
  hasImages?: boolean;
  selectionIndicator?: 'checkbox' | 'border' | 'both';
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  maxSelections?: number;
  minSelections?: number;
  className?: string;
  mode?: 'edit' | 'preview';
}

export const GridOptionsBlock = memo(({
  options = [],
  columns = 2,
  gap = 'gap-3 sm:gap-4',
  hasImages = true,
  selectionIndicator = 'checkbox',
  selectedIds = [],
  onSelectionChange,
  maxSelections,
  minSelections = 1,
  className = '',
  mode = 'preview'
}: GridOptionsBlockProps) => {
  const [internalSelected, setInternalSelected] = useState<string[]>(selectedIds);

  const handleToggle = (optionId: string) => {
    if (mode === 'edit') return;

    setInternalSelected(prev => {
      const isSelected = prev.includes(optionId);
      let newSelection: string[];

      if (isSelected) {
        newSelection = prev.filter(id => id !== optionId);
      } else {
        if (maxSelections && prev.length >= maxSelections) {
          newSelection = [...prev.slice(1), optionId];
        } else {
          newSelection = [...prev, optionId];
        }
      }

      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  return (
    <div
      className={cn(
        'grid w-full',
        gap,
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {options.map(option => {
        const isSelected = internalSelected.includes(option.id);
        const imageUrl = option.imageUrl || option.image;
        const label = option.text || option.label;

        return (
          <button
            key={option.id}
            onClick={() => handleToggle(option.id)}
            disabled={mode === 'edit'}
            className={cn(
              'relative p-3 rounded-xl transition-all duration-200',
              'hover:shadow-lg active:scale-95',
              'border-2',
              isSelected
                ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                : 'border-gray-200 bg-white'
            )}
          >
            {/* Checkbox indicator */}
            {(selectionIndicator === 'checkbox' || selectionIndicator === 'both') && (
              <div
                className={cn(
                  'absolute top-2 right-2 w-6 h-6 rounded-full',
                  'flex items-center justify-center transition-all',
                  isSelected
                    ? 'bg-[#B89B7A] text-white'
                    : 'bg-gray-200 text-transparent'
                )}
              >
                <Check className="w-4 h-4" />
              </div>
            )}

            {/* Image */}
            {hasImages && imageUrl && (
              <div className="aspect-square mb-2 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={label}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Label */}
            <p className={cn(
              'text-sm font-medium text-center',
              isSelected ? 'text-[#B89B7A]' : 'text-gray-700'
            )}>
              {label}
            </p>
          </button>
        );
      })}
    </div>
  );
});

GridOptionsBlock.displayName = 'GridOptionsBlock';
