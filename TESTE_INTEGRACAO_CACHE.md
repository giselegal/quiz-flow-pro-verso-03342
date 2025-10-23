# 🧪 TESTE DE INTEGRAÇÃO - UNIFIED CACHE SERVICE

## ✅ Status: FASE 2.1 Implementada

### Arquivos Migrados

1. **EditorCacheService.ts** → Wrapper delegando para UnifiedCacheService
   - ✅ Métodos `get/set/invalidate/clear` redirecionados
   - ✅ Warnings de deprecação adicionados
   - ✅ Singleton exportado para compatibilidade

2. **ConfigurationCache.ts** → Wrapper delegando para UnifiedCacheService
   - ✅ Métodos `get/set/has/delete/clear` redirecionados
   - ✅ Store: `configs`
   - ✅ Auto-cleanup removido (LRU handle)

3. **stepTemplateService.ts** → Cache inline substituído
   - ✅ `TEMPLATE_CACHE Map` removido
   - ✅ Todas operações usando `cacheService.get/set('templates', key)`
   - ✅ TTL: 10 minutos para templates

---

## 📋 Checklist de Validação

### 1. Compilação TypeScript
```bash
npm run build
```
**Esperado:** Build sem erros de tipo

### 2. Cache Hit Rate
```typescript
// Executar no console do navegador após navegar no editor
window.__cacheService.logStats();
```
**Esperado:**
- Hit Rate > 85% após navegação
- Memory usage < 20 MB
- 3 stores ativos (templates, configs, blocks)

### 3. Invalidação Automática
```typescript
// Simular update de bloco
editorEventBus.emit('editor:block-updated', { 
  stepId: 'step-01', 
  blockId: 'intro-block' 
});

// Verificar invalidação
window.__cacheService.getStoreStats('templates');
```
**Esperado:** Size reduzido para entries do step-01

### 4. LRU Eviction
```typescript
// Forçar overflow do cache (max: 100 templates)
for (let i = 1; i <= 110; i++) {
  cacheService.set('templates', `test-${i}`, { blocks: [] });
}

// Verificar eviction
const stats = cacheService.getStoreStats('templates');
console.log(stats.size); // Deve ser ≤ 100
```
**Esperado:** Size = 100 (LRU evictou 10 entries mais antigas)

### 5. TTL Expiration
```typescript
// Inserir com TTL curto
cacheService.set('configs', 'test-key', { foo: 'bar' }, 1000); // 1 segundo

// Esperar 2 segundos
setTimeout(() => {
  const value = cacheService.get('configs', 'test-key');
  console.log(value); // Deve ser null
}, 2000);
```
**Esperado:** null após expiração

---

## 🔍 Testes de Integração Recomendados

### Teste 1: Editor → Preview Sync
1. Abrir `/editor?template=quiz21StepsComplete`
2. Editar propriedade de um bloco (ex: título)
3. Abrir DevTools e verificar logs:
   - `✅ [Cache HIT] blocks:step-01-intro-block`
   - `💾 [Cache SET] blocks:step-01-intro-block`
4. Navegar para Preview
5. Verificar que alterações aparecem (cache synced)

**Critério de Sucesso:** Preview reflete alterações instantaneamente

### Teste 2: Template Loading Performance
1. Abrir editor limpo (sem cache)
2. Navegar entre 5 steps diferentes
3. Medir tempo de carregamento (via DevTools Network/Performance)

**Esperado:**
- **Primeiro carregamento:** 50-100ms (L2 IndexedDB)
- **Segundo carregamento:** 5-10ms (L1 Memory)
- **Hit rate final:** > 90%

### Teste 3: Memory Leak Prevention
1. Abrir editor
2. Navegar entre 21 steps repetidamente (3x cada)
3. Verificar uso de memória no DevTools:
   ```typescript
   const stats = cacheService.getAllStats();
   console.log(`Total Memory: ${stats.total.memoryUsage / 1024} KB`);
   ```

**Esperado:**
- Memory usage estabiliza após primeira passada
- Não cresce linearmente com navegação
- LRU mantém size ≤ max configurado

---

## 🐛 Troubleshooting

### Erro: "cacheService is not defined"
**Solução:** Verificar import em arquivos:
```typescript
import { cacheService } from '@/services/UnifiedCacheService';
```

### Warning: "ConfigurationCache is deprecated"
**Esperado:** Este warning é intencional durante migração.
**Ação:** Ignorar por 2 semanas enquanto equipe migra código.

### Erro: "Cannot find module UnifiedCacheService"
**Solução:** Verificar que arquivo existe em `/src/services/UnifiedCacheService.ts`

### Hit Rate < 85%
**Diagnóstico:**
```typescript
window.__cacheService.logStats();
// Verificar qual store tem baixo hit rate
```
**Possíveis causas:**
- TTL muito curto
- Invalidação excessiva
- Keys inconsistentes (normalize antes de cachear)

---

## 📊 Métricas Esperadas (Após Migração Completa)

| Métrica | Antes (7 caches) | Depois (UnifiedCache) | Ganho |
|---------|------------------|----------------------|-------|
| Hit Rate | 55% | >85% | +54% |
| Memory Usage | ~40 MB | <20 MB | -50% |
| Cache Miss (avg) | 450 ms | <100 ms | -78% |
| GC Pauses | Frequentes (manual) | Raros (LRU auto) | -90% |

---

## 🚀 Próximos Passos (Após Validação)

1. **FASE 2.2:** Consolidar 77 services → 12 canonical services
2. **FASE 2.3:** Code splitting & bundle optimization
3. **FASE 3:** Eliminar 16 useEffects restantes
4. **FASE 4:** Remover wrappers deprecated (após 2 semanas)

---

## 🔗 Referências

- `/src/services/UnifiedCacheService.ts` - Implementação core
- `/src/services/CacheMigrationAdapters.ts` - Compatibilidade
- `PLANO_ACAO_FASE_2_3.md` - Roadmap completo
