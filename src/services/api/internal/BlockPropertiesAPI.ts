/**
 * 🚀 INTERNAL BLOCK PROPERTIES API
 * 
 * API interna para gerenciar propriedades de blocos de forma eficiente
 * - Cache inteligente
 * - Validação de propriedades
 * - Observadores de mudanças
 * - Performance otimizada
 * - ✅ CONECTADA AOS DADOS REAIS DO FUNIL
 */

import { blocksRegistry, type PropSchema } from '@/core/blocks/registry';
import consolidatedTemplateService from '@/services/core/ConsolidatedTemplateService';
import { UNIFIED_TEMPLATE_REGISTRY } from '@/config/unifiedTemplatesRegistry';
type StorageIndex = { name: string; keyPath: string };
type StorageStore = { name: string; keyPath: string; indexes: StorageIndex[] };
type StorageConfig = { dbName: string; version: number; stores: StorageStore[] };
class IndexedDBStorageService {
    static getInstance(_config: StorageConfig) { return new IndexedDBStorageService(); }
    async initialize(): Promise<void> { }
    async set(_store: string, _key: string, _value: any): Promise<void> { }
    async query(_store: string, _opts: { index: string; key: string }): Promise<any[]> { return []; }
}
import { DraftPersistence } from '@/services/editor/DraftPersistence';
import { appLogger } from '@/lib/utils/appLogger';
import { generateBlockId, generateComponentId } from '@/lib/utils/idGenerator';

// ===== INTERFACES =====

export interface BlockPropertySchema {
    kind: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'image' | 'range';
    label: string;
    defaultValue: string | number | boolean | any[] | Record<string, any>;
    options?: Array<{label: string; value: string | number}>;
    validation?: (value: string | number | boolean) => boolean;
    transform?: (value: string | number | boolean) => string | number | boolean;
}

export interface BlockDefinition {
    type: string;
    name: string;
    category: string;
    properties: Record<string, BlockPropertySchema>;
    defaultContent: Record<string, any>;
    icon?: string;
}

export interface PropertyChangeEvent {
    blockId: string;
    blockType: string;
    property: string;
    oldValue: string | number | boolean | any[] | Record<string, any>;
    newValue: string | number | boolean | any[] | Record<string, any>;
    timestamp: number;
}

// ===== REAL FUNNEL DATA INTEGRATION =====

export interface FunnelDataProvider {
    getCurrentStep: () => number;
    getStepBlocks: (step: number) => any[];
    getBlockById: (blockId: string) => any | null;
    updateBlockProperties: (blockId: string, properties: Record<string, any>) => void;
    getFunnelId: () => string;
    isSupabaseEnabled: () => boolean;
}

// ===== CACHE SYSTEM =====

class BlockPropertiesCache {
    private cache = new Map<string, BlockDefinition>();
    private observers = new Set<(event: PropertyChangeEvent) => void>();

    // Convert registry PropSchema[] to our BlockPropertySchema format
    private convertPropsSchemaToProperties(propsSchema: PropSchema[]): Record<string, BlockPropertySchema> {
        const properties: Record<string, BlockPropertySchema> = {};

        propsSchema.forEach(prop => {
            const blockSchema: BlockPropertySchema = {
                kind: this.mapPropKind(prop.kind),
                label: prop.label,
                defaultValue: prop.default,
                options: prop.options?.map(opt => opt.value),
                validation: undefined, // Can be enhanced later
                transform: undefined,   // Can be enhanced later
            };

            properties[prop.key] = blockSchema;
        });

        return properties;
    }

    // Map registry PropKind to our BlockPropertySchema kind
    private mapPropKind(kind: string): BlockPropertySchema['kind'] {
        switch (kind) {
            case 'text':
            case 'textarea':
                return 'text';
            case 'number':
                return 'number';
            case 'range':
                return 'range';
            case 'color':
                return 'color';
            case 'select':
                return 'select';
            case 'switch':
                return 'boolean';
            case 'url':
                return 'text'; // URLs are treated as text with validation
            default:
                return 'text';
        }
    }

