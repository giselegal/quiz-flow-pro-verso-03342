// @ts-nocheck
import { cn } from '@/lib/utils';
import { Gift } from 'lucide-react';

interface BonusBlockProps {
  title?: string;
  showImages?: boolean;
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

const BonusBlock: React.FC<BonusBlockProps & { block?: any }> = ({
  title: _title = 'Bônus Exclusivos para Você',
  showImages: _showImages = true,
  className,
  block,
}) => {
  const properties = (block?.properties as any) || {};
  const title = properties.title ?? _title;
  const showImages = properties.showImages ?? _showImages;
  const marginTop = properties.marginTop ?? 0;
  const marginBottom = properties.marginBottom ?? 0;
  const marginLeft = properties.marginLeft ?? 0;
  const marginRight = properties.marginRight ?? 0;
  // Dados reais dos bônus da ResultPage
  const bonuses = [
    {
      title: 'Peças-chave do Guarda-roupa',
      description:
        'Lista completa das peças essenciais que toda mulher deve ter no guarda-roupa, organizadas por estilo e ocasião.',
      image:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp',
      value: 'R$ 79,00',
    },
    {
      title: 'Visagismo Facial',
      description:
        'Guia completo de maquiagem e penteados ideais para o formato do seu rosto e estilo pessoal.',
      image:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
      value: 'R$ 29,00',
    },
  ];

  return (
    <div
      className={cn(
        'py-10',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-[#aa6b5d] text-center mb-2">{title}</h2>
      <p className="text-center text-[#432818] mb-6 max-w-md mx-auto">
        Além do guia principal, você receberá estas ferramentas complementares para potencializar
        sua jornada de transformação:
      </p>
      <div className="w-32 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto rounded-full mb-8"></div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-[#B89B7A]/10 transform hover:scale-[1.02]"
            >
              {showImages && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`${bonus.image}?q=auto:best&f=auto&w=300`}
                    alt={bonus.title}
                    className="w-full max-w-xs sm:max-w-sm h-auto rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={300}
                    height={420}
                  />
                </div>
              )}

              <h3 className="text-lg font-medium text-[#aa6b5d] mb-2 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-[#B89B7A]" />
                {bonus.title}
              </h3>

              <p className="text-[#432818] text-sm leading-relaxed mb-3">{bonus.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8F7A6A] bg-[#f9f4ef] px-3 py-1 rounded-full">
                  Valor: {bonus.value}
                </span>
                <span className="text-[#B89B7A] font-semibold text-sm">🎁 GRÁTIS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusBlock;
