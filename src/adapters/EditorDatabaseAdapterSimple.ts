/**
 * 🎯 ADAPTADOR SIMPLIFICADO BANCO/LOCAL - EDITOR DATABASE ADAPTER
 */

import type { Block } from "@/types/editor";
import ComponentsService from "../services/ComponentsService";

export interface DatabaseAdapterConfig {
  useDatabase: boolean;
  quizId: string;
  fallbackToLocal: boolean;
}

/**
 * Adaptador que permite alternar entre dados locais e banco de dados
 */
export class EditorDatabaseAdapter {
  private config: DatabaseAdapterConfig;

  constructor(config: DatabaseAdapterConfig) {
    this.config = config;
  }

  /**
   * Carrega blocos de uma stage (banco ou local)
   */
  async loadStageBlocks(stepNumber: number): Promise<Block[]> {
    try {
      if (this.config.useDatabase) {
        const stageKey = `step-${stepNumber.toString().padStart(2, "0")}`;
        const blocks = await ComponentsService.loadStageBlocks(stageKey);

        if (blocks.length > 0) {
          return blocks.map(block => ({
            ...block,
            type: block.type as any,
          }));
        }
      }

      // Fallback para dados locais
      return this.getDefaultTemplate(stepNumber);
    } catch (error) {
      console.error("Erro ao carregar blocos:", error);
      return this.getDefaultTemplate(stepNumber);
    }
  }

  /**
   * Salva blocos de uma stage
   */
  async saveStageBlocks(stepNumber: number, blocks: Block[]): Promise<boolean> {
    try {
      if (this.config.useDatabase) {
        const stageKey = `step-${stepNumber.toString().padStart(2, "0")}`;
        return await ComponentsService.syncStage(stageKey, blocks);
      }

      // Em modo local, apenas simula o salvamento
      console.log(`Salvamento local simulado para step ${stepNumber}:`, blocks.length, "blocos");
      return true;
    } catch (error) {
      console.error("Erro ao salvar blocos:", error);
      return false;
    }
  }

  /**
   * Cria um novo bloco
   */
  async addBlock(stepNumber: number, blockType: string): Promise<Block | null> {
    try {
      if (this.config.useDatabase) {
        const stageKey = `step-${stepNumber.toString().padStart(2, "0")}`;
        const instanceKey = await ComponentsService.createBlock(stageKey, blockType);

        if (instanceKey) {
          // Recarrega os blocos para pegar o bloco criado
          const blocks = await ComponentsService.loadStageBlocks(stageKey);
          const newBlock = blocks.find(b => b.id === instanceKey);

          if (newBlock) {
            return {
              ...newBlock,
              type: newBlock.type as any,
            };
          }
        }
      }

      // Fallback para criação local
      return this.createLocalBlock(blockType);
    } catch (error) {
      console.error("Erro ao criar bloco:", error);
      return this.createLocalBlock(blockType);
    }
  }

  /**
   * Remove um bloco
   */
  async deleteBlock(blockId: string): Promise<boolean> {
    try {
      if (this.config.useDatabase) {
        return await ComponentsService.deleteBlock(blockId);
      }

      // Em modo local, apenas simula
      console.log(`Remoção local simulada do bloco ${blockId}`);
      return true;
    } catch (error) {
      console.error("Erro ao deletar bloco:", error);
      return false;
    }
  }

  /**
   * Atualiza um bloco
   */
  async updateBlock(blockId: string, updates: Partial<Block>): Promise<boolean> {
    try {
      if (this.config.useDatabase) {
        return await ComponentsService.updateBlock(blockId, updates);
      }

      // Em modo local, apenas simula
      console.log(`Atualização local simulada do bloco ${blockId}:`, updates);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar bloco:", error);
      return false;
    }
  }

  /**
   * Alterna o modo de operação
   */
  setDatabaseMode(useDatabase: boolean): void {
    this.config.useDatabase = useDatabase;
  }

  /**
   * Verifica se está em modo banco
   */
  isDatabaseMode(): boolean {
    return this.config.useDatabase;
  }

  /**
   * Obtém estatísticas do adaptador
   */
  async getAdapterStats() {
    try {
      if (this.config.useDatabase) {
        const stages = await ComponentsService.getStagesWithComponents();
        return {
          mode: "database",
          stages: stages.length,
          stagesList: stages,
        };
      }

      return {
        mode: "local",
        templates: 21, // número de templates locais
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      return {
        mode: "error",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  // ============================================================================
  // MÉTODOS PRIVADOS - DADOS LOCAIS
  // ============================================================================

  private createLocalBlock(blockType: string): Block {
    return {
      id: `${blockType}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: blockType as any,
      content: this.getDefaultContent(blockType),
      properties: {},
      order: 1,
    };
  }

  private getDefaultContent(blockType: string): any {
    const defaults: Record<string, any> = {
      header: { text: "Título da Página", level: 1 },
      text: { text: "Texto descritivo aqui..." },
      question: { text: "Qual é a sua pergunta?" },
      "choice-single": {
        question: "Selecione uma opção:",
        options: ["Opção 1", "Opção 2", "Opção 3"],
      },
      "choice-multiple": {
        question: "Selecione uma ou mais opções:",
        options: ["Opção A", "Opção B", "Opção C"],
      },
      "input-text": { placeholder: "Digite sua resposta..." },
      "input-email": { placeholder: "seu@email.com" },
      "input-phone": { placeholder: "(11) 99999-9999" },
      "progress-bar": { current: 1, total: 10 },
      navigation: { showPrevious: true, showNext: true },
    };

    return defaults[blockType] || { text: "Conteúdo padrão" };
  }

  private getDefaultTemplate(stepNumber: number): Block[] {
    // Templates básicos para cada step
    const templates: Record<number, Block[]> = {
      1: [
        {
          id: "welcome-header",
          type: "header" as any,
          content: { text: "Bem-vindo ao Quiz", level: 1 },
          order: 1,
        },
        {
          id: "welcome-text",
          type: "text" as any,
          content: { text: "Responda as perguntas para descobrir seu perfil." },
          order: 2,
        },
      ],
      2: [
        {
          id: "question-header",
          type: "header" as any,
          content: { text: "Pergunta 1", level: 2 },
          order: 1,
        },
        {
          id: "single-choice",
          type: "choice-single" as any,
          content: {
            question: "Qual é a sua preferência?",
            options: ["Opção A", "Opção B", "Opção C"],
          },
          order: 2,
        },
      ],
    };

    return (
      templates[stepNumber] || [
        {
          id: `step-${stepNumber}-default`,
          type: "text" as any,
          content: { text: `Conteúdo padrão para o Step ${stepNumber}` },
          order: 1,
        },
      ]
    );
  }
}

export default EditorDatabaseAdapter;
