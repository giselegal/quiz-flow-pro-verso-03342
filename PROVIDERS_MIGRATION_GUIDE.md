# 📋 GUIA DE MIGRAÇÃO DE PROVIDERS

**Documento**: Guia de Referência para Migração EditorProviderCanonical  
**Data**: 8 de Novembro de 2025  
**Status**: ✅ Migração Concluída

---

## 🎯 OBJETIVO

Este documento fornece orientações para migrar de providers antigos/deprecated para o **EditorProviderCanonical**, que é o único provider ativo recomendado.

---

## 📦 PROVIDERS AFETADOS

### ❌ DEPRECATED (NÃO USAR MAIS)

1. **EditorProviderUnified** → Alias deprecated de EditorProviderCanonical
2. **EditorProviderAdapter** → Wrapper antigo, consolidado
3. **EditorProviderMigrationAdapter** → Adapter temporário, consolidado

### ✅ CANONICAL (USAR)

- **EditorProviderCanonical** → Único provider ativo

---

## 🔄 PADRÕES DE MIGRAÇÃO

### Padrão 1: Import Básico

```tsx
// ❌ ANTES
import { EditorProvider } from '@/components/editor/EditorProviderMigrationAdapter';

// ✅ DEPOIS
import { EditorProviderCanonical as EditorProvider } from '@/components/editor/EditorProviderCanonical';
```

### Padrão 2: Import com Hook

```tsx
// ❌ ANTES
import { EditorProvider, useEditor } from '@/components/editor/EditorProviderMigrationAdapter';

// ✅ DEPOIS
import { EditorProviderCanonical as EditorProvider, useEditor } from '@/components/editor/EditorProviderCanonical';
```

### Padrão 3: Import Direto (Recomendado)

```tsx
// ✅ MELHOR OPÇÃO
import { EditorProviderCanonical, useEditor } from '@/components/editor/EditorProviderCanonical';

// No JSX
<EditorProviderCanonical funnelId={id}>
  {children}
</EditorProviderCanonical>
```

### Padrão 4: Import de Tipos

```tsx
// ❌ ANTES
import type { EditorState } from '@/components/editor/EditorProviderMigrationAdapter';

// ✅ DEPOIS
import type { EditorState } from '@/components/editor/EditorProviderCanonical';
```

### Padrão 5: Lazy Imports

```tsx
// ❌ ANTES
const LazyEditorProvider = lazy(() =>
  import('@/components/editor/EditorProviderMigrationAdapter').then(module => ({
    default: module.EditorProvider,
  }))
);

// ✅ DEPOIS
const LazyEditorProvider = lazy(() =>
  import('@/components/editor/EditorProviderCanonical').then(module => ({
    default: module.EditorProviderCanonical,
  }))
);
```

---

## 🛠️ SCRIPT DE MIGRAÇÃO AUTOMATIZADA

Para migrar múltiplos arquivos de uma vez, use o script:

```bash
bash scripts/migrate-to-canonical-provider.sh
```

**O que o script faz:**
- ✅ Cria backups `.bak` de todos os arquivos
- ✅ Substitui imports antigos por EditorProviderCanonical
- ✅ Atualiza tipos e exports
- ✅ Valida migrações automaticamente

---

## 📖 API DO EDITORPROVIDERCANONICAL

### Props

```tsx
interface EditorProviderCanonicalProps {
  children: ReactNode;
  funnelId?: string;
  quizId?: string;
  storageKey?: string;
  enableSupabase?: boolean;
}
```

### Hook useEditor

```tsx
const editor = useEditor();

// Métodos disponíveis
editor.stages           // EditorStep[]
editor.activeStageId    // string | null
editor.selectedBlockId  // string | null
editor.isPreviewing     // boolean

// Actions
editor.setIsPreviewing(true)
editor.stageActions.setActiveStage(stageId)
editor.blockActions.addBlock(type)
editor.blockActions.updateBlock(id, updates)
editor.blockActions.deleteBlock(id)
editor.blockActions.reorderBlocks(startIdx, endIdx)
editor.blockActions.setSelectedBlockId(id)
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

### Para cada arquivo:

- [ ] Substituir import de provider antigo
- [ ] Substituir import de tipos (se houver)
- [ ] Atualizar componente JSX (se houver `<EditorProvider>`)
- [ ] Verificar lazy imports / preloads
- [ ] Executar `npm run type-check`
- [ ] Testar funcionalidade localmente

### Para o projeto:

- [x] ✅ Rodar script de migração automatizada
- [x] ✅ Corrigir imports relativos manualmente (3 arquivos)
- [x] ✅ Remover arquivos `.bak` após validação
- [x] ✅ Validar 0 erros TypeScript
- [x] ✅ Validar build passing
- [x] ✅ Atualizar documentação

---

## 🐛 PROBLEMAS COMUNS

### Problema 1: Erro "Cannot find module EditorProviderCanonical"

**Causa:** Import path incorreto (relativo vs absoluto)

**Solução:**
```tsx
// ❌ ERRADO
import { EditorProviderCanonical } from '../EditorProviderMigrationAdapter';

