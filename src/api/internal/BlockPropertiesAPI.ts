/**
 * 🚀 INTERNAL BLOCK PROPERTIES API
 * 
 * API interna para gerenciar propriedades de blocos de forma eficiente
 * - Cache inteligente
 * - Validação de propriedades
 * - Observadores de mudanças
 * - Performance otimizada
 */

import { blocksRegistry, type PropSchema } from '@/core/blocks/registry';

// ===== INTERFACES =====

export interface BlockPropertySchema {
    kind: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'image' | 'range';
    label: string;
    defaultValue: any;
    options?: any[];
    validation?: (value: any) => boolean;
    transform?: (value: any) => any;
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
    oldValue: any;
    newValue: any;
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
                transform: undefined   // Can be enhanced later
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
                icon: registryDef.icon
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

    static getInstance(): BlockPropertiesAPI {
        if (!BlockPropertiesAPI.instance) {
            BlockPropertiesAPI.instance = new BlockPropertiesAPI();
        }
        return BlockPropertiesAPI.instance;
    }

    // 🔗 CONECTAR AOS DADOS REAIS DO FUNIL
    connectToFunnelData(provider: FunnelDataProvider): void {
        this.funnelDataProvider = provider;
        console.log('🔗 BlockPropertiesAPI conectada aos dados reais do funil!');

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

        console.log('🌐 Estrutura do funil detectada automaticamente:', {
            funnelId,
            totalSteps,
            totalBlocks,
            blockTypesFound: Array.from(blockTypes),
            isGeneric: true,
            supportsAnyStructure: true
        });
    }

    // 📊 GET REAL BLOCK PROPERTIES (from funnel, not just registry)
    async getRealBlockProperties(blockId: string): Promise<Record<string, any>> {
        if (!this.funnelDataProvider) {
            console.warn('⚠️ FunnelDataProvider não conectado, usando propriedades vazias');
            return {};
        }

        const block = this.funnelDataProvider.getBlockById(blockId);
        if (!block) {
            console.warn(`⚠️ Bloco ${blockId} não encontrado no funil`);
            return {};
        }

        // Buscar propriedades reais do bloco no funil
        return {
            ...block.properties,
            ...block.content,
            // Incluir metadados do funil
            _funnelId: this.funnelDataProvider.getFunnelId(),
            _currentStep: this.funnelDataProvider.getCurrentStep(),
            _isSupabaseEnabled: this.funnelDataProvider.isSupabaseEnabled()
        };
    }

    // 🔍 GET BLOCK DEFINITION
    async getBlockDefinition(blockType: string): Promise<BlockDefinition | null> {
        // Simulate async for future API calls
        return new Promise((resolve) => {
            setTimeout(() => {
                const definition = this.cache.get(blockType);
                console.log(`📋 BlockPropertiesAPI.getBlockDefinition(${blockType}):`, definition);
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

    // 📊 GET DEFAULT PROPERTIES (with real funnel data integration) - GENÉRICO
    async getDefaultProperties(blockType: string, blockId?: string): Promise<Record<string, any>> {
        const definition = await this.getBlockDefinition(blockType);
        if (!definition) {
            console.warn(`⚠️ Definição não encontrada para tipo '${blockType}' - usando propriedades genéricas`);
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
                console.log(`🔗 Mesclando propriedades reais do funil para ${blockType}:`, {
                    registryDefaults,
                    realProperties,
                    merged: { ...registryDefaults, ...realProperties }
                });

                return { ...registryDefaults, ...realProperties };
            } catch (error) {
                console.warn('⚠️ Erro ao buscar propriedades reais, usando defaults do registry:', error);
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
            id: `${blockType}-${Date.now()}`,
            // Metadados genéricos
            _blockType: blockType,
            _isGeneric: true,
            _createdAt: new Date().toISOString()
        };

        console.log(`🌐 Usando propriedades genéricas para tipo desconhecido '${blockType}':`, genericProperties);
        return genericProperties;
    }

    // 💾 SAVE PROPERTY TO REAL FUNNEL DATA
    async savePropertyToFunnel(blockId: string, propertyKey: string, value: any): Promise<boolean> {
        if (!this.funnelDataProvider) {
            console.warn('⚠️ FunnelDataProvider não conectado, não é possível salvar no funil');
            return false;
        }

        try {
            const currentBlock = this.funnelDataProvider.getBlockById(blockId);
            if (!currentBlock) {
                console.warn(`⚠️ Bloco ${blockId} não encontrado para salvar propriedade ${propertyKey}`);
                return false;
            }

            // Atualizar propriedades no funil
            const updatedProperties = {
                ...currentBlock.properties,
                [propertyKey]: value
            };

            this.funnelDataProvider.updateBlockProperties(blockId, updatedProperties);

            console.log(`💾 Propriedade ${propertyKey} salva no funil para bloco ${blockId}:`, value);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar propriedade no funil:', error);
            return false;
        }
    }

    // 🔔 PROPERTY CHANGE NOTIFICATION
    notifyPropertyChange(
        blockId: string,
        blockType: string,
        property: string,
        oldValue: any,
        newValue: any
    ): void {
        const event: PropertyChangeEvent = {
            blockId,
            blockType,
            property,
            oldValue,
            newValue,
            timestamp: Date.now()
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
}

// ===== HOOKS FOR REACT INTEGRATION =====

export const useBlockPropertiesAPI = () => {
    return BlockPropertiesAPI.getInstance();
};

// ===== SINGLETON INSTANCE =====
export const blockPropertiesAPI = BlockPropertiesAPI.getInstance();

export default blockPropertiesAPI;