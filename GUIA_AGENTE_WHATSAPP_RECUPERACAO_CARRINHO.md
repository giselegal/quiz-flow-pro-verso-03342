# 🤖 GUIA COMPLETO - AGENTE WHATSAPP PARA RECUPERAÇÃO DE CARRINHO

## 🎯 VISÃO GERAL

Sistema inteligente que monitora webhooks da Hotmart e envia mensagens automáticas via WhatsApp para recuperar carrinhos abandonados.

### ✨ **FUNCIONALIDADES**

- 🛒 **Detecção automática** de carrinho abandonado via webhook Hotmart
- 📱 **Mensagens automáticas** via WhatsApp Business API
- 🎯 **Templates personalizados** com dados do comprador
- ⏰ **Sequência temporizada** de follow-up (30min, 24h, 3 dias)
- 📊 **Dashboard de monitoramento** em tempo real
- 🎁 **Cupons de desconto** automáticos
- 📈 **Analytics de performance** detalhados

## 🏗️ ARQUITETURA DO SISTEMA

```
📊 FLUXO DE RECUPERAÇÃO
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HOTMART       │───▶│   WEBHOOK       │───▶│   WHATSAPP      │
│   (Carrinho     │    │   PROCESSOR     │    │   AGENT         │
│   Abandonado)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │                       │
                               ▼                       ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   SUPABASE      │    │   WHATSAPP      │
                    │   (Histórico)   │    │   BUSINESS API  │
                    └─────────────────┘    └─────────────────┘
```

## 🚀 CONFIGURAÇÃO PASSO A PASSO

### **PASSO 1: Configurar WhatsApp Business API**

