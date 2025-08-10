import React from "react";
import { useContainerProperties } from "../../hooks/useContainerProperties";
import { useDebounce } from "../../hooks/useDebounce";
import { useIsMobile } from "../../hooks/use-mobile";
import { StyleResult } from "../../types/quiz";

interface Step20ResultProps {
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  onContinue?: () => void;
}

const Step20Result: React.FC<Step20ResultProps> = ({
  primaryStyle,
  secondaryStyles = [],
  onContinue,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair text-[#432818] mb-4">
            Seu Resultado Personalizado
          </h1>
          <p className="text-lg text-[#8F7A6A]">
            Descubra seu estilo único baseado em suas respostas
          </p>
        </div>

        {primaryStyle && (
          <div className="bg-white rounded-lg p-8 mb-6 shadow-lg">
            <h2 className="text-2xl font-playfair text-[#B89B7A] mb-4">
              Seu Estilo Principal: {primaryStyle.category}
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-[#432818]">
                {primaryStyle.percentage}%
              </div>
              <div className="text-[#8F7A6A]">de compatibilidade</div>
            </div>
          </div>
        )}

        {secondaryStyles.length > 0 && (
          <div className="bg-white rounded-lg p-8 mb-6 shadow-lg">
            <h3 className="text-xl font-playfair text-[#B89B7A] mb-4">
              Estilos Secundários
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryStyles.slice(0, 4).map((style, index) => (
                <div
                  key={index}
                  className="border border-[#B89B7A]/20 rounded-lg p-4"
                >
                  <div className="font-medium text-[#432818]">
                    {style.category}
                  </div>
                  <div className="text-sm text-[#8F7A6A]">
                    {style.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {onContinue && (
          <div className="text-center">
            <button
              onClick={onContinue}
              className="bg-[#B89B7A] hover:bg-[#8F7A6A] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step20Result;
