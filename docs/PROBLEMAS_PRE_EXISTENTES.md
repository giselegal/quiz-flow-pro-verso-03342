# 🐛 PROBLEMAS PRÉ-EXISTENTES

Documentação de problemas identificados **ANTES** da implementação do SPRINT 2 Fase 2.
Estes problemas **NÃO FORAM CAUSADOS** pelos novos componentes (LazyBlockRenderer, EditorLoadingContext, useBlockLoading).

---

## 📋 PROBLEMAS IDENTIFICADOS

### 1. ✅ SchemaRegistry Incompleto (Prioridade: MÉDIA) - RESOLVIDO

**Sintoma:**
```
[SchemaRegistry] Schema não encontrado: transition-title
[SchemaRegistry] Schema não encontrado: transition-text
[SchemaRegistry] Schema não encontrado: transition-loader
[SchemaRegistry] Schema não encontrado: transition-progress
[SchemaRegistry] Schema não encontrado: transition-message
```

**Causa:**
Schemas de blocos de transição não estavam registrados em `src/config/schemas/dynamic.ts`

**Impacto:**
- Properties Panel pode não exibir controles para estes blocos
- Usuário não consegue editar propriedades destes elementos via UI
- Funcionalidade de renderização não é afetada (blocos ainda renderizam)

**Solução Implementada:**
✅ Adicionados 5 schemas em `src/config/schemas/blocks/transition-blocks.ts`:
- `transitionTitleSchema` - Título de transição (title + typography + colors)
- `transitionTextSchema` - Texto de transição (description + typography + colors)
- `transitionLoaderSchema` - Loading de transição (show + type + text + colors)
- `transitionProgressSchema` - Progresso de transição (show + value + text + colors)
- `transitionMessageSchema` - Mensagem de transição (message + type + typography + colors)

✅ Registrados em `src/config/schemas/dynamic.ts` com lazy loading

**Documentação:** `docs/SPRINT_2_SCHEMA_REGISTRY_FIX.md`

**Status:** ✅ Resolvido (2025-11-06)

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

| Problema | Prioridade | Bloqueante Fase 3? | Esforço | Status |
|----------|-----------|-------------------|---------|--------|
| SchemaRegistry Incompleto | MÉDIA | ❌ Não | 🟢 Baixo (30min) | ✅ Resolvido |
| Charts Vendor Error | ALTA | ❓ Precisa investigar | 🔴 Alto (2-4h) | 🔴 Pendente |
| Deprecated Services | BAIXA | ❌ Não | 🟡 Médio (1-2h) | 🔴 Pendente |

---

## 🎯 RECOMENDAÇÃO

**Para SPRINT 2 Fase 3:**
1. ✅ ~~Prosseguir com integração do LazyBlockRenderer~~ - COMPLETO
2. ✅ ~~Documentar problemas (este arquivo)~~ - COMPLETO
3. ✅ ~~Resolver SchemaRegistry durante ou após Fase 3 (quick win)~~ - COMPLETO
4. 📋 Marcar Charts Vendor Error para investigação dedicada posterior
5. 📋 Marcar Deprecated Services para refactor futuro

**Justificativa:**
- SchemaRegistry resolvido (10min) ✅
- Charts Vendor Error e Deprecated Services não bloqueiam desenvolvimento
- Problemas restantes documentados para posterior investigação

---

## 📝 HISTÓRICO

| Data | Evento |
|------|--------|
| 2025-11-06 | Problemas identificados após SPRINT 2 Fase 2 conclusão |
| 2025-11-06 | Documento criado para tracking |
| 2025-11-06 | Decisão: Opção A (documentar e prosseguir) |
| 2025-11-06 | ✅ SchemaRegistry resolvido - 5 schemas adicionados |

---

## 🔗 RELACIONADO

- `docs/SPRINT_2_FASE_2_COMPLETO.md` - Status da Fase 2
- `src/config/schemas/dynamic.ts` - Onde adicionar schemas
- `charts-vendor-Dhuvwjyb.js` - Arquivo com erro
- `src/services/canonical/` - Services canônicos
