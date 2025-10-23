/**
 * 🏛️ CANONICAL SERVICES - BASE TYPES
 * 
 * Tipos e interfaces compartilhadas pelos 12 services canônicos
 */

/**
 * Service lifecycle states
 */
export type ServiceState = 'idle' | 'initializing' | 'ready' | 'error' | 'disposed';

/**
 * Base interface que todos os canonical services devem implementar
 */
export interface ICanonicalService {
  /**
   * Nome do serviço
   */
  readonly name: string;

  /**
   * Versão do serviço
   */
  readonly version: string;

  /**
   * Estado atual do serviço
   */
  readonly state: ServiceState;

  /**
   * Inicializar o serviço
   */
  initialize(): Promise<void>;

  /**
   * Destruir o serviço e liberar recursos
   */
  dispose(): Promise<void>;

  /**
   * Health check do serviço
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Options de configuração para services
 */
export interface ServiceOptions {
  /**
   * Habilitar debug logs
   */
  debug?: boolean;

  /**
   * Timeout para operações (ms)
   */
  timeout?: number;

  /**
   * Retry policy
   */
  retry?: {
    maxAttempts: number;
    backoff: number;
  };
}

/**
 * Result pattern para operações que podem falhar
 */
export type ServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; error: Error };

/**
 * Base class abstrata para canonical services
 */
export abstract class BaseCanonicalService implements ICanonicalService {
  protected _state: ServiceState = 'idle';
  protected options: ServiceOptions;

  constructor(
    public readonly name: string,
    public readonly version: string,
    options: ServiceOptions = {}
  ) {
    this.options = {
      debug: false,
      timeout: 30000,
      retry: { maxAttempts: 3, backoff: 1000 },
      ...options
    };
  }

  get state(): ServiceState {
    return this._state;
  }

  async initialize(): Promise<void> {
    if (this._state !== 'idle') {
      throw new Error(`Cannot initialize service in state: ${this._state}`);
    }

    this._state = 'initializing';
    
    try {
      await this.onInitialize();
      this._state = 'ready';
      this.log(`✅ ${this.name} initialized`);
    } catch (error) {
      this._state = 'error';
      this.log(`❌ ${this.name} initialization failed:`, error);
      throw error;
    }
  }

  async dispose(): Promise<void> {
    if (this._state === 'disposed') {
      return;
    }

    try {
      await this.onDispose();
      this._state = 'disposed';
      this.log(`🗑️ ${this.name} disposed`);
    } catch (error) {
      this.log(`⚠️ ${this.name} disposal failed:`, error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    return this._state === 'ready';
  }

  protected abstract onInitialize(): Promise<void>;
  protected abstract onDispose(): Promise<void>;

  protected log(...args: any[]): void {
    if (this.options.debug) {
      console.log(`[${this.name}]`, ...args);
    }
  }

  protected error(...args: any[]): void {
    console.error(`[${this.name}]`, ...args);
  }

  protected createResult<T>(data: T): ServiceResult<T> {
    return { success: true, data };
  }

  protected createError<T>(error: Error): ServiceResult<T> {
    return { success: false, error };
  }
}
