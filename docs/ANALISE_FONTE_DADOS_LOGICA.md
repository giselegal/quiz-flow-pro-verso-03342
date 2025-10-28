qua## 🔍 ANÁLISE COMPLETA DAS FONTES DE DADOS E LÓGICA DO QUIZ

**Data:** 2025-10-28  
**Objetivo:** Determinar fonte correta de informações e lógica de cálculo/resultados

---

## 📊 ESTRUTURA DAS ETAPAS (Baseado em QUIZ_STEPS)

### **BLOCO 1: Introdução (1 etapa)**
- `step-01`: **Intro** - Coleta do nome do usuário

### **BLOCO 2: Quiz de Estilo (10 etapas)**
- `step-02` a `step-11`: **Questions** - 10 perguntas principais
  - Pontuação por estilo de moda (8 estilos possíveis)
  - Cada resposta = 1 ponto para o estilo correspondente
  - Cálculo via `computeResult()` em `src/utils/result/computeResult.ts`

### **BLOCO 3: Transição (1 etapa)**
- `step-12`: **Transition** - Ponte entre quiz de estilo e perguntas estratégicas

### **BLOCO 4: Perguntas Estratégicas (6 etapas)**
- `step-13` a `step-18`: **Strategic Questions**
  - Capturam objetivo principal da usuária
  - Última pergunta (step-18): determina tipo de oferta personalizada

### **BLOCO 5: Resultado e Oferta (3 etapas)**
- `step-19`: **Transition-Result** - "Obrigada por compartilhar"
- `step-20`: **Result** - Exibe estilo predominante calculado ✅
- `step-21`: **Offer** - Oferta personalizada baseada em resposta estratégica

---

## 🎯 RESPOSTA À PERGUNTA: "Qual é a fonte correta?"

### **FONTE CORRETA: `QUIZ_STEPS` (src/data/quizSteps.ts)**

**Justificativa:**

1. ✅ **Estrutura Completa e Coerente**
   - 21 steps totais (1 intro + 10 quiz + 1 transição + 6 estratégicas + 1 transição + 1 resultado + 1 oferta)
   - 20 steps com nextStep definido
   - 1 step terminal (step-21)
   - Navegação linear e lógica

2. ✅ **Lógica de Cálculo Integrada**
   - `computeResult()` usa `QUIZ_STEPS` como padrão
   - Pontuação por resposta nas etapas 2-11
   - Resultado exibido no step-20

3. ✅ **Documentação Clara**
   ```typescript
   /**
    * Este arquivo contém todas as 21 etapas do quiz de estilo pessoal:
    * - Etapa 1: Introdução e coleta do nome
    * - Etapas 2-11: 10 perguntas principais do quiz (pontuação por estilo)
    * - Etapa 12: Transição para perguntas estratégicas
    * - Etapas 13-18: 6 perguntas estratégicas para personalização da oferta
    * - Etapa 19: Transição para resultado
    * - Etapa 20: Exibição do resultado personalizado
    * - Etapa 21: Oferta personalizada baseada nas respostas estratégicas
    */
   ```

4. ✅ **Usado pelos Hooks Principais**
   - `useQuizState.ts` importa e usa `QUIZ_STEPS`
   - `computeResult()` recebe `QUIZ_STEPS` como padrão

---

## ⚠️ FONTE SECUNDÁRIA: `quiz21StepsComplete.ts`

**Status:** Incompleto e inconsistente

**Problemas Identificados:**

1. ❌ **22 steps ao invés de 21**
   - Tem propriedade `_source` extra (não é um step real)

2. ❌ **step-20 SEM nextStep**
   - Faltava `navigation.nextStep: 'step-21'`
   - **CORRIGIDO** agora no commit atual

3. ❌ **Uso Limitado**
   - Usado principalmente para templates v3.0 com estrutura `sections`
   - Gerado automaticamente de JSONs (`npm run generate:templates`)

---

## 🎯 ESTRUTURA RECOMENDADA: 20 STEPS + OPCIONAIS

Baseado na sua instrução **"o funil deve ir até a etapa 20"**:

### **Configuração Recomendada:**

