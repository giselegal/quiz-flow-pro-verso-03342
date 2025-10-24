#!/usr/bin/env node

/**
 * 🎯 POPULATE EDITOR FROM MASTER JSON
 * 
 * Carrega os 21 steps do quiz21-complete.json e popula o EditorService
 * para que apareçam automaticamente no /editor
 * 
 * USO:
 *   node scripts/populate-editor-from-master.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const MASTER_JSON_PATH = path.join(__dirname, '../public/templates/quiz21-complete.json');
const OUTPUT_PATH = path.join(__dirname, '../public/templates/generated-quiz-steps.json');

console.log('🎯 Carregando quiz21-complete.json...');

// Load master JSON
const masterData = JSON.parse(fs.readFileSync(MASTER_JSON_PATH, 'utf-8'));

console.log(`✅ Master JSON carregado: ${Object.keys(masterData.steps || {}).length} steps`);

// Convert to EditorService format
const editorBlocks = [];
let blockOrder = 0;

// Process each step
const stepIds = Object.keys(masterData.steps).sort();

stepIds.forEach((stepId, stepIndex) => {
  const stepData = masterData.steps[stepId];
  const sections = stepData.sections || [];
  
  console.log(`📦 Processando ${stepId}: ${sections.length} sections`);
  
  // Cada section É um bloco
  sections.forEach((section, sectionIndex) => {
    const editorBlock = {
      id: section.id || `${stepId}-${section.type}-${sectionIndex}`,
      type: section.type,
      content: section.content || {},
      style: section.style || {},
      layout: {
        order: blockOrder++,
        parent: stepId,
        colspan: 1
      },
      metadata: {
        stepId,
        stepNumber: stepIndex + 1,
        sectionIndex,
        animation: section.animation,
        ...section.metadata
      }
    };
    
    editorBlocks.push(editorBlock);
  });
});

console.log(`✅ Total de blocos gerados: ${editorBlocks.length}`);

// Create output structure
const output = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  templateId: 'quiz21StepsComplete',
  totalSteps: stepIds.length,
  totalBlocks: editorBlocks.length,
  blocks: editorBlocks,
  metadata: {
    source: 'quiz21-complete.json',
    steps: stepIds.map((id, index) => ({
      id,
      order: index + 1,
      blockCount: editorBlocks.filter(b => b.metadata.stepId === id).length
    }))
  }
};

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write output
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

console.log(`✅ Arquivo gerado: ${OUTPUT_PATH}`);
console.log(`📊 Estatísticas:`);
console.log(`   - Steps: ${output.totalSteps}`);
console.log(`   - Blocos: ${output.totalBlocks}`);
console.log(`   - Média: ${(output.totalBlocks / output.totalSteps).toFixed(1)} blocos/step`);

// Print distribution
console.log(`\n📈 Distribuição de blocos por step:`);
output.metadata.steps.forEach(step => {
  const bar = '█'.repeat(Math.ceil(step.blockCount / 2));
  console.log(`   ${step.id}: ${bar} ${step.blockCount}`);
});

console.log('\n✅ Pronto! Execute o servidor para ver os blocos no editor.');
