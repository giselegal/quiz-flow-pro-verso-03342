/**
 * 🎯 CONNECTED LEVA PANEL
 * 
 * Painel LEVA conectado aos dados reais das 21 etapas do quiz
 * Integra com EditorContext para sincronização em tempo real
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { useControls, folder, button } from 'leva';
import { getPropertiesForComponentType } from './core/PropertyDiscovery';
import { useEditor } from '@/hooks/useEditor';
import type { Block } from '@/types/editor';

interface ConnectedLevaPanelProps {
    selectedBlock?: Block | null;
}

/**
 * Converte propriedades descobertas para o formato do LEVA
 */
function convertDiscoveredPropertiesToLevaSchema(discoveredProperties: any[], currentBlock?: Block) {
    const contentProps: any = {};
    const layoutProps: any = {};
    const behaviorProps: any = {};
    const styleProps: any = {};
    const advancedProps: any = {};

    discoveredProperties.forEach(prop => {
        // Usar valor atual do bloco se disponível, senão usar defaultValue
        const currentValue = getCurrentValue(prop.key, currentBlock) ?? prop.defaultValue;

        let levaConfig: any;

        // Converter tipos de propriedade para controles LEVA
        switch (prop.type) {
            case 'number':
                levaConfig = {
                    value: currentValue || 0,
                    min: prop.constraints?.min || 0,
                    max: prop.constraints?.max || 100,
                    step: prop.constraints?.step || 1
                };
                break;
            case 'range':
                levaConfig = {
                    value: currentValue || 0,
                    min: prop.constraints?.min || 0,
                    max: prop.constraints?.max || 100,
                    step: prop.constraints?.step || 1
                };
                break;
            case 'switch':
                levaConfig = currentValue !== undefined ? currentValue : (prop.defaultValue || false);
                break;
            case 'color':
                levaConfig = currentValue || prop.defaultValue || '#ffffff';
                break;
            case 'select':
                levaConfig = {
                    value: currentValue || prop.defaultValue,
                    options: prop.options?.reduce((acc: any, option: any) => {
                        acc[option.label] = option.value;
                        return acc;
                    }, {}) || {}
                };
                break;
            case 'text':
            case 'textarea':
            default:
                levaConfig = currentValue || prop.defaultValue || '';
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

/**
 * Obtém o valor atual de uma propriedade do bloco
 */
function getCurrentValue(propKey: string, currentBlock?: Block): any {
    if (!currentBlock) return undefined;

    // Verificar em properties
    if (currentBlock.properties && currentBlock.properties[propKey] !== undefined) {
        return currentBlock.properties[propKey];
    }

    // Verificar em content com chave composta (ex: content.text)
    if (propKey.startsWith('content.')) {
        const contentKey = propKey.substring(8); // Remove 'content.'
        if (currentBlock.content && currentBlock.content[contentKey] !== undefined) {
            return currentBlock.content[contentKey];
        }
    }

    // Verificar diretamente em content
    if (currentBlock.content && currentBlock.content[propKey] !== undefined) {
        return currentBlock.content[propKey];
    }

    return undefined;
}

export const ConnectedLevaPanel: React.FC<ConnectedLevaPanelProps> = ({
    selectedBlock
}) => {
    // Conectar ao EditorContext para atualizações em tempo real
    const { updateBlock, deleteBlock } = useEditor();

    // Descobrir propriedades usando sistema existente
    const discoveredProperties = useMemo(() => {
        if (!selectedBlock) return [];

        console.log('🔍 ConnectedLevaPanel: Discovering properties for block:', selectedBlock.type);
        console.log('📦 Current block data:', selectedBlock);

        const props = getPropertiesForComponentType(selectedBlock.type, selectedBlock);
        console.log('📊 ConnectedLevaPanel: Found properties:', props.length);
        return props;
    }, [selectedBlock]);

    // Converter para formato LEVA
    const levaSchema = useMemo(() => {
        if (discoveredProperties.length === 0) {
            return {
                contentProps: {},
                layoutProps: {},
                behaviorProps: {},
                styleProps: {},
                advancedProps: {}
            };
        }

        const converted = convertDiscoveredPropertiesToLevaSchema(discoveredProperties, selectedBlock || undefined);
        console.log('🎛️ LEVA Schema generated with REAL values:', converted);
        return converted;
    }, [discoveredProperties, selectedBlock]);

    // Callback para atualizar bloco no EditorContext
    const handleUpdate = useCallback((updates: Record<string, any>) => {
        if (!selectedBlock) return;

        console.log('📤 ConnectedLevaPanel sending updates to EditorContext:', updates);

        // Separar updates entre properties e content
        const propertyUpdates: any = {};
        const contentUpdates: any = {};

        Object.entries(updates).forEach(([key, value]) => {
            if (key.startsWith('content.')) {
                const contentKey = key.substring(8);
                contentUpdates[contentKey] = value;
            } else {
                propertyUpdates[key] = value;
            }
        });

        // Atualizar bloco via EditorContext
        const finalUpdates: any = {};

        if (Object.keys(propertyUpdates).length > 0) {
            finalUpdates.properties = {
                ...selectedBlock.properties,
                ...propertyUpdates
            };
        }

        if (Object.keys(contentUpdates).length > 0) {
            finalUpdates.content = {
                ...selectedBlock.content,
                ...contentUpdates
            };
        }

        console.log('🔄 Final updates to EditorContext:', finalUpdates);
        updateBlock(selectedBlock.id, finalUpdates);
    }, [selectedBlock, updateBlock]);

    // Criar controles LEVA organizados por categoria
    const values = useControls(() => {
        const blockTypeName = selectedBlock?.type || 'Block';
        console.log('🎛️ Creating controls for block type:', blockTypeName);

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
                    console.log('🔄 Duplicating block via ConnectedLEVA');
                    // TODO: implementar duplicação
                }),
                'Delete Block': button(() => {
                    console.log('🗑️ Deleting block via ConnectedLEVA');
                    if (selectedBlock) {
                        deleteBlock(selectedBlock.id);
                    }
                })
            })
        };
    }, [levaSchema, selectedBlock?.type, selectedBlock?.id, updateBlock, deleteBlock]);

    // Auto-sincronizar mudanças com EditorContext
    useEffect(() => {
        if (Object.keys(values).length > 0) {
            console.log('🔄 LEVA values changed:', values);

            // Extrair valores de todas as categorias para um objeto único
            const allUpdates: Record<string, any> = {};

            // Processar valores de todas as categorias
            Object.entries(values).forEach(([categoryOrProperty, value]) => {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // É uma categoria (folder), processar suas propriedades
                    Object.entries(value).forEach(([propKey, propValue]) => {
                        allUpdates[propKey] = propValue;
                    });
                } else {
                    // É uma propriedade direta
                    allUpdates[categoryOrProperty] = value;
                }
            });

            // Só atualizar se houver mudanças reais
            if (Object.keys(allUpdates).length > 0) {
                handleUpdate(allUpdates);
            }
        }
    }, [values, handleUpdate]);

    // Log para debug
    useEffect(() => {
        console.log('🎛️ ConnectedLevaPanel rendered with:', {
            selectedBlock: selectedBlock?.type,
            selectedBlockId: selectedBlock?.id,
            propertiesCount: discoveredProperties.length,
            levaSchemaKeys: Object.keys(levaSchema),
            currentValues: values
        });
    }, [selectedBlock, discoveredProperties.length, levaSchema, values]);

    // LEVA renderiza seu próprio painel automaticamente
    // Não precisamos retornar JSX - o painel aparece automaticamente
    return null;
};

export default ConnectedLevaPanel;
