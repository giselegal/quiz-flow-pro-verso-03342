/**
 * Utilitário para remover e substituir imagens embaçadas no Quiz Sell Genius
 * Esse arquivo fornece ferramentas para lidar especificamente com o problema
 * das imagens embaçadas na introdução do quiz.
 */

// URLs de alta qualidade para substituir as imagens embaçadas
// Adicione aqui URLs de imagens de alta qualidade que podem substituir as embaçadas
const HIGH_QUALITY_IMAGES = {
  // Mapeie os paths para URLs de alta qualidade
  // Exemplo: 'path/to/blurry.jpg': 'https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_90/path/to/sharp.jpg'
};

/**
 * Verifica se uma URL de imagem contém parâmetros de blur ou qualidade baixa
 * @param {string} url URL a ser verificada
 * @returns {boolean} True se a imagem parecer embaçada baseada na URL
 */
export const isLikelyBlurryImage = url => {
  if (!url) return false;

  // Verificar parâmetros que indicam um placeholder ou imagem de baixa qualidade
  return (
    url.includes('e_blur') ||
    url.includes('q_35') ||
    url.includes('q_40') ||
    url.includes('q_50') ||
    url.includes('w_40') ||
    url.includes('w_80') ||
    url.includes('lowquality') ||
    url.includes('placeholder')
  );
};

/**
 * Otimiza a URL de uma imagem para garantir alta qualidade
 * @param {string} url URL original da imagem
 * @returns {string} URL otimizada
 */
export const getHighQualityImageUrl = url => {
  if (!url) return url;

  // Verificar se temos uma substituição direta no mapa
  if (HIGH_QUALITY_IMAGES[url]) {
    return HIGH_QUALITY_IMAGES[url];
  }

  // Caso contrário, otimizar a URL existente
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    let newUrl = url;

    // Remover parâmetros de blur
    if (newUrl.includes('e_blur')) {
      newUrl = newUrl.replace(/,e_blur:\d+/, '');
    }

    // Substituir parâmetros de baixa qualidade
    newUrl = newUrl.replace(/q_\d+/, 'q_90').replace(/w_40/, 'w_auto').replace(/w_80/, 'w_auto');

    // Garantir formato automático para melhor qualidade
    if (!newUrl.includes('f_auto')) {
      newUrl = newUrl.replace('/upload/', '/upload/f_auto,');
    }

    // Adicionar nitidez para melhorar a qualidade percebida
    if (!newUrl.includes('e_sharpen')) {
      newUrl = newUrl.replace('/upload/', '/upload/e_sharpen:60,');
    }

    return newUrl;
  }

  return url;
};

/**
 * Substitui imagens embaçadas na introdução do quiz
 * @returns {Object} Estatísticas da operação
 */
export const replaceBlurryIntroImages = () => {
  console.group('🔄 Substituindo imagens embaçadas na introdução');

  // 1. Identificar imagens da introdução
  const introImages = document.querySelectorAll('.quiz-intro img, [data-section="intro"] img');
  console.log(`Encontradas ${introImages.length} imagens na introdução`);

  let stats = {
    total: introImages.length,
    replaced: 0,
    skipped: 0,
  };

  // 2. Para cada imagem, verificar e substituir se necessário
  introImages.forEach((img, index) => {
    const originalSrc = img.src;

    if (isLikelyBlurryImage(originalSrc)) {
      const newSrc = getHighQualityImageUrl(originalSrc);

      if (newSrc !== originalSrc) {
        console.log(`Substituindo imagem ${index + 1}:`);
        console.log(`- Original: ${originalSrc}`);
        console.log(`- Nova: ${newSrc}`);

        // Criar nova imagem e substituir quando carregar
        const newImg = new Image();
        newImg.onload = () => {
          img.src = newSrc;
          img.style.filter = 'none'; // Remover qualquer blur de CSS

          // Adicionar efeito visual para mostrar que a imagem foi substituída
          img.style.transition = 'all 0.3s ease-out';
          img.style.boxShadow = '0 0 0 3px #4CAF50';

          setTimeout(() => {
            img.style.boxShadow = 'none';
          }, 2000);

          stats.replaced++;
        };

        newImg.onerror = () => {
          console.error(`Erro ao carregar nova imagem: ${newSrc}`);
          stats.skipped++;
        };

        newImg.src = newSrc;
      } else {
        console.log(`Imagem ${index + 1} já parece otimizada: ${originalSrc}`);
        stats.skipped++;
      }
    } else {
      console.log(`Imagem ${index + 1} não parece embaçada: ${originalSrc}`);
      stats.skipped++;
    }
  });

  console.log('📊 Estatísticas:');
  console.log(`- Total: ${stats.total}`);
  console.log(`- Substituídas: ${stats.replaced}`);
  console.log(`- Ignoradas: ${stats.skipped}`);

  console.groupEnd();
  return stats;
};

export default {
  isLikelyBlurryImage,
  getHighQualityImageUrl,
  replaceBlurryIntroImages,
};
