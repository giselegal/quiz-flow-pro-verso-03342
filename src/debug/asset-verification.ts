/**
 * 🔍 VERIFICAÇÃO DE ASSETS - DIAGNÓSTICO DE 404
 * 
 * Script para verificar e corrigir problemas de assets 404
 */

export function verifyAssets() {
  console.log('🔍 Verificando assets...');
  
  // Lista de assets que podem estar causando 404
  const problematicAssets = [
    'badge-BjxqhOgC.js',
    'target-CvH_VoNZ.js'
  ];
  
  // Verificar se os assets existem
  problematicAssets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = `/assets/${asset}`;
    link.as = 'script';
    
    link.onload = () => {
      console.log(`✅ Asset carregado: ${asset}`);
    };
    
    link.onerror = () => {
      console.warn(`❌ Asset não encontrado: ${asset}`);
      // Tentar encontrar asset similar
      findSimilarAsset(asset);
    };
    
    document.head.appendChild(link);
  });
}

function findSimilarAsset(missingAsset: string) {
  // Extrair prefixo do asset
  const prefix = missingAsset.split('-')[0];
  
  // Buscar assets similares no DOM
  const scripts = Array.from(document.querySelectorAll('script[src*="/assets/"]'));
  const similarAssets = scripts.filter(script => {
    const src = script.getAttribute('src') || '';
    return src.includes(prefix);
  });
  
  if (similarAssets.length > 0) {
    console.log(`🔍 Assets similares encontrados para ${prefix}:`, similarAssets.map(s => s.getAttribute('src')));
  } else {
    console.warn(`❌ Nenhum asset similar encontrado para ${prefix}`);
  }
}

// Executar verificação
if (typeof window !== 'undefined') {
  (window as any).verifyAssets = verifyAssets;
  console.log('🔍 Função de verificação disponível em window.verifyAssets()');
}
