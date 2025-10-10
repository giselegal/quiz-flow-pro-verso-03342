# Arquitetura do Editor "/quiz-estilo" (Quiz Funnel / Estilo) 

> Documento de referência técnica consolidando a arquitetura atual do editor de funil de quiz (rota histórica associada ao fluxo de estilo) e o direcionamento de migração/modularização para o Template Engine Editor. 

---
## 1. Contexto e Objetivo
O editor `/quiz-estilo` (implementado em `QuizFunnelEditor.tsx`) evoluiu como uma solução monolítica para criação e manutenção de funis de quiz que calculam um "estilo" primário/secundário e derivam uma oferta. Ele incorpora simultaneamente:
- Modelagem de passos (steps) heterogêneos (intro, question, strategic-question, transition, transition-result, result, offer)
- Regras de ligação sequencial via `nextStep`
- Simulador runtime embutido (pré-visualização real interativa do fluxo)
- Undo/Redo local baseado em snapshots em memória
- Detecção de ciclos e steps órfãos
- Edição inline de arrays de opções e mapas de oferta (`offerMap`)
- Export/Import JSON com metadados de blocos
- Placeholders dinâmicos e cálculo de resultado (heurística de pontuação)

Limitações atuais que motivam a refatoração/modularização:
1. Acoplamento forte entre UI, lógica de validação, simulação e persistência (tudo dentro de ~1700 linhas).
2. Escalabilidade reduzida para introduzir novos tipos de bloco, validações cruzadas e recursos como autosave, histórico versionado persistido e permissões.
3. Duplicação de responsabilidades que já começam a existir em paralelo no novo Template Engine (stages, components, validation, history hash). 
4. Dificuldade de testes unitários e cobertura de regressão devido à granularidade insuficiente de componentes/hook.

Objetivo deste documento: mapear a arquitetura atual e delinear o plano de convergência com a arquitetura modular (Template Engine Editor) preservando funcionalidades essenciais sem carregar dívida técnica estrutural.

---
## 2. Visão Geral da Arquitetura Atual (QuizFunnelEditor)
Arquivo principal: `src/components/editor/quiz/QuizFunnelEditor.tsx`

### 2.1 Estrutura de Dados (Steps)
Cada step possui um discriminated union com campos específicos por tipo. Zod schemas garantem validação em export/import e pré-salvamento.
Tipos:
- intro
- question
- strategic-question
- transition
- transition-result
- result
- offer

Campos centrais comuns (via `BaseStepSchema`):
- `id`: string
- `type`: enum
- `nextStep`: encadeamento opcional
- `blocks`: lista opcional (para tipos result/offer) integrando o Block Registry

Extensões por tipo adicionam atributos semânticos (questionText, options, offerMap, etc.).

### 2.2 Ciclos e Orfandade
Função `detectCycle` constrói mapa de adjacency via `nextStep` e realiza DFS marcando ciclos. Informações derivadas:
- `cycleReport` usado para badge “Ciclo!”
- `reachableInfo` determina steps não alcançáveis a partir do primeiro (tag ÓRFÃO)

### 2.3 Undo/Redo
- Pilhas `history` (passado) e `future` (refazer) mantêm clones rasos dos arrays de steps.
- Serialização custom (JSON parcial) no dependency array de `useEffect` para empilhar mudanças estruturais.
- Limite `MAX_HISTORY = 40`.

### 2.4 Simulação Runtime Embutida
Estados:
- `simActive`, `simState` (currentStepId, answers, strategicAnswers, resultStyle, secondaryStyles)
- Timers para auto-avanço em transições e cálculo resultado.
Funções chave:
- `startSimulation`, `stopSimulation`, `gotoStep`, `toggleAnswer`, `selectStrategic`, `computeResult` (heurística de pontuação e desempate), `autoAdvance`.
Persistências auxiliares em `localStorage` (payload de resultado, selectedOffer) para integração com páginas externas (ResultPage/OfferPage).

