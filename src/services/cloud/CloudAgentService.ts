/**
 * 🌐 SERVIÇO DE AGENTE DE NUVEM
 * 
 * Serviço para delegar execução do agente de funil de estilo
 * para a função edge no Supabase (execução em nuvem)
 */

import { appLogger } from '@/lib/utils/appLogger';

export type AgentTargetStyle =
    | 'natural'
    | 'classico'
    | 'contemporaneo'
    | 'elegante'
    | 'romantico'
    | 'sexy'
    | 'dramatico'
    | 'criativo';

export interface RunAgentOptions {
    userName?: string;
    targetStyle?: AgentTargetStyle;
    multiPerQuestion?: number; // 1 a 3
}

export interface StyleResult {
  style: string;
  category: string;
  score: number;
  percentage: number;
}

export interface QuizResultPayload {
  version: string;
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  scores: Record<string, number>;
  totalQuestions: number;
  userData?: { name?: string };
}

export interface CloudAgentResponse {
    success: boolean;
    userName: string;
    targetStyle: AgentTargetStyle;
    result: QuizResultPayload | null;
    stats: {
        totalSelections: number;
        formDataCount: number;
        completedSteps: number;
    };
}

/**
 * Obtém a URL base do Supabase a partir das variáveis de ambiente
 */
function getSupabaseUrl(): string {
  // Tenta várias fontes de configuração
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    if (url) return url;
  }
  
  // Fallback para variáveis globais (se configuradas)
  if (typeof window !== 'undefined' && (window as any).SUPABASE_URL) {
    return (window as any).SUPABASE_URL;
  }
  
  throw new Error('SUPABASE_URL não configurada');
}

/**
 * Obtém a chave anônima do Supabase
 */
function getSupabaseAnonKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (key) return key;
  }
  
  if (typeof window !== 'undefined' && (window as any).SUPABASE_ANON_KEY) {
    return (window as any).SUPABASE_ANON_KEY;
  }
  
  throw new Error('SUPABASE_ANON_KEY não configurada');
}

/**
 * Executa o agente de funil de estilo na nuvem (Supabase Edge Function)
 */
export async function runCloudStyleFunnelAgent(
  opts: RunAgentOptions = {}
): Promise<CloudAgentResponse> {
  try {
    const supabaseUrl = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();
    
    const functionUrl = `${supabaseUrl}/functions/v1/style-funnel-agent`;
    
    appLogger.info('☁️ Delegando execução ao agente de nuvem...', {
      data: [{ targetStyle: opts.targetStyle, userName: opts.userName }]
    });

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        userName: opts.userName,
        targetStyle: opts.targetStyle,
        multiPerQuestion: opts.multiPerQuestion,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na função edge: ${response.status} - ${errorText}`);
    }

    const result = await response.json() as CloudAgentResponse;
    
    if (!result.success) {
      throw new Error('Agente de nuvem retornou falha');
    }

    appLogger.info('✅ Agente de nuvem executado com sucesso', {
      data: [{ 
        primaryStyle: result.result?.primaryStyle?.style,
        stats: result.stats 
      }]
    });

    return result;
  } catch (error) {
    appLogger.error('❌ Erro ao executar agente de nuvem:', { data: [error] });
    throw error;
  }
}

/**
 * Verifica se o agente de nuvem está disponível (se as credenciais Supabase estão configuradas)
 */
export function isCloudAgentAvailable(): boolean {
  try {
    getSupabaseUrl();
    getSupabaseAnonKey();
    return true;
  } catch {
    return false;
  }
}

export const CloudAgentService = {
  runStyleFunnelAgent: runCloudStyleFunnelAgent,
  isAvailable: isCloudAgentAvailable,
};

export default CloudAgentService;
