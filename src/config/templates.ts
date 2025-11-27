/**
 * 📋 TEMPLATES CONFIGURATION
 * 
 * Configuração centralizada de templates disponíveis no sistema.
 * Este arquivo exporta a lista de templates e seus metadados.
 * 
 * @version 1.0.0
 */

import { TemplateType } from '@/types/funnel.shared';

export type DifficultyLevel = 'Fácil' | 'Intermediário' | 'Avançado';

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
    // Campos adicionais para compatibilidade com dashboard
    difficulty?: DifficultyLevel;
    rating?: number; // Rating 0-5
    stepCount?: number; // Alias de steps
    preview?: {
        image?: string;
        video?: string;
        demo?: string;
    };
    features?: string[];
    templatePath?: string;
    editorUrl?: string;
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
        stepCount: 21,
        category: 'quiz',
        tags: ['quiz', 'fashion', 'style', 'complete'],
        isActive: true,
        difficulty: 'Avançado',
        rating: 4.8,
        features: ['Multi-step', 'Conditional logic', 'Results page', 'Email capture'],
        templatePath: '/templates/quiz-21-steps',
        editorUrl: '/editor/quiz21StepsComplete',
    },
    {
        id: 'quizSimple',
        name: 'Quiz Simples',
        description: 'Template simplificado para quiz rápido',
        type: TemplateType.QUIZ_SIMPLE,
        steps: 5,
        stepCount: 5,
        category: 'quiz',
        tags: ['quiz', 'simple', 'fast'],
        isActive: true,
        difficulty: 'Fácil',
        rating: 4.5,
        features: ['Quick setup', 'Basic questions', 'Simple results'],
        templatePath: '/templates/quiz-simple',
        editorUrl: '/editor/quizSimple',
    },
    {
        id: 'leadGeneration',
        name: 'Geração de Leads',
        description: 'Template para captura de leads',
        type: TemplateType.LEAD_GEN,
        steps: 3,
        stepCount: 3,
        category: 'leadgen',
        tags: ['leadgen', 'capture', 'form'],
        isActive: true,
        difficulty: 'Fácil',
        rating: 4.6,
        features: ['Lead capture', 'Form validation', 'Email integration'],
        templatePath: '/templates/lead-generation',
        editorUrl: '/editor/leadGeneration',
    },
    {
        id: 'salesPage',
        name: 'Página de Vendas',
        description: 'Template de página de vendas otimizada',
        type: TemplateType.SALES_PAGE,
        steps: 1,
        stepCount: 1,
        category: 'sales',
        tags: ['sales', 'landing', 'conversion'],
        isActive: true,
        difficulty: 'Intermediário',
        rating: 4.7,
        features: ['CTA optimization', 'Social proof', 'Urgency elements'],
        templatePath: '/templates/sales-page',
        editorUrl: '/editor/salesPage',
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

    // Aliases para compatibilidade com código existente
    static getTemplate(id: string): TemplateConfig | undefined {
        return this.getById(id);
    }

    static getActiveTemplates(): TemplateConfig[] {
        return this.getActive();
    }

    static getTemplatesBySegment(segment: string): TemplateConfig[] {
        // Mapeamento de segmentos para categorias
        const categoryMap: Record<string, TemplateConfig['category']> = {
            quiz: 'quiz',
            leadgen: 'leadgen',
            sales: 'sales',
            custom: 'custom',
        };
        const category = categoryMap[segment.toLowerCase()];
        return category ? this.getByCategory(category) : [];
    }
}
