import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
          { role: 'user', content: userPrompt }
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        suggestions,
        action 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-optimization-engine:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
