import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, CheckCircle } from 'lucide-react';

interface GuaranteeBlockProps {
  title?: string;
  guaranteePeriod?: string;
  showIcon?: boolean;
  className?: string;
}

const GuaranteeBlock: React.FC<GuaranteeBlockProps> = ({
  title = 'Garantia Incondicional',
  guaranteePeriod = '7 dias',
  showIcon = true,
  className
}) => {
  return (
    <div className={cn("py-4 sm:py-6 md:py-8", className)}>
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
            Experimente o conteúdo por <strong>{guaranteePeriod}</strong>. Se não ficar completamente satisfeita, 
            devolvemos 100% do seu investimento, sem perguntas.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">Reembolso integral garantido</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">Sem burocracia ou questionamentos</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">Processamento em até 5 dias úteis</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#432818]">Suporte dedicado disponível</span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 bg-white rounded-lg border border-[#B89B7A]/10">
            <p className="text-xs sm:text-sm text-[#8F7A6A] italic leading-relaxed">
              "Nosso compromisso é com sua satisfação e transformação. Se o conteúdo não atender suas expectativas, faremos a devolução integral." - Equipe Gisele Galvão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaranteeBlock;