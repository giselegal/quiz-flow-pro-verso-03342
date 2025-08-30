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

  // Debug controlado (apenas dev e quando flag global ativa)
  const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV !== 'production' : true;
  const verbose = typeof window !== 'undefined' && (window as any).__EDITOR_VERBOSE__ === true;
  if (isDev && verbose) {
    // Evitar logar em todo render: usa raf para coalescer
    requestAnimationFrame(() => {
      // eslint-disable-next-line no-console
      console.log('🔍 [QuizIntroHeaderBlock] Propriedades recebidas:', block.properties, 'ID:', block.id);
    });
  }

  // ✅ USAR useEffect para detectar mudanças nas propriedades
  React.useEffect(() => {
    if (isDev && verbose) {
      // eslint-disable-next-line no-console
      console.log('🔄 [QuizIntroHeaderBlock] Propriedades atualizadas:', {
        blockId: block.id,
        logoUrl: block.properties.logoUrl,
        logoWidth: block.properties.logoWidth,
        logoHeight: block.properties.logoHeight,
        progressValue: block.properties.progressValue,
        showProgress: block.properties.showProgress,
        showBackButton: block.properties.showBackButton,
      });
    }
  // Dependências por valor para evitar disparos por identidade do objeto
  }, [
    block.id,
    (block.properties as any)?.logoUrl,
    (block.properties as any)?.logoWidth,
    (block.properties as any)?.logoHeight,
    (block.properties as any)?.progressValue,
    (block.properties as any)?.showProgress,
    (block.properties as any)?.showBackButton,
  ]);

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

  // Layout sugerido e responsividade
  const contentMaxWidth = (block as any)?.properties?.contentMaxWidth || 640; // px
  const progressHeight = (block as any)?.properties?.progressHeight || 8; // px
  const backSafePadding = showBackButton ? 48 : 0; // px (equivale a pl-12)
  const contentWrapperStyle: React.CSSProperties = {
    maxWidth: contentMaxWidth,
    margin: '0 auto',
    paddingLeft: backSafePadding,
  };

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
      <div
        className="relative w-full min-h-[80px] flex items-center justify-center"
        style={contentWrapperStyle}
      >
        {showBackButton && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100/50 transition-colors"
            style={{ backgroundColor: backgroundColor ? `${backgroundColor}dd` : '#E5DDD5' }}
            aria-label="Voltar"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: '#6B4F43' }} />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center">
          <img
            src={logoUrl}
            alt={logoAlt}
            style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
            className="object-contain"
            onError={e => {
              e.currentTarget.src = 'https://via.placeholder.com/96x96?text=Logo';
            }}
          />
        </div>
      </div>

      {/* Título / Subtítulo / Descrição */}
      {(title || subtitle || description) && (
        <div className="mt-4 text-center space-y-3" style={contentWrapperStyle}>
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
        <div className="mt-6 flex justify-center" style={contentWrapperStyle}>
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
        <div className="mt-4" style={contentWrapperStyle}>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={progressMax || 100}
            aria-valuenow={Math.min(progressValue || 0, progressMax || 100)}
            className="relative w-full overflow-hidden rounded-full"
            style={{
              backgroundColor: backgroundColor ? `${backgroundColor}dd` : '#E5DDD5',
              height: progressHeight,
            }}
          >
            <div
              className="h-full flex-1 transition-all"
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

// Memoização com comparação customizada para evitar re-render quando apenas handlers mudam
function areEqual(
  prev: Readonly<QuizIntroHeaderBlockProps>,
  next: Readonly<QuizIntroHeaderBlockProps>
) {
  const pb = prev.block as any;
  const nb = next.block as any;
  if (!pb || !nb) return false;
  if (pb.id !== nb.id) return false;
  // Comparar os campos usados pelo componente
  const pick = (b: any) => ({
    logoUrl: b?.properties?.logoUrl,
    logoWidth: b?.properties?.logoWidth,
    logoHeight: b?.properties?.logoHeight,
    progressValue: b?.properties?.progressValue,
    progressMax: b?.properties?.progressMax,
    showProgress: b?.properties?.showProgress,
    showBackButton: b?.properties?.showBackButton,
    backgroundColor: b?.properties?.backgroundColor,
    isSticky: b?.properties?.isSticky,
    marginTop: b?.properties?.marginTop,
    marginBottom: b?.properties?.marginBottom,
    title: b?.properties?.title || b?.content?.title,
    subtitle: b?.properties?.subtitle || b?.content?.subtitle,
    description: b?.properties?.description || b?.content?.description,
    introImageUrl: b?.properties?.introImageUrl || b?.content?.introImageUrl,
    introImageAlt: b?.properties?.introImageAlt || b?.content?.introImageAlt,
    introImageWidth: b?.properties?.introImageWidth || b?.content?.introImageWidth,
    introImageHeight: b?.properties?.introImageHeight || b?.content?.introImageHeight,
    contentMaxWidth: b?.properties?.contentMaxWidth,
    progressHeight: b?.properties?.progressHeight,
  });
  const a = pick(pb);
  const b = pick(nb);
  for (const k of Object.keys(a) as Array<keyof typeof a>) {
    if (a[k] !== b[k]) return false;
  }
  // className/disabled raramente mudam; incluir
  if ((prev as any).className !== (next as any).className) return false;
  if ((prev as any).disabled !== (next as any).disabled) return false;
  return true; // ignora mudanças de identidade de handlers
}

export default React.memo(QuizIntroHeaderBlock, areEqual);
