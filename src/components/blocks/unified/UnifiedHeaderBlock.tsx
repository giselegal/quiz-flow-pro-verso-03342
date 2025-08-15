import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface UnifiedHeaderProps {
  variant?: string;
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  progressValue?: number;
  progressTotal?: number;
  progressMax?: number;
  showProgress?: boolean;
  showBackButton?: boolean;
  containerWidth?: string;
  spacing?: string;
  onBack?: () => void;
  // Extra props for compatibility
  [key: string]: any;
}

/**
 * UnifiedHeaderBlock - Componente unificado para todos os cabeçalhos
 * 
 * Consolida todos os tipos de cabeçalho em um único componente:
 * - quiz-intro-header
 * - quiz-result-header  
 * - offer-header
 * - vertical-canvas-header
 */
const UnifiedHeaderBlock: React.FC<UnifiedHeaderProps> = ({
  logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  logoAlt = 'Logo Gisele Galvão',
  logoWidth = 96,
  logoHeight = 96,
  progressValue = 0,
  progressTotal = 100,
  progressMax = 100,
  showProgress = true,
  showBackButton = false,
  containerWidth = 'full',
  spacing = 'small',
  onBack,
}) => {
  const containerClasses = `
    w-full flex flex-col items-center 
    ${containerWidth === 'full' ? 'max-w-full' : 'max-w-4xl mx-auto'}
    ${spacing === 'small' ? 'gap-4 p-4' : spacing === 'medium' ? 'gap-6 p-6' : 'gap-8 p-8'}
  `;

  const progressPercentage = Math.min((progressValue / (progressMax || progressTotal)) * 100, 100);

  return (
    <div className={containerClasses}>
      {/* Back Button */}
      {showBackButton && (
        <div className="w-full flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
        </div>
      )}

      {/* Logo */}
      <div className="flex justify-center">
        <img
          src={logoUrl}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="object-contain"
          style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
        />
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-md">
          <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#B89B7A] to-[#A67B5B] transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-stone-500">
            <span>{Math.round(progressPercentage)}%</span>
            <span>{progressValue}/{progressMax || progressTotal}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedHeaderBlock;