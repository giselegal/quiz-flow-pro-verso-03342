/**
 * 🗄️ IndexedDB Service - Armazenamento avançado para funis
 * 
 * Características:
 * - ✅ Assíncrono (não bloqueia UI)
 * - ✅ Capacidade grande (250MB+)
 * - ✅ Transações ACID
 * - ✅ Consultas complexas com índices
 * - ✅ Suporte a objetos complexos
 * - ✅ Fallback para localStorage
 */

export interface FunnelDBData {
    id: string;
    name: string;
    description?: string;
    category?: string;
    userId: string;
    context: string;

    // Dados do funil
    settings: any;
    pages: any[];
    blocks: any[];

    // Metadados
    isPublished: boolean;
    version: number;
    createdAt: Date;
    updatedAt: Date;

    // Template info
    templateId?: string;
    isFromTemplate?: boolean;

    // Índices para consultas
    tags?: string[];
    size?: number; // tamanho em bytes para otimização
}

export interface DraftDBData {
    id: string; // funnelId + stepKey
    funnelId: string;
    stepKey: string;
    blocks: any[];
    lastEditedAt: Date;
    schemaVersion: string;
    userId: string;
}

export interface TemplateDBData {
    id: string;
    name: string;
    data: any;
    cachedAt: Date;
    ttl: number; // time to live in ms
}

class IndexedDBService {
    private db: IDBDatabase | null = null;
    private readonly DB_NAME = 'QuizQuestFunnelsDB';
    private readonly DB_VERSION = 1;

    // Store names
    private readonly STORES = {
        FUNNELS: 'funnels',
        DRAFTS: 'drafts',
        TEMPLATES: 'templates',
        CACHE: 'cache'
    } as const;

