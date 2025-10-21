# Arquitetura Atual do Quiz – 21/10/2025

Este documento consolida a arquitetura configurada até agora (fonte de verdade, carregamento, renderização e blocos) e lista um checklist dos próximos passos.

## sumário executivo

- Fonte canônica única: JSONs v3 por etapa em `public/templates/step-XX-v3.json`, gerando `src/templates/quiz21StepsComplete.ts` (via `npm run generate:templates`).
- Carregamento centralizado: `src/templates/imports.ts` expõe `getQuiz21StepsTemplate()` e registra todos os steps no `TemplateRegistry` (permite overrides futuros).
- Runtime (produção) unificado com o Editor: perguntas (02–11, 13–19) agora usam renderers modulares baseados em blocos v3.
- Blocos atômicos principais: question-progress, question-number, question-text, question-instructions, options-grid, question-navigation, além de blocos de transição, resultado e oferta.
- Navegação: `QuestionNavigationBlock` usa rótulos do JSON v3, suporta `enableWhenValid`, `showBack`, alinhamento, cores e `nextStepId/prevStepId` com eventos de telemetria.
- Configs centralizadas: FUNNEL_CONFIG para CTAs, SEO, UTM e testes A/B (cópia). Textos com interpolação opcional.
- Esquemas atualizados: botão com campos A/B; texto com `enableInterpolation`; `question-navigation` incorporado ao schema.

---

## fonte de verdade e geração

- JSONs v3 por etapa: `public/templates/step-XX-v3.json` (01–21).
- Geração TS canônico: `scripts/generate-templates.ts` produz `src/templates/quiz21StepsComplete.ts` mantendo o shape v3 (sections/blocks, metadata, theme, etc.).
- Documento gerado adiciona cache de step e funções auxiliares (`getStepTemplate`, `getPersonalizedStepTemplate`).

Arquivos relevantes:
- `src/templates/quiz21StepsComplete.ts` – artefato gerado (não editar manualmente).
- `src/templates/imports.ts` – ponto único para obter o template gerado via `getQuiz21StepsTemplate()` e registrar no `TemplateRegistry`.
- `src/services/TemplateRegistry.ts` – registry singleton com `register/get/has` por `step-XX`.

---

## carregamento e serviços

- `src/templates/imports.ts`:
  - `getQuiz21StepsTemplate()` retorna o objeto TS normalizado e anota `_source = 'ts'`.
  - `getStepTemplate(stepId)` tenta `TemplateRegistry` antes de cair para o TS gerado.
  - Registra automaticamente todos os steps no `TemplateRegistry` ao importar.

- `src/services/HybridTemplateService.ts`:
  - Mantido para compatibilidade; prioriza sempre a fonte TS canônica (v3 gerado) para `getTemplate()` e `getStepConfig()`.
  - Descontinuado o uso de master JSON/overrides no runtime do editor (ainda útil para diagnóstico/export).

- `src/utils/loadStepTemplates.ts`:
  - Para caminhos legados (12, 13, 19, 20), ainda oferece conversão `sections → blocks`, mas hoje a preferência é sempre via `imports.ts`/TS gerado.

## FunnelsContext.tsx na estrutura (metadados e sessão do funil)

- Local: `src/contexts/funnel/FunnelsContext.tsx`
- Objetivo: disponibilizar metadados das etapas (nome, descrição, tipo, blocksCount) e utilitários de sessão para telas como o Editor e páginas administrativas.

Principais responsabilidades:
- Construção de `defaultSteps` a partir do template canônico v3 (`QUIZ_STYLE_21_STEPS_TEMPLATE`) e do índice `QUIZ_QUESTIONS_COMPLETE` para os templates:
  - `quiz-estilo-completo`
  - `quiz21StepsComplete`
  - `template-optimized-21-steps-funnel`
  - Suporte/alias: `funil-21-etapas` e mapeamentos legados via `LEGACY_TEMPLATE_MAPPING`.
- Extração do texto da pergunta direto das seções v3 para evitar títulos genéricos:
  - Helper `extractQuestionTextFromTemplateSections(sections)` procura em ordem: `question-text` → `question-hero.questionText`/`text` → `question-title`.
  - Resultado usado como `description`/`questionText` nas etapas de pergunta, garantindo que a UI exiba o enunciado real da questão.
- Inferência de tipo da etapa por conteúdo, não por número:
  - `inferStepTypeFromTemplate(stepId, stepNumber, sections)` verifica tipos de blocos (ex.: `transition-*`, `result-*`, `options-grid`, `question-*`, `offer-*`, `form-input`).
  - Tipos possíveis: `lead-collection`, `scored-question`, `strategic-question`, `transition`, `result`, `offer`.
