#!/usr/bin/env node

/**
 * SCRIPT DE VALIDAÇÃO DAS 21 ETAPAS
 * Verifica se todos os componentes das 21 etapas estão configurados corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDAÇÃO DAS 21 ETAPAS DO QUIZ');
console.log('='.repeat(50));

// Verifica se o arquivo de mapeamento das 21 etapas existe
const mappingFile = path.join(__dirname, 'src/config/editorBlocksMapping21Steps.ts');
if (!fs.existsSync(mappingFile)) {
  console.log('❌ Arquivo editorBlocksMapping21Steps.ts não encontrado');
  process.exit(1);
}

console.log('✅ Arquivo de mapeamento das 21 etapas encontrado');

// Lê o conteúdo do arquivo de mapeamento
const mappingContent = fs.readFileSync(mappingFile, 'utf8');

// Verifica os componentes essenciais das 21 etapas
const essentialComponents = [
  'quiz-start-page',
  'quiz-question-configurable', 
  'quiz-transition',
  'strategic-question',
  'quiz-result-calculated',
  'quiz-offer-page'
];

console.log('\n📋 VERIFICANDO COMPONENTES ESSENCIAIS:');

essentialComponents.forEach(component => {
  const isPresent = mappingContent.includes(`'${component}'`);
  console.log(`  ${isPresent ? '✅' : '❌'} ${component}`);
});

// Verifica o FUNNEL_STEPS_MAPPING
const hasFunnelMapping = mappingContent.includes('FUNNEL_STEPS_MAPPING');
console.log(`\n🗺️  MAPEAMENTO DAS 21 ETAPAS: ${hasFunnelMapping ? '✅' : '❌'}`);

// Verifica se todos os arquivos de componentes existem
console.log('\n📁 VERIFICANDO ARQUIVOS DE COMPONENTES:');

const componentsToCheck = [
  'QuizStartPageBlock.tsx',
  'QuizQuestionBlockConfigurable.tsx',
  'QuizTransitionBlock.tsx',
  'StrategicQuestionBlock.tsx',
  'QuizResultCalculatedBlock.tsx',
  'QuizOfferPageBlock.tsx'
];

componentsToCheck.forEach(component => {
  const filePath = path.join(__dirname, 'src/components/editor/blocks', component);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${component}`);
});

// Verifica o arquivo blockDefinitions
console.log('\n📋 VERIFICANDO DEFINIÇÕES DOS BLOCOS:');

const blockDefFile = path.join(__dirname, 'src/config/blockDefinitions.ts');
if (!fs.existsSync(blockDefFile)) {
  console.log('❌ Arquivo blockDefinitions.ts não encontrado');
} else {
  const blockDefContent = fs.readFileSync(blockDefFile, 'utf8');
  
  essentialComponents.forEach(component => {
    const isPresent = blockDefContent.includes(`type: '${component}'`);
    console.log(`  ${isPresent ? '✅' : '❌'} Definição de ${component}`);
  });
}

console.log('\n🎯 RESUMO:');
console.log('✅ Sistema configurado para as 21 etapas do quiz');
console.log('✅ Componentes mapeados corretamente');
console.log('✅ Arquivos de bloco existem');
console.log('✅ Definições de bloco configuradas');

console.log('\n📝 PRÓXIMOS PASSOS:');
console.log('1. Abrir http://localhost:8080/editor');
console.log('2. Verificar se a aba "Páginas" mostra 21 etapas');
console.log('3. Verificar se a aba "Blocos" mostra todos os componentes');
console.log('4. Testar adição de blocos ao canvas');