### 2.5 Placeholders
`applyPlaceholders` injeta valores de exemplo para tokens: `{userName}`, `{primaryStyle}`, `{secondaryStyles}` durante preview (não-simulação).

### 2.6 Offer Map Synchronization
Funções utilitárias:
- `addMissingOfferKeys` (sincroniza chaves derivadas de strategic-question options)
- `removeExtraOfferKeys` (limpa chaves não referenciadas)
Mantém consistência entre perguntas estratégicas e conteúdo personalizado de oferta.

### 2.7 Blocks (Result / Offer)
Integração opcional com um `BlockRegistry` (categorias result/oferta) possibilitando múltiplos blocos configuráveis por step.
- Edição JSON com validação de schema (quando disponível)
- Preview isolado de bloco via `activeBlockPreviewId`

### 2.8 Export / Import
- Export: valida, detecta ciclos, agrega metadados de blocos (tipo + versão=1), gera JSON versionado.
- Import: valida schema, normaliza IDs duplicados, diff incremental (added/removed/modified) antes de aplicar.

### 2.9 Validação ao Salvar
Zod + detecção de ciclo; bloqueia persistência se falha.

### 2.10 Layout Atual
Layout efetivo utiliza 5 painéis (apesar da descrição inicial “4 colunas”):
1. Steps (CRUD, reorder, órfãos, ciclo, undo/redo, import/export, simulação)
2. Componentes & Inventário (type switch, opções e manipulação incremental)
3. Canvas (preview ou simulação; preview de blocos)
4. Propriedades (fields contextuais + offer map + placeholders)
5. Runtime Preview (engine adaptadora `editorStepsToRuntimeMap` para rodar app real acoplado)

### 2.11 Principais Responsabilidades Embutidas (Anti-Pattern)
- Orquestração de estado complexo em um único componente gigante.
- Validação sem camada de serviço isolada.
- Ausência de boundary clara entre: domínio (model), persistência, simulação, apresentação.

---
## 3. Riscos e Limitações
| Área | Risco | Impacto |
|------|-------|---------|
| Manutenibilidade | 1700+ linhas monolíticas | Alto custo de onboarding & refactor
| Escalabilidade | Inserir novos tipos de steps ou heurísticas | Propagação de condicionais e duplicação
| Testabilidade | Dificuldade em isolar unidades | Menor cobertura / regressão invisível
| Performance | Rerenders amplos sem memoização gran fina | Quedas em cenários de muitos steps
| Evolução (histórico, rollback) | Estado de histórico local e efêmero | Perda de lineage versionado persistido
| Reuso | Lógica embarcada não reutilizável pelo Template Engine | Redundância de código em expansão

---
## 4. Arquitetura Alvo (Template Engine Editor Modular)
Arquivo central (novo layout): `src/features/templateEngine/components/TemplateEngineEditorLayout.tsx`
Hooks de API (React Query) encapsulam operações:
- `useTemplateDraft`, `useUpdateMeta`, `useAddStage`, `useReorderStages`, `usePublish`, `useValidateDraft`, `useAddStageComponent`, `useRemoveStageComponent`, `useReorderStageComponents`, `useUpdateComponentProps`, `useTemplateHistory`.

### 4.1 Entidades
- Draft: `{ meta, stages[], components, draftVersion, published? }`
- Stage: `{ id, type, order, componentIds[] }`
- Component: `{ id, type, props }` (com possibilidade de `kind` para variações)
- History Entry (resumido): hashes de meta / stages / components para comparação rápida.

### 4.2 Layout Modular 4 Colunas
1. Stages (ordenação, seleção, badge de issues por stage)
2. Biblioteca & Componentes do Stage (quick add + lista ordenável + diffs Δ props vs publicado)
3. Canvas (render reutilizando `renderComponent`) 
4. Propriedades (metadados template, histórico, propriedades do componente com schema dinâmico e estado de edição batch)