// ✅ CORRETO
import { EditorProviderCanonical } from '@/components/editor/EditorProviderCanonical';
```

### Problema 2: Hook useEditor retorna undefined

**Causa:** Componente não está dentro de `<EditorProviderCanonical>`

**Solução:**
```tsx
// Garantir que o provider envolve o componente
<EditorProviderCanonical>
  <ComponenteQueUsaUseEditor />
</EditorProviderCanonical>
```

### Problema 3: TypeScript reclama de tipo incompatível

**Causa:** Import de tipo do provider antigo

**Solução:**
```tsx
// ❌ ANTES
import type { EditorState } from '@/components/editor/EditorProviderMigrationAdapter';

// ✅ DEPOIS
import type { EditorState } from '@/components/editor/EditorProviderCanonical';
```

---

## 📚 REFERÊNCIAS

### Documentação Relacionada

- `AUDITORIA_FASE_2_CONCLUIDA.md` - Relatório completo da migração
- `AUDITORIA_QUIZ21_PROGRESSO.md` - Progresso geral da auditoria
- `src/components/editor/EditorProviderCanonical.tsx` - Código fonte

### Arquivos Principais

```
src/
├── components/editor/
│   ├── EditorProviderCanonical.tsx        ✅ USAR
│   ├── EditorProviderMigrationAdapter.tsx ⚠️ DEPRECATED
│   ├── EditorProviderAdapter.tsx          ⚠️ DEPRECATED
│   └── index.ts                           (exports com deprecations)
```

---

## 💡 MELHORES PRÁTICAS

### DO ✅

1. **Use EditorProviderCanonical diretamente**
   ```tsx
   import { EditorProviderCanonical } from '@/components/editor/EditorProviderCanonical';
   ```

2. **Use alias apenas se necessário para compatibilidade**
   ```tsx
   import { EditorProviderCanonical as EditorProvider } from '@/components/editor/EditorProviderCanonical';
   ```

3. **Importe tipos do provider canônico**
   ```tsx
   import type { EditorState, EditorContextValue } from '@/components/editor/EditorProviderCanonical';
   ```

4. **Valide após cada migração**
   ```bash
   npm run type-check
   npm run build
   ```

### DON'T ❌

1. **Não use providers deprecated**
   ```tsx
   // ❌ NÃO FAÇA ISSO
   import { EditorProvider } from '@/components/editor/EditorProviderMigrationAdapter';
   ```

2. **Não misture múltiplos providers**
   ```tsx
   // ❌ NÃO FAÇA ISSO
   <EditorProviderCanonical>
     <EditorProviderAdapter>  {/* Redundante! */}
       {children}
     </EditorProviderAdapter>
   </EditorProviderCanonical>
   ```

3. **Não ignore warnings de deprecation**
   - Se o TypeScript mostrar `@deprecated`, migre imediatamente

---

## 📞 SUPORTE

### Encontrou um problema?

1. Verifique se seguiu todos os passos do checklist
2. Consulte a seção "Problemas Comuns" acima
3. Execute `npm run type-check` para identificar erros TypeScript
4. Revise o arquivo `AUDITORIA_FASE_2_CONCLUIDA.md` para exemplos

### Precisa reverter?

Se a migração causou problemas críticos:

```bash
# Reverter via git (se commitou)
git revert HEAD

# Restaurar backups .bak (se ainda existirem)
find src -name "*.bak" -exec bash -c 'mv "$0" "${0%.bak}"' {} \;
```

---

**Última Atualização:** 8 de Novembro de 2025  
**Autor:** Agente IA - FASE 2 Auditoria Quiz 21 Steps  
**Status:** ✅ Documento Oficial
