import { StorageService } from '@/services/core/StorageService';
/**
 * 🔄 ROLLBACK SERVICE - Phase 4 Implementation
 * Blue-Green Deployment & Rollback Strategy
 */

export interface DeploymentVersion {
  id: string;
  version: string;
  timestamp: string;
  status: 'active' | 'standby' | 'rollback' | 'failed';
  buildId: string;
  commitHash?: string;
  healthScore: number;
  metadata: {
    deploymentTime: number;
    testsPassed: boolean;
    performanceScore: number;
    errorRate: number;
  };
}

export interface RollbackConfig {
  autoRollbackEnabled: boolean;
  healthThreshold: number;
  errorRateThreshold: number;
  monitoringDuration: number; // milliseconds
  rollbackTimeout: number; // milliseconds
}

export interface RollbackResult {
  success: boolean;
  fromVersion: string;
  toVersion: string;
  rollbackTime: number;
  reason: string;
  logs: string[];
}

class RollbackService {
  private static instance: RollbackService;
  private deployments: DeploymentVersion[] = [];
  private config: RollbackConfig;
  private activeVersion: string | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.config = {
      autoRollbackEnabled: true,
      healthThreshold: 70,
      errorRateThreshold: 5,
      monitoringDuration: 300000, // 5 minutes
      rollbackTimeout: 120000 // 2 minutes
    };
    this.loadPersistedData();
  }

  static getInstance(): RollbackService {
    if (!RollbackService.instance) {
      RollbackService.instance = new RollbackService();
    }
    return RollbackService.instance;
  }

  /**
   * Registrar nova versão de deployment
   */
  registerDeployment(deployment: Omit<DeploymentVersion, 'id' | 'timestamp' | 'status'>): string {
    const newDeployment: DeploymentVersion = {
      ...deployment,
      id: this.generateDeploymentId(),
      timestamp: new Date().toISOString(),
      status: 'standby'
    };

    this.deployments.unshift(newDeployment);
    
    // Manter apenas últimas 10 versões
    if (this.deployments.length > 10) {
      this.deployments = this.deployments.slice(0, 10);
    }

    this.persistData();
    console.log('🚀 New deployment registered:', newDeployment.id);
    
    return newDeployment.id;
  }

  /**
   * Ativar nova versão (Blue-Green Switch)
   */
  async activateDeployment(deploymentId: string): Promise<boolean> {
    const deployment = this.deployments.find(d => d.id === deploymentId);
    if (!deployment) {
      console.error('Deployment not found:', deploymentId);
      return false;
    }

    const previousActive = this.activeVersion;
    
    try {
      // Marcar versão anterior como standby
      if (this.activeVersion) {
        const prevDeployment = this.deployments.find(d => d.id === this.activeVersion);
        if (prevDeployment) {
          prevDeployment.status = 'standby';
        }
      }

      // Ativar nova versão
      deployment.status = 'active';
      this.activeVersion = deploymentId;

      console.log(`🔄 Activated deployment: ${deploymentId}`);
      
      // Iniciar monitoramento automático
      if (this.config.autoRollbackEnabled) {
        this.startHealthMonitoring(deploymentId);
      }

      this.persistData();
      return true;

    } catch (error) {
      console.error('Failed to activate deployment:', error);
      
      // Restaurar estado anterior
      if (previousActive) {
        const prevDeployment = this.deployments.find(d => d.id === previousActive);
        if (prevDeployment) {
          prevDeployment.status = 'active';
          this.activeVersion = previousActive;
        }
      }
      
      deployment.status = 'failed';
      this.persistData();
      return false;
    }
  }

  /**
   * Executar rollback manual
   */
  async rollback(targetVersion?: string, reason: string = 'Manual rollback'): Promise<RollbackResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    
    try {
      logs.push(`Starting rollback at ${new Date().toISOString()}`);
      
      const currentVersion = this.activeVersion;
      if (!currentVersion) {
        throw new Error('No active version to rollback from');
      }

      // Determinar versão de destino
      let targetDeployment: DeploymentVersion;
      
      if (targetVersion) {
        const found = this.deployments.find(d => d.id === targetVersion);
        if (!found) {
          throw new Error(`Target version ${targetVersion} not found`);
        }
        targetDeployment = found;
      } else {
        // Usar última versão estável
        const stableVersions = this.deployments
          .filter(d => d.status === 'standby' && d.healthScore >= this.config.healthThreshold)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        if (stableVersions.length === 0) {
          throw new Error('No stable version available for rollback');
        }
        
        targetDeployment = stableVersions[0];
      }

      logs.push(`Rolling back from ${currentVersion} to ${targetDeployment.id}`);

      // Executar rollback
      const success = await this.performRollback(currentVersion, targetDeployment.id, logs);
      
      if (!success) {
        throw new Error('Rollback execution failed');
      }

      const rollbackTime = Date.now() - startTime;
      logs.push(`Rollback completed in ${rollbackTime}ms`);

      const result: RollbackResult = {
        success: true,
        fromVersion: currentVersion,
        toVersion: targetDeployment.id,
        rollbackTime,
        reason,
        logs
      };

      console.log('✅ Rollback successful:', result);
      return result;

    } catch (error) {
      const rollbackTime = Date.now() - startTime;
      logs.push(`Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      const result: RollbackResult = {
        success: false,
        fromVersion: this.activeVersion || 'unknown',
        toVersion: targetVersion || 'unknown',
        rollbackTime,
        reason,
        logs
      };

      console.error('❌ Rollback failed:', result);
      return result;
    }
  }

  /**
   * Executar rollback real
   */
  private async performRollback(fromVersion: string, toVersion: string, logs: string[]): Promise<boolean> {
    try {
      // Parar monitoramento atual
      this.stopHealthMonitoring();
      
      // Marcar versão atual como rollback
      const currentDeployment = this.deployments.find(d => d.id === fromVersion);
      if (currentDeployment) {
        currentDeployment.status = 'rollback';
        logs.push(`Marked ${fromVersion} as rollback`);
      }

      // Ativar versão de destino
      const targetDeployment = this.deployments.find(d => d.id === toVersion);
      if (!targetDeployment) {
        throw new Error(`Target deployment ${toVersion} not found`);
      }

      targetDeployment.status = 'active';
      this.activeVersion = toVersion;
      logs.push(`Activated ${toVersion}`);

      // Simular reboot de serviços (em ambiente real seria restart de containers)
      await this.simulateServiceRestart(logs);

      // Verificar saúde pós-rollback
      const healthCheck = await this.performHealthCheck();
      logs.push(`Post-rollback health score: ${healthCheck.score}`);

      if (healthCheck.score < this.config.healthThreshold) {
        throw new Error(`Post-rollback health check failed: ${healthCheck.score}`);
      }

      this.persistData();
      return true;

    } catch (error) {
      logs.push(`Rollback execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Simular restart de serviços
   */
  private async simulateServiceRestart(logs: string[]): Promise<void> {
    logs.push('Restarting application services...');
    
    // Simular tempo de restart
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular verificações de serviço
    const services = ['frontend', 'api', 'database', 'cache'];
    
    for (const service of services) {
      await new Promise(resolve => setTimeout(resolve, 500));
      logs.push(`✅ ${service} service restarted`);
    }
  }

  /**
   * Verificar saúde do sistema
   */
  private async performHealthCheck(): Promise<{ score: number; details: any }> {
    // Simular verificações de saúde
    const checks = [
      { name: 'response_time', weight: 30, value: Math.random() * 100 },
      { name: 'error_rate', weight: 40, value: Math.random() * 10 },
      { name: 'memory_usage', weight: 20, value: Math.random() * 100 },
      { name: 'cpu_usage', weight: 10, value: Math.random() * 100 }
    ];

    let totalScore = 0;
    const details: any = {};

    checks.forEach(check => {
      let score = 100;
      
      // Penalizar baseado no valor (invertido para error_rate)
      if (check.name === 'error_rate') {
        score = Math.max(0, 100 - (check.value * 10));
      } else {
        score = Math.max(0, 100 - check.value);
      }
      
      totalScore += (score * check.weight) / 100;
      details[check.name] = { value: check.value, score };
    });

    return { score: Math.round(totalScore), details };
  }

  /**
   * Iniciar monitoramento automático de saúde
   */
  private startHealthMonitoring(deploymentId: string) {
    this.stopHealthMonitoring();
    
    let monitoringStart = Date.now();
    
    this.monitoringInterval = setInterval(async () => {
      const healthCheck = await this.performHealthCheck();
      const deployment = this.deployments.find(d => d.id === deploymentId);
      
      if (deployment) {
        deployment.healthScore = healthCheck.score;
        deployment.metadata.errorRate = healthCheck.details.error_rate?.value || 0;
      }

      console.log(`🏥 Health monitoring - Score: ${healthCheck.score}`);

      // Verificar se precisa de rollback automático
      if (healthCheck.score < this.config.healthThreshold) {
        console.warn('⚠️ Health threshold breached, initiating auto-rollback');
        
        this.rollback(undefined, `Auto-rollback: Health score ${healthCheck.score} below threshold ${this.config.healthThreshold}`);
        return;
      }

      // Parar monitoramento após período configurado
      if (Date.now() - monitoringStart > this.config.monitoringDuration) {
        console.log('✅ Health monitoring completed successfully');
        this.stopHealthMonitoring();
      }

    }, 30000); // Check every 30 seconds
  }

  /**
   * Parar monitoramento de saúde
   */
  private stopHealthMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Obter histórico de deployments
   */
  getDeploymentHistory(): DeploymentVersion[] {
    return [...this.deployments];
  }

  /**
   * Obter versão ativa
   */
  getActiveDeployment(): DeploymentVersion | null {
    if (!this.activeVersion) return null;
    return this.deployments.find(d => d.id === this.activeVersion) || null;
  }

  /**
   * Atualizar configuração
   */
  updateConfig(newConfig: Partial<RollbackConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.persistData();
    console.log('🔧 Rollback config updated:', this.config);
  }

  /**
   * Gerar ID de deployment
   */
  private generateDeploymentId(): string {
    return `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  /**
   * Persistir dados
   */
  private persistData() {
    if (typeof window !== 'undefined') {
      try {
        const data = {
          deployments: this.deployments,
          activeVersion: this.activeVersion,
          config: this.config
        };
        StorageService.safeSetJSON('rollback_service', data);
      } catch (error) {
        console.warn('Failed to persist rollback data:', error);
      }
    }
  }

  /**
   * Carregar dados persistidos
   */
  private loadPersistedData() {
    if (typeof window !== 'undefined') {
      try {
        const saved = StorageService.safeGetString('rollback_service');
        if (saved) {
          const data = JSON.parse(saved);
          this.deployments = data.deployments || [];
          this.activeVersion = data.activeVersion || null;
          this.config = { ...this.config, ...data.config };
        }
      } catch (error) {
        console.warn('Failed to load persisted rollback data:', error);
      }
    }
  }
}

export const rollbackService = RollbackService.getInstance();