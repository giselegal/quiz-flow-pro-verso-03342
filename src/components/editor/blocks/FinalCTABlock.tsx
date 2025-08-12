// @ts-nocheck
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';

interface FinalCTABlockProps {
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

const FinalCTABlock: React.FC<FinalCTABlockProps> = ({
  mainText = 'Descubra Como Aplicar Seu Estilo na Prática',
  buttonText = 'Quero meu Guia de Estilo Agora',
  showGuarantee = true,
  showSecurityBadge = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCTAClick = () => {
    trackButtonClick('final_cta_button', 'CTA Final - Página de Resultado', 'result_page');
    window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  };

  return (
    <div
      className={cn(
        'py-12 bg-gradient-to-br from-[#fff7f3] to-[#f9f4ef]',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Urgency Badge */}
        <div className="inline-flex items-center gap-2 bg-[#aa6b5d] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Clock className="w-4 h-4" />
          Oferta por tempo limitado
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#B89B7A]/20 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#aa6b5d] mb-6 leading-tight">
            {mainText}
          </h2>

          <p className="text-lg text-[#432818] mb-8 max-w-2xl mx-auto leading-relaxed">
            Agora que você descobriu seu estilo predominante, é hora de colocar esse conhecimento em
            prática. Receba um guia personalizado com tudo que precisa para transformar sua imagem.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleCTAClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              'inline-flex items-center gap-3 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl',
              'border-2 border-transparent hover:border-white',
              isHovered && 'animate-pulse'
            )}
          >
            {buttonText}
            <ArrowRight
              className={cn(
                'w-5 h-5 transition-transform duration-300',
                isHovered && 'translate-x-1'
              )}
            />
          </button>

          {/* Guarantee Section */}
          {showGuarantee && (
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-[#8F7A6A]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#B89B7A]" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-[#B89B7A]/30"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#B89B7A]" />
                <span>Acesso imediato</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-[#B89B7A]/30"></div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#B89B7A]" />
                <span>100% seguro</span>
              </div>
            </div>
          )}

          {/* Security Badge */}
          {showSecurityBadge && (
            <div className="mt-6 pt-6 border-t border-[#B89B7A]/20">
              <div className="flex items-center justify-center gap-4 text-xs text-[#8F7A6A]">
                <img
                  src="https://static.hotmart.com/img/hotmart-logo.png"
                  alt="Hotmart"
                  className="h-4 opacity-70"
                />
                <span>•</span>
                <span>Ambiente seguro</span>
                <span>•</span>
                <span>Certificado SSL</span>
                <span>•</span>
                <span>Dados protegidos</span>
              </div>
            </div>
          )}
        </div>

        {/* Final Message */}
        <p className="mt-6 text-sm text-[#8F7A6A] italic">
          Milhares de mulheres já transformaram sua autoestima descobrindo seu estilo autêntico.
          Seja a próxima!
        </p>
      </div>
    </div>
  );
};

export default FinalCTABlock;
