/**
 * @file ImageChecker.js
 *
 * Utilitário para verificar o status das imagens utilizadas na aplicação
 * Ajuda a diagnosticar problemas de performance e qualidade de imagem
 */

import { getImageCache } from '../utils/images/caching';
import { getAllImages } from '../data/imageBank';
import { optimizeCloudinaryUrl } from '../utils/images/optimization';

/**
 * Verifica e apresenta ao console informações sobre as imagens carregadas
 * Útil para debug de problemas de carregamento e qualidade de imagem
 */
export const checkImageStatus = () => {
  console.group('📊 Status das Imagens');

  // Estatísticas do cache
  const cache = getImageCache();
  const cacheSize = Object.keys(cache).length;
  console.log(`📦 Total no Cache: ${cacheSize} imagens`);

  // Contadores
  let loaded = 0;
  let loading = 0;
  let error = 0;
  let noStatus = 0;
  let withLowQuality = 0;

  // Verificar cada entrada no cache
  Object.entries(cache).forEach(([key, data]) => {
    if (data.loadStatus === 'loaded') loaded++;
    else if (data.loadStatus === 'loading') loading++;
    else if (data.loadStatus === 'error') error++;
    else noStatus++;

    if (data.lowQualityUrl) withLowQuality++;
  });

  // Exibir estatísticas
  console.log(`✅ Carregadas: ${loaded}`);
  console.log(`⏳ Carregando: ${loading}`);
  console.log(`❌ Erros: ${error}`);
  console.log(`❓ Sem status: ${noStatus}`);
  console.log(`🔍 Com placeholders: ${withLowQuality}`);

  // Verificar problemas comuns
  if (error > 0) {
    console.warn(`⚠️ ${error} imagens falharam ao carregar. Verifique os console.error acima.`);
  }

  if (withLowQuality < cacheSize * 0.8 && cacheSize > 5) {
    console.warn(
      `⚠️ Apenas ${withLowQuality} de ${cacheSize} imagens têm placeholders de baixa qualidade.`
    );
  }

  // Verificar imagens do banco
  const bankImages = getAllImages();
  console.log(`📚 Total no ImageBank: ${bankImages.length} imagens`);

  const uncachedImages = bankImages.filter(img => {
    const optimizedUrl = optimizeCloudinaryUrl(img.src, {
      quality: 85,
      format: 'auto',
    });
    return !getImageCache().hasOwnProperty(optimizedUrl);
  });

  if (uncachedImages.length > 0) {
    console.warn(`⚠️ ${uncachedImages.length} imagens no banco de dados não estão em cache.`);
    if (uncachedImages.length < 10) {
      console.log(
        'Imagens não cacheadas:',
        uncachedImages.map(img => img.id)
      );
    }
  }

  console.groupEnd();

  return {
    cacheSize,
    loaded,
    loading,
    error,
    noStatus,
    withLowQuality,
    uncachedCount: uncachedImages.length,
  };
};

/**
 * Verifica a estrutura e qualidade das imagens na página de introdução
 */
export const checkIntroImages = () => {
  console.group('🖼️ Verificação de Imagens da Introdução');

  // Encontrar elementos de imagem no DOM
  const allImages = document.querySelectorAll('img');
  console.log(`🔍 Total de imagens no DOM: ${allImages.length}`);

  // Verificar cada imagem
  let blurryImages = 0;
  let missingDimensions = 0;
  let notOptimized = 0;

  allImages.forEach((img, index) => {
    // Verificar dimensões
    if (!img.width || !img.height || img.width === 0 || img.height === 0) {
      missingDimensions++;
      console.warn(`⚠️ Imagem #${index} não tem dimensões definidas:`, img.src);
    }

    // Verificar otimização (apenas para Cloudinary)
    if (
      img.src.includes('cloudinary.com') &&
      !img.src.includes('f_auto') &&
      !img.src.includes('q_auto')
    ) {
      notOptimized++;
      console.warn(`⚠️ Imagem Cloudinary não otimizada:`, img.src);
    }

    // Verificar placeholders/blur
    const style = window.getComputedStyle(img);
    if (style.filter && style.filter.includes('blur') && img.complete) {
      blurryImages++;
      console.warn(`⚠️ Imagem #${index} parece estar embaçada:`, img.src);
    }
  });

  console.log(`👍 Status:
    - Imagens sem dimensões: ${missingDimensions}
    - Imagens não otimizadas: ${notOptimized}
    - Imagens possivelmente embaçadas: ${blurryImages}
  `);

  if (missingDimensions === 0 && notOptimized === 0 && blurryImages === 0) {
    console.log('✅ Todas as imagens parecem estar configuradas corretamente!');
  }

  console.groupEnd();

  return {
    totalImages: allImages.length,
    blurryImages,
    missingDimensions,
    notOptimized,
  };
};