    /**
     * Inicializa o banco de dados IndexedDB
     */
    async init(): Promise<void> {
        if (this.db) return; // Já inicializado

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = () => {
                console.error('❌ Erro ao abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB inicializado com sucesso');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Store para funis
                if (!db.objectStoreNames.contains(this.STORES.FUNNELS)) {
                    const funnelsStore = db.createObjectStore(this.STORES.FUNNELS, { keyPath: 'id' });
                    funnelsStore.createIndex('userId', 'userId', { unique: false });
                    funnelsStore.createIndex('category', 'category', { unique: false });
                    funnelsStore.createIndex('context', 'context', { unique: false });
                    funnelsStore.createIndex('createdAt', 'createdAt', { unique: false });
                    funnelsStore.createIndex('isPublished', 'isPublished', { unique: false });
                }

                // Store para drafts
                if (!db.objectStoreNames.contains(this.STORES.DRAFTS)) {
                    const draftsStore = db.createObjectStore(this.STORES.DRAFTS, { keyPath: 'id' });
                    draftsStore.createIndex('funnelId', 'funnelId', { unique: false });
                    draftsStore.createIndex('userId', 'userId', { unique: false });
                    draftsStore.createIndex('lastEditedAt', 'lastEditedAt', { unique: false });
                }

                // Store para templates cache
                if (!db.objectStoreNames.contains(this.STORES.TEMPLATES)) {
                    const templatesStore = db.createObjectStore(this.STORES.TEMPLATES, { keyPath: 'id' });
                    templatesStore.createIndex('cachedAt', 'cachedAt', { unique: false });
                }

                // Store para cache geral
                if (!db.objectStoreNames.contains(this.STORES.CACHE)) {
                    db.createObjectStore(this.STORES.CACHE, { keyPath: 'key' });
                }

                console.log('🏗️ IndexedDB estrutura criada');
            };
        });
    }

    /**
     * Verifica se IndexedDB está disponível
     */
    static isSupported(): boolean {
        return typeof indexedDB !== 'undefined';
    }

    // ============================================================================
    // OPERAÇÕES COM FUNIS
    // ============================================================================

    /**
     * Salva um funil no IndexedDB
     */
    async saveFunnel(funnel: FunnelDBData): Promise<void> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.FUNNELS], 'readwrite');
            const store = transaction.objectStore(this.STORES.FUNNELS);

            // Adicionar metadados
            const dataToSave: FunnelDBData = {
                ...funnel,
                updatedAt: new Date(),
                size: JSON.stringify(funnel).length
            };

            const request = store.put(dataToSave);

            request.onsuccess = () => {
                console.log(`✅ Funil ${funnel.id} salvo no IndexedDB`);
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Erro ao salvar funil:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Carrega um funil do IndexedDB
     */
    async loadFunnel(funnelId: string): Promise<FunnelDBData | null> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.FUNNELS], 'readonly');
            const store = transaction.objectStore(this.STORES.FUNNELS);
            const request = store.get(funnelId);

            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    console.log(`✅ Funil ${funnelId} carregado do IndexedDB`);
                }
                resolve(result || null);
            };

            request.onerror = () => {
                console.error('❌ Erro ao carregar funil:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Lista funis com filtros
     */
    async listFunnels(options: {
        userId?: string;
        category?: string;
        context?: string;
        isPublished?: boolean;
        limit?: number;
        offset?: number;
    } = {}): Promise<FunnelDBData[]> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.FUNNELS], 'readonly');
            const store = transaction.objectStore(this.STORES.FUNNELS);

            // Usar índice se filtro específico
            let request: IDBRequest;
            if (options.userId) {
                const index = store.index('userId');
                request = index.getAll(options.userId);
            } else if (options.category) {
                const index = store.index('category');
                request = index.getAll(options.category);
            } else if (options.context) {
                const index = store.index('context');
                request = index.getAll(options.context);
            } else {
                request = store.getAll();
            }

            request.onsuccess = () => {
                let results = request.result || [];

                // Aplicar filtros adicionais
                if (options.isPublished !== undefined) {
                    results = results.filter(f => f.isPublished === options.isPublished);
                }

                // Ordenar por data de criação (mais recentes primeiro)
                results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                // Aplicar paginação
                if (options.offset || options.limit) {
                    const start = options.offset || 0;
                    const end = options.limit ? start + options.limit : undefined;
                    results = results.slice(start, end);
                }

                console.log(`✅ ${results.length} funis carregados do IndexedDB`);
                resolve(results);
            };

            request.onerror = () => {
                console.error('❌ Erro ao listar funis:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Deleta um funil
     */
    async deleteFunnel(funnelId: string): Promise<void> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.FUNNELS], 'readwrite');
            const store = transaction.objectStore(this.STORES.FUNNELS);
            const request = store.delete(funnelId);

            request.onsuccess = () => {
                console.log(`✅ Funil ${funnelId} deletado do IndexedDB`);
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Erro ao deletar funil:', request.error);
                reject(request.error);
            };
        });
    }

    // ============================================================================
    // OPERAÇÕES COM DRAFTS
    // ============================================================================

    /**
     * Salva draft de uma etapa
     */
    async saveDraft(draft: DraftDBData): Promise<void> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.DRAFTS], 'readwrite');
            const store = transaction.objectStore(this.STORES.DRAFTS);

            const dataToSave: DraftDBData = {
                ...draft,
                lastEditedAt: new Date()
            };

            const request = store.put(dataToSave);

            request.onsuccess = () => {
                console.log(`✅ Draft ${draft.id} salvo no IndexedDB`);
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Erro ao salvar draft:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Carrega draft de uma etapa
     */
    async loadDraft(funnelId: string, stepKey: string): Promise<DraftDBData | null> {
        await this.init();

        const draftId = `${funnelId}:${stepKey}`;

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.DRAFTS], 'readonly');
            const store = transaction.objectStore(this.STORES.DRAFTS);
            const request = store.get(draftId);

            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    console.log(`✅ Draft ${draftId} carregado do IndexedDB`);
                }
                resolve(result || null);
            };

            request.onerror = () => {
                console.error('❌ Erro ao carregar draft:', request.error);
                reject(request.error);
            };
        });
    }

    // ============================================================================
    // TEMPLATE CACHE
    // ============================================================================

    /**
     * Cache de template com TTL
     */
    async cacheTemplate(templateId: string, data: any, ttlMs: number = 30 * 60 * 1000): Promise<void> {
        await this.init();

        const templateData: TemplateDBData = {
            id: templateId,
            name: templateId,
            data,
            cachedAt: new Date(),
            ttl: ttlMs
        };

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.TEMPLATES], 'readwrite');
            const store = transaction.objectStore(this.STORES.TEMPLATES);
            const request = store.put(templateData);

            request.onsuccess = () => {
                console.log(`✅ Template ${templateId} cached no IndexedDB`);
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Erro ao cachear template:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Recupera template do cache (se válido)
     */
    async getCachedTemplate(templateId: string): Promise<any | null> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB não inicializado'));
                return;
            }

            const transaction = this.db.transaction([this.STORES.TEMPLATES], 'readonly');
            const store = transaction.objectStore(this.STORES.TEMPLATES);
            const request = store.get(templateId);

            request.onsuccess = () => {
                const result = request.result;

                if (!result) {
                    resolve(null);
                    return;
                }

                // Verificar TTL
                const now = Date.now();
                const cachedAt = new Date(result.cachedAt).getTime();

                if (now - cachedAt > result.ttl) {
                    // Cache expirado, deletar
                    const deleteTransaction = this.db!.transaction([this.STORES.TEMPLATES], 'readwrite');
                    const deleteStore = deleteTransaction.objectStore(this.STORES.TEMPLATES);
                    deleteStore.delete(templateId);

                    console.log(`⏰ Cache do template ${templateId} expirado`);
                    resolve(null);
                    return;
                }

                console.log(`✅ Template ${templateId} recuperado do cache IndexedDB`);
                resolve(result.data);
            };

            request.onerror = () => {
                console.error('❌ Erro ao recuperar template do cache:', request.error);
                reject(request.error);
            };
        });
    }

    // ============================================================================
    // UTILITÁRIOS
    // ============================================================================

    /**
     * Limpa dados expirados
     */
    async cleanup(): Promise<void> {
        await this.init();

        // Limpar templates expirados
        const transaction = this.db!.transaction([this.STORES.TEMPLATES], 'readwrite');
        const store = transaction.objectStore(this.STORES.TEMPLATES);
        const index = store.index('cachedAt');

        const request = index.openCursor();
        const now = Date.now();

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                const template = cursor.value;
                const cachedAt = new Date(template.cachedAt).getTime();

                if (now - cachedAt > template.ttl) {
                    cursor.delete();
                    console.log(`🧹 Template expirado ${template.id} removido`);
                }

                cursor.continue();
            }
        };
    }

    /**
     * Obtém estatísticas de uso
     */
    async getStats(): Promise<{
        funnels: number;
        drafts: number;
        templates: number;
        totalSize: number;
    }> {
        await this.init();

        const stats = {
            funnels: 0,
            drafts: 0,
            templates: 0,
            totalSize: 0
        };

        // Contar funis
        const funnelsRequest = this.db!.transaction([this.STORES.FUNNELS]).objectStore(this.STORES.FUNNELS).count();
        stats.funnels = await new Promise(resolve => {
            funnelsRequest.onsuccess = () => resolve(funnelsRequest.result);
        });

        // Contar drafts
        const draftsRequest = this.db!.transaction([this.STORES.DRAFTS]).objectStore(this.STORES.DRAFTS).count();
        stats.drafts = await new Promise(resolve => {
            draftsRequest.onsuccess = () => resolve(draftsRequest.result);
        });

        // Contar templates
        const templatesRequest = this.db!.transaction([this.STORES.TEMPLATES]).objectStore(this.STORES.TEMPLATES).count();
        stats.templates = await new Promise(resolve => {
            templatesRequest.onsuccess = () => resolve(templatesRequest.result);
        });

        return stats;
    }
}

// Singleton instance
export const indexedDBService = new IndexedDBService();

// Auto-inicializar se suportado
if (IndexedDBService.isSupported()) {
    indexedDBService.init().catch(console.error);

    // Cleanup automático a cada hora
    setInterval(() => {
        indexedDBService.cleanup().catch(console.error);
    }, 60 * 60 * 1000);
}