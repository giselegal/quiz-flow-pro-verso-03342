# Dados Essenciais para Armazenar no Supabase

## Dados Críticos do Funil para Armazenamento

Para um funcionamento eficiente do funil de quiz, é essencial armazenar os seguintes dados no Supabase:

### 1. Informações do Usuário

- **Nome do usuário** (coletado na Etapa 1)
- **Email** (opcional, pode ser coletado na Etapa 1 ou 21)
- **Data e hora de início do quiz**
- **Fonte de tráfego** (UTM parameters)

### 2. Respostas das Questões (Botões Clicados)

- **ID da questão**
- **Texto da questão** (para facilitar análise)
- **Opção selecionada pelo usuário**
- **Valor/Pontuação da opção**
- **Timestamp de cada resposta** (para análise de tempo de decisão)

### 3. CTAs das Páginas 20 e 21 (Jornada do Usuário)

- **Cliques nos botões de call-to-action**
- **Tipo de CTA clicado** (ex: "Ver Resultado Completo", "Comprar Oferta")
- **Timestamp do clique**
- **Página onde ocorreu o clique** (20 ou 21)

### 4. Resultados Calculados

- **Estilo predominante**
- **Pontuação de cada estilo**
- **Percentual de compatibilidade**

## Estrutura das Tabelas no Supabase

```
┌─────────────────────────┐
│      quiz_users         │
├─────────────────────────┤
│ id                      │
│ name (IMPORTANTE)       │
│ email                   │
│ created_at              │
│ utm_source              │
│ utm_medium              │
│ utm_campaign            │
└─────────────────────────┘
          ▲
          │
          │
┌─────────────────────────┐
│     quiz_sessions       │
├─────────────────────────┤
│ id                      │
│ user_id                 │
│ funnel_id               │
│ start_time              │
│ completed_at            │
│ current_step            │
│ status                  │
└─────────────────────────┘
          ▲
          │
          ├───────────────────┬───────────────────┐
          │                   │                   │
┌─────────────────────────┐   │                   │
│    quiz_responses       │   │                   │
├─────────────────────────┤   │                   │
│ id                      │   │                   │
│ session_id              │   │                   │
│ question_id             │   │                   │
│ question_text           │   │                   │
│ answer_value (IMPORTANTE)   │                   │
│ answer_text             │   │                   │
│ score_earned            │   │                   │
│ step_number             │   │                   │
│ created_at              │   │                   │
└─────────────────────────┘   │                   │
                              │                   │
                              │                   │
┌─────────────────────────┐   │  ┌─────────────────────────┐
│     quiz_results        │   │  │      quiz_events        │
├─────────────────────────┤   │  ├─────────────────────────┤
│ id                      │   │  │ id                      │
│ session_id              │◄──┘  │ session_id              │◄─┐
│ result_type             │      │ event_type (IMPORTANTE) │  │
│ result_title            │      │ element_id              │  │
│ result_data (JSON)      │      │ element_text            │  │
│ created_at              │      │ page_number             │  │
└─────────────────────────┘      │ created_at              │  │
                                 └─────────────────────────┘  │
                                                              │
┌─────────────────────────┐                                   │
│     conversions         │                                   │
├─────────────────────────┤                                   │
│ id                      │                                   │
│ session_id              │◄──────────────────────────────────┘
│ product_id              │
│ product_name            │
│ conversion_value        │
│ created_at              │
└─────────────────────────┘
```

## Eventos Importantes para Rastreamento

Para ter uma visão completa da jornada do usuário, é essencial rastrear estes eventos:

### 1. Eventos de Navegação

- **quiz_started**: Quando o usuário inicia o quiz (Etapa 1)
- **question_viewed**: Quando cada questão é exibida
- **question_answered**: Quando o usuário responde a questão

### 2. Eventos de Resultado (Etapa 20)

- **result_viewed**: Quando o usuário visualiza o resultado
- **result_shared**: Se o usuário compartilha o resultado
- **guide_viewed**: Se o usuário visualiza o guia completo

### 3. Eventos de Oferta (Etapa 21)

- **offer_viewed**: Quando o usuário visualiza a oferta
- **cta_clicked**: Quando o usuário clica em um CTA
- **purchase_started**: Quando o usuário inicia o processo de compra
- **purchase_completed**: Quando o usuário completa uma compra

## Implementação Simplificada

Para implementar o rastreamento desses dados, use o hook `useSupabaseQuiz` com:

```typescript
// Exemplo para rastrear um clique em CTA
const trackCTAClick = async (ctaId, ctaText, pageNumber) => {
  await quizSupabaseService.trackEvent({
    sessionId: session.id,
    eventType: "cta_clicked",
    elementId: ctaId,
    elementText: ctaText,
    pageNumber: pageNumber,
  });
};

// Uso nos componentes de CTA
<Button
  onClick={() => {
    trackCTAClick("buy-now", "Comprar Agora", 21);
    // Lógica de redirecionamento ou ação
  }}
>
  Comprar Agora
</Button>
```

## Relatórios e Análises

Com esses dados armazenados, você poderá criar relatórios poderosos:

1. **Taxa de Conclusão do Quiz**: Quantos usuários iniciam vs. concluem
2. **Distribuição de Estilos**: Quais estilos são mais comuns entre os usuários
3. **Performance de CTAs**: Quais CTAs têm melhor taxa de clique
4. **Funil de Conversão**: Acompanhamento da jornada completa do usuário
5. **Tempo de Decisão**: Quanto tempo os usuários levam para responder cada questão

## Prioridades para Implementação

1. **Implementar primeiro**: Captura de nome e respostas das questões
2. **Implementar segundo**: Rastreamento de CTAs nas Etapas 20-21
3. **Implementar terceiro**: Eventos detalhados da jornada do usuário
