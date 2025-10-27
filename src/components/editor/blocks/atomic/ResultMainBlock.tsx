import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResult } from '@/contexts/ResultContext';

/**
 * 🏆 RESULT MAIN BLOCK
 * 
 * Exibe o resultado principal do quiz com nome do estilo e celebração.
 * Consome dados calculados do ResultContext.
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
