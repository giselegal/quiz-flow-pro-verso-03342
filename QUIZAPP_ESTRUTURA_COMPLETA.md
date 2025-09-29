# 🎯 QUIZAPP & QUIZESTILOPESSOALPAGE - ESTRUTURA COMPLETA

## 📋 **VISÃO GERAL**

O sistema de Quiz é composto por dois componentes principais que trabalham em conjunto para fornecer uma experiência completa de descoberta de estilo pessoal:

- **`QuizApp.tsx`**: Componente principal que gerencia todo o fluxo do quiz
- **`QuizEstiloPessoalPage.tsx`**: Página wrapper que adiciona SEO, meta tags e analytics

---

## 🏗️ **ARQUITETURA DO QUIZAPP**

### **Componente Principal**
```typescript
export default function QuizApp({ funnelId }: QuizAppProps) {
  // Hook principal de estado
  const {
    state,
    currentStepData,
    progress,
    nextStep,
    setUserName,
    addAnswer,
    addStrategicAnswer,
    getOfferKey,
  } = useQuizState(funnelId);
}
```

### **Interface de Props**
```typescript
interface QuizAppProps {
  funnelId?: string;  // ID do funil para templates personalizados
}
```

---

## 🔄 **FLUXO DE NAVEGAÇÃO**

### **1. Estados do Quiz**
```typescript
// Tipos de etapa suportados
type StepType = 
  | 'intro'           // Etapa 1: Introdução e coleta do nome
  | 'question'        // Etapas 2-11: 10 perguntas principais
  | 'strategic-question' // Etapas 13-18: 6 perguntas estratégicas
  | 'transition'      // Etapas 12, 19: Transições
  | 'transition-result' // Transição para resultado
  | 'result'          // Etapa 20: Exibição do resultado
  | 'offer';          // Etapa 21: Oferta personalizada
```

### **2. Lógica de Renderização**
```typescript
// Renderização condicional baseada no tipo da etapa
{currentStepData.type === 'intro' && (
  <IntroStep
    data={currentStepData}
    onNameSubmit={(name: string) => {
      setUserName(name);
      nextStep();
    }}
  />
)}
```

---

## 🎯 **COMPONENTES DE ETAPA**

### **1. IntroStep (Etapa 1)**
```typescript
// Coleta do nome do usuário
<IntroStep
  data={currentStepData}
  onNameSubmit={(name: string) => {
    setUserName(name);
    nextStep();
  }}
/>
```

### **2. QuestionStep (Etapas 2-11)**
```typescript
// Perguntas principais com pontuação por estilo
<QuestionStep
  data={currentStepData}
  currentAnswers={state.answers[state.currentStep] || []}
  onAnswersChange={(answers: string[]) => {
    addAnswer(state.currentStep, answers);
    // Avanço automático após 1 segundo quando completo
    if (answers.length === currentStepData.requiredSelections) {
      setTimeout(() => nextStep(), 1000);
    }
  }}
/>
```

### **3. StrategicQuestionStep (Etapas 13-18)**
```typescript
// Perguntas estratégicas para personalização da oferta
<StrategicQuestionStep
  data={currentStepData}
  currentAnswer={state.answers[state.currentStep]?.[0] || ''}
  onAnswerChange={(answer: string) => {
    addAnswer(state.currentStep, [answer]);
    addStrategicAnswer(currentStepData.questionText!, answer);
    setTimeout(() => nextStep(), 500);
  }}
/>
```

### **4. TransitionStep (Etapas 12, 19)**
```typescript
// Transições entre seções
<TransitionStep
  data={currentStepData}
  onComplete={() => nextStep()}
/>
```

### **5. ResultStep (Etapa 20)**
```typescript
// Exibição do resultado personalizado
<ResultStep
  data={currentStepData}
  userProfile={state.userProfile}
  scores={state.scores}
/>
```

### **6. OfferStep (Etapa 21)**
```typescript
// Oferta personalizada baseada nas respostas estratégicas
<OfferStep
  data={currentStepData}
  userProfile={state.userProfile}
  offerKey={getOfferKey()}
/>
```

---

## 📊 **SISTEMA DE PROGRESSO**

