
// Update the import path below to the correct relative path if needed
import type { Block } from "../types/editor";
import { TemplateJsonLoader } from "./TemplateJsonLoader";

/**
 * Mapeamento completo das 21 etapas para templates JSON
 */
const TEMPLATE_MAPPING = {
  "step-1": "/templates/step-01-template.json",
  "step-2": "/templates/step-02-template.json",
  "step-3": "/templates/step-03-template.json",
  "step-4": "/templates/step-04-template.json",
  "step-5": "/templates/step-05-template.json",
  "step-6": "/templates/step-06-template.json",
  "step-7": "/templates/step-07-template.json",
  "step-8": "/templates/step-08-template.json",
  "step-9": "/templates/step-09-template.json",
  "step-10": "/templates/step-10-template.json",
  "step-11": "/templates/step-11-template.json",
  "step-12": "/templates/step-12-template.json",
  "step-13": "/templates/step-13-template.json",
  "step-14": "/templates/step-14-template.json",
  "step-15": "/templates/step-15-template.json",
  "step-16": "/templates/step-16-template.json",
  "step-17": "/templates/step-17-template.json",
  "step-18": "/templates/step-18-template.json",
  "step-19": "/templates/step-19-template.json",
  "step-20": "/templates/step-20-template.json",
  "step-21": "/templates/step-21-template.json",
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
    console.log(`🔄 Usando fallback inteligente para ${stepId}`);

    const stepNumber = parseInt(stepId.replace("step-", ""));
    
    // 🎯 FALLBACKS ESTRUTURADOS POR CATEGORIA
    
    // Steps 1-3: Introdução e Onboarding
    if (stepNumber <= 3) {
      return [
        {
          id: `${stepId}-intro-title`,
          type: "text-inline",
          order: 0,
          properties: {
            content: stepNumber === 1 ? "🌟 Bem-vindo ao Quiz!" :
                     stepNumber === 2 ? "🎯 Vamos Começar!" :
                     "📋 Suas Informações",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#1f2937",
            containerWidth: "full",
            spacing: "large",
          },
          content: {
            content: stepNumber === 1 ? "🌟 Bem-vindo ao Quiz!" :
                     stepNumber === 2 ? "🎯 Vamos Começar!" :
                     "📋 Suas Informações",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#1f2937",
          },
        },
        {
          id: `${stepId}-intro-description`,
          type: "text-inline",
          order: 1,
          properties: {
            content: stepNumber === 1 ? "Descubra insights únicos sobre seu perfil" :
                     stepNumber === 2 ? "Algumas perguntas rápidas para personalizar sua experiência" :
                     "Precisamos de algumas informações básicas",
            fontSize: "text-lg",
            textAlign: "text-center",
            color: "#6b7280",
            containerWidth: "medium",
            spacing: "medium",
          },
          content: {
            content: stepNumber === 1 ? "Descubra insights únicos sobre seu perfil" :
                     stepNumber === 2 ? "Algumas perguntas rápidas para personalizar sua experiência" :
                     "Precisamos de algumas informações básicas",
            fontSize: "text-lg",
            textAlign: "text-center",
            color: "#6b7280",
          },
        }
      ];
    }

    // Steps 4-14: Perguntas do Quiz
    if (stepNumber >= 4 && stepNumber <= 14) {
      return [
        {
          id: `${stepId}-question-title`,
          type: "text-inline",
          order: 0,
          properties: {
            content: `Pergunta ${stepNumber - 3}`,
            fontSize: "text-2xl",
            fontWeight: "font-semibold",
            textAlign: "text-center",
            color: "#1f2937",
            containerWidth: "full",
            spacing: "medium",
          },
          content: {
            content: `Pergunta ${stepNumber - 3}`,
            fontSize: "text-2xl",
            fontWeight: "font-semibold",
            textAlign: "text-center",
            color: "#1f2937",
          },
        },
        {
          id: `${stepId}-quiz-step`,
          type: "quiz-step" as any, // TODO: Fix BlockType
          order: 1,
          properties: {
            headerEnabled: true,
            questionText: `Esta é a pergunta ${stepNumber - 3} do seu quiz personalizado`,
            questionTextColor: "#1f2937",
            questionTextSize: 20,
            questionTextAlign: "center",
            layout: "2-columns",
            direction: "vertical",
            disposition: "text-only",
            options: [
              {
                id: `option-${stepId}-1`,
                text: "Opção A",
                value: "a",
                imageUrl: "",
                selected: false
              },
              {
                id: `option-${stepId}-2`,
                text: "Opção B", 
                value: "b",
                imageUrl: "",
                selected: false
              },
              {
                id: `option-${stepId}-3`,
                text: "Opção C",
                value: "c", 
                imageUrl: "",
                selected: false
              }
            ] as any, // TODO: Fix option type
            isMultipleChoice: false,
            isRequired: true,
            autoProceed: false,
            borderRadius: "medium",
            boxShadow: "medium",
            spacing: "medium",
            detail: "none",
            optionStyle: "card",
            primaryColor: "#3b82f6",
            secondaryColor: "#ffffff",
            borderColor: "#e5e7eb",
            maxWidth: 100,
          },
          content: {
            questionText: `Esta é a pergunta ${stepNumber - 3} do seu quiz personalizado`,
            options: [
              { id: `option-${stepId}-1`, text: "Opção A", imageUrl: "" },
              { id: `option-${stepId}-2`, text: "Opção B", imageUrl: "" },
              { id: `option-${stepId}-3`, text: "Opção C", imageUrl: "" }
            ]
          },
        }
      ];
    }

    // Step 15: Transição
    if (stepNumber === 15) {
      return [
        {
          id: `${stepId}-transition-title`,
          type: "text-inline",
          order: 0,
          properties: {
            content: "⚡ Processando suas Respostas",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#7c3aed",
            containerWidth: "full",
            spacing: "large",
          },
          content: {
            content: "⚡ Processando suas Respostas",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#7c3aed",
          },
        },
        {
          id: `${stepId}-transition-description`,
          type: "text-inline",
          order: 1,
          properties: {
            content: "Estamos analisando suas preferências para criar um resultado personalizado...",
            fontSize: "text-lg",
            textAlign: "text-center",
            color: "#6b7280",
            containerWidth: "medium",
            spacing: "medium",
          },
          content: {
            content: "Estamos analisando suas preferências para criar um resultado personalizado...",
            fontSize: "text-lg",
            textAlign: "text-center",
            color: "#6b7280",
          },
        }
      ];
    }

    // Step 16: Processamento
    if (stepNumber === 16) {
      return [
        {
          id: `${stepId}-processing-title`,
          type: "text-inline",
          order: 0,
          properties: {
            content: "🔄 Calculando Resultados",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#059669",
            containerWidth: "full",
            spacing: "large",
          },
          content: {
            content: "🔄 Calculando Resultados",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#059669",
          },
        }
      ];
    }

    // Steps 17-18: Resultados
    if (stepNumber >= 17 && stepNumber <= 18) {
      return [
        {
          id: `${stepId}-result-title`,
          type: "text-inline",
          order: 0,
          properties: {
            content: stepNumber === 17 ? "🎉 Seus Resultados" : "📊 Análise Detalhada",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#dc2626",
            containerWidth: "full",
            spacing: "large",
          },
          content: {
            content: stepNumber === 17 ? "🎉 Seus Resultados" : "📊 Análise Detalhada",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#dc2626",
          },
        },
        {
          id: `${stepId}-result-description`,
          type: "text-inline",
          order: 1,
          properties: {
            content: stepNumber === 17 ? 
              "Com base nas suas respostas, identificamos seu perfil único!" :
              "Veja uma análise completa dos seus resultados:",
            fontSize: "text-lg",
            textAlign: "text-center",
            color: "#6b7280",
            containerWidth: "medium",
            spacing: "medium",
          },
          content: {
            content: stepNumber === 17 ? 
              "Com base nas suas respostas, identificamos seu perfil único!" :
              "Veja uma análise completa dos seus resultados:",
            fontSize: "text-lg",
            textAlign: "text-center",
            color: "#6b7280",
          },
        }
      ];
    }

    // Steps 19-21: Finalizações
    if (stepNumber >= 19) {
      return [
        {
          id: `${stepId}-final-title`,
          type: "text-inline",
          order: 0,
          properties: {
            content: stepNumber === 19 ? "🎯 Próximos Passos" :
                     stepNumber === 20 ? "📱 Compartilhe" :
                     "✨ Obrigado!",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#7c3aed",
            containerWidth: "full",
            spacing: "large",
          },
          content: {
            content: stepNumber === 19 ? "🎯 Próximos Passos" :
                     stepNumber === 20 ? "📱 Compartilhe" :
                     "✨ Obrigado!",
            fontSize: "text-3xl",
            fontWeight: "font-bold",
            textAlign: "text-center",
            color: "#7c3aed",
          },
        }
      ];
    }

    // Fallback genérico (não deveria chegar aqui)
    return [
      {
        id: `${stepId}-generic-title`,
        type: "text-inline",
        order: 0,
        properties: {
          content: `Etapa ${stepNumber}`,
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#374151",
        },
        content: {
          content: `Etapa ${stepNumber}`,
          fontSize: "text-2xl",
          fontWeight: "font-bold",
          textAlign: "text-center",
          color: "#374151",
        },
      }
    ];
  }

  /**
   * Pre-carrega templates mais usados
   */
  static async preloadCommonTemplates(): Promise<void> {
    const commonSteps = [
      "step-1",
      "step-2",
      "step-3",
      "step-4",
      "step-5",
      "step-6",
      "step-7",
      "step-8",
      "step-9",
      "step-10",
      "step-11",
      "step-12",
      "step-13",
      "step-14",
      "step-15",
      "step-16",
      "step-17",
      "step-18",
      "step-19",
      "step-20",
      "step-21",
    ];

    console.log("🚀 Pre-carregando templates comuns...");

    const promises = commonSteps.map(async stepId => {
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
