# 🚨 Relatório de Deprecação - FASE 2

> **Data:** 2025-01-25  
> **Status:** ✅ Concluído  
> **Task:** #7 - Deprecar contextos legados

---

## 📋 Resumo Executivo

Adicionados warnings de deprecação em **4 arquivos legados** que serão removidos nas FASE 3 e FASE 4:

| Arquivo | Linhas | Status | Remoção |
|---------|--------|--------|---------|
| `useEditorAdapter.ts` | 317 | ⚠️ DEPRECATED | FASE 3 |
| `usePureBuilderCompat.ts` | 158 | ⚠️ DEPRECATED | FASE 3 |
| `EditorContext.tsx` (legado) | 1072 | ⚠️ DEPRECATED | FASE 4 |
| `QuizV4Provider.tsx` | 505 | ⚠️ DEPRECATED | FASE 4 |

**Total:** 2.052 linhas de código legado marcado para remoção.

---

## ✅ Ações Realizadas

### 1. **useEditorAdapter.ts**

**Localização:** `src/hooks/editor/useEditorAdapter.ts`

**Warnings Adicionados:**

- ✅ JSDoc `@deprecated` com guia de migração completo
- ✅ Console warning em desenvolvimento
- ✅ Link para documentação (`docs/LEGACY_HOOKS_DEPRECATION.md`)

**Exemplo de Warning:**

```typescript
/**
 * @deprecated Este hook está DEPRECATED e será removido na FASE 3.
 * 
 * ⚠️ INCOMPATÍVEL com @core/contexts/EditorContext.
 * Criado para abstrair diferenças entre EditorContext.tsx e QuizV4Provider.tsx (ambos legados).
 * 
 * MIGRAÇÃO:
 * // ❌ Antigo (deprecated)
 * import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter';
 * const editor = useEditorAdapter();
 * editor.deleteBlock(blockId);
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/hooks';
 * const editor = useEditor();
 * editor.removeBlock(step, blockId);
 */
```

**Console Warning:**

```
🚨 DEPRECATED: useEditorAdapter será removido na FASE 3.
Migre para: import { useEditor } from "@/core/hooks";
Veja: docs/LEGACY_HOOKS_DEPRECATION.md
```

**Motivo da Deprecação:**

- Hook criado para abstrair diferenças entre contextos legados
- Com @core, não é mais necessário
- API incompatível: espera `deleteBlock(id)` mas @core fornece `removeBlock(step, id)`

---

### 2. **usePureBuilderCompat.ts**

**Localização:** `src/hooks/usePureBuilderCompat.ts`

**Warnings Adicionados:**

- ✅ JSDoc `@deprecated` com guia de migração
- ✅ Console warning em desenvolvimento
- ✅ Link para documentação

**Exemplo de Warning:**

```typescript
/**
 * @deprecated Este hook está DEPRECATED e será removido na FASE 3.
 * 
 * ⚠️ INCOMPATÍVEL com @core/contexts/EditorContext.
 * Criado para abstrair API "PureBuilder" (legada).
 * 
 * MIGRAÇÃO:
 * // ❌ Antigo (deprecated)
 * import { usePureBuilder } from '@/hooks/usePureBuilderCompat';
 * const { actions } = usePureBuilder();
 * actions.addBlock(stepKey, block);
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/hooks';
 * const editor = useEditor();
 * editor.addBlock(step, block);
 */
```

**Motivo da Deprecação:**

- Hook criado para compatibilidade com API "PureBuilder" legada
- API confusa e complexa de manter
- @core fornece API mais limpa e type-safe

---

### 3. **EditorContext.tsx (legado)**

**Localização:** `src/contexts/editor/EditorContext.tsx`

**Warnings Adicionados:**

- ✅ JSDoc `@deprecated` no topo do arquivo
- ✅ Console warning executado no carregamento
- ✅ Link para arquitetura @core

**Exemplo de Warning:**

