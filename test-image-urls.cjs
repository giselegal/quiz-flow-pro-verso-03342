#!/usr/bin/env node

/**
 * Script para testar URLs das imagens das questões
 * Verifica se as imagens estão acessíveis
 */

const https = require('https');

const imageUrls = [
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_mjrfcl.webp',
  'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
];

console.log('🔗 TESTANDO URLs DAS IMAGENS...\n');

async function testImageUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        success: res.statusCode === 200
      });
    });
    
    req.on('error', () => {
      resolve({
        url,
        status: 'ERROR',
        contentType: null,
        success: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        contentType: null,
        success: false
      });
    });
  });
}

async function testAllImages() {
  console.log('Testando acessibilidade das imagens...\n');
  
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const result = await testImageUrl(url);
    
    const status = result.success ? '✅' : '❌';
    const fileName = url.split('/').pop();
    
    console.log(`${status} ${fileName}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Tipo: ${result.contentType || 'N/A'}`);
    console.log(`   URL: ${url}`);
    console.log('');
  }
  
  console.log('=' .repeat(60));
  console.log('🎯 PRÓXIMOS PASSOS PARA DEBUG:');
  console.log('');
  console.log('1. Se as imagens estão OK, o problema está no front-end');
  console.log('2. Abra o navegador e vá para http://localhost:5173');
  console.log('3. Abra o DevTools (F12)');
  console.log('4. Vá para a aba Console e procure por erros');
  console.log('5. Vá para a aba Network e verifique se as imagens são carregadas');
  console.log('6. Inspecione o elemento do options-grid para ver as propriedades');
  console.log('');
  console.log('🔍 PONTOS ESPECÍFICOS PARA VERIFICAR:');
  console.log('- Se o componente OptionsGridBlock está sendo renderizado');
  console.log('- Se as propriedades "options" estão chegando no componente');
  console.log('- Se há erros de CORS ou CSP bloqueando as imagens');
  console.log('- Se o mapeamento está correto em editorBlocksMapping21Steps.ts');
  console.log('=' .repeat(60));
}

testAllImages().catch(console.error);
