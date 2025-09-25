/**
 * 📊 ANALYTICS SERVICE - Phase 3 Implementation
 * Google Analytics 4 + Custom Editor Metrics
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface CustomEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface EditorMetrics {
  sessionId: string;
  userId?: string;
  blocksAdded: number;
  blocksRemoved: number;
  templatesUsed: string[];
  timeSpent: number;
  errorsEncountered: number;
  completionRate: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;
  private sessionId: string;
  private sessionStart: number;
  private editorMetrics: EditorMetrics;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.editorMetrics = {
      sessionId: this.sessionId,
      blocksAdded: 0,
      blocksRemoved: 0,
      templatesUsed: [],
      timeSpent: 0,
      errorsEncountered: 0,
      completionRate: 0
    };
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Inicializar Google Analytics 4
   */
  initialize(measurementId: string = 'G-XXXXXXXXXX') {
    if (this.isInitialized) return;

    // Carregar Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag!('js', new Date());
    window.gtag('config', measurementId, {
      page_title: 'Quiz Editor Pro',
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'session_id',
        custom_parameter_2: 'editor_mode'
      }
    });

    this.isInitialized = true;
    console.log('📊 Analytics initialized');

    // Iniciar tracking da sessão
    this.trackSessionStart();
  }

  /**
   * Rastrear evento personalizado
   */
  trackEvent(event: CustomEvent) {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    window.gtag!('event', event.event_name, {
      event_category: event.event_category,
      event_label: event.event_label,
      value: event.value,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      ...event.custom_parameters
    });

    console.log('📊 Event tracked:', event);
  }

  /**
   * Rastrear página visitada
   */
  trackPageView(pageName: string, additionalData?: Record<string, any>) {
    this.trackEvent({
      event_name: 'page_view',
      event_category: 'navigation',
      event_label: pageName,
      custom_parameters: {
        page_name: pageName,
        url: window.location.href,
        referrer: document.referrer,
        ...additionalData
      }
    });
  }

  /**
   * Rastrear uso do editor
   */
  trackEditorAction(action: string, details?: Record<string, any>) {
    switch (action) {
      case 'block_added':
        this.editorMetrics.blocksAdded++;
        break;
      case 'block_removed':
        this.editorMetrics.blocksRemoved++;
        break;
      case 'template_used':
        if (details?.templateName) {
          this.editorMetrics.templatesUsed.push(details.templateName);
        }
        break;
      case 'error_encountered':
        this.editorMetrics.errorsEncountered++;
        break;
    }

    this.trackEvent({
      event_name: 'editor_action',
      event_category: 'editor',
      event_label: action,
      custom_parameters: {
        action,
        session_metrics: this.editorMetrics,
        ...details
      }
    });
  }

  /**
   * Rastrear performance
   */
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.trackEvent({
      event_name: 'performance_metric',
      event_category: 'performance',
      event_label: metric,
      value,
      custom_parameters: {
        metric,
        value,
        unit,
        url: window.location.href
      }
    });
  }

  /**
   * Rastrear Core Web Vitals
   */
  trackWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackPerformance('LCP', entry.startTime);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID (First Input Delay) - usar polyfill se necessário
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackPerformance('FID', (entry as any).processingStart - entry.startTime);
      }
    }).observe({ type: 'first-input', buffered: true });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.trackPerformance('CLS', clsValue * 1000, 'score');
    }).observe({ type: 'layout-shift', buffered: true });
  }

  /**
   * Rastrear erro
   */
  trackError(error: Error, context?: string) {
    this.editorMetrics.errorsEncountered++;

    this.trackEvent({
      event_name: 'error_occurred',
      event_category: 'error',
      event_label: error.name,
      custom_parameters: {
        error_message: error.message,
        error_stack: error.stack,
        context,
        url: window.location.href,
        session_metrics: this.editorMetrics
      }
    });
  }

  /**
   * Rastrear conversão
   */
  trackConversion(goalName: string, value?: number) {
    this.trackEvent({
      event_name: 'conversion',
      event_category: 'goal',
      event_label: goalName,
      value,
      custom_parameters: {
        goal_name: goalName,
        session_metrics: this.editorMetrics
      }
    });
  }

  /**
   * Finalizar sessão
   */
  trackSessionEnd() {
    this.editorMetrics.timeSpent = Date.now() - this.sessionStart;
    this.editorMetrics.completionRate = this.calculateCompletionRate();

    this.trackEvent({
      event_name: 'session_end',
      event_category: 'engagement',
      event_label: 'session_complete',
      value: this.editorMetrics.timeSpent,
      custom_parameters: {
        final_metrics: this.editorMetrics
      }
    });
  }

  /**
   * Obter métricas da sessão atual
   */
  getSessionMetrics(): EditorMetrics {
    return {
      ...this.editorMetrics,
      timeSpent: Date.now() - this.sessionStart
    };
  }

  /**
   * Gerar ID da sessão
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Rastrear início da sessão
   */
  private trackSessionStart() {
    this.trackEvent({
      event_name: 'session_start',
      event_category: 'engagement',
      event_label: 'new_session',
      custom_parameters: {
        session_id: this.sessionId,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language
      }
    });
  }

  /**
   * Calcular taxa de conclusão
   */
  private calculateCompletionRate(): number {
    const totalActions = this.editorMetrics.blocksAdded + this.editorMetrics.templatesUsed.length;
    if (totalActions === 0) return 0;
    
    // Simplificado - pode ser mais complexo baseado em metas específicas
    return Math.min(100, (totalActions / 10) * 100);
  }
}

export const analyticsService = AnalyticsService.getInstance();

// Auto-inicializar quando disponível
if (typeof window !== 'undefined') {
  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      analyticsService.initialize();
      analyticsService.trackWebVitals();
    });
  } else {
    analyticsService.initialize();
    analyticsService.trackWebVitals();
  }

  // Rastrear erros globais
  window.addEventListener('error', (event) => {
    analyticsService.trackError(event.error, 'global_error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    analyticsService.trackError(new Error(event.reason), 'unhandled_promise');
  });

  // Rastrear fim da sessão
  window.addEventListener('beforeunload', () => {
    analyticsService.trackSessionEnd();
  });
}