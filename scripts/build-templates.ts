#!/usr/bin/env node
/**
 * 🏗️ BUILD-TIME TEMPLATE GENERATOR
 * 
 * Gera arquivo embedded.ts com todos os templates em formato Block[]
 * Elimina necessidade de fetch dinâmico e conversões de formato
 * 
 * Uso: npm run build:templates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '../public/templates');
const OUTPUT_FILE = path.join(__dirname, '../src/templates/embedded.ts');

interface Block {
  id: string;
  type: string;
  order: number;
  properties: Record<string, any>;
  content: Record<string, any>;
  parentId?: string | null;
}

/**
 * Normalizar tipo de bloco
 */
function normalizeBlockType(type: string): string {
  const typeMap: Record<string, string> = {
    'header': 'heading',
    'title': 'heading',
    'paragraph': 'text',
    'quiz-question': 'quiz-options',
    'question': 'quiz-options',
    'cta': 'button',
    'call-to-action': 'button'
  };
  
  return typeMap[type] || type;
}

/**
 * Converter sections[] → Block[]
 */
function convertSectionsToBlocks(sections: any[], stepId: string): Block[] {
  if (!Array.isArray(sections)) return [];
  
  return sections.map((section, index) => ({
    id: section.id || `${stepId}-block-${index}`,
    type: normalizeBlockType(section.type || 'text'),
    order: section.order ?? index,
    properties: section.properties || section.props || {},
    content: section.content || {},
    parentId: section.parentId || null
  }));
}

/**
 * Processar arquivo JSON de template
 */
function processTemplateFile(filePath: string, stepId: string): Block[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const template = JSON.parse(content);
    
    // Formato Block[] direto
    if (template.blocks && Array.isArray(template.blocks)) {
      console.log(`✅ ${stepId}: ${template.blocks.length} blocos (formato direto)`);
      return template.blocks;
    }
    
    // Formato sections[] (v3)
    if (template.sections && Array.isArray(template.sections)) {
      const blocks = convertSectionsToBlocks(template.sections, stepId);
      console.log(`✅ ${stepId}: ${blocks.length} blocos (convertido de sections)`);
      return blocks;
    }
    
    console.warn(`⚠️ ${stepId}: formato desconhecido`);
    return [];
  } catch (error) {
    console.error(`❌ ${stepId}: erro ao processar`, error);
    return [];
  }
}

/**
 * Gerar arquivo embedded.ts
 */
function generateEmbeddedFile() {
  console.log('🏗️ Gerando templates embedded...\n');
  
  const embedded: Record<string, Block[]> = {};
  
  // Processar step-01 até step-21
  for (let i = 1; i <= 21; i++) {
    const stepNumber = i.toString().padStart(2, '0');
    const stepId = `step-${stepNumber}`;
    
    // Tentar diferentes variações de nome de arquivo
    const possiblePaths = [
      path.join(TEMPLATES_DIR, `${stepId}.json`),
      path.join(TEMPLATES_DIR, `${stepId}-v3.json`),
      path.join(TEMPLATES_DIR, `quiz-${stepId}.json`)
    ];
    
    let blocks: Block[] = [];
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        blocks = processTemplateFile(filePath, stepId);
        break;
      }
    }
    
    if (blocks.length > 0) {
      embedded[stepId] = blocks;
    } else {
      console.warn(`⚠️ ${stepId}: nenhum template encontrado`);
      // Placeholder vazio
      embedded[stepId] = [];
    }
  }
  
  // Gerar código TypeScript
  const totalBlocks = Object.values(embedded).reduce((sum, blocks) => sum + blocks.length, 0);
  const totalSteps = Object.keys(embedded).length;
  
  const output = `/**
 * 🏗️ BUILD-TIME TEMPLATES EMBEDDED
 * 
 * Gerado automaticamente em: ${new Date().toISOString()}
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

const embedded: Record<string, Block[]> = ${JSON.stringify(embedded, null, 2)};

export default embedded;
`;
  
  // Salvar arquivo
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  
  console.log(`\n✅ Arquivo gerado: ${OUTPUT_FILE}`);
  console.log(`📊 ${totalSteps} steps, ${totalBlocks} blocos totais`);
  console.log(`💾 Tamanho: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
}

// Executar
try {
  generateEmbeddedFile();
  process.exit(0);
} catch (error) {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
}
