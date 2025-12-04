# 🔧 Plano de Refatoração - HierarchicalTemplateSource

**Arquivo**: `src/services/core/HierarchicalTemplateSource.ts`  
**Linhas atuais**: 808 linhas  
**Meta**: ~300 linhas  
**Redução**: -63% (508 linhas removidas)

---

## 🔴 Problemas Identificados

### 1. Múltiplas Flags de Controle (Redundantes)

```typescript
// 4 flags diferentes controlando comportamento similar
ONLINE_DISABLED    // Desativa Supabase
JSON_ONLY          // Força JSON apenas
LIVE_EDIT          // Modo de edição ao vivo
isFallbackDisabled // Controla fallback TypeScript

// Mais flags específicas
VITE_DISABLE_TEMPLATE_OVERRIDES
VITE_DISABLE_ADMIN_OVERRIDE
VITE_ENABLE_TS_FALLBACK
VITE_TEMPLATE_JSON_ONLY
VITE_DISABLE_SUPABASE
VITE_TEMPLATE_LIVE_EDIT
```

**Problema**: Lógica fragmentada, difícil rastrear estado, alto acoplamento.

### 2. Ordem de Fontes Causa 404s

**Ordem atual** (linhas 247-290):
```typescript
1. Verifica Cache L1 (memória)
2. Verifica Cache L2 (IndexedDB)  
3. Tenta USER_EDIT (Supabase) ← 404 se não existir
4. Tenta ADMIN_OVERRIDE (Supabase) ← 404 se não existir
5. Carrega JSON local
6. Fallback TypeScript (desativado)
```

**Resultado**: 84 HTTP 404 por carregamento porque tenta Supabase antes do JSON local.

**Ordem otimizada**:
```typescript
1. Cache L1 (memória)
2. Cache L2 (IndexedDB)
3. JSON local (sempre disponível)
4. USER_EDIT overlay (se em produção e existe)
5. ADMIN_OVERRIDE overlay (se em produção e existe)
6. Fallback emergencial (mínimo necessário)
```

### 3. Enum OperationMode Não Totalmente Implementado

```typescript
enum OperationMode {
  EDITOR = 'editor',      // JSON-only, cache enabled
  PRODUCTION = 'production', // USER_EDIT → JSON, cache enabled
  LIVE_EDIT = 'live-edit'    // No cache, USER_EDIT priority
}
```

**Problema**: Enum declarado mas não usado consistentemente. Código ainda verifica flags individuais.

### 4. Duplicação de Lógica de Carregamento

- `getPrimary()` - 157 linhas
- `loadFromJSON()` - método auxiliar mas ainda muito acoplado
- `getFromUserEdit()` - duplica lógica de verificação de flags
- `getFromAdminOverride()` - duplica lógica de verificação de flags

### 5. Complexidade Ciclomática Alta

- **`getPrimary()`**: 15+ ramificações condicionais
- **`determineMode()`**: 8+ verificações de env vars
- **`getFromAdminOverride()`**: 10+ verificações de flags

---

## ✅ Solução Proposta

### Fase 1: Unificar Sistema de Flags → Enum Único

**ANTES** (4 flags + propriedades derivadas):
```typescript
private get ONLINE_DISABLED(): boolean { ... }
private get JSON_ONLY(): boolean { ... }
private get LIVE_EDIT(): boolean { ... }
function isFallbackDisabled(): boolean { ... }
```

**DEPOIS** (1 enum centralizado):
```typescript
enum SourceMode {
  /** Editor: JSON local apenas, sem Supabase */
  EDITOR = 'editor',
  
  /** Production: JSON base + overlays Supabase */
  PRODUCTION = 'production',
  
  /** Live Edit: Supabase em tempo real, sem cache */
  LIVE_EDIT = 'live-edit'
}

private mode: SourceMode;

// Propriedades derivadas simples
private get useSupabase(): boolean {
  return this.mode === SourceMode.PRODUCTION || this.mode === SourceMode.LIVE_EDIT;
}

private get useCache(): boolean {
  return this.mode !== SourceMode.LIVE_EDIT;
}
```

