/**
 * 🎯 ADAPTADOR HÍBRIDO BANCO/LOCAL - EDITOR DATABASE ADAPTER
 */

import type { Block } from "@/types/editor";
import { generateSemanticId } from "@/utils/semanticIdGenerator";
import ComponentsService from '../services/ComponentsService';
import type { Block as ServiceBlock } from '../services/ComponentsService';

// ============================================================================
// CONFIGURAÇÕES DO ADAPTER
// ============================================================================

interface AdapterConfig {
  useDatabase: boolean; // true = usar banco, false = usar templates locais
  quizId: string;
  fallbackToLocal: boolean; // fallback para templates locais se banco falhar
}

// ============================================================================
// CLASSE PRINCIPAL DO ADAPTER
// ============================================================================

export class EditorDatabaseAdapter {
  private config: AdapterConfig;
  private localTemplates: any; // Import dos templates locais

  constructor(config: AdapterConfig) {
    this.config = config;
    console.log('🔌 EditorDatabaseAdapter inicializado:', config);
  }

  // ==========================================================================
  // CARREGAR BLOCOS DE UMA ETAPA (BANCO OU LOCAL)
  // ==========================================================================
  
  async loadStageBlocks(stageId: string): Promise<EditorBlock[]> {
    const stepNumber = parseInt(stageId.replace("step-", ""));
    console.log(`🔍 Carregando blocos da etapa ${stepNumber} (${this.config.useDatabase ? 'banco' : 'local'})`);

    try {
      if (this.config.useDatabase) {
        // ✅ CARREGAR DO BANCO
        const stageKey = `step-${stepNumber.toString().padStart(2, '0')}`;
        const blocks = await ComponentsService.loadStageBlocks(stageKey);
        
        if (blocks.length > 0) {
          console.log(`✅ Carregados ${blocks.length} blocos do banco`);
          return blocks as Block[];
        }
        
        // Se não há blocos no banco, criar do template local
        console.log('📦 Nenhum bloco no banco, criando do template local...');
        return await this.createBlocksFromLocalTemplate(stepNumber);
      } else {
        // ✅ CARREGAR DO TEMPLATE LOCAL
        return this.loadLocalTemplate(stepNumber);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar blocos:', error);
      
      if (this.config.fallbackToLocal) {
        console.log('🔄 Fallback para template local...');
        return this.loadLocalTemplate(stepNumber);
      }
      
      return [];
    }
  }

  // ==========================================================================
  // SALVAR BLOCOS NO BANCO
  // ==========================================================================
  
  async saveStageBlocks(stageId: string, blocks: EditorBlock[]): Promise<boolean> {
    if (!this.config.useDatabase) {
      console.log('ℹ️ Modo local ativo, salvamento ignorado');
      return true;
    }

    const stepNumber = parseInt(stageId.replace("step-", ""));
    console.log(`💾 Salvando ${blocks.length} blocos da etapa ${stepNumber} no banco`);

    try {
      return await ComponentsService.syncStage(this.config.quizId, stepNumber, blocks);
    } catch (error) {
      console.error('❌ Erro ao salvar no banco:', error);
      return false;
    }
  }

  // ==========================================================================
  // ADICIONAR NOVO BLOCO
  // ==========================================================================
  
  async addBlock(stageId: string, blockType: string, position?: number): Promise<EditorBlock | null> {
    const stepNumber = parseInt(stageId.replace("step-", ""));
    
    if (this.config.useDatabase) {
      console.log(`➕ Criando bloco ${blockType} na etapa ${stepNumber} (banco)`);
      return await ComponentsService.createBlock(this.config.quizId, stepNumber, blockType, position);
    } else {
      console.log(`➕ Criando bloco ${blockType} na etapa ${stepNumber} (local)`);
      return this.createLocalBlock(blockType, position);
    }
  }

  // ==========================================================================
  // DELETAR BLOCO
  // ==========================================================================
  
  async deleteBlock(stageId: string, blockId: string): Promise<boolean> {
    if (!this.config.useDatabase) {
      console.log('ℹ️ Modo local ativo, deleção ignorada');
      return true;
    }

    console.log(`🗑️ Deletando bloco ${blockId}`);
    return await ComponentsService.deleteBlock(this.config.quizId, blockId);
  }

  // ==========================================================================
  // REORDENAR BLOCOS
  // ==========================================================================
  
  async reorderBlocks(stageId: string, blockIds: string[]): Promise<boolean> {
    if (!this.config.useDatabase) {
      console.log('ℹ️ Modo local ativo, reordenação ignorada');
      return true;
    }

    const stepNumber = parseInt(stageId.replace("step-", ""));
    console.log(`🔄 Reordenando blocos da etapa ${stepNumber}`);
    return await ComponentsService.reorderBlocks(this.config.quizId, stepNumber, blockIds);
  }

  // ==========================================================================
  // DUPLICAR BLOCO
  // ==========================================================================
  
  async duplicateBlock(sourceStageId: string, blockId: string, targetStageId?: string): Promise<string | null> {
    if (!this.config.useDatabase) {
      console.log('ℹ️ Modo local ativo, duplicação simulada');
      return `${blockId}-copy-${Date.now()}`;
    }

    const targetStep = targetStageId 
      ? parseInt(targetStageId.replace("step-", ""))
      : parseInt(sourceStageId.replace("step-", ""));

    console.log(`🔄 Duplicando bloco ${blockId} para etapa ${targetStep}`);
    return await ComponentsService.duplicateBlock(this.config.quizId, blockId, targetStep);
  }

  // ==========================================================================
  // MÉTODOS AUXILIARES PARA TEMPLATES LOCAIS
  // ==========================================================================
  
  private loadLocalTemplate(stepNumber: number): EditorBlock[] {
    try {
      // Simular carregamento de template local
      // Em produção, isso importaria dos arquivos Step*Template.tsx
      console.log(`📁 Carregando template local da etapa ${stepNumber}`);
      
      // Template padrão para demonstração
      return this.getDefaultTemplate(stepNumber);
    } catch (error) {
      console.error('❌ Erro ao carregar template local:', error);
      return [];
    }
  }

  private async createBlocksFromLocalTemplate(stepNumber: number): Promise<EditorBlock[]> {
    try {
      console.log(`🔨 Criando blocos no banco a partir do template da etapa ${stepNumber}`);
      
      // 1. Carregar template local
      const localBlocks = this.loadLocalTemplate(stepNumber);
      
      // 2. Salvar no banco
      if (localBlocks.length > 0) {
        await ComponentsService.syncStage(this.config.quizId, stepNumber, localBlocks);
        console.log(`✅ ${localBlocks.length} blocos criados no banco`);
      }
      
      return localBlocks;
    } catch (error) {
      console.error('❌ Erro ao criar blocos do template:', error);
      return [];
    }
  }

  private createLocalBlock(blockType: string, position?: number): EditorBlock {
    const timestamp = Date.now();
    return {
      id: `${blockType}-${timestamp}`,
      type: blockType as any,
      content: this.getDefaultBlockContent(blockType),
      order: position || 1,
      properties: this.getDefaultBlockContent(blockType)
    };
  }

  private getDefaultTemplate(stepNumber: number): EditorBlock[] {
    // Templates padrão por tipo de etapa
    const commonBlocks = [
      {
        id: 'quiz-header',
        type: 'quiz-intro-header' as any,
        content: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          progressValue: stepNumber * 5,
          showBackButton: stepNumber > 1
        },
        order: 1,
        properties: {}
      }
    ];

    // Etapa 1 (Hero)
    if (stepNumber === 1) {
      return [
        ...commonBlocks,
        {
          id: 'hero-image',
          type: 'image' as any,
          content: { src: '', alt: 'Imagem principal' },
          order: 2,
          properties: {}
        },
        {
          id: 'question-title',
          type: 'heading' as any,
          content: { content: 'Descubra Seu Estilo Ideal' },
          order: 3,
          properties: {}
        },
        {
          id: 'cta-button',
          type: 'button' as any,
          content: { text: 'Começar Quiz' },
          order: 4,
          properties: {}
        }
      ];
    }

    // Etapas de questão (2-14)
    if (stepNumber >= 2 && stepNumber <= 14) {
      return [
        ...commonBlocks,
        {
          id: 'question-title',
          type: 'heading' as any,
          content: { content: `Questão ${stepNumber - 1}` },
          order: 2,
          properties: {}
        },
        {
          id: 'options-grid',
          type: 'options-grid' as any,
          content: { options: [], columns: 2 },
          order: 3,
          properties: {}
        }
      ];
    }

    // Etapas especiais (15+)
    return [
      ...commonBlocks,
      {
        id: 'special-content',
        type: 'text' as any,
        content: { content: `Conteúdo da etapa ${stepNumber}` },
        order: 2,
        properties: {}
      }
    ];
  }

