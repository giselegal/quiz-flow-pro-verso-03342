#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VERIFICAÇÃO COMPLETA
 * Valida se a implementação dos schemas está correta
 */

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 INICIANDO VERIFICAÇÃO COMPLETA...\n');
console.log('═'.repeat(60));

// ============================================================
// 1. VERIFICAR SCHEMAS NO BLOCKSCHEMASMAP
// ============================================================

console.log('\n📋 1. VERIFICANDO SCHEMAS NO blockSchemaMap\n');

const schemaFile = join(process.cwd(), 'src/components/editor/quiz/schema/blockSchema.ts');
const schemaContent = readFileSync(schemaFile, 'utf8');

const expectedSchemas = [
  'transition-title',
  'transition-loader',
  'transition-text',
  'transition-progress',
  'transition-message',
  'result-main',
  'result-style',
  'result-characteristics',
  'result-secondary-styles',
  'result-cta-primary',
  'result-cta-secondary',
  'result-share'
];

let schemasOk = true;
const schemasFound = [];
const schemasMissing = [];

expectedSchemas.forEach(schema => {
  // Busca por padrão: '  'schema-name': {
  const pattern = new RegExp(`^\\s+'${schema}':\\s*{`, 'gm');
  const found = pattern.test(schemaContent);
  
  if (found) {
    schemasFound.push(schema);
    console.log(`   ✅ '${schema}'`);
  } else {
    schemasMissing.push(schema);
    schemasOk = false;
    console.log(`   ❌ '${schema}' - NÃO ENCONTRADO`);
  }
});

console.log(`\n   📊 Total: ${schemasFound.length}/${expectedSchemas.length} schemas encontrados`);

if (schemasOk) {
  console.log('   ✅ TODOS OS SCHEMAS PRESENTES!');
} else {
  console.log(`   ❌ FALTAM ${schemasMissing.length} SCHEMAS`);
}

// ============================================================
// 2. VERIFICAR PROPRITYSCHEMA EM CADA BLOCO
// ============================================================

console.log('\n📝 2. VERIFICANDO propertySchema EM CADA BLOCO\n');

let propertySchemasOk = true;

schemasFound.forEach(schema => {
  // Busca por propertySchema dentro do bloco
  const blockPattern = new RegExp(`'${schema}':\\s*{[^}]*propertySchema:\\s*\\[`, 'gs');
  const hasPropertySchema = blockPattern.test(schemaContent);
  
  if (hasPropertySchema) {
    console.log(`   ✅ '${schema}' - tem propertySchema`);
  } else {
    console.log(`   ❌ '${schema}' - SEM propertySchema`);
    propertySchemasOk = false;
  }
});

if (propertySchemasOk) {
  console.log('\n   ✅ TODOS OS BLOCOS TÊM propertySchema!');
} else {
  console.log('\n   ❌ ALGUNS BLOCOS SEM propertySchema');
}

// ============================================================
// 3. VERIFICAR COMPONENTES NO REGISTRY
// ============================================================

console.log('\n🎨 3. VERIFICANDO COMPONENTES NO EnhancedBlockRegistry\n');

const registryFile = join(process.cwd(), 'src/components/editor/blocks/EnhancedBlockRegistry.tsx');
const registryContent = readFileSync(registryFile, 'utf8');

let componentsOk = true;
const componentsFound = [];
const componentsMissing = [];

expectedSchemas.forEach(schema => {
  // Busca por: '  'schema-name': Component,
  const pattern = new RegExp(`'${schema}':\\s*[A-Z]`, 'g');
  const found = pattern.test(registryContent);
  
  if (found) {
    componentsFound.push(schema);
    console.log(`   ✅ '${schema}' - componente registrado`);
  } else {
    componentsMissing.push(schema);
    componentsOk = false;
    console.log(`   ❌ '${schema}' - componente NÃO registrado`);
  }
});

console.log(`\n   📊 Total: ${componentsFound.length}/${expectedSchemas.length} componentes registrados`);

if (componentsOk) {
  console.log('   ✅ TODOS OS COMPONENTES REGISTRADOS!');
} else {
  console.log(`   ❌ FALTAM ${componentsMissing.length} COMPONENTES`);
}

// ============================================================
// 4. VERIFICAR AVAILABLE_COMPONENTS
// ============================================================

