// Script para verificar se os componentes do funil em produção foram preservados

import fs from 'fs';

console.log('🔍 VERIFICAÇÃO DOS COMPONENTES DO FUNIL EM PRODUÇÃO');
console.log('='.repeat(60));

// Arquivos principais do funil
const files = [
  './client/src/pages/ResultPage.tsx',
  './client/src/pages/QuizOfferPage.tsx',
  './client/src/components/QuizPage.tsx',
];

// Carregar blockDefinitions limpo
const blockDefsPath = './client/src/config/blockDefinitions.ts';
const blockDefsContent = fs.readFileSync(blockDefsPath, 'utf8');

// Extrair tipos de blocos do arquivo limpo
const blockTypes = [];
const blockMatches = blockDefsContent.match(/type:\s*['"`]([^'"`]+)['"`]/g);
if (blockMatches) {
  blockMatches.forEach(match => {
    const type = match.match(/['"`]([^'"`]+)['"`]/)[1];
    if (!blockTypes.includes(type)) {
      blockTypes.push(type);
    }
  });
}

console.log(`📦 Tipos de blocos disponíveis no arquivo limpo: ${blockTypes.length}`);

// Verificar cada arquivo do funil
files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ Arquivo não encontrado: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = filePath.split('/').pop();

  console.log(`\n📄 ANALISANDO: ${fileName}`);
  console.log('-'.repeat(40));

  // Procurar por tipos específicos de componentes
  const componentTypes = [
    'result-header-inline',
    'value-stack-inline',
    'cta-section-inline',
    'guarantee-inline',
    'transformation-inline',
    'final-value-proposition-inline',
    'quiz-offer-pricing-inline',
    'countdown-inline',
    'button-inline',
    'main-heading-inline',
    'text-inline',
    'image-inline',
    'two-columns',
    'result-card-inline',
  ];

  const usedComponents = [];
  const missingComponents = [];

  componentTypes.forEach(type => {
    if (content.includes(type)) {
      if (blockTypes.includes(type)) {
        usedComponents.push(type);
      } else {
        missingComponents.push(type);
      }
    }
  });

  // Verificar componentes hardcoded importantes
  const hardcodedComponents = [
    'Header',
    'SecondaryStylesSection',
    'MotivationSection',
    'MentorSection',
    'GuaranteeSection',
    'Testimonials',
    'BeforeAfterTransformation',
    'BonusSection',
    'BuildInfo',
  ];

  const presentHardcoded = [];
  hardcodedComponents.forEach(comp => {
    if (content.includes(comp)) {
      presentHardcoded.push(comp);
    }
  });

  console.log(`✅ Componentes inline encontrados: ${usedComponents.length}`);
  usedComponents.forEach(comp => console.log(`   - ${comp}`));

  if (missingComponents.length > 0) {
    console.log(`❌ Componentes inline PERDIDOS: ${missingComponents.length}`);
    missingComponents.forEach(comp => console.log(`   - ${comp}`));
  }

  console.log(`🔧 Componentes hardcoded preservados: ${presentHardcoded.length}`);
  presentHardcoded.forEach(comp => console.log(`   - ${comp}`));
});

// Verificar se componentes críticos do funil estão preservados
const criticalComponents = [
  'result-header-inline',
  'value-stack-inline',
  'cta-section-inline',
  'guarantee-inline',
  'quiz-offer-pricing-inline',
  'countdown-inline',
  'main-heading-inline',
  'text-inline',
  'image-inline',
];

console.log(`\n🎯 VERIFICAÇÃO DE COMPONENTES CRÍTICOS:`);
console.log('-'.repeat(40));

const preserved = [];
const lost = [];

criticalComponents.forEach(type => {
  if (blockTypes.includes(type)) {
    preserved.push(type);
  } else {
    lost.push(type);
  }
});

console.log(`✅ PRESERVADOS (${preserved.length}/${criticalComponents.length}):`);
preserved.forEach(comp => console.log(`   ✓ ${comp}`));

if (lost.length > 0) {
  console.log(`\n❌ PERDIDOS (${lost.length}/${criticalComponents.length}):`);
  lost.forEach(comp => console.log(`   ✗ ${comp}`));
} else {
  console.log(`\n🎉 TODOS OS COMPONENTES CRÍTICOS FORAM PRESERVADOS!`);
}

console.log('\n' + '='.repeat(60));
console.log(`📊 RESUMO:`);
console.log(`   • Componentes preservados: ${preserved.length}`);
console.log(`   • Componentes perdidos: ${lost.length}`);
console.log(`   • Status do funil: ${lost.length === 0 ? '✅ INTACTO' : '⚠️ COMPROMETIDO'}`);
