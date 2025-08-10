// API Handler para Webhook Hotmart
// Este arquivo deve ser usado como referência para configurar o endpoint webhook

import {
  hotmartWebhookManager,
  HotmartWebhookData,
} from "../utils/hotmartWebhook";

/**
 * IMPORTANTE: Para aplicações SPA (Single Page Application) como esta,
 * você precisará configurar um servidor backend separado para receber webhooks.
 *
 * Opções recomendadas:
 * 1. Vercel Serverless Functions
 * 2. Netlify Functions
 * 3. AWS Lambda
 * 4. Express.js em servidor dedicado
 *
 * Este arquivo serve como modelo para implementação do endpoint.
 */

// Exemplo de implementação para Vercel Serverless Functions
// Arquivo: /api/webhook/hotmart.ts (se usando Vercel)
export async function handleHotmartWebhook(
  request: Request
): Promise<Response> {
  try {
    // Verificar método HTTP
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Verificar Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return new Response("Invalid content type", { status: 400 });
    }

    // Parsear dados do webhook
    const webhookData: HotmartWebhookData = await request.json();

    // Validar estrutura básica
    if (!webhookData.event || !webhookData.data || !webhookData.webhook_id) {
      return new Response("Invalid webhook data", { status: 400 });
    }

    // Log do webhook recebido
    console.log("[Hotmart Webhook API] Webhook recebido:", {
      event: webhookData.event,
      transaction_id: webhookData.data.transaction?.id,
      buyer_email: webhookData.data.buyer?.email,
      timestamp: webhookData.timestamp,
    });

    // Processar webhook
    await hotmartWebhookManager.processWebhook(webhookData);

    // Resposta de sucesso para Hotmart
    return new Response("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("[Hotmart Webhook API] Erro ao processar webhook:", error);

    // Retornar erro 500 para que Hotmart tente reenviar
    return new Response("Internal server error", { status: 500 });
  }
}

// Exemplo de implementação para Express.js
export const expressWebhookHandler = (req: any, res: any) => {
  try {
    // Verificar método
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    // Validar dados
    const webhookData: HotmartWebhookData = req.body;

    if (!webhookData.event || !webhookData.data || !webhookData.webhook_id) {
      return res.status(400).send("Invalid webhook data");
    }

    // Processar webhook de forma assíncrona
    hotmartWebhookManager
      .processWebhook(webhookData)
      .then(() => {
        console.log("[Hotmart Webhook] Processado com sucesso");
      })
      .catch((error) => {
        console.error("[Hotmart Webhook] Erro no processamento:", error);
      });

    // Responder imediatamente para Hotmart
    res.status(200).send("OK");
  } catch (error) {
    console.error("[Hotmart Webhook Express] Erro:", error);
    res.status(500).send("Internal server error");
  }
};

// Configuração de segurança recomendada
export const webhookSecurityConfig = {
  // Validar IP da Hotmart (opcional)
  allowedIPs: [
    // IPs da Hotmart - verificar documentação atual
    "54.207.79.192",
    "54.207.118.209",
  ],

  // Rate limiting
  rateLimitConfig: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP por janela
  },

  // Headers de segurança
  validateHeaders: (headers: Headers) => {
    const userAgent = headers.get("user-agent");
    return userAgent?.includes("Hotmart") || false;
  },
};

/**
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 *
 * 1. VERCEL:
 *    - Criar arquivo /api/webhook/hotmart.ts
 *    - Implementar usando a função handleHotmartWebhook
 *    - URL do webhook: https://seudominio.vercel.app/api/webhook/hotmart
 *
 * 2. NETLIFY:
 *    - Criar arquivo /netlify/functions/hotmart-webhook.ts
 *    - Adaptar para formato Netlify Functions
 *    - URL do webhook: https://seudominio.netlify.app/.netlify/functions/hotmart-webhook
 *
 * 3. EXPRESS.JS:
 *    - app.post('/webhook/hotmart', expressWebhookHandler)
 *    - URL do webhook: https://seudominio.com/webhook/hotmart
 *
 * 4. CONFIGURAÇÃO NA HOTMART:
 *    - Acessar área do produtor
 *    - Ir em Configurações > Postback/Webhook
 *    - Adicionar URL: https://seudominio.com/api/webhook/hotmart
 *    - Selecionar eventos: PURCHASE_COMPLETE, PURCHASE_APPROVED
 *    - ID do Webhook: agQzTLUehWUfhPzjhdwntVQz0JNT5E0216ae0d-00a9-48ae-85d1-f0d14bd8e0df
 *
 * EVENTOS HOTMART IMPORTANTES:
 * - PURCHASE_COMPLETE: Compra finalizada
 * - PURCHASE_APPROVED: Pagamento aprovado
 * - PURCHASE_CANCELED: Compra cancelada
 * - PURCHASE_REFUNDED: Compra reembolsada
 * - PURCHASE_DELAYED: Pagamento em análise
 * - PURCHASE_REPROVED: Pagamento reprovado
 */
