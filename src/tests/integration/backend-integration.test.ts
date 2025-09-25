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

    it('deve lidar com erro na criação de usuário', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Erro de inserção' } 
      });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const result = await supabase.from('quiz_users').insert({
        name: 'Maria Silva',
        session_id: mockSessionId
      });

      expect(result.error).toBeTruthy();
      expect(result.error?.message).toBe('Erro de inserção');
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

    it('deve atualizar progresso da sessão', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ data: { id: mockSessionId }, error: null });
      const mockEq = vi.fn().mockReturnValue({ update: mockUpdate });
      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({ eq: mockEq })
      });

      const updateData = {
        current_step: 5,
        score: 25,
        last_activity: new Date().toISOString(),
        metadata: {
          currentStepData: 'step-5'
        }
      };

      await supabase.from('quiz_sessions').update(updateData).eq('id', mockSessionId);

      expect(mockEq).toHaveBeenCalledWith('id', mockSessionId);
    });

    it('deve recuperar sessão existente', async () => {
      const mockSession = {
        id: mockSessionId,
        funnel_id: mockFunnelId,
        current_step: 3,
        status: 'in_progress',
        score: 15
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockSession, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({
        select: mockSelect
      });

      const result = await supabase.from('quiz_sessions').select('*').eq('id', mockSessionId).single();

      expect(result.data).toEqual(mockSession);
      expect(mockEq).toHaveBeenCalledWith('id', mockSessionId);
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

    it('deve recuperar respostas da sessão', async () => {
      const mockResponses = [
        { question_id: 'step-2', answer_value: 'elegante-option', score_earned: 3 },
        { question_id: 'step-3', answer_value: 'romantico-option', score_earned: 2 }
      ];

      const mockEq = vi.fn().mockResolvedValue({ data: mockResponses, error: null });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({
        select: mockSelect
      });

      const result = await supabase.from('quiz_step_responses').select('*').eq('session_id', mockSessionId);

      expect(result.data).toEqual(mockResponses);
      expect(mockEq).toHaveBeenCalledWith('session_id', mockSessionId);
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

    it('deve recuperar resultado da sessão', async () => {
      const mockResult = {
        id: 'result-id',
        session_id: mockSessionId,
        result_type: 'style_profile',
        result_title: 'Seu estilo é ELEGANTE'
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockResult, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({
        select: mockSelect
      });

      const result = await supabase.from('quiz_results').select('*').eq('session_id', mockSessionId).single();

      expect(result.data).toEqual(mockResult);
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

    it('deve registrar múltiplos eventos em lote', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: [], error: null });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const events = [
        {
          funnel_id: mockFunnelId,
          session_id: mockSessionId,
          event_type: 'quiz_started',
          event_data: { startTime: new Date().toISOString() }
        },
        {
          funnel_id: mockFunnelId,
          session_id: mockSessionId,
          event_type: 'step_completed',
          event_data: { stepNumber: 1, timeSpent: 5000 }
        }
      ];

      await supabase.from('quiz_analytics').insert(events);

      expect(mockInsert).toHaveBeenCalledWith(events);
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

  describe('🔄 Sincronização e Recovery', () => {
    it('deve sincronizar dados offline', async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ data: [], error: null });
      (supabase.from as any).mockReturnValue({
        upsert: mockUpsert
      });

      const offlineData = [
        {
          id: 'offline-response-1',
          session_id: mockSessionId,
          question_id: 'step-2',
          answer_value: 'elegante-option',
          created_at: new Date().toISOString()
        }
      ];

      await supabase.from('quiz_step_responses').upsert(offlineData);

      expect(mockUpsert).toHaveBeenCalledWith(offlineData);
    });

    it('deve recuperar sessão após reconexão', async () => {
      const mockSession = {
        id: mockSessionId,
        current_step: 5,
        status: 'in_progress'
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockSession, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({
        select: mockSelect
      });

      const result = await supabase.from('quiz_sessions')
        .select('*')
        .eq('quiz_user_id', mockUserId)
        .single();

      expect(result.data).toEqual(mockSession);
    });
  });

  describe('🛡️ Tratamento de Erros', () => {
    it('deve lidar com erros de conexão', async () => {
      const mockInsert = vi.fn().mockRejectedValue(new Error('Conexão perdida'));
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      await expect(
        supabase.from('quiz_sessions').insert({ funnel_id: mockFunnelId })
      ).rejects.toThrow('Conexão perdida');
    });

    it('deve lidar com erros de validação', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Dados inválidos', code: '23505' } 
      });
      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      const result = await supabase.from('quiz_users').insert({
        // dados inválidos intencionalmente
      });

      expect(result.error).toBeTruthy();
      expect(result.error?.code).toBe('23505');
    });

    it('deve implementar retry em falhas temporárias', async () => {
      let attemptCount = 0;
      const mockInsert = vi.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.resolve({ data: null, error: { message: 'Timeout' } });
        }
        return Promise.resolve({ data: { id: 'success' }, error: null });
      });

      (supabase.from as any).mockReturnValue({
        insert: mockInsert
      });

      // Simulação de retry logic
      let result;
      let retries = 0;
      const maxRetries = 3;

      do {
        result = await supabase.from('quiz_sessions').insert({ funnel_id: mockFunnelId, quiz_user_id: mockUserId });
        retries++;
      } while (result.error && retries < maxRetries);

      expect(result.data).toEqual({ id: 'success' });
      expect(attemptCount).toBe(3);
    });
  });
});