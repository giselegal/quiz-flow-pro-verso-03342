#!/usr/bin/env node
/**
 * 🔍 VERIFICADOR DE TEMPLATES
 * 
 * Verifica integridade dos 21 steps do quiz
 * Garante que todos os arquivos existem e estão no formato correto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STEPS_DIR = path.join(__dirname, '..', 'public', 'templates', 'funnels', 'quiz21StepsComplete', 'steps');
const MASTER_FILE = path.join(__dirname, '..', 'public', 'templates', 'funnels', 'quiz21StepsComplete', 'master.v3.json');

const EXPECTED_STEPS = Array.from({ length: 21 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}.json`);

let errors = 0;
let warnings = 0;

console.log('🔍 Verificando templates do quiz...\n');

// 1. Verificar master.v3.json
console.log('📄 Verificando master.v3.json...');
if (!fs.existsSync(MASTER_FILE)) {
  console.error('❌ master.v3.json não encontrado!');
  errors++;
} else {
  try {
    const masterContent = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf-8'));
    
    if (!masterContent.steps || !Array.isArray(masterContent.steps)) {
      console.error('❌ master.v3.json não tem array de steps!');
      errors++;
    } else if (masterContent.steps.length !== 21) {
      console.error(`❌ master.v3.json tem ${masterContent.steps.length} steps, esperado 21!`);
      errors++;
    } else {
      console.log('✅ master.v3.json OK (21 steps)');
    }
  } catch (err) {
    console.error('❌ Erro ao ler master.v3.json:', err.message);
    errors++;
  }
}

// 2. Verificar diretório de steps
console.log('\n📁 Verificando diretório de steps...');
if (!fs.existsSync(STEPS_DIR)) {
  console.error('❌ Diretório de steps não encontrado!');
  errors++;
  process.exit(1);
}

// 3. Verificar cada step
console.log('\n📝 Verificando steps individuais...\n');

const foundSteps = fs.readdirSync(STEPS_DIR).filter(f => f.endsWith('.json'));

EXPECTED_STEPS.forEach((stepFile, index) => {
  const stepPath = path.join(STEPS_DIR, stepFile);
  const stepNum = index + 1;
  const stepId = `step-${String(stepNum).padStart(2, '0')}`;
  
  if (!fs.existsSync(stepPath)) {
    console.error(`❌ ${stepId}: Arquivo não encontrado`);
    errors++;
    return;
  }
  
  try {
    const stepContent = JSON.parse(fs.readFileSync(stepPath, 'utf-8'));
    
    // Verificar estrutura básica
    if (!stepContent.metadata) {
      console.warn(`⚠️  ${stepId}: Sem metadata`);
      warnings++;
    }
    
    if (!stepContent.blocks || !Array.isArray(stepContent.blocks)) {
      console.error(`❌ ${stepId}: Sem array de blocks`);
      errors++;
      return;
    }
    
    if (stepContent.blocks.length === 0) {
      console.warn(`⚠️  ${stepId}: Sem blocos (array vazio)`);
      warnings++;
    }
    
    // Verificar formato V3.1
    const hasOldFormat = stepContent.sections && Array.isArray(stepContent.sections);
    if (hasOldFormat) {
      console.warn(`⚠️  ${stepId}: Ainda usa formato V3 (sections[]), esperado V3.1 (blocks[])`);
      warnings++;
    }
    
    console.log(`✅ ${stepId}: OK (${stepContent.blocks.length} blocos)`);
    
  } catch (err) {
    console.error(`❌ ${stepId}: Erro ao ler JSON -`, err.message);
    errors++;
  }
});

// 4. Verificar steps extras
const extraSteps = foundSteps.filter(f => !EXPECTED_STEPS.includes(f));
if (extraSteps.length > 0) {
  console.warn(`\n⚠️  Steps extras encontrados: ${extraSteps.join(', ')}`);
  warnings++;
}

// 5. Resumo
console.log('\n' + '='.repeat(50));
console.log(`\n📊 RESUMO:\n`);
console.log(`✅ Steps encontrados: ${foundSteps.length}/21`);
console.log(`❌ Erros: ${errors}`);
console.log(`⚠️  Avisos: ${warnings}`);

if (errors > 0) {
  console.log('\n❌ FALHOU - Corrija os erros acima\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  PASSOU COM AVISOS - Considere corrigir\n');
  process.exit(0);
} else {
  console.log('\n✅ PERFEITO - Todos os templates válidos!\n');
  process.exit(0);
}
