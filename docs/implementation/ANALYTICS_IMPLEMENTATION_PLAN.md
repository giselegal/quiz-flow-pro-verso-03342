# 📊 PLANO DE IMPLEMENTAÇÃO - ANALYTICS E COLETA DE DADOS

## 🎯 **OBJETIVO GERAL**

Implementar sistema completo de coleta de dados do usuário, rastreamento de cliques e métricas da jornada do usuário no quiz para análise de conversão e comportamento.

---

## 🗃️ **1. ESQUEMA SUPABASE - EXTENSÕES NECESSÁRIAS**

### **1.1 Tabela de Perfis de Usuário (extensão da existente)**

```sql
-- Adicionar campos à tabela profiles existente
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referrer_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS landing_page TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
```

### **1.2 Nova Tabela: user_sessions**

```sql
CREATE TABLE user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 0,
  quiz_completed BOOLEAN DEFAULT false,
  conversion_achieved BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_data JSONB DEFAULT '{}',
  device_info JSONB DEFAULT '{}'
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_started_at ON user_sessions(started_at);
```

### **1.3 Nova Tabela: quiz_step_tracking**

```sql
CREATE TABLE quiz_step_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'step_enter', 'step_exit', 'click', 'input', 'selection',
    'form_submit', 'error', 'timeout', 'navigation'
  )),
  element_id TEXT,
  element_type TEXT,
  element_text TEXT,
  clicked_option JSONB,
  form_data JSONB,
  time_on_step INTEGER, -- segundos no step
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  additional_data JSONB DEFAULT '{}'
);

CREATE INDEX idx_quiz_step_tracking_session ON quiz_step_tracking(session_id);
CREATE INDEX idx_quiz_step_tracking_user ON quiz_step_tracking(user_id);
CREATE INDEX idx_quiz_step_tracking_step ON quiz_step_tracking(step_number);
CREATE INDEX idx_quiz_step_tracking_timestamp ON quiz_step_tracking(timestamp);
```

### **1.4 Nova Tabela: conversion_events**

```sql
CREATE TABLE conversion_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'quiz_start', 'quiz_complete', 'email_capture', 'name_capture',
    'phone_capture', 'form_submit', 'result_view', 'cta_click',
    'social_share', 'exit_intent'
  )),
  event_value TEXT,
  step_number INTEGER,
  conversion_value NUMERIC(10,2),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  event_data JSONB DEFAULT '{}'
);

CREATE INDEX idx_conversion_events_session ON conversion_events(session_id);
CREATE INDEX idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX idx_conversion_events_timestamp ON conversion_events(timestamp);
```

---

## 🔧 **2. SERVIÇO DE ANALYTICS (TypeScript)**

### **2.1 Serviço Principal de Tracking**