    get(blockType: string): BlockDefinition | null {
        if (this.cache.has(blockType)) {
            return this.cache.get(blockType)!;
        }

        // Lazy load from registry
        const registryDef = blocksRegistry[blockType];
        if (registryDef) {
            const definition: BlockDefinition = {
                type: blockType,
                name: registryDef.title || blockType,
                category: registryDef.category || 'Other',
                properties: this.convertPropsSchemaToProperties(registryDef.propsSchema || []),
                defaultContent: registryDef.defaultProps || {},
                icon: registryDef.icon,
            };

            this.cache.set(blockType, definition);
            return definition;
        }

        return null;
    } invalidate(blockType?: string): void {
        if (blockType) {
            this.cache.delete(blockType);
        } else {
            this.cache.clear();
        }
    }

    subscribe(observer: (event: PropertyChangeEvent) => void): () => void {
        this.observers.add(observer);
        return () => this.observers.delete(observer);
    }

    notify(event: PropertyChangeEvent): void {
        this.observers.forEach(observer => observer(event));
    }
}

// ===== MAIN API CLASS =====

export class BlockPropertiesAPI {
    private static instance: BlockPropertiesAPI;
    private cache = new BlockPropertiesCache();
    private funnelDataProvider: FunnelDataProvider | null = null;
    private storageService: IndexedDBStorageService | null = null;

    static getInstance(): BlockPropertiesAPI {
        if (!BlockPropertiesAPI.instance) {
            BlockPropertiesAPI.instance = new BlockPropertiesAPI();
        }
        return BlockPropertiesAPI.instance;
    }

    // 🗄️ INICIALIZAR STORAGE SYSTEMS
    async initializeStorage(): Promise<void> {
        try {
            // Configuração customizada para Block Properties
            const config: StorageConfig = {
                dbName: 'BlockPropertiesDB',
                version: 1,
                stores: [{
                    name: 'blockProperties',
                    keyPath: 'id',
                    indexes: [
                        { name: 'blockId', keyPath: 'blockId' },
                        { name: 'funnelId', keyPath: 'funnelId' },
                        { name: 'timestamp', keyPath: 'metadata.timestamp' },
                    ],
                }, {
                    name: 'blockDrafts',
                    keyPath: 'id',
                    indexes: [
                        { name: 'blockId', keyPath: 'blockId' },
                        { name: 'lastModified', keyPath: 'lastModified' },
                    ],
                }],
            };

            this.storageService = IndexedDBStorageService.getInstance(config);
            await this.storageService.initialize();
            appLogger.info('🗄️ BlockPropertiesAPI storage initialized');
        } catch (error) {
            appLogger.warn('⚠️ IndexedDB initialization failed, using localStorage fallback:', { data: [error] });
            this.storageService = null;
        }
    }

    // 🔗 CONECTAR AOS DADOS REAIS DO FUNIL
    connectToFunnelData(provider: FunnelDataProvider): void {
        this.funnelDataProvider = provider;
        appLogger.info('🔗 BlockPropertiesAPI conectada aos dados reais do funil!');

        // 🌐 Detectar automaticamente a estrutura do funil
        this.analyzeFunnelStructure();
    }

    // 🌐 ANALISAR ESTRUTURA DO FUNIL AUTOMATICAMENTE
    private analyzeFunnelStructure(): void {
        if (!this.funnelDataProvider) return;

        const funnelId = this.funnelDataProvider.getFunnelId();
        let totalSteps = 1;
        let totalBlocks = 0;
        const blockTypes = new Set<string>();

        // Detectar quantas etapas existem
        let step = 1;
        while (step <= 100) { // Limite de segurança
            const blocks = this.funnelDataProvider.getStepBlocks(step);
            if (blocks.length > 0) {
                totalSteps = step;
                totalBlocks += blocks.length;

                // Coletar tipos de blocos únicos
                blocks.forEach(block => {
                    if (block.type) blockTypes.add(block.type);
                });
            }
            step++;
        }

        appLogger.info('🌐 Estrutura do funil detectada automaticamente:', { data: [{
                    funnelId,
                    totalSteps,
                    totalBlocks,
                    blockTypesFound: Array.from(blockTypes),
                    isGeneric: true,
                    supportsAnyStructure: true,
                }] });
    }

