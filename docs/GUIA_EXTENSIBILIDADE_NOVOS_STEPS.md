## 🔧 GUIA DE EXTENSIBILIDADE: ADICIONANDO NOVOS STEPS AO QUIZ

**Data:** 2025-10-28  
**Objetivo:** Explicar como adicionar steps customizados além do step-21

---

## 📋 VISÃO GERAL

O sistema de navegação do quiz foi projetado para ser extensível, permitindo adicionar novos steps além dos 21 padrão (step-01 a step-21).

**Casos de uso comuns:**
- **step-22:** Upsell (oferta adicional)
- **step-23:** Checkout (página de pagamento)
- **step-24:** Thank You (obrigado pela compra)
- **step-25:** Onboarding (primeiros passos pós-compra)

---

## 🎯 ARQUITETURA DE STEPS

### **Steps Obrigatórios (Core) - 20 steps**
```
step-01 → step-02 → ... → step-20 (RESULTADO)
```
- ✅ Sempre presentes
- ⚠️ Não podem ser removidos
- 🎯 Formam o núcleo do quiz

### **Steps Opcionais - step-21+**
```
step-20 → [step-21 (OFERTA)] → [step-22 (UPSELL)] → [step-23 (CHECKOUT)] → ...
```
- 🔄 Podem ser habilitados/desabilitados
- 🎨 Podem ser customizados por funil
- 🔌 Plug-and-play via configuração

---

## 🚀 PASSO A PASSO: ADICIONAR UM NOVO STEP

### **1. Habilitar Steps Customizados**

Edite `.env.local` ou `.env`:

```bash
# Habilitar step-21 (oferta)
VITE_ENABLE_OFFER_STEP=true

# Habilitar steps customizados (step-22+)
VITE_CUSTOM_STEPS_ENABLED=true
```

### **2. Registrar o Novo Step na Configuração**

Edite `src/config/quizNavigation.ts`:

```typescript
export const QUIZ_STRUCTURE = {
  CORE_STEPS: [
    'step-01', // ... até step-20
  ] as const,

  OPTIONAL_STEPS: [
    'step-21', // Offer
  ] as const,

  CUSTOM_STEPS: [
    'step-22', // ✅ ADICIONAR AQUI
    'step-23', // ✅ ADICIONAR AQUI
    'step-24', // ✅ ADICIONAR AQUI
  ] as const,
};
```

### **3. Adicionar Dados do Step em QUIZ_STEPS**

Edite `src/data/quizSteps.ts`:

```typescript
export const QUIZ_STEPS: Record<string, QuizStep> = {
  // ... steps existentes ...

  'step-22': {
    id: 'step-22',
    type: 'upsell', // ou 'custom'
    title: 'Aproveite esta oferta exclusiva!',
    text: 'Por tempo limitado: 50% OFF no curso avançado',
    buttonText: 'Quero aproveitar',
    nextStep: 'step-23', // ✅ Define próximo step
  },

  'step-23': {
    id: 'step-23',
    type: 'checkout',
    title: 'Finalizar Compra',
    buttonText: 'Pagar Agora',
    nextStep: 'step-24', // ✅ Define próximo step
  },

  'step-24': {
    id: 'step-24',
    type: 'thank-you',
    title: 'Obrigada pela compra!',
    text: 'Você receberá um email com os próximos passos.',
    buttonText: 'Ir para área de membros',
    nextStep: null, // ✅ Step terminal (fim do funil)
  },
};
```

### **4. Atualizar Navegação do Step Anterior**

Edite o step que deve apontar para o novo step:

```typescript
'step-21': {
  id: 'step-21',
  type: 'offer',
  // ... outros campos ...
  nextStep: 'step-22', // ✅ Antes era null, agora aponta para step-22
},
```

### **5. Criar Template JSON (Opcional)**

Crie `public/templates/step-22-v3.json`:

