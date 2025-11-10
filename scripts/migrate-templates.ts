#!/usr/bin/env tsx
/**
 * 🔄 SCRIPT DE MIGRAÇÃO DE TEMPLATES
 * Converte templates v3.1 (hardcoded) para v3.2 (dinâmicos)
 * 
 * Uso:
 *   npx tsx scripts/migrate-templates.ts
 *   npx tsx scripts/migrate-templates.ts --step=02
 *   npx tsx scripts/migrate-templates.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURAÇÃO
// ============================================

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const BACKUP_DIR = path.join(TEMPLATES_DIR, 'backups');

const URL_TO_ASSET_MAP: Record<string, string> = {
  // Hero e logos
  'Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png': 'hero-intro',
  'LOGO_DA_MARCA_GISELE_l78gin.png': 'logo-main',
  
  // Step 02 - Natural
  '/v1744735447/1_cfccze.png': 'q-natural-1',
  '/v1744735449/2_s0idhw.png': 'q-classico-1',
  '/v1744735452/6_mwhjxb.png': 'q-contemporaneo-1',
  '/v1744735451/5_ozpk9f.png': 'q-elegante-1',
  '/v1744735451/4_kwq2ib.png': 'q-romantico-1',
  '/v1744735454/8_m7c6xm.png': 'q-sexy-1',
  '/v1744735453/7_ocp7jn.png': 'q-dramatico-1',
  '/v1744735450/3_hkqdmx.png': 'q-criativo-1',
  
  // Step 03
  '/v1744735456/9_jvf28n.png': 'q-natural-2',
  '/v1744735457/10_dkh7am.png': 'q-classico-2',
  '/v1744735461/14_ow2vp9.png': 'q-contemporaneo-2',
  '/v1744735460/13_cwqezd.png': 'q-elegante-2',
  '/v1744735459/12_y81qxz.png': 'q-romantico-2',
  '/v1744735463/16_vjbnyp.png': 'q-sexy-2',
  '/v1744735462/15_hs06f9.png': 'q-dramatico-2',
  '/v1744735458/11_akpvdi.png': 'q-criativo-2',
  
  // Step 10 (accessories)
  '/v1744735479/56_htzoxy.png': 'q-natural-10',
  '/v1744735479/57_whzmff.png': 'q-classico-10',
  '/v1744735482/61_joafud.png': 'q-contemporaneo-10',
  '/v1744735482/60_vzsnps.png': 'q-elegante-10',
  '/v1744735482/59_dwaqrx.png': 'q-romantico-10',
  '/v1744735487/63_lwgokn.png': 'q-sexy-10',
  '/v1744735485/62_mno8wg.png': 'q-dramatico-10',
  '/v1744735480/58_njdjoh.png': 'q-criativo-10',
};

const COLOR_MAP: Record<string, string> = {
  '#B89B7A': '{{theme.colors.primary}}',
  '#b89b7a': '{{theme.colors.primary}}',
  '#432818': '{{theme.colors.secondary}}',
  '#fffaf7': '{{theme.colors.background}}',
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', warn: '⚠️' };
  console.log(`${icons[type]} ${message}`);
}

function convertUrlToAsset(url: string): string {
  // Procura no mapa
  for (const [pattern, assetId] of Object.entries(URL_TO_ASSET_MAP)) {
    if (url.includes(pattern)) {
      return `{{assets.${assetId}}}`;
    }
  }
  
  // Se não encontrou, mantém original mas avisa
  if (url.includes('cloudinary.com')) {
    log(`URL não mapeada: ${url.substring(0, 80)}...`, 'warn');
  }
  
  return url;
}

function convertColorToVariable(color: string): string {
  return COLOR_MAP[color] || color;
}

function processValue(value: any): any {
  if (typeof value === 'string') {
    // Converte URLs
    if (value.includes('cloudinary.com') || value.includes('http')) {
      return convertUrlToAsset(value);
    }
    
    // Converte cores em style attributes
    if (value.includes('style=') && value.includes('#')) {
      let processed = value;
      for (const [hex, variable] of Object.entries(COLOR_MAP)) {
        processed = processed.replace(new RegExp(hex, 'gi'), variable);
      }
      return processed;
    }
    
    // Converte cores diretas
    if (/^#[A-Fa-f0-9]{6}$/.test(value)) {
      return convertColorToVariable(value);
    }
    
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(processValue);
  }
  
  if (value && typeof value === 'object') {
    const processed: any = {};
    for (const [key, val] of Object.entries(value)) {
      processed[key] = processValue(val);
    }
    return processed;
  }
  
  return value;
}

function migrateTemplate(template: any): any {
  const migrated: any = {
    templateVersion: '3.2',
    metadata: template.metadata || {
      id: template.id || 'unknown',
      name: template.name || 'Unknown',
      description: template.description || '',
      category: template.category || 'question',
      tags: template.tags || [],
    },
    blocks: [],
  };
  
  // Processa blocos
  if (template.blocks && Array.isArray(template.blocks)) {
    for (const block of template.blocks) {
      const migratedBlock: any = {
        id: block.id,
        type: block.type,
      };
      
      // Usa APENAS properties (remove config duplicado)
      if (block.properties) {
        migratedBlock.properties = processValue(block.properties);
      } else if (block.config) {
        // Fallback: se só tem config, usa ele
        migratedBlock.properties = processValue(block.config);
      }
      
      migrated.blocks.push(migratedBlock);
    }
  }
  
  // Analytics (opcional)
  if (template.analytics) {
    migrated.analytics = template.analytics;
  }
  
  return migrated;
}

// ============================================
// FUNÇÕES DE ARQUIVO
// ============================================

function backupFile(filePath: string): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const fileName = path.basename(filePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupPath = path.join(BACKUP_DIR, `${timestamp}_${fileName}`);
  
  fs.copyFileSync(filePath, backupPath);
  log(`Backup criado: ${backupPath}`, 'info');
}

function migrateFile(filePath: string, dryRun: boolean = false): void {
  const fileName = path.basename(filePath);
  log(`\n📄 Processando: ${fileName}`, 'info');
  
  // Lê arquivo original
  const content = fs.readFileSync(filePath, 'utf-8');
  const template = JSON.parse(content);
  
  // Verifica se já está migrado
  if (template.templateVersion === '3.2') {
    log(`Já está na v3.2, pulando...`, 'warn');
    return;
  }
  
  // Backup
  if (!dryRun) {
    backupFile(filePath);
  }
  
  // Migra
  const migrated = migrateTemplate(template);
  
  // Estatísticas
  const originalSize = content.length;
  const migratedContent = JSON.stringify(migrated, null, 2);
  const migratedSize = migratedContent.length;
  const reduction = ((1 - migratedSize / originalSize) * 100).toFixed(1);
  
  log(`Tamanho: ${originalSize} → ${migratedSize} bytes (${reduction}% redução)`, 'info');
  
  // Salva
  if (!dryRun) {
    fs.writeFileSync(filePath, migratedContent, 'utf-8');
    log(`Migrado com sucesso!`, 'success');
  } else {
    log(`[DRY RUN] Não foi salvo`, 'warn');
  }
}

// ============================================
// MIGRAÇÃO EM MASSA
// ============================================

function migrateAllSteps(options: { dryRun?: boolean; stepNumber?: number } = {}) {
  const { dryRun = false, stepNumber } = options;
  
  log('\n🚀 INICIANDO MIGRAÇÃO DE TEMPLATES\n', 'info');
  
  if (dryRun) {
    log('⚠️  MODO DRY RUN - Nenhum arquivo será modificado\n', 'warn');
  }
  
  // Lista arquivos
  const files: string[] = [];
  
  if (stepNumber) {
    // Migra apenas um step
    const stepId = stepNumber.toString().padStart(2, '0');
    files.push(
      path.join(TEMPLATES_DIR, `step-${stepId}-template.json`),
      path.join(TEMPLATES_DIR, 'blocks', `step-${stepId}.json`)
    );
  } else {
    // Migra todos os steps
    for (let i = 1; i <= 21; i++) {
      const stepId = i.toString().padStart(2, '0');
      
      // Template original
      const templatePath = path.join(TEMPLATES_DIR, `step-${stepId}-template.json`);
      if (fs.existsSync(templatePath)) {
        files.push(templatePath);
      }
      
      // Blocks variant
      const blocksPath = path.join(TEMPLATES_DIR, 'blocks', `step-${stepId}.json`);
      if (fs.existsSync(blocksPath)) {
        files.push(blocksPath);
      }
    }
  }
  
  // Processa cada arquivo
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const filePath of files) {
    if (!fs.existsSync(filePath)) {
      log(`Arquivo não encontrado: ${filePath}`, 'warn');
      skipCount++;
      continue;
    }
    
    try {
      migrateFile(filePath, dryRun);
      successCount++;
    } catch (error) {
      log(`Erro ao processar ${path.basename(filePath)}: ${error}`, 'error');
      errorCount++;
    }
  }
  
  // Resumo
  log('\n📊 RESUMO DA MIGRAÇÃO\n', 'info');
  log(`✅ Sucesso: ${successCount}`, 'success');
  log(`⏭️  Pulados: ${skipCount}`, 'warn');
  log(`❌ Erros: ${errorCount}`, 'error');
  
  if (dryRun) {
    log('\n💡 Execute sem --dry-run para aplicar as mudanças', 'info');
  }
}

// ============================================
// CLI
// ============================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const stepArg = args.find(arg => arg.startsWith('--step='));
  const stepNumber = stepArg ? parseInt(stepArg.split('=')[1]) : undefined;
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔄 MIGRAÇÃO DE TEMPLATES v3.1 → v3.2

Uso:
  npx tsx scripts/migrate-templates.ts [opções]

Opções:
  --dry-run        Simula migração sem salvar arquivos
  --step=XX        Migra apenas o step XX (ex: --step=05)
  --help, -h       Mostra esta ajuda

Exemplos:
  npx tsx scripts/migrate-templates.ts
  npx tsx scripts/migrate-templates.ts --dry-run
  npx tsx scripts/migrate-templates.ts --step=10
    `);
    return;
  }
  
  migrateAllSteps({ dryRun, stepNumber });
}

main();
