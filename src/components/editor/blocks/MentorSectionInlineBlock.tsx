import { cn } from '@/lib/utils';
import { getMarginClass } from '@/utils/margins';
import type { BlockData } from '@/types/blocks';
import { Award, Crown, Quote, Star } from 'lucide-react';

interface MentorSectionInlineBlockProps {
  block: BlockData;
  isSelected?: boolean;
  isPreviewing?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente inline para seção da mentora da etapa 20
 * 100% responsivo, mobile-first com máximo 2 colunas
 */

// Margens agora centralizadas em utils/margins

const MentorSectionInlineBlock: React.FC<MentorSectionInlineBlockProps> = ({
  block,
  isSelected = false,
  isPreviewing = false,
  onClick,
  onPropertyChange: _onPropertyChange,
  disabled = false,
  className,
}) => {
  const properties = block.properties || {};
  const mentorName = properties.mentorName || 'Gisele Galvão';
  const mentorTitle = properties.mentorTitle || 'Consultora de Imagem e Estilo, Personal Branding';
  const mentorImage =
    properties.mentorImage || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp';
  const mentorBio =
    properties.mentorBio ||
    'Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico e transformarem sua relação com a imagem pessoal. Especialista em coloração pessoal com certificação internacional.';
  const achievements = properties.achievements || [
    'Consultora de Imagem e Estilo certificada',
    'Especialista em Personal Branding',
    'Certificação Internacional em Coloração Pessoal',
    'Advogada de formação',
  ];
  const credentials = properties.credentials || [
    'Certificação Internacional em Coloração Pessoal',
    'Especialista em Personal Branding',
    'Estrategista de Marca Pessoal',
    'Formação em Direito',
  ];

  // Edição inline está desativada por padrão neste bloco

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
        !disabled && !isPreviewing && 'cursor-pointer hover:bg-[#B89B7A]/80',
        isPreviewing && 'cursor-default',
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
