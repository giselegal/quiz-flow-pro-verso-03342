/**
 * 🚀 QUIZ AUTO BOOTSTRAP - INICIALIZAÇÃO AUTOMÁTICA DO SISTEMA
 * 
 * Sistema que:
 * - Verifica/cria funil automaticamente via TemplateFunnelService
 * - Carrega configurações via HybridTemplateService
 * - Inicializa contextos e storage
 * - Aplica regras globais por etapa
 * - Coordena inicialização de todos os sistemas
 */

import { quizOrchestrator } from './QuizOrchestrator';
import { quizDataPipeline } from './QuizDataPipeline';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import HybridTemplateService from '@/services/HybridTemplateService';
import { styleCalculationEngine } from '@/engines/StyleCalculationEngine';

export interface BootstrapConfig {
  funnelId?: string;
  templateId?: string;
  userId?: string;
  autoStart?: boolean;
  enableAnalytics?: boolean;
  enableSupabase?: boolean;
  debugMode?: boolean;
}

export interface BootstrapStatus {
  phase: string;
  progress: number;
  message: string;
  isComplete: boolean;
  hasErrors: boolean;
  errors: string[];
  startedAt: string;
  completedAt?: string;
}

export interface SystemHealth {
  orchestrator: 'healthy' | 'warning' | 'error';
  pipeline: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
  templates: 'healthy' | 'warning' | 'error';
  calculations: 'healthy' | 'warning' | 'error';
  overall: 'healthy' | 'warning' | 'error';
}

