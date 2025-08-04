import React from 'react';
import { cn } from '@/lib/utils';
import { Crown, Star, Quote, Award } from 'lucide-react';
import type { BlockData } from '@/types/blocks';

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
  const mentorImage = properties.mentorImage || 'https://placehold.co/200x200/cccccc/333333?text=Mentora';
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

  return (
    <div
      className={cn(
        'w-full p-4 md:p-6 transition-all duration-200',
        'bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg',
        isSelected && 'ring-2 ring-purple-400 bg-purple-50',
        !disabled && 'cursor-pointer hover:bg-purple-50/80',
        className,
      )}
      onClick={onClick}
    >
      {/* Header com Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
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
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{mentorName}</h3>

          <p className="text-purple-600 font-semibold text-sm md:text-base mb-4">{mentorTitle}</p>

          {/* Bio */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 mb-6">
            <Quote className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{mentorBio}</p>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            {achievements.map((achievement: string, index: number) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
                <span className="text-gray-700 font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credenciais */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-purple-100">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          Certificações & Credenciais
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {credentials.map((credential: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs md:text-sm">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
              <span className="text-gray-600">{credential}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorSectionInlineBlock;
