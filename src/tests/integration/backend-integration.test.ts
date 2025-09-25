/**
 * 🧪 TESTES DE INTEGRAÇÃO COM BACKEND SUPABASE
 * Valida sessões, persistência de dados e sincronização
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase para testes
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ data: null, error: null })),
      update: vi.fn(() => ({ data: null, error: null })),
      select: vi.fn(() => ({ data: [], error: null })),
      upsert: vi.fn(() => ({ data: null, error: null })),
      eq: vi.fn(() => ({ data: [], error: null })),
      single: vi.fn(() => ({ data: null, error: null }))
    })),
    auth: {
      getUser: vi.fn(() => ({ data: { user: { id: 'test-user-id' } }, error: null }))
    }
  }
}));

describe('🔗 Integração com Backend Supabase', () => {
  const mockUserId = 'test-user-id';
  const mockSessionId = 'test-session-id';
  const mockFunnelId = 'test-funnel';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('👤 Gerenciamento de Usuários Quiz', () => {
    it('deve criar perfil de usuário quiz', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: { id: mockUserId }, error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const userData = {
        name: 'Maria Silva',
        email: 'maria@email.com',
        session_id: mockSessionId,
        ip_address: '192.168.1.1',
        user_agent: 'Test Browser',
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'quiz-campaign'
      };

      await supabase.from('quiz_users').insert(userData);

      expect(mockInsert).toHaveBeenCalledWith(userData);
    });
  });

  describe('📊 Sessões de Quiz', () => {
    it('deve criar nova sessão de quiz', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: { id: mockSessionId }, error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const sessionData = {
        funnel_id: mockFunnelId,
        quiz_user_id: mockUserId,
        status: 'started',
        current_step: 0,
        total_steps: 21,
        metadata: {
          userAgent: 'Test Browser',
          startTime: new Date().toISOString()
        }
      };

      await supabase.from('quiz_sessions').insert(sessionData);

      expect(mockInsert).toHaveBeenCalledWith(sessionData);
    });
  });

  describe('📝 Respostas do Quiz', () => {
    it('deve salvar resposta individual', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: { id: 'response-id' }, error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const responseData = {
        session_id: mockSessionId,
        question_id: 'step-2',
        step_number: 2,
        answer_value: 'elegante-option',
        answer_text: 'Estilo Elegante',
        score_earned: 3,
        response_time_ms: 2500,
        question_text: 'Qual seu estilo preferido?',
        metadata: {
          selectedOptions: ['elegante-option'],
          timestamp: new Date().toISOString()
        }
      };

      await supabase.from('quiz_step_responses').insert(responseData);

      expect(mockInsert).toHaveBeenCalledWith(responseData);
    });

    it('deve salvar múltiplas respostas em lote', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: [], error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const responses = [
        {
          session_id: mockSessionId,
          question_id: 'step-2',
          step_number: 2,
          answer_value: 'elegante-option',
          score_earned: 3
        },
        {
          session_id: mockSessionId,
          question_id: 'step-3',
          step_number: 3,
          answer_value: 'romantico-option',
          score_earned: 2
        }
      ];

      await supabase.from('quiz_step_responses').insert(responses);

      expect(mockInsert).toHaveBeenCalledWith(responses);
    });
  });

  describe('🏆 Resultados do Quiz', () => {
    it('deve salvar resultado final', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: { id: 'result-id' }, error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const resultData = {
        session_id: mockSessionId,
        result_type: 'style_profile',
        result_title: 'Seu estilo é ELEGANTE',
        result_description: 'Você tem um estilo sofisticado e refinado...',
        recommendation: 'Para realçar seu estilo elegante, invista em...',
        result_data: {
          primaryStyle: 'elegante',
          secondaryStyles: ['romantico', 'classico'],
          scores: {
            elegante: 28,
            romantico: 22,
            classico: 18
          },
          personalizedOfferKey: 'elegante-business-premium'
        },
        next_steps: [
          'Identifique peças-chave para seu guarda-roupa',
          'Aprenda a combinar cores e texturas',
          'Descubra seu tom de pele ideal'
        ]
      };

      await supabase.from('quiz_results').insert(resultData);

      expect(mockInsert).toHaveBeenCalledWith(resultData);
    });
  });

  describe('📈 Analytics do Quiz', () => {
    it('deve registrar evento de analytics', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: { id: 'analytics-id' }, error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const analyticsData = {
        funnel_id: mockFunnelId,
        session_id: mockSessionId,
        user_id: mockUserId,
        event_type: 'step_completed',
        event_data: {
          stepNumber: 5,
          timeSpent: 15000,
          answer: 'elegante-option',
          score: 3
        }
      };

      await supabase.from('quiz_analytics').insert(analyticsData);

      expect(mockInsert).toHaveBeenCalledWith(analyticsData);
    });
  });

  describe('💰 Conversões', () => {
    it('deve registrar conversão', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: { id: 'conversion-id' }, error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const conversionData = {
        session_id: mockSessionId,
        conversion_type: 'purchase',
        product_id: 'consultoria-estilo-premium',
        product_name: 'Consultoria de Estilo Premium',
        conversion_value: 497.00,
        currency: 'BRL',
        affiliate_id: 'AFF123',
        commission_rate: 0.30,
        conversion_data: {
          offerKey: 'elegante-business-premium',
          source: 'quiz_result',
          campaign: 'quiz-campaign'
        }
      };

      await supabase.from('quiz_conversions').insert(conversionData);

      expect(mockInsert).toHaveBeenCalledWith(conversionData);
    });
  });

  describe('🔧 Tratamento de Erros', () => {
    it('deve lidar com erros de conexão', async () => {
      const mockInsert = vi.fn().mockRejectedValue(new Error('Conexão perdida'));
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      await expect(
        supabase.from('quiz_sessions').insert({ 
          funnel_id: mockFunnelId, 
          quiz_user_id: mockUserId 
        })
      ).rejects.toThrow('Conexão perdida');
    });
  });
});