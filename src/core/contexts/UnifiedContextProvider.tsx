/**
 * 🎯 UNIFIED CONTEXT PROVIDER
 * 
 * Provider central que consolida todos os contextos do sistema:
 * - EditorContext (estado do editor)
 * - FunnelConfigProvider (configuração de funis)
 * - useUnifiedEditor (hook de editor unificado)
 * - Persistência contextual
 * - Template management
 * 
 * OBJETIVO: Eliminar sobreposição de contextos e padronizar gerenciamento de estado
 */

import React, { createContext, useContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { useUnifiedEditor, type UnifiedEditorReturn } from '../../hooks/core/useUnifiedEditor';
import { TemplateRegistry, type UnifiedTemplate } from '@/config/unifiedTemplatesRegistry';
import { FunnelContext } from './FunnelContext';
import { useToast } from '../../components/ui/use-toast';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type UnifiedTemplateData = UnifiedTemplate;

export interface UnifiedContextState {
    // Editor state (from useUnifiedEditor)
    editor: UnifiedEditorReturn;

    // Template management
    templates: {
        current: UnifiedTemplateData | null;
        available: UnifiedTemplateData[];
        loading: boolean;
        error: string | null;
    };

    // Persistence state
    persistence: {
        isSaving: boolean;
        isLoading: boolean;
        lastSaved: Date | null;
        context: FunnelContext;
        autoSaveEnabled: boolean;
    };

    // UI state
    ui: {
        sidebarOpen: boolean;
        activePanel: 'components' | 'properties' | 'templates' | 'settings';
        viewMode: 'desktop' | 'mobile' | 'tablet';
        previewMode: boolean;
        fullscreen: boolean;
    };

    // Navigation state
    navigation: {
        currentRoute: string;
        canNavigateAway: boolean;
        hasUnsavedChanges: boolean;
    };
}

export interface UnifiedContextActions {
    // Template actions
    loadTemplate: (templateId: string) => Promise<void>;
    createFromTemplate: (templateId: string, name?: string) => Promise<string | null>;
    saveAsTemplate: (name: string, description?: string) => Promise<string | null>;

    // Persistence actions
    save: () => Promise<{ success: boolean; error?: string }>;
    load: (id: string) => Promise<void>;
    enableAutoSave: (enabled: boolean) => void;
    setContext: (context: FunnelContext) => void;

    // UI actions
    toggleSidebar: () => void;
    setActivePanel: (panel: UnifiedContextState['ui']['activePanel']) => void;
    setViewMode: (mode: UnifiedContextState['ui']['viewMode']) => void;
    togglePreview: () => void;
    toggleFullscreen: () => void;

    // Navigation actions
    navigateTo: (route: string) => void;
    checkUnsavedChanges: () => boolean;
    confirmNavigation: () => Promise<boolean>;
}

export interface UnifiedContextValue extends UnifiedContextState, UnifiedContextActions { }

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const UnifiedContext = createContext<UnifiedContextValue | null>(null);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export interface UnifiedContextProviderProps {
    children: ReactNode;
    initialContext?: FunnelContext;
    initialTemplate?: string;
    enableAutoSaveInitial?: boolean;
    debugMode?: boolean;
}

export const UnifiedContextProvider: React.FC<UnifiedContextProviderProps> = ({
    children,
    initialContext = FunnelContext.EDITOR,
    initialTemplate,
    enableAutoSaveInitial = true,
    debugMode = false
}) => {
    const { toast } = useToast();

    // ========================================================================
    // CORE HOOKS
    // ========================================================================

    // Main editor hook
    const editor = useUnifiedEditor();

    // Contextual service for persistence
    const [currentContext, setCurrentContext] = useState(initialContext);

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================

    // Template state
    const [templates, setTemplates] = useState<UnifiedContextState['templates']>({
        current: null,
        available: [],
        loading: false,
        error: null
    });

    // Persistence state
    const [persistence, setPersistence] = useState<UnifiedContextState['persistence']>({
        isSaving: false,
        isLoading: false,
        lastSaved: null,
        context: currentContext,
        autoSaveEnabled: enableAutoSaveInitial
    });

    // UI state
    const [ui, setUI] = useState<UnifiedContextState['ui']>({
        sidebarOpen: true,
        activePanel: 'components',
        viewMode: 'desktop',
        previewMode: false,
        fullscreen: false
    });

    // Navigation state
    const [navigation, setNavigation] = useState<UnifiedContextState['navigation']>({
        currentRoute: window.location.pathname,
        canNavigateAway: true,
        hasUnsavedChanges: false
    });

    // ========================================================================
    // TEMPLATE ACTIONS
    // ========================================================================

    const loadTemplate = useCallback(async (templateId: string) => {
        setTemplates(prev => ({ ...prev, loading: true, error: null }));

        try {
            if (debugMode) {
                console.log('🔄 UnifiedContext: Loading template:', templateId);
            }

            const template = TemplateRegistry.getById(templateId);
            if (!template) {
                throw new Error(`Template não encontrado: ${templateId}`);
            }

            setTemplates(prev => ({ ...prev, current: template, loading: false }));

            if (debugMode) {
                console.log('✅ UnifiedContext: Template loaded:', template.name);
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setTemplates(prev => ({ ...prev, loading: false, error: errorMessage }));

            toast({
                title: 'Erro ao carregar template',
                description: errorMessage,
                variant: 'destructive'
            });
        }
    }, [debugMode, toast]);

    const createFromTemplate = useCallback(async (templateId: string, name?: string) => {
        try {
            if (debugMode) {
                console.log('🚀 UnifiedContext: Creating funnel from template:', templateId);
            }

            // Criar funil simples baseado no template
            const template = TemplateRegistry.getById(templateId);
            if (!template) {
                throw new Error(`Template não encontrado: ${templateId}`);
            }

            const funnelId = `funnel-${Date.now()}`; // ID temporário

            if (funnelId) {
                // Load the new funnel in the editor
                await editor.loadFunnel(funnelId);

                if (debugMode) {
                    console.log('✅ UnifiedContext: Funnel created and loaded:', funnelId);
                }

                toast({
                    title: 'Funil criado com sucesso',
                    description: `Funil "${name || 'Novo Funil'}" criado a partir do template.`
                });
            }

            return funnelId;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

            toast({
                title: 'Erro ao criar funil',
                description: errorMessage,
                variant: 'destructive'
            });

            return null;
        }
    }, [debugMode, toast, currentContext, editor]);

    const saveAsTemplate = useCallback(async (name: string, description?: string) => {
        try {
            if (!editor.funnel) {
                throw new Error('Nenhum funil carregado para salvar como template');
            }

            if (debugMode) {
                console.log('💾 UnifiedContext: Saving as template:', name, description ? `with description: ${description}` : '');
            }

            // Implementação simples para criar template customizado
            const templateId = `custom-${Date.now()}`;

            // Criar estrutura completa do template incluindo a descrição
            const templateData = {
                id: templateId,
                name,
                description: description || `Template criado a partir do funil "${editor.funnel.name || 'Sem nome'}"`,
                category: 'custom',
                funnel: editor.funnel,
                createdAt: new Date().toISOString()
            };

            // Aqui seria implementada a criação real do template com os dados completos
            console.log('Template customizado criado:', templateData);

            if (templateId) {
                toast({
                    title: 'Template salvo',
                    description: `Template "${name}" criado com sucesso.${description ? ` Descrição: ${description}` : ''}`
                });
            }

            return templateId;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

            toast({
                title: 'Erro ao salvar template',
                description: errorMessage,
                variant: 'destructive'
            });

            return null;
        }
    }, [debugMode, toast, editor.funnel]);

    // ========================================================================
    // PERSISTENCE ACTIONS
    // ========================================================================

    const save = useCallback(async () => {
        setPersistence(prev => ({ ...prev, isSaving: true }));

        try {
            if (debugMode) {
                console.log('💾 UnifiedContext: Saving funnel...');
            }

            const result = await editor.saveFunnel();

            setPersistence(prev => ({
                ...prev,
                isSaving: false,
                lastSaved: result.success ? new Date() : prev.lastSaved
            }));

            if (result.success) {
                setNavigation(prev => ({ ...prev, hasUnsavedChanges: false }));

                if (debugMode) {
                    console.log('✅ UnifiedContext: Funnel saved successfully');
                }
            }

            return result;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

            setPersistence(prev => ({ ...prev, isSaving: false }));

            return { success: false, error: errorMessage };
        }
    }, [debugMode, editor]);

    const load = useCallback(async (id: string) => {
        setPersistence(prev => ({ ...prev, isLoading: true }));

        try {
            if (debugMode) {
                console.log('🔄 UnifiedContext: Loading funnel:', id);
            }

            await editor.loadFunnel(id);

            setPersistence(prev => ({ ...prev, isLoading: false }));
            setNavigation(prev => ({ ...prev, hasUnsavedChanges: false }));

            if (debugMode) {
                console.log('✅ UnifiedContext: Funnel loaded successfully');
            }

        } catch (error) {
            setPersistence(prev => ({ ...prev, isLoading: false }));

            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            toast({
                title: 'Erro ao carregar funil',
                description: errorMessage,
                variant: 'destructive'
            });
        }
    }, [debugMode, toast, editor]);

    const enableAutoSaveAction = useCallback((enabled: boolean) => {
        setPersistence(prev => ({ ...prev, autoSaveEnabled: enabled }));

        if (debugMode) {
            console.log('⚙️ UnifiedContext: Auto-save', enabled ? 'enabled' : 'disabled');
        }
    }, [debugMode]);

    const setContext = useCallback((context: FunnelContext) => {
        setCurrentContext(context);
        setPersistence(prev => ({ ...prev, context }));

        if (debugMode) {
            console.log('🎯 UnifiedContext: Context changed to:', context);
        }
    }, [debugMode]);

    // ========================================================================
    // UI ACTIONS
    // ========================================================================

    const toggleSidebar = useCallback(() => {
        setUI(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
    }, []);

    const setActivePanel = useCallback((panel: UnifiedContextState['ui']['activePanel']) => {
        setUI(prev => ({ ...prev, activePanel: panel }));
    }, []);

    const setViewMode = useCallback((mode: UnifiedContextState['ui']['viewMode']) => {
        setUI(prev => ({ ...prev, viewMode: mode }));
    }, []);

    const togglePreview = useCallback(() => {
        setUI(prev => ({ ...prev, previewMode: !prev.previewMode }));
        editor.setIsPreviewing(!ui.previewMode);
    }, [editor, ui.previewMode]);

    const toggleFullscreen = useCallback(() => {
        setUI(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
    }, []);

    // ========================================================================
    // NAVIGATION ACTIONS
    // ========================================================================

    const navigateTo = useCallback((route: string) => {
        setNavigation(prev => ({ ...prev, currentRoute: route }));
    }, []);

    const checkUnsavedChanges = useCallback(() => {
        return editor.isDirty;
    }, [editor.isDirty]);

    const confirmNavigation = useCallback(async () => {
        if (!editor.isDirty) return true;

        const confirmed = window.confirm(
            'Você tem alterações não salvas. Deseja sair mesmo assim?'
        );

        if (confirmed) {
            setNavigation(prev => ({ ...prev, hasUnsavedChanges: false }));
        }

        return confirmed;
    }, [editor.isDirty]);

    // ========================================================================
    // AUTO-SAVE EFFECT
    // ========================================================================

    useEffect(() => {
        if (!persistence.autoSaveEnabled || !editor.isDirty) return;

        const autoSaveTimer = setTimeout(() => {
            save();
        }, 30000); // Auto-save after 30 seconds of inactivity

        return () => clearTimeout(autoSaveTimer);
    }, [persistence.autoSaveEnabled, editor.isDirty, save]);

    // ========================================================================
    // UNSAVED CHANGES TRACKING
    // ========================================================================

    useEffect(() => {
        setNavigation(prev => ({ ...prev, hasUnsavedChanges: editor.isDirty }));
    }, [editor.isDirty]);

    // ========================================================================
    // INITIAL TEMPLATE LOADING
    // ========================================================================

    useEffect(() => {
        if (initialTemplate) {
            loadTemplate(initialTemplate);
        }
    }, [initialTemplate, loadTemplate]);

    // ========================================================================
    // LOAD AVAILABLE TEMPLATES
    // ========================================================================

    useEffect(() => {
        const loadAvailableTemplates = async () => {
            try {
                const availableTemplates = TemplateRegistry.getAll();
                setTemplates(prev => ({ ...prev, available: availableTemplates }));
            } catch (error) {
                console.error('Failed to load available templates:', error);
            }
        };

        loadAvailableTemplates();
    }, []);

    // ========================================================================
    // CONTEXT VALUE
    // ========================================================================

    const contextValue: UnifiedContextValue = useMemo(() => ({
        // State
        editor,
        templates,
        persistence,
        ui,
        navigation,

        // Template actions
        loadTemplate,
        createFromTemplate,
        saveAsTemplate,

        // Persistence actions
        save,
        load,
        enableAutoSave: enableAutoSaveAction,
        setContext,

        // UI actions
        toggleSidebar,
        setActivePanel,
        setViewMode,
        togglePreview,
        toggleFullscreen,

        // Navigation actions
        navigateTo,
        checkUnsavedChanges,
        confirmNavigation
    }), [
        editor,
        templates,
        persistence,
        ui,
        navigation,
        loadTemplate,
        createFromTemplate,
        saveAsTemplate,
        save,
        load,
        enableAutoSaveAction,
        setContext,
        toggleSidebar,
        setActivePanel,
        setViewMode,
        togglePreview,
        toggleFullscreen,
        navigateTo,
        checkUnsavedChanges,
        confirmNavigation
    ]);

    // ========================================================================
    // DEBUG LOGGING
    // ========================================================================

    useEffect(() => {
        if (debugMode) {
            console.log('🔧 UnifiedContext: State update', {
                editorLoaded: !!editor.funnel,
                templatesAvailable: templates.available.length,
                currentTemplate: templates.current?.name,
                isDirty: editor.isDirty,
                context: currentContext
            });
        }
    }, [debugMode, editor.funnel, editor.isDirty, templates, currentContext]);

    return (
        <UnifiedContext.Provider value={contextValue}>
            {children}
        </UnifiedContext.Provider>
    );
};

// ============================================================================
// HOOK TO USE CONTEXT
// ============================================================================

export const useUnifiedContext = (): UnifiedContextValue => {
    const context = useContext(UnifiedContext);

    if (!context) {
        throw new Error('useUnifiedContext must be used within a UnifiedContextProvider');
    }

    return context;
};

// ============================================================================
// LEGACY COMPATIBILITY HOOKS
// ============================================================================

/**
 * Legacy hook for gradual migration from useEditor
 */
export const useEditorLegacy = () => {
    const unified = useUnifiedContext();

    console.warn('useEditorLegacy is deprecated. Use useUnifiedContext instead.');

    return {
        state: {
            blocks: unified.editor.activeBlocks,
            currentStep: 1, // Placeholder
            selectedBlockId: unified.editor.selectedBlockId,
            isLoading: unified.persistence.isLoading,
            isSaving: unified.persistence.isSaving
        },
        actions: {
            addBlock: unified.editor.legacy.addBlock,
            updateBlock: unified.editor.legacy.updateBlock,
            deleteBlock: unified.editor.legacy.deleteBlock,
            save: unified.save
        }
    };
};

/**
 * Legacy hook for gradual migration from useFunnelConfig
 */
export const useFunnelConfigLegacy = () => {
    const unified = useUnifiedContext();

    console.warn('useFunnelConfigLegacy is deprecated. Use useUnifiedContext instead.');

    return {
        config: unified.editor.funnel?.settings || {},
        updateConfig: () => { }, // Placeholder
        currentStepIndex: 0, // Placeholder
        setCurrentStepIndex: () => { }, // Placeholder
    };
};

export default UnifiedContextProvider;
