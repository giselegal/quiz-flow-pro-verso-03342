import { cn } from '@/lib/utils';
import { Clock, CreditCard, Lock, Shield } from 'lucide-react';

interface SecurePurchaseBlockProps {
  title?: string;
  showFeatures?: boolean;
  className?: string;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
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

const SecurePurchaseBlock: React.FC<SecurePurchaseBlockProps & { block?: any }> = ({
  title: _title = 'Compra 100% Segura e Protegida',
  showFeatures: _showFeatures = true,
  className,
  block,
}) => {
  const properties = (block?.properties as any) || {};
  const title = properties.title ?? _title;
  const showFeatures = properties.showFeatures ?? _showFeatures;
  const marginTop = properties.marginTop ?? 0;
  const marginBottom = properties.marginBottom ?? 0;
  const marginLeft = properties.marginLeft ?? 0;
  const marginRight = properties.marginRight ?? 0;
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
    <div
      className={cn(
        'py-4 sm:py-6 px-4',
        className,
        // Margens universais com controles deslizantes
        getMarginClass((marginTop as number | string) ?? 0, 'top'),
        getMarginClass((marginBottom as number | string) ?? 0, 'bottom'),
        getMarginClass((marginLeft as number | string) ?? 0, 'left'),
        getMarginClass((marginRight as number | string) ?? 0, 'right')
      )}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-[#f9f4ef] to-[#fff7f3] p-4 sm:p-5 md:p-6 rounded-lg border border-[#B89B7A]/20 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-[#aa6b5d] mb-3 sm:mb-4 px-2">
            {title}
          </h3>

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
            Seus dados estão protegidos por criptografia de nível bancário. Processamento via
            Hotmart, plataforma líder em produtos digitais no Brasil.
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
