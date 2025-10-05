/**
 * 🎯 ÍNDICE DO SISTEMA MODULAR - VERSÃO CORRIGIDA
 * 
 * Exportações seguras apenas dos componentes que realmente existem
 */

import React from 'react';

// 🏗️ Tipos que realmente existem
export type {
    ComponentType,
    ModularComponent,
    ModularFunnel
} from '@/types/modular-editor';

// 🎨 Componentes principais que existem
export { default as ModernModularEditor } from './ModernModularEditor';
export { default as ModularSystemProof } from './ModularSystemProof';
export { default as ModularSystemDemo } from './ModularSystemDemo';
export { default as ModularQuizEditor } from './ModularQuizEditor';
export { default as ModularEditorExample } from './ModularEditorExample';

// 🎛️ Painel de propriedades (se existir)
export { ModularPropertiesPanel } from './properties-panel';

// � Hook que existe
export { useModularEditor } from './useModularEditor';

// 🔧 Utilitários e helpers
export const ModularEditorUtils = {
    // Gerador de IDs únicos
    generateId: (): string => {
        return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Validar estrutura de dados
    validateModularData: (data: any): boolean => {
        if (!data || !Array.isArray(data.steps)) return false;

        return data.steps.every((step: any) =>
            step.id &&
            step.name &&
            step.type &&
            Array.isArray(step.components)
        );
    },

    // Converter dados legados para formato modular
    convertLegacyData: (legacySteps: any[]): ModularStep[] => {
        // Implementar conversão de dados do sistema antigo
        return legacySteps.map((legacyStep, index) => ({
            id: `step_${index}_${Date.now()}`,
            name: legacyStep.name || `Etapa ${index + 1}`,
            type: legacyStep.type || 'custom',
            components: legacyStep.components || [],
            settings: {
                backgroundColor: '#ffffff',
                padding: 24,
                minHeight: 400,
                centerContent: true
            },
            validation: {
                required: false
            }
        }));
    },

    // Exportar para diferentes formatos
    exportToJSON: (steps: ModularStep[]) => {
        return JSON.stringify({
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            steps,
            metadata: {
                totalSteps: steps.length,
                totalComponents: steps.reduce((acc, step) => acc + step.components.length, 0)
            }
        }, null, 2);
    },

    // Estatísticas do projeto
    getProjectStats: (steps: ModularStep[]) => {
        const stats = {
            totalSteps: steps.length,
            totalComponents: 0,
            componentsByType: {} as Record<ComponentType, number>,
            stepsByType: {} as Record<string, number>
        };

        steps.forEach(step => {
            // Contar etapas por tipo
            stats.stepsByType[step.type] = (stats.stepsByType[step.type] || 0) + 1;

            step.components.forEach(component => {
                // Contar componentes totais
                stats.totalComponents++;

                // Contar componentes por tipo
                stats.componentsByType[component.type] =
                    (stats.componentsByType[component.type] || 0) + 1;
            });
        });

        return stats;
    }
};

// 🎨 Constantes e configurações
export const MODULAR_EDITOR_CONFIG = {
    // Versão do sistema
    VERSION: '1.0.0',

    // Configurações padrão
    DEFAULT_SETTINGS: {
        autoSave: true,
        autoSaveInterval: 2000,
        maxHistorySteps: 50,
        enableDragDrop: true,
        showComponentOutlines: true
    },

    // Limites do sistema
    LIMITS: {
        maxStepsPerProject: 100,
        maxComponentsPerStep: 50,
        maxTextLength: 10000,
        maxImageSize: 5 * 1024 * 1024, // 5MB
        maxOptionsPerComponent: 20
    },

    // Temas e cores
    THEMES: {
        default: {
            primary: '#3b82f6',
            secondary: '#6b7280',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            background: '#ffffff',
            surface: '#f9fafb'
        }
    }
};

// 📱 Hooks utilitários
export const useModularEditorConfig = () => {
    const [config, setConfig] = React.useState(MODULAR_EDITOR_CONFIG.DEFAULT_SETTINGS);

    const updateConfig = (updates: Partial<typeof config>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    };

    return { config, updateConfig };
};

// 🔍 Hook para busca e filtros
export const useModularSearch = (steps: ModularStep[]) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterType, setFilterType] = React.useState<ComponentType | 'all'>('all');

    const filteredSteps = React.useMemo(() => {
        return steps.filter(step => {
            const matchesSearch = searchTerm === '' ||
                step.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                step.components.some(comp =>
                    JSON.stringify(comp).toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesType = filterType === 'all' ||
                step.components.some(comp => comp.type === filterType);

            return matchesSearch && matchesType;
        });
    }, [steps, searchTerm, filterType]);

    return {
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        filteredSteps
    };
};

import React from 'react';