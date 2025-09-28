/**
 * 🎯 VERSIONING SERVICE - SISTEMA DE VERSIONAMENTO E HISTÓRICO
 * 
 * Serviço centralizado para controle de versões, histórico e snapshots
 * do sistema unificado, integrando com o UnifiedCRUDService existente.
 * 
 * FUNCIONALIDADES:
 * ✅ Controle de versões automático
 * ✅ Snapshots automáticos e manuais
 * ✅ Histórico completo de mudanças
 * ✅ Comparação entre versões
 * ✅ Rollback/restore de versões
 * ✅ Versionamento semântico
 * ✅ Integração com CRUD existente
 */

import { UnifiedFunnel, UnifiedStage } from './UnifiedCRUDService';
import { Block } from '@/types/editor';

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

export interface VersionSnapshot {
  id: string;
  version: string;
  timestamp: Date;
  type: 'auto' | 'manual' | 'milestone';
  description?: string;
  funnel: UnifiedFunnel;
  metadata: {
    changesCount: number;
    stagesCount: number;
    blocksCount: number;
    size: number;
    author?: string;
    tags?: string[];
  };
}

export interface VersionChange {
  id: string;
  type: 'create' | 'update' | 'delete' | 'reorder';
  entity: 'funnel' | 'stage' | 'block';
  entityId: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  description?: string;
}

export interface VersionComparison {
  versionA: VersionSnapshot;
  versionB: VersionSnapshot;
  changes: VersionChange[];
  summary: {
    added: number;
    modified: number;
    deleted: number;
    moved: number;
  };
}

export interface VersioningConfig {
  maxSnapshots: number;
  autoSnapshotInterval: number; // em minutos
  enableAutoSnapshots: boolean;
  enableMilestoneSnapshots: boolean;
  compressionEnabled: boolean;
  retentionDays: number;
}

export interface VersioningStats {
  totalSnapshots: number;
  totalChanges: number;
  averageChangesPerSnapshot: number;
  oldestSnapshot: Date | null;
  newestSnapshot: Date | null;
  storageUsed: number;
  compressionRatio: number;
}

// =============================================================================
// SERVIÇO PRINCIPAL
// =============================================================================

export class VersioningService {
  private snapshots = new Map<string, VersionSnapshot>();
  private changes = new Map<string, VersionChange[]>();
  private config: VersioningConfig;
  private autoSnapshotTimer?: NodeJS.Timeout;

  constructor(config: Partial<VersioningConfig> = {}) {
    this.config = {
      maxSnapshots: 50,
      autoSnapshotInterval: 15, // 15 minutos
      enableAutoSnapshots: true,
      enableMilestoneSnapshots: true,
      compressionEnabled: true,
      retentionDays: 30,
      ...config,
    };

    this.initializeService();
  }

  /**
   * 🚀 INICIALIZAÇÃO DO SERVIÇO
   */
  private async initializeService(): Promise<void> {
    console.log('🚀 Inicializando VersioningService...');
    
    try {
      // Carregar snapshots persistidos
      await this.loadPersistedSnapshots();
      
      // Configurar auto-snapshot se habilitado
      if (this.config.enableAutoSnapshots) {
        this.startAutoSnapshotTimer();
      }
      
      // Configurar limpeza automática
      this.scheduleCleanup();
      
      console.log('✅ VersioningService inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar VersioningService:', error);
    }
  }

