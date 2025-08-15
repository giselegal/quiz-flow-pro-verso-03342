'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Constantes de imagem otimizadas
const INTRO_IMAGE_BASE_URL = 'https://res.cloudinary.com/der8kogzu/image/upload/';
const INTRO_IMAGE_ID = 'v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb';

const STATIC_INTRO_IMAGE_URLS = {
  avif: `${INTRO_IMAGE_BASE_URL}f_avif,q_85,w_300,c_limit/${INTRO_IMAGE_ID}.avif`,
  webp: `${INTRO_IMAGE_BASE_URL}f_webp,q_85,w_300,c_limit/${INTRO_IMAGE_ID}.webp`,
  png: `${INTRO_IMAGE_BASE_URL}f_png,q_85,w_300,c_limit/${INTRO_IMAGE_ID}.png`,
};

interface OptimizedImageComponentProps {
  imageUrl?: string;
  customImageUrls?: {
    avif?: string;
    webp?: string;
    png?: string;
  };
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  borderRadius?: string;
  showShadow?: boolean;
  backgroundColor?: string;
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * OptimizedImageComponent - Componente modular para imagens otimizadas
 * 
 * Características:
 * - Suporte a múltiplos formatos (AVIF, WebP, PNG)
 * - Otimização de carregamento
 * - Configuração flexível de estilo
 * - Acessibilidade
 * - Totalmente editável
 */
const OptimizedImageComponent: React.FC<OptimizedImageComponentProps> = ({
  imageUrl,
  customImageUrls,
  alt = "Descubra seu estilo predominante e transforme seu guarda-roupa",
  width = 300,
  height = 204,
  aspectRatio = "1.47",
  borderRadius = "lg",
  showShadow = true,
  backgroundColor = "#F8F5F0",
  className = "",
  isEditable = false,
  onPropertyChange,
}) => {

  // Usar imagens customizadas ou padrão
  const imageUrls = customImageUrls || STATIC_INTRO_IMAGE_URLS;

  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'xl': return 'rounded-xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  const getShadowClass = () => {
    return showShadow ? 'shadow-sm' : '';
  };

  return (
    <div 
      className={cn(
        "mt-2 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto",
        isEditable && "border-2 border-dashed border-gray-300 hover:border-[#B89B7A] transition-colors p-2",
        className
      )}
      data-component="optimized-image"
    >
      {/* Container da imagem */}
      <div
        className={cn(
          "w-full overflow-hidden",
          getBorderRadiusClass(),
          getShadowClass()
        )}
        style={{ 
          aspectRatio: aspectRatio, 
          maxHeight: `${height}px` 
        }}
      >
        <div 
          className="relative w-full h-full"
          style={{ backgroundColor }}
        >
          <picture>
            {/* AVIF (melhor compressão) */}
            {imageUrls.avif && (
              <source
                srcSet={imageUrls.avif}
                type="image/avif"
              />
            )}
            
            {/* WebP (boa compressão) */}
            {imageUrls.webp && (
              <source
                srcSet={imageUrls.webp}
                type="image/webp"
              />
            )}
            
            {/* PNG/JPG (fallback) */}
            <img
              src={imageUrls.png || imageUrl || STATIC_INTRO_IMAGE_URLS.png}
              alt={alt}
              className="w-full h-full object-contain"
              width={width}
              height={height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              id="lcp-image"
            />
          </picture>
        </div>
      </div>

      {/* Painel de edição (se editável) */}
      {isEditable && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <strong>Imagem Otimizada:</strong> Suporte AVIF/WebP/PNG<br />
          <strong>Dimensões:</strong> {width}x{height} | Aspecto: {aspectRatio}
        </div>
      )}
    </div>
  );
};

export default OptimizedImageComponent;