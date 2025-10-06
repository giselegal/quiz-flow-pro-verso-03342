/**
 * 🎯 SISTEMA DE REGISTRY DE PAINÉIS DE PROPRIEDADES
 * 
 * Permite registrar e resolver painéis de propriedades específicos para cada tipo de step.
 * Facilita a adição de novos tipos de step sem modificar código existente.
 */

import React from 'react';

// ============================================================
// INTERFACES E TIPOS
// ============================================================

export interface PropertiesPanelProps {
    stepId: string;
    stepType: string;
    stepData: any;
    onUpdate: (updates: Partial<any>) => void;
    onDelete?: () => void;
}

export interface PropertiesPanelDefinition {
    /** Tipo de step que este painel suporta */
    stepType: string;

    /** Componente React do painel */
    component: React.ComponentType<PropertiesPanelProps>;

    /** Label amigável para exibição */
    label: string;

    /** Descrição opcional */
    description?: string;

    /** Ícone opcional */
    icon?: string;

    /** Prioridade (maior = mais alta prioridade para matching) */
    priority?: number;
}

// ============================================================
// REGISTRY
// ============================================================

class PropertiesPanelRegistryClass {
    private panels: Map<string, PropertiesPanelDefinition> = new Map();
    private fallbackPanel: PropertiesPanelDefinition | null = null;

    /**
     * 📝 Registrar um painel de propriedades
     */
    register(definition: PropertiesPanelDefinition): void {
        this.panels.set(definition.stepType, definition);
        console.log(`[PropertiesPanelRegistry] Registered panel for type: ${definition.stepType}`);
    }

    /**
     * 📝 Registrar múltiplos painéis de uma vez
     */
    registerMany(definitions: PropertiesPanelDefinition[]): void {
        definitions.forEach(def => this.register(def));
    }

    /**
     * 🎯 Definir painel fallback (usado quando tipo não tem painel específico)
     */
    setFallback(definition: PropertiesPanelDefinition): void {
        this.fallbackPanel = definition;
        console.log(`[PropertiesPanelRegistry] Fallback panel set`);
    }

    /**
     * 🔍 Resolver painel para um tipo de step
     */
    resolve(stepType: string): PropertiesPanelDefinition | null {
        // Buscar painel específico
        const panel = this.panels.get(stepType);
        if (panel) {
            return panel;
        }

        // Fallback para painel genérico
        if (this.fallbackPanel) {
            console.warn(`[PropertiesPanelRegistry] No specific panel for "${stepType}", using fallback`);
            return this.fallbackPanel;
        }

        console.error(`[PropertiesPanelRegistry] No panel found for type "${stepType}" and no fallback configured`);
        return null;
    }

    /**
     * 📋 Listar todos os painéis registrados
     */
    list(): PropertiesPanelDefinition[] {
        return Array.from(this.panels.values()).sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    /**
     * 🗑️ Limpar todos os painéis (útil para testes)
     */
    clear(): void {
        this.panels.clear();
        this.fallbackPanel = null;
    }
}

// ============================================================
// SINGLETON EXPORT
// ============================================================

export const PropertiesPanelRegistry = new PropertiesPanelRegistryClass();

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * 🎨 Helper para criar definição de painel
 */
export function createPanelDefinition(
    stepType: string,
    component: React.ComponentType<PropertiesPanelProps>,
    options?: Partial<Omit<PropertiesPanelDefinition, 'stepType' | 'component'>>
): PropertiesPanelDefinition {
    return {
        stepType,
        component,
        label: options?.label || stepType,
        description: options?.description,
        icon: options?.icon,
        priority: options?.priority || 0,
    };
}
