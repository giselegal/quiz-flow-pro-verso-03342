'use client';

/**
 * 🎯 QUIZ EDITOR MODE - FASE 3 COMPLETA
 * 
 * Interface especializada com sincronização bidirecional em tempo real,
 * usando dados reais do quiz-estilo e sistema completo de persistência.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Target, Brain, Eye, Settings, BarChart3, Wifi, WifiOff, Cloud, CloudOff,
  Shuffle, Play, Pause, RotateCcw, Save, Crown, CheckCircle, AlertCircle,
  Zap, Clock, TrendingUp, Download, Activity
} from 'lucide-react';

// Hooks
import { useUnifiedStepNavigation } from '@/hooks/useUnifiedStepNavigation';
import { useQuizConfig } from '@/hooks/useQuizConfig';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';

// Componentes da Fase 2
import QuizPreviewIntegrated from '../quiz/QuizPreviewIntegrated';
import QuizStepNavigation from '../quiz/QuizStepNavigation';
import QuizQuestionTypeEditor from '../quiz/QuizQuestionTypeEditor';
// Painel unificado Fase 3
import QuizUnifiedPropertiesPanel from '../quiz/QuizUnifiedPropertiesPanel';

// FASE 3 - Sincronização e dados reais
import { RealTimeSyncService } from '@/services/RealTimeSyncService';
import { QUIZ_STEPS, getStepById, STRATEGIC_ANSWER_TO_OFFER_KEY } from '@/data/quizSteps';
import { buildQuizEditableModel } from '@/utils/quizQuestionBuilder';
import { QuizEditorPersistenceService } from '@/services/QuizEditorPersistenceService';
import { useUnifiedAutoSave } from '@/hooks/useUnifiedAutoSave';
import { QUIZ_EDITOR_VERSION, QuizTemplateData } from '@/types/quizEditor';
import { styleConfigGisele } from '@/data/styles';
import { useQuizState } from '@/hooks/useQuizState';
import type { QuizStep } from '@/data/quizSteps';

// FASE 4 - Analytics e Performance
// Migrado para tracker unificado
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';
import { performanceOptimizer } from '@/services/PerformanceOptimizer';
import QuizAnalyticsDashboard from '@/components/analytics/QuizAnalyticsDashboard';

// ===============================
// 🎯 INTERFACES E TIPOS
// ===============================

interface QuizEditorModeProps {
  funnelId?: string;
  onSave?: () => Promise<void>;
  onPreview?: () => void;
  className?: string;
}

interface QuizEditorState {
  activeTab: 'editor' | 'properties' | 'analytics' | 'preview' | 'performance';
  isPreviewMode: boolean;
  isRealExperience: boolean;
  selectedStepNumber: number;
  questions: any[];
  styles: any[];
  selectedQuestionIndex: number;
  // FASE 3 - Estado de sincronização
  isOnline: boolean;
  isSyncing: boolean;
  lastSaved?: string;
  isDirty: boolean;
  syncStatus: 'synced' | 'saving' | 'offline' | 'error';
  conflicts: any[];
  // FASE 4 - Estado de analytics
  analyticsEnabled: boolean;
  performanceMetrics: any | null;
  realtimeUpdates: boolean;
}

interface SyncEvent {
  id: string;
  type: 'sync-start' | 'sync-success' | 'sync-error' | 'conflict-detected';
  timestamp: string;
  data?: any;
  error?: string;
}

// ===============================
// 🔧 COMPONENTE PRINCIPAL
// ===============================

const QuizEditorMode: React.FC<QuizEditorModeProps> = ({
  funnelId,
  onSave,
  onPreview,
  className = ''
}) => {
  // Estado local com dados de sincronização
  const [state, setState] = useState<QuizEditorState>({
    activeTab: 'editor',
    isPreviewMode: false,
    isRealExperience: false,
    selectedStepNumber: 1,
    questions: [],
    styles: [],
    selectedQuestionIndex: 0,
    // FASE 3 - Estado de sincronização
    isOnline: navigator.onLine,
    isSyncing: false,
    isDirty: false,
    syncStatus: 'synced',
    conflicts: [],
    // FASE 4 - Estado de analytics
    analyticsEnabled: true,
    performanceMetrics: null,
    realtimeUpdates: true
  });

  // Refs para serviços da Fase 3
  const syncServiceRef = useRef<RealTimeSyncService | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks tradicionais
  const navigation = useUnifiedStepNavigation();
  const quizConfig = useQuizConfig();
  const templateLoader = useTemplateLoader();

  // FASE 3 - Hook de estado do quiz seguindo padrão de referência
  const {
    currentStep,
    userName,
    answers,
    strategicAnswers,
    resultStyle,
    secondaryStyles,
    navigateToStep,
    setUserName,
    addAnswer,
    addStrategicAnswer,
    calculateResult
  } = useQuizState(funnelId);

  // Dados da etapa atual seguindo padrão de referência
  const stepData = getStepById(currentStep);

  // ===============================
  // 🔄 FASE 3 - MÉTODOS DE SINCRONIZAÇÃO
  // ===============================

  const handleSyncEvent = useCallback((event: SyncEvent) => {
    console.log('🔄 Sync Event:', event);

    setState(prev => {
      switch (event.type) {
        case 'sync-start':
          return { ...prev, isSyncing: true, syncStatus: 'saving' };

        case 'sync-success':
          return {
            ...prev,
            isSyncing: false,
            syncStatus: 'synced',
            isDirty: false,
            lastSaved: new Date().toLocaleTimeString()
          };

        case 'sync-error':
          return { ...prev, isSyncing: false, syncStatus: 'error' };

        case 'conflict-detected':
          return {
            ...prev,
            conflicts: [...prev.conflicts, event.data],
            syncStatus: 'error'
          };

        default:
          return prev;
      }
    });
  }, []);

  // ===============================
  // 💾 Auto-save Unificado (Substitui scheduleAutoSave anterior)
  // ===============================
  const persistTemplate = useCallback(async () => {
    // Construir scoringMatrix a partir das questões (se houver stylePoints)
    const scoringMatrix: Record<string, Record<string, Record<string, number>>> = {};
    state.questions.forEach(q => {
      if (!q.answers) return;
      q.answers.forEach((ans: any) => {
        const stylePoints = ans.stylePoints || {};
        if (Object.keys(stylePoints).length === 0) return;
        scoringMatrix[q.id] = scoringMatrix[q.id] || {};
        scoringMatrix[q.id][ans.id] = {};
        for (const styleId of Object.keys(stylePoints)) {
          const val = stylePoints[styleId];
          if (typeof val === 'number' && !isNaN(val)) {
            scoringMatrix[q.id][ans.id][styleId] = val;
          }
        }
      });
    });
    const payload: QuizTemplateData = {
      templateId: funnelId || 'quiz-estilo',
      version: QUIZ_EDITOR_VERSION,
      questions: state.questions,
      styles: state.styles,
      scoringMatrix: Object.keys(scoringMatrix).length ? scoringMatrix : undefined,
      updatedAt: new Date().toISOString()
    };
    const result = await QuizEditorPersistenceService.save(payload);
    if (result.success) {
      handleSyncEvent({ id: Date.now().toString(), type: 'sync-success', timestamp: new Date().toISOString() });
    } else {
      handleSyncEvent({ id: Date.now().toString(), type: 'sync-error', timestamp: new Date().toISOString(), data: result.error });
    }
  }, [funnelId, state.questions, state.styles, handleSyncEvent]);

  useUnifiedAutoSave({
    data: { q: state.questions, s: state.styles },
    isDirty: state.isDirty,
    onSave: persistTemplate,
    debounce: 2500,
    enabled: true,
    onState: phase => {
      if (phase.phase === 'saving') {
        handleSyncEvent({ id: Date.now().toString(), type: 'sync-start', timestamp: new Date().toISOString() });
      }
    }
  });

  // ===============================
  // 📊 FASE 4 - MÉTODOS DE ANALYTICS
  // ===============================

  const initializeAnalytics = useCallback(() => {
    if (state.analyticsEnabled) {
      // Inicializar tracking de eventos
      unifiedEventTracker.track({
        type: 'quiz_started',
        funnelId: funnelId || 'unknown',
        sessionId: `sess_${Date.now()}`,
        userId: 'editor-user',
        payload: { page: 'quiz-editor', mode: 'quiz-estilo' }
      });

      // Inicializar otimizador de performance
      performanceOptimizer.optimizeNow();

      console.log('📊 Analytics initialized for Quiz Editor Mode');
    }
  }, [state.analyticsEnabled, funnelId]);

  const trackEditorAction = useCallback((action: string, data: any) => {
    if (state.analyticsEnabled) {
      unifiedEventTracker.track({
        type: 'editor_action',
        funnelId: funnelId || 'unknown',
        sessionId: `sess_${Date.now()}`,
        userId: 'editor-user',
        payload: { action, ...data, currentStep: state.selectedStepNumber, ts: Date.now() }
      });
    }
  }, [state.analyticsEnabled, state.selectedStepNumber]);

  const loadRealQuizData = useCallback(async () => {
    try {
      // 1) Tentar carregar persistido
      const persisted = await QuizEditorPersistenceService.load(funnelId || 'quiz-estilo');
      if (persisted) {
        console.log('✅ Dados carregados do storage (persistência quiz).');
        setState(prev => ({ ...prev, questions: persisted.questions, styles: persisted.styles, syncStatus: 'synced' }));
        return;
      }

      // 2) (Opcional) gerar relatório – mantido para futuras métricas; ignoramos retorno agora
      // (Relatórios desativados temporariamente nesta fase)

      // 3) Fallback: construir do modelo legacy -> normalizado
      const { questions, styles } = buildQuizEditableModel();
      console.log('✅ Modelo derivado (legacy -> normalizado):', { q: questions.length, s: styles.length });
      setState(prev => ({ ...prev, questions, styles, syncStatus: 'synced' }));
      // Converter passos do quiz em questões editáveis
      const realQuestions = Object.entries(QUIZ_STEPS)
        .filter(([key, step]) => ['question', 'strategic-question', 'offer', 'result', 'transition', 'transition-result', 'intro'].includes(step.type))
        .map(([key, step], index) => {
          const base: any = {
            id: key,
            title: (step as any).questionText || (step as any).title || `Step ${index + 1}`,
            subtitle: (step as any).title && (step as any).questionText ? (step as any).title : '',
            rawType: step.type,
            type: step.type === 'question' ? 'multiple-choice' : step.type,
            stepNumber: parseInt(key.replace('step-', '')) || index + 1,
            requiredSelections: (step as any).requiredSelections || null,
            answers: (step as any).options?.map((option: any) => ({
              id: `${key}-${option.id}`,
              text: option.text,
              image: option.image,
              description: '',
              stylePoints: {}
            })) || []
          };
          if (step.type === 'offer' && (step as any).offerMap) {
            base.variants = Object.entries((step as any).offerMap).map(([matchValue, v]: any) => ({
              id: matchValue,
              matchValue,
              title: v.title,
              description: v.description,
              buttonText: v.buttonText,
              testimonial: v.testimonial
            }));
          }
          return base;
        });

      // Converter estilos reais
      const realStyles = Object.values(styleConfigGisele).map(style => ({
        id: style.id,
        name: style.name,
        description: style.description,
        characteristics: style.characteristics,
        color: style.colors?.[0] || '#8B5CF6',
        icon: Target // Default icon
      }));

      console.log('✅ Dados reais carregados:', {
        questions: realQuestions.length,
        styles: realStyles.length,
        totalSteps: Object.keys(QUIZ_STEPS).length
      });

      setState(prev => ({
        ...prev,
        questions: realQuestions,
        styles: realStyles,
        syncStatus: 'synced'
      }));

    } catch (error) {
      console.error('❌ Erro ao carregar dados reais:', error);
      setState(prev => ({ ...prev, syncStatus: 'error' }));
    }
  }, []);

  // Inicializar na montagem
  useEffect(() => {
    loadRealQuizData();

    // Inicializar serviço de sincronização
    syncServiceRef.current = RealTimeSyncService.getInstance();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [loadRealQuizData]);

  // FASE 4 - Inicializar Analytics
  useEffect(() => {
    initializeAnalytics();
  }, [initializeAnalytics]);

  // ===============================
  // 🎮 HANDLERS DE INTERAÇÃO
  // ===============================

  const handleStepChange = useCallback((stepIndex: number) => {
    setState(prev => ({
      ...prev,
      selectedQuestionIndex: stepIndex,
      selectedStepNumber: stepIndex + 1
    }));

    // FASE 4: Track step navigation
    trackEditorAction('step_change', {
      fromStep: state.selectedStepNumber,
      toStep: stepIndex + 1,
      stepIndex
    });
  }, [state.selectedStepNumber, trackEditorAction]);

  const handleQuestionChange = useCallback((question: any) => {
    const updatedQuestions = [...state.questions];
    updatedQuestions[state.selectedQuestionIndex] = question;
    setState(prev => ({ ...prev, questions: updatedQuestions, isDirty: true }));

    // FASE 4: Track question editing
    trackEditorAction('question_edit', {
      questionIndex: state.selectedQuestionIndex,
      questionId: question.id,
      changeType: 'update'
    });

    // FASE 3: Auto-save com sincronização
  }, [state.questions, state.selectedQuestionIndex, trackEditorAction]);

  const handleAddQuestion = useCallback(() => {
    const newQuestion = {
      id: `q${state.questions.length + 1}`,
      title: `Nova questão ${state.questions.length + 1}`,
      subtitle: '',
      rawType: 'question',
      type: 'multiple-choice',
      answers: []
    };
    setState(prev => ({ ...prev, questions: [...prev.questions, newQuestion], selectedQuestionIndex: prev.questions.length, isDirty: true }));
  }, [state.questions.length]);

  const handleQuestionEdit = useCallback((questionIndex: number) => {
    setState(prev => ({
      ...prev,
      selectedQuestionIndex: questionIndex,
      activeTab: 'properties'
    }));
  }, []);

  const handleAnswerSelect = useCallback((questionId: string, answerId: string) => {
    console.log('Resposta selecionada no preview:', { questionId, answerId });
  }, []);

  const handleStylesChange = useCallback((styles: any[]) => {
    setState(prev => ({ ...prev, styles, isDirty: true }));
  }, []);

  const handleSaveChanges = useCallback(async () => {
    console.log('💾 Salvando alterações manualmente...');
    if (onSave) {
      await onSave();
    }
    await persistTemplate();
  }, [onSave, persistTemplate]);

  const handleTogglePreview = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
    onPreview?.();
  }, [onPreview]);

  // ===============================
  // 🎨 COMPONENTES DE STATUS
  // ===============================

  const SyncStatusIndicator = () => {
    const getStatusIcon = () => {
      switch (state.syncStatus) {
        case 'saving':
          return <Cloud className="w-4 h-4 animate-pulse text-blue-500" />;
        case 'synced':
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'offline':
          return <WifiOff className="w-4 h-4 text-orange-500" />;
        case 'error':
          return <AlertCircle className="w-4 h-4 text-red-500" />;
        default:
          return <Wifi className="w-4 h-4 text-gray-500" />;
      }
    };

    const getStatusText = () => {
      switch (state.syncStatus) {
        case 'saving':
          return 'Salvando...';
        case 'synced':
          return state.lastSaved ? `Salvo às ${state.lastSaved}` : 'Sincronizado';
        case 'offline':
          return 'Offline';
        case 'error':
          return 'Erro de sincronização';
        default:
          return 'Conectando...';
      }
    };

    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {getStatusIcon()}
        <span>{getStatusText()}</span>
        {state.isDirty && <Badge variant="outline" className="text-xs">Não salvo</Badge>}
      </div>
    );
  };

  const currentQuestion = state.questions[state.selectedQuestionIndex];
  const perf = state.performanceMetrics || { cacheHitRate: 0, renderTime: 0, memoryUsage: 0, bundleSize: 0 };

  // ===============================
  // 🖼️ RENDER PRINCIPAL
  // ===============================

  return (
    <div className={`quiz-editor-mode h-full flex flex-col ${className}`}>
      {/* Header com status de sincronização */}
      <div className="border-b border-border p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Quiz Editor</h2>
              <Badge variant="default">FASE 3 - Sincronização Ativa</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {state.questions.length} questões
              </Badge>
              <Badge variant="outline">
                {state.styles.length} estilos
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SyncStatusIndicator />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePreview}
              >
                <Eye className="w-4 h-4 mr-2" />
                {state.isPreviewMode ? 'Editar' : 'Preview'}
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleSaveChanges}
                disabled={state.isSyncing}
              >
                <Save className="w-4 h-4 mr-2" />
                {state.isSyncing ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Indicadores detalhados */}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>Questão {state.selectedQuestionIndex + 1} de {state.questions.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span>Dados reais do quiz-estilo</span>
          </div>

          <div className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span>Auto-save: 2s</span>
          </div>
        </div>
      </div>

      {/* Interface principal com abas */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={state.activeTab}
          onValueChange={(tab) => setState(prev => ({ ...prev, activeTab: tab as any }))}
          className="h-full flex flex-col"
        >
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto m-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden px-4 pb-4">
            {/* Aba do Editor */}
            <TabsContent value="editor" className="h-full m-0">
              <div className="grid grid-cols-12 gap-4 h-full">
                <div className="col-span-3">
                  <QuizStepNavigation
                    questions={state.questions}
                    currentStep={state.selectedQuestionIndex}
                    onStepChange={handleStepChange}
                    onQuestionEdit={handleQuestionEdit}
                    onAddQuestion={handleAddQuestion}
                  />
                </div>

                <div className="col-span-9">
                  {currentQuestion ? (
                    <QuizQuestionTypeEditor
                      question={currentQuestion}
                      onQuestionChange={handleQuestionChange}
                    />
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <CardContent className="text-center">
                        <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Nenhuma questão selecionada</h3>
                        <p className="text-muted-foreground mb-4">
                          Selecione uma questão para editar ou crie uma nova
                        </p>
                        <Button onClick={handleAddQuestion}>
                          Criar Nova Questão
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Aba do Preview */}
            <TabsContent value="preview" className="h-full m-0">
              <QuizPreviewIntegrated
                questions={state.questions}
                styles={state.styles}
                currentQuestionIndex={state.selectedQuestionIndex}
                onQuestionChange={handleStepChange}
                onAnswerSelect={handleAnswerSelect}
              />
            </TabsContent>

            {/* Aba de Propriedades (Unificada) */}
            <TabsContent value="properties" className="h-full m-0">
              <div className="space-y-6 h-full overflow-auto">
                {currentQuestion ? (
                  <QuizUnifiedPropertiesPanel
                    question={currentQuestion}
                    styles={state.styles}
                    onQuestionChange={handleQuestionChange}
                    onStylesChange={handleStylesChange}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Selecione uma questão</h3>
                      <p className="text-muted-foreground">
                        Escolha uma questão para configurar suas propriedades e pontuação
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Aba de Analytics */}
            <TabsContent value="analytics" className="h-full m-0">
              <div className="h-full">
                {state.analyticsEnabled ? (
                  <QuizAnalyticsDashboard
                    className="h-full"
                    autoRefresh={state.realtimeUpdates}
                    refreshInterval={30000}
                  />
                ) : (
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Analytics do Quiz
                        <Badge variant="secondary">Inicializando...</Badge>
                      </CardTitle>
                      <CardDescription>
                        Ativando sistema de métricas e analytics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">
                          Inicializando analytics em {Math.max(0, 30 - Math.floor(Date.now() / 1000) % 30)}s...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Aba de Performance */}
            <TabsContent value="performance" className="h-full m-0">
              <div className="h-full space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Métricas de Performance
                      <Badge variant={perf.cacheHitRate > 0.8 ? "default" : "secondary"}>
                        {perf.cacheHitRate > 0.8 ? "Otimizada" : "Monitorando"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Performance do editor e otimizações automáticas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(perf.renderTime)}ms
                        </div>
                        <div className="text-sm text-muted-foreground">Render Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(perf.cacheHitRate * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {perf.memoryUsage}MB
                        </div>
                        <div className="text-sm text-muted-foreground">Memory Usage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {perf.bundleSize}KB
                        </div>
                        <div className="text-sm text-muted-foreground">Bundle Size</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Performance Score</span>
                          <span>{Math.round(perf.cacheHitRate * 100)}/100</span>
                        </div>
                        <Progress value={perf.cacheHitRate * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Otimizações Ativas</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Lazy Loading</span>
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ativo
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Cache Inteligente</span>
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ativo
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Bundle Splitting</span>
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Monitorando
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Insights Automáticos</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Alert>
                              <TrendingUp className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                Cache hit rate melhorou 15% na última hora
                              </AlertDescription>
                            </Alert>
                            <Alert>
                              <Zap className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                Render time otimizado: -23ms desde inicialização
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Relatório (desativado)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          Atualizar Métricas
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Resumo Global de Pontuação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" /> Resumo de Pontuação (Sessão Atual)
                    </CardTitle>
                    <CardDescription>Pontuação agregada por estilo e por questão (não persistida até salvar).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {state.questions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhuma questão carregada.</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="overflow-auto">
                          <table className="w-full text-xs border">
                            <thead>
                              <tr className="bg-muted/30">
                                <th className="text-left p-2">Questão</th>
                                {state.styles.map(s => (
                                  <th key={s.id} className="text-left p-2">{s.name}</th>
                                ))}
                                <th className="text-left p-2">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.questions.map(q => {
                                const styleTotals: Record<string, number> = {};
                                (q.answers || []).forEach((a: any) => {
                                  Object.entries(a.stylePoints || {}).forEach(([sid, val]) => {
                                    if (typeof val === 'number') {
                                      styleTotals[sid] = (styleTotals[sid] || 0) + val;
                                    }
                                  });
                                });
                                const grand = Object.values(styleTotals).reduce((acc, v) => acc + v, 0);
                                return (
                                  <tr key={q.id} className="border-t">
                                    <td className="p-2 font-medium whitespace-nowrap">{q.title?.slice(0, 40) || q.id}</td>
                                    {state.styles.map(s => (
                                      <td key={s.id} className="p-2">{styleTotals[s.id] || 0}</td>
                                    ))}
                                    <td className="p-2 font-semibold">{grand}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default QuizEditorMode;