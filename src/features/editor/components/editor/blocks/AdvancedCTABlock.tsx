// @ts-nocheck
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Shield, ShoppingCart, Lock, ArrowDown } from 'lucide-react';

interface AdvancedCTABlockProps {
  mainText?: string;
  buttonText?: string;
  showGuarantee?: boolean;
  showSecurityBadge?: boolean;
  className?: string;
}

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

const AdvancedCTABlock: React.FC<AdvancedCTABlockProps> = ({
  mainText = 'Descubra Como Aplicar Seu Estilo na Prática',
  buttonText = 'Quero meu Guia de Estilo Agora',
  showGuarantee = true,
  showSecurityBadge = true,
  className,
}) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleCTAClick = () => {
    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  };

  return (
    <div
      className={cn(
        'text-center my-10',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="bg-[#f9f4ef] p-6 rounded-lg border border-[#B89B7A]/10 mb-6">
        <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">{mainText}</h3>
        <div className="flex justify-center">
          <ArrowDown className="w-8 h-8 text-[#B89B7A] animate-bounce" />
        </div>
      </div>

      <button
        onClick={handleCTAClick}
        className="text-white py-4 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        style={{
          background: 'linear-gradient(to right, #4CAF50, #45a049)',
          boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <ShoppingCart
            className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`}
          />
          {buttonText}
        </span>
      </button>

      {showSecurityBadge && (
        <div className="mt-2 inline-block bg-[#aa6b5d]/10 px-3 py-1 rounded-full">
          <p className="text-sm text-[#aa6b5d] font-medium flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Oferta exclusiva nesta página</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedCTABlock;
