import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';

/**
 * OfferProblemSectionInlineBlock - Seção de problemas da página de oferta
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const OfferProblemSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('OfferProblemSectionInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = 'Você se identifica com isso?',
    problems = [
      '**Guarda-roupa cheio** mas nunca tem o que vestir?',
      '**Compra peças** que nunca combinam com nada?',
      '**Sente que "nada fica bom"** em você?',
    ],
    highlightText = 'Isso acontece porque você ainda não descobriu seu **estilo predominante**.',
    imageUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp',
    imageAlt = 'Frustração com guarda-roupa',
    imageWidth = 500,
    imageHeight = 350,
    layout = 'side-by-side',

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
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5DDD5]/30">
          <div
            className={cn(
              layout === 'side-by-side' ? 'grid md:grid-cols-2 gap-8 items-center' : 'text-center'
            )}
          >
            <div>
              {/* Título */}
              <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-6 font-playfair">
                {title}
              </h2>

              {/* Lista de problemas */}
              <div className="space-y-4 text-lg text-[#6B4F43] mb-6">
                {problems.map((problem: string, index: number) => (
                  <p key={index}>
                    {problem
                      .split('**')
                      .map((part: string, partIndex: number) =>
                        partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
                      )}
                  </p>
                ))}
              </div>

              {/* Texto de destaque */}
              {highlightText && (
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <p className="text-[#432818] font-semibold">
                    {highlightText
                      .split('**')
                      .map((part: string, index: number) =>
                        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                      )}
                  </p>
                </div>
              )}
            </div>

            {/* Imagem */}
            {imageUrl && layout === 'side-by-side' && (
              <div>
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  width={imageWidth}
                  height={imageHeight}
                  className="w-full h-auto rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Imagem centralizada para layout não side-by-side */}
          {imageUrl && layout !== 'side-by-side' && (
            <div className="mt-8 max-w-md mx-auto">
              <img
                src={imageUrl}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="w-full h-auto rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OfferProblemSectionInlineBlock;
