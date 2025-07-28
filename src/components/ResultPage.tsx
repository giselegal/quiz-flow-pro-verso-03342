
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { styleResults } from '@/data/styleData';

interface ResultPageProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  onReset: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  primaryStyle,
  secondaryStyles,
  onReset
}) => {
  const primaryStyleData = styleResults[primaryStyle];

  return (
    <div className="min-h-screen bg-[#faf8f5] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair text-[#432818] mb-4">
            Seu Estilo: {primaryStyleData?.name || primaryStyle}
          </h1>
          <p className="text-[#8F7A6A] text-lg">
            Descobrimos seu estilo único baseado em suas respostas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-playfair text-[#432818] mb-4">
            Estilo Primário
          </h2>
          <div className="mb-6">
            <h3 className="text-xl text-[#B89B7A] font-semibold">
              {primaryStyleData?.name || primaryStyle}
            </h3>
            <p className="text-[#432818] mt-2">
              {primaryStyleData?.description || 'Descrição não disponível'}
            </p>
          </div>
        </div>

        {secondaryStyles.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-playfair text-[#432818] mb-4">
              Estilos Secundários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryStyles.map((style, index) => {
                const styleData = styleResults[style];
                return (
                  <div key={index} className="p-4 bg-[#faf8f5] rounded-lg">
                    <h3 className="text-lg text-[#B89B7A] font-semibold">
                      {styleData?.name || style}
                    </h3>
                    <p className="text-[#432818] mt-1">
                      {styleData?.description || 'Descrição não disponível'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button onClick={onReset} variant="outline">
            Fazer Quiz Novamente
          </Button>
        </div>
      </div>
    </div>
  );
};
