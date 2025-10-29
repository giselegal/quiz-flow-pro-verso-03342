#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO: Steps 1-21 - Origem e Estrutura dos JSONs
 * 
 * Testa todas as fontes possíveis de dados para cada step:
 * 1. Master JSON (public/templates/quiz21-complete.json)
 * 2. Per-step JSON (public/templates/blocks/step-XX.json)
 * 3. TypeScript template (src/templates/quiz21StepsComplete.ts)
 * 
 * Resultado: Tabela mostrando qual fonte tem blocos para cada step
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 DIAGNÓSTICO: Steps 1-21 - Origem dos Dados\n');
console.log('═'.repeat(80));

// Estrutura para armazenar resultados
const results = [];

// 1. Verificar Master JSON
console.log('\n📦 1. Verificando Master JSON (quiz21-complete.json)...\n');
const masterPath = path.join(rootDir, 'public/templates/quiz21-complete.json');
let masterData = null;

try {
  const masterContent = fs.readFileSync(masterPath, 'utf-8');
  masterData = JSON.parse(masterContent);
  console.log(`✅ Master JSON carregado: ${Object.keys(masterData.steps || {}).length} steps encontrados`);
} catch (err) {
  console.error(`❌ Erro ao carregar Master JSON:`, err.message);
}

// 2. Verificar per-step JSONs
console.log('\n📦 2. Verificando per-step JSONs (public/templates/blocks/)...\n');
const blocksDir = path.join(rootDir, 'public/templates/blocks');
const perStepFiles = {};

try {
  const files = fs.readdirSync(blocksDir);
  for (const file of files) {
    if (file.match(/^step-\d{2}\.json$/)) {
      const stepId = file.replace('.json', '');
      const filePath = path.join(blocksDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        perStepFiles[stepId] = {
          blocks: Array.isArray(data.blocks) ? data.blocks.length : 0,
          sections: Array.isArray(data.sections) ? data.sections.length : 0,
          metadata: data.metadata || {},
        };
      } catch (err) {
        console.warn(`⚠️ Erro ao ler ${file}:`, err.message);
      }
    }
  }
  console.log(`✅ Per-step JSONs encontrados: ${Object.keys(perStepFiles).length} arquivos`);
} catch (err) {
  console.error(`❌ Erro ao ler diretório blocks:`, err.message);
}

// 3. Analisar cada step (1-21)
console.log('\n📊 3. Análise detalhada por step:\n');
console.log('─'.repeat(80));
console.log('Step  │ Master Blocks │ Per-Step Blocks │ Status         │ Fonte Primária');
console.log('─'.repeat(80));

for (let i = 1; i <= 21; i++) {
  const stepId = `step-${String(i).padStart(2, '0')}`;
  
  // Master JSON
  const masterStep = masterData?.steps?.[stepId];
  const masterBlocks = Array.isArray(masterStep?.blocks) ? masterStep.blocks.length : 0;
  const masterSections = Array.isArray(masterStep?.sections) ? masterStep.sections.length : 0;
  
  // Per-step JSON
  const perStepData = perStepFiles[stepId];
  const perStepBlocks = perStepData?.blocks || 0;
  const perStepSections = perStepData?.sections || 0;
  
  // Determinar status e fonte
  let status = '❌ SEM DADOS';
  let source = 'NENHUMA';
  
  if (masterBlocks > 0) {
    status = '✅ OK';
    source = 'Master JSON';
  } else if (perStepBlocks > 0) {
    status = '✅ OK';
    source = 'Per-Step JSON';
  } else if (masterSections > 0 || perStepSections > 0) {
    status = '⚠️ SECTIONS';
    source = masterSections > 0 ? 'Master (sections)' : 'Per-Step (sections)';
  }
  
  results.push({
    stepId,
    masterBlocks,
    masterSections,
    perStepBlocks,
    perStepSections,
    status,
    source,
  });
  
  console.log(
    `${stepId} │ ${String(masterBlocks).padStart(13)} │ ${String(perStepBlocks).padStart(15)} │ ${status.padEnd(14)} │ ${source}`
  );
}

console.log('─'.repeat(80));

// 4. Resumo
console.log('\n📈 RESUMO:\n');

const okCount = results.filter(r => r.status === '✅ OK').length;
const sectionsCount = results.filter(r => r.status === '⚠️ SECTIONS').length;
const emptyCount = results.filter(r => r.status === '❌ SEM DADOS').length;

console.log(`✅ Steps com blocos:     ${okCount}/21`);
console.log(`⚠️ Steps com sections:   ${sectionsCount}/21`);
console.log(`❌ Steps sem dados:      ${emptyCount}/21`);

// 5. Detalhes dos steps problemáticos (1-3)
console.log('\n🔍 DETALHAMENTO: Steps 1-3 (problema reportado)\n');
console.log('─'.repeat(80));

for (let i = 1; i <= 3; i++) {
  const stepId = `step-${String(i).padStart(2, '0')}`;
  const result = results.find(r => r.stepId === stepId);
  
  console.log(`\n${stepId}:`);
  console.log(`  Master JSON:`);
  console.log(`    - blocks: ${result.masterBlocks}`);
  console.log(`    - sections: ${result.masterSections}`);
  console.log(`  Per-Step JSON:`);
  console.log(`    - blocks: ${result.perStepBlocks}`);
  console.log(`    - sections: ${result.perStepSections}`);
  console.log(`  Status: ${result.status}`);
  console.log(`  Fonte: ${result.source}`);
  
  // Mostrar primeiros blocos se existirem
  if (result.masterBlocks > 0 && masterData?.steps?.[stepId]?.blocks) {
    const blocks = masterData.steps[stepId].blocks;
    console.log(`  Primeiros blocos no Master:`);
    blocks.slice(0, 2).forEach((b, idx) => {
      console.log(`    ${idx + 1}. ${b.type} (id: ${b.id})`);
    });
  }
  
  if (result.perStepBlocks > 0 && perStepFiles[stepId]) {
    const filePath = path.join(blocksDir, `${stepId}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`  Primeiros blocos no Per-Step:`);
    data.blocks.slice(0, 2).forEach((b, idx) => {
      console.log(`    ${idx + 1}. ${b.type} (id: ${b.id})`);
    });
  }
}

console.log('\n═'.repeat(80));
console.log('✅ Diagnóstico concluído!\n');

// Exportar JSON para análise programática
const outputPath = path.join(rootDir, 'diagnostic-steps-1-21-results.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`📄 Resultados salvos em: ${outputPath}\n`);
