/**
 * 🔒 Optimistic Locking Service
 * 
 * Implementa detecção de conflitos de edição simultânea.
 * 
 * @features
 * - Detecção de conflitos por versão
 * - Merge inteligente de mudanças
 * - Histórico de versões
 * - Rollback de versões
 * 
 * @architecture
 * - Step versioning: cada step tem version própria
 * - Global versioning: template tem version global
 * - Conflict resolution: 3 estratégias (overwrite/cancel/merge)
 */

import type { Block } from '@/types/editor';

/**
 * Resultado de validação de versão
 */
export interface VersionValidationResult {
  valid: boolean;
  conflict?: {
    expectedVersion: number;
    actualVersion: number;
    lastModified?: string;
    message: string;
  };
}

/**
 * Metadata de versão para step
 */
export interface StepVersionMetadata {
  stepId: string;
  version: number;
  lastModified: string;
  modifiedBy?: string;
}

/**
 * Estratégia de resolução de conflito
 */
export type ConflictResolutionStrategy = 
  | 'overwrite'  // Sobrescrever mudanças remotas
  | 'cancel'     // Cancelar save local
  | 'merge';     // Tentar merge automático

/**
 * Resultado de merge
 */
export interface MergeResult {
  success: boolean;
  merged?: Block[];
  conflicts?: {
    blockId: string;
    localBlock: Block;
    remoteBlock: Block;
    reason: string;
  }[];
}

/**
 * Service para gerenciar optimistic locking
 */
export class OptimisticLockingService {
  private versionCache = new Map<string, StepVersionMetadata>();

