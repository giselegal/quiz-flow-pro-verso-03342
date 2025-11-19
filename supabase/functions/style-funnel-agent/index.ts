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

// Types
export type AgentTargetStyle =
    | 'natural'
    | 'classico'
    | 'contemporaneo'
    | 'elegante'
    | 'romantico'
    | 'sexy'
    | 'dramatico'
    | 'criativo';

export interface RunAgentRequest {
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

export interface RunAgentResponse {
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

// Mapeamento canônico de prefixos → nome amigável
const STYLE_MAP: Record<string, string> = {
  natural: 'Natural',
  classico: 'Clássico',
  contemporaneo: 'Contemporâneo',
  elegante: 'Elegante',
  romantico: 'Romântico',
  sexy: 'Sexy',
  dramatico: 'Dramático',
  criativo: 'Criativo',
};

// Ordem determinística para desempate
const STYLES_ORDER: string[] = [
  'Natural',
  'Clássico',
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo',
];

/**
 * Calcula pontuação a partir de selections usando prefixos de optionId
 */
function computeScoresFromSelections(
  selectionsByQuestion: Record<string, string[]>,
  options?: { weightQuestions?: number }
): { scores: Record<string, number>; total: number } {
  const scores: Record<string, number> = {};
  Object.values(STYLE_MAP).forEach(name => (scores[name] = 0));

  const weightQ = typeof options?.weightQuestions === 'number' && options.weightQuestions > 0
    ? options.weightQuestions
    : 1;

  const entries = Object.entries(selectionsByQuestion);
  for (const [, selection] of entries) {
    for (const optId of selection || []) {
      const key = String(optId).toLowerCase();
      const prefix = Object.keys(STYLE_MAP).find(p => key.startsWith(`${p}_`));
      if (prefix) {
        const name = STYLE_MAP[prefix];
        scores[name] = (scores[name] || 0) + 1 * weightQ;
      }
    }
  }
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  return { scores, total };
}

/**
 * Normaliza objeto de resultado para consumo pelos blocos de resultado
 */
function toPayload(scores: Record<string, number>, total: number, userName?: string): QuizResultPayload {
  const ordered = Object.entries(scores)
    .map(([style, score]) => ({
      style,
      category: style,
      score,
      percentage: Math.round((score / (total || 1)) * 100),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Desempate por ordem de definição
      return STYLES_ORDER.indexOf(a.style) - STYLES_ORDER.indexOf(b.style);
    });

  const primaryStyle = ordered[0] || { style: 'Natural', category: 'Natural', score: 0, percentage: 0 };
  const secondaryStyles = ordered.slice(1, 3);

  return {
    version: '3.0',
    primaryStyle,
    secondaryStyles,
    scores,
    totalQuestions: 10,
    userData: userName ? { name: userName } : undefined,
  };
}

/**
 * Executa o agente de funil de estilo
 */
async function runStyleFunnelAgent(opts: RunAgentRequest): Promise<RunAgentResponse> {
  const userName = (opts.userName || 'Agente de Teste').trim();
  const target: AgentTargetStyle = opts.targetStyle || 'natural';
  const picksPerQuestion = Math.min(Math.max(opts.multiPerQuestion ?? 1, 1), 3);

  // Gerar seleções para as 10 questões que pontuam (q1..q10)
  const selectionsByQuestion: Record<string, string[]> = {};
  for (let i = 1; i <= 10; i++) {
    const q = `q${i}`;
    const sel: string[] = [];
    for (let k = 0; k < picksPerQuestion; k++) {
      // IDs fictícios, mas com prefixo de estilo reconhecido
      sel.push(`${target}_q${i}_${String.fromCharCode(97 + k)}`);
    }
    selectionsByQuestion[q] = sel;
  }

  // Calcular resultado usando o algoritmo de scoring
  const { scores, total } = computeScoresFromSelections(selectionsByQuestion);
  const payload = toPayload(scores, total, userName);

  return {
    success: true,
    userName,
    targetStyle: target,
    result: payload,
    stats: {
      totalSelections: Object.keys(selectionsByQuestion).length,
      formDataCount: 1, // userName
      completedSteps: 19,
    },
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return createErrorResponse('Método não permitido. Use POST.', 405);
    }

    // Parse request body
    const body = await req.json() as RunAgentRequest;

    // Validate target style if provided
    const validStyles: AgentTargetStyle[] = [
      'natural', 'classico', 'contemporaneo', 'elegante',
      'romantico', 'sexy', 'dramatico', 'criativo'
    ];
    
    if (body.targetStyle && !validStyles.includes(body.targetStyle)) {
      return createErrorResponse(
        `Estilo inválido. Use um dos seguintes: ${validStyles.join(', ')}`,
        400
      );
    }

    // Run the agent
    const result = await runStyleFunnelAgent(body);

    return createCorsResponse(result, 200);
  } catch (error) {
    console.error('Erro ao executar agente:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Erro interno do servidor',
      500
    );
  }
});
