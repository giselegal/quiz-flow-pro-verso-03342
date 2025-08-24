import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

import { HeaderProperties } from '@/config/headerPropertiesMapping';

interface QuizIntroHeaderBlockProps extends BlockComponentProps {
  disabled?: boolean;
  properties?: HeaderProperties;
}

// Removida função getMarginClass - usando CSS inline para margens

const QuizIntroHeaderBlock: React.FC<QuizIntroHeaderBlockProps> = ({
  block,
  onClick: _onClick,
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

  // Conteúdo textual (suporta HTML no título/subtítulo)
  const title = (block as any)?.content?.title || (block as any)?.properties?.title || '';
  const subtitle = (block as any)?.content?.subtitle || (block as any)?.properties?.subtitle || '';
  const description =
    (block as any)?.content?.description || (block as any)?.properties?.description || '';

  // Imagem de introdução opcional
  const introImageUrl =
    (block as any)?.properties?.introImageUrl || (block as any)?.content?.introImageUrl || '';
  const introImageAlt =
    (block as any)?.properties?.introImageAlt || (block as any)?.content?.introImageAlt || 'Intro';
  const introImageWidth = (block as any)?.properties?.introImageWidth || 300;
  const introImageHeight = (block as any)?.properties?.introImageHeight || 200;

  return (
    <div
      className={cn(
        'relative w-full p-6',
        isSticky ? 'sticky top-0 z-50' : '',
        'transition-colors',
        className
      )}
      style={{
        backgroundColor: backgroundColor || '#ffffff',
        marginTop: marginTop || 0,
        marginBottom: marginBottom || 0,
      }}
    >
      {/* Header Content */}
      <div className="relative w-full min-h-[80px] flex items-center justify-center">
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

      {/* Título / Subtítulo / Descrição */}
      {(title || subtitle || description) && (
        <div className="mt-4 text-center space-y-3">
          {title && (
            <h1
              className="text-2xl md:text-3xl font-bold leading-snug"
              style={{ color: '#432818', fontFamily: 'Playfair Display, serif' }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {subtitle && (
            <div
              className="text-base md:text-lg"
              style={{ color: '#432818' }}
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
          {description && <p className="text-sm md:text-base text-gray-700">{description}</p>}
        </div>
      )}

      {/* Imagem de Introdução (opcional) */}
      {introImageUrl && (
        <div className="mt-6 flex justify-center">
          <img
            src={introImageUrl}
            alt={introImageAlt}
            width={introImageWidth}
            height={introImageHeight}
            className="object-cover w-full max-w-lg h-auto rounded-xl shadow"
            onError={e => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Imagem';
            }}
          />
        </div>
      )}

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