```typescript
// src/services/analyticsService.ts
export interface AnalyticsConfig {
  enableTracking: boolean;
  trackClicks: boolean;
  trackFormInputs: boolean;
  trackTimeOnStep: boolean;
  batchSize: number;
  flushInterval: number;
}

export interface TrackingEvent {
  sessionId: string;
  userId?: string;
  stepNumber: number;
  actionType: string;
  elementId?: string;
  elementType?: string;
  elementText?: string;
  formData?: Record<string, any>;
  additionalData?: Record<string, any>;
}

export class AnalyticsService {
  private config: AnalyticsConfig;
  private sessionId: string;
  private eventQueue: TrackingEvent[] = [];
  private stepStartTimes: Map<number, number> = new Map();
  private supabaseClient: any;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.supabaseClient = createClientComponentClient();
  }

  // Gerar ID único da sessão
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Iniciar rastreamento de sessão
  async startSession(userId?: string, utmData?: Record<string, string>) {
    if (!this.config.enableTracking) return;

    const sessionData = {
      user_id: userId,
      session_id: this.sessionId,
      utm_data: utmData || {},
      device_info: {
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    await this.supabaseClient.from("user_sessions").insert(sessionData);
  }

  // Rastrear entrada em step
  trackStepEnter(stepNumber: number, stepName: string, additionalData?: Record<string, any>) {
    this.stepStartTimes.set(stepNumber, Date.now());

    this.addEvent({
      sessionId: this.sessionId,
      stepNumber,
      actionType: "step_enter",
      elementText: stepName,
      additionalData,
    });
  }

  // Rastrear saída de step
  trackStepExit(stepNumber: number, stepName: string) {
    const startTime = this.stepStartTimes.get(stepNumber);
    const timeOnStep = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    this.addEvent({
      sessionId: this.sessionId,
      stepNumber,
      actionType: "step_exit",
      elementText: stepName,
      additionalData: { timeOnStep },
    });
  }

  // Rastrear clique
  trackClick(
    stepNumber: number,
    elementId: string,
    elementType: string,
    elementText?: string,
    additionalData?: Record<string, any>
  ) {
    if (!this.config.trackClicks) return;

    this.addEvent({
      sessionId: this.sessionId,
      stepNumber,
      actionType: "click",
      elementId,
      elementType,
      elementText,
      additionalData,
    });
  }

  // Rastrear seleção de opção
  trackOptionSelection(stepNumber: number, optionData: any, questionText?: string) {
    this.addEvent({
      sessionId: this.sessionId,
      stepNumber,
      actionType: "selection",
      additionalData: {
        option: optionData,
        question: questionText,
      },
    });
  }

  // Rastrear envio de formulário
  trackFormSubmit(stepNumber: number, formData: Record<string, any>, formType?: string) {
    this.addEvent({
      sessionId: this.sessionId,
      stepNumber,
      actionType: "form_submit",
      elementType: formType || "form",
      formData,
      additionalData: { formType },
    });

    // Registrar evento de conversão se for captura de dados
    if (formData.email || formData.name || formData.phone) {
      this.trackConversion("form_submit", stepNumber, formData);
    }
  }

  // Rastrear evento de conversão
  async trackConversion(eventType: string, stepNumber?: number, eventData?: Record<string, any>) {
    const conversionData = {
      session_id: this.sessionId,
      event_type: eventType,
      step_number: stepNumber,
      event_data: eventData || {},
      timestamp: new Date().toISOString(),
    };

    await this.supabaseClient.from("conversion_events").insert(conversionData);
  }

  // Adicionar evento à fila
  private addEvent(event: TrackingEvent) {
    if (!this.config.enableTracking) return;

    this.eventQueue.push({
      ...event,
      timestamp: new Date().toISOString(),
    } as any);

    // Flush automático se atingir o tamanho do batch
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flushEvents();
    }
  }

  // Enviar eventos em lote
  async flushEvents() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await this.supabaseClient.from("quiz_step_tracking").insert(eventsToSend);
    } catch (error) {
      console.error("Erro ao enviar eventos de analytics:", error);
      // Re-adicionar eventos na fila em caso de erro
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  // Finalizar sessão
  async endSession() {
    await this.flushEvents();

    await this.supabaseClient
      .from("user_sessions")
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: Math.floor((Date.now() - parseInt(this.sessionId.split("-")[0])) / 1000),
      })
      .eq("session_id", this.sessionId);
  }
}
```

---

## 🎣 **3. HOOK DE ANALYTICS**

### **3.1 Hook useQuizAnalytics**

```typescript
// src/hooks/useQuizAnalytics.ts
export const useQuizAnalytics = (stepNumber: number, stepName: string) => {
  const analyticsService = useRef<AnalyticsService | null>(null);
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);

  // Configuração do analytics
  const config: AnalyticsConfig = {
    enableTracking: true,
    trackClicks: true,
    trackFormInputs: true,
    trackTimeOnStep: true,
    batchSize: 10,
    flushInterval: 30000,
  };

  // Inicializar analytics service
  useEffect(() => {
    analyticsService.current = new AnalyticsService(config);

    // Capturar UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
      utm_content: urlParams.get("utm_content") || "",
      utm_term: urlParams.get("utm_term") || "",
    };

    // Iniciar sessão
    analyticsService.current.startSession(user?.id, utmData);
    setIsTracking(true);

    // Cleanup na desmontagem
    return () => {
      analyticsService.current?.endSession();
    };
  }, [user?.id]);

  // Rastrear entrada no step atual
  useEffect(() => {
    if (analyticsService.current && isTracking) {
      analyticsService.current.trackStepEnter(stepNumber, stepName);
    }

    // Rastrear saída do step na desmontagem
    return () => {
      if (analyticsService.current && isTracking) {
        analyticsService.current.trackStepExit(stepNumber, stepName);
      }
    };
  }, [stepNumber, stepName, isTracking]);

  // Funções de tracking
  const trackClick = useCallback(
    (
      elementId: string,
      elementType: string,
      elementText?: string,
      additionalData?: Record<string, any>
    ) => {
      analyticsService.current?.trackClick(
        stepNumber,
        elementId,
        elementType,
        elementText,
        additionalData
      );
    },
    [stepNumber]
  );

  const trackOptionSelection = useCallback(
    (optionData: any, questionText?: string) => {
      analyticsService.current?.trackOptionSelection(stepNumber, optionData, questionText);
    },
    [stepNumber]
  );

  const trackFormSubmit = useCallback(
    (formData: Record<string, any>, formType?: string) => {
      analyticsService.current?.trackFormSubmit(stepNumber, formData, formType);
    },
    [stepNumber]
  );

  const trackConversion = useCallback(
    (eventType: string, eventData?: Record<string, any>) => {
      analyticsService.current?.trackConversion(eventType, stepNumber, eventData);
    },
    [stepNumber]
  );

  return {
    trackClick,
    trackOptionSelection,
    trackFormSubmit,
    trackConversion,
    isTracking,
  };
};
```

