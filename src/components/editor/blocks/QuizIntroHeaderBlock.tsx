import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { InlineEditText } from './InlineEditText';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizIntroHeaderBlockProps extends BlockComponentProps {
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

const QuizIntroHeaderBlock: React.FC<QuizIntroHeaderBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className
}) => {
  const { 
    logoUrl = 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
    logoAlt = 'Logo',
    progressValue = 7.14,
    progressMax = 100,
    showBackButton = true,
    logoWidth = 96,
    logoHeight = 96
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full p-4 rounded-lg border-2 border-dashed',
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
        'cursor-pointer hover:border-gray-400 transition-colors',
        className
      )}
      onClick={onClick}
    >
      {/* Header Content - Visual Only */}
      <div className="flex items-center justify-between mb-4">
        {/* Back Button */}
        {showBackButton && (
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Logo */}
        <div className="flex-1 flex justify-center relative group">
          <img 
            src={logoUrl}
            alt={logoAlt}
            style={{ 
              width: `${logoWidth}px`, 
              height: `${logoHeight}px` 
            }}
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/96x96?text=Logo';
            }}
          />
          {!disabled && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded flex flex-col items-center justify-center text-white text-xs">
              <InlineEditText
                value={logoUrl}
                onChange={(value) => handlePropertyChange('logoUrl', value)}
                placeholder="URL da logo"
                className="text-center text-white bg-transparent w-full px-2"
                disabled={disabled}
                as="div"
              />
              <InlineEditText
                value={logoAlt}
                onChange={(value) => handlePropertyChange('logoAlt', value)}
                placeholder="Alt da logo"
                className="text-center text-white bg-transparent w-full px-2 mt-1"
                disabled={disabled}
                as="div"
              />
            </div>
          )}
        </div>

        {/* Spacer for alignment */}
        <div className="w-9" />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[#B89B7A] to-[#8a7766] h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progressValue, progressMax)}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="text-center mt-2">
        <InlineEditText
          value={`${Math.round(progressValue)}% completo`}
          onChange={(value) => {
            const match = value.match(/(\d+)%/);
            if (match) {
              const numValue = parseInt(match[1]);
              if (!isNaN(numValue)) {
                handlePropertyChange('progressValue', numValue);
              }
            }
          }}
          placeholder="0% completo"
          className="text-sm text-gray-600"
          disabled={disabled}
          as="span"
        />
      </div>
    </div>
  );
};

export default QuizIntroHeaderBlock;