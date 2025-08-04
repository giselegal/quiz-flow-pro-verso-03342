import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Lock, CreditCard, Clock } from 'lucide-react';

interface SecurePurchaseBlockProps {
  title?: string;
  showFeatures?: boolean;
  className?: string;
}

const SecurePurchaseBlock: React.FC<SecurePurchaseBlockProps> = ({
  title = 'Compra 100% Segura e Protegida',
  showFeatures = true,
  className,
}) => {
  const securityFeatures = [
    {
      icon: <Shield className="w-3 h-3 sm:w-4 sm:h-4" />,
      text: 'SSL 256-bits',
    },
    {
      icon: <Lock className="w-3 h-3 sm:w-4 sm:h-4" />,
      text: 'Dados protegidos',
    },
    {
      icon: <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />,
      text: 'Pagamento seguro',
    },
    {
      icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
      text: 'Acesso imediato',
    },
  ];

  return (
    <div className={cn('py-4 sm:py-6 px-4', className)}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-[#f9f4ef] to-[#fff7f3] p-4 sm:p-5 md:p-6 rounded-lg border border-[#B89B7A]/20 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-[#aa6b5d] mb-3 sm:mb-4 px-2">{title}</h3>

          {showFeatures && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-[#B89B7A] shadow-sm">
                    {feature.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-[#432818] font-medium leading-tight text-center">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs sm:text-sm text-[#8F7A6A] mb-3 sm:mb-4 leading-relaxed px-2">
            Seus dados estão protegidos por criptografia de nível bancário. Processamento via Hotmart, plataforma líder
            em produtos digitais no Brasil.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-[#8F7A6A]">
            <img
              src="https://static.hotmart.com/img/hotmart-logo.png"
              alt="Hotmart"
              className="h-3 sm:h-4 opacity-70"
            />
            <div className="hidden sm:block">•</div>
            <span>Ambiente seguro</span>
            <div className="hidden sm:block">•</div>
            <span>Certificado SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePurchaseBlock;
