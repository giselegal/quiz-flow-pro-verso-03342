// @ts-nocheck
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface ValueStackBlockProps {
  title?: string;
  showPricing?: boolean;
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

const ValueStackBlock: React.FC<ValueStackBlockProps> = ({
  title = 'O Que Você Recebe Hoje',
  showPricing = true,
  className,
}) => {
  // Dados reais da ancoragem de valor da ResultPage
  const valueItems = [
    {
      title: 'Guia de Estilo e Imagem Completo',
      description: 'Material exclusivo com seu perfil personalizado',
      value: 'R$ 197,00',
    },
    {
      title: 'Análise Detalhada do Seu Estilo',
      description: 'Relatório completo com suas características únicas',
      value: 'R$ 97,00',
    },
    {
      title: 'Bônus: Peças-chave do Guarda-roupa',
      description: 'Lista das peças essenciais para seu estilo',
      value: 'R$ 79,00',
    },
    {
      title: 'Bônus: Visagismo Facial',
      description: 'Guia de maquiagem ideal para seu rosto',
      value: 'R$ 29,00',
    },
  ];

  const totalValue = valueItems.reduce((sum, item) => {
    const value = parseInt(item.value.replace(/[^\d]/g, ''));
    return sum + value;
  }, 0);

  return (
    <div
      className={cn(
        'py-4 sm:py-6 md:py-8 px-4',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#aa6b5d] text-center mb-6 sm:mb-8 px-2">
          {title}
        </h2>

        <div className="bg-white rounded-xl shadow-lg border border-[#B89B7A]/20 overflow-hidden">
          <div className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white p-4 sm:p-5 md:p-6 text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Pacote Completo de Transformação
            </h3>
            <p className="opacity-90 text-sm sm:text-base">
              Tudo que você precisa para descobrir e aplicar seu estilo único
            </p>
          </div>

          <div className="p-4 sm:p-5 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              {valueItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 bg-[#f9f4ef] rounded-lg border border-[#B89B7A]/10 gap-3 sm:gap-4"
                >
                  <div className="flex items-start gap-2 sm:gap-3 flex-1">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[#432818] mb-1 text-sm sm:text-base leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#8F7A6A] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {showPricing && (
                    <div className="text-left sm:text-right sm:ml-4 flex-shrink-0">
                      <span className="text-[#aa6b5d] font-bold text-sm sm:text-base">
                        {item.value}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showPricing && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#B89B7A]/20">
                <div className="text-center">
                  <div className="mb-3 sm:mb-4">
                    <span className="text-sm sm:text-lg text-[#8F7A6A]">
                      Valor total se comprado separadamente:
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-gray-400 line-through">
                      R$ {totalValue.toLocaleString('pt-BR')},00
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white p-4 sm:p-5 md:p-6 rounded-lg">
                    <div className="text-xs sm:text-sm opacity-90 mb-2">Seu investimento hoje:</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">R$ 97,00</div>
                    <div className="text-xs sm:text-sm opacity-90 leading-relaxed">
                      Economize R$ {(totalValue - 97).toLocaleString('pt-BR')}
                      ,00 (mais de 75% de desconto)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueStackBlock;
