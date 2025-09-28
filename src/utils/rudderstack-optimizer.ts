/**
 * RudderStack Console Optimizer
 * Filtra spam de console do RudderStack e otimiza identificação de usuários
 */

// Configurações de otimização
const RUDDERSTACK_CONFIG = {
  // Filtrar logs de identificação repetitivos
  filterUserIdentification: true,
  // Debounce para identificação de usuários
  userIdentificationDebounce: 2000,
  // Filtrar logs de eventos internos
  filterInternalEvents: true,
  // Logs permitidos
  allowedLogs: ['error', 'warn'],
  // Eventos internos a filtrar
  internalEvents: [
    '_ttq_create',
    '_ttq_keys',
    'devserver_websocket',
    'RudderStack: Identifying user'
  ]
};

class RudderStackOptimizer {
  private originalConsole: {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
  };
  private userIdentificationTimeout: NodeJS.Timeout | null = null;
  private lastUserIdentification: string | null = null;

  constructor() {
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
    this.initializeOptimization();
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

    // Filtrar logs de identificação repetitivos do RudderStack
    if (RUDDERSTACK_CONFIG.filterUserIdentification && 
        message.includes('RudderStack: Identifying user')) {
      return this.handleUserIdentification(message);
    }

    // Filtrar eventos internos
    if (RUDDERSTACK_CONFIG.filterInternalEvents) {
      for (const event of RUDDERSTACK_CONFIG.internalEvents) {
        if (message.includes(event)) {
          return true;
        }
      }
    }

    // Filtrar logs de websocket repetitivos
    if (message.includes('devserver_websocket')) {
      return true;
    }

    return false;
  }

  private handleUserIdentification(message: string): boolean {
    // Extrair ID do usuário
    const userIdMatch = message.match(/userId:\s*"([^"]+)"/);
    if (!userIdMatch) return true;

    const userId = userIdMatch[1];
    const now = Date.now();

    // Se é o mesmo usuário e foi identificado recentemente, filtrar
    if (this.lastUserIdentification === userId && 
        this.userIdentificationTimeout) {
      return true;
    }

    // Limpar timeout anterior
    if (this.userIdentificationTimeout) {
      clearTimeout(this.userIdentificationTimeout);
    }

    // Permitir log e configurar debounce
    this.lastUserIdentification = userId;
    this.userIdentificationTimeout = setTimeout(() => {
      this.lastUserIdentification = null;
    }, RUDDERSTACK_CONFIG.userIdentificationDebounce);

    return false;
  }

  // Método para restaurar console original
  public restoreConsole() {
    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
  }

  // Método para configurar RudderStack com otimizações
  public configureRudderStack(rudderstack: any) {
    if (!rudderstack) return;

    // Configurar debounce para identificação
    const originalIdentify = rudderstack.identify;
    if (originalIdentify) {
      rudderstack.identify = (...args: any[]) => {
        // Debounce identificação
        if (this.userIdentificationTimeout) {
          clearTimeout(this.userIdentificationTimeout);
        }
        
        this.userIdentificationTimeout = setTimeout(() => {
          originalIdentify.apply(rudderstack, args);
        }, 500);
      };
    }

    // Configurar filtros para eventos
    const originalTrack = rudderstack.track;
    if (originalTrack) {
      rudderstack.track = (event: string, properties?: any) => {
        // Filtrar eventos internos
        if (RUDDERSTACK_CONFIG.internalEvents.some(e => event.includes(e))) {
          return;
        }
        originalTrack.call(rudderstack, event, properties);
      };
    }
  }
}

// Instância global do otimizador
export const rudderstackOptimizer = new RudderStackOptimizer();

// Função para inicializar otimizações
export const initializeRudderStackOptimization = () => {
  // Aplicar otimizações imediatamente
  console.log('🔧 RudderStack Optimizer: Filtros aplicados');
  
  // Configurar RudderStack se disponível
  if (typeof window !== 'undefined' && (window as any).rudderstack) {
    rudderstackOptimizer.configureRudderStack((window as any).rudderstack);
  }
};

// Função para limpar otimizações
export const cleanupRudderStackOptimization = () => {
  rudderstackOptimizer.restoreConsole();
  console.log('🔧 RudderStack Optimizer: Filtros removidos');
};

// Auto-inicializar em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  initializeRudderStackOptimization();
}