- Contagem de blocos por etapa: `blocksCount = sections.length` (fonte v3), usada para diagnósticos e UI.
- Clonagem segura de blocos ao expor conteúdo de uma etapa:
  - `getTemplateBlocks(templateId, stepId)` cria cópias profundas com `id` único por `funnelId` e metadados (`_metadata`) para rastreabilidade.

Sessão e resolução de template:
- Determina `currentFunnelId` preferindo a URL (`?funnel=`). Se houver apenas `?template=`, mantém `currentFunnelId` vazio para sessão ad-hoc e resolve internamente o template base.
- Caso não haja parâmetro, tenta `localStorage` (`editor:funnelId`). Fallback silencioso para `funil-21-etapas` quando aplicável.
- Bypass: em rotas `/template-engine/*`, o provider não inicializa o contexto legacy para evitar sobreposição com o motor modular.

API exposta (contrato resumido):
- `steps`: lista de etapas com `{ id, name, order, blocksCount, isActive, type, description }`.
- `setSteps(updater)`: mantém `_source: 'ts'` para rastrear origem.
- `getTemplate(templateId)`: retorna metadados compatíveis (fallback para templates suportados).
- `getTemplateBlocks(templateId, stepId)`: retorna blocos clonados da etapa.
- `updateFunnelStep(stepId, updates)`, `addStepBlock(stepId, blockData)`: utilitários de edição leve.
- `saveFunnelToDatabase(funnelData)`: persiste no Supabase, incluindo `settings.context = 'MY_FUNNELS'`.
- `currentFunnelId`, `setCurrentFunnelId`, `loading`, `error`.

Integrações relevantes:
- Páginas que usam `useFunnels()`: `src/pages/admin/MyFunnelsPage.tsx` e `MyFunnelsPage_contextual.tsx` navegam/instanciam com `template-optimized-21-steps-funnel`.
- Editor/produção consomem `steps` para navegação/listagens, enquanto o conteúdo v3 é carregado via `src/templates/imports.ts`/TemplateRegistry.

Atualização 21/10/2025:
- Aplicado o extrator de texto de pergunta em todos os mapeamentos citados, eliminando títulos genéricos nas perguntas. O template otimizado também usa `generateStepDescription(...)` para compor a descrição final por tipo + enunciado.

---

## gargalos e fluxograma

### Gargalos identificados (prioridade prática)

1) Clonagem profunda e IDs não determinísticos em `getTemplateBlocks`
- Onde: `src/contexts/funnel/FunnelsContext.tsx` → `getTemplateBlocks()`
- O que ocorre: para cada chamada, há `JSON.parse(JSON.stringify(...))` e criação de `id` com `Date.now()` + `Math.random()` para cada bloco.
- Efeito: gera objetos novos a cada render/consulta, aumenta custo de CPU/alocação e provoca re-renders desnecessários na UI (IDs instáveis).
- Direção de correção: memoizar por `(templateId, funnelId, stepId)` e usar IDs determinísticos (ex.: `${funnelId}-${stepId}-${index}`) com cache em Map fraco.

2) Inferência de tipo calculada mais de uma vez por etapa
- Onde: mapeamento do template `template-optimized-21-steps-funnel` (e similares).
- O que ocorre: `inferStepTypeFromTemplate(...)` é chamada duas vezes (para `type` e novamente dentro de `generateStepDescription`).
- Efeito: custo duplicado por etapa (baixo, mas soma em 21 etapas e listas).
- Direção: calcular uma vez por step e reutilizar.

3) Duplicação de mapeamentos de steps em três entradas
- Onde: `FUNNEL_TEMPLATES['quiz-estilo-completo' | 'quiz21StepsComplete' | 'template-optimized-21-steps-funnel']`.
- O que ocorre: cada mapeamento reitera a mesma lógica base (sections → metadados), o que aumenta superfície de manutenção.
- Efeito: risco de divergência futura e alterações repetidas.
- Direção: extrair um util único para gerar `defaultSteps` a partir de `QUIZ_STYLE_21_STEPS_TEMPLATE` + `QUIZ_QUESTIONS_COMPLETE` e reutilizar.

4) Logs e resolução de template em efeito com varreduras repetidas
- Onde: `useEffect` do `FunnelsProvider` (debug/diagnóstico).
- O que ocorre: muitos logs e leituras de `Object.keys(...)` a cada alteração de `currentFunnelId`.
- Efeito: ruído e custo mínimo, mas constante em dev; neutro em prod se `debug=false`.
- Direção: condicionar logs a um nível de debug mais granular e mover varreduras pesadas para caminhos de diagnóstico explícitos.

