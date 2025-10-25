#!/usr/bin/env node
/**
 * 🧪 BATERIA COMPLETA DE TESTES - Steps 12, 19, 20
 * 
 * OBJETIVOS:
 * 1. Verificar carregamento de templates (JSON V2 vs TS)
 * 2. Verificar adapters corretos
 * 3. Verificar blocos registrados
 * 4. Verificar props de renderização
 * 5. Simular runtime completo
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Cores
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    log(`  ✅ ${name}`, 'green');
  } catch (error) {
    failedTests++;
    log(`  ❌ ${name}`, 'red');
    log(`     ${error.message}`, 'red');
    failures.push({ name, error: error.message });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\n   Expected: ${expected}\n   Got: ${actual}`);
  }
}

console.log('\n' + '='.repeat(80));
log('🧪 BATERIA COMPLETA DE TESTES - Steps 12, 19, 20', 'bright');
console.log('='.repeat(80) + '\n');

// ============================================================================
// TESTE 1: TEMPLATES JSON V2 EXISTEM
// ============================================================================

log('\n📦 TESTE 1: Verificar Existência dos Templates JSON V2', 'cyan');

const templatePaths = {
  'step-12': join(ROOT, 'src/config/templates/step-12.json'),
  'step-19': join(ROOT, 'src/config/templates/step-19.json'),
  'step-20': join(ROOT, 'src/config/templates/step-20.json'),
};

for (const [stepId, path] of Object.entries(templatePaths)) {
  test(`Template ${stepId} existe`, () => {
    assert(existsSync(path), `Arquivo não encontrado: ${path}`);
  });
}

// ============================================================================
// TESTE 2: ESTRUTURA DOS TEMPLATES
// ============================================================================

log('\n📦 TESTE 2: Verificar Estrutura dos Templates', 'cyan');

const templates = {};

for (const [stepId, path] of Object.entries(templatePaths)) {
  const content = JSON.parse(readFileSync(path, 'utf-8'));
  templates[stepId] = content;
  
  test(`${stepId}: Tem templateVersion`, () => {
    assert(content.templateVersion, 'templateVersion ausente');
  });
  
  test(`${stepId}: Tem metadata`, () => {
    assert(content.metadata, 'metadata ausente');
    assert(content.metadata.type, 'metadata.type ausente');
  });
  
  test(`${stepId}: Tem blocks[]`, () => {
    assert(Array.isArray(content.blocks), 'blocks não é array');
    assert(content.blocks.length > 0, 'blocks vazio');
  });
  
  test(`${stepId}: NÃO tem sections[]`, () => {
    assert(!content.sections, 'Template tem sections (deveria ser blocks)');
  });
}

// ============================================================================
// TESTE 3: TIPOS CORRETOS DOS TEMPLATES
// ============================================================================

log('\n📦 TESTE 3: Verificar Tipos dos Templates', 'cyan');

test('Step-12: type = "transition"', () => {
  assertEqual(templates['step-12'].metadata.type, 'transition', 'Tipo incorreto');
});

test('Step-19: type = "strategicQuestion"', () => {
  assertEqual(templates['step-19'].metadata.type, 'strategicQuestion', 'Tipo incorreto');
});

test('Step-20: type = "conversionResult"', () => {
  assertEqual(templates['step-20'].metadata.type, 'conversionResult', 'Tipo incorreto');
});

// ============================================================================
// TESTE 4: BLOCOS CORRETOS EM CADA TEMPLATE
// ============================================================================

log('\n📦 TESTE 4: Verificar Blocos em Cada Template', 'cyan');

// Step-12
test('Step-12: Tem 9 blocos', () => {
  assertEqual(templates['step-12'].blocks.length, 9, 'Número de blocos incorreto');
});

test('Step-12: Tem quiz-intro-header', () => {
  const has = templates['step-12'].blocks.some(b => b.type === 'quiz-intro-header');
  assert(has, 'Bloco quiz-intro-header não encontrado');
});

test('Step-12: Tem options-grid (pergunta estratégica)', () => {
  const has = templates['step-12'].blocks.some(b => b.type === 'options-grid');
  assert(has, 'Bloco options-grid não encontrado');
});

test('Step-12: Tem transition-loader', () => {
  const has = templates['step-12'].blocks.some(b => b.type === 'transition-loader');
  assert(has, 'Bloco transition-loader não encontrado');
});

// Step-19
test('Step-19: Tem 5 blocos', () => {
  assertEqual(templates['step-19'].blocks.length, 5, 'Número de blocos incorreto');
});

test('Step-19: Tem options-grid', () => {
  const has = templates['step-19'].blocks.some(b => b.type === 'options-grid');
  assert(has, 'Bloco options-grid não encontrado');
});

test('Step-19: Tem image-display-inline', () => {
  const has = templates['step-19'].blocks.some(b => b.type === 'image-display-inline');
  assert(has, 'Bloco image-display-inline não encontrado');
});

// Step-20
test('Step-20: Tem 13 blocos', () => {
  assertEqual(templates['step-20'].blocks.length, 13, 'Número de blocos incorreto');
});

test('Step-20: Tem result-main', () => {
  const has = templates['step-20'].blocks.some(b => b.type === 'result-main');
  assert(has, 'Bloco result-main não encontrado');
});

test('Step-20: Tem result-style', () => {
  const has = templates['step-20'].blocks.some(b => b.type === 'result-style');
  assert(has, 'Bloco result-style não encontrado');
});

test('Step-20: Tem result-share', () => {
  const has = templates['step-20'].blocks.some(b => b.type === 'result-share');
  assert(has, 'Bloco result-share não encontrado');
});

// ============================================================================
// TESTE 5: VERIFICAR REGISTRY DE ADAPTERS
// ============================================================================

log('\n📦 TESTE 5: Verificar ProductionStepsRegistry', 'cyan');

const registryPath = join(ROOT, 'src/components/step-registry/ProductionStepsRegistry.tsx');
const registryContent = readFileSync(registryPath, 'utf-8');

test('Registry: Step-12 usa TransitionStepAdapter', () => {
  const hasStep12 = registryContent.includes("id: 'step-12'");
  assert(hasStep12, 'Step-12 não encontrado no registry');
  
  // Verificar que vem após um TransitionStepAdapter ou antes de um que menciona
  const step12Section = registryContent.split("id: 'step-12'")[1].split('id:')[0];
  const usesTransition = registryContent.indexOf('TransitionStepAdapter') < registryContent.indexOf("id: 'step-12'") 
    || step12Section.includes('TransitionStepAdapter');
  assert(usesTransition, 'Step-12 não usa TransitionStepAdapter');
});

test('Registry: Step-19 usa StrategicQuestionStepAdapter', () => {
  const hasStep19 = registryContent.includes("id: 'step-19'");
  assert(hasStep19, 'Step-19 não encontrado no registry');
  
  const step19Index = registryContent.indexOf("id: 'step-19'");
  const beforeStep19 = registryContent.substring(Math.max(0, step19Index - 500), step19Index);
  const usesStrategic = beforeStep19.includes('StrategicQuestionStepAdapter');
  assert(usesStrategic, 'Step-19 NÃO usa StrategicQuestionStepAdapter (deveria usar!)');
});

test('Registry: Step-20 usa ResultStepAdapter', () => {
  const hasStep20 = registryContent.includes("id: 'step-20'");
  assert(hasStep20, 'Step-20 não encontrado no registry');
  
  const step20Index = registryContent.indexOf("id: 'step-20'");
  const beforeStep20 = registryContent.substring(Math.max(0, step20Index - 500), step20Index);
  const usesResult = beforeStep20.includes('ResultStepAdapter');
  assert(usesResult, 'Step-20 não usa ResultStepAdapter');
});

// ============================================================================
// TESTE 6: VERIFICAR MODO DE RENDERIZAÇÃO
// ============================================================================

log('\n📦 TESTE 6: Verificar Modo de Renderização (mode="production")', 'cyan');

test('TransitionStepAdapter: Usa mode="production"', () => {
  const adapterSection = registryContent.split('TransitionStepAdapter')[1];
  if (!adapterSection) {
    throw new Error('TransitionStepAdapter não encontrado');
  }
  
  const hasMode = adapterSection.includes('mode="production"');
  assert(hasMode, 'TransitionStepAdapter NÃO usa mode="production"');
});

test('ResultStepAdapter: Usa mode="production"', () => {
  const adapterSection = registryContent.split('ResultStepAdapter')[1];
  if (!adapterSection) {
    throw new Error('ResultStepAdapter não encontrado');
  }
  
  const hasMode = adapterSection.includes('mode="production"');
  assert(hasMode, 'ResultStepAdapter NÃO usa mode="production"');
});

test('NÃO usa isPreview (deprecated)', () => {
  const hasIsPreview = registryContent.includes('isPreview={true}');
  assert(!hasIsPreview, 'Código ainda usa isPreview (deprecated)');
});

// ============================================================================
// TESTE 7: VERIFICAR BLOCOS REGISTRADOS
// ============================================================================

log('\n📦 TESTE 7: Verificar Blocos no UniversalBlockRenderer', 'cyan');

const rendererPath = join(ROOT, 'src/components/editor/blocks/UniversalBlockRenderer.tsx');
const rendererContent = readFileSync(rendererPath, 'utf-8');

const criticalBlocks = [
  'quiz-intro-header',
  'options-grid',
  'transition-loader',
  'transition-progress',
  'image-display-inline',
  'text-inline',
  'button-inline',
  'result-main',
  'result-style',
  'result-share',
  'result-characteristics',
];

for (const blockType of criticalBlocks) {
  test(`Bloco "${blockType}" registrado`, () => {
    const isRegistered = rendererContent.includes(`'${blockType}':`);
    assert(isRegistered, `Bloco ${blockType} NÃO está registrado`);
  });
}

// ============================================================================
// TESTE 8: VERIFICAR FUNÇÃO loadTemplate()
// ============================================================================

log('\n📦 TESTE 8: Verificar Função loadTemplate()', 'cyan');

const importsPath = join(ROOT, 'src/templates/imports.ts');
const importsContent = readFileSync(importsPath, 'utf-8');

test('loadTemplate: Tenta carregar JSON V2 primeiro', () => {
  const hasJsonImport = importsContent.includes('@/config/templates/');
  assert(hasJsonImport, 'loadTemplate NÃO carrega de @/config/templates/');
});

test('loadTemplate: Tem try/catch para fallback', () => {
  const hasTryCatch = importsContent.includes('try {') && importsContent.includes('catch');
  assert(hasTryCatch, 'loadTemplate não tem estrutura try/catch');
});

test('loadTemplate: Retorna source correto', () => {
  const hasJsonSource = importsContent.includes('json-v2-blocks');
  assert(hasJsonSource, 'loadTemplate não retorna source "json-v2-blocks"');
});

// ============================================================================
// TESTE 9: VERIFICAR IMPORTS DOS BLOCOS ATÔMICOS
// ============================================================================

log('\n📦 TESTE 9: Verificar Imports dos Blocos Atômicos', 'cyan');

test('Import: TransitionLoaderBlock', () => {
  const hasImport = rendererContent.includes("from './atomic/TransitionLoaderBlock'");
  assert(hasImport, 'TransitionLoaderBlock não importado');
});

test('Import: ResultStyleBlock', () => {
  const hasImport = rendererContent.includes("from './atomic/ResultStyleBlock'");
  assert(hasImport, 'ResultStyleBlock não importado');
});

test('Import: ResultShareBlock', () => {
  const hasImport = rendererContent.includes("from './atomic/ResultShareBlock'");
  assert(hasImport, 'ResultShareBlock não importado');
});

test('Import: OptionsGridBlock', () => {
  const hasImport = rendererContent.includes("OptionsGridBlock");
  assert(hasImport, 'OptionsGridBlock não importado');
});

// ============================================================================
// TESTE 10: VERIFICAR ARQUIVOS DOS COMPONENTES EXISTEM
// ============================================================================

log('\n📦 TESTE 10: Verificar Arquivos de Componentes Existem', 'cyan');

const componentPaths = [
  'src/components/editor/blocks/atomic/TransitionLoaderBlock.tsx',
  'src/components/editor/blocks/atomic/TransitionProgressBlock.tsx',
  'src/components/editor/blocks/atomic/ResultStyleBlock.tsx',
  'src/components/editor/blocks/atomic/ResultShareBlock.tsx',
  'src/components/editor/blocks/OptionsGridBlock.tsx',
  'src/components/editor/blocks/atomic/ResultMainBlock.tsx',
];

for (const compPath of componentPaths) {
  test(`Componente existe: ${compPath.split('/').pop()}`, () => {
    const fullPath = join(ROOT, compPath);
    assert(existsSync(fullPath), `Arquivo não encontrado: ${compPath}`);
  });
}

// ============================================================================
// RELATÓRIO FINAL
// ============================================================================

console.log('\n' + '='.repeat(80));
log('📊 RELATÓRIO FINAL DOS TESTES', 'bright');
console.log('='.repeat(80) + '\n');

log(`Total de Testes: ${totalTests}`, 'cyan');
log(`✅ Aprovados: ${passedTests}`, 'green');
log(`❌ Falhados: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
log(`📈 Taxa de Sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`, passedTests === totalTests ? 'green' : 'yellow');

if (failures.length > 0) {
  console.log('\n' + '='.repeat(80));
  log('❌ FALHAS DETALHADAS:', 'red');
  console.log('='.repeat(80) + '\n');
  
  failures.forEach((failure, i) => {
    log(`${i + 1}. ${failure.name}`, 'red');
    log(`   ${failure.error}`, 'reset');
    console.log('');
  });
}

console.log('\n' + '='.repeat(80));
if (failedTests === 0) {
  log('🎉 TODOS OS TESTES PASSARAM! SISTEMA PRONTO PARA PRODUÇÃO!', 'green');
} else {
  log('⚠️  ALGUNS TESTES FALHARAM - REVISAR E CORRIGIR', 'yellow');
}
console.log('='.repeat(80) + '\n');

// Exit code
process.exit(failedTests > 0 ? 1 : 0);
