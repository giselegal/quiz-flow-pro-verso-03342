/**
 * Edge Function: CSP Headers
 * Configura Content Security Policy headers para segurança
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Content Security Policy configuration
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Permitido para React/Vite
    "'unsafe-eval'", // Permitido para desenvolvimento
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
    "https://cdnjs.cloudflare.com",
    "https://fonts.googleapis.com",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "http:"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "https://cdn.jsdelivr.net"
  ],
  'connect-src': [
    "'self'",
    "https://pwtjuuhchtbzttrzoutw.supabase.co",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://api.github.com",
    "https://api.openai.com"
  ],
  'media-src': [
    "'self'",
    "https:",
    "data:",
    "blob:"
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': Object.entries(cspDirectives)
    .map(([directive, sources]) => 
      sources.length > 0 
        ? `${directive} ${sources.join(' ')}`
        : directive
    )
    .join('; '),
  
  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // X-Frame-Options
  'X-Frame-Options': 'DENY',
  
  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'
  ].join(', '),
  
  // X-XSS-Protection (legacy but still useful)
  'X-XSS-Protection': '1; mode=block'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'get-headers':
        return handleGetHeaders();
      
      case 'validate-csp':
        return await handleValidateCSP(req);
      
      case 'report-violation':
        return await handleCSPViolationReport(req);
      
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
    console.error('CSP Headers Error:', error);
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

function handleGetHeaders() {
  return new Response(
    JSON.stringify({ 
      headers: securityHeaders,
      info: 'Security headers for production deployment'
    }),
    { 
      headers: { 
        ...corsHeaders, 
        ...securityHeaders,
        'Content-Type': 'application/json' 
      } 
    }
  );
}

async function handleValidateCSP(req: Request) {
  const { url: testUrl, userAgent } = await req.json();
  
  try {
    // Simular validação de CSP
    const violations = [];
    
    // Verificar se a URL está permitida
    const urlObj = new URL(testUrl);
    const isAllowed = cspDirectives['connect-src'].some(src => 
      src === "'self'" || 
      src === "https:" || 
      testUrl.startsWith(src.replace('*', ''))
    );
    
    if (!isAllowed) {
      violations.push({
        directive: 'connect-src',
        blocked_uri: testUrl,
        line_number: null,
        column_number: null
      });
    }
    
    return new Response(
      JSON.stringify({ 
        valid: violations.length === 0,
        violations,
        tested_url: testUrl,
        user_agent: userAgent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Validation failed',
        message: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleCSPViolationReport(req: Request) {
  try {
    const report = await req.json();
    
    // Log da violação
    console.error('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      violation: report,
      user_agent: req.headers.get('User-Agent'),
      ip_address: req.headers.get('CF-Connecting-IP') || 
                  req.headers.get('X-Forwarded-For') || 
                  'unknown'
    });
    
    // Aqui você poderia salvar no banco de dados ou enviar para um serviço de monitoramento
    
    return new Response(
      JSON.stringify({ 
        status: 'violation_logged',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to process CSP violation report:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process report' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}