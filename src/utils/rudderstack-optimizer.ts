/**
 * 📊 RUDDERSTACK OPTIMIZER - Resolver problemas de identificação de usuário
 * 
 * Este utilitário resolve os problemas específicos do RudderStack
 * que podem estar causando loops de identificação de usuário.
 */

export class RudderStackOptimizer {
  private static instance: RudderStackOptimizer;
  private isOptimized = false;
  private userIdentificationCache = new Map<string, any>();

  static getInstance(): RudderStackOptimizer {
    if (!RudderStackOptimizer.instance) {
      RudderStackOptimizer.instance = new RudderStackOptimizer();
    }
    return RudderStackOptimizer.instance;
  }

  /**
   * 🎯 Otimizar configurações do RudderStack
   */
  optimizeRudderStack() {
    if (this.isOptimized) return;

    if (typeof window !== 'undefined') {
      // 1. Interceptar console.log para filtrar spam do RudderStack
      this.setupConsoleFiltering();

      // 2. Configurar debounce para identificação de usuário
      this.setupUserIdentificationDebounce();

      // 3. Configurar cleanup automático
      this.setupAutoCleanup();
    }

    this.isOptimized = true;
    console.log('✅ RudderStack optimizer configurado');
  }

  /**
   * 🎯 Configurar filtro de console
   */
  private setupConsoleFiltering() {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    // Filtro para console.log
    console.log = (...args: any[]) => {
      const message = args.join(' ');
      
      // Filtrar mensagens repetitivas do RudderStack
      if (this.shouldFilterMessage(message)) {
        return;
      }
      
      originalConsoleLog.apply(console, args);
    };

    // Filtro para console.warn
    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      
      if (this.shouldFilterMessage(message)) {
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };

    // Filtro para console.error
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      if (this.shouldFilterMessage(message)) {
        return;
      }
      
      originalConsoleError.apply(console, args);
    };
  }

  /**
   * 🎯 Verificar se mensagem deve ser filtrada
   */
  private shouldFilterMessage(message: string): boolean {
    const filterPatterns = [
      'RudderStack: Identifying user',
      'devserver_websocket_open',
      'devserver_websocket_close',
      'ObjectuserId:',
      '[[Prototype]]: Object',
      'constructor: ƒ Object()',
      '_ttq_create: ƒ',
      '_ttq_keys: ƒ',
      'assign: ƒ assign()',
      'create: ƒ create()',
      'defineProperties: ƒ defineProperties()',
      'defineProperty: ƒ defineProperty()',
      'entries: ƒ entries()',
      'freeze: ƒ freeze()',
      'fromEntries: ƒ fromEntries()',
      'getOwnPropertyDescriptor: ƒ getOwnPropertyDescriptor()',
      'getOwnPropertyDescriptors: ƒ getOwnPropertyDescriptors()',
      'getOwnPropertyNames: ƒ getOwnPropertyNames()',
      'getOwnPropertySymbols: ƒ getOwnPropertySymbols()',
      'getPrototypeOf: ƒ getPrototypeOf()',
      'groupBy: ƒ groupBy()',
      'hasOwn: ƒ hasOwn()',
      'is: ƒ is()',
      'isExtensible: ƒ isExtensible()',
      'isFrozen: ƒ isFrozen()',
      'isSealed: ƒ isSealed()',
      'keys: ƒ keys()',
      'preventExtensions: ƒ preventExtensions()',
      'seal: ƒ seal()',
      'setPrototypeOf: ƒ setPrototypeOf()',
      'values: ƒ values()',
      'hasOwnProperty: ƒ hasOwnProperty()',
      'isPrototypeOf: ƒ isPrototypeOf()',
      'propertyIsEnumerable: ƒ propertyIsEnumerable()',
      'toLocaleString: ƒ toLocaleString()',
      'toString: ƒ toString()',
      'valueOf: ƒ valueOf()',
      '__defineGetter__: ƒ __defineGetter__()',
      '__defineSetter__: ƒ __defineSetter__()',
      '__lookupGetter__: ƒ __lookupGetter__()',
      '__lookupSetter__: ƒ __lookupSetter__()',
      '__proto__: (...)',
      'get __proto__: ƒ __proto__()',
      'set __proto__: ƒ __proto__()'
    ];

    return filterPatterns.some(pattern => message.includes(pattern));
  }

  /**
   * 🎯 Configurar debounce para identificação de usuário
   */
  private setupUserIdentificationDebounce() {
    let identificationTimeout: NodeJS.Timeout | null = null;

    // Interceptar chamadas de identificação de usuário
    const originalIdentify = (window as any).rudderanalytics?.identify;
    if (originalIdentify) {
      (window as any).rudderanalytics.identify = (userId: string, traits?: any) => {
        // Debounce identificação de usuário
        if (identificationTimeout) {
          clearTimeout(identificationTimeout);
        }

        identificationTimeout = setTimeout(() => {
          // Verificar se já foi identificado recentemente
          const cacheKey = `${userId}-${JSON.stringify(traits)}`;
          const lastIdentification = this.userIdentificationCache.get(cacheKey);
          const now = Date.now();

          if (!lastIdentification || (now - lastIdentification) > 5000) { // 5 segundos
            this.userIdentificationCache.set(cacheKey, now);
            originalIdentify.call((window as any).rudderanalytics, userId, traits);
          }
        }, 1000); // 1 segundo de debounce
      };
    }
  }

  /**
   * 🎯 Configurar cleanup automático
   */
  private setupAutoCleanup() {
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

    // Cleanup periódico do cache
    setInterval(() => {
      this.cleanupCache();
    }, 30000); // 30 segundos
  }

  /**
   * 🧹 Limpeza de recursos
   */
  private cleanup() {
    this.userIdentificationCache.clear();
    console.log('🧹 RudderStack optimizer cleanup');
  }

  /**
   * 🧹 Limpeza do cache
   */
  private cleanupCache() {
    const now = Date.now();
    const maxAge = 300000; // 5 minutos

    for (const [key, timestamp] of this.userIdentificationCache.entries()) {
      if (now - timestamp > maxAge) {
        this.userIdentificationCache.delete(key);
      }
    }
  }
}

// Inicializar otimizador automaticamente
if (typeof window !== 'undefined') {
  const optimizer = RudderStackOptimizer.getInstance();
  optimizer.optimizeRudderStack();
}
