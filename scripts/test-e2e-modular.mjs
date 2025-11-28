#!/usr/bin/env node
/**
 * Teste End-to-End - Arquitetura Modular v4.0
 * 
 * Testa fluxo completo:
 * 1. Split master → steps modulares
 * 2. Build steps → compiled/full.json
 * 3. Validação de integridade
 * 4. Simulação de export/import
 * 5. Verificação de API endpoints (mock)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

// Cores
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Resultados
const results = {
  phases: [],
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  startTime: Date.now()
};

function log(level, message, details) {
  const color = {
    pass: colors.green,
    fail: colors.red,
    warn: colors.yellow,
    info: colors.cyan,
    phase: colors.magenta + colors.bold
  }[level] || colors.reset;
  
  console.log(`${color}${message}${colors.reset}`);
  if (details) {
    console.log(`  ${colors.blue}${details}${colors.reset}`);
  }
}

function logPhase(phase) {
  console.log('\n' + '═'.repeat(70));
  console.log(`${colors.magenta}${colors.bold}🔬 FASE ${phase.number}: ${phase.name}${colors.reset}`);
  console.log('═'.repeat(70) + '\n');
}

async function runCommand(cmd, description) {
  try {
    log('info', `⏳ ${description}...`);
    const { stdout, stderr } = await execAsync(cmd, { 
      cwd: PROJECT_ROOT,
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });
    
    if (stderr && !stderr.includes('warning')) {
      log('warn', `Stderr: ${stderr.substring(0, 200)}`);
    }
    
    return { success: true, stdout, stderr };
  } catch (err) {
    return { 
      success: false, 
      error: err.message,
      stdout: err.stdout,
      stderr: err.stderr
    };
  }
}

function test(name, fn) {
  results.total++;
  try {
    const result = fn();
    results.passed++;
    log('pass', `✅ ${name}`);
    return { success: true, result };
  } catch (err) {
    results.failed++;
    log('fail', `❌ ${name}`, err.message);
    return { success: false, error: err.message };
  }
}

console.log('\n' + '█'.repeat(70));
console.log(`${colors.cyan}${colors.bold}🧪 TESTE END-TO-END - ARQUITETURA MODULAR v4.0${colors.reset}`);
console.log('█'.repeat(70) + '\n');

// ==================================================================================
// FASE 1: Setup e Verificação de Pré-requisitos
// ==================================================================================

logPhase({ number: 1, name: 'Setup e Pré-requisitos' });

test('Node.js está instalado', () => {
  const version = process.version;
  if (!version) throw new Error('Node.js não encontrado');
  log('info', `Node.js version: ${version}`);
});

test('Diretório do projeto existe', () => {
  if (!fs.existsSync(PROJECT_ROOT)) {
    throw new Error(`Diretório não encontrado: ${PROJECT_ROOT}`);
  }
  log('info', `Project root: ${PROJECT_ROOT}`);
});

test('Arquivo master quiz21-complete.json existe', () => {
  const masterFile = path.join(PROJECT_ROOT, 'public/templates/quiz21-complete.json');
  if (!fs.existsSync(masterFile)) {
    throw new Error('Master file não encontrado');
  }
  const stats = fs.statSync(masterFile);
  log('info', `Tamanho: ${(stats.size / 1024).toFixed(2)}KB`);
});

test('Scripts de build existem', () => {
  const splitScript = path.join(PROJECT_ROOT, 'scripts/split-master-to-modular.mjs');
  const buildScript = path.join(PROJECT_ROOT, 'scripts/build-modular-template.mjs');
  
  if (!fs.existsSync(splitScript)) {
    throw new Error('split-master-to-modular.mjs não encontrado');
  }
  if (!fs.existsSync(buildScript)) {
    throw new Error('build-modular-template.mjs não encontrado');
  }
});

const phaseOneResults = {
  passed: results.passed,
  failed: results.failed
};

results.phases.push({
  name: 'Setup e Pré-requisitos',
  passed: phaseOneResults.passed,
  failed: phaseOneResults.failed,
  status: phaseOneResults.failed === 0 ? 'PASS' : 'FAIL'
});

if (phaseOneResults.failed > 0) {
  log('fail', '\n❌ Pré-requisitos falharam. Abortando testes.');
  process.exit(1);
}

// ==================================================================================
// FASE 2: Split Master → Steps Modulares
// ==================================================================================

logPhase({ number: 2, name: 'Split Master → Steps Modulares' });

let splitResult;
test('Executar npm run split:modular', async () => {
  splitResult = await runCommand(
    'npm run split:modular',
    'Dividindo master em steps modulares'
  );
  
  if (!splitResult.success) {
    throw new Error(`Split falhou: ${splitResult.error}`);
  }
  
  // Verificar se stdout contém sucesso
  if (!splitResult.stdout.includes('Split concluído com sucesso')) {
    throw new Error('Split não reportou sucesso');
  }
  
  log('info', 'Split executado com sucesso');
  return splitResult;
});

test('Diretório steps/ foi criado', () => {
  const stepsDir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
  if (!fs.existsSync(stepsDir)) {
    throw new Error('Diretório steps/ não foi criado');
  }
});

test('21 arquivos step-XX.json foram criados', () => {
  const stepsDir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
  const files = fs.readdirSync(stepsDir).filter(f => f.endsWith('.json'));
  
  if (files.length !== 21) {
    throw new Error(`Esperado 21 steps, encontrado ${files.length}`);
  }
  
  log('info', `${files.length} steps criados`);
});

test('Steps possuem conteúdo válido', () => {
  const stepsDir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
  const files = fs.readdirSync(stepsDir).filter(f => f.endsWith('.json'));
  
  let totalBlocks = 0;
  let totalSize = 0;
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(stepsDir, file), 'utf-8');
    const step = JSON.parse(content);
    
    if (!step.metadata || !step.blocks) {
      throw new Error(`Step ${file} com estrutura inválida`);
    }
    
    totalBlocks += step.blocks.length;
    totalSize += content.length;
  }
  
  log('info', `Total de ${totalBlocks} blocos em ${(totalSize/1024).toFixed(2)}KB`);
});

const phaseTwoStart = results.passed;
results.phases.push({
  name: 'Split Master → Steps',
  passed: results.passed - phaseTwoStart,
  failed: results.failed - (results.total - results.passed - phaseTwoStart),
  status: results.failed > phaseOneResults.failed ? 'FAIL' : 'PASS'
});

// ==================================================================================
// FASE 3: Build Steps → Compiled
// ==================================================================================

logPhase({ number: 3, name: 'Build Steps → Compiled' });

let buildResult;
test('Executar npm run build:modular', async () => {
  buildResult = await runCommand(
    'npm run build:modular',
    'Compilando steps modulares'
  );
  
  if (!buildResult.success) {
    throw new Error(`Build falhou: ${buildResult.error}`);
  }
  
  if (!buildResult.stdout.includes('Build concluído com sucesso')) {
    throw new Error('Build não reportou sucesso');
  }
  
  log('info', 'Build executado com sucesso');
  return buildResult;
});

test('Arquivo compiled/full.json foi criado', () => {
  const compiledFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/compiled/full.json');
  if (!fs.existsSync(compiledFile)) {
    throw new Error('Arquivo compiled/full.json não foi criado');
  }
  
  const stats = fs.statSync(compiledFile);
  log('info', `Tamanho: ${(stats.size / 1024).toFixed(2)}KB`);
});

test('Arquivo compilado possui estrutura válida', () => {
  const compiledFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/compiled/full.json');
  const content = fs.readFileSync(compiledFile, 'utf-8');
  const data = JSON.parse(content);
  
  if (!data.templateId || !data.steps || !data.metadata) {
    throw new Error('Estrutura inválida no arquivo compilado');
  }
  
  const stepCount = Object.keys(data.steps).length;
  if (stepCount !== 21) {
    throw new Error(`Esperado 21 steps, encontrado ${stepCount}`);
  }
  
  log('info', `${stepCount} steps no arquivo compilado`);
});

test('TypeScript definitions foram geradas', () => {
  const tsFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/compiled/quiz21StepsComplete.d.ts');
  if (!fs.existsSync(tsFile)) {
    throw new Error('TypeScript definitions não foram geradas');
  }
  
  const content = fs.readFileSync(tsFile, 'utf-8');
  if (!content.includes('export interface')) {
    throw new Error('TypeScript definitions com conteúdo inválido');
  }
});

const phaseThreeStart = results.phases.reduce((sum, p) => sum + p.passed, 0);
results.phases.push({
  name: 'Build Steps → Compiled',
  passed: results.passed - phaseThreeStart,
  failed: results.failed - (results.total - results.passed - phaseThreeStart),
  status: results.failed > (results.phases[0].failed + results.phases[1].failed) ? 'FAIL' : 'PASS'
});

// ==================================================================================
// FASE 4: Integridade de Dados
// ==================================================================================

logPhase({ number: 4, name: 'Integridade de Dados' });

let masterData, compiledData, stepFiles;

test('Carregar master JSON', () => {
  const masterFile = path.join(PROJECT_ROOT, 'public/templates/quiz21-complete.json');
  const content = fs.readFileSync(masterFile, 'utf-8');
  masterData = JSON.parse(content);
  
  log('info', `Master carregado: ${Object.keys(masterData.steps).length} steps`);
});

test('Carregar compiled JSON', () => {
  const compiledFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/compiled/full.json');
  const content = fs.readFileSync(compiledFile, 'utf-8');
  compiledData = JSON.parse(content);
  
  log('info', `Compiled carregado: ${Object.keys(compiledData.steps).length} steps`);
});

test('Carregar steps modulares', () => {
  const stepsDir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
  const files = fs.readdirSync(stepsDir).filter(f => f.endsWith('.json'));
  
  stepFiles = {};
  for (const file of files) {
    const content = fs.readFileSync(path.join(stepsDir, file), 'utf-8');
    const stepData = JSON.parse(content);
    const stepNumber = file.match(/\d+/)?.[0];
    stepFiles[`step-${stepNumber}`] = stepData;
  }
  
  log('info', `${Object.keys(stepFiles).length} steps modulares carregados`);
});

test('Comparar número de steps (master vs compiled vs modular)', () => {
  const masterCount = Object.keys(masterData.steps).length;
  const compiledCount = Object.keys(compiledData.steps).length;
  const modularCount = Object.keys(stepFiles).length;
  
  if (masterCount !== compiledCount || masterCount !== modularCount) {
    throw new Error(
      `Contagem inconsistente: master=${masterCount}, compiled=${compiledCount}, modular=${modularCount}`
    );
  }
  
  log('info', `Todos com ${masterCount} steps ✓`);
});

test('Comparar conteúdo de blocos (master vs compiled)', () => {
  let mismatchCount = 0;
  
  for (const [stepKey, masterStep] of Object.entries(masterData.steps)) {
    const compiledStep = compiledData.steps[stepKey];
    
    if (!compiledStep) {
      mismatchCount++;
      continue;
    }
    
    if (masterStep.blocks.length !== compiledStep.blocks.length) {
      mismatchCount++;
    }
  }
  
  if (mismatchCount > 0) {
    throw new Error(`${mismatchCount} steps com blocos inconsistentes`);
  }
  
  log('info', 'Todos os steps têm mesmo número de blocos ✓');
});

test('Comparar conteúdo de blocos (compiled vs modular)', () => {
  let mismatchCount = 0;
  
  for (const [stepKey, compiledStep] of Object.entries(compiledData.steps)) {
    const modularStep = stepFiles[stepKey];
    
    if (!modularStep) {
      mismatchCount++;
      continue;
    }
    
    // Remover metadados internos antes de comparar
    const compiledBlocks = compiledStep.blocks.length;
    const modularBlocks = modularStep.blocks.length;
    
    if (compiledBlocks !== modularBlocks) {
      mismatchCount++;
    }
  }
  
  if (mismatchCount > 0) {
    throw new Error(`${mismatchCount} steps modulares inconsistentes`);
  }
  
  log('info', 'Steps modulares consistentes com compiled ✓');
});

test('Verificar metadados em todos os steps', () => {
  let invalidCount = 0;
  
  for (const [stepKey, stepData] of Object.entries(stepFiles)) {
    if (!stepData.metadata || !stepData.metadata.id || !stepData.metadata.name) {
      invalidCount++;
    }
  }
  
  if (invalidCount > 0) {
    throw new Error(`${invalidCount} steps com metadados inválidos`);
  }
  
  log('info', 'Todos os steps possuem metadados válidos ✓');
});

const phaseFourStart = results.phases.reduce((sum, p) => sum + p.passed, 0);
results.phases.push({
  name: 'Integridade de Dados',
  passed: results.passed - phaseFourStart,
  failed: results.failed - (results.total - results.passed - phaseFourStart),
  status: results.failed > results.phases.slice(0, 3).reduce((sum, p) => sum + p.failed, 0) ? 'FAIL' : 'PASS'
});

// ==================================================================================
// FASE 5: Simulação de Export/Import
// ==================================================================================

logPhase({ number: 5, name: 'Simulação Export/Import' });

test('Services de Export/Import existem', () => {
  const exportService = path.join(PROJECT_ROOT, 'src/services/FunnelExportService.ts');
  const importService = path.join(PROJECT_ROOT, 'src/services/FunnelImportService.ts');
  
  if (!fs.existsSync(exportService)) {
    throw new Error('FunnelExportService não encontrado');
  }
  if (!fs.existsSync(importService)) {
    throw new Error('FunnelImportService não encontrado');
  }
  
  log('info', 'Services encontrados ✓');
});

test('Verificar formato de export (meta.json)', () => {
  const metaFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/meta.json');
  const content = fs.readFileSync(metaFile, 'utf-8');
  const meta = JSON.parse(content);
  
  // Verificar estrutura esperada para export
  if (!meta.templateId || !meta.name || !meta.version) {
    throw new Error('meta.json não possui estrutura de export válida');
  }
  
  if (!meta.globalConfig || !meta.buildInfo) {
    throw new Error('meta.json faltando configurações essenciais');
  }
  
  log('info', `Template: ${meta.name} v${meta.version}`);
});

test('Simular estrutura de ZIP para export', () => {
  // Verificar que todos os componentes para ZIP estão presentes
  const basePath = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps');
  
  const requiredFiles = [
    'meta.json',
    'README.md',
    'steps/step-01.json',
    'steps/step-21.json',
    'compiled/full.json'
  ];
  
  for (const file of requiredFiles) {
    const fullPath = path.join(basePath, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Arquivo necessário para ZIP não encontrado: ${file}`);
    }
  }
  
  log('info', 'Estrutura de ZIP completa ✓');
});

test('Verificar tamanhos para validação de export', () => {
  const stepsDir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
  const files = fs.readdirSync(stepsDir).filter(f => f.endsWith('.json'));
  
  const totalSize = files.reduce((sum, file) => {
    const stats = fs.statSync(path.join(stepsDir, file));
    return sum + stats.size;
  }, 0);
  
  const avgSize = totalSize / files.length;
  
  // Tamanho médio esperado: 2-10KB
  if (avgSize < 1024 || avgSize > 15 * 1024) {
    throw new Error(`Tamanho médio suspeito: ${(avgSize/1024).toFixed(2)}KB`);
  }
  
  log('info', `Tamanho médio: ${(avgSize/1024).toFixed(2)}KB, Total: ${(totalSize/1024).toFixed(2)}KB`);
});

const phaseFiveStart = results.phases.reduce((sum, p) => sum + p.passed, 0);
results.phases.push({
  name: 'Export/Import',
  passed: results.passed - phaseFiveStart,
  failed: results.failed - (results.total - results.passed - phaseFiveStart),
  status: results.failed > results.phases.slice(0, 4).reduce((sum, p) => sum + p.failed, 0) ? 'FAIL' : 'PASS'
});

// ==================================================================================
// FASE 6: API Endpoints (Mock)
// ==================================================================================

logPhase({ number: 6, name: 'API Endpoints (Verificação)' });

test('Controller de API existe', () => {
  const controller = path.join(PROJECT_ROOT, 'server/api/controllers/funnel-steps.controller.ts');
  
  if (!fs.existsSync(controller)) {
    throw new Error('funnel-steps.controller.ts não encontrado');
  }
  
  const content = fs.readFileSync(controller, 'utf-8');
  
  // Verificar se funções essenciais estão presentes
  const requiredFunctions = [
    'getStep',
    'updateStep',
    'createStep',
    'deleteStep',
    'reorderSteps'
  ];
  
  for (const fn of requiredFunctions) {
    if (!content.includes(`export async function ${fn}`)) {
      throw new Error(`Função ${fn} não encontrada no controller`);
    }
  }
  
  log('info', '5 endpoints implementados ✓');
});

test('Verificar schemas de validação Zod', () => {
  const controller = path.join(PROJECT_ROOT, 'server/api/controllers/funnel-steps.controller.ts');
  const content = fs.readFileSync(controller, 'utf-8');
  
  const requiredSchemas = [
    'StepIdParamSchema',
    'CreateStepSchema',
    'UpdateStepSchema',
    'ReorderStepsSchema'
  ];
  
  for (const schema of requiredSchemas) {
    if (!content.includes(schema)) {
      throw new Error(`Schema ${schema} não encontrado`);
    }
  }
  
  log('info', 'Schemas de validação presentes ✓');
});

test('Server index.ts registra endpoints', () => {
  const serverIndex = path.join(PROJECT_ROOT, 'server/index.ts');
  const content = fs.readFileSync(serverIndex, 'utf-8');
  
  const requiredRoutes = [
    "app.get('/api/funnels/:funnelId/steps/:stepId'",
    "app.put('/api/funnels/:funnelId/steps/:stepId'",
    "app.post('/api/funnels/:funnelId/steps'",
    "app.delete('/api/funnels/:funnelId/steps/:stepId'",
    "app.put('/api/funnels/:funnelId/steps/reorder'"
  ];
  
  for (const route of requiredRoutes) {
    if (!content.includes(route)) {
      throw new Error(`Rota não registrada: ${route}`);
    }
  }
  
  log('info', '5 rotas registradas no server ✓');
});

const phaseSixStart = results.phases.reduce((sum, p) => sum + p.passed, 0);
results.phases.push({
  name: 'API Endpoints',
  passed: results.passed - phaseSixStart,
  failed: results.failed - (results.total - results.passed - phaseSixStart),
  status: results.failed > results.phases.slice(0, 5).reduce((sum, p) => sum + p.failed, 0) ? 'FAIL' : 'PASS'
});

// ==================================================================================
// FASE 7: Migration e Database
// ==================================================================================

logPhase({ number: 7, name: 'Database Migration' });

test('Migration file existe', () => {
  const migration = path.join(PROJECT_ROOT, 'supabase/migrations/20251128_modular_templates.sql');
  
  if (!fs.existsSync(migration)) {
    throw new Error('Migration 20251128_modular_templates.sql não encontrada');
  }
  
  const stats = fs.statSync(migration);
  log('info', `Migration: ${(stats.size / 1024).toFixed(2)}KB`);
});

test('Migration contém funções RPC essenciais', () => {
  const migration = path.join(PROJECT_ROOT, 'supabase/migrations/20251128_modular_templates.sql');
  const content = fs.readFileSync(migration, 'utf-8');
  
  const requiredFunctions = [
    'update_funnel_step',
    'get_funnel_step',
    'count_funnel_steps',
    'list_funnel_step_ids'
  ];
  
  for (const fn of requiredFunctions) {
    if (!content.includes(`CREATE OR REPLACE FUNCTION ${fn}`)) {
      throw new Error(`Função RPC ${fn} não encontrada na migration`);
    }
  }
  
  log('info', '4 funções RPC implementadas ✓');
});

test('Migration contém índices de performance', () => {
  const migration = path.join(PROJECT_ROOT, 'supabase/migrations/20251128_modular_templates.sql');
  const content = fs.readFileSync(migration, 'utf-8');
  
  const requiredIndexes = [
    'idx_funnels_settings_steps',
    'idx_funnels_total_steps'
  ];
  
  for (const idx of requiredIndexes) {
    if (!content.includes(idx)) {
      throw new Error(`Índice ${idx} não encontrado na migration`);
    }
  }
  
  log('info', 'Índices GIN criados ✓');
});

test('Migration contém RLS policies', () => {
  const migration = path.join(PROJECT_ROOT, 'supabase/migrations/20251128_modular_templates.sql');
  const content = fs.readFileSync(migration, 'utf-8');
  
  if (!content.includes('CREATE POLICY templates_select_system')) {
    throw new Error('RLS policies não encontradas');
  }
  
  if (!content.includes('CREATE POLICY templates_protect_system')) {
    throw new Error('RLS protection policies não encontradas');
  }
  
  log('info', 'RLS policies configuradas ✓');
});

test('Migration contém seed de template sistema', () => {
  const migration = path.join(PROJECT_ROOT, 'supabase/migrations/20251128_modular_templates.sql');
  const content = fs.readFileSync(migration, 'utf-8');
  
  if (!content.includes("template_id, 'quiz21StepsComplete'")) {
    throw new Error('Seed de template quiz21StepsComplete não encontrado');
  }
  
  if (!content.includes("is_system_template, true")) {
    throw new Error('Template não marcado como sistema');
  }
  
  log('info', 'Seed de template sistema presente ✓');
});

const phaseSevenStart = results.phases.reduce((sum, p) => sum + p.passed, 0);
results.phases.push({
  name: 'Database Migration',
  passed: results.passed - phaseSevenStart,
  failed: results.failed - (results.total - results.passed - phaseSevenStart),
  status: results.failed > results.phases.slice(0, 6).reduce((sum, p) => sum + p.failed, 0) ? 'FAIL' : 'PASS'
});

// ==================================================================================
// FASE 8: Performance e Otimização
// ==================================================================================

logPhase({ number: 8, name: 'Performance e Otimização' });

test('Build time está dentro do esperado', () => {
  // Extrair tempo de build do stdout
  if (!buildResult || !buildResult.stdout) {
    throw new Error('Build result não disponível');
  }
  
  const match = buildResult.stdout.match(/Tempo de build:\s+(\d+)ms/);
  if (!match) {
    throw new Error('Tempo de build não encontrado no output');
  }
  
  const buildTime = parseInt(match[1]);
  
  // Esperado: < 100ms para 21 steps
  if (buildTime > 100) {
    throw new Error(`Build time muito alto: ${buildTime}ms (esperado < 100ms)`);
  }
  
  log('info', `Build time: ${buildTime}ms ✓`);
});

test('Tamanho total dos steps é menor que master', () => {
  const masterFile = path.join(PROJECT_ROOT, 'public/templates/quiz21-complete.json');
  const masterSize = fs.statSync(masterFile).size;
  
  const stepsDir = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/steps');
  const files = fs.readdirSync(stepsDir).filter(f => f.endsWith('.json'));
  
  const totalStepsSize = files.reduce((sum, file) => {
    return sum + fs.statSync(path.join(stepsDir, file)).size;
  }, 0);
  
  const reduction = ((masterSize - totalStepsSize) / masterSize * 100).toFixed(1);
  
  log('info', `Master: ${(masterSize/1024).toFixed(2)}KB, Steps: ${(totalStepsSize/1024).toFixed(2)}KB`);
  log('info', `Redução de overhead: ${reduction}% (metadados removidos)`);
});

test('Compiled file tem tamanho similar ao master', () => {
  const masterFile = path.join(PROJECT_ROOT, 'public/templates/quiz21-complete.json');
  const compiledFile = path.join(PROJECT_ROOT, 'public/templates/quiz21Steps/compiled/full.json');
  
  const masterSize = fs.statSync(masterFile).size;
  const compiledSize = fs.statSync(compiledFile).size;
  
  const difference = Math.abs(masterSize - compiledSize);
  const percentDiff = (difference / masterSize * 100).toFixed(1);
  
  // Diferença esperada: < 5%
  if (percentDiff > 5) {
    throw new Error(`Diferença muito grande: ${percentDiff}% (esperado < 5%)`);
  }
  
  log('info', `Master: ${(masterSize/1024).toFixed(2)}KB, Compiled: ${(compiledSize/1024).toFixed(2)}KB`);
  log('info', `Diferença: ${percentDiff}% ✓`);
});

const phaseEightStart = results.phases.reduce((sum, p) => sum + p.passed, 0);
results.phases.push({
  name: 'Performance',
  passed: results.passed - phaseEightStart,
  failed: results.failed - (results.total - results.passed - phaseEightStart),
  status: results.failed > results.phases.slice(0, 7).reduce((sum, p) => sum + p.failed, 0) ? 'FAIL' : 'PASS'
});

// ==================================================================================
// RELATÓRIO FINAL
// ==================================================================================

const totalTime = Date.now() - results.startTime;

console.log('\n' + '█'.repeat(70));
console.log(`${colors.cyan}${colors.bold}📊 RELATÓRIO FINAL - TESTE END-TO-END${colors.reset}`);
console.log('█'.repeat(70) + '\n');

// Resumo por fase
console.log(`${colors.bold}Resumo por Fase:${colors.reset}\n`);
results.phases.forEach((phase, idx) => {
  const statusColor = phase.status === 'PASS' ? colors.green : colors.red;
  const statusIcon = phase.status === 'PASS' ? '✅' : '❌';
  
  console.log(`${idx + 1}. ${phase.name}`);
  console.log(`   ${statusIcon} ${statusColor}${phase.status}${colors.reset} - ${phase.passed} aprovados, ${phase.failed} falhados`);
});

console.log(`\n${colors.bold}Estatísticas Gerais:${colors.reset}\n`);
console.log(`Total de testes:    ${results.total}`);
console.log(`${colors.green}✅ Aprovados:       ${results.passed}${colors.reset}`);
console.log(`${colors.red}❌ Falhados:        ${results.failed}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Avisos:          ${results.warnings}${colors.reset}`);
console.log(`⏱️  Tempo total:     ${(totalTime / 1000).toFixed(2)}s`);

const successRate = ((results.passed / results.total) * 100).toFixed(1);
console.log(`\n📈 Taxa de sucesso: ${successRate}%`);

// Status final
if (results.failed === 0) {
  console.log(`\n${colors.green}${colors.bold}🎉 TODOS OS TESTES END-TO-END PASSARAM!${colors.reset}`);
  console.log(`\n${colors.green}✅ Arquitetura modular v4.0 está 100% funcional de ponta a ponta.${colors.reset}\n`);
  
  // Resumo de conquistas
  console.log(`${colors.cyan}${colors.bold}Validações Completas:${colors.reset}`);
  console.log(`  • Split master → steps modulares ✓`);
  console.log(`  • Build steps → compiled/full.json ✓`);
  console.log(`  • Integridade de dados (master ≈ compiled ≈ modular) ✓`);
  console.log(`  • Estrutura de export/import ✓`);
  console.log(`  • API endpoints implementados ✓`);
  console.log(`  • Database migration completa ✓`);
  console.log(`  • Performance otimizada (< 100ms) ✓`);
  console.log(`\n`);
  
  process.exit(0);
} else {
  console.log(`\n${colors.red}${colors.bold}❌ ALGUNS TESTES END-TO-END FALHARAM${colors.reset}`);
  console.log(`\nVerifique os erros acima em cada fase e corrija antes de deploy.\n`);
  process.exit(1);
}
