/**
 * 📱 WHATSAPP BUSINESS API SERVICE
 * 
 * Serviço para integração com WhatsApp Business API
 * Gerencia templates, envio de mensagens e webhooks
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface WhatsAppBusinessConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  apiVersion: string;
  webhookVerifyToken: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: 'TEXT' | 'IMAGE' | 'VIDEO';
    text?: string;
    buttons?: Array<{
      type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
}

export interface WebhookMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'template' | 'interactive';
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: 'text' | 'currency' | 'date_time';
        text?: string;
        currency?: { fallback_value: string; code: string; amount_1000: number };
        date_time?: { fallback_value: string };
      }>;
    }>;
  };
  interactive?: {
    type: 'button' | 'list';
    body: { text: string };
    action: {
      buttons?: Array<{
        type: 'reply';
        reply: { id: string; title: string };
      }>;
      button?: string;
      sections?: Array<{
        title: string;
        rows: Array<{
          id: string;
          title: string;
          description?: string;
        }>;
      }>;
    };
  };
}

// ============================================================================
// SERVIÇO PRINCIPAL
// ============================================================================

export class WhatsAppBusinessAPI {
  private config: WhatsAppBusinessConfig;
  private baseUrl: string;

  constructor(config: WhatsAppBusinessConfig) {
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/${config.apiVersion}`;
  }

  /**
   * 📤 ENVIAR MENSAGEM
   */
  async sendMessage(message: WebhookMessage): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.messages?.[0]?.id
        };
      } else {
        return {
          success: false,
          error: data.error?.message || `HTTP ${response.status}`
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de rede'
      };
    }
  }

  /**
   * 📋 LISTAR TEMPLATES
   */
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.businessAccountId}/message_templates`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        return data.data || [];
      } else {
        throw new Error(data.error?.message || 'Erro ao carregar templates');
      }

    } catch (error) {
      console.error('❌ Erro ao carregar templates:', error);
      return [];
    }
  }

  /**
   * 📝 CRIAR TEMPLATE DE RECUPERAÇÃO
   */
  async createCartRecoveryTemplate(): Promise<boolean> {
    try {
      const template = {
        name: 'cart_recovery_br',
        language: 'pt_BR',
        category: 'MARKETING',
        components: [
          {
            type: 'BODY',
            text: 'Olá {{1}}! 👋\n\nVi que você estava interessado no {{2}} por {{3}}.\n\nQue tal finalizar sua compra agora? Tenho uma oferta especial para você! 🎯'
          },
          {
            type: 'BUTTONS',
            buttons: [
              {
                type: 'URL',
                text: '🛒 Finalizar Compra',
                url: 'https://pay.hotmart.com/{{4}}'
              },
              {
                type: 'QUICK_REPLY',
                text: '❓ Tenho Dúvidas'
              }
            ]
          }
        ]
      };

      const response = await fetch(
        `${this.baseUrl}/${this.config.businessAccountId}/message_templates`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(template)
        }
      );

      return response.ok;

    } catch (error) {
      console.error('❌ Erro ao criar template:', error);
      return false;
    }
  }

  /**
   * ✅ VERIFICAR SAÚDE DA API
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'error';
    phoneNumber?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: 'healthy',
          phoneNumber: data.display_phone_number
        };
      } else {
        return {
          status: 'error',
          error: data.error?.message || 'API não acessível'
        };
      }

    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro de conexão'
      };
    }
  }

  /**
   * 📊 OBTER MÉTRICAS DE MENSAGENS
   */
  async getMessagingMetrics(startDate: Date, endDate: Date): Promise<{
    sent: number;
    delivered: number;
    read: number;
    replied: number;
  }> {
    try {
      // Implementar chamada para Analytics API do WhatsApp
      const params = new URLSearchParams({
        metric: 'messages',
        since: Math.floor(startDate.getTime() / 1000).toString(),
        until: Math.floor(endDate.getTime() / 1000).toString()
      });

      const response = await fetch(
        `${this.baseUrl}/${this.config.businessAccountId}/insights?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Processar dados de métricas
        return {
          sent: data.data?.[0]?.values?.[0]?.value || 0,
          delivered: data.data?.[1]?.values?.[0]?.value || 0,
          read: data.data?.[2]?.values?.[0]?.value || 0,
          replied: data.data?.[3]?.values?.[0]?.value || 0
        };
      } else {
        throw new Error('Erro ao carregar métricas');
      }

    } catch (error) {
      console.error('❌ Erro ao carregar métricas:', error);
      return { sent: 0, delivered: 0, read: 0, replied: 0 };
    }
  }
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * 📱 VALIDAR CONFIGURAÇÃO DO WHATSAPP
 */
export function validateWhatsAppConfig(config: Partial<WhatsAppBusinessConfig>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.accessToken) {
    errors.push('Access Token é obrigatório');
  }

  if (!config.phoneNumberId) {
    errors.push('Phone Number ID é obrigatório');
  }

  if (!config.businessAccountId) {
    errors.push('Business Account ID é obrigatório');
  }

  if (config.accessToken && !config.accessToken.startsWith('EAA')) {
    errors.push('Access Token deve começar com "EAA"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 🔗 GERAR URL DE WEBHOOK
 */
export function generateWebhookUrl(baseUrl: string, verifyToken: string): string {
  return `${baseUrl}/api/webhook/whatsapp?verify_token=${verifyToken}`;
}

/**
 * 📞 FORMATAR NÚMERO BRASILEIRO
 */
export function formatBrazilianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  // Adicionar código do país (55) se não tiver
  if (cleaned.length === 11 && !cleaned.startsWith('55')) {
    return `55${cleaned}`;
  } else if (cleaned.length === 10 && !cleaned.startsWith('55')) {
    return `559${cleaned}`;
  }
  
  return cleaned;
}

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

let whatsappAPI: WhatsAppBusinessAPI | null = null;

export function initializeWhatsAppAPI(config: WhatsAppBusinessConfig): WhatsAppBusinessAPI {
  whatsappAPI = new WhatsAppBusinessAPI(config);
  return whatsappAPI;
}

export function getWhatsAppAPI(): WhatsAppBusinessAPI | null {
  return whatsappAPI;
}