```typescript
// NÚCLEO DO FUNIL (20 steps obrigatórios)
const CORE_FUNNEL = {
  'step-01': { type: 'intro' },          // Coleta nome
  'step-02' a 'step-11': { type: 'question' },  // 10 quiz
  'step-12': { type: 'transition' },     // Transição
  'step-13' a 'step-18': { type: 'strategic' }, // 6 estratégicas
  'step-19': { type: 'transition-result' }, // Transição
  'step-20': { type: 'result', nextStep: null }, // RESULTADO FINAL ✅
};

// STEPS OPCIONAIS (podem ser adicionados)
const OPTIONAL_STEPS = {
  'step-21': { type: 'offer' },          // Oferta comercial
  'step-22': { type: 'checkout' },       // Checkout (se implementar)
  // ... mais steps conforme necessário
};
```

### **Lógica:**

1. **step-20 = RESULTADO FINAL do quiz** ✅
   - Exibe estilo predominante calculado
   - Exibe pontuação por estilo
   - Terminal por padrão

2. **step-21 = OPCIONAL** (Oferta comercial)
   - Pode ser habilitada/desabilitada via configuração
   - Se habilitada: step-20.nextStep = 'step-21'
   - Se desabilitada: step-20.nextStep = null

3. **Extensibilidade:**
   - Permite adicionar step-22, step-23, etc.
   - Cada novo step é opcional
   - NavigationService suporta via `autoFillNextSteps()`

---

## 📈 LÓGICA DE CÁLCULO E RESULTADOS

### **1. Coleta de Respostas (step-02 a step-11)**

```typescript
// Cada resposta adiciona 1 ponto ao estilo correspondente
answers = {
  'step-02': ['natural', 'classico', 'natural'],  // natural: +2, classico: +1
  'step-03': ['romantico', 'natural', 'elegante'], // etc.
  // ...
};
```

### **2. Cálculo (computeResult)**

```typescript
import { computeResult } from '@/utils/result/computeResult';

const { primaryStyleId, secondaryStyleIds, scores } = computeResult({ 
  answers: state.answers 
});

// Retorna:
// primaryStyleId: 'natural' (estilo com mais pontos)
// secondaryStyleIds: ['classico', 'romantico'] (2º e 3º lugares)
// scores: { natural: 15, classico: 12, romantico: 10, ... }
```

### **3. Exibição no step-20**

```typescript
'step-20': {
  type: 'result',
  title: '{userName}, seu estilo predominante é:',
  // Renderiza:
  // - Nome do estilo (ex: "Natural")
  // - Descrição do estilo
  // - Pontuação/gráfico
  // - Estilos secundários
}
```

### **4. Personalização da Oferta (step-21)**

```typescript
'step-21': {
  type: 'offer',
  offerMap: {
    'Montar looks com mais facilidade': { ... },
    'Usar o que já tenho': { ... },
    // Chave vem da resposta do step-18
  }
}
```

---

## ✅ CONCLUSÃO E RECOMENDAÇÕES

### **Fonte de Dados Correta:**
✅ **`QUIZ_STEPS` (src/data/quizSteps.ts)** é a fonte primária e autoritativa

### **Lógica de Cálculo:**
✅ **`computeResult()` (src/utils/result/computeResult.ts)** é a função oficial

### **Estrutura do Funil:**
✅ **20 steps obrigatórios até o resultado**
✅ **step-21+ são opcionais e configuráveis**

### **Ações Necessárias:**

1. ✅ **FEITO:** Corrigido `navigation.nextStep` no step-20 do `quiz21StepsComplete.ts`

2. 🔄 **PROPOSTO:** Tornar step-21 opcional via configuração
   ```typescript
   const ENABLE_OFFER_STEP = import.meta.env.VITE_ENABLE_OFFER_STEP === 'true';
   
   if (ENABLE_OFFER_STEP) {
     'step-20'.nextStep = 'step-21';
   } else {
     'step-20'.nextStep = null;
   }
   ```

3. 🔄 **PROPOSTO:** Documentar extensibilidade
   ```typescript
   // Adicionar novos steps opcionais:
   'step-22': { type: 'upsell', nextStep: 'step-23' },
   'step-23': { type: 'checkout', nextStep: null },
   ```

---

## 🎯 RESUMO EXECUTIVO

| Aspecto | Fonte Correta | Status |
|---------|---------------|--------|
| **Dados de Steps** | `QUIZ_STEPS` | ✅ Correto |
| **Lógica de Cálculo** | `computeResult()` | ✅ Funcional |
| **Navegação Completa** | step-01 → step-20 | ✅ Validado |
| **Step-21 (Oferta)** | Opcional | ⏳ Implementar toggle |
| **Extensibilidade** | NavigationService | ✅ Suportado |

**Recomendação Final:**
Manter `QUIZ_STEPS` como fonte autoritativa, com step-20 como resultado final e step-21+ como etapas opcionais configuráveis.
