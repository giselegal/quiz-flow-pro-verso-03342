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

  /**
   * AbortSignal para cancelamento de operações
   */
  signal?: AbortSignal;
}

/**
 * Result pattern para operações que podem falhar
 *
 * NOTE: Historically this was a strict discriminated union which required
 * callers to narrow before accessing `.data`. Many existing call-sites and
 * tests access `.data` directly (assuming success). To reduce churn we
 * expose `.data` always (null on error) while keeping `success`/`error`.
 */
export type ServiceResult<T> =
  | { success: true; data: T; error?: undefined }
  | { success: false; data: null; error: Error };

/**
 * Base class abstrata para canonical services
 */
export abstract class BaseCanonicalService implements ICanonicalService {
  protected _state: ServiceState = 'idle';
  protected options: ServiceOptions;

  constructor(
    public readonly name: string,
    public readonly version: string,
    options: ServiceOptions = {},
  ) {
    this.options = {
      debug: false,
      timeout: 30000,
      retry: { maxAttempts: 3, backoff: 1000 },
      ...options,
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
      appLogger.info(`[${this.name}]`, { data: [...args] });
    }
  }

  protected error(...args: any[]): void {
    appLogger.error(`[${this.name}]`, { data: [...args] });
  }

  /**
   * Helper para criar resultado de sucesso
   */
  protected success<T>(data: T): ServiceResult<T> {
    return { success: true, data };
  }

  /**
   * Helper para criar resultado de falha
   */
  protected failure<T>(errorCode: string, message: string): ServiceResult<T> {
    return { 
      success: false,
      data: null,
      error: new Error(`[${errorCode}] ${message}`),
    };
  }

  protected createResult<T>(data: T): ServiceResult<T> {
    return { success: true, data };
  }

  protected createError<T>(error: Error): ServiceResult<T> {
    return { success: false, data: null, error };
  }
}

// ============================================================================
// LEGACY COMPAT TYPES (Phase: Deprecated Services Removal)
// ============================================================================
// UnifiedFunnelData: tipo híbrido de transição que cobre tanto o formato
// canônico (FunnelMetadata) quanto campos usados no runtime do editor
// (UnifiedCRUDService). Evita dependências de serviços legados.
import type { FunnelMetadata } from './FunnelService';
import type { UnifiedStage } from '@/services/UnifiedCRUDService';
import type { FunnelContext } from '@/core/contexts/FunnelContext';
import { appLogger } from '@/lib/utils/appLogger';

export interface UnifiedFunnelData {
  id: string;
  name: string;
  description?: string;
  version?: string | number;
  isPublished?: boolean;
  pages?: Array<{ id: string; blocks?: any[]; [k: string]: any }>;
  lastModified?: Date | string;
  theme?: string; // usado por componentes legacy (FunnelHeader)

  // Canonical
  type?: FunnelMetadata['type'];
  category?: string;
  context?: FunnelContext;
  templateId?: string;
  status?: FunnelMetadata['status'];
  isActive?: boolean;
  config?: Record<string, any>;
  metadata?: Record<string, any>;

  // Editor runtime
  stages?: UnifiedStage[];
  settings?: Record<string, any>;
  userId?: string;

  // Datas flexíveis
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

