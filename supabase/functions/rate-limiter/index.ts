/**
 * Edge Function: Rate Limiter
 * Sistema de controle de taxa de requisições para prevenir abuso
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimit {
  identifier: string; // IP, user_id, ou API key
  limit: number;      // Número máximo de requisições
  window: number;     // Janela de tempo em segundos
  current: number;    // Requisições atuais
  reset_time: number; // Timestamp do reset
}

// Configurações de rate limiting por endpoint
const rateLimits = {
  // APIs públicas
  'public_api': { limit: 100, window: 3600 }, // 100 req/hora
  'quiz_submission': { limit: 10, window: 60 }, // 10 req/minuto
  
  // APIs autenticadas
  'authenticated_api': { limit: 1000, window: 3600 }, // 1000 req/hora
  'funnel_update': { limit: 50, window: 300 }, // 50 req/5min
  
  // APIs admin
  'admin_api': { limit: 5000, window: 3600 }, // 5000 req/hora
  
  // Edge functions específicas
  'ai_generation': { limit: 20, window: 3600 }, // 20 req/hora
  'template_optimizer': { limit: 100, window: 3600 }, // 100 req/hora
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'check':
        return await handleRateLimitCheck(req, supabase);
      
      case 'reset':
        return await handleRateLimitReset(req, supabase);
      
      case 'status':
        return await handleRateLimitStatus(req, supabase);
      
      case 'config':
        return handleRateLimitConfig();
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

  } catch (error) {
    console.error('Rate Limiter Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleRateLimitCheck(req: Request, supabase: any) {
  const { 
    identifier, 
    endpoint, 
    user_id 
  } = await req.json();

  try {
    const config = rateLimits[endpoint as keyof typeof rateLimits];
    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Unknown endpoint' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - config.window;

    // Obter ou criar rate limit record
    const { data: existing, error: selectError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('reset_time', now)
      .single();

    let current = 0;
    let resetTime = now + config.window;

    if (existing && !selectError) {
      current = existing.current + 1;
      resetTime = existing.reset_time;
    } else {
      current = 1;
    }

    // Verificar se excedeu o limite
    if (current > config.limit) {
      // Log da violação
      await supabase.rpc('log_security_event', {
        p_event_type: 'rate_limit_exceeded',
        p_event_data: {
          identifier,
          endpoint,
          current_count: current,
          limit: config.limit,
          window: config.window,
          user_id,
          ip_address: req.headers.get('CF-Connecting-IP') || 
                      req.headers.get('X-Forwarded-For'),
          user_agent: req.headers.get('User-Agent')
        },
        p_severity: 'high'
      });

      return new Response(
        JSON.stringify({ 
          allowed: false,
          error: 'Rate limit exceeded',
          limit: config.limit,
          window: config.window,
          reset_time: resetTime,
          retry_after: resetTime - now
        }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': (resetTime - now).toString(),
            'X-RateLimit-Limit': config.limit.toString(),
            'X-RateLimit-Remaining': Math.max(0, config.limit - current).toString(),
            'X-RateLimit-Reset': resetTime.toString()
          } 
        }
      );
    }

    // Atualizar ou inserir rate limit record
    const { error: upsertError } = await supabase
      .from('rate_limits')
      .upsert({
        identifier,
        endpoint,
        current,
        limit: config.limit,
        window: config.window,
        reset_time: resetTime,
        last_request: now,
        user_id
      });

    if (upsertError) {
      console.error('Failed to update rate limit:', upsertError);
    }

    return new Response(
      JSON.stringify({ 
        allowed: true,
        current,
        limit: config.limit,
        window: config.window,
        reset_time: resetTime,
        remaining: config.limit - current
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.limit.toString(),
          'X-RateLimit-Remaining': Math.max(0, config.limit - current).toString(),
          'X-RateLimit-Reset': resetTime.toString()
        } 
      }
    );

  } catch (error) {
    console.error('Rate limit check failed:', error);
    return new Response(
      JSON.stringify({ 
        allowed: true, // Fail open para não quebrar funcionalidade
        error: 'Rate limit check failed',
        message: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleRateLimitReset(req: Request, supabase: any) {
  const { identifier, endpoint } = await req.json();
  
  try {
    const { error } = await supabase
      .from('rate_limits')
      .delete()
      .eq('identifier', identifier)
      .eq('endpoint', endpoint);

    if (error) throw error;

    // Log do reset
    await supabase.rpc('log_security_event', {
      p_event_type: 'rate_limit_reset',
      p_event_data: { identifier, endpoint },
      p_severity: 'low'
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rate limit reset failed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleRateLimitStatus(req: Request, supabase: any) {
  const url = new URL(req.url);
  const identifier = url.searchParams.get('identifier');
  
  try {
    let query = supabase
      .from('rate_limits')
      .select('*')
      .gte('reset_time', Math.floor(Date.now() / 1000))
      .order('last_request', { ascending: false });

    if (identifier) {
      query = query.eq('identifier', identifier);
    }

    const { data, error } = await query.limit(100);
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ rate_limits: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to get rate limit status:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

function handleRateLimitConfig() {
  return new Response(
    JSON.stringify({ 
      rate_limits: rateLimits,
      info: 'Current rate limit configuration'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}