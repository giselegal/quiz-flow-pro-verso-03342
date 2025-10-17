#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO COMPLETO: Por que Steps 12, 19, 20 não são modulares?
 * 
 * Fluxo esperado:
 * 1. UnifiedStepRenderer detecta mode='edit' + type='transition'/'result'
 * 2. Renderiza ModularTransitionStep/ModularResultStep
 * 3. Componentes fazem auto-load de blocos se `blocks.length === 0`
 * 4. EditorProvider.ensureStepLoaded() carrega via loadStepTemplate()
 * 5. Blocos aparecem e são renderizados via UniversalBlockRenderer
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

console.log('\n' + '='.repeat(80));
console.log('🔍 DIAGNÓSTICO: Por que Steps 12, 19, 20 não são modulares?');
console.log('='.repeat(80) + '\n');

let issues = [];
let passed = [];

function check(name, condition, fix = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    passed.push(name);
  } else {
    console.log(`❌ ${name}`);
    if (fix) console.log(`   💡 ${fix}`);
    issues.push({ name, fix });
  }
}

// ============================================================================
// CAMADA 1: TEMPLATES JSON EXISTEM?
// ============================================================================
console.log('📦 CAMADA 1: Templates JSON\n');

const step12 = JSON.parse(readFileSync(join(ROOT, 'src/data/modularSteps/step-12.json'), 'utf-8'));
const step19 = JSON.parse(readFileSync(join(ROOT, 'src/data/modularSteps/step-19.json'), 'utf-8'));
const step20 = JSON.parse(readFileSync(join(ROOT, 'src/data/modularSteps/step-20.json'), 'utf-8'));

check('Step-12 JSON existe e tem blocos', step12.blocks && step12.blocks.length > 0);
check('Step-19 JSON existe e tem blocos', step19.blocks && step19.blocks.length > 0);
check('Step-20 JSON existe e tem blocos', step20.blocks && step20.blocks.length > 0);

console.log(`\n   Step-12: ${step12.blocks?.length || 0} blocos`);
console.log(`   Step-19: ${step19.blocks?.length || 0} blocos`);
console.log(`   Step-20: ${step20.blocks?.length || 0} blocos\n`);

// ============================================================================
// CAMADA 2: COMPONENTES USAM UniversalBlockRenderer?
// ============================================================================
console.log('📦 CAMADA 2: Componentes Modulares\n');

const modularTransition = readFileSync(
  join(ROOT, 'src/components/editor/quiz-estilo/ModularTransitionStep.tsx'),
  'utf-8'
);

check(
  'ModularTransitionStep importa UniversalBlockRenderer',
  modularTransition.includes("import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer'") ||
  modularTransition.includes('UniversalBlockRenderer')
);

check(
  'ModularTransitionStep renderiza via UniversalBlockRenderer',
  modularTransition.includes('<UniversalBlockRenderer')
);

check(
  'ModularTransitionStep tem auto-load',
  modularTransition.includes('if (blocks.length === 0 && editor?.actions?.ensureStepLoaded)')
);

const modularResult = readFileSync(
  join(ROOT, 'src/components/editor/quiz-estilo/ModularResultStep.tsx'),
  'utf-8'
);

check(
  'ModularResultStep importa UniversalBlockRenderer',
  modularResult.includes("import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer'") ||
  modularResult.includes('UniversalBlockRenderer')
);

check(
  'ModularResultStep renderiza via UniversalBlockRenderer',
  modularResult.includes('<UniversalBlockRenderer')
);

check(
  'ModularResultStep tem auto-load',
  modularResult.includes('if (sourceBlocks.length === 0 && editor?.actions?.ensureStepLoaded)')
);

// ============================================================================
// CAMADA 3: UnifiedStepRenderer usa componentes corretos?
// ============================================================================
console.log('\n📦 CAMADA 3: UnifiedStepRenderer\n');

const unifiedRenderer = readFileSync(
  join(ROOT, 'src/components/editor/quiz/components/UnifiedStepRenderer.tsx'),
  'utf-8'
);

check(
  'UnifiedStepRenderer importa ModularTransitionStep',
  unifiedRenderer.includes("import ModularTransitionStep from '@/components/editor/quiz-estilo/ModularTransitionStep'")
);

check(
  'UnifiedStepRenderer importa ModularResultStep',
  unifiedRenderer.includes("import ModularResultStep from '@/components/editor/quiz-estilo/ModularResultStep'")
);

check(
  'UnifiedStepRenderer detecta case transition em edit mode',
  unifiedRenderer.includes("case 'transition':") && unifiedRenderer.includes('<ModularTransitionStep')
);

check(
  'UnifiedStepRenderer detecta case result em edit mode',
  unifiedRenderer.includes("case 'result':") && unifiedRenderer.includes('<ModularResultStep')
);

// ============================================================================
// CAMADA 4: EditorProvider carrega templates?
// ============================================================================
console.log('\n📦 CAMADA 4: EditorProvider\n');

const editorProvider = readFileSync(
  join(ROOT, 'src/components/editor/EditorProviderUnified.tsx'),
  'utf-8'
);

check(
  'EditorProvider importa loadStepTemplate',
  editorProvider.includes("import { loadStepTemplate") || editorProvider.includes("loadStepTemplate")
);

