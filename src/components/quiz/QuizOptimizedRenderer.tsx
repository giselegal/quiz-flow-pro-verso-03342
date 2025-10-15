/**
 * 🎯 QUIZ RENDERER OTIMIZADO COM BACKEND COMPLETO
 * 
 * Integração completa entre quiz flow e backend:
 * - Real-time monitoring
 * - AI optimization
 * - Analytics automáticos
 * - Backup em tempo real
 */

import React, { useEffect, useCallback } from 'react';
import { ScalableQuizRenderer } from '@/components/core/ScalableQuizRenderer';
import { QuizBackendStatus } from './QuizBackendStatus';
import { useQuizBackendIntegration } from '@/hooks/useQuizBackendIntegration';
import { useQuizRealTimeAnalytics } from '@/hooks/useQuizRealTimeAnalytics';
import { useUnifiedQuizState } from '@/hooks/useUnifiedQuizState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Brain, 
  AlertTriangle,
  CheckCircle2,
  Activity 
} from 'lucide-react';

interface QuizOptimizedRendererProps {
  funnelId: string;
  showBackendPanel?: boolean;
  showAnalytics?: boolean;
  className?: string;
}

export const QuizOptimizedRenderer: React.FC<QuizOptimizedRendererProps> = ({
  funnelId,
  showBackendPanel = true,
  showAnalytics = true,
  className = '',
}) => {
  const unifiedState = useUnifiedQuizState();
  
  const {
    sessionId,
    aiSuggestions,
    finalizeQuiz,
    trackQuizEvent,
    hasActiveBackend,
    needsAttention,
  } = useQuizBackendIntegration(funnelId);
  
  const {
    metrics: analyticsMetrics,
    alerts,
    startStepTimer,
    endStepTimer,
    hasWarnings,
    conversionHealth,
    clearAlerts,
  } = useQuizRealTimeAnalytics(sessionId || undefined, funnelId);

  // 🎯 RASTREAR MUDANÇAS DE STEP
  useEffect(() => {
    const currentStep = unifiedState.metadata.currentStep;
    
    // Iniciar timer para o step atual
    startStepTimer(currentStep);
    
    // Finalizar timer do step anterior
    if (currentStep > 1) {
      endStepTimer(currentStep - 1);
    }
    
    // Track analytics event
    trackQuizEvent('step_change', {
      fromStep: currentStep - 1,
      toStep: currentStep,
      timestamp: Date.now(),
    });
  }, [unifiedState.metadata.currentStep, startStepTimer, endStepTimer, trackQuizEvent]);

  // 🎯 FINALIZAR QUIZ QUANDO COMPLETO
  useEffect(() => {
    if (unifiedState.result && sessionId) {
      finalizeQuiz(unifiedState.result);
    }
  }, [unifiedState.result, sessionId, finalizeQuiz]);

  // 🎯 APLICAR SUGESTÕES DE IA AUTOMATICAMENTE
  const applyAISuggestion = useCallback((suggestionIndex: number) => {
    const suggestion = aiSuggestions[suggestionIndex];
    if (!suggestion) return;

    // Aqui você implementaria a aplicação das sugestões
    // Por enquanto, apenas loggar
    console.log('🤖 Applying AI suggestion:', suggestion);
    
    trackQuizEvent('ai_suggestion_applied', {
      suggestion,
      stepNumber: suggestion.stepNumber,
    });
  }, [aiSuggestions, trackQuizEvent]);

  // 🎯 COMPONENTE DE ALERTAS
  const AlertsPanel = () => {
    if (alerts.length === 0) return null;

    return (
      <Card className="mb-4 border-l-4 border-l-orange-500">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Real-time Alerts</span>
            </div>
            <Button 
              onClick={clearAlerts} 
              variant="ghost" 
              size="sm"
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="space-y-2">
            {alerts.slice(-3).map((alert, index) => (
              <div 
                key={index}
                className={`p-2 rounded text-xs ${
                  alert.type === 'error' ? 'bg-red-50 text-red-700' :
                  alert.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                  alert.type === 'success' ? 'bg-green-50 text-green-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                <div className="font-medium">{alert.message}</div>
                {alert.action && (
                  <div className="text-xs opacity-75 mt-1">{alert.action}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 🎯 PAINEL DE AI SUGGESTIONS
  const AISuggestionsPanel = () => {
    if (aiSuggestions.length === 0) return null;

    return (
      <Card className="mb-4 border-l-4 border-l-purple-500">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">AI Optimization</span>
            <Badge variant="secondary" className="text-xs">
              {aiSuggestions.length} suggestions
            </Badge>
          </div>
          <div className="space-y-2">
            {aiSuggestions.slice(0, 2).map((suggestion, index) => (
              <div 
                key={index}
                className="p-2 rounded bg-purple-50 border border-purple-100"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-purple-700">
                    Step {suggestion.stepNumber}
                  </span>
                  <Badge 
                    variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-xs text-purple-600 mb-2">{suggestion.suggestion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-500">
                    +{suggestion.expectedImprovement}% improvement
                  </span>
                  <Button
                    onClick={() => applyAISuggestion(index)}
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs border-purple-200"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 🎯 MÉTRICAS PANEL
  const MetricsPanel = () => {
    if (!analyticsMetrics) return null;

    return (
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Live Metrics</span>
            <Badge 
              variant={conversionHealth === 'high' ? 'default' : conversionHealth === 'medium' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {conversionHealth} conversion
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion:</span>
                <span className="font-medium">{analyticsMetrics.completionLikelihood.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Steps Done:</span>
                <span className="font-medium">{analyticsMetrics.stepsCompleted}/21</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Time:</span>
                <span className="font-medium">{analyticsMetrics.averageTimePerStep.toFixed(0)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engagement:</span>
                <span className="font-medium">{analyticsMetrics.interactionRate.toFixed(0)}%</span>
              </div>
            </div>
          </div>
          
          {analyticsMetrics.estimatedTimeToComplete > 0 && (
            <div className="mt-2 pt-2 border-t text-xs text-center text-muted-foreground">
              Estimated completion: {Math.ceil(analyticsMetrics.estimatedTimeToComplete / 60)} minutes
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`quiz-optimized-renderer ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Quiz Principal */}
        <div className="lg:col-span-3">
          <ScalableQuizRenderer 
            funnelId={funnelId}
            className="w-full"
          />
        </div>

        {/* Painel de Backend e Analytics */}
        {(showBackendPanel || showAnalytics) && (
          <div className="lg:col-span-1 space-y-4">
            {/* Status do Backend */}
            {showBackendPanel && (
              <QuizBackendStatus 
                funnelId={funnelId} 
                variant="full" 
                showDetails={true}
              />
            )}

            {/* Alertas em Tempo Real */}
            {showAnalytics && hasWarnings && <AlertsPanel />}

            {/* AI Suggestions */}
            {showAnalytics && needsAttention && <AISuggestionsPanel />}

            {/* Métricas Live */}
            {showAnalytics && <MetricsPanel />}

            {/* Status Summary */}
            <Card className="border-2 border-dashed">
              <CardContent className="p-3">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    {hasActiveBackend ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700">
                          Backend Active
                        </span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          Static Mode
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {hasActiveBackend ? 
                      'Real-time monitoring, AI optimization, and backup active' :
                      'Quiz running in static mode - limited features'
                    }
                  </div>
                  
                  {hasActiveBackend && sessionId && (
                    <div className="text-xs font-mono text-muted-foreground truncate">
                      Session: {sessionId.substring(0, 8)}...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizOptimizedRenderer;