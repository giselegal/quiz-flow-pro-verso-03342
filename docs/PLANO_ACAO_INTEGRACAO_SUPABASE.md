# Plano de Ação para Integração do Quiz com Supabase

## 1. Visão Geral do Plano

Este plano de ação tem como objetivo conectar a lógica de cálculo e o fluxo do quiz ao Supabase, garantindo persistência de dados completa e integração adequada. O sistema já possui uma estrutura pronta no Supabase e funções de serviço implementadas, porém falta a integração com a interface do usuário.

> **IMPORTANTE**: Este plano trabalhará especificamente com a estrutura de etapas configurada em `/editor-fixed` (que usa o componente `editor-fixed-dragdrop.tsx`), pois esta é a estrutura que será publicada. Todas as integrações e modificações devem ser compatíveis com esta estrutura.

## 2. Fases de Implementação

### Fase 1: Auditoria e Preparação (Dia 1)

- [x] Mapear componentes e suas responsabilidades
- [x] Identificar pontos de integração com Supabase
- [x] Documentar estrutura do projeto
- [ ] Preparar ambiente de desenvolvimento para testes

### Fase 2: Integração do Sistema de Usuários (Dia 2)

- [ ] Substituir mock de autenticação por chamadas reais ao Supabase
- [ ] Implementar gerenciamento de sessões de usuário
- [ ] Integrar hooks com quizSupabaseService

### Fase 3: Integração do Sistema de Respostas (Dia 3-4)

- [ ] Conectar componentes de perguntas às funções do Supabase
- [ ] Implementar salvamento de respostas em tempo real
- [ ] Rastrear progresso do usuário no quiz

### Fase 4: Integração do Sistema de Resultados (Dia 5)

- [ ] Conectar cálculo de resultados ao Supabase
- [ ] Implementar salvamento de resultados finais
- [ ] Criar sistema de consulta de resultados

### Fase 5: Testes e Otimizações (Dia 6-7)

- [ ] Testar fluxo completo do quiz com Supabase
- [ ] Otimizar performance e reduzir redundâncias
- [ ] Documentar implementação final

## 3. Tarefas Específicas

### 3.1. Modificações no QuizContext.tsx

```typescript
// Antes:
const startQuiz = async (name: string, email: string, quizId: string) => {
  try {
    console.log(`Starting quiz for ${name} (${email}) with quiz ID ${quizId}`);
    return { id: "1", name, email };
  } catch (error) {
    toast({
      title: "Erro ao iniciar o quiz",
      description: "Por favor, tente novamente.",
      variant: "destructive",
    });
    throw error;
  }
};

// Depois:
const startQuiz = async (name: string, email: string, quizId: string) => {
  try {
    // Criar usuário no Supabase
    const user = await quizSupabaseService.createQuizUser({
      name,
      email,
      utmSource: getUtmParameters().source,
      utmMedium: getUtmParameters().medium,
      utmCampaign: getUtmParameters().campaign,
    });

    // Criar sessão de quiz
    const session = await quizSupabaseService.createQuizSession({
      quizUserId: user.id,
      funnelId: quizId,
      totalSteps: 21,
      maxScore: 100,
    });

    console.log(`Quiz iniciado para ${name} (${email}) com ID ${session.id}`);
    return { id: session.id, name, email, sessionId: session.id };
  } catch (error) {
    toast({
      title: "Erro ao iniciar o quiz",
      description: "Por favor, tente novamente.",
      variant: "destructive",
    });
    throw error;
  }
};
```

### 3.2. Modificações no useQuizLogic.ts

```typescript
// Adicionar integração com Supabase
import { quizSupabaseService } from "@/services/quizSupabaseService";

// Modificar função de resposta
const answerQuestion = useCallback(
  async (questionId: string, optionId: string, sessionId: string) => {
    setAnswers(prevAnswers => {
      const newAnswer: QuizAnswer = {
        questionId,
        optionId,
      };
      return [...prevAnswers, newAnswer];
    });

    // Salvar resposta no Supabase
    if (sessionId) {
      try {
        const question = caktoquizQuestions.find((q: any) => q.id === questionId);
        const option = question?.options.find((opt: any) => opt.id === optionId);

        await quizSupabaseService.saveQuizResponse({
          sessionId,
          stepNumber: currentQuestionIndex + 1,
          questionId,
          questionText: question?.text,
          answerValue: optionId,
          answerText: option?.text,
          scoreEarned: option?.weight || 1,
        });

        // Atualizar sessão
        await quizSupabaseService.updateQuizSession(sessionId, {
          currentStep: currentQuestionIndex + 1,
          status: "in_progress",
        });
      } catch (error) {
        console.error("Erro ao salvar resposta:", error);
      }
    }
  },
  [currentQuestionIndex]
);
```

