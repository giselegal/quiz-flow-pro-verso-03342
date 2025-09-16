import { useState, useMemo, memo } from 'react';
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

// =====================================
// Utils & Helpers
// =====================================
const interpolate = (text: string, vars: Record<string, any>) => {
  if (!text) return '';
  return text
    .replace(/\{userName\}/g, vars.userName || '')
    .replace(/\{resultStyle\}/g, vars.resultStyle || '');
};

interface VariantFlags {
  isCompact: boolean;
  isMinimal: boolean;
}

// Aplica classes utilitárias baseadas na variante
const variantPadding = (variant: VariantFlags) => variant.isMinimal ? 'p-4' : variant.isCompact ? 'p-5' : 'p-6';
const variantGapY = (variant: VariantFlags) => variant.isMinimal ? 'space-y-4' : variant.isCompact ? 'space-y-6' : 'space-y-8';
const variantTitleSize = (variant: VariantFlags) => variant.isMinimal ? 'text-xl' : variant.isCompact ? 'text-2xl' : 'text-2xl';
const variantCelebrationEmoji = (variant: VariantFlags) => variant.isMinimal ? '🎯' : '🎉';

// =====================================
// Subcomponentes (memoizados onde útil)
// =====================================
interface CelebrationHeaderProps {
  displayName: string;
  styleLabel: string;
  styleInfo: any;
  variant: VariantFlags;
}
const CelebrationHeader = memo(({ displayName, styleLabel, styleInfo, variant }: CelebrationHeaderProps) => {
  return (
    <div className={cn('text-center', variantGapY(variant))}>
      <div className="flex items-center justify-center mb-2">
        <div className={cn('mr-2 text-3xl')}>{variantCelebrationEmoji(variant)}</div>
        <h1 className={cn('font-bold text-[#432818]', variantTitleSize(variant))}>
          Parabéns! Descobrimos o seu Estilo Pessoal
        </h1>
      </div>
      {displayName && !variant.isMinimal && (
        <p className={cn('text-[#6B4F43]', variant.isCompact ? 'text-base' : 'text-lg')}>
          Olá, <span className="font-semibold text-[#432818]">{displayName}</span>! ✨
        </p>
      )}
      {styleLabel && (
        <div className={cn(
          'rounded-2xl p-4 md:p-6',
          'bg-gradient-to-r from-[#B89B7A]/10 to-[#aa6b5d]/10',
          variant.isMinimal && 'p-3'
        )}>
          <h2 className={cn('font-bold text-[#432818] mb-1', variant.isMinimal ? 'text-lg' : 'text-2xl')}>
            Estilo Predominante: <span className="text-[#B89B7A]">{styleLabel}</span>
          </h2>
          {!variant.isMinimal && (styleInfo as any)?.category && (
            <p className="text-[#6B4F43] text-sm">{(styleInfo as any).category}</p>
          )}
        </div>
      )}
    </div>
  );
});
CelebrationHeader.displayName = 'CelebrationHeader';

interface ProgressSectionProps {
  title: string;
  subtitle: string;
  vars: Record<string, any>;
  displayPercentage: number;
  progressColor: string;
  styleLabel: string;
  displayName: string;
  alignClass: string;
  onChange: (k: string, v: any) => void;
  variant: VariantFlags;
}
const ProgressSection = ({ title, subtitle, vars, displayPercentage, progressColor, styleLabel, displayName, alignClass, onChange, variant }: ProgressSectionProps) => (
  <div className={cn('mb-6', alignClass)}>
    <div className={cn('mx-auto', variant.isMinimal ? 'max-w-sm' : 'max-w-md', variant.isMinimal ? 'mb-4' : 'mb-6')}>
      <div className={cn('flex justify-between items-center', variant.isMinimal ? 'mb-1' : 'mb-2')}>
        <span className={cn('text-[#8F7A6A]', variant.isMinimal ? 'text-xs' : 'text-sm')}>
          <InlineEditableText
            value={interpolate(title, vars)}
            onChange={value => onChange('title', value)}
            placeholder="Título do resultado"
            className={cn(variant.isMinimal ? 'text-xs' : 'text-sm', 'text-[#8F7A6A]')}
          />
        </span>
        <span
          className={cn('text-[#aa6b5d] font-medium cursor-pointer', variant.isMinimal ? 'text-xs' : 'text-sm')}
          onClick={() => {
            const newPercentage = prompt('Nova porcentagem (0-100):', String(displayPercentage));
            if (newPercentage !== null && !isNaN(Number(newPercentage))) {
              onChange('percentage', Math.max(0, Math.min(100, Number(newPercentage))));
            }
          }}
        >
          {displayPercentage}%
        </span>
      </div>
      {styleLabel && (
        <div className={cn('font-semibold text-[#432818] mb-1', variant.isMinimal ? 'text-sm' : 'text-base')}>
          Compatibilidade: {displayPercentage}%
          {displayName ? (
            <span className="ml-1 text-[#6B4F43] font-normal">• {vars.userName}</span>
          ) : null}
        </div>
      )}
      <Progress
        value={displayPercentage}
        className={cn('bg-[#F3E8E6] rounded-full', variant.isMinimal ? 'h-2' : 'h-3')}
        style={{ '--progress-color': progressColor } as React.CSSProperties}
      />
    </div>
    {subtitle && !variant.isMinimal && (
      <div className={cn('mt-2 text-[#432818] font-semibold', alignClass)}>
        <InlineEditableText
          value={interpolate(subtitle, vars)}
          onChange={value => onChange('subtitle', value)}
          placeholder="Subtítulo do resultado"
          className="text-[#432818]"
        />
      </div>
    )}
  </div>
);

