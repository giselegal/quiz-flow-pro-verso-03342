import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import type { BlockComponentProps } from '../../../types/blocks';

interface QuizIntroHeaderBlockProps extends BlockComponentProps {
  disabled?: boolean;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: string | number,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuizIntroHeaderBlock: React.FC<QuizIntroHeaderBlockProps> = ({
  block,
  onClick,
  onPropertyChange: _onPropertyChange,
  disabled: _disabled = false,
  className,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  // Debug das propriedades recebidas
  console.log('🔍 [QuizIntroHeaderBlock] Propriedades recebidas:', block.properties);
  console.log('🔍 [QuizIntroHeaderBlock] Block ID:', block.id);

  // ✅ USAR useEffect para detectar mudanças nas propriedades
  React.useEffect(() => {
    console.log('🔄 [QuizIntroHeaderBlock] Propriedades atualizadas:', {
      blockId: block.id,
      logoUrl: block.properties.logoUrl,
      logoWidth: block.properties.logoWidth,
      logoHeight: block.properties.logoHeight,
      progressValue: block.properties.progressValue,
      showProgress: block.properties.showProgress,
      showBackButton: block.properties.showBackButton
    });
  }, [block.properties, block.id]);

  const {
    logoUrl = 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
    logoAlt = 'Logo',
    progressValue = 0,
    progressMax = 100,
    showBackButton = true,
    showProgress = true,
    logoWidth = 96,
    logoHeight = 96,
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = (block?.properties as any) || {};

  return (
    <div
      className={cn(
        'relative w-full p-4 rounded-lg', // 🎯 Sem bordas próprias - seleção via Container 1 apenas
        'cursor-pointer hover:bg-gray-50 transition-colors', // 🎯 Hover sutil sem borda
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      {/* Header Content - Visual Only */}
      <div className="relative w-full min-h-[120px] flex items-center justify-center">
        {/* Back Button - Absolute positioned to not affect centering */}
        {showBackButton && (
          <button style={{ backgroundColor: '#E5DDD5' }}>
            <ArrowLeft style={{ color: '#6B4F43' }} />
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
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <div
              className="bg-gradient-to-r from-[#B89B7A] to-[#8a7766] h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressValue, progressMax)}%` }}
            />
          </div>

          {/* Progress Text - Oculto conforme solicitado */}
          {/* 
          <div className="text-center mt-2">
            <span style={{ color: '#6B4F43' }}>
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
