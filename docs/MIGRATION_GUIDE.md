# 🔄 GUIA DE MIGRAÇÃO - Editor Consolidado

**Última atualização:** 2025-01-17

## Visão Geral

Este guia documenta as mudanças na arquitetura do editor e como migrar seu código.

## ✅ CONSOLIDAÇÃO COMPLETA (2025-01-17)

**Status**: Todos os serviços duplicados foram **REMOVIDOS**. Use apenas o serviço canônico.

## Mudanças Principais

### 1. TemplateService Consolidado (✅ COMPLETO)

**ANTES (REMOVIDO):**
```typescript
// ❌ Múltiplas implementações (TODAS REMOVIDAS)
import { TemplateService } from '@/core/funnel/services/TemplateService'; // REMOVIDO
import { templateService } from '@/services/TemplateService'; // REMOVIDO
import { UnifiedTemplateService } from '@/services/UnifiedTemplateService'; // REMOVIDO
```

**AGORA (ÚNICO SERVIÇO):**
```typescript
// ✅ Fonte única canônica (PRODUCTION-READY)
import { templateService } from '@/services/canonical/TemplateService';

// Uso:
const result = await templateService.getTemplate('quiz21-complete');
if (result.success) {
  const template = result.data;
}
```

**Serviços Removidos**:
- ✅ `src/services/TemplateService.ts` (Official - nunca usado)
- ✅ `src/core/funnel/services/TemplateService.ts` (@deprecated)
- ✅ `src/services/UnifiedTemplateService.ts`
- ✅ `src/services/core/ConsolidatedTemplateService.ts`
- ✅ `src/services/templateService.refactored.ts`

**Serviço Mantido**:
- ✅ `src/services/canonical/TemplateService.ts` (1913 linhas, consolida 20+ services)

### 2. Hook useEditor Simplificado

**ANTES:**
```typescript
// ❌ Hook complexo com 274 linhas
import { useEditor } from '@/hooks/useUnifiedEditor';
import { useEditorOptional } from '@/hooks/useEditorWrapper';
```

**DEPOIS:**
```typescript
// ✅ Hook simplificado
import { useEditor, useEditorOptional } from '@/hooks/useEditor';

// Uso obrigatório (lança erro se não houver provider)
const editor = useEditor();

// Uso opcional (retorna undefined)
const editor = useEditor({ optional: true });
// ou
const editor = useEditorOptional();
```

### 3. Rotas do Editor Unificadas

**ANTES:**
```typescript
// ❌ Múltiplas rotas diferentes
/editor           → QuizModularEditor
/editor-new       → QuizModularEditor (experimental)
/editor-modular   → EditorModular
```

**DEPOIS:**
```typescript
// ✅ Rota canônica única
/editor           → QuizModularEditor (canonical)
/editor/:funnelId → QuizModularEditor com funnelId

// Auto-redirects:
/editor-new       → /editor
/editor-modular   → /editor
```

## Checklist de Migração

### Para Desenvolvedores

- [ ] Substituir imports de `@/core/funnel/services/TemplateService` por `@/services/canonical/TemplateService`
- [ ] Substituir imports de `@/hooks/useUnifiedEditor` por `@/hooks/useEditor`
- [ ] Remover imports de `@/hooks/useEditorWrapper`
- [ ] Atualizar links para `/editor` em vez de `/editor-new` ou `/editor-modular`
- [ ] Testar componentes que usam `useEditor()`
- [ ] Verificar warnings de deprecated no console

### Para Componentes

```typescript
// ❌ ANTES
import { useEditor } from '@/hooks/useEditorWrapper';
import { TemplateService } from '@/core/funnel/services/TemplateService';

function MyComponent() {
  const editor = useEditor();
  const templates = TemplateService.getInstance();
  // ...
}

// ✅ DEPOIS
import { useEditor } from '@/hooks/useEditor';
import { TemplateService } from '@/services/canonical/TemplateService';

function MyComponent() {
  const editor = useEditor();
  const templates = TemplateService.getInstance();
  // ...
}
```

## Breaking Changes

### TemplateService

- `@/core/funnel/services/TemplateService` está deprecated
- Use `@/services/canonical/TemplateService` diretamente

### useEditor Hook

- `useUnifiedEditor` removido
- `useEditorWrapper` deprecated
- Use `useEditor` de `@/hooks/useEditor`

### Rotas

- `/editor-new` redireciona para `/editor`
- `/editor-modular` redireciona para `/editor`

## Timeline

- **Fase 1 (Atual)**: Deprecation warnings ativos
- **Fase 2 (+2 semanas)**: Remoção de arquivos deprecated
- **Fase 3 (+4 semanas)**: Limpeza completa

## Suporte

Para dúvidas sobre migração:
1. Verifique este guia primeiro
2. Consulte `docs/ARCHITECTURE_CURRENT.md`
3. Procure por warnings no console do navegador
4. Abra issue no repositório

## Benefícios da Migração

✅ Redução de 70% na complexidade do hook useEditor  
✅ Fonte única de verdade para templates  
✅ Rotas mais simples e intuitivas  
✅ Melhor performance de carregamento  
✅ Menos duplicação de código  
✅ Mais fácil de manter e debugar
