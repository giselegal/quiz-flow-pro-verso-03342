/**
 * 🔧 Script de Correção de Blocos Atômicos
 * 
 * Corrige os tipos de blocos no template quiz21-complete.json
 * para usar os blocos atômicos específicos ao invés de tipos genéricos.
 * 
 * Mudanças:
 * - Step 1: image/heading-inline/text-inline → intro-logo/intro-title/intro-image/intro-description
 * - Steps 2-11: CTAButton → question-navigation (quando apropriado)
 * - Steps 12, 19: text-inline → transition-text (quando em contexto de transition)
 * - Mantém Step 20 (já está correto)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Block {
  id: string;
  type: string;
  order: number;
  properties?: any;
  content?: any;
  parentId?: string | null;
}

interface Step {
  blocks: Block[];
  [key: string]: any;
}

interface Template {
  steps: Record<string, Step>;
  [key: string]: any;
}

// Mapa de correções: ID do bloco → tipo correto
const blockTypeMappings: Record<string, string> = {
  // Step 1 - Intro
  'intro-logo': 'intro-logo',
  'intro-title': 'intro-title', 
  'intro-image': 'intro-image',
  'intro-description': 'intro-description',
  'intro-form': 'intro-form',
  
  // Steps 12, 19 - Transitions
  'step-12-transition-text': 'transition-text',
  'step-19-transition-text': 'transition-text',
  'transition-hero-12': 'transition-hero', // Mantém (não tem atomic equivalent)
  'transition-hero-19': 'transition-hero', // Mantém (não tem atomic equivalent)
};

// Mapeamento de tipos genéricos para contextos específicos
const contextualTypeMappings: Record<string, (block: Block, stepId: string) => string | null> = {
  'image': (block, stepId) => {
    if (block.id.startsWith('intro-')) return block.id;
    return null;
  },
  'heading-inline': (block, stepId) => {
    if (block.id.startsWith('intro-')) return block.id;
    return null;
  },
  'text-inline': (block, stepId) => {
    if (block.id.startsWith('intro-')) return block.id;
    if (block.id.includes('transition-text')) return 'transition-text';
    return null;
  },
};

function fixBlockTypes(template: Template): { fixed: number; changes: string[] } {
  let fixCount = 0;
  const changes: string[] = [];

  for (const [stepId, step] of Object.entries(template.steps)) {
    if (!step.blocks || !Array.isArray(step.blocks)) continue;

    for (const block of step.blocks) {
      const originalType = block.type;
      let newType: string | null = null;

      // 1. Verificar mapeamento direto por ID
      if (blockTypeMappings[block.id]) {
        newType = blockTypeMappings[block.id];
      }
      
      // 2. Verificar mapeamento contextual por tipo
      else if (contextualTypeMappings[block.type]) {
        newType = contextualTypeMappings[block.type](block, stepId);
      }

      // Aplicar mudança se necessário
      if (newType && newType !== originalType) {
        block.type = newType;
        fixCount++;
        changes.push(`${stepId}: "${block.id}" → ${originalType} ⇒ ${newType}`);
        console.log(`✅ ${stepId}: "${block.id}" → ${originalType} ⇒ ${newType}`);
      }
    }
  }

  return { fixed: fixCount, changes };
}

function validateAtomicBlocks(template: Template): { valid: number; invalid: number; report: string[] } {
  const atomicBlockTypes = new Set([
    // Intro
    'intro-logo', 'intro-logo-header', 'intro-title', 'intro-image', 'intro-description', 'intro-form',
    // Transitions
    'transition-title', 'transition-loader', 'transition-text', 'transition-progress', 'transition-message',
    // Questions
    'question-progress', 'question-number', 'question-text', 'question-title', 'question-instructions', 'question-navigation',
    // Results
    'result-main', 'result-style', 'result-image', 'result-description', 'result-header',
    'result-characteristics', 'result-cta', 'result-cta-primary', 'result-cta-secondary',
    'result-progress-bars', 'result-secondary-styles', 'result-share',
  ]);

  let valid = 0;
  let invalid = 0;
  const report: string[] = [];

  for (const [stepId, step] of Object.entries(template.steps)) {
    if (!step.blocks) continue;

    for (const block of step.blocks) {
      // Verificar se o ID sugere que deveria ser atômico
      const shouldBeAtomic = block.id.match(/^(intro|transition|question|result)-/);
      
      if (shouldBeAtomic) {
        if (atomicBlockTypes.has(block.type)) {
          valid++;
        } else {
          invalid++;
          report.push(`⚠️  ${stepId}: "${block.id}" usa tipo genérico "${block.type}"`);
        }
      }
    }
  }

  return { valid, invalid, report };
}

async function main() {
  console.log('🔧 Iniciando correção de blocos atômicos...\n');

  const templatePath = path.join(__dirname, '../public/templates/quiz21-complete.json');
  
  // Backup
  const backupPath = `${templatePath}.backup-${Date.now()}.json`;
  console.log(`📦 Criando backup: ${path.basename(backupPath)}`);
  fs.copyFileSync(templatePath, backupPath);

  // Carregar template
  console.log('📖 Carregando template...');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  const template: Template = JSON.parse(templateContent);

  // Validar antes
  console.log('\n📊 Validação ANTES das correções:');
  const beforeValidation = validateAtomicBlocks(template);
  console.log(`   ✅ Blocos atômicos corretos: ${beforeValidation.valid}`);
  console.log(`   ⚠️  Blocos com tipos genéricos: ${beforeValidation.invalid}`);
  
  if (beforeValidation.report.length > 0) {
    console.log('\n   Problemas encontrados:');
    beforeValidation.report.slice(0, 10).forEach(r => console.log(`   ${r}`));
    if (beforeValidation.report.length > 10) {
      console.log(`   ... e mais ${beforeValidation.report.length - 10} problemas`);
    }
  }

  // Aplicar correções
  console.log('\n🔄 Aplicando correções...\n');
  const result = fixBlockTypes(template);

  // Validar depois
  console.log('\n📊 Validação DEPOIS das correções:');
  const afterValidation = validateAtomicBlocks(template);
  console.log(`   ✅ Blocos atômicos corretos: ${afterValidation.valid}`);
  console.log(`   ⚠️  Blocos com tipos genéricos: ${afterValidation.invalid}`);

  // Salvar
  console.log('\n💾 Salvando template corrigido...');
  fs.writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf-8');

  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('✅ CORREÇÃO CONCLUÍDA');
  console.log('='.repeat(60));
  console.log(`📝 Total de correções aplicadas: ${result.fixed}`);
  console.log(`📈 Melhoria: ${beforeValidation.invalid} → ${afterValidation.invalid} problemas`);
  console.log(`📦 Backup salvo em: ${path.basename(backupPath)}`);
  
  if (result.changes.length > 0) {
    console.log('\n📋 Mudanças aplicadas:');
    result.changes.forEach(change => console.log(`   ${change}`));
  }

  if (afterValidation.invalid > 0) {
    console.log('\n⚠️  Ainda existem blocos que poderiam usar tipos atômicos:');
    afterValidation.report.slice(0, 5).forEach(r => console.log(`   ${r}`));
    if (afterValidation.report.length > 5) {
      console.log(`   ... e mais ${afterValidation.report.length - 5} casos`);
    }
  }

  console.log('\n✨ Pronto! Template atualizado com blocos atômicos.\n');
}

main().catch(error => {
  console.error('❌ Erro ao executar script:', error);
  process.exit(1);
});