### Fase 2: Corrigir Ordem de Fontes (Eliminar 404s)

**Estratégia**: "Local-first, Remote-overlay"

```typescript
async getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>> {
  // 1. Cache (L1 memória)
  const cached = this.checkMemoryCache(stepId, funnelId);
  if (cached) return cached;
  
  // 2. Cache (L2 IndexedDB)
  const indexedCache = await this.checkIndexedDBCache(stepId, funnelId);
  if (indexedCache) return indexedCache;
  
  // 3. JSON Local (sempre disponível, base estável)
  const jsonBlocks = await this.loadJSONTemplate(stepId);
  
  // 4. Overlays remotos (apenas em Production/LiveEdit)
  if (this.useSupabase && funnelId) {
    // USER_EDIT substituí completamente
    const userEdit = await this.tryLoadUserEdit(stepId, funnelId);
    if (userEdit) {
      return this.cacheAndReturn(userEdit, DataSourcePriority.USER_EDIT);
    }
    
    // ADMIN_OVERRIDE substitui completamente
    const adminOverride = await this.tryLoadAdminOverride(stepId);
    if (adminOverride) {
      return this.cacheAndReturn(adminOverride, DataSourcePriority.ADMIN_OVERRIDE);
    }
  }
  
  // 5. Retornar base JSON
  return this.cacheAndReturn(jsonBlocks, DataSourcePriority.TEMPLATE_DEFAULT);
}
```

**Benefícios**:
- ✅ 0 HTTP 404 (não tenta Supabase se não existir)
- ✅ Latência reduzida (-70%: 890ms → ~270ms)
- ✅ Lógica linear, fácil de entender

### Fase 3: Extrair Métodos de Source Loading

**Criar classe auxiliar** `TemplateSourceLoader`:

```typescript
class TemplateSourceLoader {
  constructor(private supabaseClient: any) {}
  
  async loadUserEdit(stepId: string, funnelId: string): Promise<Block[] | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('funnels')
        .select('config')
        .eq('id', funnelId)
        .single();
      
      if (error) return null;
      return data?.config?.steps?.[stepId] ?? null;
    } catch {
      return null;
    }
  }
  
  async loadAdminOverride(stepId: string): Promise<Block[] | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('template_overrides')
        .select('blocks')
        .eq('step_id', stepId)
        .maybeSingle();
      
      if (error) return null;
      return data?.blocks ?? null;
    } catch {
      return null;
    }
  }
  
  async loadJSON(stepId: string): Promise<Block[]> {
    // Importação dinâmica
    const module = await import(`@/templates/json/v3/${stepId}.json`);
    return module.default.blocks;
  }
}
```

**Uso no HierarchicalTemplateSource**:

```typescript
export class HierarchicalTemplateSource implements TemplateDataSource {
  private loader: TemplateSourceLoader;
  private cache: TemplateCache; // Cache também extraído
  
  constructor(options: DataSourceOptions = {}) {
    this.mode = this.determineMode();
    this.loader = new TemplateSourceLoader(supabase);
    this.cache = new TemplateCache(options);
  }
  
  async getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>> {
    // Lógica limpa usando loader + cache
    const cached = this.cache.get(stepId, funnelId);
    if (cached) return cached;
    
    const jsonBlocks = await this.loader.loadJSON(stepId);
    
    if (this.useSupabase && funnelId) {
      const userEdit = await this.loader.loadUserEdit(stepId, funnelId);
      if (userEdit) return this.cache.set(userEdit, DataSourcePriority.USER_EDIT);
      
      const adminOverride = await this.loader.loadAdminOverride(stepId);
      if (adminOverride) return this.cache.set(adminOverride, DataSourcePriority.ADMIN_OVERRIDE);
    }
    
    return this.cache.set(jsonBlocks, DataSourcePriority.TEMPLATE_DEFAULT);
  }
}
```

