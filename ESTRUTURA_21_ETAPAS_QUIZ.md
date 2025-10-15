# 📊 ESTRUTURA DE ETAPAS DO QUIZ - DIVISÃO COMPLETA

**Data**: 15/10/2025  
**Quiz**: Quiz de Estilo Pessoal - Gisele Galvão  
**Total de Etapas**: 21

---

## 🎯 VISÃO GERAL DA ESTRUTURA

O quiz é dividido em **21 etapas sequenciais**, organizadas em **7 fases distintas**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUTURA DAS 21 ETAPAS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FASE 1: INTRODUÇÃO (1 etapa)                                  │
│  └─ Step 01: Intro → Coleta nome da usuária                    │
│                                                                 │
│  FASE 2: PERGUNTAS PRINCIPAIS (10 etapas)                      │
│  ├─ Step 02-11: Question → Identificação do estilo             │
│  └─ Cada pergunta pontua para 8 estilos diferentes             │
│                                                                 │
│  FASE 3: TRANSIÇÃO (1 etapa)                                   │
│  └─ Step 12: Transition → Preparação para perguntas extras     │
│                                                                 │
│  FASE 4: PERGUNTAS ESTRATÉGICAS (6 etapas)                     │
│  ├─ Step 13-18: Strategic Question → Personalização da oferta  │
│  └─ Define qual oferta será mostrada na etapa 21               │
│                                                                 │
│  FASE 5: TRANSIÇÃO PARA RESULTADO (1 etapa)                    │
│  └─ Step 19: Transition Result → Processando resultado...      │
│                                                                 │
│  FASE 6: RESULTADO (1 etapa)                                   │
│  └─ Step 20: Result → Mostra estilo principal + secundários    │
│                                                                 │
│  FASE 7: OFERTA (1 etapa)                                      │
│  └─ Step 21: Offer → Oferta personalizada baseada nas respostas│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 DETALHAMENTO POR ETAPA

### 🎬 **FASE 1: INTRODUÇÃO (Step 01)**

| Etapa | Tipo | Componente | Finalidade | Comportamento |
|-------|------|------------|------------|---------------|
| **Step 01** | `intro` | `IntroStep` | Capturar nome da usuária | Coleta nome + apresenta quiz |

**Dados Coletados:**
- `userName` (string) → Armazenado em `state.userProfile.userName`

**Fluxo:**
```typescript
// QuizAppConnected.tsx linha 424-430
case 'intro':
    return (
        <IntroStep
            data={currentStepData}
            onNameSubmit={(name) => {
                setUserName(name);  // Salva nome
                nextStep();          // Avança para step-02
            }}
        />
    );
```

---

### 📝 **FASE 2: PERGUNTAS PRINCIPAIS (Steps 02-11)**

| Etapa | Tipo | Componente | Finalidade | Seleções |
|-------|------|------------|------------|----------|
| **Step 02** | `question` | `QuestionStep` | Tipo de roupa favorita | 3 de 8 |
| **Step 03** | `question` | `QuestionStep` | Personalidade | 3 de 8 |
| **Step 04** | `question` | `QuestionStep` | Peças de roupa principais | 3 de 8 |
| **Step 05** | `question` | `QuestionStep` | Acessórios | 3 de 8 |
| **Step 06** | `question` | `QuestionStep` | Influência de cores | 3 de 8 |
| **Step 07** | `question` | `QuestionStep` | Situações de uso | 3 de 8 |
| **Step 08** | `question` | `QuestionStep` | Estampas e texturas | 3 de 8 |
| **Step 09** | `question` | `QuestionStep` | Ocasiões especiais | 3 de 8 |
| **Step 10** | `question` | `QuestionStep` | Inspirações de estilo | 3 de 8 |
| **Step 11** | `question` | `QuestionStep` | Objetivo com roupas | 3 de 8 |

**8 Estilos Pontuados:**
1. `natural` - Conforto e praticidade
2. `classico` - Discrição e sobriedade
3. `contemporaneo` - Estilo atual e prático
4. `elegante` - Elegância refinada
5. `romantico` - Delicadeza e feminilidade
6. `sexy` - Sensualidade
7. `dramatico` - Impacto visual
8. `criativo` - Originalidade e ousadia

**Dados Coletados:**
```typescript
// Cada resposta é armazenada em:
state.answers = {
    'step-02': ['natural', 'classico', 'romantico'],  // 3 seleções
    'step-03': ['elegante', 'sexy', 'dramatico'],     // 3 seleções
    // ... até step-11
}
```

