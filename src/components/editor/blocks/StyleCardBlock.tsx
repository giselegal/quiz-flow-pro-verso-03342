import { cn } from '@/lib/utils';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { styleConfig } from '@/config/styleConfig';
import { Progress } from '@/components/ui/progress';
import { safePlaceholder } from '@/utils/placeholder';

interface StyleCardBlockProps {
  showProgress?: boolean;
  showDescription?: boolean;
  showImage?: boolean;
  className?: string;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: string | number, type: string): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const StyleCardBlock: React.FC<StyleCardBlockProps> = ({
  showProgress = true,
  showDescription = true,
  showImage = true,
  className,
}) => {
  const { quizResult } = useQuizLogic();
  const primaryStyle = quizResult?.primaryStyle;

  if (!primaryStyle) {
    return (
      <div
        className={cn(
          'p-6 text-center text-[#432818]',
          className,
          // Margens universais com controles deslizantes
          getMarginClass((marginTop as number | string) ?? 0, 'top'),
          getMarginClass((marginBottom as number | string) ?? 0, 'bottom'),
          getMarginClass((marginLeft as number | string) ?? 0, 'left'),
          getMarginClass((marginRight as number | string) ?? 0, 'right')
        )}
      >
        <p>Finalize o quiz para ver seu estilo predominante</p>
      </div>
    );
  }

  // Handle both string and object style types
  const category = typeof primaryStyle === 'string' ? primaryStyle : (primaryStyle as any).category;
  const percentage = typeof primaryStyle === 'object' ? (primaryStyle as any).percentage || 85 : 85;

  const styleData = styleConfig[category as keyof typeof styleConfig];

  if (!styleData) {
    return (
      <div className={cn('p-6 text-center text-[#432818]', className)}>
        <p>Estilo não encontrado: {category}</p>
      </div>
    );
  }

  const { image, description } = styleData;

  return (
    <div
      className={cn(
        'p-6 bg-white shadow-md border border-[#B89B7A]/20 rounded-lg card-elegant',
        className
      )}
    >
      <div className="text-center mb-8">
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#8F7A6A]">Seu estilo predominante</span>
            <span className="text-[#aa6b5d] font-medium">{percentage}%</span>
          </div>
          {showProgress && (
            <Progress
              value={percentage}
              className="h-2 bg-[#F3E8E6]"
              indicatorClassName="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]"
            />
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-[#aa6b5d] mb-4">Estilo {category}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          {showDescription && <p className="text-[#432818] leading-relaxed">{description}</p>}
        </div>

        {showImage && (
          <div className="max-w-xs sm:max-w-sm mx-auto relative">
            <img
              src={`${image}?q=auto:best&f=auto&w=238`}
              alt={`Estilo ${category}`}
              className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              loading="eager"
              width="238"
              height="auto"
              onError={e => {
                try {
                  (e.currentTarget as HTMLImageElement).src = safePlaceholder(238, 320, `Estilo ${category}`);
                } catch { }
              }}
            />
            {/* Decorative corners */}
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#B89B7A]"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#B89B7A]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleCardBlock;
