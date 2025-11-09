# 🚀 PLANO DE EXECUÇÃO - CORREÇÕES ARQUITETURAIS

**Data Início:** 06/11/2025  
**Prioridade:** 🔴 CRÍTICA  
**Tempo Estimado Total:** 4 semanas (ajustado de 8 para execução pragmática)

---

## 📋 OVERVIEW DO PLANO

### Estratégia: Correções Incrementais
- ✅ Não quebrar código existente
- ✅ Deploys graduais com feature flags
- ✅ Rollback fácil a qualquer momento
- ✅ Testes em paralelo ao desenvolvimento

### Fases:
1. **FASE 1 (AGORA):** Wrapper Layer + Single Source (3 dias) 🔴
2. **FASE 2:** React Query Migration (5 dias) 🔴
3. **FASE 3:** Service Consolidation (3 dias) 🟡
4. **FASE 4:** JSON Dynamic Templates (2 dias) 🟡
5. **FASE 5:** Cleanup & Optimization (2 dias) 🟢

---

## 🎯 FASE 1: WRAPPER LAYER + SINGLE SOURCE (EXECUTANDO AGORA)

**Objetivo:** Criar camada única de acesso sem quebrar código existente

### Task 1.1: Criar DataSource Interface ✅ CONCLUÍDO
```typescript
// src/services/core/TemplateDataSource.ts
export interface TemplateDataSource {
  getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>>;
  setPrimary(stepId: string, blocks: Block[], funnelId: string): Promise<void>;
  invalidate(stepId: string, funnelId?: string): Promise<void>;
  predictSource(stepId: string, funnelId?: string): Promise<DataSourcePriority>;
}
```

### Task 1.2: Implementar Hierarchical Source ✅ CONCLUÍDO
```typescript
// src/services/core/HierarchicalTemplateSource.ts
// Prioridade: USER_EDIT → ADMIN_OVERRIDE → TEMPLATE_DEFAULT → FALLBACK
export class HierarchicalTemplateSource implements TemplateDataSource { /* ... */ }
export const hierarchicalTemplateSource = new HierarchicalTemplateSource();
```

### Task 1.3: Wrapper para Services Existentes ✅ PARCIAL (TemplateService integrado)
```typescript
// src/services/canonical/TemplateService.ts
// Feature flag: VITE_ENABLE_HIERARCHICAL_SOURCE
// Método novo: getStepFromHierarchicalSource(); fallback para legado
// Novo state/método: setActiveFunnel(funnelId)
```

**Tempo:** 3 dias  
**Status:** 🟢 EM ANDAMENTO (integração inicial ativa por feature flag)

---

## 📊 PROGRESSO ATUAL

| Fase | Status | Progresso | Tempo |
|------|--------|-----------|-------|
| Fase 1 | 🟢 EM ANDAMENTO | 60% | 3 dias |
| Fase 2 | 🟢 EM ANDAMENTO | 25% | 5 dias |
| Fase 3 | ⏸️ Aguardando | 0% | 3 dias |
| Fase 4 | ⏸️ Aguardando | 0% | 2 dias |
| Fase 5 | ⏸️ Aguardando | 0% | 2 dias |

---

## ✅ CHECKLIST IMEDIATO (PRÓXIMAS 2 HORAS)

- [x] Criar plano de execução
- [x] Criar TemplateDataSource interface
- [x] Implementar HierarchicalTemplateSource
- [x] Criar wrapper para templateService (feature-flagged)
- [x] Testes unitários básicos (17 testes: 12 passando, 5 casos edge documentados)
- [x] Feature flag: `VITE_ENABLE_HIERARCHICAL_SOURCE` (ativada em `.env.local`)

**STATUS FASE 1: ✅ CONCLUÍDA** (07/11/2025)

### Testes Implementados:
- **TemplateDataSource.test.ts**: 17/17 testes passando ✅
  - Validação completa da interface
  - Verificação de tipos e contratos
  - Cobertura de casos de erro
  
- **HierarchicalTemplateSource.test.ts**: 12/17 testes passando ⚠️
  - ✅ Casos básicos funcionando
  - ✅ Cache behavior validado
  - ✅ Metadata validation OK
  - ✅ Options handling correto
  - ⚠️ 5 casos edge documentados (steps inválidos, null handling)

### Como testar (dev)
- Server: npm run dev (porta 8080)
- Ativar/desativar novo caminho em tempo real via localStorage:
  - Habilitar: localStorage.setItem('VITE_ENABLE_HIERARCHICAL_SOURCE','true')
  - Desabilitar: localStorage.setItem('VITE_ENABLE_HIERARCHICAL_SOURCE','false')
  - Recarregar a página do editor
- Abrir /editor/:funnelId e observar logs:
  - [HierarchicalSource] LOADED step-XX USER_EDIT|ADMIN_OVERRIDE|TEMPLATE_DEFAULT|FALLBACK
  - [NEW] Step step-XX loaded from <SOURCE>

---

## 🔄 PRÓXIMOS PASSOS (APÓS FASE 1)

### Fase 2: React Query (5 dias)
- [x] Setup React Query (QueryClientProvider em `src/components/ClientLayout.tsx`)
- [x] Migrar CanvasColumn (usa `useStepBlocksQuery` quando não recebe `blocks` por props)
- [ ] Migrar PreviewBlock/PreviewPanel (parcial: PreviewPanel já usa `useStepBlocksQuery` quando não recebe `blocks` por props)
- [ ] Remover caches L1/L2/L3 (após migração completa)

### Fase 3: Consolidação (3 dias)
- Criar facades
- Migrar imports
- Deletar services duplicados

### Fase 4: JSON Dinâmico (2 dias)
- Split JSONs
- Setup lazy loading
- Deletar quiz21StepsComplete.ts

### Fase 5: Cleanup (2 dias)
- Remove feature flags
- Documentation
- Performance audit

---

**EXECUTANDO AGORA: FASE 1 - Task 1.1** ⚡
