// @ts-ignore: Deno imports
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore: Deno imports  
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { 
  createCorsResponse, 
  createErrorResponse, 
  handleCorsPreflightRequest,
  type FunnelConfig,
  type UserBehaviorData,
  type OpenAIRequest,
  type EdgeFunctionResponse
} from '../_shared/types.ts';

/**
 * AI Optimization Engine Edge Function
 * 
 * Provides AI-powered optimization suggestions for quiz funnels.
 * Requires authentication (JWT verification enabled in config.toml).
 * 
 * Actions:
 * - optimize: Analyze funnel and suggest improvements
 * - generate-variant: Create A/B test variants
 * - analyze-performance: Analyze metrics and identify issues
 */
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    // ========================================================================
    // AUTHENTICATION CHECK
    // ========================================================================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Missing authorization header', 401);
    }

    // Verify the JWT token and get user info
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return createErrorResponse('Unauthorized - Invalid token', 401);
    }

    // ========================================================================
    // PROCESS REQUEST
    // ========================================================================
    const { action, funnelConfig, userBehaviorData } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'optimize':
        systemPrompt = `Você é um especialista em otimização de funis de conversão e questionários interativos.
Analise o funil fornecido e sugira melhorias específicas para aumentar conversão, engajamento e qualidade dos leads.`;
        userPrompt = `Analise este funil e forneça sugestões de otimização:
${JSON.stringify(funnelConfig, null, 2)}

Dados de comportamento do usuário:
${JSON.stringify(userBehaviorData || {}, null, 2)}

Forneça sugestões específicas em categorias: copy, design, fluxo, e psicologia.`;
        break;

      case 'generate-variant':
        systemPrompt = `Você é um copywriter especializado em questionários de conversão.
Crie variantes de texto otimizadas para testes A/B.`;
        userPrompt = `Crie 3 variantes otimizadas para este elemento:
${JSON.stringify(funnelConfig, null, 2)}

Foque em clareza, persuasão e ação.`;
        break;

      case 'analyze-performance':
        systemPrompt = `Você é um analista de dados especializado em funis de conversão.
Analise métricas e identifique pontos de atrito e oportunidades.`;
        userPrompt = `Analise o desempenho deste funil:
Configuração: ${JSON.stringify(funnelConfig, null, 2)}
Dados: ${JSON.stringify(userBehaviorData, null, 2)}

Identifique gargalos e oportunidades de melhoria.`;
        break;

      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content;

    // Log successful request for monitoring
    console.log(`AI optimization request by user ${user.id}: action=${action}`);

    return createCorsResponse({ 
      success: true, 
      suggestions,
      action, 
    });

  } catch (error) {
    console.error('Error in ai-optimization-engine:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});
