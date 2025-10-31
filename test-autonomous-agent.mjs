#!/usr/bin/env node

/**
 * 🤖 AGENTE AUTÔNOMO - Teste de Estrutura de Templates
 * 
 * Executa testes completos sem intervenção humana
 */

import { readFile, access, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cores para output
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

let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
};

function recordTest(name, status, details = '') {
    testResults.total++;
    testResults.details.push({ name, status, details });
    
    if (status === 'pass') {
        testResults.passed++;
        log.success(`${name}`);
        if (details) log.detail(details);
    } else if (status === 'fail') {
        testResults.failed++;
        log.error(`${name}`);
        if (details) log.detail(details);
    } else {
        testResults.warnings++;
        log.warning(`${name}`);
        if (details) log.detail(details);
    }
}

// ============================================================================
// TEST 1: Verificar arquivos JSON individuais
// ============================================================================
async function test1_CheckIndividualJSONs() {
    log.title('TEST 1: Verificando JSONs individuais em /public/templates/blocks/');
    
    const stepsToTest = [
        'step-01', 'step-02', 'step-03', 'step-04', 'step-05',
        'step-06', 'step-07', 'step-08', 'step-09', 'step-10',
        'step-11', 'step-12', 'step-19', 'step-20', 'step-21'
    ];
    
    let foundCount = 0;
    
    for (const stepId of stepsToTest) {
        const path = join(__dirname, 'public', 'templates', 'blocks', `${stepId}.json`);
        
        try {
            await access(path);
            const content = await readFile(path, 'utf-8');
            const data = JSON.parse(content);
            
            const isValid = 
                data.blocks && 
                Array.isArray(data.blocks) &&
                data.blocks.length > 0 &&
                data.blocks[0].id &&
                data.blocks[0].type;
            
            if (isValid) {
                recordTest(
                    `${stepId}.json`,
                    'pass',
                    `${data.blocks.length} blocos válidos`
                );
                foundCount++;
            } else {
                recordTest(
                    `${stepId}.json`,
                    'fail',
                    'Estrutura inválida'
                );
            }
        } catch (error) {
            recordTest(
                `${stepId}.json`,
                'fail',
                `Não encontrado: ${error.message}`
            );
        }
    }
    
    log.info(`Total: ${foundCount}/${stepsToTest.length} JSONs encontrados`);
    return foundCount === stepsToTest.length;
}

// ============================================================================
// TEST 2: Verificar EditorProviderUnified com monkey-patch
// ============================================================================
async function test2_CheckMonkeyPatch() {
    log.title('TEST 2: Verificando monkey-patch no EditorProviderUnified');
    
    const path = join(__dirname, 'src', 'components', 'editor', 'EditorProviderUnified.tsx');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar imports necessários
        const hasTemplateServiceImport = content.includes('import { templateService, TemplateService }');
        recordTest(
            'Import de TemplateService',
            hasTemplateServiceImport ? 'pass' : 'fail',
            hasTemplateServiceImport ? 'from @/services/canonical/TemplateService' : 'Import não encontrado'
        );
        
        // Verificar monkey-patch
        const hasMonkeyPatch = content.includes('originalLoader.loadStep = async (stepId: string)');
        recordTest(
            'Monkey-patch implementado',
            hasMonkeyPatch ? 'pass' : 'fail',
            hasMonkeyPatch ? 'loader.loadStep() sobrescrito' : 'Monkey-patch não encontrado'
        );
        
        // Verificar delegação para lazyLoadStep
        const hasLazyLoadStepCall = content.includes('templateService.lazyLoadStep(stepId, true)');
        recordTest(
            'Delegação para lazyLoadStep',
            hasLazyLoadStepCall ? 'pass' : 'fail',
            hasLazyLoadStepCall ? 'Chamada correta encontrada' : 'Delegação não encontrada'
        );
        
        // Verificar fallback
        const hasFallback = content.includes('|| originalLoadStep(stepId)');
        recordTest(
            'Fallback implementado',
            hasFallback ? 'pass' : 'fail',
            hasFallback ? 'Backward compatibility mantida' : 'Fallback não encontrado'
        );
        
        // Verificar logs de debug
        const hasDebugLogs = content.includes('lazyLoadStep ativado');
        recordTest(
            'Logs de debug',
            hasDebugLogs ? 'pass' : 'warning',
            hasDebugLogs ? 'Console logs para diagnóstico' : 'Logs não encontrados'
        );
        
        return hasTemplateServiceImport && hasMonkeyPatch && hasLazyLoadStepCall;
        
    } catch (error) {
        recordTest('EditorProviderUnified.tsx', 'fail', `Erro ao ler arquivo: ${error.message}`);
        return false;
    }
}

