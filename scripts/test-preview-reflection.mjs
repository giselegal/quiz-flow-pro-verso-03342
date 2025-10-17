#!/usr/bin/env node

/**
 * ✅ TESTE: Preview Reflection (Modo Edição → Modo Preview)
 * 
 * Valida que alterações feitas no modo edição refletem corretamente no modo preview
 * 
 * CHECKLIST:
 * [✅] QuizProductionPreview recebe prop editorSteps
 * [✅] useEffect monitora mudanças em editorSteps
 * [✅] refreshKey atualiza quando editorSteps muda
 * [✅] externalStepsToUse prioriza editorSteps > liveSteps
 * [✅] ModularPreviewContainer recebe externalStepsToUse atualizado
 * [✅] Logs de debug adicionados para rastreamento
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Helpers
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const blue = (text) => `\x1b[34m${text}\x1b[0m`;
const bold = (text) => `\x1b[1m${text}\x1b[0m`;

let passCount = 0;
let failCount = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`${green('✓')} ${name}`);
        passCount++;
    } catch (error) {
        console.log(`${red('✗')} ${name}`);
        console.log(`  ${red('Error:')} ${error.message}`);
        failCount++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

// Ler arquivos
const previewPath = join(projectRoot, 'src/components/editor/quiz/QuizProductionPreview.tsx');
const editorPath = join(projectRoot, 'src/components/editor/quiz/QuizModularProductionEditor.tsx');

console.log(bold('\n🔍 TESTE: Preview Reflection (Edição → Preview)\n'));
console.log(`${blue('Preview:')} ${previewPath}`);
console.log(`${blue('Editor:')} ${editorPath}\n`);

let previewContent, editorContent;

try {
    previewContent = readFileSync(previewPath, 'utf-8');
    editorContent = readFileSync(editorPath, 'utf-8');
} catch (error) {
    console.error(red('Erro ao ler arquivos:'), error.message);
    process.exit(1);
}

// ==================== TESTES ====================

console.log(bold('📋 PARTE 1: Prop editorSteps\n'));

test('QuizProductionPreview recebe prop editorSteps', () => {
    assert(
        /editorSteps\?:/.test(previewContent),
        'Prop editorSteps não encontrada na interface'
    );
});

test('editorSteps é desestruturado nos props', () => {
    const match = previewContent.match(/export const QuizProductionPreview[^{]*\{([^}]+)\}/s);
    assert(match, 'Desestruturação de props não encontrada');
    assert(match[1].includes('editorSteps'), 'editorSteps não desestruturado');
});

console.log(bold('\n📋 PARTE 2: useEffect para editorSteps\n'));

test('Existe useEffect monitorando editorSteps', () => {
    assert(
        /useEffect\s*\([^)]*\)\s*,\s*\[editorSteps\]/.test(previewContent),
        'useEffect com dependência [editorSteps] não encontrado'
    );
});

test('useEffect atualiza refreshKey quando editorSteps muda', () => {
    // Procura por useEffect que monitora editorSteps e chama setRefreshKey
    const useEffectMatch = previewContent.match(
        /useEffect\s*\(\s*\(\)\s*=>\s*\{[^}]*editorSteps[^}]*setRefreshKey[^}]*\}\s*,\s*\[editorSteps\]/s
    );
    assert(
        useEffectMatch,
        'useEffect não atualiza refreshKey quando editorSteps muda'
    );
});

test('useEffect tem log de debug para rastreamento', () => {
    const useEffectBlock = previewContent.match(
        /useEffect\s*\(\s*\(\)\s*=>\s*\{[^}]*editorSteps[^}]*\}\s*,\s*\[editorSteps\]/s
    );
    assert(useEffectBlock, 'useEffect [editorSteps] não encontrado');
    assert(
        /console\.log/.test(useEffectBlock[0]),
        'useEffect não tem log de debug'
    );
});

console.log(bold('\n📋 PARTE 3: externalStepsToUse\n'));

test('externalStepsToUse prioriza editorSteps sobre liveSteps', () => {
    assert(
        /const externalStepsToUse\s*=\s*editorSteps\s*\|\|\s*liveSteps/.test(previewContent),
        'externalStepsToUse não prioriza editorSteps'
    );
});

test('Existe useEffect logando mudanças em externalStepsToUse', () => {
    const debugEffect = previewContent.match(
        /useEffect\s*\([^)]*externalStepsToUse[^)]*\)[^;]*;/s
    );
    assert(
        debugEffect && /console\.log/.test(debugEffect[0]),
        'useEffect de debug para externalStepsToUse não encontrado'
    );
});

console.log(bold('\n📋 PARTE 4: ModularPreviewContainer\n'));

test('ModularPreviewContainer recebe externalStepsToUse', () => {
    assert(
        /<ModularPreviewContainer[^>]*externalSteps=\{externalStepsToUse/.test(previewContent),
        'ModularPreviewContainer não recebe externalStepsToUse'
    );
});

test('ModularPreviewContainer está dentro de div com key={refreshKey}', () => {
    const match = previewContent.match(
        /<div\s+key=\{refreshKey\}>\s*<ModularPreviewContainer/s
    );
    assert(
        match,
        'ModularPreviewContainer não está dentro de div com key={refreshKey}'
    );
});

console.log(bold('\n📋 PARTE 5: QuizModularProductionEditor\n'));

test('Editor passa editorSteps={debouncedSteps} para QuizProductionPreview', () => {
    assert(
        /<QuizProductionPreview[^>]*editorSteps=\{debouncedSteps\}/.test(editorContent),
        'Editor não passa editorSteps para QuizProductionPreview'
    );
});

test('debouncedSteps tem debounce de 400ms', () => {
    const match = editorContent.match(
        /debounceRef\.current\s*=\s*window\.setTimeout\([^,]*,\s*(\d+)\)/
    );
    assert(match, 'Debounce setTimeout não encontrado');
    const delay = parseInt(match[1], 10);
    assert(
        delay === 400,
        `Delay esperado: 400ms, encontrado: ${delay}ms`
    );
});

console.log(bold('\n📋 PARTE 6: Fluxo Completo\n'));

test('Fluxo: Editor → debouncedSteps → QuizProductionPreview → externalStepsToUse → ModularPreviewContainer', () => {
    // 1. Editor tem debouncedSteps
    assert(
        /const \[debouncedSteps, setDebouncedSteps\]/.test(editorContent),
        'Editor não tem debouncedSteps'
    );
    
    // 2. Editor passa para QuizProductionPreview
    assert(
        /<QuizProductionPreview[^>]*editorSteps=\{debouncedSteps\}/.test(editorContent),
        'Editor não passa debouncedSteps para QuizProductionPreview'
    );
    
    // 3. Preview cria externalStepsToUse
    assert(
        /const externalStepsToUse\s*=\s*editorSteps/.test(previewContent),
        'Preview não usa editorSteps para criar externalStepsToUse'
    );
    
    // 4. Preview passa para ModularPreviewContainer
    assert(
        /<ModularPreviewContainer[^>]*externalSteps=\{externalStepsToUse/.test(previewContent),
        'Preview não passa externalStepsToUse para ModularPreviewContainer'
    );
});

test('refreshKey força re-render quando editorSteps muda', () => {
    // Verifica que refreshKey é atualizado em useEffect [editorSteps]
    const effectMatch = previewContent.match(
        /useEffect\s*\([^)]*\)\s*,\s*\[editorSteps\]/s
    );
    assert(effectMatch, 'useEffect [editorSteps] não encontrado');
    
    // Verifica que setRefreshKey é chamado dentro do effect
    assert(
        /setRefreshKey/.test(effectMatch[0]),
        'setRefreshKey não é chamado no useEffect [editorSteps]'
    );
    
    // Verifica que ModularPreviewContainer está em div com key={refreshKey}
    assert(
        /<div\s+key=\{refreshKey\}>\s*<ModularPreviewContainer/.test(previewContent),
        'ModularPreviewContainer não usa refreshKey para forçar re-render'
    );
});

// ==================== RESULTADO ====================

console.log(bold(`\n${'='.repeat(60)}`));
console.log(bold('RESULTADO DO TESTE'));
console.log(bold('='.repeat(60)));

const total = passCount + failCount;
const percentage = ((passCount / total) * 100).toFixed(1);

console.log(`\n${green('✓ Passou:')} ${passCount}/${total} (${percentage}%)`);

if (failCount > 0) {
    console.log(`${red('✗ Falhou:')} ${failCount}/${total}`);
}

console.log(bold('\n📊 RESUMO DAS MUDANÇAS:\n'));

console.log(`${green('✅')} QuizProductionPreview:`);
console.log(`   ├─ Recebe prop editorSteps`);
console.log(`   ├─ useEffect monitora mudanças em editorSteps`);
console.log(`   ├─ Atualiza refreshKey quando editorSteps muda`);
console.log(`   ├─ externalStepsToUse = editorSteps || liveSteps`);
console.log(`   ├─ Logs de debug adicionados`);
console.log(`   └─ ModularPreviewContainer recebe externalStepsToUse`);

console.log(`\n${green('✅')} QuizModularProductionEditor:`);
console.log(`   ├─ debouncedSteps com delay de 400ms`);
console.log(`   └─ Passa editorSteps={debouncedSteps} para QuizProductionPreview`);

console.log(bold('\n🔍 FLUXO DE DADOS:\n'));
console.log(`1. ${yellow('Usuário edita bloco')} no canvas`);
console.log(`2. ${yellow('setSteps()')} atualiza estado local`);
console.log(`3. ${yellow('Debounce 400ms')} → setDebouncedSteps()`);
console.log(`4. ${yellow('debouncedSteps')} passado para QuizProductionPreview`);
console.log(`5. ${yellow('useEffect [editorSteps]')} detecta mudança`);
console.log(`6. ${yellow('setRefreshKey()')} incrementa contador`);
console.log(`7. ${yellow('key={refreshKey}')} força re-render do ModularPreviewContainer`);
console.log(`8. ${yellow('externalSteps={externalStepsToUse}')} passa steps atualizados`);
console.log(`9. ${green('Preview reflete mudanças')} 🎉`);

console.log(bold('\n🎯 PRÓXIMOS PASSOS:\n'));
console.log(`1. ${yellow('Abrir DevTools')} no navegador (F12)`);
console.log(`2. ${yellow('Ir para aba Console')}`);
console.log(`3. ${yellow('Editar bloco')} no canvas (ex: mudar texto)`);
console.log(`4. ${yellow('Verificar logs:')} 🎯 QuizProductionPreview: externalStepsToUse atualizado`);
console.log(`5. ${yellow('Trocar para modo Preview')} e verificar se mudança aparece`);
console.log(`6. ${yellow('Se não aparecer,')} verificar erros no console`);

console.log('');

process.exit(failCount > 0 ? 1 : 0);
