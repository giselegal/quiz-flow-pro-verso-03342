#!/usr/bin/env node
/**
 * 🔍 MAPEAMENTO COMPLETO DE TEMPLATES
 * 
 * Este script faz um pente fino para descobrir:
 * 1. Qual fonte de template está sendo usada (TS vs JSON)
 * 2. Qual estrutura cada fonte tem (blocks vs sections)
 * 3. Quais blocos cada step possui
 * 4. Quais blocos existem no registry
 * 5. Incompatibilidades entre templates e registry
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// ============================================================================
// 1. VERIFICAR FONTES DE TEMPLATES
// ============================================================================

log('\n' + '='.repeat(80), 'cyan');
log('📂 PASSO 1: MAPEANDO FONTES DE TEMPLATES', 'bright');
log('='.repeat(80), 'cyan');

const templateSources = {
  typescript: {
    path: join(ROOT, 'src/templates/quiz21StepsComplete.ts'),
    exists: false,
    structure: null,
    steps: {}
  },
  jsonV2: {
    path: join(ROOT, 'src/config/templates'),
    exists: false,
    files: [],
    steps: {}
  },
  jsonV3: {
    path: join(ROOT, 'templates/funnels/quiz21StepsComplete/steps'),
    exists: false,
    files: [],
    steps: {}
  }
};

// Verificar TypeScript
if (existsSync(templateSources.typescript.path)) {
  templateSources.typescript.exists = true;
  log('✅ Template TypeScript encontrado', 'green');
  log(`   ${templateSources.typescript.path}`, 'reset');
  
  // Ler primeiras linhas para verificar estrutura
  const tsContent = readFileSync(templateSources.typescript.path, 'utf-8');
  const hasSections = tsContent.includes('"sections"') || tsContent.includes("'sections'");
  const hasBlocks = tsContent.includes('"blocks"') || tsContent.includes("'blocks'");
  
  templateSources.typescript.structure = {
    hasSections,
    hasBlocks,
    primary: hasSections ? 'sections' : hasBlocks ? 'blocks' : 'unknown'
  };
  
  log(`   Estrutura: ${templateSources.typescript.structure.primary}`, 'yellow');
} else {
  log('❌ Template TypeScript NÃO encontrado', 'red');
}

// Verificar JSON V2
if (existsSync(templateSources.jsonV2.path)) {
  templateSources.jsonV2.exists = true;
  const files = require('fs').readdirSync(templateSources.jsonV2.path)
    .filter(f => f.startsWith('step-') && f.endsWith('.json'));
  templateSources.jsonV2.files = files;
  
  log(`✅ Templates JSON V2 encontrados (${files.length} arquivos)`, 'green');
  log(`   ${templateSources.jsonV2.path}`, 'reset');
} else {
  log('❌ Templates JSON V2 NÃO encontrados', 'red');
}

// Verificar JSON V3
if (existsSync(templateSources.jsonV3.path)) {
  templateSources.jsonV3.exists = true;
  const files = require('fs').readdirSync(templateSources.jsonV3.path)
    .filter(f => f.startsWith('step-') && f.endsWith('.json'));
  templateSources.jsonV3.files = files;
  
  log(`✅ Templates JSON V3 encontrados (${files.length} arquivos)`, 'green');
  log(`   ${templateSources.jsonV3.path}`, 'reset');
} else {
  log('❌ Templates JSON V3 NÃO encontrados', 'red');
}

// ============================================================================
// 2. ANALISAR ESTRUTURA DE CADA FONTE
// ============================================================================

log('\n' + '='.repeat(80), 'cyan');
log('🔬 PASSO 2: ANALISANDO ESTRUTURA DE CADA STEP', 'bright');
log('='.repeat(80), 'cyan');

const stepAnalysis = {};

// Analisar JSON V2
if (templateSources.jsonV2.exists) {
  log('\n📄 JSON V2 (src/config/templates/):', 'blue');
  
  for (const file of templateSources.jsonV2.files) {
    const stepId = file.replace('.json', '');
    const filePath = join(templateSources.jsonV2.path, file);
    
    try {
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));
      
      const analysis = {
        source: 'JSON V2',
        file: filePath,
        version: content.templateVersion || 'unknown',
        type: content.metadata?.type || content.type || 'unknown',
        hasBlocks: !!content.blocks,
        hasSections: !!content.sections,
        blockCount: content.blocks?.length || 0,
        sectionCount: content.sections?.length || 0,
        blockTypes: content.blocks ? content.blocks.map(b => b.type) : [],
        sectionTypes: content.sections ? content.sections.map(s => s.type) : []
      };
      
      stepAnalysis[stepId] = analysis;
      
      const structure = analysis.hasBlocks ? 'blocks' : analysis.hasSections ? 'sections' : 'empty';
      const count = analysis.hasBlocks ? analysis.blockCount : analysis.sectionCount;
      
      log(`  ${stepId}: ${structure} (${count}) - type: ${analysis.type}`, 
        structure === 'blocks' ? 'green' : structure === 'sections' ? 'yellow' : 'red');
      
    } catch (error) {
      log(`  ${stepId}: ❌ Erro ao ler`, 'red');
    }
  }
}

// Analisar JSON V3
if (templateSources.jsonV3.exists) {
  log('\n📄 JSON V3 (templates/funnels/):', 'blue');
  
  for (const file of templateSources.jsonV3.files) {
    const stepId = file.replace('.json', '');
    const filePath = join(templateSources.jsonV3.path, file);
    
    try {
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));
      
      const analysis = {
        source: 'JSON V3',
        file: filePath,
        version: content.templateVersion || 'unknown',
        type: content.metadata?.type || content.type || 'unknown',
        hasBlocks: !!content.blocks,
        hasSections: !!content.sections,
        blockCount: content.blocks?.length || 0,
        sectionCount: content.sections?.length || 0,
        blockTypes: content.blocks ? content.blocks.map(b => b.type) : [],
        sectionTypes: content.sections ? content.sections.map(s => s.type) : []
      };
      
      // Se já existe análise do V2, comparar
      if (stepAnalysis[stepId]) {
        log(`  ${stepId}: ⚠️  DUPLICADO! V2 e V3 existem`, 'yellow');
        log(`    V2: ${stepAnalysis[stepId].blockCount} blocks, V3: ${analysis.blockCount} blocks`, 'reset');
      } else {
        stepAnalysis[stepId] = analysis;
        
        const structure = analysis.hasBlocks ? 'blocks' : analysis.hasSections ? 'sections' : 'empty';
        const count = analysis.hasBlocks ? analysis.blockCount : analysis.sectionCount;
        
        log(`  ${stepId}: ${structure} (${count}) - type: ${analysis.type}`, 
          structure === 'blocks' ? 'green' : structure === 'sections' ? 'yellow' : 'red');
      }
      
    } catch (error) {
      log(`  ${stepId}: ❌ Erro ao ler`, 'red');
    }
  }
}

// ============================================================================
// 3. VERIFICAR QUAL FONTE O CÓDIGO USA
// ============================================================================

log('\n' + '='.repeat(80), 'cyan');
log('🔍 PASSO 3: QUAL FONTE O CÓDIGO USA?', 'bright');
log('='.repeat(80), 'cyan');

const importsFile = join(ROOT, 'src/templates/imports.ts');
if (existsSync(importsFile)) {
  const importsContent = readFileSync(importsFile, 'utf-8');
  
  log('\n📄 Analisando src/templates/imports.ts:', 'blue');
  
  if (importsContent.includes('QUIZ_STYLE_21_STEPS_TEMPLATE')) {
    log('  ✅ Importa: QUIZ_STYLE_21_STEPS_TEMPLATE (TypeScript)', 'green');
    log('  ⚠️  Isso significa que está usando o template TS com SECTIONS!', 'yellow');
  }
  
  if (importsContent.includes('loadTemplate')) {
    log('  ✅ Exporta: loadTemplate()', 'green');
    
    // Verificar o que loadTemplate retorna
    if (importsContent.includes('QUIZ_STYLE_21_STEPS_TEMPLATE')) {
      log('  ⚠️  loadTemplate() retorna QUIZ_STYLE_21_STEPS_TEMPLATE', 'yellow');
      log('  ⚠️  Adapters receberão estrutura com SECTIONS, não BLOCKS!', 'yellow');
    }
  }
} else {
  log('❌ src/templates/imports.ts não encontrado', 'red');
}

// ============================================================================
// 4. VERIFICAR BLOCOS NO REGISTRY
// ============================================================================

log('\n' + '='.repeat(80), 'cyan');
log('🗂️  PASSO 4: BLOCOS REGISTRADOS NO UniversalBlockRenderer', 'bright');
log('='.repeat(80), 'cyan');

const rendererFile = join(ROOT, 'src/components/editor/blocks/UniversalBlockRenderer.tsx');
if (existsSync(rendererFile)) {
  const rendererContent = readFileSync(rendererFile, 'utf-8');
  
  // Extrair blocos do BlockComponentRegistry
  const registryMatch = rendererContent.match(/const BlockComponentRegistry[^{]*{([^}]+)}/s);
  if (registryMatch) {
    const registryContent = registryMatch[1];
    const blockTypes = [];
    const regex = /'([^']+)':\s*\w+/g;
    let match;
    
    while ((match = regex.exec(registryContent)) !== null) {
      blockTypes.push(match[1]);
    }
    
    log(`\n✅ ${blockTypes.length} tipos de blocos registrados:`, 'green');
    
    const categories = {
      'quiz': blockTypes.filter(t => t.startsWith('quiz-')),
      'transition': blockTypes.filter(t => t.startsWith('transition-')),
      'result': blockTypes.filter(t => t.startsWith('result-')),
      'offer': blockTypes.filter(t => t.startsWith('offer-')),
      'generic': blockTypes.filter(t => !t.includes('-'))
    };
    
    Object.entries(categories).forEach(([cat, types]) => {
      if (types.length > 0) {
        log(`  ${cat}: ${types.length} blocos`, 'cyan');
        types.forEach(t => log(`    - ${t}`, 'reset'));
      }
    });
  }
}

// ============================================================================
// 5. VERIFICAR INCOMPATIBILIDADES
// ============================================================================

log('\n' + '='.repeat(80), 'cyan');
log('⚠️  PASSO 5: VERIFICANDO INCOMPATIBILIDADES', 'bright');
log('='.repeat(80), 'cyan');

const issues = [];

// Verificar Steps 12, 19, 20 especificamente
const criticalSteps = ['step-12', 'step-19', 'step-20'];

for (const stepId of criticalSteps) {
  const analysis = stepAnalysis[stepId];
  
  if (!analysis) {
    issues.push({
      step: stepId,
      severity: 'ERROR',
      message: 'Template não encontrado'
    });
    continue;
  }
  
  log(`\n🔍 ${stepId}:`, 'blue');
  log(`  Fonte: ${analysis.source}`, 'reset');
  log(`  Versão: ${analysis.version}`, 'reset');
  log(`  Tipo: ${analysis.type}`, 'reset');
  log(`  Estrutura: ${analysis.hasBlocks ? 'blocks ✅' : analysis.hasSections ? 'sections ⚠️' : 'nenhuma ❌'}`, 
    analysis.hasBlocks ? 'green' : 'yellow');
  
  if (analysis.hasBlocks) {
    log(`  Blocos (${analysis.blockCount}):`, 'cyan');
    analysis.blockTypes.forEach(type => {
      log(`    - ${type}`, 'reset');
    });
  }
  
  if (analysis.hasSections) {
    log(`  Sections (${analysis.sectionCount}):`, 'yellow');
    log(`    ⚠️  Usa estrutura antiga! Precisa converter para blocks`, 'yellow');
    
    issues.push({
      step: stepId,
      severity: 'WARNING',
      message: 'Usa estrutura "sections" em vez de "blocks"'
    });
  }
  
  // Verificar se blocos existem no registry
  if (analysis.hasBlocks) {
    const rendererContent = readFileSync(rendererFile, 'utf-8');
    const missingBlocks = [];
    
    for (const blockType of analysis.blockTypes) {
      if (!rendererContent.includes(`'${blockType}':`)) {
        missingBlocks.push(blockType);
      }
    }
    
    if (missingBlocks.length > 0) {
      log(`  ❌ Blocos NÃO registrados:`, 'red');
      missingBlocks.forEach(b => log(`    - ${b}`, 'red'));
      
      issues.push({
        step: stepId,
        severity: 'ERROR',
        message: `Blocos não registrados: ${missingBlocks.join(', ')}`
      });
    } else {
      log(`  ✅ Todos os blocos estão registrados`, 'green');
    }
  }
}

// ============================================================================
// 6. RELATÓRIO FINAL
// ============================================================================

log('\n' + '='.repeat(80), 'cyan');
log('📊 RELATÓRIO FINAL', 'bright');
log('='.repeat(80), 'cyan');

if (issues.length === 0) {
  log('\n✅ Nenhum problema encontrado!', 'green');
} else {
  log(`\n⚠️  ${issues.length} problemas encontrados:`, 'yellow');
  
  issues.forEach((issue, i) => {
    const color = issue.severity === 'ERROR' ? 'red' : 'yellow';
    log(`\n${i + 1}. [${issue.severity}] ${issue.step}`, color);
    log(`   ${issue.message}`, 'reset');
  });
}

// Recomendações
log('\n📋 RECOMENDAÇÕES:', 'blue');

if (templateSources.typescript.structure?.primary === 'sections') {
  log('  1. ⚠️  Template TypeScript usa "sections"', 'yellow');
  log('     → Adapters precisam converter sections → blocks', 'reset');
  log('     → Ou: usar JSONs V2/V3 que já têm blocks', 'reset');
}

if (templateSources.jsonV2.exists && templateSources.jsonV3.exists) {
  log('  2. ⚠️  Existem DUAS versões de JSONs (V2 e V3)', 'yellow');
  log('     → Escolher qual usar e remover a outra', 'reset');
  log('     → Ou: consolidar em uma única fonte', 'reset');
}

const stepsUsingSections = Object.values(stepAnalysis)
  .filter(a => a.hasSections && !a.hasBlocks);

if (stepsUsingSections.length > 0) {
  log(`  3. ⚠️  ${stepsUsingSections.length} steps usam "sections"`, 'yellow');
  log('     → Converter para "blocks" ou garantir conversão nos adapters', 'reset');
}

log('\n' + '='.repeat(80), 'cyan');
log('✅ ANÁLISE COMPLETA!', 'bright');
log('='.repeat(80) + '\n', 'cyan');
