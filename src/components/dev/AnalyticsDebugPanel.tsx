import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/services/AnalyticsService';

interface AnalyticsDebugPanelProps {
    autoRefreshMs?: number;
    maxEvents?: number;
}

// Painel simples para inspecionar métricas e eventos em dev
export const AnalyticsDebugPanel: React.FC<AnalyticsDebugPanelProps> = ({ autoRefreshMs = 3000, maxEvents = 50 }) => {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [sessionMetrics, setSessionMetrics] = useState<Record<string, number>>({});
    const [expanded, setExpanded] = useState<boolean>(false);

    const refresh = () => {
        const cats: any[] = [];
        ['performance', 'collaboration', 'versioning', 'usage', 'system'].forEach(cat => {
            const list = analyticsService.getMetricsByCategory(cat as any);
            if (list.length) cats.push(...list.map(m => ({ ...m, category: cat })));
        });
        setMetrics(cats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        setSessionMetrics(analyticsService.getSessionMetrics());
    };

    useEffect(() => {
        refresh();
        const id = setInterval(refresh, autoRefreshMs);
        return () => clearInterval(id);
    }, [autoRefreshMs]);

    useEffect(() => {
        // Captura eventos brutos (não temos getter público completo; reutilizamos storage snapshot)
        try {
            const raw = localStorage.getItem('analytics.v1');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed.events)) {
                    setEvents(parsed.events.slice(-maxEvents).reverse());
                }
            }
        } catch {/* noop */ }
    });

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            left: 10,
            background: '#111',
            color: '#eee',
            fontFamily: 'monospace',
            fontSize: 11,
            padding: '8px 10px',
            borderRadius: 6,
            zIndex: 9999,
            maxWidth: 360,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
                <strong>Analytics Debug</strong>
                <span>{expanded ? '−' : '+'}</span>
            </div>
            {expanded && (
                <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 6 }}>
                        <strong>Session Metrics:</strong>
                        {Object.keys(sessionMetrics).length === 0 && <div style={{ opacity: .5 }}>— vazio —</div>}
                        {Object.entries(sessionMetrics).map(([k, v]) => (
                            <div key={k}>{k}: {v}</div>
                        ))}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                        <strong>Últimas Métricas ({metrics.length}):</strong>
                        <div style={{ maxHeight: 120, overflow: 'auto' }}>
                            {metrics.slice(0, 25).map(m => (
                                <div key={m.id} style={{ borderBottom: '1px solid #222', padding: '2px 0' }}>
                                    <span style={{ color: '#5fd7ff' }}>{m.category}</span> {m.name} = {m.value}{m.unit} <span style={{ opacity: .5 }}>{new Date(m.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))}
                            {metrics.length === 0 && <div style={{ opacity: .5 }}>— sem métricas —</div>}
                        </div>
                    </div>
                    <div>
                        <strong>Eventos ({events.length}):</strong>
                        <div style={{ maxHeight: 120, overflow: 'auto' }}>
                            {events.map((e: any, idx) => (
                                <div key={idx} style={{ borderBottom: '1px solid #222', padding: '2px 0' }}>
                                    <span style={{ color: '#ffd75f' }}>{e.type}</span> <span style={{ opacity: .7 }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))}
                            {events.length === 0 && <div style={{ opacity: .5 }}>— sem eventos —</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDebugPanel;
