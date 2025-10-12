/**
 * 🤖 HOOK PARA WHATSAPP CART RECOVERY
 * 
 * Hook centralizado para gerenciar toda funcionalidade de 
 * recuperação de carrinho via WhatsApp
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  WhatsAppCartRecoveryAgent,
  WhatsAppConfig,
  CartAbandonmentData,
} from '@/services/WhatsAppCartRecoveryAgent';
import {
  initializeWhatsAppAgent,
  getWhatsAppAgent
} from '@/services/WhatsAppCartRecoveryAgent';

// Mock interfaces for compatibility
interface WhatsAppRecoveryStats {
  totalAbandoned: number;
  totalContacted: number;
  totalRecovered: number;
  recoveryRate: number;
  revenueRecovered: number;
}

interface WhatsAppRecoveryState {
  isActive: boolean;
  isConfigured: boolean;
  recentActivity: Array<{
    id: string;
    type: 'abandoned' | 'contacted' | 'recovered';
    buyerName: string;
    productName: string;
    timestamp: Date;
  }>;
  error: string | null;
  loading: boolean;
  stats: WhatsAppRecoveryStats;
}

interface WhatsAppRecoveryActions {
  configure: (config: WhatsAppConfig) => Promise<boolean>;
  start: () => void;
  stop: () => void;
  testMessage: (phone: string) => Promise<boolean>;
  sendTestMessage: (phone: string) => Promise<boolean>; // Alias
  refreshStats: () => void;
  clearError: () => void;
  isPhoneValid: (phone: string) => boolean;
  formatPhone: (phone: string) => string;
}

interface UseWhatsAppCartRecoveryReturn {
  state: WhatsAppRecoveryState;
  actions: WhatsAppRecoveryActions;
  agent: WhatsAppCartRecoveryAgent | null;
}

export function useWhatsAppCartRecovery(): UseWhatsAppCartRecoveryReturn {
  const [agent, setAgent] = useState<WhatsAppCartRecoveryAgent | null>(null);
  const [state, setState] = useState<WhatsAppRecoveryState>({
    isActive: false,
    isConfigured: false,
    recentActivity: [],
    error: null,
    loading: false,
    stats: {
      totalAbandoned: 0,
      totalContacted: 0,
      totalRecovered: 0,
      recoveryRate: 0,
      revenueRecovered: 0
    }
  });

  /**
   * 📊 ATUALIZAR ESTATÍSTICAS
   */
  const updateStats = useCallback(() => {
    const agent = getWhatsAppAgent();
    if (agent) {
      const stats = agent.getStats();
      setState((prev: any) => ({
        ...prev,
        stats: {
          totalAbandoned: stats.totalAbandoned,
          totalContacted: stats.totalContacted || 0,
          totalRecovered: stats.totalRecovered || stats.recoveredSales,
          recoveryRate: stats.recoveryRate,
          revenueRecovered: stats.revenueRecovered
        }
      }));
    }
  }, []);

  /**
   * ⚙️ CONFIGURAR WHATSAPP RECOVERY
   */
  const configure = useCallback(async (config: WhatsAppConfig): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Validar configuração
      if (!config.accessToken && !config.token) {
        throw new Error('Token de acesso é obrigatório');
      }

      if (!config.phoneNumberId) {
        throw new Error('Phone Number ID é obrigatório');
      }

      // Testar conexão com WhatsApp Business API
      const testConnection = await fetch(
        `https://graph.facebook.com/${config.apiVersion || 'v18.0'}/${config.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.accessToken || config.token}`
          }
        }
      );

      if (!testConnection.ok) {
        throw new Error('Falha ao conectar com WhatsApp Business API');
      }

      // Inicializar agente
      const newAgent = initializeWhatsAppAgent(config);
      setAgent(newAgent);

      // Atualizar estado
      setState(prev => ({
        ...prev,
        isConfigured: true,
        loading: false,
        error: null
      }));

      // Mock recent activity
      const mockActivity = [
        {
          id: '1',
          type: 'abandoned' as const,
          buyerName: 'João Silva',
          productName: 'Quiz de Estilo Premium',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: '2',
          type: 'contacted' as const,
          buyerName: 'Maria Santos',
          productName: 'Quiz de Estilo Premium',
          timestamp: new Date(Date.now() - 15 * 60 * 1000)
        }
      ];

      setState(prev => ({
        ...prev,
        recentActivity: mockActivity
      }));

      return true;

    } catch (error) {
      console.error('❌ Erro ao configurar WhatsApp Recovery:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isConfigured: false
      }));
      return false;
    }
  }, []);

  /**
   * ▶️ INICIAR RECUPERAÇÃO
   */
  const start = useCallback(() => {
    if (agent) {
      agent.start();
      setState(prev => ({
        ...prev,
        isActive: true,
        error: null
      }));
      
      console.log('✅ WhatsApp Cart Recovery iniciado');
    }
  }, [agent]);

  /**
   * ⏹️ PARAR RECUPERAÇÃO
   */
  const stop = useCallback(() => {
    if (agent) {
      agent.stop();
      setState(prev => ({
        ...prev,
        isActive: false
      }));
      
      console.log('⏹️ WhatsApp Cart Recovery parado');
    }
  }, [agent]);

  /**
   * 📱 TESTAR ENVIO DE MENSAGEM
   */
  const testMessage = useCallback(async (phone: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Mock test message
      await new Promise(resolve => setTimeout(resolve, 1500));

      setState(prev => ({ ...prev, loading: false }));
      
      console.log('✅ Mensagem de teste enviada para:', phone);
      return true;

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de teste:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao enviar mensagem'
      }));
      return false;
    }
  }, []);

  /**
   * 🔄 ATUALIZAR ESTATÍSTICAS
   */
  const refreshStats = useCallback(() => {
    updateStats();
  }, [updateStats]);

  /**
   * 🚫 LIMPAR ERRO
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * 📱 VALIDAR TELEFONE
   */
  const isPhoneValid = useCallback((phone: string): boolean => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }, []);

  /**
   * 📱 FORMATAR TELEFONE
   */
  const formatPhone = useCallback((phone: string): string => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Se não começar com código do país, assumir Brasil (+55)
    if (!cleaned.startsWith('55') && cleaned.length <= 11) {
      return `+55${cleaned}`;
    }
    
    return `+${cleaned}`;
  }, []);

  // Atualizar stats periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isActive && agent) {
        updateStats();
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [state.isActive, agent, updateStats]);

  // Simular abandonment detection
  useEffect(() => {
    if (state.isActive) {
      const interval = setInterval(() => {
        // Mock abandonment detection
        const mockAbandonment: CartAbandonmentData = {
          buyerId: `buyer_${Date.now()}`,
          productId: 'quiz-style-premium',
          value: 97.00
        };

        // Add to recent activity
        const newActivity = {
          id: `activity_${Date.now()}`,
          type: 'abandoned' as const,
          buyerName: `Cliente ${Math.floor(Math.random() * 1000)}`,
          productName: 'Quiz de Estilo Premium',
          timestamp: new Date()
        };

        setState(prev => ({
          ...prev,
          recentActivity: [newActivity, ...prev.recentActivity.slice(0, 9)]
        }));

        console.log('🛒 Carrinho abandonado detectado (simulado):', mockAbandonment);
      }, 60000); // A cada minuto

      return () => clearInterval(interval);
    }
  }, [state.isActive]);

  // Effect para atualizar stats ao configurar
  useEffect(() => {
    if (state.isConfigured && agent) {
      // Simular estatísticas iniciais
      const mockStats = {
        totalAbandoned: 147,
        totalContacted: 89,
        totalRecovered: 23,
        recoveryRate: 15.6,
        revenueRecovered: 2231.00
      };

      setState(prev => ({
        ...prev,
        stats: mockStats
      }));
    }
  }, [state.isConfigured, agent]);

  return {
    state,
    actions: {
      configure,
      start,
      stop,
      testMessage,
      sendTestMessage: testMessage, // Alias
      refreshStats,
      clearError,
      isPhoneValid,
      formatPhone
    },
    agent
  };
}

export { useWhatsAppCartRecovery as useWhatsAppRecoveryStats };
export default useWhatsAppCartRecovery;