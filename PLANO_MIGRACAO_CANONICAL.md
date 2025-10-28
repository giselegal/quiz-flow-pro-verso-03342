# 📋 Plano de Migração para `/services/canonical`

## 🎯 Objetivo
Consolidar todos os services duplicados e fragmentados para a estrutura canonical, eliminando duplicação de código e reduzindo o bundle em ~251 kB (-30%).

---

## ✅ Services Já Migrados (Canonical)

| Service | Status | Arquivo | Uso |
|---------|--------|---------|-----|
| TemplateService | ✅ Completo | `canonical/TemplateService.ts` | EditorProviderUnified ✅ |
| CacheService | ✅ Completo | `canonical/CacheService.ts` | Usado por todos services |
| DataService | ✅ Completo | `canonical/DataService.ts` | CRUD operations |
| StorageService | ✅ Completo | `canonical/StorageService.ts` | Supabase storage |
| AnalyticsService | ✅ Completo | `canonical/AnalyticsService.ts` | Métricas e eventos |
| AuthService | ✅ Completo | `canonical/AuthService.ts` | Autenticação |
| ConfigService | ✅ Completo | `canonical/ConfigService.ts` | Configurações |
| HistoryService | ✅ Completo | `canonical/HistoryService.ts` | Histórico de mudanças |
| EditorService | ✅ Completo | `canonical/EditorService.ts` | Lógica do editor |
| MonitoringService | ✅ Completo | `canonical/MonitoringService.ts` | Monitoramento central |
| NotificationService | ✅ Completo | `canonical/NotificationService.ts` | Notificações |
| ValidationService | ✅ Completo | `canonical/ValidationService.ts` | Validações |
| StepHistoryService | ✅ Completo | `canonical/StepHistoryService.ts` | Histórico de steps |

---

## ❌ Services Duplicados (PRIORIDADE ALTA)

### 1️⃣ UnifiedTemplateService.ts
**Status:** ⚠️ DUPLICAÇÃO CRÍTICA  
**Tamanho:** ~340 linhas (~10-15 kB no bundle)  
**Problema:** Duplica 100% da funcionalidade do canonical/TemplateService  
**Usado em:**
- ❌ `contexts/editor/EditorContext.tsx` (linha 615)
- ❌ `pages/dashboard/TemplatePreviewPage.tsx` (linha 14)

**Solução:**
```typescript
// ANTES (errado)
import { UnifiedTemplateService } from '@/services/UnifiedTemplateService';
const service = UnifiedTemplateService.getInstance();

// DEPOIS (correto)
import { templateService } from '@/services/canonical/TemplateService';
// Usar diretamente - já é singleton
```

**Ação:** 
1. Migrar EditorContext.tsx
2. Migrar TemplatePreviewPage.tsx
3. Deletar UnifiedTemplateService.ts
4. **Impacto esperado no bundle:** -10 kB

---

### 2️⃣ MonitoringService.ts
**Status:** ⚠️ DUPLICAÇÃO  
**Tamanho:** ~260 linhas (~8-10 kB no bundle)  
**Problema:** Duplica canonical/MonitoringService  
**Usado em:**
- ❌ `components/deployment/DeployConfiguration.tsx`
- ❌ `components/editor/unified/UnifiedPreviewEngine-drag.tsx`
- ❌ `components/editor/unified/EditorControlsManager.tsx`

**Solução:**
```typescript
// ANTES (errado)
import { useMonitoring } from '@/services/MonitoringService';

// DEPOIS (correto)
import { monitoringService } from '@/services/canonical/MonitoringService';
// Criar hook wrapper se necessário
```

**Ação:**
1. Criar `useMonitoring` hook no canonical se não existir
2. Migrar 3 componentes
3. Deletar MonitoringService.ts
4. **Impacto esperado no bundle:** -8 kB

---

### 3️⃣ NotificationService.ts
**Status:** ⚠️ DUPLICAÇÃO (não usado diretamente)  
**Tamanho:** ~150 linhas (~5 kB no bundle)  
**Problema:** Duplica canonical/NotificationService  
**Usado em:** Nenhum import direto encontrado (pode estar no bundle por import indireto)

**Ação:**
1. Verificar se está no bundle
2. Se sim, deletar arquivo
3. **Impacto esperado no bundle:** -5 kB

---

### 4️⃣ UnifiedStorageService.ts
**Status:** ⚠️ DUPLICAÇÃO  
**Tamanho:** ~200 linhas (~7 kB no bundle)  
**Problema:** Duplica canonical/StorageService  
**Usado em:**
- ❌ `services/aliases/index.ts` (linha 63 - apenas re-export)

**Ação:**
1. Remover re-export de aliases
2. Deletar UnifiedStorageService.ts
3. **Impacto esperado no bundle:** -7 kB

---

## 🔄 Services a Migrar para Canonical (PRIORIDADE MÉDIA)

### 5️⃣ NavigationService.ts → canonical/NavigationService.ts
**Tamanho:** ~350 linhas  
**Justificativa:** Service core usado em todo editor  
**Complexidade:** Média  
**Uso:** EditorProviderUnified, QuizModularProductionEditor

**Ação:**
1. Mover para `canonical/NavigationService.ts`
2. Estender `BaseCanonicalService`
3. Adicionar cache e monitoring
4. Atualizar imports

---

### 6️⃣ sessionService.ts + userResponseService.ts → canonical/SessionService.ts
**Tamanho:** ~200 linhas combinadas  
**Justificativa:** Gerenciamento de sessão é core  
**Complexidade:** Baixa  

**Ação:**
1. Criar `canonical/SessionService.ts` consolidando ambos
2. Adicionar métodos de user responses
3. Integrar com DataService
4. Migrar importadores

