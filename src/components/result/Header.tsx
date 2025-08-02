
import React from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';

export interface HeaderProps {
  logo?: string;
  logoAlt?: string;
  logoHeight?: number;
  userName?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  logo = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  logoAlt = 'Logo Gisele Galvão',
  logoHeight = 60,
  userName = '',
  className = ''
}) => {
  return (
    <header className={`bg-white border-b border-gray-200 py-4 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <OptimizedImage
            src={logo}
            alt={logoAlt}
            width={120}
            height={logoHeight}
            className="h-auto"
            priority={true}
          />
        </div>
        
        {userName && (
          <div className="text-sm text-gray-600">
            Olá, {userName}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
