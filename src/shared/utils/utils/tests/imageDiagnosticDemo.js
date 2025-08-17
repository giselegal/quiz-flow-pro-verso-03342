/**
 * Script de demonstração para uso das ferramentas de diagnóstico de imagem
 *
 * Este arquivo mostra como utilizar todas as ferramentas de diagnóstico
 * de imagens implementadas para resolver problemas na introdução do Quiz Sell Genius.
 *
 * Execução:
 * 1. Importe este arquivo em um componente temporário
 * 2. Chame a função runDiagnosticDemo() no console
 */

import { analyzeImageUrl } from '../utils/ImageChecker';
import { imageCache } from '../utils/images/caching';
import { checkRenderedImages, generateImageReport } from '../utils/images/diagnostic';
import { runImageUrlAnalysis } from '../utils/tests/imageUrlAnalyzer';

/**
 * Executa uma demonstração completa do diagnóstico de imagens
 */
export const runDiagnosticDemo = () => {
  console.group('🔍 DEMONSTRAÇÃO DE DIAGNÓSTICO DE IMAGENS');
  console.log('Iniciando diagnóstico completo...');

  // 1. Verificar imagens renderizadas na página
  console.group('1️⃣ Verificação de Imagens Renderizadas');
  const renderedIssues = checkRenderedImages();
  console.log(`Encontrados ${renderedIssues.length} problemas em imagens renderizadas.`);
  console.groupEnd();

  // 2. Gerar relatório completo
  console.group('2️⃣ Relatório Completo');
  const report = generateImageReport();
  console.log('Relatório gerado:', report);
  console.groupEnd();

  // 3. Analisar o cache de imagens
  console.group('3️⃣ Análise do Cache de Imagens');
  const cachedImages = imageCache.getAll();
  console.log(`${Object.keys(cachedImages).length} imagens em cache.`);

  // Mostrar estatísticas de tamanho
  const totalSize = Object.values(cachedImages).reduce((sum, entry) => sum + (entry.size || 0), 0);
  console.log(`Tamanho total em cache: ${(totalSize / 1024).toFixed(2)} KB`);

  // Mostrar estatísticas de tempo de carregamento
  const loadTimes = Object.values(cachedImages)
    .filter(entry => entry.loadTime)
    .map(entry => entry.loadTime);

  if (loadTimes.length > 0) {
    const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    const maxLoadTime = Math.max(...loadTimes);
    console.log(`Tempo médio de carregamento: ${avgLoadTime.toFixed(2)}ms`);
    console.log(`Tempo máximo de carregamento: ${maxLoadTime}ms`);
  }
  console.groupEnd();

  // 4. Testar análise de URLs específicas
  console.group('4️⃣ Análise de URLs Específicas');

  // Obter algumas URLs de imagens da página para analisar
  const imgUrls = Array.from(document.querySelectorAll('img'))
    .map(img => img.src)
    .filter(src => src) // Filtrar URLs vazias
    .slice(0, 3); // Limitar a 3 exemplos

  if (imgUrls.length > 0) {
    imgUrls.forEach((url, i) => {
      console.group(`Imagem ${i + 1}: ${url.substring(0, 50)}...`);
      const analysis = analyzeImageUrl(url);
      console.log('Análise:', analysis);
      console.groupEnd();
    });
  } else {
    console.log('Nenhuma imagem encontrada na página para análise.');
  }
  console.groupEnd();

  // 5. Executar análise em lote com o imageUrlAnalyzer
  console.group('5️⃣ Análise em Lote (imageUrlAnalyzer)');
  runImageUrlAnalysis();
  console.groupEnd();

  // 6. Sugerir próximos passos
  console.group('6️⃣ Próximos Passos');
  console.log('Com base nos resultados acima, considere:');
  console.log('• Verificar URLs de imagens com problemas');
  console.log('• Comparar tempos de carregamento de diferentes imagens');
  console.log('• Identificar padrões de problemas recorrentes');
  console.log('• Testar em diferentes dispositivos e conexões');
  console.log('• Documentar resultados para referência futura');
  console.groupEnd();

  console.groupEnd();
  return 'Demonstração de diagnóstico de imagens concluída!';
};

// Função para analisar especificamente imagens da introdução
export const analyzeIntroImages = () => {
  console.group('🖼️ Análise de Imagens da Introdução');

  const introImages = Array.from(
    document.querySelectorAll('.quiz-intro img, [data-section="intro"] img')
  );
  console.log(`Encontradas ${introImages.length} imagens na introdução.`);

  if (introImages.length > 0) {
    introImages.forEach((img, i) => {
      console.group(`Imagem da Introdução ${i + 1}`);
      console.log('Elemento:', img);
      console.log('URL:', img.src);
      console.log('Tamanho renderizado:', `${img.width}x${img.height}px`);
      console.log('Tamanho natural:', `${img.naturalWidth}x${img.naturalHeight}px`);

      // Analisar a URL
      const analysis = analyzeImageUrl(img.src);
      console.log('Análise da URL:', analysis);

      // Verificar se está no cache
      const cacheEntry = imageCache.get(img.src);
      if (cacheEntry) {
        console.log('Informações do cache:', cacheEntry);
      } else {
        console.warn('Imagem não encontrada no cache!');
      }

      console.groupEnd();
    });
  }

  console.groupEnd();
  return 'Análise de imagens da introdução concluída!';
};

export default {
  runDiagnosticDemo,
  analyzeIntroImages,
};
