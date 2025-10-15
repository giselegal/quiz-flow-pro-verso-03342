/**
 * 🌐 LivePreviewProvider - Provider para Preview Real-Time via WebSocket
 * 
 * Gerencia conexões WebSocket para sincronização em tempo real entre
 * múltiplas instâncias do editor e preview.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface LivePreviewMessage {
    type: 'step-change' | 'step-update' | 'step-add' | 'step-delete' | 'sync-request' | 'sync-response';
    funnelId: string;
    stepId?: string;
    data?: any;
    timestamp: number;
    source: 'editor' | 'preview' | 'server';
}

export interface LivePreviewConnectionState {
    isConnected: boolean;
    isConnecting: boolean;
    connectionId?: string;
    lastMessage?: LivePreviewMessage;
    lastError?: string;
    reconnectAttempts: number;
    latency: number;
}

export interface LivePreviewContextValue {
    // Connection state
    connectionState: LivePreviewConnectionState;

    // Message sending
    sendMessage: (message: Omit<LivePreviewMessage, 'timestamp' | 'source'>) => void;
    broadcast: (type: LivePreviewMessage['type'], data: any, stepId?: string) => void;

    // Event listeners
    onMessage: (callback: (message: LivePreviewMessage) => void) => () => void;
    onStepChange: (callback: (stepId: string, data?: any) => void) => () => void;
    onStepUpdate: (callback: (stepId: string, data: any) => void) => () => void;

    // Connection control
    connect: (funnelId: string) => void;
    disconnect: () => void;
    reconnect: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const LivePreviewContext = createContext<LivePreviewContextValue | null>(null);

export function useLivePreview(): LivePreviewContextValue {
    const context = useContext(LivePreviewContext);
    if (!context) {
        throw new Error('useLivePreview must be used within a LivePreviewProvider');
    }
    return context;
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface LivePreviewProviderProps {
    children: React.ReactNode;
    websocketUrl?: string;
    autoReconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    enableHeartbeat?: boolean;
    heartbeatInterval?: number;
    enableDebug?: boolean;
}

export const LivePreviewProvider: React.FC<LivePreviewProviderProps> = ({
    children,
    websocketUrl,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    enableHeartbeat = true,
    heartbeatInterval = 30000,
    enableDebug = false
}) => {
    // ===== STATE =====
    const [connectionState, setConnectionState] = useState<LivePreviewConnectionState>({
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: 0,
        latency: 0
    });

    // ===== REFS =====
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const heartbeatTimeoutRef = useRef<NodeJS.Timeout>();
    const messageListenersRef = useRef<Set<(message: LivePreviewMessage) => void>>(new Set());
    const stepChangeListenersRef = useRef<Set<(stepId: string, data?: any) => void>>(new Set());
    const stepUpdateListenersRef = useRef<Set<(stepId: string, data: any) => void>>(new Set());
    const currentFunnelIdRef = useRef<string>('');
    const pingTimeRef = useRef<number>(0);

    // ===== WEBSOCKET URL GENERATION =====
    const getWebSocketUrl = useCallback((funnelId: string) => {
        if (websocketUrl) {
            return `${websocketUrl}?funnelId=${encodeURIComponent(funnelId)}`;
        }

        // Auto-generate WebSocket URL based on current location
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;
        const host = isDev ? `${location.hostname}:3001` : location.host;

        return `${protocol}//${host}/ws/live-preview?funnelId=${encodeURIComponent(funnelId)}`;
    }, [websocketUrl]);

    // ===== HEARTBEAT =====
    const startHeartbeat = useCallback(() => {
        if (!enableHeartbeat || !wsRef.current) return;

        const sendPing = () => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                pingTimeRef.current = Date.now();
                wsRef.current.send(JSON.stringify({
                    type: 'ping',
                    timestamp: pingTimeRef.current
                }));
            }
        };

        sendPing();
        heartbeatTimeoutRef.current = setInterval(sendPing, heartbeatInterval);
    }, [enableHeartbeat, heartbeatInterval]);

    const stopHeartbeat = useCallback(() => {
        if (heartbeatTimeoutRef.current) {
            clearInterval(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = undefined;
        }
    }, []);

    // ===== CONNECTION MANAGEMENT =====
    const connect = useCallback((funnelId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            if (enableDebug) {
                console.log('🌐 Already connected to WebSocket');
            }
            return;
        }

        currentFunnelIdRef.current = funnelId;

        setConnectionState(prev => ({
            ...prev,
            isConnecting: true,
            lastError: undefined
        }));

        try {
            const url = getWebSocketUrl(funnelId);

            if (enableDebug) {
                console.log('🌐 Connecting to WebSocket:', url);
            }

            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                setConnectionState(prev => ({
                    ...prev,
                    isConnected: true,
                    isConnecting: false,
                    reconnectAttempts: 0,
                    connectionId: `conn_${Date.now()}`
                }));

                startHeartbeat();

                if (enableDebug) {
                    console.log('🌐 WebSocket connected successfully');
                }
            };

            ws.onmessage = (event) => {
                try {
                    const rawMessage = JSON.parse(event.data);

                    // Handle pong responses
                    if (rawMessage.type === 'pong') {
                        const latency = Date.now() - pingTimeRef.current;
                        setConnectionState(prev => ({ ...prev, latency }));
                        return;
                    }

                    const message: LivePreviewMessage = {
                        ...rawMessage,
                        timestamp: rawMessage.timestamp || Date.now()
                    };

                    setConnectionState(prev => ({ ...prev, lastMessage: message }));

                    // Notify all message listeners
                    messageListenersRef.current.forEach(listener => {
                        try {
                            listener(message);
                        } catch (error) {
                            console.error('🌐 Message listener error:', error);
                        }
                    });

                    // Notify specific listeners
                    if (message.type === 'step-change' && message.stepId) {
                        stepChangeListenersRef.current.forEach(listener => {
                            try {
                                listener(message.stepId!, message.data);
                            } catch (error) {
                                console.error('🌐 Step change listener error:', error);
                            }
                        });
                    } else if (message.type === 'step-update' && message.stepId) {
                        stepUpdateListenersRef.current.forEach(listener => {
                            try {
                                listener(message.stepId!, message.data);
                            } catch (error) {
                                console.error('🌐 Step update listener error:', error);
                            }
                        });
                    }

                    if (enableDebug) {
                        console.log('🌐 Received message:', message);
                    }
                } catch (error) {
                    console.error('🌐 Failed to parse WebSocket message:', error);
                }
            };

            ws.onclose = (event) => {
                setConnectionState(prev => ({
                    ...prev,
                    isConnected: false,
                    isConnecting: false
                }));

                stopHeartbeat();

                if (enableDebug) {
                    console.log('🌐 WebSocket closed:', event.code, event.reason);
                }

                // Auto-reconnect if enabled
                if (autoReconnect && connectionState.reconnectAttempts < maxReconnectAttempts) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setConnectionState(prev => ({
                            ...prev,
                            reconnectAttempts: prev.reconnectAttempts + 1
                        }));

                        connect(currentFunnelIdRef.current);
                    }, reconnectInterval);
                }
            };

            ws.onerror = (error) => {
                setConnectionState(prev => ({
                    ...prev,
                    lastError: 'WebSocket connection error',
                    isConnecting: false
                }));

                if (enableDebug) {
                    console.error('🌐 WebSocket error:', error);
                }
            };

        } catch (error) {
            setConnectionState(prev => ({
                ...prev,
                isConnecting: false,
                lastError: error instanceof Error ? error.message : 'Unknown connection error'
            }));

            if (enableDebug) {
                console.error('🌐 Failed to create WebSocket connection:', error);
            }
        }
    }, [
        getWebSocketUrl,
        startHeartbeat,
        stopHeartbeat,
        autoReconnect,
        maxReconnectAttempts,
        reconnectInterval,
        enableDebug
    ]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = undefined;
        }

        stopHeartbeat();

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setConnectionState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
            connectionId: undefined
        }));

        if (enableDebug) {
            console.log('🌐 WebSocket disconnected');
        }
    }, [stopHeartbeat, enableDebug]);

    const reconnect = useCallback(() => {
        disconnect();
        setTimeout(() => {
            connect(currentFunnelIdRef.current);
        }, 100);
    }, [disconnect, connect]);

    // ===== MESSAGE SENDING =====
    const sendMessage = useCallback((message: Omit<LivePreviewMessage, 'timestamp' | 'source'>) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            if (enableDebug) {
                console.warn('🌐 Cannot send message: WebSocket not connected');
            }
            return;
        }

        const fullMessage: LivePreviewMessage = {
            ...message,
            timestamp: Date.now(),
            source: 'editor'
        };

        try {
            wsRef.current.send(JSON.stringify(fullMessage));

            if (enableDebug) {
                console.log('🌐 Sent message:', fullMessage);
            }
        } catch (error) {
            console.error('🌐 Failed to send message:', error);
        }
    }, [enableDebug]);

    const broadcast = useCallback((
        type: LivePreviewMessage['type'],
        data: any,
        stepId?: string
    ) => {
        sendMessage({
            type,
            funnelId: currentFunnelIdRef.current,
            stepId,
            data
        });
    }, [sendMessage]);

    // ===== EVENT LISTENERS =====
    const onMessage = useCallback((callback: (message: LivePreviewMessage) => void) => {
        messageListenersRef.current.add(callback);

        return () => {
            messageListenersRef.current.delete(callback);
        };
    }, []);

    const onStepChange = useCallback((callback: (stepId: string, data?: any) => void) => {
        stepChangeListenersRef.current.add(callback);

        return () => {
            stepChangeListenersRef.current.delete(callback);
        };
    }, []);

    const onStepUpdate = useCallback((callback: (stepId: string, data: any) => void) => {
        stepUpdateListenersRef.current.add(callback);

        return () => {
            stepUpdateListenersRef.current.delete(callback);
        };
    }, []);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    // ===== CONTEXT VALUE =====
    const contextValue: LivePreviewContextValue = {
        connectionState,
        sendMessage,
        broadcast,
        onMessage,
        onStepChange,
        onStepUpdate,
        connect,
        disconnect,
        reconnect
    };

    return (
        <LivePreviewContext.Provider value={contextValue}>
            {children}
        </LivePreviewContext.Provider>
    );
};

export default LivePreviewProvider;