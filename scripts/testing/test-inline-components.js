#!/usr/bin/env node

/**
 * Script para testar se os componentes inline estão funcionando corretamente no editor
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 TESTE DOS COMPONENTES INLINE NO EDITOR\n');

// 1. Verificar se os componentes inline estão exportados
const inlineIndexPath = path.join(__dirname, 'client/src/components/editor/blocks/inline/index.ts');
console.log('1. Verificando exports dos componentes inline...');
if (fs.existsSync(inlineIndexPath)) {
  const content = fs.readFileSync(inlineIndexPath, 'utf8');
  const exports = content.match(/export \{[^}]*\}/g) || [];
  console.log(`   ✅ Arquivo index.ts existe com ${exports.length} exports`);

  const components = [
    'TextInlineBlock',
    'StyleCardInlineBlock',
    'StatInlineBlock',
    'BadgeInlineBlock',
    'ProgressInlineBlock',
    'ResultCardInlineBlock',
    'QuizOfferPricingInlineBlock',
    'CountdownInlineBlock',
  ];

  components.forEach(comp => {
    if (content.includes(comp)) {
      console.log(`   ✅ ${comp} está exportado`);
    } else {
      console.log(`   ❌ ${comp} NÃO está exportado`);
    }
  });
} else {
  console.log('   ❌ Arquivo index.ts não encontrado');
}

// 2. Verificar se componentDefinitions.ts inclui componentes inline
console.log('\n2. Verificando componentDefinitions.ts...');
const componentDefsPath = path.join(__dirname, 'client/src/data/componentDefinitions.ts');
if (fs.existsSync(componentDefsPath)) {
  const content = fs.readFileSync(componentDefsPath, 'utf8');

  if (content.includes('inline:')) {
    console.log('   ✅ Categoria "inline" encontrada');

    const inlineComponents = [
      'text-inline',
      'badge-inline',
      'stat-inline',
      'progress-inline',
      'image-display',
      'style-card',
      'pricing-card',
      'testimonial-card',
      'result-card',
      'countdown',
    ];

    inlineComponents.forEach(comp => {
      if (content.includes(`"${comp}"`)) {
        console.log(`   ✅ ${comp} está definido`);
      } else {
        console.log(`   ❌ ${comp} NÃO está definido`);
      }
    });
  } else {
    console.log('   ❌ Categoria "inline" não encontrada');
  }
} else {
  console.log('   ❌ Arquivo componentDefinitions.ts não encontrado');
}

// 3. Verificar se UniversalBlockRenderer inclui os casos inline
console.log('\n3. Verificando UniversalBlockRenderer.tsx...');
const rendererPath = path.join(
  __dirname,
  'client/src/components/editor/blocks/UniversalBlockRenderer.tsx'
);
if (fs.existsSync(rendererPath)) {
  const content = fs.readFileSync(rendererPath, 'utf8');

  const inlineCases = [
    'text-inline',
    'badge-inline',
    'stat-inline',
    'countdown-inline',
    'result-card-inline',
    'pricing-inline',
  ];

  inlineCases.forEach(caseType => {
    if (content.includes(`'${caseType}'`)) {
      console.log(`   ✅ Case '${caseType}' encontrado`);
    } else {
      console.log(`   ❌ Case '${caseType}' NÃO encontrado`);
    }
  });
} else {
  console.log('   ❌ Arquivo UniversalBlockRenderer.tsx não encontrado');
}

// 4. Verificar se PageEditorCanvas foi atualizado
console.log('\n4. Verificando PageEditorCanvas.tsx...');
const canvasPath = path.join(__dirname, 'client/src/components/editor/PageEditorCanvas.tsx');
if (fs.existsSync(canvasPath)) {
  const content = fs.readFileSync(canvasPath, 'utf8');

  if (content.includes('UniversalBlockRenderer')) {
    console.log('   ✅ UniversalBlockRenderer está sendo usado');
  } else {
    console.log('   ❌ UniversalBlockRenderer NÃO está sendo usado');
  }

  if (content.includes('ComponentRenderers')) {
    console.log('   ✅ ComponentRenderers está configurado');
  } else {
    console.log('   ❌ ComponentRenderers NÃO está configurado');
  }
} else {
  console.log('   ❌ Arquivo PageEditorCanvas.tsx não encontrado');
}

console.log('\n🎯 RESULTADO:');
console.log(
  'Se todos os itens estão ✅, os componentes inline devem aparecer na aba "Blocos" do editor.'
);
console.log('Acesse http://localhost:3000/editor para verificar visualmente.');
