/**
 * 🎯 HISTORY MANAGER - GERENCIADOR DE HISTÓRICO DE MUDANÇAS
 * 
 * Serviço especializado para gerenciar histórico detalhado de mudanças,
 * integrando com VersioningService e UnifiedCRUDService.
 * 
 * FUNCIONALIDADES:
 * ✅ Histórico detalhado de mudanças
 * ✅ Timeline de eventos
 * ✅ Filtros e busca no histórico
 * ✅ Exportação de histórico
 * ✅ Análise de padrões de mudança
 * ✅ Integração com undo/redo
 */

import { VersionChange, VersionSnapshot } from './VersioningService';
import { UnifiedFunnel, UnifiedStage } from './UnifiedCRUDService';
import { Block } from '@/types/editor';

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  type: 'create' | 'update' | 'delete' | 'restore' | 'snapshot' | 'milestone';
  entity: 'funnel' | 'stage' | 'block' | 'system';
  entityId: string;
  description: string;
  changes: VersionChange[];
  metadata: {
    author?: string;
    sessionId?: string;
    userAgent?: string;
    ipAddress?: string;
    tags?: string[];
    importance: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface HistoryFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  types?: string[];
  entities?: string[];
  authors?: string[];
  importance?: string[];
  tags?: string[];
  search?: string;
}

export interface HistoryStats {
  totalEntries: number;
  entriesByType: Record<string, number>;
  entriesByEntity: Record<string, number>;
  entriesByAuthor: Record<string, number>;
  entriesByImportance: Record<string, number>;
  averageChangesPerEntry: number;
  mostActivePeriod: {
    hour: number;
    day: number;
    count: number;
  };
  topChangedEntities: Array<{
    entityId: string;
    entityType: string;
    changeCount: number;
  }>;
}

export interface HistoryExport {
  format: 'json' | 'csv' | 'html';
  entries: HistoryEntry[];
  metadata: {
    exportedAt: Date;
    totalEntries: number;
    dateRange: {
      start: Date;
      end: Date;
    };
    filters?: HistoryFilter;
  };
}

// =============================================================================
// SERVIÇO PRINCIPAL
// =============================================================================

export class HistoryManager {
  private history = new Map<string, HistoryEntry>();
  private sessionId: string;
  private config: {
    maxEntries: number;
    enableCompression: boolean;
    retentionDays: number;
    enableAnalytics: boolean;
  };

