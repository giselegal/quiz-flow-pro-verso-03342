// @ts-nocheck
// Sistema de Webhook Hotmart
// ID: agQzTLUehWUfhPzjhdwntVQz0JNT5E0216ae0d-00a9-48ae-85d1-f0d14bd8e0df

// Database operations are now handled by server-side API
import { trackSaleConversion } from './analytics';
import { generateSemanticId } from './semanticIdGenerator';

// Interfaces para dados do webhook Hotmart
export interface HotmartBuyer {
  email: string;
  name: string;
  document: string;
  phone?: string;
}

export interface HotmartPrice {
  value: number;
  currency_value: string;
}

export interface HotmartPurchase {
  price: HotmartPrice;
  transaction: string;
  product: {
    id: number;
    name: string;
  };
  commission?: {
    value: number;
  };
  approved_date: string;
}

export interface HotmartWebhookData {
  event: string;
  data: {
    buyer: HotmartBuyer;
    purchase: HotmartPurchase;
    transaction: {
      id: string;
      timestamp: string;
    };
    affiliate?: {
      name: string;
      email: string;
    };
  };
  webhook_id: string;
  timestamp: string;
}

// Estrutura para dados do usuário armazenados
export interface UserAnalyticsData {
  email: string;
  utm_parameters: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    utm_id?: string;
  };
  session_id: string;
  timestamp: string;
  fbclid?: string;
  gclid?: string;
  page_url: string;
  quiz_results?: Record<string, unknown>;
  funnel_step: string;
}

// Classe principal para gerenciar webhooks Hotmart
export class HotmartWebhookManager {
  private readonly WEBHOOK_ID =
    'agQzTLUehWUfhPzjhdwntVQz0JNT5E0216ae0d-00a9-48ae-85d1-f0d14bd8e0df';
  private userDataStore: Map<string, UserAnalyticsData> = new Map();

  constructor() {
    this.initializeUserDataRetrieval();
  }

  // Armazenar dados do usuário para correlação futura
  public storeUserData(email: string, data: Partial<UserAnalyticsData>): void {
    try {
      const existingData = this.userDataStore.get(email) || ({} as UserAnalyticsData);

      const userData: UserAnalyticsData = {
        ...existingData,
        email,
        utm_parameters: data.utm_parameters || this.getStoredUTMParameters(),
        session_id: data.session_id || this.generateSessionId(),
        timestamp: new Date().toISOString(),
        fbclid: data.fbclid || this.getStoredValue('fbclid'),
        gclid: data.gclid || this.getStoredValue('gclid'),
        page_url: data.page_url || window.location.href,
        quiz_results: data.quiz_results,
        funnel_step: data.funnel_step || 'quiz_completion',
      };

      this.userDataStore.set(email, userData);

      // Armazenar também no localStorage para persistência
      this.persistUserData(email, userData);

      console.log('[Hotmart Webhook] Dados do usuário armazenados:', {
        email,
        userData,
      });
    } catch (error) {
      console.error('[Hotmart Webhook] Erro ao armazenar dados do usuário:', error);
    }
  }

  // Processar webhook recebido da Hotmart
  public async processWebhook(webhookData: HotmartWebhookData): Promise<void> {
    try {
      console.log('[Hotmart Webhook] Processando webhook:', webhookData);

      // Validar webhook ID
      if (!this.validateWebhookId(webhookData.webhook_id)) {
        console.warn('[Hotmart Webhook] ID do webhook inválido:', webhookData.webhook_id);
        return;
      }

      // Processar diferentes tipos de eventos
      switch (webhookData.event) {
        case 'PURCHASE_COMPLETE':
        case 'PURCHASE_APPROVED':
          await this.handlePurchaseApproved(webhookData);
          break;

        case 'PURCHASE_CANCELED':
          await this.handlePurchaseCanceled(webhookData);
          break;

        case 'PURCHASE_REFUNDED':
          await this.handlePurchaseRefunded(webhookData);
          break;

        default:
          console.log('[Hotmart Webhook] Evento não tratado:', webhookData.event);
      }
    } catch (error) {
      console.error('[Hotmart Webhook] Erro ao processar webhook:', error);
    }
  }

