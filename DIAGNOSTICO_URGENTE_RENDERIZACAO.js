// 🚨 DIAGNÓSTICO URGENTE - RENDERIZAÇÃO CANVAS EDITOR
// Execute este script no console do navegador (F12 → Console → Cole o código)

console.log('🚨 === DIAGNÓSTICO URGENTE: RENDERIZAÇÃO CANVAS ===');

// 1. VERIFICAR COMPONENTES REACT RENDERIZADOS
function checkReactComponents() {
    console.log('🔍 1. COMPONENTES REACT NO DOM:');

    // Canvas principal
    const canvas = document.querySelector('[data-id="canvas-drop-zone"]');
    console.log('   Canvas Principal:', canvas ? '✅ ENCONTRADO' : '❌ AUSENTE');

    // Sidebar de componentes
    const sidebar = document.querySelector('[data-testid*="sidebar"], .components-sidebar');
    console.log('   Sidebar Componentes:', sidebar ? '✅ ENCONTRADO' : '❌ AUSENTE');

    // Drag overlay
    const dragOverlay = document.querySelector('[data-rbd-drag-handle-draggable-id]');
    console.log('   Drag Overlay:', dragOverlay ? '✅ ATIVO' : '⚪ INATIVO');

    // Blocos renderizados
    const blocks = document.querySelectorAll('[data-block-id], .sortable-block');
    console.log(`   Blocos Renderizados: ${blocks.length} encontrados`);

    return { canvas, sidebar, dragOverlay, blocks };
}

// 2. VERIFICAR PERFORMANCE DE RENDERIZAÇÃO
function checkRenderPerformance() {
    console.log('⚡ 2. PERFORMANCE DE RENDERIZAÇÃO:');

    // Usar Performance Observer se disponível
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.name.includes('React') || entry.name.includes('render')) {
                    console.log(`   📊 ${entry.name}: ${entry.duration.toFixed(2)}ms`);
                }
            });
        });
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    // Medir tempo de renderização manual
    const startTime = performance.now();

    // Contar elementos pesados
    const allElements = document.querySelectorAll('*');
    const heavyElements = document.querySelectorAll('[class*="transition"], [style*="transform"]');

    const endTime = performance.now();

    console.log(`   📊 Total Elementos DOM: ${allElements.length}`);
    console.log(`   📊 Elementos com Animação: ${heavyElements.length}`);
    console.log(`   📊 Tempo Escaneamento: ${(endTime - startTime).toFixed(2)}ms`);
}