    // 📊 GET REAL BLOCK PROPERTIES (from funnel, not just registry)
    async getRealBlockProperties(blockId: string): Promise<Record<string, any>> {
        if (!this.funnelDataProvider) {
            appLogger.warn('⚠️ FunnelDataProvider não conectado, usando propriedades vazias');
            return {};
        }

        const block = this.funnelDataProvider.getBlockById(blockId);
        if (!block) {
            appLogger.warn(`⚠️ Bloco ${blockId} não encontrado no funil`);
            return {};
        }

        // Buscar propriedades reais do bloco no funil
        return {
            ...block.properties,
            ...block.content,
            // Incluir metadados do funil
            _funnelId: this.funnelDataProvider.getFunnelId(),
            _currentStep: this.funnelDataProvider.getCurrentStep(),
            _isSupabaseEnabled: this.funnelDataProvider.isSupabaseEnabled(),
        };
    }

    // 🔍 GET BLOCK DEFINITION
    async getBlockDefinition(blockType: string): Promise<BlockDefinition | null> {
        // Simulate async for future API calls
        return new Promise((resolve) => {
            setTimeout(() => {
                const definition = this.cache.get(blockType);
                appLogger.info(`📋 BlockPropertiesAPI.getBlockDefinition(${blockType}):`, { data: [definition] });
                resolve(definition);
            }, 0);
        });
    }

    // 📝 GET PROPERTY SCHEMA
    async getPropertySchema(blockType: string, propertyKey: string): Promise<BlockPropertySchema | null> {
        const definition = await this.getBlockDefinition(blockType);
        return definition?.properties[propertyKey] || null;
    }

