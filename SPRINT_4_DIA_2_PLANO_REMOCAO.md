# 🗑️ Sprint 4 - Dia 2: Remoção de Código Depreciado

**Data:** 22/out/2024 (Iniciado em 11/out/2025)  
**Status:** 🔄 **EM EXECUÇÃO**  
**Tempo estimado:** 4-5 horas  
**Objetivo:** Remover ~5,000+ linhas de código depreciado

---

## 🎯 Escopo de Remoção

### Total a Remover: 29 arquivos (~5,000+ linhas)

#### 📦 Grupo 1: Renderers Depreciados (13 arquivos)
**Fase 1 (Sprint 3 - Dia 2):**
- [ ] `src/components/editor/quiz/QuizRenderComponent.tsx` (~350 linhas)
- [ ] `src/components/editor/quiz/QuizRenderer.tsx` (~280 linhas)
- [ ] `src/components/editor/EnhancedQuizRenderer.tsx` (~320 linhas)
- [ ] `src/components/editor/CanvasBlockRenderer.tsx` (~180 linhas)
- [ ] `src/components/editor/CanvasEditorRenderer.tsx` (~210 linhas)
- [ ] `src/components/editor/CanvasBlockListRenderer.tsx` (~168 linhas)
- [ ] `src/components/editor/QuizEditorRenderer.tsx` (~220 linhas)

**Fase 2 (Sprint 4 - Dia 1):**
- [ ] `src/components/editor/quiz/QuizStepRenderer.tsx` (~396 linhas)
- [ ] `src/components/editor/ModularComponentRenderer.tsx` (~485 linhas)
- [ ] `src/components/editor/ModularStepRenderer.tsx` (~237 linhas)
- [ ] `src/editor/components/ModularCanvasRenderer.tsx` (~318 linhas)
- [ ] `src/components/editor/unified/EditorBlockRenderer.tsx` (~203 linhas)
- [ ] `src/components/specialized/SpecializedStepRenderer.tsx` (~163 linhas)

**Subtotal Grupo 1:** ~3,530 linhas

#### 📦 Grupo 2: Editores Legados (14 arquivos)
- [ ] `src/components/editor/VisualFunnelEditor.tsx` (~450 linhas)
- [ ] `src/components/editor/EditorCore.tsx` (~380 linhas)
- [ ] `src/components/editor/CanvasEditor.tsx` (~320 linhas)
- [ ] `src/components/editor/CanvasEditorPro.tsx` (~420 linhas)
- [ ] `src/components/editor/EditorDeFunil.tsx` (~280 linhas)
- [ ] `src/editor/components/EditorCanvas.tsx` (~350 linhas)
- [ ] `src/editor/components/UniversalCanvasEditor.tsx` (~390 linhas)
- [ ] `src/components/editor/FunnelBuilderCanvas.tsx` (~310 linhas)
- [ ] `src/components/editor/FunnelEditor.tsx` (~270 linhas)
- [ ] `src/components/FluxogramaEditor.tsx` (~180 linhas)
- [ ] `src/components/editor/EditorSteps.tsx` (~220 linhas)
- [ ] `src/components/editor/ModularQuizEditor.tsx` (~340 linhas)
- [ ] `src/components/editor/QuizEditor.tsx` (~290 linhas)
- [ ] `src/components/editor/QuizEditorCanvas.tsx` (~310 linhas)

**Subtotal Grupo 2:** ~4,510 linhas

#### 📦 Grupo 3: Providers Obsoletos (2 arquivos)
- [ ] `src/contexts/FunnelProvider.tsx` (~350 linhas)
- [ ] `src/contexts/EditorProvider.tsx` (~280 linhas)

**Subtotal Grupo 3:** ~630 linhas

---

## 📋 Estratégia de Execução

### Fase 1: Análise de Dependências (30 min)
1. [ ] Buscar todas as importações dos arquivos a remover
2. [ ] Identificar arquivos que precisam de atualização
3. [ ] Mapear substitutos para cada importação
4. [ ] Criar lista de arquivos impactados

### Fase 2: Atualização de Importações (1.5h)
1. [ ] Atualizar importações para novos renderers
2. [ ] Substituir componentes depreciados
3. [ ] Validar sintaxe após cada mudança
4. [ ] Commit intermediário: "fix: update imports for new renderers"

### Fase 3: Remoção - Grupo 1 (1h)
1. [ ] Remover 13 renderers depreciados
2. [ ] Validar build após remoção
3. [ ] Commit: "remove: deprecated renderers (13 files, ~3,530 lines)"

### Fase 4: Remoção - Grupo 2 (1h)
1. [ ] Remover 14 editores legados
2. [ ] Validar build após remoção
3. [ ] Commit: "remove: legacy editors (14 files, ~4,510 lines)"

### Fase 5: Remoção - Grupo 3 (30 min)
1. [ ] Remover 2 providers obsoletos
2. [ ] Atualizar referências para novos providers
3. [ ] Validar build final
4. [ ] Commit: "remove: obsolete providers (2 files, ~630 lines)"

### Fase 6: Validação Final (30 min)
1. [ ] Executar TypeScript check (0 erros esperados)
2. [ ] Executar build completo
3. [ ] Verificar bundle size
4. [ ] Atualizar documentação
5. [ ] Commit final: "docs: Sprint 4 Dia 2 - Remoção completa"

---

## 🎯 Critérios de Sucesso

### Qualidade
- [ ] 0 erros TypeScript
- [ ] Build passa sem erros
- [ ] Todos os testes passam (se houver)
- [ ] Bundle size reduzido

### Documentação
- [ ] Lista completa de arquivos removidos
- [ ] Mapeamento de substituições
- [ ] Guia de migração atualizado
- [ ] Changelog atualizado

### Git
- [ ] 5-6 commits granulares
- [ ] Mensagens descritivas
- [ ] Push para origin/main
- [ ] Tag v4.0.0-alpha (opcional)

---

## 📊 Métricas Esperadas

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| **Arquivos** | +29 | -29 | -100% |
| **Linhas de Código** | ~8,670 | ~0 | ~8,670 linhas |
| **Bundle Size** | ~180 KB | ~150 KB | -17% |
| **Renderers** | 26 | 4 | -85% |
| **Editores** | 14 | 1-2 | -86% |
| **Providers** | 4 | 2 | -50% |

---

## 🚀 Execução

### Status Atual
- ⏳ **Fase 1:** Análise de Dependências - INICIANDO
- ⏳ Fase 2: Atualização de Importações
- ⏳ Fase 3: Remoção Grupo 1
- ⏳ Fase 4: Remoção Grupo 2
- ⏳ Fase 5: Remoção Grupo 3
- ⏳ Fase 6: Validação Final

---

**Iniciado por:** GitHub Copilot  
**Data de Início:** 11/out/2025  
**Sprint:** 4 - Dia 2  
**Status:** 🔄 EM EXECUÇÃO
