/**
 * 🤖 AI OPTIMIZATION PANEL - FASE 2: SISTEMA DE IA
 * Interface para o engine de otimização IA
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Code, 
  CheckCircle, 
  AlertCircle,
  Play,
  Loader2
} from 'lucide-react';

interface OptimizationRecommendation {
  type: 'performance' | 'ux' | 'engagement' | 'technical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementation: string;
  expectedImprovement: number;
  effort: 'low' | 'medium' | 'high';
  code?: string;
  autoApplicable: boolean;
}

interface AIAnalysisResult {
  recommendations: OptimizationRecommendation[];
  overallAssessment: string;
  priorityOrder: string[];
  metadata: {
    analyzedAt: string;
    editorMode: string;
    performanceScore: number;
    priorityMetrics: string[];
    behaviorInsights: string[];
  };
}

export const AIOptimizationPanel: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'ux': return <TrendingUp className="w-4 h-4" />;
      case 'engagement': return <Brain className="w-4 h-4" />;
      case 'technical': return <Code className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const runAIAnalysis = useCallback(async () => {
    try {
      setIsAnalyzing(true);

      // Simular coleta de métricas (em produção, seria dos hooks de monitoramento)
      const mockMetrics = {
        renderTime: Math.random() * 50 + 10, // 10-60ms
        memoryUsage: Math.random() * 40 + 60, // 60-100%
        bundleSize: Math.random() * 2 + 1, // 1-3MB
        cacheHitRate: Math.random() * 30 + 70, // 70-100%
        networkLatency: Math.random() * 100 + 50, // 50-150ms
        userInteractionLatency: Math.random() * 200 + 50, // 50-250ms
        errorRate: Math.random() * 5, // 0-5%
        userEngagement: Math.random() * 40 + 60 // 60-100%
      };

      const mockBehaviorPatterns = [
        {
          action: 'drag_component',
          frequency: Math.floor(Math.random() * 50) + 10,
          avgDuration: Math.random() * 2000 + 500,
          successRate: Math.random() * 20 + 80,
          dropOffPoints: ['component_selection', 'property_editing'],
          optimizationPotential: Math.random() * 50 + 10
        }
      ];

      const { data, error } = await supabase.functions.invoke('ai-optimization-engine', {
        body: {
          metrics: mockMetrics,
          behaviorPatterns: mockBehaviorPatterns,
          editorMode: 'funnel',
          userPreferences: {
            prioritizeSpeed: true,
            prioritizeMemory: false,
            prioritizeUX: true
          }
        }
      });

      if (error) throw error;

      setAnalysisResult(data);
      toast({
        title: "✨ Análise IA Concluída",
        description: `${data.recommendations.length} recomendações encontradas`,
      });

    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "❌ Erro na Análise IA",
        description: error instanceof Error ? error.message : "Falha na análise",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const applyRecommendation = useCallback(async (recommendation: OptimizationRecommendation) => {
    try {
      // Simular aplicação da recomendação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppliedRecommendations(prev => new Set([...prev, recommendation.title]));
      
      toast({
        title: "✅ Otimização Aplicada",
        description: `${recommendation.title} foi aplicada com sucesso`,
      });

    } catch (error) {
      toast({
        title: "❌ Erro na Aplicação",
        description: "Falha ao aplicar otimização",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            Otimização IA
          </h2>
          <p className="text-muted-foreground">
            Engine de IA para otimização automática de performance
          </p>
        </div>
        <Button 
          onClick={runAIAnalysis} 
          disabled={isAnalyzing}
          size="lg"
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Executar Análise IA
            </>
          )}
        </Button>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <>
          {/* Performance Score */}
          <Card>
            <CardHeader>
              <CardTitle>Score de Performance</CardTitle>
              <CardDescription>
                Análise geral baseada em métricas e comportamento do usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {analysisResult.metadata.performanceScore}/100
                  </span>
                  <Badge variant={
                    analysisResult.metadata.performanceScore >= 80 ? 'default' :
                    analysisResult.metadata.performanceScore >= 60 ? 'secondary' : 'destructive'
                  }>
                    {analysisResult.metadata.performanceScore >= 80 ? 'Excelente' :
                     analysisResult.metadata.performanceScore >= 60 ? 'Bom' : 'Precisa Melhorar'}
                  </Badge>
                </div>
                <Progress value={analysisResult.metadata.performanceScore} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {analysisResult.overallAssessment}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recomendações de Otimização</h3>
            {analysisResult.recommendations.map((recommendation, index) => {
              const isApplied = appliedRecommendations.has(recommendation.title);
              
              return (
                <Card key={index} className={isApplied ? 'border-green-200 bg-green-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTypeIcon(recommendation.type)}
                        {recommendation.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`text-white ${getPriorityColor(recommendation.priority)}`}
                        >
                          {recommendation.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          +{recommendation.expectedImprovement}%
                        </Badge>
                        {isApplied && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                    </div>
                    <CardDescription>
                      {recommendation.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Implementação:</h4>
                      <p className="text-sm text-muted-foreground">
                        {recommendation.implementation}
                      </p>
                    </div>

                    {recommendation.code && (
                      <div>
                        <h4 className="font-medium mb-2">Código de Exemplo:</h4>
                        <div className="bg-gray-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                          {recommendation.code}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Esforço: {recommendation.effort}</span>
                        <span>Tipo: {recommendation.type}</span>
                        <span>Melhoria: +{recommendation.expectedImprovement}%</span>
                      </div>
                      
                      {recommendation.autoApplicable && !isApplied && (
                        <Button 
                          onClick={() => applyRecommendation(recommendation)}
                          size="sm"
                          variant="outline"
                        >
                          Aplicar Automaticamente
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Priority Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights Prioritários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">Métricas Prioritárias:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.metadata.priorityMetrics.map((metric, index) => (
                    <Badge key={index} variant="secondary">{metric}</Badge>
                  ))}
                </div>
              </div>
              
              {analysisResult.metadata.behaviorInsights.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Insights Comportamentais:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {analysisResult.metadata.behaviorInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!analysisResult && !isAnalyzing && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pronto para Otimizar</h3>
            <p className="text-muted-foreground text-center mb-6">
              Execute uma análise IA para receber recomendações personalizadas de otimização
            </p>
            <Button onClick={runAIAnalysis} size="lg">
              <Play className="w-4 h-4 mr-2" />
              Iniciar Análise IA
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};