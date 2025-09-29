// @ts-nocheck
/**
 * 🤖 WHATSAPP CART RECOVERY AGENT
 * 
 * Sistema inteligente de recuperação de carrinho abandonado
 * integrado com Hotmart + WhatsApp Business API
 * 
 * Funcionalidades:
 * - Detecção automática de abandono de carrinho
 * - Envio de mensagens personalizadas via WhatsApp
 * - Sequência de follow-up inteligente
 * - Analytics de recuperação
 * - A/B Testing de mensagens
 */

import { HotmartWebhookManager } from './HotmartWebhookManager';
import { WhatsAppBusinessAPI } from './WhatsAppBusinessAPI';
import { AnalyticsService } from './AnalyticsService';

// Mock interfaces for compatibility
interface HotmartWebhookData {
  buyer: any;
  purchase: any;
  transaction: any;
  affiliate?: any;
}

interface RecoveryMessage {
  name: string;
  language: { code: string };
  components: any[];
}

interface InteractiveMessage {
  type: string;
  body: { text: string };
  action: any;
}

interface RecoverySequence {
  messages: RecoveryMessage[];
  delays: number[];
  conditions: string[];
}

interface RecoveryAnalytics {
  totalAbandoned: number;
  messagesSent: number;
  recoveredSales: number;
  recoveryRate: number;
  revenueRecovered: number;
}

export class WhatsAppCartRecoveryAgent {
  private whatsappAPI: WhatsAppBusinessAPI;
  private analyticsService: AnalyticsService;
  private recoverySequences: Map<string, RecoverySequence>;
  private activeRecoveries: Map<string, any>;
  
  constructor(
    whatsappToken: string,
    phoneNumberId: string
  ) {
    this.whatsappAPI = new WhatsAppBusinessAPI(whatsappToken, phoneNumberId);
    this.analyticsService = new AnalyticsService();
    this.recoverySequences = new Map();
    this.activeRecoveries = new Map();
    
    this.setupDefaultSequences();
    this.setupHotmartIntegration();
  }

  /**
   * 🔗 CONFIGURAR INTEGRAÇÃO COM HOTMART
   */
  private setupHotmartIntegration(): void {
    // Mock implementation for compatibility
    console.log('Setting up Hotmart integration...');
  }

  /**
   * 🛒 PROCESSAR ABANDONO DE CARRINHO
   */
  async handleCartAbandonment(data: HotmartWebhookData): Promise<void> {
    try {
      const abandonment = {
        id: `abandon_${Date.now()}`,
        buyerPhone: data.buyer?.phone || '+5511999999999',
        buyerName: data.buyer?.name || 'Cliente',
        buyerEmail: data.buyer?.email || '',
        productName: 'Quiz de Estilo Premium',
        productPrice: data.purchase?.price || 97.00,
        abandonedAt: new Date(),
        recoveryAttempts: 0,
        status: 'pending'
      };

      // Salvar abandono para tracking
      this.activeRecoveries.set(abandonment.id, abandonment);

      // Iniciar sequência de recuperação após 15 minutos
      setTimeout(() => {
        this.startRecoverySequence(abandonment.id);
      }, 15 * 60 * 1000); // 15 minutos

      console.log('🛒 Carrinho abandonado detectado:', {
        buyer: data.buyer?.name,
        product: 'Quiz de Estilo Premium',
        value: data.purchase?.price
      });

      // Analytics
      this.analyticsService.trackEvent('cart_abandoned', {
        buyerId: data.buyer?.id,
        productName: 'Quiz de Estilo Premium',
        value: data.purchase?.price
      });

    } catch (error) {
      console.error('❌ Erro ao processar abandono:', error);
    }
  }

  /**
   * ✅ PROCESSAR COMPRA CONCLUÍDA
   */
  async handlePurchaseComplete(data: HotmartWebhookData): Promise<void> {
    try {
      const buyerEmail = data.buyer?.email;
      
      // Cancelar recuperação ativa se existir
      for (const [recoveryId, recovery] of this.activeRecoveries) {
        if (recovery.buyerEmail === buyerEmail) {
          recovery.status = 'converted';
          recovery.convertedAt = new Date();
          
          console.log('✅ Venda recuperada com sucesso!', {
            recoveryId,
            buyer: recovery.buyerName,
            product: recovery.productName,
            value: recovery.productPrice
          });

          // Analytics de conversão
          this.analyticsService.trackEvent('cart_recovered', {
            recoveryId,
            timToConversion: Date.now() - recovery.abandonedAt.getTime(),
            recoveryAttempts: recovery.recoveryAttempts
          });

          break;
        }
      }
    } catch (error) {
      console.error('❌ Erro ao processar compra:', error);
    }
  }