  // Tratar compra aprovada
  private async handlePurchaseApproved(data: HotmartWebhookData): Promise<void> {
    console.log('[Hotmart Webhook] Compra aprovada:', data.data.transaction.id);

    try {
      // Buscar dados do usuário armazenados
      const userEmail = data.data.buyer.email;
      const userData = this.getUserData(userEmail);

      if (!userData) {
        console.warn('[Hotmart Webhook] Dados do usuário não encontrados para:', userEmail);
        // Mesmo assim, processar a venda sem UTMs
      }

      // Preparar dados do evento Purchase para Facebook Pixel
      const purchaseEventData = {
        value: data.data.purchase.price.value,
        currency: data.data.purchase.price.currency_value,
        transaction_id: data.data.transaction.id,
        content_name: data.data.purchase.product.name,
        content_type: 'product',
        event_id: `purchase_${data.data.transaction.id}`,
        ...userData?.utm_parameters, // Adicionar UTMs se disponíveis
      };

      // Enviar evento Purchase para Facebook Pixel
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', purchaseEventData);
        console.log(
          '[Hotmart Webhook] Evento Purchase enviado ao Facebook Pixel:',
          purchaseEventData
        );
      }

      // Enviar para Google Analytics se disponível
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: data.data.transaction.id,
          value: data.data.purchase.price.value,
          currency: data.data.purchase.price.currency_value,
          items: [
            {
              item_id: data.data.purchase.product.id.toString(),
              item_name: data.data.purchase.product.name,
              price: data.data.purchase.price.value,
              quantity: 1,
            },
          ],
          ...userData?.utm_parameters,
        });
        console.log('[Hotmart Webhook] Evento purchase enviado ao Google Analytics');
      }

      // Usar o sistema de analytics interno
      trackSaleConversion(
        data.data.purchase.price.value,
        data.data.purchase.price.currency_value,
        data.data.purchase.product.name
      );

      // Notificar outros sistemas se necessário
      await this.notifyExternalSystems(data, userData);
    } catch (error) {
      console.error('[Hotmart Webhook] Erro ao processar compra aprovada:', error);
    }
  }

  // Tratar cancelamento de compra
  private async handlePurchaseCanceled(data: HotmartWebhookData): Promise<void> {
    console.log('[Hotmart Webhook] Compra cancelada:', data.data.transaction.id);

    // Enviar evento de cancelamento se necessário
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PurchaseCanceled', {
        transaction_id: data.data.transaction.id,
        value: data.data.purchase.price.value,
        currency: data.data.purchase.price.currency_value,
        event_id: `cancel_${data.data.transaction.id}`,
      });
    }
  }

  // Tratar reembolso de compra
  private async handlePurchaseRefunded(data: HotmartWebhookData): Promise<void> {
    console.log('[Hotmart Webhook] Compra reembolsada:', data.data.transaction.id);

    // Enviar evento de reembolso se necessário
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PurchaseRefunded', {
        transaction_id: data.data.transaction.id,
        value: data.data.purchase.price.value,
        currency: data.data.purchase.price.currency_value,
        event_id: `refund_${data.data.transaction.id}`,
      });
    }
  }

  // Validar ID do webhook
  private validateWebhookId(webhookId: string): boolean {
    return webhookId === this.WEBHOOK_ID;
  }

  // Recuperar dados do usuário
  private getUserData(email: string): UserAnalyticsData | undefined {
    // Primeiro, tentar do cache em memória
    let userData = this.userDataStore.get(email);

    // Se não encontrar, tentar do localStorage
    if (!userData) {
      userData = this.retrieveUserDataFromStorage(email);
      if (userData) {
        this.userDataStore.set(email, userData);
      }
    }

    return userData ?? undefined;
  }

  // Recuperar dados do localStorage
  private retrieveUserDataFromStorage(email: string): UserAnalyticsData | undefined {
    try {
      const key = `user_data_${email}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : undefined;
    } catch (error) {
      console.error('[Hotmart Webhook] Erro ao recuperar dados do storage:', error);
      return undefined;
    }
  }

  // Persistir dados no localStorage
  private persistUserData(email: string, userData: UserAnalyticsData): void {
    try {
      const key = `user_data_${email}`;
      localStorage.setItem(key, JSON.stringify(userData));
    } catch (error) {
      console.error('[Hotmart Webhook] Erro ao persistir dados:', error);
    }
  }

  // Recuperar parâmetros UTM armazenados
  private getStoredUTMParameters(): Record<string, string> {
    try {
      return JSON.parse(localStorage.getItem('utm_parameters') || '{}');
    } catch {
      return {};
    }
  }

  // Recuperar valor específico do localStorage
  private getStoredValue(key: string): string | undefined {
    try {
      return localStorage.getItem(key) || undefined;
    } catch {
      return undefined;
    }
  }

  // Gerar ID de sessão único
  private generateSessionId(): string {
    return generateSemanticId({
      context: 'hotmart',
      type: 'session',
      identifier: 'user',
      index: Math.floor(Math.random() * 10000),
    });
  }

  // Inicializar recuperação de dados do usuário
  private initializeUserDataRetrieval(): void {
    // Carregar dados existentes do localStorage na inicialização
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('user_data_')) {
          const email = key.replace('user_data_', '');
          const userData = this.retrieveUserDataFromStorage(email);
          if (userData) {
            this.userDataStore.set(email, userData);
          }
        }
      }
      console.log('[Hotmart Webhook] Dados de usuário carregados:', this.userDataStore.size);
    } catch (error) {
      console.error('[Hotmart Webhook] Erro ao carregar dados iniciais:', error);
    }
  }

  // Notificar sistemas externos (CRM, etc.)
  private async notifyExternalSystems(
    data: HotmartWebhookData,
    userData?: UserAnalyticsData | undefined
  ): Promise<void> {
    try {
      // Aqui você pode adicionar integrações com CRM, Email Marketing, etc.
      console.log('[Hotmart Webhook] Notificando sistemas externos...');

      // Exemplo: Enviar para API de CRM
      // await this.sendToCRM(data, userData);

      // Exemplo: Enviar para Email Marketing
      // await this.sendToEmailMarketing(data, userData);
    } catch (error) {
      console.error('[Hotmart Webhook] Erro ao notificar sistemas externos:', error);
    }
  }

  // Método público para armazenar dados quando o usuário completa o quiz
  public storeQuizCompletionData(email: string, quizResults: Record<string, unknown>): void {
    this.storeUserData(email, {
      quiz_results: quizResults,
      funnel_step: 'quiz_completion',
      timestamp: new Date().toISOString(),
    });
  }

  // Método público para armazenar dados quando o usuário inicia o checkout
  public storeCheckoutInitiationData(email: string): void {
    this.storeUserData(email, {
      funnel_step: 'checkout_initiation',
      timestamp: new Date().toISOString(),
    });
  }

  // Método para limpar dados antigos (executar periodicamente)
  public cleanupOldData(daysToKeep: number = 30): void {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      for (const [email, userData] of Array.from(this.userDataStore.entries())) {
        const dataDate = new Date(userData.timestamp);
        if (dataDate < cutoffDate) {
          this.userDataStore.delete(email);
          localStorage.removeItem(`user_data_${email}`);
        }
      }

      console.log('[Hotmart Webhook] Limpeza de dados antigos concluída');
    } catch (error) {
      console.error('[Hotmart Webhook] Erro na limpeza de dados:', error);
    }
  }
}

// Instância global do gerenciador de webhook
export const hotmartWebhookManager = new HotmartWebhookManager();

// Função utilitária para fácil uso nos componentes
export const storeUserForHotmart = (email: string, additionalData?: Partial<UserAnalyticsData>) => {
  hotmartWebhookManager.storeUserData(email, additionalData || {});
};

// Função para simular webhook em desenvolvimento (apenas para testes)
export const simulateHotmartWebhook = (email: string, transactionId?: string) => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('[Hotmart Webhook] Simulação disponível apenas em desenvolvimento');
    return;
  }

  const mockWebhookData: HotmartWebhookData = {
    event: 'PURCHASE_COMPLETE',
    data: {
      buyer: {
        email: email,
        name: 'Cliente Teste',
        document: '12345678900',
      },
      purchase: {
        price: {
          value: 297,
          currency_value: 'BRL',
        },
        transaction:
          transactionId ||
          generateSemanticId({
            context: 'hotmart',
            type: 'transaction',
            identifier: 'test',
            index: Math.floor(Math.random() * 10000),
          }),
        product: {
          id: 123456,
          name: 'Transformação de Imagem - Gisele Galvão',
        },
        approved_date: new Date().toISOString(),
      },
      transaction: {
        id:
          transactionId ||
          generateSemanticId({
            context: 'hotmart',
            type: 'transaction',
            identifier: 'mock',
            index: Math.floor(Math.random() * 10000),
          }),
        timestamp: new Date().toISOString(),
      },
    },
    webhook_id: 'agQzTLUehWUfhPzjhdwntVQz0JNT5E0216ae0d-00a9-48ae-85d1-f0d14bd8e0df',
    timestamp: new Date().toISOString(),
  };

  console.log('[Hotmart Webhook] Simulando webhook:', mockWebhookData);
  hotmartWebhookManager.processWebhook(mockWebhookData);
};
