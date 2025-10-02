# Evolução do Modern Unified Editor (Arquitetura Atualizada)

## Objetivo
Consolidar carregamento, gestão de estado, operações CRUD e UX progressiva do `/editor` reduzindo gargalos de tempo até interação e riscos de race conditions.

## Componentes Centrais
- `useEditorBootstrap`: Orquestra parsing de URL, criação/carregamento do funil e seed idempotente (quizSteps). Fases: `parsing -> funnel -> seed -> ready`.
- `useOperationsManager`: Gerencia operações nomeadas (save, create, duplicate, test, autosave) com dedupe, progresso e métricas (durations disponíveis para telemetria futura).
- `editorEvents` (event bus): Emite eventos chave (`EDITOR_BOOTSTRAP_PHASE`, `EDITOR_BOOTSTRAP_READY`, `EDITOR_OPERATION_*`, `EDITOR_AUTOSAVE_*`).
- `EditorBootstrapProgress`: Barra de progresso visual (Radix) desacoplada, exibida no fallback inicial.
- `OperationsPanel`: Painel colapsável exibindo operações recentes com progresso e duração.

## Fluxo de Bootstrap
1. Mark `editor_bootstrap_start`.
2. Parse de URL e normalização (Zod).
3. Carregamento ou criação do funil.
4. Seed condicional somente se não houver `quizSteps` (idempotente via ref guard).
5. Mark `editor_bootstrap_ready` + measure `editor_TTI` + evento `EDITOR_BOOTSTRAP_READY`.

## Autosave
- Debounce 5s após última modificação (`unifiedEditor.isDirty`).
- Executado como operação `autosave` (dedupe) → evita conflito com `save` manual.
- Eventos: `EDITOR_AUTOSAVE_START/SUCCESS/ERROR`.

## Benefícios Obtidos
| Área | Antes | Depois |
|------|-------|--------|
| Parsing & Seed | Effects dispersos | Hook central com fases e marks |
| Race Conditions Seed | Possível duplicidade StrictMode | Ref guard + fase única |
| Feedback de Carregamento | Mensagem genérica | Progresso faseado visual + label |
| Operações CRUD | Flag global `isOperating` | Estados granulares + painel |
| Extensibilidade | Acoplado à UI | Event bus para telemetria/logging |
| Autosave | Ausente | Debounced com eventos |

## Próximos Incrementos (Sugeridos)
- Persistência de preferências (OK para painel de operações, expandir para layout/painéis).
- Integração de telemetria: enviar durations (operation, ms) ao servidor.
- Error Boundary especializado para falhas de bootstrap com ação de recuperação.
- Estratégias/factories para tipos de funil (quiz/survey/etc.).
- Ampliar testes de parsing para cenários de hash/param combos.

## Eventos Disponíveis
| Evento | Payload |
|--------|---------|
| EDITOR_BOOTSTRAP_PHASE | { phase } |
| EDITOR_BOOTSTRAP_READY | { funnelId } |
| EDITOR_BOOTSTRAP_ERROR | { error } |
| EDITOR_OPERATION_START | { key } |
| EDITOR_OPERATION_END | { key, durationMs, error? } |
| EDITOR_AUTOSAVE_START | { dirty } |
| EDITOR_AUTOSAVE_SUCCESS | { savedAt } |
| EDITOR_AUTOSAVE_ERROR | { error } |

## Considerações de Performance
- Progresso não bloqueia UI; toolbar aparece antes do canvas.
- Suspense para `QuizFunnelEditor` e para `FunnelTypeDetector` isolam custos.
- Possível etapa futura: prefetch assíncrono de bundles quando usuário abre listagem de funis.

## Testes Adicionados
- `useOperationsManager.dedupe.test.ts`: garante rejeição em corrida de operação deduplicada.
- `useEditorBootstrap.parse.test.ts`: valida parsing real via função exportada `parseAndNormalizeParams` (funnel, template, modo, precedência de query params).

## Observabilidade
Pronto para: registrar performance marks adicionais (ex: post-ready warm features) + integrar logger externo ouvindo `editorEvents`.

---
Documentação inicial; atualizar conforme evoluções futuras de strategies e telemetria.
