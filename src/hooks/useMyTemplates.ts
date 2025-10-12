/**
 * 🎨 HOOK PARA GERENCIAR TEMPLATES PERSONALIZADOS DO USUÁRIO
 * 
 * Hook específico para o contexto MY_TEMPLATES, isolando templates
 * personalizados criados/editados pelo usuário dos templates públicos
 */

import { useState, useEffect, useCallback } from 'react';
import { FunnelContext, generateContextualStorageKey } from '@/core/contexts/FunnelContext';
import { safeGetItem, safeSetItem } from '@/utils/contextualStorage';
import { StorageService } from '@/services/core/StorageService';

export interface UserTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    theme: string;
    tags: string[];
    isOfficial: boolean;
    createdAt: string;
    updatedAt: string;
    thumbnailUrl?: string;
    usageCount: number;
    components: any[];
    originalTemplateId?: string; // ID do template original se foi editado
    stepCount: number;
    templateData: {
        originalFunnelId?: string;
        createdFrom: 'editor' | 'template-edit' | 'custom';
        version: string;
    };
}

export const useMyTemplates = () => {
    const [templates, setTemplates] = useState<UserTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Novas chaves (sem contexto embutido; contexto é aplicado pelo util)
    // Mantemos migração a partir das chaves legadas (via generateContextualStorageKey e 'saved-templates')
    const CTX = FunnelContext.MY_TEMPLATES;
    const TEMPLATES_LIST_KEY_NEW = 'templates-list';
    const TEMPLATE_KEY_NEW = (id: string) => `template:${id}`;
    // Chaves legadas (prefixo direto do contexto)
    const TEMPLATES_LIST_KEY_LEGACY = generateContextualStorageKey(FunnelContext.MY_TEMPLATES, 'list');
    const TEMPLATE_KEY_LEGACY = (id: string) => generateContextualStorageKey(FunnelContext.MY_TEMPLATES, 'template', id);

    /**
     * Carregar todos os templates do usuário
     */
    const loadTemplates = useCallback(async (): Promise<UserTemplate[]> => {
        try {
            setIsLoading(true);
            setError(null);

            // Carregar lista de IDs dos templates
            // 1) Tenta ler lista na nova chave contextual
            const templatesListStrCtx = safeGetItem(TEMPLATES_LIST_KEY_NEW, CTX);
            let templateIds: string[] = templatesListStrCtx ? JSON.parse(templatesListStrCtx) : [];

            // 2) Migração: se vazia, tenta legado (generateContextualStorageKey) e 'saved-templates'
            if (!templateIds.length) {
                const legacyListStr = localStorage.getItem(TEMPLATES_LIST_KEY_LEGACY);
                if (legacyListStr) {
                    try {
                        const legacyIds: string[] = JSON.parse(legacyListStr);
                        templateIds = legacyIds;
                        safeSetItem(TEMPLATES_LIST_KEY_NEW, JSON.stringify(legacyIds), CTX);
                    } catch { }
                } else {
                    const legacyTemplatesStr = StorageService.safeGetString('saved-templates');
                    if (legacyTemplatesStr) {
                        try {
                            const legacyTemplates = JSON.parse(legacyTemplatesStr);
                            const ids = Array.isArray(legacyTemplates) ? legacyTemplates.map((t: any) => t?.id).filter(Boolean) : [];
                            templateIds = ids;
                            safeSetItem(TEMPLATES_LIST_KEY_NEW, JSON.stringify(ids), CTX);
                        } catch { }
                    }
                }
            }

            console.log('📋 Carregando templates do contexto MY_TEMPLATES:', templateIds);

            // Carregar dados completos de cada template
            const loadedTemplates: UserTemplate[] = [];

            for (const id of templateIds) {
                // Tenta nova chave contextualizada
                let templateStr = safeGetItem(TEMPLATE_KEY_NEW(id), CTX);
                // Fallback: chave legada por generateContextualStorageKey
                if (!templateStr) templateStr = localStorage.getItem(TEMPLATE_KEY_LEGACY(id));
                if (templateStr) {
                    try {
                        const template = JSON.parse(templateStr);
                        loadedTemplates.push(template);
                        // Persistir no novo formato
                        safeSetItem(TEMPLATE_KEY_NEW(id), JSON.stringify(template), CTX);
                    } catch (e) {
                        console.warn(`⚠️ Erro ao parsear template ${id}:`, e);
                    }
                }
            }

            // Migrar templates legados se necessário
            await migrateLegacyTemplates(loadedTemplates);

            // Ordenar por data de criação (mais recentes primeiro)
            loadedTemplates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setTemplates(loadedTemplates);
            console.log(`✅ ${loadedTemplates.length} templates carregados do contexto MY_TEMPLATES`);

            return loadedTemplates;
        } catch (error) {
            const errorMsg = `Erro ao carregar templates: ${error}`;
            console.error('❌', errorMsg);
            setError(errorMsg);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Salvar template personalizado
     */
    const saveTemplate = useCallback(async (templateData: Omit<UserTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
        try {
            setIsLoading(true);
            setError(null);

            const now = new Date().toISOString();
            const templateId = templateData.originalTemplateId
                ? `edited-${templateData.originalTemplateId}-${Date.now()}`
                : `custom-${Date.now()}`;

            const newTemplate: UserTemplate = {
                ...templateData,
                id: templateId,
                createdAt: now,
                updatedAt: now,
                usageCount: 0,
            };

            console.log('💾 Salvando template no contexto MY_TEMPLATES:', newTemplate);

            // Salvar template individual na chave contextual
            safeSetItem(TEMPLATE_KEY_NEW(templateId), JSON.stringify(newTemplate), CTX);

            // Atualizar lista de IDs
            const currentList = await loadTemplateIds();
            const updatedList = [...currentList, templateId];
            safeSetItem(TEMPLATES_LIST_KEY_NEW, JSON.stringify(updatedList), CTX);

            // Atualizar estado local
            setTemplates(prev => [newTemplate, ...prev]);

            console.log(`✅ Template salvo com ID: ${templateId}`);
            return templateId;
        } catch (error) {
            const errorMsg = `Erro ao salvar template: ${error}`;
            console.error('❌', errorMsg);
            setError(errorMsg);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Carregar template específico
     */
    const loadTemplate = useCallback(async (templateId: string): Promise<UserTemplate | null> => {
        try {
            const templateStr = safeGetItem(TEMPLATE_KEY_NEW(templateId), CTX) || localStorage.getItem(TEMPLATE_KEY_LEGACY(templateId));
            if (!templateStr) {
                console.warn(`⚠️ Template não encontrado: ${templateId}`);
                return null;
            }

            const template = JSON.parse(templateStr);
            console.log(`📄 Template carregado: ${templateId}`);
            return template;
        } catch (error) {
            console.error(`❌ Erro ao carregar template ${templateId}:`, error);
            return null;
        }
    }, []);

    /**
     * Deletar template
     */
    const deleteTemplate = useCallback(async (templateId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            // Remover template individual das novas chaves (e opcionalmente das legadas)
            try { localStorage.removeItem(TEMPLATE_KEY_LEGACY(templateId)); } catch { }
            try {
                // contextualStorage não tem remove direto aqui; leitura não quebra se sobrar
                // (poderíamos criar safeRemoveItem se necessário)
            } catch { }

            // Atualizar lista de IDs
            const currentList = await loadTemplateIds();
            const updatedList = currentList.filter(id => id !== templateId);
            safeSetItem(TEMPLATES_LIST_KEY_NEW, JSON.stringify(updatedList), CTX);

            // Atualizar estado local
            setTemplates(prev => prev.filter(t => t.id !== templateId));

            console.log(`🗑️ Template deletado: ${templateId}`);
            return true;
        } catch (error) {
            const errorMsg = `Erro ao deletar template: ${error}`;
            console.error('❌', errorMsg);
            setError(errorMsg);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Incrementar contador de uso
     */
    const incrementUsage = useCallback(async (templateId: string): Promise<void> => {
        try {
            const template = await loadTemplate(templateId);
            if (template) {
                const updatedTemplate = {
                    ...template,
                    usageCount: template.usageCount + 1,
                    updatedAt: new Date().toISOString(),
                };

                safeSetItem(TEMPLATE_KEY_NEW(templateId), JSON.stringify(updatedTemplate), CTX);
                setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));

                console.log(`📈 Uso incrementado para template: ${templateId}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao incrementar uso do template ${templateId}:`, error);
        }
    }, [loadTemplate]);

    /**
     * Carregar lista de IDs dos templates
     */
    const loadTemplateIds = useCallback(async (): Promise<string[]> => {
        const templatesListStr = safeGetItem(TEMPLATES_LIST_KEY_NEW, CTX);
        return templatesListStr ? JSON.parse(templatesListStr) : [];
    }, []);

    /**
     * Migrar templates legados do localStorage antigo
     */
    const migrateLegacyTemplates = useCallback(async (currentTemplates: UserTemplate[]): Promise<void> => {
        try {
            // Verificar se há templates no formato antigo
            const legacyTemplatesStr = StorageService.safeGetString('saved-templates');
            if (!legacyTemplatesStr) return;

            const legacyTemplates = JSON.parse(legacyTemplatesStr);
            if (!Array.isArray(legacyTemplates) || legacyTemplates.length === 0) return;

            console.log('🔄 Migrando templates legados para contexto MY_TEMPLATES...', legacyTemplates);

            const currentIds = currentTemplates.map(t => t.id);

            for (const legacy of legacyTemplates) {
                // Evitar duplicatas
                if (currentIds.includes(legacy.id)) continue;

                // Converter para formato atual
                const migratedTemplate: UserTemplate = {
                    id: legacy.id,
                    name: legacy.name || 'Template Migrado',
                    description: legacy.description || 'Template migrado do sistema anterior',
                    category: legacy.category || 'custom',
                    theme: legacy.theme || 'modern-chic',
                    tags: legacy.tags || [],
                    isOfficial: legacy.isOfficial || false,
                    createdAt: legacy.createdAt || new Date().toISOString(),
                    updatedAt: legacy.updatedAt || new Date().toISOString(),
                    usageCount: legacy.usageCount || 0,
                    components: legacy.components || [],
                    stepCount: legacy.stepCount || 0,
                    templateData: {
                        createdFrom: 'editor',
                        version: '1.0.0',
                    },
                };

                // Salvar no novo formato
                safeSetItem(TEMPLATE_KEY_NEW(migratedTemplate.id), JSON.stringify(migratedTemplate), CTX);
                currentTemplates.push(migratedTemplate);
                currentIds.push(migratedTemplate.id);
            }

            // Atualizar lista de IDs
            safeSetItem(TEMPLATES_LIST_KEY_NEW, JSON.stringify(currentIds), CTX);

            // Remover dados legados (comentado por segurança)
            // StorageService.safeRemove('saved-templates');

            console.log(`✅ ${legacyTemplates.length} templates migrados para MY_TEMPLATES`);
        } catch (error) {
            console.error('❌ Erro na migração de templates legados:', error);
        }
    }, []);

    // Carregar templates na inicialização
    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    return {
        // Estado
        templates,
        isLoading,
        error,

        // Ações
        loadTemplates,
        saveTemplate,
        loadTemplate,
        deleteTemplate,
        incrementUsage,

        // Estatísticas
        templatesCount: templates.length,
        totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    };
};

export default useMyTemplates;
