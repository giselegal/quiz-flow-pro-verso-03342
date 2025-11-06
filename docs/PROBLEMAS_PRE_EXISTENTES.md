# 🐛 PROBLEMAS PRÉ-EXISTENTES

Documentação de problemas identificados **ANTES** da implementação do SPRINT 2 Fase 2.
Estes problemas **NÃO FORAM CAUSADOS** pelos novos componentes (LazyBlockRenderer, EditorLoadingContext, useBlockLoading).

---

## 📋 PROBLEMAS IDENTIFICADOS

### 1. ⚠️ SchemaRegistry Incompleto (Prioridade: MÉDIA)

**Sintoma:**
```
[SchemaRegistry] Schema não encontrado: transition-title
[SchemaRegistry] Schema não encontrado: transition-text
[SchemaRegistry] Schema não encontrado: transition-loader
[SchemaRegistry] Schema não encontrado: transition-progress
[SchemaRegistry] Schema não encontrado: transition-message
```

**Causa:**
Schemas de blocos de transição não estão registrados em `src/config/schemas/dynamic.ts`

**Impacto:**
- Properties Panel pode não exibir controles para estes blocos
- Usuário não consegue editar propriedades destes elementos via UI
- Funcionalidade de renderização não é afetada (blocos ainda renderizam)

**Solução Proposta:**
Adicionar schemas faltantes em `src/config/schemas/dynamic.ts`:
```typescript
export const transitionSchemas = {
  'transition-title': { /* schema */ },
  'transition-text': { /* schema */ },
  'transition-loader': { /* schema */ },
  'transition-progress': { /* schema */ },
  'transition-message': { /* schema */ }
};
```

**Status:** 🔴 Pendente

---

### 2. 🚨 Charts Vendor Error (Prioridade: ALTA)

**Sintoma:**
```
Uncaught ReferenceError: Cannot access 'O' before initialization
    at charts-vendor-Dhuvwjyb.js:1:16185
```

**Causa Provável:**
- Circular dependency em código de vendor (recharts ou dependência)
- Problema de code splitting/bundling do Vite
- Inicialização prematura de módulo antes de suas dependências

**Impacto:**
- ❓ Pode causar crash em páginas que usam gráficos
- ❓ Pode ser erro silencioso sem impacto funcional
- Necessita investigação para determinar severidade real

**Investigação Necessária:**
1. Verificar se funcionalidade de charts está quebrada
2. Analisar bundle para identificar circular dependency
3. Testar componentes que usam recharts/charts
4. Considerar upgrade de dependência ou isolamento do problema

**Solução Proposta:**
- [ ] Reproduzir erro consistentemente
- [ ] Identificar componente/página afetada
- [ ] Analisar import graph para encontrar cycle
- [ ] Aplicar fix: lazy loading, dynamic import, ou refactor

**Status:** 🔴 Pendente Investigação

---

### 3. ⚠️ Deprecated Services (Prioridade: BAIXA)

**Sintomas:**
```
[DEPRECATED] FunnelUnifiedService → use @/services/canonical/FunnelService
[DEPRECATED] QuizEditorBridge → use @/services/canonical/TemplateService
⚠️ [DEPRECATED]: HybridTemplateService está descontinuado
```

**Causa:**
Código legado ainda usando services deprecados

**Impacto:**
- Poluição de console com warnings
- Risco de manutenção futura (código será removido)
- Performance negligível (wrapper adiciona overhead mínimo)

**Solução Proposta:**
Migração gradual para services canônicos:
```typescript
// ❌ ANTES
import { FunnelUnifiedService } from '@/services/FunnelUnifiedService';

// ✅ DEPOIS
import { funnelService } from '@/services/canonical/FunnelService';
```

**Status:** 🟡 Baixa Prioridade (não bloqueia Fase 3)

---

## 📊 PRIORIZAÇÃO

| Problema | Prioridade | Bloqueante Fase 3? | Esforço |
|----------|-----------|-------------------|---------|
| SchemaRegistry Incompleto | MÉDIA | ❌ Não | 🟢 Baixo (30min) |
| Charts Vendor Error | ALTA | ❓ Precisa investigar | 🔴 Alto (2-4h) |
| Deprecated Services | BAIXA | ❌ Não | 🟡 Médio (1-2h) |

---

## 🎯 RECOMENDAÇÃO

**Para SPRINT 2 Fase 3:**
1. ✅ Prosseguir com integração do LazyBlockRenderer
2. ✅ Documentar problemas (este arquivo)
3. 🔄 Resolver SchemaRegistry durante ou após Fase 3 (quick win)
4. 📋 Marcar Charts Vendor Error para investigação dedicada posterior

**Justificativa:**
- Nenhum problema é causado por SPRINT 2 Fase 2
- LazyBlockRenderer e EditorLoadingContext estão isolados e testados
- Problemas pré-existentes não bloqueiam integração
- Resolver tudo agora atrasaria sprint sem ganho real

---

## 📝 HISTÓRICO

| Data | Evento |
|------|--------|
| 2025-11-06 | Problemas identificados após SPRINT 2 Fase 2 conclusão |
| 2025-11-06 | Documento criado para tracking |
| 2025-11-06 | Decisão: Opção A (documentar e prosseguir) |

---

## 🔗 RELACIONADO

- `docs/SPRINT_2_FASE_2_COMPLETO.md` - Status da Fase 2
- `src/config/schemas/dynamic.ts` - Onde adicionar schemas
- `charts-vendor-Dhuvwjyb.js` - Arquivo com erro
- `src/services/canonical/` - Services canônicos
