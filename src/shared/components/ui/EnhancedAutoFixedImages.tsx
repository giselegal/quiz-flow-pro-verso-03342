import React, { useEffect, useRef } from 'react';
import { fixBlurryImages } from '@/utils/enhancedFixBlurryImages';

interface AutoFixedImagesProps {
  children: React.ReactNode;
  fixOnMount?: boolean;
  fixOnUpdate?: boolean;
  className?: string;
}

/**
 * Componente wrapper que aplica correções de imagens borradas automaticamente
 * Versão aprimorada com escopo reduzido e melhor gerenciamento de performance
 */
const EnhancedAutoFixedImages: React.FC<AutoFixedImagesProps> = ({
  children,
  fixOnMount = true,
  fixOnUpdate = true,
  className = '',
}) => {
  // Referência para o elemento wrapper
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Aplicar correção na montagem inicial - com timing baseado em performance
  useEffect(() => {
    if (!fixOnMount) return;

    // Preparar para detectar quando o LCP realmente ocorreu usando PerformanceObserver
    let lcpOccurred = false;

    try {
      if (typeof PerformanceObserver !== 'undefined') {
        // Criar observer para LCP
        const lcpObserver = new PerformanceObserver(entries => {
          const lcpEntry = entries.getEntries().at(-1);
          if (lcpEntry) {
            lcpOccurred = true;
            console.log('LCP detectado:', lcpEntry.startTime);

            // Executar a correção um pouco depois do LCP
            if ('requestIdleCallback' in window) {
              // @ts-ignore
              window.requestIdleCallback(
                () => {
                  if (wrapperRef.current) {
                    console.log('Executando correção após LCP (via requestIdleCallback)');
                    fixBlurryImages(wrapperRef.current);
                  }
                },
                { timeout: 1000 }
              );
            } else {
              setTimeout(() => {
                if (wrapperRef.current) {
                  console.log('Executando correção após LCP (via setTimeout)');
                  fixBlurryImages(wrapperRef.current);
                }
              }, 800);
            }

            // Desconectar o observer após identificar o LCP
            lcpObserver.disconnect();
          }
        });

        // Observar eventos de LCP
        lcpObserver.observe({
          type: 'largest-contentful-paint',
          buffered: true,
        });

        // Fallback: Se após 3 segundos o LCP ainda não ocorreu, executar mesmo assim
        setTimeout(() => {
          if (!lcpOccurred && wrapperRef.current) {
            console.log('Fallback: Executando correção após timeout sem LCP detectado');
            fixBlurryImages(wrapperRef.current);
            lcpObserver.disconnect();
          }
        }, 3000);
      } else {
        // Fallback para navegadores sem suporte a PerformanceObserver
        setTimeout(() => {
          if (wrapperRef.current) {
            console.log(
              'Fallback: Executando correção após timeout (sem suporte a PerformanceObserver)'
            );
            fixBlurryImages(wrapperRef.current);
          }
        }, 2000);
      }
    } catch (error) {
      // Proteção contra erros em navegadores incompatíveis
      console.error('Erro ao configurar detecção de LCP:', error);
      setTimeout(() => {
        if (wrapperRef.current) {
          console.log('Executando correção após erro na detecção de LCP');
          fixBlurryImages(wrapperRef.current);
        }
      }, 2000);
    }
  }, [fixOnMount]);

  // Observar mudanças no DOM do wrapper (não todo o document.body)
  useEffect(() => {
    if (!fixOnUpdate || !wrapperRef.current) return;

    // Variáveis para gerenciar debounce
    let debounceTimer: number | null = null;
    let pendingCorrection = false;

    // Configurar MutationObserver de escopo limitado
    const observer = new MutationObserver(mutations => {
      // Verificar se alguma das mutações realmente adicionou imagens
      const hasNewImages = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          // Verificar se o nó adicionado é uma imagem ou contém imagens
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'IMG') return true;
            return element.querySelectorAll('img').length > 0;
          }
          return false;
        });
      });

      // Executar a correção apenas se foram adicionadas imagens
      if (hasNewImages && !pendingCorrection) {
        pendingCorrection = true;

        // Limpar timer anterior de debounce, se existir
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }

        // Debounce: Adiar a correção para evitar múltiplas execuções
        debounceTimer = window.setTimeout(() => {
          if ('requestIdleCallback' in window) {
            // @ts-ignore
            window.requestIdleCallback(
              () => {
                if (wrapperRef.current) {
                  console.log('Executando correção após mutações (via requestIdleCallback)');
                  fixBlurryImages(wrapperRef.current);
                  pendingCorrection = false;
                }
              },
              { timeout: 1000 }
            );
          } else {
            setTimeout(() => {
              if (wrapperRef.current) {
                console.log('Executando correção após mutações (via setTimeout)');
                fixBlurryImages(wrapperRef.current);
                pendingCorrection = false;
              }
            }, 500);
          }
        }, 800); // Debounce de 800ms
      }
    });

    // Observar apenas o wrapper e suas subárvores
    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    // Cleanup
    return () => {
      observer.disconnect();
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }
    };
  }, [fixOnUpdate]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default EnhancedAutoFixedImages;
