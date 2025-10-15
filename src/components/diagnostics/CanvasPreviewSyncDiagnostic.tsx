/**
 * 🔍 DIAGNÓSTICO CANVAS-PREVIEW SYNCHRONIZATION
 * 
 * Ferramenta para identificar e corrigir problemas de sincronização
 * entre edições no canvas e exibição no preview
 */

import React, { useEffect, useState, useRef } from 'react';

interface SyncIssue {
    type: 'sync_delay' | 'missing_update' | 'stale_data' | 'render_loop' | 'event_lost';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    canvasState?: any;
    previewState?: any;
    timestamp: number;
    autoFixable: boolean;
}

interface SyncMetrics {
    totalEdits: number;
    successfulSyncs: number;
    failedSyncs: number;
    avgSyncTime: number;
    lastSyncTimestamp: number;
    issues: SyncIssue[];
}

class CanvasPreviewSyncDiagnostic {
    private metrics: SyncMetrics;
    private syncHistory: Array<{
        edit: any;
        previewUpdate: any;
        syncTime: number;
        success: boolean;
    }>;
    private observers: Array<() => void>;

    constructor() {
        this.metrics = {
            totalEdits: 0,
            successfulSyncs: 0,
            failedSyncs: 0,
            avgSyncTime: 0,
            lastSyncTimestamp: 0,
            issues: []
        };
        this.syncHistory = [];
        this.observers = [];

        this.initializeMonitoring();
    }

    private initializeMonitoring() {
        // Monitor canvas edits
        this.monitorCanvasEdits();

        // Monitor preview updates
        this.monitorPreviewUpdates();

        // Monitor sync timing
        this.monitorSyncTiming();

        // Detect common issues
        this.detectSyncIssues();
    }