```typescript
/**
 * @deprecated Este EditorContext legado está DEPRECATED e será removido na FASE 4.
 * 
 * ⚠️ USE @core/contexts/EditorContext PARA NOVOS DESENVOLVIMENTOS.
 * 
 * Este arquivo contém a implementação legada (1072 linhas) que será substituída.
 * Mantido temporariamente para compatibilidade com componentes não migrados.
 * 
 * MIGRAÇÃO:
 * // ❌ Antigo (deprecated)
 * import { useEditor } from '@/contexts/editor/EditorContext';
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/contexts/EditorContext';
 */
```

**Console Warning:**

```
🚨 DEPRECATED: EditorContext legado em uso.
Migre para: import { EditorStateProvider } from "@/core/contexts/EditorContext";
Veja: docs/CORE_ARCHITECTURE_MIGRATION.md
```

**Motivo da Deprecação:**

- Implementação monolítica com 1072 linhas
- Mistura state, actions e business logic
- @core separa responsabilidades (state + actions + compat layer)

---

### 4. **QuizV4Provider.tsx**

**Localização:** `src/contexts/quiz/QuizV4Provider.tsx`

**Warnings Adicionados:**

- ✅ JSDoc `@deprecated` no topo do arquivo
- ✅ Console warning executado no carregamento
- ✅ Link para arquitetura @core

**Exemplo de Warning:**

```typescript
/**
 * @deprecated Este QuizV4Provider está DEPRECATED e será removido na FASE 4.
 * 
 * ⚠️ USE @core/contexts/EditorContext PARA NOVOS DESENVOLVIMENTOS.
 * 
 * Provider legado que integra:
 * - Carregamento de quiz21-v4.json
 * - Validação com Zod schemas
 * - Logic Engine para navegação
 * 
 * MIGRAÇÃO:
 * // ❌ Antigo (deprecated)
 * import { useQuizV4 } from '@/contexts/quiz/QuizV4Provider';
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/contexts/EditorContext';
 */
```

**Motivo da Deprecação:**

- Sistema paralelo que duplica funcionalidade
- @core consolida toda a lógica de editor
- Evita manutenção de múltiplos contextos

---

## 📊 Análise de Impacto

### Componentes Afetados (Estimativa)

```bash
# Buscar usages de hooks deprecated
grep -r "useEditorAdapter" src/components --include="*.tsx" --include="*.ts"
# Resultado: ~5-7 componentes

grep -r "usePureBuilder" src/components --include="*.tsx" --include="*.ts"
# Resultado: ~3-5 componentes

grep -r "EditorContext" src/ --include="*.tsx" --include="*.ts" | grep "from '@/contexts/editor"
# Resultado: ~15-20 imports

grep -r "QuizV4Provider" src/ --include="*.tsx" --include="*.ts"
# Resultado: ~2-3 componentes
```

**Total Estimado:** 25-35 arquivos precisarão de migração na FASE 3.

---

## 🎯 Estratégia de Remoção

### FASE 3 (Próxima):

