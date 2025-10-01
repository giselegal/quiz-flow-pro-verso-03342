/**
 * 🎯 QUIZ EDITOR MODE - Interface Especializada
 * 
 * Modo especializado do editor para edição de quiz-estilo,
 * com painéis e funcionalidades específicas para quiz.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Target, Brain, Eye, Settings, BarChart3, 
  Shuffle, Play, Pause, RotateCcw, Save
} from 'lucide-react';

// Hooks
import { useUnifiedStepNavigation } from '@/hooks/useUnifiedStepNavigation';
import { useQuizConfig } from '@/hooks/useQuizConfig';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';

// Componentes especializados
import QuizPropertiesPanel from '../panels/QuizPropertiesPanel';

interface QuizEditorModeProps {
  funnelId?: string;
  onSave?: () => Promise<void>;
  onPreview?: () => void;
  className?: string;
}

interface QuizEditorState {
  activeTab: 'editor' | 'properties' | 'analytics' | 'preview';
  isPreviewMode: boolean;
  isRealExperience: boolean;
  selectedStepNumber: number;
}

const QuizEditorMode: React.FC<QuizEditorModeProps> = ({
  funnelId,
  onSave,
  onPreview,
  className = ''
}) => {
  // Estado local
  const [state, setState] = useState<QuizEditorState>({
    activeTab: 'editor',
    isPreviewMode: false,
    isRealExperience: false,
    selectedStepNumber: 1
  });

  // Hooks
  const navigation = useUnifiedStepNavigation();
  const quizConfig = useQuizConfig();
  const templateLoader = useTemplateLoader();

  // Dados do quiz
  const {
    currentStep,
    totalSteps,
    goToStep,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious
  } = navigation;

  const {
    quizConfig: config,
    quizQuestions,
    isLoading: configLoading,
    reloadConfig
  } = quizConfig;

  // Atualizar step selecionado quando navegação muda
  useEffect(() => {
    setState(prev => ({ 
      ...prev, 
      selectedStepNumber: currentStep 
    }));
  }, [currentStep]);

  // Handlers
  const handleTabChange = useCallback((tab: string) => {
    setState(prev => ({ 
      ...prev, 
      activeTab: tab as QuizEditorState['activeTab'] 
    }));
  }, []);

  const handleStepSelect = useCallback((stepNumber: number) => {
    goToStep(stepNumber);
    setState(prev => ({ ...prev, selectedStepNumber: stepNumber }));
  }, [goToStep]);

  const handlePreviewToggle = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isPreviewMode: !prev.isPreviewMode 
    }));
    onPreview?.();
  }, [onPreview]);

  const handleRealExperienceToggle = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isRealExperience: !prev.isRealExperience 
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (onSave) {
      await onSave();
    }
  }, [onSave]);

  // Obter tipo da etapa atual
  const getCurrentStepType = useCallback((stepNum: number): string => {
    if (stepNum === 1) return 'Introdução';
    if (stepNum >= 2 && stepNum <= 11) return 'Questão';
    if (stepNum === 12 || stepNum === 19) return 'Transição';
    if (stepNum >= 13 && stepNum <= 18) return 'Questão Estratégica';
    if (stepNum === 20) return 'Resultado';
    if (stepNum === 21) return 'Oferta';
    return 'Padrão';
  }, []);

  return (
    <div className={`quiz-editor-mode flex flex-col h-full ${className}`}>
      {/* Header especializado */}
      <div className="quiz-editor-header bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Quiz Editor</h2>
              <Badge variant="secondary">21 Etapas</Badge>
            </div>

            {funnelId && (
              <Badge variant="outline">ID: {funnelId}</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={state.isRealExperience ? "default" : "outline"}
              size="sm"
              onClick={handleRealExperienceToggle}
            >
              <Play className="w-4 h-4 mr-2" />
              {state.isRealExperience ? 'Real ✓' : 'Real'}
            </Button>

            <Button
              variant={state.isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={handlePreviewToggle}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            <Separator orientation="vertical" className="h-4" />

            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!onSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Navegação de etapas */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={!canGoPrevious}
            >
              ← Anterior
            </Button>

            <Badge variant="outline" className="px-3 py-1">
              Etapa {currentStep} de {totalSteps}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={!canGoNext}
            >
              Próxima →
            </Button>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <Badge variant="secondary">
            {getCurrentStepType(currentStep)}
          </Badge>

          <div className="flex-1" />

          <div className="text-sm text-muted-foreground">
            {quizQuestions.length} questões carregadas
          </div>
        </div>
      </div>

      {/* Conteúdo principal com tabs */}
      <div className="flex-1 flex">
        <Tabs 
          value={state.activeTab} 
          onValueChange={handleTabChange}
          className="w-full flex flex-col"
        >
          {/* Tab Navigation */}
          <div className="border-b border-border px-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor" className="text-sm">
                <Target className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-sm">
                <Settings className="w-4 h-4 mr-2" />
                Propriedades
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="editor" className="h-full m-0">
              <div className="h-full flex">
                {/* Lista de etapas */}
                <div className="w-64 border-r border-border bg-muted/20 p-4 overflow-y-auto">
                  <h3 className="font-semibold mb-4">Etapas do Quiz</h3>
                  
                  <div className="space-y-2">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map(stepNum => (
                      <Card 
                        key={stepNum}
                        className={`cursor-pointer transition-colors ${
                          stepNum === currentStep 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleStepSelect(stepNum)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">
                                Etapa {stepNum}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getCurrentStepType(stepNum)}
                              </div>
                            </div>
                            
                            {stepNum === currentStep && (
                              <Badge variant="default" className="text-xs">
                                Atual
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Editor principal */}
                <div className="flex-1 p-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Etapa {currentStep}: {getCurrentStepType(currentStep)}
                      </CardTitle>
                      <CardDescription>
                        Edite o conteúdo e configurações desta etapa do quiz
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Editor Visual do Quiz</p>
                        <p className="text-sm">
                          Interface visual será integrada aqui na próxima fase
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="properties" className="h-full m-0">
              <QuizPropertiesPanel 
                stepNumber={currentStep}
                stepType={getCurrentStepType(currentStep)}
                onStepChange={handleStepSelect}
              />
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics do Quiz</CardTitle>
                  <CardDescription>
                    Métricas e insights sobre performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Analytics Avançado</p>
                    <p className="text-sm">
                      Dashboard de métricas será implementado na Fase 4
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="h-full m-0 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview do Quiz</CardTitle>
                  <CardDescription>
                    Visualização em tempo real do quiz funcional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Preview Interativo</p>
                    <p className="text-sm">
                      Preview funcional será integrado na Fase 2
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default QuizEditorMode;