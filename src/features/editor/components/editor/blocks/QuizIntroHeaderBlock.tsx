import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import type { BlockComponentProps } from '../../../types/blocks';

import { HeaderProperties } from '@/config/headerPropertiesMapping';

interface QuizIntroHeaderBlockProps extends BlockComponentProps {
  disabled?: boolean;
  properties?: HeaderProperties;
}

// Removida função getMarginClass - usando CSS inline para margens

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
      showBackButton: block.properties.showBackButton,
    });
  }, [block.properties, block.id]);

  const {
    logoUrl,
    logoAlt,
    logoWidth,
    logoHeight,
    showProgress,
    progressValue,
    progressMax,
    showBackButton,
    backgroundColor,
    isSticky,
    marginTop,
    marginBottom,
  } = (block?.properties as HeaderProperties) || {};

  return (
    <div
      className={cn(
        'relative w-full p-4',
        isSticky ? 'sticky top-0 z-50' : '',
        'cursor-pointer hover:bg-gray-50/50 transition-colors',
        className
      )}
      style={{
        backgroundColor: backgroundColor || '#ffffff',
        marginTop: marginTop || 0,
        marginBottom: marginBottom || 0,
      }}
      onClick={onClick}
    >
      {/* Header Content */}
      <div className="relative w-full min-h-[120px] flex items-center justify-center">
        {showBackButton && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100/50 transition-colors"
            style={{ backgroundColor: backgroundColor ? `${backgroundColor}dd` : '#E5DDD5' }}
          >
            <ArrowLeft className="w-6 h-6" style={{ color: '#6B4F43' }} />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center">
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
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mt-4">
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: backgroundColor ? `${backgroundColor}dd` : '#E5DDD5' }}
          >
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progressValue || 0, progressMax || 100)}%`,
                backgroundColor: '#B89B7A',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizIntroHeaderBlock;