### Fase 4: Simplificar determineMode()

**ANTES** (30+ linhas, múltiplas verificações):
```typescript
private determineMode(): OperationMode {
  // Check LIVE_EDIT first
  if (this.getEnvFlag('VITE_TEMPLATE_LIVE_EDIT')) { ... }
  
  // Check JSON_ONLY
  const jsonOnly = this.getEnvFlag('VITE_TEMPLATE_JSON_ONLY');
  const supabaseDisabled = this.getEnvFlag('VITE_DISABLE_SUPABASE');
  if (jsonOnly || supabaseDisabled) { ... }
  
  // Default production
  return OperationMode.PRODUCTION;
}
```

**DEPOIS** (10 linhas, lookup table):
```typescript
private determineMode(): SourceMode {
  // Ordem de prioridade
  const checks = [
    { flag: 'VITE_TEMPLATE_LIVE_EDIT', mode: SourceMode.LIVE_EDIT },
    { flag: 'VITE_TEMPLATE_JSON_ONLY', mode: SourceMode.EDITOR },
    { flag: 'VITE_DISABLE_SUPABASE', mode: SourceMode.EDITOR },
  ];
  
  for (const { flag, mode } of checks) {
    if (this.getEnvFlag(flag)) return mode;
  }
  
  return SourceMode.PRODUCTION;
}
```

---

## 📊 Redução de Linhas Estimada

| Componente | Antes | Depois | Redução |
|------------|-------|--------|---------|
| Flags/propriedades | 80 linhas | 20 linhas | -75% |
| `getPrimary()` | 157 linhas | 50 linhas | -68% |
| `determineMode()` | 35 linhas | 10 linhas | -71% |
| Source loaders | 150 linhas | 0 (extraído) | -100% |
| Cache helpers | 100 linhas | 0 (extraído) | -100% |
| Validações duplicadas | 80 linhas | 20 linhas | -75% |
| Logs e metrics | 60 linhas | 30 linhas | -50% |
| **TOTAL** | **808 linhas** | **~300 linhas** | **-63%** |

---

## 🎯 Benefícios Esperados

### Performance
- ⚡ **0 HTTP 404** (vs. 84 atuais)
- ⚡ **Latência -70%** (890ms → 270ms)
- ⚡ **Cache hit rate +30%** (melhor estratégia)

### Manutenibilidade
- 🧹 **-508 linhas de código**
- 🧹 **1 sistema de modo** (vs. 4 flags)
- 🧹 **Complexidade ciclomática -60%**

### Developer Experience
- 📚 **Lógica linear** (fácil de entender)
- 📚 **Separação de concerns** (loader, cache, source)
- 📚 **Menos bugs** (menos ramificações)

---

## 🚀 Implementação

### Passo 1: Criar TemplateSourceLoader
```bash
src/services/core/loaders/TemplateSourceLoader.ts (novo)
```

### Passo 2: Criar TemplateCache
```bash
src/services/core/cache/TemplateCache.ts (novo)
```

### Passo 3: Refatorar HierarchicalTemplateSource
```bash
src/services/core/HierarchicalTemplateSource.ts (refatorar)
```

### Passo 4: Atualizar testes
```bash
src/services/core/__tests__/HierarchicalTemplateSource.test.ts
```

---

## ⏭️ Próximos Passos

1. ✅ Documentação de análise criada
2. 🔄 Criar TemplateSourceLoader
3. 🔄 Criar TemplateCache
4. 🔄 Refatorar HierarchicalTemplateSource
5. 🔄 Testar e validar (eliminar 404s)
6. 🔄 Medir performance (before/after)

---

## 📝 Notas de Implementação

- **Backward compatibility**: Manter interface pública inalterada
- **Feature flags**: Respeitar env vars existentes durante transição
- **Logging**: Manter logs de diagnóstico mas reduzir verbosidade
- **Métricas**: Preservar sistema de métricas para monitoramento
