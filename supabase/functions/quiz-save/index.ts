/**
 * 🎯 EDGE FUNCTION: QUIZ SAVE
 * 
 * Responsável por salvar templates de quiz no Supabase
 * Resolve GARGALO #3: API backend inexistente
 */

// @ts-ignore: Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// @ts-ignore: Deno global
declare const Deno: any;

interface SaveQuizRequest {
  funnelId: string;
  quiz: {
    version: string;
    schemaVersion: string;
    metadata: {
      id: string;
      name: string;
      description: string;
      author: string;
      createdAt: string;
      updatedAt: string;
      version?: string;
      tags?: string[];
    };
    theme: any;
    settings: any;
    steps: any[];
    results?: any;
    blockLibrary?: any;
  };
  metadata?: {
    userId?: string;
    source?: 'editor' | 'api' | 'migration';
  };
}

interface SaveQuizResponse {
  success: boolean;
  data?: {
    id: string;
    funnelId: string;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Apenas POST é permitido
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Method not allowed. Use POST.' 
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const body: SaveQuizRequest = await req.json();
    
    if (!body.funnelId || !body.quiz) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: funnelId and quiz' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar se já existe um template para este funnel
    const { data: existing, error: fetchError } = await supabase
      .from('quiz_templates')
      .select('id, version')
      .eq('funnel_id', body.funnelId)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('❌ Erro ao verificar template existente:', fetchError);
      throw fetchError;
    }

    const nextVersion = existing ? existing.version + 1 : 1;

    // Preparar dados para inserção
    const quizData = {
      funnel_id: body.funnelId,
      quiz_data: body.quiz,
      version: nextVersion,
      user_id: body.metadata?.userId || null,
      source: body.metadata?.source || 'editor',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Inserir no banco
    const { data: inserted, error: insertError } = await supabase
      .from('quiz_templates')
      .insert(quizData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir template:', insertError);
      throw insertError;
    }

    console.log(`✅ Template salvo: ${body.funnelId} (v${nextVersion})`);

    // Retornar sucesso
    const response: SaveQuizResponse = {
      success: true,
      data: {
        id: inserted.id,
        funnelId: body.funnelId,
        version: nextVersion,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      },
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erro na edge function quiz-save:', error);
    
    const response: SaveQuizResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
