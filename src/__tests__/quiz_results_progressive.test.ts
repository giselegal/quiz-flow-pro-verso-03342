import { describe, it, expect, vi, beforeEach } from 'vitest';
import { quizResultsService } from '@/services/quizResultsService';

// Mock do Supabase para evitar I/O externo no teste
vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: {
      from: () => ({
        upsert: async () => ({ data: null, error: null }),
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      }),
    },
  };
});

type Responses = Record<string, any>;

const makeStepAnswer = (step: number) => {
  // Respostas simples com palavras-chave mapeadas para estilos
  switch (step) {
    case 1:
      return { name: 'Alice Teste' };
    case 3:
      return { roupa_favorita: 'vestido leve' }; // favorece Romântico
    case 4:
      return { estilo_pessoal: 'romantico e delicado' };
    case 5:
      return { ocasiões: 'casual' };
    case 6:
      return { cores_favoritas: ['rosa pastel', 'creme'] }; // Romântico/Clássico
    case 7:
      return { texturas: 'rendado' }; // Romântico via keywords do config
    case 8:
      return { silhuetas: 'suave e feminino' };
    case 9:
      return { acessorios: 'brincos de pérola' }; // Clássico/Romântico
    case 10:
      return { inspiracao: 'floral romantico' };
    case 11:
      return { conforto: 'conforto suave' };
    case 12:
      return { tendencias: 'delicado atual' };
    case 13:
      return { investimento: 'medio' };
    case 14:
      return { personalidade: 'romantico sonhador' };
    default:
      // Etapas sem mapeamento específico: respostas genéricas ainda analisáveis por palavras
      return { nota: 'look elegante romantico' };
  }
};

describe('Cálculo de resultados: etapas 1–20', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calcula sem erros de forma progressiva do passo 1 ao 20 e aumenta completionScore', async () => {
    const responses: Responses = {};
    let lastCompletion = 0;

    for (let step = 1; step <= 20; step++) {
      responses[String(step)] = makeStepAnswer(step);
      const result = await quizResultsService.calculateResults({
        id: 'sess-prog-1',
        session_id: 'sess-prog-1',
        current_step: step,
        responses,
      } as any);

      // Básicos
      expect(result).toBeTruthy();
      expect(result.sessionId).toBe('sess-prog-1');
      expect(result.styleProfile).toBeTruthy();
      expect(result.recommendations).toBeTruthy();
      expect(result.metadata.answeredQuestions).toBe(Object.keys(responses).length);

      // completionScore deve ser não decrescente
      expect(result.completionScore).toBeGreaterThanOrEqual(lastCompletion);
      lastCompletion = result.completionScore;

      // Após passo 1, deve extrair nome do usuário
      if (step >= 1) {
        expect(typeof result.userName).toBe('string');
      }
    }
  });

  it('com respostas tendenciosas, retorna estilo predominante esperado ao final (passo 20)', async () => {
    const responses: Responses = {};
    for (let step = 1; step <= 20; step++) {
      responses[String(step)] = makeStepAnswer(step);
    }

    const result = await quizResultsService.calculateResults({
      id: 'sess-final-1',
      session_id: 'sess-final-1',
      current_step: 20,
      responses,
    } as any);

    expect(result).toBeTruthy();
    // Deve ter escolhido algum estilo válido e consistente com os inputs Românticos
    expect(typeof result.styleProfile.primaryStyle).toBe('string');
    expect(result.styleProfile.primaryStyle.length).toBeGreaterThan(0);

    // Como várias respostas apontam para Romântico, esperamos que seja o primário
    // Caso o styleConfig altere pesos, mantemos uma asserção branda, mas verificamos preferência
    const primary = result.styleProfile.primaryStyle.toLowerCase();
    expect(['romântico', 'romantico', 'romantico'].some(k => primary.includes(k))).toBe(true);

    expect(result.recommendations.wardrobe.essentials.length).toBeGreaterThan(0);
    expect(result.metadata.answeredQuestions).toBe(20);
    expect(result.completionScore).toBeGreaterThan(0);
  });
});
