/**
 * 🚨 SISTEMA DE CÓDIGOS DE ERRO PADRONIZADOS PARA FUNIS
 * 
 * Sistema consistente e inteligente de tratamento de erros com:
 * - Códigos padronizados e categorizados
 * - Mensagens user-friendly
 * - Estratégias de recovery automático
 * - Severidade e priorização
 * - Contexto para logging e debugging
 */

// ============================================================================
// ENUMS DE CÓDIGOS DE ERRO
// ============================================================================

/**
 * Códigos padronizados de erro para fluxo de funis
 */
export enum FunnelErrorCode {
    // 🔍 ERROS DE BUSCA/ACESSO
    NOT_FOUND = 'NOT_FOUND',
    NO_PERMISSION = 'NO_PERMISSION',
    AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',

    // 🌐 ERROS DE REDE/CONECTIVIDADE  
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT = 'TIMEOUT',
    OFFLINE = 'OFFLINE',
    RATE_LIMITED = 'RATE_LIMITED',

    // 💾 ERROS DE ARMAZENAMENTO
    STORAGE_FULL = 'STORAGE_FULL',
    STORAGE_ERROR = 'STORAGE_ERROR',
    INDEXEDDB_NOT_SUPPORTED = 'INDEXEDDB_NOT_SUPPORTED',
    QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

    // 📊 ERROS DE DADOS/VALIDAÇÃO
    INVALID_DATA = 'INVALID_DATA',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    CORRUPTED_DATA = 'CORRUPTED_DATA',
    VERSION_MISMATCH = 'VERSION_MISMATCH',

    // 🔄 ERROS DE SINCRONIZAÇÃO
    SYNC_CONFLICT = 'SYNC_CONFLICT',
    SYNC_FAILED = 'SYNC_FAILED',
    MERGE_CONFLICT = 'MERGE_CONFLICT',
    CONCURRENT_EDIT = 'CONCURRENT_EDIT',

    // 🔄 ERROS DE MIGRAÇÃO
    MIGRATION_FAILED = 'MIGRATION_FAILED',
    MIGRATION_INTERRUPTED = 'MIGRATION_INTERRUPTED',
    BACKUP_FAILED = 'BACKUP_FAILED',
    ROLLBACK_FAILED = 'ROLLBACK_FAILED',

    // 🖥️ ERROS DE SERVIDOR
    SERVER_ERROR = 'SERVER_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',

    // ⚙️ ERROS DE CONFIGURAÇÃO
    CONFIG_ERROR = 'CONFIG_ERROR',
    TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
    PLUGIN_ERROR = 'PLUGIN_ERROR',
    DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',

    // 🔧 ERROS INTERNOS
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    MEMORY_ERROR = 'MEMORY_ERROR',
    BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
    FEATURE_NOT_AVAILABLE = 'FEATURE_NOT_AVAILABLE'
}

/**
 * Severidade do erro para priorização
 */
export enum ErrorSeverity {
    INFO = 'info',           // Informativo, não impacta funcionamento
    WARNING = 'warning',     // Aviso, funcionalidade degradada
    ERROR = 'error',         // Erro, funcionalidade indisponível
    CRITICAL = 'critical'    // Crítico, sistema inutilizável
}

/**
 * Estratégias de recovery disponíveis
 */
export enum RecoveryStrategy {
    NONE = 'none',                    // Nenhuma recovery automática
    RETRY = 'retry',                  // Tentar novamente automaticamente
    FALLBACK = 'fallback',            // Usar alternativa (localStorage, etc)
    OFFLINE_MODE = 'offline_mode',    // Entrar em modo offline
    RELOAD_PAGE = 'reload_page',      // Recarregar página
    CLEAR_CACHE = 'clear_cache',      // Limpar cache
    USER_ACTION = 'user_action',      // Requer ação do usuário
    CONTACT_SUPPORT = 'contact_support' // Contactar suporte
}

// ============================================================================
// DEFINIÇÕES DETALHADAS DE ERRO
// ============================================================================

/**
 * Metadados completos para cada código de erro
 */
