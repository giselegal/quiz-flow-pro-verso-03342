#!/usr/bin/env node

/**
 * 🧪 VALIDAÇÃO DE SCHEMA ZOD
 * 
 * Valida quiz21-v4.json contra o schema Zod
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Simular importação do schema Zod (em produção seria import real)
console.log('\n🧪 VALIDAÇÃO DE SCHEMA ZOD\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const v4Path = path.join(ROOT, 'public/templates/quiz21-v4.json');

if (!fs.existsSync(v4Path)) {
  console.error('❌ Arquivo não encontrado:', v4Path);
  console.log('\n💡 Execute primeiro: node scripts/migrate-to-v4.mjs\n');
  process.exit(1);
}

console.log('📂 Carregando quiz21-v4.json...');
const data = JSON.parse(fs.readFileSync(v4Path, 'utf8'));
console.log('✅ Arquivo carregado\n');

// Validações manuais (simulando Zod até build TypeScript estar pronto)
const errors = [];
const warnings = [];

console.log('🔍 Validando estrutura...\n');

// 1. Validar version
if (!data.version || !/^\d+\.\d+\.\d+$/.test(data.version)) {
  errors.push('❌ version: deve ser semver (x.y.z)');
} else {
  console.log(`✅ version: ${data.version}`);
}

// 2. Validar schemaVersion
if (!data.schemaVersion || !/^\d+\.\d+$/.test(data.schemaVersion)) {
  errors.push('❌ schemaVersion: deve ser x.y');
} else {
  console.log(`✅ schemaVersion: ${data.schemaVersion}`);
}

// 3. Validar metadata
if (!data.metadata?.id) errors.push('❌ metadata.id: obrigatório');
if (!data.metadata?.name) errors.push('❌ metadata.name: obrigatório');
if (!data.metadata?.author) errors.push('❌ metadata.author: obrigatório');
if (data.metadata?.id) console.log(`✅ metadata.id: ${data.metadata.id}`);

// 4. Validar theme
if (!data.theme?.colors?.primary) {
  errors.push('❌ theme.colors.primary: obrigatório');
} else if (!/^#[0-9A-F]{6}$/i.test(data.theme.colors.primary)) {
  errors.push('❌ theme.colors.primary: deve ser hexadecimal');
} else {
  console.log(`✅ theme.colors.primary: ${data.theme.colors.primary}`);
}

// 5. Validar settings
if (!data.settings?.scoring) {
  errors.push('❌ settings.scoring: obrigatório');
} else {
  console.log(`✅ settings.scoring.method: ${data.settings.scoring.method}`);
}

// 6. Validar steps
if (!Array.isArray(data.steps) || data.steps.length === 0) {
  errors.push('❌ steps: deve ser array não-vazio');
} else {
  console.log(`✅ steps: ${data.steps.length} steps encontrados`);
  
  data.steps.forEach((step, index) => {
    const stepNum = index + 1;
    
    // Validar step ID
    if (!step.id || !/^step-\d{2}$/.test(step.id)) {
      errors.push(`❌ steps[${stepNum}].id: deve ser "step-XX"`);
    }
    
    // Validar blocks
    if (!Array.isArray(step.blocks) || step.blocks.length === 0) {
      errors.push(`❌ steps[${stepNum}].blocks: deve ter pelo menos 1 block`);
    } else {
      // Validar cada block
      step.blocks.forEach((block, blockIndex) => {
        if (!block.id) {
          errors.push(`❌ steps[${stepNum}].blocks[${blockIndex}].id: obrigatório`);
        }
        if (!block.type) {
          errors.push(`❌ steps[${stepNum}].blocks[${blockIndex}].type: obrigatório`);
        }
        if (typeof block.order !== 'number') {
          errors.push(`❌ steps[${stepNum}].blocks[${blockIndex}].order: deve ser número`);
        }
      });
      
      // Verificar orders duplicados
      const orders = step.blocks.map(b => b.order);
      const duplicates = orders.filter((o, i) => orders.indexOf(o) !== i);
      if (duplicates.length > 0) {
        warnings.push(`⚠️  steps[${stepNum}]: orders duplicados - ${duplicates.join(', ')}`);
      }
    }
    
    // Validar navigation
    if (!step.navigation) {
      warnings.push(`⚠️  steps[${stepNum}].navigation: recomendado`);
    }
  });
}

// 7. Validar blockLibrary
if (!data.blockLibrary) {
  warnings.push('⚠️  blockLibrary: recomendado para melhor DX');
} else {
  console.log(`✅ blockLibrary: ${Object.keys(data.blockLibrary).length} block types`);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 RESULTADO DA VALIDAÇÃO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ SCHEMA VÁLIDO - Nenhum erro encontrado!\n');
  
  console.log('📊 Estatísticas:');
  console.log(`  • Steps: ${data.steps.length}`);
  console.log(`  • Total de blocks: ${data.steps.reduce((sum, s) => sum + s.blocks.length, 0)}`);
  console.log(`  • Block types: ${new Set(data.steps.flatMap(s => s.blocks.map(b => b.type))).size}`);
  console.log(`  • Scoring categories: ${data.settings.scoring.categories?.length || 0}`);
  console.log('');
  
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('❌ ERROS CRÍTICOS:\n');
    errors.forEach(err => console.log(`  ${err}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  AVISOS:\n');
    warnings.forEach(warn => console.log(`  ${warn}`));
    console.log('');
  }
  
  console.log(`📊 Total: ${errors.length} erros, ${warnings.length} avisos\n`);
  process.exit(errors.length > 0 ? 1 : 0);
}
