/**
 * 🔧 GERADOR UNIVERSAL DE CONFIGURAÇÕES DE FUNIL
 * 
 * Este serviço cria configurações completas para qualquer funil baseado no template
 * existente do quiz21StepsComplete.config.ts
 * 
 * ✅ Permite criar configurações universais para todos os funis
 * ✅ Mantém estrutura consistente entre funis
 * ✅ Permite customização específica por funil
 */

import type { FunnelConfig, FunnelSEOOverrides, FunnelThemeConfig, FunnelTrackingConfig, FunnelUTMConfig, FunnelWebhooksConfig } from '@/templates/funnel-configs/quiz21StepsComplete.config';
import { QUIZ21_STEPS_CONFIG } from '@/templates/funnel-configs/quiz21StepsComplete.config';

// ============================================================================
// TIPOS PARA GERAÇÃO DE CONFIGURAÇÕES
// ============================================================================

export interface FunnelConfigTemplate {
    id: string;
    name: string;
    description: string;
    category: 'quiz' | 'sales' | 'lead-magnet' | 'survey' | 'assessment' | 'other';
    customizations?: {
        seo?: Partial<FunnelSEOOverrides>;
        theme?: Partial<FunnelThemeConfig>;
        tracking?: Partial<FunnelTrackingConfig>;
        utm?: Partial<FunnelUTMConfig>;
        webhooks?: Partial<FunnelWebhooksConfig>;
    };
}

// ============================================================================
// TEMPLATES PREDEFINIDOS PARA DIFERENTES TIPOS DE FUNIS
// ============================================================================

export const FUNNEL_TEMPLATES: Record<string, Partial<FunnelConfigTemplate>> = {
    'quiz': {
        category: 'quiz',
        customizations: {
            seo: {
                keywords: ['quiz', 'avaliação', 'teste', 'personalidade', 'descoberta']
            },
            theme: {
                primaryColor: '#B89B7A',
                secondaryColor: '#8F7A6A',
                accentColor: '#D4C4B0'
            },
            utm: {
                source: 'quiz_organico',
                medium: 'quiz',
                campaign: 'descoberta_perfil'
            }
        }
    },
    'sales': {
        category: 'sales',
        customizations: {
            seo: {
                keywords: ['venda', 'produto', 'oferta', 'desconto', 'comprar']
            },
            theme: {
                primaryColor: '#4CAF50',
                secondaryColor: '#2E7D32',
                accentColor: '#81C784'
            },
            utm: {
                source: 'funil_vendas',
                medium: 'sales_funnel',
                campaign: 'conversao_direta'
            }
        }
    },
    'lead-magnet': {
        category: 'lead-magnet',
        customizations: {
            seo: {
                keywords: ['grátis', 'download', 'lead', 'material', 'guia']
            },
            theme: {
                primaryColor: '#2196F3',
                secondaryColor: '#1976D2',
                accentColor: '#64B5F6'
            },
            utm: {
                source: 'lead_organico',
                medium: 'lead_magnet',
                campaign: 'captura_leads'
            }
        }
    },
    'assessment': {
        category: 'assessment',
        customizations: {
            seo: {
                keywords: ['avaliação', 'análise', 'diagnóstico', 'resultado', 'teste']
            },
            theme: {
                primaryColor: '#FF9800',
                secondaryColor: '#F57C00',
                accentColor: '#FFB74D'
            },
            utm: {
                source: 'assessment_organico',
                medium: 'assessment',
                campaign: 'avaliacao_completa'
            }
        }
    }
};

// ============================================================================
// CLASSE GERADORA DE CONFIGURAÇÕES
// ============================================================================

