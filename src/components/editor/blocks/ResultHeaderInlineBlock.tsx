import { InlineEditableText } from './InlineEditableText';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import type { BlockComponentProps } from '@/types/blocks';
import { useQuizResult } from '@/hooks/useQuizResult';
import { cn } from '@/lib/utils';
import { StorageService } from '@/services/core/StorageService';

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
  const { primaryStyle } = useQuizResult();
  const storedName = StorageService.safeGetString('userName') || StorageService.safeGetString('quizUserName') || '';

  const {
    title = 'Seu Estilo Predominante',
    subtitle = '',
    percentage = 85,
    description = 'Descubra como aplicar seu estilo pessoal único na prática...',
    imageUrl: rawImageUrl = 'https://via.placeholder.com/238x320?text=Estilo',
    guideImageUrl: rawGuideImageUrl = 'https://via.placeholder.com/540x300?text=Guia+de+Estilo',
    styleGuideImageUrl: rawStyleGuideImageUrl,
    showBothImages = true,
    imageWidth,
    imageHeight,
    progressColor = '#B89B7A',
    badgeText = 'Exclusivo',
    backgroundColor,
    textAlign = 'center',
  } = block?.properties || {};

  // Compatibilidade: aceitar styleGuideImageUrl do template
  const guideImageUrl = rawStyleGuideImageUrl || rawGuideImageUrl;
  const imageUrl = rawImageUrl;

  const vars = {
    userName: storedName || (block as any)?.properties?.userName || '',
    resultStyle: primaryStyle?.style || primaryStyle?.category || 'Estilo',
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
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
        className={cn('p-6 shadow-md border border-[#B89B7A]/20', alignClass)}
        // Permite sobrepor o fundo do card se desejado
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
                  const newPercentage = prompt('Nova porcentagem (0-100):', percentage.toString());
                  if (newPercentage !== null && !isNaN(Number(newPercentage))) {
                    handlePropertyChange(
                      'percentage',
                      Math.max(0, Math.min(100, Number(newPercentage)))
                    );
                  }
                }}
              >
                {percentage}%
              </span>
            </div>
            <Progress
              value={percentage}
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
                value={interpolate(description, vars)}
                onChange={value => handlePropertyChange('description', value)}
                placeholder="Descrição do estilo predominante..."
                className="text-[#432818] leading-relaxed"
                multiline
              />
            </p>
          </div>

          <div className="max-w-xs sm:max-w-sm mx-auto relative">
            <img
              src={imageUrl}
              alt="Estilo"
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => {
                const newUrl = prompt('Nova URL da imagem:', imageUrl);
                if (newUrl !== null) handlePropertyChange('imageUrl', newUrl);
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
              src={guideImageUrl}
              alt="Guia de Estilo"
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => {
                const newUrl = prompt('Nova URL da imagem do guia:', guideImageUrl);
                if (newUrl !== null) handlePropertyChange('guideImageUrl', newUrl);
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
