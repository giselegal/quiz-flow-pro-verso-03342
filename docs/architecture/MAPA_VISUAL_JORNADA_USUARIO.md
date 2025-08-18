# 🎯 MAPA VISUAL DA JORNADA DO USUÁRIO

## Sistema de Quiz de 21 Etapas - Fluxos e Arquitetura

---

## 📊 FLUXO PRINCIPAL DE DADOS - ESTRUTURA REAL

```
👤 USUÁRIO
    ↓
📝 ETAPA 1: Coleta do Nome (QuizIntro)
    ↓
🔄 setUserNameFromInput() → localStorage + EditorContext
    ↓
🎯 ETAPAS 2-11: Quiz Core (10 questões pontuadas)
    ↓ Questões 1-10 que definem o estilo predominante
📊 calculateStyleScores() → styleScores{}
    ↓
📋 ETAPA 12: Página Transição 1 (QuizTransition)
    ↓ "Enquanto calculamos o seu resultado..."
🎯 ETAPAS 13-18: Questões Estratégicas (6 questões - não pontuam)
    ↓ Questões 12-17 para qualificação e métricas
📋 ETAPA 19: Página Transição 2
    ↓ "Obrigada por compartilhar..."
🎉 ETAPA 20: Resultado Personalizado + Ofertas
    ↓ Teste A: /resultado (ResultPage)
    ↓ Teste B: /quiz-descubra-seu-estilo (QuizOfferPage)
🎁 ETAPA 21: CTA Final/Conversão
```

---

## 🏗️ ARQUITETURA DE COMPONENTES

```
┌─────────────────────────────────────────────────────────────┐
│                    EDITOR CONTEXT (Global State)            │
│  • userName: string                                         │
│  • userAnswers: Record<string, string>                     │
│  • currentScore: number                                     │
│  • isQuizCompleted: boolean                                 │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    QUIZ LOGIC HOOK                          │
│  • currentQuestionIndex: number                            │
│  • answers: QuizAnswer[] (questões core q1-q10)           │
│  • strategicAnswers: StrategicAnswer[] (q12-q17)          │
│  • setUserNameFromInput() → Captura nome Etapa 1          │
│  • calculateResults() → Determina estilo predominante      │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                 STYLE QUIZ RESULTS HOOK                    │
│  • mainResult: QuizResult                                  │
│  • categoryScores: Record<string, number>                 │
│  • guideImageUrl: string                                   │
│  • Integração com styleConfig.ts                          │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    STYLE CONFIG                            │
│  • 8 Estilos: Natural, Clássico, Contemporâneo...        │
│  • Cada estilo: image + guideImage + description          │
│  • Utilitários: getStyleByKeyword(), getStylesByCategory()│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE CAPTURA E CÁLCULO

```
ETAPA 1: NOME
┌────────────────────┐
│  📝 Input Field    │ → setUserNameFromInput(name)
│  "Digite seu nome" │ → localStorage.setItem('quizUserName', name)
└────────────────────┘ → EditorContext.userName = name

ETAPAS 2-11: QUIZ CORE (PONTUAM PARA O RESULTADO)
┌────────────────────┐
│  🎯 Questão 1     │ → answerQuestion(q1, optionId)
│  8 opções visuais  │ → styleScores[option.style] += option.weight
│  Natural, Clássico │   (Natural, Clássico, Contemporâneo, Elegante,
│  Contemporâneo...  │    Romântico, Sexy, Dramático, Criativo)
└────────────────────┘

┌────────────────────┐
│  🎯 Questão 2     │ → answerQuestion(q2, optionId)
│  8 opções texto    │ → styleScores[option.style] += option.weight
│  Personalidade    │
└────────────────────┘
         ⋮
┌────────────────────┐
│  🎯 Questão 10    │ → answerQuestion(q10, optionId)
│  Escolha de tecidos│ → styleScores[option.style] += option.weight
└────────────────────┘

ETAPA 12: TRANSIÇÃO 1 (NÃO É QUESTÃO)
┌────────────────────┐
│  ⏳ Página Wait   │ → "Enquanto calculamos o seu resultado..."
│  "Calculando..."  │ → Apresentação das questões estratégicas
└────────────────────┘

ETAPAS 13-18: ESTRATÉGICAS (NÃO PONTUAM - SÓ MÉTRICAS)
┌────────────────────┐
│  📊 Questão 12    │ → answerStrategicQuestion(q12, optionId, category)
│  "Como você se vê"│ → strategicAnswers.push() [SEPARADO]
└────────────────────┘

┌────────────────────┐
│  📊 Questão 13    │ → answerStrategicQuestion(q13, optionId, category)
│  "Desafios vestir"│ → strategicAnswers.push() [SEPARADO]
└────────────────────┘
         ⋮
