/**
 * 🚀 INTERNAL BLOCK PROPERTIES API
 * 
 * API interna para gerenciar propriedades de blocos de forma eficiente
 * - Cache inteligente
 * - Validação de propriedades
 * - Observadores de mudanças
 * - Performance otimizada
 */

import { blocksRegistry } from '@/core/blocks/registry';

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

    get(blockType: string): BlockDefinition | null {
        if (this.cache.has(blockType)) {
            return this.cache.get(blockType)!;
        }

        // Lazy load from registry
        const registryDef = blocksRegistry[blockType];
        if (registryDef) {
            const definition: BlockDefinition = {
                type: blockType,
                name: registryDef.name || blockType,
                category: registryDef.category || 'Other',
                properties: registryDef.properties || {},
                defaultContent: registryDef.defaultContent || {},
                icon: registryDef.icon
            };

            this.cache.set(blockType, definition);
            return definition;
        }

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