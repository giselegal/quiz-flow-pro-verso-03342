/**
 * 🎯 QUIZ EDITOR INTEGRATED PAGE - FASE 1 IMPLEMENTADA
 * 
 * Página integrada que permite editar o quiz-estilo no ambiente
 * do editor unificado. Esta é a implementação da Fase 1 do plano.
 * 
 * URL: /editor?template=quiz-estilo-21-steps
 */

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { TOTAL_STEPS } from '@/config/stepsConfig';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Target, Brain, Settings, Crown,
  CheckCircle, AlertTriangle, Info,
  Clock, Save, RotateCcw, RotateCw,
} from 'lucide-react';

// Providers necessários
import { SuperUnifiedProvider } from '@/contexts/providers/SuperUnifiedProviderV2';
import { SuperUnifiedProviderV3 } from '@/contexts/providers/SuperUnifiedProviderV3';
import { FunnelContext } from '@/core/contexts/FunnelContext';

// Components especializados
import QuizEditorMode from '@/components/editor/modes/QuizEditorMode';

// Hooks
import { useUnifiedStepNavigation } from '@/hooks/useUnifiedStepNavigation';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';
import { useNotification } from '@/components/ui/Notification';
import { useEditorPersistence } from '@/hooks/useEditorPersistence';
import { useSuperUnified } from '@/hooks/useSuperUnified';

// Services
import { QuizToEditorAdapter } from '@/lib/adapters/QuizToEditorAdapter';
import { appLogger } from '@/lib/utils/appLogger';

interface QuizEditorIntegratedPageProps {
  funnelId?: string;
  className?: string;
}

interface QuizEditorState {
  isLoaded: boolean;
  hasError: boolean;
  errorMessage: string;
  totalSteps: number;
  currentStep: number;
  quizMetadata: any;
}