---

## 🧩 **4. INTEGRAÇÃO COM FORMULÁRIOS E COMPONENTES**

### **4.1 Hook para Formulários com Captura de Nome**

```typescript
// src/hooks/useUserDataCapture.ts
export const useUserDataCapture = () => {
  const { trackFormSubmit, trackConversion } = useQuizAnalytics(1, "user-data-capture");
  const supabaseClient = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captureUserData = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) => {
    setIsSubmitting(true);

    try {
      // Salvar dados do usuário
      const { data: profile, error } = await supabaseClient
        .from("profiles")
        .upsert({
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: `${userData.firstName} ${userData.lastName}`,
          phone: userData.phone,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Rastrear captura de dados
      trackFormSubmit(userData, "user-capture");
      trackConversion("name_capture", userData);
      trackConversion("email_capture", userData);

      if (userData.phone) {
        trackConversion("phone_capture", userData);
      }

      return { success: true, profile };
    } catch (error) {
      console.error("Erro ao capturar dados do usuário:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    captureUserData,
    isSubmitting,
  };
};
```

---

## 📋 **5. COMPONENTES DE FORMULÁRIO COM TRACKING**

### **5.1 Componente de Captura de Nome (Step 1)**

```typescript
// src/components/forms/UserDataCaptureForm.tsx
export const UserDataCaptureForm: React.FC = () => {
  const { captureUserData, isSubmitting } = useUserDataCapture();
  const { trackClick } = useQuizAnalytics(1, 'user-data-form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Rastrear interação com input
    trackClick(`input-${field}`, 'input', field, { value: value.length > 0 ? 'filled' : 'empty' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rastrear tentativa de envio
    trackClick('submit-button', 'button', 'Enviar Dados', { formData });

    const result = await captureUserData(formData);

    if (result.success) {
      // Navegar para próxima etapa
      console.log('Dados capturados com sucesso!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Primeiro Nome"
        value={formData.firstName}
        onChange={(e) => handleInputChange('firstName', e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Sobrenome"
        value={formData.lastName}
        onChange={(e) => handleInputChange('lastName', e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Telefone (opcional)"
        value={formData.phone}
        onChange={(e) => handleInputChange('phone', e.target.value)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        onClick={() => trackClick('submit-button', 'button', 'Submit Form')}
      >
        {isSubmitting ? 'Enviando...' : 'Continuar'}
      </button>
    </form>
  );
};
```

---

## 📊 **6. SISTEMA DE CÁLCULO DE RESULTADOS (Step 20)**

### **6.1 Hook de Resultados Integrado com Analytics**