```json
{
  "stepId": "step-22",
  "sections": [
    {
      "id": "upsell-section",
      "order": 0,
      "blocks": [
        {
          "id": "upsell-header-22",
          "type": "upsell-header",
          "order": 0,
          "properties": {},
          "content": {
            "title": "Aproveite esta oferta exclusiva!",
            "subtitle": "Por tempo limitado",
            "discount": "50% OFF"
          }
        },
        {
          "id": "upsell-cta-22",
          "type": "cta-button",
          "order": 1,
          "properties": {
            "variant": "primary",
            "size": "large"
          },
          "content": {
            "text": "Quero aproveitar",
            "link": "#step-23"
          }
        }
      ]
    }
  ],
  "navigation": {
    "nextStep": "step-23",
    "prevStep": "step-21",
    "canSkip": true
  }
}
```

### **6. Gerar Templates TypeScript**

```bash
npm run generate:templates
npm run build:templates
```

Isso atualizará:
- `src/templates/quiz21StepsComplete.ts`
- `src/templates/embedded.ts`

### **7. Validar Navegação**

```bash
npx tsx scripts/test-quiz-navigation-config.ts
```

**Resultado esperado:**
```
✅ STEPS HABILITADOS (24 total):
  step-01, ..., step-21, step-22, step-23, step-24

🎯 TESTE: Navegação do step-21 (oferta)
  step-21.nextStep (configurado): step-22

🔧 TESTE: NavigationService com configuração
  NavigationService.resolveNextStep('step-21'): step-22
  NavigationService.resolveNextStep('step-22'): step-23
  NavigationService.resolveNextStep('step-23'): step-24
  NavigationService.resolveNextStep('step-24'): null
```

---

## 🔍 VALIDAÇÃO E TESTES

### **Script de Validação**

```bash
# Validar navegação completa
npx tsx scripts/validate-templates.ts

# Testar configuração
npx tsx scripts/test-quiz-navigation-config.ts

# Comparar fontes de dados
npx tsx scripts/compare-template-sources.ts
```

### **Checklist de Validação**

- [ ] Step adicionado em `QUIZ_STRUCTURE.CUSTOM_STEPS`
- [ ] Dados do step criados em `QUIZ_STEPS`
- [ ] `nextStep` do step anterior atualizado
- [ ] Template JSON criado (se necessário)
- [ ] Templates TypeScript gerados
- [ ] Variável `VITE_CUSTOM_STEPS_ENABLED=true` configurada
- [ ] NavigationService valida sem erros
- [ ] Build passa sem erros TypeScript

---

## 🎨 TIPOS DE STEPS CUSTOMIZADOS

### **1. Upsell (Oferta Adicional)**
```typescript
type: 'upsell'
// Características:
// - Oferece produto/serviço adicional
// - Pode ser pulado (canSkip: true)
// - Geralmente entre oferta principal e checkout
```

### **2. Checkout (Finalização)**
```typescript
type: 'checkout'
// Características:
// - Integração com gateway de pagamento
// - Coleta de dados de pagamento
// - Geralmente após ofertas
```

### **3. Thank You (Obrigado)**
```typescript
type: 'thank-you'
// Características:
// - Confirmação de compra
// - Próximos passos
// - Links para área de membros
```

### **4. Onboarding (Primeiros Passos)**
```typescript
type: 'onboarding'
// Características:
// - Tutorial pós-compra
// - Configuração inicial
// - Introdução ao produto
```

### **5. Custom (Personalizado)**
```typescript
type: 'custom'
// Características:
// - Qualquer conteúdo personalizado
// - Flexibilidade total de layout
// - Use para casos específicos
```

---

## 🔧 CONFIGURAÇÃO AVANÇADA

### **Desabilitar Step Específico em Runtime**

```typescript
// src/config/quizNavigation.ts

export function getConfiguredNextStep(
  currentStepId: string, 
  defaultNextStep: string | null
): string | null {
  // Desabilitar step-22 se condição específica
  if (currentStepId === 'step-21' && shouldSkipUpsell()) {
    return 'step-23'; // Pula step-22, vai direto para checkout
  }

  // ... lógica existente ...
}

function shouldSkipUpsell(): boolean {
  // Exemplo: pular upsell se já é cliente
  return localStorage.getItem('is_existing_customer') === 'true';
}
```

### **Personalização por Funil**

