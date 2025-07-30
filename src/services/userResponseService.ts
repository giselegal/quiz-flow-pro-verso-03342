import { supabase } from '../lib/supabase';

export interface UserResponse {
  id?: string;
  funnel_id: string;
  session_id: string;
  user_name?: string;
  current_step: number;
  responses: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  is_completed: boolean;
  metadata?: Record<string, any>;
}

export interface StepResponse {
  step_id: string;
  step_number: number;
  block_id: string;
  block_type: string;
  value: any;
  timestamp: string;
}

class UserResponseService {
  private sessionId: string;
  private localStorageKey = 'quiz_user_responses';

  constructor() {
    // Gerar ou recuperar session ID único
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('quiz_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('quiz_session_id', sessionId);
    }
    return sessionId;
  }

  // Iniciar nova sessão de quiz
  async startQuizSession(funnelId: string, userName?: string): Promise<UserResponse> {
    const userResponse: UserResponse = {
      funnel_id: funnelId,
      session_id: this.sessionId,
      user_name: userName,
      current_step: 1,
      responses: {},
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        user_agent: navigator.userAgent,
        started_at: new Date().toISOString()
      }
    };

    // Salvar localmente primeiro
    this.saveToLocalStorage(userResponse);

    // Tentar salvar no Supabase (usar tabela existente adaptada)
    try {
      await this.saveToSupabase(userResponse);
      console.log('✅ Sessão de quiz iniciada no Supabase');
    } catch (error) {
      console.warn('⚠️ Falha ao salvar no Supabase, continuando offline:', error);
    }

    return userResponse;
  }

  // Salvar resposta de uma etapa
  async saveStepResponse(
    stepNumber: number, 
    blockId: string, 
    blockType: string, 
    value: any,
    funnelId: string
  ): Promise<void> {
    const stepResponse: StepResponse = {
      step_id: `step-${stepNumber}`,
      step_number: stepNumber,
      block_id: blockId,
      block_type: blockType,
      value: value,
      timestamp: new Date().toISOString()
    };

    // Carregar resposta atual
    let userResponse = this.getFromLocalStorage() || await this.loadUserResponse(funnelId);
    
    if (!userResponse) {
      // Se não existe, criar nova sessão
      userResponse = await this.startQuizSession(funnelId);
    }

    // Atualizar respostas
    userResponse.responses[blockId] = stepResponse;
    userResponse.current_step = Math.max(userResponse.current_step, stepNumber);
    userResponse.updated_at = new Date().toISOString();

    // Salvar localmente
    this.saveToLocalStorage(userResponse);

    // Salvar no Supabase
    try {
      await this.saveToSupabase(userResponse);
      console.log(`✅ Resposta da etapa ${stepNumber} salva no Supabase`);
    } catch (error) {
      console.warn('⚠️ Falha ao salvar resposta no Supabase:', error);
    }
  }

  // Salvar nome do usuário (Etapa 1)
  async saveUserName(userName: string, funnelId: string): Promise<void> {
    await this.saveStepResponse(1, 'intro-name-input', 'form-input', userName, funnelId);
    
    // Atualizar nome na sessão principal
    let userResponse = this.getFromLocalStorage();
    if (userResponse) {
      userResponse.user_name = userName;
      userResponse.updated_at = new Date().toISOString();
      this.saveToLocalStorage(userResponse);
      
      try {
        await this.saveToSupabase(userResponse);
      } catch (error) {
        console.warn('⚠️ Falha ao atualizar nome no Supabase:', error);
      }
    }
  }

  // Marcar quiz como completo
  async completeQuiz(funnelId: string): Promise<void> {
    let userResponse = this.getFromLocalStorage();
    if (userResponse) {
      userResponse.is_completed = true;
      userResponse.completed_at = new Date().toISOString();
      userResponse.updated_at = new Date().toISOString();
      
      this.saveToLocalStorage(userResponse);
      
      try {
        await this.saveToSupabase(userResponse);
        console.log('✅ Quiz marcado como completo no Supabase');
      } catch (error) {
        console.warn('⚠️ Falha ao marcar como completo no Supabase:', error);
      }
    }
  }

  // Carregar respostas do usuário
  async loadUserResponse(funnelId: string): Promise<UserResponse | null> {
    // Tentar carregar do localStorage primeiro
    const localResponse = this.getFromLocalStorage();
    if (localResponse && localResponse.funnel_id === funnelId) {
      return localResponse;
    }

    // Tentar carregar do Supabase
    try {
      const { data, error } = await supabase
        .from('quizzes') // Usar tabela existente
        .select('*')
        .eq('id', `response_${this.sessionId}`)
        .single();

      if (error) throw error;

      if (data && data.data) {
        const userResponse = data.data as UserResponse;
        this.saveToLocalStorage(userResponse);
        return userResponse;
      }
    } catch (error) {
      console.warn('⚠️ Falha ao carregar do Supabase:', error);
    }

    return null;
  }

  // Obter nome do usuário atual
  getUserName(): string | null {
    const response = this.getFromLocalStorage();
    return response?.user_name || null;
  }

  // Obter todas as respostas
  getAllResponses(): Record<string, StepResponse> {
    const response = this.getFromLocalStorage();
    return response?.responses || {};
  }

  // Obter resposta específica
  getResponse(blockId: string): any {
    const responses = this.getAllResponses();
    return responses[blockId]?.value || null;
  }

  // Limpar sessão
  clearSession(): void {
    localStorage.removeItem(this.localStorageKey);
    localStorage.removeItem('quiz_session_id');
    this.sessionId = this.getOrCreateSessionId();
  }

  // Métodos privados para persistência
  private saveToLocalStorage(userResponse: UserResponse): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(userResponse));
    } catch (error) {
      console.error('❌ Erro ao salvar no localStorage:', error);
    }
  }

  private getFromLocalStorage(): UserResponse | null {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('❌ Erro ao carregar do localStorage:', error);
      return null;
    }
  }

  private async saveToSupabase(userResponse: UserResponse): Promise<void> {
    // Adaptar para usar a tabela 'quizzes' existente
    const supabaseData = {
      id: `response_${this.sessionId}`,
      title: `Resposta: ${userResponse.user_name || 'Usuário'} - ${userResponse.funnel_id}`,
      description: `Sessão iniciada em ${userResponse.created_at}`,
      category: 'user_response',
      difficulty: 'easy' as const,
      data: userResponse,
      is_published: false,
      created_at: userResponse.created_at,
      updated_at: userResponse.updated_at
    };

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('quizzes')
      .select('id')
      .eq('id', supabaseData.id)
      .single();

    if (existing) {
      // Atualizar existente
      const { error } = await supabase
        .from('quizzes')
        .update(supabaseData)
        .eq('id', supabaseData.id);
      
      if (error) throw error;
    } else {
      // Criar novo
      const { error } = await supabase
        .from('quizzes')
        .insert([supabaseData]);
      
      if (error) throw error;
    }
  }

  // Método para debug/admin
  async getAllUserResponses(): Promise<UserResponse[]> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('category', 'user_response');

      if (error) throw error;

      return data?.map(item => item.data as UserResponse) || [];
    } catch (error) {
      console.error('❌ Erro ao carregar respostas do Supabase:', error);
      return [];
    }
  }
}

// Exportar instância singleton
export const userResponseService = new UserResponseService();
