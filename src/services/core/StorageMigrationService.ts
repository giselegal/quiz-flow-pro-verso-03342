/**
 * 🔄 STORAGE MIGRATION SERVICE - FASE 1
 * 
 * Serviço para migrar dados do localStorage legado (sem contexto)
 * para o novo sistema contextualizado
 * 
 * ✅ Migração segura com backup
 * ✅ Rollback em caso de erro
 * ✅ Relatório detalhado de migração
 * ✅ Detecção automática de dados legados
 */

import { FunnelContext } from '@/core/contexts/FunnelContext';
import { ContextualStorageService } from './ContextualStorageService';
import { StorageService } from './StorageService';

export interface MigrationReport {
  started: string;
  completed: string;
  duration: number;
  totalKeys: number;
  migratedKeys: number;
  skippedKeys: number;
  errors: Array<{ key: string; error: string }>;
  backupCreated: boolean;
  success: boolean;
}

export interface MigrationRule {
  legacyPattern: RegExp;
  targetContext: FunnelContext;
  keyTransform?: (legacyKey: string) => string;
}

export class StorageMigrationService {
  private static readonly BACKUP_KEY = '__storage_migration_backup__';
  private static readonly MIGRATION_VERSION_KEY = '__storage_migration_version__';
  private static readonly CURRENT_VERSION = '2.0.0';

  /**
   * Regras de migração padrão
   */
  private static readonly DEFAULT_RULES: MigrationRule[] = [
    // Funis do editor
    {
      legacyPattern: /^funnel-[a-zA-Z0-9-_]+$/,
      targetContext: FunnelContext.EDITOR,
      keyTransform: (key) => key // mantém "funnel-xxx"
    },
    // Lista de funis
    {
      legacyPattern: /^funnels-list$/,
      targetContext: FunnelContext.MY_FUNNELS
    },
    // Templates
    {
      legacyPattern: /^template-/,
      targetContext: FunnelContext.TEMPLATES
    },
    // Dados unificados de funil
    {
      legacyPattern: /^unified_funnel:/,
      targetContext: FunnelContext.EDITOR,
      keyTransform: (key) => key.replace('unified_funnel:', 'funnel-')
    },
    // Quiz answers
    {
      legacyPattern: /^(userSelections|quizAnswers|unifiedQuizData)$/,
      targetContext: FunnelContext.EDITOR
    },
    // Progress tracking
    {
      legacyPattern: /^funnel_progress_/,
      targetContext: FunnelContext.EDITOR
    },
    // AI generated
    {
      legacyPattern: /^ai-generated-funnel-/,
      targetContext: FunnelContext.EDITOR
    }
  ];

  /**
   * Verifica se migração já foi executada
   */
  static isMigrated(): boolean {
    const version = StorageService.safeGetString(this.MIGRATION_VERSION_KEY);
    return version === this.CURRENT_VERSION;
  }