5) Potencial desalinhamento entre chaves de step (padded vs não padded)
- Onde: construção de `stepId` com `step-${stepNumber}` (sem padding) vs. chaves de seções v3.
- Observação: atualmente está funcional, porém vale padronizar (`step-01` etc.) e/ou garantir normalização única para evitar casos de borda.

### Fluxograma (visão de alto nível)

```mermaid
flowchart TD
  A[UI/Route: Editor/Admin] --> B{URL Params}
  B -->|?funnel=| C[Definir currentFunnelId]
  B -->|?template=| D[Sessão ad-hoc\nresolver template base]
  B -->|nenhum| E[localStorage: editor:funnelId]

  C --> F[Selecionar Template em FUNNEL_TEMPLATES]
  D --> F
  E --> F

  F --> G[Construir defaultSteps\n(sections v3 → metadados)]
  G --> H[steps no contexto\n{id, name, type, description, blocksCount}]

  H --> I[Admin/Editor lista etapas]
  I --> J[Render Step]

  J --> K{Carregar conteúdo}
  K -->|TemplateRegistry/ imports.ts| L[Seções v3 → Renderer]
  K -->|getTemplateBlocks (legacy)| M[Clonagem profunda + IDs]

  L --> N[Universal Block Renderer]
  M --> N
  N --> O[UI + Navegação + Eventos]
```

### Sugestões de melhoria imediata

- Cache determinístico em `getTemplateBlocks`:
  - Map por `(templateId, funnelId, stepId)` com geração única e IDs estáveis.
  - Evita re-renders e reduz GC.
- DRY para geração de `defaultSteps`:
  - Extrair um util (`buildDefaultStepsFromSections`) e reutilizar nos três mapeamentos.
- Calcular `stepType` uma única vez por etapa:
  - Guardar em variável e reaproveitar em `type` e `generateStepDescription`.
- Reduzir logs e custo do efeito:
  - Proteger blocos de diagnóstico atrás de `if (debug && verbose)` e remover leituras redundantes.

---

## renderização e arquitetura de steps

- Editor e produção convergidos para blocos v3:
  - `src/components/editor/renderers/common/UnifiedStepContent.tsx` já usava `ModularQuestionStep`/`ModularStrategicQuestionStep`.
  - Atualizado o runtime de produção em `src/components/step-registry/ProductionStepsRegistry.tsx` para usar:
    - `ModularQuestionStep` nos steps 02–11.
    - `ModularStrategicQuestionStep` nos steps 13–19.
    - Transição (12) e Resultado (20) já convertiam/consumiam blocos; Oferta (21) preservada via adapter específico.
  - Ambos carregam os blocos do v3 com `imports.loadTemplate(stepId)`; quando só houver `sections`, convertem com `sectionToBlockConverter`.

- Universal Block Renderer:
  - `src/components/editor/blocks/UniversalBlockRenderer.tsx` resolve e desenha os blocos atômicos com comportamento unificado (edição/produção via prop `mode`).

---

## blocos e schemas principais

- Options Grid (`options-grid`):
  - Compatibilidade com chaves antigas e novas (ex.: `gridGap`/`gap`, `multipleSelection`/`multipleSelect`).
  - Normalização de opções (garantir array), validação de seleção mínima/máxima, suporte a imagens e colunas.
  - Schema em `src/config/schemas/blocks/options-grid.ts` alinhado ao componente.

- Question Navigation (`question-navigation`):
  - `src/components/editor/blocks/atomic/QuestionNavigationBlock.tsx`: usa `content.nextLabel/backLabel` do v3; respeita `enableWhenValid`, `showBack`, `align`, `enabledColor`, `disabledColor`, `disabledTextColor`.
  - Navegação configurável por `nextStepId/prevStepId` (via `dispatchNavigate`) e eventos `quiz-navigation-*` para tracking.
  - Schema incluído no grupo de navegação em `src/config/schemas/blocks/form-and-navigation.ts`.

- Botão Inline (`button`):
  - Schema com grupo “Teste A/B”: `abExperimentKey`, `abTextA`, `abTextB`.
  - Componente (`ButtonInlineBlock`) integra FUNNEL_CONFIG como fallback de URL e UTM.

- Texto Inline (`text-inline`):
  - Campo `enableInterpolation` no schema e suporte no componente para interpolar dados (ex.: nome do usuário) de forma segura.

---

