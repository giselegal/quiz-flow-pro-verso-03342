# 🗑️ Sprint 4 - Dia 2: Lista Atualizada de Remoção

**Data de Análise:** 11/out/2025  
**Status:** 📋 ANÁLISE COMPLETA  

---

## ✅ Arquivos QUE EXISTEM e Serão Removidos

### 📦 Grupo 1: Renderers Depreciados (6 arquivos - Fase 2)

| # | Arquivo | Linhas | Status | Importado Por |
|---|---------|--------|--------|---------------|
| 1 | `src/components/editor/quiz/QuizStepRenderer.tsx` | ~396 | ✅ Existe | Nenhum (apenas docs) |
| 2 | `src/components/editor/ModularComponentRenderer.tsx` | ~485 | ✅ Existe | ModularStepRenderer (também será removido) |
| 3 | `src/components/editor/ModularStepRenderer.tsx` | ~237 | ✅ Existe | Nenhum (apenas docs) |
| 4 | `src/editor/components/ModularCanvasRenderer.tsx` | ~318 | ✅ Existe | QuizFunnelEditorWYSIWYG (deprecated) |
| 5 | `src/components/editor/unified/EditorBlockRenderer.tsx` | ~203 | ✅ Existe | Nenhum |
| 6 | `src/components/specialized/SpecializedStepRenderer.tsx` | ~163 | ✅ Existe | **ScalableQuizRenderer** ⚠️ |

**Subtotal:** ~1,802 linhas

### 📦 Grupo 2: Editores Deprecados que Existem (1 arquivo confirmado)

| # | Arquivo | Linhas | Status | Nota |
|---|---------|--------|--------|------|
| 1 | `src/components/editor/quiz/QuizFunnelEditorWYSIWYG.tsx` | ~1,199 | ✅ Existe | Já marcado DEPRECATED |

**Nota:** A maioria dos 14 editores da lista original já foi removida em sprints anteriores.

**Subtotal:** ~1,199 linhas

### 📦 Grupo 3: Providers (1 arquivo)

| # | Arquivo | Linhas Est. | Status | Nota |
|---|---------|-------------|--------|------|
| 1 | `src/components/editor/EditorProvider.tsx` | ~280 | ✅ Existe | Verificar se está deprecated |

**Subtotal:** ~280 linhas

---

## ⚠️ BLOQUEIO IDENTIFICADO

### ScalableQuizRenderer depende de SpecializedStepRenderer

**Arquivo:** `src/components/core/ScalableQuizRenderer.tsx` (linha 7)  
**Import:** `import SpecializedStepRenderer from '@/components/specialized/SpecializedStepRenderer';`  
**Uso:** Linha 338 - renderiza steps especializados (1, 20, 21)

**Status:** ScalableQuizRenderer é um componente **CORE** ativo e NÃO será removido

### 🔧 Solução Necessária

**Opção 1: Adapter Pattern (RECOMENDADO)**
- Criar `SpecializedStepAdapter.tsx` que converte interface antiga para UnifiedStepRenderer
- Manter retrocompatibilidade
- Permite remoção gradual

**Opção 2: Atualizar ScalableQuizRenderer**
- Refatorar para usar UnifiedStepRenderer diretamente
- Adaptar interface (stepNumber → stepId, etc.)
- Mais complexo, maior risco

**Opção 3: Manter SpecializedStepRenderer Temporariamente**
- Não remove da Fase 2
- Marca para remoção em Sprint 5
- Mantém funcionalidade atual

---

## 📋 TOTAL ATUALIZADO PARA REMOÇÃO

| Grupo | Arquivos | Linhas Estimadas |
|-------|----------|------------------|
| **Grupo 1: Renderers** | 5 arquivos* | ~1,639 linhas |
| **Grupo 2: Editores** | 1 arquivo | ~1,199 linhas |
| **Grupo 3: Providers** | 0-1 arquivo** | ~0-280 linhas |
| **TOTAL** | **6-7 arquivos** | **~2,838-3,118 linhas** |

\* *Excluindo SpecializedStepRenderer temporariamente*  
\** *EditorProvider precisa de análise para confirmar se está deprecated*

---

## 🎯 Plano de Ação Revisado

### Fase 1: Análise de EditorProvider (15 min)
- [ ] Ler EditorProvider.tsx
- [ ] Verificar se está marcado deprecated
- [ ] Verificar importações ativas
- [ ] Decidir: Remover ou Manter

### Fase 2: Decisão sobre SpecializedStepRenderer (30 min)
- [ ] Avaliar complexidade de cada opção
- [ ] Implementar solução escolhida
- [ ] Validar ScalableQuizRenderer continua funcionando

### Fase 3: Remoção - Grupo 1 (45 min)
- [ ] Remover 5 renderers seguros
- [ ] Validar build
- [ ] Commit: "remove: 5 deprecated renderers (~1,639 lines)"

### Fase 4: Remoção - Grupo 2 (15 min)
- [ ] Remover QuizFunnelEditorWYSIWYG
- [ ] Atualizar rotas se necessário
- [ ] Validar build
- [ ] Commit: "remove: deprecated editor (~1,199 lines)"

### Fase 5: Remoção - Grupo 3 (15 min)
- [ ] Remover EditorProvider (se aplicável)
- [ ] Atualizar importações
- [ ] Validar build
- [ ] Commit: "remove: deprecated provider (~280 lines)"

### Fase 6: Documentação (15 min)
- [ ] Atualizar relatório final
- [ ] Criar changelog
- [ ] Commit: "docs: Sprint 4 Dia 2 - Remoção completa"

---

## 🚦 Status Decisório

**AGUARDANDO DECISÃO:**
1. ☐ Como proceder com SpecializedStepRenderer?
2. ☐ EditorProvider está deprecated?

**PRONTO PARA REMOÇÃO:**
- ✅ QuizStepRenderer
- ✅ ModularComponentRenderer
- ✅ ModularStepRenderer
- ✅ ModularCanvasRenderer
- ✅ EditorBlockRenderer
- ✅ QuizFunnelEditorWYSIWYG

---

**Atualizado por:** GitHub Copilot  
**Data:** 11/out/2025  
**Sprint:** 4 - Dia 2 - Análise
