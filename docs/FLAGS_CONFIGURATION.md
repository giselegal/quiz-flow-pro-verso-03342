# 🚩 Flags de Configuração - Editor JSON v3

## Visão Geral

O sistema suporta múltiplas flags para controlar o comportamento do carregamento de templates e integração com Supabase. Estas flags podem ser configuradas via:

1. **Variáveis de ambiente Vite** (`.env` ou build-time)
2. **localStorage** (runtime, maior prioridade)
3. **process.env** (Node.js/scripts)

## Flags Disponíveis

### 🔌 VITE_DISABLE_SUPABASE

**Propósito**: Desabilita completamente todas as chamadas ao Supabase (funnels, template_overrides, etc.)

**Valores**: `'true'` | `'false'` (string)

**Impacto**:
- ✅ Elimina requisições HTTP ao PostgREST
- ✅ Remove erros 404/401 no console
- ✅ Força modo 100% offline (JSON local)
- ⚠️ Desabilita persistência de edições em Supabase

**Exemplo**:
```bash
# .env
VITE_DISABLE_SUPABASE=true
```

```javascript
// localStorage (runtime)
localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
```

---

### 📋 VITE_TEMPLATE_JSON_ONLY

**Propósito**: Força uso exclusivo de arquivos JSON v3 como fonte de templates

**Valores**: `'true'` | `'false'` (string)

**Impacto**:
- ✅ Desativa fallback para `quiz21StepsComplete.ts` (TypeScript)
- ✅ Ignora `UnifiedTemplateRegistry` legacy
- ✅ Usa apenas `HierarchicalTemplateSource` → JSON loaders
- ✅ Padrão em DEV mode

**Exemplo**:
```bash
# .env
VITE_TEMPLATE_JSON_ONLY=true
```

```javascript
// localStorage (runtime)
localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
```

**Hierarquia de fontes quando ativo**:
1. USER_EDIT (se Supabase ativo)
2. TEMPLATE_DEFAULT (JSON v3) ← **única fonte em modo offline**
3. ~~ADMIN_OVERRIDE~~ (ignorado)
4. ~~FALLBACK (TS)~~ (ignorado)

---

### 🛡️ VITE_DISABLE_TEMPLATE_OVERRIDES

**Propósito**: Desabilita fonte ADMIN_OVERRIDE (tabela `template_overrides` no Supabase)

**Valores**: `'true'` | `'false'` (string)

**Impacto**:
- ✅ Remove tentativas de fetch em `template_overrides`
- ✅ Elimina 404s quando tabela não existe
- ⚠️ Não afeta USER_EDIT (funnels.config)

**Aliases**:
- `VITE_DISABLE_ADMIN_OVERRIDE` (mesmo comportamento)

**Exemplo**:
```bash
# .env
VITE_DISABLE_TEMPLATE_OVERRIDES=true
```

---

### 💾 VITE_ENABLE_INDEXEDDB_CACHE

**Propósito**: Habilita cache persistente de blocos via IndexedDB

**Valores**: `'true'` | `'false'` (string)

**Impacto**:
- ✅ Reduz fetches subsequentes (TTL: 10min padrão)
- ✅ Melhora performance de navegação entre steps
- ✅ Persiste entre reloads da página
- ⚠️ Cache não invalida automaticamente ao editar (apenas TTL)

**Exemplo**:
```bash
# .env
VITE_ENABLE_INDEXEDDB_CACHE=true
```

**Estrutura do cache**:
```typescript
interface CacheRecord {
  key: string;           // ex: "step-01" ou "funnelId:step-01"
  blocks: Block[];       // blocos do step
  savedAt: number;       // timestamp
  ttlMs: number;         // 10min padrão (600000)
  version: string;       // "v3.0"
}
```

---

### ⚙️ VITE_ENABLE_TS_FALLBACK

**Propósito**: Reativa fallback TypeScript (`quiz21StepsComplete.ts`) em último recurso

**Valores**: `'true'` | `'false'` (string)

**Padrão**: `false` (desativado)

**Impacto**:
- ⚠️ **NÃO RECOMENDADO** - usar apenas para debug/transição
- Reintroduz dependência estática de 149KB
- Ignora flags JSON_ONLY

**Exemplo**:
```javascript
// Apenas para debug emergencial
localStorage.setItem('VITE_ENABLE_TS_FALLBACK', 'true');
```

---

### 🌐 VITE_ENABLE_REMOTE_TEMPLATES

**Propósito**: Controla se Supabase deve ser consultado (complementar a `VITE_DISABLE_SUPABASE`)

**Valores**: `'true'` | `'false'` (string)

**Padrão**:
- `false` em DEV
- `true` em PROD

**Impacto**:
- Complementa `VITE_DISABLE_SUPABASE`
- Útil para testar ambiente híbrido (offline dev + online prod)

---

### 🔧 VITE_AUTO_SAVE_DELAY_MS

**Propósito**: Delay (ms) para auto-save de edições no editor

**Valores**: número (string)

**Padrão**: `2000` (2 segundos)

**Exemplo**:
```bash
# .env
VITE_AUTO_SAVE_DELAY_MS=5000
```

---

## 🎯 Cenários Recomendados

