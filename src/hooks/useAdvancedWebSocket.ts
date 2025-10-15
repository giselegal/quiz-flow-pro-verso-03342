/**
 * 🔄 ADVANCED WEBSOCKET SYSTEM - Sistema WebSocket Avançado
 * 
 * Sistema robusto de WebSocket com reconexão automática, rate limiting,
 * compressão de dados e sincronização multi-usuário em tempo real.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface WebSocketConfig {
    url: string;
    reconnectInterval: number;    // ms
    maxReconnectAttempts: number;
    heartbeatInterval: number;    // ms
    messageTimeout: number;       // ms
    enableCompression: boolean;
    rateLimit: {
        maxMessages: number;
        windowMs: number;
    };
    debug: boolean;
}

interface WebSocketMessage {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
    userId?: string;
    sessionId?: string;
    compressed?: boolean;
}

interface WebSocketState {
    isConnected: boolean;
    isConnecting: boolean;
    reconnectAttempts: number;
    lastError: string | null;
    messageQueue: WebSocketMessage[];
    latency: number;
}

interface SyncData {
    funnelId: string;
    stepId: string;
    data: any;
    operation: 'update' | 'create' | 'delete' | 'select';
    timestamp: number;
    userId: string;
}

// ============================================================================
// MESSAGE COMPRESSOR
// ============================================================================

class MessageCompressor {
    static compress(data: any): string {
        try {
            const jsonString = JSON.stringify(data);
            
            // Simple compression usando repetition encoding
            return jsonString.replace(/(.)\1+/g, (match, char) => {
                return `${char}*${match.length}`;
            });
        } catch (error) {
            console.warn('Compression failed:', error);
            return JSON.stringify(data);
        }
    }
    
    static decompress(compressedData: string): any {
        try {
            // Decompress repetition encoding
            const decompressed = compressedData.replace(/(.)\*(\d+)/g, (match, char, count) => {
                return char.repeat(parseInt(count));
            });
            
            return JSON.parse(decompressed);
        } catch (error) {
            console.warn('Decompression failed:', error);
            return JSON.parse(compressedData);
        }
    }
    
    static shouldCompress(data: any): boolean {
        const jsonString = JSON.stringify(data);
        return jsonString.length > 1000; // Comprimir se > 1KB
    }
}

// ============================================================================
// RATE LIMITER
// ============================================================================

class RateLimiter {
    private timestamps: number[] = [];
    private maxMessages: number;
    private windowMs: number;
    
    constructor(maxMessages: number, windowMs: number) {
        this.maxMessages = maxMessages;
        this.windowMs = windowMs;
    }
    
    canSend(): boolean {
        const now = Date.now();
        
        // Remove timestamps antigas
        this.timestamps = this.timestamps.filter(
            timestamp => now - timestamp < this.windowMs
        );
        
        return this.timestamps.length < this.maxMessages;
    }
    
    recordMessage(): void {
        this.timestamps.push(Date.now());
    }
    
    getStats(): { count: number; remaining: number } {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(
            timestamp => now - timestamp < this.windowMs
        );
        
        return {
            count: this.timestamps.length,
            remaining: this.maxMessages - this.timestamps.length
        };
    }
}

// ============================================================================
// ADVANCED WEBSOCKET CLASS
// ============================================================================

class AdvancedWebSocket {
    private ws: WebSocket | null = null;
    private config: WebSocketConfig;
    private state: WebSocketState;
    private rateLimiter: RateLimiter;
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private messageCallbacks: Map<string, (message: WebSocketMessage) => void> = new Map();
    private eventListeners: Map<string, Set<Function>> = new Map();
    
    constructor(config: Partial<WebSocketConfig> = {}) {
        this.config = {
            url: 'wss://localhost:8080/ws',
            reconnectInterval: 3000,
            maxReconnectAttempts: 10,
            heartbeatInterval: 30000,
            messageTimeout: 5000,
            enableCompression: true,
            rateLimit: {
                maxMessages: 100,
                windowMs: 60000 // 1 minuto
            },
            debug: process.env.NODE_ENV === 'development',
            ...config
        };
        
        this.state = {
            isConnected: false,
            isConnecting: false,
            reconnectAttempts: 0,
            lastError: null,
            messageQueue: [],
            latency: 0
        };
        
        this.rateLimiter = new RateLimiter(
            this.config.rateLimit.maxMessages,
            this.config.rateLimit.windowMs
        );
    }
    
    // ===== CONNECTION METHODS =====
    
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.state.isConnected || this.state.isConnecting) {
                resolve();
                return;
            }
            
            this.state.isConnecting = true;
            this.log('Connecting to WebSocket...');
            
            try {
                this.ws = new WebSocket(this.config.url);
                
                this.ws.onopen = () => {
                    this.handleOpen();
                    resolve();
                };
                
                this.ws.onmessage = this.handleMessage.bind(this);
                this.ws.onclose = this.handleClose.bind(this);
                this.ws.onerror = (error) => {
                    this.handleError(error);
                    reject(error);
                };
                
                // Timeout para conexão
                setTimeout(() => {
                    if (!this.state.isConnected) {
                        reject(new Error('Connection timeout'));
                    }
                }, this.config.messageTimeout);
                
            } catch (error) {
                this.state.isConnecting = false;
                this.state.lastError = error instanceof Error ? error.message : 'Connection failed';
                reject(error);
            }
        });
    }
    
    disconnect(): void {
        this.log('Disconnecting WebSocket...');
        
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        if (this.ws) {
            this.ws.close(1000, 'Manual disconnect');
            this.ws = null;
        }
        
        this.state.isConnected = false;
        this.state.isConnecting = false;
        this.emit('disconnected');
    }
    
    // ===== EVENT HANDLERS =====
    
    private handleOpen(): void {
        this.log('WebSocket connected');
        
        this.state.isConnected = true;
        this.state.isConnecting = false;
        this.state.reconnectAttempts = 0;
        this.state.lastError = null;
        
        this.startHeartbeat();
        this.processMessageQueue();
        this.emit('connected');
    }
    
    private handleMessage(event: MessageEvent): void {
        try {
            let messageData = event.data;
            
            // Tentar decodificar como JSON
            if (typeof messageData === 'string') {
                messageData = JSON.parse(messageData);
            }
            
            // Verificar se é mensagem comprimida
            if (messageData.compressed && this.config.enableCompression) {
                messageData.payload = MessageCompressor.decompress(messageData.payload);
            }
            
            const message: WebSocketMessage = messageData;
            
            this.log('Received message:', message.type);
            
            // Calcular latency se for resposta de ping
            if (message.type === 'pong') {
                this.state.latency = Date.now() - message.timestamp;
                return;
            }
            
            // Executar callback específico
            const callback = this.messageCallbacks.get(message.id);
            if (callback) {
                callback(message);
                this.messageCallbacks.delete(message.id);
                return;
            }
            
            // Emitir evento genérico
            this.emit('message', message);
            this.emit(`message:${message.type}`, message);
            
        } catch (error) {
            this.log('Error parsing message:', error);
            this.state.lastError = 'Failed to parse message';
        }
    }
    
    private handleClose(event: CloseEvent): void {
        this.log('WebSocket closed:', event.code, event.reason);
        
        this.state.isConnected = false;
        this.state.isConnecting = false;
        
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        
        // Reconectar automaticamente se não foi fechamento manual
        if (event.code !== 1000 && this.state.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
        }
        
        this.emit('disconnected', event);
    }
    
    private handleError(error: Event): void {
        this.log('WebSocket error:', error);
        this.state.lastError = 'WebSocket error occurred';
        this.emit('error', error);
    }
    
    // ===== MESSAGE METHODS =====
    
    send(type: string, payload: any, options: {
        expectResponse?: boolean;
        timeout?: number;
        userId?: string;
        sessionId?: string;
    } = {}): Promise<WebSocketMessage | void> {
        return new Promise((resolve, reject) => {
            if (!this.state.isConnected) {
                this.queueMessage(type, payload, options);
                resolve();
                return;
            }
            
            if (!this.rateLimiter.canSend()) {
                reject(new Error('Rate limit exceeded'));
                return;
            }
            
            const messageId = this.generateMessageId();
            const message: WebSocketMessage = {
                id: messageId,
                type,
                payload,
                timestamp: Date.now(),
                userId: options.userId,
                sessionId: options.sessionId
            };
            
            // Comprimir se necessário
            if (this.config.enableCompression && MessageCompressor.shouldCompress(payload)) {
                message.payload = MessageCompressor.compress(payload);
                message.compressed = true;
            }
            
            try {
                this.ws!.send(JSON.stringify(message));
                this.rateLimiter.recordMessage();
                this.log('Sent message:', type);
                
                // Configurar callback para resposta
                if (options.expectResponse) {
                    const timeout = options.timeout || this.config.messageTimeout;
                    
                    const timeoutId = setTimeout(() => {
                        this.messageCallbacks.delete(messageId);
                        reject(new Error('Message timeout'));
                    }, timeout);
                    
                    this.messageCallbacks.set(messageId, (response) => {
                        clearTimeout(timeoutId);
                        resolve(response);
                    });
                } else {
                    resolve();
                }
                
            } catch (error) {
                this.log('Error sending message:', error);
                reject(error);
            }
        });
    }
    
    private queueMessage(type: string, payload: any, options: any): void {
        const message: WebSocketMessage = {
            id: this.generateMessageId(),
            type,
            payload,
            timestamp: Date.now(),
            userId: options.userId,
            sessionId: options.sessionId
        };
        
        this.state.messageQueue.push(message);
        this.log('Message queued:', type);
        
        // Limitar tamanho da fila
        if (this.state.messageQueue.length > 100) {
            this.state.messageQueue = this.state.messageQueue.slice(-100);
        }
    }
    
    private processMessageQueue(): void {
        this.log(`Processing ${this.state.messageQueue.length} queued messages`);
        
        const queue = [...this.state.messageQueue];
        this.state.messageQueue = [];
        
        queue.forEach(message => {
            this.send(message.type, message.payload, {
                userId: message.userId,
                sessionId: message.sessionId
            }).catch(error => {
                this.log('Error sending queued message:', error);
            });
        });
    }
    
    // ===== HEARTBEAT =====
    
    private startHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
        }
        
        this.heartbeatTimer = setInterval(() => {
            this.send('ping', { timestamp: Date.now() })
                .catch(() => {
                    this.log('Heartbeat failed');
                });
        }, this.config.heartbeatInterval);
    }
    
    // ===== RECONNECTION =====
    
    private scheduleReconnect(): void {
        this.state.reconnectAttempts++;
        
        const delay = Math.min(
            this.config.reconnectInterval * Math.pow(2, this.state.reconnectAttempts - 1),
            30000 // Max 30 segundos
        );
        
        this.log(`Reconnecting in ${delay}ms (attempt ${this.state.reconnectAttempts})`);
        
        this.reconnectTimer = setTimeout(() => {
            this.connect().catch(() => {
                // Tentativa falhou, próxima será agendada pelo handleClose
            });
        }, delay);
    }
    
    // ===== EVENT SYSTEM =====
    
    on(event: string, callback: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event)!.add(callback);
    }
    
    off(event: string, callback: Function): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }
    
    private emit(event: string, ...args: any[]): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    this.log('Event listener error:', error);
                }
            });
        }
    }
    
    // ===== UTILITY METHODS =====
    
    private generateMessageId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private log(...args: any[]): void {
        if (this.config.debug) {
            console.log('[WebSocket]', ...args);
        }
    }
    
    // ===== PUBLIC GETTERS =====
    
    getState(): WebSocketState {
        return { ...this.state };
    }
    
    getConfig(): WebSocketConfig {
        return { ...this.config };
    }
    
    getRateLimitStats() {
        return this.rateLimiter.getStats();
    }
}

// ============================================================================
// REACT HOOK
// ============================================================================

export const useAdvancedWebSocket = (
    config: Partial<WebSocketConfig> = {}
) => {
    const wsRef = useRef<AdvancedWebSocket>();
    const [state, setState] = useState<WebSocketState>({
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: 0,
        lastError: null,
        messageQueue: [],
        latency: 0
    });
    
    // Inicializar WebSocket
    useEffect(() => {
        if (!wsRef.current) {
            wsRef.current = new AdvancedWebSocket(config);
            
            // Event listeners
            wsRef.current.on('connected', () => {
                setState(wsRef.current!.getState());
            });
            
            wsRef.current.on('disconnected', () => {
                setState(wsRef.current!.getState());
            });
            
            wsRef.current.on('error', () => {
                setState(wsRef.current!.getState());
            });
        }
        
        return () => {
            wsRef.current?.disconnect();
        };
    }, []);
    
    const connect = useCallback(() => {
        return wsRef.current?.connect() || Promise.resolve();
    }, []);
    
    const disconnect = useCallback(() => {
        wsRef.current?.disconnect();
    }, []);
    
    const send = useCallback((
        type: string, 
        payload: any, 
        options?: Parameters<AdvancedWebSocket['send']>[2]
    ) => {
        return wsRef.current?.send(type, payload, options) || Promise.resolve();
    }, []);
    
    const subscribe = useCallback((event: string, callback: Function) => {
        wsRef.current?.on(event, callback);
        
        return () => {
            wsRef.current?.off(event, callback);
        };
    }, []);
    
    return {
        state,
        connect,
        disconnect,
        send,
        subscribe,
        getRateLimitStats: () => wsRef.current?.getRateLimitStats()
    };
};

// ============================================================================
// SYNC HOOKS
// ============================================================================

export const useRealtimeSync = (
    funnelId: string,
    userId: string,
    onDataChange?: (data: SyncData) => void
) => {
    const { state, send, subscribe } = useAdvancedWebSocket({
        url: `wss://localhost:8080/sync/${funnelId}`
    });
    
    // Subscribe to sync updates
    useEffect(() => {
        const unsubscribe = subscribe('message:sync_update', (message: WebSocketMessage) => {
            const syncData: SyncData = message.payload;
            
            // Ignorar updates do próprio usuário
            if (syncData.userId === userId) return;
            
            onDataChange?.(syncData);
        });
        
        return unsubscribe;
    }, [subscribe, userId, onDataChange]);
    
    const syncUpdate = useCallback((
        stepId: string,
        data: any,
        operation: SyncData['operation'] = 'update'
    ) => {
        const syncData: SyncData = {
            funnelId,
            stepId,
            data,
            operation,
            timestamp: Date.now(),
            userId
        };
        
        return send('sync_update', syncData);
    }, [funnelId, userId, send]);
    
    const syncSelect = useCallback((stepId: string) => {
        return syncUpdate(stepId, { selected: true }, 'select');
    }, [syncUpdate]);
    
    return {
        isConnected: state.isConnected,
        syncUpdate,
        syncSelect,
        latency: state.latency
    };
};

export default AdvancedWebSocket;