**Fluxo:**
```typescript
// QuizAppConnected.tsx linha 431-446
case 'question': {
    const answers = state.answers[state.currentStep] || [];
    return (
        <QuestionStep
            data={currentStepData}
            currentAnswers={answers}
            onAnswersChange={(newAnswers) => {
                addAnswer(state.currentStep, newAnswers);
                const required = currentStepData.requiredSelections || 1;
                if (newAnswers.length === required) {
                    // Auto-avanço após completar seleções
                    setTimeout(() => nextStep(), 250);
                }
            }}
        />
    );
}
```

**Validação:**
- Usuária **DEVE** selecionar exatamente 3 opções
- Botão "Continuar" só habilita quando `answers.length === 3`
- Auto-avanço após 250ms quando completa

---

### 🔄 **FASE 3: TRANSIÇÃO (Step 12)**

| Etapa | Tipo | Componente | Finalidade | Duração |
|-------|------|------------|------------|---------|
| **Step 12** | `transition` | `TransitionStep` | Mensagem de transição | ~2s |

**Finalidade:**
- Separar perguntas principais de perguntas estratégicas
- Dar feedback visual de progresso
- Preparar usuária para próxima fase

**Fluxo:**
```typescript
// QuizAppConnected.tsx linha 456-461
case 'transition':
    return (
        <TransitionStep
            data={currentStepData}
            onComplete={() => nextStep()}  // Auto-avanço após animação
        />
    );
```

---

### 🎯 **FASE 4: PERGUNTAS ESTRATÉGICAS (Steps 13-18)**

| Etapa | Tipo | Componente | Finalidade | Opções |
|-------|------|------------|------------|--------|
| **Step 13** | `strategic-question` | `StrategicQuestionStep` | Faixa etária | 4 opções |
| **Step 14** | `strategic-question` | `StrategicQuestionStep` | Tempo disponível | 3 opções |
| **Step 15** | `strategic-question` | `StrategicQuestionStep` | Orçamento | 3 opções |
| **Step 16** | `strategic-question` | `StrategicQuestionStep` | Experiência com estilo | 3 opções |
| **Step 17** | `strategic-question` | `StrategicQuestionStep` | Principal desafio | 4 opções |
| **Step 18** | `strategic-question` | `StrategicQuestionStep` | Objetivo principal | 3 opções |

**Diferença de `question`:**
- **Seleção única** (não múltipla)
- **Auto-avanço imediato** após selecionar
- **Não pontua para estilos** (usado para oferta)

**Dados Coletados:**
```typescript
// Armazenado em objeto separado:
state.userProfile.strategicAnswers = {
    'step-13': 'idade-30-40',
    'step-14': 'tempo-medio',
    'step-15': 'orcamento-alto',
    'step-16': 'experiencia-basica',
    'step-17': 'desafio-combinar',
    'step-18': 'objetivo-guarda-roupa'
}
```

**Fluxo:**
```typescript
// QuizAppConnected.tsx linha 447-455
case 'strategic-question': {
    const strategicAnswers = state.userProfile.strategicAnswers || {};
    const currentAnswer = strategicAnswers[state.currentStep] || '';
    return (
        <StrategicQuestionStep
            data={currentStepData}
            currentAnswer={currentAnswer}
            onAnswerChange={(answer) => {
                addStrategicAnswer(state.currentStep, answer);
                // Auto-avanço IMEDIATO após seleção
                setTimeout(() => nextStep(), 400);
            }}
        />
    );
}
```

**Uso das Respostas:**
- Define qual **oferta personalizada** mostrar na Step 21
- Mapeamento em `offerMap` do Step 21

---

### ⏳ **FASE 5: TRANSIÇÃO PARA RESULTADO (Step 19)**

| Etapa | Tipo | Componente | Finalidade | Duração |
|-------|------|------------|------------|---------|
| **Step 19** | `transition-result` | `TransitionStep` | "Processando resultado..." | ~3s |

**Finalidade:**
- Criar expectativa para o resultado
- Dar tempo para processar pontuações
- Efeito de "carregamento" dramático

**Fluxo:**
```typescript
// QuizAppConnected.tsx linha 456-461 (usa mesmo componente)
case 'transition-result':
    return (
        <TransitionStep
            data={currentStepData}
            onComplete={() => nextStep()}
        />
    );
```

---

### 🎊 **FASE 6: RESULTADO (Step 20)**

| Etapa | Tipo | Componente | Finalidade | Cálculo |
|-------|------|------------|------------|---------|
| **Step 20** | `result` | `ResultStep` | Mostrar estilo personalizado | Pontuação das steps 2-11 |

