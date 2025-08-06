s # Diagrama de Fluxo de Dado│ │ RESPOSTAS Q1-10│────────┐
└───────────────┘ │
│ │
▼ ▼
┌────────────────────────────┐ ┌───────────────────────────┐
│ Estado Local - QuizAnswers │◄───┤ Supabase - quiz_responses │uiz

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FLUXO DE DADOS DO QUIZ                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  ETAPA 1: INTRODUÇÃO E COLETA DE NOME                  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                               ┌────────┐
                               │ NOME   │────────┐
                               └────────┘        │
                                    │            │
                                    ▼            ▼
┌────────────────────────────┐    ┌───────────────────────────┐
│ Estado Local - QuizContext │◄───┤ Supabase - quiz_users     │
└────────────────────────────┘    └───────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     ETAPAS 2-12: PERGUNTAS DO QUIZ                     │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ RESPOSTAS Q1-10│────────┐
                            └───────────────┘        │
                                    │                │
                                    ▼                ▼
┌────────────────────────────┐    ┌───────────────────────────┐
│ Estado Local - QuizAnswers │◄───┤ Supabase - quiz_responses │
└────────────────────────────┘    └───────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      ETAPA 13: TRANSIÇÃO/PROCESSAMENTO                 │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ETAPAS 14-19: PERGUNTAS ESTRATÉGICAS                 │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ RESPOSTAS S1-6│────────┐
                            └───────────────┘        │
                                    │                │
                                    ▼                ▼
┌────────────────────────────┐    ┌───────────────────────────┐
│ Estado Local - QuizAnswers │◄───┤ Supabase - quiz_responses │
└────────────────────────────┘    └───────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       CÁLCULO DO RESULTADO                             │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ calculateQuiz │
                            │ Result()      │
                            └───────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ QuizResult    │────────┐
                            └───────────────┘        │
                                    │                │
                                    ▼                ▼
┌────────────────────────────┐    ┌───────────────────────────┐
│ Estado Local - result      │◄───┤ Supabase - quiz_results   │
└────────────────────────────┘    └───────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          ETAPA 20: RESULTADO                           │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             COMPONENTES:                               │
│                                                                        │
│                         ┌───────────────────┐                          │
│                         │ QuizResultsBlock  │                          │
│                         └───────────────────┘                          │
│                                   │                                    │
│                                   ▼                                    │
│                         ┌───────────────────┐                          │
│                         │ StyleResultsBlock │                          │
│                         └───────────────────┘                          │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           ETAPA 21: OFERTA                             │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             COMPONENTES:                               │
│                                                                        │
│                         ┌───────────────────┐                          │
│                         │  FinalStepEditor  │                          │
│                         └───────────────────┘                          │
│                                   │                                    │
│                                   ▼                                    │
│                        ┌────────────────────┐                          │
│                        │ StyleResultsEditor │                          │
│                        └────────────────────┘                          │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           CONVERSÃO (OPCIONAL)                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ recordConver- │
                            │ sion()        │────────┐
                            └───────────────┘        │
                                                     ▼
                             ┌───────────────────────────┐
                             │ Supabase - conversions    │
                             └───────────────────────────┘
```

## Resumo do Fluxo

1. O usuário navega pelas 21 etapas do funil
2. Na Etapa 1, fornece seu nome que é armazenado no Supabase (quiz_users) ← CRÍTICO
3. Nas Etapas 2-12 e 14-19, responde às perguntas do quiz (botões clicados), armazenadas no Supabase (quiz_responses) ← CRÍTICO
4. O sistema calcula o resultado usando calculateQuizResult() com base nas respostas
5. O resultado é armazenado no Supabase (quiz_results)
6. Na Etapa 20, o resultado é exibido usando QuizResultsBlock e StyleResultsBlock
7. Na Etapa 21, uma oferta personalizada é apresentada com FinalStepEditor
8. Se o usuário interage com CTAs nas etapas 20-21, estas interações são registradas (quiz_events) ← CRÍTICO
9. Se o usuário fizer uma conversão, ela é registrada no Supabase (conversions)

## Tabelas do Supabase Envolvidas

1. **quiz_users**: Armazena informações do usuário (nome, email, etc.) ← CRÍTICO
2. **quiz_sessions**: Registra a sessão do quiz (quando o usuário iniciou, etc.)
3. **quiz_responses**: Armazena as respostas individuais a cada pergunta (botões clicados) ← CRÍTICO
4. **quiz_results**: Armazena o resultado final calculado
5. **quiz_events**: Rastreia interações com CTAs e elementos importantes nas etapas 20-21 ← CRÍTICO
6. **conversions**: Registra as conversões (compras, inscrições, etc.)
