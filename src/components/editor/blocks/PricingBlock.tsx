/**
 * 💰 PRICING BLOCK - Fase 3
 * 
 * Bloco de preços para páginas de oferta
 * Suporta preço original, preço promocional e CTA
 */

import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import { useBlockData } from '@/hooks/useBlockData';
import type { Block } from '@/types/editor';
import { Button } from '@/components/ui/button';

interface PricingBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
  contextData?: Record<string, any>;
}

export default function PricingBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
  contextData,
}: PricingBlockProps) {
  const blockData = useBlockData(block);
  
  // Extrair dados de pricing
  const pricing = blockData.get<Record<string, any>>('pricing', {});
  const originalPrice = pricing.originalPrice ?? blockData.get('originalPrice', 447);
  const salePrice = pricing.salePrice ?? blockData.get('salePrice', 97);
  const currency = pricing.currency ?? blockData.get('currency', 'R$');
  
  const ctaText = blockData.get('ctaText', 'Quero Transformar Meu Estilo!');
  const ctaUrl = blockData.get('ctaUrl', '#');
  
  const title = blockData.get('title', 'Oferta Especial');
  const subtitle = blockData.get('subtitle', 'Por tempo limitado');
  
  const discount = originalPrice > 0 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) 
    : 0;

  const handleCtaClick = () => {
    if (!isEditable && ctaUrl) {
      window.open(ctaUrl, '_blank');
    }
  };

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Pricing"
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={true}
    >
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-[#FDF8F3] to-white rounded-2xl shadow-lg border border-[#E5D5C5]">
        {/* Título */}
        {title && (
          <h3 className="text-xl font-bold text-center text-[#432818] mb-2">
            {title}
          </h3>
        )}
        
        {/* Subtítulo */}
        {subtitle && (
          <p className="text-sm text-center text-[#8B7355] mb-6">
            {subtitle}
          </p>
        )}
        
        {/* Preço Original */}
        {originalPrice > 0 && originalPrice !== salePrice && (
          <div className="text-center mb-2">
            <span className="text-sm text-gray-500 line-through">
              De {currency} {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {discount > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
        )}
        
        {/* Preço Promocional */}
        <div className="text-center mb-6">
          <span className="text-sm text-[#B89B7A]">Por apenas</span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-[#B89B7A]">{currency}</span>
            <span className="text-5xl font-extrabold text-[#432818]">
              {salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-xs text-gray-500">pagamento único</span>
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={handleCtaClick}
          className="w-full py-4 text-lg font-semibold bg-[#B89B7A] hover:bg-[#A68B6A] text-white rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isEditable}
        >
          {ctaText}
        </Button>
        
        {/* Garantia */}
        <p className="text-xs text-center text-gray-500 mt-4">
          🔒 Pagamento 100% seguro • Garantia de 7 dias
        </p>
      </div>
    </SelectableBlock>
  );
}

PricingBlock.displayName = 'PricingBlock';
