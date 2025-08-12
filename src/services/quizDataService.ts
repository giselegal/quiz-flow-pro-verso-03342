import { QuizResult, StyleType } from '@/types/quiz';
import { trackPixelEvent } from '../utils/facebookPixel';

export interface QuizSession {
  sessionId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  startTime: Date;
  endTime?: Date;
  answers: QuizAnswer[];
  clickEvents: ClickEvent[];
  result?: QuizResult;
  abTestVariant?: string;
  userAgent?: string;
  referrer?: string;
  device?: DeviceInfo;
}

export interface QuizAnswer {
  questionId: string;
  questionText: string;
  selectedOptions: string[];
  optionTexts: string[];
  timestamp: Date;
  responseTime: number; // em milliseconds
  stylePoints: Record<string, number>;
}

export interface ClickEvent {
  eventId: string;
  timestamp: Date;
  elementType: string;
  elementId?: string;
  elementText?: string;
  position: { x: number; y: number };
  pageUrl: string;
  questionIndex?: number;
  actionType: 'click' | 'hover' | 'focus' | 'submit';
  metadata?: Record<string, any>;
}

export interface DeviceInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Interface para configuração de funil
interface FunnelConfig {
  pixelId: string;
  token: string;
  utmCampaign: string;
  funnelName: string;
  ctaUrl: string;
  googleAnalyticsId?: string;
}

// Interface para parâmetros UTM
interface UtmParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  id?: string;
  fbclid?: string;
}

class QuizDataService {
  private currentSession: QuizSession | null = null;
  private clickEventBuffer: ClickEvent[] = [];
  private isTrackingEnabled = true;
  private funnelConfig: FunnelConfig | null = null;
  private utmParameters: UtmParameters = {};

  // Configurações de funil
  private readonly FUNNEL_CONFIGS: Record<string, FunnelConfig> = {
    default: {
      pixelId: '1311550759901086',
      token:
        'EAAEJYWeJHLABOwGC1ZC1GxRfJBAAIBHFB4kYqIFrNyoyuRpnRLyNp7L2VZBop3sGuyzchC6XkD1EfBrlxmCoMxTZCBEWrP2DwZBOPu5fZBKZCZBybZBG9xAxaSFJJzk3VZB4i08EKFImWmsKhYXWK9RdtfR0eZCQaoNHFm4rGmby9LNjvZAcuVYEAX6M2e0vSfdB96vWQZDZD',
      utmCampaign: 'Teste Lovable - Por Fora',
      funnelName: 'quiz_isca',
      ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    },
    'quiz-descubra-seu-estilo': {
      pixelId: '1038647624890676',
      token:
        'EAAEJYWeJHLABOwGC1ZC1GxRfJBAAIBHFB4kYqIFrNyoyuRpnRLyNp7L2VZBop3sGuyzchC6XkD1EfBrlxmCoMxTZCBEWrP2DwZBOPu5fZBKZCZBybZBG9xAxaSFJJzk3VZB4i08EKFImWmsKhYXWK9RdtfR0eZCQaoNHFm4rGmby9LNjvZAcuVYEAX6M2e0vSfdB96vWQZDZD',
      utmCampaign: 'Teste Lovable - Por Dentro',
      funnelName: 'quiz_embutido',
      ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
    },
  };

  constructor() {
    // Inicializar configuração do funil baseado na URL
    this.initializeFunnelConfig();
    // Capturar parâmetros UTM da URL
    this.captureUtmParameters();
  }

  // Inicializar nova sessão de quiz
  startSession(userName?: string, userEmail?: string): string {
    const sessionId = this.generateSessionId();

    this.currentSession = {
      sessionId,
      userName,
      userEmail,
      startTime: new Date(),
      answers: [],
      clickEvents: [],
      device: this.getDeviceInfo(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    };

    // Salvar no localStorage
    this.saveSessionToStorage();

    // Track início da sessão
    this.trackEvent('session_start', {
      sessionId,
      userName,
      userEmail,
      timestamp: new Date().toISOString(),
    });

    console.log('Quiz session started:', sessionId);
    return sessionId;
  }

  // Adicionar resposta de pergunta
  addAnswer(
    questionId: string,
    questionText: string,
    selectedOptions: string[],
    optionTexts: string[],
    stylePoints: Record<string, number>,
    responseTime: number
  ): void {
    if (!this.currentSession) {
      console.warn('No active session to add answer');
      return;
    }

    const answer: QuizAnswer = {
      questionId,
      questionText,
      selectedOptions,
      optionTexts,
      timestamp: new Date(),
      responseTime,
      stylePoints,
    };

    this.currentSession.answers.push(answer);
    this.saveSessionToStorage();

    // Track resposta
    this.trackEvent('question_answered', {
      questionId,
      selectedOptions,
      responseTime,
      timestamp: new Date().toISOString(),
    });

    console.log(`Answer added for question ${questionId}:`, selectedOptions);
  }

  // Rastrear evento de clique
  trackClick(
    elementType: string,
    elementId?: string,
    elementText?: string,
    position?: { x: number; y: number },
    questionIndex?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.isTrackingEnabled || !this.currentSession) return;

    const clickEvent: ClickEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date(),
      elementType,
      elementId,
      elementText,
      position: position || { x: 0, y: 0 },
      pageUrl: window.location.href,
      questionIndex,
      actionType: 'click',
      metadata,
    };