---

### 7️⃣ JsonTemplateService.ts → Absorver no canonical/TemplateService
**Tamanho:** ~470 linhas  
**Justificativa:** Lógica de templates JSON deve estar no TemplateService  
**Complexidade:** Alta  

**Ação:**
1. Adicionar métodos JSON ao canonical/TemplateService
2. Migrar lógica de parsing
3. Deletar JsonTemplateService.ts

---

### 8️⃣ VersioningService.ts → canonical/VersioningService.ts
**Tamanho:** ~65 linhas  
**Justificativa:** Versionamento é funcionalidade core  
**Complexidade:** Baixa  

**Ação:**
1. Mover para canonical
2. Integrar com HistoryService
3. Adicionar cache

---

### 9️⃣ PropertyExtractionService.ts → canonical/PropertyService.ts
**Tamanho:** ~730 linhas  
**Justificativa:** Extração de propriedades é core do editor  
**Complexidade:** Média  

**Ação:**
1. Criar canonical/PropertyService.ts
2. Migrar lógica de extração
3. Adicionar cache de schemas

---

### 🔟 PermissionService.ts → canonical/PermissionService.ts
**Tamanho:** ~480 linhas  
**Justificativa:** Permissões são core  
**Complexidade:** Média  

**Ação:**
1. Mover para canonical
2. Integrar com AuthService
3. Adicionar cache de permissões

---

## 📦 Services que Devem Permanecer Fora do Canonical

| Service | Justificativa |
|---------|---------------|
| `UnifiedQuizBridge.ts` | Lógica específica de quiz, não core |
| `QuizEditorBridge.ts` | Bridge específico editor ↔ quiz |
| `FunnelTypesRegistry.ts` | Registry especializado |
| `AdvancedPersonalizationEngine.ts` | Engine complexo e específico |
| `WhatsAppBusinessAPI.ts` | Integração externa |
| `FunnelAIAgent.ts` | AI agent específico |
| `componentLibrary.ts` | Biblioteca de componentes |

---

## 📊 Impacto Estimado no Bundle

| Ação | Redução Esperada |
|------|------------------|
| Remover UnifiedTemplateService | -10 kB |
| Remover MonitoringService duplicado | -8 kB |
| Remover NotificationService duplicado | -5 kB |
| Remover UnifiedStorageService | -7 kB |
| Consolidar NavigationService | -5 kB |
| Consolidar SessionService | -3 kB |
| Consolidar JsonTemplateService no TemplateService | -12 kB |
| Consolidar VersioningService | -2 kB |
| Consolidar PropertyExtractionService | -15 kB |
| Consolidar PermissionService | -10 kB |
| **TOTAL ESTIMADO** | **-77 kB** |

---

## 🎯 Roadmap de Execução

### Fase 1: Eliminar Duplicações Críticas (1-2 horas)
- [ ] 1. Migrar EditorContext.tsx para canonical/TemplateService
- [ ] 2. Migrar TemplatePreviewPage.tsx para canonical/TemplateService
- [ ] 3. Deletar UnifiedTemplateService.ts
- [ ] 4. Build test → Esperado: -10 kB

### Fase 2: Eliminar Duplicações Secundárias (1 hora)
- [ ] 5. Migrar 3 componentes para canonical/MonitoringService
- [ ] 6. Deletar MonitoringService.ts
- [ ] 7. Deletar NotificationService.ts
- [ ] 8. Deletar UnifiedStorageService.ts
- [ ] 9. Build test → Esperado: -20 kB cumulativo

### Fase 3: Consolidar Services Core (2-3 horas)
- [ ] 10. Criar canonical/NavigationService.ts
- [ ] 11. Criar canonical/SessionService.ts
- [ ] 12. Migrar JsonTemplateService para canonical/TemplateService
- [ ] 13. Build test → Esperado: -40 kB cumulativo

### Fase 4: Consolidar Services Especializados (2-3 horas)
- [ ] 14. Criar canonical/VersioningService.ts
- [ ] 15. Criar canonical/PropertyService.ts
- [ ] 16. Criar canonical/PermissionService.ts
- [ ] 17. Build test → Esperado: -77 kB cumulativo

### Fase 5: Validação e Cleanup (1 hora)
- [ ] 18. Atualizar `services/aliases/index.ts`
- [ ] 19. Remover arquivos obsoletos
- [ ] 20. Atualizar documentação
- [ ] 21. Build final e testes E2E

---

## 🔍 Verificação de Sucesso

**Critérios de Aceitação:**
- ✅ Bundle main.js < 670 kB (-10%)
- ✅ Sem imports de services duplicados
- ✅ Todos testes passando
- ✅ Sem erros de compilação TypeScript
- ✅ Coverage de monitoramento canonical > 90%

**Comando de Verificação:**
```bash
npm run build | grep "main-.*\.js"
# Target: < 670 kB (atualmente 748 kB)
```

---

## 📝 Notas Importantes

1. **Manter Aliases Temporários**: Durante migração, manter aliases em `services/aliases/index.ts` para não quebrar código existente

2. **Testes Incrementais**: Fazer build após cada fase para validar impacto

3. **Documentar Mudanças**: Atualizar MIGRATION_GUIDE.md com breaking changes

4. **Rollback Plan**: Manter backups dos arquivos originais até validação completa

---

## 🚀 Próxima Ação Imediata

**COMEÇAR POR:** Fase 1, Item 1  
**Arquivo:** `src/contexts/editor/EditorContext.tsx`  
**Linha:** 615  
**Mudança:**
```diff
- const { default: templateService } = await import('../../services/templateService');
+ import { templateService } from '@/services/canonical/TemplateService';
```

**Comando de teste:**
```bash
npm run build && npm run test
```