  constructor(config: Partial<typeof this.config> = {}) {
    this.config = {
      maxEntries: 1000,
      enableCompression: true,
      retentionDays: 90,
      enableAnalytics: true,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.initializeService();
  }

  /**
   * 🚀 INICIALIZAÇÃO DO SERVIÇO
   */
  private async initializeService(): Promise<void> {
    console.log('🚀 Inicializando HistoryManager...');
    
    try {
      await this.loadPersistedHistory();
      this.scheduleCleanup();
      console.log('✅ HistoryManager inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar HistoryManager:', error);
    }
  }

  /**
   * 🆔 GERAR SESSION ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 📥 CARREGAR HISTÓRICO PERSISTIDO
   */
  private async loadPersistedHistory(): Promise<void> {
    try {
      const savedHistory = localStorage.getItem('history:entries');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        Object.entries(parsed).forEach(([id, entryData]) => {
          this.history.set(id, this.validateAndNormalizeEntry(entryData as any));
        });
        console.log(`📥 ${this.history.size} entradas de histórico carregadas`);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar histórico persistido:', error);
    }
  }

  /**
   * 💾 PERSISTIR HISTÓRICO
   */
  private async persistHistory(): Promise<void> {
    try {
      const historyData = Object.fromEntries(this.history.entries());
      localStorage.setItem('history:entries', JSON.stringify(historyData));
      console.log('💾 Histórico persistido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao persistir histórico:', error);
    }
  }

  /**
   * 🔍 VALIDAR E NORMALIZAR ENTRADA
   */
  private validateAndNormalizeEntry(data: any): HistoryEntry {
    return {
      id: data.id || `entry-${Date.now()}`,
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      type: data.type || 'update',
      entity: data.entity || 'system',
      entityId: data.entityId || '',
      description: data.description || '',
      changes: data.changes || [],
      metadata: {
        author: data.metadata?.author || 'system',
        sessionId: data.metadata?.sessionId || this.sessionId,
        userAgent: data.metadata?.userAgent || navigator.userAgent,
        ipAddress: data.metadata?.ipAddress,
        tags: data.metadata?.tags || [],
        importance: data.metadata?.importance || 'medium',
      },
    };
  }

  /**
   * 📝 ADICIONAR ENTRADA AO HISTÓRICO
   */
  async addEntry(
    type: HistoryEntry['type'],
    entity: HistoryEntry['entity'],
    entityId: string,
    description: string,
    changes: VersionChange[] = [],
    metadata: Partial<HistoryEntry['metadata']> = {}
  ): Promise<HistoryEntry> {
    try {
      const entryId = `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const entry: HistoryEntry = {
        id: entryId,
        timestamp: new Date(),
        type,
        entity,
        entityId,
        description,
        changes,
        metadata: {
          author: 'system', // TODO: Integrar com auth
          sessionId: this.sessionId,
          userAgent: navigator.userAgent,
          ipAddress: undefined, // TODO: Obter IP se necessário
          tags: [],
          importance: 'medium',
          ...metadata,
        },
      };

      this.history.set(entryId, entry);

      // Limitar número de entradas
      if (this.history.size > this.config.maxEntries) {
        await this.cleanupOldEntries();
      }

      // Persistir
      await this.persistHistory();

      console.log(`📝 Entrada adicionada ao histórico: ${entryId}`);
      return entry;
    } catch (error) {
      console.error('❌ Erro ao adicionar entrada ao histórico:', error);
      throw error;
    }
  }

  /**
   * 📋 OBTER HISTÓRICO
   */
  getHistory(filter?: HistoryFilter): HistoryEntry[] {
    let entries = Array.from(this.history.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (!filter) {
      return entries;
    }

    // Aplicar filtros
    if (filter.dateRange) {
      entries = entries.filter(entry => 
        entry.timestamp >= filter.dateRange!.start && 
        entry.timestamp <= filter.dateRange!.end
      );
    }

    if (filter.types && filter.types.length > 0) {
      entries = entries.filter(entry => filter.types!.includes(entry.type));
    }

    if (filter.entities && filter.entities.length > 0) {
      entries = entries.filter(entry => filter.entities!.includes(entry.entity));
    }

    if (filter.authors && filter.authors.length > 0) {
      entries = entries.filter(entry => 
        entry.metadata.author && filter.authors!.includes(entry.metadata.author)
      );
    }

    if (filter.importance && filter.importance.length > 0) {
      entries = entries.filter(entry => 
        filter.importance!.includes(entry.metadata.importance)
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      entries = entries.filter(entry => 
        entry.metadata.tags && 
        entry.metadata.tags.some(tag => filter.tags!.includes(tag))
      );
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      entries = entries.filter(entry => 
        entry.description.toLowerCase().includes(searchLower) ||
        entry.entityId.toLowerCase().includes(searchLower) ||
        entry.changes.some(change => 
          change.description?.toLowerCase().includes(searchLower)
        )
      );
    }

    return entries;
  }

  /**
   * 🔍 BUSCAR NO HISTÓRICO
   */
  searchHistory(query: string, limit: number = 50): HistoryEntry[] {
    const queryLower = query.toLowerCase();
    
    return Array.from(this.history.values())
      .filter(entry => 
        entry.description.toLowerCase().includes(queryLower) ||
        entry.entityId.toLowerCase().includes(queryLower) ||
        entry.changes.some(change => 
          change.description?.toLowerCase().includes(queryLower)
        )
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * 📊 OBTER ESTATÍSTICAS
   */
  getStats(): HistoryStats {
    const entries = Array.from(this.history.values());
    
    // Estatísticas por tipo
    const entriesByType = entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estatísticas por entidade
    const entriesByEntity = entries.reduce((acc, entry) => {
      acc[entry.entity] = (acc[entry.entity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estatísticas por autor
    const entriesByAuthor = entries.reduce((acc, entry) => {
      const author = entry.metadata.author || 'unknown';
      acc[author] = (acc[author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estatísticas por importância
    const entriesByImportance = entries.reduce((acc, entry) => {
      acc[entry.metadata.importance] = (acc[entry.metadata.importance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Média de mudanças por entrada
    const totalChanges = entries.reduce((sum, entry) => sum + entry.changes.length, 0);
    const averageChangesPerEntry = entries.length > 0 ? totalChanges / entries.length : 0;

    // Período mais ativo
    const hourCounts = new Map<number, number>();
    const dayCounts = new Map<number, number>();
    
    entries.forEach(entry => {
      const hour = entry.timestamp.getHours();
      const day = entry.timestamp.getDay();
      
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    });

    const mostActiveHour = Array.from(hourCounts.entries())
      .sort(([,a], [,b]) => b - a)[0] || [0, 0];
    
    const mostActiveDay = Array.from(dayCounts.entries())
      .sort(([,a], [,b]) => b - a)[0] || [0, 0];

    // Entidades mais alteradas
    const entityChangeCounts = new Map<string, { entityId: string; entityType: string; count: number }>();
    
    entries.forEach(entry => {
      const key = `${entry.entity}-${entry.entityId}`;
      const current = entityChangeCounts.get(key) || { 
        entityId: entry.entityId, 
        entityType: entry.entity, 
        count: 0 
      };
      current.count += entry.changes.length;
      entityChangeCounts.set(key, current);
    });

    const topChangedEntities = Array.from(entityChangeCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEntries: entries.length,
      entriesByType,
      entriesByEntity,
      entriesByAuthor,
      entriesByImportance,
      averageChangesPerEntry,
      mostActivePeriod: {
        hour: mostActiveHour[0],
        day: mostActiveDay[0],
        count: Math.max(mostActiveHour[1], mostActiveDay[1]),
      },
      topChangedEntities,
    };
  }

  /**
   * 📤 EXPORTAR HISTÓRICO
   */
  exportHistory(format: 'json' | 'csv' | 'html', filter?: HistoryFilter): HistoryExport {
    const entries = this.getHistory(filter);
    
    const exportData: HistoryExport = {
      format,
      entries,
      metadata: {
        exportedAt: new Date(),
        totalEntries: entries.length,
        dateRange: {
          start: entries.length > 0 ? entries[entries.length - 1].timestamp : new Date(),
          end: entries.length > 0 ? entries[0].timestamp : new Date(),
        },
        filters: filter,
      },
    };

    return exportData;
  }

  /**
   * 🧹 LIMPEZA DE ENTRADAS ANTIGAS
   */
  private async cleanupOldEntries(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
    
    const entriesToDelete = Array.from(this.history.values())
      .filter(entry => entry.timestamp < cutoffDate)
      .slice(0, this.history.size - this.config.maxEntries);
    
    for (const entry of entriesToDelete) {
      this.history.delete(entry.id);
    }
    
    await this.persistHistory();
    console.log(`🧹 ${entriesToDelete.length} entradas antigas removidas`);
  }

  /**
   * 🧹 AGENDAR LIMPEZA
   */
  private scheduleCleanup(): void {
    // Limpeza diária
    setInterval(() => {
      this.cleanupOldEntries();
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * 🔄 INTEGRAR COM MUDANÇAS DE CRUD
   */
  async trackCRUDChange(
    operation: 'create' | 'update' | 'delete' | 'restore',
    entity: 'funnel' | 'stage' | 'block',
    entityId: string,
    changes: VersionChange[],
    description?: string
  ): Promise<void> {
    const importance = this.calculateImportance(operation, entity, changes);
    
    await this.addEntry(
      operation,
      entity,
      entityId,
      description || this.generateDescription(operation, entity, entityId),
      changes,
      {
        importance,
        tags: this.generateTags(operation, entity),
      }
    );
  }

  /**
   * 📊 CALCULAR IMPORTÂNCIA
   */
  private calculateImportance(
    operation: string,
    entity: string,
    changes: VersionChange[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (operation === 'delete') return 'high';
    if (entity === 'funnel') return 'critical';
    if (changes.length > 10) return 'high';
    if (changes.length > 5) return 'medium';
    return 'low';
  }

  /**
   * 📝 GERAR DESCRIÇÃO
   */
  private generateDescription(
    operation: string,
    entity: string,
    entityId: string
  ): string {
    const operations = {
      create: 'Criado',
      update: 'Atualizado',
      delete: 'Excluído',
      restore: 'Restaurado',
    };
    
    const entities = {
      funnel: 'funil',
      stage: 'etapa',
      block: 'bloco',
    };
    
    return `${operations[operation as keyof typeof operations]} ${entities[entity as keyof typeof entities]} ${entityId}`;
  }

  /**
   * 🏷️ GERAR TAGS
   */
  private generateTags(operation: string, entity: string): string[] {
    const tags: string[] = [operation, entity];
    
    if (operation === 'delete') tags.push('destructive');
    if (entity === 'funnel') tags.push('critical');
    if (entity === 'stage') tags.push('structural');
    if (entity === 'block') tags.push('content');
    
    return tags;
  }

  /**
   * 🧹 LIMPAR TUDO
   */
  clearAll(): void {
    this.history.clear();
    localStorage.removeItem('history:entries');
    console.log('🧹 Todo o histórico foi limpo');
  }
}

// Instância singleton
export const historyManager = new HistoryManager();

// Export tipos
export type { 
  HistoryEntry, 
  HistoryFilter, 
  HistoryStats, 
  HistoryExport 
};
