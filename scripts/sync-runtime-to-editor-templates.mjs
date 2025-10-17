#!/usr/bin/env node
/**
 * 🔄 SINCRONIZAÇÃO: config/templates → data/modularSteps
 * 
 * Este script sincroniza os blocos dos templates de runtime
 * para os templates do editor, mantendo apenas os blocos essenciais
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

console.log('\n' + '='.repeat(80));
console.log('🔄 SINCRONIZAÇÃO: Runtime → Editor Templates');
console.log('='.repeat(80) + '\n');

const stepsToSync = [
  { id: 'step-12', name: 'Step 12 - Transição Interativa' },
  { id: 'step-19', name: 'Step 19 - Pergunta Estratégica' },
  { id: 'step-20', name: 'Step 20 - Resultado' },
];

for (const { id, name } of stepsToSync) {
  console.log(`\n📦 Processando ${name}...`);
  
  // Ler template de runtime (completo)
  const runtimePath = join(ROOT, `src/config/templates/${id}.json`);
  const runtimeTemplate = JSON.parse(readFileSync(runtimePath, 'utf-8'));
  
  console.log(`   Runtime: ${runtimeTemplate.blocks.length} blocos`);
  runtimeTemplate.blocks.forEach(b => console.log(`     - ${b.type}`));
  
  // Criar template simplificado para editor
  const editorTemplate = {
    id,
    type: runtimeTemplate.metadata.type,
    title: runtimeTemplate.metadata.name,
    blocks: runtimeTemplate.blocks.map((block, index) => ({
      id: block.id,
      type: block.type,
      order: index,
      properties: block.properties || {},
      content: block.content || block.properties?.content || {}
    }))
  };
  
  // Salvar no data/modularSteps
  const editorPath = join(ROOT, `src/data/modularSteps/${id}.json`);
  writeFileSync(editorPath, JSON.stringify(editorTemplate, null, 2), 'utf-8');
  
  console.log(`   ✅ Editor atualizado: ${editorTemplate.blocks.length} blocos`);
  console.log(`   📁 Salvo em: ${editorPath}`);
}

console.log('\n' + '='.repeat(80));
console.log('✅ SINCRONIZAÇÃO COMPLETA!');
console.log('='.repeat(80));
console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('   1. Verificar arquivos atualizados em src/data/modularSteps/');
console.log('   2. Testar editor com os novos blocos');
console.log('   3. Confirmar que blocos renderizam corretamente\n');