### **Barra de Progresso**
```typescript
// Renderização condicional da barra de progresso
const showProgress = !['intro', 'transition', 'transition-result'].includes(currentStepData.type);

{showProgress && (
  <div className="mb-6 max-w-6xl mx-auto px-4 py-8">
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <p className="text-sm text-center mb-4">Progresso: {progress}%</p>
  </div>
)}
```

### **Cálculo de Progresso**
- **Total de etapas**: 21
- **Etapas com progresso**: 19 (excluindo intro e transições)
- **Fórmula**: `(etapaAtual / totalEtapas) * 100`

---

## 🎨 **SISTEMA DE DESIGN**

### **Paleta de Cores**
```css
/* Cores principais */
--primary-color: #deac6d;      /* Dourado principal */
--background-color: #fefefe;   /* Branco suave */
--text-color: #5b4135;        /* Marrom escuro */
--progress-bg: #gray-200;     /* Cinza claro para progresso */
```

### **Layout Responsivo**
```typescript
// Container principal
<div className="min-h-screen">
  <div className="quiz-container mx-auto">
    {/* Conteúdo do quiz */}
  </div>
</div>

// Container de conteúdo
<div className="max-w-6xl mx-auto px-4 py-8">
  {/* Componentes específicos */}
</div>
```

---

## 🔧 **HOOK DE ESTADO**

### **useQuizState Hook**
```typescript
const {
  state,                    // Estado completo do quiz
  currentStepData,         // Dados da etapa atual
  progress,                // Progresso percentual
  nextStep,                // Função para avançar
  setUserName,             // Função para definir nome
  addAnswer,               // Função para adicionar resposta
  addStrategicAnswer,      // Função para resposta estratégica
  getOfferKey,             // Função para obter chave da oferta
} = useQuizState(funnelId);
```

### **Estrutura do Estado**
```typescript
interface QuizState {
  currentStep: number;      // Etapa atual
  userName: string;         // Nome do usuário
  answers: Record<number, string[]>; // Respostas por etapa
  strategicAnswers: Record<string, string>; // Respostas estratégicas
  scores: Record<string, number>; // Pontuações por estilo
  userProfile: UserProfile; // Perfil calculado
}
```

---

## 🎯 **SISTEMA DE PONTUAÇÃO**

### **Estilos Disponíveis**
```typescript
type StyleType = 
  | 'natural'        // Natural e autêntico
  | 'classico'      // Clássico e elegante
  | 'contemporaneo' // Moderno e atual
  | 'elegante'      // Sofisticado e refinado
  | 'romantico'     // Delicado e suave
  | 'sexy'          // Sensual e sedutor
  | 'dramatico'     // Intenso e marcante
  | 'criativo';     // Artístico e expressivo
```

### **Cálculo de Pontuação**
- **Perguntas principais (2-11)**: Pontuação por estilo
- **Perguntas estratégicas (13-18)**: Personalização da oferta
- **Resultado**: Estilo dominante + secundários
- **Oferta**: Baseada nas respostas estratégicas

---

## 🚀 **QUIZESTILOPESSOALPAGE**

### **Componente Wrapper**
```typescript
export default function QuizEstiloPessoalPage({ funnelId }: QuizEstiloPessoalPageProps) {
  return (
    <div className="quiz-estilo-page">
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Descubra Seu Estilo Pessoal - Quiz Completo | Gisele Galvão</title>
        <meta name="description" content="..." />
        {/* Outras meta tags */}
      </Helmet>

      {/* Componente principal do quiz */}
      <main className="min-h-screen">
        <QuizApp funnelId={funnelId} />
      </main>

      {/* Scripts de analytics */}
      <script dangerouslySetInnerHTML={{ __html: `...` }} />
    </div>
  );
}
```

### **Interface de Props**
```typescript
interface QuizEstiloPessoalPageProps {
  funnelId?: string;  // ID do funil para templates personalizados
}
```

---

## 🔍 **SEO E META TAGS**

### **Meta Tags Principais**
```html
<title>Descubra Seu Estilo Pessoal - Quiz Completo | Gisele Galvão</title>
<meta name="description" content="Descubra seu estilo pessoal único com nosso quiz completo. Natural, Clássico, Contemporâneo, Elegante, Romântico, Sexy, Dramático ou Criativo? Faça o teste agora!" />
<meta name="keywords" content="estilo pessoal, moda, consultoria de imagem, Gisele Galvão, quiz de estilo" />
```

