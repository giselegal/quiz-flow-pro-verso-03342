/**
 * 💾 BACKUP SERVICE - Phase 4 Implementation
 * Automated backup and recovery system
 */

export interface BackupData {
  id: string;
  timestamp: string;
  type: 'automatic' | 'manual' | 'pre-deployment';
  size: number;
  status: 'completed' | 'in_progress' | 'failed';
  data: {
    templates: any[];
    userConfigs: any[];
    analytics: any[];
    systemSettings: any;
  };
  metadata: {
    version: string;
    triggerReason: string;
    compressionRatio: number;
    duration: number;
  };
}

export interface RestorePoint {
  id: string;
  backupId: string;
  name: string;
  description: string;
  timestamp: string;
  verified: boolean;
  restoreTime?: number;
}

export interface BackupConfig {
  autoBackupEnabled: boolean;
  backupInterval: number; // milliseconds
  maxBackups: number;
  compressionEnabled: boolean;
  includeAnalytics: boolean;
  includeUserData: boolean;
}

class BackupService {
  private static instance: BackupService;
  private backups: BackupData[] = [];
  private restorePoints: RestorePoint[] = [];
  private config: BackupConfig;
  private backupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.config = {
      autoBackupEnabled: true,
      backupInterval: 3600000, // 1 hour
      maxBackups: 24, // Keep 24 hours worth
      compressionEnabled: true,
      includeAnalytics: true,
      includeUserData: true
    };
    this.loadPersistedData();
    this.startAutoBackup();
  }

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  /**
   * Criar backup manual
   */
  async createBackup(type: 'manual' | 'pre-deployment' | 'automatic' = 'manual', reason: string = 'Manual backup'): Promise<string> {
    const startTime = Date.now();
    const backupId = this.generateBackupId();

    console.log(`💾 Starting ${type} backup: ${backupId}`);

    try {
      // Coletar dados para backup
      const data = await this.collectBackupData();
      
      // Comprimir se habilitado
      const processedData = this.config.compressionEnabled 
        ? this.compressData(data)
        : data;

      const backup: BackupData = {
        id: backupId,
        timestamp: new Date().toISOString(),
        type,
        size: this.calculateDataSize(processedData),
        status: 'completed',
        data: processedData,
        metadata: {
          version: '1.0.0',
          triggerReason: reason,
          compressionRatio: this.config.compressionEnabled ? 0.3 : 1.0,
          duration: Date.now() - startTime
        }
      };

      this.backups.unshift(backup);
      this.cleanupOldBackups();
      this.persistData();

      console.log(`✅ Backup completed: ${backupId} (${backup.size} bytes)`);
      
      // Criar restore point
      await this.createRestorePoint(backupId, `${type} backup`, reason);
      
      return backupId;

    } catch (error) {
      console.error(`❌ Backup failed: ${backupId}`, error);
      
      // Salvar backup falho para debugging
      const failedBackup: BackupData = {
        id: backupId,
        timestamp: new Date().toISOString(),
        type,
        size: 0,
        status: 'failed',
        data: { templates: [], userConfigs: [], analytics: [], systemSettings: {} },
        metadata: {
          version: '1.0.0',
          triggerReason: reason,
          compressionRatio: 0,
          duration: Date.now() - startTime
        }
      };
      
      this.backups.unshift(failedBackup);
      this.persistData();
      
      throw error;
    }
  }

  /**
   * Restaurar de backup
   */
  async restoreFromBackup(backupId: string): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const backup = this.backups.find(b => b.id === backupId);
      if (!backup) {
        throw new Error(`Backup ${backupId} not found`);
      }

      if (backup.status !== 'completed') {
        throw new Error(`Cannot restore from failed backup: ${backupId}`);
      }

      console.log(`🔄 Starting restore from backup: ${backupId}`);

      // Criar backup atual antes de restaurar
      await this.createBackup('manual', `Pre-restore backup before ${backupId}`);

      // Descomprimir dados se necessário
      const restoredData = this.config.compressionEnabled 
        ? this.decompressData(backup.data)
        : backup.data;

      // Aplicar dados restaurados
      await this.applyRestoredData(restoredData);

      const restoreTime = Date.now() - startTime;
      console.log(`✅ Restore completed in ${restoreTime}ms`);

      // Atualizar restore point
      const restorePoint = this.restorePoints.find(rp => rp.backupId === backupId);
      if (restorePoint) {
        restorePoint.restoreTime = restoreTime;
      }

      this.persistData();
      return true;

    } catch (error) {
      console.error(`❌ Restore failed: ${backupId}`, error);
      return false;
    }
  }

  /**
   * Criar restore point
   */
  async createRestorePoint(backupId: string, name: string, description: string): Promise<string> {
    const restorePoint: RestorePoint = {
      id: this.generateRestorePointId(),
      backupId,
      name,
      description,
      timestamp: new Date().toISOString(),
      verified: await this.verifyBackup(backupId)
    };

    this.restorePoints.unshift(restorePoint);
    
    // Manter apenas últimos 50 restore points
    if (this.restorePoints.length > 50) {
      this.restorePoints = this.restorePoints.slice(0, 50);
    }

    this.persistData();
    console.log(`📍 Restore point created: ${restorePoint.id}`);
    
    return restorePoint.id;
  }

  /**
   * Verificar integridade do backup
   */
  async verifyBackup(backupId: string): Promise<boolean> {
    try {
      const backup = this.backups.find(b => b.id === backupId);
      if (!backup) return false;

      // Verificações básicas
      const hasRequiredData = backup.data.templates && 
                             backup.data.userConfigs && 
                             backup.data.systemSettings;

      const sizeValid = backup.size > 0;
      const statusValid = backup.status === 'completed';

      return hasRequiredData && sizeValid && statusValid;

    } catch (error) {
      console.error(`Backup verification failed: ${backupId}`, error);
      return false;
    }
  }

  /**
   * Coletar dados para backup
   */
  private async collectBackupData(): Promise<BackupData['data']> {
    const data: BackupData['data'] = {
      templates: [],
      userConfigs: [],
      analytics: [],
      systemSettings: {}
    };

    // Coletar templates do localStorage
    try {
      const templateKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('template_') || key.startsWith('funnel_')
      );
      
      data.templates = templateKeys.map(key => ({
        key,
        value: localStorage.getItem(key)
      }));
    } catch (error) {
      console.warn('Failed to collect templates:', error);
    }

    // Coletar configurações do usuário
    try {
      const configKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('config_') || key.startsWith('settings_')
      );
      
      data.userConfigs = configKeys.map(key => ({
        key,
        value: localStorage.getItem(key)
      }));
    } catch (error) {
      console.warn('Failed to collect user configs:', error);
    }

    // Coletar analytics se habilitado
    if (this.config.includeAnalytics) {
      try {
        const analyticsKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('analytics_') || key.startsWith('metrics_')
        );
        
        data.analytics = analyticsKeys.map(key => ({
          key,
          value: localStorage.getItem(key)
        }));
      } catch (error) {
        console.warn('Failed to collect analytics:', error);
      }
    }

    // Coletar configurações do sistema
    try {
      data.systemSettings = {
        backupConfig: this.config,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
    } catch (error) {
      console.warn('Failed to collect system settings:', error);
    }

    return data;
  }

  /**
   * Aplicar dados restaurados
   */
  private async applyRestoredData(data: BackupData['data']): Promise<void> {
    // Restaurar templates
    data.templates.forEach(item => {
      if (item.key && item.value) {
        localStorage.setItem(item.key, item.value);
      }
    });

    // Restaurar configurações do usuário
    data.userConfigs.forEach(item => {
      if (item.key && item.value) {
        localStorage.setItem(item.key, item.value);
      }
    });

    // Restaurar analytics se incluído
    if (this.config.includeAnalytics) {
      data.analytics.forEach(item => {
        if (item.key && item.value) {
          localStorage.setItem(item.key, item.value);
        }
      });
    }

    console.log('📦 Data restoration completed');
  }

  /**
   * Comprimir dados (simulado)
   */
  private compressData(data: any): any {
    // Em implementação real, usaria algoritmo de compressão
    // Por enquanto, apenas simula redução de tamanho
    return data;
  }

  /**
   * Descomprimir dados (simulado)
   */
  private decompressData(data: any): any {
    // Em implementação real, descomprimiria os dados
    return data;
  }

  /**
   * Calcular tamanho dos dados
   */
  private calculateDataSize(data: any): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  /**
   * Limpar backups antigos
   */
  private cleanupOldBackups() {
    if (this.backups.length > this.config.maxBackups) {
      const removed = this.backups.splice(this.config.maxBackups);
      console.log(`🧹 Cleaned up ${removed.length} old backups`);
    }
  }

  /**
   * Iniciar backup automático
   */
  private startAutoBackup() {
    if (!this.config.autoBackupEnabled) return;

    this.stopAutoBackup();
    
    this.backupInterval = setInterval(async () => {
      try {
        await this.createBackup('automatic', 'Scheduled automatic backup');
      } catch (error) {
        console.error('Automatic backup failed:', error);
      }
    }, this.config.backupInterval);

    console.log(`⏰ Auto backup started (interval: ${this.config.backupInterval}ms)`);
  }

  /**
   * Parar backup automático
   */
  private stopAutoBackup() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
  }

  /**
   * Obter lista de backups
   */
  getBackups(): BackupData[] {
    return [...this.backups];
  }

  /**
   * Obter restore points
   */
  getRestorePoints(): RestorePoint[] {
    return [...this.restorePoints];
  }

  /**
   * Atualizar configuração
   */
  updateConfig(newConfig: Partial<BackupConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Reiniciar auto backup se necessário
    if (newConfig.autoBackupEnabled !== undefined || newConfig.backupInterval) {
      this.startAutoBackup();
    }
    
    this.persistData();
    console.log('🔧 Backup config updated:', this.config);
  }

  /**
   * Gerar IDs
   */
  private generateBackupId(): string {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private generateRestorePointId(): string {
    return `restore_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  /**
   * Persistir dados
   */
  private persistData() {
    if (typeof window !== 'undefined') {
      try {
        const data = {
          backups: this.backups.slice(0, 10), // Persist only recent backups
          restorePoints: this.restorePoints.slice(0, 20),
          config: this.config
        };
        localStorage.setItem('backup_service', JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to persist backup data:', error);
      }
    }
  }

  /**
   * Carregar dados persistidos
   */
  private loadPersistedData() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('backup_service');
        if (saved) {
          const data = JSON.parse(saved);
          this.backups = data.backups || [];
          this.restorePoints = data.restorePoints || [];
          this.config = { ...this.config, ...data.config };
        }
      } catch (error) {
        console.warn('Failed to load persisted backup data:', error);
      }
    }
  }
}

export const backupService = BackupService.getInstance();