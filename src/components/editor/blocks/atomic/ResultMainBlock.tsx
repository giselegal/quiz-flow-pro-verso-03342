import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResult } from '@/contexts/ResultContext';

/**
 * 🏆 RESULT MAIN BLOCK
 * 
 * Exibe o resultado principal do quiz com nome do estilo e celebração.
 * Consome dados calculados do ResultContext.
 * Pode exibir imagens do estilo e do guia quando configurado.
 */
export default function ResultMainBlock({
  block,
  isSelected,
  onClick,
}: AtomicBlockProps) {
  // 🎯 Tentar usar context (modo production) ou fallback (modo editor)
  let userProfile, styleConfig, calculations;

  try {
    const result = useResult();
    userProfile = result.userProfile;
    styleConfig = result.styleConfig;
    calculations = result.calculations;
  } catch (e) {
    // Editor mode: usar dados do content
    userProfile = null;
    styleConfig = null;
    calculations = null;
  }

  // ✅ Ler de content (editor) ou context (runtime)
  const userName = userProfile?.userName || block.content?.userName || 'Você';
  const styleName = styleConfig?.name || block.content?.styleName || 'Seu Estilo';
  const percentage = calculations?.primaryStyle?.percentage
    ? `${calculations.primaryStyle.percentage.toFixed(0)}%`
    : block.content?.percentage || '85%';
  const showCelebration = block.content?.showCelebration !== false;

  // 🖼️ Configurações de imagem
  const showStyleImage = block.properties?.props?.showStyleImage !== false;
  const layout = block.properties?.props?.layout || 'single-column';
  const imagePosition = block.properties?.props?.imagePosition || 'left';
  const styleImageUrl = styleConfig?.imageUrl || block.content?.styleImageUrl;
  const guideImageUrl = styleConfig?.guideImageUrl || block.content?.guideImageUrl;
  const showGuideImage = block.properties?.props?.showGuideImage !== false;

  const backgroundColor = block.content?.backgroundColor || '#F5EDE4';
  const textColor = block.content?.textColor || '#5b4135';
  const accentColor = block.content?.accentColor || '#B89B7A';

  // Track when result is viewed
  React.useEffect(() => {
    if (!isSelected && styleName && styleName !== 'Seu Estilo') {
      window.dispatchEvent(new CustomEvent('quiz-result-viewed', {
        detail: {
          blockId: block.id,
          userName,
          styleName,
          percentage,
          hasContext: !!userProfile,
          timestamp: Date.now(),
        },
      }));
    }
  }, [block.id, isSelected, userName, styleName, percentage, userProfile]);

  // 🎨 Layout two-column com imagens
  if (layout === 'two-column' && showStyleImage && (styleImageUrl || guideImageUrl)) {
    return (
      <div
        className={`p-8 rounded-xl mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
        style={{ backgroundColor }}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Coluna de Imagens */}
          {imagePosition === 'left' && (
            <div className="space-y-4">
              {styleImageUrl && (
                <div className="relative">
                  <img
                    src={styleImageUrl}
                    alt={`Estilo ${styleName}`}
                    className="w-full rounded-lg shadow-lg"
                    style={{ aspectRatio: block.properties?.props?.styleImage?.aspectRatio || '4/5' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 rounded-b-lg">
                    <p className="text-white text-sm font-medium">Estilo {styleName}</p>
                  </div>
                </div>
              )}
              {showGuideImage && guideImageUrl && (
                <div className="relative">
                  <img
                    src={guideImageUrl}
                    alt="Guia de estilo"
                    className="w-full rounded-lg shadow-lg"
                    style={{ aspectRatio: '1/1' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 rounded-b-lg">
                    <p className="text-white text-sm font-medium">Seu Guia Visual</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coluna de Conteúdo */}
          <div className={imagePosition === 'right' ? 'md:order-first' : ''}>
            {/* Celebração */}
            {showCelebration && (
              <div className="text-5xl sm:text-6xl mb-4 text-center md:text-left animate-bounce">🎉</div>
            )}

            {/* Saudação Personalizada */}
            <p className="text-lg sm:text-xl text-gray-700 mb-2 text-center md:text-left">
              Olá, <span className="font-semibold" style={{ color: accentColor }}>
                {userName}
              </span>!
            </p>

            {/* Título com estilo */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 text-center md:text-left" style={{ color: textColor }}>
              Seu estilo é <span style={{ color: accentColor }}>{styleName}</span>!
            </h1>

            {/* Porcentagem de compatibilidade */}
            <div className="flex items-baseline gap-2 justify-center md:justify-start mb-4">
              <span className="text-4xl sm:text-5xl font-bold" style={{ color: accentColor }}>
                {percentage}
              </span>
              <span className="text-lg sm:text-xl" style={{ color: textColor }}>
                compatibilidade
              </span>
            </div>

            {/* Intro Text */}
            {block.properties?.props?.showIntroText && block.properties?.props?.introText && (
              <p className="text-base text-gray-600 leading-relaxed text-center md:text-left">
                {block.properties?.props.introText}
              </p>
            )}
          </div>

          {/* Coluna de Imagens (quando à direita) */}
          {imagePosition === 'right' && (
            <div className="space-y-4">
              {styleImageUrl && (
                <div className="relative">
                  <img
                    src={styleImageUrl}
                    alt={`Estilo ${styleName}`}
                    className="w-full rounded-lg shadow-lg"
                    style={{ aspectRatio: block.properties?.props?.styleImage?.aspectRatio || '4/5' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 rounded-b-lg">
                    <p className="text-white text-sm font-medium">Estilo {styleName}</p>
                  </div>
                </div>
              )}
              {showGuideImage && guideImageUrl && (
                <div className="relative">
                  <img
                    src={guideImageUrl}
                    alt="Guia de estilo"
                    className="w-full rounded-lg shadow-lg"
                    style={{ aspectRatio: '1/1' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 rounded-b-lg">
                    <p className="text-white text-sm font-medium">Seu Guia Visual</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 🎨 Layout single-column (padrão)

  return (
    <div
      className={`p-8 rounded-xl mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ backgroundColor }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      {/* Celebração */}
      {showCelebration && (
        <div className="text-5xl sm:text-6xl mb-4 text-center animate-bounce">🎉</div>
      )}

      {/* Saudação Personalizada */}
      <p className="text-lg sm:text-xl text-gray-700 mb-2 text-center">
        Olá, <span className="font-semibold" style={{ color: accentColor }}>
          {userName}
        </span>!
      </p>

      {/* Título com estilo */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 text-center" style={{ color: textColor }}>
        Seu estilo é <span style={{ color: accentColor }}>{styleName}</span>!
      </h1>

      {/* Porcentagem de compatibilidade */}
      <div className="flex items-baseline gap-2 justify-center">
        <span className="text-4xl sm:text-5xl font-bold" style={{ color: accentColor }}>
          {percentage}
        </span>
        <span className="text-lg sm:text-xl" style={{ color: textColor }}>
          compatibilidade
        </span>
      </div>
    </div>
  );
}
