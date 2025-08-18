// @ts-nocheck
import { cn } from '@/lib/utils';

/**
 * StartButtonBlock - Botão de início isolado para uso no editor visual
 *
 * Props editáveis via editor visual:
 * - text: string - Texto do botão
 * - icon: string - Ícone do botão (classe CSS ou nome)
 * - disabled: boolean - Se o botão está desabilitado
 * - loading: boolean - Se está mostrando loading
 * - size: 'sm' | 'md' | 'lg' - Tamanho do botão
 * - variant: 'primary' | 'secondary' | 'outline' - Estilo do botão
 * - fullWidth: boolean - Se o botão ocupa toda a largura
 * - colors: object - Paleta de cores customizável
 * - onClick: function - Callback ao clicar
 *
 * @example
 * <StartButtonBlock
 *   blockId="start-button-main"
 *   text="Começar Quiz Agora!"
 *   size="lg"
 *   fullWidth={true}
 *   onClick={() => console.log('Quiz iniciado')}
 * />
 */

export interface StartButtonBlockProps {
  // Identificação
  blockId: string;
  className?: string;
  style?: React.CSSProperties;

  // Conteúdo editável
  text?: string;
  icon?: string;
  loadingText?: string;

  // Estados
  disabled?: boolean;
  loading?: boolean;

  // Estilo
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  alignment?: 'left' | 'center' | 'right';

  // Cores customizáveis
  colors?: {
    primary?: string;
    primaryDark?: string;
    text?: string;
    background?: string;
    border?: string;
  };

  // Funcionalidade
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self';

  // Animações
  enableHoverEffect?: boolean;
  enablePulseEffect?: boolean;
}

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

const StartButtonBlock: React.FC<StartButtonBlockProps> = ({
  blockId = 'start-button-block',
  className = '',
  style = {},

  // Conteúdo padrão
  text = 'Começar Quiz',
  icon = '',
  loadingText = 'Carregando...',

  // Estados
  disabled = false,
  loading = false,

  // Estilo
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  alignment = 'center',

  // Cores padrão (iguais ao tema original)
  colors = {
    primary: '#B89B7A',
    primaryDark: '#A1835D',
    text: '#FFFFFF',
    background: '#FEFEFE',
    border: '#B89B7A',
  },

  // Funcionalidade
  onClick,
  href,
  target = '_self',

  // Animações
  enableHoverEffect = true,
  enablePulseEffect = false,
}) => {
  // Classes de tamanho
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  // Classes de alinhamento do container
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Classes base do botão
  const baseClasses = cn(
    'font-semibold rounded-md shadow-md transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'inline-flex items-center justify-center gap-2',
    sizeClasses[size],
    fullWidth ? 'w-full' : 'w-auto',
    disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    enableHoverEffect && !disabled && !loading
      ? 'hover:shadow-lg transform hover:scale-[1.02]'
      : '',
    enablePulseEffect && !disabled && !loading ? 'animate-pulse' : '',
    className
  );

  // Estilos do botão baseados na variante
  const getButtonStyles = () => {
    const baseStyle = {
      focusRingColor: colors.primary,
      focusRingOffsetColor: colors.background,
      ...style,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.background,
          color: colors.primary,
          borderColor: colors.border,
          border: `2px solid ${colors.border}`,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: colors.primary,
          borderColor: colors.border,
          border: `2px solid ${colors.border}`,
        };
      default: // primary
        return {
          ...baseStyle,
          backgroundColor: disabled || loading ? `${colors.primary}80` : colors.primary,
          color: colors.text,
          border: 'none',
        };
    }
  };

  // Handlers de eventos
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick();
    }

    // Web Vitals reporting
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark('button-interaction');
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'primary' && enableHoverEffect && !disabled && !loading && colors.primaryDark) {
      e.currentTarget.style.backgroundColor = colors.primaryDark;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'primary' && enableHoverEffect && !disabled && !loading && colors.primary) {
      e.currentTarget.style.backgroundColor = colors.primary;
    }
  };

  // Conteúdo do botão
  const buttonContent = (
    <>
      {icon && !loading && (
        <span className="flex-shrink-0">
          {/* Aqui você pode renderizar ícones baseados em bibliotecas como Lucide, Heroicons, etc */}
          <span className={icon} />
        </span>
      )}
      {loading && (
        <span className="flex-shrink-0">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      <span className="flex-grow">{loading ? loadingText : text}</span>
    </>
  );

  // Container wrapper
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div
      className={alignmentClasses[alignment]}
      data-block-id={blockId}
      data-component-type="StartButtonBlock"
    >
      {children}
    </div>
  );

  // Se for um link, renderizar como anchor
  if (href && !disabled && !loading) {
    return (
      <Container>
        <a
          href={href}
          target={target}
          className={baseClasses}
          style={getButtonStyles()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          aria-disabled={disabled || loading}
        >
          {buttonContent}
        </a>
      </Container>
    );
  }

  // Caso contrário, renderizar como botão
  return (
    <Container>
      <button
        type="button"
        className={baseClasses}
        style={getButtonStyles()}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
      >
        {buttonContent}
      </button>
    </Container>
  );
};

export default StartButtonBlock;
