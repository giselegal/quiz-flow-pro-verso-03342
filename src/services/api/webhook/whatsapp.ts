/**
 * 🔗 WEBHOOK ENDPOINT PARA WHATSAPP BUSINESS API
 * 
 * Endpoint para receber webhooks do WhatsApp e processar
 * respostas dos usuários para recuperação de carrinho
 */

import { getWhatsAppAgent } from '../../services/WhatsAppCartRecoveryAgent';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TIPOS
// ============================================================================

interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: 'whatsapp';
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: {
          name: string;
        };
        wa_id: string;
      }>;
      messages?: Array<{
        from: string;
        id: string;
        timestamp: string;
        type: 'text' | 'button' | 'interactive';
        text?: {
          body: string;
        };
        button?: {
          payload: string;
          text: string;
        };
        interactive?: {
          type: 'button_reply' | 'list_reply';
          button_reply?: {
            id: string;
            title: string;
          };
          list_reply?: {
            id: string;
            title: string;
            description?: string;
          };
        };
      }>;
      statuses?: Array<{
        id: string;
        status: 'sent' | 'delivered' | 'read' | 'failed';
        timestamp: string;
        recipient_id: string;
      }>;
    };
    field: 'messages';
  }>;
}

interface WhatsAppWebhookPayload {
  object: 'whatsapp_business_account';
  entry: WhatsAppWebhookEntry[];
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

/**
 * 🎯 PROCESSAR WEBHOOK DO WHATSAPP
 */
export async function handleWhatsAppWebhook(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    
    // Verificação do webhook (GET request)
    if (request.method === 'GET') {
      return handleWebhookVerification(url.searchParams);
    }

    // Processamento de mensagens (POST request)
    if (request.method === 'POST') {
      return await handleIncomingMessage(request);
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error) {
    appLogger.error('❌ Erro no webhook WhatsApp:', { data: [error] });
    return new Response('Internal server error', { status: 500 });
  }
}

/**
 * ✅ VERIFICAÇÃO DO WEBHOOK
 */
function handleWebhookVerification(searchParams: URLSearchParams): Response {
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verificar token
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'your_verify_token';

  if (mode === 'subscribe' && token === expectedToken) {
    appLogger.info('✅ Webhook WhatsApp verificado com sucesso');
    return new Response(challenge, { status: 200 });
  } else {
    appLogger.warn('❌ Falha na verificação do webhook WhatsApp');
    return new Response('Forbidden', { status: 403 });
  }
}

/**
 * 📨 PROCESSAR MENSAGEM RECEBIDA
 */
async function handleIncomingMessage(request: Request): Promise<Response> {
  try {
    const payload: WhatsAppWebhookPayload = await request.json();

    // Log do webhook recebido
    appLogger.info('📱 Webhook WhatsApp recebido:', { data: [{
            object: payload.object,
            entries: payload.entry.length,
          }] });

    // Processar cada entrada
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          await processMessageChange(change.value);
        }
      }
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    appLogger.error('❌ Erro ao processar mensagem WhatsApp:', { data: [error] });
    return new Response('Error processing message', { status: 500 });
  }
}

/**
 * 💬 PROCESSAR MUDANÇA DE MENSAGEM
 */
async function processMessageChange(value: WhatsAppWebhookEntry['changes'][0]['value']): Promise<void> {
  // Processar mensagens recebidas
  if (value.messages) {
    for (const message of value.messages) {
      await handleUserMessage(message, value.contacts?.[0]);
    }
  }

  // Processar status de mensagens enviadas
  if (value.statuses) {
    for (const status of value.statuses) {
      await handleMessageStatus(status);
    }
  }
}

/**
 * 👤 PROCESSAR MENSAGEM DO USUÁRIO
 */
type WhatsAppMessage = NonNullable<WhatsAppWebhookEntry['changes'][0]['value']['messages']>[0];
type WhatsAppContact = NonNullable<WhatsAppWebhookEntry['changes'][0]['value']['contacts']>[0];

async function handleUserMessage(
  message: WhatsAppMessage,
  contact?: WhatsAppContact,
): Promise<void> {
  const userPhone = message.from;
  const userName = contact?.profile?.name || 'Usuário';

  appLogger.info('👤 Mensagem recebida:', { data: [{
        from: userPhone,
        name: userName,
        type: message.type,
        timestamp: message.timestamp,
      }] });

  // Processar diferentes tipos de mensagem
  switch (message.type) {
    case 'text':
      await handleTextMessage(userPhone, userName, message.text?.body || '');
      break;

    case 'button':
      await handleButtonResponse(userPhone, userName, message.button?.payload || '');
      break;

    case 'interactive':
      if (message.interactive?.button_reply) {
        await handleInteractiveResponse(
          userPhone, 
          userName, 
          message.interactive.button_reply.id,
          message.interactive.button_reply.title,
        );
      }
      break;

    default:
      appLogger.info('📱 Tipo de mensagem não suportado:', { data: [message.type] });
  }
}

