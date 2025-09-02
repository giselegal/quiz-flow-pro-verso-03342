import { useMemo, useState } from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import type { BlockComponentProps } from '@/types/blocks';
import { useQuizResult } from '@/hooks/useQuizResult';
import { cn } from '@/lib/utils';
import { StorageService } from '@/services/core/StorageService';
import { getStyleConfig } from '@/config/styleConfig';
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
  const { primaryStyle, isLoading, error, retry, hasResult } = useQuizResult();
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

  // Capturar nome de forma robusta
  const storedName =
    StorageService.safeGetString('userName') ||
    StorageService.safeGetString('quizUserName') ||
    (typeof window !== 'undefined' ? (window as any).__quizUserName : '') ||
    (block as any)?.properties?.userName ||
    'Visitante'; // Fallback explícito

  const {
    title = 'Seu Estilo Predominante',
    subtitle = '',
    percentage: percentageProp,
    description = 'Descubra como aplicar seu estilo pessoal único na prática...',
    imageUrl: rawImageUrl,
    guideImageUrl: rawGuideImageUrl,
    styleGuideImageUrl: rawStyleGuideImageUrl,
    showBothImages = true,
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
  const styleLabel = (primaryStyle as any)?.category || styleKey || 'Estilo';

  const vars = {
    userName: storedName,
    resultStyle: styleLabel,
  };

  // Percentual exibido: usa o calculado (primaryStyle.percentage) se não houver override explícito na prop
  const computedPercentage =
    typeof percentageProp === 'number' && !Number.isNaN(percentageProp)
      ? percentageProp
      : (typeof (primaryStyle as any)?.percentage === 'number'
        ? (primaryStyle as any).percentage
        : 0);

  // Defaults vindos do styleConfig, quando props do bloco estiverem ausentes
  const styleInfo = getStyleConfig(styleKey || styleLabel) || {};
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
  const legacyContainerClasses = useMemo(() => {
    const widthCls = containerWidth === 'small' ? 'max-w-sm' : containerWidth === 'medium' ? 'max-w-md' : containerWidth === 'large' ? 'max-w-lg' : 'max-w-full';
    const padCls = spacing === 'small' ? 'py-2' : spacing === 'large' ? 'py-6' : 'py-4';
    const mtCls = marginTop <= 0 ? 'mt-0' : marginTop <= 8 ? 'mt-2' : marginTop <= 16 ? 'mt-4' : marginTop <= 24 ? 'mt-6' : 'mt-8';
    const mbCls = marginBottom <= 0 ? 'mb-0' : marginBottom <= 8 ? 'mb-2' : marginBottom <= 16 ? 'mb-4' : marginBottom <= 24 ? 'mb-6' : 'mb-8';
    return cn('w-full mx-auto', widthCls, padCls, mtCls, mbCls);
  }, [containerWidth, spacing, marginTop, marginBottom]);

  const legacyHeaderStyle = useMemo(() => {
    const style: React.CSSProperties = {};
    if (backgroundColor) style.backgroundColor = backgroundColor as any;
    if (showBorder && borderColor) Object.assign(style, { borderColor, borderWidth: '1px', borderStyle: 'solid' });
    return style;
  }, [backgroundColor, showBorder, borderColor]);

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
                  const newPercentage = prompt('Nova porcentagem (0-100):', String(computedPercentage));
                  if (newPercentage !== null && !isNaN(Number(newPercentage))) {
                    handlePropertyChange(
                      'percentage',
                      Math.max(0, Math.min(100, Number(newPercentage)))
                    );
                  }
                }}
              >
                {computedPercentage}%
              </span>
            </div>
            {/* Mostrar o nome do estilo atual quando disponível */}
            {styleLabel && (
              <div className="text-base font-semibold text-[#432818] mb-2">
                {styleLabel}
                {vars.userName ? (
                  <span className="ml-1 text-[#6B4F43] font-normal">• {vars.userName}</span>
                ) : null}
              </div>
            )}
            <Progress
              value={computedPercentage}
              className="h-2 bg-[#F3E8E6]"
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
          <div className="space-y-4">
            <p className="text-[#432818] leading-relaxed">
              <InlineEditableText
                value={interpolate(effectiveDescription, vars)}
                onChange={value => handlePropertyChange('description', value)}
                placeholder="Descrição do estilo predominante..."
                className="text-[#432818] leading-relaxed"
                multiline
              />
            </p>
          </div>
          <div className="max-w-xs sm:max-w-sm mx-auto relative">
            <img
              src={imageError ? safePlaceholder(238, 320, 'Imagem indisponível') : effectiveImageUrl}
              alt="Estilo"
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => {
                const newUrl = prompt('Nova URL da imagem:', effectiveImageUrl);
                if (newUrl !== null) handlePropertyChange('imageUrl', newUrl);
              }}
              onError={(e) => {
                if (!imageError) {
                  setImageError(true);
                  // como fallback extra, troca o src diretamente
                  try { (e.currentTarget as HTMLImageElement).src = safePlaceholder(238, 320, 'Imagem indisponível'); } catch { }
                }
              }}
              style={{
                ...(imageWidth ? { maxWidth: typeof imageWidth === 'number' ? `${imageWidth}px` : imageWidth } : {}),
                ...(imageHeight ? { maxHeight: typeof imageHeight === 'number' ? `${imageHeight}px` : imageHeight } : {}),
              }}
            />
            {/* Decorative corners */}
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
          </div>
        </div>
        {showBothImages && (
          <div className="mt-8 max-w-lg mx-auto relative">
            <img
              src={guideImageError ? safePlaceholder(540, 300, 'Guia indisponível') : effectiveGuideImageUrl}
              alt="Guia de Estilo"
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => {
                const newUrl = prompt('Nova URL da imagem do guia:', effectiveGuideImageUrl);
                if (newUrl !== null) handlePropertyChange('guideImageUrl', newUrl);
              }}
              onError={(e) => {
                if (!guideImageError) {
                  setGuideImageError(true);
                  try { (e.currentTarget as HTMLImageElement).src = safePlaceholder(540, 300, 'Guia indisponível'); } catch { }
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
        )}
      </Card>
    </div>
  );
};

export default ResultHeaderInlineBlock;