check(
  'EditorProvider importa hasStaticBlocksJSON',
  editorProvider.includes('hasStaticBlocksJSON')
);

check(
  'EditorProvider chama loadStepTemplate em ensureStepLoaded',
  editorProvider.includes('loadStepTemplate(stepKey)')
);

check(
  'EditorProvider tem auto-load useEffect',
  editorProvider.includes('useEffect(() => {') && editorProvider.includes('ensureStepLoaded(state.currentStep)')
);

// ============================================================================
// CAMADA 5: loadStepTemplate carrega JSONs corretos?
// ============================================================================
console.log('\n📦 CAMADA 5: loadStepTemplate\n');

const loadStepTemplates = readFileSync(
  join(ROOT, 'src/utils/loadStepTemplates.ts'),
  'utf-8'
);

check(
  'loadStepTemplate importa step-12.json',
  loadStepTemplates.includes("import step12Template from '@/data/modularSteps/step-12.json'")
);

check(
  'loadStepTemplate importa step-19.json',
  loadStepTemplates.includes("import step19Template from '@/data/modularSteps/step-19.json'")
);

check(
  'loadStepTemplate importa step-20.json',
  loadStepTemplates.includes("import step20Template from '@/data/modularSteps/step-20.json'")
);

check(
  'loadStepTemplate tem mapeamento para step-12',
  loadStepTemplates.includes("'step-12': step12Template")
);

check(
  'loadStepTemplate tem mapeamento para step-19',
  loadStepTemplates.includes("'step-19': step19Template")
);

check(
  'loadStepTemplate tem mapeamento para step-20',
  loadStepTemplates.includes("'step-20': step20Template")
);

// ============================================================================
// CAMADA 6: UniversalBlockRenderer tem os blocos registrados?
// ============================================================================
console.log('\n📦 CAMADA 6: UniversalBlockRenderer Registry\n');

const universalBlockRenderer = readFileSync(
  join(ROOT, 'src/components/editor/blocks/UniversalBlockRenderer.tsx'),
  'utf-8'
);

// Verificar blocos específicos de transition e result
const transitionBlocks = [
  'transition-loader',
  'transition-progress',
  'transition-title',
  'transition-text'
];

const resultBlocks = [
  'result-main',
  'result-style',
  'result-share',
  'result-characteristics'
];

console.log('  🔍 Blocos de Transition:');
transitionBlocks.forEach(blockType => {
  const registered = universalBlockRenderer.includes(`'${blockType}'`) || 
                     universalBlockRenderer.includes(`"${blockType}"`);
  check(`    ${blockType}`, registered);
});

console.log('\n  🔍 Blocos de Result:');
resultBlocks.forEach(blockType => {
  const registered = universalBlockRenderer.includes(`'${blockType}'`) || 
                     universalBlockRenderer.includes(`"${blockType}"`);
  check(`    ${blockType}`, registered);
});

// ============================================================================
// RESULTADO FINAL
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('📊 RESULTADO FINAL');
console.log('='.repeat(80) + '\n');

console.log(`✅ Verificações OK: ${passed.length}`);
console.log(`❌ Problemas encontrados: ${issues.length}\n`);

if (issues.length > 0) {
  console.log('🔧 PROBLEMAS A CORRIGIR:\n');
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ❌ ${issue.name}`);
    if (issue.fix) {
      console.log(`   💡 ${issue.fix}`);
    }
  });
  console.log('');
} else {
  console.log('🎉 TODAS AS VERIFICAÇÕES PASSARAM!\n');
  console.log('📋 PRÓXIMOS PASSOS PARA TESTAR:\n');
  console.log('1. Iniciar servidor: npm run dev');
  console.log('2. Abrir: http://localhost:5173/editor?template=quiz21StepsComplete');
  console.log('3. Navegar para Step 12, 19 ou 20');
  console.log('4. Verificar console do navegador para logs:');
  console.log('   - 🔄 [ModularTransitionStep] Auto-loading step-12');
  console.log('   - 🔍 [ensureStepLoaded] step-12');
  console.log('   - ✅ Loaded modular blocks: { count: 9, ... }');
  console.log('5. Confirmar que blocos aparecem na tela\n');
}

// ============================================================================
// ANÁLISE DE POSSÍVEIS CAUSAS
// ============================================================================
if (issues.length === 0) {
  console.log('🤔 SE MESMO COM TUDO OK OS BLOCOS NÃO APARECEM:\n');
  console.log('Possíveis causas:');
  console.log('1. EditorProvider não está sendo usado no componente pai');
  console.log('2. UnifiedStepRenderer não está sendo renderizado');
  console.log('3. stepType não está sendo inferido corretamente (transition/result)');
  console.log('4. Auto-load não está sendo trigado (verificar logs console)');
  console.log('5. Blocos carregados mas orderedBlocks.length === 0 (bug sorting)\n');
  
  console.log('🔍 COMANDOS DE DEBUG:');
  console.log('# Ver estrutura dos templates');
  console.log('cat src/data/modularSteps/step-12.json | jq ".blocks[].type"\n');
  
  console.log('# Ver se EditorProvider está presente');
  console.log('grep -r "EditorProvider" src/components/editor/quiz/ | head -5\n');
  
  console.log('# Ver logs do auto-load');
  console.log('# (Abrir DevTools Console no navegador)\n');
}

console.log('='.repeat(80) + '\n');