export interface FunnelErrorDefinition {
    code: FunnelErrorCode;
    severity: ErrorSeverity;
    userMessage: string;
    technicalMessage: string;
    recoveryStrategy: RecoveryStrategy;
    retryable: boolean;
    autoRetryCount: number;
    autoRetryDelay: number; // em ms
    userActions: string[];
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    category: string;
    tags: string[];
}

/**
 * Definições completas de todos os códigos de erro
 */
export const FUNNEL_ERROR_DEFINITIONS: Record<FunnelErrorCode, FunnelErrorDefinition> = {
    // 🔍 ERROS DE BUSCA/ACESSO
    [FunnelErrorCode.NOT_FOUND]: {
        code: FunnelErrorCode.NOT_FOUND,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Funil não encontrado. Pode ter sido movido ou excluído.',
        technicalMessage: 'Funnel not found in storage or server',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Voltar à lista de funis', 'Verificar link', 'Contactar suporte'],
        logLevel: 'warn',
        category: 'access',
        tags: ['not-found', 'navigation']
    },

    [FunnelErrorCode.NO_PERMISSION]: {
        code: FunnelErrorCode.NO_PERMISSION,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Você não tem permissão para acessar este funil.',
        technicalMessage: 'Insufficient permissions for funnel access',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Solicitar acesso', 'Fazer login', 'Contactar proprietário'],
        logLevel: 'warn',
        category: 'permissions',
        tags: ['security', 'access-control']
    },

    [FunnelErrorCode.AUTHENTICATION_REQUIRED]: {
        code: FunnelErrorCode.AUTHENTICATION_REQUIRED,
        severity: ErrorSeverity.WARNING,
        userMessage: 'É necessário fazer login para continuar.',
        technicalMessage: 'Authentication required for this operation',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: true,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Fazer login', 'Criar conta'],
        logLevel: 'info',
        category: 'auth',
        tags: ['authentication', 'security']
    },

    // 🌐 ERROS DE REDE/CONECTIVIDADE
    [FunnelErrorCode.NETWORK_ERROR]: {
        code: FunnelErrorCode.NETWORK_ERROR,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Erro de conexão. Verifique sua internet.',
        technicalMessage: 'Network request failed',
        recoveryStrategy: RecoveryStrategy.RETRY,
        retryable: true,
        autoRetryCount: 3,
        autoRetryDelay: 2000,
        userActions: ['Verificar conexão', 'Tentar novamente', 'Trabalhar offline'],
        logLevel: 'error',
        category: 'network',
        tags: ['connectivity', 'retry']
    },

    [FunnelErrorCode.TIMEOUT]: {
        code: FunnelErrorCode.TIMEOUT,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Operação demorou muito. Tente novamente.',
        technicalMessage: 'Operation timed out',
        recoveryStrategy: RecoveryStrategy.RETRY,
        retryable: true,
        autoRetryCount: 2,
        autoRetryDelay: 5000,
        userActions: ['Tentar novamente', 'Verificar conexão'],
        logLevel: 'warn',
        category: 'network',
        tags: ['timeout', 'performance', 'retry']
    },

    [FunnelErrorCode.OFFLINE]: {
        code: FunnelErrorCode.OFFLINE,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Modo offline ativo. Algumas funcionalidades estão limitadas.',
        technicalMessage: 'Application is in offline mode',
        recoveryStrategy: RecoveryStrategy.OFFLINE_MODE,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Conectar à internet', 'Continuar offline'],
        logLevel: 'info',
        category: 'network',
        tags: ['offline', 'connectivity']
    },

    [FunnelErrorCode.RATE_LIMITED]: {
        code: FunnelErrorCode.RATE_LIMITED,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
        technicalMessage: 'Rate limit exceeded',
        recoveryStrategy: RecoveryStrategy.RETRY,
        retryable: true,
        autoRetryCount: 1,
        autoRetryDelay: 10000,
        userActions: ['Aguardar e tentar novamente'],
        logLevel: 'warn',
        category: 'network',
        tags: ['rate-limit', 'throttling']
    },

    // 💾 ERROS DE ARMAZENAMENTO
    [FunnelErrorCode.STORAGE_FULL]: {
        code: FunnelErrorCode.STORAGE_FULL,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Armazenamento local cheio. Libere espaço para continuar.',
        technicalMessage: 'Local storage quota exceeded',
        recoveryStrategy: RecoveryStrategy.CLEAR_CACHE,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Limpar dados antigos', 'Aumentar quota', 'Usar cloud storage'],
        logLevel: 'error',
        category: 'storage',
        tags: ['quota', 'capacity']
    },

    [FunnelErrorCode.STORAGE_ERROR]: {
        code: FunnelErrorCode.STORAGE_ERROR,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Erro ao salvar dados. Tente novamente.',
        technicalMessage: 'Storage operation failed',
        recoveryStrategy: RecoveryStrategy.FALLBACK,
        retryable: true,
        autoRetryCount: 2,
        autoRetryDelay: 1000,
        userActions: ['Tentar novamente', 'Verificar navegador'],
        logLevel: 'error',
        category: 'storage',
        tags: ['persistence', 'fallback']
    },

    [FunnelErrorCode.INDEXEDDB_NOT_SUPPORTED]: {
        code: FunnelErrorCode.INDEXEDDB_NOT_SUPPORTED,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Navegador não suporta armazenamento avançado. Usando modo compatibilidade.',
        technicalMessage: 'IndexedDB not supported, falling back to localStorage',
        recoveryStrategy: RecoveryStrategy.FALLBACK,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Atualizar navegador', 'Continuar em modo limitado'],
        logLevel: 'warn',
        category: 'storage',
        tags: ['compatibility', 'browser-support']
    },

    [FunnelErrorCode.QUOTA_EXCEEDED]: {
        code: FunnelErrorCode.QUOTA_EXCEEDED,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Cota de armazenamento excedida.',
        technicalMessage: 'Storage quota exceeded',
        recoveryStrategy: RecoveryStrategy.CLEAR_CACHE,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Limpar dados', 'Exportar funis antigos'],
        logLevel: 'error',
        category: 'storage',
        tags: ['quota', 'cleanup']
    },

    // 📊 ERROS DE DADOS/VALIDAÇÃO
    [FunnelErrorCode.INVALID_DATA]: {
        code: FunnelErrorCode.INVALID_DATA,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Dados inválidos detectados. Verifique as informações.',
        technicalMessage: 'Invalid data format or structure',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Corrigir dados', 'Recriar funil', 'Restaurar backup'],
        logLevel: 'error',
        category: 'validation',
        tags: ['data-integrity', 'validation']
    },

    [FunnelErrorCode.VALIDATION_ERROR]: {
        code: FunnelErrorCode.VALIDATION_ERROR,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Alguns campos precisam ser corrigidos.',
        technicalMessage: 'Validation rules not met',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Corrigir campos destacados', 'Verificar dados obrigatórios'],
        logLevel: 'warn',
        category: 'validation',
        tags: ['form-validation', 'user-input']
    },

    [FunnelErrorCode.CORRUPTED_DATA]: {
        code: FunnelErrorCode.CORRUPTED_DATA,
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Dados corrompidos detectados. Restaurando backup.',
        technicalMessage: 'Data corruption detected, initiating recovery',
        recoveryStrategy: RecoveryStrategy.FALLBACK,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Restaurar backup', 'Contactar suporte'],
        logLevel: 'error',
        category: 'data-integrity',
        tags: ['corruption', 'recovery', 'critical']
    },

    [FunnelErrorCode.VERSION_MISMATCH]: {
        code: FunnelErrorCode.VERSION_MISMATCH,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Versão do funil desatualizada. Sincronizando...',
        technicalMessage: 'Version mismatch between local and remote',
        recoveryStrategy: RecoveryStrategy.RETRY,
        retryable: true,
        autoRetryCount: 1,
        autoRetryDelay: 2000,
        userActions: ['Atualizar página', 'Aceitar sincronização'],
        logLevel: 'warn',
        category: 'versioning',
        tags: ['sync', 'versioning']
    },

    // 🔄 ERROS DE SINCRONIZAÇÃO
    [FunnelErrorCode.SYNC_CONFLICT]: {
        code: FunnelErrorCode.SYNC_CONFLICT,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Conflito de sincronização detectado. Escolha uma versão.',
        technicalMessage: 'Sync conflict requires manual resolution',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Manter local', 'Usar servidor', 'Mesclar alterações'],
        logLevel: 'warn',
        category: 'sync',
        tags: ['conflict-resolution', 'merge']
    },

    [FunnelErrorCode.SYNC_FAILED]: {
        code: FunnelErrorCode.SYNC_FAILED,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Falha na sincronização. Trabalhando offline.',
        technicalMessage: 'Synchronization with server failed',
        recoveryStrategy: RecoveryStrategy.OFFLINE_MODE,
        retryable: true,
        autoRetryCount: 3,
        autoRetryDelay: 30000,
        userActions: ['Tentar sincronizar', 'Continuar offline'],
        logLevel: 'warn',
        category: 'sync',
        tags: ['synchronization', 'offline']
    },

    [FunnelErrorCode.MERGE_CONFLICT]: {
        code: FunnelErrorCode.MERGE_CONFLICT,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Alterações conflitantes detectadas. Revisão necessária.',
        technicalMessage: 'Automatic merge failed due to conflicts',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Revisar alterações', 'Aceitar todas', 'Resolver manualmente'],
        logLevel: 'warn',
        category: 'sync',
        tags: ['merge-conflict', 'manual-resolution']
    },

    [FunnelErrorCode.CONCURRENT_EDIT]: {
        code: FunnelErrorCode.CONCURRENT_EDIT,
        severity: ErrorSeverity.INFO,
        userMessage: 'Outro usuário está editando. Suas alterações serão sincronizadas.',
        technicalMessage: 'Concurrent editing session detected',
        recoveryStrategy: RecoveryStrategy.RETRY,
        retryable: true,
        autoRetryCount: 0,
        autoRetryDelay: 5000,
        userActions: ['Continuar editando', 'Ver alterações'],
        logLevel: 'info',
        category: 'collaboration',
        tags: ['concurrent-editing', 'real-time']
    },

    // 🔄 ERROS DE MIGRAÇÃO
    [FunnelErrorCode.MIGRATION_FAILED]: {
        code: FunnelErrorCode.MIGRATION_FAILED,
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Falha na migração de dados. Contate o suporte.',
        technicalMessage: 'Data migration process failed',
        recoveryStrategy: RecoveryStrategy.CONTACT_SUPPORT,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Contactar suporte', 'Tentar restaurar backup'],
        logLevel: 'error',
        category: 'migration',
        tags: ['migration', 'critical', 'support']
    },

    [FunnelErrorCode.MIGRATION_INTERRUPTED]: {
        code: FunnelErrorCode.MIGRATION_INTERRUPTED,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Migração interrompida. Tentando continuar...',
        technicalMessage: 'Migration process was interrupted',
        recoveryStrategy: RecoveryStrategy.RETRY,
        retryable: true,
        autoRetryCount: 1,
        autoRetryDelay: 3000,
        userActions: ['Continuar migração', 'Cancelar e usar versão anterior'],
        logLevel: 'error',
        category: 'migration',
        tags: ['interruption', 'recovery']
    },

    [FunnelErrorCode.BACKUP_FAILED]: {
        code: FunnelErrorCode.BACKUP_FAILED,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Falha no backup. Continuando sem proteção.',
        technicalMessage: 'Backup creation failed',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: true,
        autoRetryCount: 1,
        autoRetryDelay: 2000,
        userActions: ['Tentar backup manual', 'Continuar sem backup'],
        logLevel: 'warn',
        category: 'backup',
        tags: ['backup', 'data-protection']
    },

    [FunnelErrorCode.ROLLBACK_FAILED]: {
        code: FunnelErrorCode.ROLLBACK_FAILED,
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Falha no rollback. Contacte o suporte imediatamente.',
        technicalMessage: 'Rollback operation failed',
        recoveryStrategy: RecoveryStrategy.CONTACT_SUPPORT,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Contactar suporte urgente', 'Não fazer alterações'],
        logLevel: 'error',
        category: 'rollback',
        tags: ['rollback', 'critical', 'urgent']
    },

    // 🖥️ ERROS DE SERVIDOR
    [FunnelErrorCode.SERVER_ERROR]: {
        code: FunnelErrorCode.SERVER_ERROR,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Erro interno do servidor. Tente novamente em alguns minutos.',
        technicalMessage: 'Internal server error occurred',
        recoveryStrategy: RecoveryStrategy.RETRY,
        retryable: true,
        autoRetryCount: 2,
        autoRetryDelay: 30000,
        userActions: ['Aguardar e tentar novamente', 'Trabalhar offline'],
        logLevel: 'error',
        category: 'server',
        tags: ['server-error', 'retry']
    },

    [FunnelErrorCode.SERVICE_UNAVAILABLE]: {
        code: FunnelErrorCode.SERVICE_UNAVAILABLE,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Serviço temporariamente indisponível.',
        technicalMessage: 'Service is temporarily unavailable',
        recoveryStrategy: RecoveryStrategy.OFFLINE_MODE,
        retryable: true,
        autoRetryCount: 3,
        autoRetryDelay: 60000,
        userActions: ['Trabalhar offline', 'Tentar mais tarde'],
        logLevel: 'error',
        category: 'server',
        tags: ['service-unavailable', 'maintenance']
    },

    [FunnelErrorCode.BAD_REQUEST]: {
        code: FunnelErrorCode.BAD_REQUEST,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Solicitação inválida. Verifique os dados enviados.',
        technicalMessage: 'Bad request sent to server',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Verificar dados', 'Contactar suporte'],
        logLevel: 'error',
        category: 'server',
        tags: ['bad-request', 'validation']
    },

    [FunnelErrorCode.UNAUTHORIZED]: {
        code: FunnelErrorCode.UNAUTHORIZED,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Sessão expirada. Faça login novamente.',
        technicalMessage: 'Unauthorized access attempt',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Fazer login', 'Renovar sessão'],
        logLevel: 'warn',
        category: 'auth',
        tags: ['unauthorized', 'session']
    },

    [FunnelErrorCode.FORBIDDEN]: {
        code: FunnelErrorCode.FORBIDDEN,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Acesso negado para esta operação.',
        technicalMessage: 'Access forbidden for current user',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Solicitar permissão', 'Contactar administrador'],
        logLevel: 'warn',
        category: 'permissions',
        tags: ['forbidden', 'access-control']
    },

    // ⚙️ ERROS DE CONFIGURAÇÃO
    [FunnelErrorCode.CONFIG_ERROR]: {
        code: FunnelErrorCode.CONFIG_ERROR,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Erro de configuração detectado.',
        technicalMessage: 'Configuration error occurred',
        recoveryStrategy: RecoveryStrategy.RELOAD_PAGE,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Recarregar página', 'Resetar configurações'],
        logLevel: 'error',
        category: 'config',
        tags: ['configuration', 'setup']
    },

    [FunnelErrorCode.TEMPLATE_NOT_FOUND]: {
        code: FunnelErrorCode.TEMPLATE_NOT_FOUND,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Template não encontrado. Usando template padrão.',
        technicalMessage: 'Requested template not found',
        recoveryStrategy: RecoveryStrategy.FALLBACK,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Escolher outro template', 'Usar padrão'],
        logLevel: 'warn',
        category: 'templates',
        tags: ['template', 'fallback']
    },

    [FunnelErrorCode.PLUGIN_ERROR]: {
        code: FunnelErrorCode.PLUGIN_ERROR,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Plugin com falha. Funcionalidade pode estar limitada.',
        technicalMessage: 'Plugin execution error',
        recoveryStrategy: RecoveryStrategy.FALLBACK,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Desativar plugin', 'Continuar sem plugin'],
        logLevel: 'warn',
        category: 'plugins',
        tags: ['plugin', 'addon']
    },

    [FunnelErrorCode.DEPENDENCY_ERROR]: {
        code: FunnelErrorCode.DEPENDENCY_ERROR,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Erro de dependência. Funcionalidade indisponível.',
        technicalMessage: 'Required dependency not available',
        recoveryStrategy: RecoveryStrategy.RELOAD_PAGE,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Recarregar página', 'Contactar suporte'],
        logLevel: 'error',
        category: 'dependencies',
        tags: ['dependency', 'missing']
    },

    // 🔧 ERROS INTERNOS
    [FunnelErrorCode.INTERNAL_ERROR]: {
        code: FunnelErrorCode.INTERNAL_ERROR,
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Erro interno inesperado. Contacte o suporte.',
        technicalMessage: 'Unexpected internal error',
        recoveryStrategy: RecoveryStrategy.CONTACT_SUPPORT,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Recarregar página', 'Contactar suporte'],
        logLevel: 'error',
        category: 'internal',
        tags: ['internal', 'unexpected', 'critical']
    },

    [FunnelErrorCode.MEMORY_ERROR]: {
        code: FunnelErrorCode.MEMORY_ERROR,
        severity: ErrorSeverity.ERROR,
        userMessage: 'Memória insuficiente. Feche outras abas.',
        technicalMessage: 'Out of memory error',
        recoveryStrategy: RecoveryStrategy.RELOAD_PAGE,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Fechar abas', 'Recarregar página', 'Reiniciar navegador'],
        logLevel: 'error',
        category: 'performance',
        tags: ['memory', 'performance']
    },

    [FunnelErrorCode.BROWSER_NOT_SUPPORTED]: {
        code: FunnelErrorCode.BROWSER_NOT_SUPPORTED,
        severity: ErrorSeverity.WARNING,
        userMessage: 'Navegador não suportado. Algumas funcionalidades podem não funcionar.',
        technicalMessage: 'Browser not supported',
        recoveryStrategy: RecoveryStrategy.FALLBACK,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Atualizar navegador', 'Usar navegador suportado'],
        logLevel: 'warn',
        category: 'compatibility',
        tags: ['browser', 'compatibility']
    },

    [FunnelErrorCode.FEATURE_NOT_AVAILABLE]: {
        code: FunnelErrorCode.FEATURE_NOT_AVAILABLE,
        severity: ErrorSeverity.INFO,
        userMessage: 'Funcionalidade não disponível no seu plano.',
        technicalMessage: 'Feature not available for current plan',
        recoveryStrategy: RecoveryStrategy.USER_ACTION,
        retryable: false,
        autoRetryCount: 0,
        autoRetryDelay: 0,
        userActions: ['Fazer upgrade', 'Ver alternativas'],
        logLevel: 'info',
        category: 'features',
        tags: ['feature', 'plan', 'upgrade']
    }
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Obter definição de erro por código
 */
export function getErrorDefinition(code: FunnelErrorCode): FunnelErrorDefinition {
    return FUNNEL_ERROR_DEFINITIONS[code];
}

/**
 * Obter erros por categoria
 */
export function getErrorsByCategory(category: string): FunnelErrorDefinition[] {
    return Object.values(FUNNEL_ERROR_DEFINITIONS)
        .filter(def => def.category === category);
}

/**
 * Obter erros por severidade
 */
export function getErrorsBySeverity(severity: ErrorSeverity): FunnelErrorDefinition[] {
    return Object.values(FUNNEL_ERROR_DEFINITIONS)
        .filter(def => def.severity === severity);
}

/**
 * Verificar se erro é recuperável automaticamente
 */
export function isAutoRecoverable(code: FunnelErrorCode): boolean {
    const def = getErrorDefinition(code);
    return def.retryable && def.autoRetryCount > 0;
}

/**
 * Obter delay de retry para erro
 */
export function getRetryDelay(code: FunnelErrorCode, attempt: number): number {
    const def = getErrorDefinition(code);
    // Exponential backoff: delay * (2 ^ attempt)
    return def.autoRetryDelay * Math.pow(2, attempt);
}

/**
 * Verificar se erro requer ação do usuário
 */
export function requiresUserAction(code: FunnelErrorCode): boolean {
    const def = getErrorDefinition(code);
    return def.recoveryStrategy === RecoveryStrategy.USER_ACTION;
}

/**
 * Obter todas as tags de erro disponíveis
 */
export function getAllErrorTags(): string[] {
    const tags = new Set<string>();
    Object.values(FUNNEL_ERROR_DEFINITIONS).forEach(def => {
        def.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

/**
 * Buscar erros por tags
 */
export function getErrorsByTags(tags: string[]): FunnelErrorDefinition[] {
    return Object.values(FUNNEL_ERROR_DEFINITIONS)
        .filter(def => tags.some(tag => def.tags.includes(tag)));
}
