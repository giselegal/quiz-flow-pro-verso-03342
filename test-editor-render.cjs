#!/usr/bin/env node

/**
 * Script para testar se o editor consegue renderizar todas as 21 etapas
 * do funil com os componentes corretos
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testando renderização do editor das 21 etapas...\n');

// 1. Verificar se o arquivo de definições tem todos os componentes
const blockDefinitionsPath = path.join(__dirname, 'src/config/blockDefinitions.ts');
const mappingPath = path.join(__dirname, 'src/config/editorBlocksMapping21Steps.ts');

if (!fs.existsSync(blockDefinitionsPath)) {
  console.error('❌ Arquivo blockDefinitions.ts não encontrado');
  process.exit(1);
}

if (!fs.existsSync(mappingPath)) {
  console.error('❌ Arquivo editorBlocksMapping21Steps.ts não encontrado');
  process.exit(1);
}

const blockDefinitionsContent = fs.readFileSync(blockDefinitionsPath, 'utf8');
const mappingContent = fs.readFileSync(mappingPath, 'utf8');

// 2. Extrair tipos de componentes inline necessários
const inlineTypes = [
  'quiz-intro-header',
  'text-inline', 
  'heading-inline',
  'image-display-inline',
  'form-input',
  'button-inline',
  'options-grid'
];

console.log('✅ Tipos de componentes inline necessários:');
inlineTypes.forEach(type => {
  console.log(`   - ${type}`);
});
console.log();

// 3. Verificar se todas as definições estão presentes
const missingDefinitions = [];
const foundDefinitions = [];

inlineTypes.forEach(type => {
  const definitionPattern = new RegExp(`type:\\s*['"]${type}['"]`, 'g');
  if (blockDefinitionsContent.match(definitionPattern)) {
    foundDefinitions.push(type);
  } else {
    missingDefinitions.push(type);
  }
});

console.log('✅ Definições encontradas no blockDefinitions.ts:');
foundDefinitions.forEach(type => {
  console.log(`   ✓ ${type}`);
});

if (missingDefinitions.length > 0) {
  console.log('\n❌ Definições faltando no blockDefinitions.ts:');
  missingDefinitions.forEach(type => {
    console.log(`   ✗ ${type}`);
  });
} else {
  console.log('\n✅ Todas as definições de componentes inline estão presentes!');
}

// 4. Verificar se todos os imports estão no mapping
const missingImports = [];
const foundImports = [];

inlineTypes.forEach(type => {
  // Converter para nome de componente (ex: quiz-intro-header -> QuizIntroHeaderInlineBlock)
  const componentName = type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('') + 'InlineBlock';
  
  if (mappingContent.includes(componentName)) {
    foundImports.push(`${type} -> ${componentName}`);
  } else {
    missingImports.push(`${type} -> ${componentName}`);
  }
});

console.log('\n✅ Imports encontrados no mapping:');
foundImports.forEach(mapping => {
  console.log(`   ✓ ${mapping}`);
});

if (missingImports.length > 0) {
  console.log('\n❌ Imports faltando no mapping:');
  missingImports.forEach(mapping => {
    console.log(`   ✗ ${mapping}`);
  });
} else {
  console.log('\n✅ Todos os imports de componentes inline estão presentes!');
}

// 5. Status final
console.log('\n' + '='.repeat(60));
if (missingDefinitions.length === 0 && missingImports.length === 0) {
  console.log('🎉 SUCESSO: Editor está pronto para renderizar todas as 21 etapas!');
  console.log('🚀 Você pode testar acessando o editor em http://localhost:5173');
} else {
  console.log('⚠️  PENDENTE: Ainda há alguns componentes faltando...');
  console.log(`   - ${missingDefinitions.length} definições faltando`);
  console.log(`   - ${missingImports.length} imports faltando`);
}
console.log('='.repeat(60));