### 💻 Desenvolvimento Local (JSON-only)
```bash
# .env.local
VITE_DISABLE_SUPABASE=true
VITE_TEMPLATE_JSON_ONLY=true
VITE_DISABLE_TEMPLATE_OVERRIDES=true
VITE_ENABLE_INDEXEDDB_CACHE=true
```

**Resultado**:
- ✅ Zero chamadas Supabase
- ✅ 100% JSON v3
- ✅ Cache persistente
- ✅ Console limpo (sem 404s)

---

### 🚀 Produção (Híbrido)
```bash
# .env.production
VITE_DISABLE_SUPABASE=false
VITE_TEMPLATE_JSON_ONLY=false
VITE_DISABLE_TEMPLATE_OVERRIDES=false
VITE_ENABLE_INDEXEDDB_CACHE=true
VITE_ENABLE_REMOTE_TEMPLATES=true
```

**Hierarquia de fontes**:
1. USER_EDIT (Supabase funnels)
2. ADMIN_OVERRIDE (Supabase overrides)
3. TEMPLATE_DEFAULT (JSON v3)
4. FALLBACK (desativado por padrão)

---

### 🧪 Testes E2E (Playwright)
```javascript
// beforeEach hook
await page.evaluate(() => {
  localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
  localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
  localStorage.setItem('VITE_DISABLE_TEMPLATE_OVERRIDES', 'true');
  localStorage.setItem('VITE_ENABLE_INDEXEDDB_CACHE', 'true');
  localStorage.setItem('supabase:disableNetwork', 'true'); // legacy
});
```

---

## 🔍 Debugging

### Ver métricas de carregamento
```javascript
// Console do navegador
console.table(window.__TEMPLATE_SOURCE_METRICS);
```

**Exemplo de saída**:
```
┌─────────┬───────────┬──────────────────┬──────────┬───────────┐
│ (index) │  stepId   │     source       │ loadTime │ cacheHit  │
├─────────┼───────────┼──────────────────┼──────────┼───────────┤
│    0    │ step-01   │ TEMPLATE_DEFAULT │   45.2   │   false   │
│    1    │ step-02   │ TEMPLATE_DEFAULT │   12.8   │   true    │
│    2    │ step-03   │ USER_EDIT        │   89.4   │   false   │
└─────────┴───────────┴──────────────────┴──────────┴───────────┘
```

### Ver cache IndexedDB
```javascript
// Console do navegador
const { IndexedTemplateCache } = await import('./src/services/core/IndexedTemplateCache');
const cached = await IndexedTemplateCache.get('step-01');
console.log(cached);
```

### Ver stats do HierarchicalTemplateSource
```javascript
const { hierarchicalTemplateSource } = await import('./src/services/core/HierarchicalTemplateSource');
console.table(hierarchicalTemplateSource.getCacheStats());
```

---

## 📝 Notas Importantes

1. **Prioridade de flags**: localStorage > import.meta.env > process.env
2. **Type safety**: Todas as flags esperam strings (`'true'`/`'false'`), não booleans
3. **Reload necessário**: Mudanças em localStorage requerem `page.reload()`
4. **Invalidação de cache**: IndexedDB cache só invalida por TTL (não detecta edições)
5. **DEV defaults**: Em modo DEV, JSON-only e offline são ativados automaticamente

---

## 🔗 Arquivos Relacionados

- `src/services/core/HierarchicalTemplateSource.ts` - Lógica de prioridade e flags
- `src/services/core/IndexedTemplateCache.ts` - Cache IndexedDB
- `src/templates/loaders/jsonStepLoader.ts` - Loader JSON v3
- `tests/e2e/editor-jsonv3-editing.spec.ts` - Testes E2E com flags

---

## 🆘 Troubleshooting

### Problema: Ainda vejo 404s do Supabase

**Solução**:
```javascript
// Verificar flags ativas
console.log({
  disableSupabase: localStorage.getItem('VITE_DISABLE_SUPABASE'),
  disableOverrides: localStorage.getItem('VITE_DISABLE_TEMPLATE_OVERRIDES'),
  legacyFlag: localStorage.getItem('supabase:disableNetwork')
});

// Forçar todas as flags
localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
localStorage.setItem('VITE_DISABLE_TEMPLATE_OVERRIDES', 'true');
localStorage.setItem('supabase:disableNetwork', 'true');
location.reload();
```

---

### Problema: Editor carrega template TS em vez de JSON

**Solução**:
```javascript
// Verificar modo JSON-only
console.log(localStorage.getItem('VITE_TEMPLATE_JSON_ONLY'));

// Forçar JSON-only
localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
localStorage.setItem('VITE_ENABLE_TS_FALLBACK', 'false');
location.reload();
```

---

### Problema: Cache não está funcionando

**Solução**:
```javascript
// Verificar se IndexedDB está habilitado
console.log(localStorage.getItem('VITE_ENABLE_INDEXEDDB_CACHE'));

// Habilitar cache
localStorage.setItem('VITE_ENABLE_INDEXEDDB_CACHE', 'true');
location.reload();

// Limpar cache se necessário
const { IndexedTemplateCache } = await import('./src/services/core/IndexedTemplateCache');
await IndexedTemplateCache.delete('step-01');
```

---

**Última atualização**: 2025-01-15
**Versão do sistema**: v3.0
