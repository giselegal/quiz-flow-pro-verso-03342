import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { ChevronRight } from 'lucide-react';

/**
 * OfferFaqSectionInlineBlock - Seção de FAQ com acordeão
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const OfferFaqSectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  logBlockDebug('OfferFaqSectionInlineBlock', block);
  const properties = safeGetBlockProperties(block);

  const {
    title = 'Perguntas Frequentes',
    questions = [
      {
        question: 'Quanto tempo leva para fazer o quiz?',
        answer:
          'O quiz leva apenas alguns minutos para ser completado. São perguntas simples e objetivas sobre suas preferências e estilo de vida.',
      },
    ],
    spacing = 'large',
  } = properties;

  const [openItem, setOpenItem] = useState<number | null>(null);

  const spacingClasses = {
    small: 'py-8',
    medium: 'py-12',
    large: 'py-16',
  };

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5DDD5]/30">
          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#432818] mb-8 text-center font-playfair">
            {title}
          </h2>

          {/* FAQ Items */}
          <div className="space-y-4">
            {questions.map((item: { question: string; answer: string }, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#B89B7A]"
              >
                <button
                  onClick={e => {
                    e.stopPropagation(); // Prevent triggering parent onClick
                    toggleItem(index);
                  }}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-[#432818] text-lg">{item.question}</span>
                  <ChevronRight
                    size={24}
                    className={cn(
                      'text-[#B89B7A] transition-transform duration-300',
                      openItem === index && 'transform rotate-90'
                    )}
                  />
                </button>

                {openItem === index && (
                  <div className="px-6 py-4 text-gray-700 bg-gray-50 border-t border-gray-100 text-base">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferFaqSectionInlineBlock;
