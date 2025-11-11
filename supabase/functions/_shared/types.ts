/**
 * 🔧 TIPOS GLOBAIS PARA FUNÇÕES EDGE DO SUPABASE
 * 
 * Declarações de tipo para ambiente Deno e APIs das Edge Functions
 */

// Declarações globais do Deno
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
    args: string[];
    exit(code?: number): never;
  };
}

// Tipos para serve function (sem declaração de módulo para evitar erros)
// A função serve será importada diretamente nas edge functions com @ts-ignore

// Tipos para CORS headers comuns
export interface CorsHeaders {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Headers': string;
  'Access-Control-Allow-Methods'?: string;
}

// Tipos para respostas padrão de Edge Functions
export interface EdgeFunctionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para configuração de funil
export interface FunnelConfig {
  id: string;
  name: string;
  steps: FunnelStep[];
  settings: FunnelSettings;
}

export interface FunnelStep {
  id: string;
  type: 'question' | 'form' | 'content' | 'result';
  title: string;
  content: string;
  options?: FunnelOption[];
}

export interface FunnelOption {
  id: string;
  text: string;
  value: string;
  nextStep?: string;
}

export interface FunnelSettings {
  theme: string;
  colors: Record<string, string>;
  typography: Record<string, string>;
}

// Tipos para dados de comportamento do usuário
export interface UserBehaviorData {
  sessionId: string;
  steps: UserStepData[];
  totalTime: number;
  deviceInfo: DeviceInfo;
}

export interface UserStepData {
  stepId: string;
  timeSpent: number;
  answer?: string;
  timestamp: number;
}

export interface DeviceInfo {
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  isMobile: boolean;
}

// Tipos para integração com OpenAI
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Tipos para rate limiting
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Tipos para security monitoring
export interface SecurityEvent {
  type: 'suspicious_activity' | 'rate_limit_exceeded' | 'invalid_request';
  ip: string;
  userAgent: string;
  timestamp: number;
  details: Record<string, unknown>;
}

export interface SecurityConfig {
  enableIpBlocking: boolean;
  enableUserAgentFiltering: boolean;
  suspiciousPatterns: string[];
  maxRequestsPerMinute: number;
}

// Tipos para CSP headers
export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'frame-src'?: string[];
  'object-src'?: string[];
  'media-src'?: string[];
  'worker-src'?: string[];
}

export interface CSPConfig {
  reportOnly: boolean;
  reportUri?: string;
  directives: CSPDirectives;
}

// Constante CORS headers padrão
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Utilitários para Edge Functions
export const createCorsResponse = (
  data: unknown, 
  status = 200, 
  additionalHeaders: Record<string, string> = {}
): Response => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        ...additionalHeaders,
      },
    }
  );
};

export const createErrorResponse = (
  error: string, 
  status = 500, 
  additionalHeaders: Record<string, string> = {}
): Response => {
  return createCorsResponse(
    { success: false, error },
    status,
    additionalHeaders
  );
};

export const handleCorsPreflightRequest = (): Response => {
  return new Response(null, { headers: corsHeaders });
};

// Validadores comuns
export const validateRequest = (req: Request): boolean => {
  const contentType = req.headers.get('content-type');
  return contentType?.includes('application/json') || false;
};

export const extractClientIP = (req: Request): string => {
  return req.headers.get('x-forwarded-for')?.split(',')[0] ||
         req.headers.get('x-real-ip') ||
         'unknown';
};

export const extractUserAgent = (req: Request): string => {
  return req.headers.get('user-agent') || 'unknown';
};