// @ts-ignore: Deno imports
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore: Deno imports  
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  createCorsResponse, 
  createErrorResponse, 
  handleCorsPreflightRequest
} from '../_shared/types.ts';

// @ts-ignore: Deno global está disponível no runtime
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const { prompt, quizType } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    const systemPrompt = `Você é um especialista em criar questionários interativos de alta conversão.
Gere questionários completos e otimizados baseados nas solicitações do usuário.

Estrutura do quiz:
- Intro: Página inicial atraente com valor claro
- Questions: 3-7 perguntas estratégicas
- Result: Página de resultado personalizada
- Offer: Oferta relevante baseada nas respostas

Responda APENAS com JSON válido no formato:
{
  "title": "Título do Quiz",
  "steps": [
    {
      "stepType": "intro|question|result|offer",
      "title": "Título da Etapa",
      "blocks": [
        {
          "type": "heading|text|button|quiz-options|form-input",
          "content": {},
          "properties": {}
        }
      ]
    }
  ]
}`;

    const userPrompt = `Crie um questionário do tipo "${quizType}" com o seguinte objetivo:
${prompt}

Gere um quiz completo e otimizado.`;

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
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta inválida da IA');
    }

    const quizData = JSON.parse(jsonMatch[0]);

    return createCorsResponse({ 
      success: true, 
      quiz: quizData,
    });

  } catch (error) {
    console.error('Error in ai-quiz-generator:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});
