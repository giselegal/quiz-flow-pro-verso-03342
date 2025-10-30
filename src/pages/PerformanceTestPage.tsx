/**
 * 🎯 FASE 2: PÁGINA DE VALIDAÇÃO DE PERFORMANCE
 * 
 * Página dedicada para testar e validar a meta de -50% re-renders
 * após refatoração de provedores da Fase 2
 * 
 * Acesso: http://localhost:5173/performance-test
 */

import React, { useState } from 'react';
import { EditorCompositeProvider } from '@/contexts/editor/EditorCompositeProvider';
import { RenderProfiler, RenderMetricsDashboard, useRenderCounter } from '@/utils/RenderProfiler';

// Componente filho que usa o editor context
const EditorConsumer: React.FC = () => {
    const renderCount = useRenderCounter('EditorConsumer', true);
    const [localState, setLocalState] = useState(0);

    return (
        <div style={{ padding: '20px', border: '2px solid #007bff', margin: '10px', borderRadius: '5px' }}>
            <h3>📦 Editor Consumer Component</h3>
            <p>Este componente consome o EditorContext</p>
            <p>Renders: <strong>{renderCount}</strong></p>
            <p>Local State: {localState}</p>
            <button
                onClick={() => setLocalState(s => s + 1)}
                style={{
                    padding: '10px 20px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                }}
            >
                Update Local State
            </button>
        </div>
    );
};

// Componente de stress test
const StressTest: React.FC = () => {
    const [triggerCount, setTriggerCount] = useState(0);
    const renderCount = useRenderCounter('StressTest', true);

    const handleStressTest = () => {
        // Simular 10 atualizações rápidas
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                setTriggerCount(c => c + 1);
            }, i * 100);
        }
    };

    return (
        <div style={{ padding: '20px', border: '2px solid #dc3545', margin: '10px', borderRadius: '5px' }}>
            <h3>🔥 Stress Test Component</h3>
            <p>Triggers: {triggerCount}</p>
            <p>Renders: <strong>{renderCount}</strong></p>
            <button
                onClick={handleStressTest}
                style={{
                    padding: '10px 20px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                }}
            >
                Run Stress Test (10 updates)
            </button>
        </div>
    );
};

const PerformanceTestPage: React.FC = () => {
    const [showMetrics, setShowMetrics] = useState(false);

    return (
        <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1>🎯 Fase 2: Validação de Performance</h1>
                <p>
                    Esta página testa a meta de <strong>-50% re-renders</strong> após refatoração
                    dos provedores.
                </p>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginTop: '10px' }}>
                    <h3>📋 Instruções:</h3>
                    <ol>
                        <li>Abra o React DevTools Profiler</li>
                        <li>Clique em "Start Profiling"</li>
                        <li>Interaja com os componentes abaixo</li>
                        <li>Pare o profiling e analise os re-renders</li>
                        <li>Compare com métricas em tempo real</li>
                    </ol>
                </div>
                <button
                    onClick={() => setShowMetrics(!showMetrics)}
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '15px',
                    }}
                >
                    {showMetrics ? 'Ocultar' : 'Mostrar'} Dashboard de Métricas
                </button>
            </div>

            {showMetrics && <RenderMetricsDashboard />}

            <div style={{ marginTop: '30px' }}>
                <h2>🧪 Componentes de Teste</h2>

                <RenderProfiler id="EditorCompositeProvider-Test" logToConsole showOverlay>
                    <EditorCompositeProvider funnelId="test-funnel" debugMode>
                        <RenderProfiler id="EditorConsumer-1" logToConsole>
                            <EditorConsumer />
                        </RenderProfiler>

                        <RenderProfiler id="StressTest-1" logToConsole>
                            <StressTest />
                        </RenderProfiler>

                        <div style={{ padding: '20px', border: '2px solid #6c757d', margin: '10px', borderRadius: '5px' }}>
                            <h3>ℹ️ Métricas Esperadas (Meta Fase 2)</h3>
                            <ul>
                                <li>
                                    <strong>EditorCompositeProvider:</strong> Máximo 3-5 renders iniciais
                                    (mount + hydration)
                                </li>
                                <li>
                                    <strong>EditorConsumer:</strong> 1 render por atualização de estado local
                                    (sem propagação desnecessária)
                                </li>
                                <li>
                                    <strong>StressTest:</strong> 10 renders no teste (1 por update)
                                </li>
                                <li>
                                    <strong>Provider re-renders:</strong> 0 quando children atualizam localmente
                                </li>
                            </ul>
                            <div style={{
                                marginTop: '15px',
                                padding: '10px',
                                background: '#d4edda',
                                borderRadius: '5px',
                                borderLeft: '4px solid #28a745',
                            }}>
                                <strong>✅ Meta Fase 2:</strong> Redução de 50% nos re-renders em comparação
                                com arquitetura anterior (5 níveis de providers)
                            </div>
                        </div>
                    </EditorCompositeProvider>
                </RenderProfiler>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '5px' }}>
                <h3>⚠️ Notas de Desenvolvimento</h3>
                <ul>
                    <li>Todos os console.logs estão habilitados para debug</li>
                    <li>O overlay mostra renders em tempo real no canto inferior direito</li>
                    <li>Use React DevTools Profiler para análise detalhada</li>
                    <li>Compare métricas antes/depois da Fase 2 usando git checkout</li>
                </ul>
            </div>
        </div>
    );
};

export default PerformanceTestPage;