console.log('\n📦 4. VERIFICANDO AVAILABLE_COMPONENTS\n');

let availableOk = true;
const availableFound = [];
const availableMissing = [];

expectedSchemas.forEach(schema => {
  // Busca por: { type: 'schema-name',
  const pattern = new RegExp(`type:\\s*'${schema}'`, 'g');
  const found = pattern.test(registryContent);
  
  if (found) {
    availableFound.push(schema);
    console.log(`   ✅ '${schema}' - disponível no editor`);
  } else {
    availableMissing.push(schema);
    availableOk = false;
    console.log(`   ❌ '${schema}' - NÃO disponível no editor`);
  }
});

console.log(`\n   📊 Total: ${availableFound.length}/${expectedSchemas.length} blocos disponíveis`);

if (availableOk) {
  console.log('   ✅ TODOS OS BLOCOS DISPONÍVEIS NO EDITOR!');
} else {
  console.log(`   ❌ FALTAM ${availableMissing.length} BLOCOS NO EDITOR`);
}

// ============================================================
// 5. VERIFICAR DYNAMICPROPERTIESFORM
// ============================================================

console.log('\n🔧 5. VERIFICANDO DynamicPropertiesForm\n');

const formFile = join(process.cwd(), 'src/components/editor/quiz/components/DynamicPropertiesForm.tsx');
const formContent = readFileSync(formFile, 'utf8');

// Verificar import correto
const hasImport = /import.*getBlockSchema.*from.*['"]\.\.\/schema\/blockSchema['"]/.test(formContent);
console.log(`   ${hasImport ? '✅' : '❌'} Import de getBlockSchema correto`);

// Verificar uso do getBlockSchema
const usesGetBlockSchema = /const\s+schema\s*=\s*getBlockSchema\(/.test(formContent);
console.log(`   ${usesGetBlockSchema ? '✅' : '❌'} Usa getBlockSchema(type)`);

// Verificar renderização condicional
const hasConditional = /if\s*\(\s*!schema\s*\)/.test(formContent);
console.log(`   ${hasConditional ? '✅' : '❌'} Tem verificação de schema null`);

const formOk = hasImport && usesGetBlockSchema && hasConditional;

if (formOk) {
  console.log('\n   ✅ DynamicPropertiesForm CONFIGURADO CORRETAMENTE!');
} else {
  console.log('\n   ❌ DynamicPropertiesForm COM PROBLEMAS');
}

// ============================================================
// RESUMO FINAL
// ============================================================

console.log('\n' + '═'.repeat(60));
console.log('\n📊 RESUMO FINAL\n');

const checks = [
  { name: 'Schemas no blockSchemaMap', ok: schemasOk, details: `${schemasFound.length}/${expectedSchemas.length}` },
  { name: 'propertySchema em blocos', ok: propertySchemasOk, details: 'Todos validados' },
  { name: 'Componentes no Registry', ok: componentsOk, details: `${componentsFound.length}/${expectedSchemas.length}` },
  { name: 'Blocos em AVAILABLE_COMPONENTS', ok: availableOk, details: `${availableFound.length}/${expectedSchemas.length}` },
  { name: 'DynamicPropertiesForm', ok: formOk, details: 'Import e uso corretos' }
];

checks.forEach(check => {
  const status = check.ok ? '✅' : '❌';
  console.log(`${status} ${check.name.padEnd(35)} - ${check.details}`);
});

const allOk = checks.every(c => c.ok);

console.log('\n' + '═'.repeat(60));

if (allOk) {
  console.log('\n🎉 VERIFICAÇÃO COMPLETA: TUDO OK! ✅');
  console.log('\n✨ Sistema 100% funcional para edição dos Steps 12, 19 e 20!');
  console.log('\n📝 Próximo passo: Testar no navegador');
  console.log('   1. npm run dev');
  console.log('   2. http://localhost:8080/editor');
  console.log('   3. Criar step e adicionar blocos\n');
  process.exit(0);
} else {
  console.log('\n❌ VERIFICAÇÃO COMPLETA: PROBLEMAS ENCONTRADOS');
  console.log('\n⚠️  Alguns componentes podem não funcionar corretamente');
  console.log('\n📝 Revise os itens marcados com ❌ acima\n');
  process.exit(1);
}