### **Open Graph Tags**
```html
<meta property="og:title" content="Descubra Seu Estilo Pessoal - Quiz Completo" />
<meta property="og:description" content="Quiz completo para descobrir seu estilo pessoal único. Receba dicas personalizadas e ofertas exclusivas." />
<meta property="og:type" content="website" />
```

### **Viewport e Responsividade**
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## 📈 **ANALYTICS E TRACKING**

### **Google Analytics Integration**
```javascript
// Tracking de início do quiz
if (typeof gtag !== 'undefined') {
  gtag('event', 'quiz_started', {
    event_category: 'engagement',
    event_label: 'quiz_estilo_pessoal'
  });
}
```

### **Eventos Rastreados**
- **quiz_started**: Início do quiz
- **quiz_completed**: Conclusão do quiz
- **quiz_abandoned**: Abandono do quiz
- **offer_viewed**: Visualização da oferta
- **offer_clicked**: Clique na oferta

---

## 🎯 **FUNCIONALIDADES PRINCIPAIS**

### **1. Sistema de 21 Etapas**
```typescript
// Mapeamento das etapas
const stepMapping = {
  1: 'intro',                    // Introdução
  2-11: 'question',              // 10 perguntas principais
  12: 'transition',              // Transição
  13-18: 'strategic-question',   // 6 perguntas estratégicas
  19: 'transition',              // Transição para resultado
  20: 'result',                  // Resultado
  21: 'offer'                    // Oferta
};
```

### **2. Avanço Automático**
```typescript
// Perguntas principais: 1 segundo após completar
if (answers.length === currentStepData.requiredSelections) {
  setTimeout(() => nextStep(), 1000);
}

// Perguntas estratégicas: 500ms após responder
setTimeout(() => nextStep(), 500);
```

### **3. Validação de Respostas**
```typescript
// Verificação de respostas obrigatórias
currentAnswers={state.answers[state.currentStep] || []}
requiredSelections={currentStepData.requiredSelections}
```

### **4. Cálculo de Resultado**
```typescript
// Resultado já é calculado automaticamente
// O cálculo ocorre em tempo real conforme o usuário responde
```

---

## 🔧 **CONFIGURAÇÕES AVANÇADAS**

### **Suporte a Templates Personalizados**
```typescript
// Via funnelId
<QuizApp funnelId={funnelId} />
<QuizEstiloPessoalPage funnelId={funnelId} />
```

### **Tratamento de Erros**
```typescript
// Fallback para etapa não encontrada
if (!currentStepData) {
  return (
    <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
      <div className="text-center text-red-500">
        Etapa não encontrada: {state.currentStep}
      </div>
    </div>
  );
}
```

### **Responsividade**
```css
/* Container responsivo */
.quiz-container {
  max-width: 6xl;  /* 1152px */
  margin: 0 auto;
  padding: 1rem;
}

/* Layout mobile-first */
@media (max-width: 768px) {
  .quiz-container {
    padding: 0.5rem;
  }
}
```

---

## 📊 **ESTRUTURA DE DADOS**

### **Estado do Quiz**
```typescript
interface QuizState {
  currentStep: number;                           // Etapa atual
  userName: string;                             // Nome do usuário
  answers: Record<number, string[]>;            // Respostas por etapa
  strategicAnswers: Record<string, string>;     // Respostas estratégicas
  scores: Record<string, number>;               // Pontuações por estilo
  userProfile: UserProfile;                     // Perfil calculado
}
```

### **Dados da Etapa**
```typescript
interface StepData {
  type: StepType;              // Tipo da etapa
  title?: string;              // Título da etapa
  questionText?: string;       // Texto da pergunta
  options?: QuizOption[];      // Opções de resposta
  requiredSelections?: number; // Número de seleções obrigatórias
  nextStep?: string;           // Próxima etapa
}
```

### **Perfil do Usuário**
```typescript
interface UserProfile {
  primaryStyle: string;        // Estilo principal
  secondaryStyles: string[];   // Estilos secundários
  scores: Record<string, number>; // Pontuações detalhadas
  offerKey: string;            // Chave da oferta personalizada
}
```

---

