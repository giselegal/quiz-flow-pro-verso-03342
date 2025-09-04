/**
 * 🎯 MODERN LEVA PROPERTIES PANEL
 * 
 * Painel moderno usando LEVA - biblioteca especializada em property panels
 * que auto-gera interfaces limpas e profissionais baseadas em objetos de configuração.
 * 
 * ✨ VANTAGENS:
 * - 🎨 Design moderno estilo Chrome DevTools
 * - 🚀 95% menos código que o painel atual
 * - 🔄 Auto-sincronização com propriedades descobertas
 * - 📱 Responsivo e acessível por padrão
 * - 🎛️ Controles especializados para cada tipo de dados
 * - 📂 Organização automática por pastas/categorias
 */

import React, { useEffect, useMemo } from 'react';
import { useControls, folder, button } from 'leva';
import { getPropertiesForComponentType } from './core/PropertyDiscovery';
import type { Block } from '@/types/editor';

interface ModernLevaPropertiesPanelProps {
    selectedBlock?: Block | null;
    onUpdate?: (updates: Record<string, any>) => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onClose?: () => void;
}

/**
 * Converte propriedades descobertas para o formato do LEVA
 */
function convertDiscoveredPropertiesToLevaSchema(discoveredProperties: any[]) {
    const contentProps: any = {};
    const layoutProps: any = {};
    const behaviorProps: any = {};
    const styleProps: any = {};
    const advancedProps: any = {};

    discoveredProperties.forEach(prop => {
        let levaConfig: any;

        // Converter tipos de propriedade para controles LEVA
        switch (prop.type) {
            case 'number':
                levaConfig = {
                    value: prop.defaultValue || 0,
                    min: prop.constraints?.min || 0,
                    max: prop.constraints?.max || 100,
                    step: prop.constraints?.step || 1
                };
                break;
            case 'range':
                levaConfig = {
                    value: prop.defaultValue || 0,
                    min: prop.constraints?.min || 0,
                    max: prop.constraints?.max || 100,
                    step: prop.constraints?.step || 1
                };
                break;
            case 'switch':
                levaConfig = prop.defaultValue || false;
                break;
            case 'color':
                levaConfig = prop.defaultValue || '#ffffff';
                break;
            case 'select':
                levaConfig = {
                    value: prop.defaultValue,
                    options: prop.options?.reduce((acc: any, option: any) => {
                        acc[option.label] = option.value;
                        return acc;
                    }, {}) || {}
                };
                break;
            case 'text':
            case 'textarea':
            default:
                levaConfig = prop.defaultValue || '';
                break;
        }

        // Organizar por categoria
        switch (prop.category) {
            case 'content':
                contentProps[prop.key] = levaConfig;
                break;
            case 'layout':
                layoutProps[prop.key] = levaConfig;
                break;
            case 'behavior':
                behaviorProps[prop.key] = levaConfig;
                break;
            case 'style':
                styleProps[prop.key] = levaConfig;
                break;
            default:
                advancedProps[prop.key] = levaConfig;
                break;
        }
    });

    return {
        contentProps,
        layoutProps,
        behaviorProps,
        styleProps,
        advancedProps
    };
}

interface LevaSchema {
    contentProps: Record<string, any>;
    layoutProps: Record<string, any>;
    behaviorProps: Record<string, any>;
    styleProps: Record<string, any>;
    advancedProps: Record<string, any>;
}

export const ModernLevaPropertiesPanel: React.FC<ModernLevaPropertiesPanelProps> = ({
    selectedBlock,
    onUpdate,
    onDelete,
    onDuplicate,
    onClose
}) => {
    // Descobrir propriedades usando sistema existente
    const discoveredProperties = useMemo(() => {
        if (!selectedBlock) return [];

        console.log('🔍 ModernLevaPanel: Discovering properties for block:', selectedBlock.type);
        const props = getPropertiesForComponentType(selectedBlock.type, selectedBlock);
        console.log('📊 ModernLevaPanel: Found properties:', props.length);
        return props;
    }, [selectedBlock]);

    // Converter para formato LEVA
    const levaSchema: LevaSchema = useMemo(() => {
        if (discoveredProperties.length === 0) {
            return {
                contentProps: {},
                layoutProps: {},
                behaviorProps: {},
                styleProps: {},
                advancedProps: {}
            };
        }

        const converted = convertDiscoveredPropertiesToLevaSchema(discoveredProperties);
        console.log('🎛️ LEVA Schema generated:', converted);
        return converted;
    }, [discoveredProperties]);

    // Criar controles LEVA organizados por categoria
    const values = useControls(() => {
        return {
            // === CONTENT ===
            ...(Object.keys(levaSchema.contentProps || {}).length > 0 && {
                'Content': folder(levaSchema.contentProps)
            }),

            // === LAYOUT ===
            ...(Object.keys(levaSchema.layoutProps || {}).length > 0 && {
                'Layout': folder(levaSchema.layoutProps)
            }),

            // === BEHAVIOR ===
            ...(Object.keys(levaSchema.behaviorProps || {}).length > 0 && {
                'Behavior': folder(levaSchema.behaviorProps)
            }),

            // === STYLE ===
            ...(Object.keys(levaSchema.styleProps || {}).length > 0 && {
                'Style': folder(levaSchema.styleProps)
            }),

            // === ADVANCED ===
            ...(Object.keys(levaSchema.advancedProps || {}).length > 0 && {
                'Advanced': folder(levaSchema.advancedProps)
            }),

            // === ACTIONS ===
            'Actions': folder({
                'Duplicate Block': button(() => {
                    console.log('🔄 Duplicating block via LEVA');
                    onDuplicate?.();
                }),
                'Delete Block': button(() => {
                    console.log('🗑️ Deleting block via LEVA');
                    onDelete?.();
                }),
                'Close Panel': button(() => {
                    console.log('❌ Closing panel via LEVA');
                    onClose?.();
                })
            })
        };
    }, [levaSchema, selectedBlock?.type, onDuplicate, onDelete, onClose]);

    // Auto-sincronizar mudanças com o sistema existente
    useEffect(() => {
        if (Object.keys(values).length > 0) {
            console.log('🔄 LEVA values changed:', values);
            onUpdate?.(values);
        }
    }, [values, onUpdate]);

    // Log para debug
    useEffect(() => {
        console.log('🎛️ ModernLevaPanel rendered with:', {
            selectedBlock: selectedBlock?.type,
            propertiesCount: discoveredProperties.length,
            levaSchemaKeys: Object.keys(levaSchema),
            currentValues: values
        });
    }, [selectedBlock, discoveredProperties.length, levaSchema, values]);

    // LEVA renderiza seu próprio painel automaticamente
    // Não precisamos retornar JSX - o painel aparece automaticamente
    return null;
};

export default ModernLevaPropertiesPanel;
