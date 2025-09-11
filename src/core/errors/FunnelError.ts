/**
 * 🚨 CLASSE DE ERRO CUSTOMIZADA PARA FUNIS
 * 
 * Classe avançada que estende Error nativo com:
 * - Códigos padronizados de erro
 * - Contexto rico para debugging
 * - Sugestões automáticas de recovery
 * - Metadata para logging estruturado
 * - Stack trace preservado
 */

import { 
  FunnelErrorCode, 
  FunnelErrorDefinition, 
  getErrorDefinition,
  ErrorSeverity,
  RecoveryStrategy 
} from './FunnelErrorCodes';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

/**
 * Contexto adicional do erro para debugging e recovery
 */
export interface FunnelErrorContext {
  // Identificação
  funnelId?: string;
  userId?: string;
  sessionId?: string;
  
  // Operação que causou o erro
  operation?: string;
  component?: string;
  method?: string;
  
  // Estado da aplicação
  appState?: Record<string, any>;
  userAgent?: string;
  timestamp?: string;
  
  // Dados da requisição/operação
  requestData?: any;
  responseData?: any;
  
  // Contexto técnico
  stackTrace?: string;
  sourceLocation?: string;
  browserInfo?: {
    name: string;
    version: string;
    os: string;
  };
  
  // Performance
  duration?: number;
  memoryUsage?: number;
}

/**
 * Sugestões de recovery baseadas no contexto
 */
export interface FunnelErrorRecoveryInfo {
  strategy: RecoveryStrategy;
  autoRetryCount: number;
  autoRetryDelay: number;
  userActions: string[];
  technicalSuggestions: string[];
  requiresUserInput: boolean;
}

/**
 * Metadata para logging e analytics
 */
export interface FunnelErrorMetadata {
  errorId: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  category: string;
  tags: string[];
  severity: ErrorSeverity;
  retryable: boolean;
  reportable: boolean; // Se deve ser reportado para analytics
  sensitive: boolean;  // Se contém dados sensíveis
}

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

/**
 * Classe de erro avançada para sistema de funis
 */
export class FunnelError extends Error {
  // Propriedades principais
  public readonly code: FunnelErrorCode;
  public readonly definition: FunnelErrorDefinition;
  public readonly context: FunnelErrorContext;
  public readonly recoveryInfo: FunnelErrorRecoveryInfo;
  public readonly metadata: FunnelErrorMetadata;
  
  // Controle de retry
  public retryCount: number = 0;
  public lastRetryAt?: Date;
  public isRecoverable: boolean;
  
  // Informações de timing
  public readonly occurredAt: Date;
  public resolvedAt?: Date;
  
  // Erro original que causou este erro
  public readonly originalError?: Error;
  
