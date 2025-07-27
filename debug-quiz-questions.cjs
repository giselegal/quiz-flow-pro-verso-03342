#!/usr/bin/env node

/**
 * Script para debug das questões no editor
 * Verifica se as opções das questões estão sendo criadas corretamente
 */

const fs = require('fs');

console.log('🔍 VERIFICANDO ESTRUTURA DAS QUESTÕES NO EDITOR\n');

// 1. Verificar dados das questões no arquivo de dados
const questionsFile = './src/data/correctQuizQuestions.ts';
if (fs.existsSync(questionsFile)) {
  const content = fs.readFileSync(questionsFile, 'utf8');
  
  // Contar questões
  const questionMatches = content.match(/id:\s*"q\d+"/g) || [];
  console.log(`✅ ${questionMatches.length} questões encontradas em correctQuizQuestions.ts`);
  
  // Verificar se há imageUrl nas opções
  const imageUrlMatches = content.match(/imageUrl:\s*"[^"]+"/g) || [];
  console.log(`✅ ${imageUrlMatches.length} imagens encontradas nas opções`);
  
  // Verificar se há options arrays
  const optionsMatches = content.match(/options:\s*\[/g) || [];
  console.log(`✅ ${optionsMatches.length} arrays de opções encontrados`);
} else {
  console.log('❌ Arquivo correctQuizQuestions.ts não encontrado');
}

// 2. Verificar serviço de funil
const funnelServiceFile = './src/services/schemaDrivenFunnelService.ts';
if (fs.existsSync(funnelServiceFile)) {
  const content = fs.readFileSync(funnelServiceFile, 'utf8');
  
  // Verificar se está usando as questões corretas
  const usingCorrectQuestions = content.includes('CORRECT_QUIZ_QUESTIONS');
  console.log(`${usingCorrectQuestions ? '✅' : '❌'} Serviço usando CORRECT_QUIZ_QUESTIONS`);
  
  // Verificar se está criando options-grid
  const creatingOptionsGrid = content.includes("type: 'options-grid'");
  console.log(`${creatingOptionsGrid ? '✅' : '❌'} Criando blocos options-grid`);
  
  // Verificar se está mapeando opções corretamente
  const mappingOptions = content.includes('questionData.options.map');
  console.log(`${mappingOptions ? '✅' : '❌'} Mapeando opções das questões`);
} else {
  console.log('❌ Arquivo schemaDrivenFunnelService.ts não encontrado');
}

// 3. Verificar componente OptionsGridBlock
const optionsGridFile = './src/components/editor/blocks/OptionsGridBlock.tsx';
if (fs.existsSync(optionsGridFile)) {
  const content = fs.readFileSync(optionsGridFile, 'utf8');
  
  // Verificar se está acessando properties.options
  const accessingOptions = content.includes('properties.options');
  console.log(`${accessingOptions ? '✅' : '❌'} OptionsGridBlock acessando properties.options`);
  
  // Verificar se está renderizando imagens
  const renderingImages = content.includes('option.imageUrl');
  console.log(`${renderingImages ? '✅' : '❌'} OptionsGridBlock renderizando imagens`);
  
  // Verificar se tem fallback para opções vazias
  const hasFallback = content.includes('Configure as opções');
  console.log(`${hasFallback ? '✅' : '❌'} OptionsGridBlock tem fallback para opções vazias`);
} else {
  console.log('❌ Arquivo OptionsGridBlock.tsx não encontrado');
}

console.log('\n' + '='.repeat(60));
console.log('🧪 TESTE RECOMENDADO:');
console.log('1. Acesse http://localhost:5173');
console.log('2. Vá para o editor de funil');
console.log('3. Verifique se as questões mostram as opções com imagens');
console.log('4. Se ainda não aparecer, verifique o console do browser para erros');
console.log('='.repeat(60));
