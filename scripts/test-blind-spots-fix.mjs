#!/usr/bin/env node
/**
 * 🔍 TESTE COMPLETO: Correção dos 3 Blind Spots
 * 
 * BLIND SPOT #1: hasModularTemplate() semanticamente invertido
 * BLIND SPOT #2: Auto-load não trigga com array vazio
 * BLIND SPOT #3: ModularTransitionStep/ModularResultStep passivos
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

console.log('\n' + '='.repeat(80));
console.log('🔍 VALIDAÇÃO: Correção dos 3 Blind Spots');
console.log('='.repeat(80) + '\n');

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failed++;
  }
}

// ============================================================================
// BLIND SPOT #1: hasStaticBlocksJSON criado
// ============================================================================
console.log('📦 BLIND SPOT #1: Função hasStaticBlocksJSON\n');

const loadStepTemplates = readFileSync(
  join(ROOT, 'src/utils/loadStepTemplates.ts'),
  'utf-8'
);

test(
  '1.1 Função hasStaticBlocksJSON declarada',
  loadStepTemplates.includes('export function hasStaticBlocksJSON'),
  'Nova função com nome semanticamente correto'
);

test(
  '1.2 hasStaticBlocksJSON retorna steps 12, 19, 20',
  loadStepTemplates.includes("return ['step-12', 'step-19', 'step-20'].includes(stepId)"),
  'Apenas steps com JSON estático'
);

test(
  '1.3 hasModularTemplate marcado como @deprecated',
  loadStepTemplates.includes('@deprecated Use hasStaticBlocksJSON()'),
  'Mantém backward compatibility'
);

test(
  '1.4 Comentário explicativo sobre inversão semântica',
  loadStepTemplates.includes('ATENÇÃO: O nome está semanticamente invertido!'),
  'Documenta o problema histórico'
);

// ============================================================================
// BLIND SPOT #2: Auto-load melhorado no Provider
// ============================================================================
console.log('\n📦 BLIND SPOT #2: Auto-load Provider Melhorado\n');

const editorProvider = readFileSync(
  join(ROOT, 'src/components/editor/EditorProviderUnified.tsx'),
  'utf-8'
);

test(
  '2.1 hasStaticBlocksJSON importado',
  editorProvider.includes('hasStaticBlocksJSON'),
  'Nova função disponível no provider'
);

test(
  '2.2 Verifica múltiplas condições de "vazio"',
  editorProvider.includes('!stepBlocks') &&
  editorProvider.includes('stepBlocks.length === 0') &&
  editorProvider.includes('stepBlocks === undefined'),
  'Cobre todos os casos: missing, empty, undefined'
);

test(
  '2.3 Log detalhado do motivo do carregamento',
  editorProvider.includes("const reason = !stepBlocks ? 'missing' : 'empty array'"),
  'Debugging: registra se missing ou empty'
);

test(
  '2.4 Log no ensureStepLoaded inclui hasStaticBlocksJSON',
  editorProvider.includes("console.log('hasStaticBlocksJSON:', hasStaticBlocksJSON(stepKey))"),
  'Logs detalhados para debug'
);

// ============================================================================
// BLIND SPOT #3: Auto-load nos componentes
// ============================================================================
console.log('\n📦 BLIND SPOT #3: Auto-load Componentes Modulares\n');

const modularTransition = readFileSync(
  join(ROOT, 'src/components/editor/quiz-estilo/ModularTransitionStep.tsx'),
  'utf-8'
);

test(
  '3.1 ModularTransitionStep: useEffect de auto-load',
  modularTransition.includes('if (blocks.length === 0 && editor?.actions?.ensureStepLoaded)'),
  'Trigga carregamento se blocos vazios'
);

test(
  '3.2 ModularTransitionStep: Log de início de carregamento',
  modularTransition.includes('🔄 [ModularTransitionStep] Auto-loading'),
  'Console mostra início do carregamento'
);

test(
  '3.3 ModularTransitionStep: Log de sucesso',
  modularTransition.includes('✅ [ModularTransitionStep] Loaded'),
  'Console confirma sucesso'
);

test(
  '3.4 ModularTransitionStep: Log de erro',
  modularTransition.includes('❌ [ModularTransitionStep] Failed to load'),
  'Console registra falhas'
);

const modularResult = readFileSync(
  join(ROOT, 'src/components/editor/quiz-estilo/ModularResultStep.tsx'),
  'utf-8'
);

test(
  '3.5 ModularResultStep: useEffect de auto-load',
  modularResult.includes('if (sourceBlocks.length === 0 && editor?.actions?.ensureStepLoaded)'),
  'Trigga carregamento se blocos vazios'
);

test(
  '3.6 ModularResultStep: Log de início de carregamento',
  modularResult.includes('🔄 [ModularResultStep] Auto-loading'),
  'Console mostra início do carregamento'
);

test(
  '3.7 ModularResultStep: Log de sucesso',
  modularResult.includes('✅ [ModularResultStep] Loaded'),
  'Console confirma sucesso'
);

test(
  '3.8 ModularResultStep: Log de erro',
  modularResult.includes('❌ [ModularResultStep] Failed to load'),
  'Console registra falhas'
);

// ============================================================================
// VALIDAÇÃO DOS TEMPLATES SINCRONIZADOS
// ============================================================================
console.log('\n📦 BONUS: Templates Sincronizados\n');

const step12Editor = JSON.parse(readFileSync(
  join(ROOT, 'src/data/modularSteps/step-12.json'),
  'utf-8'
));

test(
  'B.1 Step-12 editor: 9 blocos sincronizados',
  step12Editor.blocks.length === 9,
  `Contagem: ${step12Editor.blocks.length} blocos`
);

test(
  'B.2 Step-12 editor: Contém quiz-intro-header',
  step12Editor.blocks.some(b => b.type === 'quiz-intro-header'),
  'Bloco do runtime presente'
);

test(
  'B.3 Step-12 editor: Contém options-grid',
  step12Editor.blocks.some(b => b.type === 'options-grid'),
  'Bloco crítico presente'
);

const step19Editor = JSON.parse(readFileSync(
  join(ROOT, 'src/data/modularSteps/step-19.json'),
  'utf-8'
));

test(
  'B.4 Step-19 editor: 5 blocos sincronizados',
  step19Editor.blocks.length === 5,
  `Contagem: ${step19Editor.blocks.length} blocos`
);

test(
  'B.5 Step-19 editor: Contém image-display-inline',
  step19Editor.blocks.some(b => b.type === 'image-display-inline'),
  'Bloco de imagem presente'
);

const step20Editor = JSON.parse(readFileSync(
  join(ROOT, 'src/data/modularSteps/step-20.json'),
  'utf-8'
));

test(
  'B.6 Step-20 editor: 13 blocos sincronizados',
  step20Editor.blocks.length === 13,
  `Contagem: ${step20Editor.blocks.length} blocos`
);

test(
  'B.7 Step-20 editor: Contém result-main',
  step20Editor.blocks.some(b => b.type === 'result-main'),
  'Bloco de resultado presente'
);

test(
  'B.8 Step-20 editor: Contém result-share',
  step20Editor.blocks.some(b => b.type === 'result-share'),
  'Bloco de compartilhamento presente'
);

// ============================================================================
// RESULTADO FINAL
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('📊 RESULTADO FINAL');
console.log('='.repeat(80));
console.log(`✅ Testes Aprovados: ${passed}`);
console.log(`❌ Testes Falhados: ${failed}`);
console.log(`📈 Taxa de Sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 TODOS OS BLIND SPOTS CORRIGIDOS!');
  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('   1. Iniciar servidor: npm run dev');
  console.log('   2. Abrir: /editor?template=quiz21StepsComplete');
  console.log('   3. Navegar para Step 12, 19 ou 20');
  console.log('   4. Verificar console para logs de auto-load');
  console.log('   5. Confirmar que blocos aparecem no editor\n');
} else {
  console.log('\n⚠️ ALGUNS TESTES FALHARAM - REVISAR CORREÇÕES\n');
  process.exit(1);
}