// 3. VERIFICAR GARGALOS DE RENDERIZAÇÃO
function checkRenderBottlenecks() {
    console.log('🐌 3. GARGALOS DE RENDERIZAÇÃO:');

    // Verificar re-renders excessivos
    const reactFiberNode = document.querySelector('[data-reactroot]')?._reactInternalFiber;
    if (reactFiberNode) {
        console.log('   🔄 React Fiber detectado');
    }

    // Verificar CSS pesado
    const stylesheets = document.styleSheets;
    let totalCSSRules = 0;
    for (let i = 0; i < stylesheets.length; i++) {
        try {
            totalCSSRules += stylesheets[i].cssRules?.length || 0;
        } catch (e) {
            // CORS error, ignore
        }
    }
    console.log(`   📝 Total CSS Rules: ${totalCSSRules}`);

    // Verificar memoria
    if (performance.memory) {
        const memory = performance.memory;
        console.log(`   🧠 Memória Usada: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`   🧠 Limite Memória: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    }

    // Verificar listeners de eventos
    const elementsWithEvents = document.querySelectorAll('[onclick], [onmousedown], [onmousemove]');
    console.log(`   👂 Elementos com Events: ${elementsWithEvents.length}`);
}

// 4. VERIFICAR PROBLEMAS ESPECÍFICOS DO CANVAS
function checkCanvasSpecificIssues() {
    console.log('🎨 4. PROBLEMAS ESPECÍFICOS DO CANVAS:');

    // Verificar virtualização
    const virtualizedContainer = document.querySelector('[data-virtualized], .virtual-list');
    console.log('   Virtual Scroll:', virtualizedContainer ? '✅ ATIVO' : '⚪ DESATIVADO');

    // Verificar renderização progressiva
    const progressiveElements = document.querySelectorAll('[data-progressive-render]');
    console.log(`   Renderização Progressiva: ${progressiveElements.length} elementos`);

    // Verificar drop zones
    const dropZones = document.querySelectorAll('[data-dnd-dropzone-type]');
    console.log(`   Drop Zones Ativas: ${dropZones.length}`);

    // Verificar problemas de z-index
    const highZIndexElements = Array.from(document.querySelectorAll('*'))
        .filter(el => {
            const zIndex = window.getComputedStyle(el).zIndex;
            return zIndex !== 'auto' && parseInt(zIndex) > 100;
        });
    console.log(`   Elementos Alto Z-Index: ${highZIndexElements.length}`);

    // Verificar transforms pesados
    const transformElements = Array.from(document.querySelectorAll('*'))
        .filter(el => {
            const transform = window.getComputedStyle(el).transform;
            return transform !== 'none';
        });
    console.log(`   Elementos com Transform: ${transformElements.length}`);
}

// 5. SOLUÇÕES IMEDIATAS
function applyImmediateFixes() {
    console.log('🔧 5. APLICANDO CORREÇÕES IMEDIATAS:');

    // Otimizar CSS will-change
    const style = document.createElement('style');
    style.textContent = `
    .sortable-block {
      will-change: transform !important;
      contain: layout style paint !important;
    }
    
    .canvas-drop-zone {
      contain: layout !important;
      transform: translateZ(0) !important;
    }
    
    .drag-overlay {
      will-change: transform !important;
      transform: translateZ(0) !important;
    }
    
    /* Reduzir motion para performance */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
    document.head.appendChild(style);
    console.log('   ✅ CSS Performance aplicado');

    // Forçar hardware acceleration
    const canvas = document.querySelector('[data-id="canvas-drop-zone"]');
    if (canvas) {
        canvas.style.transform = 'translateZ(0)';
        canvas.style.willChange = 'transform';
        console.log('   ✅ Hardware acceleration no canvas');
    }

    // Reduzir qualidade de animações
    document.body.style.backfaceVisibility = 'hidden';
    console.log('   ✅ Backface visibility otimizada');
}

// 6. MONITORAMENTO CONTÍNUO
function startContinuousMonitoring() {
    console.log('📊 6. INICIANDO MONITORAMENTO CONTÍNUO:');

    let renderCount = 0;
    let lastRenderTime = performance.now();

    // Observer para mudanças no DOM
    const observer = new MutationObserver((mutations) => {
        renderCount++;
        const currentTime = performance.now();
        const timeSinceLastRender = currentTime - lastRenderTime;

        if (timeSinceLastRender < 16.67) { // Menos que 60fps
            console.warn(`⚠️ Render rápido demais: ${timeSinceLastRender.toFixed(2)}ms`);
        }

        if (renderCount % 10 === 0) {
            console.log(`📊 Renders: ${renderCount} | Último: ${timeSinceLastRender.toFixed(2)}ms`);
        }

        lastRenderTime = currentTime;
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    console.log('   ✅ Monitoramento ativo');

    // Para o monitoramento após 30 segundos
    setTimeout(() => {
        observer.disconnect();
        console.log(`📊 Monitoramento finalizado. Total renders: ${renderCount}`);
    }, 30000);
}

// EXECUTAR DIAGNÓSTICO COMPLETO
async function runFullDiagnosis() {
    console.log('🚀 INICIANDO DIAGNÓSTICO COMPLETO...\n');

    const components = checkReactComponents();
    console.log('\n');

    checkRenderPerformance();
    console.log('\n');

    checkRenderBottlenecks();
    console.log('\n');

    checkCanvasSpecificIssues();
    console.log('\n');

    applyImmediateFixes();
    console.log('\n');

    startContinuousMonitoring();

    console.log('\n✅ DIAGNÓSTICO COMPLETO FINALIZADO');
    console.log('📊 Monitore o console pelos próximos 30 segundos...');

    return {
        canvas: components.canvas,
        sidebar: components.sidebar,
        blocksCount: components.blocks.length,
        timestamp: new Date().toISOString()
    };
}

// EXECUTAR AUTOMATICAMENTE
runFullDiagnosis();

// COMANDOS MANUAIS DISPONÍVEIS:
console.log('\n🎯 COMANDOS MANUAIS DISPONÍVEIS:');
console.log('   checkReactComponents() - Verificar componentes');
console.log('   checkRenderPerformance() - Verificar performance');
console.log('   checkRenderBottlenecks() - Verificar gargalos');
console.log('   checkCanvasSpecificIssues() - Verificar canvas');
console.log('   applyImmediateFixes() - Aplicar correções');
console.log('   runFullDiagnosis() - Executar tudo novamente');
