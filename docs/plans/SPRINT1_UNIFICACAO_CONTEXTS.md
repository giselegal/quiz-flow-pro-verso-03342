# 🔄 Sprint 1 - Tarefa 3: Unificação do Sistema de Contexts

**Data:** 10 de Outubro de 2025  
**Status:** 🔄 Em Planejamento

---

## 📊 Situação Atual

### Estrutura Fragmentada (3 Locais)

#### 1. `/src/context/` - **Legado** (19 arquivos)
```
AdminAuthContext.tsx
AuthContext.tsx ⭐ (usado ativamente)
EditorContext.tsx
EditorDndContext.tsx
EditorQuizContext.tsx
EditorRuntimeProviders.tsx
FunnelsContext.tsx
PreviewContext.tsx
QuizContext.tsx
QuizFlowProvider.tsx
ScrollSyncContext.tsx
StepsContext.tsx
UnifiedCRUDProvider.tsx ⭐ (usado ativamente)
UnifiedConfigContext.tsx
UnifiedFunnelContext.tsx
UnifiedFunnelContextRefactored.tsx
UserDataContext.tsx
ValidationContext.tsx
index.ts
```

#### 2. `/src/contexts/` - **Novo** (1 arquivo)
```
ThemeContext.tsx ⭐ (usado ativamente)
```

#### 3. `/src/core/contexts/` - **Core** (3 arquivos)
```
FunnelContext.ts
LegacyCompatibilityWrapper.tsx
UnifiedContextProvider.tsx
```

---

## 🎯 Decisão: Padrão Escolhido

**Localização Padrão:** `/src/contexts/`

### Justificativa:
1. **Convenção moderna:** Alinhado com práticas React modernas
2. **Separação clara:** `/src/core/contexts/` para lógica core, `/src/contexts/` para UI contexts
3. **Simplicidade:** Menor nível de aninhamento
4. **Escalabilidade:** Fácil de organizar por feature

---

## 📋 Plano de Migração

### Fase 1: Análise de Uso ✅
**Status:** Completo

**Contexts Ativos Identificados:**
- ✅ `AuthContext` - Autenticação (usado em App.tsx)
- ✅ `UnifiedCRUDProvider` - CRUD operations (usado em App.tsx)  
- ✅ `ThemeContext` - Temas (usado em App.tsx)
- ✅ `FunnelContext` - Core funnel logic

**Contexts Possivelmente Inativos:**
- ⚠️ `AdminAuthContext`
- ⚠️ `EditorContext`
- ⚠️ `EditorDndContext`
- ⚠️ `EditorQuizContext`
- ⚠️ `EditorRuntimeProviders`
- ⚠️ `FunnelsContext`
- ⚠️ `PreviewContext`
- ⚠️ `QuizContext`
- ⚠️ `QuizFlowProvider`
- ⚠️ `ScrollSyncContext`
- ⚠️ `StepsContext`
- ⚠️ `UnifiedConfigContext`
- ⚠️ `UnifiedFunnelContext`
- ⚠️ `UnifiedFunnelContextRefactored`
- ⚠️ `UserDataContext`
- ⚠️ `ValidationContext`

---

### Fase 2: Estrutura Nova
**Status:** 🔄 Em Progresso

```
src/contexts/
├── auth/
│   ├── AuthContext.tsx ⭐
│   └── AdminAuthContext.tsx
├── editor/
│   ├── EditorContext.tsx
│   ├── EditorDndContext.tsx
│   └── EditorQuizContext.tsx
├── funnel/
│   ├── FunnelsContext.tsx
│   └── UnifiedFunnelContext.tsx
├── quiz/
│   ├── QuizContext.tsx
│   └── QuizFlowProvider.tsx
├── ui/
│   ├── ThemeContext.tsx ⭐
│   ├── PreviewContext.tsx
│   └── ScrollSyncContext.tsx
├── data/
│   ├── UnifiedCRUDProvider.tsx ⭐
│   ├── UserDataContext.tsx
│   └── StepsContext.tsx
├── validation/
│   └── ValidationContext.tsx
├── config/
│   └── UnifiedConfigContext.tsx
└── index.ts  # Re-exports organizados
```