  /**
   * Detecta chaves legadas que precisam ser migradas
   */
  static detectLegacyKeys(): string[] {
    if (typeof window === 'undefined') return [];

    const legacyKeys: string[] = [];
    const contextPrefixes = Object.values(FunnelContext).map(ctx => `${ctx}-`);

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Ignorar chaves do sistema de migração
        if (key.startsWith('__storage_migration')) continue;

        // Verificar se já é uma chave contextualizada
        const hasContextPrefix = contextPrefixes.some(prefix => key.startsWith(prefix));
        
        if (!hasContextPrefix) {
          // Verificar se corresponde a alguma regra
          const matchesRule = this.DEFAULT_RULES.some(rule => rule.legacyPattern.test(key));
          if (matchesRule) {
            legacyKeys.push(key);
          }
        }
      }
    } catch (e) {
      console.error('[Migration] Erro ao detectar chaves legadas:', e);
    }

    return legacyKeys;
  }

  /**
   * Cria backup de todos os dados antes da migração
   */
  static createBackup(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const backup: Record<string, string> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('__storage_migration')) {
          const value = localStorage.getItem(key);
          if (value) {
            backup[key] = value;
          }
        }
      }

      StorageService.safeSetJSON(this.BACKUP_KEY, {
        timestamp: new Date().toISOString(),
        data: backup
      });

      console.log(`💾 [Migration] Backup criado com ${Object.keys(backup).length} chaves`);
      return true;
    } catch (e) {
      console.error('[Migration] Erro ao criar backup:', e);
      return false;
    }
  }

  /**
   * Restaura backup em caso de erro
   */
  static restoreBackup(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const backupData = StorageService.safeGetJSON<{
        timestamp: string;
        data: Record<string, string>;
      }>(this.BACKUP_KEY);

      if (!backupData) {
        console.warn('[Migration] Nenhum backup encontrado');
        return false;
      }

      // Limpar localStorage atual
      localStorage.clear();

      // Restaurar dados do backup
      Object.entries(backupData.data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      console.log(`♻️ [Migration] Backup restaurado (${Object.keys(backupData.data).length} chaves)`);
      return true;
    } catch (e) {
      console.error('[Migration] Erro ao restaurar backup:', e);
      return false;
    }
  }

  /**
   * Executa migração completa
   */
  static async migrate(customRules?: MigrationRule[]): Promise<MigrationReport> {
    const startTime = Date.now();
    const report: MigrationReport = {
      started: new Date().toISOString(),
      completed: '',
      duration: 0,
      totalKeys: 0,
      migratedKeys: 0,
      skippedKeys: 0,
      errors: [],
      backupCreated: false,
      success: false
    };

    try {
      console.log('🔄 [Migration] Iniciando migração de dados...');

      // Verificar se já foi migrado
      if (this.isMigrated()) {
        console.log('✅ [Migration] Dados já migrados');
        report.success = true;
        report.completed = new Date().toISOString();
        report.duration = Date.now() - startTime;
        return report;
      }

      // Criar backup
      report.backupCreated = this.createBackup();
      if (!report.backupCreated) {
        throw new Error('Falha ao criar backup');
      }

      // Detectar chaves legadas
      const legacyKeys = this.detectLegacyKeys();
      report.totalKeys = legacyKeys.length;

      console.log(`📋 [Migration] Encontradas ${legacyKeys.length} chaves legadas`);

      // Usar regras customizadas ou padrão
      const rules = customRules || this.DEFAULT_RULES;

      // Migrar cada chave
      for (const legacyKey of legacyKeys) {
        try {
          // Encontrar regra correspondente
          const rule = rules.find(r => r.legacyPattern.test(legacyKey));
          
          if (!rule) {
            report.skippedKeys++;
            continue;
          }

          // Obter dados legados
          const legacyData = StorageService.safeGetJSON(legacyKey);
          if (!legacyData) {
            report.skippedKeys++;
            continue;
          }

          // Transformar chave se necessário
          const newKey = rule.keyTransform ? rule.keyTransform(legacyKey) : legacyKey;

          // Criar storage contextual e salvar
          const contextualStorage = new ContextualStorageService(rule.targetContext);
          const success = contextualStorage.setJSON(newKey, legacyData);

          if (success) {
            // Remover chave legada
            StorageService.safeRemove(legacyKey);
            report.migratedKeys++;
            console.log(`  ✓ ${legacyKey} → ${rule.targetContext}-${newKey}`);
          } else {
            report.errors.push({
              key: legacyKey,
              error: 'Falha ao salvar dados migrados'
            });
          }
        } catch (error) {
          report.errors.push({
            key: legacyKey,
            error: String(error)
          });
          console.error(`  ✗ Erro ao migrar ${legacyKey}:`, error);
        }
      }

      // Marcar como migrado
      StorageService.safeSetString(this.MIGRATION_VERSION_KEY, this.CURRENT_VERSION);

      report.success = report.errors.length === 0;
      report.completed = new Date().toISOString();
      report.duration = Date.now() - startTime;

      console.log('✅ [Migration] Migração concluída:', {
        migradas: report.migratedKeys,
        puladas: report.skippedKeys,
        erros: report.errors.length,
        duração: `${report.duration}ms`
      });

      return report;
    } catch (error) {
      console.error('❌ [Migration] Erro crítico na migração:', error);
      
      // Tentar restaurar backup
      console.log('♻️ [Migration] Tentando restaurar backup...');
      this.restoreBackup();

      report.success = false;
      report.completed = new Date().toISOString();
      report.duration = Date.now() - startTime;
      report.errors.push({
        key: 'CRITICAL',
        error: String(error)
      });

      return report;
    }
  }

  /**
   * Remove backup após migração bem-sucedida
   */
  static cleanupBackup(): boolean {
    return StorageService.safeRemove(this.BACKUP_KEY);
  }

  /**
   * Obtém relatório de migração anterior (se existir)
   */
  static getLastMigrationReport(): MigrationReport | null {
    return StorageService.safeGetJSON<MigrationReport>('__storage_migration_report__');
  }

  /**
   * Salva relatório de migração
   */
  static saveMigrationReport(report: MigrationReport): boolean {
    return StorageService.safeSetJSON('__storage_migration_report__', report);
  }
}
