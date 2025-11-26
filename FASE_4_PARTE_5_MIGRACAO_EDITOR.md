# 🎯 FASE 4 - PARTE 5: Migração de Componentes de Editor

**Data**: 2025-01-XX  
**Status**: ✅ Concluída (2 componentes migrados)  
**Progress Geral Fase 4**: 18/25 componentes (72%)

---

## 📊 Resumo Executivo

### Componentes Migrados (2)
| Componente | Linhas | Hook Antigo | Hook Novo | Status |
|-----------|--------|-------------|-----------|--------|
| ResultPageBuilder.tsx | 82 | `useEditor({ optional: true })` | `useEditorContext().editor` | ✅ |
| StepAnalyticsDashboard.tsx | 85 | `useEditor({ optional: true })` | `useEditorContext().editor` | ✅ |

### Componentes Analisados (Skipped - 2)
| Componente | Hook Usado | Razão do Skip |
|-----------|------------|---------------|
| ResultCTAPrimaryBlock.tsx | `useResult()` | Context especializado para runtime (produção), não editor. Já usa try/catch defensivo |
| SystemStatusPage.tsx | `useSecurity()` | SecurityProvider é sistema especializado (Fase 9), não parte do editor core |

---

## 🔍 Análise Técnica

### 1. ResultPageBuilder.tsx (✅ Migrado)

**Localização**: `src/components/editor/result/ResultPageBuilder.tsx`  
**Tamanho**: 82 linhas  
**Complexidade**: Média

#### Migração Realizada

```typescript
// ❌ ANTES - useEditor com optional flag
import { useEditor } from '@/hooks/useEditor';

const ResultPageBuilder = ({ primaryStyle }) => {
  const editorContext = useEditor({ optional: true });
  if (!editorContext) return null;
  const { actions, state } = editorContext;
  
  // Usar actions.addBlock(), actions.updateBlock(), etc
}
```

```typescript
// ✅ DEPOIS - useEditorContext
import { useEditorContext } from '@/core/hooks/useEditorContext';

const ResultPageBuilder = ({ primaryStyle }) => {
  const { editor } = useEditorContext();
  const { state } = editor;
  
  const actions = {
    addBlock: (step, block) => editor.addBlock(step, block),
    updateBlock: (step, blockId, updates) => editor.updateBlock(step, blockId, updates),
    removeBlock: (step, blockId) => editor.removeBlock(step, blockId),
  };
  
  // actions.addBlock(21, newBlock);
}
```

#### Benefícios
- **API Unificada**: Acesso consistente via `useEditorContext()`
- **Type Safety**: Melhor inferência de tipos do TypeScript
- **Eliminação**: Hook `useEditor` com flag `optional` não é mais necessário
- **Composabilidade**: Facilita acesso a outros contextos (`auth`, `ux`, etc) se necessário

---

### 2. StepAnalyticsDashboard.tsx (✅ Migrado)

**Localização**: `src/components/dev/StepAnalyticsDashboard.tsx`  
**Tamanho**: 85 linhas  
**Tipo**: Componente de desenvolvimento (dashboard de debug)

#### Migração Realizada

```typescript
// ❌ ANTES
import { useEditor } from '@/hooks/useEditor';

const StepAnalyticsDashboard = ({ totalSteps }) => {
  const editorContext = useEditor({ optional: true });
  if (!editorContext) return null;
  const { state } = editorContext;
  
  // Renderizar métricas de state.stepBlocks
}
```

```typescript
// ✅ DEPOIS
import { useEditorContext } from '@/core/hooks/useEditorContext';

const StepAnalyticsDashboard = ({ totalSteps }) => {
  const { editor } = useEditorContext();
  const { state } = editor;
  
  // state.stepBlocks, state.currentStep
}
```

#### Características
- **Simplificação**: Removido check `if (!editorContext)`
- **Direct Access**: `editor.state` ao invés de nível extra de indireção
- **Dev Tool**: Usado para debugging, não em produção

---

## ⏭️ Componentes Analisados (Skipped)

### 3. ResultCTAPrimaryBlock.tsx (❌ Skip)

**Razão**: Context especializado para **runtime/produção**, não editor

```typescript
import { useResult } from '@/contexts/ResultContext';

export default function ResultCTAPrimaryBlock({ block, isSelected, onClick }) {
  let contextAvailable = false;
  let handleCTAClick: ((customUrl?: string) => void) | undefined;

  try {
    const result = useResult();
    handleCTAClick = result.handleCTAClick;
    contextAvailable = true;
  } catch (e) {
    // Editor mode: não há context
    contextAvailable = false;
  }
  
  // ... lógica condicional
}
```

#### Por que NÃO migrar?
1. **ResultContext é isolado**: Específico para páginas de resultado de quiz (produção)
2. **Não faz parte do Editor Core**: Não está em `useEditorContext`
3. **Já usa padrão defensivo**: try/catch para detectar disponibilidade
4. **Propósito diferente**: Runtime analytics, não state management de editor

**Decisão**: Manter como está. ResultContext não precisa consolidação.

---

### 4. SystemStatusPage.tsx (❌ Skip)

**Razão**: SecurityProvider é sistema especializado (Fase 9 - Deploy/Monitoramento)

```typescript
import { useSecurity } from '@/contexts/providers/SecurityProvider';

const SystemStatusPage = () => {
  const { isSecure } = useSecurity();
  
  return (
    <Badge variant={isSecure ? 'default' : 'destructive'}>
      {isSecure ? 'Sistema Saudável' : 'Problemas Detectados'}
    </Badge>
  );
}
```

