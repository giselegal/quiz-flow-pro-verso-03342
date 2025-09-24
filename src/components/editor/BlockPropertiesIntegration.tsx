import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLogger } from '@/utils/logger/SmartLogger';
import { cacheManager } from '@/utils/cache/LRUCache';

// ✅ SISTEMA DE PROPRIEDADES DE BLOCK GLOBALIZADO
export interface BlockProperty {
    id: string;
    blockId: string;
    key: string;
    value: any;
    type: 'text' | 'number' | 'boolean' | 'color' | 'image' | 'json';
    timestamp: number;
    updatedBy?: string;
}

export interface BlockPropertiesState {
    properties: Map<string, BlockProperty>;
    loading: Set<string>;
    errors: Map<string, Error>;
}

export interface BlockPropertiesAPI {
    // Propriedade única
    getProperty: (blockId: string, key: string) => BlockProperty | null;
    setProperty: (blockId: string, key: string, value: any, type?: BlockProperty['type']) => Promise<void>;
    removeProperty: (blockId: string, key: string) => Promise<void>;

    // Todas as propriedades do block
    getAllProperties: (blockId: string) => BlockProperty[];
    setAllProperties: (blockId: string, properties: Record<string, any>) => Promise<void>;
    clearAllProperties: (blockId: string) => Promise<void>;

    // Estados
    isLoading: (blockId: string, key?: string) => boolean;
    getError: (blockId: string, key?: string) => Error | null;

    // Sincronização
    sync: (blockId: string) => Promise<void>;
    batchSync: (blockIds: string[]) => Promise<void>;
}

const BlockPropertiesContext = createContext<BlockPropertiesAPI | null>(null);

// ✅ CACHE PARA PROPRIEDADES
const propertiesCache = cacheManager.getCache<BlockProperty>('block-properties');

// ✅ STORAGE LOCAL PARA PERSISTÊNCIA
const STORAGE_KEY = 'block-properties';

const saveToLocalStorage = (properties: BlockProperty[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (error) {
        console.warn('Falha ao salvar propriedades no localStorage:', error);
    }
};

const loadFromLocalStorage = (): BlockProperty[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.warn('Falha ao carregar propriedades do localStorage:', error);
        return [];
    }
};

