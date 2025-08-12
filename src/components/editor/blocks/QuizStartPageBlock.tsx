// @ts-nocheck
import { cn } from '@/lib/utils';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface QuizStartPageBlockProps {
  block: {
    id: string;
    type: string;
    properties?: {
      title?: string;
      subtitle?: string;
      description?: string;
      buttonText?: string;
      benefits?: string[];
      nameInputPlaceholder?: string;
      showNameInput?: boolean;
      imageUrl?: string;
      backgroundColor?: string;
      textColor?: string;
    };
  };
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// @ts-nocheck
// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
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

const QuizStartPageBlock: React.FC<QuizStartPageBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
  style,
}) => {
  // Safe destructuring with fallback defaults
  const properties = block.properties || {};
  const {
    title = 'Etapa 1: Descubra Seu Estilo Pessoal Único',
    subtitle = 'Chega de guarda-roupa lotado e sensação de "não tenho nada para vestir"',
    description = 'Um quiz personalizado que vai te ajudar a descobrir seu estilo predominante e como aplicá-lo no dia a dia com confiança.',
    buttonText = 'Começar Meu Quiz de Estilo',
    benefits = [
      '✓ Descubra seu estilo predominante em apenas 5 minutos',
      '✓ Receba dicas personalizadas para seu perfil único',
      '✓ Aprenda a criar looks que combinam 100% com você',
      '✓ Ganhe confiança para se vestir todos os dias',
    ],
    nameInputPlaceholder = 'Digite seu primeiro nome aqui...',
    showNameInput = true,
    imageUrl,
    backgroundColor = '#fffaf7',
    textColor = '#432818',
    // Sistema completo de margens com controles deslizantes
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col bg-white rounded-lg border border-gray-200',
        // LAYOUT HORIZONTAL RESPONSIVO - LARGURA 100% - MÁXIMO 2 COLUNAS INTERNAS
        'p-4 md:p-6 min-h-[300px] max-w-full',
        isSelected ? 'ring-2 ring-[#B89B7A] bg-[#B89B7A]/10' : '',
        'cursor-pointer hover:shadow-md transition-all duration-200',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
      style={{ backgroundColor, color: textColor, ...style }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <Badge variant="outline" className="mb-3 text-xs bg-[#B89B7A] text-white border-[#B89B7A]">
          Etapa 1 - Quiz de Estilo Pessoal
        </Badge>

        {/* Title */}
        <h1
          className={cn(
            'text-lg md:text-xl font-bold mb-2 leading-tight cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40',
            isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50'
          )}
          onClick={onClick}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            'text-sm mb-3 opacity-80 leading-relaxed cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40',
            isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50'
          )}
          onClick={onClick}
        >
          {subtitle}
        </p>
      </div>

      {/* Description */}
      <p
        className={cn(
          'text-xs md:text-sm mb-4 opacity-75 text-center leading-relaxed cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40',
          isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50'
        )}
        onClick={onClick}
      >
        {description}
      </p>

      {/* Benefits List */}
      {benefits && benefits.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-xs">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Name Input */}
      {showNameInput && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={nameInputPlaceholder}
            style={{ borderColor: '#E5DDD5' }}
            disabled={disabled}
          />
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-auto">
        <Button
          className="w-full bg-[#B89B7A] hover:bg-[#aa6b5d] text-white text-sm"
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-3">
        <p className="text-xs opacity-60">⏱️ Leva apenas 5 minutos • 100% gratuito</p>
      </div>
    </div>
  );
};

export default QuizStartPageBlock;
