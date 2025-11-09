# 📋 GUIA DE MIGRAÇÃO: Serviços Deprecated → FunnelService

**Data:** 13 de Outubro de 2025  
**Status:** Serviços marcados @deprecated, pendente migração completa

---

## 🎯 OBJETIVO

Migrar todos os imports dos **3 serviços duplicados** para o **FunnelService canônico**.

---

## 📦 SERVIÇOS DEPRECATED

### 1. EnhancedFunnelService
- **Arquivo:** `src/services/EnhancedFunnelService.ts`
- **Status:** ✅ @deprecated (Fase 1)
- **Substituir por:** `src/application/services/FunnelService.ts`

**Arquivos que usam:**
- `src/utils/testCRUDOperations.ts` (testes - pode ser removido)
- `src/services/core/ServiceRegistry.ts` (registro - atualizar)

---

### 2. AdvancedFunnelStorage
- **Arquivo:** `src/services/AdvancedFunnelStorage.ts`
- **Status:** ✅ @deprecated (Fase 1)
- **Substituir por:** `src/application/services/FunnelService.ts`

**Arquivos que usam:**
- `src/services/__tests__/FunnelStorageMigrationTests.ts` (testes - atualizar)
- `src/services/improvedFunnelSystem.ts` (sistema híbrido - refatorar)

---

### 3. contextualFunnelService
- **Arquivo:** `src/services/contextualFunnelService.ts`
- **Status:** ✅ @deprecated (Fase 1)
- **Substituir por:** `src/application/services/FunnelService.ts`

**Arquivos que usam:**
- `src/components/editor/FunnelManager.tsx` (já tem mock local - finalizar migração)

---

## 🔄 MAPEAMENTO DE MÉTODOS

### EnhancedFunnelService → FunnelService

| Método Antigo | Método Novo | Notas |
|---------------|-------------|-------|
| `enhancedFunnelService.createFunnel()` | `funnelService.createFunnel()` | API similar |
| `enhancedFunnelService.getFunnelWithFallback()` | `funnelService.getFunnel()` | Remove fallback |
| `enhancedFunnelService.updateFunnel()` | `funnelService.updateFunnel()` | API similar |
| `enhancedFunnelService.duplicateFunnel()` | `funnelService.duplicateFunnel()` | Verificar implementação |
| `enhancedFunnelService.listFunnels()` | `funnelService.listFunnels()` | Verificar parâmetros |

### AdvancedFunnelStorage → FunnelService

| Método Antigo | Método Novo | Notas |
|---------------|-------------|-------|
| `advancedFunnelStorage.saveFunnel()` | `funnelService.updateFunnel()` | Salvar = update |
| `advancedFunnelStorage.loadFunnel()` | `funnelService.getFunnel()` | API similar |
| `advancedFunnelStorage.deleteFunnel()` | `funnelService.deleteFunnel()` | API similar |

### contextualFunnelService → FunnelService

| Método Antigo | Método Novo | Notas |
|---------------|-------------|-------|
| `contextualFunnelService.saveFunnel()` | `funnelService.updateFunnel()` | Remover context wrapper |
| `contextualFunnelService.listFunnels()` | `funnelService.listFunnels()` | Remover context wrapper |

---

## 📝 INSTRUÇÕES DE MIGRAÇÃO

### Passo 1: Atualizar Imports

**ANTES:**
```typescript
import { enhancedFunnelService } from '@/services/EnhancedFunnelService';
```

**DEPOIS:**
```typescript
import { FunnelService } from '@/application/services/FunnelService';

// Criar instância (ou usar DI)
const funnelService = new FunnelService();
```

---

### Passo 2: Atualizar Chamadas

**ANTES:**
```typescript
const funnel = await enhancedFunnelService.getFunnelWithFallback(id);
```

**DEPOIS:**
```typescript
const funnel = await funnelService.getFunnel(id);
// Se precisar fallback, adicionar lógica:
// const funnel = (await funnelService.getFunnel(id)) || defaultFunnel;
```

---

### Passo 3: Testar

```bash
# Rodar aplicação
npm run dev

# Testar funcionalidades:
# - Criar funil
# - Editar funil
# - Listar funis
# - Deletar funil
```

---

## 📊 STATUS DA MIGRAÇÃO

| Arquivo | Status | Prioridade | Tempo Estimado |
|---------|--------|------------|----------------|
| `testCRUDOperations.ts` | 🔴 Pendente | 🟢 Baixa (pode remover) | 5 min |
| `ServiceRegistry.ts` | 🔴 Pendente | 🔥 Alta | 15 min |
| `FunnelStorageMigrationTests.ts` | 🔴 Pendente | 🟡 Média | 30 min |
| `improvedFunnelSystem.ts` | 🔴 Pendente | 🔥 Alta | 1-2 horas |
| `FunnelManager.tsx` | 🟡 Parcial | 🟡 Média | 30 min |

**Total estimado:** 2-3 horas de migração

---

## 🚨 NOTAS IMPORTANTES

1. **ServiceRegistry.ts:** Este arquivo registra serviços globalmente. Precisa atualizar para usar FunnelService.

2. **improvedFunnelSystem.ts:** Sistema híbrido complexo. Pode precisar refatoração maior.

3. **FunnelManager.tsx:** Já tem mock local, apenas finalizar migração.

4. **Testes:** Arquivos de teste podem ser atualizados ou removidos.

---

## ✅ CHECKLIST

Antes de mover serviços para archived/:

- [ ] Migrar ServiceRegistry.ts
- [ ] Migrar improvedFunnelSystem.ts  
- [ ] Finalizar FunnelManager.tsx
- [ ] Atualizar/remover testes
- [ ] Testar aplicação end-to-end
- [ ] Mover serviços para archived/services-deprecated/
- [ ] Remover imports dos arquivos deprecated
- [ ] Commit mudanças

---

## 📚 REFERÊNCIAS

- **FunnelService Canônico:** `src/application/services/FunnelService.ts`
- **Documentação:** `DEPRECATED.md`
- **Arquitetura:** `ARQUITETURA_FLUXO_DADOS_PAINEL_PROPRIEDADES.md`
