// @ts-nocheck
/**
 * 🔧 CONSOLE MANAGER
 * Gerencia logs de forma otimizada e remove logs desnecessários em produção
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: number;
  component?: string;
}

class ConsoleManager {
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;
  private isDevelopment = __DEV__;
  private logCounts = new Map<string, number>();

  /**
   * Log estruturado com throttling
   */
  log(level: LogLevel, message: string, data?: any, component?: string) {
    // Em produção, só loggar erros
    if (!this.isDevelopment && level !== 'error') {
      return;
    }

    const logKey = `${level}-${message}`;
    const count = this.logCounts.get(logKey) || 0;
    
    // Throttle logs repetitivos (máximo 5 por mensagem)
    if (count >= 5 && level !== 'error') {
      return;
    }
    
    this.logCounts.set(logKey, count + 1);

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: performance.now(),
      component
    };

    // Adicionar ao buffer
    this.logBuffer.push(entry);
    
    // Manter buffer size
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Log real baseado no nível
    this.outputLog(entry);
  }

  /**
   * Output do log baseado no nível
   */
  private outputLog(entry: LogEntry) {
    const { level, message, data, component } = entry;
    const prefix = component ? `[${component}]` : '';
    const timestamp = this.isDevelopment ? `${entry.timestamp.toFixed(2)}ms` : '';

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`🔍 ${prefix} ${message}`, data || '', timestamp);
        }
        break;
      case 'info':
        if (this.isDevelopment) {
          console.log(`ℹ️ ${prefix} ${message}`, data || '', timestamp);
        }
        break;
      case 'warn':
        console.warn(`⚠️ ${prefix} ${message}`, data || '');
        break;
      case 'error':
        console.error(`🚨 ${prefix} ${message}`, data || '');
        break;
    }
  }

  /**
   * Debug só em desenvolvimento
   */
  debug(message: string, data?: any, component?: string) {
    this.log('debug', message, data, component);
  }

  /**
   * Info só em desenvolvimento
   */
  info(message: string, data?: any, component?: string) {
    this.log('info', message, data, component);
  }

  /**
   * Warning sempre
   */
  warn(message: string, data?: any, component?: string) {
    this.log('warn', message, data, component);
  }

  /**
   * Error sempre
   */
  error(message: string, data?: any, component?: string) {
    this.log('error', message, data, component);
  }

  /**
   * Obter logs do buffer
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logBuffer.filter(entry => entry.level === level);
    }
    return [...this.logBuffer];
  }

  /**
   * Limpar logs
   */
  clear() {
    this.logBuffer = [];
    this.logCounts.clear();
    if (this.isDevelopment) {
      console.clear();
    }
  }

  /**
   * Estatísticas de logs
   */
  getStats() {
    const stats = {
      total: this.logBuffer.length,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };

    this.logBuffer.forEach(entry => {
      stats[entry.level]++;
    });

    return stats;
  }
}

// Instância singleton
export const logger = new ConsoleManager();

// Substituir console methods em desenvolvimento para capturar logs
if (__DEV__) {
  const originalConsole = { ...console };
  
  console.log = (...args) => {
    logger.info(args[0], args.slice(1));
    originalConsole.log(...args);
  };
  
  console.warn = (...args) => {
    logger.warn(args[0], args.slice(1));
    originalConsole.warn(...args);
  };
  
  console.error = (...args) => {
    logger.error(args[0], args.slice(1));
    originalConsole.error(...args);
  };
}

// Helpers para componentes específicos
export const createComponentLogger = (componentName: string) => ({
  debug: (message: string, data?: any) => logger.debug(message, data, componentName),
  info: (message: string, data?: any) => logger.info(message, data, componentName),
  warn: (message: string, data?: any) => logger.warn(message, data, componentName),
  error: (message: string, data?: any) => logger.error(message, data, componentName),
});

export default logger;