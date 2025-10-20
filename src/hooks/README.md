# Hooks Unificados para Navegação de Quiz

Este módulo contém hooks React avançados para gerenciar progresso de usuário e navegação em quizzes/funnis.

## useQuizUserProgress

Hook responsável por rastrear e gerenciar o progresso do usuário em um quiz, incluindo respostas, pontuação e persistência.

### Características

- ✅ Rastreamento de respostas do usuário
- ✅ Cálculo automático de pontuação
- ✅ Persistência em localStorage (opcional)
- ✅ Possibilidade de sincronização com backend
- ✅ Tempos de início/fim e duração

### Uso Básico

```tsx
const { 
  // Estado
  progress, 
  totalPoints,
  answers,
  
  // Ações
  recordAnswer,
  resetProgress,
  completeQuiz,
  
  // Helpers
  getAnswerForStep,
  hasAnsweredStep,
  calculateCompletionPercentage,
} = useQuizUserProgress({
  funnelId: 'meu-funil-123',
  persistToLocalStorage: true,
  syncWithBackend: false,
});

// Registrar resposta para um step
recordAnswer(1, {
  questionId: 'pergunta-1',
  selectedOptions: [{ id: 'opcao-1', value: 'Resposta 1', points: 10 }],
});
```

## useUnifiedQuizNavigation

Hook para gerenciar navegação entre etapas de um quiz, com suporte para validação e regras condicionais.

### Características

- ✅ Navegação entre etapas (avançar/voltar)
- ✅ Validação de etapa atual
- ✅ Regras de navegação condicional
- ✅ Histórico de navegação
- ✅ Cálculo automático de progresso

### Uso Básico

```tsx
const {
  // Estado
  currentStepIndex,
  isFirstStep,
  isLastStep,
  canGoBack,
  canGoForward,
  completionPercentage,
  
  // Ações
  navigateToNextStep,
  navigateToPreviousStep,
  navigateToStep,
  setStepValidity,
} = useUnifiedQuizNavigation({
  funnelId: 'meu-funil-123',
  totalSteps: 5,
  initialStep: 0,
  rules: [
    {
      stepId: 2,
      condition: (answers) => answers.some(/* condição específica */),
      targetStepId: 4, // Pular para o passo 4 se condição for verdadeira
    }
  ],
  onStepChange: (stepIndex) => console.log(`Navegou para step ${stepIndex}`),
  onComplete: (answers) => console.log('Quiz finalizado!', answers),
});

// Marcar etapa atual como válida
setStepValidity(true);

// Navegar para próxima etapa
navigateToNextStep();
```

## Integração entre os hooks

Os hooks são projetados para trabalhar em conjunto. O `useUnifiedQuizNavigation` utiliza internamente o `useQuizUserProgress` para acessar o estado das respostas e aplicar regras de navegação condicional.

## Exemplo Completo

Veja um exemplo completo de implementação no arquivo:
`/src/examples/QuizWithUnifiedNavigation.tsx`