### 3.3. Modificações no Cálculo de Resultado

```typescript
// Modificar função de completar quiz
const completeQuiz = useCallback(
  async (sessionId: string) => {
    const calculatedResult = calculateResults(answers);
    setQuizResult(calculatedResult);
    setQuizCompleted(true);

    // Salvar resultado no Supabase
    if (sessionId) {
      try {
        // Marcar sessão como completa
        await quizSupabaseService.updateQuizSession(sessionId, {
          status: "completed",
          score: calculatedResult.primaryStyle.score,
          completedAt: new Date(),
        });

        // Salvar resultado detalhado
        await quizSupabaseService.saveQuizResult({
          sessionId,
          resultType: calculatedResult.primaryStyle.style,
          resultTitle: calculatedResult.primaryStyle.category,
          resultDescription: `Seu estilo predominante é ${calculatedResult.primaryStyle.category} com ${calculatedResult.primaryStyle.percentage}% de compatibilidade.`,
          resultData: {
            primaryStyle: calculatedResult.primaryStyle,
            secondaryStyles: calculatedResult.secondaryStyles,
            scores: calculatedResult.scores,
            totalQuestions: calculatedResult.totalQuestions,
          },
        });
      } catch (error) {
        console.error("Erro ao salvar resultado:", error);
      }
    }
  },
  [answers, calculateResults]
);
```

### 3.4. Modificações no CaktoQuizFlow.tsx

```typescript
// Adicionar gerenciamento de sessão
const [sessionId, setSessionId] = useState<string | null>(null);

// Modificar início do quiz
const startQuizFlow = async (name: string, email: string) => {
  try {
    const { id, sessionId } = await startQuiz(name, email, "quiz-style-test");
    setSessionId(sessionId);
    // Continuar fluxo
  } catch (error) {
    console.error("Erro ao iniciar quiz:", error);
  }
};

// Modificar resposta a pergunta
const handleAnswer = async (questionId: string, optionId: string) => {
  if (sessionId) {
    await answerQuestion(questionId, optionId, sessionId);
    // Atualizar UI
  }
};

// Modificar finalização
const finishQuiz = async () => {
  if (sessionId) {
    await completeQuiz(sessionId);
    // Navegar para resultados
  }
};
```

## 4. Execução do Plano

### Etapa 1: Criar Componente de Integração Supabase

1. Criar novo arquivo `useSupabaseQuiz.ts` que servirá como ponte entre os componentes e o Supabase
2. Implementar hooks para cada fase do quiz (início, respostas, finalização)
3. Integrar o hook em componentes existentes

### Etapa 2: Atualizar Componentes de UI

1. Modificar `QuizContext.tsx` para usar o serviço Supabase
2. Atualizar `CaktoQuizFlow.tsx` para gerenciar sessão Supabase
3. Ajustar `QuizResults.tsx` para exibir dados do Supabase

### Etapa 3: Implementar Rastreamento

1. Adicionar tracking de eventos com `quizSupabaseService.trackEvent()`
2. Monitorar conversões com `quizSupabaseService.recordConversion()`

### Etapa 4: Testes e Validação

1. Testar fluxo completo do quiz
2. Verificar persistência de dados no Supabase
3. Validar cálculo de resultados

## 5. Modelo de Dados em Memória Durante o Quiz

```typescript
// Modelo de sessão mantido em memória durante o quiz
interface QuizSession {
  id: string; // ID da sessão no Supabase
  userId: string; // ID do usuário no Supabase
  currentStep: number; // Etapa atual (1-21)
  responses: {
    // Respostas dadas
    questionId: string;
    optionId: string;
    stepNumber: number;
  }[];
  result?: {
    // Resultado (quando finalizado)
    primaryStyle: StyleResult;
    secondaryStyles: StyleResult[];
  };
}
```

## 6. Considerações de Implementação

- **Compatibilidade com versão offline**: Manter funcionamento mesmo sem conexão, sincronizando quando possível
- **Tratamento de erros**: Implementar sistema robusto de fallback e retry para falhas na API
- **Otimização de desempenho**: Minimizar chamadas ao Supabase e usar batch updates quando possível
- **Segurança**: Garantir que as chamadas estejam devidamente autenticadas e autorizadas
