import React from 'react';
import { logger, type LogLevel } from '@/core/logging/StructuredLogger';
import { eventBus } from '@/core/events/eventBus';

interface LogItem {
    id: string;
    ts: number;
    level: LogLevel;
    message: string;
    scope?: string;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const levelColor: Record<LogLevel, string> = {
    debug: '#6B7280',
    info: '#2563EB',
    success: '#059669',
    warn: '#D97706',
    error: '#DC2626'
};

export default function LogConsoleOverlay() {
    const [open, setOpen] = React.useState(false);
    const [logs, setLogs] = React.useState<LogItem[]>([]);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const unsub = eventBus.subscribe<any>('log.event', (evt) => {
            setLogs(prev => {
                const next = [...prev, {
                    id: `${evt.ts}-${prev.length}`,
                    ts: evt.ts,
                    level: evt.level,
                    message: evt.message,
                    scope: evt.scope,
                    data: evt.data
                }];
                return next.slice(-300); // manter últimos 300
            });
        });
        return () => { unsub(); };
    }, []);

    React.useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div style={{ position: 'fixed', bottom: 8, right: 8, zIndex: 9999, fontFamily: 'monospace' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    background: '#111827', color: 'white', padding: '6px 10px', borderRadius: 6,
                    fontSize: 12, border: '1px solid #374151', cursor: 'pointer'
                }}
                title="Mostrar/Ocultar console de logs"
            >{open ? 'Fechar Logs' : 'Logs'}</button>
            {open && (
                <div
                    style={{
                        marginTop: 6,
                        width: 420,
                        maxHeight: 320,
                        background: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div style={{ padding: '6px 10px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 12 }}>Console de Logs</strong>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => setLogs([])}
                                style={{ background: '#374151', color: '#F3F4F6', fontSize: 11, padding: '2px 6px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                            >Limpar</button>
                            <button
                                onClick={() => logger.info('Teste de log manual', { foo: 'bar' }, 'Overlay')}
                                style={{ background: '#2563EB', color: '#F3F4F6', fontSize: 11, padding: '2px 6px', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                            >Teste</button>
                        </div>
                    </div>
                    <div ref={containerRef} style={{ overflowY: 'auto', flex: 1, fontSize: 11, padding: 8 }}>
                        {logs.map(l => (
                            <div key={l.id} style={{ marginBottom: 4, lineHeight: 1.2 }}>
                                <span style={{ color: '#9CA3AF' }}>{new Date(l.ts).toLocaleTimeString()}</span>
                                <span style={{ color: levelColor[l.level], marginLeft: 4, fontWeight: 600 }}>{l.level.toUpperCase()}</span>
                                {l.scope && <span style={{ color: '#F59E0B', marginLeft: 4 }}>[{l.scope}]</span>}
                                <span style={{ color: '#E5E7EB', marginLeft: 4 }}>{l.message}</span>
                                {l.data && <pre style={{ margin: '2px 0 0 0', background: '#111827', padding: 4, borderRadius: 4, color: '#D1D5DB', whiteSpace: 'pre-wrap' }}>{JSON.stringify(l.data, null, 2)}</pre>}
                            </div>
                        ))}
                        {logs.length === 0 && <div style={{ color: '#6B7280' }}>Sem logs.</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
