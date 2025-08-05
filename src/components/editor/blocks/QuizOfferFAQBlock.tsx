import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import type { BlockComponentProps } from '@/types/blocks';

const QuizOfferFAQBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Perguntas Frequentes',
    textColor = '#432818',
    backgroundColor = '#ffffff',
    faqItems = [
      {
        question: 'Como funciona o quiz?',
        answer:
          'O quiz é baseado em metodologia científica de análise de estilo. Você responde perguntas sobre suas preferências e recebe um resultado personalizado.',
      },
      {
        question: 'O que está incluso no guia?',
        answer:
          'Você recebe um guia completo com seu estilo predominante, dicas de combinações, paleta de cores ideal e muito mais.',
      },
      {
        question: 'Posso usar em qualquer idade?',
        answer: 'Sim! Nosso método funciona para mulheres de todas as idades e estilos de vida.',
      },
    ],
  } = block?.properties || {};

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        w-full py-16 px-4 transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: textColor }}>
            {title}
          </h3>

          <div className="space-y-6">
            {faqItems.map((item: any, index: number) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-3" style={{ color: textColor }}>
                    {item.question}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizOfferFAQBlock;
