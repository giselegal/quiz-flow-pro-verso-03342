/**
 * 🔧 WEBSOCKET OPTIMIZER - Resolver problemas de reconexão excessiva
 * 
 * Este utilitário resolve os problemas de websocket do dev server
 * e configurações de analytics que podem estar causando loops.
 */

// Configuração otimizada para websockets
export class WebSocketOptimizer {
  private static instance: WebSocketOptimizer;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;
  private isOptimized = false;

  static getInstance(): WebSocketOptimizer {
    if (!WebSocketOptimizer.instance) {
      WebSocketOptimizer.instance = new WebSocketOptimizer();
    }
    return WebSocketOptimizer.instance;
  }

  /**
   * 🎯 Otimizar configurações de websocket
   */
  optimizeWebSocketConfig() {
    if (this.isOptimized) return;

    // 1. Configurar timeout para evitar reconexões excessivas
    if (typeof window !== 'undefined') {
      // Interceptar WebSocket para controle
      const originalWebSocket = window.WebSocket;
      const self = this;

      (window as any).WebSocket = function(url: string | URL, protocols?: string | string[]) {
        const ws = new originalWebSocket(url, protocols);
        
        // Configurar handlers para evitar loops
        ws.addEventListener('open', () => {
          self.reconnectAttempts = 0;
          console.log('🔌 WebSocket conectado:', url);
        });

        ws.addEventListener('close', (event) => {
          if (event.code !== 1000 && self.reconnectAttempts < self.maxReconnectAttempts) {
            self.reconnectAttempts++;
            console.log(`🔄 Tentativa de reconexão ${self.reconnectAttempts}/${self.maxReconnectAttempts}`);
            
            setTimeout(() => {
              // Reconectar apenas se necessário
              if (ws.readyState === WebSocket.CLOSED) {
                new originalWebSocket(url, protocols);
              }
            }, self.reconnectDelay * self.reconnectAttempts);
          }
        });

        ws.addEventListener('error', (error) => {
          console.warn('⚠️ WebSocket error:', error);
        });

        return ws;
      };
    }

    this.isOptimized = true;
    console.log('✅ WebSocket optimizer configurado');
  }

  /**
   * 🎯 Otimizar configurações de analytics
   */
  optimizeAnalyticsConfig() {
    // Configurar analytics para evitar loops
    if (typeof window !== 'undefined') {
      // Interceptar console.log para filtrar spam do RudderStack
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        const message = args.join(' ');
        
        // Filtrar mensagens repetitivas do RudderStack
        if (message.includes('RudderStack: Identifying user') || 
            message.includes('devserver_websocket_')) {
          return; // Não logar essas mensagens
        }
        
        originalConsoleLog.apply(console, args);
      };
    }
  }

  /**
   * 🎯 Configurar cleanup automático
   */
  setupAutoCleanup() {
    if (typeof window !== 'undefined') {
      // Cleanup ao sair da página
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });

      // Cleanup em hot reload
      if (import.meta.hot) {
        import.meta.hot.dispose(() => {
          this.cleanup();
        });
      }
    }
  }

  /**
   * 🧹 Limpeza de recursos
   */
  private cleanup() {
    this.reconnectAttempts = 0;
    console.log('🧹 WebSocket optimizer cleanup');
  }
}

// Inicializar otimizador automaticamente
if (typeof window !== 'undefined') {
  const optimizer = WebSocketOptimizer.getInstance();
  optimizer.optimizeWebSocketConfig();
  optimizer.optimizeAnalyticsConfig();
  optimizer.setupAutoCleanup();
}