class QuizAutoBootstrap {
  private config: BootstrapConfig = {};
  private status: BootstrapStatus;
  private listeners: Set<(status: BootstrapStatus) => void> = new Set();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.status = this.getInitialStatus();
  }

  /**
   * 🚀 BOOTSTRAP PRINCIPAL
   */
  async bootstrap(config: BootstrapConfig = {}): Promise<boolean> {
    this.config = { 
      autoStart: true,
      enableAnalytics: true,
      enableSupabase: false,
      debugMode: false,
      ...config 
    };

    console.log('🚀 QuizAutoBootstrap: Iniciando bootstrap do sistema...', this.config);

    try {
      this.updateStatus({
        phase: 'initializing',
        progress: 0,
        message: 'Inicializando sistema...',
        hasErrors: false,
        errors: [],
      });

      // FASE 1: Verificação de pré-requisitos
      await this.checkPrerequisites();
      
      // FASE 2: Inicialização do storage
      await this.initializeStorage();
      
      // FASE 3: Carregamento de templates
      await this.loadTemplates();
      
      // FASE 4: Inicialização do pipeline de dados
      await this.initializePipeline();
      
      // FASE 5: Inicialização do orchestrator
      await this.initializeOrchestrator();
      
      // FASE 6: Configuração de sistemas auxiliares
      await this.initializeAuxiliarySystems();
      
      // FASE 7: Verificação de saúde final
      await this.performHealthCheck();
      
      // FASE 8: Auto-start se habilitado
      if (this.config.autoStart) {
        await this.autoStart();
      }

      this.updateStatus({
        phase: 'complete',
        progress: 100,
        message: 'Sistema inicializado com sucesso!',
        isComplete: true,
        completedAt: new Date().toISOString(),
      });

      // Iniciar monitoramento contínuo
      this.startHealthMonitoring();

      console.log('✅ QuizAutoBootstrap: Bootstrap concluído com sucesso');
      return true;

    } catch (error) {
      console.error('❌ QuizAutoBootstrap: Erro no bootstrap:', error);
      
      this.updateStatus({
        phase: 'error',
        progress: 0,
        message: 'Erro na inicialização do sistema',
        hasErrors: true,
        errors: [error instanceof Error ? error.message : String(error)],
      });

      return false;
    }
  }

  /**
   * 🔄 REINICIALIZAR SISTEMA
   */
  async restart(): Promise<boolean> {
    console.log('🔄 QuizAutoBootstrap: Reiniciando sistema...');
    
    // Parar monitoramento
    this.stopHealthMonitoring();
    
    // Limpar caches
    HybridTemplateService.clearCache();
    styleCalculationEngine.clearCache();
    
    // Reinicializar
    this.status = this.getInitialStatus();
    
    return await this.bootstrap(this.config);
  }

  /**
   * 📊 VERIFICAR SAÚDE DO SISTEMA
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    const health: SystemHealth = {
      orchestrator: 'healthy',
      pipeline: 'healthy',
      storage: 'healthy',
      templates: 'healthy',
      calculations: 'healthy',
      overall: 'healthy',
    };

    try {
      // Verificar Orchestrator
      const orchestratorState = quizOrchestrator.getState();
      if (orchestratorState.error) {
        health.orchestrator = 'error';
      } else if (!orchestratorState.isInitialized) {
        health.orchestrator = 'warning';
      }

      // Verificar Pipeline
      const pipelineStatus = quizDataPipeline.getPipelineStatus();
      if (pipelineStatus.hasErrors) {
        health.pipeline = 'error';
      } else if (!pipelineStatus.isComplete) {
        health.pipeline = 'warning';
      }

      // Verificar Storage
      try {
        const storageStats = unifiedQuizStorage.getDataStats();
        if (storageStats.dataSize === 0) {
          health.storage = 'warning';
        }
      } catch (error) {
        health.storage = 'error';
      }

      // Verificar Templates
      try {
        const template = await HybridTemplateService.getTemplate('quiz21StepsComplete');
        if (!template) {
          health.templates = 'error';
        }
      } catch (error) {
        health.templates = 'error';
      }

      // Verificar Cálculos
      try {
        const preview = styleCalculationEngine.getResultPreview();
        if (preview.progress < 10) {
          health.calculations = 'warning';
        }
      } catch (error) {
        health.calculations = 'error';
      }

      // Saúde geral
      const systems = Object.values(health).slice(0, -1); // Excluir 'overall'
      if (systems.some(status => status === 'error')) {
        health.overall = 'error';
      } else if (systems.some(status => status === 'warning')) {
        health.overall = 'warning';
      }

    } catch (error) {
      console.error('❌ QuizAutoBootstrap: Erro na verificação de saúde:', error);
      health.overall = 'error';
    }

    return health;
  }

  /**
   * 📈 OBTER STATUS ATUAL
   */
  getStatus(): BootstrapStatus {
    return { ...this.status };
  }

  /**
   * 🔔 SUBSCREVER MUDANÇAS DE STATUS
   */
  subscribe(listener: (status: BootstrapStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Métodos privados

  private getInitialStatus(): BootstrapStatus {
    return {
      phase: 'idle',
      progress: 0,
      message: 'Sistema não inicializado',
      isComplete: false,
      hasErrors: false,
      errors: [],
      startedAt: new Date().toISOString(),
    };
  }

  private async checkPrerequisites(): Promise<void> {
    this.updateStatus({
      phase: 'prerequisites',
      progress: 10,
      message: 'Verificando pré-requisitos...',
    });

    // Verificar se está em ambiente browser
    if (typeof window === 'undefined') {
      throw new Error('Sistema requer ambiente browser');
    }

    // Verificar localStorage
    if (!window.localStorage) {
      throw new Error('localStorage não disponível');
    }

    // Verificar APIs necessárias
    if (!window.fetch) {
      throw new Error('Fetch API não disponível');
    }

    console.log('✅ Pré-requisitos verificados');
  }

  private async initializeStorage(): Promise<void> {
    this.updateStatus({
      phase: 'storage',
      progress: 20,
      message: 'Inicializando sistema de armazenamento...',
    });

    try {
      // Carregar dados existentes ou inicializar
      const quizData = unifiedQuizStorage.loadData();
      console.log('💾 Storage inicializado:', {
        selections: Object.keys(quizData.selections).length,
        formData: Object.keys(quizData.formData).length,
        currentStep: quizData.metadata.currentStep,
      });
    } catch (error) {
      throw new Error(`Falha na inicialização do storage: ${error}`);
    }
  }

  private async loadTemplates(): Promise<void> {
    this.updateStatus({
      phase: 'templates',
      progress: 40,
      message: 'Carregando templates...',
    });

    try {
      const templateId = this.config.templateId || 'quiz21StepsComplete';
      const template = await HybridTemplateService.getTemplate(templateId);
      
      if (!template) {
        throw new Error(`Template ${templateId} não encontrado`);
      }

      console.log('📄 Templates carregados:', {
        templateId,
        stepsCount: Object.keys(template).length,
      });
    } catch (error) {
      throw new Error(`Falha no carregamento de templates: ${error}`);
    }
  }

  private async initializePipeline(): Promise<void> {
    this.updateStatus({
      phase: 'pipeline',
      progress: 60,
      message: 'Inicializando pipeline de dados...',
    });

    try {
      await quizDataPipeline.initialize(
        this.config.funnelId,
        this.config.userId
      );
      
      console.log('🔄 Pipeline inicializado');
    } catch (error) {
      throw new Error(`Falha na inicialização do pipeline: ${error}`);
    }
  }

  private async initializeOrchestrator(): Promise<void> {
    this.updateStatus({
      phase: 'orchestrator',
      progress: 80,
      message: 'Inicializando orchestrator...',
    });

    try {
      await quizOrchestrator.initialize(this.config.funnelId);
      
      const state = quizOrchestrator.getState();
      if (!state.isInitialized) {
        throw new Error('Orchestrator não foi inicializado corretamente');
      }
      
      console.log('🎯 Orchestrator inicializado:', {
        currentStep: state.currentStep,
        isValid: state.isStepValid,
      });
    } catch (error) {
      throw new Error(`Falha na inicialização do orchestrator: ${error}`);
    }
  }

  private async initializeAuxiliarySystems(): Promise<void> {
    this.updateStatus({
      phase: 'auxiliary',
      progress: 90,
      message: 'Configurando sistemas auxiliares...',
    });

    // Inicializar engine de cálculo se necessário
    try {
      styleCalculationEngine.clearCache(); // Limpar cache para garantir dados frescos
      console.log('🎨 Engine de cálculo configurado');
    } catch (error) {
      console.warn('⚠️ Falha na configuração do engine de cálculo:', error);
    }

    // Configurar analytics se habilitado
    if (this.config.enableAnalytics) {
      try {
        this.setupAnalytics();
        console.log('📊 Analytics configurado');
      } catch (error) {
        console.warn('⚠️ Falha na configuração de analytics:', error);
      }
    }
  }

  private async performHealthCheck(): Promise<void> {
    this.updateStatus({
      phase: 'health-check',
      progress: 95,
      message: 'Verificando saúde do sistema...',
    });

    const health = await this.checkSystemHealth();
    
    if (health.overall === 'error') {
      throw new Error('Sistema apresenta erros críticos');
    }

    if (health.overall === 'warning') {
      console.warn('⚠️ Sistema apresenta avisos:', health);
    }

    console.log('✅ Verificação de saúde concluída:', health);
  }

  private async autoStart(): Promise<void> {
    console.log('🚀 Auto-start habilitado, iniciando quiz...');
    
    // Aqui poderia disparar eventos para componentes React
    // ou configurar estado inicial específico
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('quiz-auto-started', {
        detail: {
          config: this.config,
          timestamp: new Date().toISOString(),
        }
      }));
    }
  }

  private setupAnalytics(): void {
    // Configurar tracking de eventos do sistema
    if (typeof window !== 'undefined') {
      const trackEvent = (eventName: string, properties: any) => {
        if (this.config.debugMode) {
          console.log('📊 Analytics Event:', eventName, properties);
        }
        
        // Aqui integraria com Google Analytics, Mixpanel, etc.
        window.dispatchEvent(new CustomEvent('quiz-analytics', {
          detail: { eventName, properties }
        }));
      };

      // Eventos globais do sistema
      window.addEventListener('quiz-step-changed', (e: any) => {
        trackEvent('step_changed', {
          from: e.detail.from,
          to: e.detail.to,
          timestamp: Date.now(),
        });
      });

      window.addEventListener('quiz-completed', (e: any) => {
        trackEvent('quiz_completed', {
          result: e.detail.result,
          timestamp: Date.now(),
        });
      });
    }
  }

  private startHealthMonitoring(): void {
    // Verificar saúde do sistema periodicamente
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.checkSystemHealth();
        
        if (health.overall === 'error') {
          console.error('🚨 Sistema apresenta erros críticos:', health);
          
          // Tentar recuperação automática
          if (this.config.autoStart) {
            console.log('🔄 Tentando recuperação automática...');
            this.restart();
          }
        }
      } catch (error) {
        console.error('❌ Erro no monitoramento de saúde:', error);
      }
    }, 30000); // A cada 30 segundos
  }

  private stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  private updateStatus(updates: Partial<BootstrapStatus>): void {
    this.status = { ...this.status, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.status));
  }
}

// Singleton instance
export const quizAutoBootstrap = new QuizAutoBootstrap();
export default QuizAutoBootstrap;