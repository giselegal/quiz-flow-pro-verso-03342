#!/usr/bin/env node

/**
 * TESTE DE RENDERIZAÇÃO DOS COMPONENTES DAS 21 ETAPAS
 * Verifica se todos os componentes estão sendo importados e podem ser renderizados
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 TESTE DE RENDERIZAÇÃO DOS COMPONENTES');
console.log('='.repeat(50));

// Lista dos componentes das 21 etapas
const componentsToCheck = [
  'QuizStartPageBlock.tsx',
  'QuizQuestionBlock.tsx',
  'QuizQuestionBlockConfigurable.tsx',
  'QuizQuestionBlockFixed.tsx',
  'QuizTransitionBlock.tsx',
  'StrategicQuestionBlock.tsx',
  'QuestionMultipleBlock.tsx',
  'QuizResultCalculatedBlock.tsx',
  'ModernResultPageBlock.tsx',
  'QuizOfferPageBlock.tsx'
];

console.log('\n📁 VERIFICANDO EXISTÊNCIA DOS ARQUIVOS:');

let existingComponents = 0;
let missingComponents = [];

componentsToCheck.forEach(component => {
  const filePath = path.join(__dirname, 'src/components/editor/blocks', component);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${component}`);
  
  if (exists) {
    existingComponents++;
  } else {
    missingComponents.push(component);
  }
});

console.log(`\n📊 RESULTADO: ${existingComponents}/${componentsToCheck.length} componentes encontrados`);

if (missingComponents.length > 0) {
  console.log('\n❌ COMPONENTES FALTANDO:');
  missingComponents.forEach(comp => console.log(`  - ${comp}`));
}

// Verificar se há problemas de sintaxe básica nos componentes
console.log('\n🔍 VERIFICANDO SINTAXE DOS COMPONENTES:');

componentsToCheck.forEach(component => {
  const filePath = path.join(__dirname, 'src/components/editor/blocks', component);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar se tem export default
      const hasDefaultExport = content.includes('export default');
      const hasReactImport = content.includes('import React');
      const hasBlockInterface = content.includes('interface') || content.includes('Props');
      
      console.log(`  ${component}:`);
      console.log(`    ${hasReactImport ? '✅' : '❌'} React import`);
      console.log(`    ${hasDefaultExport ? '✅' : '❌'} Default export`);
      console.log(`    ${hasBlockInterface ? '✅' : '❌'} Props interface`);
      
    } catch (error) {
      console.log(`  ❌ ${component}: Erro ao ler arquivo`);
    }
  }
});

// Verificar o arquivo de mapeamento
console.log('\n🗺️  VERIFICANDO MAPEAMENTO DAS 21 ETAPAS:');

const mappingFile = path.join(__dirname, 'src/config/editorBlocksMapping21Steps.ts');
if (fs.existsSync(mappingFile)) {
  const mappingContent = fs.readFileSync(mappingFile, 'utf8');
  
  const hasEditorBlocksMap = mappingContent.includes('EDITOR_BLOCKS_MAP');
  const hasFunnelStepsMapping = mappingContent.includes('FUNNEL_STEPS_MAPPING');
  const hasGetBlockComponent = mappingContent.includes('getBlockComponent');
  
  console.log(`  ✅ Arquivo de mapeamento existe`);
  console.log(`  ${hasEditorBlocksMap ? '✅' : '❌'} EDITOR_BLOCKS_MAP`);
  console.log(`  ${hasFunnelStepsMapping ? '✅' : '❌'} FUNNEL_STEPS_MAPPING`);
  console.log(`  ${hasGetBlockComponent ? '✅' : '❌'} getBlockComponent function`);
} else {
  console.log(`  ❌ Arquivo de mapeamento não encontrado`);
}

console.log('\n📝 DIAGNÓSTICO:');
if (existingComponents === componentsToCheck.length) {
  console.log('✅ Todos os componentes existem');
  console.log('🔧 Possíveis problemas de renderização:');
  console.log('   1. Problemas de import/export');
  console.log('   2. Props incompatíveis');
  console.log('   3. Tipos TypeScript incorretos');
  console.log('   4. UniversalBlockRenderer não está usando o mapeamento correto');
} else {
  console.log('❌ Alguns componentes estão faltando');
  console.log('🔧 Criar os componentes faltantes primeiro');
}

console.log('\n🛠️  PRÓXIMOS PASSOS:');
console.log('1. Verificar imports no editorBlocksMapping21Steps.ts');
console.log('2. Verificar se UniversalBlockRenderer está usando o mapeamento correto');
console.log('3. Testar renderização no navegador');
console.log('4. Verificar console do navegador para erros de JavaScript');
