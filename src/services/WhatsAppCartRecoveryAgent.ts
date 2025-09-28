/**
 * 🤖 AGENTE DE RECUPERAÇÃO DE CARRINHO VIA WHATSAPP
 * 
 * Sistema inteligente para recuperação de carrinho abandonado usando:
 * - Webhooks da Hotmart
 * - API do WhatsApp Business
 * - Templates de mensagem personalizadas
 * - Automação de follow-up
 */

import { hotmartWebhookManager, HotmartWebhookData, HotmartBuyer } from '../utils/hotmartWebhook';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'interactive';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: { code: string };
    components: Array<{
      type: string;
      parameters: Array<{ type: string; text: string }>;
    }>;
  };
  interactive?: {
    type: 'button';
    body: { text: string };
    action: {
      buttons: Array<{
        type: 'reply';
        reply: { id: string; title: string };
      }>;
    };
  };
}

export interface CartAbandonmentData {
  transactionId: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
  productName: string;
  productPrice: number;
  currency: string;
  abandonedAt: Date;
  recoveryAttempts: number;
  lastContactAt?: Date;
  status: 'abandoned' | 'contacted' | 'recovered' | 'expired';
  hotmartData: HotmartWebhookData;
}

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  webhookVerifyToken: string;
  apiVersion: string;
}

export interface RecoveryTemplate {
  id: string;
  name: string;
  language: string;
  delay: number; // minutos após abandono
  maxAttempts: number;
  message: {
    type: 'text' | 'template' | 'interactive';
    content: string | WhatsAppMessage['template'] | WhatsAppMessage['interactive'];
  };
}

// ============================================================================
// AGENTE PRINCIPAL
// ============================================================================

export class WhatsAppCartRecoveryAgent {
  private config: WhatsAppConfig;
  private abandonedCarts = new Map<string, CartAbandonmentData>();
  private recoveryTemplates: RecoveryTemplate[] = [];
  private isActive = false;

  constructor(config: WhatsAppConfig) {
    this.config = config;
    this.initializeTemplates();
    this.setupHotmartIntegration();
  }

