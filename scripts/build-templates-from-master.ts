#!/usr/bin/env tsx
/**
 * 🔧 GERADOR DE TEMPLATES v2 - Leitura do quiz21-complete.json
 * 
 * Este script lê DIRETAMENTE do quiz21-complete.json (master normalizado)
 * e gera src/templates/quiz21StepsComplete.ts e src/templates/embedded.ts
 * 
 * Mudanças vs generate-templates.ts:
 * - Lê de quiz21-complete.json (único source of truth)
 * - Não lê step-XX-v3.json individuais
 * - Espera estrutura de blocks (não sections)
 * 
 * Uso:
 *   npm run build:templates
 *   ou
 *   npx tsx scripts/build-templates-from-master.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MASTER_PATH = path.join(__dirname, '../public/templates/quiz21-complete.json');
const OUTPUT_TS = path.join(__dirname, '../src/templates/quiz21StepsComplete.ts');
const OUTPUT_EMBEDDED = path.join(__dirname, '../src/templates/embedded.ts');

// Cores ANSI
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Carrega o quiz21-complete.json
 */
function loadMaster(): any {
  if (!fs.existsSync(MASTER_PATH)) {
    log(`❌ Arquivo não encontrado: ${MASTER_PATH}`, colors.red);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(MASTER_PATH, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`❌ Erro ao ler master JSON: ${error}`, colors.red);
    process.exit(1);
  }
}

/**
 * Gera o código TypeScript para um step
 */
function generateStepCode(stepId: string, blocks: any[]): string {
  const blocksJson = JSON.stringify(blocks, null, 2);
  const indented = blocksJson
    .split('\n')
    .map(line => '  ' + line)
    .join('\n');

  return `  '${stepId}': ${indented.trim()},`;
}

/**
 * Gera o header do arquivo TypeScript
 */
function generateTsHeader(): string {
  const now = new Date().toISOString();
  return `/**
 * 🎯 TEMPLATE COMPLETO - QUIZ DE ESTILO PESSOAL (21 ETAPAS)
 * 
 * ⚠️  ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITE MANUALMENTE!
 * 
 * Este arquivo é gerado por scripts/build-templates-from-master.ts
 * a partir de public/templates/quiz21-complete.json (fonte única)
 * 
 * Para editar os templates:
 * 1. Edite quiz21-complete.json
 * 2. Execute: npm run build:templates
 * 3. Commit: JSON + este arquivo TS
 * 
 * Gerado em: ${now}
 * Versão: 3.0.0
 */

import { Block } from '../types/editor';

// 🔧 PERFORMANCE E CACHE OTIMIZADO
const TEMPLATE_CACHE = new Map<string, Block[]>();
const FUNNEL_TEMPLATE_CACHE = new Map<string, Block[]>();

// 🚀 FUNÇÃO DE CARREGAMENTO OTIMIZADO
export function getStepTemplate(stepId: string): Block[] | null {
  if (TEMPLATE_CACHE.has(stepId)) {
    return TEMPLATE_CACHE.get(stepId)!;
  }

  const template = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (template) {
    TEMPLATE_CACHE.set(stepId, template);
    return template;
  }

  console.warn(\`⚠️ Template \${stepId} not found\`);
  return null;
}

// 🎯 FUNÇÃO: Template personalizado por funil
export function getPersonalizedStepTemplate(stepId: string, funnelId?: string): Block[] | null {
  if (!funnelId) {
    return getStepTemplate(stepId);
  }

  const cacheKey = \`\${funnelId}:\${stepId}\`;

  if (FUNNEL_TEMPLATE_CACHE.has(cacheKey)) {
    return FUNNEL_TEMPLATE_CACHE.get(cacheKey)!;
  }

  const baseTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (!baseTemplate) {
    console.warn(\`⚠️ Template \${stepId} not found for funnel \${funnelId}\`);
    return null;
  }

  const personalizedTemplate = personalizeTemplateForFunnel(baseTemplate, funnelId, stepId);
  FUNNEL_TEMPLATE_CACHE.set(cacheKey, personalizedTemplate);

  return personalizedTemplate;
}

// 🎨 FUNÇÃO DE PERSONALIZAÇÃO baseada no funnelId
function personalizeTemplateForFunnel(template: Block[], funnelId: string, _stepId: string): Block[] {
  const funnelSeed = generateSeedFromFunnelId(funnelId);
  
  return template.map((block) => {
    const personalizedBlock = JSON.parse(JSON.stringify(block));

    if (personalizedBlock.id) {
      personalizedBlock.id = \`\${personalizedBlock.id}-fnl\${funnelSeed}\`;
    }

    return personalizedBlock;
  });
}

function generateSeedFromFunnelId(funnelId: string): number {
  let hash = 0;
  for (let i = 0; i < funnelId.length; i++) {
    hash = ((hash << 5) - hash) + funnelId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 1000);
}

`;
}

/**
 * Gera o footer do arquivo TypeScript
 */
function generateTsFooter(): string {
  return `

// 📋 ALIAS para compatibilidade
export const QUIZ_QUESTIONS_COMPLETE = QUIZ_STYLE_21_STEPS_TEMPLATE;

// 🔐 SCHEMA DE PERSISTÊNCIA (preservado)
export const FUNNEL_PERSISTENCE_SCHEMA = {
  version: '3.0.0',
  structure: 'blocks',
  source: 'quiz21-complete.json',
} as const;

// 🌐 CONFIGURAÇÃO GLOBAL (preservado)
export const QUIZ_GLOBAL_CONFIG = {
  navigation: {
    autoAdvanceSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18],
    manualAdvanceSteps: [12, 19, 20, 21],
    autoAdvanceDelay: 1000,
  },
  validation: {
    rules: {
      'step-01': { required: true, type: 'text', minLength: 2 },
      'step-02-11': { required: true, type: 'multiple-choice', requiredSelections: 3 },
      'step-13-18': { required: true, type: 'single-choice' },
    },
  },
} as const;
`;
}