  constructor(
    code: FunnelErrorCode,
    message?: string,
    context: Partial<FunnelErrorContext> = {},
    originalError?: Error
  ) {
    // Obter definição do código
    const definition = getErrorDefinition(code);
    
    // Usar mensagem customizada ou padrão
    const finalMessage = message || definition.userMessage;
    
    // Chamar constructor do Error
    super(finalMessage);
    
    // Configurar propriedades básicas
    this.name = 'FunnelError';
    this.code = code;
    this.definition = definition;
    this.occurredAt = new Date();
    this.isRecoverable = definition.retryable;
    this.originalError = originalError;
    
    // Configurar contexto
    this.context = {
      timestamp: this.occurredAt.toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      ...context
    };
    
    // Configurar recovery info
    this.recoveryInfo = {
      strategy: definition.recoveryStrategy,
      autoRetryCount: definition.autoRetryCount,
      autoRetryDelay: definition.autoRetryDelay,
      userActions: [...definition.userActions],
      technicalSuggestions: this.generateTechnicalSuggestions(),
      requiresUserInput: definition.recoveryStrategy === RecoveryStrategy.USER_ACTION
    };
    
    // Configurar metadata
    this.metadata = {
      errorId: this.generateErrorId(),
      logLevel: definition.logLevel,
      category: definition.category,
      tags: [...definition.tags],
      severity: definition.severity,
      retryable: definition.retryable,
      reportable: this.shouldBeReported(),
      sensitive: this.containsSensitiveData(context)
    };
    
    // Preservar stack trace do erro original
    if (originalError) {
      this.stack = originalError.stack;
      this.originalError = originalError;
      this.context.stackTrace = originalError.stack;
    }
    
    // Preservar stack trace em navegadores modernos
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FunnelError);
    }
  }
  
  // ============================================================================
  // MÉTODOS PÚBLICOS
  // ============================================================================
  
  /**
   * Converter para objeto simples para serialização
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.sanitizeContext(this.context),
      metadata: this.metadata,
      recoveryInfo: {
        strategy: this.recoveryInfo.strategy,
        userActions: this.recoveryInfo.userActions,
        requiresUserInput: this.recoveryInfo.requiresUserInput
      },
      retryCount: this.retryCount,
      occurredAt: this.occurredAt.toISOString(),
      isRecoverable: this.isRecoverable,
      stack: this.stack
    };
  }
  
  /**
   * Converter para string user-friendly
   */
  toString(): string {
    return `FunnelError [${this.code}]: ${this.message}`;
  }
  
  /**
   * Obter mensagem técnica detalhada
   */
  getTechnicalMessage(): string {
    return this.definition.technicalMessage;
  }
  
  /**
   * Obter sugestões de ação para o usuário
   */
  getUserActions(): string[] {
    return [...this.recoveryInfo.userActions];
  }
  
  /**
   * Verificar se erro pode ser recuperado automaticamente
   */
  canAutoRecover(): boolean {
    return this.isRecoverable && 
           this.retryCount < this.recoveryInfo.autoRetryCount &&
           this.recoveryInfo.strategy === RecoveryStrategy.RETRY;
  }
  
  /**
   * Incrementar contador de retry
   */
  incrementRetry(): void {
    this.retryCount++;
    this.lastRetryAt = new Date();
  }
  
  /**
   * Marcar como resolvido
   */
  markResolved(): void {
    this.resolvedAt = new Date();
  }
  
  /**
   * Obter delay para próximo retry
   */
  getNextRetryDelay(): number {
    // Exponential backoff
    const baseDelay = this.recoveryInfo.autoRetryDelay;
    return baseDelay * Math.pow(2, this.retryCount);
  }
  
  /**
   * Verificar se erro é crítico
   */
  isCritical(): boolean {
    return this.metadata.severity === ErrorSeverity.CRITICAL;
  }
  
  /**
   * Verificar se erro requer intervenção do usuário
   */
  requiresUserAction(): boolean {
    return this.recoveryInfo.requiresUserInput;
  }
  
  /**
   * Obter informações para logging
   */
  getLogInfo(): Record<string, any> {
    return {
      errorId: this.metadata.errorId,
      code: this.code,
      message: this.message,
      severity: this.metadata.severity,
      category: this.metadata.category,
      tags: this.metadata.tags,
      context: this.sanitizeContext(this.context),
      retryCount: this.retryCount,
      occurredAt: this.occurredAt.toISOString(),
      duration: this.resolvedAt ? 
        this.resolvedAt.getTime() - this.occurredAt.getTime() : null
    };
  }
  
  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================
  
  /**
   * Gerar ID único para o erro
   */
  private generateErrorId(): string {
    const timestamp = this.occurredAt.getTime().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `FE_${this.code}_${timestamp}_${random}`;
  }
  
  /**
   * Gerar sugestões técnicas baseadas no código de erro
   */
  private generateTechnicalSuggestions(): string[] {
    const suggestions: string[] = [];
    
    switch (this.code) {
      case FunnelErrorCode.NETWORK_ERROR:
        suggestions.push(
          'Verificar conectividade de rede',
          'Validar configurações de proxy',
          'Checar CORS headers'
        );
        break;
        
      case FunnelErrorCode.STORAGE_FULL:
        suggestions.push(
          'Executar limpeza de cache',
          'Verificar quota disponível',
          'Implementar compressão de dados'
        );
        break;
        
      case FunnelErrorCode.MIGRATION_FAILED:
        suggestions.push(
          'Verificar integridade dos dados de origem',
          'Validar schema de migração',
          'Checar permissões de escrita'
        );
        break;
        
      case FunnelErrorCode.SYNC_CONFLICT:
        suggestions.push(
          'Implementar merge automático',
          'Validar timestamps de alteração',
          'Verificar algoritmo de resolução de conflitos'
        );
        break;
        
      default:
        suggestions.push(
          'Verificar logs detalhados',
          'Reproduzir cenário de erro',
          'Validar estado da aplicação'
        );
    }
    
    return suggestions;
  }
  
  /**
   * Determinar se erro deve ser reportado para analytics
   */
  private shouldBeReported(): boolean {
    // Não reportar erros de validação simples
    if (this.code === FunnelErrorCode.VALIDATION_ERROR) return false;
    
    // Não reportar erros de permissão (podem ser intencionais)
    if (this.code === FunnelErrorCode.NO_PERMISSION) return false;
    
    // Não reportar modo offline
    if (this.code === FunnelErrorCode.OFFLINE) return false;
    
    // Reportar erros críticos e de servidor
    return this.metadata.severity === ErrorSeverity.CRITICAL ||
           this.metadata.category === 'server' ||
           this.metadata.category === 'storage' ||
           this.metadata.category === 'migration';
  }
  
  /**
   * Verificar se contexto contém dados sensíveis
   */
  private containsSensitiveData(context: Partial<FunnelErrorContext>): boolean {
    const sensitiveKeys = [
      'password', 'token', 'apiKey', 'secret', 
      'authorization', 'cookie', 'session'
    ];
    
    const contextStr = JSON.stringify(context).toLowerCase();
    return sensitiveKeys.some(key => contextStr.includes(key));
  }
  
  /**
   * Sanitizar contexto para logging (remover dados sensíveis)
   */
  private sanitizeContext(context: FunnelErrorContext): FunnelErrorContext {
    const sanitized = { ...context };
    
    // Remover dados potencialmente sensíveis
    if (this.metadata.sensitive) {
      delete sanitized.requestData;
      delete sanitized.responseData;
      delete sanitized.appState;
    }
    
    // Truncar stack traces muito longos
    if (sanitized.stackTrace && sanitized.stackTrace.length > 2000) {
      sanitized.stackTrace = sanitized.stackTrace.substring(0, 2000) + '... [truncated]';
    }
    
    return sanitized;
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Factory para criar erros comuns de forma simplificada
 */
export class FunnelErrorFactory {
  
  static notFound(funnelId: string, userId?: string): FunnelError {
    return new FunnelError(
      FunnelErrorCode.NOT_FOUND,
      `Funil "${funnelId}" não foi encontrado`,
      { funnelId, userId, operation: 'getFunnel' }
    );
  }
  
  static noPermission(funnelId: string, operation: string, userId?: string): FunnelError {
    return new FunnelError(
      FunnelErrorCode.NO_PERMISSION,
      `Sem permissão para ${operation} no funil "${funnelId}"`,
      { funnelId, userId, operation }
    );
  }
  
  static networkError(operation: string, originalError?: Error): FunnelError {
    return new FunnelError(
      FunnelErrorCode.NETWORK_ERROR,
      undefined,
      { operation },
      originalError
    );
  }
  
  static storageError(operation: string, details?: string): FunnelError {
    return new FunnelError(
      FunnelErrorCode.STORAGE_ERROR,
      details ? `Erro de storage durante ${operation}: ${details}` : undefined,
      { operation }
    );
  }
  
  static migrationFailed(fromVersion: string, toVersion: string, reason?: string): FunnelError {
    return new FunnelError(
      FunnelErrorCode.MIGRATION_FAILED,
      reason ? `Migração falhou de v${fromVersion} para v${toVersion}: ${reason}` : undefined,
      { 
        operation: 'migration',
        requestData: { fromVersion, toVersion, reason }
      }
    );
  }
  
  static syncConflict(funnelId: string, localVersion: string, remoteVersion: string): FunnelError {
    return new FunnelError(
      FunnelErrorCode.SYNC_CONFLICT,
      `Conflito de sincronização no funil "${funnelId}"`,
      {
        funnelId,
        operation: 'sync',
        requestData: { localVersion, remoteVersion }
      }
    );
  }
  
  static validationError(field: string, value: any, rule: string): FunnelError {
    return new FunnelError(
      FunnelErrorCode.VALIDATION_ERROR,
      `Campo "${field}" não atende à regra: ${rule}`,
      {
        operation: 'validation',
        requestData: { field, value, rule }
      }
    );
  }
  
  static timeout(operation: string, duration: number): FunnelError {
    return new FunnelError(
      FunnelErrorCode.TIMEOUT,
      `Timeout durante ${operation} após ${duration}ms`,
      { operation, duration }
    );
  }
  
  static serverError(statusCode: number, responseBody?: any): FunnelError {
    return new FunnelError(
      FunnelErrorCode.SERVER_ERROR,
      `Erro do servidor (${statusCode})`,
      {
        operation: 'serverRequest',
        responseData: responseBody
      }
    );
  }
  
  static offline(): FunnelError {
    return new FunnelError(
      FunnelErrorCode.OFFLINE,
      undefined,
      { operation: 'connectivity_check' }
    );
  }
}
