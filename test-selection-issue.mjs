/**
 * 🔍 SCRIPT DE DIAGNÓSTICO - Problema de Seleção
 * 
 * Testa se há:
 * 1. Event listeners acumulados
 * 2. Loops infinitos de re-render
 * 3. Memory leaks
 * 4. Problemas de performance
 */

import { chromium } from 'playwright';

async function diagnose() {
    console.log('🚀 Iniciando diagnóstico...\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Logs do console
    const consoleLogs = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push({ type: msg.type(), text, timestamp: Date.now() });
        
        if (msg.type() === 'error') {
            console.log(`❌ [ERROR] ${text}`);
        } else if (msg.type() === 'warning') {
            console.log(`⚠️  [WARN] ${text}`);
        }
    });

    // Erros não capturados
    page.on('pageerror', error => {
        console.log(`💥 [PAGE ERROR] ${error.message}`);
    });

    console.log('📍 Navegando para o editor...');
    await page.goto('http://localhost:8080/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete', {
        waitUntil: 'networkidle',
        timeout: 30000
    });

    console.log('✅ Página carregada\n');

    // Aguardar editor carregar
    await page.waitForTimeout(3000);

    console.log('📊 Coletando métricas iniciais...');
    const initialMetrics = await page.evaluate(() => ({
        memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0,
        listeners: window.getEventListeners ? Object.keys(window.getEventListeners(document)).length : 0,
        elements: document.querySelectorAll('*').length
    }));

    console.log(`   Memory: ${initialMetrics.memory} MB`);
    console.log(`   DOM Elements: ${initialMetrics.elements}`);
    console.log('');

    // Teste 1: Verificar se blocos são renderizados
    console.log('🧪 Teste 1: Verificar blocos renderizados');
    const blocksCount = await page.evaluate(() => {
        const blocks = document.querySelectorAll('[data-block-id], [id^="block-"]');
        return blocks.length;
    });
    console.log(`   ✅ ${blocksCount} blocos encontrados\n`);

    if (blocksCount === 0) {
        console.log('❌ PROBLEMA: Nenhum bloco foi renderizado!');
        await browser.close();
        return;
    }

    // Teste 2: Tentar selecionar um bloco
    console.log('🧪 Teste 2: Testar seleção de bloco');
    
    const selectionResult = await page.evaluate(() => {
        const blocks = document.querySelectorAll('[data-block-id], [id^="block-"]');
        if (blocks.length === 0) return { success: false, reason: 'no blocks' };

        const firstBlock = blocks[0];
        const blockId = firstBlock.getAttribute('data-block-id') || firstBlock.id;

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
                // Verificar se foi selecionado
                const isSelected = firstBlock.classList.contains('selected') ||
                                  firstBlock.classList.contains('ring-2') ||
                                  firstBlock.querySelector('[class*="SELECIONADO"]');

                resolve({
                    success: !!isSelected,
                    blockId,
                    classes: firstBlock.className,
                    reason: isSelected ? 'selected' : 'not selected visually'
                });
            }, 500);
        });
    });

    if (selectionResult.success) {
        console.log(`   ✅ Bloco ${selectionResult.blockId} selecionado`);
    } else {
        console.log(`   ⚠️  Bloco ${selectionResult.blockId} não mostra seleção visual`);
        console.log(`   Classes: ${selectionResult.classes}`);
    }
    console.log('');

    // Teste 3: Monitorar re-renders excessivos
    console.log('🧪 Teste 3: Monitorar re-renders (10 segundos)');
    
    let renderCount = 0;
    const renderObserver = await page.evaluateHandle(() => {
        let count = 0;
        const observer = new MutationObserver(mutations => {
            count += mutations.length;
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        return { observer, getCount: () => count };
    });

    await page.waitForTimeout(10000);

    renderCount = await page.evaluate(handle => {
        return window.__renderCount || 0;
    });

    console.log(`   Mutações detectadas no DOM: ${renderCount > 0 ? renderCount : 'N/A'}`);
    console.log('');

    // Teste 4: Verificar event listeners acumulados
    console.log('🧪 Teste 4: Verificar event listeners');
    
    const listenersInfo = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        let totalListeners = 0;
        const listenersByType = {};

        allElements.forEach(el => {
            const listeners = getEventListeners?.(el) || {};
            Object.keys(listeners).forEach(type => {
                const count = listeners[type].length;
                totalListeners += count;
                listenersByType[type] = (listenersByType[type] || 0) + count;
            });
        });

        return { totalListeners, listenersByType };
    });

    console.log(`   Total de listeners: ${listenersInfo.totalListeners}`);
    console.log(`   Por tipo:`, listenersInfo.listenersByType);
    console.log('');

    // Teste 5: Verificar warnings de React
    console.log('🧪 Teste 5: Verificar warnings de React');
    
    const reactWarnings = consoleLogs.filter(log => 
        log.text.includes('Warning:') || 
        log.text.includes('React') ||
        log.text.includes('Hook')
    );

    if (reactWarnings.length > 0) {
        console.log(`   ⚠️  ${reactWarnings.length} warnings encontrados:`);
        reactWarnings.slice(0, 5).forEach(warn => {
            console.log(`      - ${warn.text.substring(0, 100)}...`);
        });
    } else {
        console.log(`   ✅ Nenhum warning de React encontrado`);
    }
    console.log('');

    // Teste 6: Métricas finais
    console.log('📊 Métricas finais:');
    const finalMetrics = await page.evaluate(() => ({
        memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0,
        elements: document.querySelectorAll('*').length
    }));

    const memoryIncrease = finalMetrics.memory - initialMetrics.memory;
    const elementsIncrease = finalMetrics.elements - initialMetrics.elements;

    console.log(`   Memory: ${finalMetrics.memory} MB (${memoryIncrease >= 0 ? '+' : ''}${memoryIncrease} MB)`);
    console.log(`   DOM Elements: ${finalMetrics.elements} (${elementsIncrease >= 0 ? '+' : ''}${elementsIncrease})`);
    
    if (memoryIncrease > 50) {
        console.log(`   ⚠️  ALERTA: Aumento de memória significativo!`);
    }
    
    if (elementsIncrease > 100) {
        console.log(`   ⚠️  ALERTA: Muitos elementos adicionados ao DOM!`);
    }
    console.log('');

    // Resumo
    console.log('📋 RESUMO:');
    console.log(`   Blocos renderizados: ${blocksCount > 0 ? '✅' : '❌'}`);
    console.log(`   Seleção funciona: ${selectionResult.success ? '✅' : '⚠️'}`);
    console.log(`   Warnings React: ${reactWarnings.length === 0 ? '✅' : '⚠️'}`);
    console.log(`   Performance: ${memoryIncrease < 50 ? '✅' : '⚠️'}`);
    console.log('');

    // Aguardar antes de fechar
    console.log('⏱️  Aguardando 5 segundos antes de fechar...');
    await page.waitForTimeout(5000);

    await browser.close();
    console.log('✅ Diagnóstico completo!');
}

diagnose().catch(console.error);