  /**
   * Valida versão antes de salvar
   */
  async validateVersion(
    stepId: string,
    expectedVersion: number,
    getCurrentVersion: () => Promise<StepVersionMetadata | null>
  ): Promise<VersionValidationResult> {
    try {
      const current = await getCurrentVersion();

      if (!current) {
        // Step novo, versão 1 esperada
        if (expectedVersion !== 1) {
          return {
            valid: false,
            conflict: {
              expectedVersion,
              actualVersion: 1,
              message: 'Step novo deve ter version=1',
            },
          };
        }
        return { valid: true };
      }

      // Verificar se versão mudou
      if (current.version !== expectedVersion) {
        return {
          valid: false,
          conflict: {
            expectedVersion,
            actualVersion: current.version,
            lastModified: current.lastModified,
            message: `Conflito detectado: esperado version ${expectedVersion}, atual ${current.version}`,
          },
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('[OptimisticLocking] Erro ao validar versão:', error);
      throw error;
    }
  }

  /**
   * Incrementa versão e atualiza lastModified
   */
  incrementVersion(metadata: StepVersionMetadata): StepVersionMetadata {
    return {
      ...metadata,
      version: metadata.version + 1,
      lastModified: new Date().toISOString(),
    };
  }

  /**
   * Merge automático de blocos (estratégia simples por agora)
   */
  async mergeBlocks(
    localBlocks: Block[],
    remoteBlocks: Block[],
    baseBlocks?: Block[]
  ): Promise<MergeResult> {
    try {
      // Three-way merge se temos base
      if (baseBlocks) {
        return this.threeWayMerge(localBlocks, remoteBlocks, baseBlocks);
      }

      // Two-way merge: detectar conflitos em blocks modificados
      const localMap = new Map(localBlocks.map(b => [b.id, b]));
      const remoteMap = new Map(remoteBlocks.map(b => [b.id, b]));
      
      const merged: Block[] = [];
      const conflicts: MergeResult['conflicts'] = [];

      // 1. Adicionar todos os blocos remotos (base)
      for (const remoteBlock of remoteBlocks) {
        const localBlock = localMap.get(remoteBlock.id);

        if (!localBlock) {
          // Bloco existe apenas remotamente
          merged.push(remoteBlock);
        } else {
          // Bloco existe em ambos: verificar se são iguais
          const localJson = JSON.stringify(localBlock);
          const remoteJson = JSON.stringify(remoteBlock);

          if (localJson === remoteJson) {
            // Idênticos: usar qualquer um
            merged.push(remoteBlock);
          } else {
            // Conflito: blocks diferentes
            conflicts.push({
              blockId: remoteBlock.id,
              localBlock,
              remoteBlock,
              reason: 'Bloco modificado em ambas as versões',
            });
            // Por padrão, usar versão remota
            merged.push(remoteBlock);
          }
        }
      }

      // 2. Adicionar blocos que existem apenas localmente (novos)
      for (const localBlock of localBlocks) {
        if (!remoteMap.has(localBlock.id)) {
          merged.push(localBlock);
        }
      }

      return {
        success: conflicts.length === 0,
        merged,
        conflicts: conflicts.length > 0 ? conflicts : undefined,
      };
    } catch (error) {
      console.error('[OptimisticLocking] Erro no merge:', error);
      return {
        success: false,
        conflicts: [{
          blockId: 'unknown',
          localBlock: localBlocks[0],
          remoteBlock: remoteBlocks[0],
          reason: String(error),
        }],
      };
    }
  }

  /**
   * Three-way merge: usa base para detectar mudanças
   */
  private threeWayMerge(
    local: Block[],
    remote: Block[],
    base: Block[]
  ): MergeResult {
    const baseMap = new Map(base.map(b => [b.id, b]));
    const localMap = new Map(local.map(b => [b.id, b]));
    const remoteMap = new Map(remote.map(b => [b.id, b]));

    const merged: Block[] = [];
    const conflicts: MergeResult['conflicts'] = [];
    const processed = new Set<string>();

    // Processar todos os blocos únicos
    const allIds = new Set([
      ...base.map(b => b.id),
      ...local.map(b => b.id),
      ...remote.map(b => b.id),
    ]);

    for (const id of allIds) {
      const baseBlock = baseMap.get(id);
      const localBlock = localMap.get(id);
      const remoteBlock = remoteMap.get(id);

      // Casos:
      // 1. Deletado localmente, modificado remotamente (ou vice-versa) → conflito
      // 2. Modificado em ambos de formas diferentes → conflito
      // 3. Modificado apenas localmente → usar local
      // 4. Modificado apenas remotamente → usar remote
      // 5. Idêntico → usar qualquer um

      if (!localBlock && !remoteBlock) {
        // Deletado em ambos: skip
        continue;
      }

      if (localBlock && !remoteBlock) {
        if (baseBlock) {
          // Deletado remotamente
          conflicts.push({
            blockId: id,
            localBlock,
            remoteBlock: baseBlock,
            reason: 'Bloco deletado remotamente, mas modificado localmente',
          });
          merged.push(localBlock); // Prefer local
        } else {
          // Novo localmente
          merged.push(localBlock);
        }
        processed.add(id);
        continue;
      }

      if (!localBlock && remoteBlock) {
        if (baseBlock) {
          // Deletado localmente
          conflicts.push({
            blockId: id,
            localBlock: baseBlock,
            remoteBlock,
            reason: 'Bloco deletado localmente, mas modificado remotamente',
          });
          merged.push(remoteBlock); // Prefer remote
        } else {
          // Novo remotamente
          merged.push(remoteBlock);
        }
        processed.add(id);
        continue;
      }

      // Ambos existem: verificar mudanças
      const localChanged = !baseBlock || JSON.stringify(localBlock) !== JSON.stringify(baseBlock);
      const remoteChanged = !baseBlock || JSON.stringify(remoteBlock) !== JSON.stringify(baseBlock);

      if (!localChanged && !remoteChanged) {
        // Nenhuma mudança
        merged.push(localBlock!);
      } else if (localChanged && !remoteChanged) {
        // Apenas local mudou
        merged.push(localBlock!);
      } else if (!localChanged && remoteChanged) {
        // Apenas remote mudou
        merged.push(remoteBlock!);
      } else {
        // Ambos mudaram: verificar se são iguais
        if (JSON.stringify(localBlock) === JSON.stringify(remoteBlock)) {
          // Mesma mudança
          merged.push(localBlock!);
        } else {
          // Mudanças diferentes: conflito
          conflicts.push({
            blockId: id,
            localBlock: localBlock!,
            remoteBlock: remoteBlock!,
            reason: 'Bloco modificado de formas diferentes',
          });
          merged.push(remoteBlock!); // Prefer remote por padrão
        }
      }
      processed.add(id);
    }

    return {
      success: conflicts.length === 0,
      merged,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
    };
  }

  /**
   * Cache de versão local (para evitar round-trips)
   */
  getCachedVersion(stepId: string): StepVersionMetadata | undefined {
    return this.versionCache.get(stepId);
  }

  setCachedVersion(metadata: StepVersionMetadata): void {
    this.versionCache.set(metadata.stepId, metadata);
  }

  clearCache(): void {
    this.versionCache.clear();
  }
}

// Singleton instance
export const optimisticLockingService = new OptimisticLockingService();
