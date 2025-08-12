import React, { useEffect, useState } from 'react';

// Tipos para o monitoramento de desempenho
interface PerformanceMetrics {
  quizCompletionTime: number | null;
  resultPageLoadTime: number | null;
  preloadedImages: boolean;
  totalLoadTime: number | null;
  preloadBenefit: number | null;
}

/**
 * Componente invisível que monitora e registra métricas de desempenho
 * relacionadas ao carregamento da página de resultados após o quiz.
 */
const PerformanceMonitor: React.FC = () => {
  const [, setMetrics] = useState<PerformanceMetrics>({
    quizCompletionTime: null,
    resultPageLoadTime: null,
    preloadedImages: false,
    totalLoadTime: null,
    preloadBenefit: null,
  });

  useEffect(() => {
    // Evita execução durante SSR
    if (typeof window === 'undefined') return;

    // Inicializa o timestamp de carregamento da página
    const pageLoadTime = Date.now();

    // Verifica se há informações sobre pré-carregamento
    const preloadedResults = localStorage.getItem('preloadedResults') === 'true';
    const quizCompletedAt = parseInt(localStorage.getItem('quizCompletedAt') || '0', 10);

    // Aguarda até que a página esteja completamente carregada para coletar métricas
    window.addEventListener('load', () => {
      const loadCompleteTime = Date.now();
      const resultPageLoadTime = loadCompleteTime - pageLoadTime;

      // Cálculo de métricas adicionais
      const quizToResultTime = quizCompletedAt ? pageLoadTime - quizCompletedAt : null;
      const totalLoadTime = quizCompletedAt ? loadCompleteTime - quizCompletedAt : null;

      // Benefício estimado do pré-carregamento (baseado em dados históricos)
      const avgLoadTimeWithoutPreload = 3200; // ms
      const preloadBenefit =
        preloadedResults && totalLoadTime
          ? Math.round(
              ((avgLoadTimeWithoutPreload - totalLoadTime) / avgLoadTimeWithoutPreload) * 100
            )
          : null;

      // Atualiza as métricas
      setMetrics({
        quizCompletionTime: quizToResultTime,
        resultPageLoadTime,
        preloadedImages: preloadedResults,
        totalLoadTime,
        preloadBenefit,
      });

      // Registra em analytics (simulado com console.log)
      console.log('===== MÉTRICAS DE DESEMPENHO =====');
      console.log(`Pré-carregamento ativo: ${preloadedResults ? 'Sim' : 'Não'}`);
      console.log(`Tempo de carregamento da página: ${resultPageLoadTime}ms`);
      console.log(`Tempo total (fim do quiz até carregamento): ${totalLoadTime}ms`);
      if (preloadBenefit) {
        console.log(`Benefício estimado do pré-carregamento: ${preloadBenefit}%`);
      }
      console.log('===============================');

      // Limpa os dados de timestamp para não afetar futuras visitas
      localStorage.removeItem('quizCompletedAt');
    });
  }, []);

  // Componente não renderiza nada visível
  return null;
};

export default PerformanceMonitor;
