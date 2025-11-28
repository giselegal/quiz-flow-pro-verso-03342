/**
 * Deprecated EnhancedBlockRegistry shim.
 *
 * Mantido apenas para compatibilidade com scripts e imports antigos que ainda
 * apontam para `@/components/editor/blocks/EnhancedBlockRegistry`.
 *
 * Toda lógica real de registro foi migrada para `@/core/registry/UnifiedBlockRegistry`.
 * Utilize diretamente:
 *   import { getBlockComponent } from '@/core/registry/UnifiedBlockRegistry';
 * ou o adapter:
 *   import { getEnhancedBlockComponent } from '@/core/registry/UnifiedBlockRegistryAdapter';
 *
 * Plano de remoção: após atualização/limpeza dos scripts (grep por este caminho),
 * este shim será excluído. Não adicionar novos exports aqui.
 */
import React, { type ComponentType } from 'react';
import {
    blockRegistry,
    getBlockComponent as unifiedGet,
    getRegistryStats as unifiedStats,
} from '@/core/registry/UnifiedBlockRegistry';
import { getEnhancedBlockComponent as adapterGet } from '@/core/registry/UnifiedBlockRegistryAdapter';

// Proxy minimalista delegando ao registro unificado
export const ENHANCED_BLOCK_REGISTRY = new Proxy({} as Record<string, ComponentType<any>>, {
    get(_target, prop: string) {
        return blockRegistry.getComponent(prop) || null;
    },
    has(_target, prop: string) {
        return blockRegistry.has(prop);
    },
    ownKeys() {
        return blockRegistry.getAllTypes();
    },
});

// API legada → delega para unificado / adapter
export function getEnhancedBlockComponent(type: string): ComponentType<any> | null {
    return adapterGet(type) || unifiedGet(type) || null;
}

export const getBlockComponent = (type: string): ComponentType<any> | null =>
    unifiedGet(type) || null;

export const getAvailableBlockTypes = (): string[] => blockRegistry.getAllTypes();
export const blockTypeExists = (type: string): boolean => blockRegistry.has(type);
export const getRegistryStats = () => unifiedStats();

// Define de forma mínima alguns blockDefinitions usados em UI legada
export interface LegacyBlockDefinition {
    type: string;
    name: string;
    label: string;
    category: string;
    component: ComponentType<any> | null;
    description?: string;
    defaultProps?: Record<string, any>;
}

export const generateBlockDefinitions = (): LegacyBlockDefinition[] => {
    const pick = (type: string, name: string, category: string, description?: string): LegacyBlockDefinition => ({
        type,
        name,
        label: name,
        category,
        description,
        component: getBlockComponent(type),
        defaultProps: {},
    });
    return [
        pick('text-inline', 'Texto', 'content', 'Adicionar texto formatado'),
        pick('heading-inline', 'Título', 'content', 'Adicionar título'),
        pick('button-inline', 'Botão', 'interactive', 'Botão clicável'),
        pick('image-inline', 'Imagem', 'media', 'Exibir imagem'),
        pick('decorative-bar-inline', 'Barra Decorativa', 'visual', 'Barra decorativa colorida'),
        pick('sales-hero', 'Sales Hero', 'offer', 'Seção hero para página de venda'),
    ];
};

export const getBlockDefinition = (type: string) =>
    generateBlockDefinitions().find(d => d.type === type) || null;

export default ENHANCED_BLOCK_REGISTRY;
