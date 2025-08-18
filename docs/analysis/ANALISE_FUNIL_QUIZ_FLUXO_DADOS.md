# Análise do Funil de Quiz e Flu### 2.2 Captura das Respostas (Etapas 2-12 e 14-19)

- As perguntas são exibidas usando `QuizOptionsGridBlock` e `QuizMultipleChoiceBlock`
- Cada resposta (botão clicado) é:
  1. Registrada na interface via componente `QuizQuestion`
  2. Armazenada no estado local como `QuizAnswer` (questionId, optionId)
  3. Enviada ao Supabase via `quizSupabaseService.saveQuizResponse()`
  4. Armazenada na tabela `quiz_responses`
  5. **CRÍTICO**: Estas respostas são fundamentais para o cálculo do resultadodos

## 1. Estrutura do Funil de Quiz

O funil de quiz é composto por 21 etapas definidas no `StepsContext.tsx`, cada uma com um propósito específico:

### 1.1 Tipos de Etapas

- **Etapa 1**: Introdução ao quiz e coleta do nome do usuário (tipo "intro")
- **Etapas 2-12**: Perguntas do quiz (tipo "question") - Respostas das questões
- **Etapa 13**: Transição (tipo "transition")
- **Etapas 14-19**: Perguntas estratégicas (tipo "strategic")
- **Etapa 20**: Página de resultado (tipo "result")
- **Etapa 21**: Página de oferta (tipo "offer")

### 1.2 Componentes Principais

- `FunnelStagesPanel.tsx`: Painel lateral que mostra todas as etapas do funil
- `StepsContext.tsx`: Gerencia a navegação entre etapas e a estrutura do funil
- `EditorContext.tsx`: Gerencia os blocos de cada etapa no editor visual
- `useSupabaseQuiz.ts`: Hook de conexão com o Supabase para salvar respostas

## 2. Fluxo de Dados do Usuário

### 2.1 Captura do Nome (Etapa 1)

- O componente `FormInputBlock` captura o nome do usuário na etapa introdutória
- Esse dado é armazenado em:
  - Estado local via `useSupabaseQuiz`
  - Tabela `quiz_users` no Supabase através da função `quizSupabaseService.createQuizUser()`
  - **CRÍTICO**: Este é um dos dados mais importantes para todo o fluxo subsequente

### 2.2 Captura das Respostas (Etapas 3-12 e 14-19)

- As perguntas são exibidas usando `QuizOptionsGridBlock` e `QuizMultipleChoiceBlock`
- Cada resposta é:
  1. Registrada na interface via componente `QuizQuestion`
  2. Armazenada no estado local como `QuizAnswer` (questionId, optionId)
  3. Enviada ao Supabase via `quizSupabaseService.saveQuizResponse()`
  4. Armazenada na tabela `quiz_responses`

### 2.3 Cálculo do Resultado (Transição para Etapa 20)

- Quando todas as perguntas são respondidas, o resultado é calculado usando:
  - Função `calculateQuizResult()` no arquivo `quizEngine.ts`
  - Esse cálculo processa as respostas (`QuizAnswer[]`) para determinar o estilo predominante
  - O resultado é salvo no Supabase com `quizSupabaseService.saveQuizResult()`
  - O resultado é armazenado na tabela `quiz_results`

## 3. Componentes de Resultados (Etapas 20 e 21)

### 3.1 Etapa 20 - Página de Resultado

- Usa o componente `QuizResultsBlock` e `StyleResultsBlock`
- Exibe o estilo predominante do usuário com base no resultado calculado
- Recupera os dados através de:
  - Estado local via `useSupabaseQuiz.session.result`
  - Ou diretamente do Supabase com `quizSupabaseService.getQuizResult()`
- **CRÍTICO**: Contém CTAs importantes cuja interação deve ser rastreada

### 3.2 Etapa 21 - Página de Oferta

- Usa o componente `FinalStepEditor`
- Apresenta uma oferta personalizada com base no resultado calculado
- Usa `StyleResultsEditor` para mostrar informações do estilo predominante
- Conecta-se ao Supabase para registrar interações e conversões
- **CRÍTICO**: Contém CTAs de conversão que precisam ser monitorados

## 4. Integração com Supabase

