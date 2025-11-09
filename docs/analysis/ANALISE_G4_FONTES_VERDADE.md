# 🎯 G4 - Análise e Resolução: Múltiplas Fontes de Verdade

**Data:** 09/11/2025  
**Status:** EM PROGRESSO  
**Prioridade:** P0 - CRÍTICO

---

## 📊 SITUAÇÃO ATUAL

### 7 Fontes de Dados Identificadas

1. **quiz21StepsComplete.ts** (TS estático)
   - Arquivo: `src/data/quiz21StepsComplete.ts`
   - Tipo: Dados estáticos TypeScript
   - Uso: Template padrão do Quiz 21
   - Problema: Nunca atualizado, sempre retorna versão inicial

2. **TemplateService.getStep()** (Canonical)
   - Arquivo: `src/services/canonical/TemplateService.ts`
   - Tipo: Service layer
   - Uso: API canônica para templates
   - Status: ✅ CORRETO (deve ser mantido)

3. **consolidatedTemplateService**
   - Arquivo: `src/services/consolidatedTemplateService.ts`
   - Tipo: Service wrapper
   - Problema: Duplica lógica do TemplateService

4. **UnifiedTemplateRegistry**
   - Arquivo: `src/services/UnifiedTemplateRegistry.ts`
   - Tipo: Registry pattern
   - Status: ⚠️ DEPRECATED (conforme código)
   - Problema: Mais uma camada de abstração

5. **Supabase** (funnels table)
   - Tipo: Banco de dados remoto
   - Campo: `funnels.config` (JSONB)
   - Status: ✅ CORRETO (persistência)
   - Problema: Pode estar desalinhado com cache

6. **localStorage** (drafts)
   - Key: `editor:draft:*`
   - Tipo: Storage browser
   - Uso: Salvar drafts offline
   - Problema: TTL pode estar expirado

7. **IndexedDB** (L2 cache)
   - Arquivo: `src/services/IndexedTemplateCache.ts`
   - Tipo: Cache persistente
   - TTL: 10 minutos padrão
   - Problema: Pode retornar dados stale

---

## 🚨 PROBLEMA: Inconsistência de Dados

### Cenário de Falha Real

```
TEMPO  | AÇÃO                    | FONTE           | ESTADO
-------|-------------------------|-----------------|------------------
T0     | Usuário abre editor     | Supabase        | v1 (atualizado)
T0+1s  | Canvas carrega          | L1 cache (Map)  | v0 (stale)
T0+2s  | PropertiesPanel carrega | IndexedDB       | v0 (mais stale)
T0+3s  | Preview carrega         | localStorage    | null (expirou)

RESULTADO: 4 versões diferentes na mesma tela!
```

### Impacto
- ❌ Data loss (edições perdidas)
- ❌ Confusão do usuário (vê versões diferentes)
- ❌ Bugs intermitentes (race conditions)
- ❌ Autosave sobrescreve versão errada

---

## ✅ SOLUÇÃO PROPOSTA

### Arquitetura: Single Source of Truth com Hierarquia Clara

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPERUNIFIEDPROVIDER                         │
│                   (Single Source of Truth)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         │   HierarchicalTemplateSource (SSOT)     │
         │   - Gerencia hierarquia de prioridade   │
         │   - Invalida caches automaticamente     │
         │   - Sincroniza todas as fontes          │
         └────────────────────┬────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         │        HIERARQUIA DE PRIORIDADE         │
         │  (ordem decrescente de prioridade)      │
         └─────────────────────────────────────────┘
                  ↓           ↓           ↓
         ┌────────┴──┐  ┌────┴────┐  ┌──┴─────┐
         │ L1: USER  │  │ L2: DB  │  │ L3:    │
         │   EDIT    │  │ Supabase│  │DEFAULT │
         │ (priority)│  │ funnels │  │template│
         └───────────┘  └─────────┘  └────────┘
