#!/usr/bin/env node

/**
 * ✅ VALIDAÇÃO: Preview Mode Fix
 * 
 * Confirma que o QuizProductionPreview agora aceita e usa editorSteps
 * para refletir mudanças do editor em tempo real
 * 
 * CHECKLIST:
 * [✅] Interface QuizProductionPreviewProps tem editorSteps
 * [✅] Componente desestrutura editorSteps dos props
 * [✅] externalStepsToUse prioriza editorSteps > liveSteps
 * [✅] ModularPreviewContainer recebe externalStepsToUse
 * [✅] QuizModularProductionEditor passa editorSteps={debouncedSteps}
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

console.log(bold('\n🔍 VALIDAÇÃO: Preview Mode Fix\n'));
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

console.log(bold('📋 PARTE 1: Interface QuizProductionPreviewProps\n'));

test('Interface tem prop editorSteps', () => {
    assert(
        /editorSteps\?:\s*Array<\{/.test(previewContent),
        'editorSteps não encontrado na interface'
    );
});

test('editorSteps tem tipo correto (Array<{id, type, blocks}>)', () => {
    const match = previewContent.match(/editorSteps\?:\s*Array<\{([^}]+)\}>/);
    assert(match, 'Tipo de editorSteps não encontrado');
    
    const type = match[1];
    assert(type.includes('id:'), 'Tipo deve incluir id');
    assert(type.includes('type:'), 'Tipo deve incluir type');
    assert(type.includes('blocks:'), 'Tipo deve incluir blocks');
});

test('editorSteps tem comentário JSDoc explicativo', () => {
    assert(
        /\/\*\*[^*]*Steps editados no editor[^*]*\*\//.test(previewContent),
        'Comentário JSDoc não encontrado'
    );
});

console.log(bold('\n📋 PARTE 2: Desestruturação dos Props\n'));

test('Componente desestrutura editorSteps', () => {
    const match = previewContent.match(/export const QuizProductionPreview[^{]*\{([^}]+)\}/s);
    assert(match, 'Desestruturação de props não encontrada');
    
    const props = match[1];
    assert(props.includes('editorSteps'), 'editorSteps não desestruturado');
});

test('Desestruturação inclui todas as props necessárias', () => {
    const match = previewContent.match(/export const QuizProductionPreview[^{]*\{([^}]+)\}/s);
    const props = match[1];
    
    assert(props.includes('funnelId'), 'funnelId ausente');
    assert(props.includes('className'), 'className ausente');
    assert(props.includes('onStateChange'), 'onStateChange ausente');
    assert(props.includes('refreshToken'), 'refreshToken ausente');
    assert(props.includes('editorSteps'), 'editorSteps ausente');
});

console.log(bold('\n📋 PARTE 3: Lógica de Priorização\n'));

test('Existe variável externalStepsToUse', () => {
    assert(
        /const externalStepsToUse/.test(previewContent),
        'externalStepsToUse não encontrado'
    );
});

test('externalStepsToUse prioriza editorSteps sobre liveSteps', () => {
    const match = previewContent.match(/const externalStepsToUse\s*=\s*([^;]+);/);
    assert(match, 'Atribuição de externalStepsToUse não encontrada');
    
    const value = match[1].trim();
    assert(
        /editorSteps.*\|\|.*liveSteps/.test(value),
        'Priorização incorreta: deve ser editorSteps || liveSteps'
    );
});

test('Comentário explica priorização (editorSteps > liveSteps)', () => {
    assert(
        /PRIORIDADE.*editorSteps.*>.*liveSteps/.test(previewContent),
        'Comentário de priorização não encontrado'
    );
});

console.log(bold('\n📋 PARTE 4: ModularPreviewContainer\n'));

test('ModularPreviewContainer recebe externalSteps', () => {
    assert(
        /<ModularPreviewContainer[^>]*externalSteps/.test(previewContent),
        'ModularPreviewContainer não recebe externalSteps'
    );
});

test('externalSteps usa externalStepsToUse (não liveSteps direto)', () => {
    const match = previewContent.match(/<ModularPreviewContainer[^>]*externalSteps=\{([^}]+)\}/);
    assert(match, 'Prop externalSteps não encontrada');
    
    const value = match[1].trim();
    assert(
        value.includes('externalStepsToUse'),
        `externalSteps deve usar externalStepsToUse, mas usa: ${value}`
    );
    assert(
        !value.includes('liveSteps ||'),
        'Não deve usar liveSteps diretamente (deve usar externalStepsToUse)'
    );
});

console.log(bold('\n📋 PARTE 5: QuizModularProductionEditor\n'));

test('QuizModularProductionEditor passa editorSteps para QuizProductionPreview', () => {
    assert(
        /<QuizProductionPreview[^>]*editorSteps/.test(editorContent),
        'editorSteps não passado para QuizProductionPreview'
    );
});

test('editorSteps usa debouncedSteps', () => {
    const match = editorContent.match(/<QuizProductionPreview[^>]*editorSteps=\{([^}]+)\}/);
    assert(match, 'Prop editorSteps não encontrada');
    
    const value = match[1].trim();
    assert(
        value === 'debouncedSteps',
        `editorSteps deve ser debouncedSteps, mas é: ${value}`
    );
});

test('QuizProductionPreview está no modo production (LivePreviewContainer)', () => {
    assert(
        /mode === ['"]production['"].*<QuizProductionPreview/.test(editorContent),
        'QuizProductionPreview não está no modo production'
    );
});

console.log(bold('\n📋 PARTE 6: Integração Completa\n'));

test('Fluxo completo: Editor → Preview → ModularPreviewContainer', () => {
    // Editor passa debouncedSteps
    assert(
        editorContent.includes('editorSteps={debouncedSteps}'),
        'Editor não passa debouncedSteps'
    );
    
    // Preview recebe e prioriza
    assert(
        previewContent.includes('editorSteps || liveSteps'),
        'Preview não prioriza editorSteps'
    );
    
    // ModularPreviewContainer recebe
    assert(
        previewContent.includes('externalSteps={externalStepsToUse'),
        'ModularPreviewContainer não recebe externalStepsToUse'
    );
});

test('Modo live continua funcionando (LiveRuntimePreview)', () => {
    assert(
        /mode !== ['"]production['"].*<LiveRuntimePreview/.test(editorContent),
        'Modo live (LiveRuntimePreview) não encontrado'
    );
    
    assert(
        /<LiveRuntimePreview[^>]*steps=\{debouncedSteps\}/.test(editorContent),
        'LiveRuntimePreview não recebe debouncedSteps'
    );
});

// ==================== RESULTADO ====================

console.log(bold(`\n${'='.repeat(60)}`));
console.log(bold('RESULTADO DA VALIDAÇÃO'));
console.log(bold('='.repeat(60)));

const total = passCount + failCount;
const percentage = ((passCount / total) * 100).toFixed(1);

console.log(`\n${green('✓ Passou:')} ${passCount}/${total} (${percentage}%)`);

if (failCount > 0) {
    console.log(`${red('✗ Falhou:')} ${failCount}/${total}`);
}

console.log(bold('\n📊 RESUMO DAS MUDANÇAS:\n'));

console.log(`${green('✅')} Interface QuizProductionPreviewProps`);
console.log(`   └─ Adicionada prop: editorSteps?: Array<{id, type, blocks}>`);

console.log(`\n${green('✅')} Componente QuizProductionPreview`);
console.log(`   ├─ Desestrutura editorSteps dos props`);
console.log(`   ├─ Cria externalStepsToUse = editorSteps || liveSteps`);
console.log(`   └─ Passa externalStepsToUse para ModularPreviewContainer`);

console.log(`\n${green('✅')} QuizModularProductionEditor`);
console.log(`   └─ Passa editorSteps={debouncedSteps} no modo production`);

console.log(bold('\n🎯 PRÓXIMOS PASSOS:\n'));
console.log(`1. ${yellow('Iniciar dev server:')} npm run dev`);
console.log(`2. ${yellow('Abrir editor:')} /editor?template=quiz21StepsComplete`);
console.log(`3. ${yellow('Testar Steps 12, 19, 20:')} Verificar blocos modulares`);
console.log(`4. ${yellow('Testar preview:')} Alterações devem refletir em tempo real`);
console.log(`5. ${yellow('Testar drag-and-drop:')} Inserir componentes entre blocos`);

console.log('');

process.exit(failCount > 0 ? 1 : 0);