const QuizEditorIntegratedPageCore: React.FC<QuizEditorIntegratedPageProps> = ({
  funnelId,
  className = '',
}) => {
  // Estado local
  const [state, setState] = useState<QuizEditorState>({
    isLoaded: false,
    hasError: false,
    errorMessage: '',
    totalSteps: TOTAL_STEPS,
    currentStep: 1,
    quizMetadata: null,
  });

  // Hooks
  const navigation = useUnifiedStepNavigation();
  const templateLoader = useTemplateLoader();
  const { addNotification } = useNotification();
  const { getStepBlocks } = useSuperUnified();

  // Obter blocos do step atual
  const currentStepBlocks = getStepBlocks(state.currentStep);

  // 🆕 HOOK DE PERSISTÊNCIA AUTOMÁTICA
  const {
    isSaving,
    lastSaved,
    error: persistenceError,
    saveNow,
    canUndo: canUndoPersistence,
    canRedo: canRedoPersistence,
    undo: undoPersistence,
    redo: redoPersistence,
    clearError
  } = useEditorPersistence(
    funnelId || 'quiz-estilo-21-steps',
    state.currentStep,
    currentStepBlocks,
    {
      autoSave: true,
      debounceMs: 1000,
      enableHistory: true,
      onSaveSuccess: () => {
        appLogger.info('💾 Auto-save concluído');
      },
      onSaveError: (err) => {
        appLogger.error('❌ Erro no auto-save:', { data: [err] });
      }
    }
  );  // Carregar dados do quiz na inicialização
  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, hasError: false, errorMessage: '' }));

      appLogger.info('🎯 Carregando dados do quiz para edição...');

      // Converter quiz para formato do editor
      const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

      if (!QuizToEditorAdapter.validateQuizData(editorData)) {
        throw new Error('Dados do quiz inválidos após conversão');
      }

      setState(prev => ({
        ...prev,
        isLoaded: true,
        totalSteps: editorData.totalSteps,
        quizMetadata: editorData.quizMetadata,
      }));

      addNotification('✅ Quiz carregado com sucesso no editor', 'success');

      appLogger.info('✅ Quiz carregado:', {
        data: [{
          totalSteps: editorData.totalSteps,
          stepsConverted: Object.keys(editorData.stepBlocks).length,
          metadata: editorData.quizMetadata,
        }]
      });

    } catch (error) {
      appLogger.error('❌ Erro ao carregar quiz:', { data: [error] });

      setState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      }));

      addNotification('❌ Erro ao carregar quiz no editor', 'error');
    }
  }, [funnelId, addNotification]);

  // Handlers
  const handleSave = useCallback(async () => {
    try {
      appLogger.info('💾 Salvando alterações do quiz manualmente...');

      // 🆕 Usar persistência do hook (sem debounce)
      await saveNow();

      addNotification('💾 Quiz salvo com sucesso', 'success');
    } catch (error) {
      appLogger.error('❌ Erro ao salvar:', { data: [error] });
      addNotification('❌ Erro ao salvar quiz', 'error');
    }
  }, [saveNow, addNotification]);

  const handlePreview = useCallback(() => {
    appLogger.info('👁️ Abrindo preview do quiz...');

    // Abrir em nova aba o quiz funcional
    const previewUrl = `/quiz-estilo${funnelId ? `?funnel=${funnelId}` : ''}`;
    window.open(previewUrl, '_blank');

    addNotification('👁️ Preview aberto em nova aba', 'info');
  }, [funnelId, addNotification]);

  const handleReturnToQuiz = useCallback(() => {
    const quizUrl = `/quiz-estilo${funnelId ? `?funnel=${funnelId}` : ''}`;
    window.location.href = quizUrl;
  }, [funnelId]);

  // Loading state
  if (!state.isLoaded && !state.hasError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-lg font-semibold mb-2">Carregando Quiz Editor</h3>
          <p className="text-muted-foreground">Convertendo quiz para modo de edição...</p>
          <Badge variant="outline" className="mt-2">Fase 1 - Adaptador Ativo</Badge>
        </div>
      </div>
    );
  }

  // Error state
  if (state.hasError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px] p-6">
        <Card className="max-w-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <CardTitle>Erro ao Carregar Quiz</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {state.errorMessage}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={loadQuizData} variant="default">
                Tentar Novamente
              </Button>
              <Button onClick={handleReturnToQuiz} variant="outline">
                Voltar ao Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main editor interface
  return (
    <div className={`quiz-editor-integrated-page h-full flex flex-col ${className}`}>
      {/* 🆕 Alerta de erro de persistência */}
      {persistenceError && (
        <Alert className="m-4 border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Erro ao salvar alterações: {persistenceError.message}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSave}>
                Tentar Novamente
              </Button>
              <Button size="sm" variant="ghost" onClick={clearError}>
                Ignorar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header informativo */}
      <div className="bg-primary/10 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Quiz Editor</h1>
              <Badge variant="secondary">FASE 1 - Implementado</Badge>
            </div>

            {funnelId && (
              <Badge variant="outline">
                Funil: {funnelId}
              </Badge>
            )}

            <Badge variant="outline">
              {state.totalSteps} Etapas
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* 🆕 Status de salvamento */}
            {isSaving && (
              <Badge variant="outline" className="animate-pulse">
                <Save className="w-3 h-3 mr-1 animate-spin" />
                Salvando...
              </Badge>
            )}

            {lastSaved && !isSaving && (
              <Badge variant="outline" className="text-green-600 border-green-600/40">
                <CheckCircle className="w-3 h-3 mr-1" />
                Salvo {new Date(lastSaved).toLocaleTimeString()}
              </Badge>
            )}

            {persistenceError && (
              <Badge variant="outline" className="text-red-600 border-red-600/40">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Erro ao salvar
              </Badge>
            )}

            {/* Undo/Redo */}
            <Button
              variant="outline"
              size="sm"
              onClick={undoPersistence}
              disabled={!canUndoPersistence}
              title="Desfazer"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={redoPersistence}
              disabled={!canRedoPersistence}
              title="Refazer"
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            {/* Salvar manualmente */}
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Informações do quiz */}
        <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Quiz de Estilo Pessoal - {state.totalSteps} Etapas</span>
          </div>

          {state.quizMetadata && (
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{state.quizMetadata.styles?.length || 8} estilos disponíveis</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Adaptador Quiz→Editor ativo</span>
          </div>

          {/* 🆕 Indicador de auto-save */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span>Auto-save: {isSaving ? 'Salvando...' : 'Ativo'}</span>
          </div>
        </div>
      </div>

      {/* Editor principal */}
      <div className="flex-1 overflow-hidden">
        <QuizEditorMode
          funnelId={funnelId}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      </div>
    </div>
  );
};

// Wrapped component with providers
const QuizEditorIntegratedPage: React.FC<QuizEditorIntegratedPageProps> = (props) => {
  return (
    <SuperUnifiedProviderV3>
      <SuperUnifiedProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Carregando Quiz Editor...</p>
            </div>
          </div>
        }>
          <QuizEditorIntegratedPageCore {...props} />
        </Suspense>
      </SuperUnifiedProvider>
    </SuperUnifiedProviderV3>
  );
};

export default QuizEditorIntegratedPage;
