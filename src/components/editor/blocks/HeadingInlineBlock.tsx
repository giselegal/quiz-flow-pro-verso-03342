import { cn } from '@/lib/utils';
import { Type, Settings } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * HeadingInlineBlock - Componente modular inline horizontal
 * Título/cabeçalho responsivo e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: number | string,
  type: 'top' | 'bottom' | 'left' | 'right'
) => {
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

const HeadingInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  // onPropertyChange, // not used here
  className = '',
}) => {
  // 🛡️ VALIDAÇÃO DE SEGURANÇA
  if (!block) {
    console.error('HeadingInlineBlock: block is undefined');
    return <div className="p-4 text-destructive">Erro: bloco inválido</div>;
  }

  const {
    content = 'Título Principal',
    level = 'h2', // h1, h2, h3, h4, h5, h6
    textAlign = 'left',
    color = '#1f2937',
    backgroundColor = 'transparent',
    fontWeight = 'bold',
    maxWidth = 'full',
  // responsive = true, // not used
    // Fix: Extract margin properties from block
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
  } = block?.properties || {};

  // 🛡️ GARANTIR QUE CONTENT É STRING
  const safeContent = typeof content === 'string' ? content : String(content || 'Título Principal');

  // Tamanhos responsivos por nível
  const levelClasses = {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    h4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    h5: 'text-sm sm:text-base md:text-lg lg:text-xl',
    h6: 'text-xs sm:text-sm md:text-base lg:text-lg',
  };

  // Alinhamentos
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Pesos de fonte
  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  // Larguras máximas
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  const HeadingTag = level as keyof JSX.IntrinsicElements;

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        'flex-shrink-0 flex-grow-0 relative group w-full',
        // Container editável
        'p-2 sm:p-3 rounded-lg border border-transparent',
        'hover:border-gray-200 hover:bg-gray-50/30 transition-all duration-200',
        'cursor-pointer',
        isSelected && 'border-[#B89B7A] bg-[#B89B7A]/10/30',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      <HeadingTag
        className={cn(
          // Tamanho responsivo
          levelClasses[level as keyof typeof levelClasses],
          // Alinhamento
          textAlignClasses[textAlign as keyof typeof textAlignClasses],
          // Peso da fonte
          fontWeightClasses[fontWeight as keyof typeof fontWeightClasses],
          // Largura máxima
          maxWidthClasses[maxWidth as keyof typeof maxWidthClasses],
          // Visual
          'leading-tight tracking-tight transition-colors duration-200'
        )}
        style={{
          color,
          backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor,
        }}
      >
        {safeContent}
      </HeadingTag>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#B89B7A]/100 text-white rounded-full p-1">
          <Settings className="w-3 h-3" />
        </div>
      )}

      {/* Empty state com instruções */}
      {!safeContent && (
        <div className="flex items-center" style={{ color: '#8B7355' }}>
          <Type className="w-6 h-6 mr-2" />
          <span className="text-sm">Clique e edite no painel de propriedades →</span>
        </div>
      )}

      {/* Instrução quando selecionado */}
      {isSelected && safeContent && (
        <div className="absolute -bottom-8 left-0 bg-[#B89B7A] text-white text-xs px-2 py-1 rounded text-nowrap">
          💡 Edite no painel de propriedades
        </div>
      )}
    </div>
  );
};

export default HeadingInlineBlock;
