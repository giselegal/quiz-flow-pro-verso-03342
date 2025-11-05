#!/usr/bin/env node

/**
 * 🧪 TESTE DE SELEÇÃO E REORDENAÇÃO DE BLOCOS
 * 
 * Verifica:
 * 1. Aninhamentos excessivos no DOM
 * 2. Conflitos de z-index
 * 3. Pointer-events conflitantes
 * 4. Performance de mudança de step
 */

console.log('🧪 Iniciando testes de seleção e reordenação...\n');

// ========================================
// TESTE 1: Verificar aninhamentos no código
// ========================================
console.log('📋 TESTE 1: Aninhamentos no código');

import { readFileSync } from 'fs';
import { join } from 'path';

const canvasColumnPath = './src/components/editor/quiz/components/CanvasColumn.tsx';
const canvasColumnContent = readFileSync(canvasColumnPath, 'utf-8');

// Contar níveis de aninhamento de divs
const lines = canvasColumnContent.split('\n');
let maxNesting = 0;
let currentNesting = 0;
let problematicLines = [];

lines.forEach((line, idx) => {
    const openDivs = (line.match(/<div/g) || []).length;
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    
    currentNesting += openDivs - closeDivs;
    
    if (currentNesting > maxNesting) {
        maxNesting = currentNesting;
    }
    
    if (currentNesting > 5) {
        problematicLines.push({ line: idx + 1, depth: currentNesting, content: line.trim() });
    }
});

console.log(`  ✅ Nível máximo de aninhamento: ${maxNesting}`);
if (maxNesting > 6) {
    console.log(`  ⚠️  AVISO: Aninhamento muito profundo (> 6 níveis)`);
    console.log(`  📍 Linhas problemáticas:`);
    problematicLines.slice(0, 5).forEach(({ line, depth, content }) => {
        console.log(`     Linha ${line} (profundidade ${depth}): ${content.substring(0, 60)}...`);
    });
} else {
    console.log(`  ✅ Aninhamento aceitável`);
}

// ========================================
// TESTE 2: Verificar conflitos CSS
// ========================================
console.log('\n📋 TESTE 2: Conflitos de CSS');

const cssFixesPath = './src/styles/canvas-fixes.css';
const cssFixesContent = readFileSync(cssFixesPath, 'utf-8');

// Verificar regras de pointer-events
const pointerEventsAuto = (cssFixesContent.match(/pointer-events:\s*auto/g) || []).length;
const pointerEventsNone = (cssFixesContent.match(/pointer-events:\s*none/g) || []).length;

console.log(`  📊 Regras pointer-events:`);
console.log(`     - auto: ${pointerEventsAuto}`);
console.log(`     - none: ${pointerEventsNone}`);

if (pointerEventsAuto > 0 && pointerEventsNone > 0) {
    console.log(`  ⚠️  ATENÇÃO: Conflito potencial entre pointer-events`);
    console.log(`     Verificar seletores para garantir especificidade correta`);
}

// Verificar z-index
const zIndexMatches = cssFixesContent.match(/z-index:\s*(\d+)/g) || [];
const zIndexValues = zIndexMatches.map(m => parseInt(m.match(/\d+/)[0]));

console.log(`  📊 Z-index definidos: ${zIndexValues.sort((a, b) => a - b).join(', ')}`);

if (new Set(zIndexValues).size !== zIndexValues.length) {
    console.log(`  ⚠️  AVISO: Z-index duplicados detectados`);
}

// ========================================
// TESTE 3: Verificar useEffect dependencies
// ========================================
console.log('\n📋 TESTE 3: Dependencies do useEffect');

const editorPath = './src/components/editor/quiz/QuizModularEditor/index.tsx';
const editorContent = readFileSync(editorPath, 'utf-8');

// Encontrar useEffect que carrega steps
const useEffectMatch = editorContent.match(/useEffect\(\(\) => \{[\s\S]*?ensureStepBlocks[\s\S]*?\}, \[(.*?)\]\);/);

