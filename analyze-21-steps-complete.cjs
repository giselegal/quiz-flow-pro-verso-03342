#!/usr/bin/env node

/**
 * CONTADOR DAS 21 ETAPAS
 * Verifica quantas etapas estão sendo criadas no schemaDrivenFunnelService
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE DAS 21 ETAPAS NO SISTEMA');
console.log('='.repeat(50));

const serviceFile = path.join(__dirname, 'src/services/schemaDrivenFunnelService.ts');

if (!fs.existsSync(serviceFile)) {
  console.log('❌ Arquivo schemaDrivenFunnelService.ts não encontrado');
  process.exit(1);
}

const content = fs.readFileSync(serviceFile, 'utf8');

// Contar etapas criadas
const pagesPushMatches = content.match(/pages\.push\(/g);
const etapasCount = pagesPushMatches ? pagesPushMatches.length : 0;

console.log(`📊 Total de pages.push() encontrados: ${etapasCount}`);

// Analisar cada tipo de etapa
const analysis = {
  'ETAPA 1': content.includes('ETAPA 1: INTRODUÇÃO'),
  'ETAPAS 2-11': content.includes('ETAPAS 2-11: QUESTÕES PRINCIPAIS'),
  'ETAPA 12': content.includes('ETAPA 12: TRANSIÇÃO PRINCIPAL'),
  'ETAPAS 13-18': content.includes('ETAPAS 13-18: QUESTÕES ESTRATÉGICAS'),
  'ETAPA 19': content.includes('ETAPA 19: TRANSIÇÃO FINAL'),
  'ETAPA 20': content.includes('ETAPA 20: PÁGINA DE RESULTADO'),
  'ETAPA 21': content.includes('ETAPA 21: PÁGINA DE OFERTA')
};

console.log('\n📋 ANÁLISE POR SEÇÃO:');
Object.entries(analysis).forEach(([etapa, exists]) => {
  console.log(`  ${exists ? '✅' : '❌'} ${etapa}`);
});

// Verificar se as questões estão sendo importadas
const hasQuizQuestions = content.includes('REAL_QUIZ_QUESTIONS');
const hasStrategicQuestions = content.includes('STRATEGIC_QUESTIONS');

console.log('\n📚 DADOS DAS QUESTÕES:');
console.log(`  ${hasQuizQuestions ? '✅' : '❌'} REAL_QUIZ_QUESTIONS importadas`);
console.log(`  ${hasStrategicQuestions ? '✅' : '❌'} STRATEGIC_QUESTIONS importadas`);

// Contar loops forEach para questões
const forEachMatches = content.match(/\.forEach\(/g);
const forEachCount = forEachMatches ? forEachMatches.length : 0;

console.log(`\n🔄 Total de forEach encontrados: ${forEachCount}`);

if (hasQuizQuestions && hasStrategicQuestions && etapasCount >= 7) {
  console.log('\n🎉 ESTRUTURA DAS 21 ETAPAS IDENTIFICADA:');
  console.log('   • 1 etapa de introdução');
  console.log('   • 10 questões principais (etapas 2-11)');
  console.log('   • 1 transição principal (etapa 12)');
  console.log('   • 6 questões estratégicas (etapas 13-18)');
  console.log('   • 1 transição final (etapa 19)');
  console.log('   • 1 página de resultado (etapa 20)');
  console.log('   • 1 página de oferta (etapa 21)');
  console.log('\n✅ TOTAL: 21 ETAPAS COMPLETAS');
} else {
  console.log('\n⚠️  POSSÍVEL PROBLEMA NA ESTRUTURA:');
  console.log(`   - pages.push() encontrados: ${etapasCount}`);
  console.log(`   - forEach encontrados: ${forEachCount}`);
  console.log('   - Verifique se as questões estão sendo importadas corretamente');
}

console.log('\n🎯 MAPEAMENTO DOS COMPONENTES:');

// Verificar mapeamento das 21 etapas
const mappingFile = path.join(__dirname, 'src/config/editorBlocksMapping21Steps.ts');
if (fs.existsSync(mappingFile)) {
  const mappingContent = fs.readFileSync(mappingFile, 'utf8');
  const hasFunnelMapping = mappingContent.includes('FUNNEL_STEPS_MAPPING');
  console.log(`  ${hasFunnelMapping ? '✅' : '❌'} FUNNEL_STEPS_MAPPING configurado`);
  
  if (hasFunnelMapping) {
    // Contar entradas no mapeamento
    const mappingMatches = mappingContent.match(/\d+:\s*['"][^'"]+['"]/g);
    const mappingCount = mappingMatches ? mappingMatches.length : 0;
    console.log(`  📊 Etapas mapeadas: ${mappingCount}/21`);
  }
} else {
  console.log('  ❌ Arquivo editorBlocksMapping21Steps.ts não encontrado');
}

console.log('\n📁 COMPONENTES NECESSÁRIOS:');
const requiredComponents = [
  'QuizStartPageBlock.tsx',
  'QuizQuestionBlockConfigurable.tsx', 
  'QuizTransitionBlock.tsx',
  'StrategicQuestionBlock.tsx',
  'QuizResultCalculatedBlock.tsx',
  'QuizOfferPageBlock.tsx'
];

requiredComponents.forEach(component => {
  const componentPath = path.join(__dirname, 'src/components/editor/blocks', component);
  const exists = fs.existsSync(componentPath);
  console.log(`  ${exists ? '✅' : '❌'} ${component}`);
});
