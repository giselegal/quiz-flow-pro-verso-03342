#!/usr/bin/env node
/**
 * 🧪 TEST: UNIFIED MODULAR ARCHITECTURE v3.0
 * 
 * Valida que UnifiedStepRenderer usa APENAS componentes modulares
 * em EDIÇÃO e PRODUÇÃO (sem duplicação de código legacy).
 * 
 * ✅ Verifica:
 *  1. Componentes legados NÃO são importados
 *  2. Componentes modulares são importados estaticamente
 *  3. Todos os 6 types usam componentes modulares
 *  4. isEditable={isEditMode} controla comportamento
 *  5. Sem if/else baseado em modo (código unificado)
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const UNIFIED_RENDERER_PATH = join(projectRoot, 'src/components/editor/quiz/components/UnifiedStepRenderer.tsx');

// ✅ TEST CATEGORIES
const tests = {
  imports: [],
  caseStatements: [],
  editable: [],
  unification: []
};

let passed = 0;
let failed = 0;

function test(category, name, condition, details = '') {
  const result = condition ? '✅' : '❌';
  const message = `${result} ${name}`;
  
  tests[category].push({ name, passed: condition, details });
  
  if (condition) {
    passed++;
    console.log(message);
  } else {
    failed++;
    console.log(message);
    if (details) console.log(`   └─ ${details}`);
  }
}

console.log('🧪 UNIFIED MODULAR ARCHITECTURE - v3.0 Tests\n');

// ====================
// READ SOURCE FILES
// ====================
const rendererContent = readFileSync(UNIFIED_RENDERER_PATH, 'utf-8');

// ====================
// CATEGORY 1: IMPORTS
// ====================
console.log('📦 CATEGORY 1: Import Structure\n');

// 1.1 Verify NO legacy imports
const legacyImports = [
  'const IntroStep = lazy',
  'const QuestionStep = lazy',
  'const StrategicQuestionStep = lazy',
  'const TransitionStep = lazy',
  'const ResultStep = lazy',
  'const OfferStep = lazy'
];

legacyImports.forEach(legacyImport => {
  const hasLegacy = rendererContent.includes(legacyImport) && !rendererContent.includes(`// ${legacyImport}`);
  test(
    'imports',
    `Componente legacy NÃO importado: ${legacyImport.split(' = ')[0].replace('const ', '')}`,
    !hasLegacy,
    hasLegacy ? 'Legacy import ainda existe (deveria estar comentado)' : ''
  );
});

// 1.2 Verify modular imports exist
const modularImports = [
  'import ModularIntroStep',
  'import ModularQuestionStep',
  'import ModularStrategicQuestionStep',
  'import ModularTransitionStep',
  'import ModularResultStep',
  'import ModularOfferStep'
];

modularImports.forEach(modularImport => {
  test(
    'imports',
    `Componente modular importado: ${modularImport.replace('import ', '')}`,
    rendererContent.includes(modularImport)
  );
});

// ====================
// CATEGORY 2: CASE STATEMENTS
// ====================
console.log('\n🔀 CATEGORY 2: Case Statement Structure\n');

const stepTypes = [
  { type: 'intro', component: 'ModularIntroStep' },
  { type: 'question', component: 'ModularQuestionStep' },
  { type: 'strategic-question', component: 'ModularStrategicQuestionStep' },
  { type: 'transition', component: 'ModularTransitionStep' },
  { type: 'result', component: 'ModularResultStep' },
  { type: 'offer', component: 'ModularOfferStep' }
];

stepTypes.forEach(({ type, component }) => {
  // Extract case block
  const caseRegex = new RegExp(`case '${type}':\\s*\\{[\\s\\S]*?\\}(?=\\s*case|\\s*default)`, 'm');
  const caseMatch = rendererContent.match(caseRegex);
  
  if (caseMatch) {
    const caseBlock = caseMatch[0];
    
    // 2.1 Verify uses modular component
    test(
      'caseStatements',
      `case '${type}': Usa ${component}`,
      caseBlock.includes(`<${component}`)
    );
    
    // 2.2 Verify NO legacy component used
    const legacyComponent = component.replace('Modular', '');
    const usesLegacy = caseBlock.includes(`<${legacyComponent}`) && !caseBlock.includes(`// <${legacyComponent}`);
    test(
      'caseStatements',
      `case '${type}': NÃO usa ${legacyComponent} legacy`,
      !usesLegacy,
      usesLegacy ? `Ainda usa componente legacy ${legacyComponent}` : ''
    );
  }
});

// ====================
// CATEGORY 3: EDITABLE PROP
// ====================
console.log('\n🎛️ CATEGORY 3: isEditable Prop Control\n');

stepTypes.forEach(({ type, component }) => {
  const caseRegex = new RegExp(`case '${type}':\\s*\\{[\\s\\S]*?\\}(?=\\s*case|\\s*default)`, 'm');
  const caseMatch = rendererContent.match(caseRegex);
  
  if (caseMatch) {
    const caseBlock = caseMatch[0];
    
    // 3.1 Verify isEditable={isEditMode} pattern
    const hasEditableProp = caseBlock.includes('isEditable={isEditMode}') || 
                            caseBlock.includes('isEditable={true}') ||
                            caseBlock.includes('isEditable={false}');
    
    test(
      'editable',
      `case '${type}': Usa isEditable prop`,
      hasEditableProp,
      !hasEditableProp ? 'Prop isEditable não encontrada' : ''
    );
  }
});

// ====================
// CATEGORY 4: CODE UNIFICATION
// ====================
console.log('\n🔗 CATEGORY 4: Code Unification\n');

stepTypes.forEach(({ type, component }) => {
  const caseRegex = new RegExp(`case '${type}':\\s*\\{[\\s\\S]*?\\}(?=\\s*case|\\s*default)`, 'm');
  const caseMatch = rendererContent.match(caseRegex);
  
  if (caseMatch) {
    const caseBlock = caseMatch[0];
    
    // 4.1 Verify NO if (isEditMode) branching for component selection
    const hasModeSwitching = /if\s*\(\s*isEditMode\s*\)\s*\{[\s\S]*?return[\s\S]*?<Modular/.test(caseBlock) &&
                             /\}\s*return[\s\S]*?<(?!Modular)/.test(caseBlock);
    
    test(
      'unification',
      `case '${type}': Código unificado (sem if/else para componente)`,
      !hasModeSwitching,
      hasModeSwitching ? 'Ainda usa if (isEditMode) para escolher componente' : ''
    );
    
    // 4.2 Verify has unification comment
    const hasUnificationComment = caseBlock.includes('✅ MODULAR para EDIÇÃO e PRODUÇÃO');
    test(
      'unification',
      `case '${type}': Comentário de unificação presente`,
      hasUnificationComment
    );
  }
});

// ====================
// SUMMARY
// ====================
console.log('\n' + '═'.repeat(50));
console.log('📊 SUMMARY');
console.log('═'.repeat(50));

const total = passed + failed;
const percentage = ((passed / total) * 100).toFixed(1);

console.log(`Total: ${total} tests`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Success Rate: ${percentage}%\n`);

// Show failures by category
if (failed > 0) {
  console.log('❌ FAILURES BY CATEGORY:\n');
  Object.entries(tests).forEach(([category, results]) => {
    const failures = results.filter(r => !r.passed);
    if (failures.length > 0) {
      console.log(`${category.toUpperCase()}:`);
      failures.forEach(f => {
        console.log(`  • ${f.name}`);
        if (f.details) console.log(`    └─ ${f.details}`);
      });
      console.log('');
    }
  });
}

// ====================
// ARCHITECTURE INSIGHTS
// ====================
console.log('🏗️ ARCHITECTURE INSIGHTS:\n');

const componentCounts = {
  modular: (rendererContent.match(/import Modular\w+Step/g) || []).length,
  legacy: (rendererContent.match(/^(?!.*\/\/).*const \w+Step = lazy/gm) || []).length
};

console.log(`• Componentes modulares importados: ${componentCounts.modular}/6`);
console.log(`• Componentes legacy importados: ${componentCounts.legacy}/6`);
console.log(`• Blocos case unificados: ${tests.unification.filter(t => t.passed).length}/${stepTypes.length}`);

if (componentCounts.legacy === 0 && componentCounts.modular === 6) {
  console.log('\n✅ ARQUITETURA 100% MODULAR alcançada!');
} else {
  console.log('\n⚠️ Migração incompleta - ainda há componentes legacy.');
}

// ====================
// EXIT CODE
// ====================
process.exit(failed > 0 ? 1 : 0);
