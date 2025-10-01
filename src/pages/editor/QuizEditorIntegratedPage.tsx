/**
 * 🎯 QUIZ EDITOR INTEGRATED PAGE - FASE 1 IMPLEMENTADA
 * 
 * Página integrada que permite editar o quiz-estilo no ambiente
 * do editor unificado. Esta é a implementação da Fase 1 do plano.
 * 
 * URL: /editor?template=QUIZ_ESTILO_TEMPLATE_ID (valor atual: quiz-estilo-21-steps)
 */

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { QUIZ_ESTILO_TEMPLATE_ID } from '../../domain/quiz/quiz-estilo-ids';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Target, Brain, Settings, Crown,
  CheckCircle, AlertTriangle, Info
} from 'lucide-react';

// Providers necessários
import { EditorProvider } from '@/components/editor/provider-alias';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import UnifiedCRUDProvider from '@/context/UnifiedCRUDProvider';

// Components especializados
import QuizEditorMode from '@/components/editor/modes/QuizEditorMode';

// Hooks
import { useUnifiedStepNavigation } from '@/hooks/useUnifiedStepNavigation';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';
import { useNotification } from '@/components/ui/Notification';

// Services
import { QuizToEditorAdapter } from '@/adapters/QuizToEditorAdapter';

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
  className = ''
}) => {
  // Estado local
  const [state, setState] = useState<QuizEditorState>({
    isLoaded: false,
    hasError: false,
    errorMessage: '',
    totalSteps: 21,
    currentStep: 1,
    quizMetadata: null
  });

  // Hooks
  const navigation = useUnifiedStepNavigation();
  const templateLoader = useTemplateLoader();
  const { addNotification } = useNotification();

  // Carregar dados do quiz na inicialização
  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, hasError: false, errorMessage: '' }));

      console.log('🎯 Carregando dados do quiz para edição...');

      // Converter quiz para formato do editor
      const editorData = await QuizToEditorAdapter.convertQuizToEditor(funnelId);

      if (!QuizToEditorAdapter.validateQuizData(editorData)) {
        throw new Error('Dados do quiz inválidos após conversão');
      }

      setState(prev => ({
        ...prev,
        isLoaded: true,
        totalSteps: editorData.totalSteps,
        quizMetadata: editorData.quizMetadata
      }));

      addNotification('✅ Quiz carregado com sucesso no editor', 'success');

      console.log('✅ Quiz carregado:', {
        totalSteps: editorData.totalSteps,
        stepsConverted: Object.keys(editorData.stepBlocks).length,
        metadata: editorData.quizMetadata
      });

    } catch (error) {
      console.error('❌ Erro ao carregar quiz:', error);

      setState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
      }));

      addNotification('❌ Erro ao carregar quiz no editor', 'error');
    }
  }, [funnelId, addNotification]);

  // Handlers
  const handleSave = useCallback(async () => {
    try {
      console.log('💾 Salvando alterações do quiz...');

      // Aqui será implementada a sincronização bidirecional na Fase 3
      // Por enquanto, simular o salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      addNotification('💾 Quiz salvo com sucesso', 'success');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      addNotification('❌ Erro ao salvar quiz', 'error');
    }
  }, [addNotification]);

  const handlePreview = useCallback(() => {
    console.log('👁️ Abrindo preview do quiz...');

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
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
            >
              <Target className="w-4 h-4 mr-2" />
              Ver Quiz Original
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Informações do quiz */}
        <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Quiz de Estilo Pessoal - 21 Etapas</span>
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
    <UnifiedCRUDProvider>
      <FunnelMasterProvider>
        <EditorProvider>
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
        </EditorProvider>
      </FunnelMasterProvider>
    </UnifiedCRUDProvider>
  );
};

export default QuizEditorIntegratedPage;