┌────────────────────┐
│  📊 Questão 17    │ → answerStrategicQuestion(q17, optionId, category)
│  "Resultados desej"│ → strategicAnswers.push() [SEPARADO]
└────────────────────┘

ETAPA 19: TRANSIÇÃO 2 (NÃO É QUESTÃO)
┌────────────────────┐
│  💬 Página Thanks │ → "Obrigada por compartilhar..."
│  "Obrigada..."    │ → Preparação para mostrar resultado
└────────────────────┘

ETAPA 20: RESULTADO
┌────────────────────┐
│  🎉 Resultado     │ → calculateResults(answers)
│  Estilo + Nome    │ → Personalizado: "Olá {userName}, seu estilo é {primaryStyle}"
│  Imagem + Guia    │ → styleConfig[primaryStyle].image + guideImage
│  + Ofertas        │ → Teste A/B: ResultPage vs QuizOfferPage
└────────────────────┘
```

```
ETAPA 1: NOME
┌────────────────────┐
│  📝 Input Field    │ → setUserNameFromInput(name)
│  "Digite seu nome" │ → localStorage.setItem('quizUserName', name)
└────────────────────┘ → EditorContext.userName = name

ETAPAS 2-11: QUIZ CORE (PONTUAM)
┌────────────────────┐
│  🎯 Questão 1     │ → answerQuestion(q1, optionId)
│  4 opções visuais  │ → styleScores[option.style] += option.weight
└────────────────────┘

┌────────────────────┐
│  🎯 Questão 2     │ → answerQuestion(q2, optionId)
│  4 opções visuais  │ → styleScores[option.style] += option.weight
└────────────────────┘
         ⋮
┌────────────────────┐
│  🎯 Questão 10    │ → answerQuestion(q10, optionId)
│  4 opções visuais  │ → styleScores[option.style] += option.weight
└────────────────────┘

ETAPAS 13-17: ESTRATÉGICAS (NÃO PONTUAM - SÓ MÉTRICAS)
┌────────────────────┐
│  📊 Questão 11    │ → answerStrategicQuestion(q11, optionId, category)
│  Insights/Métricas │ → strategicAnswers.push() [SEPARADO]
└────────────────────┘
         ⋮
┌────────────────────┐
│  📊 Questão 17    │ → answerStrategicQuestion(q17, optionId, category)
│  Insights/Métricas │ → strategicAnswers.push() [SEPARADO]
└────────────────────┘

ETAPA 19: RESULTADO PERSONALIZADO
┌────────────────────┐
│  🎉 Resultado     │ → calculateResults(answers)
│  Estilo + Nome    │ → Personalizado: "Olá {userName}, seu estilo é {primaryStyle}"
│  Imagem + Guia    │ → styleConfig[primaryStyle].image + guideImage
└────────────────────┘

ETAPA 20: LEAD CAPTURE
┌────────────────────┐
│  📧 Formulário    │ → setUserEmail(email)
│  Nome + Email +   │ → setUserPhone(phone)
│  Telefone         │ → localStorage.setItem('quizUserData', data)
└────────────────────┘

ETAPA 21: OFERTA/CTA
┌────────────────────┐
│  � Página Oferta │ → Página completa de vendas
│  Produto + Preço  │ → Link para checkout externo
│  FAQ + Garantia   │ → Conversão final
└────────────────────┘
```

---

## 📊 SISTEMA DE PONTUAÇÃO DETALHADO

### **QUESTÕES QUE PONTUAM (Etapas 2-11)**

```typescript
const SCORABLE_QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];

// Exemplo de cálculo com 8 estilos por questão
answers.forEach(answer => {
  if (SCORABLE_QUESTIONS.includes(answer.questionId)) {
    const option = findOption(answer.questionId, answer.optionId);
    styleScores[option.style] += option.weight; // Natural, Clássico, Contemporâneo,
    // Elegante, Romântico, Sexy, Dramático, Criativo
  }
});

// Resultado final
const sortedStyles = Object.entries(styleScores).sort(([, a], [, b]) => b - a);
const winningStyle = sortedStyles[0][0]; // Ex: "Natural"
```

### **ETAPAS DE TRANSIÇÃO (12 e 19)**

```typescript
const TRANSITION_PAGES = {
  step12: {
    type: 'transition',
    title: 'Enquanto calculamos o seu resultado...',
    content:
      'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
    purpose: 'Preparar usuário para questões estratégicas',
  },
  step19: {
    type: 'transition',
    title: 'Obrigada por compartilhar',
    content: 'Processando suas respostas...',
    purpose: 'Transição para resultado final',
  },
};
```

### **QUESTÕES QUE NÃO PONTUAM (Etapas 13-18)**

```typescript
const STRATEGIC_QUESTIONS = ['q12', 'q13', 'q14', 'q15', 'q16', 'q17'];