interface StyleImageProps {
  imageUrl: string;
  fallbackText: string;
  label?: string;
  onClick?: () => void;
  onError: (e: any) => void;
  width?: string | number;
  height?: string | number;
  variant: VariantFlags;
}
const StyleImage = ({ imageUrl, fallbackText, label, onClick, onError, width, height, variant }: StyleImageProps) => (
  <div className="text-center">
    {label && <h3 className={cn('font-semibold text-[#432818] mb-3', variant.isMinimal ? 'text-base' : 'text-lg')}>{label}</h3>}
    <div className="relative">
      <img
        src={imageUrl}
        alt={label || 'Imagem'}
        className={cn(
          'w-full h-auto rounded-xl shadow-lg transition-transform duration-300 cursor-pointer object-cover',
          !variant.isMinimal && 'hover:scale-105'
        )}
        onClick={onClick}
        onError={onError}
        style={{
          ...(width ? { maxWidth: typeof width === 'number' ? `${width}px` : width } : {}),
          ...(height ? { maxHeight: typeof height === 'number' ? `${height}px` : height } : {}),
        }}
      />
      {!variant.isMinimal && (
        <>
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]" />
        </>
      )}
    </div>
  </div>
);

interface DescriptionSectionProps {
  description: string;
  vars: Record<string, any>;
  styleLabel: string;
  onChange: (k: string, v: any) => void;
  variant: VariantFlags;
}
const DescriptionSection = ({ description, vars, styleLabel, onChange, variant }: DescriptionSectionProps) => (
  <div>
    <h3 className={cn('font-semibold text-[#432818] mb-3', variant.isMinimal ? 'text-base' : 'text-lg')}>Sua Personalidade Estilística</h3>
    <p className={cn('text-[#432818] leading-relaxed', variant.isMinimal && 'text-sm')}>
      <InlineEditableText
        value={sanitizeStyleMentions(interpolate(description, vars), styleLabel)}
        onChange={value => onChange('description', value)}
        placeholder="Descrição do estilo predominante..."
        className={cn('text-[#432818] leading-relaxed', variant.isMinimal && 'text-sm')}
        multiline
      />
    </p>
  </div>
);

interface GuideSectionProps {
  guideImageUrl: string;
  badgeText: string;
  variant: VariantFlags;
  onChange: (k: string, v: any) => void;
  onError: (e: any) => void;
}
const GuideSection = ({ guideImageUrl, badgeText, variant, onChange, onError }: GuideSectionProps) => (
  <div className="mt-8">
    <h3 className={cn('font-semibold text-[#432818] mb-4 text-center', variant.isMinimal ? 'text-base' : 'text-lg')}>Guia de Aplicação do Seu Estilo</h3>
    <div className="max-w-2xl mx-auto relative">
      <img
        src={guideImageUrl}
        alt="Guia de Estilo"
        className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
        onClick={() => {
          const newUrl = prompt('Nova URL da imagem do guia:', guideImageUrl);
          if (newUrl !== null) onChange('guideImageUrl', newUrl);
        }}
        onError={onError}
      />
      {!variant.isMinimal && (
        <div
          className="absolute -top-4 -right-4 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium transform rotate-12 cursor-pointer"
          onClick={() => {
            const newBadge = prompt('Novo texto do badge:', badgeText);
            if (newBadge !== null) onChange('badgeText', newBadge);
          }}
        >
          {badgeText}
        </div>
      )}
    </div>
  </div>
);

interface TipsSectionProps {
  styleLabel: string;
  styleInfo: any;
  variant: VariantFlags;
}
const TipsSection = ({ styleLabel, styleInfo, variant }: TipsSectionProps) => {
  if (!styleInfo || !(styleInfo as any).specialTips || !(styleInfo as any).specialTips.length) return null;
  if (variant.isMinimal) return null; // minimal não mostra dicas
  return (
    <div className="mt-8">
      <SpecialTipsCard
        styleName={styleLabel}
        tips={(styleInfo as any).specialTips}
        title="💎 Dicas Especiais para Seu Estilo"
        accentColor="text-[#B89B7A]"
        className="border-[#B89B7A]/20"
      />
    </div>
  );
};

