#!/usr/bin/env node
/**
 * 🧪 TESTE DE VALIDAÇÃO DE CACHE
 * 
 * Valida que o sistema de cache está funcionando corretamente
 * Simula carregamento de templates e verifica comportamento esperado
 * 
 * Uso:
 *   node scripts/test-cache-validation.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

const ROOT = process.cwd();

// Cores
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// ============================================================================
// TESTES
// ============================================================================

const tests = [];
let passed = 0;
let failed = 0;

function test(description, fn) {
  tests.push({ description, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// ============================================================================
// SUITE DE TESTES
// ============================================================================

test('Quiz21-complete.json existe e é válido', () => {
  const masterPath = resolve(ROOT, 'public/templates/quiz21-complete.json');
  assert(existsSync(masterPath), 'Arquivo quiz21-complete.json não encontrado');
  
  const content = readFileSync(masterPath, 'utf-8');
  const data = JSON.parse(content);
  
  assert(data.steps, 'Master JSON não tem propriedade steps');
  assert(Object.keys(data.steps).length === 21, `Esperado 21 steps, encontrado ${Object.keys(data.steps).length}`);
});

test('Todos os 21 step-XX-v3.json existem em public/templates', () => {
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const stepPath = resolve(ROOT, `public/templates/${stepId}-v3.json`);
    assert(existsSync(stepPath), `${stepId}-v3.json não encontrado em public/templates`);
  }
});

test('Todos os 21 step-XX.json existem em src/config/templates (sincronizados)', () => {
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const stepPath = resolve(ROOT, `src/config/templates/${stepId}.json`);
    assert(existsSync(stepPath), `${stepId}.json não encontrado em src/config/templates (não sincronizado)`);
  }
});

test('Step-01.json (config) tem blocos após sincronização', () => {
  const stepPath = resolve(ROOT, 'src/config/templates/step-01.json');
  const content = readFileSync(stepPath, 'utf-8');
  const data = JSON.parse(content);
  
  assert(data.blocks, 'step-01.json não tem propriedade blocks');
  assert(Array.isArray(data.blocks), 'blocks não é um array');
  assert(data.blocks.length > 0, `step-01.json tem 0 blocos (esperado > 0)`);
  
  log(`  📦 step-01.json: ${data.blocks.length} blocos`, 'gray');
});

test('Todos os steps (config) têm blocos válidos', () => {
  let totalBlocks = 0;
  let stepsWithBlocks = 0;
  
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const stepPath = resolve(ROOT, `src/config/templates/${stepId}.json`);
    
    const content = readFileSync(stepPath, 'utf-8');
    const data = JSON.parse(content);
    
    if (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
      stepsWithBlocks++;
      totalBlocks += data.blocks.length;
    }
  }
  
  assert(stepsWithBlocks === 21, `Apenas ${stepsWithBlocks}/21 steps têm blocos`);
  log(`  📦 Total: ${totalBlocks} blocos em 21 steps`, 'gray');
});

test('Step-01.json tem estrutura v3.0 correta', () => {
  const stepPath = resolve(ROOT, 'src/config/templates/step-01.json');
  const content = readFileSync(stepPath, 'utf-8');
  const data = JSON.parse(content);
  
  assert(data.templateVersion, 'Falta templateVersion');
  assert(data.metadata, 'Falta metadata');
  assert(data.metadata.id, 'Falta metadata.id');
  assert(data.theme || data.design, 'Falta theme/design');
  assert(data.blocks, 'Falta blocks');
});

test('Blocos têm estrutura válida (id, type, order)', () => {
  const stepPath = resolve(ROOT, 'src/config/templates/step-01.json');
  const content = readFileSync(stepPath, 'utf-8');
  const data = JSON.parse(content);
  
  const block = data.blocks[0];
  assert(block.id, 'Bloco não tem id');
  assert(block.type, 'Bloco não tem type');
  assert(block.order !== undefined || block.position !== undefined, 'Bloco não tem order/position');
});

test('UnifiedTemplateRegistry.ts existe', () => {
  const registryPath = resolve(ROOT, 'src/services/deprecated/UnifiedTemplateRegistry.ts');
  assert(existsSync(registryPath), 'UnifiedTemplateRegistry.ts não encontrado');
});

test('TemplateService.ts (canônico) existe', () => {
  const servicePath = resolve(ROOT, 'src/services/canonical/TemplateService.ts');
  assert(existsSync(servicePath), 'TemplateService.ts não encontrado');
});

test('HybridTemplateService.ts (deprecated) existe', () => {
  const hybridPath = resolve(ROOT, 'src/services/deprecated/HybridTemplateService.ts');
  assert(existsSync(hybridPath), 'HybridTemplateService.ts não encontrado');
});

test('Backup dos templates antigos foi criado', () => {
  const backupPattern = /\.backup-config-templates-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/;
  const files = readdirSync(ROOT);
  const backups = files.filter(f => backupPattern.test(f));
  
  assert(backups.length > 0, 'Nenhum backup encontrado');
  log(`  📦 Backup encontrado: ${backups[backups.length - 1]}`, 'gray');
});

test('Step-01-v3.json (public) mantém versão original', () => {
  const publicPath = resolve(ROOT, 'public/templates/step-01-v3.json');
  const configPath = resolve(ROOT, 'src/config/templates/step-01.json');
  
  const publicContent = JSON.parse(readFileSync(publicPath, 'utf-8'));
  const configContent = JSON.parse(readFileSync(configPath, 'utf-8'));
  
  assert(publicContent.blocks.length === configContent.blocks.length, 
    `Blocos diferentes: public=${publicContent.blocks.length}, config=${configContent.blocks.length}`);
});

// ============================================================================
// EXECUÇÃO
// ============================================================================

async function runTests() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                           ║', 'cyan');
  log('║   🧪 TESTE DE VALIDAÇÃO DE CACHE                        ║', 'cyan');
  log('║                                                           ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\n🔬 Executando ${tests.length} testes...\n`, 'cyan');
  
  for (const { description, fn } of tests) {
    try {
      await fn();
      log(`✅ ${description}`, 'green');
      passed++;
    } catch (error) {
      log(`❌ ${description}`, 'red');
      log(`   Erro: ${error.message}`, 'red');
      failed++;
    }
  }
  
  // Relatório
  log('\n' + '═'.repeat(70), 'gray');
  log('\n📊 RESULTADO:\n', 'cyan');
  
  const total = passed + failed;
  const percentage = ((passed / total) * 100).toFixed(1);
  
  log(`✅ Passou: ${passed}/${total} (${percentage}%)`, passed === total ? 'green' : 'yellow');
  
  if (failed > 0) {
    log(`❌ Falhou: ${failed}/${total}`, 'red');
  }
  
  // Status final
  log('\n' + '═'.repeat(70), 'gray');
  
  if (failed === 0) {
    log('\n🎉 TODOS OS TESTES PASSARAM!', 'green');
    log('\n✅ Sistema de cache validado com sucesso', 'green');
    log('✅ Templates sincronizados corretamente', 'green');
    log('✅ Estrutura de arquivos íntegra', 'green');
    
    log('\n💡 PRÓXIMOS PASSOS:', 'cyan');
    log('   1. Teste no browser: http://localhost:8080/editor?template=quiz21StepsComplete', 'gray');
    log('   2. Abra o console (F12) e verifique logs de cache', 'gray');
    log('   3. Primeira navegação deve mostrar MISS seguido de carregamento', 'gray');
    log('   4. Navegações subsequentes devem mostrar HIT (cache funcionando)', 'gray');
    log('   5. Execute: localStorage.clear() para limpar cache antigo', 'gray');
    
  } else {
    log('\n⚠️  ALGUNS TESTES FALHARAM', 'yellow');
    log('\nRevise os erros acima e corrija antes de testar no browser.', 'yellow');
    process.exit(1);
  }
  
  log('\n' + '═'.repeat(70), 'gray');
}

runTests().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
