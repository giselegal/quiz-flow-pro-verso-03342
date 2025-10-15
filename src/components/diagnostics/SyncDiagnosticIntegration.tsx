/**
 * 🔧 INTEGRAÇÃO DIAGNÓSTICO CANVAS-PREVIEW
 * 
 * Componente para integrar diagnóstico na aplicação principal
 */

import React, { useEffect, useState } from 'react';
import { CanvasPreviewSyncPanel } from './CanvasPreviewSyncDiagnostic';

// Adicionar o painel de diagnóstico ao App principal
export const withSyncDiagnostic = (WrappedComponent: React.ComponentType<any>) => {
    return function DiagnosticWrapper(props: any) {
        const [showDiagnostic, setShowDiagnostic] = useState(false);
        const [diagnosticResults, setDiagnosticResults] = useState<any>(null);

        useEffect(() => {
            // Verificar se deve mostrar diagnóstico (desenvolvimento)
            const shouldShow = process.env.NODE_ENV === 'development' ||
                localStorage.getItem('show-sync-diagnostic') === 'true' ||
                window.location.search.includes('debug=sync');

            setShowDiagnostic(shouldShow);

            // Executar teste automático após carregamento
            if (shouldShow) {
                setTimeout(async () => {
                    try {
                        // Executar teste prático se disponível
                        if (window.testCanvasPreviewSync) {
                            const results = await window.testCanvasPreviewSync();
                            setDiagnosticResults(results);

                            // Auto-start monitoring se testes falharam
                            if (results.failed > 0 && window.startSyncDiagnostic) {
                                console.log('🔄 Iniciando monitoramento automático devido a falhas...');
                                window.startSyncDiagnostic();
                            }
                        }
                    } catch (error) {
                        console.warn('Erro ao executar diagnóstico automático:', error);
                    }
                }, 2000); // Aguardar 2s para app carregar
            }

            // Adicionar atalho de teclado para toggle
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                    event.preventDefault();
                    setShowDiagnostic(prev => {
                        const newValue = !prev;
                        localStorage.setItem('show-sync-diagnostic', newValue.toString());
                        return newValue;
                    });
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }, []);

        return (
            <>
                <WrappedComponent {...props} />

                {showDiagnostic && (
                    <>
                        <CanvasPreviewSyncPanel />

                        {/* Botão para executar teste manual */}
                        <div style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 10001,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <button
                                onClick={async () => {
                                    if (window.testCanvasPreviewSync) {
                                        const results = await window.testCanvasPreviewSync();
                                        setDiagnosticResults(results);
                                    }
                                }}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            >
                                🧪 Testar Sync
                            </button>

                            <button
                                onClick={() => {
                                    setShowDiagnostic(false);
                                    localStorage.setItem('show-sync-diagnostic', 'false');
                                    if (window.stopSyncDiagnostic) {
                                        window.stopSyncDiagnostic();
                                    }
                                }}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#666',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '10px'
                                }}
                            >
                                ✖ Fechar
                            </button>
                        </div>

                        {/* Resultados do teste */}
                        {diagnosticResults && (
                            <div style={{
                                position: 'fixed',
                                bottom: '20px',
                                left: '20px',
                                width: '350px',
                                maxHeight: '400px',
                                padding: '15px',
                                backgroundColor: '#1e1e1e',
                                color: '#fff',
                                borderRadius: '8px',
                                fontSize: '11px',
                                zIndex: 10001,
                                overflow: 'auto',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                border: `2px solid ${diagnosticResults.failed === 0 ? '#4CAF50' : '#f44336'}`
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                    borderBottom: '1px solid #333',
                                    paddingBottom: '8px'
                                }}>
                                    <h4 style={{ margin: 0, fontSize: '13px' }}>
                                        📊 Resultados do Teste
                                    </h4>
                                    <button
                                        onClick={() => setDiagnosticResults(null)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#999',
                                            cursor: 'pointer',
                                            fontSize: '16px'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <div style={{
                                        color: diagnosticResults.failed === 0 ? '#4CAF50' : '#f44336',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}>
                                        {diagnosticResults.passed}/{diagnosticResults.total} testes passaram
                                        ({((diagnosticResults.passed / diagnosticResults.total) * 100).toFixed(1)}%)
                                    </div>
                                </div>

                                <div style={{ maxHeight: '250px', overflow: 'auto' }}>
                                    {diagnosticResults.tests.map((test: any, index: number) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '6px',
                                                marginBottom: '4px',
                                                backgroundColor: test.success ? '#1b5e20' : '#b71c1c',
                                                borderRadius: '4px',
                                                fontSize: '10px'
                                            }}
                                        >
                                            <div style={{ fontWeight: 'bold' }}>
                                                {test.success ? '✅' : '❌'} {test.name}
                                            </div>
                                            {test.message && (
                                                <div style={{ opacity: 0.9, marginTop: '2px' }}>
                                                    {test.message}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {diagnosticResults.failed > 0 && (
                                    <div style={{
                                        marginTop: '10px',
                                        paddingTop: '8px',
                                        borderTop: '1px solid #333',
                                        fontSize: '10px',
                                        color: '#ffeb3b'
                                    }}>
                                        💡 Pressione Ctrl+Shift+D para abrir/fechar diagnóstico
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Indicador quando diagnóstico está oculto */}
                {!showDiagnostic && process.env.NODE_ENV === 'development' && (
                    <div
                        onClick={() => setShowDiagnostic(true)}
                        style={{
                            position: 'fixed',
                            bottom: '10px',
                            right: '10px',
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#2196F3',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10000,
                            color: 'white',
                            fontSize: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                        title="Abrir diagnóstico de sincronização (Ctrl+Shift+D)"
                    >
                        🔧
                    </div>
                )}
            </>
        );
    };
};

// Hook para verificar sincronização em tempo real
export const useSyncMonitoring = () => {
    const [syncStatus, setSyncStatus] = useState({
        isInSync: true,
        canvasSteps: 0,
        previewSteps: 0,
        lastCheck: Date.now()
    });

    useEffect(() => {
        const checkSync = () => {
            try {
                const canvasSteps = document.querySelectorAll('[data-canvas-step], .canvas-step, .editor-step');
                const previewSteps = document.querySelectorAll('[data-preview-step], .preview-step, .quiz-step');

                const canvasCount = canvasSteps.length;
                const previewCount = previewSteps.length;

                setSyncStatus({
                    isInSync: canvasCount === previewCount,
                    canvasSteps: canvasCount,
                    previewSteps: previewCount,
                    lastCheck: Date.now()
                });

                // Disparar evento personalizado para outros componentes
                window.dispatchEvent(new CustomEvent('sync-status-update', {
                    detail: { canvasCount, previewCount, isInSync: canvasCount === previewCount }
                }));

            } catch (error) {
                console.warn('Erro ao verificar sincronização:', error);
            }
        };

        // Verificar inicialmente
        checkSync();

        // Verificar periodicamente
        const interval = setInterval(checkSync, 1000);

        // Verificar quando DOM muda
        const observer = new MutationObserver((mutations) => {
            const relevantChange = mutations.some(mutation =>
                mutation.target instanceof Element && (
                    mutation.target.closest('.canvas-container, .preview-container') ||
                    mutation.target.matches('[data-canvas-step], [data-preview-step]') ||
                    Array.from(mutation.addedNodes).some(node =>
                        node instanceof Element && (
                            node.matches('[data-canvas-step], [data-preview-step]') ||
                            node.querySelector('[data-canvas-step], [data-preview-step]')
                        )
                    )
                )
            );

            if (relevantChange) {
                setTimeout(checkSync, 100); // Debounce
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-canvas-step', 'data-preview-step']
        });

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    return syncStatus;
};

// Declare global types
declare global {
    interface Window {
        testCanvasPreviewSync?: () => Promise<any>;
        startSyncDiagnostic?: () => any;
        stopSyncDiagnostic?: () => void;
    }
}

export default withSyncDiagnostic;