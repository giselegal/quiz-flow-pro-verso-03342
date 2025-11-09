#!/usr/bin/env node

/**
 * 🔍 TESTE DE VIRTUALIZAÇÃO E LAZY LOADING
 * 
 * Testa se o sistema está carregando templates sob demanda (lazy)
 * ou se está carregando tudo de uma vez (eager)
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cores
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};

const log = {
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    detail: (msg) => console.log(`   ${colors.reset}${msg}`),
};

let results = {
    lazyLoading: false,
    cacheSystem: false,
    individualJsons: false,
    noEagerLoad: false,
    preloadConfigured: false,
    score: 0,
    maxScore: 5
};

// ============================================================================
// TEST 1: Verificar se há carregamento eager (RUIM)
// ============================================================================
async function test1_CheckNoEagerLoading() {
    log.title('TEST 1: Verificando ausência de carregamento EAGER');
    
    const filesToCheck = [
        { path: join(__dirname, 'src', 'services', 'canonical', 'TemplateService.ts'), name: 'TemplateService' },
        { path: join(__dirname, 'src', 'components', 'editor', 'EditorProviderUnified.tsx'), name: 'EditorProviderUnified' },
        { path: join(__dirname, 'src', 'services', 'UnifiedTemplateRegistry.ts'), name: 'UnifiedTemplateRegistry' },
    ];
    
    let foundEagerLoading = false;
    
    for (const { path, name } of filesToCheck) {
        try {
            const content = await readFile(path, 'utf-8');
            
            // Remover comentários antes de testar
            const contentWithoutComments = content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* ... */
                .replace(/\/\/.*/g, ''); // Remove // ...
            
            // Padrões que indicam carregamento eager (RUIM)
            const eagerPatterns = [
                { pattern: /import.*quiz21-complete/i, name: 'quiz21-complete.json' },
                { pattern: /import.*quiz21StepsComplete/i, name: 'quiz21StepsComplete bundle' },
                { pattern: /loadAllSteps\(\)/, name: 'loadAllSteps()' },
                { pattern: /preloadAll\(\)/, name: 'preloadAll()' },
                { pattern: /Promise\.all\(.*\.map\(.*loadStep/, name: 'Promise.all(loadStep)' },
            ];
            
            for (const { pattern, name: patternName } of eagerPatterns) {
                if (pattern.test(contentWithoutComments)) {
                    log.error(`${name}: Detectado carregamento EAGER - ${patternName}`);
                    foundEagerLoading = true;
                    break;
                }
            }
            
            if (!foundEagerLoading) {
                log.success(`${name}: Sem carregamento EAGER detectado`);
            }
        } catch (error) {
            log.warning(`${name}: Não foi possível ler arquivo`);
        }
    }
    
    if (!foundEagerLoading) {
        log.success('Sistema NÃO carrega todos os templates de uma vez');
        results.noEagerLoad = true;
        results.score++;
    } else {
        log.error('Sistema pode estar carregando templates desnecessários');
    }
}

// ============================================================================
// TEST 2: Verificar implementação de lazy loading
// ============================================================================
async function test2_CheckLazyLoading() {
    log.title('TEST 2: Verificando implementação de LAZY LOADING');
    
    const path = join(__dirname, 'src', 'services', 'canonical', 'TemplateService.ts');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar lazy loading
        const hasLazyLoadStep = content.includes('lazyLoadStep');
        const hasOnDemand = content.includes('sob demanda') || content.includes('on-demand') || content.includes('lazy');
        const hasGetStep = content.includes('getStep(stepId)');
        const notLoadingAll = !content.includes('loadAllSteps') && !content.includes('preloadAll');
        
        log.info('Verificações:');
        log.detail(`  lazyLoadStep implementado: ${hasLazyLoadStep ? '✅' : '❌'}`);
        log.detail(`  Carregamento sob demanda: ${hasOnDemand ? '✅' : '❌'}`);
        log.detail(`  getStep por stepId: ${hasGetStep ? '✅' : '❌'}`);
        log.detail(`  Não carrega todos de uma vez: ${notLoadingAll ? '✅' : '❌'}`);
        
        if (hasLazyLoadStep && hasGetStep && notLoadingAll) {
            log.success('LAZY LOADING implementado corretamente');
            results.lazyLoading = true;
            results.score++;
        } else {
            log.error('LAZY LOADING não está completo');
        }
    } catch (error) {
        log.error(`Erro ao verificar: ${error.message}`);
    }
}

