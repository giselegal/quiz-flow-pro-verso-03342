#!/usr/bin/env tsx
/**
 * 🔄 NORMALIZADOR: Converte sections → blocks em quiz21-complete.json
 * 
 * Problema:
 * - quiz21-complete.json usa "sections" para o que deveria ser "blocks"
 * - Arquitetura de blocos atômicos não está sendo respeitada
 * - Ambiguidade entre sections e blocks
 * 
 * Solução:
 * - Converter todas as "sections" em "blocks" atômicos
 * - Manter metadata, theme, navigation
 * - Única fonte de verdade: quiz21-complete.json
 * 
 * Uso:
 *   npx tsx scripts/normalize-quiz21-complete.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MASTER_PATH = path.join(__dirname, '../public/templates/quiz21-complete.json');
const BACKUP_PATH = path.join(__dirname, '../public/templates/quiz21-complete.json.backup-sections');

interface Section {
  type: string;
  id: string;
  content?: any;
  style?: any;
  animation?: any;
  [key: string]: any;
}

interface Block {
  id: string;
  type: string;
  order: number;
  properties: any;
  content: any;
  parentId: string | null;
}

/**
 * Converte uma section para o formato Block
 */
function convertSectionToBlock(section: Section, order: number): Block {
  const { type, id, content, style, animation, ...rest } = section;

  return {
    id: id || `${type}-${order}`,
    type,
    order,
    properties: {
      ...(style || {}),
      ...(animation || {}),
      ...rest, // Outras propriedades ficam em properties
    },
    content: content || {},
    parentId: null, // Blocos top-level do step (sem hierarquia por enquanto)
  };
}

/**
 * Normaliza o quiz21-complete.json
 */
function normalizeMaster() {
  console.log('🔄 NORMALIZADOR: quiz21-complete.json\n');
  console.log('📋 Convertendo sections → blocks...\n');

  // 1. Carregar master
  if (!fs.existsSync(MASTER_PATH)) {
    console.error(`❌ Arquivo não encontrado: ${MASTER_PATH}`);
    process.exit(1);
  }

  const master = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));

  // 2. Criar backup
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(master, null, 2), 'utf8');
  console.log(`💾 Backup criado: ${path.basename(BACKUP_PATH)}\n`);

  // 3. Converter cada step
  let convertedSteps = 0;
  let totalBlocks = 0;

  for (const [stepId, stepData] of Object.entries(master.steps) as any) {
    if (Array.isArray(stepData.sections)) {
      // Converter sections → blocks
      const blocks = stepData.sections.map((section: Section, index: number) => 
        convertSectionToBlock(section, index)
      );

      stepData.blocks = blocks;
      totalBlocks += blocks.length;

      console.log(`  ✓ ${stepId}: ${stepData.sections.length} sections → ${blocks.length} blocks`);

      // Remover propriedade obsoleta
      delete stepData.sections;
      convertedSteps++;
    } else if (Array.isArray(stepData.blocks)) {
      console.log(`  ⏭️  ${stepId}: já usa blocks (${stepData.blocks.length} blocos)`);
    } else {
      console.log(`  ⚠️  ${stepId}: sem sections nem blocks`);
    }
  }

  // 4. Atualizar metadata
  if (!master.metadata) {
    master.metadata = {};
  }

  master.metadata.updatedAt = new Date().toISOString();
  master.metadata.normalized = true;
  master.metadata.structure = 'blocks';
  master.metadata.normalizedBy = 'scripts/normalize-quiz21-complete.ts';

  // 5. Salvar
  fs.writeFileSync(MASTER_PATH, JSON.stringify(master, null, 2), 'utf8');

  console.log(`\n✅ NORMALIZAÇÃO CONCLUÍDA!\n`);
  console.log(`   Steps convertidos: ${convertedSteps}/${Object.keys(master.steps).length}`);
  console.log(`   Total de blocos: ${totalBlocks}`);
  console.log(`   Arquivo atualizado: ${path.basename(MASTER_PATH)}`);
  console.log(`   Backup disponível: ${path.basename(BACKUP_PATH)}`);
  console.log(`\n📝 Próximos passos:`);
  console.log(`   1. Validar estrutura: npx tsx scripts/validate-templates.ts`);
  console.log(`   2. Gerar TypeScript: npm run generate:templates`);
  console.log(`   3. Testar renderização: npm run dev`);
}

/**
 * Reverter normalização (restaurar do backup)
 */
function revertNormalization() {
  if (!fs.existsSync(BACKUP_PATH)) {
    console.error(`❌ Backup não encontrado: ${BACKUP_PATH}`);
    process.exit(1);
  }

  const backup = fs.readFileSync(BACKUP_PATH, 'utf8');
  fs.writeFileSync(MASTER_PATH, backup, 'utf8');

  console.log('↩️  Normalização revertida com sucesso!');
  console.log(`   Restaurado de: ${path.basename(BACKUP_PATH)}`);
}

// CLI
const args = process.argv.slice(2);

if (args.includes('--revert')) {
  revertNormalization();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🔄 NORMALIZADOR: quiz21-complete.json

Uso:
  npx tsx scripts/normalize-quiz21-complete.ts           # Normalizar
  npx tsx scripts/normalize-quiz21-complete.ts --revert  # Reverter

Opções:
  --revert    Reverter para backup (restaurar sections)
  --help, -h  Mostrar esta ajuda
  `);
} else {
  normalizeMaster();
}
