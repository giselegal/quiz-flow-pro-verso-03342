// @ts-nocheck
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';
import { Award, Crown, Quote, Star } from 'lucide-react';

interface MentorSectionInlineBlockProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente inline para seção da mentora da etapa 20
 * 100% responsivo, mobile-first com máximo 2 colunas
 */

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

const MentorSectionInlineBlock: React.FC<MentorSectionInlineBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  const properties = block.properties || {};
  const mentorName = properties.mentorName || 'Juliana Estilo';
  const mentorTitle = properties.mentorTitle || 'Consultora de Imagem e Estilo';
  const mentorImage =
    properties.mentorImage || 'https://placehold.co/200x200/cccccc/333333?text=Mentora';
  const mentorBio =
    properties.mentorBio ||
    'Com mais de 10 anos de experiência, já transformei a vida de mais de 5.000 mulheres através da consultoria de imagem personalizada.';
  const achievements = properties.achievements || [
    '+ 5.000 clientes transformadas',
    '+ 10 anos de experiência',
    'Certificada internacionalmente',
    'Featured na Vogue e Marie Claire',
  ];
  const credentials = properties.credentials || [
    'Certificação Internacional em Personal Styling',
    'Pós-graduação em Consultoria de Imagem',
    'Mentora de outros consultores',
  ];

  const handleEdit = (field: string, value: any) => {
    if (onPropertyChange && !disabled) {
      onPropertyChange(field, value);
    }
  };

  // Margens editáveis (padrões 0)
  const marginTop = properties.marginTop ?? 0;
  const marginBottom = properties.marginBottom ?? 0;
  const marginLeft = properties.marginLeft ?? 0;
  const marginRight = properties.marginRight ?? 0;

  return (
    <div
      className={cn(
        'w-full p-4 md:p-6 transition-all duration-200',
        'bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg',
        isSelected && 'ring-2 ring-purple-400 bg-[#B89B7A]/10',
        !disabled && 'cursor-pointer hover:bg-[#B89B7A]/10/80',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      {/* Header com Badge */}
      <div className="text-center mb-6">
        <div style={{ backgroundColor: '#B89B7A' }}>
          <Crown className="w-4 h-4" />
          Sua Mentora Especialista
        </div>
      </div>

      {/* Layout Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Coluna da Imagem */}
        <div className="order-2 lg:order-1 flex justify-center">
          <div className="relative group">
            <img
              src={mentorImage}
              alt={mentorName}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow-xl"
            />
            {/* Badge de Certificação */}
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Coluna do Conteúdo */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          {/* Nome e Título */}
          <h3 style={{ color: '#432818' }}>{mentorName}</h3>

          <p className="text-[#B89B7A] font-semibold text-sm md:text-base mb-4">{mentorTitle}</p>

          {/* Bio */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 mb-6">
            <Quote className="w-5 h-5 text-purple-400 mb-2" />
            <p style={{ color: '#6B4F43' }}>{mentorBio}</p>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            {achievements.map((achievement: string, index: number) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                <span style={{ color: '#6B4F43' }}>{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credenciais */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-purple-100">
        <h4 style={{ color: '#432818' }}>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          Certificações & Credenciais
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {credentials.map((credential: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs md:text-sm">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
              <span style={{ color: '#6B4F43' }}>{credential}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorSectionInlineBlock;
