// @ts-nocheck
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';
import { ArrowRightLeft, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

interface BeforeAfterInlineBlockProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente inline para comparação antes/depois da etapa 20
 * 100% responsivo, mobile-first com máximo 2 colunas
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const BeforeAfterInlineBlock: React.FC<BeforeAfterInlineBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  const properties = block.properties || {};
  const title = properties.title || 'Sua Transformação';
  const subtitle = properties.subtitle || 'Veja o antes e depois da sua nova imagem';
  const beforeImage =
    properties.beforeImage || 'https://placehold.co/400x500/cccccc/333333?text=Antes';
  const afterImage =
    properties.afterImage || 'https://placehold.co/400x500/cccccc/333333?text=Depois';
  const beforeLabel = properties.beforeLabel || 'ANTES';
  const afterLabel = properties.afterLabel || 'DEPOIS';
  const showComparison = properties.showComparison !== false;
  const layoutStyle = properties.layoutStyle || 'side-by-side';

  const [activeView, setActiveView] = useState<'before' | 'after'>('before');

  // Margens editáveis (padrões 0)
  const marginTop = properties.marginTop ?? 0;
  const marginBottom = properties.marginBottom ?? 0;
  const marginLeft = properties.marginLeft ?? 0;
  const marginRight = properties.marginRight ?? 0;

  const handleEdit = (field: string, value: any) => {
    if (onPropertyChange && !disabled) {
      onPropertyChange(field, value);
    }
  };

  const renderSideBySide = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Antes */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={beforeImage}
            alt="Antes"
            className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div style={{ backgroundColor: '#FAF9F7' }}>{beforeLabel}</div>
        </div>
      </div>

      {/* Depois */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={afterImage}
            alt="Depois"
            className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {afterLabel}
          </div>
        </div>
      </div>
    </div>
  );

  const renderToggle = () => (
    <div className="max-w-md mx-auto">
      {/* Toggle Buttons */}
      <div style={{ backgroundColor: '#E5DDD5' }}>
        <button
          onClick={() => setActiveView('before')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all',
            activeView === 'before'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800',
            // Margens universais com controles deslizantes
            getMarginClass(marginTop, 'top'),
            getMarginClass(marginBottom, 'bottom'),
            getMarginClass(marginLeft, 'left'),
            getMarginClass(marginRight, 'right')
          )}
        >
          <EyeOff className="w-4 h-4" />
          {beforeLabel}
        </button>
        <button
          onClick={() => setActiveView('after')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all',
            activeView === 'after'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          )}
        >
          <Eye className="w-4 h-4" />
          {afterLabel}
        </button>
      </div>

      {/* Image Display */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={activeView === 'before' ? beforeImage : afterImage}
          alt={activeView === 'before' ? 'Antes' : 'Depois'}
          className="w-full h-64 md:h-80 object-cover transition-opacity duration-300"
        />
        <div
          className={cn(
            'absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white',
            activeView === 'before' ? 'bg-red-500' : 'bg-green-500'
          )}
        >
          {activeView === 'before' ? beforeLabel : afterLabel}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        'w-full p-4 md:p-6 transition-all duration-200',
        'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg',
        isSelected && 'ring-2 ring-[#B89B7A] bg-[#B89B7A]/10',
        !disabled && 'cursor-pointer hover:bg-[#B89B7A]/10/80',
        className
      )}
      onClick={onClick}
    >
      {/* Título */}
      <div className="text-center mb-6">
        <h3 style={{ color: '#432818' }}>{title}</h3>
        <p style={{ color: '#6B4F43' }}>{subtitle}</p>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mt-3 rounded-full" />
      </div>

      {/* Comparação */}
      {showComparison && (
        <div className="mb-6">
          {layoutStyle === 'side-by-side' ? renderSideBySide() : renderToggle()}
        </div>
      )}

      {/* Ícone central de transformação para layout lado a lado */}
      {layoutStyle === 'side-by-side' && (
        <div className="flex justify-center -mt-3 mb-3">
          <div className="bg-[#B89B7A]/100 text-white p-3 rounded-full shadow-lg">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center">
        <p style={{ color: '#6B4F43' }}>
          Esta pode ser sua transformação! Comece hoje mesmo sua jornada rumo ao estilo dos sonhos.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#B89B7A]/100 text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B89B7A] transition-colors">
          <ArrowRightLeft className="w-4 h-4" />
          Quero Minha Transformação
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterInlineBlock;