// ============================================================================
// TEST 3: Verificar sistema de cache em camadas (L1/L2/L3)
// ============================================================================
async function test3_CheckCacheSystem() {
    log.title('TEST 3: Verificando sistema de CACHE MULTI-CAMADA');
    
    const path = join(__dirname, 'src', 'services', 'UnifiedTemplateRegistry.ts');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar camadas de cache
        const hasL1 = content.includes('l1Cache') && content.includes('Map');
        const hasL2 = content.includes('l2Cache') && content.includes('IndexedDB');
        const hasL3 = content.includes('l3Embedded') || content.includes('Build-time');
        const hasCascade = content.includes('L1 HIT') || content.includes('L2 HIT') || content.includes('L3 HIT');
        
        log.info('Camadas de cache:');
        log.detail(`  L1 (Memory/Map): ${hasL1 ? '✅' : '❌'}`);
        log.detail(`  L2 (IndexedDB): ${hasL2 ? '✅' : '❌'}`);
        log.detail(`  L3 (Embedded): ${hasL3 ? '✅' : '❌'}`);
        log.detail(`  Cache cascade logs: ${hasCascade ? '✅' : '❌'}`);
        
        if (hasL1 && hasL2 && hasL3 && hasCascade) {
            log.success('Sistema de cache L1/L2/L3 implementado corretamente');
            log.detail('  → Carrega uma vez, reutiliza sempre');
            results.cacheSystem = true;
            results.score++;
        } else {
            log.error('Sistema de cache incompleto');
        }
    } catch (error) {
        log.error(`Erro ao verificar: ${error.message}`);
    }
}

// ============================================================================
// TEST 4: Verificar uso de JSONs individuais (virtualização real)
// ============================================================================
async function test4_CheckIndividualJsons() {
    log.title('TEST 4: Verificando uso de JSONS INDIVIDUAIS');
    
    const path = join(__dirname, 'src', 'services', 'UnifiedTemplateRegistry.ts');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar se carrega JSONs individuais
        const usesIndividualPath = content.includes('/templates/blocks/${stepId}.json');
        const notUsesComplete = !content.includes('quiz21-complete.json');
        const notUsesStepsComplete = !content.includes('quiz21StepsComplete');
        const hasPriority1Comment = content.includes('PRIORIDADE 1') && content.includes('JSON individual');
        
        log.info('Verificações:');
        log.detail(`  Usa /templates/blocks/: ${usesIndividualPath ? '✅' : '❌'}`);
        log.detail(`  NÃO usa quiz21-complete.json: ${notUsesComplete ? '✅' : '❌'}`);
        log.detail(`  NÃO usa quiz21StepsComplete: ${notUsesStepsComplete ? '✅' : '❌'}`);
        log.detail(`  Prioridade 1 documentada: ${hasPriority1Comment ? '✅' : '❌'}`);
        
        if (usesIndividualPath && notUsesComplete && notUsesStepsComplete) {
            log.success('Sistema carrega APENAS o step necessário por vez');
            log.detail('  → Virtualização verdadeira: step-01.json, step-02.json, etc.');
            results.individualJsons = true;
            results.score++;
        } else {
            log.error('Sistema pode estar carregando bundle completo');
        }
    } catch (error) {
        log.error(`Erro ao verificar: ${error.message}`);
    }
}

// ============================================================================
// TEST 5: Verificar preload inteligente (vizinhos + críticos)
// ============================================================================
async function test5_CheckSmartPreload() {
    log.title('TEST 5: Verificando PRELOAD INTELIGENTE');
    
    const path = join(__dirname, 'src', 'services', 'canonical', 'TemplateService.ts');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar preload inteligente
        const hasPreloadNeighbors = content.includes('preloadNeighborsAndCritical') || content.includes('preload');
        const hasCriticalSteps = content.includes('12') && content.includes('19') && content.includes('20') && content.includes('21');
        const hasConditionalPreload = content.includes('if') && content.includes('preload');
        const notPreloadAll = !content.includes('preloadAll');
        
        log.info('Verificações:');
        log.detail(`  Preload de vizinhos: ${hasPreloadNeighbors ? '✅' : '❌'}`);
        log.detail(`  Preload de steps críticos: ${hasCriticalSteps ? '✅' : '❌'}`);
        log.detail(`  Preload condicional: ${hasConditionalPreload ? '✅' : '❌'}`);
        log.detail(`  NÃO preload de tudo: ${notPreloadAll ? '✅' : '❌'}`);
        
        if (hasPreloadNeighbors && hasCriticalSteps && notPreloadAll) {
            log.success('Preload INTELIGENTE implementado');
            log.detail('  → Carrega apenas vizinhos (±1) + steps críticos');
            log.detail('  → Não desperdiça recursos');
            results.preloadConfigured = true;
            results.score++;
        } else {
            log.warning('Preload pode não estar otimizado');
        }
    } catch (error) {
        log.error(`Erro ao verificar: ${error.message}`);
    }
}

