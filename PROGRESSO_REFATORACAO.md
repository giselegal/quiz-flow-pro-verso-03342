# Progresso da Refatoração Sistêmica

**Data de Início:** 2025-12-04  
**Status:** Em andamento

---

## Fase 1: Correções Críticas ✅ CONCLUÍDA

### 1.1 Template Canônico Criado ✅
- **Ação:** Criado `public/templates/quiz21-v4.json`
- **Fonte:** Copiado de `src/templates/quiz21StepsComplete.json`
- **Impacto:** Elimina 70+ referências a arquivos inexistentes

### 1.2 Paths Atualizados ✅
Todos os arquivos abaixo foram atualizados para usar `/templates/quiz21-v4.json`:

| Arquivo | Status |
|---------|--------|
| `src/services/canonical/TemplateService.ts` | ✅ |
| `src/services/templates/UnifiedTemplateLoader.ts` | ✅ |
| `src/hooks/useMasterRuntime.ts` | ✅ |
| `src/pages/EditorV4.tsx` | ✅ |
| `src/services/editor/TemplateLoader.ts` | ✅ |
| `src/templates/loaders/jsonStepLoader.ts` | ✅ |
| `src/core/quiz/hooks/useQuizV4Loader.ts` | ✅ |
| `src/hooks/useQuizV4Loader.ts` | ✅ |
| `src/hooks/useTemplateConfig.ts` | ✅ |
| `tests/perf/json-load-benchmark.test.ts` | ✅ |

### 1.3 Serviços Duplicados Removidos ✅
| Arquivo Deletado | Razão |
|------------------|-------|
| `src/core/services/ITemplateService.ts` | Duplicado de canonical |
| `src/core/services/TemplateService.ts` | Duplicado de canonical (2038 linhas) |
| `src/core/services/TemplateServiceAdapter.ts` | Redundante |
| `src/core/services/__tests__/ITemplateService.contract.test.ts` | Teste órfão |
| `src/core/services/__tests__/TemplateService.activeTemplate.test.ts` | Teste órfão |

### 1.4 Index Atualizado ✅
- `src/core/services/index.ts` → Redireciona para canonical

---

## Fase 3: Limpeza de Componentes ✅ PARCIAL

### 3.1 Variantes IntroStep Removidas ✅
| Arquivo Deletado | Linhas |
|------------------|--------|
| `src/components/quiz/IntroStepDebug.tsx` | 34 |
| `src/components/quiz/IntroStepDirect.tsx` | ~100 |
| `src/components/quiz/IntroStepFixed.tsx` | ~170 |
| `src/components/quiz/IntroStepNew.tsx` | ~150 |
| `src/components/quiz/IntroStepSimple.tsx` | ~100 |

- **Total removido:** ~554 linhas de código duplicado
- **Mantido:** `src/components/quiz/IntroStep.tsx` (principal)

### 3.2 Exportações Limpas ✅
- `src/components/quiz/index.ts` → Removidas exportações das variantes deletadas

---

## Próximas Fases (Pendentes)

### Fase 2: Consolidação de Hooks ✅ CONCLUÍDA

### 2.1 Hook Canônico Criado ✅
- **Arquivo:** `src/hooks/canonical/useEditorCanonical.ts` (~450 linhas)
- **Funcionalidades consolidadas:**
  - State management (currentStep, selectedBlockId, stepBlocks)
  - Block operations (add, update, remove, duplicate, reorder)
  - History management (undo/redo com 50 estados)
  - Persistence (save, isDirty, auto-save)
  - Preview mode
  - Navigation (nextStep, previousStep)

### 2.2 Barrel Export Criado ✅
- **Arquivo:** `src/hooks/canonical/index.ts`
- **Exports:** useEditorCanonical, useEditor, useEditorOptional

### 2.3 Index Atualizado ✅
- `src/hooks/editor/index.ts` → Exporta do canonical + compatibilidade
- `src/hooks/index.ts` → Exporta hooks canônicos primeiro

### 2.4 Arquivos Vazios Removidos ✅
- `src/hooks/editor/useKeyboardShortcuts.ts` (vazio)
- `src/hooks/editor/useUndoRedo.ts` (vazio)

---

## Próximas Fases (Pendentes)
- [ ] Mover 100+ arquivos .md da raiz para `docs/archive/`
- [ ] Dividir `blockPropertySchemas.ts` (116KB) em módulos

### Fase 5: Segurança 🔒
- [ ] Habilitar Leaked Password Protection no Supabase

---

## Métricas de Impacto

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Arquivos de serviço duplicados | 3 | 0 | -100% |
| Variantes IntroStep | 6 | 1 | -83% |
| Referências a path inexistente | 70+ | 0 | -100% |
| Linhas de código morto removidas | - | ~2700 | - |

---

## Arquivos Criados/Atualizados

### Criados
- `public/templates/quiz21-v4.json` - Template canônico V4

### Atualizados (10 arquivos)
- Paths de template corrigidos para path canônico

### Deletados (10 arquivos)
- 5 variantes IntroStep
- 3 serviços duplicados
- 2 testes órfãos
