/**
 * 🎯 FUNNEL UNIFIED SERVICE
 * 
 * Serviço único e centralizado para TODAS as operações de funis:
 * - CRUD completo (Create, Read, Update, Delete)
 * - Deep clone automático para isolamento de instâncias
 * - Cache inteligente com invalidação automática
 * - Validação robusta integrada
 * - Sincronização entre contextos
 * - Fallbacks e recuperação de erro
 */

import { supabase } from '@/integrations/supabase/client';
import { indexedDBService } from './storage/IndexedDBService';
import { FunnelContext } from '@/core/contexts/FunnelContext';
// MIGRATED: Using new validation service
import { migratedFunnelValidationService } from '@/services/migratedFunnelValidationService';
import { errorManager, createValidationError } from '@/utils/errorHandling';
import { deepClone } from '@/utils/cloneFunnel';

// UNIFIED SCHEMAS: Import from centralized type definitions
import {
    UnifiedFunnelData,
    CreateFunnelOptions,
    UpdateFunnelOptions,
    ListFunnelOptions,
    FunnelPermissions,
    validateUnifiedFunnelData,
    validateCreateFunnelOptions,
    validateUpdateFunnelOptions,
    normalizePages,
    normalizeUnifiedFunnelData
} from '@/types/schemas';

// Re-export for backward compatibility
export type {
    UnifiedFunnelData,
    CreateFunnelOptions,
    UpdateFunnelOptions,
    ListFunnelOptions,
    FunnelPermissions
};

// ============================================================================
// CACHE INTELIGENTE
// ============================================================================

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
    context?: FunnelContext;
    userId?: string;
}

class FunnelCache {
    private cache = new Map<string, CacheEntry<any>>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

