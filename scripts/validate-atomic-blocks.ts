/**
 * 🔍 Script de Validação de Blocos Atômicos
 * 
 * Valida quais blocos no template estão usando tipos corretos
 * e identifica oportunidades de usar blocos atômicos.
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
  type?: string;
  [key: string]: any;
}

interface Template {
  steps: Record<string, Step>;
  [key: string]: any;
}

// Blocos atômicos disponíveis no registry
const ATOMIC_BLOCKS = {
  intro: ['intro-logo', 'intro-logo-header', 'intro-title', 'intro-image', 'intro-description', 'intro-form'],
  transition: ['transition-title', 'transition-loader', 'transition-text', 'transition-progress', 'transition-message'],
  question: ['question-progress', 'question-number', 'question-text', 'question-title', 'question-instructions', 'question-navigation'],
  result: ['result-main', 'result-style', 'result-image', 'result-description', 'result-header', 'result-characteristics', 
           'result-cta', 'result-cta-primary', 'result-cta-secondary', 'result-progress-bars', 'result-secondary-styles', 'result-share'],
};

// Blocos de seção (v3) - são válidos, não precisam ser atômicos
const SECTION_BLOCKS = [
  'question-hero',
  'transition-hero',
  'offer-hero',
  'pricing',
];

// Blocos inline genéricos - OK de usar quando não há contexto específico
const GENERIC_BLOCKS = [
  'text-inline',
  'image',
  'heading-inline',
  'button-inline',
  'CTAButton',
  'options-grid',
  'form-input',
];

function analyzeTemplate(template: Template) {
  const stats = {
    byStep: {} as Record<string, any>,
    summary: {
      totalBlocks: 0,
      atomicCorrect: 0,
      atomicIncorrect: 0,
      sectionBlocks: 0,
      genericBlocks: 0,
      unknownBlocks: 0,
    },
    issues: [] as string[],
    recommendations: [] as string[],
  };

  for (const [stepId, step] of Object.entries(template.steps)) {
    if (!step.blocks || !Array.isArray(step.blocks)) continue;

    const stepStats = {
      stepType: step.type,
      blocks: [] as any[],
      atomic: 0,
      section: 0,
      generic: 0,
      issues: [] as string[],
    };

    for (const block of step.blocks) {
      stats.summary.totalBlocks++;

      const blockInfo = {
        id: block.id,
        type: block.type,
        category: 'unknown' as string,
        status: 'unknown' as string,
      };

      // Identificar categoria e status
      if (Object.values(ATOMIC_BLOCKS).flat().includes(block.type)) {
        blockInfo.category = 'atomic';
        blockInfo.status = 'correct';
        stepStats.atomic++;
        stats.summary.atomicCorrect++;
      } else if (SECTION_BLOCKS.includes(block.type)) {
        blockInfo.category = 'section';
        blockInfo.status = 'correct';
        stepStats.section++;
        stats.summary.sectionBlocks++;
      } else if (GENERIC_BLOCKS.includes(block.type)) {
        blockInfo.category = 'generic';
        
        // Verificar se deveria ser atômico baseado no ID
        const shouldBeAtomic = block.id.match(/^(intro|transition|question|result)-/);
        if (shouldBeAtomic) {
          blockInfo.status = 'should-be-atomic';
          stats.summary.atomicIncorrect++;
          stepStats.issues.push(`"${block.id}" usa "${block.type}" mas deveria usar bloco atômico`);
          stats.issues.push(`${stepId}: "${block.id}" → "${block.type}" (deveria ser atômico)`);
        } else {
          blockInfo.status = 'ok-generic';
          stats.summary.genericBlocks++;
        }
      } else {
        blockInfo.category = 'unknown';
        blockInfo.status = 'unknown';
        stats.summary.unknownBlocks++;
        stepStats.issues.push(`Tipo desconhecido: "${block.type}"`);
      }

      stepStats.blocks.push(blockInfo);
    }

    stats.byStep[stepId] = stepStats;
  }

  return stats;
}

function generateReport(stats: any) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 RELATÓRIO DE VALIDAÇÃO DE BLOCOS ATÔMICOS');
  console.log('='.repeat(70));

  console.log('\n📈 RESUMO GERAL:');
  console.log(`   Total de blocos: ${stats.summary.totalBlocks}`);
  console.log(`   ✅ Blocos atômicos corretos: ${stats.summary.atomicCorrect}`);
  console.log(`   ⚠️  Blocos que deveriam ser atômicos: ${stats.summary.atomicIncorrect}`);
  console.log(`   📦 Blocos de seção (v3): ${stats.summary.sectionBlocks}`);
  console.log(`   🔧 Blocos genéricos (OK): ${stats.summary.genericBlocks}`);
  console.log(`   ❓ Blocos desconhecidos: ${stats.summary.unknownBlocks}`);

  const atomicUsageRate = ((stats.summary.atomicCorrect / (stats.summary.atomicCorrect + stats.summary.atomicIncorrect)) * 100).toFixed(1);
  console.log(`\n   Taxa de uso de blocos atômicos: ${atomicUsageRate}%`);

  if (stats.issues.length > 0) {
    console.log('\n⚠️  PROBLEMAS ENCONTRADOS:');
    const grouped = groupByStep(stats.issues);
    Object.entries(grouped).forEach(([step, issues]: [string, any]) => {
      console.log(`\n   ${step}:`);
      issues.forEach((issue: string) => console.log(`      • ${issue}`));
    });
  }

  console.log('\n📋 ANÁLISE POR CATEGORIA DE STEP:');
  
  const stepsByType: Record<string, string[]> = {};
  Object.entries(stats.byStep).forEach(([stepId, stepStats]: [string, any]) => {
    const type = stepStats.stepType || 'unknown';
    if (!stepsByType[type]) stepsByType[type] = [];
    stepsByType[type].push(stepId);
  });

  Object.entries(stepsByType).forEach(([type, steps]) => {
    console.log(`\n   ${type.toUpperCase()} (${steps.length} steps):`);
    
    const typeStats = {
      atomic: 0,
      section: 0,
      generic: 0,
      issues: 0,
    };

    steps.forEach(stepId => {
      const s = stats.byStep[stepId];
      typeStats.atomic += s.atomic;
      typeStats.section += s.section;
      typeStats.generic += s.generic;
      typeStats.issues += s.issues.length;
    });

    console.log(`      Blocos atômicos: ${typeStats.atomic}`);
    console.log(`      Blocos de seção: ${typeStats.section}`);
    console.log(`      Blocos genéricos: ${typeStats.generic}`);
    if (typeStats.issues > 0) {
      console.log(`      ⚠️  Problemas: ${typeStats.issues}`);
    }
  });

  console.log('\n✨ PROGRESSO:');
  const total = stats.summary.atomicCorrect + stats.summary.atomicIncorrect;
  const progress = (stats.summary.atomicCorrect / total) * 100;
  const bar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
  console.log(`   [${bar}] ${progress.toFixed(1)}%`);
  console.log(`   ${stats.summary.atomicCorrect}/${total} blocos usando tipos atômicos corretos`);

  console.log('\n' + '='.repeat(70));
}

function groupByStep(issues: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  
  issues.forEach(issue => {
    const match = issue.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const [, step, message] = match;
      if (!grouped[step]) grouped[step] = [];
      grouped[step].push(message);
    }
  });

  return grouped;
}

async function main() {
  const templatePath = path.join(__dirname, '../public/templates/quiz21-complete.json');
  
  console.log('📖 Carregando template...');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  const template: Template = JSON.parse(templateContent);

  console.log('🔍 Analisando blocos...');
  const stats = analyzeTemplate(template);

  generateReport(stats);

  // Gerar arquivo de relatório
  const reportPath = path.join(__dirname, '../RELATORIO_BLOCOS_ATOMICOS.md');
  const reportContent = generateMarkdownReport(stats);
  fs.writeFileSync(reportPath, reportContent, 'utf-8');
  console.log(`\n📄 Relatório detalhado salvo em: RELATORIO_BLOCOS_ATOMICOS.md`);
}

function generateMarkdownReport(stats: any): string {
  const atomicUsageRate = ((stats.summary.atomicCorrect / (stats.summary.atomicCorrect + stats.summary.atomicIncorrect)) * 100).toFixed(1);
  
  let md = `# 📊 Relatório de Validação de Blocos Atômicos\n\n`;
  md += `**Data:** ${new Date().toLocaleDateString('pt-BR')}\n\n`;
  md += `## 📈 Resumo Geral\n\n`;
  md += `| Métrica | Valor |\n`;
  md += `|---------|-------|\n`;
  md += `| Total de blocos | ${stats.summary.totalBlocks} |\n`;
  md += `| ✅ Blocos atômicos corretos | ${stats.summary.atomicCorrect} |\n`;
  md += `| ⚠️ Blocos que deveriam ser atômicos | ${stats.summary.atomicIncorrect} |\n`;
  md += `| 📦 Blocos de seção (v3) | ${stats.summary.sectionBlocks} |\n`;
  md += `| 🔧 Blocos genéricos (OK) | ${stats.summary.genericBlocks} |\n`;
  md += `| ❓ Blocos desconhecidos | ${stats.summary.unknownBlocks} |\n`;
  md += `| **Taxa de uso correto** | **${atomicUsageRate}%** |\n\n`;

  if (stats.issues.length > 0) {
    md += `## ⚠️ Problemas Encontrados (${stats.issues.length})\n\n`;
    const grouped = groupByStep(stats.issues);
    Object.entries(grouped).forEach(([step, issues]: [string, any]) => {
      md += `### ${step}\n\n`;
      issues.forEach((issue: string) => md += `- ${issue}\n`);
      md += `\n`;
    });
  }

  md += `## ✅ Conclusão\n\n`;
  if (stats.summary.atomicIncorrect === 0) {
    md += `🎉 Parabéns! Todos os blocos estão usando tipos corretos.\n`;
  } else {
    md += `⚠️ Ainda existem ${stats.summary.atomicIncorrect} blocos que poderiam usar tipos atômicos específicos.\n`;
    md += `Execute o script \`fix-atomic-blocks.ts\` para corrigir automaticamente.\n`;
  }

  return md;
}

main().catch(error => {
  console.error('❌ Erro:', error);
  process.exit(1);
});