---

### Fase 3: Migração Incremental
**Status:** ⏳ Pendente

#### Etapa 3.1: Mover Contexts Ativos (Prioridade 1)
```bash
# AuthContext
mv src/context/AuthContext.tsx src/contexts/auth/AuthContext.tsx

# UnifiedCRUDProvider
mv src/context/UnifiedCRUDProvider.tsx src/contexts/data/UnifiedCRUDProvider.tsx

# ThemeContext (já está em src/contexts/)
mkdir -p src/contexts/ui/
mv src/contexts/ThemeContext.tsx src/contexts/ui/ThemeContext.tsx
```

#### Etapa 3.2: Atualizar Imports
- Atualizar todos os imports em `src/App.tsx`
- Atualizar imports em pages que usam contexts
- Atualizar imports em components

#### Etapa 3.3: Mover Contexts Core
```bash
# Manter core contexts separados
# src/core/contexts/ permanece para lógica de negócio core
```

#### Etapa 3.4: Migrar Contexts Restantes
- Verificar uso de cada context
- Mover ou marcar para remoção
- Atualizar imports

---

### Fase 4: Limpeza
**Status:** ⏳ Pendente

1. **Remover `/src/context/` antigo** (após migração completa)
2. **Atualizar path aliases** em `tsconfig.json` se necessário
3. **Criar barrel exports** em `/src/contexts/index.ts`
4. **Documentar** estrutura nova

---

## 🚨 Riscos e Mitigações

### Risco 1: Quebrar Imports Existentes
**Mitigação:** 
- Manter context antigo temporariamente
- Criar aliases de compatibilidade
- Migrar incrementalmente

### Risco 2: Contexts com Dependências Circulares
**Mitigação:**
- Mapear dependências antes de mover
- Refatorar se necessário

### Risco 3: Contexts Não Usados
**Mitigação:**
- Fazer grep search antes de mover
- Marcar para remoção se não usado

---

## ✅ Checklist de Execução

### Preparação
- [x] Analisar estrutura atual
- [x] Identificar contexts ativos
- [x] Definir estrutura nova
- [ ] Criar diretórios novos
- [ ] Backup de segurança

### Migração
- [ ] Mover AuthContext
- [ ] Mover UnifiedCRUDProvider
- [ ] Reorganizar ThemeContext
- [ ] Mover contexts core
- [ ] Atualizar imports em App.tsx
- [ ] Atualizar imports em pages
- [ ] Atualizar imports em components

### Validação
- [ ] Executar testes
- [ ] Verificar build
- [ ] Testar funcionalidades principais
- [ ] Revisar imports

### Limpeza
- [ ] Remover pasta `/src/context/`
- [ ] Criar barrel exports
- [ ] Atualizar documentação
- [ ] Commit das mudanças

---

## 📊 Impacto Estimado

### Arquivos a Modificar:
- **Contexts movidos:** ~19 arquivos
- **Imports atualizados:** ~50-100 arquivos (estimativa)
- **Estrutura nova:** 8 subpastas

### Tempo Estimado:
- **Preparação:** 30 min
- **Migração:** 2-3 horas
- **Validação:** 1 hora
- **Total:** ~4 horas

---

## 🎯 Próximos Passos Imediatos

1. ⏸️ **PAUSAR** para aprovação do plano
2. ✅ **EXECUTAR** após aprovação
3. 🧪 **TESTAR** após cada etapa
4. 📝 **DOCUMENTAR** mudanças

---

**Responsável:** AI Agent  
**Aprovação Necessária:** ⚠️ **SIM** - Mudança estrutural grande  
**Recomendação:** Executar em branch separada para testes