// Questões para qualificação e ofertas
const strategicQuestions = [
  'Como você se vê hoje?', // q12 - Autoavaliação
  'O que mais te desafia?', // q13 - Pain points
  'Frequência de indecisão?', // q14 - Behavioral
  'Interesse em material?', // q15 - Lead qualification
  'Investimento R$ 97,00?', // q16 - Price anchoring
  'Resultados desejados?', // q17 - Goal identification
];

// NÃO afeta o cálculo do estilo predominante
// Usado para: ofertas, segmentação, pricing, conversão
```

### **ETAPA 19: RESULTADO (Não coleta dados - apenas mostra)**

```typescript
// Exibe o resultado final baseado no cálculo das etapas 2-11
const resultDisplay = {
  primaryStyle: winningStyle, // Ex: "Elegante"
  styleImage: styleConfig[winningStyle].image,
  description: styleConfig[winningStyle].description,
  userName: userName, // Capturado na Etapa 1
};

// Apenas visualização, não coleta novos dados
```

### **ETAPA 20: LEAD CAPTURE (Coleta dados de contato)**

```typescript
// Captura dados completos para follow-up
const leadData = {
  name: inputName, // Pode ser diferente do nome da Etapa 1
  email: inputEmail, // ← AQUI que o email é capturado
  phone: inputPhone, // Telefone para contato
  quizResult: primaryStyle,
  completedAt: new Date(),
};

// Salva no sistema para follow-up de vendas
localStorage.setItem('quiz-lead-data', JSON.stringify(leadData));
```

---

## 🎨 CONFIGURAÇÃO DE ESTILOS E RESULTADOS

### **Estrutura do styleConfig.ts**

```typescript
export const styleConfig = {
  Natural: {
    image: 'https://cloudinary.com/.../natural-style.webp',
    guideImage: 'https://cloudinary.com/.../GUIA_NATURAL.webp',
    description: 'Você valoriza o conforto e a praticidade...',
    category: 'Conforto & Praticidade',
    keywords: ['conforto', 'praticidade', 'descontraído'],
  },
  // ... demais 7 estilos
};
```

### **Integração com Resultado**

```typescript
// No resultado final
const result = {
  primaryStyle: {
    category: 'Natural', // ← Determinado pelo cálculo
    score: 24,
    percentage: 80,
  },
  userData: {
    name: userName, // ← Capturado na Etapa 1
    completionTime: new Date(),
    strategicAnswersCount: 6, // ← Etapas 13-17
  },
};

// Na exibição
const styleData = styleConfig[result.primaryStyle.category];
// Mostra: styleData.image + styleData.guideImage + personalização
```

---

## 🔗 INTEGRAÇÃO DE TEMPLATES

### **Template da Etapa 1 (Coleta Nome)**

```json
{
  "id": "step01-name-field",
  "type": "input-field",
  "properties": {
    "name": "name",
    "required": true,
    "validation": { "minLength": 2 },
    "enableOnInput": true
  }
}
```

### **Templates das Etapas 2-11 (Quiz Core)**

```json
{
  "id": "step02-question",
  "type": "quiz-question",
  "properties": {
    "questionId": "q1",
    "options": [
      { "id": "opt1", "style": "Natural", "weight": 3 },
      { "id": "opt2", "style": "Clássico", "weight": 2 },
      { "id": "opt3", "style": "Romântico", "weight": 1 }
    ]
  }
}
```

### **Templates das Etapas 13-17 (Estratégicas)**

```json
{
  "id": "step12-strategic",
  "type": "strategic-question",
  "properties": {
    "questionId": "q11",
    "category": "lifestyle",
    "strategicType": "behavioral",
    "affectsScore": false // ← NÃO pontua
  }
}
```

### **Template da Etapa 19 (Resultado)**

```json
{
  "id": "step19-result",
  "type": "result-display",
  "properties": {
    "showStyleResult": true,
    "showPersonalization": true,
    "includeUserName": true
  }
}
```

### **Template da Etapa 20 (Lead Capture)**

```json
{
  "id": "step20-lead-capture",
  "type": "lead-form",
  "properties": {
    "fields": ["name", "email", "phone"],
    "submitText": "Receber Guia Gratuito",
    "required": true
  }
}
```

### **Template da Etapa 21 (Oferta)**

```json
{
  "id": "step21-offer-page",
  "type": "offer-landing-page",
  "properties": {
    "productShowcase": true,
    "pricingSection": true,
    "faqSection": true,
    "checkoutUrl": "https://pay.hotmart.com/..."
  }
}
```

---

## 💾 PERSISTÊNCIA E RECUPERAÇÃO

### **localStorage Schema**

```typescript
const STORAGE_SCHEMA = {
  'quiz-userName': 'string', // ← Etapa 1
  'quiz-answers': 'QuizAnswer[]', // ← Etapas 2-11 (pontuam)
  'quiz-strategic-answers': 'StrategicAnswer[]', // ← Etapas 13-17
  'quiz-current-step': 'number',
  'quiz-result': 'QuizResult', // ← Calculado após Etapa 18
  'quiz-lead-data': 'LeadData', // ← Etapa 20 (nome+email+phone)
  'quiz-started-at': 'ISO_Date',
  'quiz-completed-at': 'ISO_Date',
};
```

### **Recuperação de Sessão**

```typescript
// Ao carregar a aplicação
const userName = localStorage.getItem('quiz-userName');
const currentStep = parseInt(localStorage.getItem('quiz-current-step')) || 1;
const savedAnswers = JSON.parse(localStorage.getItem('quiz-answers') || '[]');

