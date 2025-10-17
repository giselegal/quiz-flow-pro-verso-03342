#!/usr/bin/env node
/**
 * 🧪 VALIDAÇÃO: Componentes da Biblioteca vs JSONs Modulares
 * 
 * Verifica se todos os tipos de blocos usados nos JSONs (step-12, step-19, step-20)
 * estão disponíveis na biblioteca de componentes do editor.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Caminhos dos arquivos
const STEP_12_JSON = join(projectRoot, 'src/data/modularSteps/step-12.json');
const STEP_19_JSON = join(projectRoot, 'src/data/modularSteps/step-19.json');
const STEP_20_JSON = join(projectRoot, 'src/data/modularSteps/step-20.json');
const REGISTRY_FILE = join(projectRoot, 'src/components/editor/blocks/EnhancedBlockRegistry.tsx');

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
  const result = condition ? '✅' : '❌';
  const message = `${result} ${name}`;
  
  if (condition) {
    passed++;
    console.log(message);
  } else {
    failed++;
    console.log(message);
    if (details) console.log(`   └─ ${details}`);
  }
}

console.log('🧪 Validação de Componentes - JSONs vs Biblioteca\n');

// ====================
// EXTRAIR TIPOS DOS JSONs
// ====================
function extractBlockTypes(jsonPath) {
  const content = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  const types = new Set();
  
  if (content.blocks && Array.isArray(content.blocks)) {
    content.blocks.forEach(block => {
      if (block.type) {
        types.add(block.type);
      }
    });
  }
  
  return Array.from(types).sort();
}

const step12Types = extractBlockTypes(STEP_12_JSON);
const step19Types = extractBlockTypes(STEP_19_JSON);
const step20Types = extractBlockTypes(STEP_20_JSON);

console.log('📦 STEP 12 - Tipos de Blocos Usados:\n');
step12Types.forEach(type => console.log(`   • ${type}`));

console.log('\n📦 STEP 19 - Tipos de Blocos Usados:\n');
step19Types.forEach(type => console.log(`   • ${type}`));

console.log('\n📦 STEP 20 - Tipos de Blocos Usados:\n');
step20Types.forEach(type => console.log(`   • ${type}`));

// ====================
// EXTRAIR TIPOS DA BIBLIOTECA
// ====================
const registryContent = readFileSync(REGISTRY_FILE, 'utf-8');

// Extrair tipos do ENHANCED_BLOCK_REGISTRY
const registryTypesMatch = registryContent.match(/export const ENHANCED_BLOCK_REGISTRY[\s\S]*?\{([\s\S]*?)\n\};/);
let registryTypes = [];

if (registryTypesMatch) {
  const registryBody = registryTypesMatch[1];
  const typeMatches = registryBody.matchAll(/'([^']+)':/g);
  registryTypes = Array.from(typeMatches, m => m[1]).sort();
}

// Extrair tipos do AVAILABLE_COMPONENTS
const availableTypesMatch = registryContent.match(/export const AVAILABLE_COMPONENTS = \[([\s\S]*?)\];/);
let availableTypes = [];

if (availableTypesMatch) {
  const availableBody = availableTypesMatch[1];
  const typeMatches = availableBody.matchAll(/type: '([^']+)'/g);
  availableTypes = Array.from(typeMatches, m => m[1]).sort();
}

console.log('\n📚 ENHANCED_BLOCK_REGISTRY - Tipos Registrados:\n');
console.log(`   Total: ${registryTypes.length} tipos`);

console.log('\n📚 AVAILABLE_COMPONENTS - Tipos na Biblioteca:\n');
console.log(`   Total: ${availableTypes.length} tipos`);

// ====================
// VALIDAÇÃO
// ====================
console.log('\n' + '═'.repeat(70));
console.log('🔍 VALIDAÇÃO: Tipos dos JSONs vs Biblioteca');
console.log('═'.repeat(70));

// Todos os tipos únicos usados nos JSONs
const allJsonTypes = [...new Set([...step12Types, ...step19Types, ...step20Types])].sort();

console.log('\n📋 CATEGORY 1: Tipos no ENHANCED_BLOCK_REGISTRY\n');

allJsonTypes.forEach(type => {
  const inRegistry = registryTypes.includes(type);
  test(
    `'${type}' está no ENHANCED_BLOCK_REGISTRY`,
    inRegistry,
    inRegistry ? '' : 'Tipo usado nos JSONs mas não registrado!'
  );
});

console.log('\n📋 CATEGORY 2: Tipos no AVAILABLE_COMPONENTS (Biblioteca do Editor)\n');

allJsonTypes.forEach(type => {
  const inAvailable = availableTypes.includes(type);
  test(
    `'${type}' está no AVAILABLE_COMPONENTS`,
    inAvailable,
    inAvailable ? '' : 'Tipo usado nos JSONs mas não disponível na biblioteca!'
  );
});

// ====================
// ANÁLISE DE FALTANTES
// ====================
const missingFromRegistry = allJsonTypes.filter(type => !registryTypes.includes(type));
const missingFromAvailable = allJsonTypes.filter(type => !availableTypes.includes(type));

if (missingFromRegistry.length > 0 || missingFromAvailable.length > 0) {
  console.log('\n' + '⚠'.repeat(70));
  console.log('⚠️  COMPONENTES FALTANTES');
  console.log('⚠'.repeat(70));
  
  if (missingFromRegistry.length > 0) {
    console.log('\n❌ Faltam no ENHANCED_BLOCK_REGISTRY:\n');
    missingFromRegistry.forEach(type => {
      console.log(`   • ${type}`);
      // Indicar em qual step é usado
      const usedIn = [];
      if (step12Types.includes(type)) usedIn.push('Step 12');
      if (step19Types.includes(type)) usedIn.push('Step 19');
      if (step20Types.includes(type)) usedIn.push('Step 20');
      console.log(`     └─ Usado em: ${usedIn.join(', ')}`);
    });
  }
  
  if (missingFromAvailable.length > 0) {
    console.log('\n❌ Faltam no AVAILABLE_COMPONENTS (não aparecerão na biblioteca):\n');
    missingFromAvailable.forEach(type => {
      console.log(`   • ${type}`);
      // Indicar em qual step é usado
      const usedIn = [];
      if (step12Types.includes(type)) usedIn.push('Step 12');
      if (step19Types.includes(type)) usedIn.push('Step 19');
      if (step20Types.includes(type)) usedIn.push('Step 20');
      console.log(`     └─ Usado em: ${usedIn.join(', ')}`);
    });
  }
}

// ====================
// COMPONENTES EXTRAS NA BIBLIOTECA
// ====================
const extraInAvailable = availableTypes.filter(type => !allJsonTypes.includes(type));

if (extraInAvailable.length > 0) {
  console.log('\n' + '📦'.repeat(70));
  console.log('📦 COMPONENTES DISPONÍVEIS MAS NÃO USADOS NOS JSONs');
  console.log('📦'.repeat(70));
  console.log('\n✅ Estes estão disponíveis para arrastar no editor:\n');
  
  // Agrupar por categoria
  const byCategory = {};
  extraInAvailable.forEach(type => {
    // Tentar determinar categoria pelo prefixo
    let category = 'other';
    if (type.startsWith('transition-')) category = 'transition';
    else if (type.startsWith('result-')) category = 'result';
    else if (type.startsWith('step20-')) category = 'step20';
    else if (type.startsWith('quiz-')) category = 'quiz';
    else if (type.includes('button')) category = 'action';
    else if (type.includes('text') || type.includes('heading')) category = 'content';
    else if (type.includes('form') || type.includes('input')) category = 'forms';
    
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(type);
  });
  
  Object.entries(byCategory).sort().forEach(([category, types]) => {
    console.log(`\n[${category.toUpperCase()}]:`);
    types.forEach(type => console.log(`   • ${type}`));
  });
}

// ====================
// SUMMARY
// ====================
console.log('\n' + '═'.repeat(70));
console.log('📊 SUMMARY');
console.log('═'.repeat(70));

const total = passed + failed;
const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

console.log(`\nTotal de validações: ${total}`);
console.log(`✅ Passou: ${passed}`);
console.log(`❌ Falhou: ${failed}`);
console.log(`Taxa de sucesso: ${percentage}%`);

console.log(`\n📊 Estatísticas:`);
console.log(`   • Tipos usados nos JSONs: ${allJsonTypes.length}`);
console.log(`   • Tipos no ENHANCED_BLOCK_REGISTRY: ${registryTypes.length}`);
console.log(`   • Tipos no AVAILABLE_COMPONENTS: ${availableTypes.length}`);
console.log(`   • Tipos faltando no Registry: ${missingFromRegistry.length}`);
console.log(`   • Tipos faltando na Biblioteca: ${missingFromAvailable.length}`);
console.log(`   • Tipos extras na Biblioteca: ${extraInAvailable.length}`);

if (failed === 0) {
  console.log('\n✅ PERFEITO! Todos os componentes dos JSONs estão disponíveis!');
} else {
  console.log('\n⚠️ ATENÇÃO! Alguns componentes dos JSONs não estão disponíveis.');
  console.log('   Adicione-os ao ENHANCED_BLOCK_REGISTRY e AVAILABLE_COMPONENTS.');
}

process.exit(failed > 0 ? 1 : 0);
