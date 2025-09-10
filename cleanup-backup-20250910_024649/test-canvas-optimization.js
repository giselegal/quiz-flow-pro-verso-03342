// 🧪 TESTE DE VALIDAÇÃO: OTIMIZAÇÕES CANVAS APLICADAS
// Execute este script no console do navegador (F12) para verificar se as otimizações funcionaram

console.log('🧪 === TESTE DE VALIDAÇÃO: OTIMIZAÇÕES CANVAS ===');

function validateCanvasOptimizations() {
    const results = {
        canvasFound: false,
        optimizedAttribute: false,
        cssOptimizations: false,
        gpuAcceleration: false,
        performanceCSS: false,
        score: 0
    };

    // 1. VERIFICAR SE CANVAS EXISTE
    const canvas = document.querySelector('[data-id="canvas-drop-zone"]');
    if (canvas) {
        results.canvasFound = true;
        results.score += 20;
        console.log('✅ 1. Canvas encontrado');

        // 2. VERIFICAR ATRIBUTO DE OTIMIZAÇÃO
        if (canvas.getAttribute('data-canvas-optimized') === 'true') {
            results.optimizedAttribute = true;
            results.score += 20;
            console.log('✅ 2. Atributo data-canvas-optimized presente');
        } else {
            console.log('❌ 2. Atributo data-canvas-optimized ausente');
        }

        // 3. VERIFICAR ESTILOS COMPUTADOS
        const styles = window.getComputedStyle(canvas);

        // GPU Acceleration
        if (styles.transform !== 'none' || styles.willChange === 'transform') {
            results.gpuAcceleration = true;
            results.score += 20;
            console.log('✅ 3. GPU Acceleration detectada');
            console.log(`   Transform: ${styles.transform}`);
            console.log(`   Will-change: ${styles.willChange}`);
        } else {
            console.log('❌ 3. GPU Acceleration não detectada');
        }

        // CSS Containment
        if (styles.contain && styles.contain !== 'none') {
            results.cssOptimizations = true;
            results.score += 20;
            console.log('✅ 4. CSS Containment aplicado');
            console.log(`   Contain: ${styles.contain}`);
        } else {
            console.log('❌ 4. CSS Containment não aplicado');
        }

    } else {
        console.log('❌ 1. Canvas não encontrado');
    }

    // 5. VERIFICAR SE CSS DE PERFORMANCE FOI CARREGADO
    const stylesheets = Array.from(document.styleSheets);
    let foundPerformanceCSS = false;

    stylesheets.forEach(sheet => {
        try {
            const rules = Array.from(sheet.cssRules || []);
            const hasCanvasRules = rules.some(rule =>
                rule.cssText && (
                    rule.cssText.includes('.dnd-droppable-zone') ||
                    rule.cssText.includes('data-canvas-optimized')
                )
            );
            if (hasCanvasRules) {
                foundPerformanceCSS = true;
            }
        } catch (e) {
            // CORS error, skip
        }
    });

    if (foundPerformanceCSS) {
        results.performanceCSS = true;
        results.score += 20;
        console.log('✅ 5. CSS de performance carregado');
    } else {
        console.log('❌ 5. CSS de performance não encontrado');
    }

    // RESULTADO FINAL
    console.log('\n📊 RESULTADO FINAL:');
    console.log(`🎯 Score: ${results.score}/100`);

    if (results.score >= 80) {
        console.log('🚀 EXCELENTE! Otimizações aplicadas com sucesso');
    } else if (results.score >= 60) {
        console.log('⚠️ BOM! Algumas otimizações aplicadas, mas pode melhorar');
    } else {
        console.log('❌ CRÍTICO! Otimizações não foram aplicadas corretamente');
    }

    return results;
}

function testCanvasPerformance() {
    console.log('\n⚡ TESTE DE PERFORMANCE:');

    const canvas = document.querySelector('[data-id="canvas-drop-zone"]');
    if (!canvas) {
        console.log('❌ Canvas não encontrado para teste de performance');
        return;
    }

    // Medir tempo de renderização
    const startTime = performance.now();

    // Simular mudanças no DOM
    const testDiv = document.createElement('div');
    testDiv.textContent = 'Teste de performance';
    canvas.appendChild(testDiv);

    // Forçar layout
    canvas.offsetHeight;

    // Limpar
    canvas.removeChild(testDiv);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    console.log(`📊 Tempo de renderização: ${renderTime.toFixed(2)}ms`);

    if (renderTime < 16.67) {
        console.log('🚀 EXCELENTE! Renderização < 16.67ms (60fps)');
    } else if (renderTime < 33.33) {
        console.log('✅ BOM! Renderização < 33.33ms (30fps)');
    } else {
        console.log('⚠️ LENTO! Renderização > 33.33ms');
    }
}

function showOptimizationIndicator() {
    // Criar indicador visual
    const indicator = document.createElement('div');
    indicator.id = 'optimization-indicator';
    indicator.innerHTML = '🚀 OTIMIZADO';
    indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #22c55e;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    z-index: 9999;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    animation: pulse 2s infinite;
  `;

    // Adicionar animação CSS
    if (!document.getElementById('optimization-styles')) {
        const style = document.createElement('style');
        style.id = 'optimization-styles';
        style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
      }
    `;
        document.head.appendChild(style);
    }

    // Remover indicador anterior se existir
    const existing = document.getElementById('optimization-indicator');
    if (existing) existing.remove();

    document.body.appendChild(indicator);

    // Remover após 10 segundos
    setTimeout(() => {
        if (document.getElementById('optimization-indicator')) {
            indicator.remove();
        }
    }, 10000);

    console.log('✅ Indicador visual de otimização ativado (10s)');
}

// EXECUTAR TESTES AUTOMATICAMENTE
console.log('🚀 Executando validação automática...\n');

const results = validateCanvasOptimizations();
testCanvasPerformance();

if (results.score >= 60) {
    showOptimizationIndicator();
}

// COMANDOS MANUAIS
console.log('\n🎯 COMANDOS MANUAIS:');
console.log('   validateCanvasOptimizations() - Validar otimizações');
console.log('   testCanvasPerformance() - Testar performance');
console.log('   showOptimizationIndicator() - Mostrar indicador visual');

// EXPORTAR PARA WINDOW PARA USO MANUAL
window.validateCanvasOptimizations = validateCanvasOptimizations;
window.testCanvasPerformance = testCanvasPerformance;
window.showOptimizationIndicator = showOptimizationIndicator;
