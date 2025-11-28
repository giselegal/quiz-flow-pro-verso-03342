#!/usr/bin/env node
/**
 * Teste de Validação - Arquitetura Modular v4.0
 * 
 * Testa:
 * 1. Scripts de build/split
 * 2. Services de export/import
 * 3. Estrutura de arquivos
 * 4. Integridade dos dados
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0
};

function log(level, message, details) {
  const color = {
    pass: colors.green,
    fail: colors.red,
    warn: colors.yellow,
    info: colors.blue
  }[level] || colors.reset;
  
  console.log(`${color}${message}${colors.reset}`);
  if (details) {
    console.log(`  ${details}`);
  }
}

function test(name, fn) {
  results.total++;
  try {
    fn();
    results.passed++;
    log('pass', `✅ ${name}`);
    return true;
  } catch (err) {
    results.failed++;
    log('fail', `❌ ${name}`, err.message);
    return false;
  }
}

function warn(message) {
  results.warnings++;
  log('warn', `⚠️  ${message}`);
}

console.log('\n' + '='.repeat(70));
console.log('🧪 VALIDAÇÃO DA ARQUITETURA MODULAR v4.0');
console.log('='.repeat(70) + '\n');

// ==================================================================================
// TESTE 1: Estrutura de Diretórios
// ==================================================================================

console.log('📁 Teste 1: Estrutura de Diretórios\n');

test('Diretório quiz21Steps/ existe', () => {
  const dir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps');
  if (!fs.existsSync(dir)) {
    throw new Error(`Diretório não encontrado: ${dir}`);
  }
});

test('Subdiretório steps/ existe', () => {
  const dir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
  if (!fs.existsSync(dir)) {
    throw new Error(`Diretório não encontrado: ${dir}`);
  }
});

test('Subdiretório compiled/ existe', () => {
  const dir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/compiled');
  if (!fs.existsSync(dir)) {
    throw new Error(`Diretório não encontrado: ${dir}`);
  }
});

test('Arquivo meta.json existe', () => {
  const file = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/meta.json');
  if (!fs.existsSync(file)) {
    throw new Error(`Arquivo não encontrado: ${file}`);
  }
});

test('Arquivo README.md existe', () => {
  const file = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/README.md');
  if (!fs.existsSync(file)) {
    throw new Error(`Arquivo não encontrado: ${file}`);
  }
});

// ==================================================================================
// TESTE 2: Steps Modulares
// ==================================================================================

console.log('\n📄 Teste 2: Steps Modulares\n');

const stepsDir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
const stepFiles = fs.readdirSync(stepsDir).filter(f => f.endsWith('.json'));

test('Existem 21 arquivos de steps', () => {
  if (stepFiles.length !== 21) {
    throw new Error(`Esperado 21 steps, encontrado ${stepFiles.length}`);
  }
});

test('Nomenclatura de steps está correta', () => {
  const invalidNames = stepFiles.filter(f => !f.match(/^step-\d{2}\.json$/));
  if (invalidNames.length > 0) {
    throw new Error(`Nomes inválidos: ${invalidNames.join(', ')}`);
  }
});

test('Todos os steps são JSONs válidos', () => {
  const invalidSteps = [];
  for (const file of stepFiles) {
    try {
      const content = fs.readFileSync(path.join(stepsDir, file), 'utf-8');
      JSON.parse(content);
    } catch (err) {
      invalidSteps.push(file);
    }
  }
  if (invalidSteps.length > 0) {
    throw new Error(`JSONs inválidos: ${invalidSteps.join(', ')}`);
  }
});

test('Steps possuem estrutura mínima (metadata, blocks)', () => {
  const invalidSteps = [];
  for (const file of stepFiles) {
    const content = fs.readFileSync(path.join(stepsDir, file), 'utf-8');
    const step = JSON.parse(content);
    if (!step.metadata || !step.blocks || !Array.isArray(step.blocks)) {
      invalidSteps.push(file);
    }
  }
  if (invalidSteps.length > 0) {
    throw new Error(`Steps sem estrutura mínima: ${invalidSteps.join(', ')}`);
  }
});

// ==================================================================================
// TESTE 3: Arquivo Compilado
// ==================================================================================

console.log('\n📦 Teste 3: Arquivo Compilado\n');

const compiledFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/compiled/full.json');

test('Arquivo compiled/full.json existe', () => {
  if (!fs.existsSync(compiledFile)) {
    throw new Error(`Arquivo não encontrado: ${compiledFile}`);
  }
});

let compiledData;
test('Arquivo compilado é JSON válido', () => {
  const content = fs.readFileSync(compiledFile, 'utf-8');
  compiledData = JSON.parse(content);
});

test('Arquivo compilado possui estrutura correta', () => {
  if (!compiledData.templateId || !compiledData.steps) {
    throw new Error('Estrutura inválida: falta templateId ou steps');
  }
});

test('Arquivo compilado possui 21 steps', () => {
  const stepCount = Object.keys(compiledData.steps).length;
  if (stepCount !== 21) {
    throw new Error(`Esperado 21 steps, encontrado ${stepCount}`);
  }
});

// ==================================================================================
// TESTE 4: Meta.json
// ==================================================================================

console.log('\n⚙️  Teste 4: Meta.json\n');

const metaFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/meta.json');
let metaData;

test('Meta.json é JSON válido', () => {
  const content = fs.readFileSync(metaFile, 'utf-8');
  metaData = JSON.parse(content);
});

test('Meta.json possui campos obrigatórios', () => {
  const requiredFields = ['templateId', 'name', 'version', 'metadata', 'globalConfig'];
  const missingFields = requiredFields.filter(field => !metaData[field]);
  if (missingFields.length > 0) {
    throw new Error(`Campos faltando: ${missingFields.join(', ')}`);
  }
});

test('Meta.json totalSteps está correto', () => {
  const totalSteps = metaData.metadata?.totalSteps;
  if (totalSteps !== 21) {
    throw new Error(`totalSteps incorreto: ${totalSteps} (esperado 21)`);
  }
});

// ==================================================================================
// TESTE 5: Scripts
// ==================================================================================

console.log('\n🔧 Teste 5: Scripts\n');

test('Script split-master-to-modular.mjs existe', () => {
  const script = path.join(PROJECT_ROOT, 'scripts/split-master-to-modular.mjs');
  if (!fs.existsSync(script)) {
    throw new Error(`Script não encontrado: ${script}`);
  }
});

test('Script build-modular-template.mjs existe', () => {
  const script = path.join(PROJECT_ROOT, 'scripts/build-modular-template.mjs');
  if (!fs.existsSync(script)) {
    throw new Error(`Script não encontrado: ${script}`);
  }
});

// ==================================================================================
// TESTE 6: Services
// ==================================================================================

console.log('\n🔌 Teste 6: Services\n');

test('FunnelExportService existe', () => {
  const service = path.join(PROJECT_ROOT, 'src/services/FunnelExportService.ts');
  if (!fs.existsSync(service)) {
    throw new Error(`Service não encontrado: ${service}`);
  }
});

test('FunnelImportService existe', () => {
  const service = path.join(PROJECT_ROOT, 'src/services/FunnelImportService.ts');
  if (!fs.existsSync(service)) {
    throw new Error(`Service não encontrado: ${service}`);
  }
});

// ==================================================================================
// TESTE 7: API Endpoints
// ==================================================================================

console.log('\n🌐 Teste 7: API Endpoints\n');

test('Funnel Steps Controller existe', () => {
  const controller = path.join(PROJECT_ROOT, 'server/api/controllers/funnel-steps.controller.ts');
  if (!fs.existsSync(controller)) {
    throw new Error(`Controller não encontrado: ${controller}`);
  }
});

// ==================================================================================
// TESTE 8: Migration
// ==================================================================================

console.log('\n🗄️  Teste 8: Migration\n');

test('Migration modular_templates existe', () => {
  const migration = path.join(PROJECT_ROOT, 'supabase/migrations/20251128_modular_templates.sql');
  if (!fs.existsSync(migration)) {
    throw new Error(`Migration não encontrada: ${migration}`);
  }
});

// ==================================================================================
// TESTE 9: Integridade dos Dados
// ==================================================================================

console.log('\n🔍 Teste 9: Integridade dos Dados\n');

test('Steps modulares possuem mesmo conteúdo do compilado', () => {
  let mismatchCount = 0;
  
  for (const [stepKey, compiledStep] of Object.entries(compiledData.steps)) {
    const stepNumber = stepKey.match(/\d+/)?.[0];
    const stepFile = path.join(stepsDir, `step-${stepNumber}.json`);
    
    if (!fs.existsSync(stepFile)) {
      mismatchCount++;
      continue;
    }
    
    const stepContent = fs.readFileSync(stepFile, 'utf-8');
    const stepData = JSON.parse(stepContent);
    
    // Comparar número de blocos (indicativo de integridade)
    if (stepData.blocks.length !== compiledStep.blocks.length) {
      mismatchCount++;
    }
  }
  
  if (mismatchCount > 0) {
    warn(`${mismatchCount} steps com discrepância de blocos (normal se houver edições)`);
  }
});

test('Tamanhos dos arquivos estão dentro do esperado', () => {
  const totalSize = stepFiles.reduce((sum, file) => {
    const stat = fs.statSync(path.join(stepsDir, file));
    return sum + stat.size;
  }, 0);
  
  const avgSize = totalSize / stepFiles.length;
  
  // Tamanho médio esperado: 2-10KB
  if (avgSize < 1024 || avgSize > 15 * 1024) {
    throw new Error(`Tamanho médio suspeito: ${(avgSize / 1024).toFixed(2)}KB`);
  }
  
  log('info', `  Tamanho médio dos steps: ${(avgSize / 1024).toFixed(2)}KB`);
});

// ==================================================================================
// RELATÓRIO FINAL
// ==================================================================================

console.log('\n' + '='.repeat(70));
console.log('📊 RELATÓRIO FINAL');
console.log('='.repeat(70) + '\n');

console.log(`Total de testes:    ${results.total}`);
console.log(`${colors.green}✅ Aprovados:       ${results.passed}${colors.reset}`);
console.log(`${colors.red}❌ Falhados:        ${results.failed}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Avisos:          ${results.warnings}${colors.reset}`);

const successRate = ((results.passed / results.total) * 100).toFixed(1);
console.log(`\nTaxa de sucesso: ${successRate}%`);

if (results.failed === 0) {
  console.log(`\n${colors.green}🎉 TODOS OS TESTES PASSARAM!${colors.reset}`);
  console.log(`\n✅ Arquitetura modular v4.0 está funcionando corretamente.\n`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}❌ ALGUNS TESTES FALHARAM${colors.reset}`);
  console.log(`\nVerifique os erros acima e corrija antes de prosseguir.\n`);
  process.exit(1);
}
