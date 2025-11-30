/**
 * Script para adicionar metadata obrigatório em todos os blocos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/templates/quiz21-v4.json');

console.log('📝 Lendo arquivo:', filePath);
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let blocksUpdated = 0;

// Adicionar metadata a todos os blocos
data.steps.forEach((step, stepIndex) => {
  step.blocks.forEach((block, blockIndex) => {
    if (!block.metadata) {
      block.metadata = {
        editable: true,
        reorderable: true,
        reusable: true,
        deletable: true
      };
      blocksUpdated++;
      console.log(`✅ Step ${stepIndex + 1} (${step.id}), Block ${blockIndex + 1} (${block.id}): metadata adicionado`);
    }
  });
});

// Salvar arquivo
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log('\n📊 Resumo:');
console.log('Total de steps:', data.steps.length);
console.log('Total de blocos:', data.steps.reduce((acc, s) => acc + s.blocks.length, 0));
console.log('Blocos atualizados:', blocksUpdated);
console.log('\n✅ Arquivo salvo com sucesso!');
