import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { isValidBlock, logBlockDebug, safeGetBlockProperties } from '@/utils/blockUtils';
import { Award, TrendingUp } from 'lucide-react';

/**
 * ResultCardInlineBlock - Componente modular inline horizontal
 * Card compacto de resultado de quiz
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

const ResultCardInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  // 🛡️ Validação e logging de debug
  if (!isValidBlock(block)) {
    console.error('❌ ResultCardInlineBlock: Bloco inválido recebido', block);
    return <div style={{ color: '#432818' }}>Erro: Bloco inválido</div>;
  }

  logBlockDebug('ResultCardInlineBlock', block);

  // 🛡️ Extração segura das propriedades
  const properties = safeGetBlockProperties(block);

  const {
    styleName = 'Elegante',
    percentage = 85,
    description = 'Você valoriza sofisticação e refinamento',
    showProgress = true,
    showIcon = true,
    cardVariant = 'elevated', // elevated, flat, outlined
    size = 'medium', // small, medium, large
    backgroundColor = 'white',
    accentColor = '#432818',
  } = properties;

  // Variantes de card
  const cardVariants = {
    elevated: 'shadow-lg hover:shadow-xl bg-white border border-gray-100',
    flat: 'bg-gray-50 hover:bg-gray-100',
    outlined: 'border-2 border-gray-200 hover:border-gray-300 bg-white',
  };

  // Tamanhos
  const sizeClasses = {
    small: 'p-4 min-h-[140px]',
    medium: 'p-6 min-h-[180px]',
    large: 'p-8 min-h-[220px]',
  };

  const iconSizes = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  const titleSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        'flex-shrink-0 flex-grow-0',
        // Card responsivo
        'w-full max-w-sm mx-auto rounded-xl transition-all duration-300',
        // Tamanho
        sizeClasses[size as keyof typeof sizeClasses],
        // Variante
        cardVariants[cardVariant as keyof typeof cardVariants],
        // Estados do editor
        isSelected && 'ring-2 ring-[#432818] ring-offset-2',
        'cursor-pointer hover:scale-[1.02]',
        className
      )}
      style={{
        backgroundColor: backgroundColor === 'white' ? undefined : backgroundColor,
      }}
      onClick={onClick}
    >
      {/* Header com ícone e percentual */}
      <div className="flex items-center justify-between mb-4">
        {showIcon && (
          <div
            className={cn(
              'rounded-full p-2 flex items-center justify-center',
              iconSizes[size as keyof typeof iconSizes]
            )}
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Award
              className={cn('text-current', iconSizes[size as keyof typeof iconSizes])}
              style={{ color: accentColor }}
            />
          </div>
        )}

        {showProgress && (
          <div className="text-right">
            <div
              className={cn('font-bold', titleSizes[size as keyof typeof titleSizes])}
              style={{ color: accentColor }}
            >
              {percentage}%
            </div>
            <div style={{ color: '#8B7355' }}>Compatibilidade</div>
          </div>
        )}
      </div>

      {/* Nome do estilo */}
      <h3
        className={cn('font-bold mb-3 text-gray-900', titleSizes[size as keyof typeof titleSizes])}
      >
        Estilo {styleName}
      </h3>

      {/* Descrição */}
      <p style={{ color: '#6B4F43' }}>{description}</p>

      {/* Barra de progresso */}
      {showProgress && (
        <div className="space-y-2">
          <div style={{ color: '#8B7355' }}>
            <span>Compatibilidade</span>
            <span>{percentage}%</span>
          </div>
          <Progress
            value={percentage}
            className="h-2"
            style={{
              backgroundColor: `${accentColor}20`,
            }}
          />
        </div>
      )}

      {/* Indicador de tendência */}
      <div className="flex items-center justify-center mt-4 pt-3 border-t border-gray-100">
        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
        <span style={{ color: '#8B7355' }}>Tendência em alta</span>
      </div>
    </div>
  );
};

export default ResultCardInlineBlock;
