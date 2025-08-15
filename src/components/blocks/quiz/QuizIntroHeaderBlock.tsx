// Remove unused React import
import { cn } from '@/lib/utils';

interface QuizIntroHeaderBlockProps {
  block?: any;
  properties?: {
    logoUrl?: string;
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
    progressValue?: number;
    progressMax?: number;
    showBackButton?: boolean;
    showProgress?: boolean;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Quiz Intro Header Block - Logo, progress bar, and back button
 */
export default function QuizIntroHeaderBlock({ 
  block, 
  properties = {},
  isSelected,
  onClick,
  ...rest 
}: QuizIntroHeaderBlockProps) {
  const {
    logoUrl = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt = 'Logo Gisele Galvão',
    logoWidth = 96,
    logoHeight = 96,
    progressValue = 0,
    progressMax = 100,
    showBackButton = false,
    showProgress = true,
  } = properties;

  const progressPercentage = progressMax > 0 ? (progressValue / progressMax) * 100 : 0;

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center p-6 space-y-4',
        isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2'
      )}
      onClick={onClick}
      {...rest}
    >
      {/* Logo */}
      <div className="flex justify-center">
        <img
          src={logoUrl}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="object-contain"
          style={{ maxWidth: `${logoWidth}px`, maxHeight: `${logoHeight}px` }}
        />
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-md">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            {Math.round(progressPercentage)}% concluído
          </div>
        </div>
      )}

      {/* Back Button */}
      {showBackButton && (
        <button 
          className="flex items-center space-x-2 text-[#432818] hover:text-[#B89B7A] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle back navigation
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Voltar</span>
        </button>
      )}
    </div>
  );
}