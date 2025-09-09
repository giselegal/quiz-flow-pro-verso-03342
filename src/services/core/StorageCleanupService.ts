/**
 * 🎯 SERVIÇO DE LIMPEZA DE ARMAZENAMENTO - FASE 2
 * 
 * Remove chaves legadas redundantes e organiza o armazenamento
 * para evitar conflitos entre sistemas antigos e novos.
 */

import { StorageService } from './StorageService';
import { unifiedQuizStorage } from './UnifiedQuizStorage';

interface CleanupStats {
  removedKeys: string[];
  preservedKeys: string[];
  migratedData: boolean;
  errors: string[];
  sizeBefore: number;
  sizeAfter: number;
}

class StorageCleanupService {
  // Chaves legadas que podem ser removidas após migração
  private readonly LEGACY_KEYS = [
    'userSelections', // Migrado para unifiedQuizData.selections
    'quizAnswers',    // Migrado para unifiedQuizData.formData
    'quizResponses',  // Formato antigo, substituído por unified
    'step-data',      // Dados antigos de steps
    'quiz-state',     // Estado antigo do quiz
    'user-selections-backup', // Backups antigos
    'temp-quiz-data', // Dados temporários
    'quiz-debug-info', // Debug info antigo
  ];

  // Chaves críticas que nunca devem ser removidas
  private readonly CRITICAL_KEYS = [
    'unifiedQuizData', // Sistema atual
    'quizResult',      // Resultado atual
    'userName',        // Nome do usuário
    'quizUserName',    // Nome alternativo
    'sessionId',       // ID da sessão
    'quizResultCache', // Cache de resultados
  ];

