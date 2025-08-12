// @ts-nocheck
import type { BlockComponentProps } from '../../../types/blocks';
import { cn } from '@/lib/utils';
import { Shield, CheckCircle } from 'lucide-react';

interface GuaranteeBlockProps {
  title?: string;
  guaranteePeriod?: string;
  showIcon?: boolean;
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

const GuaranteeBlock: React.FC<GuaranteeBlockProps> = ({
  title = 'Garantia Incondicional',
  guaranteePeriod = '7 dias',
  showIcon = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'py-4 sm:py-6 md:py-8',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#fff7f3] to-[#f9f4ef] p-4 sm:p-6 md:p-8 rounded-xl border border-[#B89B7A]/20 shadow-lg text-center">
          {showIcon && (
            <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
            </div>
          )}

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#aa6b5d] mb-3 sm:mb-4">
            {title}
          </h3>

          <p className="text-sm sm:text-base text-[#432818] leading-relaxed mb-4 sm:mb-5 md:mb-6">
            Experimente o conteúdo por <strong>{guaranteePeriod}</strong>. Se não ficar
            completamente satisfeita, devolvemos 100% do seu investimento, sem perguntas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">
                Reembolso integral garantido
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">
                Sem burocracia ou questionamentos
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">
                Processamento em até 5 dias úteis
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">Suporte dedicado disponível</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 bg-white rounded-lg border border-[#B89B7A]/10">
            <p className="text-xs sm:text-sm text-[#8F7A6A] italic leading-relaxed">
              "Nosso compromisso é com sua satisfação e transformação. Se o conteúdo não atender
              suas expectativas, faremos a devolução integral." - Equipe Gisele Galvão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaranteeBlock;
