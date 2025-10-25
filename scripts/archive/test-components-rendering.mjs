// Test script para verificar se todos os componentes estão sendo renderizados
import { getStepTemplate, getAllSteps } from './src/config/stepTemplatesMapping.ts';
import { getEnhancedComponent } from './src/config/enhancedBlockRegistry.ts';

console.log('🔍 TESTANDO RENDERIZAÇÃO DE COMPONENTES NO /editor-fixed');
console.log('='.repeat(60));

// Testar todas as 21 etapas
const allSteps = getAllSteps();
console.log(`\n📋 Total de etapas: ${allSteps.length}`);

let totalBlocks = 0;
let renderableBlocks = 0;
let missingComponents = new Set();

allSteps.forEach((step, index) => {
  console.log(`\n🏗️  ETAPA ${step.stepNumber}: ${step.name}`);
  console.log(`   Descrição: ${step.description}`);

  try {
    const templateBlocks = getStepTemplate(step.stepNumber);
    console.log(`   ✅ Blocos carregados: ${templateBlocks.length}`);

    templateBlocks.forEach((block, blockIndex) => {
      totalBlocks++;
      const blockType = block.type;
      const component = getEnhancedComponent(blockType);

      if (component && component.name !== 'createFallbackComponent') {
        renderableBlocks++;
        console.log(`      ✅ ${blockIndex + 1}. ${blockType} - RENDERIZÁVEL`);
      } else {
        missingComponents.add(blockType);
        console.log(`      ❌ ${blockIndex + 1}. ${blockType} - COMPONENTE FALTANDO`);
      }
    });
  } catch (error) {
    console.log(`   ❌ Erro ao carregar template: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 RESULTADO DA ANÁLISE:');
console.log(`   📦 Total de blocos: ${totalBlocks}`);
console.log(`   ✅ Blocos renderizáveis: ${renderableBlocks}`);
console.log(`   ❌ Blocos com problemas: ${totalBlocks - renderableBlocks}`);
console.log(`   📈 Taxa de sucesso: ${Math.round((renderableBlocks / totalBlocks) * 100)}%`);

if (missingComponents.size > 0) {
  console.log('\n⚠️  COMPONENTES FALTANDO:');
  Array.from(missingComponents).forEach(component => {
    console.log(`   - ${component}`);
  });
}

console.log('\n🎯 CONCLUSÃO:');
if (renderableBlocks === totalBlocks) {
  console.log('   ✅ TODOS os componentes estão sendo renderizados corretamente!');
} else {
  console.log(`   ⚠️  ${totalBlocks - renderableBlocks} componentes precisam de atenção.`);
}

export {};