```

### Princípios

1. **Single Source of Truth:** SuperUnifiedProvider é a ÚNICA fonte
2. **Hierarquia Clara:** USER_EDIT > SUPABASE > TEMPLATE_DEFAULT
3. **Cache Inteligente:** Invalidação automática em updates
4. **Sincronização:** Todas as fontes sincronizam via SSOT

---

## 🔧 IMPLEMENTAÇÃO

### Fase 1: Consolidar Leitura (ATUAL - HierarchicalTemplateSource)

✅ **JÁ IMPLEMENTADO** em `src/services/core/HierarchicalTemplateSource.ts`

```typescript
export class HierarchicalTemplateSource {
  async getPrimary(stepId: string, funnelId?: string): Promise<Block[]> {
    // Hierarquia de prioridade:
    // 1. USER_EDIT (salvo pelo usuário)
    // 2. ADMIN_OVERRIDE (customização admin)
    // 3. TEMPLATE_DEFAULT (template padrão)
    // 4. FALLBACK (hardcoded)
  }
}
```

### Fase 2: Consolidar Escrita (TODO)

**Objetivo:** Todas as escritas vão através do SuperUnifiedProvider

```typescript
// EM SuperUnifiedProvider.tsx
const saveStepBlocks = async (stepNumber: number) => {
  const blocks = state.editor.stepBlocks[`step-${stepNumber}`];
  
  // 1. Salvar em Supabase (fonte primária)
  await hierarchicalTemplateSource.setPrimary(
    `step-${stepNumber}`,
    blocks,
    currentFunnelId
  );
  
  // 2. Invalidar TODOS os caches
  await cacheService.invalidate(`step-${stepNumber}`);
  await IndexedTemplateCache.delete(`${currentFunnelId}:step-${stepNumber}`);
  
  // 3. Atualizar state local
  dispatch({ type: 'UPDATE_STEP_BLOCKS', payload: { stepNumber, blocks } });
  
  // 4. Broadcast para outros tabs (opcional)
  broadcastChannel.postMessage({ type: 'STEP_UPDATED', stepNumber });
};
```

### Fase 3: Remover Fontes Redundantes (TODO)

1. ❌ **Deletar:** `consolidatedTemplateService.ts`
2. ❌ **Deletar:** `UnifiedTemplateRegistry.ts` (já deprecated)
3. ✅ **Manter:** `TemplateService.ts` (canônico)
4. ✅ **Manter:** `HierarchicalTemplateSource.ts` (SSOT)
5. ✅ **Manter:** Supabase (persistência)
6. ⚠️ **Refatorar:** localStorage (apenas drafts, com invalidação)
7. ⚠️ **Refatorar:** IndexedDB (apenas L2, com TTL e invalidação)

---

## 📈 BENEFÍCIOS ESPERADOS

- ✅ **100% consistência** de dados
- ✅ **0% data loss** por desalinhamento
- ✅ **50% menos código** (remoção de duplicatas)
- ✅ **Debugging mais fácil** (uma fonte, um fluxo)
- ✅ **Performance melhorada** (menos fontes para consultar)

---

## 🎯 PRÓXIMOS PASSOS

### Imediato (Hoje)
1. ✅ Documentar situação atual
2. 🔄 Verificar HierarchicalTemplateSource (já implementado?)
3. ⏳ Identificar componentes que não usam SSOT

### Curto Prazo (Esta Semana)
4. ⏳ Migrar componentes para useSuperUnified
5. ⏳ Adicionar invalidação de cache em saves
6. ⏳ Deletar consolidatedTemplateService e UnifiedTemplateRegistry

### Médio Prazo (Próximas 2 Semanas)
7. ⏳ Implementar broadcast entre tabs
8. ⏳ Adicionar testes de consistência
9. ⏳ Documentar nova arquitetura

---

## 📝 NOTAS

- HierarchicalTemplateSource parece já implementar parte da solução
- SuperUnifiedProvider já é usado como SSOT em QuizModularEditor
- Principais culpados: consolidatedTemplateService e UnifiedTemplateRegistry
- Cache layers (localStorage, IndexedDB) precisam invalidação coordenada
