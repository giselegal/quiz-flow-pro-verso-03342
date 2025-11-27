/**
 * 🔍 SCRIPT DE DIAGNÓSTICO HEADLESS - Problema de Seleção
 */

import { chromium } from 'playwright';

async function diagnose() {
    console.log('🚀 Iniciando diagnóstico em modo headless...\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Logs do console
    const consoleLogs = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push({ type: msg.type(), text, timestamp: Date.now() });
        
        if (msg.type() === 'error') {
            console.log(`❌ [CONSOLE ERROR] ${text}`);
        } else if (text.includes('Warning') || text.includes('Hook')) {
            console.log(`⚠️  [CONSOLE WARN] ${text}`);
        }
    });

    // Erros não capturados
    page.on('pageerror', error => {
        console.log(`💥 [PAGE ERROR] ${error.message}`);
    });

    console.log('📍 Navegando para o editor...');
    try {
        await page.goto('http://localhost:8080/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete', {
            waitUntil: 'domcontentloaded',
            timeout: 20000
        });
    } catch (e) {
        console.log(`⚠️  Timeout ou erro no carregamento: ${e.message}`);
    }

    console.log('✅ Página carregada\n');

    // Aguardar editor carregar
    await page.waitForTimeout(5000);

    // Teste 1: Verificar se blocos são renderizados
    console.log('🧪 Teste 1: Verificar blocos renderizados');
    const blocksInfo = await page.evaluate(() => {
        const blocks = document.querySelectorAll('[data-block-id], [id^="block-"]');
        return {
            count: blocks.length,
            ids: Array.from(blocks).map(b => b.getAttribute('data-block-id') || b.id).slice(0, 5)
        };
    });
    console.log(`   ✅ ${blocksInfo.count} blocos encontrados`);
    if (blocksInfo.ids.length > 0) {
        console.log(`   IDs: ${blocksInfo.ids.join(', ')}`);
    }
    console.log('');

    if (blocksInfo.count === 0) {
        console.log('❌ PROBLEMA CRÍTICO: Nenhum bloco foi renderizado!');
        console.log('   Possíveis causas:');
        console.log('   - Template não foi carregado');
        console.log('   - Erro no carregamento de dados');
        console.log('   - Problema de renderização');
        
        // Capturar screenshot para debug
        await page.screenshot({ path: '/workspaces/quiz-flow-pro-verso-03342/debug-no-blocks.png', fullPage: true });
        console.log('   📸 Screenshot salvo: debug-no-blocks.png\n');
        
        await browser.close();
        return;
    }

    // Teste 2: Tentar selecionar um bloco e medir tempo
    console.log('🧪 Teste 2: Testar seleção de bloco');
    
    const selectionResult = await page.evaluate(() => {
        const startTime = performance.now();
        const blocks = document.querySelectorAll('[data-block-id], [id^="block-"]');
        if (blocks.length === 0) return { success: false, reason: 'no blocks' };

        const firstBlock = blocks[0];
        const blockId = firstBlock.getAttribute('data-block-id') || firstBlock.id;

        console.log(`[TEST] Simulando click no bloco: ${blockId}`);

        // Simular click
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        firstBlock.dispatchEvent(clickEvent);

        // Aguardar um pouco
        return new Promise(resolve => {
            setTimeout(() => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                // Verificar se foi selecionado
                const isSelected = firstBlock.classList.contains('selected') ||
                                  firstBlock.classList.contains('ring-2') ||
                                  firstBlock.classList.contains('ring-blue-500') ||
                                  !!firstBlock.querySelector('[class*="SELECIONADO"]');

                const hasClickHandler = !!firstBlock.onclick || 
                                       !!firstBlock.getAttribute('onclick');

                resolve({
                    success: isSelected,
                    blockId,
                    classes: firstBlock.className,
                    hasClickHandler,
                    duration,
                    reason: isSelected ? 'selected' : 'not selected visually'
                });
            }, 1000);
        });
    });

    console.log(`   Tempo de resposta: ${Math.round(selectionResult.duration)}ms`);
    
    if (selectionResult.success) {
        console.log(`   ✅ Bloco ${selectionResult.blockId} selecionado corretamente`);
    } else {
        console.log(`   ❌ Bloco ${selectionResult.blockId} NÃO foi selecionado`);
        console.log(`   Classes aplicadas: ${selectionResult.classes || 'nenhuma'}`);
        console.log(`   Tem handler de click: ${selectionResult.hasClickHandler}`);
        
        // Verificar se há handlers de seleção
        const handlers = await page.evaluate(() => {
            return {
                hasOnBlockSelect: typeof window.__onBlockSelect === 'function',
                hasHandleBlockSelect: typeof window.__handleBlockSelect === 'function'
            };
        });
        console.log(`   Handlers disponíveis:`, handlers);
    }
    console.log('');

    // Teste 3: Verificar warnings de React
    console.log('🧪 Teste 3: Verificar warnings/erros');
    
    const reactWarnings = consoleLogs.filter(log => 
        log.text.includes('Warning:') || 
        log.text.includes('Hook') ||
        log.text.includes('order of Hooks')
    );

    const errors = consoleLogs.filter(log => log.type === 'error');

    if (errors.length > 0) {
        console.log(`   ❌ ${errors.length} ERROS encontrados:`);
        errors.slice(0, 3).forEach(err => {
            console.log(`      - ${err.text.substring(0, 150)}`);
        });
    } else {
        console.log(`   ✅ Nenhum erro no console`);
    }

    if (reactWarnings.length > 0) {
        console.log(`   ⚠️  ${reactWarnings.length} warnings encontrados:`);
        reactWarnings.slice(0, 3).forEach(warn => {
            console.log(`      - ${warn.text.substring(0, 150)}`);
        });
    } else {
        console.log(`   ✅ Nenhum warning de React`);
    }
    console.log('');

    // Teste 4: Verificar se há loops ou freezes
    console.log('🧪 Teste 4: Detectar loops ou travamentos');
    
    const loopTest = await page.evaluate(() => {
        return new Promise(resolve => {
            let mutationCount = 0;
            let lastCount = 0;
            let unchangedIntervals = 0;

            const observer = new MutationObserver(() => {
                mutationCount++;
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });

            // Verificar a cada 500ms por 5 segundos
            const intervals = [];
            for (let i = 0; i < 10; i++) {
                intervals.push(new Promise(r => setTimeout(r, 500 * (i + 1))));
            }

            let maxMutationsPerInterval = 0;

            const checkLoop = setInterval(() => {
                const delta = mutationCount - lastCount;
                if (delta > maxMutationsPerInterval) {
                    maxMutationsPerInterval = delta;
                }
                
                if (delta === 0) {
                    unchangedIntervals++;
                } else {
                    unchangedIntervals = 0;
                }
                
                lastCount = mutationCount;
            }, 500);

            setTimeout(() => {
                clearInterval(checkLoop);
                observer.disconnect();
                
                resolve({
                    totalMutations: mutationCount,
                    maxMutationsPerInterval,
                    isStable: unchangedIntervals >= 3,
                    averageMutationsPerSecond: Math.round((mutationCount / 5) * 10) / 10
                });
            }, 5000);
        });
    });

    console.log(`   Total de mutações DOM: ${loopTest.totalMutations}`);
    console.log(`   Mutações por segundo: ${loopTest.averageMutationsPerSecond}`);
    console.log(`   Pico máximo: ${loopTest.maxMutationsPerInterval} mutações em 500ms`);
    
    if (loopTest.averageMutationsPerSecond > 100) {
        console.log(`   ⚠️  ALERTA: Taxa de mutações muito alta! Possível loop infinito`);
    } else if (loopTest.isStable) {
        console.log(`   ✅ DOM estável`);
    } else {
        console.log(`   ⚠️  DOM com mutações constantes`);
    }
    console.log('');

    // Resumo final
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 RESUMO DO DIAGNÓSTICO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Blocos renderizados: ${blocksInfo.count > 0 ? '✅ SIM' : '❌ NÃO'} (${blocksInfo.count})`);
    console.log(`   Seleção funciona: ${selectionResult.success ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   Tempo de resposta: ${Math.round(selectionResult.duration)}ms ${selectionResult.duration > 1000 ? '⚠️  LENTO' : '✅'}`);
    console.log(`   Erros no console: ${errors.length === 0 ? '✅ NENHUM' : `❌ ${errors.length}`}`);
    console.log(`   Warnings React: ${reactWarnings.length === 0 ? '✅ NENHUM' : `⚠️  ${reactWarnings.length}`}`);
    console.log(`   DOM estável: ${loopTest.isStable ? '✅ SIM' : '⚠️  NÃO'}`);
    console.log(`   Performance: ${loopTest.averageMutationsPerSecond < 100 ? '✅ BOA' : '⚠️  RUIM'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Diagnóstico específico
    if (!selectionResult.success) {
        console.log('🔧 DIAGNÓSTICO DO PROBLEMA DE SELEÇÃO:');
        console.log('');
        console.log('   Possíveis causas:');
        console.log('   1. Handler onBlockSelect não está sendo propagado');
        console.log('   2. Evento de click sendo bloqueado/cancelado');
        console.log('   3. Classes de seleção visual não sendo aplicadas');
        console.log('   4. DnD interferindo com os eventos de click');
        console.log('');
        console.log('   Próximos passos:');
        console.log('   - Verificar CanvasColumn se onSelect está conectado');
        console.log('   - Verificar se handleBlockSelect está no scope correto');
        console.log('   - Verificar DnD sensors se estão bloqueando clicks');
        console.log('   - Adicionar logs em handleWYSIWYGBlockSelect');
    }

    if (loopTest.averageMutationsPerSecond > 100) {
        console.log('🔧 DIAGNÓSTICO DO PROBLEMA DE PERFORMANCE:');
        console.log('');
        console.log('   Possíveis causas:');
        console.log('   1. Loop infinito de re-renders');
        console.log('   2. useEffect sem dependências corretas');
        console.log('   3. Estado sendo atualizado repetidamente');
        console.log('   4. Listeners de DOM acumulados');
        console.log('');
        console.log('   Próximos passos:');
        console.log('   - Verificar useEffect que atualiza selectedBlock');
        console.log('   - Verificar auto-select de primeiro bloco');
        console.log('   - Adicionar guards em handleBlockSelect');
    }

    await browser.close();
    console.log('\n✅ Diagnóstico completo!');
}

diagnose().catch(console.error);
