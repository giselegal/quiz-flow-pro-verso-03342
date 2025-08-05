import React from 'react';
import { cn } from '../../../lib/utils';
import { ArrowLeft } from 'lucide-react';
import { InlineEditText } from './InlineEditText';
import type { BlockComponentProps } from '../../../types/blocks';

interface QuizIntroHeaderBlockProps extends BlockComponentProps {
  disabled?: boolean;
}

const QuizIntroHeaderBlock: React.FC<QuizIntroHeaderBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  // Debug das propriedades recebidas
  console.log('🔍 [QuizIntroHeaderBlock] Propriedades recebidas:', block.properties);

  const {
    logoUrl = 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
    logoAlt = 'Logo',
    progressValue = 0,
    progressMax = 100,
    showBackButton = true,
    showProgress = true,
    logoWidth = 96,
    logoHeight = 96,
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full p-4 rounded-lg border-2 border-dashed',
        isSelected ? 'border-[#B89B7A] bg-[#B89B7A]/10' : 'border-gray-300 bg-white',
        'cursor-pointer hover:border-gray-400 transition-colors',
        className,
      )}
      onClick={onClick}
    >
      {/* Header Content - Visual Only */}
      <div className="relative w-full min-h-[120px] flex items-center justify-center">
        {/* Back Button - Absolute positioned to not affect centering */}
        {showBackButton && (
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Logo - Perfectly Centered - Ignoring back button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logoUrl}
            alt={logoAlt}
            style={{
              width: `${logoWidth}px`,
              height: `${logoHeight}px`,
            }}
            className="object-contain"
            onError={e => {
              e.currentTarget.src = 'https://via.placeholder.com/96x96?text=Logo';
            }}
          />
          {/* Edição inline removida - apenas no painel de propriedades */}
        </div>
      </div>

      {/* Progress Bar - Só mostra se showProgress for true */}
      {showProgress && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#B89B7A] to-[#8a7766] h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressValue, progressMax)}%` }}
            />
          </div>

          {/* Progress Text - Oculto conforme solicitado */}
          {/* 
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              {Math.round(progressValue)}% completo
            </span>
          </div>
          */}
        </>
      )}
    </div>
  );
};

export default QuizIntroHeaderBlock;
