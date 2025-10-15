/**
 * 🎯 MIGRAÇÃO: Sistema Atual → Sistema Otimizado
 * 
 * Guia prático para migrar do LiveRuntimePreview atual
 * para o sistema otimizado implementado.
 */

// ============================================================================
// PASSO 1: Substituir LiveRuntimePreview
// ============================================================================

// ❌ ANTES (QuizModularProductionEditor.tsx ~linha 2608)
const LiveRuntimePreview = ({ steps, funnelId, selectedStepId }) => {
    const { setSteps, version } = useQuizRuntimeRegistry();

    const runtimeMap = useMemo(() => {
        return editorStepsToRuntimeMap(steps);
    }, [steps]);

    useEffect(() => {
        const currentHash = JSON.stringify(runtimeMap);
        if (currentHash !== lastUpdateRef.current) {
            setSteps(runtimeMap);
            lastUpdateRef.current = currentHash;
        }
    }, [runtimeMap]);

    return (
        <QuizAppConnected funnelId={funnelId} previewMode initialStepId={selectedStepId} />
    );
};

// ✅ DEPOIS - Usar o sistema otimizado
import { LiveCanvasPreview } from '@/components/editor/canvas/LiveCanvasPreview';

const OptimizedLivePreview = ({ steps, funnelId, selectedStepId }) => {
    return (
        <LiveCanvasPreview
            steps={steps}
            funnelId={funnelId}
            selectedStepId={selectedStepId}
            config={{
                autoRefresh: true,
                debounceDelay: 300,        // vs. 400ms atual
                showDebugInfo: false,      // Métricas em dev
                highlightChanges: true,    // Feedback visual
                isolatePreviewState: true  // Não polui contexto global
            }}
        />
    );
};

// ============================================================================
// PASSO 2: Implementar Métricas de Performance
// ============================================================================

// Monitoring component para detectar problemas
const PreviewPerformanceMonitor = () => {
    const { metrics, state } = useLiveCanvasPreview(steps, selectedStepId, {
        enableDebug: process.env.NODE_ENV === 'development'
    });

    // Alertas automáticos de performance
    useEffect(() => {
        if (metrics.averageUpdateTime > 100) {
            console.warn('🐌 Preview slow:', metrics.averageUpdateTime + 'ms');
        }

        if (metrics.cacheEfficiency < 0.7) {
            console.warn('📦 Cache efficiency low:', metrics.cacheEfficiency);
        }

        if (metrics.errorRate > 0.1) {
            console.error('❌ High error rate:', metrics.errorRate);
        }
    }, [metrics]);

    return process.env.NODE_ENV === 'development' ? (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
            <div>Updates: {metrics.totalUpdates}</div>
            <div>Avg Time: {metrics.averageUpdateTime.toFixed(1)}ms</div>
            <div>Cache: {(metrics.cacheEfficiency * 100).toFixed(1)}%</div>
            <div>Errors: {(metrics.errorRate * 100).toFixed(1)}%</div>
        </div>
    ) : null;
};

// ============================================================================
// PASSO 3: Otimizar Componentes de Bloco com React.memo
// ============================================================================

// ❌ ANTES - Re-renderiza sempre
const BlockComponent = ({ block, isSelected, onUpdate }) => {
    return (
        <div className={isSelected ? 'selected' : ''}>
            {/* Renderização do bloco */}
        </div>
    );
};

// ✅ DEPOIS - Memoização inteligente
const OptimizedBlockComponent = React.memo(({
    block,
    isSelected,
    onUpdate
}) => {
    return (
        <div className={isSelected ? 'selected' : ''}>
            {/* Renderização do bloco */}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison para evitar re-renders desnecessários
    return (
        prevProps.block.id === nextProps.block.id &&
        prevProps.isSelected === nextProps.isSelected &&
        JSON.stringify(prevProps.block.properties) ===
        JSON.stringify(nextProps.block.properties)
    );
});

// ============================================================================
// PASSO 4: Virtualização para Quizzes Grandes
// ============================================================================

// Para quizzes com 20+ steps/blocos
const VirtualizedPreview = ({ steps }) => {
    const {
        visible: visibleSteps,
        topSpacer,
        bottomSpacer,
        containerRef
    } = useVirtualBlocks({
        blocks: steps,
        rowHeight: 100,
        enabled: steps.length > 20
    });

    return (
        <div ref={containerRef} className="overflow-auto h-full">
            <div style={{ height: topSpacer }} />
            {visibleSteps.map(step => (
                <OptimizedBlockComponent key={step.id} block={step} />
            ))}
            <div style={{ height: bottomSpacer }} />
        </div>
    );
};

// ============================================================================
// PASSO 5: WebSocket para Colaboração (Opcional)
// ============================================================================

// Para sincronização entre múltiplas abas/usuários
const CollaborativePreview = ({ steps, funnelId }) => {
    return (
        <LivePreviewProvider
            enableDebug={isDev}
            autoReconnect={true}
            heartbeatInterval={30000}
        >
            <LiveCanvasPreview
                steps={steps}
                funnelId={funnelId}
                config={{ isolatePreviewState: false }} // Sync between instances
            />
        </LivePreviewProvider>
    );
};

// ============================================================================
// RESULTADO ESPERADO: MÉTRICAS DE PERFORMANCE
// ============================================================================

/* 
ANTES (Sistema Atual):
- Update Time: 150-500ms
- Cache Efficiency: 0% (sem cache)
- Re-renders: Completa a cada mudança
- Memory Usage: Crescente (vazamentos)
- User Experience: Lag perceptível

DEPOIS (Sistema Otimizado):
- Update Time: 10-50ms (3-10x mais rápido)
- Cache Efficiency: 70-90%
- Re-renders: Apenas componentes afetados
- Memory Usage: Controlado (cleanup automático)
- User Experience: Fluido e responsivo
*/

export {
    OptimizedLivePreview,
    PreviewPerformanceMonitor,
    OptimizedBlockComponent,
    VirtualizedPreview,
    CollaborativePreview
};