  private getDefaultBlockContent(blockType: string): Record<string, any> {
    const defaults: Record<string, any> = {
      'quiz-header': {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        showProgress: true,
        showBackButton: true
      },
      'question-title': {
        content: 'Nova Questão',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold'
      },
      'question-counter': {
        content: 'Questão X de Y',
        fontSize: 'text-sm'
      },
      'options-grid': {
        columns: 2,
        showImages: true,
        options: []
      },
      'hero-image': {
        src: '',
        alt: 'Imagem',
        size: 'large'
      },
      'cta-button': {
        text: 'Continuar',
        variant: 'primary',
        size: 'lg'
      }
    };

    return defaults[blockType] || { content: `Novo ${blockType}` };
  }

  // ==========================================================================
  // MÉTODOS DE CONFIGURAÇÃO
  // ==========================================================================
  
  setDatabaseMode(enabled: boolean): void {
    console.log(`🔧 Modo banco ${enabled ? 'ativado' : 'desativado'}`);
    this.config.useDatabase = enabled;
  }

  setQuizId(quizId: string): void {
    console.log(`🔧 Quiz ID alterado para: ${quizId}`);
    this.config.quizId = quizId;
  }

  async getQuizStats(): Promise<any> {
    if (!this.config.useDatabase) {
      return { mode: 'local', message: 'Estatísticas não disponíveis no modo local' };
    }

    try {
      const stats = await ComponentsService.getQuizStats(this.config.quizId);
      return { mode: 'database', ...stats };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      return { mode: 'database', error: error.message };
    }
  }

