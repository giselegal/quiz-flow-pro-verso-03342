/**
 * WebSocket Console Optimizer
 * Controla reconexões de websocket e filtra spam de console
 */

// Configurações de otimização
const WEBSOCKET_CONFIG = {
  // Filtrar logs de websocket
  filterWebSocketLogs: true,
  // Debounce para reconexões
  reconnectDebounce: 3000,
  // Máximo de tentativas de reconexão por minuto
  maxReconnectAttempts: 10,
  // Intervalo para resetar contador de tentativas
  resetAttemptsInterval: 60000, // 1 minuto
  // Logs permitidos
  allowedLogs: ['error', 'warn'],
  // Padrões de logs a filtrar
  filteredPatterns: [
    'devserver_websocket_open',
    'devserver_websocket_close',
    'WebSocket connection',
    'HMR connection'
  ]
};

class WebSocketOptimizer {
  private originalConsole: {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
  };
  private reconnectAttempts: number = 0;
  private lastReconnectTime: number = 0;
  private resetAttemptsTimeout: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private lastWebSocketLog: string | null = null;
  private webSocketLogCount: number = 0;

  constructor() {
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
    this.initializeOptimization();
    this.setupWebSocketMonitoring();
  }

  private initializeOptimization() {
    // Interceptar console.log
    console.log = (...args: any[]) => {
      if (this.shouldFilterLog(args)) {
        return;
      }
      this.originalConsole.log(...args);
    };

    // Interceptar console.warn
    console.warn = (...args: any[]) => {
      if (this.shouldFilterLog(args)) {
        return;
      }
      this.originalConsole.warn(...args);
    };

    // Interceptar console.error
    console.error = (...args: any[]) => {
      if (this.shouldFilterLog(args)) {
        return;
      }
      this.originalConsole.error(...args);
    };
  }

  private shouldFilterLog(args: any[]): boolean {
    const message = args.join(' ');

    // Filtrar logs de websocket repetitivos
    if (WEBSOCKET_CONFIG.filterWebSocketLogs) {
      for (const pattern of WEBSOCKET_CONFIG.filteredPatterns) {
        if (message.includes(pattern)) {
          return this.handleWebSocketLog(message);
        }
      }
    }

    return false;
  }

  private handleWebSocketLog(message: string): boolean {
    const now = Date.now();

    // Se é o mesmo log e foi recente, incrementar contador
    if (this.lastWebSocketLog === message) {
      this.webSocketLogCount++;
      
      // Se muitos logs iguais, filtrar
      if (this.webSocketLogCount > 5) {
        return true;
      }
    } else {
      // Novo tipo de log, resetar contador
      this.lastWebSocketLog = message;
      this.webSocketLogCount = 1;
    }

    // Permitir alguns logs para debug
    if (this.webSocketLogCount <= 3) {
      return false;
    }

    return true;
  }

  private setupWebSocketMonitoring() {
    // Monitorar reconexões de websocket
    if (typeof window !== 'undefined') {
      this.monitorWebSocketReconnections();
    }
  }

  private monitorWebSocketReconnections() {
    const now = Date.now();
    
    // Resetar contador de tentativas se passou do intervalo
    if (now - this.lastReconnectTime > WEBSOCKET_CONFIG.resetAttemptsInterval) {
      this.reconnectAttempts = 0;
    }

    // Se muitas tentativas, aplicar debounce
    if (this.reconnectAttempts >= WEBSOCKET_CONFIG.maxReconnectAttempts) {
      if (!this.reconnectTimeout) {
        this.reconnectTimeout = setTimeout(() => {
          this.reconnectAttempts = 0;
          this.reconnectTimeout = null;
        }, WEBSOCKET_CONFIG.reconnectDebounce);
      }
      return;
    }

    this.reconnectAttempts++;
    this.lastReconnectTime = now;

    // Configurar reset automático
    if (this.resetAttemptsTimeout) {
      clearTimeout(this.resetAttemptsTimeout);
    }
    
    this.resetAttemptsTimeout = setTimeout(() => {
      this.reconnectAttempts = 0;
    }, WEBSOCKET_CONFIG.resetAttemptsInterval);
  }

  // Método para restaurar console original
  public restoreConsole() {
    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
  }

  // Método para configurar WebSocket com otimizações
  public configureWebSocket(websocket: WebSocket) {
    if (!websocket) return;

    const originalOnOpen = websocket.onopen;
    const originalOnClose = websocket.onclose;
    const originalOnError = websocket.onerror;

    // Otimizar eventos de abertura
    websocket.onopen = (event) => {
      this.monitorWebSocketReconnections();
      if (originalOnOpen) {
        originalOnOpen.call(websocket, event);
      }
    };

    // Otimizar eventos de fechamento
    websocket.onclose = (event) => {
      this.monitorWebSocketReconnections();
      if (originalOnClose) {
        originalOnClose.call(websocket, event);
      }
    };

    // Otimizar eventos de erro
    websocket.onerror = (event) => {
      this.monitorWebSocketReconnections();
      if (originalOnError) {
        originalOnError.call(websocket, event);
      }
    };
  }

  // Método para obter estatísticas
  public getStats() {
    return {
      reconnectAttempts: this.reconnectAttempts,
      lastReconnectTime: this.lastReconnectTime,
      webSocketLogCount: this.webSocketLogCount,
      lastWebSocketLog: this.lastWebSocketLog
    };
  }

  // Método para resetar estatísticas
  public resetStats() {
    this.reconnectAttempts = 0;
    this.lastReconnectTime = 0;
    this.webSocketLogCount = 0;
    this.lastWebSocketLog = null;
  }
}

// Instância global do otimizador
export const websocketOptimizer = new WebSocketOptimizer();

// Função para inicializar otimizações
export const initializeWebSocketOptimization = () => {
  console.log('🔧 WebSocket Optimizer: Filtros aplicados');
  
  // Configurar WebSocket se disponível
  if (typeof window !== 'undefined' && window.WebSocket) {
    const originalWebSocket = window.WebSocket;
    window.WebSocket = class extends originalWebSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);
        websocketOptimizer.configureWebSocket(this);
      }
    };
  }
};

// Função para limpar otimizações
export const cleanupWebSocketOptimization = () => {
  websocketOptimizer.restoreConsole();
  console.log('🔧 WebSocket Optimizer: Filtros removidos');
};

// Auto-inicializar em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  initializeWebSocketOptimization();
}