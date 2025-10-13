// @ts-nocheck
/**
 * 🛒 DETECTOR DE CARRINHO ABANDONADO HOTMART
 *
 * Serviço que monitora eventos da Hotmart e detecta
 * carrinhos abandonados para acionar recuperação via WhatsApp
 */

import { hotmartWebhookManager, HotmartWebhookData } from '../utils/hotmartWebhook';
import { getWhatsAppAgent } from './WhatsAppCartRecoveryAgent';
import { StorageService } from '@/services/core/StorageService';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface CartAbandonmentEvent {
  transactionId: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
  productId: string;
  productName: string;
  productPrice: number;
  currency: string;
  abandonedAt: Date;
  checkoutUrl: string;
  affiliateCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface CartDetectionConfig {
  enabled: boolean;
  timeoutMinutes: number; // Tempo para considerar abandono
  minimumValue: number; // Valor mínimo para acionar recuperação
  excludedProducts: string[]; // Produtos excluídos da recuperação
  requiredFields: string[]; // Campos obrigatórios para recuperação
}

// ============================================================================
// DETECTOR PRINCIPAL
// ============================================================================

export class HotmartCartAbandonmentDetector {
  private config: CartDetectionConfig;
  private pendingTransactions = new Map<string, NodeJS.Timeout>();
  private abandonmentCallbacks: Array<(event: CartAbandonmentEvent) => void> = [];

  constructor(config: CartDetectionConfig) {
    this.config = config;
    this.setupHotmartIntegration();
  }

  /**
   * 🔗 CONFIGURAR INTEGRAÇÃO COM HOTMART
   */
  private setupHotmartIntegration(): void {
    // Interceptar eventos de início de checkout
    hotmartWebhookManager.onCheckoutStarted = (data: HotmartWebhookData) => {
      this.handleCheckoutStarted(data);
    };

    // Interceptar eventos de compra completa
    hotmartWebhookManager.onPurchaseComplete = (data: HotmartWebhookData) => {
      this.handlePurchaseComplete(data);
    };

    // Interceptar eventos de checkout cancelado
    hotmartWebhookManager.onCheckoutCanceled = (data: HotmartWebhookData) => {
      this.handleCheckoutCanceled(data);
    };
  }

  /**
   * 🚀 PROCESSAR INÍCIO DE CHECKOUT
   */
  private handleCheckoutStarted(data: HotmartWebhookData): void {
    if (!this.config.enabled) return;

    const transactionId = data.data.transaction?.id;
    const productPrice = data.data.product?.price?.value || 0;

    // Verificar valor mínimo
    if (productPrice < this.config.minimumValue) {
      console.log(`💰 Valor muito baixo para recuperação: R$ ${productPrice}`);
      return;
    }

    // Verificar produto excluído
    const productId = data.data.product?.id;
    if (productId && this.config.excludedProducts.includes(productId)) {
      console.log(`🚫 Produto excluído da recuperação: ${productId}`);
      return;
    }

    // Verificar campos obrigatórios
    if (!this.hasRequiredFields(data)) {
      console.log(`❌ Campos obrigatórios ausentes para: ${transactionId}`);
      return;
    }

    console.log(`🛒 Checkout iniciado - monitorando abandono: ${transactionId}`);

    // Agendar detecção de abandono
    const timeout = setTimeout(() => {
      this.detectAbandonment(data);
    }, this.config.timeoutMinutes * 60 * 1000);

    // Armazenar timeout para cancelar se compra for concluída
    if (transactionId) {
      this.pendingTransactions.set(transactionId, timeout);
    }
  }

  /**
   * ✅ PROCESSAR COMPRA COMPLETA
   */
  private handlePurchaseComplete(data: HotmartWebhookData): void {
    const transactionId = data.data.transaction?.id;
    
    if (transactionId && this.pendingTransactions.has(transactionId)) {
      // Cancelar detecção de abandono
      const timeout = this.pendingTransactions.get(transactionId)!;
      clearTimeout(timeout);
      this.pendingTransactions.delete(transactionId);

      console.log(`✅ Compra concluída - cancelando monitoramento: ${transactionId}`);
    }
  }

  /**
   * ❌ PROCESSAR CHECKOUT CANCELADO
   */
  private handleCheckoutCanceled(data: HotmartWebhookData): void {
    const transactionId = data.data.transaction?.id;
    
    if (transactionId && this.pendingTransactions.has(transactionId)) {
      // Cancelar timeout e processar abandono imediatamente
      const timeout = this.pendingTransactions.get(transactionId)!;
      clearTimeout(timeout);
      this.pendingTransactions.delete(transactionId);

      console.log(`❌ Checkout cancelado - processando abandono: ${transactionId}`);
      this.detectAbandonment(data);
    }
  }

  /**
   * 🛒 DETECTAR ABANDONO DE CARRINHO
   */
  private detectAbandonment(data: HotmartWebhookData): void {
    try {
      const buyer = data.data.buyer;
      const product = data.data.product;
      const transaction = data.data.transaction;

      // Criar evento de abandono
      const abandonmentEvent: CartAbandonmentEvent = {
        transactionId: transaction?.id || crypto.randomUUID(),
        buyerEmail: buyer?.email || '',
        buyerName: buyer?.name || '',
        buyerPhone: buyer?.phone || '',
        productId: product?.id || '',
        productName: product?.name || '',
        productPrice: product?.price?.value || 0,
        currency: product?.price?.currency_value || 'BRL',
        abandonedAt: new Date(),
        checkoutUrl: this.generateCheckoutUrl(data),
        affiliateCode: data.data.affiliations?.[0]?.affiliate_code,
        utmSource: data.data.utm_source,
        utmMedium: data.data.utm_medium,
        utmCampaign: data.data.utm_campaign
      };

      // Salvar evento
      this.saveAbandonmentEvent(abandonmentEvent);

      // Notificar callbacks
      this.abandonmentCallbacks.forEach(callback => {
        try {
          callback(abandonmentEvent);
        } catch (error) {
          console.error('❌ Erro no callback de abandono:', error);
        }
      });

      console.log('🛒 Carrinho abandonado detectado:', {
        transactionId: abandonmentEvent.transactionId,
        buyerName: abandonmentEvent.buyerName,
        productName: abandonmentEvent.productName,
        value: abandonmentEvent.productPrice
      });

    } catch (error) {
      console.error('❌ Erro ao detectar abandono:', error);
    }
  }

  /**
   * 🔍 VERIFICAR CAMPOS OBRIGATÓRIOS
   */
  private hasRequiredFields(data: HotmartWebhookData): boolean {
    const buyer = data.data.buyer;
    const product = data.data.product;

    for (const field of this.config.requiredFields) {
      switch (field) {
        case 'email':
          if (!buyer?.email) return false;
          break;
        case 'name':
          if (!buyer?.name) return false;
          break;
        case 'phone':
          if (!buyer?.phone) return false;
          break;
        case 'product_name':
          if (!product?.name) return false;
          break;
        case 'product_price':
          if (!product?.price?.value) return false;
          break;
        default:
          console.warn(`⚠️ Campo obrigatório desconhecido: ${field}`);
      }
    }

    return true;
  }

  /**
   * 🔗 GERAR URL DE CHECKOUT
   */
  private generateCheckoutUrl(data: HotmartWebhookData): string {
    const productId = data.data.product?.id;
    const affiliateCode = data.data.affiliations?.[0]?.affiliate_code;
    
    let url = `https://pay.hotmart.com/checkout/${productId}`;
    
    const params = new URLSearchParams();
    if (affiliateCode) params.append('aff', affiliateCode);
    if (data.data.utm_source) params.append('utm_source', data.data.utm_source);
    if (data.data.utm_medium) params.append('utm_medium', data.data.utm_medium);
    if (data.data.utm_campaign) params.append('utm_campaign', data.data.utm_campaign);
    
    // Adicionar cupom de desconto automático
    params.append('discount', 'VOLTA15');
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return url;
  }

  /**
   * 💾 SALVAR EVENTO DE ABANDONO
   */
  private async saveAbandonmentEvent(event: CartAbandonmentEvent): Promise<void> {
    try {
      // Salvar no localStorage
      const events = StorageService.safeGetJSON('cart_abandonment_events');
      events.push({
        ...event,
        abandonedAt: event.abandonedAt.toISOString()
      });
      StorageService.safeSetJSON('cart_abandonment_events', events);

      // TODO: Salvar no Supabase
      // await supabase.from('cart_abandonment_events').insert(event);

    } catch (error) {
      console.error('❌ Erro ao salvar evento de abandono:', error);
    }
  }

  /**
   * 📊 OBTER ESTATÍSTICAS
   */
  public getStats(): {
    totalDetected: number;
    totalRecovered: number;
    avgTimeToAbandon: number;
    topAbandonedProducts: Array<{ productName: string; count: number }>;
  } {
    try {
      const events = StorageService.safeGetJSON('cart_abandonment_events');
      
      const totalDetected = events.length;
      const totalRecovered = events.filter((e: any) => e.status === 'recovered').length;
      
      // Calcular tempo médio até abandono (mock)
      const avgTimeToAbandon = 25; // minutos
      
      // Top produtos abandonados
      const productCounts = events.reduce((acc: any, event: any) => {
        acc[event.productName] = (acc[event.productName] || 0) + 1;
        return acc;
      }, {});
      
      const topAbandonedProducts = Object.entries(productCounts)
        .map(([productName, count]) => ({ productName, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalDetected,
        totalRecovered,
        avgTimeToAbandon,
        topAbandonedProducts
      };

    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      return {
        totalDetected: 0,
        totalRecovered: 0,
        avgTimeToAbandon: 0,
        topAbandonedProducts: []
      };
    }
  }

  /**
   * 📝 REGISTRAR CALLBACK DE ABANDONO
   */
  public onCartAbandonment(callback: (event: CartAbandonmentEvent) => void): void {
    this.abandonmentCallbacks.push(callback);
  }

  /**
   * ⚙️ ATUALIZAR CONFIGURAÇÃO
   */
  public updateConfig(newConfig: Partial<CartDetectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Configuração do detector atualizada:', this.config);
  }

  /**
   * 🧹 LIMPEZA DE RECURSOS
   */
  public cleanup(): void {
    // Cancelar todos os timeouts pendentes
    for (const timeout of this.pendingTransactions.values()) {
      clearTimeout(timeout);
    }
    this.pendingTransactions.clear();
    this.abandonmentCallbacks = [];
  }
}

// ============================================================================
// CONFIGURAÇÃO PADRÃO
// ============================================================================

export const DEFAULT_DETECTION_CONFIG: CartDetectionConfig = {
  enabled: true,
  timeoutMinutes: 30, // 30 minutos para considerar abandono
  minimumValue: 50, // R$ 50 mínimo
  excludedProducts: [], // Nenhum produto excluído por padrão
  requiredFields: ['email', 'name', 'phone', 'product_name'] // Campos obrigatórios
};

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

let cartDetector: HotmartCartAbandonmentDetector | null = null;

export function initializeCartDetector(config?: Partial<CartDetectionConfig>): HotmartCartAbandonmentDetector {
  const finalConfig = { ...DEFAULT_DETECTION_CONFIG, ...config };
  cartDetector = new HotmartCartAbandonmentDetector(finalConfig);
  
  // Integrar com agente WhatsApp
  const whatsappAgent = getWhatsAppAgent();
  if (whatsappAgent) {
    cartDetector.onCartAbandonment((event) => {
      // Converter evento para formato do agente
      const webhookData: HotmartWebhookData = {
        event: 'CART_ABANDONED',
        data: {
          buyer: {
            email: event.buyerEmail,
            name: event.buyerName,
            phone: event.buyerPhone,
            document: ''
          },
          product: {
            id: event.productId,
            name: event.productName,
            price: {
              value: event.productPrice,
              currency_value: event.currency
            }
          },
          transaction: {
            id: event.transactionId,
            status: 'ABANDONED'
          },
          affiliations: event.affiliateCode ? [{ affiliate_code: event.affiliateCode }] : [],
          utm_source: event.utmSource,
          utm_medium: event.utmMedium,
          utm_campaign: event.utmCampaign
        },
        webhook_id: crypto.randomUUID(),
        timestamp: event.abandonedAt.toISOString()
      };

      // Processar via agente WhatsApp
      (whatsappAgent as any).handleCartAbandonment(webhookData);
    });
  }

  return cartDetector;
}

export function getCartDetector(): HotmartCartAbandonmentDetector | null {
  return cartDetector;
}

// ============================================================================
// UTILITÁRIOS DE INTEGRAÇÃO
// ============================================================================

/**
 * 🎯 CONFIGURAR EVENTOS PERSONALIZADOS HOTMART
 * 
 * JavaScript para adicionar no checkout da Hotmart
 */
export function generateHotmartTrackingScript(webhookUrl: string): string {
  return `
<script>
(function() {
  // Detectar abandono de carrinho
  let checkoutStartTime = Date.now();
  let isCheckoutCompleted = false;
  
  // Marcar início do checkout
  if (typeof hotmart !== 'undefined') {
    hotmart.onCheckoutStart = function(data) {
      checkoutStartTime = Date.now();
      
      // Enviar evento de início
      fetch('${webhookUrl}/cart-started', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'CHECKOUT_STARTED',
          data: data,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    };
    
    // Marcar conclusão do checkout
    hotmart.onCheckoutComplete = function(data) {
      isCheckoutCompleted = true;
      
      // Enviar evento de conclusão
      fetch('${webhookUrl}/cart-completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'CHECKOUT_COMPLETED',
          data: data,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    };
  }
  
  // Detectar abandono na saída da página
  window.addEventListener('beforeunload', function() {
    if (!isCheckoutCompleted && (Date.now() - checkoutStartTime) > 30000) { // 30 segundos
      // Enviar evento de abandono
      navigator.sendBeacon('${webhookUrl}/cart-abandoned', JSON.stringify({
        event: 'CART_ABANDONED',
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - checkoutStartTime
      }));
    }
  });
  
  // Detectar abandono por inatividade
  let lastActivity = Date.now();
  let inactivityTimer;
  
  function resetInactivityTimer() {
    lastActivity = Date.now();
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(function() {
      if (!isCheckoutCompleted) {
        // Carrinho abandonado por inatividade
        fetch('${webhookUrl}/cart-abandoned', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'CART_ABANDONED',
            reason: 'inactivity',
            timestamp: new Date().toISOString(),
            sessionDuration: Date.now() - checkoutStartTime
          })
        }).catch(console.error);
      }
    }, 300000); // 5 minutos de inatividade
  }
  
  // Monitorar atividade do usuário
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(function(event) {
    document.addEventListener(event, resetInactivityTimer, true);
  });
  
  resetInactivityTimer();
})();
</script>
  `.trim();
}

/**
 * 📊 ANALISAR PADRÕES DE ABANDONO
 */
export class AbandonmentAnalyzer {
  static analyzePatterns(events: CartAbandonmentEvent[]): {
    peakAbandonmentHours: number[];
    commonAbandonmentReasons: string[];
    avgTimeToAbandon: number;
    recoveryOpportunities: number;
  } {
    // Analisar horários de pico
    const hourCounts = new Array(24).fill(0);
    events.forEach(event => {
      const hour = event.abandonedAt.getHours();
      hourCounts[hour]++;
    });
    
    const peakAbandonmentHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);

    // Calcular tempo médio até abandono (mock)
    const avgTimeToAbandon = 25; // minutos

    // Oportunidades de recuperação
    const recoveryOpportunities = events.filter(e => 
      e.productPrice >= 100 && 
      e.buyerPhone && 
      e.buyerEmail
    ).length;

    return {
      peakAbandonmentHours,
      commonAbandonmentReasons: ['Preço alto', 'Dúvidas sobre produto', 'Problemas técnicos'],
      avgTimeToAbandon,
      recoveryOpportunities
    };
  }
}

// ============================================================================
// MOCK DATA PARA DESENVOLVIMENTO
// ============================================================================

export const MOCK_ABANDONMENT_EVENTS: CartAbandonmentEvent[] = [
  {
    transactionId: 'txn_001',
    buyerEmail: 'maria@email.com',
    buyerName: 'Maria Silva',
    buyerPhone: '5511999999999',
    productId: 'prod_style_course',
    productName: 'Curso de Estilo Pessoal',
    productPrice: 497,
    currency: 'BRL',
    abandonedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    checkoutUrl: 'https://pay.hotmart.com/checkout/prod_style_course?aff=123&discount=VOLTA15'
  },
  {
    transactionId: 'txn_002',
    buyerEmail: 'joao@email.com',
    buyerName: 'João Santos',
    buyerPhone: '5511888888888',
    productId: 'prod_consultation',
    productName: 'Consultoria Personal Stylist',
    productPrice: 997,
    currency: 'BRL',
    abandonedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    checkoutUrl: 'https://pay.hotmart.com/checkout/prod_consultation?aff=123&discount=VOLTA20'
  }
];

// Inicializar detector automaticamente em desenvolvimento
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.log('🤖 Inicializando detector de carrinho em modo desenvolvimento');
  initializeCartDetector();
}
