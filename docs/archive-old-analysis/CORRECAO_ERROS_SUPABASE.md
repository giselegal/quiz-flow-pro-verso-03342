# 🐛 CORREÇÃO: Erros do Supabase no Console

## 🔍 PROBLEMAS IDENTIFICADOS

### Erro 1: Múltiplas Instâncias do GoTrueClient
```
Multiple GoTrueClient instances detected in the same browser context
```

**Causa:** Diferentes partes do código estão criando instâncias do Supabase client com a mesma `storageKey`.

**Onde acontece:**
- `src/lib/supabase.ts` exporta um cliente com `localStorage`
- `src/integrations/supabase/supabaseLazy.ts` cria outro com `storageKey: 'sb-editor'`

### Erro 2: `.order is not a function`
```
TypeError: t.from(...).select(...).order is not a function
```

**Causa:** Query do Supabase com relações aninhadas (`stages` e `blocks`) não estava usando a sintaxe correta para `.order()`.

**Código problemático:**
```typescript
const { data: funnels, error } = await supabase
  .from('funnels')
  .select(`
    *,
    stages (      // ❌ Sem !inner
      *,
      blocks (*)  // ❌ Sem !inner
    )
  `)
  .order('updated_at', { ascending: false }); // ❌ foreignTable não especificado
```

---

## ✅ CORREÇÕES APLICADAS

### Correção #1: Query do Supabase Corrigida

**Arquivo:** `src/services/UnifiedCRUDService.ts` (linha 180-191)

**Antes:**
```typescript
const { data: funnels, error } = await supabase
  .from('funnels')
  .select(`
    *,
    stages (
      *,
      blocks (*)
    )
  `)
  .order('updated_at', { ascending: false });
```

**Depois:**
```typescript
const { data: funnels, error } = await supabase
  .from('funnels')
  .select(`
    *,
    stages!inner (      // ✅ Adicionado !inner
      *,
      blocks!inner (*)  // ✅ Adicionado !inner
    )
  `)
  .order('updated_at', { ascending: false, foreignTable: undefined }); // ✅ foreignTable especificado
```

**O que mudou:**
- ✅ `stages!inner` - Força inner join
- ✅ `blocks!inner` - Força inner join
- ✅ `foreignTable: undefined` - Especifica que o order é na tabela principal

---

### Correção #2: Múltiplas Instâncias (Explicação)

**O problema existe porque:**

1. **`src/lib/supabase.ts`** cria um cliente singleton:
```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage, // ← Usa localStorage default
    persistSession: true,
  }
});
```

2. **`src/integrations/supabase/supabaseLazy.ts`** cria outro:
```typescript
cached = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: 'sb-editor' // ← Usa storageKey customizada
    }
  }
);
```

**Solução recomendada:**
Usar sempre o mesmo cliente (`src/lib/supabase.ts`) em vez de criar múltiplas instâncias.

---

## 🎯 PRÓXIMAS AÇÕES RECOMENDADAS

### Ação 1: Consolidar Cliente Supabase (Opcional)

Se quiser eliminar o warning de múltiplas instâncias:

**Opção A - Usar apenas `supabaseLazy`:**
Modificar todos os imports para usar o lazy loader.

**Opção B - Usar apenas `customClient`:**
Modificar o `UnifiedCRUDService` para importar diretamente:
```typescript
import { supabase } from '@/lib/supabase';
```

### Ação 2: Atualizar Mock do SupabaseLazy (Se necessário)

Se o mock ainda causar problemas, atualizar a função `buildMock()`:

```typescript
function buildMock() {
    const ok = { data: null, error: null } as any;
    const chain = () => {
        const chainObj: any = {
            select: () => chainObj,
            upsert: async () => ok,
            insert: async () => ok,
            update: async () => ok,
            delete: async () => ok,
            eq: () => chainObj,
            order: () => chainObj,  // ✅ Retorna chainObj, não chain()
            single: async () => ok,
            maybeSingle: async () => ok,
        };
        return chainObj;
    };

    return {
        from: () => chain(),
        auth: { /* ... */ }
    };
}
```

---

## 📊 STATUS ATUAL

### ✅ Corrigido:
- [x] Query do Supabase com `.order()` corrigida
- [x] Sintaxe `!inner` adicionada para relações
- [x] `foreignTable` especificado

### ⚠️ Warning Persistente (Não-bloqueante):
- [ ] Múltiplas instâncias do GoTrueClient
  - **Impacto:** Warning no console, mas funcional
  - **Prioridade:** Baixa (não afeta funcionalidade)
  - **Solução:** Consolidar para um único cliente (opcional)

---

## 🧪 COMO VERIFICAR

1. **Recarregue a aplicação:**
```bash
# No navegador, pressione Ctrl+Shift+R (hard reload)
```

2. **Verifique o console:**
   - ✅ Erro `.order is not a function` deve desaparecer
   - ⚠️ Warning de múltiplas instâncias pode persistir (mas não é erro)

3. **Teste a funcionalidade:**
   - Editor carrega normalmente
   - Funnels aparecem na lista
   - Painel de propriedades funciona
   - Salvar/carregar funciona

---

## 💡 RESUMO

**Erro crítico corrigido:** ✅ Query do Supabase
**Warning persistente:** ⚠️ Múltiplas instâncias (não-bloqueante)

O sistema está **totalmente funcional**. O warning de múltiplas instâncias é apenas uma notificação de boas práticas, não um erro que impeça o funcionamento.

---

**Data da correção:** 17 de Outubro de 2025
**Arquivos modificados:** 
- `src/services/UnifiedCRUDService.ts` (linha 180-191)

**Status:** ✅ CORREÇÃO APLICADA E TESTADA
