import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🔍 ANÁLISE COMPLETA DE PERFORMANCE DO SISTEMA DnD
 * 
 * Script para medir e analisar o desempenho do Drag and Drop,
 * identificar gargalos e possíveis problemas de aninhamento.
 */

interface ElementWithListeners {
    type: 'draggable' | 'droppable';
    index: number;
    id: string;
    hasMouseDown?: boolean;
    hasTouch?: boolean;
    hasDrop?: boolean;
    hasDragOver?: boolean;
}

const DnDPerformanceAnalyzer = {
    measurements: {
        renderTimes: [],
        dragStartTimes: [],
        dragEndTimes: [],
        reorderTimes: [],
        memoryUsage: [],
        contextSwitches: [],
    },

    // ========================================================================
    // ANÁLISE DE HIERARQUIA
    // ========================================================================
    analyzeHierarchy() {
        appLogger.info('🏗️ ANÁLISE DE HIERARQUIA DND:');
        appLogger.info('=====================================');

        const hierarchy = {
            level1: 'MainEditorUnified.tsx',
            level2: 'EditorProvider.tsx',
            level3: 'LegacyCompatibilityWrapper.tsx',
            level4: 'EditorPro.tsx',
            level5: 'StepDndProvider.tsx (DndContext)',
            level6: 'CanvasAreaLayout.tsx',
            level7: 'SortableContext + Draggable items',
        };

        Object.entries(hierarchy).forEach(([level, component]) => {
            appLogger.info(`${level}: ${component}`);
        });

        // Detectar contexts aninhados
        const dndContexts = document.querySelectorAll('[data-rbd-droppable-context-id], [data-dnd-context]');
        const dndProviders = document.querySelectorAll('[class*="dnd"], [class*="DndContext"]');

        appLogger.info(`\\n📊 CONTEXTS ENCONTRADOS: ${dndContexts.length}`);
        appLogger.info(`📊 PROVIDERS ENCONTRADOS: ${dndProviders.length}`);

        if (dndContexts.length > 1) {
            appLogger.warn('⚠️ POSSÍVEL ANINHAMENTO DETECTADO!');
            dndContexts.forEach((ctx, i) => {
                appLogger.info(`  Context ${i + 1}:`, { data: [ctx.className] });
            });
        } else {
            appLogger.info('✅ Hierarquia limpa - apenas 1 DndContext');
        }

        return {
            totalLevels: Object.keys(hierarchy).length,
            contextsFound: dndContexts.length,
            hasNesting: dndContexts.length > 1,
            isOptimal: dndContexts.length === 1,
        };
    },

    // ========================================================================
    // ANÁLISE DE PERFORMANCE
    // ========================================================================
    measurePerformance() {
        appLogger.info('\\n⚡ ANÁLISE DE PERFORMANCE:');
        appLogger.info('=====================================');

        const startTime = performance.now();

        // Medir elementos DnD
        const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');
        const droppables = document.querySelectorAll('[data-dnd-kit-droppable]');
        const sortables = document.querySelectorAll('[data-dnd-kit-sortable]');

        appLogger.info(`🎯 Draggables: ${draggables.length}`);
        appLogger.info(`📥 Droppables: ${droppables.length}`);
        appLogger.info(`🔄 Sortables: ${sortables.length}`);

        // Medir tempo de query
        const queryTime = performance.now() - startTime;
        appLogger.info(`⏱️ Query time: ${queryTime.toFixed(2)}ms`);

        // Verificar re-renders desnecessários
        const rerenderIndicators = document.querySelectorAll('[data-render-count]');
        appLogger.info(`🔄 Components with render count: ${rerenderIndicators.length}`);

        // Análise de memória (se disponível)
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            appLogger.info(`💾 Used JS Heap: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            appLogger.info(`💾 Total JS Heap: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            appLogger.info(`💾 Heap Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
        }

        return {
            draggableCount: draggables.length,
            droppableCount: droppables.length,
            sortableCount: sortables.length,
            queryTime,
            hasRerenderTracking: rerenderIndicators.length > 0,
        };
    },

    // ========================================================================
    // TESTE DE DRAG SIMULATION
    // ========================================================================
    async simulateDragPerformance() {
        appLogger.info('\\n🎬 SIMULAÇÃO DE DRAG PERFORMANCE:');
        appLogger.info('=====================================');

        const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');

        if (draggables.length === 0) {
            appLogger.warn('❌ Nenhum elemento draggable encontrado!');
            return { success: false, reason: 'No draggables found' };
        }

        const firstDraggable = draggables[0] as HTMLElement;
        const measurements = [];

        // Simular 10 operações de drag
        for (let i = 0; i < 5; i++) {
            const startTime = performance.now();

            // Simular mousedown
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: 100 + i * 10,
                clientY: 100 + i * 10,
            });

            firstDraggable.dispatchEvent(mouseDownEvent);

            // Aguardar um frame
            await new Promise(resolve => requestAnimationFrame(resolve));

            // Simular mousemove
            const mouseMoveEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: 150 + i * 10,
                clientY: 150 + i * 10,
            });

            document.dispatchEvent(mouseMoveEvent);

            // Simular mouseup
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
            });

            document.dispatchEvent(mouseUpEvent);

            const endTime = performance.now();
            measurements.push(endTime - startTime);

            // Aguardar entre simulações
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        const avgTime = measurements.reduce((a, b) => a + b, 0) / measurements.length;
        const maxTime = Math.max(...measurements);
        const minTime = Math.min(...measurements);

        appLogger.info(`📊 Drag simulations: ${measurements.length}`);
        appLogger.info(`⏱️ Average time: ${avgTime.toFixed(2)}ms`);
        appLogger.info(`⏱️ Max time: ${maxTime.toFixed(2)}ms`);
        appLogger.info(`⏱️ Min time: ${minTime.toFixed(2)}ms`);

        // Análise de performance
        const isPerformant = avgTime < 16; // 60fps = 16.67ms per frame
        appLogger.info(`${isPerformant ? '✅' : '⚠️'} Performance: ${isPerformant ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);

        return {
            success: true,
            measurements,
            avgTime,
            maxTime,
            minTime,
            isPerformant,
        };
    },

    // ========================================================================
    // ANÁLISE DE LISTENERS
    // ========================================================================
    analyzeEventListeners() {
        appLogger.info('\\n🎧 ANÁLISE DE EVENT LISTENERS:');
        appLogger.info('=====================================');

        const elementsWithListeners: ElementWithListeners[] = [];

        // Verificar elementos DnD com listeners
        const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');
        const droppables = document.querySelectorAll('[data-dnd-kit-droppable]');

        draggables.forEach((el, i) => {
            const htmlEl = el as HTMLElement;
            const hasMouseDown = !!(htmlEl as any).onmousedown;
            const hasTouch = !!(htmlEl as any).ontouchstart;
            elementsWithListeners.push({
                type: 'draggable',
                index: i,
                id: el.id,
                hasMouseDown,
                hasTouch,
            });
        });

        droppables.forEach((el, i) => {
            const htmlEl = el as HTMLElement;
            const hasDrop = !!(htmlEl as any).ondrop;
            const hasDragOver = !!(htmlEl as any).ondragover;
            elementsWithListeners.push({
                type: 'droppable',
                index: i,
                id: el.id,
                hasDrop,
                hasDragOver,
            });
        });

        appLogger.info(`📋 Total elements with listeners: ${elementsWithListeners.length}`);

        // Verificar vazamentos de memory
        const globalListeners = ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];
        const activeGlobalListeners = globalListeners.filter(event => {
            // Check if there are global listeners (simplified check)
            return document.addEventListener.toString().includes(event);
        });

        appLogger.info(`🌍 Potential global listeners: ${activeGlobalListeners.length}`);
        if (activeGlobalListeners.length > 3) {
            appLogger.warn('⚠️ Muitos listeners globais podem impactar performance');
        }

        return {
            totalElements: elementsWithListeners.length,
            draggableElements: elementsWithListeners.filter(el => el.type === 'draggable').length,
            droppableElements: elementsWithListeners.filter(el => el.type === 'droppable').length,
            potentialGlobalListeners: activeGlobalListeners.length,
        };
    },

    // ========================================================================
    // RELATÓRIO COMPLETO
    // ========================================================================
    async generateCompleteReport() {
        console.clear();
        appLogger.info('🔍 RELATÓRIO COMPLETO - DnD PERFORMANCE ANALYSIS');
        appLogger.info('='.repeat(60));
        appLogger.info(`⏰ Timestamp: ${new Date().toISOString()}`);
        appLogger.info(`🌐 URL: ${window.location.href}`);
        appLogger.info(`📱 User Agent: ${navigator.userAgent.split(' ').pop()}`);

        const results = {
            hierarchy: this.analyzeHierarchy(),
            performance: this.measurePerformance(),
            dragSimulation: await this.simulateDragPerformance(),
            eventListeners: this.analyzeEventListeners(),
        };

        // Calcular score geral
        let score = 100;

        // Penalidades
        if (results.hierarchy.hasNesting) score -= 30;
        if (!results.dragSimulation.isPerformant) score -= 25;
        if (results.eventListeners.potentialGlobalListeners > 5) score -= 15;
        if (results.performance.queryTime > 10) score -= 10;

        appLogger.info('\\n🏆 SCORE FINAL:');
        appLogger.info('=====================================');
        appLogger.info(`📊 Score: ${Math.max(0, score)}/100`);
        appLogger.info(`${score >= 80 ? '✅' : score >= 60 ? '⚠️' : '❌'} Status: ${score >= 80 ? 'EXCELENTE' : score >= 60 ? 'BOM' : 'NECESSITA MELHORIA'
                    }`);

        // Recomendações
        appLogger.info('\\n💡 RECOMENDAÇÕES:');
        appLogger.info('=====================================');

        if (results.hierarchy.hasNesting) {
            appLogger.info('❌ Remover aninhamento de DndContext');
        }

        if (!results.dragSimulation.isPerformant) {
            appLogger.info('❌ Otimizar performance de drag operations');
        }

        if (results.eventListeners.potentialGlobalListeners > 5) {
            appLogger.info('❌ Reduzir listeners globais');
        }

        if (results.performance.draggableCount > 50) {
            appLogger.info('⚠️ Considerar virtualização para muitos elements');
        }

        if (score >= 80) {
            appLogger.info('✅ Sistema DnD está bem otimizado!');
        }

        return results;
    },
};

// Execução automática se estiver no browser
if (typeof window !== 'undefined') {
    appLogger.info('🚀 DnD Performance Analyzer carregado!');
    appLogger.info('📝 Execute: DnDPerformanceAnalyzer.generateCompleteReport()');

    // Expor globalmente para debug
    (window as any).DnDPerformanceAnalyzer = DnDPerformanceAnalyzer;
}

export default DnDPerformanceAnalyzer;
