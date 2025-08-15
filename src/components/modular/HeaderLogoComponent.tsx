'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Constantes de imagem otimizadas (usando URLs do template original)
const LOGO_BASE_URL = 'https://res.cloudinary.com/der8kogzu/image/upload/';
const LOGO_IMAGE_ID = 'v1752430327/LOGO_DA_MARCA_GISELE_l78gin';

const STATIC_LOGO_IMAGE_URLS = {
  webp: `${LOGO_BASE_URL}f_webp,q_70,w_120,h_50,c_fit/${LOGO_IMAGE_ID}.webp`,
  png: `${LOGO_BASE_URL}f_png,q_70,w_120,h_50,c_fit/${LOGO_IMAGE_ID}.png`,
};

interface HeaderLogoComponentProps {
  logoWidth?: number;
  logoHeight?: number;
  showGoldenBar?: boolean;
  goldenBarWidth?: string;
  alt?: string;
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * HeaderLogoComponent - Componente modular para logo com barra dourada
 * 
 * Características:
 * - Imagem otimizada com WebP/PNG fallback
 * - Barra dourada configurável
 * - Totalmente editável via propriedades
 * - Acessibilidade integrada
 */
const HeaderLogoComponent: React.FC<HeaderLogoComponentProps> = ({
  logoWidth = 120,
  logoHeight = 50,
  showGoldenBar = true,
  goldenBarWidth = "300px",
  alt = "Logo Gisele Galvão",
  className = "",
  isEditable = false,
  onPropertyChange: _onPropertyChange,
}) => {
  
  // Property change handler for future use
  // const _handlePropertyChange = (key: string, value: any) => {
  //   if (onPropertyChange) {
  //     onPropertyChange(key, value);
  //   }
  // };

  return (
    <header 
      className={cn(
        "w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto",
        isEditable && "border-2 border-dashed border-gray-300 hover:border-[#B89B7A] transition-colors",
        className
      )}
      data-component="header-logo"
    >
      {/* Logo centralizado - renderização imediata */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <picture>
            <source srcSet={STATIC_LOGO_IMAGE_URLS.webp} type="image/webp" />
            <img
              src={STATIC_LOGO_IMAGE_URLS.png}
              alt={alt}
              className="h-auto mx-auto"
              width={logoWidth}
              height={logoHeight}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                aspectRatio: `${logoWidth} / ${logoHeight}`,
              }}
            />
          </picture>
          
          {/* Barra dourada configurável */}
          {showGoldenBar && (
            <div
              className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5"
              style={{
                width: goldenBarWidth,
                maxWidth: '90%',
                margin: '0 auto',
              }}
            />
          )}
        </div>
      </div>

      {/* Painel de edição (se editável) */}
      {isEditable && (
        <div className="p-2 bg-gray-50 rounded text-xs">
          <strong>Logo + Barra:</strong> Editável via painel
        </div>
      )}
    </header>
  );
};

export default HeaderLogoComponent;