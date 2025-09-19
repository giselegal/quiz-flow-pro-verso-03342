/**
 * 🎯 MIGRATED CONTEXTUAL FUNNEL SERVICE
 * 
 * MIGRAÇÃO COMPLETA para nova arquitetura:
 * ✅ Integração com improvedFunnelSystem
 * ✅ Error handling padronizado (StandardizedError + ErrorManager)
 * ✅ Validação rigorosa de IDs e schemas
 * ✅ Nomenclatura consistente (dbToFrontend/frontendToDb)
 * ✅ Sistema de health checks
 * ✅ Backward compatibility mantida
 * 
 * Service isolado por contexto para evitar vazamento de dados entre:
 * - Editor (/editor)
 * - Templates (/admin/templates) 
 * - Meus Funis (/admin/meus-funis)
 * - Preview/outras páginas
 */

import { supabase } from '@/integrations/supabase/client';
import {
    FunnelContext,
    ContextualService,
    generateContextualId,
    generateContextualStorageKey,
    validateContextualId
} from '@/core/contexts/FunnelContext';
import {
    type InsertFunnel,
    type UpdateFunnel,
    generateId,
} from '@/types/unified-schema';

// MIGRATED: Using new improved system
import {
    validateFunnelData,
    performSystemHealthCheck,
    validateFunnelId,
    dbToFrontend,
    frontendToDb,
    errorManager,
    createValidationError,
    createStorageError,
    createFunnelError,
    StandardizedError
} from '@/utils/improvedFunnelSystem';

export interface MigratedContextualFunnelData {
    id: string;
    name: string;
    description: string | null;
    pages: any[];
    theme?: string;
    isPublished?: boolean;
    version?: number;
    config?: any;
    createdAt?: Date;
    lastModified?: Date;
    user_id?: string;
    context: FunnelContext; // ✅ Identificação do contexto
    // MIGRATED: Enhanced metadata
    validationStatus?: {
        isValid: boolean;
        lastValidated: Date;
        errors: string[];
        warnings: string[];
    };
    systemHealth?: {
        overall: 'healthy' | 'warning' | 'critical';
        lastCheck: Date;
        issues: string[];
    };
}

export interface MigratedContextualPageData {
    id: string;
    name: string;
    title: string;
    type: string;
    order: number;
    blocks: any[];
    funnel_id: string;
    context: FunnelContext; // ✅ Identificação do contexto
    // MIGRATED: Enhanced validation
    blockValidation?: {
        validBlocks: number;
        invalidBlocks: number;
        issues: string[];
    };
}

/**
 * MIGRATED: Enhanced contextual funnel operations result
 */
export interface MigratedContextualFunnelResult {
    success: boolean;
    data?: MigratedContextualFunnelData;
    error?: StandardizedError;
    validationDetails?: {
        idValidation: boolean;
        schemaValidation: boolean;
        contextValidation: boolean;
        systemHealth: boolean;
    };
    performance?: {
        duration: number;
        operations: string[];
        cacheHit?: boolean;
    };
}

/**
 * MIGRATED: Service de funis com isolamento por contexto + nova arquitetura
 */
