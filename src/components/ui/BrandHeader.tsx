import React from 'react';
import Logo from './Logo';

interface BrandHeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({
  showBackButton = false,
  onBackClick,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBackClick && (
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <Logo variant="full" size="lg" />
          
          {title && (
            <div className="ml-4 border-l border-gray-200 pl-4">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            v2.1
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrandHeader;