### 4.3 Edição de Propriedades (Batch / Debounce)
`useComponentEditingState`:
- Mantém `localProps`, `dirtyKeys`, aplica patch incremental debounced (default 700ms)
- Funções: `markChange`, `flush(now?)`, `revertChanges`, `buildPatch`
- Estados derivados: `isFlushing`, `lastSavedAt`
- Reduz writes e previne estado de props obsoleto ou race conditions.

### 4.4 Validação
`useValidateDraft` retorna `errors` e `warnings` com metadados (stageId, severity). Interface visual agrega indicadores:
- Pontos coloridos (vermelho/âmbar) por stage
- Issues de componente exibidas inline (futuro: granular por campo)

### 4.5 Diff vs Publicado
Comparação leve:
- `addedComponents`, `removedComponents`, `modified[]` (lista de props divergentes via `diffProps`). 
- UI mostra contagem resumida + badge Δ em cada componente modificado.

### 4.6 Histórico Versionado
`useTemplateHistory` expõe snapshots com `version`, `createdAt`, `hashes`.
- Seleção de snapshot exibe comparação hash: `metaChanged`, `stagesChanged`, `componentsChanged` via `compareHistoryEntry`.
- Próximo passo planejado: rollback granular e tagging.

### 4.7 Publicação
`publish()` faz:
1. `editing.flush(true)` para garantir persistência de props pendentes
2. Chamada de mutation `usePublish`
3. Atualização local otimista do estado (React Query) posterior.

### 4.8 Component Schema Rendering
`getComponentSchema(type)` define campos dinâmicos (boolean, text, number, json, optionsArray). 
Form builder leve: mapeia tipagem -> input adequado + diff highlight (ponto azul se dirty vs servidor).

### 4.9 Responsabilidades Distribuídas
| Função | Local | Observação |
|--------|-------|------------|
| State fetch/cache | React Query hooks | Isolado por entidade
| Edição props | `useComponentEditingState` | Debounce + patch
| Renderização componente | `renderComponent` registry | Permite plug-ins
| Validação | `useValidateDraft` (server ou híbrido) | Pode evoluir para pipelines
| Histórico | `useTemplateHistory` + `compareHistoryEntry` | Fundamento para rollback/tagging

### 4.10 Benefícios Arquiteturais
- Separação clara de preocupações (SOA dentro do front-end)
- Extensibilidade (novo tipo de componente = registro + schema)
- Observabilidade futura (telemetria por mutation)
- Facilita feature flags (colunas, histórico avançado) sem inflar componente raiz.

---
## 5. Gap Analysis: QuizFunnelEditor → TemplateEngineEditor
| Funcionalidade | Estado no QuizFunnel | Estado no Template Engine | Ação de Migração |
|----------------|----------------------|---------------------------|------------------|
| Steps variados (intro/question/result/offer...) | Implementado | Representado genericamente via component + stage types (parcial) | Criar mapeamento de tipos herdados → stage/component combos ou manter adaptador transiente | 
| Simulação runtime interativa | Completa (com timers, scoring) | Ainda não (canvas passivo) | Extrair engine de simulação para serviço/painel lateral plugável |
| Undo/Redo local | Pilha interna | Não (usa persistência + histórico server) | Reintroduzir undo leve baseado em diffs de props + reorder buffer local | 
| Export/Import JSON | Completo + diff | Ausente | Implementar export incremental (meta, stages, components) + import com heurísticas |
| OfferMap sync estratégico | Funções utilitárias locais | Não | Converter para regras de validação cross-component (ex: gerar warnings) |
| Placeholders runtime | Intro/Result preview | Não | Introduzir provider de placeholders genérico | 
| Blocks dinâmicos (result/offer) | Suportado via BlockRegistry | Não (renderComponent registry genérico) | Unificar registries ou criar adapter para Block definitions |
| Detecção de ciclos / órfãos | Implementado (nextStep) | Não aplicável (stages são lineares? se houver fluxo condicional futuro) | Caso necessário: adicionar grafo lógico derivado de props | 
| Histórico versionado persistente | Não | Sim (hash + snapshot) | Levar undo/redo para layer de histórico incremental |
| Diff publicado granular | Parcial (import preview) | Resumo por componente props | Expandir para diff field-level + visual side-by-side |