```typescript
import { getPersonalizedStepTemplate } from '@/templates/quiz21StepsComplete';

// Template diferente para cada funil
const blocks = getPersonalizedStepTemplate('step-22', 'funnel-premium');
// → IDs dos blocos terão sufixo único: "upsell-header-22-fnlpremium"
```

### **Navegação Condicional**

```typescript
// Em useQuizState.ts ou lógica de navegação

const getNextStep = (currentStepId: string, answers: Record<string, any>) => {
  if (currentStepId === 'step-21') {
    // Se usuário recusou oferta principal, pular upsell
    if (answers['step-21'] === 'rejected') {
      return 'step-24'; // Vai direto para thank you
    }
  }

  // Navegação padrão
  return navigationService.resolveNextStep(currentStepId);
};
```

---

## 📊 EXEMPLO COMPLETO: FUNIL COM UPSELL

### **Estrutura Final:**

```
step-01 (Intro)
  ↓
step-02 a step-11 (Quiz - 10 perguntas)
  ↓
step-12 (Transição)
  ↓
step-13 a step-18 (Perguntas estratégicas)
  ↓
step-19 (Transição para resultado)
  ↓
step-20 (RESULTADO)
  ↓
step-21 (Oferta Principal) ← opcional via VITE_ENABLE_OFFER_STEP
  ↓
step-22 (Upsell) ← customizado
  ↓
step-23 (Checkout) ← customizado
  ↓
step-24 (Thank You) ← customizado
```

### **Configuração `.env.local`:**

```bash
# Habilitar todas as features
VITE_ENABLE_OFFER_STEP=true
VITE_CUSTOM_STEPS_ENABLED=true

# Outras configs
VITE_DEFAULT_FUNNEL_ID=funnel-premium
VITE_EDITOR_SUPABASE_ENABLED=true
```

### **Navegação Esperada:**

| Step | Type | Next Step | Terminal? |
|------|------|-----------|-----------|
| step-20 | result | step-21 | ❌ |
| step-21 | offer | step-22 | ❌ |
| step-22 | upsell | step-23 | ❌ |
| step-23 | checkout | step-24 | ❌ |
| step-24 | thank-you | null | ✅ |

---

## ⚠️ TROUBLESHOOTING

### **Problema: "Step não encontrado"**

**Solução:**
1. Verificar se step está em `QUIZ_STEPS`
2. Verificar se step está em `CUSTOM_STEPS`
3. Verificar se `VITE_CUSTOM_STEPS_ENABLED=true`

### **Problema: "NavigationService retorna null"**

**Solução:**
1. Verificar se `nextStep` está definido no step anterior
2. Verificar se `getConfiguredNextStep` não está bloqueando

### **Problema: "Template não carrega"**

**Solução:**
1. Executar `npm run generate:templates`
2. Executar `npm run build:templates`
3. Verificar se JSON está em `public/templates/`

### **Problema: "Erro de tipo TypeScript"**

**Solução:**
1. Adicionar novo tipo em `QuizStep.type`
2. Atualizar tipos em `QUIZ_STRUCTURE`
3. Executar `npm run type-check`

---

## ✅ RESUMO

**Para adicionar um novo step customizado:**

1. ✅ Configure `VITE_CUSTOM_STEPS_ENABLED=true`
2. ✅ Adicione step ID em `QUIZ_STRUCTURE.CUSTOM_STEPS`
3. ✅ Crie dados em `QUIZ_STEPS`
4. ✅ Atualize `nextStep` do step anterior
5. ✅ Crie template JSON (opcional)
6. ✅ Gere templates TS
7. ✅ Valide navegação
8. ✅ Teste no navegador

**Navegação automática é gerenciada por:**
- `NavigationService` (lógica de navegação)
- `getConfiguredNextStep()` (aplicação de configuração)
- `useQuizState` (estado e transições do quiz)

**Extensibilidade suportada:**
- ✅ Novos steps ilimitados (step-22, step-23, step-24, ...)
- ✅ Navegação condicional
- ✅ Personalização por funil
- ✅ Toggle de steps individuais
- ✅ Validação automática

---

**🎯 O sistema foi projetado para máxima flexibilidade sem comprometer a estabilidade do núcleo do quiz!**
