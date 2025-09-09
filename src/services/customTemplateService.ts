/**
 * 🎨 CUSTOM TEMPLATE SERVICE
 * 
 * Serviço para gerenciar templates personalizados do usuário
 * Permite salvar, carregar, editar e organizar templates customizados
 */

import { UnifiedTemplate } from '@/config/unifiedTemplatesRegistry';

export interface CustomTemplate extends UnifiedTemplate {
    isCustom: boolean;
    originalTemplateId?: string; // ID do template original que foi personalizado
    customizations: {
        personalizedName?: string;
        personalizedDescription?: string;
        customTheme?: string;
        modifiedSteps?: number[];
        customSettings?: Record<string, any>;
        customStyling?: Record<string, any>;
    };
    userMetadata: {
        createdBy: string;
        createdAt: string;
        lastModified: string;
        version: string;
        notes?: string;
    };
}

const CUSTOM_TEMPLATES_KEY = 'qqcv_custom_templates';
const TEMPLATE_USAGE_KEY = 'qqcv_template_usage';

class CustomTemplateService {
    /**
     * Salvar template personalizado
     */
    saveCustomTemplate(template: Omit<CustomTemplate, 'id' | 'createdAt' | 'updatedAt'>): string {
        try {
            const customTemplates = this.getCustomTemplates();

            const newTemplate: CustomTemplate = {
                ...template,
                id: this.generateCustomTemplateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isCustom: true,
                userMetadata: {
                    ...template.userMetadata,
                    createdAt: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                }
            };

            customTemplates.push(newTemplate);
            localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates));