/**
 * Gera embedded.ts (para L3 cache)
 */
function generateEmbeddedTs(templateRecord: Record<string, any[]>): string {
  const now = new Date().toISOString();
  const totalSteps = Object.keys(templateRecord).length;
  const totalBlocks = Object.values(templateRecord).reduce((sum, blocks) => sum + blocks.length, 0);

  const blocksJson = JSON.stringify(templateRecord, null, 2);
  const indented = blocksJson
    .split('\n')
    .map(line => '  ' + line)
    .join('\n');

  return `/**
 * 🏗️ BUILD-TIME TEMPLATES EMBEDDED
 * 
 * Gerado automaticamente em: ${now}
 * Total de steps: ${totalSteps}
 * Total de blocos: ${totalBlocks}
 * 
 * ⚠️ NÃO EDITAR MANUALMENTE - executar: npm run build:templates
 */

export interface Block {
  id: string;
  type: string;
  order: number;
  properties: Record<string, any>;
  content: Record<string, any>;
  parentId?: string | null;
}

const embedded: Record<string, Block[]> = ${indented.trim()};

export { embedded };
export default embedded;
`;
}

/**
 * Função principal
 */
function main() {
  log('🔧 GERADOR DE TEMPLATES v2 (Master-based)\n', colors.blue);

  // 1. Carregar master
  log('📋 Carregando quiz21-complete.json...', colors.cyan);
  const master = loadMaster();

  if (!master.steps || typeof master.steps !== 'object') {
    log('❌ Formato inválido: propriedade "steps" não encontrada', colors.red);
    process.exit(1);
  }

  // 2. Extrair blocks de cada step
  log('🔍 Extraindo blocks de cada step...\n', colors.cyan);

  const templateRecord: Record<string, any[]> = {};
  let totalBlocks = 0;
  let stepsWithBlocks = 0;
  let stepsWithSections = 0;

  for (const [stepId, stepData] of Object.entries(master.steps) as any) {
    if (Array.isArray(stepData.blocks)) {
      templateRecord[stepId] = stepData.blocks;
      totalBlocks += stepData.blocks.length;
      stepsWithBlocks++;
      log(`  ✓ ${stepId}: ${stepData.blocks.length} blocks`, colors.green);
    } else if (Array.isArray(stepData.sections)) {
      stepsWithSections++;
      log(`  ⚠️  ${stepId}: ainda usa sections (execute normalize primeiro!)`, colors.yellow);
    } else {
      log(`  ❌ ${stepId}: sem blocks nem sections`, colors.red);
    }
  }

  if (stepsWithSections > 0) {
    log(`\n⚠️  ATENÇÃO: ${stepsWithSections} steps ainda usam "sections"`, colors.yellow);
    log(`   Execute: npx tsx scripts/normalize-quiz21-complete.ts\n`, colors.yellow);
  }

  if (stepsWithBlocks === 0) {
    log('❌ Nenhum step com blocks encontrado', colors.red);
    process.exit(1);
  }

  // 3. Gerar quiz21StepsComplete.ts
  log('\n🔨 Gerando quiz21StepsComplete.ts...', colors.blue);

  const tsHeader = generateTsHeader();
  const tsBody = Object.entries(templateRecord)
    .map(([stepId, blocks]) => generateStepCode(stepId, blocks))
    .join('\n\n');
  const tsFooter = generateTsFooter();

  const tsCode = `${tsHeader}
export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = {
${tsBody}
};
${tsFooter}`;

  fs.writeFileSync(OUTPUT_TS, tsCode, 'utf8');

  const tsStats = fs.statSync(OUTPUT_TS);
  const tsSizeKB = (tsStats.size / 1024).toFixed(2);

  log(`  ✅ ${path.basename(OUTPUT_TS)} gerado (${tsSizeKB} KB)`, colors.green);

  // 4. Gerar embedded.ts
  log('🔨 Gerando embedded.ts...', colors.blue);

  const embeddedCode = generateEmbeddedTs(templateRecord);
  fs.writeFileSync(OUTPUT_EMBEDDED, embeddedCode, 'utf8');

  const embeddedStats = fs.statSync(OUTPUT_EMBEDDED);
  const embeddedSizeKB = (embeddedStats.size / 1024).toFixed(2);

  log(`  ✅ ${path.basename(OUTPUT_EMBEDDED)} gerado (${embeddedSizeKB} KB)`, colors.green);

  // 5. Estatísticas finais
  log(`\n📊 ESTATÍSTICAS:`, colors.blue);
  log(`   • Steps processados: ${stepsWithBlocks}`, colors.cyan);
  log(`   • Total de blocos: ${totalBlocks}`, colors.cyan);
  log(`   • quiz21StepsComplete.ts: ${tsSizeKB} KB`, colors.cyan);
  log(`   • embedded.ts: ${embeddedSizeKB} KB`, colors.cyan);

  log(`\n✅ GERAÇÃO CONCLUÍDA!`, colors.green);
  log(`\n📝 Próximos passos:`, colors.yellow);
  log(`   1. Validar: npx tsx scripts/validate-templates.ts`);
  log(`   2. Testar: npm run dev`);
  log(`   3. Commit: git add public/templates/ src/templates/`);
}

// Executar
main();
