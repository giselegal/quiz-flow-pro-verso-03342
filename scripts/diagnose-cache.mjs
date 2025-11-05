#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO DE CACHE - Template System
 * 
 * Verifica e diagnostica problemas de cache no sistema de templates
 * 
 * Uso:
 *   node scripts/diagnose-cache.mjs
 *   node scripts/diagnose-cache.mjs --fix  # Tenta corrigir problemas
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = process.cwd();
const shouldFix = process.argv.includes('--fix');

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
// DIAGNÓSTICOS
// ============================================================================

const diagnostics = [];

function addDiagnostic(title, status, message, fix = null) {
  diagnostics.push({ title, status, message, fix });
}

// 1. Verificar se quiz21-complete.json existe
function checkMasterJSON() {
  log('\n🔍 [1/8] Verificando quiz21-complete.json...', 'cyan');
  
  const masterPath = resolve(ROOT, 'public/templates/quiz21-complete.json');
  if (!existsSync(masterPath)) {
    addDiagnostic(
      'Master JSON',
      'error',
      'quiz21-complete.json não encontrado',
      'Execute: node scripts/consolidate-json-v3.mjs'
    );
    log('  ❌ Arquivo não encontrado', 'red');
    return false;
  }
  
  try {
    const content = readFileSync(masterPath, 'utf-8');
    const data = JSON.parse(content);
    
    if (!data.steps || Object.keys(data.steps).length !== 21) {
      addDiagnostic(
        'Master JSON',
        'warning',
        `Apenas ${Object.keys(data.steps || {}).length} steps encontrados (esperado: 21)`,
        null
      );
      log(`  ⚠️  ${Object.keys(data.steps || {}).length}/21 steps`, 'yellow');
      return false;
    }
    
    addDiagnostic('Master JSON', 'ok', '21 steps completos encontrados', null);
    log('  ✅ 21 steps completos', 'green');
    return true;
  } catch (error) {
    addDiagnostic(
      'Master JSON',
      'error',
      `Erro ao ler arquivo: ${error.message}`,
      null
    );
    log(`  ❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

// 2. Verificar step-XX-v3.json individuais
function checkIndividualSteps() {
  log('\n🔍 [2/8] Verificando step-XX-v3.json individuais...', 'cyan');
  
  let present = 0;
  let missing = [];
  let withBlocks = 0;
  let withoutBlocks = 0;
  
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const stepPath = resolve(ROOT, `public/templates/${stepId}-v3.json`);
    
    if (existsSync(stepPath)) {
      present++;
      try {
        const content = JSON.parse(readFileSync(stepPath, 'utf-8'));
        if (content.blocks && content.blocks.length > 0) {
          withBlocks++;
        } else {
          withoutBlocks++;
        }
      } catch {}
    } else {
      missing.push(stepId);
    }
  }
  
  if (missing.length > 0) {
    addDiagnostic(
      'Steps individuais',
      'error',
      `${missing.length} steps faltando: ${missing.join(', ')}`,
      'Execute: node scripts/split-master-complete.mjs'
    );
    log(`  ❌ ${missing.length} faltando: ${missing.join(', ')}`, 'red');
    return false;
  }
  
  if (withoutBlocks > 0) {
    addDiagnostic(
      'Steps individuais',
      'warning',
      `${withoutBlocks} steps sem blocos (simplificados)`,
      'Execute: node scripts/split-master-complete.mjs'
    );
    log(`  ⚠️  ${withoutBlocks}/21 steps sem blocos`, 'yellow');
    return false;
  }
  
  addDiagnostic('Steps individuais', 'ok', `21/21 steps com blocos completos`, null);
  log(`  ✅ 21/21 steps completos com blocos`, 'green');
  return true;
}

// 3. Verificar src/templates/quiz21StepsComplete.ts
function checkTypeScriptTemplate() {
  log('\n🔍 [3/8] Verificando quiz21StepsComplete.ts...', 'cyan');
  
  const tsPath = resolve(ROOT, 'src/templates/quiz21StepsComplete.ts');
  if (!existsSync(tsPath)) {
    addDiagnostic(
      'TypeScript Template',
      'error',
      'quiz21StepsComplete.ts não encontrado',
      'Execute: npm run generate:templates'
    );
    log('  ❌ Arquivo não encontrado', 'red');
    return false;
  }
  
  try {
    const content = readFileSync(tsPath, 'utf-8');
    const stepMatches = content.match(/'step-\d{2}':/g) || [];
    const uniqueSteps = new Set(stepMatches);
    
    if (uniqueSteps.size !== 21) {
      addDiagnostic(
        'TypeScript Template',
        'warning',
        `Apenas ${uniqueSteps.size} steps encontrados (esperado: 21)`,
        'Execute: npm run generate:templates'
      );
      log(`  ⚠️  ${uniqueSteps.size}/21 steps`, 'yellow');
      return false;
    }
    
    addDiagnostic('TypeScript Template', 'ok', '21 steps encontrados', null);
    log(`  ✅ 21 steps encontrados`, 'green');
    return true;
  } catch (error) {
    addDiagnostic(
      'TypeScript Template',
      'error',
      `Erro ao ler arquivo: ${error.message}`,
      null
    );
    log(`  ❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

// 4. Verificar cache version no localStorage
function checkCacheVersion() {
  log('\n🔍 [4/8] Verificando versão do cache...', 'cyan');
  
  // Este check só funciona no browser, aqui apenas informativo
  addDiagnostic(
    'Cache Version',
    'info',
    'Execute no console do browser: localStorage.getItem("registry-cache-version")',
    'Se versão antiga: localStorage.clear()'
  );
  log('  ℹ️  Verificação manual necessária no browser', 'gray');
  return true;
}

// 5. Verificar se embedded templates existem
function checkEmbeddedTemplates() {
  log('\n🔍 [5/8] Verificando templates embedded...', 'cyan');
  
  const embeddedPath = resolve(ROOT, 'src/templates/embedded.ts');
  if (!existsSync(embeddedPath)) {
    addDiagnostic(
      'Embedded Templates',
      'warning',
      'embedded.ts não encontrado (opcional)',
      'Execute: npm run generate:templates'
    );
    log('  ⚠️  Não encontrado (opcional)', 'yellow');
    return false;
  }
  
  addDiagnostic('Embedded Templates', 'ok', 'embedded.ts encontrado', null);
  log('  ✅ Encontrado', 'green');
  return true;
}

// 6. Verificar estrutura de diretórios
function checkDirectoryStructure() {
  log('\n🔍 [6/8] Verificando estrutura de diretórios...', 'cyan');
  
  const dirs = [
    'public/templates',
    'public/templates/funnels/quiz21StepsComplete',
    'public/templates/funnels/quiz21StepsComplete/steps',
    'src/templates',
  ];
  
  let missing = [];
  for (const dir of dirs) {
    if (!existsSync(resolve(ROOT, dir))) {
      missing.push(dir);
    }
  }
  
  if (missing.length > 0) {
    addDiagnostic(
      'Estrutura de diretórios',
      'error',
      `Diretórios faltando: ${missing.join(', ')}`,
      'Crie os diretórios manualmente'
    );
    log(`  ❌ Faltando: ${missing.join(', ')}`, 'red');
    return false;
  }
  
  addDiagnostic('Estrutura de diretórios', 'ok', 'Todos os diretórios presentes', null);
  log('  ✅ Estrutura OK', 'green');
  return true;
}

// 7. Verificar sintaxe JSON
function checkJSONSyntax() {
  log('\n🔍 [7/8] Verificando sintaxe dos JSONs...', 'cyan');
  
  let errors = 0;
  const files = ['public/templates/quiz21-complete.json'];
  
  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    files.push(`public/templates/${stepId}-v3.json`);
  }
  
  for (const file of files) {
    const path = resolve(ROOT, file);
    if (existsSync(path)) {
      try {
        JSON.parse(readFileSync(path, 'utf-8'));
      } catch (error) {
        errors++;
        log(`  ❌ ${file}: ${error.message}`, 'red');
      }
    }
  }
  
  if (errors > 0) {
    addDiagnostic(
      'Sintaxe JSON',
      'error',
      `${errors} arquivos com erro de sintaxe`,
      'Corrija manualmente os erros de JSON'
    );
    return false;
  }
  
  addDiagnostic('Sintaxe JSON', 'ok', 'Todos os JSONs válidos', null);
  log('  ✅ Sintaxe OK em todos os arquivos', 'green');
  return true;
}

// 8. Verificar serviços
function checkServices() {
  log('\n🔍 [8/8] Verificando serviços...', 'cyan');
  
  const services = [
    'src/services/canonical/TemplateService.ts',
    'src/services/deprecated/HybridTemplateService.ts',
    'src/services/deprecated/UnifiedTemplateRegistry.ts',
  ];
  
  let missing = [];
  for (const service of services) {
    if (!existsSync(resolve(ROOT, service))) {
      missing.push(service);
    }
  }
  
  if (missing.length > 0) {
    addDiagnostic(
      'Serviços',
      'error',
      `Serviços faltando: ${missing.join(', ')}`,
      null
    );
    log(`  ❌ Faltando: ${missing.join(', ')}`, 'red');
    return false;
  }
  
  addDiagnostic('Serviços', 'ok', 'Todos os serviços presentes', null);
  log('  ✅ Todos presentes', 'green');
  return true;
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                           ║', 'cyan');
  log('║   🔍 DIAGNÓSTICO DE CACHE - Template System             ║', 'cyan');
  log('║                                                           ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');
  
  // Executar diagnósticos
  checkMasterJSON();
  checkIndividualSteps();
  checkTypeScriptTemplate();
  checkCacheVersion();
  checkEmbeddedTemplates();
  checkDirectoryStructure();
  checkJSONSyntax();
  checkServices();
  
  // Relatório final
  log('\n' + '═'.repeat(70), 'gray');
  log('\n📊 RELATÓRIO FINAL\n', 'cyan');
  
  const errors = diagnostics.filter(d => d.status === 'error').length;
  const warnings = diagnostics.filter(d => d.status === 'warning').length;
  const ok = diagnostics.filter(d => d.status === 'ok').length;
  
  log(`✅ OK: ${ok}`, 'green');
  log(`⚠️  Avisos: ${warnings}`, 'yellow');
  log(`❌ Erros: ${errors}`, 'red');
  
  // Listar problemas
  if (errors > 0 || warnings > 0) {
    log('\n🔧 AÇÕES NECESSÁRIAS:\n', 'yellow');
    
    diagnostics
      .filter(d => d.status !== 'ok' && d.fix)
      .forEach((d, idx) => {
        log(`${idx + 1}. ${d.title}:`, 'yellow');
        log(`   Problema: ${d.message}`, 'gray');
        log(`   Solução: ${d.fix}`, 'green');
        log('');
      });
  }
  
  // Diagnóstico de Cache MISS
  log('\n💡 CAUSA PROVÁVEL DOS CACHE MISSES:\n', 'cyan');
  
  if (errors > 0) {
    log('  • Arquivos JSON ausentes ou corrompidos', 'red');
    log('  • Execute as correções acima primeiro', 'yellow');
  } else if (warnings > 0) {
    log('  • Steps sem blocos completos (versão simplificada)', 'yellow');
    log('  • Execute: node scripts/split-master-complete.mjs', 'green');
  } else {
    log('  • Sistema de arquivos OK', 'green');
    log('  • Cache MISS pode ser comportamento normal em dev mode', 'gray');
    log('  • Verifique console do browser para logs de cache', 'gray');
    log('  • Limpe localStorage se necessário: localStorage.clear()', 'cyan');
  }
  
  log('\n' + '═'.repeat(70), 'gray');
  
  if (errors > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