    private monitorCanvasEdits() {
        // Interceptar eventos de edição no canvas
        const originalDispatch = window.dispatchEvent;
        window.dispatchEvent = (event) => {
            if (event.type === 'canvas-edit' || event instanceof CustomEvent && event.detail?.type === 'canvas-edit') {
                this.recordCanvasEdit(event);
            }
            return originalDispatch.call(window, event);
        };

        // Observar mudanças no localStorage (backup)
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            if (key.includes('canvas') || key.includes('steps') || key.includes('quiz-config')) {
                this.recordCanvasEdit({ type: 'localStorage-change', key, value });
            }
            return originalSetItem.call(localStorage, key, value);
        };
    }

    private monitorPreviewUpdates() {
        // Observar atualizações do preview
        let lastPreviewState: any = null;

        const checkPreviewChanges = () => {
            const previewElements = document.querySelectorAll('[data-preview-step], .preview-container');
            if (previewElements.length > 0) {
                const currentState = this.capturePreviewState();
                if (JSON.stringify(currentState) !== JSON.stringify(lastPreviewState)) {
                    this.recordPreviewUpdate(currentState);
                    lastPreviewState = currentState;
                }
            }
        };

        // Polling para detectar mudanças
        setInterval(checkPreviewChanges, 500);

        // Observar mudanças no DOM
        const observer = new MutationObserver((mutations) => {
            const hasPreviewChanges = mutations.some(mutation =>
                mutation.target instanceof Element &&
                (mutation.target.closest('.preview-container') ||
                    mutation.target.matches('[data-preview-step]'))
            );

            if (hasPreviewChanges) {
                setTimeout(checkPreviewChanges, 100); // Debounce
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-preview-step', 'class', 'style']
        });
    }

    private monitorSyncTiming() {
        let lastEditTime = 0;

        // Registrar tempo de edição
        window.addEventListener('canvas-edit', () => {
            lastEditTime = Date.now();
        });

        // Calcular tempo de sincronização
        window.addEventListener('preview-update', () => {
            if (lastEditTime > 0) {
                const syncTime = Date.now() - lastEditTime;
                this.updateSyncMetrics(syncTime, true);
                lastEditTime = 0;
            }
        });

        // Detectar syncs perdidos
        setInterval(() => {
            if (lastEditTime > 0 && Date.now() - lastEditTime > 2000) {
                // Edit sem preview update por mais de 2s = problema
                this.addSyncIssue({
                    type: 'missing_update',
                    severity: 'high',
                    description: 'Edit feito no canvas mas preview não atualizou em 2s+',
                    timestamp: Date.now(),
                    autoFixable: true
                });
                this.updateSyncMetrics(Date.now() - lastEditTime, false);
                lastEditTime = 0;
            }
        }, 1000);
    }

    private detectSyncIssues() {
        // Detectar loops de renderização
        let renderCount = 0;
        const resetRenderCount = () => { renderCount = 0; };

        window.addEventListener('preview-render', () => {
            renderCount++;
            if (renderCount > 10) {
                this.addSyncIssue({
                    type: 'render_loop',
                    severity: 'critical',
                    description: `Preview renderizando ${renderCount} vezes muito rapidamente`,
                    timestamp: Date.now(),
                    autoFixable: true
                });
                resetRenderCount();
            }
        });

        setInterval(resetRenderCount, 1000);

        // Detectar dados obsoletos
        this.detectStaleData();

        // Detectar eventos perdidos
        this.detectLostEvents();
    }

    private detectStaleData() {
        setInterval(() => {
            const canvasData = this.getCanvasData();
            const previewData = this.getPreviewData();

            if (canvasData && previewData) {
                const timeDiff = Math.abs(canvasData.lastUpdate - previewData.lastUpdate);

                if (timeDiff > 5000) { // 5s+ de diferença
                    this.addSyncIssue({
                        type: 'stale_data',
                        severity: 'medium',
                        description: `Dados do preview ${timeDiff}ms mais antigos que canvas`,
                        canvasState: canvasData,
                        previewState: previewData,
                        timestamp: Date.now(),
                        autoFixable: true
                    });
                }
            }
        }, 3000);
    }

    private detectLostEvents() {
        const eventQueue: Array<{ event: string; timestamp: number; processed: boolean }> = [];

        // Rastrear eventos
        ['canvas-edit', 'step-add', 'step-remove', 'step-update'].forEach(eventType => {
            window.addEventListener(eventType, () => {
                eventQueue.push({
                    event: eventType,
                    timestamp: Date.now(),
                    processed: false
                });
            });
        });

        // Verificar se eventos foram processados
        setInterval(() => {
            const unprocessedEvents = eventQueue.filter(e =>
                !e.processed && Date.now() - e.timestamp > 3000
            );

            if (unprocessedEvents.length > 0) {
                this.addSyncIssue({
                    type: 'event_lost',
                    severity: 'high',
                    description: `${unprocessedEvents.length} eventos não processados`,
                    timestamp: Date.now(),
                    autoFixable: true
                });

                // Marcar como reportados
                unprocessedEvents.forEach(e => e.processed = true);
            }
        }, 2000);
    }

    private recordCanvasEdit(edit: any) {
        this.metrics.totalEdits++;
        this.metrics.lastSyncTimestamp = Date.now();

        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('canvas-edit', { detail: edit }));
    }

    private recordPreviewUpdate(state: any) {
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('preview-update', { detail: state }));
    }

    private capturePreviewState() {
        const previewContainer = document.querySelector('.preview-container');
        if (!previewContainer) return null;

        return {
            stepCount: previewContainer.querySelectorAll('[data-preview-step]').length,
            selectedStep: previewContainer.querySelector('[data-step-selected]')?.getAttribute('data-step-id'),
            lastUpdate: Date.now(),
            content: previewContainer.textContent?.slice(0, 100) // Sample content
        };
    }

    private getCanvasData() {
        // Tentar obter dados do canvas de várias fontes
        try {
            return JSON.parse(localStorage.getItem('canvas-state') || '{}');
        } catch {
            return { lastUpdate: Date.now() - 10000 }; // Fallback
        }
    }

    private getPreviewData() {
        const previewState = this.capturePreviewState();
        return previewState || { lastUpdate: Date.now() - 10000 };
    }

    private updateSyncMetrics(syncTime: number, success: boolean) {
        if (success) {
            this.metrics.successfulSyncs++;
        } else {
            this.metrics.failedSyncs++;
        }

        // Calcular média
        const totalSyncs = this.metrics.successfulSyncs + this.metrics.failedSyncs;
        this.metrics.avgSyncTime = (this.metrics.avgSyncTime * (totalSyncs - 1) + syncTime) / totalSyncs;

        this.notifyObservers();
    }

    private addSyncIssue(issue: Omit<SyncIssue, 'timestamp'> & { timestamp?: number }) {
        const fullIssue: SyncIssue = {
            ...issue,
            timestamp: issue.timestamp || Date.now()
        };

        this.metrics.issues.push(fullIssue);

        // Limitar histórico
        if (this.metrics.issues.length > 100) {
            this.metrics.issues = this.metrics.issues.slice(-50);
        }

        // Auto-fix se possível
        if (fullIssue.autoFixable) {
            this.autoFixIssue(fullIssue);
        }

        this.notifyObservers();
    }

    private autoFixIssue(issue: SyncIssue) {
        console.log(`🔧 Auto-fix para: ${issue.description}`);

        switch (issue.type) {
            case 'missing_update':
                this.forcePreviewSync();
                break;

            case 'render_loop':
                this.stabilizePreviewRender();
                break;

            case 'stale_data':
                this.refreshPreviewData();
                break;

            case 'event_lost':
                this.replayLostEvents();
                break;

            case 'sync_delay':
                this.optimizeSyncSpeed();
                break;
        }
    }

    private forcePreviewSync() {
        // Forçar sincronização do preview
        const canvasData = this.getCanvasData();
        if (canvasData) {
            window.dispatchEvent(new CustomEvent('force-preview-sync', {
                detail: canvasData
            }));
        }
    }

    private stabilizePreviewRender() {
        // Implementar debouncing para renders
        let renderTimeout: NodeJS.Timeout;
        const originalRender = window.requestAnimationFrame;

        window.requestAnimationFrame = (callback) => {
            clearTimeout(renderTimeout);
            renderTimeout = setTimeout(() => {
                originalRender(callback);
            }, 16); // 60fps limite
            return 0;
        };
    }

    private refreshPreviewData() {
        // Atualizar dados do preview
        window.dispatchEvent(new CustomEvent('refresh-preview-data'));
    }

    private replayLostEvents() {
        // Re-disparar eventos importantes
        window.dispatchEvent(new CustomEvent('replay-canvas-events'));
    }

    private optimizeSyncSpeed() {
        // Otimizar velocidade de sincronização
        const style = document.createElement('style');
        style.textContent = `
            .preview-container { 
                transition: none !important; 
                animation: none !important; 
            }
        `;
        document.head.appendChild(style);
    }

    public getMetrics(): SyncMetrics {
        return { ...this.metrics };
    }

    public getRecentIssues(count = 10): SyncIssue[] {
        return this.metrics.issues.slice(-count);
    }

    public subscribe(callback: () => void) {
        this.observers.push(callback);
        return () => {
            const index = this.observers.indexOf(callback);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
        };
    }

    private notifyObservers() {
        this.observers.forEach(callback => callback());
    }

    public generateReport(): string {
        const metrics = this.getMetrics();
        const successRate = metrics.totalEdits > 0
            ? ((metrics.successfulSyncs / metrics.totalEdits) * 100).toFixed(1)
            : '0';

        return `
🔍 RELATÓRIO DE SINCRONIZAÇÃO CANVAS ↔ PREVIEW
${'='.repeat(55)}

📊 MÉTRICAS GERAIS:
   • Total de Edições: ${metrics.totalEdits}
   • Sincronizações OK: ${metrics.successfulSyncs}
   • Sincronizações Falhou: ${metrics.failedSyncs}
   • Taxa de Sucesso: ${successRate}%
   • Tempo Médio Sync: ${metrics.avgSyncTime.toFixed(0)}ms
   • Última Sincronização: ${new Date(metrics.lastSyncTimestamp).toLocaleTimeString()}

🚨 PROBLEMAS DETECTADOS:
${metrics.issues.length === 0
                ? '   ✅ Nenhum problema detectado!'
                : metrics.issues.slice(-5).map(issue =>
                    `   ${issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟡' : '🟢'} ${issue.description}`
                ).join('\n')
            }