  /**
   * Executa limpeza completa do armazenamento
   */
  async cleanupStorage(options: {
    forceMigration?: boolean;
    removeAll?: boolean;
    dryRun?: boolean;
  } = {}): Promise<CleanupStats> {
    const { forceMigration = false, removeAll = false, dryRun = false } = options;
    
    console.log('🧹 Iniciando limpeza do armazenamento...', { dryRun });

    const stats: CleanupStats = {
      removedKeys: [],
      preservedKeys: [],
      migratedData: false,
      errors: [],
      sizeBefore: 0,
      sizeAfter: 0
    };

    try {
      // 1. Calcular tamanho inicial
      stats.sizeBefore = this.calculateStorageSize();

      // 2. Migrar dados legados se necessário
      if (forceMigration || this.needsMigration()) {
        console.log('📦 Migrando dados legados...');
        const migrationSuccess = await this.migrateLegacyData(dryRun);
        stats.migratedData = migrationSuccess;
      }

      // 3. Remover chaves legadas
      if (removeAll) {
        await this.removeAllLegacyKeys(stats, dryRun);
      } else {
        await this.removeSafeLegacyKeys(stats, dryRun);
      }

      // 4. Limpar dados duplicados
      await this.removeDuplicateData(stats, dryRun);

      // 5. Calcular tamanho final
      stats.sizeAfter = this.calculateStorageSize();

      const savedSpace = stats.sizeBefore - stats.sizeAfter;
      console.log('✅ Limpeza concluída:', {
        removedKeys: stats.removedKeys.length,
        preservedKeys: stats.preservedKeys.length,
        savedSpace: `${(savedSpace / 1024).toFixed(2)}KB`,
        dryRun
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      stats.errors.push(errorMsg);
      console.error('❌ Erro durante limpeza:', error);
    }

    return stats;
  }

  /**
   * Remove apenas chaves seguras (que já foram migradas)
   */
  private async removeSafeLegacyKeys(stats: CleanupStats, dryRun: boolean): Promise<void> {
    for (const key of this.LEGACY_KEYS) {
      try {
        const data = StorageService.safeGetJSON(key);
        if (data !== null) {
          // Verificar se dados já foram migrados
          const isMigrated = this.isDataMigrated(key, data);
          
          if (isMigrated) {
            if (!dryRun) {
              StorageService.safeRemove(key);
            }
            stats.removedKeys.push(key);
            console.log(`🗑️ Removido: ${key} (migrado)`);
          } else {
            stats.preservedKeys.push(key);
            console.log(`📌 Preservado: ${key} (não migrado)`);
          }
        }
      } catch (error) {
        const errorMsg = `Erro ao processar ${key}: ${error}`;
        stats.errors.push(errorMsg);
        console.warn(errorMsg);
      }
    }
  }

  /**
   * Remove todas as chaves legadas (modo força)
   */
  private async removeAllLegacyKeys(stats: CleanupStats, dryRun: boolean): Promise<void> {
    console.warn('⚠️ Modo força: removendo todas as chaves legadas');
    
    for (const key of this.LEGACY_KEYS) {
      try {
        const data = StorageService.safeGetJSON(key);
        if (data !== null) {
          if (!dryRun) {
            StorageService.safeRemove(key);
          }
          stats.removedKeys.push(key);
          console.log(`🗑️ Removido (força): ${key}`);
        }
      } catch (error) {
        const errorMsg = `Erro ao remover ${key}: ${error}`;
        stats.errors.push(errorMsg);
        console.warn(errorMsg);
      }
    }
  }

  /**
   * Remove dados duplicados entre sistemas
   */
  private async removeDuplicateData(stats: CleanupStats, dryRun: boolean): Promise<void> {
    try {
      const unifiedData = unifiedQuizStorage.loadData();
      const legacyQuizResult = StorageService.safeGetJSON('quizResult');
      
      // Se há resultado no unified e legacy, manter apenas no unified
      if (unifiedData.result && legacyQuizResult) {
        const isSameResult = this.compareResults(unifiedData.result, legacyQuizResult);
        
        if (isSameResult) {
          if (!dryRun) {
            StorageService.safeRemove('quizResult');
          }
          stats.removedKeys.push('quizResult (duplicado)');
          console.log('🗑️ Removido resultado duplicado em quizResult');
        }
      }
    } catch (error) {
      stats.errors.push(`Erro ao remover duplicados: ${error}`);
    }
  }

  /**
   * Migra dados legados para o sistema unificado
   */
  private async migrateLegacyData(dryRun: boolean): Promise<boolean> {
    try {
      const userSelections = StorageService.safeGetJSON<Record<string, string[]>>('userSelections');
      const quizAnswers = StorageService.safeGetJSON<Record<string, any>>('quizAnswers');
      
      if (!userSelections && !quizAnswers) {
        console.log('ℹ️ Nenhum dado legado encontrado para migração');
        return false;
      }

      if (!dryRun) {
        // Forçar migração via unifiedQuizStorage
        const currentData = unifiedQuizStorage.loadData();
        
        if (userSelections && Object.keys(currentData.selections).length === 0) {
          Object.assign(currentData.selections, userSelections);
        }
        
        if (quizAnswers && Object.keys(currentData.formData).length === 0) {
          Object.assign(currentData.formData, quizAnswers);
        }
        
        unifiedQuizStorage.saveData(currentData);
        console.log('✅ Dados migrados para sistema unificado');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      return false;
    }
  }

  /**
   * Verifica se dados de uma chave já foram migrados
   */
  private isDataMigrated(key: string, _data: any): boolean {
    try {
      const unifiedData = unifiedQuizStorage.loadData();
      
      switch (key) {
        case 'userSelections':
          return Object.keys(unifiedData.selections).length > 0;
        case 'quizAnswers':
          return Object.keys(unifiedData.formData).length > 0;
        default:
          return true; // Por padrão, considerar migrado
      }
    } catch {
      return false;
    }
  }

  /**
   * Verifica se migração é necessária
   */
  private needsMigration(): boolean {
    try {
      const unifiedData = unifiedQuizStorage.loadData();
      const hasLegacyData = this.LEGACY_KEYS.some(key => 
        StorageService.safeGetJSON(key) !== null
      );
      
      const hasUnifiedData = 
        Object.keys(unifiedData.selections).length > 0 ||
        Object.keys(unifiedData.formData).length > 0;
      
      return hasLegacyData && !hasUnifiedData;
    } catch {
      return false;
    }
  }

  /**
   * Compara dois resultados para verificar se são iguais
   */
  private compareResults(result1: any, result2: any): boolean {
    try {
      const style1 = result1?.primaryStyle?.style || '';
      const style2 = result2?.primaryStyle?.style || '';
      
      return style1 === style2 && style1 !== '';
    } catch {
      return false;
    }
  }

  /**
   * Calcula tamanho aproximado do localStorage
   */
  private calculateStorageSize(): number {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += key.length + item.length;
          }
        }
      }
      return totalSize;
    } catch {
      return 0;
    }
  }

  /**
   * Obtém estatísticas do armazenamento atual
   */
  getStorageStats() {
    const stats = {
      totalKeys: 0,
      legacyKeys: 0,
      criticalKeys: 0,
      totalSize: 0,
      keyDetails: [] as Array<{ key: string; size: number; type: 'legacy' | 'critical' | 'other' }>
    };

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const item = localStorage.getItem(key);
          const size = item ? item.length : 0;
          
          stats.totalKeys++;
          stats.totalSize += size;
          
          let type: 'legacy' | 'critical' | 'other' = 'other';
          if (this.LEGACY_KEYS.includes(key)) {
            stats.legacyKeys++;
            type = 'legacy';
          } else if (this.CRITICAL_KEYS.includes(key)) {
            stats.criticalKeys++;
            type = 'critical';
          }
          
          stats.keyDetails.push({ key, size, type });
        }
      }
      
      // Ordenar por tamanho (maior primeiro)
      stats.keyDetails.sort((a, b) => b.size - a.size);
      
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    }

    return stats;
  }
}

export const storageCleanupService = new StorageCleanupService();
export default storageCleanupService;