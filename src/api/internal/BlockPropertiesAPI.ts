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

// ===== CACHE SYSTEM =====

class BlockPropertiesCache {
    private cache = new Map<string, BlockDefinition>();
    private observers = new Set<(event: PropertyChangeEvent) => void>();

    // Convert registry PropSchema[] to our BlockPropertySchema format
    private convertPropsSchemaToProperties(propsSchema: PropSchema[]): Record<string, BlockPropertySchema> {
        const properties: Record<string, BlockPropertySchema> = {};

        console.log('🔄 Converting PropSchema[], length:', propsSchema.length);

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
            console.log(`📝 Converted property: ${prop.key} (${prop.kind} -> ${blockSchema.kind})`);
        });

        console.log('✅ Conversion complete. Properties count:', Object.keys(properties).length);
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
        console.log(`🔍 BlockPropertiesCache.get(${blockType})`);
        
        if (this.cache.has(blockType)) {
            console.log('✅ Cache HIT');
            return this.cache.get(blockType)!;
        }

        console.log('❌ Cache MISS, loading from registry...');
        
        // Lazy load from registry
        const registryDef = blocksRegistry[blockType];
        console.log('📋 Registry definition exists:', !!registryDef);
        
        if (registryDef) {
            console.log('📊 Registry propsSchema length:', registryDef.propsSchema?.length || 0);
            
            const definition: BlockDefinition = {
                type: blockType,
                name: registryDef.title || blockType,
                category: registryDef.category || 'Other',
                properties: this.convertPropsSchemaToProperties(registryDef.propsSchema || []),
                defaultContent: registryDef.defaultProps || {},
                icon: registryDef.icon
            };

            console.log('💾 Caching definition with properties count:', Object.keys(definition.properties).length);
            this.cache.set(blockType, definition);
            return definition;
        }

        console.log('❌ Block type not found in registry');
        return null;
    }

    invalidate(blockType?: string): void {
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

    static getInstance(): BlockPropertiesAPI {
        if (!BlockPropertiesAPI.instance) {
            BlockPropertiesAPI.instance = new BlockPropertiesAPI();
        }
        return BlockPropertiesAPI.instance;
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

    // 📊 GET DEFAULT PROPERTIES
    async getDefaultProperties(blockType: string): Promise<Record<string, any>> {
        const definition = await this.getBlockDefinition(blockType);
        if (!definition) return {};

        const defaults: Record<string, any> = {};
        Object.entries(definition.properties).forEach(([key, schema]) => {
            defaults[key] = schema.defaultValue;
        });

        return { ...defaults, ...definition.defaultContent };
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