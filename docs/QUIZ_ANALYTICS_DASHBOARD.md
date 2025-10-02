# Quiz Analytics Dashboard

Dashboard simples para inspecionar eventos locais do modo Quiz.

## Acesso
- Botão "Analytics" no topo do `QuizFunnelEditor` abre em nova aba (`/quiz-analytics`).
- Página: `src/pages/QuizAnalyticsDashboardPage.tsx` (lazy load).

## Fontes de Dados
Eventos armazenados em `localStorage` (chave `quizAnalyticsEvents`) via `emitQuizEvent`:
- step_view
- result_compute
- offer_view
- cta_click

## Métricas Exibidas
| Métrica | Descrição |
|---------|-----------|
| Steps | Total de eventos `step_view` filtrados |
| Resultados | Total de `result_compute` |
| Ofertas | Total de `offer_view` |
| CTA Clicks | Total de `cta_click` |
| Sessões | Sessões distintas (sessionId) |
| Ans/Resultado | Média de respostas agregadas por evento de resultado |
| Offer/Result | offer_view / result_compute |
| CTA/Offer | cta_click / offer_view |

## Filtros
- Sessão: select dinâmico por `sessionId`.
- Intervalo temporal: campos ISO `De` / `Até`.

## Flush
- Campo de endpoint + botão `Flush` envia lotes (POST JSON) usando `flushQuizEvents`.
- Botão `Limpar Eventos` esvazia buffer local.

## Extensão futura
- Persistência backend / replays.
- Export CSV.
- Séries temporais (charts) usando mesma fonte.
- Unificação com painel global GA4.

## Testes
Cobertura básica em `quizAnalytics.test.ts` valida:
- Validação Zod.
- Métricas.
- Flush.

## Segurança / Limites
- Buffer máximo de 500 eventos (descarta mais antigos).
- Eventos inválidos são descartados silenciosamente com aviso no console.

---
Manter este documento atualizado ao adicionar novos tipos de evento ou métricas.