// ✅ PROVIDER PRINCIPAL
export const BlockPropertiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logger = useLogger('BlockProperties');

    const [state, setState] = useState<BlockPropertiesState>(() => {
        // Inicializar com dados do localStorage
        const stored = loadFromLocalStorage();
        const properties = new Map<string, BlockProperty>();

        stored.forEach(prop => {
            const key = `${prop.blockId}:${prop.key}`;
            properties.set(key, prop);
            propertiesCache.set(key, prop);
        });

        return {
            properties,
            loading: new Set(),
            errors: new Map()
        };
    });

    // ✅ AUTO-SAVE PARA LOCALSTORAGE
    useEffect(() => {
        const interval = setInterval(() => {
            const allProperties = Array.from(state.properties.values());
            saveToLocalStorage(allProperties);
            logger.debug(`Auto-saved ${allProperties.length} properties to localStorage`);
        }, 30000); // 30 segundos

        return () => clearInterval(interval);
    }, [state.properties, logger]);

    // ✅ API DE PROPRIEDADES
    const api = useMemo<BlockPropertiesAPI>(() => ({
        getProperty: (blockId: string, key: string): BlockProperty | null => {
            const propertyKey = `${blockId}:${key}`;

            // Cache primeiro
            const cached = propertiesCache.get(propertyKey);
            if (cached) {
                return cached;
            }

            // State fallback
            return state.properties.get(propertyKey) || null;
        },

        setProperty: async (blockId: string, key: string, value: any, type: BlockProperty['type'] = 'text'): Promise<void> => {
            const propertyKey = `${blockId}:${key}`;
            const propertyId = `${blockId}-${key}-${Date.now()}`;

            const property: BlockProperty = {
                id: propertyId,
                blockId,
                key,
                value,
                type,
                timestamp: Date.now(),
                updatedBy: 'user'
            };

            logger.info(`Setting property ${blockId}.${key}:`, { value, type });

            // Atualizar cache
            propertiesCache.set(propertyKey, property);

            // Atualizar state
            setState(prev => ({
                ...prev,
                properties: new Map(prev.properties).set(propertyKey, property),
                errors: new Map(prev.errors)
            }));

            // Simular persistência remota (placeholder para API real)
            try {
                // TODO: Implementar chamada real para API
                await new Promise(resolve => setTimeout(resolve, 100));
                logger.debug(`Property ${propertyKey} saved successfully`);
            } catch (error) {
                logger.error(`Failed to save property ${propertyKey}:`, error);
                setState(prev => ({
                    ...prev,
                    errors: new Map(prev.errors).set(propertyKey, error as Error)
                }));
                throw error;
            }
        },

        removeProperty: async (blockId: string, key: string): Promise<void> => {
            const propertyKey = `${blockId}:${key}`;

            logger.info(`Removing property ${propertyKey}`);

            // Remover do cache
            propertiesCache.delete(propertyKey);

            // Remover do state
            setState(prev => {
                const newProperties = new Map(prev.properties);
                const newErrors = new Map(prev.errors);
                newProperties.delete(propertyKey);
                newErrors.delete(propertyKey);

                return {
                    ...prev,
                    properties: newProperties,
                    errors: newErrors
                };
            });

            try {
                // TODO: Implementar chamada real para API
                await new Promise(resolve => setTimeout(resolve, 100));
                logger.debug(`Property ${propertyKey} removed successfully`);
            } catch (error) {
                logger.error(`Failed to remove property ${propertyKey}:`, error);
                throw error;
            }
        },

        getAllProperties: (blockId: string): BlockProperty[] => {
            const blockProperties: BlockProperty[] = [];

            for (const [, property] of state.properties.entries()) {
                if (property.blockId === blockId) {
                    blockProperties.push(property);
                }
            }

            return blockProperties;
        },

        setAllProperties: async (blockId: string, properties: Record<string, any>): Promise<void> => {
            logger.info(`Setting all properties for block ${blockId}:`, properties);

            const propertyPromises = Object.entries(properties).map(([key, value]) => {
                const type = typeof value === 'string' ? 'text' :
                    typeof value === 'number' ? 'number' :
                        typeof value === 'boolean' ? 'boolean' : 'json';

                return api.setProperty(blockId, key, value, type);
            });

            await Promise.all(propertyPromises);
        },

        clearAllProperties: async (blockId: string): Promise<void> => {
            logger.info(`Clearing all properties for block ${blockId}`);

            const blockProperties = api.getAllProperties(blockId);
            const removePromises = blockProperties.map(prop =>
                api.removeProperty(prop.blockId, prop.key)
            );

            await Promise.all(removePromises);
        },

        isLoading: (blockId: string, key?: string): boolean => {
            if (key) {
                return state.loading.has(`${blockId}:${key}`);
            }

            // Verificar se qualquer propriedade do block está loading
            for (const loadingKey of state.loading) {
                if (loadingKey.startsWith(`${blockId}:`)) {
                    return true;
                }
            }

            return false;
        },

        getError: (blockId: string, key?: string): Error | null => {
            if (key) {
                return state.errors.get(`${blockId}:${key}`) || null;
            }

            // Retornar primeiro erro encontrado para o block
            for (const [errorKey, error] of state.errors.entries()) {
                if (errorKey.startsWith(`${blockId}:`)) {
                    return error;
                }
            }

            return null;
        },

        sync: async (blockId: string): Promise<void> => {
            logger.info(`Syncing properties for block ${blockId}`);

            setState(prev => ({
                ...prev,
                loading: new Set(prev.loading).add(`${blockId}:sync`)
            }));

            try {
                // TODO: Implementar sincronização real com API
                await new Promise(resolve => setTimeout(resolve, 500));

                logger.debug(`Block ${blockId} synced successfully`);

                setState(prev => {
                    const newLoading = new Set(prev.loading);
                    newLoading.delete(`${blockId}:sync`);

                    return {
                        ...prev,
                        loading: newLoading
                    };
                });
            } catch (error) {
                logger.error(`Failed to sync block ${blockId}:`, error);

                setState(prev => {
                    const newLoading = new Set(prev.loading);
                    const newErrors = new Map(prev.errors);

                    newLoading.delete(`${blockId}:sync`);
                    newErrors.set(`${blockId}:sync`, error as Error);

                    return {
                        ...prev,
                        loading: newLoading,
                        errors: newErrors
                    };
                });

                throw error;
            }
        },

        batchSync: async (blockIds: string[]): Promise<void> => {
            logger.info(`Batch syncing ${blockIds.length} blocks`);

            const syncPromises = blockIds.map(blockId => api.sync(blockId));
            await Promise.all(syncPromises);
        }
    }), [state, logger]);

    return (
        <BlockPropertiesContext.Provider value={api}>
            {children}
        </BlockPropertiesContext.Provider>
    );
};

