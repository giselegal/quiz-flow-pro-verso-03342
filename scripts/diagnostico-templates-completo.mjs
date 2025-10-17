#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO COMPLETO - MAPEAMENTO DE FONTES DE TEMPLATES
 * 
 * Objetivo: Mapear TODAS as fontes de templates e quem as usa
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

console.log('\n' + '='.repeat(80));
console.log('🔍 DIAGNÓSTICO: MAPEAMENTO COMPLETO DE TEMPLATES');
console.log('='.repeat(80) + '\n');

// ============================================================================
// 1. IDENTIFICAR TODAS AS FONTES
// ============================================================================

const sources = {
  configTemplates: {
    path: join(ROOT, 'src/config/templates'),
    purpose: 'Templates V2 completos (runtime)',
    files: []
  },
  dataModularSteps: {
    path: join(ROOT, 'src/data/modularSteps'),
    purpose: 'Templates simplificados (editor)',
    files: []
  },
  dataTemplates: {
    path: join(ROOT, 'src/data/templates'),
    purpose: 'Templates legados?',
    files: []
  },
  publicTemplates: {
    path: join(ROOT, 'public/templates'),
    purpose: 'Templates V3 públicos',
    files: []
  }
};

console.log('📁 FONTES IDENTIFICADAS:\n');

for (const [key, source] of Object.entries(sources)) {
  if (existsSync(source.path)) {
    const files = readdirSync(source.path)
      .filter(f => f.endsWith('.json') && f.includes('step'));
    source.files = files;
    
    console.log(`✅ ${key}`);
    console.log(`   Path: ${source.path}`);
    console.log(`   Propósito: ${source.purpose}`);
    console.log(`   Arquivos: ${files.length}`);
    if (files.length > 0) {
      console.log(`   Steps: ${files.map(f => f.replace('.json', '').replace(/.*step-/, '')).join(', ')}`);
    }
    console.log('');
  } else {
    console.log(`❌ ${key} - NÃO EXISTE`);
    console.log(`   Path esperado: ${source.path}\n`);
  }
}

// ============================================================================
// 2. COMPARAR STEPS 12, 19, 20
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('📊 COMPARAÇÃO: STEPS 12, 19, 20');
console.log('='.repeat(80) + '\n');

const criticalSteps = ['step-12', 'step-19', 'step-20'];

for (const stepId of criticalSteps) {
  console.log(`\n🔍 ${stepId.toUpperCase()}:\n`);
  
  for (const [key, source] of Object.entries(sources)) {
    if (!existsSync(source.path)) continue;
    
    const filename = `${stepId}.json`;
    const filepath = join(source.path, filename);
    
    if (existsSync(filepath)) {
      try {
        const content = JSON.parse(readFileSync(filepath, 'utf-8'));
        const stats = {
          size: readFileSync(filepath, 'utf-8').length,
          lines: readFileSync(filepath, 'utf-8').split('\n').length,
          hasBlocks: !!content.blocks,
          hasSections: !!content.sections,
          blockCount: content.blocks?.length || 0,
          sectionCount: content.sections?.length || 0,
          hasMetadata: !!content.metadata,
          hasDesign: !!content.design,
          version: content.templateVersion || content.version || 'N/A',
          type: content.type || content.metadata?.type || 'N/A'
        };
        
        console.log(`  ✅ ${key}`);
        console.log(`     Tamanho: ${stats.size} bytes (${stats.lines} linhas)`);
        console.log(`     Versão: ${stats.version}`);
        console.log(`     Tipo: ${stats.type}`);
        console.log(`     Estrutura: ${stats.hasBlocks ? `blocks[${stats.blockCount}]` : stats.hasSections ? `sections[${stats.sectionCount}]` : 'nenhuma'}`);
        console.log(`     Metadata: ${stats.hasMetadata ? 'SIM' : 'NÃO'}`);
        console.log(`     Design: ${stats.hasDesign ? 'SIM' : 'NÃO'}`);
        
        // Listar tipos de blocos
        if (stats.hasBlocks && content.blocks.length > 0) {
          const blockTypes = content.blocks.map(b => b.type);
          console.log(`     Blocos: ${blockTypes.slice(0, 5).join(', ')}${blockTypes.length > 5 ? '...' : ''}`);
        }
        
      } catch (error) {
        console.log(`  ❌ ${key} - ERRO AO LER`);
      }
    } else {
      console.log(`  ⚪ ${key} - não existe`);
    }
  }
}

