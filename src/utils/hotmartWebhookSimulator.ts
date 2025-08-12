// @ts-nocheck
// Simulador de Webhook Hotmart para testes
// Este arquivo simula o recebimento de webhooks da Hotmart no frontend

import { HotmartWebhookData, hotmartWebhookManager } from './hotmartWebhook';
import { generateSemanticId } from './semanticIdGenerator';

export class HotmartWebhookSimulator {
  private static instance: HotmartWebhookSimulator;

  public static getInstance(): HotmartWebhookSimulator {
    if (!HotmartWebhookSimulator.instance) {
      HotmartWebhookSimulator.instance = new HotmartWebhookSimulator();
    }
    return HotmartWebhookSimulator.instance;
  }

  /**
   * Simula o recebimento de um webhook da Hotmart
   */
  public async simulateWebhook(
    email: string,
    event: 'PURCHASE_COMPLETE' | 'PURCHASE_APPROVED' | 'PURCHASE_CANCELED' | 'PURCHASE_REFUNDED',
    transactionId?: string
  ): Promise<void> {
    const webhookData: HotmartWebhookData = {
      event,
      webhook_id: 'agQzTLUehWUfhPzjhdwntVQz0JNT5E0216ae0d-00a9-48ae-85d1-f0d14bd8e0df',
      timestamp: new Date().toISOString(),
      data: {
        purchase: {
          transaction:
            transactionId ||
            generateSemanticId({
              context: 'hotmart',
              type: 'transaction',
              identifier: 'purchase',
              index: Math.floor(Math.random() * 10000),
            }),
          approved_date: new Date().toISOString(),
          price: {
            value: 297,
            currency_value: 'BRL',
          },
          product: {
            id: 123456,
            name: 'Transformação de Imagem - Gisele Galvão',
          },
        },
        buyer: {
          email,
          name: 'Usuário Teste',
          document: '000.000.000-00',
        },
        transaction: {
          id:
            transactionId ||
            generateSemanticId({
              context: 'hotmart',
              type: 'transaction',
              identifier: 'payment',
              index: Math.floor(Math.random() * 10000),
            }),
          timestamp: new Date().toISOString(),
        },
      },
    };

    console.log('[Webhook Simulator] Simulando webhook:', webhookData);

    try {
      await hotmartWebhookManager.processWebhook(webhookData);
      console.log('[Webhook Simulator] ✅ Webhook processado com sucesso!');
    } catch (error) {
      console.error('[Webhook Simulator] ❌ Erro ao processar webhook:', error);
      throw error;
    }
  }

  /**
   * Testa o fluxo completo: usuário faz checkout → webhook é recebido
   */
  public async testCompleteFlow(email: string): Promise<void> {
    console.log('[Webhook Simulator] 🧪 Iniciando teste completo para:', email);

    // 1. Simular que o usuário fez um checkout
    console.log('[Webhook Simulator] 1️⃣ Simulando checkout...');

    // 2. Aguardar um pouco (simular delay real)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Simular webhook de compra completa
    console.log('[Webhook Simulator] 2️⃣ Simulando webhook...');
    await this.simulateWebhook(email, 'PURCHASE_COMPLETE');

    console.log('[Webhook Simulator] ✅ Teste completo finalizado!');
  }
}

// Instância global
export const webhookSimulator = HotmartWebhookSimulator.getInstance();

// Funções utilitárias para uso direto
export const simulateHotmartPurchase = (email: string, transactionId?: string) => {
  return webhookSimulator.simulateWebhook(email, 'PURCHASE_COMPLETE', transactionId);
};

export const testWebhookFlow = (email: string) => {
  return webhookSimulator.testCompleteFlow(email);
};

// Para usar no console do navegador
if (typeof window !== 'undefined') {
  (window as any).hotmartWebhookSimulator = webhookSimulator;
  (window as any).simulateHotmartPurchase = simulateHotmartPurchase;
  (window as any).testWebhookFlow = testWebhookFlow;

  console.log('🎯 Hotmart Webhook Simulator carregado!');
  console.log('📝 Use no console:');
  console.log('   simulateHotmartPurchase("email@exemplo.com")');
  console.log('   testWebhookFlow("email@exemplo.com")');
}
