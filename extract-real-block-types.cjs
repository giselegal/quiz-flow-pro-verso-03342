#!/usr/bin/env node

/**
 * EXTRATOR DOS TIPOS DE BLOCO REAIS DAS 21 ETAPAS
 * Identifica quais componentes as 21 etapas realmente precisam
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 TIPOS DE BLOCO REAIS DAS 21 ETAPAS');
console.log('='.repeat(50));

const serviceFile = path.join(__dirname, 'src/services/schemaDrivenFunnelService.ts');
const content = fs.readFileSync(serviceFile, 'utf8');

// Extrair todos os tipos de bloco
const typeMatches = content.match(/type: '[^']+'/g);
const allTypes = typeMatches ? typeMatches.map(match => match.replace(/type: '([^']+)'/, '$1')) : [];

// Remover duplicatas e filtrar apenas os tipos relacionados às 21 etapas
const uniqueTypes = [...new Set(allTypes)];

console.log('📋 TODOS OS TIPOS DE BLOCO ENCONTRADOS:');
uniqueTypes.forEach((type, index) => {
  console.log(`  ${index + 1}. ${type}`);
});

console.log(`\n📊 Total de tipos únicos: ${uniqueTypes.length}`);

// Separar por categoria
const blockCategories = {
  'Quiz/Cabeçalho': uniqueTypes.filter(type => 
    type.includes('quiz-intro-header') || type.includes('header')
  ),
  'Texto/Conteúdo': uniqueTypes.filter(type => 
    type.includes('text') || type.includes('heading')
  ),
  'Interação': uniqueTypes.filter(type => 
    type.includes('button') || type.includes('form') || type.includes('options')
  ),
  'Layout': uniqueTypes.filter(type => 
    type.includes('spacer') || type.includes('image')
  ),
  'Outros': uniqueTypes.filter(type => 
    !type.includes('quiz-intro-header') && !type.includes('header') &&
    !type.includes('text') && !type.includes('heading') &&
    !type.includes('button') && !type.includes('form') && !type.includes('options') &&
    !type.includes('spacer') && !type.includes('image')
  )
};

console.log('\n🗂️ CATEGORIZAÇÃO DOS BLOCOS:');
Object.entries(blockCategories).forEach(([category, types]) => {
  if (types.length > 0) {
    console.log(`\n${category}:`);
    types.forEach(type => console.log(`  • ${type}`));
  }
});

// Verificar quais componentes existem
console.log('\n📁 VERIFICAÇÃO DE COMPONENTES EXISTENTES:');

const componentMappings = {
  'quiz-intro-header': 'QuizIntroHeaderBlock.tsx',
  'text-inline': 'TextInlineBlock.tsx',
  'heading-inline': 'HeadingInlineBlock.tsx',
  'image-display-inline': 'ImageDisplayInlineBlock.tsx',
  'form-input': 'FormInputBlock.tsx',
  'button-inline': 'ButtonInlineBlock.tsx',
  'options-grid': 'OptionsGridBlock.tsx',
  'spacer': 'SpacerBlock.tsx'
};

Object.entries(componentMappings).forEach(([blockType, componentFile]) => {
  if (uniqueTypes.includes(blockType)) {
    const componentPath = path.join(__dirname, 'src/components/editor/blocks', componentFile);
    const exists = fs.existsSync(componentPath);
    console.log(`  ${exists ? '✅' : '❌'} ${blockType} → ${componentFile}`);
  }
});

console.log('\n🎯 COMPONENTES QUE PRECISAM SER CRIADOS:');
Object.entries(componentMappings).forEach(([blockType, componentFile]) => {
  if (uniqueTypes.includes(blockType)) {
    const componentPath = path.join(__dirname, 'src/components/editor/blocks', componentFile);
    const exists = fs.existsSync(componentPath);
    if (!exists) {
      console.log(`  🔨 CRIAR: ${componentFile} para tipo '${blockType}'`);
    }
  }
});

console.log('\n💡 PRÓXIMOS PASSOS:');
console.log('1. Criar os componentes inline que estão faltando');
console.log('2. Mapear esses componentes no editorBlocksMapping21Steps.ts');
console.log('3. Atualizar blockDefinitions.ts com as definições corretas');
console.log('4. Testar renderização no editor');