💡 RECOMENDAÇÕES:
${this.generateRecommendations(metrics)}

${'='.repeat(55)}
        `.trim();
    }

    private generateRecommendations(metrics: SyncMetrics): string {
        const recommendations: string[] = [];

        if (metrics.avgSyncTime > 1000) {
            recommendations.push('   • Otimizar velocidade de sincronização (>1s é lento)');
        }

        if (metrics.failedSyncs / metrics.totalEdits > 0.1) {
            recommendations.push('   • Investigar falhas de sincronização (>10% taxa de erro)');
        }

        const recentIssues = this.getRecentIssues(10);
        if (recentIssues.filter(i => i.type === 'render_loop').length > 0) {
            recommendations.push('   • Implementar debouncing para evitar loops de render');
        }

        if (recentIssues.filter(i => i.type === 'stale_data').length > 0) {
            recommendations.push('   • Melhorar sincronização de dados entre canvas e preview');
        }

        if (recommendations.length === 0) {
            recommendations.push('   ✅ Sistema funcionando corretamente!');
        }

        return recommendations.join('\n');
    }
}

// Componente React para exibir diagnósticos
export const CanvasPreviewSyncPanel: React.FC = () => {
    const [diagnostic] = useState(() => new CanvasPreviewSyncDiagnostic());
    const [metrics, setMetrics] = useState<SyncMetrics>(() => diagnostic.getMetrics());
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        const unsubscribe = diagnostic.subscribe(() => {
            setMetrics(diagnostic.getMetrics());
        });

        return unsubscribe;
    }, [diagnostic]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            setMetrics(diagnostic.getMetrics());
        }, 1000);

        return () => clearInterval(interval);
    }, [autoRefresh, diagnostic]);

    const successRate = metrics.totalEdits > 0
        ? ((metrics.successfulSyncs / metrics.totalEdits) * 100).toFixed(1)
        : '0';

    return (
        <div className="sync-diagnostic-panel" style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '300px',
            padding: '15px',
            backgroundColor: '#2a2a2a',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 10000,
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '14px' }}>🔄 Sync Canvas ↔ Preview</h3>
                <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        background: autoRefresh ? '#4CAF50' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {autoRefresh ? 'Auto' : 'Manual'}
                </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                        <div style={{ color: '#888' }}>Total Edições</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{metrics.totalEdits}</div>
                    </div>
                    <div>
                        <div style={{ color: '#888' }}>Taxa Sucesso</div>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: parseFloat(successRate) > 90 ? '#4CAF50' : parseFloat(successRate) > 70 ? '#ff9800' : '#f44336'
                        }}>
                            {successRate}%
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#888' }}>Tempo Médio</div>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: metrics.avgSyncTime > 1000 ? '#f44336' : metrics.avgSyncTime > 500 ? '#ff9800' : '#4CAF50'
                        }}>
                            {metrics.avgSyncTime.toFixed(0)}ms
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#888' }}>Problemas</div>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: metrics.issues.length === 0 ? '#4CAF50' : metrics.issues.length < 5 ? '#ff9800' : '#f44336'
                        }}>
                            {metrics.issues.length}
                        </div>
                    </div>
                </div>
            </div>

            {metrics.issues.length > 0 && (
                <div>
                    <div style={{ color: '#888', marginBottom: '8px' }}>Problemas Recentes:</div>
                    {diagnostic.getRecentIssues(3).map((issue, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '6px',
                                marginBottom: '4px',
                                backgroundColor: issue.severity === 'critical' ? '#d32f2f' :
                                    issue.severity === 'high' ? '#f57c00' :
                                        issue.severity === 'medium' ? '#1976d2' : '#388e3c',
                                borderRadius: '4px',
                                fontSize: '10px'
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>
                                {issue.type.replace('_', ' ').toUpperCase()}
                            </div>
                            <div>{issue.description}</div>
                            <div style={{ fontSize: '9px', opacity: 0.8 }}>
                                {new Date(issue.timestamp).toLocaleTimeString()}
                                {issue.autoFixable && ' • Auto-fixed'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #555' }}>
                <button
                    onClick={() => console.log(diagnostic.generateReport())}
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                    }}
                >
                    📋 Gerar Relatório Completo
                </button>
            </div>
        </div>
    );
};

export default CanvasPreviewSyncDiagnostic;