**1. Migrar Componentes (Task #8)**

- Identificar todos os componentes que usam hooks deprecated
- Migrar para `@core/hooks/useEditor`
- Testar cada migração isoladamente
- Atualizar testes E2E

**Prioridade:** 🔴 Alta  
**Esforço:** 3-4 dias

**2. Remover Hooks Deprecated**

Após migração completa de componentes:

- ❌ Remover `src/hooks/editor/useEditorAdapter.ts`
- ❌ Remover `src/hooks/usePureBuilderCompat.ts`
- ✅ Manter `src/hooks/useEditor.ts` (wrapper temporário)

**Prioridade:** 🟡 Média  
**Esforço:** 1 dia

---

### FASE 4 (Final):

**1. Remover Contextos Legados**

Após todos os componentes migrarem para @core:

- ❌ Remover `src/contexts/editor/EditorContext.tsx` (1072 linhas)
- ❌ Remover `src/contexts/quiz/QuizV4Provider.tsx` (505 linhas)
- ❌ Remover `src/hooks/useEditor.ts` (wrapper)

**Prioridade:** 🟢 Baixa  
**Esforço:** 2 dias

**2. Limpar Imports**

- Buscar e substituir imports legados
- Validar com TypeScript (erros de compilação)
- Executar testes E2E completos

---

## 🔍 Como Identificar Uso de APIs Deprecated

### 1. **No Editor (VSCode)**

Ao importar um hook deprecated, você verá:

- ~~Linha riscada~~ (strikethrough) no import
- Tooltip com mensagem de deprecação
- Link para guia de migração

**Exemplo:**

```typescript
import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter'; // Deprecated warning
//       ^^^^^^^^^^^^^^^^
```

### 2. **No Console (Desenvolvimento)**

Ao usar qualquer API deprecated, você verá:

```
🚨 DEPRECATED: useEditorAdapter será removido na FASE 3.
Migre para: import { useEditor } from "@/core/hooks";
Veja: docs/LEGACY_HOOKS_DEPRECATION.md
```

### 3. **No Build (TypeScript)**

TypeScript irá reportar warnings (não erros) para APIs deprecated:

```
src/components/MyComponent.tsx:5:10 - warning TS6387: 
'useEditorAdapter' is deprecated.
```

---

## 📚 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| `docs/LEGACY_HOOKS_DEPRECATION.md` | Guia completo de incompatibilidades |
| `docs/CORE_ARCHITECTURE_MIGRATION.md` | Arquitetura @core (800+ linhas) |
| `docs/FASE_2_PROGRESS_REPORT.md` | Progresso detalhado FASE 2 |
| `docs/FASE_2_RESUMO_EXECUTIVO.md` | Resumo executivo FASE 2 |

---

## ✅ Checklist de Validação

- [x] JSDoc `@deprecated` adicionado em todos os arquivos
- [x] Console warnings adicionados em desenvolvimento
- [x] Links para documentação incluídos
- [x] Guias de migração com exemplos práticos
- [x] Motivos de deprecação documentados
- [x] Plano de remoção definido (FASE 3 e 4)
- [x] Análise de impacto realizada
- [x] Estratégia de migração definida

---

## 🎓 Lições Aprendidas

### ✅ O que Funcionou Bem:

1. **Warnings de Console Claros** - Desenvolvedores veem imediatamente o problema
2. **JSDoc Deprecation** - Ferramentas (VSCode, TypeScript) mostram warnings
3. **Guias de Migração Inline** - Exemplos práticos no próprio código
4. **Links para Documentação** - Contexto completo disponível

### 🔄 Melhorias Futuras:

1. **Criar Codemod Automático** - Script para migrar imports automaticamente
2. **ESLint Rule Customizada** - Bloquear uso de APIs deprecated em novos PRs
3. **Testes de Integração** - Validar que @core funciona em todos os cenários
4. **Dashboard de Progresso** - Visualizar quantos componentes faltam migrar

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| Arquivos deprecated | 4 |
| Linhas de código legado | 2.052 |
| Console warnings | 4 |
| JSDoc deprecations | 4 |
| Componentes afetados (estimado) | 25-35 |
| Esforço de migração (FASE 3) | 3-4 dias |
| Esforço de remoção (FASE 4) | 2 dias |
| Redução de código (após FASE 4) | ~2.000 linhas |

---

## 🚀 Próximos Passos

1. **Implementar Core Modules** (Prioridade: 🔴 Alta)
   - `featureFlags.ts` (30+ testes esperando)
   - `persistenceService.ts` (25+ testes esperando)
   - `useBlockDraft.ts` (25+ testes esperando)

2. **Task #8: Migrar Componentes Críticos** (Prioridade: 🔴 Alta)
   - QuizModularEditor
   - PropertiesPanel (7 implementações → 1)
   - CanvasDropZone
   - Layouts principais

3. **Remover Hooks Deprecated** (FASE 3)

4. **Remover Contextos Legados** (FASE 4)

---

**Última atualização:** 2025-01-25  
**Responsável:** Equipe Core Architecture  
**Status:** ✅ Task #7 Concluída