#### 1.1 Criar Conta Business
1. Acesse [Facebook Business](https://business.facebook.com)
2. Crie uma conta business
3. Adicione WhatsApp Business

#### 1.2 Obter Credenciais
```
✅ Access Token: EAAxxxxxxxxxxxxxxxxx
✅ Phone Number ID: 123456789012345
✅ Business Account ID: 123456789012345
✅ Webhook Verify Token: seu_token_secreto
```

#### 1.3 Configurar Webhook
- **URL**: `https://seudominio.com/api/webhook/whatsapp`
- **Verify Token**: `seu_token_secreto`
- **Campos**: `messages`

### **PASSO 2: Configurar Hotmart Webhook**

#### 2.1 No Painel Hotmart
1. Acesse **Hotmart > Ferramentas > Postback**
2. Adicione URL: `https://seudominio.com/api/webhook/hotmart`
3. Selecione eventos:
   - ✅ `PURCHASE_COMPLETE`
   - ✅ `PURCHASE_CANCELED` 
   - ✅ `CART_ABANDONED` (se disponível)

#### 2.2 Configurar Eventos Customizados
```javascript
// Adicionar no checkout da Hotmart
hotmart.onCartAbandonment = function(data) {
  fetch('/api/webhook/cart-abandoned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'CART_ABANDONED',
      data: data,
      timestamp: new Date().toISOString()
    })
  });
};
```

### **PASSO 3: Implementar no Projeto**

#### 3.1 Instalar Dependências
```bash
# Já estão no projeto
npm install @supabase/supabase-js
npm install lucide-react
```

#### 3.2 Configurar Variáveis de Ambiente
```env
# .env.local
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WHATSAPP_WEBHOOK_VERIFY_TOKEN=seu_token_secreto
WHATSAPP_API_VERSION=v18.0

# Hotmart
HOTMART_WEBHOOK_SECRET=seu_secret_hotmart
```

#### 3.3 Adicionar Rota no Dashboard
```tsx
// src/pages/dashboard/index.tsx
import WhatsAppRecoveryDashboard from '@/components/dashboard/WhatsAppRecoveryDashboard';

// Adicionar rota
<Route path="/dashboard/whatsapp" component={WhatsAppRecoveryDashboard} />
```

## 📱 TEMPLATES DE MENSAGEM

### **Template 1: Primeiro Contato (30min)**
```
Olá {{nome}}! 👋

Vi que você estava interessado no {{produto}} por {{preço}}.

Que tal finalizar sua compra agora? Tenho uma oferta especial para você! 🎯

[🛒 Finalizar Compra] [❓ Tenho Dúvidas]
```

### **Template 2: Segundo Contato (24h)**
```
Olá {{nome}}! 😊

Notei que você ainda não finalizou sua compra do {{produto}}.

Preparei um desconto especial de 15% só para você! 🎁

Código: VOLTA15
⏰ Válido por 48h!

[✅ Finalizar Compra] [🎁 Ver Desconto] [❌ Não Tenho Interesse]
```

### **Template 3: Último Contato (3 dias)**
```
Olá {{nome}}! 

Esta é minha última mensagem sobre o {{produto}}.

🎁 DESCONTO ESPECIAL: 20% OFF
Código: VOLTA20
⏰ Válido apenas por 24h!

👆 Clique aqui para finalizar: {{link}}

Obrigado pela atenção! 😊
```

## 🎛️ CONFIGURAÇÃO NO DASHBOARD

### **Interface de Configuração:**

```tsx
// Uso do hook
const {
  state,
  configure,
  start,
  stop,
  sendTestMessage
} = useWhatsAppCartRecovery();

// Configurar API
await configure({
  accessToken: 'EAAxxxxxxxxxxxxxxxxx',
  phoneNumberId: '123456789012345',
  businessAccountId: '123456789012345',
  webhookVerifyToken: 'seu_token_secreto',
  apiVersion: 'v18.0'
});

// Iniciar agente
start();
```

## 📊 MÉTRICAS E ANALYTICS

### **KPIs Principais:**
- 🛒 **Carrinhos Abandonados**: Total identificados
- 📱 **Mensagens Enviadas**: Total de contatos
- ✅ **Recuperações**: Vendas finalizadas após contato
- 📈 **Taxa de Recuperação**: % de conversão
- ⏱️ **Tempo Médio**: Tempo até finalização
- 💰 **Receita Recuperada**: Valor total recuperado

### **Métricas Detalhadas:**
```javascript
{
  totalAbandoned: 150,
  totalContacted: 142,
  totalRecovered: 47,
  recoveryRate: 31.3,
  avgResponseTime: '2h 15m',
  revenueRecovered: 23485.50,
  bestPerformingTemplate: 'second_contact',
  peakAbandonmentTime: '22:00-23:00'
}
```

## 🔄 FLUXO DE FUNCIONAMENTO

### **1. Detecção de Abandono**
```
Usuário abandona carrinho
     ↓
Hotmart envia webhook
     ↓
Sistema detecta abandono
     ↓
Dados salvos no banco
```

### **2. Sequência de Recuperação**
```
T+30min: Primeira mensagem (template simples)
     ↓
T+24h: Segunda mensagem (com botões interativos)
     ↓
T+3dias: Última mensagem (desconto especial)
```

### **3. Processamento de Respostas**
```
Usuário responde
     ↓
Webhook WhatsApp recebido
     ↓
IA processa intenção
     ↓
Ação automática executada
```

## 🛡️ SEGURANÇA E COMPLIANCE

### **✅ Boas Práticas:**
- 🔐 **Tokens seguros** em variáveis de ambiente
- ✅ **Verificação de webhook** com tokens
- 📱 **Opt-out automático** respeitando LGPD
- 🔒 **Criptografia** de dados sensíveis
- ⏰ **Rate limiting** para evitar spam
- 📊 **Logs de auditoria** completos

### **📋 Compliance LGPD:**
- ✅ **Consentimento explícito** para contato
- ✅ **Opt-out fácil** a qualquer momento
- ✅ **Dados mínimos** necessários
- ✅ **Retenção limitada** (30 dias)

## 🚀 EXEMPLO DE USO

### **No Dashboard:**
```tsx
import { WhatsAppRecoveryDashboard } from '@/components/dashboard/WhatsAppRecoveryDashboard';

function AdminPanel() {
  return (
    <div>
      <h1>Painel Administrativo</h1>
      <WhatsAppRecoveryDashboard />
    </div>
  );
}
```

### **Configuração Rápida:**
```tsx
const { configure, start } = useWhatsAppCartRecovery();

// Configurar uma vez
await configure({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  apiVersion: 'v18.0'
});

// Iniciar monitoramento
start();
```

## 📈 RESULTADOS ESPERADOS

### **📊 Benchmarks da Indústria:**
- **Taxa de Abertura**: 85-95% (WhatsApp)
- **Taxa de Resposta**: 25-40%
- **Taxa de Recuperação**: 15-30%
- **ROI Médio**: 300-500%

### **🎯 Metas para Seu Projeto:**
- 🛒 **Detectar 90%** dos abandonos
- 📱 **Contatar 85%** dos usuários
- ✅ **Recuperar 25%** das vendas
- 💰 **ROI de 400%** em 6 meses

## 🔧 MANUTENÇÃO E OTIMIZAÇÃO

### **📊 Monitoramento:**
- Dashboard em tempo real
- Alertas de falha
- Métricas de performance
- A/B testing de templates

### **🎯 Otimizações:**
- Horários ideais de envio
- Personalização por perfil
- Segmentação por produto
- ML para predição de conversão

Este sistema completo transformará seus carrinhos abandonados em oportunidades de venda! 🚀