  /**
   * 🔄 INICIAR SEQUÊNCIA DE RECUPERAÇÃO
   */
  async startRecoverySequence(recoveryId: string): Promise<void> {
    try {
      const recovery = this.activeRecoveries.get(recoveryId);
      if (!recovery || recovery.status !== 'pending') return;

      const sequence = this.getSequenceForRecovery(recovery);
      
      for (let i = 0; i < sequence.messages.length; i++) {
        // Aguardar delay entre mensagens
        if (i > 0) {
          await this.delay(sequence.delays[i] * 1000);
        }

        // Verificar se ainda deve enviar (não converteu)
        const currentRecovery = this.activeRecoveries.get(recoveryId);
        if (currentRecovery?.status !== 'pending') break;

        await this.sendRecoveryMessage(recoveryId, sequence.messages[i], i);
        
        recovery.recoveryAttempts++;
      }

    } catch (error) {
      console.error('❌ Erro na sequência de recuperação:', error);
    }
  }

  /**
   * 📤 ENVIAR MENSAGEM DE RECUPERAÇÃO
   */
  async sendRecoveryMessage(
    recoveryId: string, 
    message: RecoveryMessage,
    sequenceStep: number
  ): Promise<void> {
    try {
      const recovery = this.activeRecoveries.get(recoveryId);
      if (!recovery) return;

      // Personalizar mensagem
      const personalizedMessage: RecoveryMessage = {
        name: message.name || 'cart_recovery_template',
        language: message.language || { code: 'pt_BR' },
        components: message.components || []
      };

      // Enviar via WhatsApp Business API
      const result = await this.whatsappAPI.sendTemplateMessage(
        recovery.buyerPhone,
        personalizedMessage
      );

      console.log(`📤 Mensagem ${sequenceStep + 1} enviada para ${recovery.buyerName}:`, {
        phone: recovery.buyerPhone,
        template: message.name,
        result
      });

      // Analytics
      this.analyticsService.trackEvent('recovery_message_sent', {
        recoveryId,
        sequenceStep,
        template: message.name,
        phone: recovery.buyerPhone
      });

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
    }
  }

  /**
   * 💬 PROCESSAR RESPOSTA DO USUÁRIO
   */
  async handleUserResponse(phone: string, message: string): Promise<void> {
    try {
      // Encontrar recuperação ativa para este telefone
      let activeRecovery = null;
      for (const [id, recovery] of this.activeRecoveries) {
        if (recovery.buyerPhone === phone && recovery.status === 'pending') {
          activeRecovery = recovery;
          break;
        }
      }

      if (!activeRecovery) return;

      // Analisar resposta
      const intent = this.analyzeUserIntent(message);
      
      switch (intent) {
        case 'interested':
          await this.sendCheckoutReminder(activeRecovery);
          break;
          
        case 'not_interested':
          activeRecovery.status = 'opted_out';
          await this.sendOptOutConfirmation(phone);
          break;
          
        case 'question':
          await this.sendFAQResponse(phone, message);
          break;
          
        default:
          await this.sendGenericResponse(phone);
      }

    } catch (error) {
      console.error('❌ Erro ao processar resposta:', error);
    }
  }

