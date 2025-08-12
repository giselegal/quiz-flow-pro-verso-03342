// @ts-nocheck
// =====================================================================
// components/editor/blocks/FallbackBlock.tsx - Componente de fallback
// =====================================================================

import { cn } from '@/lib/utils';
import { AlertTriangle, Info } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';

/**
 * FallbackBlock - Componente de fallback para tipos de bloco não encontrados
 * Renderiza uma mensagem informativa quando um componente não pode ser carregado
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

const FallbackBlock: React.FC<BlockComponentProps & { blockType?: string }> = ({
  block,
  isSelected = false,
  onClick,
  blockType,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        // Layout base
        'w-full min-h-[80px] p-4 rounded-lg border-2 border-dashed transition-all duration-200',
        // Estados visuais
        'border-stone-300 bg-stone-50 hover:bg-stone-100',
        isSelected && 'border-yellow-500 bg-stone-100 ring-2 ring-yellow-200',
        // Cursor
        'cursor-pointer',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-stone-600" />
        </div>
        <div className="flex-grow">
          <h4 className="text-sm font-semibold text-stone-700 mb-1">Componente não encontrado</h4>
          <p className="text-xs text-stone-700 mb-2">
            Tipo:{' '}
            <code className="bg-stone-200 px-1 rounded">
              {blockType || block.type || 'unknown'}
            </code>
          </p>
          <div className="flex items-center space-x-2 text-xs text-stone-600">
            <Info className="w-3 h-3" />
            <span>Clique para configurar no painel de propriedades →</span>
          </div>
        </div>
      </div>

      {/* Propriedades do bloco (para debug) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-3">
          <summary className="text-xs text-stone-600 cursor-pointer">
            Debug: Propriedades do bloco
          </summary>
          <pre className="mt-2 text-xs text-stone-700 bg-stone-100 p-2 rounded overflow-auto">
            {JSON.stringify(block, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default FallbackBlock;
