
import { cn } from '@/lib/utils';
import { safePlaceholder } from '@/utils/placeholder';
// import { Progress } from '@/components/ui/progress';

interface ResultPageHeaderBlockProps {
  block: {
    id: string;
    type: string;
    properties: {
      logoUrl?: string;
      logoAlt?: string;
      logoHeight?: string;
      userName?: string;
      primaryStyle?: string;
      showProgress?: boolean;
      progressValue?: number;
      backgroundColor?: string;
      textColor?: string;
    };
  };
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
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

const ResultPageHeaderBlock: React.FC<ResultPageHeaderBlockProps> = ({
  block,
  isSelected,
  isEditing,
  onClick,
  className,
}) => {
  const {
    logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt = 'Logo Gisele Galvão',
    logoHeight = '60px',
    userName = 'Seu Nome',
    primaryStyle = 'Elegante',
    showProgress = true,
    progressValue = 100,
    backgroundColor = '#ffffff',
    textColor = '#432818',
  } = block?.properties || {};

  return (
    <div
      className={cn(
        'w-full border-2 border-transparent transition-all duration-200 rounded-lg',
        isSelected && 'border-[#B89B7A] shadow-lg',
        className,
        // Margens universais com controles deslizantes
        getMarginClass((marginTop as number | string) ?? 0, 'top'),
        getMarginClass((marginBottom as number | string) ?? 0, 'bottom'),
        getMarginClass((marginLeft as number | string) ?? 0, 'left'),
        getMarginClass((marginRight as number | string) ?? 0, 'right')
      )}
      onClick={onClick}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {/* Header Container - Horizontal Layout */}
      <div className="flex items-center justify-between p-6 bg-white shadow-sm rounded-lg">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img
            src={logoUrl}
            alt={logoAlt}
            style={{ height: logoHeight }}
            className="object-contain"
            onError={e => {
              try {
                const h = parseInt(String(logoHeight), 10) || 60;
                (e.currentTarget as HTMLImageElement).src = safePlaceholder(h * 2, h, 'Logo');
              } catch { }
            }}
          />
          {showProgress && (
            <div className="flex items-center space-x-3">
              <span style={{ color: '#6B4F43' }}>Progresso</span>
              <div style={{ backgroundColor: '#E5DDD5' }}>
                <div
                  className="h-2 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
              <span className="text-sm font-bold text-[#aa6b5d]">{progressValue}%</span>
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p style={{ color: '#6B4F43' }}>Olá,</p>
            <p className="text-lg font-semibold" style={{ color: textColor }}>
              {userName || 'Usuário'}
            </p>
          </div>
          <div className="text-right">
            <p style={{ color: '#6B4F43' }}>Seu estilo é:</p>
            <p className="text-xl font-bold text-[#B89B7A]">{primaryStyle}</p>
          </div>
        </div>
      </div>

      {/* Editing Indicators */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-[#B89B7A]/100 text-white px-2 py-1 rounded text-xs">
          Editando
        </div>
      )}
    </div>
  );
};

export default ResultPageHeaderBlock;
