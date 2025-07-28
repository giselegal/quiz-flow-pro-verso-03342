
import React from 'react';
import { StyleResult } from '@/types/quiz';
import { ALL_STYLES } from '@/data/styleData';

interface QuizResultProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  userName?: string;
}

const QuizResult: React.FC<QuizResultProps> = ({ 
  primaryStyle, 
  secondaryStyles, 
  userName 
}) => {
  const primaryStyleData = ALL_STYLES[primaryStyle];
  
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair text-[#432818] mb-4">
            {userName ? `${userName}, s` : 'S'}eu Resultado
          </h1>
          
          <div className="mb-6">
            <h2 className="text-xl text-[#8F7A6A] mb-2">
              Seu estilo predominante é:
            </h2>
            <div className="bg-[#B89B7A]/10 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-[#B89B7A] mb-2">
                {primaryStyleData.name}
              </h3>
              <p className="text-[#432818]">
                {primaryStyleData.description}
              </p>
            </div>
          </div>
          
          {secondaryStyles.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-[#432818] mb-4">
                Seus estilos complementares:
              </h3>
              <div className="space-y-3">
                {secondaryStyles.map((style, index) => {
                  const styleData = ALL_STYLES[style];
                  return (
                    <div key={index} className="bg-[#f8f6f3] p-3 rounded-lg">
                      <h4 className="font-medium text-[#432818]">
                        {styleData.name}
                      </h4>
                      <p className="text-sm text-[#8F7A6A]">
                        {styleData.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
