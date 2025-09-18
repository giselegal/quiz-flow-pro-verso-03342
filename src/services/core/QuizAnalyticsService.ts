// 📈 QUIZ ANALYTICS SERVICE
export class QuizAnalyticsService {
  /**
   * Rastrear início do quiz
   */
  static trackQuizStart(userId?: string) {
    this.sendEvent('quiz_started', {
      user_id: userId,
      timestamp: new Date().toISOString(),
      session_id: this.getSessionId(),
    });
  }

  /**
   * Rastrear mudança de etapa
   */
  static trackStepChange(stepNumber: number, stepType: string) {
    this.sendEvent('step_changed', {
      step_number: stepNumber,
      step_type: stepType,
      timestamp: new Date().toISOString(),
      session_id: this.getSessionId(),
    });
  }

  /**
   * Rastrear resposta a pergunta
   */
  static trackAnswer(questionId: string, optionId: string, stepNumber: number) {
    this.sendEvent('question_answered', {
      question_id: questionId,
      option_id: optionId,
      step_number: stepNumber,
      timestamp: new Date().toISOString(),
      session_id: this.getSessionId(),
    });
  }

  /**
   * Rastrear conclusão do quiz
   */
  static trackQuizComplete(result: any) {
    this.sendEvent('quiz_completed', {
      result_style: result.primaryStyle?.name,
      result_percentage: result.primaryStyle?.percentage,
      total_questions: result.totalQuestions,
      completion_time: this.getCompletionTime(),
      timestamp: new Date().toISOString(),
      session_id: this.getSessionId(),
    });
  }

  /**
   * Obter ID da sessão
   */
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('quiz_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('quiz_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Calcular tempo de conclusão
   */
  private static getCompletionTime(): number {
    const startTime = sessionStorage.getItem('quiz_start_time');
    if (startTime) {
      return Date.now() - parseInt(startTime);
    }
    return 0;
  }

  /**
   * Enviar evento para analytics
   */
  private static sendEvent(eventName: string, data: any) {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data);
    }

    // Console para debug
    console.log(`📈 Analytics: ${eventName}`, data);

    // TODO: Adicionar outros providers (Facebook Pixel, etc.)
  }

  /**
   * Inicializar tracking
   */
  static initialize() {
    sessionStorage.setItem('quiz_start_time', Date.now().toString());
    this.trackQuizStart();
  }
}