**Cálculo de Resultado:**

```typescript
// Baseado nas respostas das steps 2-11 (10 perguntas x 3 seleções = 30 pontos)

// Exemplo:
// step-02: ['natural', 'classico', 'romantico'] → +1 ponto para cada
// step-03: ['natural', 'elegante', 'sexy']       → +1 ponto para cada
// ... até step-11

// Resultado final:
scores = {
    natural: 12,      // ← Maior pontuação (ESTILO PRINCIPAL)
    romantico: 8,     // ← 2º lugar (ESTILO SECUNDÁRIO)
    elegante: 6,      // ← 3º lugar (ESTILO SECUNDÁRIO)
    classico: 2,
    contemporaneo: 1,
    sexy: 1,
    dramatico: 0,
    criativo: 0
}

// Armazenado em:
state.userProfile.resultStyle = 'natural'           // Principal
state.userProfile.secondaryStyles = ['romantico', 'elegante']  // Secundários
```

**Dados Exibidos:**
- **Nome da usuária** → `{userName}`
- **Estilo principal** → `{primaryStyle}`
- **Estilos secundários** → `{secondaryStyles}`
- **Descrição personalizada** do estilo
- **Dicas de looks**
- **Paleta de cores**

**Fluxo:**
```typescript
// QuizAppConnected.tsx linha 462-469
case 'result':
    return (
        <ResultStep
            data={currentStepData}
            userProfile={state.userProfile}
            scores={state.scores}  // Pontuações calculadas
        />
    );
```

---

### 💰 **FASE 7: OFERTA (Step 21)**

| Etapa | Tipo | Componente | Finalidade | Personalização |
|-------|------|------------|------------|----------------|
| **Step 21** | `offer` | `OfferStep` | Apresentar oferta personalizada | Baseada em steps 13-18 |

**Mapeamento de Ofertas:**

```typescript
// Baseado nas respostas estratégicas:

offerMap = {
    // Combinações de respostas → Ofertas diferentes
    'tempo-medio_orcamento-medio': {
        title: 'Transformação de Estilo Essencial',
        description: 'Programa de 3 meses com mentoria...',
        buttonText: 'Quero Transformar meu Estilo!',
        testimonial: { ... }
    },
    'tempo-pouco_orcamento-baixo': {
        title: 'Guarda-Roupa Estratégico',
        description: 'Consultoria online rápida...',
        buttonText: 'Quero Organizar meu Guarda-Roupa!',
        testimonial: { ... }
    },
    // ... outras combinações
}
```

**Lógica de Seleção:**

```typescript
// Em useQuizState.ts ou ResultStep:
const getOfferKey = () => {
    const tempo = strategicAnswers['step-14'];
    const orcamento = strategicAnswers['step-15'];
    const experiencia = strategicAnswers['step-16'];
    const desafio = strategicAnswers['step-17'];
    
    // Combinar respostas para gerar chave
    return `${tempo}_${orcamento}_${experiencia}_${desafio}`;
};

const offerContent = currentStepData.offerMap[getOfferKey()];
```

**Dados Exibidos:**
- **Título da oferta** personalizado
- **Descrição** adaptada ao perfil
- **Botão CTA** com texto específico
- **Depoimento** relevante
- **Preço** (se aplicável)

---

## 🔄 FLUXO COMPLETO DE NAVEGAÇÃO

```
step-01 (intro)
   ↓ onNameSubmit
step-02 (question)
   ↓ auto-avanço quando 3 seleções
step-03 (question)
   ↓ auto-avanço quando 3 seleções
step-04 (question)
   ↓ ... (continua até step-11)
step-11 (question)
   ↓ auto-avanço quando 3 seleções
step-12 (transition)
   ↓ onComplete (auto-avanço ~2s)
step-13 (strategic-question)
   ↓ auto-avanço IMEDIATO após selecionar
step-14 (strategic-question)
   ↓ ... (continua até step-18)
step-18 (strategic-question)
   ↓ auto-avanço IMEDIATO
step-19 (transition-result)
   ↓ onComplete (auto-avanço ~3s)
step-20 (result)
   ↓ usuária clica "Ver Oferta" ou similar
step-21 (offer)
   ↓ usuária clica CTA → converte
```

---

## 📊 TIPOS DE COMPONENTES E COMPORTAMENTOS