/**
 * Analisa uma URL de imagem do Cloudinary para extrair informações e diagnosticar problemas
 * @param {string} url - URL da imagem para análise
 * @returns {Object} Objeto com informações detalhadas sobre a URL da imagem
 */
export const analyzeImageUrl = url => {
  if (!url) {
    return {
      isValid: false,
      error: 'URL não fornecida',
    };
  }

  console.group('🔍 Análise de URL de Imagem');
  console.log(`URL Original: ${url}`);

  // Verificar se é uma URL do Cloudinary
  const isCloudinary = url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  if (!isCloudinary) {
    console.warn('⚠️ Esta não é uma URL do Cloudinary. A análise pode ser limitada.');
  }

  // Informações básicas
  const info = {
    isValid: true,
    isCloudinary,
    originalUrl: url,
    hasOptimization: false,
    format: 'desconhecido',
    quality: 'desconhecido',
    width: 'não especificado',
    height: 'não especificado',
    transformations: [],
    version: null,
    suggestions: [],
  };

  // Analisar partes da URL
  try {
    // Extrair formato
    if (url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)/i)) {
      info.format = url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)/i)[1].toLowerCase();
    }

    // Verificar versões (v1234567890)
    const versionMatch = url.match(/\/v\d+\//);
    if (versionMatch) {
      info.version = versionMatch[0].replace(/\//g, '');
    }

    if (isCloudinary) {
      // Extrair parâmetros de transformação
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex > 0) {
        const pathAfterUpload = url.substring(uploadIndex + 8);
        const transformationPart = pathAfterUpload.substring(0, pathAfterUpload.indexOf('/'));

        if (transformationPart) {
          const params = transformationPart.split(',');
          info.transformations = params;

          // Analisar parâmetros específicos
          params.forEach(param => {
            if (param.startsWith('f_')) {
              info.format = param.substring(2);
              info.hasOptimization = true;
            }
            if (param.startsWith('q_')) {
              info.quality = param.substring(2);
              info.hasOptimization = true;
            }
            if (param.startsWith('w_')) {
              info.width = param.substring(2);
              info.hasOptimization = true;
            }
            if (param.startsWith('h_')) {
              info.height = param.substring(2);
              info.hasOptimization = true;
            }
            if (param.startsWith('e_')) {
              // Efeitos como blur
              info.transformations.push(param);
            }
          });
        }
      }
    }

    // Gerar sugestões
    if (isCloudinary) {
      if (!info.hasOptimization) {
        info.suggestions.push('Adicionar parâmetros de otimização (f_auto,q_auto)');
      }

      if (!info.width && !info.height) {
        info.suggestions.push(
          'Especificar largura e/ou altura para evitar servir imagens muito grandes'
        );
      }

      if (info.format === 'png' && !url.includes('transparent')) {
        info.suggestions.push(
          'Considerar usar formato WEBP ou AVIF em vez de PNG para melhor compressão'
        );
      }

      if (info.quality && parseInt(info.quality) > 85 && info.quality !== 'auto') {
        info.suggestions.push(
          'Considerar reduzir a qualidade para 80-85 para melhorar o desempenho sem perda visual perceptível'
        );
      }
    }
  } catch (error) {
    console.error('Erro ao analisar URL:', error);
    info.error = error.message;
  }

  // Exibir resultados da análise
  console.log(`📊 Análise Completa:`, info);

  if (info.suggestions.length > 0) {
    console.log('💡 Sugestões de Otimização:');
    info.suggestions.forEach((sugestão, i) => {
      console.log(`  ${i + 1}. ${sugestão}`);
    });
  } else if (info.hasOptimization) {
    console.log('✅ URL parece estar bem otimizada!');
  }

  console.groupEnd();
  return info;
};

export default {
  checkImageStatus,
  checkIntroImages,
  analyzeImageUrl,
};
