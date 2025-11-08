/**
 * 📊 EDITOR TELEMETRY SERVICE - FASE 5
 * 
 * Serviço centralizado para telemetria e analytics do editor.
 * Agrega métricas do editorMetrics e fornece APIs de alto nível.
 * 
 * @version 1.0.0
 * @phase FASE 5 - Telemetria e Métricas
 */

import { editorMetrics } from './editorMetrics';
import { generateSessionId as genSessionId } from '@/utils/idGenerator';

/**
 * Configuração de telemetria
 */
export interface TelemetryConfig {
  enabled: boolean;
  sampleRate?: number; // 0.0 - 1.0 (percentual de eventos a capturar)
  logToConsole?: boolean;
  sendToServer?: boolean;
  serverEndpoint?: string;
}

/**
 * Sessão de usuário
 */
interface EditorSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  funnelId?: string;
  templateId?: string;
  userId?: string;
}

/**
 * Relatório de sessão
 */
export interface SessionReport {
  session: EditorSession;
  duration: number;
  metrics: {
    blocksAdded: number;
    blocksEdited: number;
    blocksDeleted: number;
    blocksReordered: number;
    stepsVisited: string[];
    saveAttempts: number;
    saveSuccesses: number;
    undoCount: number;
    redoCount: number;
    errorsEncountered: number;
  };
  performance: {
    avgLoadTime: number;
    avgSaveTime: number;
    avgRenderTime: number;
    cacheHitRate: number;
  };
}

/**
 * Relatório de performance
 */
export interface PerformanceReport {
  period: string;
  summary: {
    totalSessions: number;
    avgSessionDuration: number;
    totalBlockActions: number;
    totalSaves: number;
    saveSuccessRate: number;
    totalErrors: number;
  };
  topSlowOperations: Array<{
    operation: string;
    avgDuration: number;
    count: number;
  }>;
  errorBreakdown: Record<string, number>;
}

/**
 * 📊 EditorTelemetryService
 */
export class EditorTelemetryService {
  private static instance: EditorTelemetryService;
  private config: TelemetryConfig;
  private currentSession: EditorSession | null = null;
  private sessions: EditorSession[] = [];
  private sessionStartMetrics: any = null;

