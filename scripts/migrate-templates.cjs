#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const BACKUP_DIR = path.join(TEMPLATES_DIR, 'backups');

const URL_TO_ASSET_MAP = {
  'Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png': 'hero-intro',
  'LOGO_DA_MARCA_GISELE_l78gin.png': 'logo-main',
  '/v1744735447/1_cfccze.png': 'q-natural-1',
  '/v1744735449/2_s0idhw.png': 'q-classico-1',
  '/v1744735452/6_mwhjxb.png': 'q-contemporaneo-1',
  '/v1744735451/5_ozpk9f.png': 'q-elegante-1',
  '/v1744735451/4_kwq2ib.png': 'q-romantico-1',
  '/v1744735454/8_m7c6xm.png': 'q-sexy-1',
  '/v1744735453/7_ocp7jn.png': 'q-dramatico-1',
  '/v1744735450/3_hkqdmx.png': 'q-criativo-1',
};

const COLOR_MAP = {
  '#B89B7A': '{{theme.colors.primary}}',
  '#b89b7a': '{{theme.colors.primary}}',
  '#432818': '{{theme.colors.secondary}}',
  '#fffaf7': '{{theme.colors.background}}',
};

function log(message, type = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', warn: '⚠️' };
  console.log(`${icons[type]} ${message}`);
}

function convertUrlToAsset(url) {
  for (const [pattern, assetId] of Object.entries(URL_TO_ASSET_MAP)) {
    if (url.includes(pattern)) {
      return `{{assets.${assetId}}}`;
    }
  }
  if (url.includes('cloudinary.com')) {
    log(`URL não mapeada: ${url.substring(0, 80)}...`, 'warn');
  }
  return url;
}

function convertColorToVariable(color) {
  return COLOR_MAP[color] || color;
}

function processValue(value) {
  if (typeof value === 'string') {
    if (value.includes('cloudinary.com') || value.includes('http')) {
      return convertUrlToAsset(value);
    }
    if (value.includes('style=') && value.includes('#')) {
      let processed = value;
      for (const [hex, variable] of Object.entries(COLOR_MAP)) {
        processed = processed.replace(new RegExp(hex, 'gi'), variable);
      }
      return processed;
    }
    if (/^#[A-Fa-f0-9]{6}$/.test(value)) {
      return convertColorToVariable(value);
    }
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(processValue);
  }
  
  if (value && typeof value === 'object') {
    const processed = {};
    for (const [key, val] of Object.entries(value)) {
      processed[key] = processValue(val);
    }
    return processed;
  }
  
  return value;
}

function migrateTemplate(template) {
  const migrated = {
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
  
  if (template.blocks && Array.isArray(template.blocks)) {
    for (const block of template.blocks) {
      const migratedBlock = {
        id: block.id,
        type: block.type,
      };
      
      if (block.properties) {
        migratedBlock.properties = processValue(block.properties);
      } else if (block.config) {
        migratedBlock.properties = processValue(block.config);
      }
      
      migrated.blocks.push(migratedBlock);
    }
  }
  
  if (template.analytics) {
    migrated.analytics = template.analytics;
  }
  
  return migrated;
}

function backupFile(filePath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const fileName = path.basename(filePath);
  const timestamp = new Date().toISOString().split('T')[0];
  const backupPath = path.join(BACKUP_DIR, `${timestamp}_${fileName}`);
  
  fs.copyFileSync(filePath, backupPath);
}

function migrateFile(filePath, dryRun = false) {
  const fileName = path.basename(filePath);
  log(`\n📄 Processando: ${fileName}`, 'info');
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const template = JSON.parse(content);
  
  if (template.templateVersion === '3.2') {
    log(`Já está na v3.2, pulando...`, 'warn');
    return;
  }
  
  if (!dryRun) {
    backupFile(filePath);
  }
  
  const migrated = migrateTemplate(template);
  const originalSize = content.length;
  const migratedContent = JSON.stringify(migrated, null, 2);
  const migratedSize = migratedContent.length;
  const reduction = ((1 - migratedSize / originalSize) * 100).toFixed(1);
  
  log(`Tamanho: ${originalSize} → ${migratedSize} bytes (${reduction}% redução)`, 'info');
  
  if (!dryRun) {
    fs.writeFileSync(filePath, migratedContent, 'utf-8');
    log(`Migrado com sucesso!`, 'success');
  } else {
    log(`[DRY RUN] Não foi salvo`, 'warn');
  }
}

function migrateAllSteps(options = {}) {
  const { dryRun = false, stepNumber } = options;
  
  log('\n🚀 INICIANDO MIGRAÇÃO DE TEMPLATES\n', 'info');
  
  if (dryRun) {
    log('⚠️  MODO DRY RUN - Nenhum arquivo será modificado\n', 'warn');
  }
  
  const files = [];
  
  if (stepNumber) {
    const stepId = stepNumber.toString().padStart(2, '0');
    files.push(
      path.join(TEMPLATES_DIR, `step-${stepId}-template.json`),
      path.join(TEMPLATES_DIR, 'blocks', `step-${stepId}.json`)
    );
  } else {
    for (let i = 1; i <= 21; i++) {
      const stepId = i.toString().padStart(2, '0');
      const templatePath = path.join(TEMPLATES_DIR, `step-${stepId}-template.json`);
      if (fs.existsSync(templatePath)) {
        files.push(templatePath);
      }
      const blocksPath = path.join(TEMPLATES_DIR, 'blocks', `step-${stepId}.json`);
      if (fs.existsSync(blocksPath)) {
        files.push(blocksPath);
      }
    }
  }
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const filePath of files) {
    if (!fs.existsSync(filePath)) {
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
  
  log('\n📊 RESUMO DA MIGRAÇÃO\n', 'info');
  log(`✅ Sucesso: ${successCount}`, 'success');
  log(`⏭️  Pulados: ${skipCount}`, 'warn');
  log(`❌ Erros: ${errorCount}`, 'error');
  
  if (dryRun) {
    log('\n💡 Execute sem --dry-run para aplicar as mudanças', 'info');
  }
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const stepArg = args.find(arg => arg.startsWith('--step='));
const stepNumber = stepArg ? parseInt(stepArg.split('=')[1]) : undefined;

migrateAllSteps({ dryRun, stepNumber });