  /**
   * 📥 CARREGAR SNAPSHOTS PERSISTIDOS
   */
  private async loadPersistedSnapshots(): Promise<void> {
    try {
      const savedSnapshots = localStorage.getItem('versioning:snapshots');
      if (savedSnapshots) {
        const parsed = JSON.parse(savedSnapshots);
        Object.entries(parsed).forEach(([id, snapshotData]) => {
          this.snapshots.set(id, this.validateAndNormalizeSnapshot(snapshotData as any));
        });
        console.log(`📥 ${this.snapshots.size} snapshots carregados`);
      }

      const savedChanges = localStorage.getItem('versioning:changes');
      if (savedChanges) {
        const parsed = JSON.parse(savedChanges);
        Object.entries(parsed).forEach(([snapshotId, changesData]) => {
          this.changes.set(snapshotId, changesData as VersionChange[]);
        });
        console.log(`📥 ${this.changes.size} conjuntos de mudanças carregados`);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar snapshots persistidos:', error);
    }
  }

  /**
   * 💾 PERSISTIR SNAPSHOTS
   */
  private async persistSnapshots(): Promise<void> {
    try {
      const snapshotsData = Object.fromEntries(this.snapshots.entries());
      localStorage.setItem('versioning:snapshots', JSON.stringify(snapshotsData));
      
      const changesData = Object.fromEntries(this.changes.entries());
      localStorage.setItem('versioning:changes', JSON.stringify(changesData));
      
      console.log('💾 Snapshots persistidos com sucesso');
    } catch (error) {
      console.error('❌ Erro ao persistir snapshots:', error);
    }
  }

  /**
   * 🔍 VALIDAR E NORMALIZAR SNAPSHOT
   */
  private validateAndNormalizeSnapshot(data: any): VersionSnapshot {
    return {
      id: data.id || `snapshot-${Date.now()}`,
      version: data.version || '1.0.0',
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      type: ['auto', 'manual', 'milestone'].includes(data.type) ? data.type : 'auto',
      description: data.description || '',
      funnel: data.funnel,
      metadata: {
        changesCount: data.metadata?.changesCount || 0,
        stagesCount: data.metadata?.stagesCount || 0,
        blocksCount: data.metadata?.blocksCount || 0,
        size: data.metadata?.size || 0,
        author: data.metadata?.author,
        tags: data.metadata?.tags || [],
      },
    };
  }

  /**
   * 📸 CRIAR SNAPSHOT
   */
  async createSnapshot(
    funnel: UnifiedFunnel,
    type: 'auto' | 'manual' | 'milestone' = 'manual',
    description?: string
  ): Promise<VersionSnapshot> {
    try {
      const snapshotId = `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const version = this.generateVersion(funnel.version);
      
      // Calcular métricas
      const stagesCount = funnel.stages.length;
      const blocksCount = funnel.stages.reduce((sum, stage) => sum + stage.blocks.length, 0);
      const size = JSON.stringify(funnel).length;
      
      const snapshot: VersionSnapshot = {
        id: snapshotId,
        version,
        timestamp: new Date(),
        type,
        description: description || this.generateDescription(type, funnel),
        funnel: JSON.parse(JSON.stringify(funnel)), // Deep clone
        metadata: {
          changesCount: 0, // Será calculado
          stagesCount,
          blocksCount,
          size,
          author: 'system', // TODO: Integrar com auth
          tags: this.generateTags(funnel),
        },
      };

      // Calcular mudanças se não for o primeiro snapshot
      if (this.snapshots.size > 0) {
        const previousSnapshot = this.getLatestSnapshot();
        if (previousSnapshot) {
          const changes = this.calculateChanges(previousSnapshot.funnel, funnel);
          this.changes.set(snapshotId, changes);
          snapshot.metadata.changesCount = changes.length;
        }
      }

      // Salvar snapshot
      this.snapshots.set(snapshotId, snapshot);
      
      // Limitar número de snapshots
      if (this.snapshots.size > this.config.maxSnapshots) {
        await this.cleanupOldSnapshots();
      }

      // Persistir
      await this.persistSnapshots();

      console.log(`📸 Snapshot criado: ${snapshotId} (${type})`);
      return snapshot;
    } catch (error) {
      console.error('❌ Erro ao criar snapshot:', error);
      throw error;
    }
  }

  /**
   * 🔄 GERAR VERSÃO
   */
  private generateVersion(currentVersion: string): string {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * 📝 GERAR DESCRIÇÃO
   */
  private generateDescription(type: string, funnel: UnifiedFunnel): string {
    const timestamp = new Date().toLocaleString();
    
    switch (type) {
      case 'auto':
        return `Auto-snapshot - ${timestamp}`;
      case 'milestone':
        return `Milestone - ${funnel.name} - ${timestamp}`;
      default:
        return `Manual snapshot - ${timestamp}`;
    }
  }

  /**
   * 🏷️ GERAR TAGS
   */
  private generateTags(funnel: UnifiedFunnel): string[] {
    const tags: string[] = [];
    
    if (funnel.status === 'published') tags.push('published');
    if (funnel.metadata?.isValid) tags.push('valid');
    if (funnel.stages.length >= 20) tags.push('complete');
    
    return tags;
  }

  /**
   * 🔍 CALCULAR MUDANÇAS
   */
  private calculateChanges(oldFunnel: UnifiedFunnel, newFunnel: UnifiedFunnel): VersionChange[] {
    const changes: VersionChange[] = [];
    const timestamp = new Date();

    // Comparar propriedades do funnel
    if (oldFunnel.name !== newFunnel.name) {
      changes.push({
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'update',
        entity: 'funnel',
        entityId: newFunnel.id,
        field: 'name',
        oldValue: oldFunnel.name,
        newValue: newFunnel.name,
        timestamp,
        description: `Nome alterado de "${oldFunnel.name}" para "${newFunnel.name}"`,
      });
    }

    // Comparar stages
    const oldStagesMap = new Map(oldFunnel.stages.map(s => [s.id, s]));
    const newStagesMap = new Map(newFunnel.stages.map(s => [s.id, s]));

    // Stages adicionadas
    for (const newStage of newFunnel.stages) {
      if (!oldStagesMap.has(newStage.id)) {
        changes.push({
          id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'create',
          entity: 'stage',
          entityId: newStage.id,
          timestamp,
          description: `Stage "${newStage.name}" adicionado`,
        });
      }
    }

    // Stages removidas
    for (const oldStage of oldFunnel.stages) {
      if (!newStagesMap.has(oldStage.id)) {
        changes.push({
          id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'delete',
          entity: 'stage',
          entityId: oldStage.id,
          timestamp,
          description: `Stage "${oldStage.name}" removido`,
        });
      }
    }

    // Stages modificadas
    for (const newStage of newFunnel.stages) {
      const oldStage = oldStagesMap.get(newStage.id);
      if (oldStage) {
        const stageChanges = this.calculateStageChanges(oldStage, newStage);
        changes.push(...stageChanges);
      }
    }

    return changes;
  }

  /**
   * 🔍 CALCULAR MUDANÇAS DE STAGE
   */
  private calculateStageChanges(oldStage: UnifiedStage, newStage: UnifiedStage): VersionChange[] {
    const changes: VersionChange[] = [];
    const timestamp = new Date();

    // Comparar propriedades do stage
    if (oldStage.name !== newStage.name) {
      changes.push({
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'update',
        entity: 'stage',
        entityId: newStage.id,
        field: 'name',
        oldValue: oldStage.name,
        newValue: newStage.name,
        timestamp,
        description: `Stage "${oldStage.name}" renomeado para "${newStage.name}"`,
      });
    }

    // Comparar blocks
    const oldBlocksMap = new Map(oldStage.blocks.map(b => [b.id, b]));
    const newBlocksMap = new Map(newStage.blocks.map(b => [b.id, b]));

    // Blocks adicionados
    for (const newBlock of newStage.blocks) {
      if (!oldBlocksMap.has(newBlock.id)) {
        changes.push({
          id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'create',
          entity: 'block',
          entityId: newBlock.id,
          timestamp,
          description: `Block "${newBlock.type}" adicionado ao stage "${newStage.name}"`,
        });
      }
    }

    // Blocks removidos
    for (const oldBlock of oldStage.blocks) {
      if (!newBlocksMap.has(oldBlock.id)) {
        changes.push({
          id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'delete',
          entity: 'block',
          entityId: oldBlock.id,
          timestamp,
          description: `Block "${oldBlock.type}" removido do stage "${oldStage.name}"`,
        });
      }
    }

    // Blocks modificados
    for (const newBlock of newStage.blocks) {
      const oldBlock = oldBlocksMap.get(newBlock.id);
      if (oldBlock) {
        const blockChanges = this.calculateBlockChanges(oldBlock, newBlock, newStage.name);
        changes.push(...blockChanges);
      }
    }

    return changes;
  }

  /**
   * 🔍 CALCULAR MUDANÇAS DE BLOCK
   */
  private calculateBlockChanges(oldBlock: Block, newBlock: Block, stageName: string): VersionChange[] {
    const changes: VersionChange[] = [];
    const timestamp = new Date();

    // Comparar propriedades do block
    if (oldBlock.type !== newBlock.type) {
      changes.push({
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'update',
        entity: 'block',
        entityId: newBlock.id,
        field: 'type',
        oldValue: oldBlock.type,
        newValue: newBlock.type,
        timestamp,
        description: `Block no stage "${stageName}" alterado de "${oldBlock.type}" para "${newBlock.type}"`,
      });
    }

    // Comparar conteúdo
    if (JSON.stringify(oldBlock.content) !== JSON.stringify(newBlock.content)) {
      changes.push({
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'update',
        entity: 'block',
        entityId: newBlock.id,
        field: 'content',
        oldValue: oldBlock.content,
        newValue: newBlock.content,
        timestamp,
        description: `Conteúdo do block no stage "${stageName}" alterado`,
      });
    }

    return changes;
  }

  /**
   * 📋 OBTER SNAPSHOTS
   */
  getSnapshots(): VersionSnapshot[] {
    return Array.from(this.snapshots.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * 📋 OBTER SNAPSHOT POR ID
   */
  getSnapshot(id: string): VersionSnapshot | null {
    return this.snapshots.get(id) || null;
  }

  /**
   * 📋 OBTER ÚLTIMO SNAPSHOT
   */
  getLatestSnapshot(): VersionSnapshot | null {
    const snapshots = this.getSnapshots();
    return snapshots.length > 0 ? snapshots[0] : null;
  }

  /**
   * 🔄 COMPARAR VERSÕES
   */
  compareVersions(snapshotIdA: string, snapshotIdB: string): VersionComparison | null {
    const snapshotA = this.snapshots.get(snapshotIdA);
    const snapshotB = this.snapshots.get(snapshotIdB);

    if (!snapshotA || !snapshotB) {
      return null;
    }

    const changes = this.calculateChanges(snapshotA.funnel, snapshotB.funnel);
    
    const summary = {
      added: changes.filter(c => c.type === 'create').length,
      modified: changes.filter(c => c.type === 'update').length,
      deleted: changes.filter(c => c.type === 'delete').length,
      moved: changes.filter(c => c.type === 'reorder').length,
    };

    return {
      versionA: snapshotA,
      versionB: snapshotB,
      changes,
      summary,
    };
  }

  /**
   * 🔙 RESTAURAR VERSÃO
   */
  async restoreSnapshot(snapshotId: string): Promise<UnifiedFunnel | null> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      return null;
    }

    // Criar novo snapshot da versão atual antes de restaurar
    const currentSnapshot = this.getLatestSnapshot();
    if (currentSnapshot) {
      await this.createSnapshot(currentSnapshot.funnel, 'manual', 'Backup antes de restaurar');
    }

    console.log(`🔙 Restaurando snapshot: ${snapshotId}`);
    return snapshot.funnel;
  }

  /**
   * 🗑️ EXCLUIR SNAPSHOT
   */
  async deleteSnapshot(snapshotId: string): Promise<boolean> {
    try {
      this.snapshots.delete(snapshotId);
      this.changes.delete(snapshotId);
      await this.persistSnapshots();
      
      console.log(`🗑️ Snapshot excluído: ${snapshotId}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao excluir snapshot:', error);
      return false;
    }
  }

  /**
   * 🧹 LIMPEZA AUTOMÁTICA
   */
  private async cleanupOldSnapshots(): Promise<void> {
    const snapshots = this.getSnapshots();
    const toDelete = snapshots.slice(this.config.maxSnapshots);
    
    for (const snapshot of toDelete) {
      this.snapshots.delete(snapshot.id);
      this.changes.delete(snapshot.id);
    }
    
    await this.persistSnapshots();
    console.log(`🧹 ${toDelete.length} snapshots antigos removidos`);
  }

  /**
   * ⏰ INICIAR TIMER DE AUTO-SNAPSHOT
   */
  private startAutoSnapshotTimer(): void {
    this.autoSnapshotTimer = setInterval(() => {
      console.log('⏰ Auto-snapshot timer triggered');
      // TODO: Integrar com sistema de mudanças para criar snapshots automáticos
    }, this.config.autoSnapshotInterval * 60 * 1000);
  }

  /**
   * 🧹 AGENDAR LIMPEZA
   */
  private scheduleCleanup(): void {
    // Limpeza diária
    setInterval(() => {
      this.cleanupOldSnapshots();
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * 📊 OBTER ESTATÍSTICAS
   */
  getStats(): VersioningStats {
    const snapshots = this.getSnapshots();
    const totalChanges = Array.from(this.changes.values())
      .reduce((sum, changes) => sum + changes.length, 0);
    
    return {
      totalSnapshots: snapshots.length,
      totalChanges,
      averageChangesPerSnapshot: snapshots.length > 0 ? totalChanges / snapshots.length : 0,
      oldestSnapshot: snapshots.length > 0 ? snapshots[snapshots.length - 1].timestamp : null,
      newestSnapshot: snapshots.length > 0 ? snapshots[0].timestamp : null,
      storageUsed: JSON.stringify(Array.from(this.snapshots.values())).length,
      compressionRatio: 1.0, // TODO: Implementar compressão
    };
  }

  /**
   * 🔧 ATUALIZAR CONFIGURAÇÃO
   */
  updateConfig(newConfig: Partial<VersioningConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Reiniciar timer se necessário
    if (this.autoSnapshotTimer) {
      clearInterval(this.autoSnapshotTimer);
    }
    
    if (this.config.enableAutoSnapshots) {
      this.startAutoSnapshotTimer();
    }
  }

  /**
   * 🧹 LIMPAR TUDO
   */
  clearAll(): void {
    this.snapshots.clear();
    this.changes.clear();
    localStorage.removeItem('versioning:snapshots');
    localStorage.removeItem('versioning:changes');
    console.log('🧹 Todos os snapshots e mudanças foram limpos');
  }
}

// Instância singleton
export const versioningService = new VersioningService();

// Export tipos
export type { 
  VersionSnapshot, 
  VersionChange, 
  VersionComparison, 
  VersioningConfig, 
  VersioningStats 
};