    set<T>(key: string, data: T, ttl?: number, context?: FunnelContext, userId?: string): void {
        this.cache.set(key, {
            data: deepClone(data), // Deep clone para isolamento
            timestamp: Date.now(),
            ttl: ttl || this.DEFAULT_TTL,
            context,
            userId
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Verificar expiração
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return deepClone(entry.data); // Deep clone para isolamento
    }

    invalidate(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    invalidateByContext(context: FunnelContext): void {
        for (const [key, entry] of this.cache.entries()) {
            if (entry.context === context) {
                this.cache.delete(key);
            }
        }
    }

    invalidateByUser(userId: string): void {
        for (const [key, entry] of this.cache.entries()) {
            if (entry.userId === userId) {
                this.cache.delete(key);
            }
        }
    }
}

// ============================================================================
// EVENT SYSTEM PARA SINCRONIZAÇÃO
// ============================================================================

type FunnelEventType = 'created' | 'updated' | 'deleted' | 'published' | 'unpublished';

interface FunnelEvent {
    type: FunnelEventType;
    funnelId: string;
    data?: any;
    context: FunnelContext;
    userId: string;
    timestamp: number;
}

class FunnelEventEmitter {
    private listeners = new Map<string, Function[]>();

    on(event: FunnelEventType, listener: (event: FunnelEvent) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(listener);
    }

    off(event: FunnelEventType, listener: Function): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(listener);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    emit(event: FunnelEvent): void {
        const eventListeners = this.listeners.get(event.type);
        if (eventListeners) {
            eventListeners.forEach(listener => {
                try {
                    listener(event);
                } catch (error) {
                    console.error('🔥 Error in funnel event listener:', error);
                }
            });
        }
    }
}

// ============================================================================
// FUNNEL UNIFIED SERVICE
// ============================================================================

export class FunnelUnifiedService {
    private static instance: FunnelUnifiedService;
    private cache = new FunnelCache();
    private eventEmitter = new FunnelEventEmitter();

    private constructor() {
        // Setup cache invalidation listeners
        this.setupEventListeners();

        // Inicializar IndexedDB
        this.initializeIndexedDB();
    }

    private async initializeIndexedDB(): Promise<void> {
        try {
            await indexedDBService.init();
            console.log('✅ FunnelUnifiedService: IndexedDB inicializado com sucesso');

            // Verificar se é a primeira vez e migrar dados do localStorage
            await this.migrateFromLocalStorage();
        } catch (error) {
            console.error('❌ FunnelUnifiedService: Erro ao inicializar IndexedDB:', error);
            console.log('⚠️ Usando localStorage como fallback');
        }
    }

    private async migrateFromLocalStorage(): Promise<void> {
        const migrationKey = 'funnel_unified_migration_completed';

        // Verificar se já foi migrado
        if (localStorage.getItem(migrationKey)) {
            console.log('✅ Migração do localStorage já foi concluída');
            return;
        }

        try {
            console.log('🔄 Iniciando migração do localStorage para IndexedDB...');
            let migratedCount = 0;

            // Migrar todos os funis do localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('unified_funnel:')) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        try {
                            const funnel = JSON.parse(data);
                            await indexedDBService.save('funnels', funnel.id, funnel, {
                                userId: funnel.userId,
                                context: funnel.context,
                                tags: [funnel.category]
                            });
                            migratedCount++;
                        } catch (parseError) {
                            console.warn('⚠️ Erro ao migrar funil:', key, parseError);
                        }
                    }
                }
            }

            // Marcar migração como concluída
            localStorage.setItem(migrationKey, new Date().toISOString());

            if (migratedCount > 0) {
                console.log(`✅ Migração concluída: ${migratedCount} funis migrados para IndexedDB`);
            } else {
                console.log('ℹ️ Nenhum funil encontrado para migrar');
            }

        } catch (error) {
            console.error('❌ Erro durante migração:', error);
        }
    }

    static getInstance(): FunnelUnifiedService {
        if (!this.instance) {
            this.instance = new FunnelUnifiedService();
        }
        return this.instance;
    }

    // ========================================================================
    // EVENT MANAGEMENT
    // ========================================================================

    on(event: FunnelEventType, listener: (event: FunnelEvent) => void): void {
        this.eventEmitter.on(event, listener);
    }

    off(event: FunnelEventType, listener: Function): void {
        this.eventEmitter.off(event, listener);
    }

    private async emit(type: FunnelEventType, funnelId: string, data?: any, context?: FunnelContext, userId?: string): Promise<void> {
        // 🔐 Se userId não fornecido, buscar o atual para consistência
        const finalUserId = userId || await this.getCurrentUserId();

        this.eventEmitter.emit({
            type,
            funnelId,
            data,
            context: context || FunnelContext.EDITOR,
            userId: finalUserId,
            timestamp: Date.now()
        });
    }

    private setupEventListeners(): void {
        // Invalidar cache quando houver mudanças
        this.on('updated', (event) => {
            this.cache.invalidate(event.funnelId);
        });

        this.on('deleted', (event) => {
            this.cache.invalidate(event.funnelId);
        });
    }

    // ========================================================================
    // PRIVATE UTILITY METHODS
    // ========================================================================

    /**
     * 🔐 Obter ID do usuário atual
     */
    private async getCurrentUserId(): Promise<string> {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user?.id) {
                return 'anonymous';
            }
            return data.user.id;
        } catch (error) {
            console.warn('⚠️ Erro ao obter usuário atual:', error);
            return 'anonymous';
        }
    }

    /**
     * 🔄 Converter dados do formato Supabase para UnifiedFunnelData
     */
    private convertFromSupabaseFormat(data: any): UnifiedFunnelData {
        if (!data) {
            throw new Error('❌ Dados do Supabase são null ou undefined');
        }

        try {
            return {
                id: data.id,
                name: data.name || 'Funil sem nome',
                description: data.description || '',
                category: data.settings?.category || 'outros', // Extrair categoria de settings
                context: data.settings?.context || FunnelContext.EDITOR,
                userId: data.user_id || 'anonymous',
                settings: data.settings || {},
                pages: data.pages || [],
                isPublished: data.is_published || false,
                version: data.version || 1,
                createdAt: new Date(data.created_at || Date.now()),
                updatedAt: new Date(data.updated_at || Date.now()),
                templateId: data.settings?.templateId,
                isFromTemplate: data.settings?.isFromTemplate || false
            };
        } catch (error) {
            console.error('❌ Erro ao converter dados do Supabase:', error);
            throw new Error(`Falha na conversão dos dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    // ========================================================================
    // CRUD OPERATIONS
    // ========================================================================

    /**
     * Cria um novo funil com deep clone automático
     */
    async createFunnel(options: CreateFunnelOptions): Promise<UnifiedFunnelData> {
        console.log('🎯 FunnelUnifiedService: Creating funnel', options);

        try {
            // Gerar ID único
            const id = this.generateUniqueId();
            const userId = options.userId || await this.getCurrentUserId();

            // Validação de entrada
            if (!options.name?.trim()) {
                throw new Error('Nome do funil é obrigatório');
            }

            // Criar dados base
            const funnelData: UnifiedFunnelData = {
                id,
                name: options.name.trim(),
                description: options.description || '',
                category: options.category || 'outros',
                context: options.context,
                userId,
                settings: {},
                pages: [],
                isPublished: options.autoPublish || false,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                templateId: options.templateId,
                isFromTemplate: !!options.templateId
            };

            // Se for baseado em template, aplicar deep clone
            if (options.templateId) {
                await this.applyTemplateToFunnel(funnelData, options.templateId);
            }

            // Salvar no Supabase
            const savedFunnel = await this.saveToSupabase(funnelData);

            // Cache com isolamento
            this.cache.set(
                `funnel:${id}`,
                savedFunnel,
                undefined,
                options.context,
                userId
            );

            // Invalidar cache de listas
            this.cache.invalidateByContext(options.context);
            this.cache.invalidateByUser(userId);

            // Emitir evento
            await this.emit('created', id, savedFunnel, options.context, userId);

            console.log('✅ Funil criado com sucesso:', savedFunnel);
            return savedFunnel;

        } catch (error) {
            console.error('❌ Erro ao criar funil:', error);
            throw error;
        }
    }

    /**
     * Obtém um funil por ID com cache inteligente
     */
    async getFunnel(id: string, userId?: string): Promise<UnifiedFunnelData | null> {
        console.log('📖 FunnelUnifiedService: Getting funnel', id);

        try {
            // Verificar cache primeiro
            const cached = this.cache.get<UnifiedFunnelData>(`funnel:${id}`);
            if (cached) {
                console.log('💾 Funil carregado do cache:', id);
                return cached;
            }

            // Buscar no Supabase
            const funnel = await this.loadFromSupabase(id, userId);

            if (funnel) {
                // Cache com deep clone
                this.cache.set(
                    `funnel:${id}`,
                    funnel,
                    undefined,
                    funnel.context,
                    funnel.userId
                );

                console.log('✅ Funil carregado do Supabase:', id);
                return deepClone(funnel); // Deep clone para isolamento
            }

            console.log('❌ Funil não encontrado:', id);
            return null;

        } catch (error) {
            console.error('❌ Erro ao carregar funil:', error);

            // Tentar fallback IndexedDB
            return await this.loadFromIndexedDB(id);
        }
    }

    /**
     * Atualiza um funil existente
     */
    async updateFunnel(id: string, updates: UpdateFunnelOptions, userId?: string): Promise<UnifiedFunnelData> {
        console.log('✏️ FunnelUnifiedService: Updating funnel', id, updates);

        try {
            // Carregar funil atual
            const currentFunnel = await this.getFunnel(id, userId);
            if (!currentFunnel) {
                throw new Error(`Funil não encontrado: ${id}`);
            }

            // Verificar permissões
            const permissions = await this.checkPermissions(id, userId);
            if (!permissions.canEdit) {
                throw new Error('Sem permissão para editar este funil');
            }

            // Aplicar updates com deep clone
            const updatedFunnel: UnifiedFunnelData = {
                ...currentFunnel,
                ...deepClone(updates),
                id, // Preservar ID
                userId: currentFunnel.userId, // Preservar owner
                createdAt: currentFunnel.createdAt, // Preservar data criação
                updatedAt: new Date(),
                version: currentFunnel.version + 1
            };

            // Validar dados atualizados
            await this.validateFunnelData(updatedFunnel);

            // Salvar no Supabase
            const savedFunnel = await this.saveToSupabase(updatedFunnel, true);

            // Invalidar cache
            this.cache.invalidate(id);
            this.cache.invalidateByContext(savedFunnel.context);

            // Emitir evento
            await this.emit('updated', id, savedFunnel, savedFunnel.context, savedFunnel.userId);

            console.log('✅ Funil atualizado com sucesso:', savedFunnel);
            return savedFunnel;

        } catch (error) {
            console.error('❌ Erro ao atualizar funil:', error);
            throw error;
        }
    }

    /**
     * Lista funis com filtros e cache inteligente
     */
    async listFunnels(options: ListFunnelOptions = {}): Promise<UnifiedFunnelData[]> {
        console.log('📋 FunnelUnifiedService: Listing funnels', options);

        try {
            const userId = options.userId || await this.getCurrentUserId();
            const cacheKey = `list:${JSON.stringify(options)}:${userId}`;

            // Verificar cache
            const cached = this.cache.get<UnifiedFunnelData[]>(cacheKey);
            if (cached) {
                console.log('💾 Lista carregada do cache');
                return cached;
            }

            // Buscar no Supabase
            const funnels = await this.listFromSupabase(options, userId);

            // Cache com TTL menor para listas
            this.cache.set(
                cacheKey,
                funnels,
                2 * 60 * 1000, // 2 minutos
                options.context,
                userId
            );

            console.log(`✅ ${funnels.length} funis carregados`);
            return deepClone(funnels); // Deep clone para isolamento

        } catch (error) {
            console.error('❌ Erro ao listar funis:', error);

            // Fallback para IndexedDB
            return await this.listFromIndexedDB(options);
        }
    }

    /**
     * Duplica um funil com deep clone total
     */
    async duplicateFunnel(id: string, newName?: string, userId?: string): Promise<UnifiedFunnelData> {
        console.log('🔄 FunnelUnifiedService: Duplicating funnel', id);

        try {
            // Carregar funil original
            const originalFunnel = await this.getFunnel(id, userId);
            if (!originalFunnel) {
                throw new Error(`Funil não encontrado: ${id}`);
            }

            // Verificar permissões
            const permissions = await this.checkPermissions(id, userId);
            if (!permissions.canRead) {
                throw new Error('Sem permissão para acessar este funil');
            }

            // Criar nova instância com deep clone TOTAL
            const duplicatedFunnel = this.deepCloneFunnel(originalFunnel, newName);

            // Criar o funil duplicado
            const newFunnel = await this.createFunnel({
                name: duplicatedFunnel.name,
                description: duplicatedFunnel.description,
                category: duplicatedFunnel.category,
                context: duplicatedFunnel.context,
                userId: userId || duplicatedFunnel.userId
            });

            // Aplicar dados clonados
            const finalFunnel = await this.updateFunnel(newFunnel.id, {
                settings: duplicatedFunnel.settings,
                pages: duplicatedFunnel.pages
            }, userId);

            console.log('✅ Funil duplicado com sucesso:', finalFunnel);
            return finalFunnel;

        } catch (error) {
            console.error('❌ Erro ao duplicar funil:', error);
            throw error;
        }
    }

    /**
     * Remove um funil
     */
    async deleteFunnel(id: string, userId?: string): Promise<boolean> {
        console.log('🗑️ FunnelUnifiedService: Deleting funnel', id);

        try {
            // Verificar permissões
            const permissions = await this.checkPermissions(id, userId);
            if (!permissions.canDelete) {
                throw new Error('Sem permissão para deletar este funil');
            }

            // Carregar dados para eventos
            const funnel = await this.getFunnel(id, userId);

            // Deletar do Supabase
            await this.deleteFromSupabase(id, userId);

            // Invalidar todo cache relacionado
            this.cache.invalidate(id);
            if (funnel) {
                this.cache.invalidateByContext(funnel.context);
                this.cache.invalidateByUser(funnel.userId);
            }

            // Emitir evento
            await this.emit('deleted', id, null, funnel?.context, funnel?.userId);

            console.log('✅ Funil deletado com sucesso:', id);
            return true;

        } catch (error) {
            console.error('❌ Erro ao deletar funil:', error);
            throw error;
        }
    }

    // ========================================================================
    // VALIDAÇÃO E PERMISSÕES
    // ========================================================================

    /**
     * Valida dados do funil - MIGRATED VERSION
     */
    private async validateFunnelData(funnel: UnifiedFunnelData): Promise<void> {
        // MIGRATED: Usar novo serviço de validação
        const validation = await migratedFunnelValidationService.validateFunnelAccess(funnel.id, funnel.userId);

        if (!validation.isValid) {
            const error = createValidationError(
                'SCHEMA_VALIDATION_FAILED',
                `Funil inválido: ${validation.error?.message || 'Erro desconhecido'}`,
                {
                    funnelId: funnel.id,
                    userId: funnel.userId,
                    additionalData: { validationDetails: validation.validationDetails }
                }
            );
            errorManager.handleError(error);
            throw error;
        }
    }

    /**
     * Verifica permissões do usuário para um funil
     */
    async checkPermissions(funnelId: string, userId?: string): Promise<FunnelPermissions> {
        try {
            const funnel = await this.getFunnel(funnelId, userId);
            const currentUserId = userId || await this.getCurrentUserId();

            if (!funnel) {
                return {
                    canRead: false,
                    canEdit: false,
                    canDelete: false,
                    canPublish: false,
                    isOwner: false
                };
            }

            const isOwner = funnel.userId === currentUserId;

            return {
                canRead: true, // Por enquanto todos podem ler
                canEdit: isOwner,
                canDelete: isOwner,
                canPublish: isOwner,
                isOwner
            };

        } catch (error) {
            console.error('❌ Erro ao verificar permissões:', error);
            return {
                canRead: false,
                canEdit: false,
                canDelete: false,
                canPublish: false,
                isOwner: false
            };
        }
    }

    // ========================================================================
    // DEEP CLONE E ISOLAMENTO
    // ========================================================================

    /**
     * Deep clone total de um funil com novos IDs
     */
    private deepCloneFunnel(original: UnifiedFunnelData, newName?: string): UnifiedFunnelData {
        const cloned = deepClone(original);

        // Regenerar IDs únicos
        cloned.id = this.generateUniqueId();
        cloned.name = newName || `${original.name} (Cópia)`;
        cloned.createdAt = new Date();
        cloned.updatedAt = new Date();
        cloned.version = 1;
        cloned.isFromTemplate = false;

        // Regenerar IDs de páginas e blocos
        if (cloned.pages) {
            cloned.pages = cloned.pages.map((page: any) => ({
                ...page,
                id: this.generateUniqueId(),
                funnel_id: cloned.id,
                blocks: (page.blocks || []).map((block: any) => ({
                    ...block,
                    id: this.generateUniqueId()
                }))
            }));
        }

        return cloned;
    }

    /**
     * Aplica template a um funil com deep clone
     */
    private async applyTemplateToFunnel(funnel: UnifiedFunnelData, templateId: string): Promise<void> {
        // TODO: Implementar carregamento e aplicação de template
        console.log('🎨 Aplicando template:', templateId, 'ao funil:', funnel.id);

        // Por enquanto, aplicar estrutura básica
        funnel.settings = deepClone({
            theme: 'default',
            templateId: templateId,
            appliedAt: new Date().toISOString()
        });

        funnel.pages = [];
    }

    // ========================================================================
    // SUPABASE OPERATIONS
    // ========================================================================

    private async saveToSupabase(funnel: UnifiedFunnelData, isUpdate = false): Promise<UnifiedFunnelData> {
        try {
            // ⚡ VERIFICAÇÃO DEFENSIVA: Verificar se supabase está disponível
            if (!supabase || !supabase.from) {
                console.warn('⚠️ Supabase não disponível, salvando no IndexedDB');
                await this.saveToIndexedDB(funnel);
                return funnel;
            }

            // ⚡ VERIFICAÇÃO: Se userId é anonymous ou vazio, usar IndexedDB
            if (!funnel.userId || funnel.userId === 'anonymous' || funnel.userId.startsWith('temp-')) {
                console.warn('⚠️ Usuário não autenticado, salvando no IndexedDB');
                await this.saveToIndexedDB(funnel);
                return funnel;
            }

            // ⚡ VERIFICAÇÃO: Verificar se usuário está autenticado no Supabase
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                console.warn('⚠️ Sem sessão ativa no Supabase, salvando no IndexedDB');
                await this.saveToIndexedDB(funnel);
                return funnel;
            }

            const funnelRecord = {
                id: funnel.id,
                name: funnel.name,
                description: funnel.description,
                user_id: session.user.id, // Usar ID do usuário da sessão ativa
                is_published: funnel.isPublished,
                version: funnel.version,
                settings: {
                    ...funnel.settings,
                    context: funnel.context,
                    templateId: funnel.templateId,
                    isFromTemplate: funnel.isFromTemplate,
                    category: funnel.category // Mantém categoria dentro de settings
                },
                created_at: funnel.createdAt.toISOString(),
                updated_at: funnel.updatedAt.toISOString()
            };

            let result;
            if (isUpdate) {
                // Para update, sempre usar select para retornar os dados
                result = await supabase
                    .from('funnels')
                    .update(funnelRecord)
                    .eq('id', funnel.id)
                    .select()
                    .single();
            } else {
                // Para insert, sempre usar select para retornar os dados
                result = await supabase
                    .from('funnels')
                    .insert([funnelRecord])
                    .select()
                    .single();
            }

            if (result.error) {
                console.error('❌ Erro na operação do Supabase:', result.error);
                throw result.error;
            }

            // 🛡️ VERIFICAÇÃO DEFENSIVA: Garantir que result.data existe
            if (!result.data) {
                console.error('❌ Resultado do Supabase sem dados:', { result, funnel: funnel.name });
                throw new Error('Dados do funnel não foram retornados pelo Supabase');
            }

            // Salvar páginas se existirem
            if (funnel.pages && funnel.pages.length > 0) {
                await this.savePagesToSupabase(funnel.id, funnel.pages);
            }

            return this.convertFromSupabaseFormat(result.data);

        } catch (error) {
            console.error('❌ Erro no Supabase, salvando no IndexedDB:', error);
            await this.saveToIndexedDB(funnel);
            return funnel;
        }
    }

    private async loadFromSupabase(id: string, userId?: string): Promise<UnifiedFunnelData | null> {
        try {
            let query = supabase
                .from('funnels')
                .select('*')
                .eq('id', id);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query.single();

            if (error || !data) {
                return null;
            }

            // Carregar páginas
            const { data: pages } = await supabase
                .from('funnel_pages')
                .select('*')
                .eq('funnel_id', id)
                .order('page_order');

            const funnel = this.convertFromSupabaseFormat(data);
            funnel.pages = normalizePages(pages || []);

            return funnel;

        } catch (error) {
            console.error('❌ Erro ao carregar do Supabase:', error);
            return null;
        }
    }

    private async listFromSupabase(options: ListFunnelOptions, userId: string): Promise<UnifiedFunnelData[]> {
        try {
            let query = supabase
                .from('funnels')
                .select('*')
                .eq('user_id', userId);

            if (options.category) {
                query = query.eq('category', options.category);
            }

            if (!options.includeUnpublished) {
                query = query.eq('is_published', true);
            }

            if (options.context) {
                query = query.contains('settings', { context: options.context });
            }

            query = query.order('updated_at', { ascending: false });

            if (options.limit) {
                query = query.limit(options.limit);
            }

            if (options.offset) {
                query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return (data || [])
                .filter(item => item && typeof item === 'object') // 🛡️ Filtrar itens inválidos
                .map(item => this.convertFromSupabaseFormat(item));

        } catch (error) {
            console.error('❌ Erro ao listar do Supabase:', error);
            return [];
        }
    }

    private async deleteFromSupabase(id: string, userId?: string): Promise<void> {
        try {
            // Deletar páginas primeiro
            await supabase
                .from('funnel_pages')
                .delete()
                .eq('funnel_id', id);

            // Deletar funil
            let query = supabase
                .from('funnels')
                .delete()
                .eq('id', id);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { error } = await query;

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('❌ Erro ao deletar do Supabase:', error);
            throw error;
        }
    }

    private async savePagesToSupabase(funnelId: string, pages: any[]): Promise<void> {
        try {
            // Deletar páginas existentes
            await supabase
                .from('funnel_pages')
                .delete()
                .eq('funnel_id', funnelId);

            // Inserir páginas atualizadas
            if (pages.length > 0) {
                const pageRecords = pages.map((page, index) => ({
                    id: page.id || this.generateUniqueId(),
                    funnel_id: funnelId,
                    page_type: page.type || 'content',
                    page_order: index,
                    title: page.title || page.name || `Página ${index + 1}`,
                    blocks: page.blocks || []
                }));

                const { error } = await supabase
                    .from('funnel_pages')
                    .insert(pageRecords);

                if (error) {
                    throw error;
                }
            }

        } catch (error) {
            console.error('❌ Erro ao salvar páginas:', error);
            throw error;
        }
    }

    // ========================================================================
    // INDEXEDDB FALLBACK (SUBSTITUI LOCALSTORAGE)
    // ========================================================================

    private async saveToIndexedDB(funnel: UnifiedFunnelData): Promise<void> {
        try {
            console.log('💾 Salvando no IndexedDB:', funnel.name);

            // Salvar o funil completo
            await indexedDBService.save('funnels', funnel.id, funnel, {
                userId: funnel.userId,
                context: funnel.context,
                tags: [funnel.category]
            });

            console.log('✅ Funil salvo no IndexedDB com sucesso');
        } catch (error) {
            console.error('❌ Erro ao salvar no IndexedDB, fallback para localStorage:', error);
            this.saveToLocalStorageBackup(funnel);
        }
    }

    // Backup para localStorage se IndexedDB falhar
    private saveToLocalStorageBackup(funnel: UnifiedFunnelData): void {
        try {
            const key = `unified_funnel:${funnel.id}`;
            localStorage.setItem(key, JSON.stringify(funnel));

            // Atualizar lista
            const listKey = `unified_funnels_list:${funnel.userId}:${funnel.context}`;
            const list = JSON.parse(localStorage.getItem(listKey) || '[]');
            const existingIndex = list.findIndex((f: any) => f.id === funnel.id);

            const listItem = {
                id: funnel.id,
                name: funnel.name,
                description: funnel.description,
                category: funnel.category,
                isPublished: funnel.isPublished,
                createdAt: funnel.createdAt,
                updatedAt: funnel.updatedAt
            };

            if (existingIndex >= 0) {
                list[existingIndex] = listItem;
            } else {
                list.push(listItem);
            }

            localStorage.setItem(listKey, JSON.stringify(list));

        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage backup:', error);
        }
    }

    private async loadFromIndexedDB(id: string): Promise<UnifiedFunnelData | null> {
        try {
            const funnel = await indexedDBService.load('funnels', id);

            if (!funnel) {
                console.log('🔍 Funil não encontrado no IndexedDB, tentando localStorage backup');
                return this.loadFromLocalStorageBackup(id);
            }

            // Converter dates de string para Date objects
            if (funnel.createdAt && typeof funnel.createdAt === 'string') {
                funnel.createdAt = new Date(funnel.createdAt);
            }
            if (funnel.updatedAt && typeof funnel.updatedAt === 'string') {
                funnel.updatedAt = new Date(funnel.updatedAt);
            }

            console.log('✅ Funil carregado do IndexedDB:', funnel.name);
            return funnel;

        } catch (error) {
            console.error('❌ Erro ao carregar do IndexedDB, tentando localStorage backup:', error);
            return this.loadFromLocalStorageBackup(id);
        }
    }

    // Backup para localStorage
    private loadFromLocalStorageBackup(id: string): UnifiedFunnelData | null {
        try {
            const key = `unified_funnel:${id}`;
            const data = localStorage.getItem(key);

            if (!data) return null;

            const funnel = JSON.parse(data);
            funnel.createdAt = new Date(funnel.createdAt);
            funnel.updatedAt = new Date(funnel.updatedAt);

            return funnel;

        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage backup:', error);
            return null;
        }
    }

    private async listFromIndexedDB(options: ListFunnelOptions): Promise<UnifiedFunnelData[]> {
        try {
            const userId = options.userId || 'unknown';
            const context = options.context || FunnelContext.EDITOR;

            console.log('🔍 Listando funis do IndexedDB para:', { userId, context });

            const funnels = await indexedDBService.list('funnels', { userId, context });

            if (!funnels || funnels.length === 0) {
                console.log('📭 Nenhum funil encontrado no IndexedDB, tentando localStorage backup');
                return this.listFromLocalStorageBackup(options);
            }

            console.log(`✅ ${funnels.length} funis encontrados no IndexedDB`);

            return funnels.map((funnel: any) => ({
                ...funnel,
                createdAt: new Date(funnel.createdAt || Date.now()),
                updatedAt: new Date(funnel.updatedAt || Date.now())
            }));

        } catch (error) {
            console.error('❌ Erro ao listar do IndexedDB, tentando localStorage backup:', error);
            return this.listFromLocalStorageBackup(options);
        }
    }

    // Backup para localStorage
    private listFromLocalStorageBackup(options: ListFunnelOptions): UnifiedFunnelData[] {
        try {
            const userId = options.userId || 'unknown';
            const context = options.context || FunnelContext.EDITOR;
            const listKey = `unified_funnels_list:${userId}:${context}`;

            const data = localStorage.getItem(listKey);
            if (!data) return [];

            const list = JSON.parse(data);
            return list.map((item: any) => ({
                id: item.id,
                name: item.name || 'Funil sem nome',
                description: item.description || '',
                category: item.category || 'outros',
                context,
                userId,
                settings: item.settings || {},
                pages: item.pages || [],
                isPublished: item.isPublished || false,
                version: item.version || 1,
                createdAt: new Date(item.createdAt || Date.now()),
                updatedAt: new Date(item.updatedAt || Date.now()),
                templateId: item.templateId,
                isFromTemplate: item.isFromTemplate || false
            }));

        } catch (error) {
            console.error('❌ Erro ao listar do localStorage backup:', error);
            return [];
        }
    }

    // ========================================================================
    // ADDITIONAL UTILITIES
    // ========================================================================

    private generateUniqueId(): string {
        return `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // ========================================================================
    // CACHE MANAGEMENT
    // ========================================================================

    /**
     * Limpa todo o cache
     */
    clearCache(): void {
        this.cache.invalidate();
    }

    /**
     * Limpa cache de um contexto específico
     */
    clearCacheByContext(context: FunnelContext): void {
        this.cache.invalidateByContext(context);
    }

    /**
     * Limpa cache de um usuário específico
     */
    clearCacheByUser(userId: string): void {
        this.cache.invalidateByUser(userId);
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const funnelUnifiedService = FunnelUnifiedService.getInstance();

// ============================================================================
// CONVENIENCE HOOKS (para uso futuro)
// ============================================================================

export const useFunnelUnified = () => funnelUnifiedService;
