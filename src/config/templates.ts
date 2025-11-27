/**
 * 📋 TEMPLATES CONFIGURATION
 * 
 * Configuração centralizada de templates disponíveis no sistema.
 * Este arquivo exporta a lista de templates e seus metadados.
 * 
 * @version 1.0.0
 */

import { TemplateType } from '@/types/funnel.shared';

export interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    type: string;
    steps: number;
    category: 'quiz' | 'leadgen' | 'sales' | 'custom';
    thumbnail?: string;
    tags: string[];
    isActive: boolean;
    createdAt?: string;
}

/**
 * Lista de templates disponíveis
 */
export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
    {
        id: 'quiz21StepsComplete',
        name: 'Quiz 21 Steps Complete',
        description: 'Template completo com 21 etapas para quiz de moda/estilo',
        type: TemplateType.QUIZ_21_STEPS,
        steps: 21,
        category: 'quiz',
        tags: ['quiz', 'fashion', 'style', 'complete'],
        isActive: true,
    },
    {
        id: 'quizSimple',
        name: 'Quiz Simples',
        description: 'Template simplificado para quiz rápido',
        type: TemplateType.QUIZ_SIMPLE,
        steps: 5,
        category: 'quiz',
        tags: ['quiz', 'simple', 'fast'],
        isActive: true,
    },
    {
        id: 'leadGeneration',
        name: 'Geração de Leads',
        description: 'Template para captura de leads',
        type: TemplateType.LEAD_GEN,
        steps: 3,
        category: 'leadgen',
        tags: ['leadgen', 'capture', 'form'],
        isActive: true,
    },
    {
        id: 'salesPage',
        name: 'Página de Vendas',
        description: 'Template de página de vendas otimizada',
        type: TemplateType.SALES_PAGE,
        steps: 1,
        category: 'sales',
        tags: ['sales', 'landing', 'conversion'],
        isActive: true,
    },
];

/**
 * Busca template por ID
 */
export function getTemplateById(id: string): TemplateConfig | undefined {
    return AVAILABLE_TEMPLATES.find(t => t.id === id);
}

/**
 * Busca templates por categoria
 */
export function getTemplatesByCategory(category: TemplateConfig['category']): TemplateConfig[] {
    return AVAILABLE_TEMPLATES.filter(t => t.category === category && t.isActive);
}

/**
 * Busca templates por tag
 */
export function getTemplatesByTag(tag: string): TemplateConfig[] {
    return AVAILABLE_TEMPLATES.filter(t => t.tags.includes(tag) && t.isActive);
}

/**
 * Retorna todos os templates ativos
 */
export function getActiveTemplates(): TemplateConfig[] {
    return AVAILABLE_TEMPLATES.filter(t => t.isActive);
}

/**
 * Serviço para gerenciamento de templates
 */
export class TemplateService {
    static getAll(): TemplateConfig[] {
        return AVAILABLE_TEMPLATES;
    }

    static getById(id: string): TemplateConfig | undefined {
        return getTemplateById(id);
    }

    static getByCategory(category: TemplateConfig['category']): TemplateConfig[] {
        return getTemplatesByCategory(category);
    }

    static getByTag(tag: string): TemplateConfig[] {
        return getTemplatesByTag(tag);
    }

    static getActive(): TemplateConfig[] {
        return getActiveTemplates();
    }

    static search(query: string): TemplateConfig[] {
        const lowerQuery = query.toLowerCase();
        return AVAILABLE_TEMPLATES.filter(t => 
            t.isActive && (
                t.name.toLowerCase().includes(lowerQuery) ||
                t.description.toLowerCase().includes(lowerQuery) ||
                t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
            )
        );
    }
}