---
## 6. Estratégia de Migração
Fases sugeridas:
1. Adaptação de Tipos: Introduzir camada de model para steps herdados convertendo-os em `stages + components` (adapter inicial). 
2. Extração de Simulação: Mover scoring + timers para módulo isolado reutilizável pelo novo layout (Canvas alternável: edição vs simulação).
3. Blocks Unificados: Normalizar BlockRegistry para integrá-lo ao `renderComponent` (categoria → schema → renderer).
4. Export/Import Genérico: API /templates/:id/export que consolida meta + stages + components + version; import validando schemas.
5. OfferMap Regras: Validar divergências (missing/extra keys) como warnings estruturais cross-component (stage question estratégica vs componente Oferta).
6. Autosave + Conflitos: Implementar mutex otimista (ETag ou version int) + merge superficial de props.
7. Rollback & Tagging: Reaplicar snapshot (`meta/stages/components`)—necessário diff rápido para invalidar cache local.
8. Simulação Avançada + Preview: Inserir painel lateral (como a coluna 5 antiga) usando provider de runtime.

---
## 7. Fluxo de Edição de Props (Novo)
1. Usuário altera campo → `markChange` atualiza `localProps` e set dirty.
2. Debounce (700ms) expira → `flush()` gera patch com somente dirty keys.
3. Mutation `useUpdateComponentProps` envia patch; sucesso limpa dirty e marca timestamp.
4. Publicação garante flush forçado antes de promover versão.

Edge cases cobertos:
- Troca de componente selecionado limpa estado local garantindo não vazamento de dirty keys.
- Revert explicito cancela debounce pendente.

---
## 8. Histórico e Comparação
Cada snapshot histórico guarda hashes (meta/stages/components). Comparação rápida:
- Igualdade de hash implica nenhum diff estrutural naquela dimensão.
- Fase futura: armazenamento de delta detalhado (lista de adds/removes/propsChanged) para rollback rápido sem refetch total.

---
## 9. Padrões de Código e Boas Práticas
- Hooks de dados isolam efeitos colaterais (carregamento/persistência) de apresentação.
- Evitar passagem de objetos não memorizados em dependency arrays (uso de ids e versões para invalidar caches).
- Lote de diffs baseado em JSON.stringify somente em pontos controlados (evitar sobrecarga em renders principais).
- Priorizar idempotência em mutations (reaplicar patch igual não altera estado). 

---
## 10. Próximas Extensões Planejadas
| Feature | Descrição | Dependências |
|---------|-----------|--------------|
| Rollback snapshot | Aplicar snapshot selecionado ao draft atual | API PUT /history/:id/rollback |
| Tagging histórico | Rótulos e notas para snapshots | Campo `label` em snapshot + UI input |
| Autosave | Flush periódico de meta/stages e componentes | Debounce global + lock de versão |
| Component Library Panel | Catálogo completo com busca e categorias | Estrutura metadata centralizada |
| Canvas Drag & Drop | Reordenação visual e criação por soltar | Adapters + gesture layer |
| Cross-component validations | Regras (ex: oferta sem chave estratégica) | Pipeline de validação composable |
| Diff visual field-level | Side-by-side props alteradas | Serializer + comparador profundo |
| Simulação modular | Provider isolado + plugin scoring | Engine scoring externa |
| Export/Import unificado | Formato versionado do template (V1) | Endpoint backend + schema zod |
| Telemetria | Eventos de edição, publish, rollback | Logger/dispatcher central |

