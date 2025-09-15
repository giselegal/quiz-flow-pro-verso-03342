/**
 * Utilitários para gerar imagens placeholder locais
 * DEPRECATED: Use imageCache.ts e useImageWithFallback.tsx para melhor performance
 * Este arquivo é mantido para compatibilidade com código legado
 */

/**
 * @deprecated Use imageCache.getOrCreatePlaceholder() instead
 */
export const generatePlaceholderSVG = (
  width: number = 300,
  height: number = 200,
  text: string = 'Imagem',
  backgroundColor: string = '#f1f5f9',
  textColor: string = '#64748b'
): string => {
  console.warn('generatePlaceholderSVG is deprecated. Use imageCache.getOrCreatePlaceholder() for better performance.');
  
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.min(width, height) / 10}"
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

/**
 * @deprecated Use imageCache placeholders for better performance
 */
export const PLACEHOLDERS = {
  LOGO_96: generatePlaceholderSVG(96, 96, 'Logo', '#e2e8f0', '#64748b'),
  LOGO_128: generatePlaceholderSVG(128, 128, 'Logo', '#e2e8f0', '#64748b'),
  IMAGE_300_200: generatePlaceholderSVG(300, 200, 'Imagem', '#f1f5f9', '#64748b'),
  IMAGE_400_300: generatePlaceholderSVG(400, 300, 'Imagem', '#f1f5f9', '#64748b'),
  QUIZ_ELEGANT: generatePlaceholderSVG(300, 200, 'Elegante', '#b89b7a', '#ffffff'),
  QUIZ_CASUAL: generatePlaceholderSVG(300, 200, 'Casual', '#432818', '#ffffff'),
  LOADING: generatePlaceholderSVG(400, 300, 'Carregando...', '#B89B7A', '#FFFFFF'),
  ERROR: generatePlaceholderSVG(400, 300, 'Erro ao carregar', '#EF4444', '#FFFFFF'),
};

/**
 * @deprecated Use useImageCache() hook instead
 */
export const usePlaceholder = () => {
  console.warn('usePlaceholder from placeholders.ts is deprecated. Use useImageCache() from imageCache.ts instead.');
  
  return {
    generateSVG: generatePlaceholderSVG,
    placeholders: PLACEHOLDERS,
  };
};

/**
 * @deprecated Use useImageWithFallback() hook for automatic replacement
 */
export const replacePlaceholderUrls = (url: string): string => {
  console.warn('replacePlaceholderUrls is deprecated. Use useImageWithFallback() hook for automatic fallback handling.');
  
  // Verifica se é uma URL de via.placeholder.com
  if (url.includes('via.placeholder.com')) {
    // Extrai dimensões se possível
    const match = url.match(/(\d+)x(\d+)/);
    if (match) {
      const width = parseInt(match[1]);
      const height = parseInt(match[2]);
      
      // Extrai texto se disponível
      const textMatch = url.match(/text=([^&]+)/);
      const text = textMatch ? decodeURIComponent(textMatch[1].replace(/\+/g, ' ')) : 'Imagem';
      
      // Extrai cores se disponível
      const colorMatch = url.match(/\/([a-fA-F0-9]{6})\/([a-fA-F0-9]{6})/);
      const backgroundColor = colorMatch ? `#${colorMatch[1]}` : '#f1f5f9';
      const textColor = colorMatch ? `#${colorMatch[2]}` : '#64748b';
      
      return generatePlaceholderSVG(width, height, text, backgroundColor, textColor);
    }
    
    // Fallback para placeholders comuns
    if (url.includes('96x96')) return PLACEHOLDERS.LOGO_96;
    if (url.includes('128x128')) return PLACEHOLDERS.LOGO_128;
    if (url.includes('300x200')) return PLACEHOLDERS.IMAGE_300_200;
    if (url.includes('400x300')) return PLACEHOLDERS.IMAGE_400_300;
  }
  
  return url;
};