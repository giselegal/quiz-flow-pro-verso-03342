/**
 * 🎨 TEMPLATE SERVICE
 * 
 * Serviço para gerenciar templates de funil
 * Migrado e integrado ao core
 */

import { supabase } from '@/integrations/supabase/client';
import { FunnelTemplate, TemplateCategory } from '../types';

// Helper para gerar IDs quando necessário
const genId = () =>
(typeof crypto !== 'undefined' && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : `funnel_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

export class TemplateService {
    private static instance: TemplateService;

    public static getInstance(): TemplateService {
        if (!TemplateService.instance) {
            TemplateService.instance = new TemplateService();
        }
        return TemplateService.instance;
    }

    /**
     * Get all available funnel templates
     */
    async getTemplates(category?: string): Promise<FunnelTemplate[]> {
        try {
            // Verificar se Supabase está disponível
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, retornando templates locais');
                return this.getFallbackTemplates(category);
            }

            let query = supabase
                .from('funnel_templates')
                .select('*');

            if (category && category !== 'all') {
                query = query.eq('category', category);
            }

            query = query.order('usage_count', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching templates:', error);
                return this.getFallbackTemplates(category);
            }

            return (
                ((data as any[]) || []).map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description || '',
                    category: item.category,
                    theme: item.theme || 'default',
                    stepCount: item.step_count || 1,
                    isOfficial: item.is_official || false,
                    usageCount: item.usage_count || 0,
                    tags: item.tags || [],
                    thumbnailUrl: item.thumbnail_url || undefined,
                    templateData: item.template_data || {},
                    components: Array.isArray(item.components) ? item.components : [],
                    createdAt: item.created_at || new Date().toISOString(),
                    updatedAt: item.updated_at || new Date().toISOString(),
                })) || this.getFallbackTemplates(category)
            );
        } catch (error) {
            console.error('Error in getTemplates:', error);
            return this.getFallbackTemplates(category);
        }
    }

    /**
     * Get templates organized by categories
     */
    async getTemplatesByCategory(): Promise<Record<string, FunnelTemplate[]>> {
        try {
            const templates = await this.getTemplates();
            const categorized: Record<string, FunnelTemplate[]> = {};

            templates.forEach(template => {
                if (!categorized[template.category]) {
                    categorized[template.category] = [];
                }
                categorized[template.category].push(template);
            });

            return categorized;
        } catch (error) {
            console.error('Error organizing templates by category:', error);
            return {};
        }
    }

    /**
     * Get a specific template by ID
     */
    async getTemplate(templateId: string): Promise<FunnelTemplate | null> {
        try {
            if (!supabase) {
                const fallbackTemplates = this.getFallbackTemplates();
                return fallbackTemplates.find(t => t.id === templateId) || null;
            }

            const { data, error } = await supabase
                .from('funnel_templates')
                .select('*')
                .eq('id', templateId)
                .single();

            if (error || !data) {
                console.error('Error fetching template:', error);
                const fallbackTemplates = this.getFallbackTemplates();
                return fallbackTemplates.find(t => t.id === templateId) || null;
            }

            return {
                id: data.id,
                name: data.name,
                description: data.description || '',
                category: data.category || 'general',
                theme: data.theme || 'default',
                stepCount: data.step_count || 1,
                isOfficial: data.is_official || false,
                usageCount: data.usage_count || 0,
                tags: Array.isArray(data.tags) ? data.tags as string[] : [],
                thumbnailUrl: data.thumbnail_url || undefined,
                templateData: (data.template_data as any) || {},
                components: Array.isArray(data.components) ? data.components : [],
                createdAt: data.created_at || new Date().toISOString(),
                updatedAt: data.updated_at || new Date().toISOString(),
            };
        } catch (error) {
            console.error('Error in getTemplate:', error);
            const fallbackTemplates = this.getFallbackTemplates();
            return fallbackTemplates.find(t => t.id === templateId) || null;
        }
    }

    /**
     * Save a new template
     */
    async saveTemplate(template: Omit<FunnelTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<FunnelTemplate> {
        try {
            const templateWithId = {
                ...template,
                id: genId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, template salvo apenas localmente');
                return templateWithId;
            }

            const templateRecord = {
                id: templateWithId.id,
                name: template.name,
                description: template.description,
                category: template.category,
                theme: template.theme,
                step_count: template.stepCount,
                is_official: template.isOfficial,
                usage_count: template.usageCount,
                tags: template.tags as any,
                thumbnail_url: template.thumbnailUrl,
                template_data: template.templateData as any,
                components: template.components as any,
                created_at: templateWithId.createdAt,
                updated_at: templateWithId.updatedAt,
            };

            const { error } = await supabase
                .from('funnel_templates')
                .insert([templateRecord]);

            if (error) {
                console.error('Error saving template:', error);
                return templateWithId; // Retorna template local como fallback
            }

            return templateWithId;
        } catch (error) {
            console.error('Error in saveTemplate:', error);
            throw error;
        }
    }

    /**
     * Update template usage count
     */
    async incrementUsageCount(templateId: string): Promise<void> {
        try {
            if (!supabase) {
                console.warn('⚠️ Supabase não disponível, contagem não atualizada');
                return;
            }

            // Usar SQL direto para incrementar
            const { error } = await supabase
                .from('funnel_templates')
                .update({ usage_count: 'usage_count + 1' as any })
                .eq('id', templateId);

            if (error) {
                console.error('Error incrementing usage count:', error);
            }
        } catch (error) {
            console.error('Error in incrementUsageCount:', error);
        }
    }

    /**
     * Get template categories
     */
    async getCategories(): Promise<TemplateCategory[]> {
        try {
            if (!supabase) {
                return this.getFallbackCategories();
            }

            // Por enquanto, usar apenas fallback até a tabela ser criada
            return this.getFallbackCategories();
        } catch (error) {
            console.error('Error in getCategories:', error);
            return this.getFallbackCategories();
        }
    }

    /**
     * Fallback templates quando Supabase não está disponível
     */
    private getFallbackTemplates(category?: string): FunnelTemplate[] {
        const templates: FunnelTemplate[] = [
            {
                id: 'quiz-estilo-21',
                name: 'Quiz de Estilo 21 Etapas',
                description: 'Template para quiz de descoberta de estilo pessoal com 21 etapas',
                category: 'lifestyle',
                theme: 'modern',
                stepCount: 21,
                isOfficial: true,
                usageCount: 150,
                tags: ['quiz', 'estilo', 'personalidade', 'lifestyle'],
                thumbnailUrl: undefined,
                templateData: {
                    metadata: {
                        name: 'Quiz de Estilo 21 Etapas',
                        description: 'Template para quiz de descoberta de estilo pessoal',
                        category: 'lifestyle',
                        theme: 'modern',
                        version: '1.0.0',
                        isPublished: true,
                        isOfficial: true
                    },
                    settings: {
                        autoSave: true,
                        autoAdvance: false,
                        progressTracking: true,
                        analytics: true,
                        theme: {
                            primaryColor: '#e91e63',
                            secondaryColor: '#f8bbd9',
                            fontFamily: 'Inter',
                            borderRadius: '12px',
                            spacing: '24px',
                            layout: 'centered'
                        },
                        navigation: {
                            showProgress: true,
                            showStepNumbers: true,
                            allowBackward: true,
                            showNavigationButtons: true,
                            autoAdvanceDelay: 3000
                        },
                        validation: {
                            strictMode: false,
                            requiredFields: [],
                            customValidators: {}
                        }
                    },
                    steps: []
                },
                components: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'quiz-negocio-basico',
                name: 'Quiz de Negócio Básico',
                description: 'Template simples para quiz de lead generation',
                category: 'business',
                theme: 'professional',
                stepCount: 5,
                isOfficial: true,
                usageCount: 89,
                tags: ['quiz', 'negócio', 'leads', 'marketing'],
                thumbnailUrl: undefined,
                templateData: {
                    metadata: {
                        name: 'Quiz de Negócio Básico',
                        description: 'Template simples para quiz de lead generation',
                        category: 'business',
                        theme: 'professional',
                        version: '1.0.0',
                        isPublished: true,
                        isOfficial: true
                    },
                    settings: {
                        autoSave: true,
                        autoAdvance: false,
                        progressTracking: true,
                        analytics: true,
                        theme: {
                            primaryColor: '#2563eb',
                            secondaryColor: '#dbeafe',
                            fontFamily: 'Inter',
                            borderRadius: '8px',
                            spacing: '16px',
                            layout: 'centered'
                        },
                        navigation: {
                            showProgress: true,
                            showStepNumbers: false,
                            allowBackward: true,
                            showNavigationButtons: true,
                            autoAdvanceDelay: 3000
                        },
                        validation: {
                            strictMode: true,
                            requiredFields: ['email'],
                            customValidators: {}
                        }
                    },
                    steps: []
                },
                components: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        return category ? templates.filter(t => t.category === category) : templates;
    }

    /**
     * Categorias de fallback
     */
    private getFallbackCategories(): TemplateCategory[] {
        return [
            {
                id: 'lifestyle',
                name: 'Lifestyle',
                description: 'Templates para quizzes de estilo de vida',
                icon: 'heart',
                color: '#e91e63',
                templateCount: 5
            },
            {
                id: 'business',
                name: 'Negócios',
                description: 'Templates para lead generation e vendas',
                icon: 'briefcase',
                color: '#2563eb',
                templateCount: 8
            },
            {
                id: 'education',
                name: 'Educação',
                description: 'Templates educacionais e avaliativos',
                icon: 'book',
                color: '#059669',
                templateCount: 3
            },
            {
                id: 'entertainment',
                name: 'Entretenimento',
                description: 'Templates divertidos e interativos',
                icon: 'star',
                color: '#d97706',
                templateCount: 4
            }
        ];
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const templateService = TemplateService.getInstance();