// ============================================================================
// TEST 3: Verificar TemplateService.lazyLoadStep()
// ============================================================================
async function test3_CheckTemplateService() {
    log.title('TEST 3: Verificando TemplateService.lazyLoadStep()');
    
    const path = join(__dirname, 'src', 'services', 'canonical', 'TemplateService.ts');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar método lazyLoadStep
        const hasLazyLoadStep = content.includes('async lazyLoadStep(');
        recordTest(
            'Método lazyLoadStep',
            hasLazyLoadStep ? 'pass' : 'fail',
            hasLazyLoadStep ? 'Implementado' : 'Não encontrado'
        );
        
        // Verificar preload de vizinhos
        const hasNeighborPreload = content.includes('preloadNeighborsAndCritical');
        recordTest(
            'Preload de vizinhos',
            hasNeighborPreload ? 'pass' : 'fail',
            hasNeighborPreload ? 'Função implementada' : 'Não encontrado'
        );
        
        // Verificar cache checking
        const hasCacheCheck = content.includes('this.getStep');
        recordTest(
            'Cache checking',
            hasCacheCheck ? 'pass' : 'fail',
            hasCacheCheck ? 'Verifica cache antes de carregar' : 'Não encontrado'
        );
        
        // Verificar integração com registry
        const hasRegistryIntegration = content.includes('this.registry.getStep');
        recordTest(
            'Integração com Registry',
            hasRegistryIntegration ? 'pass' : 'fail',
            hasRegistryIntegration ? 'Usa UnifiedTemplateRegistry' : 'Não encontrado'
        );
        
        return hasLazyLoadStep && hasNeighborPreload && hasRegistryIntegration;
        
    } catch (error) {
        recordTest('TemplateService.ts', 'fail', `Erro ao ler arquivo: ${error.message}`);
        return false;
    }
}

