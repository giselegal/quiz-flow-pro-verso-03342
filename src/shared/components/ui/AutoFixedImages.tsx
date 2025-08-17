import React, { useEffect, useRef } from 'react';
import { fixBlurryIntroQuizImages } from '@/utils/fixBlurryIntroQuizImages';

interface AutoFixedImagesProps {
  children: React.ReactNode;
  fixOnMount?: boolean;
  fixOnUpdate?: boolean;
  className?: string;
  observeSelector?: string; // Novo: seletor específico para observar
}

/**
 * Componente wrapper que aplica correções de imagens borradas automaticamente
 * Versão otimizada para desempenho com observação seletiva de DOM
 */
const AutoFixedImages: React.FC<AutoFixedImagesProps> = ({
  children,
  fixOnMount = true,
  fixOnUpdate = true,
  className = '',
  observeSelector = '.quiz-intro, [data-section="intro"]', // Observar apenas elementos relevantes
}) => {
  // Ref para o elemento contêiner para limitação de escopo do MutationObserver
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce para evitar múltiplas chamadas
  const debounceTimeoutRef = useRef<number | null>(null);

  // Função de debounce otimizada
  const debouncedFix = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Usar requestIdleCallback se disponível
    if ('requestIdleCallback' in window) {
      debounceTimeoutRef.current = setTimeout(() => {
        // @ts-ignore
        window.requestIdleCallback(
          () => {
            fixBlurryIntroQuizImages();
            debounceTimeoutRef.current = null;
          },
          { timeout: 1000 }
        );
      }, 300) as unknown as number;
    } else {
      debounceTimeoutRef.current = setTimeout(() => {
        fixBlurryIntroQuizImages();
        debounceTimeoutRef.current = null;
      }, 500) as unknown as number;
    }
  };

  // Aplicar correção na montagem inicial - otimizada para não interferir com LCP
  useEffect(() => {
    if (fixOnMount) {
      // Detectar se o navegador suporta métricas de performance
      const supportsPerformanceObserver =
        'PerformanceObserver' in window &&
        PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint');

      if (supportsPerformanceObserver) {
        // Aguardar o LCP antes de executar otimizações
        const lcpObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            // Executar após o LCP
            requestAnimationFrame(() => {
              fixBlurryIntroQuizImages();
            });
            lcpObserver.disconnect();
          }
        });

        lcpObserver.observe({
          type: 'largest-contentful-paint',
          buffered: true,
        });
      } else {
        // Fallback otimizado usando requestIdleCallback
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(
            () => {
              fixBlurryIntroQuizImages();
            },
            { timeout: 2000 }
          );
        } else {
          // Fallback mais suave
          requestAnimationFrame(() => {
            setTimeout(fixBlurryIntroQuizImages, 300);
          });
        }
      }
    }
  }, [fixOnMount]);

  // Observar mudanças no DOM com escopo reduzido
  useEffect(() => {
    if (fixOnUpdate) {
      // Elementos a serem observados
      const elementsToObserve = document.querySelectorAll(observeSelector);

      if (elementsToObserve.length === 0) {
        return; // Nada para observar
      }

      // Configurar MutationObserver otimizado
      const observer = new MutationObserver(mutations => {
        // Verificar se alguma das mutações é relevante (adiciona imagens)
        const hasImageChanges = mutations.some(mutation =>
          Array.from(mutation.addedNodes).some(
            node =>
              node.nodeName === 'IMG' || (node instanceof Element && node.querySelector('img'))
          )
        );

        // Só processar se houver mudanças em imagens
        if (hasImageChanges) {
          debouncedFix();
        }
      });

      // Observar apenas os elementos específicos, não todo o body
      elementsToObserve.forEach(element => {
        observer.observe(element, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false,
        });
      });

      return () => observer.disconnect();
    }
  }, [fixOnUpdate, observeSelector]);

  // Limpar o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default React.memo(AutoFixedImages);