## 🎨 **SISTEMA DE ESTILOS**

### **Classes CSS Principais**
```css
/* Container principal */
.quiz-container {
  max-width: 6xl;
  margin: 0 auto;
}

/* Background e cores */
.bg-[#fefefe] { background-color: #fefefe; }
.text-[#5b4135] { color: #5b4135; }
.bg-[#deac6d] { background-color: #deac6d; }

/* Layout responsivo */
.min-h-screen { min-height: 100vh; }
.max-w-6xl { max-width: 72rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
```

### **Animações e Transições**
```css
/* Transição da barra de progresso */
.transition-all.duration-500 {
  transition: all 0.5s ease;
}

/* Hover effects */
.hover\:bg-[#deac6d]:hover {
  background-color: #deac6d;
}
```

---

## 🔄 **CICLO DE VIDA**

### **1. Inicialização**
```typescript
// Carregamento do hook de estado
const { state, currentStepData, progress, ... } = useQuizState(funnelId);
```

### **2. Renderização**
```typescript
// Verificação de dados
if (!currentStepData) {
  return <ErrorFallback />;
}

// Renderização condicional baseada no tipo
{currentStepData.type === 'intro' && <IntroStep />}
{currentStepData.type === 'question' && <QuestionStep />}
// ... outros tipos
```

### **3. Interação**
```typescript
// Coleta de respostas
onAnswersChange={(answers: string[]) => {
  addAnswer(state.currentStep, answers);
  // Avanço automático
  if (answers.length === currentStepData.requiredSelections) {
    setTimeout(() => nextStep(), 1000);
  }
}}
```

### **4. Navegação**
```typescript
// Avanço para próxima etapa
nextStep();

// Atualização de estado
setUserName(name);
addAnswer(step, answers);
addStrategicAnswer(question, answer);
```

---

## 🎯 **CASOS DE USO**

### **1. Quiz Padrão**
```typescript
// Uso básico sem funnelId
<QuizApp />
<QuizEstiloPessoalPage />
```

### **2. Quiz Personalizado**
```typescript
// Uso com template personalizado
<QuizApp funnelId="custom-template" />
<QuizEstiloPessoalPage funnelId="custom-template" />
```

### **3. Integração com Analytics**
```typescript
// Tracking automático via QuizEstiloPessoalPage
// Eventos: quiz_started, quiz_completed, offer_viewed
```

### **4. SEO Otimizado**
```typescript
// Meta tags automáticas via QuizEstiloPessoalPage
// Título, descrição, keywords, Open Graph
```

---

## 🔧 **CONFIGURAÇÕES**

### **Timing de Avanço**
```typescript
// Perguntas principais: 1000ms
setTimeout(() => nextStep(), 1000);

// Perguntas estratégicas: 500ms
setTimeout(() => nextStep(), 500);
```

### **Validação de Respostas**
```typescript
// Verificação de seleções obrigatórias
if (answers.length === currentStepData.requiredSelections) {
  // Avanço automático
}
```

### **Tratamento de Erros**
```typescript
// Fallback para etapa não encontrada
if (!currentStepData) {
  return <ErrorFallback />;
}
```

---

## 📈 **MÉTRICAS E MONITORAMENTO**

### **Logs de Sistema**
```typescript
console.log('Quiz Gisele Galvão - Página carregada');
```

### **Analytics Events**
```javascript
gtag('event', 'quiz_started', {
  event_category: 'engagement',
  event_label: 'quiz_estilo_pessoal'
});
```

### **Performance Tracking**
```typescript
// Carregamento otimizado com lazy loading
// Componentes carregados sob demanda
```

---

## 🎯 **CONCLUSÃO**

O sistema de Quiz é uma solução completa que:

1. **Gerencia 21 etapas** de forma fluida e intuitiva
2. **Calcula resultados** em tempo real
3. **Personaliza ofertas** baseadas nas respostas estratégicas
4. **Otimiza SEO** com meta tags apropriadas
5. **Rastreia analytics** para métricas de engajamento
6. **Suporta templates** personalizados via funnelId
7. **Mantém design** consistente com a marca
8. **Garante responsividade** em todos os dispositivos

É uma **solução robusta e escalável** para descoberta de estilo pessoal, integrando perfeitamente funcionalidade, design e analytics.