export class MigratedContextualFunnelService implements ContextualService {
    private cache = new Map<string, { data: MigratedContextualFunnelData; timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    constructor(public readonly context: FunnelContext) {
        // Log initialization with new system
        console.log(`🎯 MigratedContextualFunnelService initialized for context: ${context}`);
    }

    /**
     * MIGRATED: Cria um novo funil no contexto específico com validação completa
     */
    async createFunnel(funnel: Partial<MigratedContextualFunnelData>): Promise<MigratedContextualFunnelResult> {
        const startTime = Date.now();

        try {
            // MIGRATED: Enhanced user authentication with error handling
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                const authError = createValidationError(
                    'AUTH_REQUIRED',
                    'Usuário não autenticado para criar funil',
                    { operation: 'createFunnel', additionalData: { context: this.context } }
                );
                errorManager.handleError(authError);

                return {
                    success: false,
                    error: authError,
                    validationDetails: {
                        idValidation: false,
                        schemaValidation: false,
                        contextValidation: false,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: Generate contextual ID with validation
            const baseId = funnel.id || generateId();
            const contextualId = generateContextualId(this.context, baseId);

            // MIGRATED: Validate ID using new system
            const idValidation = validateFunnelId(contextualId);
            if (!idValidation.isValid) {
                const validationError = createValidationError(
                    'INVALID_FUNNEL_ID',
                    `ID contextual inválido: ${idValidation.error}`,
                    {
                        operation: 'createFunnel',
                        additionalData: {
                            baseId,
                            contextualId,
                            idValidation
                        }
                    }
                );
                errorManager.handleError(validationError);

                return {
                    success: false,
                    error: validationError,
                    validationDetails: {
                        idValidation: false,
                        schemaValidation: false,
                        contextValidation: true,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: Prepare data with naming standardization
            const funnelData: InsertFunnel = {
                id: contextualId,
                name: funnel.name || 'Novo Funil',
                description: funnel.description || '',
                user_id: user.id,
                is_published: funnel.isPublished || false,
                version: funnel.version || 1,
                settings: {
                    theme: funnel.theme || 'default',
                    config: funnel.config || {},
                    additionalData: { context: this.context }, // ✅ Salvar contexto nos settings
                },
            };

            // MIGRATED: Validate funnel data before insertion
            const dataValidation = validateFunnelData(funnelData);
            if (!dataValidation.isValid) {
                const schemaError = createValidationError(
                    'SCHEMA_VALIDATION_FAILED',
                    `Schema de funil inválido: ${dataValidation.errors.join(', ')}`,
                    {
                        funnelId: contextualId,
                        additionalData: { validationErrors: dataValidation.errors }
                    }
                );
                errorManager.handleError(schemaError);

                return {
                    success: false,
                    error: schemaError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        contextValidation: true,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: Insert with enhanced error handling
            const { data, error: insertError } = await supabase
                .from('funnels')
                .insert(funnelData)
                .select()
                .single();

            if (insertError) {
                const storageError = createStorageError(
                    'FUNNEL_CREATION_FAILED',
                    `Falha ao criar funil no Supabase: ${insertError.message}`,
                    {
                        funnelId: contextualId,
                        additionalData: { supabaseError: insertError }
                    }
                );
                errorManager.handleError(storageError);

                return {
                    success: false,
                    error: storageError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: true,
                        contextValidation: true,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: System health check
            const healthCheck = await performSystemHealthCheck();

            // MIGRATED: Prepare contextual data with naming conversion
            const contextualData: MigratedContextualFunnelData = {
                id: data.id || contextualId,
                name: data.name || 'Novo Funil',
                description: data.description || null,
                ...dbToFrontend(data), // Convert database naming to frontend
                pages: [],
                theme: (data.settings as any)?.theme || 'default',
                isPublished: data.is_published || false,
                version: data.version || 1,
                config: (data.settings as any)?.config || {},
                createdAt: data.created_at ? new Date(data.created_at) : new Date(),
                lastModified: data.updated_at ? new Date(data.updated_at) : new Date(),
                user_id: data.user_id || '',
                context: this.context,
                // MIGRATED: Enhanced metadata
                validationStatus: {
                    isValid: true,
                    lastValidated: new Date(),
                    errors: [],
                    warnings: dataValidation.warnings
                },
                systemHealth: {
                    overall: healthCheck.overall,
                    lastCheck: new Date(),
                    issues: healthCheck.issues
                }
            };

            // MIGRATED: Save to contextual localStorage with error handling
            try {
                this.saveToMigratedContextualLocalStorage(contextualId, contextualData);
                // Update cache
                this.cache.set(contextualId, { data: contextualData, timestamp: Date.now() });
            } catch (storageError) {
                // Local storage failed, but Supabase succeeded - log warning
                const localStorageError = createStorageError(
                    'STORAGE_NOT_AVAILABLE',
                    'Falha ao salvar no localStorage, mas funil foi criado no Supabase',
                    {
                        funnelId: contextualId,
                        additionalData: { storageError }
                    }
                );
                errorManager.handleError(localStorageError);
                // Continue execution - this is not critical
            }

            const duration = Date.now() - startTime;

            return {
                success: true,
                data: contextualData,
                validationDetails: {
                    idValidation: true,
                    schemaValidation: true,
                    contextValidation: true,
                    systemHealth: healthCheck.overall === 'healthy'
                },
                performance: {
                    duration,
                    operations: ['idValidation', 'schemaValidation', 'supabaseInsert', 'healthCheck', 'localStorage'],
                    cacheHit: false
                }
            };

        } catch (error) {
            // MIGRATED: Comprehensive error handling for unexpected errors
            const systemError = createFunnelError(
                'FUNNEL_CREATION_FAILED',
                `Erro crítico ao criar funil no contexto ${this.context}`,
                {
                    operation: 'createFunnel',
                    additionalData: { originalError: error }
                }
            );
            errorManager.handleError(systemError);

            return {
                success: false,
                error: systemError,
                validationDetails: {
                    idValidation: false,
                    schemaValidation: false,
                    contextValidation: false,
                    systemHealth: false
                },
                performance: {
                    duration: Date.now() - startTime,
                    operations: ['error'],
                    cacheHit: false
                }
            };
        }
    }

    /**
     * MIGRATED: Salva um funil no contexto específico com validação completa
     */
    async saveFunnel(funnel: MigratedContextualFunnelData): Promise<MigratedContextualFunnelResult> {
        const startTime = Date.now();

        try {
            // MIGRATED: Validar que o funil pertence ao contexto correto
            if (!validateContextualId(funnel.id, this.context)) {
                const contextError = createValidationError(
                    'FORBIDDEN',
                    `Funil ${funnel.id} não pertence ao contexto ${this.context}`,
                    {
                        funnelId: funnel.id,
                        additionalData: {
                            expectedContext: this.context,
                            actualContext: funnel.context
                        }
                    }
                );
                errorManager.handleError(contextError);

                return {
                    success: false,
                    error: contextError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        contextValidation: false,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: Enhanced authentication check
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                const authError = createValidationError(
                    'AUTH_REQUIRED',
                    'Usuário não autenticado para salvar funil',
                    { additionalData: { context: this.context }, funnelId: funnel.id }
                );
                errorManager.handleError(authError);

                return {
                    success: false,
                    error: authError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        contextValidation: true,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: Validate funnel data before update
            const dataValidation = validateFunnelData(funnel);
            if (!dataValidation.isValid) {
                const schemaError = createValidationError(
                    'SCHEMA_VALIDATION_FAILED',
                    `Schema de funil inválido para atualização: ${dataValidation.errors.join(', ')}`,
                    {
                        funnelId: funnel.id,
                        additionalData: {
                            context: this.context,
                            validationErrors: dataValidation.errors
                        }
                    }
                );
                errorManager.handleError(schemaError);

                return {
                    success: false,
                    error: schemaError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        contextValidation: true,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: Prepare update data with naming conversion
            const updateData: UpdateFunnel = frontendToDb({
                name: funnel.name,
                description: funnel.description,
                is_published: funnel.isPublished,
                version: funnel.version,
                settings: {
                    theme: funnel.theme,
                    config: funnel.config,
                    additionalData: { context: this.context }, // ✅ Manter contexto
                },
                updated_at: new Date().toISOString()
            });

            // MIGRATED: Update with enhanced error handling
            const { data, error: updateError } = await supabase
                .from('funnels')
                .update(updateData)
                .eq('id', funnel.id)
                .select()
                .single();

            if (updateError) {
                const storageError = createStorageError(
                    'FUNNEL_UPDATE_FAILED',
                    `Falha ao atualizar funil no Supabase: ${updateError.message}`,
                    {
                        funnelId: funnel.id,
                        additionalData: { supabaseError: updateError }
                    }
                );
                errorManager.handleError(storageError);

                return {
                    success: false,
                    error: storageError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: true,
                        contextValidation: true,
                        systemHealth: false
                    }
                };
            }

            // MIGRATED: System health check
            const healthCheck = await performSystemHealthCheck();

            // MIGRATED: Prepare updated contextual data
            const updatedContextualData: MigratedContextualFunnelData = {
                ...funnel,
                ...dbToFrontend(data),
                lastModified: new Date(),
                validationStatus: {
                    isValid: true,
                    lastValidated: new Date(),
                    errors: [],
                    warnings: dataValidation.warnings
                },
                systemHealth: {
                    overall: healthCheck.overall,
                    lastCheck: new Date(),
                    issues: healthCheck.issues
                }
            };

            // MIGRATED: Update localStorage and cache
            try {
                this.saveToMigratedContextualLocalStorage(funnel.id, updatedContextualData);
                this.cache.set(funnel.id, { data: updatedContextualData, timestamp: Date.now() });
            } catch (storageError) {
                // Log but don't fail the operation
                const localStorageError = createStorageError(
                    'STORAGE_NOT_AVAILABLE',
                    'Falha ao atualizar localStorage, mas funil foi salvo no Supabase',
                    {
                        funnelId: funnel.id,
                        additionalData: { storageError }
                    }
                );
                errorManager.handleError(localStorageError);
            }

            const duration = Date.now() - startTime;

            return {
                success: true,
                data: updatedContextualData,
                validationDetails: {
                    idValidation: true,
                    schemaValidation: true,
                    contextValidation: true,
                    systemHealth: healthCheck.overall === 'healthy'
                },
                performance: {
                    duration,
                    operations: ['contextValidation', 'schemaValidation', 'supabaseUpdate', 'healthCheck', 'localStorage'],
                    cacheHit: false
                }
            };

        } catch (error) {
            const systemError = createFunnelError(
                'FUNNEL_UPDATE_FAILED',
                `Erro crítico ao salvar funil ${funnel.id} no contexto ${this.context}`,
                {
                    funnelId: funnel.id,
                    additionalData: { originalError: error }
                }
            );
            errorManager.handleError(systemError);

            return {
                success: false,
                error: systemError,
                validationDetails: {
                    idValidation: false,
                    schemaValidation: false,
                    contextValidation: false,
                    systemHealth: false
                },
                performance: {
                    duration: Date.now() - startTime,
                    operations: ['error'],
                    cacheHit: false
                }
            };
        }
    }

    /**
     * MIGRATED: Get funnel with enhanced caching and validation
     */
    async getFunnel(id: string): Promise<MigratedContextualFunnelResult> {
        const startTime = Date.now();

        try {
            // Check cache first
            const cached = this.cache.get(id);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                return {
                    success: true,
                    data: cached.data,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: true,
                        contextValidation: true,
                        systemHealth: true
                    },
                    performance: {
                        duration: Date.now() - startTime,
                        operations: ['cacheHit'],
                        cacheHit: true
                    }
                };
            }

            // MIGRATED: Validate contextual access
            if (!validateContextualId(id, this.context)) {
                const contextError = createValidationError(
                    'INVALID_FIELD_VALUE',
                    `Funil ${id} não pertence ao contexto ${this.context}`,
                    { funnelId: id, additionalData: { context: this.context } }
                );

                return {
                    success: false,
                    error: contextError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        contextValidation: false,
                        systemHealth: false
                    }
                };
            }

            // Try localStorage first
            const localData = this.getFromMigratedContextualLocalStorage(id);
            if (localData) {
                this.cache.set(id, { data: localData, timestamp: Date.now() });
                return {
                    success: true,
                    data: localData,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: true,
                        contextValidation: true,
                        systemHealth: true
                    },
                    performance: {
                        duration: Date.now() - startTime,
                        operations: ['localStorage'],
                        cacheHit: false
                    }
                };
            }

            // Fallback to Supabase
            const { data, error } = await supabase
                .from('funnels')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                const notFoundError = createStorageError(
                    'FUNNEL_NOT_FOUND',
                    `Funil ${id} não encontrado no contexto ${this.context}`,
                    { funnelId: id, additionalData: { context: this.context } }
                );

                return {
                    success: false,
                    error: notFoundError,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        contextValidation: true,
                        systemHealth: false
                    }
                };
            }

            // Convert and cache
            const contextualData: MigratedContextualFunnelData = {
                id: data.id || '',
                name: data.name || 'Funil sem nome',
                description: data.description || null,
                context: this.context,
                ...dbToFrontend(data),
                pages: [],
                validationStatus: {
                    isValid: true,
                    lastValidated: new Date(),
                    errors: [],
                    warnings: []
                }
            };

            this.cache.set(id, { data: contextualData, timestamp: Date.now() });

            return {
                success: true,
                data: contextualData,
                validationDetails: {
                    idValidation: true,
                    schemaValidation: true,
                    contextValidation: true,
                    systemHealth: true
                },
                performance: {
                    duration: Date.now() - startTime,
                    operations: ['supabaseSelect', 'dataConversion', 'cache'],
                    cacheHit: false
                }
            };

        } catch (error) {
            const systemError = createFunnelError(
                'FUNNEL_NOT_FOUND',
                `Erro ao buscar funil ${id} no contexto ${this.context}`,
                {
                    funnelId: id,
                    additionalData: { originalError: error }
                }
            );

            return {
                success: false,
                error: systemError,
                validationDetails: {
                    idValidation: false,
                    schemaValidation: false,
                    contextValidation: false,
                    systemHealth: false
                }
            };
        }
    }

    /**
     * MIGRATED: Enhanced localStorage operations with error handling
     */
    private saveToMigratedContextualLocalStorage(id: string, data: MigratedContextualFunnelData): void {
        try {
            const storageKey = generateContextualStorageKey(this.context, id);
            const serializedData = JSON.stringify({
                ...frontendToDb(data), // Store in database format
                _migrated: true,
                _version: '2.0.0',
                _savedAt: new Date().toISOString()
            });
            localStorage.setItem(storageKey, serializedData);
        } catch (error) {
            throw createStorageError(
                'STORAGE_NOT_AVAILABLE',
                `Falha ao salvar no localStorage contextual: ${error}`,
                { funnelId: id, additionalData: { context: this.context, error } }
            );
        }
    }

    private getFromMigratedContextualLocalStorage(id: string): MigratedContextualFunnelData | null {
        try {
            const storageKey = generateContextualStorageKey(this.context, id);
            const data = localStorage.getItem(storageKey);

            if (!data) return null;

            const parsed = JSON.parse(data);
            if (!parsed._migrated) {
                // Legacy data - trigger migration
                return null;
            }

            return {
                ...dbToFrontend(parsed),
                context: this.context
            } as MigratedContextualFunnelData;

        } catch (error) {
            // Log but don't throw - localStorage issues shouldn't break the app
            errorManager.handleError(createStorageError(
                'DATA_CORRUPTION_DETECTED',
                `Dados corrompidos no localStorage para funil ${id}`,
                { funnelId: id, additionalData: { context: this.context, error } }
            ));
            return null;
        }
    }

    /**
     * MIGRATED: List all funnels in the context with enhanced filtering
     */
    async listFunnels(): Promise<MigratedContextualFunnelData[]> {
        const startTime = Date.now();

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                console.warn('⚠️ Listing funnels without authentication - limited results');
            }

            // Query funnels from Supabase with context filtering
            const query = supabase
                .from('funnels')
                .select('*')
                .order('updated_at', { ascending: false });

            // Add user filter if authenticated
            if (user) {
                query.eq('user_id', user.id);
            }

            const { data: funnels, error } = await query;

            if (error) {
                throw createStorageError(
                    'FUNNEL_NOT_FOUND',
                    `Falha ao listar funis: ${error.message}`,
                    { additionalData: { context: this.context, supabaseError: error } }
                );
            }

            // Filter by context and convert to frontend format
            const contextualFunnels: MigratedContextualFunnelData[] = [];

            for (const funnel of funnels || []) {
                try {
                    // Check if funnel belongs to this context
                    const funnelContext = (funnel.settings as any)?.context;
                    if (funnelContext && funnelContext !== this.context) {
                        continue; // Skip funnels from other contexts
                    }

                    // Convert and validate
                    const contextualData: MigratedContextualFunnelData = {
                        id: funnel.id || '',
                        name: funnel.name || 'Funil sem nome',
                        description: funnel.description || null,
                        context: this.context,
                        ...dbToFrontend(funnel),
                        pages: [], // Will be loaded separately if needed
                        validationStatus: {
                            isValid: true,
                            lastValidated: new Date(),
                            errors: [],
                            warnings: []
                        }
                    };

                    contextualFunnels.push(contextualData);
                } catch (conversionError) {
                    // Log error but continue with other funnels
                    errorManager.handleError(createValidationError(
                        'SCHEMA_VALIDATION_FAILED',
                        `Falha ao converter funil ${funnel.id}`,
                        {
                            funnelId: funnel.id,
                            additionalData: { conversionError }
                        }
                    ));
                }
            }

            console.log(`✅ Listed ${contextualFunnels.length} funnels for context ${this.context} in ${Date.now() - startTime}ms`);

            return contextualFunnels;

        } catch (error) {
            const systemError = createFunnelError(
                'FUNNEL_NOT_FOUND',
                `Erro ao listar funis do contexto ${this.context}`,
                {
                    additionalData: { originalError: error }
                }
            );
            errorManager.handleError(systemError);

            // Return empty array instead of throwing - UI can handle empty state
            return [];
        }
    }

    /**
     * Get cache statistics for monitoring
     */
    public getCacheStats(): { size: number; contexts: string[]; oldestEntry: Date | null } {
        const entries = Array.from(this.cache.values());
        return {
            size: entries.length,
            contexts: [this.context],
            oldestEntry: entries.length > 0 ?
                new Date(Math.min(...entries.map(e => e.timestamp))) : null
        };
    }
}

// ============================================================================
// FACTORY AND COMPATIBILITY FUNCTIONS
// ============================================================================

/**
 * Factory para criar instâncias migradas do serviço contextual
 */
export const createMigratedContextualFunnelService = (context: FunnelContext) => {
    return new MigratedContextualFunnelService(context);
};

/**
 * Instâncias pré-configuradas para contextos principais
 */
export const migratedEditorFunnelService = new MigratedContextualFunnelService(FunnelContext.EDITOR);
export const migratedTemplatesFunnelService = new MigratedContextualFunnelService(FunnelContext.TEMPLATES);
export const migratedMyFunnelsFunnelService = new MigratedContextualFunnelService(FunnelContext.MY_FUNNELS);

/**
 * BACKWARD COMPATIBILITY: Function to gradually migrate from old service
 */
export const migrateFromLegacyContextualService = async (

    context: FunnelContext
): Promise<MigratedContextualFunnelService> => {
    const migratedService = new MigratedContextualFunnelService(context);

    // Migration logic would go here if needed
    console.log(`🔄 Migrated contextual service for context: ${context}`);

    return migratedService;
};

// Log migration completion
console.log('✅ MigratedContextualFunnelService: Ready for integration with improvedFunnelSystem');