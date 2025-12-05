/**
 * 🎯 EDGE FUNCTION: QUIZ SAVE
 * 
 * Responsável por salvar drafts de quiz no Supabase
 * CORRIGIDO: Usa quiz_drafts ao invés de quiz_templates (que não existe)
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
    
    console.log('📥 Recebido request para salvar quiz:', body.funnelId);
    
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

    // Verificar se já existe um draft para este funnel
    const { data: existing, error: fetchError } = await supabase
      .from('quiz_drafts')
      .select('id, version')
      .eq('funnel_id', body.funnelId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('❌ Erro ao verificar draft existente:', fetchError);
      throw fetchError;
    }

    const nextVersion = existing ? existing.version + 1 : 1;
    const now = new Date().toISOString();

    // Preparar dados para upsert
    const draftData = {
      funnel_id: body.funnelId,
      name: body.quiz.metadata?.name || 'Quiz sem nome',
      slug: body.funnelId,
      content: body.quiz,
      version: nextVersion,
      user_id: body.metadata?.userId || null,
      status: 'draft',
      updated_at: now,
      metadata: {
        source: body.metadata?.source || 'editor',
        savedAt: now,
      },
    };

    let result;

    if (existing) {
      // Atualizar draft existente
      console.log(`📝 Atualizando draft existente: ${existing.id} (v${nextVersion})`);
      
      const { data: updated, error: updateError } = await supabase
        .from('quiz_drafts')
        .update({
          content: draftData.content,
          version: nextVersion,
          updated_at: now,
          metadata: draftData.metadata,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar draft:', updateError);
        throw updateError;
      }
      
      result = updated;
    } else {
      // Criar novo draft - precisa de user_id válido
      console.log(`🆕 Criando novo draft para: ${body.funnelId}`);
      
      // Se não tiver user_id, não podemos criar (RLS requer)
      if (!body.metadata?.userId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'user_id é obrigatório para criar novo draft. Faça login primeiro.' 
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const { data: inserted, error: insertError } = await supabase
        .from('quiz_drafts')
        .insert({
          ...draftData,
          user_id: body.metadata.userId,
          created_at: now,
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao inserir draft:', insertError);
        throw insertError;
      }
      
      result = inserted;
    }

    console.log(`✅ Draft salvo: ${body.funnelId} (v${nextVersion})`);

    // Retornar sucesso
    const response: SaveQuizResponse = {
      success: true,
      data: {
        id: result.id,
        funnelId: body.funnelId,
        version: nextVersion,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
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
