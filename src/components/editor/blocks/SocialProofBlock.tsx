// @ts-nocheck
import { cn } from '@/lib/utils';
import { Star, Quote } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';

interface SocialProofBlockProps extends BlockComponentProps {
  disabled?: boolean;
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

const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  // Debug das propriedades recebidas
  console.log('🔍 [SocialProofBlock] Propriedades recebidas:', block.properties);

  const { title = 'Depoimentos Reais de Quem Transformou o Guarda-Roupa', showTitle = true } =
    block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };
  // Dados reais dos depoimentos do funil
  const testimonials = [
    {
      name: 'Ana Paula, 34 anos',
      text: 'Nunca imaginei que descobrir meu estilo seria tão transformador. Agora me visto com confiança e recebo elogios todos os dias!',
      style: 'Elegante',
      image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/depoimento1.webp',
    },
    {
      name: 'Carla Santos, 28 anos',
      text: 'O guia me ensinou a montar looks incríveis com peças que já tinha no armário. Economizei muito e ainda melhoro minha imagem!',
      style: 'Contemporâneo',
      image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/depoimento2.webp',
    },
    {
      name: 'Fernanda Lima, 42 anos',
      text: 'Finalmente entendi qual estilo combina comigo. Minha autoestima subiu muito e me sinto mais eu mesma a cada dia.',
      style: 'Natural',
      image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921750/depoimento3.webp',
    },
  ];
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const renderTestimonial = (testimonial: any, index: number) => (
    <div
      key={index}
      className="bg-gradient-to-br from-[#fff7f3] to-[#f9f4ef] p-6 rounded-xl border border-[#B89B7A]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <Quote className="w-6 h-6 text-[#B89B7A] mr-2" />
          <div className="flex">{renderStars()}</div>
        </div>

        <p className="text-[#432818] mb-4 flex-grow italic leading-relaxed">"{testimonial.text}"</p>

        <div className="flex items-center justify-between pt-4 border-t border-[#B89B7A]/10">
          <div>
            <p className="font-semibold text-[#aa6b5d]">{testimonial.name}</p>
            <p className="text-sm text-[#B89B7A] font-medium">Estilo: {testimonial.style}</p>
          </div>
          <div className="w-12 h-12 bg-[#B89B7A]/10 rounded-full flex items-center justify-center">
            <span className="text-[#B89B7A] font-bold text-lg">{testimonial.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        'relative w-full p-4 rounded-lg border-2 border-dashed',
        isSelected ? 'border-[#B89B7A] bg-[#B89B7A]/10' : 'border-gray-300 bg-white',
        'cursor-pointer hover:border-gray-400 transition-colors',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      <div className={cn('py-12 bg-gradient-to-br from-[#faf8f5] to-[#f9f4ef]')}>
        <div className="max-w-7xl mx-auto px-6">
          {showTitle && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#aa6b5d] mb-4">{title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto rounded-full"></div>
              <p className="text-[#432818] mt-4 max-w-2xl mx-auto">
                Veja como outras mulheres transformaram seu estilo e autoestima
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-8 justify-center">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-1 min-w-[300px] max-w-lg">
                {renderTestimonial(testimonial, index)}
              </div>
            ))}
          </div>

          {/* Elemento de confiança adicional */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-md border border-[#B89B7A]/20">
              <div className="flex mr-3">{renderStars()}</div>
              <span className="text-[#432818] font-medium">
                Mais de 2.500 mulheres já transformaram seu estilo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofBlock;
