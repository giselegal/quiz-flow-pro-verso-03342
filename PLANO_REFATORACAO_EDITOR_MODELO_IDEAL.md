prossiga
# Plano de Ação de Refatoração do /editor (Quiz Estilo)

## 1. Visão Geral
Refatorar o `/editor` para eliminar "Provider Hell", reduzir complexidade de hooks e alinhar a experiência de edição do funil **quiz-estilo** com uma arquitetura sustentável (3 camadas: Dados, Lógica, UI). O documento apresenta:
- Estado Atual (problemas + sintomas)
- Estrutura Ideal Alvo
- Comparativo Atual x Ideal x Resultado Esperado
- Passo a Passo de Implementação por Fases
- Métricas de Sucesso e Critérios de Aceite
- Riscos + Mitigações

---
## 2. Estado Atual (Diagnóstico Consolidado)
| Dimensão | Situação Atual | Impactos |
|----------|----------------|----------|
| Providers | 7 níveis aninhados (CRUD → Funnel → Builder → Quiz → Editor → Legacy) | Re-render em cascata, consumo de memória, difícil debug |
| Lazy Loading | `React.lazy` sem prefetch/prioridade; múltiplos `<Suspense>` | Latência perceptível / layout shifting |
| Hooks | Hooks monolíticos (`useQuizSyncBridge`, `useTemplateLifecycle`) | Baixa coesão, difícil teste, acoplamento alto |
| Tipos | `QuizState`, `QuizStateLike`, `QuizBridgeState` coexistem | Erros de tipo, ambiguidade semântica |
| Estado | Redundância de `currentFunnel`, `funnelId`, `isLoading*` | Overfetch e duplicação de lógica |
| Componentes | `EditorProUnified` > 500 linhas | Baixa manutenibilidade |
| Preview | Reset completo para mudanças simples | Perda de fluxo contínuo |
| Drag & Drop | Infra pronta, integração parcial | Falta experiência fluida |
| Export JSON | Inexistente (apenas mapping interno) | Bloqueia validação externa / APIs |

---
## 3. Estrutura Ideal (Arquitetura Alvo)
**Princípios:**
1. Máximo 3 providers em profundidade.
2. Hooks especializados (< 60 linhas) com responsabilidades únicas.
3. Fluxo quiz-estilo padronizado: `stepBlocks` → mapping → runtime preview.
4. Export/Import consistente e determinístico.
5. Code splitting sem penalizar o caminho crítico (toolbar + canvas pré-carregados).

### 3.1 Camadas
| Camada | Responsabilidade | Exemplos |
|--------|------------------|----------|
| Data Layer | Carregamento e cache de funnel / template / quiz | `UnifiedFunnelProvider`, `QuizDataProvider` |
| Logic Layer | Navegação, validação, persistência, sincronização | `EditorCoreProvider`, `StepNavigationProvider` |
| UI Layer | Renderização pura / composição de slots | `EditorLayout`, `Toolbar`, `Canvas`, `PropertiesPanel` |

### 3.2 Contrato de Dados Unificados
```ts
interface Block { id: string; type: string; order: number; properties: any; content?: any }
// stepBlocks: Record<`step-${number}`, Block[]>
interface EditorCoreState { stepBlocks: Record<string, Block[]>; currentStep: number; selection?: { blockId?: string }; dirty: boolean; version: string; }
interface QuizStep { type: string; title?: string; questionText?: string; options?: any[]; requiredSelections?: number }
```

### 3.3 Fluxo Quiz-Estilo
1. Detectar template quiz → carregar adaptador.
2. Converter definição canônica → `stepBlocks`.
3. Navegar com `useEditorCore()` + `useStepNavigation()`.
4. Editar bloco → atualizar estado imutável.
5. Gerar preview live (`mapEditorBlocksToQuizSteps`).
6. Export JSON (botão) → `QuizStep[]` + meta.
7. Persistência incremental (diff hashing).

---
## 4. Comparativo: Atual x Ideal x Resultado Esperado
| Aspecto | Atual | Ideal (Arquitetura) | Resultado após Execução |
|---------|-------|---------------------|--------------------------|
| Profundidade Providers | 7 | ≤ 3 | 3 (consolidado) |
| Hooks > 100 linhas | 2+ | 0 | 0 |
| Bundle Inicial | ~4.2MB | < 2MB | ~1.8MB |
| Preview Reset | Full remount | Hot reload granular | Atualizações < 250ms |
| Export JSON | Não existe | Função + botão UI | JSON estável disponível |
| Tipos duplicados | 3 variantes | 1 único contrato | Apenas `QuizEditorState` |
| Inserção Blocos | Semi-manual / parcial | Paleta → estado unificado | UI responsiva |
| Drag & Drop | Validação isolada | Add/Reorder/Move funcional | UX fluida |
| Lógica Scoring | Placeholder | Modular (plugin scoring) | Opcional plugável |

---
## 5. Fases do Plano de Ação

### Fase 1 – Consolidação de Providers (1–2 dias)
Objetivo: Reduzir profundidade e estabilizar ponto central de estado.
- Criar `EditorRuntimeProviders` (agregando CRUD + Core + QuizData).
- Migrar `ModernUnifiedEditor` para usar novo provider.
- Adicionar feature flag `EDITOR_CORE_V2` para rollback rápido.
- Validar: Sem breaking changes de API externa.

