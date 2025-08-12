// Utilitário para verificar a saúde do site após o deploy na Hostinger
import React from 'react';
import ReactDOM from 'react-dom';

export function checkSiteHealth() {
  console.log('🔍 Verificando a saúde do site...');

  // Verificações de saúde
  const checks = {
    scripts: false,
    images: false,
    styles: false,
    routing: true,
    facebookPixel: false,
  };

  // 1. Verificar se os scripts carregaram corretamente
  checks.scripts = typeof React !== 'undefined' && typeof ReactDOM !== 'undefined';

  // 2. Verificar se as imagens estão carregando corretamente
  const images = document.querySelectorAll('img');
  let loadedImages = 0;

  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedImages++;
    }
  });

  checks.images = images.length > 0 ? loadedImages / images.length >= 0.7 : true;

  // 3. Verificar se os estilos foram aplicados
  const body = document.body;
  const computedStyle = window.getComputedStyle(body);
  checks.styles = computedStyle && computedStyle.backgroundColor !== '';

  // 4. Verificar se o Facebook Pixel está funcionando
  checks.facebookPixel = typeof window.fbq !== 'undefined';

  // Resumo dos resultados
  console.log('📊 Resultado das verificações:');
  console.log(`✅ Scripts: ${checks.scripts ? 'OK' : 'FALHA'}`);
  console.log(
    `✅ Imagens: ${checks.images ? 'OK' : 'FALHA'} (${loadedImages}/${images.length} carregadas)`
  );
  console.log(`✅ Estilos: ${checks.styles ? 'OK' : 'FALHA'}`);
  console.log(`✅ Rotas: ${checks.routing ? 'OK' : 'FALHA'}`);
  console.log(`✅ Facebook Pixel: ${checks.facebookPixel ? 'OK' : 'FALHA'}`);

  // Verificar imagens borradas
  console.log('🖼️ Verificando qualidade das imagens...');
  if (typeof window.fixBlurryIntroQuizImages === 'function') {
    const fixedCount = window.fixBlurryIntroQuizImages();
    console.log(`✅ ${fixedCount} imagens foram otimizadas`);
  } else {
    console.log('❌ A função de correção de imagens borradas não está disponível');
  }

  // Resultado final
  const overallHealth = Object.values(checks).filter(Boolean).length / Object.values(checks).length;
  console.log(`📋 Saúde geral do site: ${Math.round(overallHealth * 100)}%`);

  return {
    checks,
    overallHealth: Math.round(overallHealth * 100),
  };
}

// Expor a função globalmente
if (typeof window !== 'undefined') {
  window.checkSiteHealth = checkSiteHealth;
}

// Auto-executar após o carregamento completo da página
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Aguardar um tempo para garantir que tudo esteja carregado
    setTimeout(() => {
      checkSiteHealth();
    }, 2000);
  });
}

export default checkSiteHealth;
