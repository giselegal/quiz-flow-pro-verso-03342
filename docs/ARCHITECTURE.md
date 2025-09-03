# Arquitetura Atual e Análise Sistêmica

Este documento resume a arquitetura do projeto, o funil de 21 etapas (dados → cálculo → resultado), os principais módulos (UI, hooks, serviços), rotas relevantes, estratégia de testes e recomendações para organizar os vários editores.

## Sumário executivo
- Editor oficial em /editor: MainEditor → EditorProvider → SchemaDrivenEditorResponsive, com fallback robusto para a Etapa 20 e templates JSON via StepTemplateService.
- Funil 21 etapas unificado: gate na Etapa 19 (threshold de dados) e cálculo/persistência determinísticos na Etapa 20.
- Organização atual: ainda há editores legados (EditorPro e variações), porém a rota oficial usa o editor responsivo consolidado.
- Testes estáveis quando executados de forma segmentada; execução monolítica pode atingir OOM em teardown em ambientes restritos.

## Visão de alto nível

```mermaid
graph TD
  A[Rotas (wouter)] -->|/editor| B[MainEditor]
  B --> C[EditorProvider]
  C --> D[SchemaDrivenEditorResponsive]
  D --> DZ[CanvasDropZone]
  D --> FBF[Step20EditorFallback]
  D --> STG[FunnelStages / Toolbars / Properties]

  C -->|dados/ações| CFG[config/quizStepsComplete]
  C -->|templates| STS[services/stepTemplateService]
  STS --> JTPL[config/templates/templates (JSON)]

  subgraph Resultados 19→20
    QRC[utils/quizResultCalculator] --> UQS[services/core/UnifiedQuizStorage]
    QRC --> ORC[services/core/ResultOrchestrator]
    ORC --> RE[services/core/ResultEngine]
  end

  D -->|recalc/validate| QRC
  QRC -->|save/load| UQS
  UQS -->|resultado| D
```

## Rotas principais
- /editor → src/pages/MainEditor.tsx (Editor oficial)
- /quiz → src/pages/QuizModularPage.tsx (execução/preview sem colunas de edição)
- /step/:step → pré-visualização por etapa
- Outras: /, /auth, /admin, /editor-templates, exemplos/compat

## Inventário de editores
- Oficial (rota /editor):
  - src/components/editor/SchemaDrivenEditorResponsive.tsx
    - Shell com colunas (Etapas, Componentes, Canvas, Propriedades), integra EditorProvider e aciona Step20EditorFallback quando necessário.
- Legado/alternativos (mantidos por compatibilidade/testes):
  - src/components/editor/EditorPro.tsx (mais pesado; não usado na rota oficial).
  - Páginas de demonstração/variações em src/pages/*.

Recomendação: focar manutenção no editor responsivo; mover EditorPro e variações para src/legacy/ com aviso de depreciação.

## Funil de 21 etapas (resumo funcional)
- Coleta (1–18) → Gate (19) → Resultado (20) → Pós-resultado (21).
- Gate (19): threshold mínimo (ex.: ≥8 seleções válidas + nome). Se insuficiente, retorna fallback não persistido.
- Resultado (20): ResultOrchestrator.run() com desempate determinístico e persistência via UnifiedQuizStorage. A UI aplica fallback visual (ex.: 70%) se necessário.
- Detalhes: ver docs/21-steps-flowchart.md e docs/21-steps-sequence.md.

## Dados e serviços
- src/services/core/UnifiedQuizStorage.ts: unifica seleções, formData e meta; controla threshold e persistência.
- src/utils/quizResultCalculator.ts: valida dados, calcula (ou fallback) e persiste; ponto único para Etapa 20.
- src/services/core/ResultOrchestrator.ts + src/services/core/ResultEngine.ts: pontuação e desempate determinístico; payload final.
- src/services/stepTemplateService.ts: templates por etapa a partir de JSON em config/templates/templates, com fallback default.

## Hooks e UI
- src/components/editor/EditorProvider.tsx: estado do editor (blocos por etapa, currentStep, validação, undo/redo; supabase opcional).
- src/components/editor/SchemaDrivenEditorResponsive.tsx: decide entre CanvasDropZone e Step20EditorFallback na Etapa 20 conforme blocos/resultado.
- src/components/editor/fallback/Step20EditorFallback.tsx: garante conteúdo na Etapa 20 (loading/erro, recálculo/consulta).
- src/hooks/useQuizResult.ts: cálculo/carregamento com timeout e retries; eventos de atualização; cleanup de timers.

## Testes e estabilidade
- Vitest (jsdom) configurado com clearMocks/restoreMocks/mockReset; sequence não concorrente; logs filtrados.
- Limpeza global de timers/raf/idle em src/test/setup.ts; listeners de monitoramento desativados nos testes.
- Scripts segmentados (package.json): test:run:core, test:run:ui, test:run:core2, test:run:misc:*, agregadores.
- Nota: execução monolítica completa pode atingir OOM em teardown em ambientes restritos; preferir segmentação.

## Performance e memória
- Otimizadores: utils/performanceOptimizer.ts e utils/performanceOptimizations.ts, com cancelamentos centralizados.
- UI evita recálculos/loops (guards na Etapa 20, memoizações e dependências bem definidas no EditorProvider).
- Stack: Vite 5, React 18, Zustand, DnD Kit, Radix UI.

## Avaliação da organização
- Pontos fortes:
  - Rota oficial consolidada com editor responsivo e templates JSON.
  - Pipeline de resultados unificado (19→20) e determinístico, com cobertura de testes no gate.
  - Infra de testes com limpeza robusta e scripts segmentados.
- Oportunidades:
  - Reduzir confusão retirando rotas/páginas legadas públicas; marcar EditorPro como legacy.
  - Apontar claramente no README que o editor oficial é o SchemaDrivenEditorResponsive via /editor.

## Plano de consolidação (curto prazo)
1) Rotas: manter /editor apenas com SchemaDrivenEditorResponsive; ocultar páginas alternativas do roteador público.
2) Código: mover EditorPro e variações para src/legacy/ com banner de depreciação; centralizar helpers em src/components/editor/shared.
3) Testes: usar npm run test:run:all segmentado no CI; reservar execução monolítica para ambientes com mais memória.
4) Documentação: manter docs/ARCHITECTURE.md e docs/21-steps-* como fonte de verdade; linkar no README.

## Qualidade atual (gates rápidos)
- Typecheck: PASS (tsc ok).
- Lint: não verificado aqui.
- Testes: PASS com execução segmentada; monolítico pode OOM em teardown dependendo do ambiente.

## Referências rápidas
- Editor oficial: src/pages/MainEditor.tsx, src/components/editor/SchemaDrivenEditorResponsive.tsx, src/components/editor/EditorProvider.tsx
- Resultados: src/utils/quizResultCalculator.ts, src/services/core/ResultOrchestrator.ts, src/services/core/UnifiedQuizStorage.ts
- Diagramas: docs/21-steps-flowchart.md, docs/21-steps-sequence.md
