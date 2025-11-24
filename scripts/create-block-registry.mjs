#!/usr/bin/env node
/**
 * 🔧 SCRIPT: CREATE BLOCK REGISTRY (Fase 2 - Normalização)
 *
 * OBJETIVO:
 * Extrair blocos duplicados de todos os steps e criar um registro central normalizado.
 *
 * ENTRADA:
 * - public/templates/step-XX-v3.json (21 arquivos)
 * - public/templates/quiz21-complete.json (master consolidado)
 *
 * SAÍDA:
 * - public/templates/blocks.json (registro de blocos únicos)
 * - public/templates/steps-refs/ (steps com apenas IDs)
 *
 * ESTRATÉGIA:
 * 1. Ler todos os blocos de todos os steps
 * 2. Detectar duplicatas por conteúdo (hash de propriedades essenciais)
 * 3. Atribuir IDs globais únicos (ex: "blk-intro-title-001")
 * 4. Gerar blocks.json com blocos únicos
 * 5. Gerar step-XX-refs.json com apenas array de blockIds
 *
 * USO:
 * node scripts/create-block-registry.mjs [--dry-run] [--verbose]
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const root = process.cwd();
const templatesDir = path.join(root, 'public', 'templates');
const outputDir = path.join(templatesDir, 'steps-refs');
const blocksOutputPath = path.join(templatesDir, 'blocks.json');

const dryRun = process.argv.includes('--dry-run');
const verbose = process.argv.includes('--verbose');

// Criar hash de bloco para detectar duplicatas
function hashBlock(block) {
  const essentials = {
    type: block.type,
    content: block.content,
    properties: block.properties,
  };
  const str = JSON.stringify(essentials, Object.keys(essentials).sort());
  return crypto.createHash('sha256').update(str).digest('hex').slice(0, 16);
}

// Gerar ID legível baseado no tipo do bloco
function generateBlockId(block, index) {
  const typeSlug = block.type.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  return `blk-${typeSlug}-${String(index).padStart(3, '0')}`;
}

// Ler todos os steps e coletar blocos
function collectBlocks() {
  const allBlocks = [];
  const stepBlockMap = {}; // stepId -> array de hashes

  // Tentar carregar quiz21-complete.json primeiro (mais rápido)
  const masterPath = path.join(templatesDir, 'quiz21-complete.json');
  if (fs.existsSync(masterPath)) {
    try {
      const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
      if (master.steps) {
        for (const [stepId, stepData] of Object.entries(master.steps)) {
          const blocks = Array.isArray(stepData) ? stepData : stepData.blocks;
          if (blocks) {
            stepBlockMap[stepId] = [];
            blocks.forEach(block => {
              allBlocks.push({ ...block, _sourceStep: stepId });
              stepBlockMap[stepId].push(hashBlock(block));
            });
            if (verbose) console.log(`✓ Coletado ${blocks.length} blocos de ${stepId} (master)`);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao ler master: ${error.message}`);
    }
  }

  // Coletar de arquivos individuais step-XX-v3.json (fallback/complemento)
  const stepFiles = fs.readdirSync(templatesDir)
    .filter(f => /^step-\d{2}-v3\.json$/.test(f))
    .sort();

  for (const file of stepFiles) {
    const stepId = file.replace('-v3.json', '');
    if (stepBlockMap[stepId]) {
      if (verbose) console.log(`⊘ Pulando ${stepId} (já coletado do master)`);
      continue;
    }

    const filePath = path.join(templatesDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const blocks = Array.isArray(data) ? data : data.blocks;
      if (blocks) {
        stepBlockMap[stepId] = [];
        blocks.forEach(block => {
          allBlocks.push({ ...block, _sourceStep: stepId });
          stepBlockMap[stepId].push(hashBlock(block));
        });
        if (verbose) console.log(`✓ Coletado ${blocks.length} blocos de ${stepId}`);
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao ler ${file}: ${error.message}`);
    }
  }

  return { allBlocks, stepBlockMap };
}

// Normalizar blocos (remover duplicatas)
function normalizeBlocks(allBlocks) {
  const hashToBlock = new Map();
  const hashToIds = new Map();
  const blockRegistry = {};
  let uniqueCount = 0;
  let duplicateCount = 0;

  allBlocks.forEach((block, index) => {
    const hash = hashBlock(block);
    
    if (!hashToBlock.has(hash)) {
      // Novo bloco único
      const blockId = generateBlockId(block, uniqueCount);
      const cleanBlock = { ...block };
      delete cleanBlock._sourceStep;
      
      blockRegistry[blockId] = cleanBlock;
      hashToBlock.set(hash, blockId);
      hashToIds.set(hash, [blockId]);
      uniqueCount++;
    } else {
      // Duplicata detectada
      duplicateCount++;
      if (verbose) {
        const originalId = hashToBlock.get(hash);
        console.log(`🔁 Duplicata: ${block.type} (${block._sourceStep}) = ${originalId}`);
      }
    }
  });

  return { blockRegistry, hashToBlock, uniqueCount, duplicateCount };
}

// Gerar step references (apenas IDs)
function generateStepReferences(stepBlockMap, hashToBlock) {
  const stepReferences = {};

  for (const [stepId, blockHashes] of Object.entries(stepBlockMap)) {
    const blockIds = blockHashes.map(hash => hashToBlock.get(hash));
    stepReferences[stepId] = {
      id: stepId,
      version: '4.0',
      blockIds,
    };
  }

  return stepReferences;
}

// Calcular economia de espaço
function calculateSavings(allBlocks, blockRegistry, stepReferences) {
  const originalSize = JSON.stringify({ steps: allBlocks }).length;
  const normalizedSize = JSON.stringify({
    blocks: blockRegistry,
    steps: stepReferences,
  }).length;
  
  const saved = originalSize - normalizedSize;
  const savedPercent = ((saved / originalSize) * 100).toFixed(1);
  
  return {
    originalSize,
    normalizedSize,
    saved,
    savedPercent,
  };
}

// Main
function main() {
  console.log('🚀 CRIANDO REGISTRO DE BLOCOS NORMALIZADO\n');

  // 1. Coletar blocos
  console.log('📥 Coletando blocos de todos os steps...');
  const { allBlocks, stepBlockMap } = collectBlocks();
  console.log(`✓ Total coletado: ${allBlocks.length} blocos de ${Object.keys(stepBlockMap).length} steps\n`);

  // 2. Normalizar (remover duplicatas)
  console.log('🔄 Normalizando blocos...');
  const { blockRegistry, hashToBlock, uniqueCount, duplicateCount } = normalizeBlocks(allBlocks);
  console.log(`✓ Blocos únicos: ${uniqueCount}`);
  console.log(`✓ Duplicatas removidas: ${duplicateCount}\n`);

  // 3. Gerar step references
  console.log('🔗 Gerando referências de steps...');
  const stepReferences = generateStepReferences(stepBlockMap, hashToBlock);
  console.log(`✓ ${Object.keys(stepReferences).length} steps convertidos para referências\n`);

  // 4. Calcular economia
  const savings = calculateSavings(allBlocks, blockRegistry, stepReferences);
  console.log('💾 ECONOMIA DE ESPAÇO:');
  console.log(`  Original: ${(savings.originalSize / 1024).toFixed(2)} KB`);
  console.log(`  Normalizado: ${(savings.normalizedSize / 1024).toFixed(2)} KB`);
  console.log(`  Economia: ${(savings.saved / 1024).toFixed(2)} KB (${savings.savedPercent}%)\n`);

  // 5. Salvar arquivos
  if (dryRun) {
    console.log('🔍 DRY-RUN: Nenhum arquivo foi escrito.');
    console.log('\nArquivos que seriam criados:');
    console.log(`  - ${blocksOutputPath}`);
    console.log(`  - ${outputDir}/step-XX-ref.json (${Object.keys(stepReferences).length} arquivos)`);
  } else {
    // Criar diretório de saída
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Salvar blocks.json
    fs.writeFileSync(
      blocksOutputPath,
      JSON.stringify({ version: '4.0', blocks: blockRegistry }, null, 2),
      'utf8'
    );
    console.log(`✅ Criado: ${blocksOutputPath}`);

    // Salvar step references
    let savedCount = 0;
    for (const [stepId, stepRef] of Object.entries(stepReferences)) {
      const refPath = path.join(outputDir, `${stepId}-ref.json`);
      fs.writeFileSync(refPath, JSON.stringify(stepRef, null, 2), 'utf8');
      savedCount++;
    }
    console.log(`✅ Criados: ${savedCount} arquivos de referência em ${outputDir}/\n`);
  }

  // 6. Resumo final
  console.log('📊 RESUMO:');
  console.log(`  Total de blocos processados: ${allBlocks.length}`);
  console.log(`  Blocos únicos no registry: ${uniqueCount}`);
  console.log(`  Taxa de duplicação: ${((duplicateCount / allBlocks.length) * 100).toFixed(1)}%`);
  console.log(`  Steps processados: ${Object.keys(stepReferences).length}`);
  console.log(`  Economia total: ${savings.savedPercent}% (${(savings.saved / 1024).toFixed(2)} KB)`);
  
  if (dryRun) {
    console.log('\n💡 Execute sem --dry-run para criar os arquivos.');
  }
}

main();
