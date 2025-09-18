/**
 * 🎯 OPTIMIZED BLOCK PROPERTIES HOOK
 * 
 * Hook React que usa a API interna para máxima performance
 * - Cache inteligente
 * - Re-renders mínimos
 * - Validação automática
 * - Observadores de mudanças
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { blockPropertiesAPI, type BlockDefinition, type PropertyChangeEvent } from '@/api/internal/BlockPropertiesAPI';

// ===== INTERFACES =====

interface UseBlockPropertiesReturn {
    definition: BlockDefinition | null;
    properties: Record<string, any>;
    isLoading: boolean;
    error: string | null;
    updateProperty: (key: string, value: any) => Promise<boolean>;
    resetToDefaults: () => Promise<void>;
    validateProperty: (key: string, value: any) => Promise<boolean>;
}

interface UseBlockPropertiesOptions {
    blockId: string;
    blockType: string;
    initialProperties?: Record<string, any>;
    onPropertyChange?: (key: string, value: any, isValid: boolean) => void;
    enableValidation?: boolean;
    enableTransformation?: boolean;
}

// ===== MAIN HOOK =====

export const useBlockProperties = (options: UseBlockPropertiesOptions): UseBlockPropertiesReturn => {
    const {
        blockId,
        blockType,
        initialProperties = {},
        onPropertyChange,
        enableValidation = true,
        enableTransformation = true
    } = options;

    // State
    const [definition, setDefinition] = useState<BlockDefinition | null>(null);
    const [properties, setProperties] = useState<Record<string, any>>(initialProperties);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load block definition
    useEffect(() => {
        let cancelled = false;

        const loadDefinition = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const def = await blockPropertiesAPI.getBlockDefinition(blockType);

                if (!cancelled) {
                    setDefinition(def);

                    // Merge with defaults if definition exists
                    if (def) {
                        const defaults = await blockPropertiesAPI.getDefaultProperties(blockType);
                        setProperties(prev => ({ ...defaults, ...prev }));
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Failed to load block definition');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadDefinition();

        return () => {
            cancelled = true;
        };
    }, [blockType]);

    // Subscribe to external changes
    useEffect(() => {
        const unsubscribe = blockPropertiesAPI.subscribe((event: PropertyChangeEvent) => {
            if (event.blockId === blockId) {
                setProperties(prev => ({
                    ...prev,
                    [event.property]: event.newValue
                }));
            }
        });

        return unsubscribe;
    }, [blockId]);

    // Update property with validation and transformation
    const updateProperty = useCallback(async (key: string, value: any): Promise<boolean> => {
        let processedValue = value;
        let isValid = true;

        try {
            // Transform value if enabled
            if (enableTransformation) {
                processedValue = await blockPropertiesAPI.transformProperty(blockType, key, value);
            }

            // Validate if enabled
            if (enableValidation) {
                isValid = await blockPropertiesAPI.validateProperty(blockType, key, processedValue);
            }

            // Update state regardless of validation (let UI decide how to handle invalid values)
            const oldValue = properties[key];

            setProperties(prev => ({
                ...prev,
                [key]: processedValue
            }));

            // Notify API of change
            blockPropertiesAPI.notifyPropertyChange(blockId, blockType, key, oldValue, processedValue);

            // Call external handler
            onPropertyChange?.(key, processedValue, isValid);

            return isValid;
        } catch (err) {
            console.error(`Error updating property ${key}:`, err);
            return false;
        }
    }, [blockId, blockType, properties, onPropertyChange, enableValidation, enableTransformation]);

    // Reset to defaults
    const resetToDefaults = useCallback(async (): Promise<void> => {
        try {
            const defaults = await blockPropertiesAPI.getDefaultProperties(blockType);
            setProperties(defaults);

            // Notify of reset
            Object.entries(defaults).forEach(([key, newValue]) => {
                const oldValue = properties[key];
                blockPropertiesAPI.notifyPropertyChange(blockId, blockType, key, oldValue, newValue);
            });
        } catch (err) {
            console.error('Error resetting to defaults:', err);
        }
    }, [blockId, blockType, properties]);

    // Validate single property
    const validateProperty = useCallback(async (key: string, value: any): Promise<boolean> => {
        try {
            return await blockPropertiesAPI.validateProperty(blockType, key, value);
        } catch {
            return false;
        }
    }, [blockType]);

    return {
        definition,
        properties,
        isLoading,
        error,
        updateProperty,
        resetToDefaults,
        validateProperty
    };
};

// ===== SPECIALIZED HOOKS =====

/**
 * Hook for getting just the block definition (lightweight)
 */
export const useBlockDefinition = (blockType: string) => {
    const [definition, setDefinition] = useState<BlockDefinition | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        blockPropertiesAPI.getBlockDefinition(blockType).then(def => {
            setDefinition(def);
            setIsLoading(false);
        });
    }, [blockType]);

    return { definition, isLoading };
};

/**
 * Hook for property change notifications
 */
export const usePropertyChangeListener = (
    blockId: string,
    callback: (event: PropertyChangeEvent) => void
) => {
    useEffect(() => {
        const unsubscribe = blockPropertiesAPI.subscribe(event => {
            if (event.blockId === blockId) {
                callback(event);
            }
        });

        return unsubscribe;
    }, [blockId, callback]);
};

/**
 * Hook for all block types (for component browsers)
 */
export const useAllBlockTypes = () => {
    const [blockTypes, setBlockTypes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        blockPropertiesAPI.getAllBlockTypes().then(types => {
            setBlockTypes(types);
            setIsLoading(false);
        });
    }, []);

    return { blockTypes, isLoading };
};

export default useBlockProperties;