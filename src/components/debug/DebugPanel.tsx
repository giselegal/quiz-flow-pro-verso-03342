import React, { useState, useCallback, useRef, useEffect } from 'react';
import { usePerformanceTest } from '../../hooks/usePerformanceTest';

/**
 * 🐛 DEBUG PANEL - DEBUGGING AVANÇADO EM DESENVOLVIMENTO
 * 
 * Painel completo para debugging e monitoramento em tempo real
 */

interface DebugPanelProps {
    /** Se o painel deve estar visível inicialmente */
    initialVisible?: boolean;

    /** Componente ou área sendo debuggada */
    component?: string;

    /** Se deve incluir monitoramento de performance */
    includePerformance?: boolean;

    /** Props customizadas para debug */
    debugData?: Record<string, any>;

    /** Callbacks para ações de debug */
    onAction?: (action: string, data?: any) => void;

    /** Posição do painel */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

    /** Se deve ser minimizável */
    minimizable?: boolean;

    /** Nível de debug */
    level?: 'basic' | 'advanced' | 'expert';
}

interface LogEntry {
    id: string;
    timestamp: number;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    data?: any;
    component?: string;
}

interface NetworkRequest {
    id: string;
    url: string;
    method: string;
    status?: number;
    duration?: number;
    timestamp: number;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
    initialVisible = false,
    component = 'App',
    includePerformance = true,
    debugData = {},
    // onAction, // Parâmetro não utilizado no momento
    position = 'bottom-right',
    minimizable = true,
    // level = 'advanced' // Parâmetro não utilizado no momento
}) => {

    // Estados
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeTab, setActiveTab] = useState<'logs' | 'performance' | 'network' | 'state' | 'storage'>('logs');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);
    const [autoScroll, setAutoScroll] = useState(true);

    // Performance monitoring
    const performanceTest = usePerformanceTest(component, {
        enabled: includePerformance && isVisible,
        onAlert: (alert) => {
            addLog('warn', `Performance Alert: ${alert.message}`, alert);
        }
    });

    // Refs
    const logsEndRef = useRef<HTMLDivElement>(null);

    // 📝 Adicionar log
    const addLog = (level: LogEntry['level'], message: string, data?: any) => {
        const newLog: LogEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            level,
            message,
            data,
            component
        };

        setLogs(prev => [...prev.slice(-99), newLog]); // Manter apenas os últimos 100 logs
    };

    // 🌐 Interceptar requisições de rede
    useEffect(() => {
        if (!isVisible) return;

        const originalFetch = window.fetch;
        let requestCounter = 0;

        window.fetch = async (...args) => {
            const requestId = `req_${++requestCounter}`;
            const url = args[0]?.toString() || 'unknown';
            const method = args[1]?.method || 'GET';
            const startTime = Date.now();

            const request: NetworkRequest = {
                id: requestId,
                url,
                method,
                timestamp: startTime
            };

            setNetworkRequests(prev => [...prev.slice(-49), request]);

            try {
                const response = await originalFetch(...args);
                const endTime = Date.now();

                setNetworkRequests(prev =>
                    prev.map(req =>
                        req.id === requestId
                            ? { ...req, status: response.status, duration: endTime - startTime }
                            : req
                    )
                );

                addLog('info', `Network: ${method} ${url} - ${response.status}`, {
                    url,
                    method,
                    status: response.status,
                    duration: endTime - startTime
                });

                return response;
            } catch (error) {
                const endTime = Date.now();

                setNetworkRequests(prev =>
                    prev.map(req =>
                        req.id === requestId
                            ? { ...req, status: 0, duration: endTime - startTime }
                            : req
                    )
                );

                addLog('error', `Network Error: ${method} ${url}`, { url, method, error: error.message });
                throw error;
            }
        };

        // Interceptar console logs
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            debug: console.debug
        };

        console.log = (...args) => {
            originalConsole.log(...args);
            addLog('info', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '), args);
        };

        console.warn = (...args) => {
            originalConsole.warn(...args);
            addLog('warn', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '), args);
        };

        console.error = (...args) => {
            originalConsole.error(...args);
            addLog('error', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '), args);
        };

        console.debug = (...args) => {
            originalConsole.debug(...args);
            addLog('debug', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '), args);
        };

        return () => {
            window.fetch = originalFetch;
            console.log = originalConsole.log;
            console.warn = originalConsole.warn;
            console.error = originalConsole.error;
            console.debug = originalConsole.debug;
        };
    }, [isVisible, component]);

    // Auto scroll para logs
    useEffect(() => {
        if (autoScroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, autoScroll]);

    // Iniciar performance test
    useEffect(() => {
        if (includePerformance && isVisible) {
            performanceTest.startTest();
            return () => performanceTest.stopTest();
        }
    }, [includePerformance, isVisible, performanceTest]);

    // 🎨 Renderização do painel
    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="debug-toggle-button"
                style={{
                    position: 'fixed',
                    [position.includes('top') ? 'top' : 'bottom']: '10px',
                    [position.includes('left') ? 'left' : 'right']: '10px',
                    zIndex: 10000,
                    background: '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    cursor: 'pointer',
                    fontSize: '18px'
                }}
            >
                🐛
            </button>
        );
    }

    const panelStyle: React.CSSProperties = {
        position: 'fixed',
        [position.includes('top') ? 'top' : 'bottom']: '10px',
        [position.includes('left') ? 'left' : 'right']: '10px',
        width: isMinimized ? '300px' : '500px',
        height: isMinimized ? '40px' : '400px',
        background: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        zIndex: 10000,
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        resize: 'both'
    };

    return (
        <div style={panelStyle}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid #374151',
                background: '#111827',
                userSelect: 'none'
            }}>
                <span style={{ fontWeight: 'bold' }}>
                    🐛 Debug Panel - {component}
                </span>
                <div>
                    {minimizable && (
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                marginRight: '8px'
                            }}
                        >
                            {isMinimized ? '🔼' : '🔽'}
                        </button>
                    )}
                    <button
                        onClick={() => setIsVisible(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isMinimized && (
                <>
                    {/* Tabs */}
                    <div style={{
                        display: 'flex',
                        background: '#111827',
                        borderBottom: '1px solid #374151'
                    }}>
                        {['logs', 'performance', 'network', 'state', 'storage'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                style={{
                                    background: activeTab === tab ? '#374151' : 'none',
                                    border: 'none',
                                    color: activeTab === tab ? '#f3f4f6' : '#9ca3af',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    fontSize: '11px'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                        {activeTab === 'logs' && (
                            <div>
                                <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button
                                        onClick={() => setLogs([])}
                                        style={{
                                            background: '#374151',
                                            border: 'none',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '10px'
                                        }}
                                    >
                                        Clear
                                    </button>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                                        <input
                                            type="checkbox"
                                            checked={autoScroll}
                                            onChange={(e) => setAutoScroll(e.target.checked)}
                                        />
                                        Auto Scroll
                                    </label>
                                </div>

                                {logs.map(log => (
                                    <div
                                        key={log.id}
                                        style={{
                                            padding: '4px 8px',
                                            marginBottom: '2px',
                                            borderLeft: `3px solid ${log.level === 'error' ? '#ef4444' :
                                                    log.level === 'warn' ? '#f59e0b' :
                                                        log.level === 'debug' ? '#8b5cf6' : '#10b981'
                                                }`,
                                            background: '#374151',
                                            borderRadius: '0 4px 4px 0',
                                            fontSize: '10px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                            <span style={{ color: '#9ca3af' }}>
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                            <span style={{
                                                color: log.level === 'error' ? '#ef4444' :
                                                    log.level === 'warn' ? '#f59e0b' :
                                                        log.level === 'debug' ? '#8b5cf6' : '#10b981',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}>
                                                {log.level}
                                            </span>
                                        </div>
                                        <div>{log.message}</div>
                                        {log.data && (
                                            <details style={{ marginTop: '4px', fontSize: '9px' }}>
                                                <summary style={{ cursor: 'pointer', color: '#9ca3af' }}>Data</summary>
                                                <pre style={{ background: '#111827', padding: '4px', borderRadius: '2px', marginTop: '2px' }}>
                                                    {JSON.stringify(log.data, null, 2)}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        )}

                        {activeTab === 'performance' && includePerformance && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                                    <div style={{ background: '#374151', padding: '8px', borderRadius: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>Render Time</div>
                                        <div style={{ fontSize: '14px', color: performanceTest.metrics.renderTime > 100 ? '#ef4444' : '#10b981' }}>
                                            {performanceTest.metrics.renderTime.toFixed(2)}ms
                                        </div>
                                    </div>
                                    <div style={{ background: '#374151', padding: '8px', borderRadius: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>Memory Usage</div>
                                        <div style={{ fontSize: '14px', color: performanceTest.metrics.memoryUsage > 70 ? '#ef4444' : '#10b981' }}>
                                            {performanceTest.metrics.memoryUsage.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div style={{ background: '#374151', padding: '8px', borderRadius: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>Re-renders</div>
                                        <div style={{ fontSize: '14px' }}>
                                            {performanceTest.metrics.reRenderCount}
                                        </div>
                                    </div>
                                    <div style={{ background: '#374151', padding: '8px', borderRadius: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>Network Latency</div>
                                        <div style={{ fontSize: '14px', color: performanceTest.metrics.networkLatency > 300 ? '#ef4444' : '#10b981' }}>
                                            {performanceTest.metrics.networkLatency.toFixed(0)}ms
                                        </div>
                                    </div>
                                </div>

                                {performanceTest.alerts.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>Alerts</div>
                                        {performanceTest.alerts.slice(-5).map(alert => (
                                            <div
                                                key={alert.timestamp}
                                                style={{
                                                    background: alert.type === 'critical' ? '#7f1d1d' : '#92400e',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    marginBottom: '2px',
                                                    fontSize: '10px'
                                                }}
                                            >
                                                {alert.message}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'network' && (
                            <div>
                                <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '8px' }}>
                                    Recent Requests ({networkRequests.length})
                                </div>
                                {networkRequests.slice(-20).reverse().map(request => (
                                    <div
                                        key={request.id}
                                        style={{
                                            background: '#374151',
                                            padding: '6px 8px',
                                            marginBottom: '2px',
                                            borderRadius: '4px',
                                            fontSize: '10px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                color: request.status === undefined ? '#9ca3af' :
                                                    request.status >= 400 ? '#ef4444' :
                                                        request.status >= 300 ? '#f59e0b' : '#10b981'
                                            }}>
                                                {request.method}
                                            </span>
                                            <span style={{
                                                background: request.status === undefined ? '#6b7280' :
                                                    request.status >= 400 ? '#7f1d1d' :
                                                        request.status >= 300 ? '#92400e' : '#065f46',
                                                padding: '2px 6px',
                                                borderRadius: '2px',
                                                fontSize: '9px'
                                            }}>
                                                {request.status || 'PENDING'}
                                            </span>
                                        </div>
                                        <div style={{ color: '#d1d5db', marginTop: '2px' }}>
                                            {request.url.length > 50 ? `${request.url.substring(0, 50)}...` : request.url}
                                        </div>
                                        {request.duration && (
                                            <div style={{ color: '#9ca3af', fontSize: '9px', marginTop: '2px' }}>
                                                {request.duration}ms
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'state' && (
                            <div>
                                <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '8px' }}>
                                    Debug Data
                                </div>
                                <pre style={{
                                    background: '#111827',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    overflow: 'auto'
                                }}>
                                    {JSON.stringify({ ...debugData, performanceMetrics: performanceTest.metrics }, null, 2)}
                                </pre>
                            </div>
                        )}

                        {activeTab === 'storage' && (
                            <div>
                                <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '8px' }}>
                                    Storage Information
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ background: '#374151', padding: '8px', borderRadius: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>LocalStorage</div>
                                        <div style={{ fontSize: '11px' }}>{Object.keys(localStorage).length} items</div>
                                    </div>
                                    <div style={{ background: '#374151', padding: '8px', borderRadius: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>SessionStorage</div>
                                        <div style={{ fontSize: '11px' }}>{Object.keys(sessionStorage).length} items</div>
                                    </div>
                                    <div style={{ background: '#374151', padding: '8px', borderRadius: '4px' }}>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>Cookies</div>
                                        <div style={{ fontSize: '11px' }}>{document.cookie.split(';').length} items</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DebugPanel;