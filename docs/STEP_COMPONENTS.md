# 📦 Componentes de Step Modulares

Cada step do quiz possui um componente independente e reutilizável.

## 🏗️ Arquitetura

```
Editor → UnifiedStepRenderer → StepDataAdapter → Componente de Step
                                      ↓
                              Dados Normalizados
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    │                                   │
            IntroStep                           QuestionStep
         StrategicQuestionStep              TransitionStep
                ResultStep                    OfferStep
```

---

## 📋 Componentes Disponíveis

### 1. IntroStep

**Tipo:** `intro`  
**Arquivo:** `src/components/quiz/IntroStep.tsx`  
**Propósito:** Página de boas-vindas e captura do nome do usuário

#### Props
```typescript
interface IntroStepProps {
  data: {
    title: string;           // Título principal
    formQuestion: string;    // Pergunta do formulário
    placeholder: string;     // Placeholder do input
    buttonText: string;      // Texto do botão
    image?: string;          // Imagem de fundo
  };
  onNameSubmit: (name: string) => void;
}
```

#### Exemplo de Uso
```tsx
<IntroStep 
  data={{
    title: "Bem-vindo ao Quiz de Estilo",
    formQuestion: "Como posso te chamar?",
    placeholder: "Digite seu primeiro nome",
    buttonText: "Começar",
    image: "https://..."
  }}
  onNameSubmit={(name) => console.log('Nome:', name)}
/>
```

#### Defaults (StepDataAdapter)
- `title`: "Bem-vindo ao Quiz de Estilo"
- `formQuestion`: "Como posso te chamar?"
- `placeholder`: "Digite seu primeiro nome aqui..."
- `buttonText`: "Começar Quiz"

---

### 2. QuestionStep

**Tipo:** `question`  
**Arquivo:** `src/components/quiz/QuestionStep.tsx`  
**Propósito:** Perguntas pontuadas (steps 2-11)

#### Props
```typescript
interface QuestionStepProps {
  data: {
    questionNumber: string;      // Ex: "1 de 10"
    questionText: string;        // Texto da pergunta
    requiredSelections: number;  // Número mínimo de seleções
    options: Array<{
      id: string;
      text: string;
      image?: string;
    }>;
  };
  currentAnswers: string[];
  onAnswersChange: (answers: string[]) => void;
}
```

#### Exemplo de Uso
```tsx
<QuestionStep 
  data={{
    questionNumber: "1 de 10",
    questionText: "QUAL SEU TIPO DE ROUPA FAVORITA?",
    requiredSelections: 3,
    options: [
      { id: 'natural', text: 'Conforto e praticidade', image: '...' },
      { id: 'classico', text: 'Discrição e elegância', image: '...' }
    ]
  }}
  currentAnswers={['natural']}
  onAnswersChange={(answers) => console.log('Selecionadas:', answers)}
/>
```

#### Defaults
- `questionNumber`: "1 de 10"
- `questionText`: "Selecione suas preferências"
- `requiredSelections`: 3
- `options`: []

---

### 3. StrategicQuestionStep

**Tipo:** `strategic-question`  
**Arquivo:** `src/components/quiz/StrategicQuestionStep.tsx`  
**Propósito:** Perguntas estratégicas de segmentação (steps 13-18)

#### Props
```typescript
interface StrategicQuestionStepProps {
  data: {
    questionNumber: string;      // Ex: "1 de 6"
    questionText: string;
    requiredSelections: 1;       // Sempre 1 (escolha única)
    options: Array<{
      id: string;
      text: string;
      image?: string;
    }>;
  };
  currentAnswer: string | null;
  onAnswerChange: (answer: string) => void;
}
```

#### Exemplo de Uso
```tsx
<StrategicQuestionStep 
  data={{
    questionNumber: "1 de 6",
    questionText: "QUAL SUA FAIXA DE INVESTIMENTO?",
    requiredSelections: 1,
    options: [
      { id: 'ate-500', text: 'Até R$ 500', image: '...' },
      { id: 'ate-1000', text: 'Até R$ 1.000', image: '...' }
    ]
  }}
  currentAnswer={null}
  onAnswerChange={(answer) => console.log('Resposta:', answer)}
/>
```

#### Defaults
- `questionNumber`: "1 de 6"
- `questionText`: "Selecione uma opção"
- `requiredSelections`: 1
- `options`: []

---

### 4. TransitionStep

**Tipo:** `transition` ou `transition-result`  
**Arquivo:** `src/components/quiz/TransitionStep.tsx`  
**Propósito:** Páginas de transição com animação (steps 12, 19)

#### Props
```typescript
interface TransitionStepProps {
  data: {
    title: string;
    text: string;
    duration?: number;             // ms até auto-advance
    showContinueButton?: boolean;  // Mostrar botão manual
    continueButtonText?: string;
  };
  onComplete: () => void;
}
```

#### Exemplo de Uso
```tsx
<TransitionStep 
  data={{
    title: "Calculando seu resultado...",
    text: "Aguarde enquanto analisamos suas respostas",
    duration: 3000,
    showContinueButton: false
  }}
  onComplete={() => console.log('Transição completa')}
/>
```

#### Defaults
- `title`: "Calculando seu resultado..."
- `text`: "Aguarde enquanto analisamos suas respostas"
- `duration`: 3000
- `showContinueButton`: false

---

### 5. ResultStep

**Tipo:** `result`  
**Arquivo:** `src/components/quiz/ResultStep.tsx`  
**Propósito:** Exibição do resultado do quiz (step 20)