## configurações centralizadas e personalização

- FUNNEL_CONFIG: CTAs, SEO, metadados, UTMs padrões, chaves de A/B.
- Utilitários:
  - Atribuição determinística de variantes A/B.
  - Interpolação de placeholders em textos, com opt-in por bloco.
  - Append automático de UTM em links, com defaults.
- Overrides por JSON (env-gated) com validação “soft” para diagnóstico local (não aplicados em runtime de produção por padrão).

---

## navegação, eventos e auto-avanço

- Navegação por blocos: `question-navigation` com `onNext/onBack` ou `dispatchNavigate` para `nextStepId/prevStepId`.
- Eventos globais:
  - `quiz-navigation-click` (detalhe `{ type: 'next' | 'back', blockId, timestamp }`).
  - `quiz-navigation-next`/`quiz-navigation-back` (detalhe `{ target, blockId }`).
  - Eventos auxiliares de validação no `ModularQuestionStep` e lógica de salto (`skipTo`) quando presente.
- Auto-avanço: pode ser feito via bloco (habilitando quando válido) ou, opcionalmente, por regra adicional no adapter (mantido desligado por padrão no runtime para centralizar controle no bloco).

---

## qualidade e status atual

- Build (dev): PASS.
- Type-check: PASS.
- Lint: script existe, porém não há `eslint` instalado no `devDependencies` (opcional: adicionar caso queira habilitar lint em CI).
- Testes automatizados: não executados nesta ação. Há anotações prévias de dois pontos a tratar (ver checklist).

---

## checklist – próximos passos

1) Navegação e testes
- [ ] Revisar teste de “back-step” e alinhar expectativa vs. regra atual (voltar permitido/impedido por etapa).
- [ ] Smoke-test manual das etapas 02–11 e 13–19 com blocos v3 (seleção, navegação, rótulos, cores, `enableWhenValid`).
- [ ] E2E básico no fluxo completo (intro → perguntas → transição → estratégicas → transição resultado → resultado → oferta).

2) Testes e infraestrutura
- [ ] Isolar/mocar testes de storage que dependem de serviço externo (porta 3001) ou mover para suíte de integração.
- [ ] (Opcional) Adicionar ESLint ao projeto e habilitar `npm run lint` no CI.

3) Experimentos e personalização
- [ ] A/B opcional para URL/estilo de botões além de texto (avaliar schema e consumo no `ButtonInlineBlock`).
- [ ] Confirmar interpolação nos blocos críticos e fallback seguro quando desabilitada.

4) Documentação e DX
- [ ] Documentar mapeamento “sections → blocks” e recomendações para criação de novos blocos.
- [ ] Registrar exemplos mínimos de step v3 (pergunta com/sem imagem, múltipla seleção) em `public/templates`.

5) Observabilidade
- [ ] Centralizar listeners de eventos `quiz-navigation-*` para métricas/telemetria em um serviço dedicado.
- [ ] Marcar `_source` nos objetos override (quando habilitados) para auditoria.

---

## referências rápidas (arquivos-chave)

- Templates e registro:
  - `public/templates/step-XX-v3.json`
  - `src/templates/quiz21StepsComplete.ts`
  - `src/templates/imports.ts`
  - `src/services/TemplateRegistry.ts`

- Renderização modular:
  - `src/components/editor/renderers/common/UnifiedStepContent.tsx`
  - `src/components/step-registry/ProductionStepsRegistry.tsx`
  - `src/components/quiz-modular/` (bridge/core)

- Blocos atômicos:
  - `src/components/editor/blocks/atomic/QuestionNavigationBlock.tsx`
  - `src/components/editor/blocks/OptionsGridBlock.tsx`
  - `src/components/editor/blocks/UniversalBlockRenderer.tsx`

- Schemas:
  - `src/config/schemas/blocks/button.ts`
  - `src/config/schemas/blocks/text-inline.ts`
  - `src/config/schemas/blocks/options-grid.ts`
  - `src/config/schemas/blocks/form-and-navigation.ts`

- Types do v3:
  - `src/types/template-v3.types.ts`

---

## como validar (opcional)

- Build rápido e type-check:
  - `npm run build:dev`
  - `npm run type-check`
- Smoke tests manuais: abra o fluxo e valide seleção/navegação nas etapas de pergunta e estratégicas.
- E2E (básico): `npm run test:e2e:basic` (se Playwright já estiver configurado no ambiente e testes disponíveis).

> Observação: se quiser lint, inclua `eslint` nas `devDependencies` e ajuste o script `npm run lint`.

---

Atualizado em: 21/10/2025
