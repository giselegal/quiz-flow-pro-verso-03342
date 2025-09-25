import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AIRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, maxTokens = 1000, temperature = 0.7, action = 'generate' } = await req.json()

    // Get the GitHub Models token from Supabase secrets
    const githubToken = Deno.env.get('GITHUB_MODELS_TOKEN')
    if (!githubToken) {
      throw new Error('GitHub Models token not configured')
    }

    console.log('🤖 GitHub Models AI Request:', { action, messagesCount: messages?.length })

    // Handle different AI actions
    switch (action) {
      case 'generate':
        return await handleGenerate(messages, maxTokens, temperature, githubToken)
      case 'generateQuiz':
        return await handleGenerateQuiz(messages[0]?.content || '', githubToken)
      case 'generateFunnel':
        return await handleGenerateFunnel(messages[0]?.content || '', githubToken)
      case 'improveText':
        return await handleImproveText(messages[0]?.content || '', messages[1]?.content || '', githubToken)
      default:
        throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    console.error('❌ GitHub Models AI Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        details: 'Failed to process AI request'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleGenerate(
  messages: AIRequest['messages'], 
  maxTokens: number, 
  temperature: number,
  githubToken: string
): Promise<Response> {
  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GitHub Models API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  const aiResponse: AIResponse = {
    content: data.choices?.[0]?.message?.content || '',
    model: data.model || 'gpt-4o-mini',
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    } : undefined
  }

  console.log('✅ AI Response generated successfully')

  return new Response(
    JSON.stringify(aiResponse),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGenerateQuiz(prompt: string, githubToken: string): Promise<Response> {
  const quizPrompt = `
Você é um especialista em criação de quizzes interativos. Crie um quiz baseado no seguinte prompt: "${prompt}"

Retorne APENAS um JSON válido no seguinte formato:
{
  "title": "Título do Quiz",
  "description": "Descrição breve",
  "steps": [
    {
      "id": 1,
      "type": "intro",
      "title": "Título da introdução",
      "content": "Texto introdutório",
      "inputType": "text",
      "inputLabel": "Nome",
      "inputPlaceholder": "Digite seu nome"
    },
    {
      "id": 2,
      "type": "question",
      "title": "Pergunta 1",
      "question": "Qual sua preferência?",
      "options": [
        {"id": "a", "text": "Opção A", "value": "a", "category": "categoria1"},
        {"id": "b", "text": "Opção B", "value": "b", "category": "categoria2"}
      ]
    }
  ]
}

Crie 5-8 etapas incluindo introdução, 3-5 perguntas e resultado final.
`

  const messages = [
    { role: 'system' as const, content: 'Você é um especialista em criação de quizzes. Sempre retorne JSON válido.' },
    { role: 'user' as const, content: quizPrompt }
  ]

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub Models API error: ${response.status}`)
  }

  const data = await response.json()
  let content = data.choices?.[0]?.message?.content || '{}'

  // Clean up the JSON response
  content = content.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim()

  try {
    const quizData = JSON.parse(content)
    console.log('✅ Quiz generated successfully')
    
    return new Response(
      JSON.stringify(quizData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (parseError) {
    console.error('❌ Failed to parse quiz JSON:', parseError, content)
    throw new Error('Failed to generate valid quiz structure')
  }
}

async function handleGenerateFunnel(prompt: string, githubToken: string): Promise<Response> {
  const funnelPrompt = `
Crie um funil de conversão interativo baseado em: "${prompt}"

Retorne APENAS um array JSON de etapas no seguinte formato:
[
  {
    "id": 1,
    "type": "intro",
    "title": "Bem-vindo",
    "content": "Texto introdutório",
    "description": "Descrição da etapa"
  },
  {
    "id": 2,
    "type": "question",
    "title": "Pergunta 1",
    "question": "Qual sua necessidade?",
    "options": [
      {"id": "opt1", "text": "Opção 1", "value": "opcao1", "category": "categoria1"},
      {"id": "opt2", "text": "Opção 2", "value": "opcao2", "category": "categoria2"}
    ]
  }
]

Crie 5-8 etapas com perguntas relevantes para o contexto fornecido.
`

  const messages = [
    { role: 'system' as const, content: 'Você é um especialista em funis de conversão. Sempre retorne JSON válido.' },
    { role: 'user' as const, content: funnelPrompt }
  ]

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub Models API error: ${response.status}`)
  }

  const data = await response.json()
  let content = data.choices?.[0]?.message?.content || '[]'

  // Clean up the JSON response
  content = content.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim()

  try {
    const stepsData = JSON.parse(content)
    console.log('✅ Funnel steps generated successfully')
    
    return new Response(
      JSON.stringify(stepsData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (parseError) {
    console.error('❌ Failed to parse funnel JSON:', parseError, content)
    throw new Error('Failed to generate valid funnel structure')
  }
}

async function handleImproveText(text: string, context: string, githubToken: string): Promise<Response> {
  const improvePrompt = `
Melhore o seguinte texto: "${text}"
${context ? `Contexto: ${context}` : ''}

Retorne apenas o texto melhorado, sem explicações adicionais.
Mantenha o tom e estilo adequados para o contexto fornecido.
`

  const messages = [
    { role: 'system' as const, content: 'Você é um especialista em copywriting. Melhore textos mantendo o contexto e tom.' },
    { role: 'user' as const, content: improvePrompt }
  ]

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub Models API error: ${response.status}`)
  }

  const data = await response.json()
  const improvedText = data.choices?.[0]?.message?.content || text

  console.log('✅ Text improved successfully')

  return new Response(
    JSON.stringify({ improvedText }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}