// @ts-nocheck
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface VerticalCanvasHeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  progressValue?: number;
  progressMax?: number;
  showProgress?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  containerWidth?: string;
  gap?: string;
  className?: string;
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

const VerticalCanvasHeaderBlock: React.FC<VerticalCanvasHeaderProps> = ({
  logoSrc = '',
  logoAlt = 'Logo',
  logoWidth = 120,
  logoHeight = 40,
  progressValue = 0,
  progressMax = 100,
  showProgress = true,
  showBackButton = false,
  onBackClick = () => {},
  containerWidth = '100%',
  gap = '1rem',
  className = '',
}) => {
  const progressPercentage = progressMax > 0 ? (progressValue / progressMax) * 100 : 0;

  return (
    <header
      className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}
      style={{ width: containerWidth }}
    >
      <div className="flex items-center justify-between" style={{ gap }}>
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={onBackClick} className="p-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="object-contain"
            />
          ) : (
            <div style={{ color: '#8B7355', width: logoWidth, height: logoHeight }}>
              Logo
            </div>
          )}
        </div>

        {/* Progress Section */}
        {showProgress && (
          <div className="flex-1 max-w-md mx-4">
            <div style={{ color: '#6B4F43' }}>
              <span>Progresso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>
    </header>
  );
};

export default VerticalCanvasHeaderBlock;