### 4.1 Serviço de Conexão

- `quizSupabaseService.ts`: Fornece todas as funções de integração com o banco
- `useSupabaseQuiz.ts`: Hook que simplifica o uso do serviço nos componentes React
- **NOVO NECESSÁRIO**: Adicionar funções para rastreamento de CTAs e jornada do usuário

### 4.2 Fluxo de Dados para Supabase

1. **Criação de Usuário**:

   ```typescript
   const user = await quizSupabaseService.createQuizUser({
     name: userData.name,
     email: userData.email,
     utmSource: utmParams.source,
     // outros dados
   });
   ```

2. **Criação de Sessão**:

   ```typescript
   const quizSession = await quizSupabaseService.createQuizSession({
     funnelId: userData.quizId,
     quizUserId: user.id,
     totalSteps: questions.length,
     // outros dados
   });
   ```

3. **Salvamento de Respostas**:

   ```typescript
   await quizSupabaseService.saveQuizResponse({
     sessionId: session.id,
     stepNumber: session.currentStep + 1,
     questionId,
     questionText: question.text || question.question,
     answerValue: optionId,
     // outros dados
   });
   ```

4. **Salvamento de Resultado**:
   ```typescript
   const resultId = await quizSupabaseService.saveQuizResult({
     sessionId: session.id,
     resultType: result.primaryStyle.style,
     resultTitle: result.primaryStyle.category,
     resultDescription: `Seu estilo predominante é ${result.primaryStyle.category}...`,
     resultData: {
       primaryStyle: result.primaryStyle,
       secondaryStyles: result.secondaryStyles,
       scores: result.scores,
       // outros dados
     },
   });
   ```

## 5. Estrutura de Blocos do Editor

### 5.1 Blocos para Etapas de Resultado (20-21)

- `QuizResultsBlock`: Mostra o resultado principal do quiz
- `StyleResultsBlock`: Exibe detalhes do estilo predominante
- `FinalStepEditor`: Editor da página final com a oferta

### 5.2 Registro de Componentes

- Todos os componentes são registrados em `enhancedBlockRegistry.ts`:
  ```typescript
  export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
    // ...
    'quiz-results': QuizResultsEditor,
    'quiz-results-block': QuizResultsBlock,
    'style-results': StyleResultsEditor,
    'style-results-block': StyleResultsBlock,
    'final-step': FinalStepEditor,
    // ...
  };
  ```

## 6. Fluxo Completo da Experiência do Usuário

1. **Etapa 1**: Usuário vê introdução do quiz e fornece seu nome (CRÍTICO)
2. **Etapas 2-12**: Responde questões sobre estilo (botões clicados - CRÍTICO)
3. **Etapa 13**: Passa por uma página de transição
4. **Etapas 14-19**: Responde questões estratégicas adicionais (botões clicados - CRÍTICO)
5. **Processamento**: O sistema calcula o resultado usando `calculateQuizResult()`
6. **Etapa 20**: Visualiza seu resultado personalizado com `StyleResultsBlock` (rastrear CTAs - CRÍTICO)
7. **Etapa 21**: Recebe uma oferta baseada em seu estilo predominante (rastrear CTAs - CRÍTICO)

## 7. Pontos de Integração

Os pontos principais onde o nome do usuário e as respostas são utilizados para cálculo e exibição do resultado são:

1. **Nome do Usuário**:
   - Capturado na Etapa 1
   - Armazenado em `quiz_users` no Supabase (CRÍTICO)
   - Exibido na página de resultados (Etapa 20)

2. **Respostas**:
   - Capturadas nas Etapas 2-12 e 14-19 (botões clicados - CRÍTICO)
   - Armazenadas em `quiz_responses` no Supabase
   - Processadas pela função `calculateQuizResult()`
   - Resultado armazenado em `quiz_results` no Supabase

3. **Interações com CTAs**:
   - Botões clicados nas Etapas 20-21 (CRÍTICO)
   - Devem ser rastreados em `quiz_events` no Supabase
   - Importante para análise da jornada do usuário3. **Resultado Calculado**:
   - Exibido na Etapa 20 com `QuizResultsBlock` e `StyleResultsBlock`
   - Personaliza a oferta na Etapa 21 com `FinalStepEditor`