  private constructor(config: Partial<TelemetryConfig> = {}) {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      logToConsole: import.meta.env.DEV,
      sendToServer: false,
      ...config,
    };
  }

  static getInstance(config?: Partial<TelemetryConfig>): EditorTelemetryService {
    if (!EditorTelemetryService.instance) {
      EditorTelemetryService.instance = new EditorTelemetryService(config);
    }
    return EditorTelemetryService.instance;
  }

  /**
   * Iniciar sessão de edição
   */
  startSession(sessionData?: Partial<EditorSession>): string {
    if (!this.config.enabled) return 'disabled';

    const sessionId = this.generateSessionId();
    
    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      ...sessionData,
    };

    // Capturar estado inicial das métricas
    this.sessionStartMetrics = editorMetrics.getReport();

    if (this.config.logToConsole) {
      console.log('📊 [Telemetry] Session started:', sessionId);
    }

    return sessionId;
  }

  /**
   * Finalizar sessão
   */
  endSession(): SessionReport | null {
    if (!this.currentSession) return null;

    this.currentSession.endTime = Date.now();
    this.sessions.push(this.currentSession);

    const report = this.getSessionReport();

    if (this.config.logToConsole) {
      console.log('📊 [Telemetry] Session ended:', report);
    }

    if (this.config.sendToServer && this.config.serverEndpoint) {
      this.sendToServer(report).catch(err => 
        console.error('Failed to send telemetry:', err)
      );
    }

    this.currentSession = null;
    this.sessionStartMetrics = null;

    return report;
  }

  /**
   * Obter relatório da sessão atual
   */
  getSessionReport(): SessionReport | null {
    if (!this.currentSession) return null;

    const currentMetrics = editorMetrics.getReport();
    const duration = Date.now() - this.currentSession.startTime;

    // Calcular deltas desde o início da sessão
    const startSummary = this.sessionStartMetrics?.summary || {};
    const currentSummary = currentMetrics.summary;

    return {
      session: { ...this.currentSession },
      duration,
      metrics: {
        blocksAdded: (currentSummary.blockActions || 0) - (startSummary.blockActions || 0),
        blocksEdited: 0, // Seria necessário breakdown mais detalhado
        blocksDeleted: 0,
        blocksReordered: 0,
        stepsVisited: [], // Seria necessário tracking de steps únicos
        saveAttempts: (currentSummary.saves || 0) - (startSummary.saves || 0),
        saveSuccesses: Math.round(((currentSummary.saves || 0) - (startSummary.saves || 0)) * (parseFloat(currentSummary.saveSuccessRate) / 100)),
        undoCount: (currentSummary.undoRedos || 0) - (startSummary.undoRedos || 0),
        redoCount: 0,
        errorsEncountered: (currentSummary.errors || 0) - (startSummary.errors || 0),
      },
      performance: {
        avgLoadTime: currentSummary.avgLoadTimeMs,
        avgSaveTime: currentSummary.avgSaveTimeMs || 0,
        avgRenderTime: currentSummary.avgRenderTimeMs,
        cacheHitRate: parseFloat(currentSummary.cacheHitRate) || 0,
      },
    };
  }

  /**
   * Obter relatório de performance geral
   */
  getPerformanceReport(): PerformanceReport {
    const metrics = editorMetrics.getReport();

    const totalSessions = this.sessions.length;
    const avgSessionDuration = totalSessions > 0
      ? this.sessions.reduce((sum, s) => sum + ((s.endTime || Date.now()) - s.startTime), 0) / totalSessions
      : 0;

    return {
      period: metrics.period,
      summary: {
        totalSessions,
        avgSessionDuration,
        totalBlockActions: metrics.summary.blockActions || 0,
        totalSaves: metrics.summary.saves || 0,
        saveSuccessRate: parseFloat(metrics.summary.saveSuccessRate) || 0,
        totalErrors: metrics.summary.errors || 0,
      },
      topSlowOperations: metrics.slowestLoads.map(l => ({
        operation: `Load ${l.stepId}`,
        avgDuration: parseFloat(l.duration),
        count: 1,
      })),
      errorBreakdown: {},
    };
  }

  /**
   * Exportar todas as métricas
   */
  exportMetrics() {
    return {
      config: this.config,
      currentSession: this.currentSession,
      sessions: this.sessions,
      editorMetrics: editorMetrics.export(),
      performanceReport: this.getPerformanceReport(),
    };
  }

  /**
   * Limpar dados de telemetria
   */
  clear() {
    this.sessions = [];
    this.currentSession = null;
    this.sessionStartMetrics = null;
    editorMetrics.clear();

    if (this.config.logToConsole) {
      console.log('📊 [Telemetry] Data cleared');
    }
  }

  /**
   * Atualizar configuração
   */
  updateConfig(config: Partial<TelemetryConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Verificar se deve capturar evento (sample rate)
   */
  shouldCapture(): boolean {
    if (!this.config.enabled) return false;
    if (this.config.sampleRate === undefined || this.config.sampleRate >= 1.0) return true;
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Gerar ID único para sessão
   */
  private generateSessionId(): string {
    return genSessionId();
  }

  /**
   * Enviar dados para servidor
   */
  private async sendToServer(data: any): Promise<void> {
    if (!this.config.serverEndpoint) return;

    try {
      const response = await fetch(this.config.serverEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send telemetry to server:', error);
      throw error;
    }
  }

  /**
   * 📊 Log formatado de métricas (console)
   */
  logReport() {
    const report = this.getSessionReport();
    if (!report) {
      console.log('📊 [Telemetry] No active session');
      return;
    }

    console.group('📊 Editor Telemetry Report');
    console.log(`Session ID: ${report.session.sessionId}`);
    console.log(`Duration: ${(report.duration / 1000).toFixed(1)}s`);
    console.log('\n📝 Metrics:');
    console.table(report.metrics);
    console.log('\n⚡ Performance:');
    console.table(report.performance);
    console.groupEnd();
  }
}

/**
 * Singleton exportado
 */
export const editorTelemetry = EditorTelemetryService.getInstance();

/**
 * Expor globalmente para debugging
 */
if (typeof window !== 'undefined') {
  (window as any).editorTelemetry = editorTelemetry;
}