export class FunnelConfigGenerator {
    /**
     * Gera uma configuração completa de funil baseada no template
     */
    static generateConfig(template: FunnelConfigTemplate): FunnelConfig {
        // Buscar customizações do tipo de funil se não foram fornecidas
        const categoryDefaults = FUNNEL_TEMPLATES[template.category] || {};

        // Merge das customizações
        const mergedCustomizations = {
            seo: {
                ...categoryDefaults.customizations?.seo,
                ...template.customizations?.seo
            },
            theme: {
                ...categoryDefaults.customizations?.theme,
                ...template.customizations?.theme
            },
            tracking: {
                ...categoryDefaults.customizations?.tracking,
                ...template.customizations?.tracking
            },
            utm: {
                ...categoryDefaults.customizations?.utm,
                ...template.customizations?.utm
            },
            webhooks: {
                ...categoryDefaults.customizations?.webhooks,
                ...template.customizations?.webhooks
            }
        };

        // Base da configuração usando quiz21StepsComplete como template
        const baseConfig = {
            ...QUIZ21_STEPS_CONFIG,
            funnel: {
                id: template.id,
                name: template.name,
                description: template.description,
                category: template.category,
                version: '1.0.0',
                author: 'Sistema Automático',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        // Aplicar customizações específicas
        if (mergedCustomizations.seo) {
            baseConfig.seo = {
                ...baseConfig.seo,
                ...mergedCustomizations.seo,
                // Gerar meta tags específicas se não fornecidas
                title: mergedCustomizations.seo.title || `${template.name} | Descubra Agora`,
                description: mergedCustomizations.seo.description || template.description,
                ogTitle: mergedCustomizations.seo.ogTitle || template.name,
                ogDescription: mergedCustomizations.seo.ogDescription || template.description
            };
        }

        if (mergedCustomizations.theme) {
            baseConfig.theme = {
                ...baseConfig.theme,
                ...mergedCustomizations.theme
            };
        }

        if (mergedCustomizations.tracking) {
            baseConfig.tracking = {
                ...baseConfig.tracking,
                ...mergedCustomizations.tracking
            };
        }

        if (mergedCustomizations.utm) {
            baseConfig.utm = {
                source: 'organico',
                medium: 'funil',
                campaign: template.id.replace(/[^a-zA-Z0-9]/g, '_'),
                ...mergedCustomizations.utm
            };
        }

        if (mergedCustomizations.webhooks) {
            baseConfig.webhooks = {
                ...baseConfig.webhooks,
                ...mergedCustomizations.webhooks
            };
        }

        return baseConfig;
    }

    /**
     * Gera configuração rápida com dados mínimos
     */
    static generateQuickConfig(
        funnelId: string,
        name: string,
        category: FunnelConfigTemplate['category'] = 'other'
    ): FunnelConfig {
        return this.generateConfig({
            id: funnelId,
            name: name,
            description: `Funil gerado automaticamente: ${name}`,
            category: category
        });
    }

    /**
     * Lista todos os tipos de funil disponíveis
     */
    static getAvailableCategories(): Array<{
        category: FunnelConfigTemplate['category'];
        description: string;
        defaultTheme: string;
    }> {
        return [
            {
                category: 'quiz',
                description: 'Quiz interativo para descoberta de perfil',
                defaultTheme: '#B89B7A'
            },
            {
                category: 'sales',
                description: 'Funil de vendas e conversão',
                defaultTheme: '#4CAF50'
            },
            {
                category: 'lead-magnet',
                description: 'Captura de leads com material gratuito',
                defaultTheme: '#2196F3'
            },
            {
                category: 'assessment',
                description: 'Avaliação e diagnóstico personalizado',
                defaultTheme: '#FF9800'
            },
            {
                category: 'survey',
                description: 'Pesquisa e coleta de dados',
                defaultTheme: '#9C27B0'
            },
            {
                category: 'other',
                description: 'Outros tipos de funil personalizado',
                defaultTheme: '#607D8B'
            }
        ];
    }

    /**
     * Valida se uma configuração está completa
     */
    static validateConfig(config: FunnelConfig): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validações obrigatórias
        if (!config.funnel.id) errors.push('ID do funil é obrigatório');
        if (!config.funnel.name) errors.push('Nome do funil é obrigatório');
        if (!config.utm.source) errors.push('UTM source é obrigatório');
        if (!config.utm.medium) errors.push('UTM medium é obrigatório');
        if (!config.utm.campaign) errors.push('UTM campaign é obrigatório');

        // Validações recomendadas (warnings)
        if (!config.seo?.title) warnings.push('Título SEO não definido');
        if (!config.seo?.description) warnings.push('Descrição SEO não definida');
        if (!config.tracking?.facebookPixel) warnings.push('Facebook Pixel não configurado');
        if (!config.webhooks?.enabled) warnings.push('Webhooks não habilitados');

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}

// ============================================================================
// CONFIGURAÇÕES PRÉ-DEFINIDAS PARA FUNIS COMUNS
// ============================================================================

export const COMMON_FUNNELS_CONFIGS = {
    // Quiz de personalidade genérico
    'personality-quiz': FunnelConfigGenerator.generateConfig({
        id: 'personality-quiz',
        name: 'Quiz de Personalidade',
        description: 'Descubra traços da sua personalidade através de perguntas estratégicas',
        category: 'quiz',
        customizations: {
            seo: {
                keywords: ['personalidade', 'quiz', 'psicologia', 'autoconhecimento']
            }
        }
    }),

    // Lead magnet padrão
    'lead-magnet-ebook': FunnelConfigGenerator.generateConfig({
        id: 'lead-magnet-ebook',
        name: 'Download de E-book Gratuito',
        description: 'Captura de leads através de material educativo gratuito',
        category: 'lead-magnet',
        customizations: {
            seo: {
                keywords: ['ebook', 'grátis', 'download', 'material', 'guia']
            }
        }
    }),

    // Funil de vendas básico
    'sales-basic': FunnelConfigGenerator.generateConfig({
        id: 'sales-basic',
        name: 'Funil de Vendas Básico',
        description: 'Estrutura básica para conversão e vendas diretas',
        category: 'sales',
        customizations: {
            seo: {
                keywords: ['comprar', 'oferta', 'desconto', 'produto']
            }
        }
    })
};

// Export principal
export default FunnelConfigGenerator;