/**
 * 🎯 QUIZ PREVIEW PANEL - Preview em Tempo Real
 * 
 * Componente para preview em tempo real do quiz durante a edição.
 * Funcionalidades:
 * - ✅ Preview instantâneo das mudanças
 * - ✅ Teste de funcionalidades
 * - ✅ Validação de fluxo
 * - ✅ Simulação de usuário
 * - ✅ Métricas de performance
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';

interface QuizStep {
  id: string;
  name: string;
  type: string;
  content: any;
  settings: any;
  styles: any;
}

interface QuizPreviewPanelProps {
  steps: QuizStep[];
  currentStep?: string;
  onStepChange?: (stepId: string) => void;
  onComplete?: () => void;
  isLive?: boolean;
  className?: string;
}

export default function QuizPreviewPanel({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  isLive = true,
  className = ''
}: QuizPreviewPanelProps) {
  const [previewStep, setPreviewStep] = useState<string>(currentStep || steps[0]?.id || '');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showMetrics, setShowMetrics] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>({ isValid: true, errors: [], warnings: [] });

  const previewRef = useRef<HTMLDivElement>(null);
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });

  // Atualizar preview quando steps mudarem
  useEffect(() => {
    if (isLive && steps.length > 0) {
      setPreviewStep(steps[0].id);
    }
  }, [steps, isLive]);

  // Validar steps
  useEffect(() => {
    validateSteps();
  }, [steps]);

  const validateSteps = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (steps.length === 0) {
      errors.push('Nenhuma etapa encontrada');
    }

    steps.forEach((step, index) => {
      if (!step.name.trim()) {
        errors.push(`Etapa ${index + 1}: Nome é obrigatório`);
      }

      if (!step.content?.title?.trim()) {
        warnings.push(`Etapa ${index + 1}: Título não definido`);
      }

      if (step.type === 'question' && (!step.content?.options || step.content.options.length < 2)) {
        errors.push(`Etapa ${index + 1}: Deve ter pelo menos 2 opções`);
      }
    });

    setValidationResults({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  };

  const handleStepNavigation = (stepId: string) => {
    setPreviewStep(stepId);
    onStepChange?.(stepId);
  };

  const handleNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === previewStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      handleStepNavigation(nextStep.id);
    } else {
      onComplete?.();
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === previewStep);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      handleStepNavigation(prevStep.id);
    }
  };

  const handleReset = () => {
    setPreviewStep(steps[0]?.id || '');
    setIsPlaying(false);
  };

  const handleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play simulation
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const interval = setInterval(() => {
        const currentIndex = steps.findIndex(step => step.id === previewStep);
        if (currentIndex < steps.length - 1) {
          const nextStep = steps[currentIndex + 1];
          handleStepNavigation(nextStep.id);
        } else {
          setIsPlaying(false);
        }
      }, 3000 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, previewStep, steps, playbackSpeed]);

  const currentStepData = steps.find(step => step.id === previewStep);

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      default:
        return { width: 1200, height: 800 };
    }
  };

  const dimensions = getPreviewDimensions();

  return (
    <div className={`quiz-preview-panel ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Preview do Quiz</h2>
          <div className="flex items-center space-x-2">
            <Badge variant={isLive ? "default" : "outline"} className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {isLive ? 'Live' : 'Static'}
            </Badge>
            
            {validationResults.isValid ? (
              <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                Válido
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationResults.errors.length} erro(s)
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetrics(!showMetrics)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Métricas
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Controles */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Navegação */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousStep}
                disabled={steps.findIndex(step => step.id === previewStep) === 0}
              >
                Anterior
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStep}
                disabled={steps.findIndex(step => step.id === previewStep) === steps.length - 1}
              >
                Próximo
              </Button>
            </div>

            {/* Auto-play */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoPlay}
                className={isPlaying ? 'bg-green-100 text-green-700' : ''}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? 'Pausar' : 'Auto-play'}
              </Button>
              
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
                disabled={!isPlaying}
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

          {/* Modos de preview */}
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-300px)]">
        {/* Sidebar com navegação */}
        <div className="w-80 border-r border-gray-200 p-4">
          <Tabs defaultValue="navigation" className="h-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="navigation">Navegação</TabsTrigger>
              <TabsTrigger value="validation">Validação</TabsTrigger>
            </TabsList>

            <TabsContent value="navigation" className="space-y-2">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {steps.map((step, index) => (
                  <Card
                    key={step.id}
                    className={`cursor-pointer transition-all ${
                      previewStep === step.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleStepNavigation(step.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {step.type}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mt-1 line-clamp-2">
                            {step.name}
                          </h4>
                        </div>
                        
                        {previewStep === step.id && (
                          <Eye className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="validation" className="space-y-4">
              {validationResults.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Erros encontrados:</p>
                      <ul className="list-disc list-inside text-sm">
                        {validationResults.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validationResults.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Avisos:</p>
                      <ul className="list-disc list-inside text-sm">
                        {validationResults.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validationResults.isValid && validationResults.warnings.length === 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Quiz validado com sucesso! Todas as etapas estão corretas.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview principal */}
        <div className="flex-1 p-4">
          <div className="h-full flex flex-col">
            {/* Info da etapa atual */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {currentStepData?.name || 'Etapa não encontrada'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Etapa {steps.findIndex(step => step.id === previewStep) + 1} de {steps.length}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>~2min</span>
                </div>
              </div>
            </div>

            {/* Preview container */}
            <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
              <div
                ref={previewRef}
                className="w-full h-full bg-white"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  margin: '0 auto',
                  transform: previewMode !== 'desktop' ? 'scale(0.8)' : 'scale(1)',
                  transformOrigin: 'top center'
                }}
              >
                {currentStepData ? (
                  <div
                    className="w-full h-full p-6"
                    style={{
                      backgroundColor: currentStepData.styles?.backgroundColor || '#ffffff',
                      color: currentStepData.styles?.textColor || '#000000',
                      fontFamily: currentStepData.styles?.fontFamily || 'Inter',
                      fontSize: currentStepData.styles?.fontSize || '16px',
                      borderRadius: currentStepData.styles?.borderRadius || '8px',
                      padding: currentStepData.styles?.padding || '24px'
                    }}
                  >
                    <h1 className="text-2xl font-bold mb-4">
                      {currentStepData.content?.title || currentStepData.name}
                    </h1>
                    
                    {currentStepData.content?.question && (
                      <p className="text-lg mb-6">{currentStepData.content.question}</p>
                    )}

                    {currentStepData.content?.options && (
                      <div className="space-y-3">
                        {currentStepData.content.options.map((option: any, index: number) => (
                          <div
                            key={option.id || index}
                            className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <div className="w-4 h-4 border border-gray-400 rounded mr-3"></div>
                              <span>{option.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6">
                      <Button
                        style={{
                          backgroundColor: currentStepData.styles?.buttonColor || '#3b82f6',
                          borderRadius: currentStepData.styles?.borderRadius || '8px'
                        }}
                        className="w-full"
                        onClick={handleNextStep}
                      >
                        {currentStepData.content?.buttonText || 'Continuar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Nenhuma etapa selecionada</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