// ✅ HOOKS PARA USAR AS PROPRIEDADES
export const useBlockProperties = (): BlockPropertiesAPI => {
    const context = useContext(BlockPropertiesContext);
    if (!context) {
        throw new Error('useBlockProperties must be used within BlockPropertiesProvider');
    }
    return context;
};

export const useBlockProperty = (blockId: string, key: string, defaultValue: any = null) => {
    const api = useBlockProperties();

    const [value, setValue] = useState(() => {
        const property = api.getProperty(blockId, key);
        return property ? property.value : defaultValue;
    });

    const updateValue = async (newValue: any) => {
        await api.setProperty(blockId, key, newValue);
        setValue(newValue);
    };

    const isLoading = api.isLoading(blockId, key);
    const error = api.getError(blockId, key);

    return {
        value,
        setValue: updateValue,
        isLoading,
        error,
        remove: () => api.removeProperty(blockId, key)
    };
};

export const useBlockPropertiesAll = (blockId: string) => {
    const api = useBlockProperties();

    const [properties, setProperties] = useState(() => {
        return api.getAllProperties(blockId);
    });

    const updateProperties = async (newProperties: Record<string, any>) => {
        await api.setAllProperties(blockId, newProperties);
        setProperties(api.getAllProperties(blockId));
    };

    const clearProperties = async () => {
        await api.clearAllProperties(blockId);
        setProperties([]);
    };

    const sync = () => api.sync(blockId);

    const isLoading = api.isLoading(blockId);
    const error = api.getError(blockId);

    return {
        properties,
        updateProperties,
        clearProperties,
        sync,
        isLoading,
        error
    };
};

// ✅ COMPONENTE DE EXEMPLO PARA EDITAR PROPRIEDADES
export const BlockPropertyEditor: React.FC<{ blockId: string; propertyKey: string }> = ({
    blockId,
    propertyKey
}) => {
    const { value, setValue, isLoading, error } = useBlockProperty(blockId, propertyKey, '');
    const logger = useLogger('PropertyEditor');

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        try {
            await setValue(newValue);
            logger.debug(`Property ${blockId}.${propertyKey} updated to:`, newValue);
        } catch (error) {
            logger.error(`Failed to update property:`, error);
        }
    };

    return (
        <div className="property-editor">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {propertyKey}
            </label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md text-sm ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={`Enter ${propertyKey}...`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-600">
                    Error: {error.message}
                </p>
            )}
            {isLoading && (
                <p className="mt-1 text-xs text-gray-500">
                    Saving...
                </p>
            )}
        </div>
    );
};

export default BlockPropertiesProvider;