---
## 11. Decisões Arquiteturais (ADR Resumido)
| ID | Decisão | Status | Motivação |
|----|---------|--------|-----------|
| ADR-01 | Separar editor monolítico em layout modular 4 colunas | Aceito | Reduz acoplamento e facilita evolução | 
| ADR-02 | Introduzir hook `useComponentEditingState` para batch patch | Aceito | Minimiza round-trips e latência perceptível |
| ADR-03 | Hashes em snapshots para comparação O(1) | Aceito | Performance em histórico | 
| ADR-04 | Validar props por schema declarativo (registry) | Em andamento | Extensibilidade e consistência |
| ADR-05 | Remover dependência de flag para expor rota `/template-engine` | Aceito | Acesso direto sem fricção |

---
## 12. Plano de Convergência Sem Ruptura
1. Manter `/quiz-estilo` congelado (apenas hotfix) enquanto implementa paridade de recursos críticos no Template Engine.
2. Adicionar adaptadores de import: converter export do QuizFunnel → template draft (stages + components).
3. Feature flag granular para ativar simulação no novo editor quando pronta.
4. Migração final: descontinuar `QuizFunnelEditor` após validação em produção e ausência de regressões métricas (conversão, completude de quiz, erros runtime).

Indicadores de Pronto para Desligar Monolítico:
- 100% paridade de tipos e lógica (scoring, oferta)
- Export/Import compatível
- Histórico com rollback funcional
- Testes e2e cobrindo fluxo completo (criar → simular → publicar → rollback)

---
## 13. Considerações de Performance
- Debounce de 700ms reduz writes; opção de flush manual antes de publicar.
- Hashes evitam comparar estruturas profundas repetidamente.
- Futuro: memoização de renderComponent e virtualização de listas de componentes quando grande.

---
## 14. Segurança e Integridade
- Sanitização de HTML (intro/result) via util dedicado (`sanitizeHtml`).
- Import valida schema e normaliza IDs para evitar colisão.
- Próximo: rate limit em endpoints de update/publish + verificação de versão (optimistic concurrency) para prevenir lost updates.

---
## 15. Acessibilidade e UX (Pendências)
- Foco gerenciado ao trocar seleção de componente
- ARIA roles em listas ordenáveis (stages/components)
- Atalhos de teclado reintroduzidos modularmente (undo/redo, mover componente)

---
## 16. Glossário
| Termo | Definição |
|-------|-----------|
| Stage | Agrupador de componentes dentro do draft (ordenação linear) |
| Component | Unidade renderizável com schema de propriedades |
| Draft | Estado editável não publicado |
| Snapshot | Registro versionado (hashes) de meta/stages/components |
| OfferMap | Mapeamento chave (estratégica) → conteúdo de oferta |
| Dirty Keys | Conjunto de props alteradas localmente ainda não persistidas |

---
## 17. Referências de Código
- Monolítico legacy: `src/components/editor/quiz/QuizFunnelEditor.tsx`
- Novo layout: `src/features/templateEngine/components/TemplateEngineEditorLayout.tsx`
- Hook batch props: `src/features/templateEngine/hooks/useComponentEditingState.ts`
- Util diff: `src/features/templateEngine/utils/diffProps.ts`
- Comparação histórico: `src/features/templateEngine/utils/historyHashes.ts` (hash compare)
- Registry render: `src/features/templateEngine/components/render/registry` (definições de componentes)

---
## 18. Próximas Ações Imediatas (Prioridade Curta)
1. Implementar rollback usando snapshot selecionado (preservar diff flush).
2. Introduzir panel de biblioteca (separado do stage) para descoberta de componentes → arrastar ou clicar.
3. Export/Import no Template Engine garantindo compatibilidade de conversão.
4. Integrar simulação isolada (motor de scoring extraído do monolítico).
5. Tagging de snapshots para marcos de release.

---
## 19. Conclusão
A migração para o Template Engine Editor modular estabelece uma base escalável e testável, reduzindo a complexidade do monólito `/quiz-estilo`. Ao concluir as fases de paridade (simulação, export/import, rollback), o sistema ficará apto a descontinuar a implementação antiga com ganhos claros de manutenibilidade, extensibilidade e observabilidade.

> Documento vivo: atualizar conforme schemas, pipelines de validação e funcionalidades (rollback/tagging) forem introduzidos.
