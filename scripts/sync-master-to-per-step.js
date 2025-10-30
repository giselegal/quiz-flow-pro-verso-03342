#!/usr/bin/env node
/**
 * Script de Build: Sincroniza quiz21-complete.json → per-step JSONs
 * Uso: npm run blocks:sync-master
 */

import fs from 'fs/promises';
import path from 'path';

async function syncMasterToPerStep() {
  console.log('🔄 Sincronizando master JSON → per-step JSONs...');

  // 1. Carregar master JSON
  const masterPath = path.resolve('public/templates/quiz21-complete.json');
  const raw = await fs.readFile(masterPath, 'utf8');
  const master = JSON.parse(raw);

  // 2. Extrair steps (compat: steps como objeto ou array)
  const stepsObj = master.steps || {};
  const stepIds = Object.keys(stepsObj).sort();
  console.log(`📊 Encontrados ${stepIds.length} steps no master`);

  // 3. Gerar per-step JSONs
  const outputDir = path.resolve('public/templates/blocks');
  await fs.mkdir(outputDir, { recursive: true });

  for (const stepId of stepIds) {
    const stepNum = stepId.replace('step-', '').padStart(2, '0');
    const outputPath = path.join(outputDir, `step-${stepNum}.json`);
    const step = stepsObj[stepId];

    const stepData = {
      id: `step-${stepNum}`,
      title: step?.metadata?.name || `Step ${parseInt(stepNum, 10)}`,
      blocks: Array.isArray(step?.blocks) ? step.blocks : [],
      metadata: {
        version: master?.metadata?.version || master?.templateVersion || '3.0',
        generatedFrom: 'master',
        generatedAt: new Date().toISOString(),
      },
    };

    await fs.writeFile(outputPath, JSON.stringify(stepData, null, 2), 'utf8');
    console.log(`✅ Generated: ${path.relative(process.cwd(), outputPath)}`);
  }

  console.log(`\n🎉 Sync completo: ${stepIds.length} arquivos gerados`);
}

syncMasterToPerStep().catch((err) => {
  console.error('❌ Falha ao sincronizar master → per-step:', err);
  process.exit(1);
});