// ============================================================================
// TEST 4: Verificar UnifiedTemplateRegistry
// ============================================================================
async function test4_CheckUnifiedRegistry() {
    log.title('TEST 4: Verificando UnifiedTemplateRegistry');
    
    const path = join(__dirname, 'src', 'services', 'UnifiedTemplateRegistry.ts');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar L1 Cache (Memory)
        const hasL1Cache = content.includes('l1Cache = new Map');
        recordTest(
            'L1 Cache (Memory)',
            hasL1Cache ? 'pass' : 'fail',
            hasL1Cache ? 'Map implementado' : 'Não encontrado'
        );
        
        // Verificar L2 Cache (IndexedDB)
        const hasL2Cache = content.includes('l2Cache') && content.includes('IndexedDB');
        recordTest(
            'L2 Cache (IndexedDB)',
            hasL2Cache ? 'pass' : 'fail',
            hasL2Cache ? 'Persistência implementada' : 'Não encontrado'
        );
        
        // Verificar L3 Embedded
        const hasL3Embedded = content.includes('l3Embedded');
        recordTest(
            'L3 Embedded templates',
            hasL3Embedded ? 'pass' : 'fail',
            hasL3Embedded ? 'Build-time templates' : 'Não encontrado'
        );
        
        // Verificar loadFromServer
        const hasLoadFromServer = content.includes('loadFromServer');
        recordTest(
            'LoadFromServer fallback',
            hasLoadFromServer ? 'pass' : 'fail',
            hasLoadFromServer ? 'Implementado' : 'Não encontrado'
        );
        
        // Verificar path correto (/templates/blocks/)
        const usesCorrectPath = content.includes('/templates/blocks/');
        recordTest(
            'Path correto (/templates/blocks/)',
            usesCorrectPath ? 'pass' : 'fail',
            usesCorrectPath ? 'Usa JSONs individuais' : 'Path incorreto'
        );
        
        // Verificar cascade L1 → L2 → L3
        const hasCascade = content.includes('L1 HIT') || content.includes('L2 HIT') || content.includes('L3 HIT');
        recordTest(
            'Cache cascade L1→L2→L3',
            hasCascade ? 'pass' : 'fail',
            hasCascade ? 'Logs de diagnóstico' : 'Não encontrado'
        );
        
        return hasL1Cache && hasLoadFromServer && usesCorrectPath;
        
    } catch (error) {
        recordTest('UnifiedTemplateRegistry.ts', 'fail', `Erro ao ler arquivo: ${error.message}`);
        return false;
    }
}

// ============================================================================
// TEST 5: Verificar vite.config.ts (code splitting)
// ============================================================================
async function test5_CheckViteConfig() {
    log.title('TEST 5: Verificando vite.config.ts (code splitting)');
    
    const path = join(__dirname, 'vite.config.ts');
    
    try {
        const content = await readFile(path, 'utf-8');
        
        // Verificar se manualChunks está simplificado
        const hasSimplifiedChunks = content.includes('CODE SPLITTING SIMPLIFICADO');
        recordTest(
            'Code splitting simplificado',
            hasSimplifiedChunks ? 'pass' : 'warning',
            hasSimplifiedChunks ? 'Evita circular dependencies' : 'Pode ter complexidade'
        );
        
        // Verificar se vendor-charts foi removido ou incluído no vendor-react
        const hasVendorChartsSeparate = content.includes("return 'vendor-charts'");
        recordTest(
            'Vendor charts não separado',
            !hasVendorChartsSeparate ? 'pass' : 'warning',
            !hasVendorChartsSeparate ? 'Evita erro de inicialização' : 'Pode causar circular dependency'
        );
        
        return hasSimplifiedChunks;
        
    } catch (error) {
        recordTest('vite.config.ts', 'fail', `Erro ao ler arquivo: ${error.message}`);
        return false;
    }
}

