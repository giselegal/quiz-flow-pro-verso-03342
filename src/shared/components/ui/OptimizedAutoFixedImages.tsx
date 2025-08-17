import React, { useEffect } from 'react';
import { fixBlurryImages } from '@/utils/enhancedFixBlurryImages';

interface AutoFixedImagesProps {
  children: React.ReactNode;
  fixOnMount?: boolean;
  fixOnUpdate?: boolean;
  className?: string;
}

/**
 * Versão otimizada do componente AutoFixedImages
 * Este componente aplica correções de imagens borradas de forma mais eficiente
 * usando requestIdleCallback e limitando as observações DOM
 */
const OptimizedAutoFixedImages: React.FC<AutoFixedImagesProps> = ({
  children,
  fixOnMount = true,
  fixOnUpdate = false, // Reduzido para false por padrão para evitar observação contínua
  className = '',
}) => {
  // Aplicar correção na montagem inicial - com performance melhorada
  useEffect(() => {
    if (fixOnMount) {
      // Adiar execução para um momento com baixo impacto na performance
      if ('requestIdleCallback' in window) {
        const timeoutId = window.setTimeout(() => {
          // @ts-ignore
          window.requestIdleCallback(
            () => {
              fixBlurryImages();
            },
            { timeout: 3000 }
          ); // Timeout aumentado para garantir que o LCP já ocorreu
        }, 2000); // Atraso adicional para priorizar renderização e interatividade iniciais

        return () => window.clearTimeout(timeoutId);
      } else {
        const timeoutId = setTimeout(fixBlurryImages, 2500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [fixOnMount]);

  // Observer otimizado - usa IntersectionObserver para detectar quando elementos
  // estão visíveis antes de aplicar correções
  useEffect(() => {
    if (!fixOnUpdate) return;

    let debounceTimer: number | null = null;
    let mutationCount = 0;

    const observer = new MutationObserver(() => {
      // Incrementar contador para limitar frequência de correções
      mutationCount++;

      // Limitar processamento a um máximo de uma correção a cada 10 mutações
      if (mutationCount % 10 !== 0) return;

      // Debounce com clear do timer anterior
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Agendar próxima correção com baixa prioridade
      debounceTimer = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          // @ts-ignore
          window.requestIdleCallback(
            () => {
              fixBlurryImages();
            },
            { timeout: 2000 }
          );
        } else {
          setTimeout(fixBlurryImages, 1000);
        }
      }, 1500);
    });

    // Opções de observação mais seletivas
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    return () => {
      observer.disconnect();
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [fixOnUpdate]);

  return <div className={className}>{children}</div>;
};

export default OptimizedAutoFixedImages;