#### Props
```typescript
interface ResultStepProps {
  data: {
    title: string;
    text: string;
    // Dados de resultado calculados dinamicamente
  };
  onNext: () => void;
}
```

#### Exemplo de Uso
```tsx
<ResultStep 
  data={{
    title: "Seu Estilo Predominante",
    text: "Descubra sua essência"
  }}
  onNext={() => console.log('Ver oferta')}
/>
```

#### Defaults
- `title`: "Seu Estilo Predominante"
- `text`: "Descubra sua essência"

---

### 6. OfferStep

**Tipo:** `offer`  
**Arquivo:** `src/components/quiz/OfferStep.tsx`  
**Propósito:** Página de oferta personalizada (step 21)

#### Props
```typescript
interface OfferStepProps {
  data: {
    title: string;
    text: string;
    buttonText: string;
    offerMap: Record<string, OfferContent>;
  };
  onAccept: () => void;
}
```

#### Exemplo de Uso
```tsx
<OfferStep 
  data={{
    title: "Transforme Seu Estilo Hoje",
    text: "Oferta especial personalizada",
    buttonText: "Quero Conhecer",
    offerMap: {
      'ate-500': { title: '...', description: '...', buttonText: '...' }
    }
  }}
  onAccept={() => console.log('Oferta aceita')}
/>
```

#### Defaults
- `title`: "Transforme Seu Estilo Hoje"
- `text`: "Oferta especial personalizada"
- `buttonText`: "Quero Conhecer"
- `offerMap`: {}

---

## 🔄 StepDataAdapter

**Arquivo:** `src/utils/StepDataAdapter.ts`

### Função Principal

```typescript
adaptStepData(editableStep: EditableQuizStep): QuizStep
```

### Fluxo de Normalização

1. **Extração de Metadata**: Lê `metadata`, `settings`, `properties`
2. **Busca de Dados de Produção**: Consulta `quizSteps.ts` (QUIZ_STEPS)
3. **Merge com Fallbacks**: `metadata > production > defaults`
4. **Validação**: Garante integridade dos dados
5. **Retorno**: QuizStep normalizado e pronto para uso

### Helpers Disponíveis

```typescript
// Extrai número do step do ID
extractStepNumber(stepId: string): number

// Infere tipo do step baseado no número
inferStepType(stepNumber: number): StepType

// Verifica se step precisa de respostas
requiresAnswers(stepType: StepType): boolean

// Verifica se step pode avançar automaticamente
canAutoAdvance(stepType: StepType): boolean
```

### Validações Automáticas

- **intro**: Valida `formQuestion`, `buttonText`
- **question/strategic-question**: Valida `questionText`, `options`, `requiredSelections`
- **transition**: Valida `title` ou `text`
- **result**: Valida `title`
- **offer**: Valida `buttonText`

---

## 🚀 Performance

### Lazy Loading
Todos os componentes são carregados sob demanda:

```typescript
const IntroStep = lazy(() => import('@/components/quiz/IntroStep'));
```

### Memoização
UnifiedStepRenderer é memoizado para evitar re-renders:

```typescript
export const UnifiedStepRenderer = memo(UnifiedStepRendererComponent);
```

### Suspense Boundaries
Loading fallback durante carregamento de componentes:

```tsx
<Suspense fallback={<StepLoadingFallback />}>
  {renderStepComponent()}
</Suspense>
```

---

## 📊 Testes Recomendados

### Teste Manual por Step

- [ ] **IntroStep**: Nome capturado corretamente
- [ ] **QuestionStep**: Seleção múltipla funciona
- [ ] **StrategicQuestionStep**: Seleção única funciona
- [ ] **TransitionStep**: Auto-advance após `duration`
- [ ] **ResultStep**: Resultado exibido corretamente
- [ ] **OfferStep**: CTA funcional

### Teste de Fallbacks

- [ ] Step sem `metadata` → Usa defaults
- [ ] Step com dados parciais → Completa com defaults
- [ ] Step com `options: []` → Log de warning

### Teste Edit vs Preview

- [ ] **Edit Mode**: Overlay visível, sem interatividade
- [ ] **Preview Mode**: Totalmente interativo

---

## 🔧 Troubleshooting

### "Step não renderiza nada"
- ✅ Verificar se `stepData` tem valores válidos
- ✅ Checar console para warnings de validação
- ✅ Confirmar que `QUIZ_STEPS` tem dados do step

### "Opções não aparecem"
- ✅ Verificar se `options` está populado
- ✅ Checar se `metadata.options` ou `productionData.options` existem
- ✅ Confirmar que array não está vazio

### "Transição não avança automaticamente"
- ✅ Verificar se `duration` está definido
- ✅ Checar se `onComplete` está sendo chamado
- ✅ Confirmar que não há overlay bloqueando em preview mode

---

## 📚 Recursos

- **Código Fonte**: `src/components/quiz/`
- **Adapter**: `src/utils/StepDataAdapter.ts`
- **Renderer**: `src/components/editor/quiz/components/UnifiedStepRenderer.tsx`
- **Dados de Produção**: `src/data/quizSteps.ts`
- **Templates**: `src/templates/quiz21StepsComplete.ts`

---

## 🎯 Próximos Passos

1. ✅ Adicionar testes unitários para StepDataAdapter
2. ✅ Criar Storybook stories para cada componente
3. ✅ Implementar validação com Zod schemas
4. ✅ Adicionar analytics tracking por step
5. ✅ Documentar padrões de estilo (CSS/Tailwind)
