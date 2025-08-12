/**
 * FixedResultImage - Componente otimizado para imagens de resultados
 *
 * Este componente foi criado para resolver o problema de imagens embaçadas
 * na página de resultados. Similar ao FixedIntroImage, mas com configurações
 * específicas para as imagens de resultado.
 */
import React, { useState } from 'react';

interface FixedResultImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

/**
 * Transforma qualquer URL do Cloudinary em uma versão de alta qualidade
 */
function getHighQualityUrl(url: string): string {
  if (!url) return url;

  // Se não for Cloudinary, retornar sem alterações
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Dividir a URL para trabalhar com ela
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const baseUrl = parts[0] + '/upload/';
  let pathAndQuery = parts[1];

  // Remover qualquer parâmetro de blur existente
  pathAndQuery = pathAndQuery.replace(/[,/]e_blur:[0-9]+/g, '');

  // Detectar versão na URL (v12345678)
  const versionMatch = pathAndQuery.match(/^(v\d+)\//);
  let version = '';
  let finalPath = pathAndQuery;

  if (versionMatch) {
    version = versionMatch[1] + '/';
    finalPath = pathAndQuery.substring(version.length);
  }

  // Parâmetros de alta qualidade para imagens de resultado
  const transforms = [
    'f_auto', // Formato automático (webp/avif)
    'q_85', // Qualidade boa (85%) - equilíbrio entre qualidade e performance
    'dpr_auto', // Densidade de pixel automática
    'e_sharpen:40', // Nitidez leve para melhorar qualidade visual
  ].join(',');

  // Montar URL final com alta qualidade
  return `${baseUrl}${version}${transforms}/${finalPath}`;
}

/**
 * Componente de imagem de alta qualidade para página de resultados
 */
const FixedResultImage: React.FC<FixedResultImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  priority = false,
  objectFit = 'cover',
  onLoad,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Obter URL de alta qualidade
  const highQualitySrc = getHighQualityUrl(src);

  // Calcular a proporção para o estilo
  const aspectRatio = height / width;
  const paddingBottom = `${aspectRatio * 100}%`;

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`} style={{ paddingBottom }}>
      <img
        src={highQualitySrc}
        alt={alt}
        width={width}
        height={height}
        className={`absolute inset-0 w-full h-full object-${objectFit} transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchpriority: 'high' } : { fetchpriority: 'auto' })}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default FixedResultImage;