// Componente CTACard (faltava no original)
interface CTACardProps {
  styleLabel: string;
  variant: VariantFlags;
}
const CTACard = ({ styleLabel, variant }: CTACardProps) => {
  if (variant.isMinimal) return null;
  return (
    <div className="mt-8 bg-[#F3E8E6] rounded-xl p-6 text-center">
      <h3 className="font-semibold text-[#432818] mb-3">Aproveite seu Estilo {styleLabel}</h3>
      <p className="text-[#6B4F43] mb-4">Veja mais opções e recomendações personalizadas para seu estilo único.</p>
      <button className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium">
        Ver Recomendações
      </button>
    </div>
  );
};

// Componente principal corrigido
interface ResultHeaderInlineBlockProps extends BlockComponentProps {
  className?: string;
  isSelected?: boolean;
}

const ResultHeaderInlineBlock = ({ 
  block, 
  onPropertyChange, 
  className = '', 
  isSelected = false 
}: ResultHeaderInlineBlockProps) => {
  const [imageError, setImageError] = useState(false);
  const [guideImageError, setGuideImageError] = useState(false);
  const { primaryStyle, secondaryStyles, hasResult, error, retry } = useQuizResult(block);
  
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
  const displayName = useMemo(() => {
    const s = (storedName || '').trim();
    if (s.length <= 1) return '';
    return s
      .split(/\s+/)
      .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(' ');
  }, [storedName]);

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
    mobileVariant = 'stack', // variantes: stack | compact | minimal
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
    : 0;

  // Flags de variante
  const variant: VariantFlags = useMemo(() => ({
    isCompact: mobileVariant === 'compact',
    isMinimal: mobileVariant === 'minimal'
  }), [mobileVariant]);

  // Defaults vindos de configuração de estilo
  const styleInfo = getStyleConfig(styleLabel) || {};
  const effectiveImageUrl = imageUrl || (styleInfo as any)?.image || safeStylePlaceholder(styleLabel, 238, 320);
  const effectiveGuideImageUrl = guideImageUrl || (styleInfo as any)?.guideImage || safePlaceholder(540, 300, 'Guia de Estilo');
  const effectiveDescription = (block?.properties?.description && String(block.properties.description).trim().length > 0)
    ? description
    : ((styleInfo as any)?.description || description || 'Descrição não disponível');

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) onPropertyChange(key, value);
  };
  const alignClass = textAlign === 'left' ? 'text-left' : textAlign === 'right' ? 'text-right' : 'text-center';

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
      <Card
        className={cn('shadow-md border border-[#B89B7A]/20', alignClass, variantPadding(variant))}
        style={{ backgroundColor: backgroundColor ? backgroundColor : undefined }}
      >
        {!variant.isMinimal && (
          <CelebrationHeader
            displayName={displayName}
            styleLabel={styleLabel}
            styleInfo={styleInfo}
            variant={variant}
          />
        )}
        <ProgressSection
          title={title}
          subtitle={subtitle}
          vars={vars}
          displayPercentage={displayPercentage}
          progressColor={progressColor}
          styleLabel={styleLabel}
          displayName={displayName}
          alignClass={alignClass}
          onChange={handlePropertyChange}
          variant={variant}
        />
        <div className={cn('grid items-start', variant.isMinimal ? 'gap-6' : 'gap-8', 'md:grid-cols-2')}>
          <StyleImage
            imageUrl={imageError ? safePlaceholder(300, 400, 'Imagem indisponível') : effectiveImageUrl}
            fallbackText="Imagem indisponível"
            label={variant.isMinimal ? undefined : 'Seu Estilo'}
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
            width={imageWidth}
            height={imageHeight}
            variant={variant}
          />
          <DescriptionSection
            description={effectiveDescription}
            vars={vars}
            styleLabel={styleLabel}
            onChange={handlePropertyChange}
            variant={variant}
          />
        </div>
        {(showBothImages && !variant.isMinimal) && (
          <GuideSection
            guideImageUrl={guideImageError ? safePlaceholder(600, 400, 'Guia indisponível') : effectiveGuideImageUrl}
            badgeText={badgeText}
            variant={variant}
            onChange={handlePropertyChange}
            onError={(e) => {
              if (!guideImageError) {
                setGuideImageError(true);
                try { (e.currentTarget as HTMLImageElement).src = safePlaceholder(600, 400, 'Guia indisponível'); } catch { }
              }
            }}
          />
        )}
        {showSpecialTips && (
          <TipsSection styleLabel={styleLabel} styleInfo={styleInfo} variant={variant} />
        )}
        <CTACard styleLabel={styleLabel} variant={variant} />
      </Card>
    </div>
  );
};

export default ResultHeaderInlineBlock;