### Fase 2 – Refatoração de Hooks (2–3 dias)
- Dividir `useQuizSyncBridge` → `useQuizPersistence`, `useQuizStateSync`, `useQuizBridgeMetadata`.
- Reescrever `useTemplateLifecycle` → `useTemplateLoader` + `useTemplateValidation` + `useTemplateFallback`.
- Implementar `useEditorCore` encapsulando stepBlocks + seleção + operações.
- Unificar tipos em `src/types/quiz-editor.ts`.

### Fase 3 – Otimização de Carregamento (1–2 dias)
- Prefetch de toolbar/canvas sob idle (`requestIdleCallback`).
- Adicionar hints: `<link rel="prefetch" ...>` ou dynamic `import(/* webpackPrefetch: true */ ...)`.
- Separar chunk de features não críticas (AI, analytics avançados, oferta dinâmica).

### Fase 4 – Decomposição de Componentes (2–3 dias)
- Criar `EditorLayout` agnóstico (slots: sidebar, palette, canvas, properties).
- Quebrar `UnifiedEditorCanvas` em: `CanvasViewport`, `StepRenderer`, `BlockLayer`.
- Isolar `PropertiesPanelCore` vs `PropertiesPanelUI`.

### Fase 5 – Preview & Export (1 dia)
- Implementar `exportFunnel()` + botão na toolbar (copy-to-clipboard + download JSON).
- Introduzir diff hashing para hot reload leve (sem reset total).
- Adicionar painel debug opcional: lista de steps derivadas + hash atual.

### Fase 6 – Drag & Drop Completo (1–2 dias)
- Ligar eventos da paleta para `activeDragData` (tipo `sidebar-component`).
- Implementar `onAddBlock`, `onReorderBlock`, `onMoveBlock` sobre estado central.
- Visual feedback (ghost + highlight dropzone).

### Fase 7 – Extensibilidade (Opcional / Pós) (1–2 dias)
- Plugin scoring: registro de função `computeScores(stepBlocks, answers)`.
- Plugin offers: `resolveOffer(userProfile, scores)`.
- Telemetria leve (tempo por etapa, abandonos). 

---
## 6. Métricas e Critérios de Aceite
| Métrica | Baseline | Target | Critério Aceite |
|---------|----------|--------|-----------------|
| Profundidade Providers | 7 | 3 | Medição via React Profiler |
| TTFB + FMP dev médio | ~4.2s | <2s | Lighthouse local < 2s FMP |
| Re-render Step Edit | Full canvas | Blocos afetados | Profiler mostra diff localizado |
| Tamanho Bundle Inicial | 4.2MB | <2MB | build report (analyzer) |
| Tempo Export JSON | N/A | <50ms | `performance.now()` wrapper |
| Linhas maior hook | 164 | <60 | grep + lint rule |

---
## 7. Riscos e Mitigações
| Risco | Mitigação | Rollback |
|-------|-----------|----------|
| Regressão funcional em quiz | Guard por feature flag | Desativar `EDITOR_CORE_V2` |
| Ciclos de import com reorganização | Barrel central `editor/api` | Reverter commit de layout |
| Perda de estado durante refactor | Snapshot `stepBlocks` + rehydrate | Script restore localStorage/IDB |
| Crescimento temporário de bundle | Marcação `/* DEPRECATE_REMOVE */` e limpeza pós-fase | Limpeza automática script |
| Inconsistência de tipos | ESLint rule + `no-duplicate-imports` + build check | Reverter tip file único |

---
## 8. Roadmap Resumido (Sequência Recomendada)
1. (Dia 1–2) Providers unificados + flag.
2. (Dia 3–5) Hooks separados + tipos unificados.
3. (Dia 6–7) Prefetch + split estratégico.
4. (Dia 8–10) Decomposição UI e layout.
5. (Dia 11) Export + hot reload parcial.
6. (Dia 12–13) Drag & drop completo.
7. (Dia 14+) Plugins scoring/offer e telemetria.

---
## 9. Exemplo de Código Alvo (Simplificado)
```tsx
// EditorRuntimeProviders.tsx (alvo)
export function EditorRuntimeProviders({ funnelId, children }: { funnelId?: string; children: React.ReactNode }) {
  return (
    <UnifiedCRUDProvider funnelId={funnelId} autoLoad>
      <EditorCoreProvider funnelId={funnelId}>
        <QuizDataProvider funnelId={funnelId}>
          {children}
        </QuizDataProvider>
      </EditorCoreProvider>
    </UnifiedCRUDProvider>
  );
}

// Uso no ModernUnifiedEditor
<EditorRuntimeProviders funnelId={resolvedFunnelId}>
  <EditorShell />
</EditorRuntimeProviders>
```

---
## 10. Resultado Final Esperado
- Editor responsivo com preview vivo sem resets totais.
- Experiência de edição do quiz-estilo previsível e exportável.
- Redução significativa de tempo de carregamento e custo cognitivo.
- Base pronta para extensões: analytics granular, AI assistente modular, scoring flexível.
- Documentação refletindo arquitetura limpa e tipos únicos.

---
## 11. Próximas Ações (Immediate Next)
1. Criar `EditorRuntimeProviders` consolidado (scaffold vazio + TODO markers).
2. Introduzir feature flag `EDITOR_CORE_V2` (window global ou env vite).
3. Adicionar relatório de bundle baseline (`npm run build --report`).
4. Preparar PR inicial com somente infra (sem alterar comportamento visível).

Se desejar, posso implementar diretamente o Passo 1 agora.

---
**Fim do Documento**
