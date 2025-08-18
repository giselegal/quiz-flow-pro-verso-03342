// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

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

const ConfettiBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const { duration = 3000, particleCount = 100 } = block?.properties || {};

  const confettiRef = useRef<HTMLDivElement>(null);

  // Este é um placeholder. Para um confetti real, você precisaria de uma lib como `canvas-confetti`
  useEffect(() => {
    if (confettiRef.current && !isSelected) {
      // Exemplo com `canvas-confetti` (se instalado)
      // confetti({
      //   particleCount: particleCount || 100,
      //   spread: 70,
      //   origin: { y: 0.6 },
      //   duration: duration || 3000,
      // });
    }
  }, [duration, particleCount, isSelected]);

  return (
    <div
      ref={confettiRef}
      className={`
        py-12 text-center bg-brand/10 rounded-lg border border-brand/30 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-brand/40 bg-brand/10' : 'hover:shadow-sm hover:bg-brand/20'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <Sparkles className="w-16 h-16 mx-auto text-brand mb-4 animate-pulse" />
      <p className="text-lg text-brand-dark font-semibold">🎉 Efeito de Confete! 🎉</p>
      <p className="text-sm text-stone-600 mt-2">(Visível na página publicada ou ao simular)</p>
      <div className="text-xs text-stone-500 mt-2">
        Partículas: {particleCount} | Duração: {duration / 1000}s
      </div>
    </div>
  );
};

export default ConfettiBlock;