  /**
   * 🎯 INICIALIZAR TEMPLATES DE RECUPERAÇÃO
   */
  private initializeTemplates(): void {
    this.recoveryTemplates = [
      {
        id: 'first_contact',
        name: 'Primeiro Contato',
        language: 'pt_BR',
        delay: 30, // 30 minutos
        maxAttempts: 1,
        message: {
          type: 'template',
          content: {
            name: 'cart_recovery_first',
            language: { code: 'pt_BR' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: '{{buyerName}}' },
                  { type: 'text', text: '{{productName}}' },
                  { type: 'text', text: '{{productPrice}}' }
                ]
              }
            ]
          }
        }
      },
      {
        id: 'second_contact',
        name: 'Segundo Contato',
        language: 'pt_BR',
        delay: 1440, // 24 horas
        maxAttempts: 1,
        message: {
          type: 'interactive',
          content: {
            type: 'button',
            body: { 
              text: 'Olá {{buyerName}}! 👋\n\nNotei que você ainda não finalizou sua compra do {{productName}}.\n\nQue tal aproveitar nossa oferta especial? 🎯' 
            },
            action: {
              buttons: [
                {
                  type: 'reply',
                  reply: { id: 'complete_purchase', title: '✅ Finalizar Compra' }
                },
                {
                  type: 'reply',
                  reply: { id: 'get_discount', title: '🎁 Ver Desconto' }
                },
                {
                  type: 'reply',
                  reply: { id: 'not_interested', title: '❌ Não Tenho Interesse' }
                }
              ]
            }
          }
        }
      },
      {
        id: 'final_contact',
        name: 'Último Contato',
        language: 'pt_BR',
        delay: 4320, // 3 dias
        maxAttempts: 1,
        message: {
          type: 'text',
          content: 'Olá {{buyerName}}! 😊\n\nEsta é minha última mensagem sobre o {{productName}}.\n\nPrepareei um desconto especial de 20% só para você! 🎁\n\nCódigo: VOLTA20\n\n⏰ Válido apenas por 24h!\n\n👆 Clique aqui para finalizar: {{checkoutUrl}}'
        }
      }
    ];
  }

  /**
   * 🔗 CONFIGURAR INTEGRAÇÃO COM HOTMART
   */
  private setupHotmartIntegration(): void {
    // Interceptar eventos de carrinho abandonado
    hotmartWebhookManager.onCartAbandonment = (data: HotmartWebhookData) => {
      this.handleCartAbandonment(data);
    };

    // Interceptar eventos de compra completa
    hotmartWebhookManager.onPurchaseComplete = (data: HotmartWebhookData) => {
      this.handlePurchaseComplete(data);
    };
  }

  /**
   * 🛒 PROCESSAR CARRINHO ABANDONADO
   */
  private async handleCartAbandonment(webhookData: HotmartWebhookData): Promise<void> {
    try {
      const buyer = webhookData.data.buyer;
      const product = webhookData.data.product;
      const transaction = webhookData.data.transaction;

      if (!buyer?.phone || !this.isValidPhoneNumber(buyer.phone)) {
        console.log('📱 Telefone inválido ou não fornecido:', buyer?.phone);
        return;
      }

      const cartData: CartAbandonmentData = {
        transactionId: transaction?.id || crypto.randomUUID(),
        buyerEmail: buyer.email,
        buyerName: buyer.name,
        buyerPhone: this.formatPhoneNumber(buyer.phone),
        productName: product?.name || 'Produto',
        productPrice: product?.price?.value || 0,
        currency: product?.price?.currency_value || 'BRL',
        abandonedAt: new Date(),
        recoveryAttempts: 0,
        status: 'abandoned',
        hotmartData: webhookData
      };

      // Armazenar dados do carrinho
      this.abandonedCarts.set(cartData.transactionId, cartData);

      // Iniciar processo de recuperação
      await this.startRecoveryProcess(cartData);

      console.log('🛒 Carrinho abandonado processado:', {
        transactionId: cartData.transactionId,
        buyerName: cartData.buyerName,
        productName: cartData.productName
      });

    } catch (error) {
      console.error('❌ Erro ao processar carrinho abandonado:', error);
    }
  }

  /**
   * ✅ PROCESSAR COMPRA COMPLETA
   */
  private async handlePurchaseComplete(webhookData: HotmartWebhookData): Promise<void> {
    const transactionId = webhookData.data.transaction?.id;
    
    if (transactionId && this.abandonedCarts.has(transactionId)) {
      const cartData = this.abandonedCarts.get(transactionId)!;
      cartData.status = 'recovered';
      
      console.log('✅ Carrinho recuperado com sucesso:', {
        transactionId,
        buyerName: cartData.buyerName,
        attempts: cartData.recoveryAttempts
      });

      // Enviar mensagem de agradecimento
      await this.sendThankYouMessage(cartData);
    }
  }

  /**
   * 🚀 INICIAR PROCESSO DE RECUPERAÇÃO
   */
  private async startRecoveryProcess(cartData: CartAbandonmentData): Promise<void> {
    for (const template of this.recoveryTemplates) {
      // Agendar envio da mensagem
      setTimeout(async () => {
        if (cartData.status === 'abandoned' && cartData.recoveryAttempts < template.maxAttempts) {
          await this.sendRecoveryMessage(cartData, template);
        }
      }, template.delay * 60 * 1000); // converter minutos para ms
    }
  }

  /**
   * 📤 ENVIAR MENSAGEM DE RECUPERAÇÃO
   */
  private async sendRecoveryMessage(cartData: CartAbandonmentData, template: RecoveryTemplate): Promise<void> {
    try {
      const message = this.buildMessage(cartData, template);
      
      const response = await this.sendWhatsAppMessage(cartData.buyerPhone, message);
      
      if (response.success) {
        cartData.recoveryAttempts++;
        cartData.lastContactAt = new Date();
        cartData.status = 'contacted';

        console.log('📤 Mensagem de recuperação enviada:', {
          transactionId: cartData.transactionId,
          templateId: template.id,
          attempt: cartData.recoveryAttempts
        });

        // Salvar no banco de dados
        await this.saveRecoveryAttempt(cartData, template, response.messageId);
      }

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de recuperação:', error);
    }
  }

  /**
   * 🏗️ CONSTRUIR MENSAGEM PERSONALIZADA
   */
  private buildMessage(cartData: CartAbandonmentData, template: RecoveryTemplate): WhatsAppMessage {
    const message: WhatsAppMessage = {
      to: cartData.buyerPhone,
      type: template.message.type as any
    };

    switch (template.message.type) {
      case 'text':
        message.text = {
          body: this.replacePlaceholders(template.message.content as string, cartData)
        };
        break;

      case 'template':
        message.template = {
          ...(template.message.content as WhatsAppMessage['template']),
          components: (template.message.content as any).components.map((comp: any) => ({
            ...comp,
            parameters: comp.parameters?.map((param: any) => ({
              ...param,
              text: this.replacePlaceholders(param.text, cartData)
            }))
          }))
        };
        break;

      case 'interactive':
        const interactive = template.message.content as WhatsAppMessage['interactive'];
        message.interactive = {
          ...interactive,
          body: {
            text: this.replacePlaceholders(interactive.body.text, cartData)
          }
        };
        break;
    }

    return message;
  }

  /**
   * 🔄 SUBSTITUIR PLACEHOLDERS
   */
  private replacePlaceholders(text: string, cartData: CartAbandonmentData): string {
    return text
      .replace(/\{\{buyerName\}\}/g, cartData.buyerName)
      .replace(/\{\{productName\}\}/g, cartData.productName)
      .replace(/\{\{productPrice\}\}/g, cartData.productPrice.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: cartData.currency 
      }))
      .replace(/\{\{checkoutUrl\}\}/g, this.generateCheckoutUrl(cartData));
  }

  /**
   * 📱 ENVIAR MENSAGEM WHATSAPP
   */
  private async sendWhatsAppMessage(phone: string, message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`, {
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
          error: data.error?.message || 'Erro desconhecido'
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
   * 🙏 ENVIAR MENSAGEM DE AGRADECIMENTO
   */
  private async sendThankYouMessage(cartData: CartAbandonmentData): Promise<void> {
    const message: WhatsAppMessage = {
      to: cartData.buyerPhone,
      type: 'text',
      text: {
        body: `🎉 Parabéns ${cartData.buyerName}!\n\nSua compra do ${cartData.productName} foi confirmada com sucesso!\n\n✅ Em breve você receberá o acesso por email.\n\n🚀 Obrigado por confiar em nosso trabalho!\n\n💬 Qualquer dúvida, é só responder esta mensagem.`
      }
    };

    await this.sendWhatsAppMessage(cartData.buyerPhone, message);
  }

  /**
   * 🔗 GERAR URL DE CHECKOUT
   */
  private generateCheckoutUrl(cartData: CartAbandonmentData): string {
    // Implementar lógica para gerar URL de checkout personalizada
    const baseUrl = 'https://pay.hotmart.com';
    const productId = cartData.hotmartData.data.product?.id;
    const affiliateCode = cartData.hotmartData.data.affiliations?.[0]?.affiliate_code;
    
    return `${baseUrl}/checkout/${productId}?aff=${affiliateCode}&discount=VOLTA20`;
  }

  /**
   * 💾 SALVAR TENTATIVA DE RECUPERAÇÃO
   */
  private async saveRecoveryAttempt(cartData: CartAbandonmentData, template: RecoveryTemplate, messageId?: string): Promise<void> {
    // Implementar salvamento no banco de dados
    const attemptData = {
      transactionId: cartData.transactionId,
      templateId: template.id,
      templateName: template.name,
      sentAt: new Date(),
      messageId,
      buyerPhone: cartData.buyerPhone,
      status: 'sent'
    };

    // Salvar no Supabase ou localStorage
    try {
      const attempts = JSON.parse(localStorage.getItem('whatsapp_recovery_attempts') || '[]');
      attempts.push(attemptData);
      localStorage.setItem('whatsapp_recovery_attempts', JSON.stringify(attempts));
    } catch (error) {
      console.error('❌ Erro ao salvar tentativa:', error);
    }
  }

  /**
   * 📞 VALIDAR NÚMERO DE TELEFONE
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Regex para telefones brasileiros
    const brazilianPhoneRegex = /^(\+55|55)?(\(?[1-9]{2}\)?)?\s?9?[0-9]{4}\-?[0-9]{4}$/;
    return brazilianPhoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * 📱 FORMATAR NÚMERO DE TELEFONE
   */
  private formatPhoneNumber(phone: string): string {
    // Remover caracteres especiais
    const cleaned = phone.replace(/\D/g, '');
    
    // Adicionar código do país se não tiver
    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      return `55${cleaned}`;
    } else if (cleaned.length === 10) {
      return `559${cleaned}`;
    }
    
    return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
  }

  /**
   * ⚙️ MÉTODOS PÚBLICOS DE CONTROLE
   */
  public start(): void {
    this.isActive = true;
    console.log('🤖 Agente de Recuperação WhatsApp iniciado');
  }

  public stop(): void {
    this.isActive = false;
    console.log('🛑 Agente de Recuperação WhatsApp parado');
  }

  public getStats(): {
    totalAbandoned: number;
    totalContacted: number;
    totalRecovered: number;
    recoveryRate: number;
  } {
    const carts = Array.from(this.abandonedCarts.values());
    const totalAbandoned = carts.length;
    const totalContacted = carts.filter(c => c.status === 'contacted').length;
    const totalRecovered = carts.filter(c => c.status === 'recovered').length;
    const recoveryRate = totalAbandoned > 0 ? (totalRecovered / totalAbandoned) * 100 : 0;

    return {
      totalAbandoned,
      totalContacted,
      totalRecovered,
      recoveryRate
    };
  }
}

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

let whatsappAgent: WhatsAppCartRecoveryAgent | null = null;

export function initializeWhatsAppAgent(config: WhatsAppConfig): WhatsAppCartRecoveryAgent {
  if (!whatsappAgent) {
    whatsappAgent = new WhatsAppCartRecoveryAgent(config);
  }
  return whatsappAgent;
}

export function getWhatsAppAgent(): WhatsAppCartRecoveryAgent | null {
  return whatsappAgent;
}