// ============================================================================
// 3. MAPEAR QUEM USA CADA FONTE
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('🔗 MAPEAMENTO: QUEM USA CADA FONTE');
console.log('='.repeat(80) + '\n');

const usageMap = [
  {
    file: 'src/templates/imports.ts',
    description: 'Runtime loader (ProductionStepsRegistry)',
    expectedSource: 'src/config/templates/',
    check: () => {
      const path = join(ROOT, 'src/templates/imports.ts');
      if (!existsSync(path)) return 'ARQUIVO NÃO EXISTE';
      
      const content = readFileSync(path, 'utf-8');
      
      if (content.includes('@/config/templates/')) {
        return '✅ USA src/config/templates/ (CORRETO)';
      } else if (content.includes('@/data/modularSteps/')) {
        return '❌ USA src/data/modularSteps/ (ERRADO)';
      } else if (content.includes('QUIZ_STYLE_21_STEPS_TEMPLATE')) {
        return '⚠️  USA template TypeScript (fallback)';
      }
      
      return '❓ Fonte não identificada';
    }
  },
  {
    file: 'src/utils/loadStepTemplates.ts',
    description: 'Editor loader (EditorProvider)',
    expectedSource: 'src/data/modularSteps/',
    check: () => {
      const path = join(ROOT, 'src/utils/loadStepTemplates.ts');
      if (!existsSync(path)) return 'ARQUIVO NÃO EXISTE';
      
      const content = readFileSync(path, 'utf-8');
      
      if (content.includes('@/data/modularSteps/')) {
        return '✅ USA src/data/modularSteps/ (para editor)';
      } else if (content.includes('@/config/templates/')) {
        return '⚠️  USA src/config/templates/';
      }
      
      return '❓ Fonte não identificada';
    }
  },
  {
    file: 'src/components/step-registry/ProductionStepsRegistry.tsx',
    description: 'Registry de adapters (runtime)',
    expectedSource: 'Via @/templates/imports',
    check: () => {
      const path = join(ROOT, 'src/components/step-registry/ProductionStepsRegistry.tsx');
      if (!existsSync(path)) return 'ARQUIVO NÃO EXISTE';
      
      const content = readFileSync(path, 'utf-8');
      
      if (content.includes("import('@/templates/imports')")) {
        return '✅ USA @/templates/imports (indireto para src/config/templates/)';
      } else if (content.includes('@/data/modularSteps/')) {
        return '❌ USA src/data/modularSteps/ direto (ERRADO)';
      }
      
      return '❓ Fonte não identificada';
    }
  }
];

for (const usage of usageMap) {
  console.log(`📄 ${usage.file}`);
  console.log(`   Propósito: ${usage.description}`);
  console.log(`   Fonte esperada: ${usage.expectedSource}`);
  console.log(`   Status: ${usage.check()}`);
  console.log('');
}

// ============================================================================
// 4. RECOMENDAÇÕES
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('💡 RECOMENDAÇÕES');
console.log('='.repeat(80) + '\n');

console.log('1️⃣  RUNTIME (Quiz em produção):');
console.log('   ✅ USAR: src/config/templates/*.json');
console.log('   ✅ Carregado via: src/templates/imports.ts → loadTemplate()');
console.log('   ✅ Usado por: ProductionStepsRegistry adapters');
console.log('   ✅ Características: Templates completos V2 com metadata, design, layout\n');

console.log('2️⃣  EDITOR (Edição no EditorProvider):');
console.log('   ✅ USAR: src/data/modularSteps/*.json');
console.log('   ✅ Carregado via: src/utils/loadStepTemplates.ts');
console.log('   ✅ Usado por: EditorProvider, ModularPreviewContainer');
console.log('   ✅ Características: Templates simplificados para edição\n');

console.log('3️⃣  SINCRONIZAÇÃO:');
console.log('   ⚠️  As duas fontes devem ter os MESMOS blocos (type, properties)');
console.log('   ⚠️  Apenas metadata/design pode diferir');
console.log('   ⚠️  Criar script de sincronização para garantir consistência\n');

console.log('4️⃣  AÇÃO IMEDIATA:');
console.log('   1. Verificar se src/templates/imports.ts usa @/config/templates/ ✅ (FEITO)');
console.log('   2. Comparar blocos entre src/config/templates/ e src/data/modularSteps/');
console.log('   3. Sincronizar se houver diferenças nos blocos');
console.log('   4. Testar runtime para confirmar que templates corretos são usados\n');

console.log('='.repeat(80));
console.log('✅ DIAGNÓSTICO COMPLETO!');
console.log('='.repeat(80) + '\n');