// ============================================================================
// TEST 6: Testar servidor HTTP
// ============================================================================
async function test6_TestHTTPServer() {
    log.title('TEST 6: Testando servidor HTTP (localhost:8080)');
    
    const testUrls = [
        { url: 'http://localhost:8080', name: 'Página inicial' },
        { url: 'http://localhost:8080/templates/blocks/step-01.json', name: 'step-01.json' },
        { url: 'http://localhost:8080/templates/blocks/step-02.json', name: 'step-02.json' },
        { url: 'http://localhost:8080/templates/blocks/step-21.json', name: 'step-21.json' },
    ];
    
    for (const { url, name } of testUrls) {
        try {
            const response = await fetch(url);
            
            if (response.ok) {
                if (url.endsWith('.json')) {
                    const data = await response.json();
                    const isValid = data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0;
                    
                    recordTest(
                        name,
                        isValid ? 'pass' : 'fail',
                        isValid ? `${data.blocks.length} blocos` : 'Estrutura inválida'
                    );
                } else {
                    recordTest(name, 'pass', `Status: ${response.status}`);
                }
            } else {
                recordTest(name, 'fail', `Status: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            recordTest(name, 'fail', `Erro: ${error.message}`);
        }
    }
}

// ============================================================================
// TEST 7: Verificar estrutura de diretórios
// ============================================================================
async function test7_CheckDirectoryStructure() {
    log.title('TEST 7: Verificando estrutura de diretórios');
    
    const dirsToCheck = [
        { path: join(__dirname, 'public', 'templates', 'blocks'), name: 'public/templates/blocks/' },
        { path: join(__dirname, 'src', 'services', 'canonical'), name: 'src/services/canonical/' },
        { path: join(__dirname, 'src', 'components', 'editor'), name: 'src/components/editor/' },
    ];
    
    for (const { path, name } of dirsToCheck) {
        try {
            await access(path);
            const files = await readdir(path);
            recordTest(
                name,
                'pass',
                `${files.length} arquivos encontrados`
            );
        } catch (error) {
            recordTest(name, 'fail', `Não encontrado: ${error.message}`);
        }
    }
}

// ============================================================================
// Gerar relatório final
// ============================================================================
function generateReport() {
    log.title('📊 RELATÓRIO FINAL');
    
    console.log(`${colors.bright}Total de testes: ${testResults.total}${colors.reset}`);
    console.log(`${colors.green}✅ Passou: ${testResults.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Falhou: ${testResults.failed}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Avisos: ${testResults.warnings}${colors.reset}`);
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    console.log(`\n${colors.bright}Taxa de sucesso: ${successRate}%${colors.reset}`);
    
    // Conclusão
    log.title('🎯 CONCLUSÃO');
    
    if (testResults.failed === 0) {
        log.success('ESTRUTURA CORRETA ESTÁ ATIVA!');
        log.detail('✅ JSONs individuais em /templates/blocks/ estão sendo usados');
        log.detail('✅ Monkey-patch está ativo');
        log.detail('✅ TemplateService.lazyLoadStep() está implementado');
        log.detail('✅ UnifiedTemplateRegistry usa cache L1/L2/L3');
        log.detail('✅ Sistema pronto para lazy loading per-step');
    } else if (testResults.failed <= 3) {
        log.warning('ESTRUTURA PARCIALMENTE ATIVA');
        log.detail('⚠️  Algumas falhas detectadas, mas sistema pode funcionar');
        log.detail('⚠️  Verifique os testes que falharam acima');
    } else {
        log.error('ESTRUTURA INCORRETA OU INCOMPLETA');
        log.detail('❌ Múltiplas falhas detectadas');
        log.detail('❌ Sistema pode não estar usando JSONs individuais');
        log.detail('❌ Revise as implementações acima');
    }
    
    log.title('📋 PRÓXIMOS PASSOS');
    if (testResults.failed === 0) {
        log.info('1. Abrir /editor no navegador');
        log.info('2. Abrir DevTools (F12) e ver console');
        log.info('3. Verificar logs: "🔄 lazyLoadStep ativado"');
        log.info('4. Verificar Network tab: requisições para /templates/blocks/');
    } else {
        log.info('1. Revisar testes que falharam');
        log.info('2. Corrigir implementações necessárias');
        log.info('3. Re-executar: node test-autonomous-agent.mjs');
    }
}

// ============================================================================
// EXECUTAR TODOS OS TESTES
// ============================================================================
async function main() {
    console.log(`${colors.bright}${colors.magenta}`);
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     🤖 AGENTE AUTÔNOMO - TESTE DE ESTRUTURA ATIVA         ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(colors.reset);
    
    try {
        await test1_CheckIndividualJSONs();
        await test2_CheckMonkeyPatch();
        await test3_CheckTemplateService();
        await test4_CheckUnifiedRegistry();
        await test5_CheckViteConfig();
        await test6_TestHTTPServer();
        await test7_CheckDirectoryStructure();
        
        generateReport();
        
        // Exit code
        process.exit(testResults.failed === 0 ? 0 : 1);
        
    } catch (error) {
        log.error(`Erro fatal: ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
}

// Executar
main();
