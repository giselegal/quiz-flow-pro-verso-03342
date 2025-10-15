/**
 * Diagnóstico Detalhado do Preview - Editor
 * 
 * Este script faz uma análise profunda dos componentes e estados
 * que podem estar causando problemas no preview.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ====================================');
console.log('   DIAGNÓSTICO DETALHADO DO PREVIEW');
console.log('====================================\n');

// Utilitário para ler arquivos
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        return null;
    }
}

// Utilitário para verificar se arquivo existe
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// ============================================================================
// TESTE 1: Verificar Estrutura do LiveRuntimePreview
// ============================================================================
console.log('📋 Teste 1: Estrutura do LiveRuntimePreview');
console.log('-------------------------------------------');

const liveRuntimePreviewPath = 'src/components/editor/quiz/components/LiveRuntimePreview.tsx';
const liveRuntimeContent = readFile(liveRuntimePreviewPath);

if (liveRuntimeContent) {
    console.log('✅ Arquivo encontrado:', liveRuntimePreviewPath);
    
    // Verificar se tem useEffect com dependências problemáticas
    const useEffectMatches = liveRuntimeContent.match(/useEffect\([^)]+\),\s*\[[^\]]*\]/g);
    if (useEffectMatches) {
        console.log(`📊 Encontrados ${useEffectMatches.length} useEffect`);
        
        useEffectMatches.forEach((match, idx) => {
            const deps = match.match(/\[([^\]]*)\]/)[1];
            if (deps.split(',').length > 5) {
                console.log(`⚠️  useEffect ${idx + 1} tem muitas dependências: ${deps.split(',').length}`);
            }
        });
    }
    
    // Verificar se tem QuizRuntimeRegistryProvider
    if (liveRuntimeContent.includes('QuizRuntimeRegistryProvider')) {
        console.log('✅ Usa QuizRuntimeRegistryProvider');
    } else {
        console.log('❌ NÃO usa QuizRuntimeRegistryProvider');
    }
    
    // Verificar se tem QuizAppConnected
    if (liveRuntimeContent.includes('QuizAppConnected')) {
        console.log('✅ Renderiza QuizAppConnected');
    } else {
        console.log('❌ NÃO renderiza QuizAppConnected');
    }
    
    // Verificar proteções contra loop
    if (liveRuntimeContent.includes('useMemo') || liveRuntimeContent.includes('useCallback')) {
        console.log('✅ Usa memoização (useMemo/useCallback)');
    } else {
        console.log('⚠️  NÃO usa memoização');
    }
    
    // Verificar hash/debounce
    if (liveRuntimeContent.includes('hash') || liveRuntimeContent.includes('debounce')) {
        console.log('✅ Tem proteção contra rerenders (hash/debounce)');
    } else {
        console.log('⚠️  SEM proteção contra rerenders');
    }
    
} else {
    console.log('❌ Arquivo não encontrado:', liveRuntimePreviewPath);
}

console.log('');

// ============================================================================
// TESTE 2: Verificar QuizAppConnected
// ============================================================================
console.log('📋 Teste 2: Estrutura do QuizAppConnected');
console.log('-------------------------------------------');

const quizAppConnectedPath = 'src/components/quiz/QuizAppConnected.tsx';
const quizAppContent = readFile(quizAppConnectedPath);

if (quizAppContent) {
    console.log('✅ Arquivo encontrado:', quizAppConnectedPath);
    
    // Verificar uso de useComponentConfiguration
    const configHookMatches = quizAppContent.match(/useComponentConfiguration\([^)]*\)/g);
    if (configHookMatches) {
        console.log(`📊 Usa useComponentConfiguration ${configHookMatches.length}x`);
        configHookMatches.forEach((match, idx) => {
            console.log(`   ${idx + 1}. ${match}`);
        });
    } else {
        console.log('❌ NÃO usa useComponentConfiguration');
    }
    
    // Verificar logs de "Loading configuration"
    if (quizAppContent.includes('Loading configuration')) {
        console.log('✅ Tem logs de carregamento de configuração');
    }
    
    // Verificar se recarrega quando props mudam
    const propsRegex = /useEffect\([^)]+\),\s*\[([^\]]*props[^\]]*)\]/g;
    const propsEffects = quizAppContent.match(propsRegex);
    if (propsEffects) {
        console.log(`⚠️  Encontrados ${propsEffects.length} useEffect que dependem de props`);
        console.log('   Isso pode causar rerenders excessivos');
    }
    
} else {
    console.log('❌ Arquivo não encontrado:', quizAppConnectedPath);
}

console.log('');

// ============================================================================
// TESTE 3: Verificar useComponentConfiguration
// ============================================================================
console.log('📋 Teste 3: Hook useComponentConfiguration');
console.log('-------------------------------------------');

const hookPath = 'src/hooks/useComponentConfiguration.ts';
const hookContent = readFile(hookPath);

if (hookContent) {
    console.log('✅ Arquivo encontrado:', hookPath);
    
    // Verificar se tem definitionLoadedRef
    if (hookContent.includes('definitionLoadedRef')) {
        console.log('✅ Tem proteção definitionLoadedRef (correção aplicada)');
    } else {
        console.log('❌ NÃO tem definitionLoadedRef (correção NÃO aplicada)');
    }
    
    // Verificar useCallback de loadConfiguration
    const loadConfigRegex = /const loadConfiguration = useCallback\([^}]+\},\s*\[([^\]]+)\]/s;
    const loadConfigMatch = hookContent.match(loadConfigRegex);
    if (loadConfigMatch) {
        const deps = loadConfigMatch[1];
        console.log('📊 Dependências de loadConfiguration:', deps.trim());
        
        if (deps.includes('componentDefinition')) {
            console.log('❌ PROBLEMA: componentDefinition nas dependências (causa loop)');
        } else {
            console.log('✅ componentDefinition NÃO está nas dependências');
        }
    }
    
    // Verificar logs de "Loading configuration"
    const loadingLogs = hookContent.match(/console\.log.*Loading configuration/g);
    if (loadingLogs) {
        console.log(`📊 ${loadingLogs.length} log(s) de "Loading configuration"`);
    }
    
} else {
    console.log('❌ Arquivo não encontrado:', hookPath);
}

console.log('');

// ============================================================================
// TESTE 4: Verificar ConfigurationAPI
// ============================================================================
console.log('📋 Teste 4: ConfigurationAPI');
console.log('-------------------------------------------');

const apiPath = 'src/services/ConfigurationAPI.ts';
const apiContent = readFile(apiPath);

if (apiContent) {
    console.log('✅ Arquivo encontrado:', apiPath);
    
    // Verificar se tem cache
    if (apiContent.includes('cache') || apiContent.includes('Map')) {
        console.log('✅ Tem sistema de cache');
    } else {
        console.log('⚠️  SEM sistema de cache (pode causar fetches repetidos)');
    }
    
    // Verificar getComponentDefinition
    if (apiContent.includes('getComponentDefinition')) {
        console.log('✅ Tem método getComponentDefinition');
        
        // Verificar se retorna sempre novo objeto
        const getDefRegex = /getComponentDefinition[^}]+return\s+{/s;
        if (apiContent.match(getDefRegex)) {
            console.log('⚠️  Pode estar retornando novo objeto a cada chamada');
            console.log('   Recomendação: Implementar memoização/cache');
        }
    }
    
    // Verificar logs de "GET Configuration"
    const getLogs = apiContent.match(/console\.log.*GET.*[Cc]onfiguration/g);
    if (getLogs) {
        console.log(`📊 ${getLogs.length} log(s) de "GET Configuration"`);
    }
    
} else {
    console.log('❌ Arquivo não encontrado:', apiPath);
}

console.log('');

// ============================================================================
// TESTE 5: Verificar Editor Principal
// ============================================================================
console.log('📋 Teste 5: QuizModularProductionEditor');
console.log('-------------------------------------------');

const editorPath = 'src/components/editor/quiz/QuizModularProductionEditor.tsx';
const editorContent = readFile(editorPath);

if (editorContent) {
    console.log('✅ Arquivo encontrado:', editorPath);
    
    // Verificar se renderiza LivePreviewContainer ou LiveRuntimePreview
    if (editorContent.includes('<LivePreviewContainer')) {
        console.log('✅ Renderiza <LivePreviewContainer>');
    } else if (editorContent.includes('<LiveRuntimePreview')) {
        console.log('✅ Renderiza <LiveRuntimePreview> diretamente');
    } else {
        console.log('❌ NÃO renderiza preview');
    }
    
    // Verificar estados que afetam o preview
    const statesRegex = /const \[([^,]+),\s*set[^\]]+\]\s*=\s*useState/g;
    const states = [...editorContent.matchAll(statesRegex)];
    console.log(`📊 Encontrados ${states.length} estados no editor`);
    
    // Verificar se há muitos rerenders
    if (states.length > 15) {
        console.log('⚠️  Muitos estados podem causar rerenders frequentes');
    }
    
} else {
    console.log('❌ Arquivo não encontrado:', editorPath);
}

console.log('');

// ============================================================================
// TESTE 6: Procurar Padrões Problemáticos
// ============================================================================
console.log('📋 Teste 6: Procurar Padrões Problemáticos');
console.log('-------------------------------------------');

const filesToCheck = [
    'src/components/editor/quiz/components/LiveRuntimePreview.tsx',
    'src/components/quiz/QuizAppConnected.tsx',
    'src/hooks/useComponentConfiguration.ts'
];

filesToCheck.forEach(filePath => {
    const content = readFile(filePath);
    if (!content) return;
    
    const fileName = path.basename(filePath);
    console.log(`\n🔍 Analisando ${fileName}:`);
    
    // Padrão 1: useEffect sem dependências (pode não atualizar)
    const emptyDepsEffects = content.match(/useEffect\([^)]+\),\s*\[\s*\]/g);
    if (emptyDepsEffects) {
        console.log(`   ⚠️  ${emptyDepsEffects.length} useEffect com array vazio []`);
    }
    
    // Padrão 2: useState dentro de useEffect (pode causar loop)
    const setStateInEffect = content.match(/useEffect\([^}]+set[A-Z][^}]+\}/gs);
    if (setStateInEffect && setStateInEffect.length > 3) {
        console.log(`   ⚠️  ${setStateInEffect.length} setState dentro de useEffect`);
    }
    
    // Padrão 3: Objetos criados inline em props (causam rerenders)
    const inlineObjects = content.match(/\w+={{[^}]+}}/g);
    if (inlineObjects && inlineObjects.length > 5) {
        console.log(`   ⚠️  ${inlineObjects.length} objetos inline em props`);
    }
    
    // Padrão 4: Funções inline em callbacks
    const inlineFunctions = content.match(/on\w+={\(\)/g);
    if (inlineFunctions && inlineFunctions.length > 5) {
        console.log(`   ⚠️  ${inlineFunctions.length} funções inline em callbacks`);
    }
});

console.log('');

// ============================================================================
// RESUMO E RECOMENDAÇÕES
// ============================================================================
console.log('\n====================================');
console.log('   RESUMO E RECOMENDAÇÕES');
console.log('====================================\n');

console.log('🔧 Para corrigir o preview, verifique:');
console.log('');
console.log('1. Loop infinito de configuração:');
console.log('   - useComponentConfiguration deve ter definitionLoadedRef');
console.log('   - componentDefinition NÃO deve estar nas dependências');
console.log('');
console.log('2. Rerenders excessivos:');
console.log('   - Use React.memo nos componentes do preview');
console.log('   - Use useMemo/useCallback para objetos e funções');
console.log('   - Implemente hash/debounce para evitar atualizações repetidas');
console.log('');
console.log('3. Cache de dados:');
console.log('   - ConfigurationAPI deve cachear getComponentDefinition');
console.log('   - Usar Map com TTL para evitar fetches repetidos');
console.log('');
console.log('4. Verificação manual:');
console.log('   - Abra http://localhost:5173/editor');
console.log('   - Abra o console (F12)');
console.log('   - Procure por logs repetidos');
console.log('   - Use React DevTools para ver rerenders');
console.log('');

console.log('✅ Diagnóstico concluído!');
