import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';

/**
 * OfferGuaranteeSectionInlineBlock - Seção de garantia
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const OfferGuaranteeSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('OfferGuaranteeSectionInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = '7 Dias de Garantia',
    description = 'Se não ficar satisfeita, devolvemos **100% do seu dinheiro**. Sem perguntas.',
    imageUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744916216/C%C3%B3pia_de_01._P%C3%A1gina_-_Produto_de_Entrada_2_hamaox.webp',
    imageAlt = 'Garantia 7 dias',
    imageWidth = 200,
    imageHeight = 200,
    spacing = 'large',
  } = properties;

  const spacingClasses = {
    small: 'py-8',
    medium: 'py-12',
    large: 'py-16',
  };

  return (
    <section
      className={cn(
        'w-full bg-[#FFFBF7]',
        spacingClasses[spacing as keyof typeof spacingClasses] || spacingClasses.large,
        isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5DDD5]/30 text-center">
          {/* Imagem */}
          {imageUrl && (
            <div className="mb-6">
              <img
                src={imageUrl}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="mx-auto"
                loading="lazy"
              />
            </div>
          )}

          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4 font-playfair">
            {title}
          </h2>

          {/* Descrição */}
          <p className="text-lg text-[#6B4F43] max-w-2xl mx-auto">
            {description
              .split('**')
              .map((part: string, index: number) =>
                index % 2 === 1 ? <strong key={index}>{part}</strong> : part
              )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OfferGuaranteeSectionInlineBlock;
