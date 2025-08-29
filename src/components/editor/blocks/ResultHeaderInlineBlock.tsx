import { InlineEditableText } from './InlineEditableText';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import type { BlockComponentProps } from '@/types/blocks';
import { useQuizResult } from '@/hooks/useQuizResult';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: number | string | null | undefined,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  const numValue = typeof parsed === 'number' && !isNaN(parsed) ? parsed : 0;
  if (numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  const mapPositive = (v: number) => {
    if (v <= 4) return `${prefix}-1`;
    if (v <= 8) return `${prefix}-2`;
    if (v <= 12) return `${prefix}-3`;
    if (v <= 16) return `${prefix}-4`;
    if (v <= 20) return `${prefix}-5`;
    if (v <= 24) return `${prefix}-6`;
    if (v <= 28) return `${prefix}-7`;
    if (v <= 32) return `${prefix}-8`;
    if (v <= 36) return `${prefix}-9`;
    if (v <= 40) return `${prefix}-10`;
    if (v <= 44) return `${prefix}-11`;
    if (v <= 48) return `${prefix}-12`;
    if (v <= 56) return `${prefix}-14`;
    if (v <= 64) return `${prefix}-16`;
    if (v <= 80) return `${prefix}-20`;
    if (v <= 96) return `${prefix}-24`;
    if (v <= 112) return `${prefix}-28`;
    return `${prefix}-32`;
  };

  if (numValue < 0) {
    const abs = Math.abs(numValue);
    return `-${mapPositive(abs)}`;
  }

  return mapPositive(numValue);
};

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
  const storedName = (typeof window !== 'undefined' && localStorage.getItem('userName')) || '';

  const {
    title = 'Seu Estilo Predominante',
    percentage = 85,
    description = 'Descubra como aplicar seu estilo pessoal único na prática...',
    imageUrl = 'https://via.placeholder.com/238x320?text=Estilo',
    guideImageUrl = 'https://via.placeholder.com/540x300?text=Guia+de+Estilo',
    progressColor = '#B89B7A',
    badgeText = 'Exclusivo',
  } = block?.properties || {};

  const vars = {
    userName: storedName || (block as any)?.properties?.userName || '',
    resultStyle: primaryStyle?.style || primaryStyle?.category || 'Estilo',
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        w-full
        p-3 rounded-lg transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30'
        }
        ${className}
      `}
    >
      <Card className="p-6 bg-white shadow-md border border-[#B89B7A]/20">
        <div className="text-center mb-8">
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
            />
            {/* Decorative corners */}
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
          </div>
        </div>

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
      </Card>
    </div>
  );
};

export default ResultHeaderInlineBlock;
