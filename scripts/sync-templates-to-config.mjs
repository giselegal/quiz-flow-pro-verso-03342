#!/usr/bin/env node
/**
 * 🔄 SYNC TEMPLATES - Public → Config
 * 
 * Copia arquivos step-XX-v3.json de public/templates para src/config/templates
 * Mantém compatibilidade com código existente que usa @/config/templates
 * 
 * Uso:
 *   node scripts/sync-templates-to-config.mjs
 *   node scripts/sync-templates-to-config.mjs --dry-run
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const isDryRun = process.argv.includes('--dry-run');

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
// MAIN
// ============================================================================

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                           ║', 'cyan');
  log('║   🔄 SYNC TEMPLATES - Public → Config                   ║', 'cyan');
  log('║                                                           ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');
  
  if (isDryRun) {
    log('\n⚠️  DRY RUN MODE - Nenhuma alteração será feita\n', 'yellow');
  }
  
  const sourceDir = resolve(ROOT, 'public/templates');
  const targetDir = resolve(ROOT, 'src/config/templates');
  
  log(`\n📂 Origem: ${sourceDir}`, 'gray');
  log(`📂 Destino: ${targetDir}\n`, 'gray');
  
  // Criar backup
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupDir = resolve(ROOT, `.backup-config-templates-${timestamp}`);
  
  if (!isDryRun && existsSync(targetDir)) {
    mkdirSync(backupDir, { recursive: true });
    log(`📦 Criando backup em: ${backupDir}`, 'yellow');
  }
  
  let copied = 0;
  let skipped = 0;
  let errors = 0;
  
  // Processar steps 01-21
  for (let i = 1; i <= 21; i++) {
    const stepNumber = String(i).padStart(2, '0');
    const sourceFile = resolve(sourceDir, `step-${stepNumber}-v3.json`);
    const targetFile = resolve(targetDir, `step-${stepNumber}.json`);
    
    if (!existsSync(sourceFile)) {
      log(`⚠️  [${stepNumber}] Arquivo fonte não encontrado: step-${stepNumber}-v3.json`, 'yellow');
      skipped++;
      continue;
    }
    
    try {
      // Ler e validar JSON fonte
      const sourceContent = readFileSync(sourceFile, 'utf-8');
      const sourceData = JSON.parse(sourceContent);
      
      if (!sourceData.blocks || !Array.isArray(sourceData.blocks)) {
        log(`⚠️  [${stepNumber}] Arquivo sem blocos válidos`, 'yellow');
        skipped++;
        continue;
      }
      
      // Backup do arquivo antigo
      if (!isDryRun && existsSync(targetFile)) {
        const backupFile = resolve(backupDir, `step-${stepNumber}.json`);
        copyFileSync(targetFile, backupFile);
      }
      
      // Copiar novo arquivo
      if (!isDryRun) {
        writeFileSync(targetFile, sourceContent, 'utf-8');
      }
      
      log(
        `✅ [${stepNumber}] ${sourceData.blocks.length} blocos | ` +
        `${sourceContent.split('\n').length} linhas`,
        'green'
      );
      copied++;
      
    } catch (error) {
      log(`❌ [${stepNumber}] Erro: ${error.message}`, 'red');
      errors++;
    }
  }
  
  // Relatório
  log('\n' + '═'.repeat(70), 'gray');
  log('\n📊 RESULTADO:\n', 'cyan');
  log(`✅ Copiados: ${copied}`, 'green');
  log(`⚠️  Ignorados: ${skipped}`, 'yellow');
  log(`❌ Erros: ${errors}`, 'red');
  
  if (!isDryRun && copied > 0) {
    log(`\n📦 Backup salvo em: ${backupDir}`, 'gray');
    log('\n💡 Próximos passos:', 'cyan');
    log('   1. Reinicie o servidor de desenvolvimento', 'gray');
    log('   2. Limpe o cache do browser (localStorage.clear())', 'gray');
    log('   3. Verifique os logs de cache no console', 'gray');
  }
  
  if (isDryRun) {
    log('\n🔸 Execute sem --dry-run para aplicar as mudanças', 'yellow');
  }
  
  log('\n' + '═'.repeat(70), 'gray');
  
  if (errors > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
