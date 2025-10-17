#!/usr/bin/env node
/**
 * 🧪 TEST: QuizModularProductionEditor carrega blocos JSON modulares
 * 
 * Valida que QuizModularProductionEditor carrega blocos de JSON estático
 * para Steps 12, 19, 20 (em vez de gerar inline).
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const EDITOR_PATH = join(projectRoot, 'src/components/editor/quiz/QuizModularProductionEditor.tsx');

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
  const result = condition ? '✅' : '❌';
  const message = `${result} ${name}`;
  
  if (condition) {
    passed++;
    console.log(message);
  } else {
    failed++;
    console.log(message);
    if (details) console.log(`   └─ ${details}`);
  }
}

console.log('🧪 QuizModularProductionEditor - JSON Loading Tests\n');

const editorContent = readFileSync(EDITOR_PATH, 'utf-8');

// ====================
// CATEGORY 1: IMPORTS
// ====================
console.log('📦 CATEGORY 1: Imports\n');

test(
  'Importa loadStepTemplate',
  editorContent.includes("import { loadStepTemplate } from '@/utils/loadStepTemplates'"),
  'Necessário para carregar JSONs estáticos'
);

// ====================
// CATEGORY 2: ASYNC FUNCTION
// ====================
console.log('\n⚡ CATEGORY 2: Async Function\n');

test(
  'buildEnrichedBlocksForStep é assíncrona',
  /const buildEnrichedBlocksForStep = async \(/.test(editorContent),
  'Necessário para await loadStepTemplate'
);

test(
  'buildEnrichedBlocksForStep retorna Promise',
  editorContent.includes('Promise<any[]>'),
  'Tipo de retorno correto para função async'
);

test(
  'Promise.all envolve o map',
  editorContent.includes('await Promise.all(STEP_ORDER.map(async'),
  'Necessário para esperar todas as promises'
);

// ====================
// CATEGORY 3: CASE TRANSITION
// ====================
console.log('\n🔄 CATEGORY 3: Case Transition (Steps 12, 19)\n');

const transitionCaseMatch = editorContent.match(/case 'transition':([\s\S]*?)case 'result':/);
if (transitionCaseMatch) {
  const transitionCase = transitionCaseMatch[1];
  
  test(
    'Detecta Steps 12 e 19',
    transitionCase.includes('stepNumber === 12 || stepNumber === 19'),
    'Verifica se é step modular'
  );
  
  test(
    'Chama loadStepTemplate para transition',
    transitionCase.includes('await loadStepTemplate(stepId)'),
    'Carrega JSON estático'
  );
  
  test(
    'Retorna blocos do template',
    transitionCase.includes('return templateBlocks.map'),
    'Usa blocos do JSON em vez de gerar inline'
  );
  
  test(
    'Log de sucesso presente',
    transitionCase.includes('✅ Carregando blocos modulares para'),
    'Facilita debug'
  );
}

// ====================
// CATEGORY 4: CASE RESULT
// ====================
console.log('\n🎯 CATEGORY 4: Case Result (Step 20)\n');

const resultCaseMatch = editorContent.match(/case 'result':\s*\{([\s\S]*?)case 'offer':/);
if (resultCaseMatch) {
  const resultCase = resultCaseMatch[1];
  
  test(
    'Detecta Step 20',
    resultCase.includes('stepNumber === 20'),
    'Verifica se é step modular'
  );
  
  test(
    'Chama loadStepTemplate para result',
    resultCase.includes('await loadStepTemplate(stepId)'),
    'Carrega JSON estático'
  );
  
  test(
    'Retorna blocos do template',
    resultCase.includes('return templateBlocks.map'),
    'Usa blocos do JSON em vez de gerar inline'
  );
  
  test(
    'Log de sucesso presente',
    resultCase.includes('✅ Carregando blocos modulares para'),
    'Facilita debug'
  );
}

// ====================
// CATEGORY 5: FALLBACK
// ====================
console.log('\n🛡️ CATEGORY 5: Fallback Behavior\n');

if (transitionCaseMatch) {
  const transitionCase = transitionCaseMatch[1];
  
  test(
    'Fallback para steps sem JSON (transition)',
    transitionCase.includes('// Fallback para steps sem template JSON'),
    'Mantém compatibilidade com outros steps'
  );
  
  test(
    'Gera blocos inline em fallback',
    transitionCase.includes("type: 'heading'") && transitionCase.includes("type: 'text'"),
    'Funcionalidade legacy preservada'
  );
}

if (resultCaseMatch) {
  const resultCase = resultCaseMatch[1];
  
  test(
    'Fallback para steps sem JSON (result)',
    resultCase.includes('// Fallback para steps sem template JSON'),
    'Mantém compatibilidade com outros steps'
  );
  
  test(
    'Gera blocos inline em fallback',
    resultCase.includes("type: 'result-header-inline'"),
    'Funcionalidade legacy preservada'
  );
}

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

if (failed > 0) {
  console.log('⚠️ CORREÇÕES NECESSÁRIAS:\n');
  console.log('1. Adicionar import: loadStepTemplate');
  console.log('2. Tornar buildEnrichedBlocksForStep assíncrona');
  console.log('3. Detectar Steps 12, 19, 20 e carregar JSONs');
  console.log('4. Usar await Promise.all() no map\n');
}

if (passed === total) {
  console.log('✅ QuizModularProductionEditor está pronto para carregar blocos modulares!');
  console.log('\n📝 PRÓXIMOS PASSOS:');
  console.log('1. Iniciar servidor: npm run dev');
  console.log('2. Abrir: http://localhost:5173/editor?template=quiz21StepsComplete');
  console.log('3. Navegar para Steps 12, 19, 20');
  console.log('4. Verificar no console: "✅ Carregando blocos modulares para step-XX"');
  console.log('5. Verificar blocos aparecem, são arrastáveis e selecionáveis\n');
}

process.exit(failed > 0 ? 1 : 0);
