import React from 'react';
import { cn } from '../../../lib/utils';
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

const ResultPageHeaderBlock: React.FC<ResultPageHeaderBlockProps> = ({
  block,
  isSelected,
  isEditing,
  onClick,
  className
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
    textColor = '#432818'
  } = block.properties;

  return (
    <div
      className={cn(
        'w-full border-2 border-transparent transition-all duration-200 rounded-lg',
        isSelected && 'border-blue-500 shadow-lg',
        className
      )}
      onClick={onClick}
      style={{
        backgroundColor,
        color: textColor
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
          />
          {showProgress && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600">Progresso</span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
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
            <p className="text-sm text-gray-600">Olá,</p>
            <p className="text-lg font-semibold" style={{ color: textColor }}>
              {userName || 'Usuário'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Seu estilo é:</p>
            <p className="text-xl font-bold text-[#B89B7A]">
              {primaryStyle}
            </p>
          </div>
        </div>
      </div>

      {/* Editing Indicators */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Editando
        </div>
      )}
    </div>
  );
};

export default ResultPageHeaderBlock;
