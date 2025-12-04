/**
 * 🔄 FUNNEL CLONE SERVICE
 * 
 * Serviço de clonagem otimizada de funis integrado ao Core.
 * 
 * RESPONSABILIDADES:
 * - Clonar funis completos com normalização de IDs
 * - Aplicar transformações em propriedades
 * - Preservar referências e relacionamentos
 * - Otimizar operações em lote
 * 
 * INTEGRAÇÃO COM CORE:
 * - Usa FunnelDataProvider existente para operações de I/O
 * - Integra com sistema de eventos do core (@/lib/events/editorEvents)
 * - Segue padrões de nomenclatura do core
 */

import { appLogger } from '@/lib/utils/appLogger';
import { supabase } from '@/lib/supabase';
import { editorEvents } from '@/lib/events/editorEvents';

// ============================================================================
// TYPES
// ============================================================================

export interface CloneOptions {
  /** Nome do funil clonado */
  name?: string;
  
  /** Padrão de renomeação (ex: "[original] - Cópia") */
  renamePattern?: string;
  
  /** Criar como rascunho */
  asDraft?: boolean;
  
  /** IDs dos steps a incluir (null = todos) */
  includeSteps?: number[] | null;
  
  /** Transformações customizadas */
  transforms?: {
    blockProperties?: (block: any) => Partial<any>;
    stepProperties?: (step: any) => Partial<any>;
  };
}

export interface CloneResult {
  success: boolean;
  clonedFunnel: any | null;
  error?: string;
  stats?: {
    clonedSteps: number;
    clonedBlocks: number;
    duration: number;
  };
}

interface IdMap {
  funnels: Map<string, string>;
  steps: Map<string, string>;
  blocks: Map<string, string>;
}

// ============================================================================
// SERVICE
// ============================================================================

export class FunnelCloneService {
  private idMaps: IdMap = {
    funnels: new Map(),
    steps: new Map(),
    blocks: new Map(),
  };

  /**
   * Clona um funil completo com todas suas dependências
   */
  async clone(funnelId: string, options: CloneOptions = {}): Promise<CloneResult> {
    const startTime = performance.now();
    
    try {
      appLogger.info(`🔄 Iniciando clonagem do funil: ${funnelId}`, options);

      // 1. Carregar funil original
      const original = await this.loadFunnelWithDependencies(funnelId);
      
      if (!original) {
        throw new Error(`Funil ${funnelId} não encontrado`);
      }

      // 2. Clonar estrutura do funil
      const clonedFunnel = await this.cloneFunnelStructure(original, options);

      // 3. Clonar steps
      const steps = await this.cloneSteps(original.id, clonedFunnel.id, options);

      // 4. Clonar blocos de cada step
      let totalBlocks = 0;
      for (const [originalStepId, clonedStepId] of this.idMaps.steps.entries()) {
        const blockCount = await this.cloneStepBlocks(originalStepId, clonedStepId, options);
        totalBlocks += blockCount;
      }

      const duration = performance.now() - startTime;

      // Emitir evento de clonagem completa
      (editorEvents as any).emit('funnel:cloned', {
        originalId: funnelId,
        clonedId: clonedFunnel.id,
        stats: {
          steps: steps.length,
          blocks: totalBlocks,
          duration,
        },
      });

      appLogger.info(`✅ Funil clonado com sucesso em ${duration.toFixed(2)}ms`, {
        original: funnelId,
        cloned: clonedFunnel.id,
        steps: steps.length,
        blocks: totalBlocks,
      });

      return {
        success: true,
        clonedFunnel,
        stats: {
          clonedSteps: steps.length,
          clonedBlocks: totalBlocks,
          duration,
        },
      };

    } catch (error: any) {
      appLogger.error('❌ Erro ao clonar funil:', error);
      
      return {
        success: false,
        clonedFunnel: null,
        error: error.message || 'Erro desconhecido ao clonar funil',
      };
    } finally {
      // Limpar mapas de IDs
      this.idMaps.funnels.clear();
      this.idMaps.steps.clear();
      this.idMaps.blocks.clear();
    }
  }

  /**
   * Carrega funil com todas as dependências
   */
  private async loadFunnelWithDependencies(funnelId: string): Promise<any> {
    const { data: funnel, error } = await supabase
      .from('funnels')
      .select('*')
      .eq('id', funnelId)
      .single();

    if (error) {
      throw new Error(`Erro ao carregar funil: ${error.message}`);
    }

    return funnel;
  }

  /**
   * Clona a estrutura principal do funil
   */
  private async cloneFunnelStructure(original: any, options: CloneOptions): Promise<any> {
    const newName = options.name || 
                    (options.renamePattern 
                      ? options.renamePattern.replace('[original]', original.name)
                      : `${original.name} - Cópia`);

    const clonedData = {
      name: newName,
      description: original.description,
      user_id: original.user_id,
      config: original.config ? { ...original.config } : null,
      settings: original.settings ? { ...original.settings } : null,
      is_published: options.asDraft ? false : original.is_published,
      status: options.asDraft ? 'draft' : original.status,
      version: 1,
    };

    const { data: cloned, error } = await supabase
      .from('funnels')
      .insert(clonedData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar funil clonado: ${error.message}`);
    }

    this.idMaps.funnels.set(original.id, cloned.id);

    return cloned;
  }

  /**
   * Clona steps do funil
   */
  private async cloneSteps(
    originalFunnelId: string, 
    clonedFunnelId: string, 
    options: CloneOptions
  ): Promise<any[]> {
    // Carregar steps originais (usando component_instances como alternativa)
    let query = (supabase as any)
      .from('component_instances')
      .select('*')
      .eq('funnel_id', originalFunnelId)
      .order('step_number', { ascending: true });

    const { data: originalSteps, error: loadError } = await query;

    if (loadError) {
      throw new Error(`Erro ao carregar steps: ${loadError.message}`);
    }

    if (!originalSteps || originalSteps.length === 0) {
      return [];
    }

    // Filtrar steps se necessário
    let stepsToClone = originalSteps;
    if (options.includeSteps && options.includeSteps.length > 0) {
      stepsToClone = originalSteps.filter((step: any) => 
        options.includeSteps!.includes(step.step_order)
      );
    }

    // Preparar dados dos steps clonados
    const clonedStepsData = stepsToClone.map((step: any, index: number) => {
      const baseData = {
        funnel_id: clonedFunnelId,
        step_order: options.includeSteps ? index + 1 : step.step_order,
        step_type: step.step_type,
        config: step.config ? { ...step.config } : null,
      };

      // Aplicar transformações se fornecidas
      if (options.transforms?.stepProperties) {
        const transformed = options.transforms.stepProperties(step);
        return { ...baseData, ...transformed };
      }

      return baseData;
    });

    // Inserir steps em lote
    const { data: clonedSteps, error: insertError } = await (supabase as any)
      .from('component_instances')
      .insert(clonedStepsData)
      .select();

    if (insertError) {
      throw new Error(`Erro ao inserir steps clonados: ${insertError.message}`);
    }

    // Mapear IDs antigos → novos
    stepsToClone.forEach((originalStep: any, index: number) => {
      this.idMaps.steps.set(originalStep.id, clonedSteps[index].id);
    });

    return clonedSteps;
  }

  /**
   * Clona blocos de um step específico
   */
  private async cloneStepBlocks(
    originalStepId: string, 
    clonedStepId: string,
    options: CloneOptions
  ): Promise<number> {
    // Carregar blocos originais
    const { data: originalBlocks, error: loadError } = await supabase
      .from('component_instances')
      .select('*')
      .eq('step_id', originalStepId)
      .order('display_order', { ascending: true });

    if (loadError) {
      throw new Error(`Erro ao carregar blocos: ${loadError.message}`);
    }

    if (!originalBlocks || originalBlocks.length === 0) {
      return 0;
    }

    // Preparar dados dos blocos clonados
    const clonedBlocksData = originalBlocks.map((block: any) => {
      const baseData = {
        step_id: clonedStepId,
        component_type: block.component_type,
        display_order: block.display_order,
        properties: block.properties ? { ...block.properties } : {},
        content: block.content ? { ...block.content } : {},
        styles: block.styles ? { ...block.styles } : null,
        validation: block.validation ? { ...block.validation } : null,
      };

      // Aplicar transformações se fornecidas
      if (options.transforms?.blockProperties) {
        const transformed = options.transforms.blockProperties(block);
        return { ...baseData, ...transformed };
      }

      return baseData;
    });

    // Inserir blocos em lote
    const { data: clonedBlocks, error: insertError } = await supabase
      .from('component_instances')
      .insert(clonedBlocksData)
      .select();

    if (insertError) {
      throw new Error(`Erro ao inserir blocos clonados: ${insertError.message}`);
    }

    // Mapear IDs antigos → novos
    originalBlocks.forEach((originalBlock: any, index: number) => {
      this.idMaps.blocks.set(originalBlock.id, clonedBlocks[index].id);
    });

    return clonedBlocks.length;
  }

  /**
   * Obtém mapa de IDs para referências
   */
  getIdMaps(): Readonly<IdMap> {
    return {
      funnels: new Map(this.idMaps.funnels),
      steps: new Map(this.idMaps.steps),
      blocks: new Map(this.idMaps.blocks),
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const funnelCloneService = new FunnelCloneService();