  // ==========================================================================
  // MÉTODOS DE MIGRAÇÃO
  // ==========================================================================
  
  async migrateLocalToDatabase(): Promise<boolean> {
    console.log('🚀 Iniciando migração de templates locais para banco...');
    
    try {
      let totalMigrated = 0;
      
      // Migrar todas as etapas (1-21)
      for (let step = 1; step <= 21; step++) {
        console.log(`📦 Migrando etapa ${step}...`);
        
        // Carregar template local
        const localBlocks = this.loadLocalTemplate(step);
        
        if (localBlocks.length > 0) {
          // Salvar no banco
          const success = await ComponentsService.syncStage(this.config.quizId, step, localBlocks);
          
          if (success) {
            totalMigrated++;
            console.log(`✅ Etapa ${step} migrada (${localBlocks.length} blocos)`);
          } else {
            console.error(`❌ Falha na migração da etapa ${step}`);
          }
        }
      }
      
      console.log(`🎯 Migração concluída: ${totalMigrated}/21 etapas`);
      return totalMigrated > 0;
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      return false;
    }
  }

  async validateDatabaseConnection(): Promise<boolean> {
    try {
      const types = await ComponentsService.getAvailableComponentTypes();
      console.log(`✅ Conexão com banco validada (${types.length} tipos de componentes)`);
      return true;
    } catch (error) {
      console.error('❌ Falha na conexão com banco:', error);
      return false;
    }
  }
}

// ============================================================================
// FACTORY PARA CRIAR ADAPTER
// ============================================================================

export function createEditorAdapter(config: Partial<AdapterConfig> = {}): EditorDatabaseAdapter {
  const defaultConfig: AdapterConfig = {
    useDatabase: true, // Padrão: usar banco
    quizId: 'default-quiz-id', // ID padrão
    fallbackToLocal: true // Fallback ativo
  };

  return new EditorDatabaseAdapter({ ...defaultConfig, ...config });
}

export default EditorDatabaseAdapter;