/**
 * 💬 PROCESSAR MENSAGEM DE TEXTO
 */
async function handleTextMessage(userPhone: string, userName: string, messageText: string): Promise<void> {
  const agent = getWhatsAppAgent();
  if (!agent) return;

  // Palavras-chave para diferentes ações
  const lowerText = messageText.toLowerCase();

  if (lowerText.includes('comprar') || lowerText.includes('finalizar') || lowerText.includes('quero')) {
    // Usuário quer finalizar compra
    await sendPurchaseLink(userPhone, userName);
  } else if (lowerText.includes('desconto') || lowerText.includes('promoção') || lowerText.includes('oferta')) {
    // Usuário quer desconto
    await sendDiscountOffer(userPhone, userName);
  } else if (lowerText.includes('dúvida') || lowerText.includes('ajuda') || lowerText.includes('suporte')) {
    // Usuário precisa de ajuda
    await sendSupportMessage(userPhone, userName);
  } else if (lowerText.includes('parar') || lowerText.includes('sair') || lowerText.includes('não')) {
    // Usuário não quer mais receber mensagens
    await handleUnsubscribe(userPhone, userName);
  } else {
    // Resposta genérica
    await sendGenericResponse(userPhone, userName);
  }
}

/**
 * 🔘 PROCESSAR RESPOSTA DE BOTÃO
 */
async function handleButtonResponse(userPhone: string, userName: string, payload: string): Promise<void> {
  appLogger.info('🔘 Botão clicado:', { data: [{ userPhone, userName, payload }] });

  switch (payload) {
    case 'complete_purchase':
      await sendPurchaseLink(userPhone, userName);
      break;
    case 'get_discount':
      await sendDiscountOffer(userPhone, userName);
      break;
    case 'not_interested':
      await handleUnsubscribe(userPhone, userName);
      break;
    default:
      await sendGenericResponse(userPhone, userName);
  }
}

/**
 * 🎯 PROCESSAR RESPOSTA INTERATIVA
 */
async function handleInteractiveResponse(
  userPhone: string, 
  userName: string, 
  buttonId: string, 
  buttonTitle: string,
): Promise<void> {
  appLogger.info('🎯 Resposta interativa:', { data: [{ userPhone, userName, buttonId, buttonTitle }] });

  await handleButtonResponse(userPhone, userName, buttonId);
}

/**
 * 📈 PROCESSAR STATUS DE MENSAGEM
 */
type WhatsAppStatus = NonNullable<WhatsAppWebhookEntry['changes'][0]['value']['statuses']>[0];

async function handleMessageStatus(status: WhatsAppStatus): Promise<void> {
  appLogger.info('📈 Status da mensagem:', { data: [{
        messageId: status.id,
        status: status.status,
        recipientId: status.recipient_id,
        timestamp: status.timestamp,
      }] });

  // Salvar métricas de entrega
  const metrics = {
    messageId: status.id,
    status: status.status,
    recipientId: status.recipient_id,
    timestamp: new Date(parseInt(status.timestamp) * 1000),
  };

  // Salvar no localStorage ou banco
  try {
    const savedMetrics = JSON.parse(localStorage.getItem('whatsapp_message_metrics') || '[]');
    savedMetrics.push(metrics);
    localStorage.setItem('whatsapp_message_metrics', JSON.stringify(savedMetrics));
  } catch (error) {
    appLogger.error('❌ Erro ao salvar métricas:', { data: [error] });
  }
}

// ============================================================================
// FUNÇÕES DE RESPOSTA
// ============================================================================

/**
 * 🛒 ENVIAR LINK DE COMPRA
 */
async function sendPurchaseLink(userPhone: string, userName: string): Promise<void> {
  // Implementar envio de link personalizado
  appLogger.info(`🛒 Enviando link de compra para ${userName} (${userPhone})`);
}

/**
 * 🎁 ENVIAR OFERTA DE DESCONTO
 */
async function sendDiscountOffer(userPhone: string, userName: string): Promise<void> {
  // Implementar envio de cupom de desconto
  appLogger.info(`🎁 Enviando desconto para ${userName} (${userPhone})`);
}

/**
 * 🆘 ENVIAR MENSAGEM DE SUPORTE
 */
async function sendSupportMessage(userPhone: string, userName: string): Promise<void> {
  // Implementar redirecionamento para suporte
  appLogger.info(`🆘 Enviando suporte para ${userName} (${userPhone})`);
}

/**
 * 🚫 PROCESSAR DESCADASTRO
 */
async function handleUnsubscribe(userPhone: string, userName: string): Promise<void> {
  // Implementar lógica de opt-out
  appLogger.info(`🚫 Descadastro solicitado por ${userName} (${userPhone})`);
}

/**
 * 💬 ENVIAR RESPOSTA GENÉRICA
 */
async function sendGenericResponse(userPhone: string, userName: string): Promise<void> {
  // Implementar resposta automática
  appLogger.info(`💬 Resposta genérica para ${userName} (${userPhone})`);
}
