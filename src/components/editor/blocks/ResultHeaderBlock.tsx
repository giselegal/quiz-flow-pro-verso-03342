// @ts-nocheck
import type { BlockComponentProps } from '../../../types/blocks';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface ResultHeaderBlockProps {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  showLogo?: boolean;
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

const ResultHeaderBlock: React.FC<ResultHeaderBlockProps> = ({
  title = 'Parabéns!',
  subtitle = 'Seu Estilo Pessoal foi Revelado',
  logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  showLogo = true,
  className,
}) => {
  const { user } = useAuth();
  const userName = (user as any)?.userName || localStorage.getItem('userName') || '';

  return (
    <div
      className={cn(
        'text-center py-8 bg-gradient-to-b from-[#faf8f5] to-transparent',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="max-w-4xl mx-auto px-4">
        {showLogo && (
          <div className="mb-6">
            <img
              src={logoUrl}
              alt="Gisele Galvão - Consultoria de Imagem"
              className="h-16 md:h-20 mx-auto object-contain"
              loading="eager"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-[#aa6b5d] mb-2">
          {title} {userName && <span className="text-[#B89B7A]">{userName}!</span>}
        </h1>

        <p className="text-lg text-[#432818] mb-4">{subtitle}</p>

        <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default ResultHeaderBlock;