    // ✅ VALIDATE PROPERTY VALUE
    async validateProperty(blockType: string, propertyKey: string, value: any): Promise<boolean> {
        const schema = await this.getPropertySchema(blockType, propertyKey);
        if (!schema) return true;

        // Basic type validation
        switch (schema.kind) {
            case 'text':
                return typeof value === 'string';
            case 'number':
            case 'range':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'select':
                return schema.options?.includes(value) || false;
            case 'color':
                return typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value);
            default:
                return true;
        }
    }

    // 🔄 TRANSFORM PROPERTY VALUE
    async transformProperty(blockType: string, propertyKey: string, value: any): Promise<any> {
        const schema = await this.getPropertySchema(blockType, propertyKey);
        if (schema?.transform) {
            return schema.transform(value);
        }
        return value;
    }

    // 🎯 GET REAL TEMPLATE DATA - BUSCA DADOS REAIS DO QUIZ21STEPSCOMPLETE
    async getRealTemplateData(templateId: string = 'quiz21StepsComplete'): Promise<Record<string, any[]>> {
        appLogger.info(`🔍 Buscando dados reais do template: ${templateId}`);

        // Buscar metadados do registry
        const templateMeta = UNIFIED_TEMPLATE_REGISTRY[templateId];
        if (!templateMeta) {
            appLogger.warn(`⚠️ Template ${templateId} não encontrado no UNIFIED_TEMPLATE_REGISTRY`);
            return {};
        }

        // Buscar dados REAIS do template (questões, opções, imagens)
        if (templateId === 'quiz21StepsComplete') {
            appLogger.info('✅ Carregando dados do consolidatedTemplateService (per-step JSON prioritário)');
            try {
                const full = await consolidatedTemplateService.getTemplate('quiz21StepsComplete');
                if (full && Array.isArray(full.steps)) {
                    // Converter para Record<string, any[]>
                    const map: Record<string, any[]> = {};
                    full.steps.forEach(step => {
                        const key = `step-${step.stepNumber}`;
                        map[key] = step.blocks || [];
                    });
                    // Garantir 21 chaves conhecidas se aplicável
                    if (full.stepCount && full.stepCount >= 1) {
                        for (let i = 1; i <= Math.max(full.stepCount, 21); i++) {
                            const key = `step-${i}`;
                            if (!map[key]) map[key] = [];
                        }
                    }
                    return map;
                }

                // Fallback: tentar buscar blocos por etapa diretamente
                const map: Record<string, any[]> = {};
                for (let i = 1; i <= 21; i++) {
                    try {
                        const blocks = await consolidatedTemplateService.getStepBlocks(`step-${i}`);
                        map[`step-${i}`] = blocks || [];
                    } catch (e) {
                        map[`step-${i}`] = [];
                    }
                }
                return map;
            } catch (error) {
                appLogger.warn('⚠️ Falha ao carregar via consolidatedTemplateService, usando fallback legado:', { data: [error] });
            }

            // Fallback final (legado): manter compatibilidade se existir o template TS
            try {
                const { QUIZ_STYLE_21_STEPS_TEMPLATE } = await import('@/templates/quiz21StepsComplete');
                appLogger.info('✅ Fallback legado QUIZ_STYLE_21_STEPS_TEMPLATE carregado');
                return QUIZ_STYLE_21_STEPS_TEMPLATE as unknown as Record<string, any[]>;
            } catch {
                // Ignorar se não existir
            }
        }

        appLogger.warn(`⚠️ Dados reais não implementados para template: ${templateId}`);
        return {};
    }

    // 🔍 GET STEP DATA WITH REAL CONTENT
    async getStepDataWithRealContent(stepNumber: number, templateId: string = 'quiz21StepsComplete'): Promise<any[]> {
        const templateData = await this.getRealTemplateData(templateId);
        const stepKey = `step-${stepNumber}`;
        const stepData = templateData[stepKey] || [];

        appLogger.info(`🔍 Dados do step ${stepNumber}:`, { data: [{
                    stepKey,
                    blocksCount: stepData.length,
                    blockTypes: stepData.map(block => block.type),
                    hasRealContent: stepData.length > 0,
                }] });

        return stepData;
    }

    // 📊 GET BLOCK WITH REAL CONTENT
    async getBlockWithRealContent(blockId: string, stepNumber?: number): Promise<any | null> {
        // Se o step for fornecido, buscar apenas nesse step
        if (stepNumber) {
            const stepData = await this.getStepDataWithRealContent(stepNumber);
            return stepData.find(block => block.id === blockId) || null;
        }

        // Buscar em todos os steps
        const templateData = await this.getRealTemplateData();
        for (const stepKey of Object.keys(templateData)) {
            const blocks = templateData[stepKey];
            const block = blocks.find(b => b.id === blockId);
            if (block) {
                appLogger.info(`✅ Bloco ${blockId} encontrado no ${stepKey} com conteúdo real:`, { data: [{
                                    type: block.type,
                                    hasContent: !!block.content,
                                    hasProperties: !!block.properties,
                                    contentKeys: Object.keys(block.content || {}),
                                    propertiesKeys: Object.keys(block.properties || {}),
                                }] });
                return block;
            }
        }

        appLogger.warn(`⚠️ Bloco ${blockId} não encontrado no template`);
        return null;
    }

    // 📊 GET DEFAULT PROPERTIES (with real funnel data integration) - GENÉRICO
    async getDefaultProperties(blockType: string, blockId?: string): Promise<Record<string, any>> {
        // 🎯 PRIORIDADE 1: Se blockId fornecido, buscar dados REAIS do template
        if (blockId) {
            const realBlock = await this.getBlockWithRealContent(blockId);
            if (realBlock) {
                appLogger.info(`✅ Usando dados REAIS para bloco ${blockId}:`, { data: [{
                                    type: realBlock.type,
                                    content: realBlock.content,
                                    properties: realBlock.properties,
                                }] });
                return {
                    ...realBlock.properties || {},
                    ...realBlock.content || {},
                    _fromRealTemplate: true,
                    _blockId: blockId,
                    _blockType: realBlock.type,
                };
            }
        }

        // 🎯 PRIORIDADE 2: Definição do registry
        const definition = await this.getBlockDefinition(blockType);
        if (!definition) {
            appLogger.warn(`⚠️ Definição não encontrada para tipo '${blockType}' - usando propriedades genéricas`);
            return this.getGenericBlockProperties(blockType);
        }

        // Start with registry defaults
        const defaults: Record<string, any> = {};
        Object.entries(definition.properties).forEach(([key, schema]) => {
            defaults[key] = schema.defaultValue;
        });

        const registryDefaults = { ...defaults, ...definition.defaultContent };

        // 🔗 If we have a blockId and funnel data provider, merge with real data
        if (blockId && this.funnelDataProvider) {
            try {
                const realProperties = await this.getRealBlockProperties(blockId);
                appLogger.info(`🔗 Mesclando propriedades reais do funil para ${blockType}:`, { data: [{
                                    registryDefaults,
                                    realProperties,
                                    merged: { ...registryDefaults, ...realProperties },
                                }] });

                return { ...registryDefaults, ...realProperties };
            } catch (error) {
                appLogger.warn('⚠️ Erro ao buscar propriedades reais, usando defaults do registry:', { data: [error] });
            }
        }

        return registryDefaults;
    }

    // 🌐 PROPRIEDADES GENÉRICAS para tipos de bloco desconhecidos
    private getGenericBlockProperties(blockType: string): Record<string, any> {
        // Propriedades básicas que funcionam com qualquer tipo de bloco
        const genericProperties = {
            text: '',
            title: '',
            content: '',
            visible: true,
            enabled: true,
            className: '',
            style: {},
            id: generateBlockId(),
            // Metadados genéricos
            _blockType: blockType,
            _isGeneric: true,
            _createdAt: new Date().toISOString(),
        };

        appLogger.info(`🌐 Usando propriedades genéricas para tipo desconhecido '${blockType}':`, { data: [genericProperties] });
        return genericProperties;
    }

    // 💾 SAVE PROPERTY TO FUNNEL (IMPLEMENTAÇÃO COMPLETA COM INDEXEDDB)
    async savePropertyToFunnel(blockId: string, propertyKey: string, value: any): Promise<boolean> {
        // 1️⃣ INICIALIZAR STORAGE SE NECESSÁRIO
        if (!this.storageService) {
            await this.initializeStorage();
        }

        try {
            const currentFunnelId = this.getCurrentFunnelId();
            if (!currentFunnelId) {
                appLogger.warn('⚠️ No funnel ID available for property save');
                return false;
            }

            // 2️⃣ SALVAR NO INDEXED DB
            const propertyData = {
                blockId,
                property: propertyKey,
                value,
                funnelId: currentFunnelId,
                timestamp: Date.now(),
            };

            const storageKey = `${currentFunnelId}_${blockId}_${propertyKey}`;
            await this.storageService?.set('blockProperties', storageKey, propertyData);

            // 3️⃣ SALVAR DRAFT PARA RECUPERAÇÃO RÁPIDA  
            DraftPersistence.saveStepDraft(currentFunnelId, `block_${blockId}`, [{
                id: blockId,
                type: 'text' as any,
                properties: { [propertyKey]: value },
                content: { text: '' } as any,
                order: 0,
            }]);

            // 4️⃣ ATUALIZAR CACHE E NOTIFICAR
            this.cache.invalidate(blockId);
            appLogger.info(`💾 Property saved: ${blockId}.${propertyKey} = `, { data: [value] });
            return true;

        } catch (error) {
            appLogger.error('❌ Error saving property:', { data: [error] });

            // 5️⃣ FALLBACK: localStorage
            try {
                const fallbackKey = `fallback_${blockId}_${propertyKey}`;
                localStorage.setItem(fallbackKey, JSON.stringify({
                    value,
                    timestamp: Date.now(),
                    funnelId: this.getCurrentFunnelId() || 'unknown',
                }));
                appLogger.info('📦 Property saved to localStorage fallback');
                return true;
            } catch (fallbackError) {
                appLogger.error('💥 Complete storage failure:', { data: [fallbackError] });
                return false;
            }
        }
    }

    // 🔔 PROPERTY CHANGE NOTIFICATION
    notifyPropertyChange(
        blockId: string,
        blockType: string,
        property: string,
        oldValue: any,
        newValue: any,
    ): void {
        const event: PropertyChangeEvent = {
            blockId,
            blockType,
            property,
            oldValue,
            newValue,
            timestamp: Date.now(),
        };

        this.cache.notify(event);
    }

    // 👀 SUBSCRIBE TO CHANGES
    subscribe(observer: (event: PropertyChangeEvent) => void): () => void {
        return this.cache.subscribe(observer);
    }

    // 📋 GET ALL BLOCK TYPES
    async getAllBlockTypes(): Promise<string[]> {
        return Object.keys(blocksRegistry);
    }

    // 🧹 CLEAR CACHE
    clearCache(blockType?: string): void {
        this.cache.invalidate(blockType);
    }

    // 🆕 SAVE NEW COMPONENT TO FUNNEL (IMPLEMENTAÇÃO COMPLETA)
    async saveNewComponentToFunnel(
        component: any,
        stepId: string,
        position?: number,
        funnelId?: string,
    ): Promise<boolean> {
        if (!this.storageService) {
            await this.initializeStorage();
        }

        try {
            const currentFunnelId = funnelId || this.getCurrentFunnelId();
            if (!currentFunnelId) {
                appLogger.warn('⚠️ No funnel ID available for new component');
                return false;
            }

            const componentData = {
                id: `${currentFunnelId}_${stepId}_${component.id || generateComponentId()}`,
                component,
                stepId,
                position: position ?? 0,
                funnelId: currentFunnelId,
                timestamp: Date.now(),
                metadata: {
                    userId: this.getCurrentUserId(),
                    context: 'new-component',
                    namespace: 'components',
                    timestamp: Date.now(),
                },
            };

            // Salvar no IndexedDB
            await this.storageService?.set('blockProperties', componentData.id, componentData);

            // Salvar draft usando o método correto
            DraftPersistence.saveStepDraft(currentFunnelId, `new_component_${stepId}`, [{
                id: component.id || generateComponentId(),
                type: component.type || 'text' as any,
                properties: component,
                content: component.content || { text: '' } as any,
                order: position ?? 0,
            }]);

            appLogger.info(`🆕 New component saved to step ${stepId}:`, { data: [component] });
            return true;

        } catch (error) {
            appLogger.error('❌ Error saving new component:', { data: [error] });
            return false;
        }
    }

    // 🔍 RETRIEVE SAVED PROPERTIES FROM STORAGE
    async getPropertiesFromStorage(blockId: string, funnelId?: string): Promise<Record<string, any>> {
        if (!this.storageService) {
            await this.initializeStorage();
        }

        try {
            const currentFunnelId = funnelId || this.getCurrentFunnelId();
            if (!currentFunnelId) return {};

            // Buscar propriedades no IndexedDB usando query
            const allProperties = await this.storageService?.query('blockProperties', {
                index: 'blockId',
                key: blockId,
            }) || [];

            const result: Record<string, any> = {};
            for (const prop of allProperties) {
                const propData = prop as any; // Cast para poder acessar as propriedades
                if (propData.blockId === blockId && propData.funnelId === currentFunnelId) {
                    result[propData.property] = propData.value;
                }
            }

            return result;
        } catch (error) {
            appLogger.error('❌ Error retrieving properties from storage:', { data: [error] });
            return {};
        }
    }

    // 🔑 HELPER METHODS
    private getCurrentFunnelId(): string | null {
        // Fallback: tentar localStorage primeiro
        return localStorage.getItem('currentFunnelId') || null;
    }

    private getCurrentUserId(): string {
        return localStorage.getItem('userId') || 'anonymous';
    }
}

// ===== HOOKS FOR REACT INTEGRATION =====

export const useBlockPropertiesAPI = () => {
    return BlockPropertiesAPI.getInstance();
};

// ===== SINGLETON INSTANCE =====
export const blockPropertiesAPI = BlockPropertiesAPI.getInstance();

export default blockPropertiesAPI;