| Tipo | Componente | Auto-Avanço | Validação | Pontuação |
|------|------------|-------------|-----------|-----------|
| `intro` | `IntroStep` | ❌ Não (botão) | Nome obrigatório | ❌ Não |
| `question` | `QuestionStep` | ✅ Sim (250ms) | 3 seleções | ✅ Sim (+1 por seleção) |
| `strategic-question` | `StrategicQuestionStep` | ✅ Sim (400ms) | 1 seleção | ❌ Não |
| `transition` | `TransitionStep` | ✅ Sim (~2s) | Sem validação | ❌ Não |
| `transition-result` | `TransitionStep` | ✅ Sim (~3s) | Sem validação | ❌ Não |
| `result` | `ResultStep` | ❌ Não (botão) | Sem validação | ❌ Não |
| `offer` | `OfferStep` | ❌ Não (CTA) | Sem validação | ❌ Não |

---

## 📁 LOCALIZAÇÃO DOS ARQUIVOS

```
/src/data/quizSteps.ts
├─ QUIZ_STEPS: Record<string, QuizStep>
├─ Contém TODAS as 21 etapas
└─ Exportado para uso em useQuizState

/src/components/quiz/
├─ IntroStep.tsx            → Renderiza step-01
├─ QuestionStep.tsx         → Renderiza steps 02-11
├─ StrategicQuestionStep.tsx → Renderiza steps 13-18
├─ TransitionStep.tsx       → Renderiza steps 12, 19
├─ ResultStep.tsx           → Renderiza step-20
└─ OfferStep.tsx            → Renderiza step-21

/src/components/quiz/QuizAppConnected.tsx
├─ legacyRender() (linha 417-499)
├─ Switch case para cada tipo
└─ Gerencia fluxo de navegação

/src/hooks/useQuizState.ts
├─ Gerencia estado do quiz
├─ Funções: nextStep(), addAnswer(), addStrategicAnswer()
└─ Calcula pontuações e resultado
```

---

## 🎯 RESUMO VISUAL

```
┌──────────────────────────────────────────────────────────────┐
│              ARQUITETURA DAS 21 ETAPAS                       │
└──────────────────────────────────────────────────────────────┘

01 ─────► INTRO ─────────────────────────────────► [Nome]
          IntroStep

02-11 ──► QUESTIONS ──────────────────────────────► [Pontuação]
          QuestionStep (10x)                         30 pontos
          3 seleções cada                            → Estilo Principal

12 ──────► TRANSITION ────────────────────────────► [Pausa]
          TransitionStep                             ~2s

13-18 ──► STRATEGIC QUESTIONS ────────────────────► [Oferta]
          StrategicQuestionStep (6x)                 Personalização
          1 seleção cada

19 ──────► TRANSITION RESULT ─────────────────────► [Expectativa]
          TransitionStep                             ~3s

20 ──────► RESULT ────────────────────────────────► [Estilo]
          ResultStep                                 Principal + Secundários

21 ──────► OFFER ─────────────────────────────────► [Conversão]
          OfferStep                                  CTA Personalizado
```

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### Por Etapa:

- [x] **Step 01**: Coleta nome, valida entrada, avança com botão
- [x] **Steps 02-11**: Valida 3 seleções, auto-avanço, pontua estilos
- [x] **Step 12**: Animação de transição, auto-avanço após delay
- [x] **Steps 13-18**: Seleção única, auto-avanço imediato, salva para oferta
- [x] **Step 19**: Animação "processando", auto-avanço após delay
- [x] **Step 20**: Calcula resultado, mostra estilo principal + secundários
- [x] **Step 21**: Seleciona oferta baseada em respostas, CTA personalizado

### Comportamento Geral:

- [x] **Navegação sequencial** (não pode pular etapas)
- [x] **Progresso visual** (barra de progresso)
- [x] **Validações** (botões desabilitados quando inválido)
- [x] **Auto-avanço** (onde apropriado)
- [x] **Estado persistente** (respostas salvas durante navegação)
- [x] **Cálculo correto** (pontuações somadas corretamente)
- [x] **Personalização** (resultado e oferta baseados em respostas)

---

## 🎉 CONCLUSÃO

A estrutura das **21 etapas** é **perfeitamente dividida e organizada** em:

1. **1 introdução** → Captura nome
2. **10 perguntas principais** → Identifica estilo (pontuação)
3. **1 transição** → Separa fases
4. **6 perguntas estratégicas** → Personaliza oferta
5. **1 transição** → Cria expectativa
6. **1 resultado** → Mostra estilo
7. **1 oferta** → Conversão

**Todos os componentes usam a MESMA estrutura** em edição, preview e produção! ✅