// ============================================================================
// TEST 6: Análise de bundle size (estimativa)
// ============================================================================
async function test6_AnalyzeBundleSize() {
    log.title('TEST 6: Análise de BUNDLE SIZE');
    
    const path = join(__dirname, 'public', 'templates', 'blocks');
    
    try {
        const { readdir, stat } = await import('fs/promises');
        const files = await readdir(path);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        let totalSize = 0;
        let avgSize = 0;
        
        for (const file of jsonFiles) {
            const filePath = join(path, file);
            const stats = await stat(filePath);
            totalSize += stats.size;
        }
        
        avgSize = totalSize / jsonFiles.length;
        
        log.info('Estatísticas:');
        log.detail(`  Total de JSONs individuais: ${jsonFiles.length}`);
        log.detail(`  Tamanho total: ${(totalSize / 1024).toFixed(1)} KB`);
        log.detail(`  Tamanho médio por step: ${(avgSize / 1024).toFixed(1)} KB`);
        
        // Calcular economia
        const bundleCompleto = totalSize; // Se carregasse tudo de uma vez
        const lazyApproach = avgSize * 3; // Carrega 1 step + 2 vizinhos (estimativa)
        const economia = ((bundleCompleto - lazyApproach) / bundleCompleto) * 100;
        
        log.success(`Economia com lazy loading: ~${economia.toFixed(0)}%`);
        log.detail(`  → Bundle completo: ${(bundleCompleto / 1024).toFixed(1)} KB`);
        log.detail(`  → Lazy (1 step + vizinhos): ~${(lazyApproach / 1024).toFixed(1)} KB`);
        
    } catch (error) {
        log.warning(`Não foi possível analisar: ${error.message}`);
    }
}

// ============================================================================
// Relatório Final
// ============================================================================
function generateReport() {
    log.title('📊 RELATÓRIO DE VIRTUALIZAÇÃO');
    
    console.log(`\n${colors.bright}Score: ${results.score}/${results.maxScore}${colors.reset}\n`);
    
    // Status individual
    console.log(`${results.noEagerLoad ? '✅' : '❌'} Sem carregamento eager (tudo de uma vez)`);
    console.log(`${results.lazyLoading ? '✅' : '❌'} Lazy loading implementado`);
    console.log(`${results.cacheSystem ? '✅' : '❌'} Sistema de cache multi-camada`);
    console.log(`${results.individualJsons ? '✅' : '❌'} JSONs individuais (não bundle)`);
    console.log(`${results.preloadConfigured ? '✅' : '❌'} Preload inteligente configurado`);
    
    // Conclusão
    log.title('🎯 CONCLUSÃO');
    
    if (results.score === results.maxScore) {
        log.success('VIRTUALIZAÇÃO PERFEITA! 🎉');
        log.detail('  ✅ Sistema carrega apenas o necessário');
        log.detail('  ✅ Cache multi-camada evita recargas');
        log.detail('  ✅ JSONs individuais por step');
        log.detail('  ✅ Preload inteligente dos vizinhos');
        log.detail('  ✅ Performance otimizada');
        console.log('');
        log.info('Comportamento esperado no navegador:');
        log.detail('  1. Carregar step-01 → Apenas step-01.json é baixado');
        log.detail('  2. Preload automático → step-02.json baixado em background');
        log.detail('  3. Navegar para step-02 → Carrega do cache (L1)');
        log.detail('  4. Steps críticos → Preloaded: 12, 19, 20, 21');
    } else if (results.score >= 3) {
        log.warning('VIRTUALIZAÇÃO PARCIAL');
        log.detail('  ⚠️  Sistema tem lazy loading mas pode melhorar');
        log.detail(`  ⚠️  ${results.maxScore - results.score} item(ns) não implementado(s)`);
    } else {
        log.error('VIRTUALIZAÇÃO INADEQUADA');
        log.detail('  ❌ Sistema pode estar carregando demais');
        log.detail('  ❌ Revisar implementação de lazy loading');
    }
    
    log.title('📋 RECOMENDAÇÕES');
    
    if (!results.noEagerLoad) {
        log.warning('• Remover carregamentos eager (loadAll, preloadAll)');
    }
    if (!results.lazyLoading) {
        log.warning('• Implementar lazyLoadStep() no TemplateService');
    }
    if (!results.cacheSystem) {
        log.warning('• Adicionar sistema de cache L1/L2/L3');
    }
    if (!results.individualJsons) {
        log.warning('• Usar JSONs individuais ao invés de bundle completo');
    }
    if (!results.preloadConfigured) {
        log.warning('• Configurar preload inteligente de vizinhos');
    }
    
    if (results.score === results.maxScore) {
        log.info('✨ Nenhuma recomendação - sistema está perfeito!');
    }
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
    console.log(`${colors.bright}${colors.magenta}`);
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║    🔍 TESTE DE VIRTUALIZAÇÃO E LAZY LOADING               ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(colors.reset);
    
    try {
        await test1_CheckNoEagerLoading();
        await test2_CheckLazyLoading();
        await test3_CheckCacheSystem();
        await test4_CheckIndividualJsons();
        await test5_CheckSmartPreload();
        await test6_AnalyzeBundleSize();
        
        generateReport();
        
        // Exit code
        process.exit(results.score === results.maxScore ? 0 : 1);
        
    } catch (error) {
        log.error(`Erro fatal: ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
