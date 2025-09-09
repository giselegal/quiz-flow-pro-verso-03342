/**
 * 🎯 UNIFIED TEMPLATE LOADER
 * 
 * Serviço unificado para garantir que /editor e /quiz usem EXATAMENTE as mesmas fontes de dados.
 * Substitui a fragmentação entre getStepTemplate() e TemplateManager.loadStepBlocks()
 */

import { TemplateManager } from '@/utils/TemplateManager';
import { Block } from '@/types/editor';

export class UnifiedTemplateLoader {
    /**
     * 🔄 Carrega template para uso no EDITOR
     * Converte formato do TemplateManager para formato esperado pelo EditorContext
     */
    static async getStepTemplate(stepNumber: number): Promise<{ blocks: Block[] } | null> {
        try {
            const stepId = `step-${stepNumber}`;
            const blocks = await TemplateManager.loadStepBlocks(stepId);

            if (!blocks || blocks.length === 0) {
                console.warn(`⚠️ [UnifiedTemplateLoader] Nenhum bloco encontrado para etapa ${stepNumber}`);
                return null;
            }

            console.log(`✅ [UnifiedTemplateLoader] Template carregado para etapa ${stepNumber}: ${blocks.length} blocos`);
            return { blocks };
        } catch (error) {
            console.error(`❌ [UnifiedTemplateLoader] Erro ao carregar template da etapa ${stepNumber}:`, error);
            return null;
        }
    }

    /**
     * 🔄 Carrega blocos para uso no QUIZ
     * Passa direto para o TemplateManager (sem conversão)
     */
    static async loadStepBlocks(stepId: string): Promise<Block[]> {
        return TemplateManager.loadStepBlocks(stepId);
    }

    /**
     * 🔄 Publica alterações do EDITOR para serem usadas no QUIZ
     */
    static publishStep(stepId: string, blocks: Block[]): void {
        TemplateManager.publishStep(stepId, blocks);
        console.log(`💾 [UnifiedTemplateLoader] Publicado: ${stepId} com ${blocks.length} blocos`);
    }

    /**
     * 🔄 Remove publicação
     */
    static unpublishStep(stepId: string): void {
        TemplateManager.unpublishStep(stepId);
        console.log(`🗑️ [UnifiedTemplateLoader] Despublicado: ${stepId}`);
    }

    /**
     * 🔄 Recarrega template (força atualização do cache)
     */
    static async reloadTemplate(stepNumber: number): Promise<{ blocks: Block[] } | null> {
        const stepId = `step-${stepNumber}`;
        await TemplateManager.reloadTemplate(stepId);
        return this.getStepTemplate(stepNumber);
    }

    /**
     * 🔄 Verifica se template existe
     */
    static hasTemplate(stepNumber: number): boolean {
        const stepId = `step-${stepNumber}`;
        return TemplateManager.hasTemplate(stepId);
    }

    /**
     * 🔄 Lista todos os templates disponíveis
     */
    static getAvailableTemplates(): number[] {
        return Array.from({ length: 21 }, (_, i) => i + 1);
    }

    /**
     * 🔄 Limpa cache de templates
     */
    static clearCache(): void {
        TemplateManager.clearCache();
        console.log('🗑️ [UnifiedTemplateLoader] Cache limpo');
    }

    /**
     * 🔄 Pré-carrega templates críticos
     */
    static async preloadTemplates(): Promise<void> {
        await TemplateManager.preloadCommonTemplates();
        console.log('🚀 [UnifiedTemplateLoader] Templates pré-carregados');
    }
}

// Export compatível com sistema antigo
export const getStepTemplate = UnifiedTemplateLoader.getStepTemplate;
export const loadStepBlocks = UnifiedTemplateLoader.loadStepBlocks;
export const publishStep = UnifiedTemplateLoader.publishStep;
export const unpublishStep = UnifiedTemplateLoader.unpublishStep;
export const reloadTemplate = UnifiedTemplateLoader.reloadTemplate;
export const hasTemplate = UnifiedTemplateLoader.hasTemplate;
export const clearCache = UnifiedTemplateLoader.clearCache;
export const preloadTemplates = UnifiedTemplateLoader.preloadTemplates;

export default UnifiedTemplateLoader;
