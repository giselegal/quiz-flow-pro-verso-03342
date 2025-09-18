/**
 * Utilidade para testar a função analyzeImageUrl
 *
 * Este arquivo demonstra como usar a função analyzeImageUrl para diagnosticar
 * problemas específicos com URLs de imagens do Cloudinary.
 *
 * Execução: Importe este arquivo em um componente temporário ou execute no console do navegador
 */
import { analyzeImageUrl } from '../ImageChecker';

// Exemplos de URLs para análise
const urlExamples = [
  // URL bem otimizada
  'https://res.cloudinary.com/company/image/upload/f_auto,q_80,w_1200/v1234567890/products/example1.jpg',

  // URL sem otimização
  'https://res.cloudinary.com/company/image/upload/products/example2.jpg',

  // URL com blur (placeholder)
  'https://res.cloudinary.com/company/image/upload/f_auto,q_50,w_80,e_blur:300/products/example3.jpg',

  // URL com formato PNG (potencialmente ineficiente)
  'https://res.cloudinary.com/company/image/upload/products/example4.png',

  // URL com qualidade muito alta
  'https://res.cloudinary.com/company/image/upload/f_auto,q_95,w_1800/products/example5.jpg',
];

/**
 * Analisa várias URLs de exemplo e mostra os resultados no console
 */
export const runImageUrlAnalysis = () => {
  console.group('🧪 Teste de Análise de URLs de Imagem');

  urlExamples.forEach((url, index) => {
    console.group(`Exemplo ${index + 1}`);
    const analysis = analyzeImageUrl(url);

    // Resumo para visualização rápida
    console.table({
      URL: url.substring(0, 50) + '...',
      'É Cloudinary': analysis.isCloudinary ? '✅' : '❌',
      Formato: analysis.format,
      Qualidade: analysis.quality,
      Largura: analysis.width,
      Transformações: analysis.transformations.length,
      Sugestões: analysis.suggestions.length,
    });

    console.groupEnd();
  });

  console.log('\n🔍 Como usar em produção:');
  console.log('import { analyzeImageUrl } from "../../utils/ImageChecker";');
  console.log('const imageUrl = "https://res.cloudinary.com/...";');
  console.log('const analysis = analyzeImageUrl(imageUrl);');
  console.log('console.log(analysis);');

  console.groupEnd();

  return 'Análise de URL de imagem concluída. Verifique o console para os resultados.';
};

// Descomente para executar a análise
// runImageUrlAnalysis();

export default {
  runImageUrlAnalysis,
};