    this.currentSession.clickEvents.push(clickEvent);
    this.clickEventBuffer.push(clickEvent);

    // Salvar no localStorage a cada 5 cliques ou imediatamente se for importante
    if (this.clickEventBuffer.length >= 5 || this.isImportantClick(elementType)) {
      this.saveSessionToStorage();
      this.clickEventBuffer = [];
    }

    // Track evento
    this.trackEvent('click_event', {
      elementType,
      elementId,
      elementText,
      questionIndex,
      timestamp: new Date().toISOString(),
    });
  }

  // Finalizar sessão com resultado
  finishSession(result: QuizResult): void {
    if (!this.currentSession) {
      console.warn('No active session to finish');
      return;
    }

    this.currentSession.endTime = new Date();
    this.currentSession.result = result;

    // Salvar sessão completa
    this.saveSessionToStorage();
    this.saveCompletedSession();

    // Track finalização
    this.trackEvent('session_completed', {
      sessionId: this.currentSession.sessionId,
      result: result.predominantStyle,
      totalQuestions: this.currentSession.answers.length,
      totalClicks: this.currentSession.clickEvents.length,
      duration: this.getSessionDuration(),
      timestamp: new Date().toISOString(),
    });

    console.log('Quiz session completed:', this.currentSession.sessionId);
  }

  // Obter sessão atual
  getCurrentSession(): QuizSession | null {
    return this.currentSession;
  }

  // Carregar sessão do localStorage
  loadSession(): QuizSession | null {
    try {
      const savedSession = localStorage.getItem('current_quiz_session');
      if (savedSession) {
        this.currentSession = JSON.parse(savedSession);
        return this.currentSession;
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
    return null;
  }

  // Obter todas as sessões completas
  getAllCompletedSessions(): QuizSession[] {
    try {
      const sessions = localStorage.getItem('completed_quiz_sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error loading completed sessions:', error);
      return [];
    }
  }

  // Obter estatísticas da sessão atual
  getSessionStats(): any {
    if (!this.currentSession) return null;

    return {
      sessionId: this.currentSession.sessionId,
      duration: this.getSessionDuration(),
      totalQuestions: this.currentSession.answers.length,
      totalClicks: this.currentSession.clickEvents.length,
      averageResponseTime: this.getAverageResponseTime(),
      clicksByType: this.getClicksByType(),
      answersBreakdown: this.getAnswersBreakdown(),
    };
  }

  // Exportar dados para análise
  exportSessionData(sessionId?: string): string {
    const session = sessionId
      ? this.getAllCompletedSessions().find(s => s.sessionId === sessionId)
      : this.currentSession;

    if (!session) return '';

    return JSON.stringify(session, null, 2);
  }

  // Reset completo de dados
  clearAllData(): void {
    this.currentSession = null;
    this.clickEventBuffer = [];
    localStorage.removeItem('current_quiz_session');
    localStorage.removeItem('completed_quiz_sessions');
    localStorage.removeItem('quiz_analytics_events');
    console.log('All quiz data cleared');
  }

  // Métodos privados
  private generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
      userAgent,
      screenWidth,
      screenHeight,
      viewportWidth,
      viewportHeight,
      platform: navigator.platform,
      isMobile: /Mobi|Android/i.test(userAgent),
      isTablet: /Tablet|iPad/i.test(userAgent),
      isDesktop: !/Mobi|Tablet|iPad|Android/i.test(userAgent),
    };
  }

  private saveSessionToStorage(): void {
    if (this.currentSession) {
      localStorage.setItem('current_quiz_session', JSON.stringify(this.currentSession));
    }
  }

  private saveCompletedSession(): void {
    if (!this.currentSession) return;

    const completedSessions = this.getAllCompletedSessions();
    completedSessions.push(this.currentSession);

    // Manter apenas últimas 10 sessões
    const recentSessions = completedSessions.slice(-10);
    localStorage.setItem('completed_quiz_sessions', JSON.stringify(recentSessions));
  }

  private isImportantClick(elementType: string): boolean {
    const importantTypes = ['cta_button', 'submit_button', 'quiz_option', 'navigation_button'];
    return importantTypes.includes(elementType);
  }

  private getSessionDuration(): number {
    if (!this.currentSession) return 0;
    const endTime = this.currentSession.endTime || new Date();
    return endTime.getTime() - this.currentSession.startTime.getTime();
  }

  private getAverageResponseTime(): number {
    if (!this.currentSession || this.currentSession.answers.length === 0) return 0;

    const totalTime = this.currentSession.answers.reduce(
      (sum, answer) => sum + answer.responseTime,
      0
    );
    return totalTime / this.currentSession.answers.length;
  }

  private getClicksByType(): Record<string, number> {
    if (!this.currentSession) return {};

    const clicksByType: Record<string, number> = {};
    this.currentSession.clickEvents.forEach(event => {
      clicksByType[event.elementType] = (clicksByType[event.elementType] || 0) + 1;
    });

    return clicksByType;
  }

  private getAnswersBreakdown(): Record<string, number> {
    if (!this.currentSession) return {};

    const stylePoints: Record<string, number> = {};
    this.currentSession.answers.forEach(answer => {
      Object.entries(answer.stylePoints).forEach(([style, points]) => {
        stylePoints[style] = (stylePoints[style] || 0) + points;
      });
    });

    return stylePoints;
  }

  // Inicializar configuração do funil baseado na URL
  private initializeFunnelConfig(): void {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    let funnelKey = 'default';

    if (path.includes('/quiz-descubra-seu-estilo')) {
      funnelKey = 'quiz-descubra-seu-estilo';
    }

    this.funnelConfig = this.FUNNEL_CONFIGS[funnelKey];
    console.log('Initialized funnel config:', this.funnelConfig?.funnelName);
  }

  // Capturar parâmetros UTM da URL
  private captureUtmParameters(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);

    this.utmParameters = {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      content: urlParams.get('utm_content') || undefined,
      term: urlParams.get('utm_term') || undefined,
      id: urlParams.get('utm_id') || undefined,
      fbclid: urlParams.get('fbclid') || undefined,
    };

    // Remover parâmetros undefined
    Object.keys(this.utmParameters).forEach(key => {
      if (this.utmParameters[key as keyof UtmParameters] === undefined) {
        delete this.utmParameters[key as keyof UtmParameters];
      }
    });

    // Salvar UTM no localStorage
    if (Object.keys(this.utmParameters).length > 0) {
      localStorage.setItem('quiz_utm_parameters', JSON.stringify(this.utmParameters));
      console.log('UTM parameters captured:', this.utmParameters);
    }
  }

  // Tracking de eventos para Facebook Pixel
  private trackFacebookPixelEvent(eventName: string, data?: Record<string, any>): void {
    if (!this.funnelConfig || typeof window === 'undefined') return;

    try {
      trackPixelEvent(eventName, {
        ...data,
        funnel_name: this.funnelConfig.funnelName,
        utm_campaign: this.funnelConfig.utmCampaign,
        ...this.utmParameters,
      });
    } catch (error) {
      console.warn('Error tracking Facebook Pixel event:', error);
    }
  }

  // Tracking de eventos para Google Analytics
  private trackGoogleAnalyticsEvent(eventName: string, data?: Record<string, any>): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('event', eventName, {
        event_category: 'quiz_engagement',
        funnel_name: this.funnelConfig?.funnelName,
        utm_campaign: this.funnelConfig?.utmCampaign,
        ...this.utmParameters,
        ...data,
      });
    } catch (error) {
      console.warn('Error tracking Google Analytics event:', error);
    }
  }

  // Método trackEvent atualizado com integração completa
  private trackEvent(eventName: string, data: Record<string, any>): void {
    try {
      // Salvar em localStorage para analytics
      const events = JSON.parse(localStorage.getItem('quiz_analytics_events') || '[]');
      const event = {
        eventName,
        data: {
          ...data,
          funnel_name: this.funnelConfig?.funnelName,
          utm_parameters: this.utmParameters,
        },
        timestamp: new Date().toISOString(),
        sessionId: this.currentSession?.sessionId,
      };

      events.push(event);

      // Manter apenas os últimos 100 eventos
      const recentEvents = events.slice(-100);
      localStorage.setItem('quiz_analytics_events', JSON.stringify(recentEvents));

      // Enviar para Facebook Pixel e Google Analytics
      this.trackFacebookPixelEvent(eventName, data);
      this.trackGoogleAnalyticsEvent(eventName, data);

      console.log(`[Analytics] Event tracked: ${eventName}`, data);
    } catch (error) {
      console.warn('Error tracking event:', error);
    }
  }

  // Métodos específicos para eventos do quiz

  // Iniciar quiz
  trackQuizStart(userName?: string, userEmail?: string): void {
    this.trackEvent('quiz_start', {
      user_name: userName,
      user_email: userEmail,
      page_variant: this.funnelConfig?.funnelName === 'quiz_embutido' ? 'B' : 'A',
    });

    // Evento específico do Facebook Pixel
    this.trackFacebookPixelEvent('InitiateCheckout', {
      content_name:
        this.funnelConfig?.funnelName === 'quiz_embutido'
          ? 'Quiz Descubra Seu Estilo'
          : 'Quiz Manual de Estilo',
      content_category: 'Quiz',
      value: 0,
      currency: 'BRL',
    });
  }

  // Progresso do quiz
  trackQuizProgress(questionNumber: number, totalQuestions: number): void {
    const progress = Math.round((questionNumber / totalQuestions) * 100);

    this.trackEvent('quiz_progress', {
      question_number: questionNumber,
      total_questions: totalQuestions,
      progress_percentage: progress,
      page_variant: this.funnelConfig?.funnelName === 'quiz_embutido' ? 'B' : 'A',
    });

    // Eventos específicos do Facebook Pixel em marcos importantes
    if (progress === 25 || progress === 50 || progress === 75) {
      this.trackFacebookPixelEvent('AddToCart', {
        content_name: `Quiz Progress ${progress}%`,
        content_category: 'Quiz',
        value: (progress / 100) * 47,
        currency: 'BRL',
      });
    }
  }

  // Completar quiz
  trackQuizComplete(result: string): void {
    this.trackEvent('quiz_complete', {
      quiz_result: result,
      page_variant: this.funnelConfig?.funnelName === 'quiz_embutido' ? 'B' : 'A',
    });

    this.trackFacebookPixelEvent('CompleteRegistration', {
      content_name: 'Quiz Completo - Descubra Seu Estilo',
      content_category: 'Quiz',
      value: 47,
      currency: 'BRL',
      status: 'completed',
    });
  }

  // Clique em CTA
  trackCTAClick(ctaPosition: string, ctaText?: string, targetUrl?: string): void {
    this.trackEvent('cta_click', {
      cta_position: ctaPosition,
      cta_text: ctaText,
      target_url: targetUrl,
      page_variant: this.funnelConfig?.funnelName === 'quiz_embutido' ? 'B' : 'A',
    });

    this.trackFacebookPixelEvent('Purchase', {
      content_name: 'Manual de Estilo Contemporâneo',
      content_category: 'Digital Product',
      value: 47,
      currency: 'BRL',
      content_ids: ['manual-estilo-contemporaneo'],
      num_items: 1,
    });
  }

  // Visualização de página
  trackPageView(pagePath?: string): void {
    const path = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '');

    this.trackEvent('page_view', {
      page_path: path,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    });

    this.trackFacebookPixelEvent('ViewContent', {
      content_name:
        this.funnelConfig?.funnelName === 'quiz_embutido'
          ? 'Quiz Descubra Seu Estilo - Página B'
          : 'Quiz Manual de Estilo - Página A',
      content_category: 'Quiz Landing Page',
      content_type: 'product',
      value: 47,
      currency: 'BRL',
    });
  }

  // Progresso de scroll
  trackScrollProgress(percentage: number): void {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 90) {
      this.trackEvent('scroll_progress', {
        scroll_percentage: percentage,
        page_variant: this.funnelConfig?.funnelName === 'quiz_embutido' ? 'B' : 'A',
      });
    }
  }

  // Obter configuração do funil atual
  getCurrentFunnelConfig(): FunnelConfig | null {
    return this.funnelConfig;
  }

  // Obter parâmetros UTM
  getUtmParameters(): UtmParameters {
    return { ...this.utmParameters };
  }
}

// Instância singleton
export const quizDataService = new QuizDataService();

// Hook para usar o serviço nos componentes React
export const useQuizData = () => {
  return {
    startSession: quizDataService.startSession.bind(quizDataService),
    addAnswer: quizDataService.addAnswer.bind(quizDataService),
    trackClick: quizDataService.trackClick.bind(quizDataService),
    finishSession: quizDataService.finishSession.bind(quizDataService),
    getCurrentSession: quizDataService.getCurrentSession.bind(quizDataService),
    getSessionStats: quizDataService.getSessionStats.bind(quizDataService),
    exportSessionData: quizDataService.exportSessionData.bind(quizDataService),
    clearAllData: quizDataService.clearAllData.bind(quizDataService),
  };
};
