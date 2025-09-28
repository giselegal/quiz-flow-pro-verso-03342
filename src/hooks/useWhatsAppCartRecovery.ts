/**
 * 🤖 HOOK PARA RECUPERAÇÃO DE CARRINHO VIA WHATSAPP
 * 
 * Hook React para integrar o agente de recuperação de carrinho
 * com componentes da interface
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  WhatsAppCartRecoveryAgent, 
  WhatsAppConfig, 
  CartAbandonmentData,
  initializeWhatsAppAgent,
  getWhatsAppAgent 
} from '../services/WhatsAppCartRecoveryAgent';

// ============================================================================
// TIPOS
// ============================================================================

interface WhatsAppRecoveryStats {
  totalAbandoned: number;
  totalContacted: number;
  totalRecovered: number;
  recoveryRate: number;
}

interface WhatsAppRecoveryState {
  isActive: boolean;
  isConfigured: boolean;
  stats: WhatsAppRecoveryStats;
  recentActivity: Array<{
    id: string;
    type: 'abandoned' | 'contacted' | 'recovered';
    buyerName: string;
    productName: string;
    timestamp: Date;
  }>;
  error: string | null;
  loading: boolean;
}

interface UseWhatsAppCartRecoveryReturn {
  // Estado
  state: WhatsAppRecoveryState;
  
  // Ações
  configure: (config: WhatsAppConfig) => Promise<boolean>;
  start: () => void;
  stop: () => void;
  sendTestMessage: (phone: string) => Promise<boolean>;
  getRecoveryHistory: () => Promise<CartAbandonmentData[]>;
  
  // Utilitários
  isPhoneValid: (phone: string) => boolean;
  formatPhone: (phone: string) => string;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useWhatsAppCartRecovery(): UseWhatsAppCartRecoveryReturn {
  const [state, setState] = useState<WhatsAppRecoveryState>({
    isActive: false,
    isConfigured: false,
    stats: {
      totalAbandoned: 0,
      totalContacted: 0,
      totalRecovered: 0,
      recoveryRate: 0
    },
    recentActivity: [],
    error: null,
    loading: false
  });

  /**
   * 🔄 ATUALIZAR ESTATÍSTICAS
   */
  const updateStats = useCallback(() => {
    const agent = getWhatsAppAgent();
    if (agent) {
      const stats = agent.getStats();
      setState(prev => ({
        ...prev,
        stats
      }));
    }
  }, []);

  /**
   * ⚙️ CONFIGURAR AGENTE
   */
  const configure = useCallback(async (config: WhatsAppConfig): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Validar configuração
      if (!config.accessToken || !config.phoneNumberId) {
        throw new Error('Token de acesso e ID do telefone são obrigatórios');
      }

      // Testar conexão com API do WhatsApp
      const testResponse = await fetch(
        `https://graph.facebook.com/${config.apiVersion || 'v18.0'}/${config.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.accessToken}`
          }
        }
      );

      if (!testResponse.ok) {
        throw new Error('Falha na conexão com WhatsApp Business API');
      }

      // Inicializar agente
      const agent = initializeWhatsAppAgent(config);
      
      // Salvar configuração no localStorage
      localStorage.setItem('whatsapp_config', JSON.stringify(config));

      setState(prev => ({
        ...prev,
        isConfigured: true,
        loading: false,
        error: null
      }));

      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  /**
   * 🚀 INICIAR AGENTE
   */
  const start = useCallback(() => {
    const agent = getWhatsAppAgent();
    if (agent) {
      agent.start();
      setState(prev => ({
        ...prev,
        isActive: true,
        error: null
      }));
    } else {
      setState(prev => ({
        ...prev,
        error: 'Agente não configurado'
      }));
    }
  }, []);

  /**
   * 🛑 PARAR AGENTE
   */
  const stop = useCallback(() => {
    const agent = getWhatsAppAgent();
    if (agent) {
      agent.stop();
      setState(prev => ({
        ...prev,
        isActive: false
      }));
    }
  }, []);

  /**
   * 📤 ENVIAR MENSAGEM DE TESTE
   */
  const sendTestMessage = useCallback(async (phone: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const agent = getWhatsAppAgent();
      if (!agent) {
        throw new Error('Agente não configurado');
      }

      // Formatar telefone
      const formattedPhone = formatPhone(phone);

      // Criar mensagem de teste
      const testMessage = {
        to: formattedPhone,
        type: 'text' as const,
        text: {
          body: '🤖 Esta é uma mensagem de teste do seu agente de recuperação de carrinho!\n\n✅ Configuração funcionando corretamente!'
        }
      };

      // Enviar mensagem (usando método privado através de reflexão)
      const result = await (agent as any).sendWhatsAppMessage(formattedPhone, testMessage);

      setState(prev => ({ ...prev, loading: false }));

      if (result.success) {
        return true;
      } else {
        setState(prev => ({ ...prev, error: result.error || 'Erro ao enviar mensagem' }));
        return false;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  /**
   * 📊 OBTER HISTÓRICO DE RECUPERAÇÃO
   */
  const getRecoveryHistory = useCallback(async (): Promise<CartAbandonmentData[]> => {
    try {
      // Carregar do localStorage
      const attempts = JSON.parse(localStorage.getItem('whatsapp_recovery_attempts') || '[]');
      
      // Agrupar por transactionId
      const grouped = attempts.reduce((acc: any, attempt: any) => {
        if (!acc[attempt.transactionId]) {
          acc[attempt.transactionId] = {
            transactionId: attempt.transactionId,
            attempts: []
          };
        }
        acc[attempt.transactionId].attempts.push(attempt);
        return acc;
      }, {});

      return Object.values(grouped);
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
      return [];
    }
  }, []);

  /**
   * 📱 VALIDAR TELEFONE
   */
  const isPhoneValid = useCallback((phone: string): boolean => {
    const brazilianPhoneRegex = /^(\+55|55)?(\(?[1-9]{2}\)?)?\s?9?[0-9]{4}\-?[0-9]{4}$/;
    return brazilianPhoneRegex.test(phone.replace(/\s/g, ''));
  }, []);

  /**
   * 📱 FORMATAR TELEFONE
   */
  const formatPhone = useCallback((phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      return `55${cleaned}`;
    } else if (cleaned.length === 10) {
      return `559${cleaned}`;
    }
    
    return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
  }, []);

  /**
   * 🔄 CARREGAR CONFIGURAÇÃO INICIAL
   */
  useEffect(() => {
    const savedConfig = localStorage.getItem('whatsapp_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        configure(config);
      } catch (error) {
        console.error('❌ Erro ao carregar configuração salva:', error);
      }
    }
  }, [configure]);

  /**
   * 📊 ATUALIZAR ESTATÍSTICAS PERIODICAMENTE
   */
  useEffect(() => {
    const interval = setInterval(updateStats, 30000); // 30 segundos
    updateStats(); // Primeira execução

    return () => clearInterval(interval);
  }, [updateStats]);

  return {
    state,
    configure,
    start,
    stop,
    sendTestMessage,
    getRecoveryHistory,
    isPhoneValid,
    formatPhone
  };
}

// ============================================================================
// HOOK PARA ESTATÍSTICAS EM TEMPO REAL
// ============================================================================

export function useWhatsAppRecoveryStats() {
  const [stats, setStats] = useState<WhatsAppRecoveryStats>({
    totalAbandoned: 0,
    totalContacted: 0,
    totalRecovered: 0,
    recoveryRate: 0
  });

  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: 'abandoned' | 'contacted' | 'recovered';
    buyerName: string;
    productName: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    const updateStats = () => {
      const agent = getWhatsAppAgent();
      if (agent) {
        setStats(agent.getStats());
        
        // Simular atividade recente (em produção, viria do agente)
        const mockActivity = [
          {
            id: '1',
            type: 'abandoned' as const,
            buyerName: 'Maria Silva',
            productName: 'Curso de Estilo',
            timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 min atrás
          },
          {
            id: '2',
            type: 'contacted' as const,
            buyerName: 'João Santos',
            productName: 'Consultoria Personal',
            timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 min atrás
          }
        ];
        
        setRecentActivity(mockActivity);
      }
    };

    const interval = setInterval(updateStats, 10000); // 10 segundos
    updateStats();

    return () => clearInterval(interval);
  }, []);

  return { stats, recentActivity };
}
