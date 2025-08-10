import { TemplateJsonLoader } from "@/utils/TemplateJsonLoader";
import type { Block } from "@/types/editor";

/**
 * Mapeamento de etapas para templates JSON
 */
const TEMPLATE_MAPPING = {
  "step-1": "/templates/step-01-template.json",
  "step-2": "/templates/step-02-template.json", 
  "step-3": "/templates/step-03-template.json",
  "step-4": "/templates/step-04-template.json",
  "step-5": "/templates/step-05-template.json",
  // ... adicionar mais conforme necessário
} as const;

/**
 * Template Manager - Gerencia carregamento de templates JSON
 */
export class TemplateManager {
  private static cache = new Map<string, Block[]>();

  /**
   * Carrega blocos de uma etapa usando template JSON
   */
  static async loadStepBlocks(stepId: string): Promise<Block[]> {
    try {
      // Verifica cache primeiro
      if (this.cache.has(stepId)) {
        console.log(`📦 Template ${stepId} carregado do cache`);
        return this.cache.get(stepId)!;
      }

      // Busca template path
      const templatePath = TEMPLATE_MAPPING[stepId as keyof typeof TEMPLATE_MAPPING];
      if (!templatePath) {
        console.warn(`⚠️ Template não encontrado para etapa: ${stepId}`);
        return this.getFallbackBlocks(stepId);
      }

      // Carrega template JSON
      console.log(`🔄 Carregando template JSON para ${stepId}: ${templatePath}`);
      const blocks = await TemplateJsonLoader.loadTemplateAsBlocks(templatePath, stepId);
      
      // Armazena no cache
      this.cache.set(stepId, blocks);
      
      console.log(`✅ Template ${stepId} carregado: ${blocks.length} blocos`);
      return blocks;

    } catch (error) {
      console.error(`❌ Erro ao carregar template para ${stepId}:`, error);
      return this.getFallbackBlocks(stepId);
    }
  }

  /**
   * Retorna blocos de fallback para quando o template JSON falha
   */
  private static getFallbackBlocks(stepId: string): Block[] {
    console.log(`🔄 Usando fallback para ${stepId}`);
    
    // Fallback básico
    return [
      {
        id: `${stepId}-fallback-title`,
        type: "text-inline",
        order: 0,
        properties: {
          content: `Etapa ${stepId}`,
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center"
        },
        content: {
          content: `Etapa ${stepId}`,
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center"
        }
      },
      {
        id: `${stepId}-fallback-message`,
        type: "text-inline", 
        order: 1,
        properties: {
          content: "Template JSON não encontrado. Usando fallback.",
          fontSize: "text-sm",
          color: "#6B7280",
          textAlign: "text-center"
        },
        content: {
          content: "Template JSON não encontrado. Usando fallback.",
          fontSize: "text-sm", 
          color: "#6B7280",
          textAlign: "text-center"
        }
      }
    ];
  }

  /**
   * Pre-carrega templates mais usados
   */
  static async preloadCommonTemplates(): Promise<void> {
    const commonSteps = ["step-1", "step-2", "step-3"];
    
    console.log("🚀 Pre-carregando templates comuns...");
    
    const promises = commonSteps.map(async (stepId) => {
      try {
        await this.loadStepBlocks(stepId);
      } catch (error) {
        console.warn(`⚠️ Falha ao pre-carregar ${stepId}:`, error);
      }
    });

    await Promise.allSettled(promises);
    console.log("✅ Pre-carregamento de templates concluído");
  }

  /**
   * Recarrega um template (limpa cache e carrega novamente)
   */
  static async reloadTemplate(stepId: string): Promise<Block[]> {
    this.cache.delete(stepId);
    TemplateJsonLoader.clearCache();
    return this.loadStepBlocks(stepId);
  }

  /**
   * Lista todos os templates mapeados
   */
  static getAvailableTemplates(): string[] {
    return Object.keys(TEMPLATE_MAPPING);
  }

  /**
   * Verifica se um template está disponível
   */
  static hasTemplate(stepId: string): boolean {
    return stepId in TEMPLATE_MAPPING;
  }

  /**
   * Limpa todo o cache
   */
  static clearCache(): void {
    this.cache.clear();
    TemplateJsonLoader.clearCache();
  }
}

export default TemplateManager;