            console.log('✅ Template personalizado salvo:', newTemplate.name);
            return newTemplate.id;
        } catch (error) {
            console.error('❌ Erro ao salvar template personalizado:', error);
            throw new Error('Falha ao salvar template personalizado');
        }
    }

    /**
     * Obter todos os templates personalizados
     */
    getCustomTemplates(): CustomTemplate[] {
        try {
            const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
            if (!stored) return [];

            const templates = JSON.parse(stored);
            return Array.isArray(templates) ? templates : [];
        } catch (error) {
            console.error('❌ Erro ao carregar templates personalizados:', error);
            return [];
        }
    }

    /**
     * Obter template personalizado por ID
     */
    getCustomTemplate(id: string): CustomTemplate | null {
        const templates = this.getCustomTemplates();
        return templates.find(t => t.id === id) || null;
    }

    /**
     * Atualizar template personalizado
     */
    updateCustomTemplate(id: string, updates: Partial<CustomTemplate>): boolean {
        try {
            const templates = this.getCustomTemplates();
            const index = templates.findIndex(t => t.id === id);

            if (index === -1) {
                throw new Error(`Template ${id} não encontrado`);
            }

            templates[index] = {
                ...templates[index],
                ...updates,
                updatedAt: new Date().toISOString(),
                userMetadata: {
                    ...templates[index].userMetadata,
                    lastModified: new Date().toISOString(),
                }
            };

            localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
            console.log('✅ Template personalizado atualizado:', templates[index].name);
            return true;
        } catch (error) {
            console.error('❌ Erro ao atualizar template personalizado:', error);
            return false;
        }
    }

    /**
     * Excluir template personalizado
     */
    deleteCustomTemplate(id: string): boolean {
        try {
            const templates = this.getCustomTemplates();
            const filteredTemplates = templates.filter(t => t.id !== id);

            if (templates.length === filteredTemplates.length) {
                throw new Error(`Template ${id} não encontrado`);
            }

            localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(filteredTemplates));
            console.log('✅ Template personalizado excluído:', id);
            return true;
        } catch (error) {
            console.error('❌ Erro ao excluir template personalizado:', error);
            return false;
        }
    }

    /**
     * Duplicar template (oficial ou personalizado) como novo template personalizado
     */
    duplicateAsCustomTemplate(
        originalTemplate: UnifiedTemplate,
        customizations: CustomTemplate['customizations'],
        userMetadata: Partial<CustomTemplate['userMetadata']>
    ): string {
        const customTemplate: Omit<CustomTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
            ...originalTemplate,
            name: customizations.personalizedName || `${originalTemplate.name} (Personalizado)`,
            description: customizations.personalizedDescription || originalTemplate.description,
            isOfficial: false, // Templates personalizados nunca são oficiais
            isCustom: true,
            originalTemplateId: originalTemplate.id,
            customizations,
            userMetadata: {
                createdBy: userMetadata.createdBy || 'user',
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                version: userMetadata.version || '1.0.0',
                notes: userMetadata.notes || '',
            }
        };

        return this.saveCustomTemplate(customTemplate);
    }

    /**
     * Obter estatísticas dos templates personalizados
     */
    getCustomTemplateStats() {
        const templates = this.getCustomTemplates();
        const categories = new Set(templates.map(t => t.category));

        return {
            totalCustomTemplates: templates.length,
            categoriesUsed: categories.size,
            mostRecentTemplate: templates.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0],
            oldestTemplate: templates.sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )[0]
        };
    }

    /**
     * Buscar templates personalizados
     */
    searchCustomTemplates(query: string): CustomTemplate[] {
        const templates = this.getCustomTemplates();
        const searchTerm = query.toLowerCase();

        return templates.filter(template =>
            template.name.toLowerCase().includes(searchTerm) ||
            template.description.toLowerCase().includes(searchTerm) ||
            template.category.toLowerCase().includes(searchTerm) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            (template.customizations.personalizedName &&
                template.customizations.personalizedName.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Obter templates personalizados por categoria
     */
    getCustomTemplatesByCategory(category: string): CustomTemplate[] {
        const templates = this.getCustomTemplates();
        return templates.filter(t => t.category === category);
    }

    /**
     * Registrar uso de template (para estatísticas)
     */
    recordTemplateUsage(templateId: string, type: 'official' | 'custom' = 'custom'): void {
        try {
            const usage = this.getTemplateUsageStats();
            const today = new Date().toISOString().split('T')[0];

            if (!usage[templateId]) {
                usage[templateId] = {
                    totalUses: 0,
                    lastUsed: today,
                    type,
                    usageHistory: []
                };
            }

            usage[templateId].totalUses++;
            usage[templateId].lastUsed = today;
            usage[templateId].usageHistory.push(today);

            // Manter apenas os últimos 30 dias de histórico
            usage[templateId].usageHistory = usage[templateId].usageHistory.slice(-30);

            localStorage.setItem(TEMPLATE_USAGE_KEY, JSON.stringify(usage));
        } catch (error) {
            console.error('❌ Erro ao registrar uso do template:', error);
        }
    }

    /**
     * Obter estatísticas de uso de templates
     */
    getTemplateUsageStats(): Record<string, {
        totalUses: number;
        lastUsed: string;
        type: 'official' | 'custom';
        usageHistory: string[];
    }> {
        try {
            const stored = localStorage.getItem(TEMPLATE_USAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas de uso:', error);
            return {};
        }
    }

    /**
     * Exportar template personalizado (para backup/compartilhamento)
     */
    exportCustomTemplate(id: string): string | null {
        try {
            const template = this.getCustomTemplate(id);
            if (!template) {
                throw new Error(`Template ${id} não encontrado`);
            }

            const exportData = {
                template,
                exportedAt: new Date().toISOString(),
                version: '1.0.0'
            };

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('❌ Erro ao exportar template:', error);
            return null;
        }
    }

    /**
     * Importar template personalizado
     */
    importCustomTemplate(exportedData: string): string | null {
        try {
            const data = JSON.parse(exportedData);

            if (!data.template || !data.template.isCustom) {
                throw new Error('Dados de importação inválidos');
            }

            // Gerar novo ID para evitar conflitos
            const template = {
                ...data.template,
                name: `${data.template.name} (Importado)`,
                userMetadata: {
                    ...data.template.userMetadata,
                    createdAt: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                }
            };

            delete template.id; // Forçar geração de novo ID

            return this.saveCustomTemplate(template);
        } catch (error) {
            console.error('❌ Erro ao importar template:', error);
            return null;
        }
    }

    /**
     * Limpar templates personalizados antigos
     */
    cleanupOldTemplates(daysOld: number = 90): number {
        try {
            const templates = this.getCustomTemplates();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const activeTemplates = templates.filter(template => {
                const lastModified = new Date(template.userMetadata.lastModified);
                return lastModified > cutoffDate;
            });

            const removedCount = templates.length - activeTemplates.length;

            if (removedCount > 0) {
                localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(activeTemplates));
                console.log(`✅ ${removedCount} templates antigos removidos`);
            }

            return removedCount;
        } catch (error) {
            console.error('❌ Erro ao limpar templates antigos:', error);
            return 0;
        }
    }

    /**
     * Gerar ID único para template personalizado
     */
    private generateCustomTemplateId(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `custom-template-${timestamp}-${random}`;
    }

    /**
     * Validar template personalizado antes de salvar
     */
    private validateCustomTemplate(template: Partial<CustomTemplate>): boolean {
        if (!template.name || template.name.trim().length === 0) {
            throw new Error('Nome do template é obrigatório');
        }

        if (!template.category) {
            throw new Error('Categoria do template é obrigatória');
        }

        if (template.stepCount && (template.stepCount < 1 || template.stepCount > 50)) {
            throw new Error('Número de etapas deve estar entre 1 e 50');
        }

        return true;
    }

    /**
     * Obter templates recomendados baseados no histórico
     */
    getRecommendedTemplates(): CustomTemplate[] {
        const templates = this.getCustomTemplates();
        const usage = this.getTemplateUsageStats();

        // Ordenar por uso e data de modificação
        return templates
            .map(template => ({
                ...template,
                score: (usage[template.id]?.totalUses || 0) * 2 +
                    (new Date(template.userMetadata.lastModified).getTime() / 1000000)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }
}

export const customTemplateService = new CustomTemplateService();
