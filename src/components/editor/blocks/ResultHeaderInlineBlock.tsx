import { useState } from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { SpecialTipsCard } from '@/components/ui/SpecialTipsCard';
import type { BlockComponentProps } from '@/types/blocks';
import { useQuizResult } from '@/hooks/useQuizResult';
import { cn } from '@/lib/utils';
import { getStyleConfig } from '@/config/styleConfig';
import { mapToFriendlyStyle, sanitizeStyleMentions } from '@/core/style/naming';
import { computeEffectivePrimaryPercentage } from '@/core/result/percentage';
import { getBestUserName } from '@/core/user/name';
import { safePlaceholder, safeStylePlaceholder } from '@/utils/placeholder';

const interpolate = (text: string, vars: Record<string, any>) => {
  if (!text) return '';
  return text
    .replace(/\{userName\}/g, vars.userName || '')
    .replace(/\{resultStyle\}/g, vars.resultStyle || '');
};


const ResultHeaderInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const { primaryStyle, secondaryStyles, isLoading, error, retry, hasResult } = useQuizResult();
  const [imageError, setImageError] = useState(false);
  const [guideImageError, setGuideImageError] = useState(false);

  // ✅ CORREÇÃO CRÍTICA: Estados de loading, erro e retry
  if (isLoading) {
    return (
      <div className={cn("text-center p-8", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded mx-auto w-64"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Calculando seu resultado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center p-8", className)}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-yellow-800 mb-2">⚠️ Problema no resultado</div>
          <p className="text-sm text-yellow-700 mb-4">{error}</p>
          <button
            onClick={retry}
            className="border border-yellow-300 text-yellow-800 hover:bg-yellow-100 px-4 py-2 rounded"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!hasResult || !primaryStyle) {
    return (
      <div className={cn("text-center p-8", className)}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="text-gray-800 mb-2">📋 Resultado não disponível</div>
          <p className="text-sm text-gray-600 mb-4">Nenhum resultado foi calculado ainda.</p>
          <button
            onClick={retry}
            className="border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded"
          >
            🔄 Calcular Resultado
          </button>
        </div>
      </div>
    );
  }

  // Capturar nome de forma robusta (incluindo UnifiedQuizStorage) e sanitizar para exibição
  const storedName = getBestUserName(block);
  const normalizeName = (name?: string) => {
    const s = (name || '').trim();
    if (s.length <= 1) return '';
    return s
      .split(/\s+/)
      .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(' ');
  };
  const displayName = normalizeName(storedName);

  const {
    title = 'Seu Estilo Predominante',
    subtitle = '',
    percentage: percentageProp,
    description = 'Descubra como aplicar seu estilo pessoal único na prática...',
    imageUrl: rawImageUrl,
    guideImageUrl: rawGuideImageUrl,
    styleGuideImageUrl: rawStyleGuideImageUrl,
    showBothImages = true,
    showSpecialTips = true, // ✅ Nova propriedade para mostrar dicas especiais
    imageWidth,
    imageHeight,
    progressColor = '#B89B7A',
    badgeText = 'Exclusivo',
    backgroundColor,
    textAlign = 'center',
    // Props legadas (compat): renderizam uma faixa de header simples acima do conteúdo rico
    logoUrl,
    logoAlt = 'Logo',
    logoHeight = 40,
    logoWidth = 'auto',
    showUserName = false,
    borderColor,
    showBorder = false,
    containerWidth = 'full', // 'small' | 'medium' | 'large' | 'full'
    spacing = 'normal', // 'small' | 'normal' | 'large'
    marginTop = 0,
    marginBottom = 0,
  } = block?.properties || {};

  // Compatibilidade: aceitar styleGuideImageUrl do template
  const guideImageUrl = rawStyleGuideImageUrl || rawGuideImageUrl;
  const imageUrl = rawImageUrl;

  // Normalizar nome do estilo para exibição (preferir category legível)
  const styleKey = (primaryStyle as any)?.style || (primaryStyle as any)?.category || '';
  const styleLabel = mapToFriendlyStyle((primaryStyle as any)?.category || styleKey || 'Natural');

  const vars = {
    userName: displayName,
    resultStyle: styleLabel,
  };

  // Percentual exibido: usa o calculado (primaryStyle.percentage) se não houver override explícito na prop
  const computedPercentage = typeof percentageProp === 'number' && !Number.isNaN(percentageProp)
    ? percentageProp
    : (typeof (primaryStyle as any)?.percentage === 'number' ? (primaryStyle as any).percentage : 0);
  const effectivePercentage = computeEffectivePrimaryPercentage(
    primaryStyle as any,
    secondaryStyles as any[],
    computedPercentage
  );
  // Evitar exibir 0% quando já existe um estilo definido mas sem dados numéricos suficientes
  const displayPercentage = (effectivePercentage && effectivePercentage > 0)
    ? effectivePercentage
    : (primaryStyle ? 70 : 0);

  // Defaults vindos do styleConfig, quando props do bloco estiverem ausentes
  const styleInfo = getStyleConfig(styleLabel) || {};
  const effectiveImageUrl = imageUrl || (styleInfo as any)?.image || safeStylePlaceholder(styleLabel, 238, 320);
  const effectiveGuideImageUrl = guideImageUrl || (styleInfo as any)?.guideImage || safePlaceholder(540, 300, 'Guia de Estilo');
  const effectiveDescription = (block?.properties?.description && String(block.properties.description).trim().length > 0)
    ? description
    : ((styleInfo as any)?.description || description || 'Descrição não disponível');

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const alignClass = textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center';

  // Compat: classes/estilo para faixa de header simples (se logoUrl estiver presente)
  const legacyContainerClasses = (() => {
    const widthCls = containerWidth === 'small' ? 'max-w-sm' : containerWidth === 'medium' ? 'max-w-md' : containerWidth === 'large' ? 'max-w-lg' : 'max-w-full';
    const padCls = spacing === 'small' ? 'py-2' : spacing === 'large' ? 'py-6' : 'py-4';
    const mtCls = marginTop <= 0 ? 'mt-0' : marginTop <= 8 ? 'mt-2' : marginTop <= 16 ? 'mt-4' : marginTop <= 24 ? 'mt-6' : 'mt-8';
    const mbCls = marginBottom <= 0 ? 'mb-0' : marginBottom <= 8 ? 'mb-2' : marginBottom <= 16 ? 'mb-4' : marginBottom <= 24 ? 'mb-6' : 'mb-8';
    return cn('w-full mx-auto', widthCls, padCls, mtCls, mbCls);
  })();

  const legacyHeaderStyle: React.CSSProperties = (() => {
    const style: React.CSSProperties = {};
    if (backgroundColor) style.backgroundColor = backgroundColor as any;
    if (showBorder && borderColor) Object.assign(style, { borderColor, borderWidth: '1px', borderStyle: 'solid' });
    return style;
  })();

  return (
    <div
      className={cn(
        'w-full p-3 rounded-lg transition-all duration-200',
        isSelected
          ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
          : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30',
        className
      )}
      style={{ backgroundColor }}
    >
      {/* Faixa de header simples (compat) */}
      {logoUrl && (
        <div className={legacyContainerClasses} style={legacyHeaderStyle}>
          <div className="flex items-center justify-between gap-4">
            <img
              src={logoUrl}
              alt={logoAlt}
              style={{ height: typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight, width: logoWidth as any }}
              className="object-contain"
            />
            {showUserName && storedName && (
              <div className="text-sm text-[#432818]">{storedName}</div>
            )}
          </div>
        </div>
      )}

      <Card
        className={cn('p-6 shadow-md border border-[#B89B7A]/20', alignClass)}
        style={{ backgroundColor: backgroundColor ? backgroundColor : undefined }}
      >
        {/* ✅ NOVA SEÇÃO: Cabeçalho Comemorativo */}
        <div className={cn('mb-8 text-center')}>
          <div className="flex items-center justify-center mb-4">
            <div className="text-3xl mr-2">🎉</div>
            <h1 className="text-2xl font-bold text-[#432818]">
              Parabéns! Descobrimos o seu Estilo Pessoal
            </h1>
          </div>
          
          {displayName && (
            <p className="text-lg text-[#6B4F43] mb-4">
              Olá, <span className="font-semibold text-[#432818]">{displayName}</span>! ✨
            </p>
          )}

          {/* Estilo Predominante em Destaque */}
          {styleLabel && (
            <div className="bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#432818] mb-2">
                Estilo Predominante: <span className="text-[#B89B7A]">{styleLabel}</span>
              </h2>
              {(styleInfo as any)?.category && (
                <p className="text-[#6B4F43] text-sm">{(styleInfo as any).category}</p>
              )}
            </div>
          )}
        </div>

        <div className={cn('mb-8', alignClass)}>
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#8F7A6A]">
                <InlineEditableText
                  value={interpolate(title, vars)}
                  onChange={value => handlePropertyChange('title', value)}
                  placeholder="Título do resultado"
                  className="text-sm text-[#8F7A6A]"
                />
              </span>
              <span
                className="text-[#aa6b5d] font-medium cursor-pointer"
                onClick={() => {
                  const newPercentage = prompt('Nova porcentagem (0-100):', String(displayPercentage));
                  if (newPercentage !== null && !isNaN(Number(newPercentage))) {
                    handlePropertyChange(
                      'percentage',
                      Math.max(0, Math.min(100, Number(newPercentage)))
                    );
                  }
                }}
              >
                {displayPercentage}%
              </span>
            </div>
            {/* Mostrar o nome do estilo atual quando disponível */}
            {styleLabel && (
              <div className="text-base font-semibold text-[#432818] mb-2">
                Compatibilidade: {displayPercentage}%
                {displayName ? (
                  <span className="ml-1 text-[#6B4F43] font-normal">• {vars.userName}</span>
                ) : null}
              </div>
            )}
            <Progress
              value={displayPercentage}
              className="h-3 bg-[#F3E8E6] rounded-full"
              style={{
                '--progress-color': progressColor,
              } as React.CSSProperties}
            />
          </div>
          {/* Subtítulo opcional com variáveis interpoladas */}
          {subtitle && (
            <div className={cn('mt-2 text-[#432818] font-semibold', alignClass)}>
              <InlineEditableText
                value={interpolate(subtitle, vars)}
                onChange={value => handlePropertyChange('subtitle', value)}
                placeholder="Subtítulo do resultado"
                className="text-[#432818]"
              />
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Seção da Imagem do Estilo */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#432818] mb-4">Seu Estilo</h3>
            <div className="relative">
              <img
                src={imageError ? safePlaceholder(300, 400, 'Imagem indisponível') : effectiveImageUrl}
                alt="Estilo"
                className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => {
                  const newUrl = prompt('Nova URL da imagem:', effectiveImageUrl);
                  if (newUrl !== null) handlePropertyChange('imageUrl', newUrl);
                }}
                onError={(e) => {
                  if (!imageError) {
                    setImageError(true);
                    try { (e.currentTarget as HTMLImageElement).src = safePlaceholder(300, 400, 'Imagem indisponível'); } catch { }
                  }
                }}
                style={{
                  ...(imageWidth ? { maxWidth: typeof imageWidth === 'number' ? `${imageWidth}px` : imageWidth } : {}),
                  ...(imageHeight ? { maxHeight: typeof imageHeight === 'number' ? `${imageHeight}px` : imageHeight } : {}),
                }}
              />
              {/* Cantos decorativos */}
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
            </div>
          </div>

          {/* Seção da Descrição */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#432818] mb-4">Sua Personalidade Estilística</h3>
              <p className="text-[#432818] leading-relaxed">
                <InlineEditableText
                  value={sanitizeStyleMentions(interpolate(effectiveDescription, vars), styleLabel)}
                  onChange={value => handlePropertyChange('description', value)}
                  placeholder="Descrição do estilo predominante..."
                  className="text-[#432818] leading-relaxed"
                  multiline
                />
              </p>
            </div>
          </div>
        </div>
        {showBothImages && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#432818] mb-4 text-center">Guia de Aplicação do Seu Estilo</h3>
            <div className="max-w-2xl mx-auto relative">
              <img
                src={guideImageError ? safePlaceholder(600, 400, 'Guia indisponível') : effectiveGuideImageUrl}
                alt="Guia de Estilo"
                className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => {
                  const newUrl = prompt('Nova URL da imagem do guia:', effectiveGuideImageUrl);
                  if (newUrl !== null) handlePropertyChange('guideImageUrl', newUrl);
                }}
                onError={(e) => {
                  if (!guideImageError) {
                    setGuideImageError(true);
                    try { (e.currentTarget as HTMLImageElement).src = safePlaceholder(600, 400, 'Guia indisponível'); } catch { }
                  }
                }}
              />
              {/* Badge */}
              <div
                className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12 cursor-pointer"
                onClick={() => {
                  const newBadge = prompt('Novo texto do badge:', badgeText);
                  if (newBadge !== null) handlePropertyChange('badgeText', newBadge);
                }}
              >
                {badgeText}
              </div>
            </div>
          </div>
        )}
        
        {/* ✅ NOVA SEÇÃO: Dicas Especiais */}
        {showSpecialTips && styleInfo && (styleInfo as any).specialTips && (styleInfo as any).specialTips.length > 0 && (
          <div className="mt-8">
            <SpecialTipsCard
              styleName={styleLabel}
              tips={(styleInfo as any).specialTips}
              title="💎 Dicas Especiais para Seu Estilo"
              accentColor="text-[#B89B7A]"
              className="border-[#B89B7A]/20"
            />
          </div>
        )}

        {/* ✅ NOVA SEÇÃO: CTA Estratégico */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-br from-[#B89B7A]/10 to-[#aa6b5d]/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#432818] mb-3">
              Pronto para Transformar Sua Imagem?
            </h3>
            <p className="text-[#6B4F43] mb-4 text-sm">
              Agora que você conhece seu estilo {styleLabel}, descubra como aplicá-lo no seu dia a dia.
            </p>
            
            <button
              onClick={() => {
                // Navegação para próxima etapa ou abertura de link externo
                const ctaUrl = "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912";
                window.open(ctaUrl, '_blank');
              }}
              className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-6 py-3 text-sm font-semibold rounded-xl shadow-lg hover:from-[#A08966] hover:to-[#9A5A4D] transition-all duration-300 hover:scale-105"
            >
              👉 Quero Aprimorar Meu Estilo
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultHeaderInlineBlock;