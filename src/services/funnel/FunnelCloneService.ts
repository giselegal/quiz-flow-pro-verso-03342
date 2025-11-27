/**
 * 🎯 FASE 1: Serviço de Clonagem de Funis
 * 
 * Duplicação eficiente de funis com:
 * - Normalização automática de IDs
 * - Preservação de referências
 * - Transformações opcionais (rename, filters)
 * - Salvamento em batch (1 transação)
 */

import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';
import type { Block } from '@/types/block';
import { appLogger } from '@/lib/utils/logger';
import { supabase } from '@/integrations/supabase/client';

// Tipo simplificado de Funnel para clonagem
export interface Funnel {
  id: string;
  name: string;
  description?: string;
  is_published?: boolean;
  metadata?: Record<string, any>;
  steps: Array<{
    id: string;
    order: number;
    blocks: Block[];
  }>;
}

export interface CloneOptions {
  /** Novo nome do funil (padrão: "Cópia de [nome original]") */
  name?: string;
  
  /** Pattern para renomear blocos (ex: "[original] - Variação A") */
  renamePattern?: string;
  
  /** Filtrar apenas steps específicos */
  includeSteps?: number[];
  
  /** Aplicar transformações customizadas */
  transforms?: {
    /** Modificar propriedades de blocos */
    blockProperties?: (block: Block, stepIndex: number) => Partial<Block>;
    
    /** Modificar metadata do funil */
    funnelMetadata?: (funnel: Funnel) => Partial<Funnel>;
  };
  
  /** Criar como draft (não publicado) */
  asDraft?: boolean;
}

export interface CloneResult {
  success: boolean;
  clonedFunnel: Funnel | null;
  error?: string;
  stats?: {
    originalSteps: number;
    clonedSteps: number;
    originalBlocks: number;
    clonedBlocks: number;
    durationMs: number;
  };
}

/**
 * Serviço dedicado para clonagem eficiente de funis
 */
export class FunnelCloneService {
  /**
   * Clonar funil completo
   */
  async clone(funnelId: string, options: CloneOptions = {}): Promise<CloneResult> {
    const startTime = Date.now();
    
    appLogger.info('[FunnelClone] Iniciando clonagem...', { data: [{ funnelId, options }] });

    try {
      // 1. Carregar funil original
      const original = await this.loadFunnel(funnelId);
      if (!original) {
        throw new Error(`Funil ${funnelId} não encontrado`);
      }

      // 2. Normalizar IDs (gerar novos UUIDs para tudo)
      const normalized = this.normalizeIds(original, options);

      // 3. Aplicar transformações customizadas
      const transformed = this.applyTransforms(normalized, options);

      // 4. Salvar em batch (1 transação no Supabase)
      const cloned = await this.saveFunnelBatch(transformed);

      const durationMs = Date.now() - startTime;

      appLogger.info('[FunnelClone] ✅ Clonagem concluída', { 
        data: [{ 
          clonedId: cloned.id, 
          durationMs,
          stats: this.getCloneStats(original, cloned)
        }] 
      });

      return {
        success: true,
        clonedFunnel: cloned,
        stats: {
          ...this.getCloneStats(original, cloned),
          durationMs,
        },
      };

    } catch (error) {
      appLogger.error('[FunnelClone] ❌ Erro na clonagem:', { data: [error] });
      
      return {
        success: false,
        clonedFunnel: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Carregar funil do Supabase
   * 
   * TODO: Integrar com schema real do Supabase quando disponível
   * Por enquanto, retorna mock para testes
   */
  private async loadFunnel(funnelId: string): Promise<Funnel | null> {
    try {
      // ⚠️ MOCK: Substituir por query real quando schema estiver disponível
      appLogger.warn('[FunnelClone] Usando mock de loadFunnel - integrar com Supabase real');
      
      // Mock básico para testes
      return {
        id: funnelId,
        name: 'Funil Mock',
        description: 'Mock para testes',
        is_published: false,
        steps: [
          {
            id: uuidv4(),
            order: 1,
            blocks: [
              {
                id: uuidv4(),
                type: 'quiz-intro-header',
                order: 0,
                properties: { title: 'Título Mock' },
                content: {},
              },
            ],
          },
        ],
        metadata: {},
      };

    } catch (error) {
      appLogger.error('[FunnelClone] Erro ao carregar funil:', { data: [error] });
      return null;
    }
  }

  /**
   * Normalizar todos os IDs (gerar novos UUIDs)
   */
  private normalizeIds(funnel: Funnel, options: CloneOptions): Funnel {
    const idMap = new Map<string, string>();

    return produce(funnel, (draft: Funnel) => {
      // Novo ID do funil
      const oldFunnelId = draft.id;
      draft.id = uuidv4();
      idMap.set(oldFunnelId, draft.id);

      // Novo nome
      draft.name = options.name || `Cópia de ${draft.name}`;

      // Marcar como draft se solicitado
      if (options.asDraft) {
        draft.is_published = false;
      }

      // Filtrar steps se necessário
      if (options.includeSteps && options.includeSteps.length > 0) {
        draft.steps = draft.steps.filter((s: any) => options.includeSteps!.includes(s.order));
      }

      // Normalizar IDs de steps e blocos
      draft.steps.forEach((step: any) => {
        const oldStepId = step.id;
        step.id = uuidv4();
        idMap.set(oldStepId, step.id);

        step.blocks.forEach((block: any) => {
          const oldBlockId = block.id;
          block.id = uuidv4();
          idMap.set(oldBlockId, block.id);

          // Atualizar referências internas (ex: parentId, linkedBlockId)
          if ('parentId' in block && block.parentId && idMap.has(block.parentId as string)) {
            block.parentId = idMap.get(block.parentId as string);
          }

          if ('linkedBlockId' in block && block.linkedBlockId && idMap.has(block.linkedBlockId as string)) {
            block.linkedBlockId = idMap.get(block.linkedBlockId as string);
          }

          // Atualizar referências em properties
          if (block.properties) {
            this.updateReferencesInObject(block.properties, idMap);
          }
        });
      });
    });
  }

  /**
   * Atualizar referências de IDs em objetos aninhados
   */
  private updateReferencesInObject(obj: any, idMap: Map<string, string>): void {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach(key => {
      const value = obj[key];

      // Se é uma string que parece ser um UUID, tentar substituir
      if (typeof value === 'string' && idMap.has(value)) {
        obj[key] = idMap.get(value);
      }

      // Recursão para objetos aninhados
      if (typeof value === 'object' && value !== null) {
        this.updateReferencesInObject(value, idMap);
      }
    });
  }

  /**
   * Aplicar transformações customizadas
   */
  private applyTransforms(funnel: Funnel, options: CloneOptions): Funnel {
    return produce(funnel, draft => {
      // Transformações no funil
      if (options.transforms?.funnelMetadata) {
        const metadata = options.transforms.funnelMetadata(funnel);
        Object.assign(draft, metadata);
      }

      // Transformações nos blocos
      if (options.transforms?.blockProperties) {
        draft.steps.forEach((step, stepIndex) => {
          step.blocks.forEach(block => {
            const originalBlock = funnel.steps[stepIndex]?.blocks.find(b => 
              // Usar order como fallback já que IDs foram normalizados
              b.order === block.order
            );

            if (originalBlock) {
              const updates = options.transforms!.blockProperties!(originalBlock, stepIndex);
              Object.assign(block, updates);
            }
          });
        });
      }

      // Aplicar rename pattern
      if (options.renamePattern) {
        draft.steps.forEach(step => {
          step.blocks.forEach(block => {
            if (block.properties?.title) {
              block.properties.title = this.applyRenamePattern(
                block.properties.title,
                options.renamePattern!
              );
            }

            if (block.content?.text) {
              block.content.text = this.applyRenamePattern(
                block.content.text,
                options.renamePattern!
              );
            }
          });
        });
      }
    });
  }

  /**
   * Aplicar pattern de rename
   */
  private applyRenamePattern(original: string, pattern: string): string {
    return pattern.replace('[original]', original);
  }

  /**
   * Salvar funil clonado em batch (1 transação)
   * 
   * TODO: Integrar com schema real do Supabase quando disponível
   * Por enquanto, apenas loga para testes
   */
  private async saveFunnelBatch(funnel: Funnel): Promise<Funnel> {
    appLogger.info('[FunnelClone] Salvando funil clonado...', { data: [{ funnelId: funnel.id }] });

    try {
      // ⚠️ MOCK: Substituir por insert real quando schema estiver disponível
      appLogger.warn('[FunnelClone] Usando mock de saveFunnelBatch - integrar com Supabase real');
      
      // Simular salvamento
      appLogger.info('[FunnelClone] ✅ Funil "salvo" (mock)', {
        data: [{
          funnelId: funnel.id,
          steps: funnel.steps.length,
          blocks: funnel.steps.reduce((sum: number, s: any) => sum + s.blocks.length, 0),
        }]
      });

      return funnel;

    } catch (error) {
      appLogger.error('[FunnelClone] ❌ Erro ao salvar funil:', { data: [error] });
      throw error;
    }
  }

  /**
   * Obter estatísticas de clonagem
   */
  private getCloneStats(original: Funnel, cloned: Funnel) {
    return {
      originalSteps: original.steps.length,
      clonedSteps: cloned.steps.length,
      originalBlocks: original.steps.reduce((sum, s) => sum + s.blocks.length, 0),
      clonedBlocks: cloned.steps.reduce((sum, s) => sum + s.blocks.length, 0),
    };
  }
}

// Singleton
export const funnelCloneService = new FunnelCloneService();