```typescript
// src/hooks/useQuizResultsWithAnalytics.ts
export const useQuizResultsWithAnalytics = () => {
  const { calculateCategoryScores, applyCalculationMethod, determineResult } = useQuizResults();
  const { trackConversion } = useQuizAnalytics(20, "quiz-results");

  const calculateAndSaveResults = async (
    answers: Map<string, QuestionOption[]>,
    config: QuizResultsConfig
  ) => {
    // 1. Calcular pontuações
    const categoryScores = calculateCategoryScores(answers);
    const winningCategory = applyCalculationMethod(categoryScores, config.calculationMethod);
    const finalResult = determineResult(winningCategory, config.results, answers);

    // 2. Calcular métricas detalhadas
    const metrics = {
      totalQuestions: answers.size,
      totalPoints: Array.from(answers.values())
        .flat()
        .reduce((sum, opt) => sum + (opt.points || 0), 0),
      categoryBreakdown: categoryScores,
      completionRate: (answers.size / 19) * 100, // 19 steps de perguntas
      timeToComplete: Date.now(), // será calculado no frontend
    };

    // 3. Salvar resultado no Supabase
    const supabaseClient = createClientComponentClient();
    const { data: attempt } = await supabaseClient
      .from("quiz_attempts")
      .insert({
        answers: Object.fromEntries(answers),
        score: metrics.totalPoints,
        completed_at: new Date().toISOString(),
        // quiz_id e user_id serão preenchidos via RLS/trigger
      })
      .select()
      .single();

    // 4. Rastrear conclusão do quiz
    trackConversion("quiz_complete", {
      result: finalResult,
      score: metrics.totalPoints,
      categories: categoryScores,
      attemptId: attempt?.id,
    });

    return {
      result: finalResult,
      metrics,
      attemptId: attempt?.id,
    };
  };

  return {
    calculateAndSaveResults,
  };
};
```

---

## 🎨 **7. IMPLEMENTAÇÃO PRÁTICA**

### **7.1 Cronograma de Implementação**

#### **Fase 1: Infraestrutura (Semana 1)**

- [ ] Criar migrations do Supabase
- [ ] Implementar AnalyticsService
- [ ] Criar hook useQuizAnalytics
- [ ] Configurar variáveis de ambiente

#### **Fase 2: Integração de Formulários (Semana 2)**

- [ ] Implementar useUserDataCapture
- [ ] Criar UserDataCaptureForm
- [ ] Integrar tracking em componentes existentes
- [ ] Testar captura de dados

#### **Fase 3: Tracking Completo (Semana 3)**

- [ ] Implementar tracking em todos os 20 steps
- [ ] Adicionar rastreamento de cliques em opções
- [ ] Configurar flush automático de eventos
- [ ] Implementar dashboard básico

#### **Fase 4: Resultados e Analytics (Semana 4)**

- [ ] Integrar sistema de resultados com analytics
- [ ] Implementar queries de análise
- [ ] Criar relatórios de conversão
- [ ] Otimizar performance

### **7.2 Configuração de Ambiente**

```env
# .env.local
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ANALYTICS_BATCH_SIZE=10
NEXT_PUBLIC_ANALYTICS_FLUSH_INTERVAL=30000
```

### **7.3 Queries Úteis para Análise**

```sql
-- Taxa de conversão por step
SELECT
  step_number,
  COUNT(*) as total_interactions,
  COUNT(CASE WHEN action_type = 'form_submit' THEN 1 END) as conversions,
  (COUNT(CASE WHEN action_type = 'form_submit' THEN 1 END) * 100.0 / COUNT(*)) as conversion_rate
FROM quiz_step_tracking
GROUP BY step_number
ORDER BY step_number;

-- Funil de abandono
WITH step_funnel AS (
  SELECT
    step_number,
    COUNT(DISTINCT session_id) as unique_sessions
  FROM quiz_step_tracking
  WHERE action_type = 'step_enter'
  GROUP BY step_number
)
SELECT
  step_number,
  unique_sessions,
  LAG(unique_sessions) OVER (ORDER BY step_number) as previous_step,
  CASE
    WHEN LAG(unique_sessions) OVER (ORDER BY step_number) IS NULL THEN NULL
    ELSE (unique_sessions * 100.0 / LAG(unique_sessions) OVER (ORDER BY step_number))
  END as retention_rate
FROM step_funnel
ORDER BY step_number;
```

---

## ⚡ **PRÓXIMOS PASSOS IMEDIATOS**

1. **Criar as migrations do Supabase**
2. **Implementar o AnalyticsService básico**
3. **Integrar tracking no Step 1 (captura de nome)**
4. **Testar o fluxo completo com dados reais**
5. **Expandir para todos os steps gradualmente**

Este plano fornece uma base sólida para coleta de dados, análise de comportamento e otimização da jornada do usuário no seu quiz!