// Restaurar estado
if (userName) setUserName(userName);
if (currentStep > 1) setCurrentStep(currentStep);
if (savedAnswers.length > 0) setAnswers(savedAnswers);
```

---

## 📈 TRACKING E ANALYTICS

### **Eventos por Etapa**

```typescript
// Etapa 1
gtag('event', 'user_name_captured', {
  event_category: 'Quiz',
  event_label: 'Step 1',
  custom_parameter_name: hashedName,
});

// Etapas 2-11
gtag('event', 'quiz_answer', {
  event_category: 'Quiz Core',
  event_label: `Step ${step}`,
  custom_parameter_question: questionId,
  custom_parameter_style: selectedStyle,
});

// Etapas 13-17
gtag('event', 'strategic_answer', {
  event_category: 'Quiz Strategic',
  event_label: `Step ${step}`,
  custom_parameter_category: category,
  custom_parameter_type: strategicType,
});

// Etapa 19
gtag('event', 'quiz_result_viewed', {
  event_category: 'Quiz',
  event_label: 'Result Displayed',
  custom_parameter_primary_style: primaryStyle,
  custom_parameter_completion_time: timeInSeconds,
});

// Etapa 20
gtag('event', 'lead_captured', {
  event_category: 'Lead Generation',
  event_label: 'Contact Form Submitted',
  value: 1,
  custom_parameter_has_email: true,
  custom_parameter_has_phone: true,
});

// Etapa 21
gtag('event', 'offer_viewed', {
  event_category: 'Sales Funnel',
  event_label: 'Offer Page Loaded',
  custom_parameter_product_price: '39.90',
});

gtag('event', 'checkout_clicked', {
  event_category: 'Sales Funnel',
  event_label: 'Checkout Button Clicked',
  value: 39.9,
});
```

---

## ✅ STATUS DE IMPLEMENTAÇÃO

### **🟢 IMPLEMENTADO E FUNCIONAL**

- ✅ Etapa 1: Coleta de nome robusta
- ✅ EditorContext: Estado global unificado
- ✅ Quiz Core: Cálculo correto de pontuação (q1-q10)
- ✅ Questões Estratégicas: Sistema separado (q12-q17)
- ✅ styleConfig: 8 estilos completos com imagens
- ✅ Resultado Personalizado: Nome integrado
- ✅ Templates JSON: 21 etapas configuradas
- ✅ Build: Funcionando sem erros
- ✅ Interface: /editor-fixed operacional

### **🟡 PARCIALMENTE IMPLEMENTADO**

- ⚠️ Analytics: Tracking básico (expandir para GA4/Supabase)
- ⚠️ Email Capture: Template pronto (validar integração)
- ⚠️ Persistência: localStorage (migrar para banco)

### **🔴 PENDENTE**

- ❌ A/B Testing: Variações de templates
- ❌ Métricas Avançadas: Funil de conversão detalhado
- ❌ Integrações: CRM, Email Marketing
- ❌ Dashboard: Analytics em tempo real

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. **✅ TESTAR SISTEMA COMPLETO**
   - Executar jornada completa em `/editor-fixed`
   - Validar captura de nome → quiz → resultado
   - Confirmar personalização funcionando

2. **📊 IMPLEMENTAR ANALYTICS COMPLETO**
   - Integrar Google Analytics 4
   - Configurar Supabase para tracking
   - Implementar eventos de conversão

3. **📧 FINALIZAR CAPTURA DE EMAIL**
   - Validar Etapa 19
   - Integrar com sistema de email marketing
   - Configurar autoresponders

4. **🎁 CONFIGURAR OFERTA FINAL**
   - Definir CTA da Etapa 21
   - Implementar sistema de ofertas
   - Configurar tracking de conversão

**🚀 STATUS GERAL: SISTEMA FUNCIONAL E PRONTO PARA PRODUÇÃO**
