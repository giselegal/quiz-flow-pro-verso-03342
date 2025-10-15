/**
 * 🔗 USE COMPONENT CONFIGURATION HOOK
 * 
 * Hook para conectar componentes à API de configurações
 * com sincronização em tempo real e cache inteligente
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ConfigurationAPI } from '@/services/ConfigurationAPI';
import type { ComponentDefinition } from '@/types/componentConfiguration';
import { configurationCache } from '@/utils/ConfigurationCache';

// ============================================================================
// TYPES
// ============================================================================

export interface UseComponentConfigurationOptions {
    componentId: string;
    funnelId?: string;
    realTimeSync?: boolean;
    cacheEnabled?: boolean;
    autoSave?: boolean;
    autoSaveDelay?: number;
    editorMode?: boolean; // 🎨 Reservado para uso futuro (não usado atualmente)
}

export interface UseComponentConfigurationReturn {
    // Estado
    properties: Record<string, any>;
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;

    // Ações
    updateProperty: (key: string, value: any) => Promise<void>;
    updateProperties: (properties: Record<string, any>) => Promise<void>;
    resetToDefaults: () => Promise<void>;
    refresh: () => Promise<void>;

    // Metadados
    componentDefinition: ComponentDefinition | null;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;

    // Estado da conexão
    connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useComponentConfiguration(
    options: UseComponentConfigurationOptions
): UseComponentConfigurationReturn {

    const {
        componentId,
        funnelId,
        realTimeSync = false,
        cacheEnabled = true,
        autoSave = false,
        autoSaveDelay = 2000,
        editorMode = false // Reservado para uso futuro
    } = options;

    // ============================================================================
    // STATE
    // ============================================================================

    const [properties, setProperties] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [componentDefinition, setComponentDefinition] = useState<ComponentDefinition | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');

    // ============================================================================
    // REFS
    // ============================================================================

    const apiRef = useRef<ConfigurationAPI>(ConfigurationAPI.getInstance());
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const unsavedChangesRef = useRef<Record<string, any>>({});
    const definitionLoadedRef = useRef<boolean>(false);

    // ============================================================================
    // LOAD CONFIGURATION
    // ============================================================================

    const loadConfiguration = useCallback(async () => {
        if (!componentId) return;

        // 🚀 VERIFICAR CACHE PRIMEIRO
        const cacheKey = `${componentId}-${funnelId || 'default'}`;
        const cachedConfig = configurationCache.get<{properties: Record<string, any>, definition: ComponentDefinition}>(cacheKey);
        if (cachedConfig) {
            console.log(`⚡ Cache hit para ${componentId}`);
            setProperties(cachedConfig.properties || {});
            setComponentDefinition(cachedConfig.definition);
            setIsConnected(true);
            setConnectionStatus('connected');
            setIsLoading(false);
            return;
        }

        // 🚀 MODO PREVIEW OFFLINE: Skip API calls em desenvolvimento para preview
        const isPreviewMode = editorMode || process.env.NODE_ENV === 'development';
        if (isPreviewMode) {
            console.log(`🎯 Preview mode: usando configuração local para ${componentId}`);
            try {
                const definition = await apiRef.current.getComponentDefinition(componentId);
                setComponentDefinition(definition);
                const properties = definition.defaultProperties || {};
                setProperties(properties);
                setIsConnected(true);
                setConnectionStatus('connected');
                setIsLoading(false);
                
                // Cachear para próximas vezes
                configurationCache.set(cacheKey, { properties, definition }, 2 * 60 * 1000); // 2 min cache
                return;
            } catch (err) {
                console.warn(`⚠️ Fallback para ${componentId}:`, err);
                setProperties({});
                setIsLoading(false);
                setConnectionStatus('disconnected');
                return;
            }
        }

        // �🛡️ TIMEOUT DE SEGURANÇA: 3 segundos em dev, 15 em produção
        const timeoutMs = process.env.NODE_ENV === 'development' ? 3000 : 15000;
        const safetyTimeout = setTimeout(() => {
            console.warn(`⚠️ Loading timeout for ${componentId} - usando valores padrão`);
            setIsLoading(false);
            setConnectionStatus('disconnected'); // Não é erro, apenas desconectado
            // NÃO definir erro - timeout não é erro fatal, apenas usa fallback
        }, timeoutMs);

        try {
            setIsLoading(true);
            setConnectionStatus('connecting');
            setError(null);

            console.log(`🔄 Loading configuration for ${componentId}${funnelId ? ` (${funnelId})` : ''}`);

            // Carregar definição do componente (apenas uma vez para evitar loop)
            if (!definitionLoadedRef.current) {
                const definition = await apiRef.current.getComponentDefinition(componentId);
                setComponentDefinition(definition);
                definitionLoadedRef.current = true;
            }
            
            // Carregar configuração atual (SEMPRE da API - comportamento de produção)
            const config = await apiRef.current.getConfiguration(componentId, funnelId);

            // Atualizar estados - separado para evitar loop
            setProperties(config);
            setIsConnected(true);
            setConnectionStatus('connected');
            setHasUnsavedChanges(false);

            console.log(`✅ Configuration loaded for ${componentId}:`, config);

            // Limpar timeout de segurança se tudo correu bem
            clearTimeout(safetyTimeout);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configuração';
            
            // 🛡️ Erros de timeout ou 404 não são fatais - apenas usar fallback
            const isNonFatalError = errorMessage.includes('404') || 
                                   errorMessage.includes('not found') ||
                                   errorMessage.includes('Timeout');
            
            if (!isNonFatalError) {
                setError(errorMessage);
                console.error(`❌ Error loading configuration for ${componentId}:`, err);
            } else {
                console.warn(`⚠️ Non-fatal error for ${componentId}: ${errorMessage} - usando fallback`);
            }
            
            setIsConnected(false);
            setConnectionStatus('disconnected');

            // Limpar timeout de segurança mesmo em caso de erro
            clearTimeout(safetyTimeout);

        } finally {
            setIsLoading(false);
        }
    }, [componentId, funnelId]);

    // ============================================================================
    // UPDATE PROPERTY
    // ============================================================================

    const updateProperty = useCallback(async (key: string, value: any) => {
        if (!componentId || !isConnected) {
            console.warn(`Cannot update property ${key}: component not connected`);
            return;
        }

        try {
            console.log(`🔧 Updating property ${componentId}.${key} =`, value);

            // Atualizar estado local imediatamente (optimistic update)
            setProperties(prev => ({ ...prev, [key]: value }));
            setHasUnsavedChanges(true);

            // Armazenar mudança para auto-save
            unsavedChangesRef.current[key] = value;

            if (autoSave) {
                // Auto-save com debounce
                if (autoSaveTimeoutRef.current) {
                    clearTimeout(autoSaveTimeoutRef.current);
                }

                autoSaveTimeoutRef.current = setTimeout(async () => {
                    await saveUnsavedChanges();
                }, autoSaveDelay);

            } else {
                // Salvar imediatamente se auto-save estiver desabilitado
                await apiRef.current.updateProperty(componentId, key, value, funnelId);
                setLastSaved(new Date());
                setHasUnsavedChanges(false);
                delete unsavedChangesRef.current[key];
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar propriedade';
            setError(errorMessage);

            // Reverter mudança local em caso de erro
            setProperties(prev => {
                const reverted = { ...prev };
                // Voltar ao valor anterior (seria ideal manter um histórico)
                delete reverted[key];
                return reverted;
            });

            console.error(`❌ Error updating property ${key}:`, err);
        }
    }, [componentId, funnelId, isConnected, autoSave, autoSaveDelay]);

    // ============================================================================
    // UPDATE MULTIPLE PROPERTIES
    // ============================================================================

    const updateProperties = useCallback(async (newProperties: Record<string, any>) => {
        if (!componentId || !isConnected) {
            console.warn(`Cannot update properties: component not connected`);
            return;
        }

        try {
            console.log(`🔧 Updating multiple properties for ${componentId}:`, newProperties);

            // Atualizar estado local
            setProperties(prev => ({ ...prev, ...newProperties }));
            setHasUnsavedChanges(true);

            // Salvar na API
            await apiRef.current.updateConfiguration(componentId, { ...properties, ...newProperties }, funnelId);

            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            unsavedChangesRef.current = {};

            console.log(`✅ Multiple properties updated for ${componentId}`);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar propriedades';
            setError(errorMessage);
            console.error(`❌ Error updating properties:`, err);
        }
    }, [componentId, funnelId, isConnected, properties]);

    // ============================================================================
    // SAVE UNSAVED CHANGES
    // ============================================================================

    const saveUnsavedChanges = useCallback(async () => {
        if (Object.keys(unsavedChangesRef.current).length === 0) return;

        try {
            console.log(`💾 Auto-saving changes for ${componentId}:`, unsavedChangesRef.current);

            const updatedProperties = { ...properties, ...unsavedChangesRef.current };
            await apiRef.current.updateConfiguration(componentId, updatedProperties, funnelId);

            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            unsavedChangesRef.current = {};

            console.log(`✅ Auto-save completed for ${componentId}`);

        } catch (err) {
            console.error(`❌ Error in auto-save:`, err);
            setError(err instanceof Error ? err.message : 'Erro no auto-save');
        }
    }, [componentId, funnelId, properties]);

    // ============================================================================
    // RESET TO DEFAULTS
    // ============================================================================

    const resetToDefaults = useCallback(async () => {
        if (!componentId || !componentDefinition) return;

        try {
            console.log(`🔄 Resetting ${componentId} to defaults`);

            await apiRef.current.resetToDefaults(componentId, funnelId);

            // Recarregar configuração
            await loadConfiguration();

            console.log(`✅ Reset to defaults completed for ${componentId}`);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao resetar configuração';
            setError(errorMessage);
            console.error(`❌ Error resetting to defaults:`, err);
        }
    }, [componentId, funnelId, componentDefinition, loadConfiguration]);

    // ============================================================================
    // REFRESH
    // ============================================================================

    const refresh = useCallback(async () => {
        console.log(`🔄 Refreshing configuration for ${componentId}`);
        await loadConfiguration();
    }, [loadConfiguration, componentId]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Resetar flag de definição carregada quando componentId mudar
    useEffect(() => {
        definitionLoadedRef.current = false;
    }, [componentId]);

    // Carregar configuração inicial
    useEffect(() => {
        loadConfiguration();
    }, [loadConfiguration]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            // Salvar mudanças pendentes na desmontagem
            if (Object.keys(unsavedChangesRef.current).length > 0) {
                saveUnsavedChanges();
            }
        };
    }, [saveUnsavedChanges]);

    // ============================================================================
    // REAL-TIME SYNC (WebSocket ou Server-Sent Events)
    // ============================================================================

    useEffect(() => {
        if (!realTimeSync || !isConnected) return;

        // TODO: Implementar WebSocket ou Server-Sent Events
        console.log(`🔗 Real-time sync enabled for ${componentId}`);

        // Placeholder para conexão real-time
        // const ws = new WebSocket(`ws://localhost:3000/api/components/${componentId}/sync`);
        // ws.onmessage = (event) => {
        //   const update = JSON.parse(event.data);
        //   if (update.type === 'configuration-update') {
        //     setProperties(update.properties);
        //   }
        // };

        // return () => {
        //   ws.close();
        // };
    }, [realTimeSync, isConnected, componentId]);

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        // Estado
        properties,
        isLoading,
        isConnected,
        error,

        // Ações
        updateProperty,
        updateProperties,
        resetToDefaults,
        refresh,

        // Metadados
        componentDefinition,
        lastSaved,
        hasUnsavedChanges,

        // Estado da conexão
        connectionStatus
    };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook especializado para componentes de quiz
 */
export function useQuizComponentConfiguration(
    componentId: string,
    funnelId?: string
) {
    return useComponentConfiguration({
        componentId,
        funnelId,
        realTimeSync: true,
        autoSave: true,
        autoSaveDelay: 1500
    });
}

/**
 * Hook para propriedades específicas com type safety
 */
export function useComponentProperty<T = any>(
    componentId: string,
    propertyKey: string,
    funnelId?: string
): {
    value: T;
    setValue: (value: T) => Promise<void>;
    isLoading: boolean;
    error: string | null;
} {
    const { properties, updateProperty, isLoading, error } = useComponentConfiguration({
        componentId,
        funnelId
    });

    return {
        value: properties[propertyKey] as T,
        setValue: (value: T) => updateProperty(propertyKey, value),
        isLoading,
        error
    };
}