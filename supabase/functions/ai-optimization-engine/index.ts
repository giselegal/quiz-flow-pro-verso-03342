import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
  networkLatency: number;
  userInteractionLatency: number;
  errorRate: number;
  userEngagement: number;
}

interface UserBehaviorPattern {
  action: string;
  frequency: number;
  avgDuration: number;
  successRate: number;
  dropOffPoints: string[];
  optimizationPotential: number;
}

interface OptimizationRequest {
  metrics: PerformanceMetrics;
  behaviorPatterns: UserBehaviorPattern[];
  editorMode: 'visual' | 'headless' | 'production' | 'funnel';
  userPreferences?: {
    prioritizeSpeed?: boolean;
    prioritizeMemory?: boolean;
    prioritizeUX?: boolean;
  };
}

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const optimizationRequest: OptimizationRequest = await req.json();
    
    console.log('🧠 AI Optimization Request received:', {
      metricsKeys: Object.keys(optimizationRequest.metrics),
      behaviorPatternsCount: optimizationRequest.behaviorPatterns.length,
      editorMode: optimizationRequest.editorMode
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // 🎯 CONSTRUIR PROMPT INTELIGENTE PARA GPT-5
    const systemPrompt = `You are an expert React/TypeScript performance optimization AI. You analyze editor performance metrics and user behavior patterns to provide specific, actionable optimization recommendations.

Focus on:
- Performance bottlenecks and solutions
- UX improvements based on user behavior
- Technical debt reduction
- Automated optimization opportunities

Provide practical, implementable solutions with code examples when possible.`;

    const userPrompt = `Analyze this editor performance data and provide optimization recommendations:

PERFORMANCE METRICS:
- Render Time: ${optimizationRequest.metrics.renderTime}ms
- Memory Usage: ${optimizationRequest.metrics.memoryUsage}%
- Bundle Size: ${optimizationRequest.metrics.bundleSize}MB
- Cache Hit Rate: ${optimizationRequest.metrics.cacheHitRate}%
- Network Latency: ${optimizationRequest.metrics.networkLatency}ms
- User Interaction Latency: ${optimizationRequest.metrics.userInteractionLatency}ms
- Error Rate: ${optimizationRequest.metrics.errorRate}%
- User Engagement: ${optimizationRequest.metrics.userEngagement}%

USER BEHAVIOR PATTERNS:
${optimizationRequest.behaviorPatterns.map(pattern => `
- Action: ${pattern.action}
  Frequency: ${pattern.frequency}/day
  Avg Duration: ${pattern.avgDuration}ms
  Success Rate: ${pattern.successRate}%
  Drop-off Points: ${pattern.dropOffPoints.join(', ')}
  Optimization Potential: ${pattern.optimizationPotential}%
`).join('')}

EDITOR MODE: ${optimizationRequest.editorMode}

USER PREFERENCES:
- Prioritize Speed: ${optimizationRequest.userPreferences?.prioritizeSpeed || false}
- Prioritize Memory: ${optimizationRequest.userPreferences?.prioritizeMemory || false}
- Prioritize UX: ${optimizationRequest.userPreferences?.prioritizeUX || false}

Please provide 3-5 specific optimization recommendations in JSON format with the following structure:
{
  "recommendations": [
    {
      "type": "performance|ux|engagement|technical",
      "priority": "low|medium|high|critical",
      "title": "Short descriptive title",
      "description": "Detailed explanation of the issue and impact",
      "implementation": "Step-by-step implementation guide",
      "expectedImprovement": 0-100,
      "effort": "low|medium|high",
      "code": "Optional TypeScript/React code example",
      "autoApplicable": true|false
    }
  ],
  "overallAssessment": "General assessment of current performance",
  "priorityOrder": ["Most important optimization first", "Second priority", ...]
}`;

    // 🚀 CHAMAR GPT-5 PARA ANÁLISE
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07', // Using GPT-5 flagship model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 2000, // Using max_completion_tokens for GPT-5
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const aiResponse = await response.json();
    
    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let optimizationResult;
    try {
      optimizationResult = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse.choices[0].message.content);
      throw new Error('Invalid JSON response from AI');
    }

    console.log('✅ AI Optimization completed:', {
      recommendationsCount: optimizationResult.recommendations?.length || 0,
      overallAssessment: optimizationResult.overallAssessment ? 'Present' : 'Missing'
    });

    // 🎯 ADICIONAR METADADOS ÚTEIS
    const enrichedResult = {
      ...optimizationResult,
      metadata: {
        analyzedAt: new Date().toISOString(),
        editorMode: optimizationRequest.editorMode,
        performanceScore: calculatePerformanceScore(optimizationRequest.metrics),
        priorityMetrics: identifyPriorityMetrics(optimizationRequest.metrics),
        behaviorInsights: analyzeBehaviorInsights(optimizationRequest.behaviorPatterns)
      }
    };

    return new Response(JSON.stringify(enrichedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in AI optimization engine:', error);
    
    // 🔄 FALLBACK COM RECOMENDAÇÕES BÁSICAS
    const fallbackRecommendations = generateFallbackRecommendations();
    
    return new Response(JSON.stringify({
      recommendations: fallbackRecommendations,
      overallAssessment: "Análise IA indisponível. Usando recomendações baseadas em regras.",
      priorityOrder: fallbackRecommendations.map(r => r.title),
      metadata: {
        analyzedAt: new Date().toISOString(),
        fallback: true,
        error: error.message
      }
    }), {
      status: 200, // Return 200 even on error to provide fallback
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// 📊 FUNÇÃO PARA CALCULAR SCORE DE PERFORMANCE
function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const renderScore = Math.max(0, (32 - metrics.renderTime) / 32 * 25);
  const memoryScore = Math.max(0, (100 - metrics.memoryUsage) / 100 * 25);
  const cacheScore = metrics.cacheHitRate / 100 * 25;
  const latencyScore = Math.max(0, (200 - metrics.networkLatency) / 200 * 25);
  
  return Math.round(renderScore + memoryScore + cacheScore + latencyScore);
}

// 🎯 IDENTIFICAR MÉTRICAS PRIORITÁRIAS
function identifyPriorityMetrics(metrics: PerformanceMetrics): string[] {
  const issues: string[] = [];
  
  if (metrics.renderTime > 16) issues.push('renderTime');
  if (metrics.memoryUsage > 80) issues.push('memoryUsage');
  if (metrics.cacheHitRate < 70) issues.push('caching');
  if (metrics.networkLatency > 100) issues.push('networkLatency');
  if (metrics.userInteractionLatency > 100) issues.push('interactionLatency');
  if (metrics.errorRate > 2) issues.push('errorRate');
  if (metrics.userEngagement < 60) issues.push('userEngagement');
  
  return issues;
}

// 🧠 ANALISAR INSIGHTS COMPORTAMENTAIS
function analyzeBehaviorInsights(patterns: UserBehaviorPattern[]): string[] {
  const insights: string[] = [];
  
  patterns.forEach(pattern => {
    if (pattern.successRate < 90) {
      insights.push(`Low success rate for ${pattern.action}`);
    }
    if (pattern.optimizationPotential > 20) {
      insights.push(`High optimization potential for ${pattern.action}`);
    }
    if (pattern.dropOffPoints.length > 0) {
      insights.push(`Drop-off issues in ${pattern.action}`);
    }
  });
  
  return insights;
}

// 🔄 RECOMENDAÇÕES FALLBACK
function generateFallbackRecommendations(): OptimizationRecommendation[] {
  return [
    {
      type: 'performance',
      priority: 'high',
      title: 'Implementar React.memo em Componentes Críticos',
      description: 'Componentes re-renderizam desnecessariamente, impactando performance',
      implementation: 'Aplicar React.memo em componentes que recebem props estáveis',
      expectedImprovement: 15,
      effort: 'low',
      code: 'const OptimizedComponent = React.memo(YourComponent);',
      autoApplicable: true
    },
    {
      type: 'ux',
      priority: 'medium',
      title: 'Adicionar Loading States',
      description: 'Melhorar feedback visual durante operações assíncronas',
      implementation: 'Implementar skeleton loaders e spinners apropriados',
      expectedImprovement: 20,
      effort: 'medium',
      autoApplicable: false
    },
    {
      type: 'technical',
      priority: 'medium',
      title: 'Otimizar Bundle Splitting',
      description: 'Reduzir tamanho do bundle inicial com code splitting',
      implementation: 'Implementar lazy loading para rotas e componentes pesados',
      expectedImprovement: 25,
      effort: 'medium',
      code: 'const LazyComponent = React.lazy(() => import("./Component"));',
      autoApplicable: true
    }
  ];
}