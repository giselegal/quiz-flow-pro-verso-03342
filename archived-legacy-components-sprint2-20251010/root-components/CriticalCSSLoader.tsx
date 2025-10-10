import React, { useEffect } from 'react';
import { injectCriticalCSS, removeCriticalCSS } from '@/utils/critical-css';

interface CriticalCSSLoaderProps {
  cssContent: string;
  id?: string;
  removeOnLoad?: boolean;
  removeDelay?: number;
}

/**
 * Componente que injeta CSS crítico para melhorar o First Contentful Paint
 * e o remove quando o conteúdo completo for carregado
 */
const CriticalCSSLoader: React.FC<CriticalCSSLoaderProps> = ({
  cssContent,
  id = 'critical-css',
  removeOnLoad = true,
  removeDelay = 1000,
}) => {
  useEffect(() => {
    // Injetar CSS crítico no carregamento do componente
    injectCriticalCSS(cssContent, id);

    // Configurar remoção do CSS crítico após carregamento completo
    if (removeOnLoad) {
      const handleLoad = () => {
        setTimeout(() => {
          removeCriticalCSS(id);
          console.log(`Critical CSS with ID "${id}" removed after page load`);
        }, removeDelay);
      };

      // Adicionar event listener para o evento 'load'
      window.addEventListener('load', handleLoad);

      // Cleanup
      return () => {
        window.removeEventListener('load', handleLoad);
        removeCriticalCSS(id);
      };
    }

    return () => {
      if (!removeOnLoad) {
        removeCriticalCSS(id);
      }
    };
  }, [cssContent, id, removeOnLoad, removeDelay]);

  // Este componente não renderiza nada no DOM
  return null;
};

export default CriticalCSSLoader;