#### Por que NÃO migrar?
1. **SecurityProvider é Fase 9**: Sistema de monitoramento/deployment, não editor
2. **Não está consolidado**: Não faz parte da arquitetura core (AuthStorageProvider, UXProvider, etc)
3. **Escopo diferente**: Página administrativa, não componente de editor
4. **Isolado intencionalmente**: Security deve ser separado por design

**Decisão**: Manter como está. SecurityProvider não será consolidado em `useEditorContext`.

---

## 📈 Progresso da Fase 4

### Antes da Parte 5
- **Componentes migrados**: 16
- **Hooks deprecated removidos**: 2 (useSuperUnified, useLegacySuperUnified)
- **Linhas removidas**: 343

### Após Parte 5
- **Componentes migrados**: **18** (+2)
- **Taxa de conclusão**: **72%** (18/25 meta)
- **Componentes analisados**: 20 total (18 migrados + 2 skipped)

### Distribuição por Categoria
| Categoria | Quantidade | Percentual |
|-----------|-----------|------------|
| Auth | 9 | 50% |
| Theme/UI | 3 | 16.7% |
| Editor | 2 | 11.1% |
| Testes | 2 | 11.1% |
| Navigation | 1 | 5.6% |
| Dev Tools | 1 | 5.6% |

---

## 🎯 Padrões Identificados

### Padrão 1: useEditor({ optional: true })
**Componentes afetados**: ResultPageBuilder, StepAnalyticsDashboard

```typescript
// ANTES
const ctx = useEditor({ optional: true });
if (!ctx) return null;
const { actions, state } = ctx;

// DEPOIS
const { editor } = useEditorContext();
const { state } = editor;
const actions = {
  addBlock: (step, block) => editor.addBlock(step, block),
  // ... wrap methods conforme necessário
};
```

**Quando usar este padrão**:
- Componentes que usam `useEditor` com flag `optional`
- Componentes que precisam de `actions` do editor (CRUD de blocos)
- Componentes que leem `state.stepBlocks`, `state.currentStep`, etc

---

### Padrão 2: Contexts Especializados (NÃO migrar)
**Exemplos**: ResultContext, SecurityProvider

```typescript
// MANTER ASSIM - não migrar para useEditorContext
try {
  const result = useResult();
  // usar result.handleCTAClick
} catch {
  // fallback
}
```

**Quando NÃO migrar**:
- Contexts especializados para runtime (ResultContext, PreviewContext)
- Providers de sistema (SecurityProvider, DeploymentProvider)
- Hooks externos (next-themes, react-query)
- Hooks utilitários puros (useValidation helper, useDebounce)

---

## 🔄 Próximos Passos

### Parte 6: Buscar Mais Componentes
**Meta**: 25+ componentes (faltam 7-10)

**Áreas prioritárias**:
1. **`src/pages/**/*.tsx`**: Páginas que podem usar `useAuth`, `useTheme`, `useNavigation`
2. **`src/components/admin/**`**: Componentes administrativos
3. **`src/components/dashboard/**`**: Dashboards e painéis
4. **`src/components/editor/blocks/**`**: Blocos de editor que usam contextos

**Estratégia de busca**:
```bash
# Buscar imports de hooks de contexts individuais
grep -r "from '@/contexts/\(auth\|theme\|navigation\|storage\|sync\)" src/components --include="*.tsx"

# Buscar uso de hooks legados
grep -r "use\(Auth\|Theme\|Navigation\|Storage\|Sync\)()" src/components -A 5

# Buscar páginas que podem usar providers
find src/pages -name "*.tsx" -exec grep -l "use\(Auth\|Theme\)" {} \;
```

---

## ✅ Checklist de Conclusão da Parte 5

- [x] Migrar ResultPageBuilder.tsx para `useEditorContext().editor`
- [x] Migrar StepAnalyticsDashboard.tsx para `useEditorContext().editor`
- [x] Analisar ResultCTAPrimaryBlock.tsx (skip - context especializado)
- [x] Analisar SystemStatusPage.tsx (skip - SecurityProvider Fase 9)
- [x] Documentar padrões de migração
- [x] Atualizar tracking de progresso (18/25 = 72%)
- [x] Verificar compilação (0 erros de TypeScript nas migrações)
- [ ] Commit das alterações

---

## 📝 Notas Técnicas

### Diferença: useEditor vs useEditorContext

| Aspecto | useEditor (antigo) | useEditorContext (novo) |
|---------|-------------------|-------------------------|
| Retorno | `{ actions, state }` diretamente | `{ editor: { state, methods } }` |
| Flag optional | Suportado `useEditor({ optional: true })` | Não precisa - sempre disponível |
| Acesso a outros contexts | Não | Sim: `auth`, `ux`, `funnel`, etc |
| Tipagem | Menos específica | Forte com TypeScript |
| Consistência | API variável | API unificada e previsível |

### Quando Criar Wrapper Actions

Alguns componentes legados esperam `actions.addBlock(step, block)`, mas `useEditorContext` expõe `editor.addBlock(step, block, index?)`. Nestes casos, criar um wrapper simples:

```typescript
const { editor } = useEditorContext();
const actions = {
  addBlock: (step, block) => editor.addBlock(step, block),
  updateBlock: (step, blockId, updates) => editor.updateBlock(step, blockId, updates),
  removeBlock: (step, blockId) => editor.removeBlock(step, blockId),
};

// Usar actions.addBlock() como antes
```

---

## 🎉 Conclusão

**Parte 5 bem-sucedida**: 2 componentes migrados para `useEditorContext`, eliminando dependência de `useEditor({ optional: true })`.

**Progresso Fase 4**: 18/25 componentes (72%) - faltam ~7-10 componentes para meta.

**Próxima ação**: Parte 6 - buscar e migrar componentes em `src/pages/`, `src/components/admin/`, e outros que ainda usam hooks individuais de providers.
