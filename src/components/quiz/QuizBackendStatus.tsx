/**
 * 🎯 COMPONENTE DE STATUS DO BACKEND - QUIZ
 * 
 * Exibe o status da integração backend do quiz em tempo real
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Zap, 
  Shield, 
  AlertCircle, 
  CheckCircle2,
  Brain,
  HardDrive 
} from 'lucide-react';
import { useQuizBackendIntegration } from '@/hooks/useQuizBackendIntegration';

interface QuizBackendStatusProps {
  funnelId?: string;
  variant?: 'compact' | 'full';
  showDetails?: boolean;
}

export const QuizBackendStatus: React.FC<QuizBackendStatusProps> = ({
  funnelId,
  variant = 'compact',
  showDetails = true,
}) => {
  const {
    sessionId,
    isBackendConnected,
    isMonitoring,
    metrics,
    aiSuggestions,
    hasActiveBackend,
    needsAttention,
    getSessionStats,
    calculateMetrics,
    getAIOptimizations,
  } = useQuizBackendIntegration(funnelId);

  const stats = getSessionStats();

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        {/* Status Backend */}
        <div className="flex items-center space-x-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              hasActiveBackend ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} 
          />
          <span className="text-xs text-muted-foreground">
            {hasActiveBackend ? 'Backend Ativo' : 'Backend Offline'}
          </span>
        </div>

        {/* Contadores */}
        {isBackendConnected && (
          <Badge variant="secondary" className="text-xs">
            {stats.responsesCount} respostas
          </Badge>
        )}

        {/* Alertas IA */}
        {needsAttention && (
          <Badge variant="destructive" className="text-xs animate-bounce">
            <AlertCircle className="w-3 h-3 mr-1" />
            IA Alert
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Header com Status Principal */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className={`h-5 w-5 ${hasActiveBackend ? 'text-green-500' : 'text-red-500'}`} />
            <h3 className="font-semibold">Backend Integration</h3>
            {hasActiveBackend ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Button 
              onClick={calculateMetrics}
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
              title="Refresh Metrics"
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button 
              onClick={getAIOptimizations}
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
              title="Get AI Suggestions"
            >
              <Brain className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid de Serviços */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Database Connection */}
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
            <Database className={`h-4 w-4 ${isBackendConnected ? 'text-green-500' : 'text-gray-400'}`} />
            <div>
              <div className="text-xs font-medium">Database</div>
              <div className="text-xs text-muted-foreground">
                {isBackendConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>

          {/* Real-time Monitoring */}
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
            <Shield className={`h-4 w-4 ${isMonitoring ? 'text-blue-500' : 'text-gray-400'}`} />
            <div>
              <div className="text-xs font-medium">Monitor</div>
              <div className="text-xs text-muted-foreground">
                {isMonitoring ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>

          {/* AI Engine */}
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
            <Brain className={`h-4 w-4 ${aiSuggestions.length > 0 ? 'text-purple-500' : 'text-gray-400'}`} />
            <div>
              <div className="text-xs font-medium">AI Engine</div>
              <div className="text-xs text-muted-foreground">
                {aiSuggestions.length} suggestions
              </div>
            </div>
          </div>

          {/* Backup System */}
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
            <HardDrive className={`h-4 w-4 ${sessionId ? 'text-orange-500' : 'text-gray-400'}`} />
            <div>
              <div className="text-xs font-medium">Backup</div>
              <div className="text-xs text-muted-foreground">
                {sessionId ? 'Auto-save' : 'No session'}
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Detalhadas */}
        {showDetails && metrics && (
          <div className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Session Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Session ID:</span>
                  <div className="font-mono text-xs truncate">{sessionId}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Progress:</span>
                  <div>{stats.progress.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Responses:</span>
                  <div>{metrics.totalResponses}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Time/Step:</span>
                  <div>{metrics.averageTimePerStep.toFixed(1)}min</div>
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-1 text-purple-500" />
                  AI Optimization Suggestions
                </h4>
                <div className="space-y-2">
                  {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-2 rounded bg-purple-50 border-l-2 border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-purple-700">
                          Step {suggestion.stepNumber} - {suggestion.type.replace('_', ' ')}
                        </span>
                        <Badge 
                          variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-purple-600">{suggestion.suggestion}</p>
                      <p className="text-xs text-purple-500 mt-1">
                        Expected: +{suggestion.expectedImprovement}% improvement
                      </p>
                    </div>
                  ))}
                  {aiSuggestions.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{aiSuggestions.length - 3} more suggestions available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer com Session Info */}
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last update: {metrics?.lastActivity ? new Date(metrics.lastActivity).toLocaleTimeString() : 'Never'}</span>
            <div className="flex items-center space-x-2">
              <Zap className={`h-3 w-3 ${hasActiveBackend ? 'text-green-500' : 'text-gray-400'}`} />
              <span>{hasActiveBackend ? 'Live' : 'Static'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizBackendStatus;