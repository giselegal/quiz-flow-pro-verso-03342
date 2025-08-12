// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
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

const QuizOfferFinalCTABlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Não perca esta oportunidade única!',
    subtitle = 'Transforme seu estilo e sua confiança agora mesmo',
    ctaText = 'QUERO DESCOBRIR MEU ESTILO AGORA',
    ctaUrl = '#checkout',
    urgencyText = 'Oferta válida por tempo limitado',
    accentColor = '#B89B7A',
    textColor = '#432818',
    backgroundColor = undefined, // Will use accent color with opacity
  } = block?.properties || {};

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const bgColor = backgroundColor || `${accentColor}15`;

  return (
    <div
      className={`
        w-full py-16 px-4 text-center transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: textColor }}>
            {title}
          </h3>
          <p style={{ color: '#6B4F43' }}>{subtitle}</p>

          <Button
            size="lg"
            className="px-12 py-6 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-all duration-300 mb-6"
            style={{
              backgroundColor: accentColor,
              color: 'white',
              border: 'none',
            }}
            onClick={e => {
              e.stopPropagation();
              if (ctaUrl.startsWith('#')) {
                document.querySelector(ctaUrl)?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.open(ctaUrl, '_blank');
              }
            }}
          >
            <ArrowRight className="w-6 h-6 mr-2" />
            {ctaText}
          </Button>

          <div style={{ color: '#8B7355' }}>
            <Clock className="w-4 h-4" />
            {urgencyText}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizOfferFinalCTABlock;