if (useEffectMatch) {
    const deps = useEffectMatch[1].split(',').map(d => d.trim()).filter(Boolean);
    console.log(`  ✅ Dependencies encontradas: [${deps.join(', ')}]`);
    
    // Verificar se tem deps problemáticas
    const problematicDeps = ['unified', 'loadedTemplate'];
    const foundProblematic = deps.filter(d => problematicDeps.includes(d));
    
    if (foundProblematic.length > 0) {
        console.log(`  ❌ ERRO: Dependencies problemáticas detectadas: ${foundProblematic.join(', ')}`);
        console.log(`     Isso pode causar re-renders infinitos!`);
    } else {
        console.log(`  ✅ Nenhuma dependency problemática`);
    }
} else {
    console.log(`  ⚠️  Não foi possível encontrar useEffect de ensureStepBlocks`);
}

// ========================================
// TESTE 4: Verificar gestão de isLoadingStep
// ========================================
console.log('\n📋 TESTE 4: Gestão de isLoadingStep');

const setLoadingMatches = editorContent.match(/setIsLoadingStep\((true|false)\)/g) || [];
const setLoadingTrue = setLoadingMatches.filter(m => m.includes('true')).length;
const setLoadingFalse = setLoadingMatches.filter(m => m.includes('false')).length;

console.log(`  📊 Chamadas setIsLoadingStep:`);
console.log(`     - true: ${setLoadingTrue}`);
console.log(`     - false: ${setLoadingFalse}`);

if (setLoadingTrue !== setLoadingFalse) {
    console.log(`  ⚠️  AVISO: Desbalanceamento de set true/false`);
    console.log(`     Pode causar loading infinito`);
} else {
    console.log(`  ✅ Balanceamento correto`);
}

// Verificar cleanup no useEffect
const hasCleanup = editorContent.includes('return () => {') && editorContent.includes('cancelled = true');
console.log(`  ${hasCleanup ? '✅' : '❌'} Cleanup function: ${hasCleanup ? 'presente' : 'AUSENTE'}`);

// ========================================
// TESTE 5: Verificar debounce
// ========================================
console.log('\n📋 TESTE 5: Debounce na mudança de step');

const hasDebounce = editorContent.includes('setTimeout') && editorContent.includes('ensureStepBlocks');
console.log(`  ${hasDebounce ? '✅' : '⚠️ '} Debounce: ${hasDebounce ? 'implementado' : 'NÃO implementado'}`);

if (!hasDebounce) {
    console.log(`     Recomendação: Adicionar debounce de 50-100ms para evitar chamadas rápidas`);
}

// ========================================
// RESUMO
// ========================================
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DOS TESTES');
console.log('='.repeat(60));

const issues = [];

if (maxNesting > 6) issues.push('Aninhamento excessivo (> 6 níveis)');
if (pointerEventsAuto > 0 && pointerEventsNone > 0) issues.push('Conflitos pointer-events');
if (new Set(zIndexValues).size !== zIndexValues.length) issues.push('Z-index duplicados');
if (setLoadingTrue !== setLoadingFalse) issues.push('Desbalanceamento isLoadingStep');
if (!hasCleanup) issues.push('Cleanup ausente no useEffect');
if (!hasDebounce) issues.push('Debounce não implementado');

if (issues.length === 0) {
    console.log('✅ Todos os testes passaram!');
    console.log('   Estrutura está otimizada para seleção e reordenação.');
} else {
    console.log(`⚠️  ${issues.length} problema(s) detectado(s):`);
    issues.forEach((issue, idx) => {
        console.log(`   ${idx + 1}. ${issue}`);
    });
}

console.log('\n💡 Próximos passos:');
console.log('   1. Testar mudança de etapas no browser');
console.log('   2. Verificar console para mensagens de erro');
console.log('   3. Testar seleção clicando em diferentes partes do bloco');
console.log('   4. Testar reordenação via drag & drop');
console.log('   5. Verificar performance com DevTools (Rendering > Paint flashing)');