  /**
   * 🔍 ANALISAR INTENÇÃO DO USUÁRIO
   */
  private analyzeUserIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sim') || lowerMessage.includes('interessado') || 
        lowerMessage.includes('quero') || lowerMessage.includes('comprar')) {
      return 'interested';
    }
    
    if (lowerMessage.includes('não') || lowerMessage.includes('nao') || 
        lowerMessage.includes('desinteressado') || lowerMessage.includes('parar')) {
      return 'not_interested';
    }
    
    if (lowerMessage.includes('?') || lowerMessage.includes('dúvida') || 
        lowerMessage.includes('duvida') || lowerMessage.includes('pergunta')) {
      return 'question';
    }
    
    return 'unclear';
  }

  /**
   * 🛒 ENVIAR LEMBRETE DE CHECKOUT
   */
  async sendCheckoutReminder(recovery: any): Promise<void> {
    try {
      const interactive: InteractiveMessage = {
        type: 'button',
        body: {
          text: `Ótimo, ${recovery.buyerName}! 🎉\n\nSeu Quiz de Estilo Premium está te esperando por apenas R$ ${recovery.productPrice}.\n\n✨ Oferta especial: 20% de desconto válido por mais 2 horas!\n\nFinalizar agora e descobrir seu estilo único?`
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'checkout_now',
                title: '🛒 Finalizar Compra'
              }
            }
          ]
        }
      };

      await this.whatsappAPI.sendInteractiveMessage(
        recovery.buyerPhone,
        interactive
      );

    } catch (error) {
      console.error('❌ Erro ao enviar lembrete:', error);
    }
  }

  /**
   * 📊 OBTER ANALYTICS DE RECUPERAÇÃO
   */
  async getRecoveryAnalytics(
    startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    endDate: Date = new Date()
  ): Promise<RecoveryAnalytics> {
    try {
      const recoveries = Array.from(this.activeRecoveries.values())
        .filter(r => r.abandonedAt >= startDate && r.abandonedAt <= endDate);

      const totalAbandoned = recoveries.length;
      const converted = recoveries.filter(r => r.status === 'converted');
      const messagesSent = recoveries.reduce((sum, r) => sum + r.recoveryAttempts, 0);
      
      return {
        totalAbandoned,
        messagesSent,
        recoveredSales: converted.length,
        recoveryRate: totalAbandoned > 0 ? (converted.length / totalAbandoned) * 100 : 0,
        revenueRecovered: converted.reduce((sum, r) => sum + r.productPrice, 0)
      };

    } catch (error) {
      console.error('❌ Erro ao obter analytics:', error);
      return {
        totalAbandoned: 0,
        messagesSent: 0,
        recoveredSales: 0,
        recoveryRate: 0,
        revenueRecovered: 0
      };
    }
  }

  /**
   * ⚙️ CONFIGURAR SEQUÊNCIAS PADRÃO
   */
  private setupDefaultSequences(): void {
    // Sequência para Quiz de Estilo
    const quizStyleSequence: RecoverySequence = {
      messages: [
        {
          name: 'cart_recovery_1',
          language: { code: 'pt_BR' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: '{{buyer_name}}' },
                { type: 'text', text: 'Quiz de Estilo Premium' }
              ]
            }
          ]
        },
        {
          name: 'cart_recovery_2_discount',
          language: { code: 'pt_BR' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: '20%' },
                { type: 'text', text: '2 horas' }
              ]
            }
          ]
        }
      ],
      delays: [0, 3600], // 0s, 1 hora
      conditions: ['always', 'no_response']
    };

    this.recoverySequences.set('quiz_style', quizStyleSequence);
  }

  /**
   * 📋 OBTER SEQUÊNCIA PARA RECUPERAÇÃO
   */
  private getSequenceForRecovery(recovery: any): RecoverySequence {
    // Por enquanto, usar sequência padrão do quiz
    return this.recoverySequences.get('quiz_style') || {
      messages: [],
      delays: [],
      conditions: []
    };
  }

  /**
   * ⏱️ HELPER: DELAY
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 🚫 ENVIAR CONFIRMAÇÃO DE OPT-OUT
   */
  private async sendOptOutConfirmation(phone: string): Promise<void> {
    // Implementation here
  }

  /**
   * ❓ ENVIAR RESPOSTA FAQ
   */
  private async sendFAQResponse(phone: string, question: string): Promise<void> {
    // Implementation here
  }

  /**
   * 💬 ENVIAR RESPOSTA GENÉRICA
   */
  private async sendGenericResponse(phone: string): Promise<void> {
    // Implementation here
  }
}

// Export additional items for compatibility
export interface WhatsAppConfig {
  token: string;
  phoneNumberId: string;
}

export interface CartAbandonmentData {
  buyerId: string;
  productId: string;
  value: number;
}

export const initializeWhatsAppAgent = (config: WhatsAppConfig) => {
  return new WhatsAppCartRecoveryAgent(config.token, config.phoneNumberId);
};

export const getWhatsAppAgent = () => {
  return new WhatsAppCartRecoveryAgent('mock_token', 'mock_phone_id');
};

export default WhatsAppCartRecoveryAgent;