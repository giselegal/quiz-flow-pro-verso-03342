# 🔄 MIGRAÇÃO PARA CANONICAL SERVICES

## ✅ Mudanças Aplicadas

### 1. **Template Persistence Service**
**Arquivo**: `src/services/persistence/TemplatePersistenceService.ts`

**Antes** (usando services deprecated):
```typescript
import { Block } from '@/types/editor';
// Sem integração com serviços centralizados
```

**Depois** (usando Canonical Services):
```typescript
import { Block } from '@/types/editor';
import { EditorService } from '@/services/canonical/EditorService';
import { TemplateService, Template } from '@/services/canonical/TemplateService';

class TemplatePersistenceService {
  private editorService: EditorService;
  private templateService: TemplateService;
  
  constructor(options: PersistenceOptions = {}) {
    // Inicializar serviços canônicos
    this.editorService = EditorService.getInstance({
      autoSave: { enabled: true, interval: 30000, debounce: 2000 },
      persistState: true,
      validateOnChange: true
    });
    
    this.templateService = TemplateService.getInstance();
  }
}
```

**Benefícios**:
- ✅ Usa EditorService canônico para operações de blocos
- ✅ Auto-save nativo do EditorService
- ✅ Validação automática de mudanças
- ✅ Event-driven architecture
- ✅ Singleton pattern (evita múltiplas instâncias)

---

### 2. **Integração com PureBuilderProvider**
**Arquivo**: `src/components/editor/PureBuilderProvider.tsx`

**Status**: ⚠️ DEPRECATED

O `PureBuilderProvider` está marcado como deprecated e deve ser substituído por `SuperUnifiedProvider`.

**Ação Recomendada**:
```typescript
// ❌ NÃO usar
import { usePureBuilder } from '@/hooks/usePureBuilderCompat';

// ✅ Usar ao invés
import { useSuperUnified } from '@/providers/SuperUnifiedProvider';
```

---

### 3. **ConsolidatedTemplateService**
**Arquivo**: `src/services/core/ConsolidatedTemplateService.ts`

**Correção Aplicada**:
```typescript
import { TEMPLATE_SOURCES } from '@/config/templateSources';

async preloadCriticalTemplates(): Promise<void> {
  // Se estamos usando master JSON, só precisamos pré-carregar ele
  const criticalTemplates = TEMPLATE_SOURCES.useMasterJSON 
    ? ['quiz21StepsComplete']  // ✅ Apenas master JSON
    : ['quiz21StepsComplete', 'step-1', 'step-2', ...]; // Modulares
  
  console.log('📋 Templates to preload:', criticalTemplates);
  // ...
}
```

**Benefícios**:
- ✅ Evita erros 404 ao tentar carregar templates modulares
- ✅ Carrega apenas o necessário baseado nas flags de ambiente
- ✅ Logs descritivos para debugging

---

## 🏛️ Arquitetura Canonical Services

### Estrutura:
```
src/services/canonical/
├── index.ts                    # Export central
├── types.ts                    # Tipos compartilhados
├── monitoring.ts               # Sistema de monitoramento
├── CacheService.ts            # ✅ Cache unificado
├── TemplateService.ts         # ✅ Templates consolidados (20 services → 1)
├── EditorService.ts           # ✅ Editor state & operations (7 services → 1)
├── DataService.ts             # 🔄 Data management (31 services → 1)
├── AnalyticsService.ts        # 🔄 Analytics (4 services → 1)
├── StorageService.ts          # 🔄 Storage (7 services → 1)
├── AuthService.ts             # 🔄 Authentication (4 services → 1)
├── ConfigService.ts           # 🔄 Configuration (9 services → 1)
├── ValidationService.ts       # 🔄 Validation (5 services → 1)
├── HistoryService.ts          # 🔄 History/Undo (7 services → 1)
├── MonitoringService.ts       # 🔄 Monitoring (3 services → 1)
└── NotificationService.ts     # 🔄 Notifications (1 service)
```

### Princípios:
1. **Singleton Pattern**: Uma única instância por serviço
2. **Result Pattern**: Retorno consistente `ServiceResult<T>`
3. **Lifecycle Management**: `initialize()` e `dispose()`
4. **Event-Driven**: Comunicação via eventos
5. **Base Class**: `BaseCanonicalService` compartilhada

---

## 📊 TemplateService Canônico

### Funcionalidades:

```typescript
import { templateService } from '@/services/canonical/TemplateService';

// Obter template por ID
const result = await templateService.getTemplate('step-05');
if (result.success) {
  console.log('Template:', result.data);
}

// Obter blocos de um step
const stepResult = await templateService.getStep('step-05');
if (stepResult.success) {
  console.log('Blocos:', stepResult.data);
}

// Salvar template
await templateService.saveTemplate({
  id: 'step-22',
  name: 'Nova Pergunta',
  description: 'Pergunta adicional',
  version: '3.0',
  blocks: [...],
  metadata: { category: 'quiz-style' }
});

// Atualizar template
await templateService.updateTemplate('step-05', {
  name: 'Novo Título',
  blocks: [...]
});
```

### Mapeamento dos 21 Steps:
O `TemplateService` tem mapeamento completo dos 21 steps do Quiz de Estilo:
- Steps 1-2: Introdução
- Steps 3-11: Perguntas de estilo
- Step 12: Transição
- Steps 13-18: Perguntas estratégicas
- Step 19: Transição final
- Step 20: Resultado
- Step 21: Oferta

---

## 🎨 EditorService Canônico

### Funcionalidades:

```typescript
import { EditorService } from '@/services/canonical/EditorService';

const editorService = EditorService.getInstance({
  autoSave: { enabled: true, interval: 30000, debounce: 2000 },
  persistState: true,
  validateOnChange: true
});

// Criar bloco
const result = editorService.createBlock({
  type: 'question-title',
  content: { text: 'Qual sua cor favorita?' },
  layout: { order: 0 }
});

// Mover bloco
editorService.moveBlock('block-id', 3);

// Atualizar bloco
editorService.updateBlock('block-id', {
  content: { text: 'Novo texto' }
});

// Deletar bloco
editorService.deleteBlock('block-id');

// Duplicar bloco
editorService.duplicateBlock('block-id');

// Escutar mudanças
editorService.onChange((event) => {
  console.log('Mudança:', event.type, event.blockId);
});
```

### Auto-Save Nativo:
```typescript
// Auto-save configurado automaticamente
EditorService.getInstance({
  autoSave: {
    enabled: true,
    interval: 30000,   // 30 segundos
    debounce: 2000     // 2 segundos de debounce
  }
});

// Mudanças são salvas automaticamente!
```

---

## 🔄 Fluxo de Persistência Atualizado

### Antes (Manual):
```
1. Usuário arrasta bloco
2. handleDragEnd
3. actions.reorderBlocks (PureBuilderProvider)
4. setState (apenas React)
5. templatePersistence.saveBlockReorder (HTTP)
6. Backend API
7. Arquivo JSON atualizado
```

### Depois (Canonical):
```
1. Usuário arrasta bloco
2. handleDragEnd
3. editorService.moveBlock (EditorService)
4. Estado atualizado + Auto-save queue
5. Após 30s, auto-save dispara
6. templateService.saveTemplate
7. Persistência automática
```

**Benefícios**:
- ✅ Menos código boilerplate
- ✅ Auto-save inteligente (debounce + intervalo)
- ✅ Validação automática
- ✅ Event-driven (múltiplos listeners)
- ✅ Singleton (sem duplicação de estado)

---

## 🛠️ Ferramentas CLI

### Step Generator
**Arquivo**: `scripts/step-generator.mjs`

```bash
# Listar steps
node scripts/step-generator.mjs list

# Adicionar pergunta
node scripts/step-generator.mjs add-question --number 22 --title "Nova Pergunta"

# Adicionar bloco
node scripts/step-generator.mjs add-block --step 5 --type question-progress --position 0

# Reordenar
node scripts/step-generator.mjs reorder --from 10 --to 8
```

### Dev Server API
**Arquivo**: `scripts/dev-server.mjs`

```bash
# Iniciar servidor
node scripts/dev-server.mjs

# Endpoints disponíveis:
# POST /api/templates/save
# POST /api/templates/apply-changes
# GET  /api/templates/current
# GET  /api/templates/backups
# POST /api/templates/restore
```

---

## 📋 Checklist de Migração

### ✅ Concluído:
- [x] TemplatePersistenceService migrado para Canonical Services
- [x] ConsolidatedTemplateService corrigido (preload condicional)
- [x] Step Generator CLI criado
- [x] Dev Server API criado
- [x] Documentação completa

### 🔄 Próximos Passos:
- [ ] Migrar PureBuilderProvider para SuperUnifiedProvider
- [ ] Atualizar componentes de canvas para usar EditorService
- [ ] Configurar variáveis de ambiente no Lovable
- [ ] Testar auto-save em produção
- [ ] Implementar UI para gerenciar backups

---

## 🎯 Uso Recomendado

### Para Operações de Blocos:
```typescript
// ✅ Usar EditorService canônico
import { EditorService } from '@/services/canonical/EditorService';
const editor = EditorService.getInstance();

// ❌ NÃO usar PureBuilderProvider
import { usePureBuilder } from '@/hooks/usePureBuilderCompat';
```

### Para Templates:
```typescript
// ✅ Usar TemplateService canônico
import { TemplateService } from '@/services/canonical/TemplateService';
const templates = TemplateService.getInstance();

// ❌ NÃO usar HybridTemplateService (deprecated)
import { HybridTemplateService } from '@/services/HybridTemplateService';
```

### Para Persistência:
```typescript
// ✅ Usar TemplatePersistenceService atualizado
import { templatePersistence } from '@/services/persistence/TemplatePersistenceService';

// O serviço agora usa EditorService + TemplateService internamente
await templatePersistence.saveBlockReorder('step-05', blocks);
```

---

## 🔍 Debugging

### Verificar Serviços Carregados:
```typescript
// Console
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';

// Ver uso dos serviços
CanonicalServicesMonitor.getReport();

// Ver bridges legados ainda em uso
CanonicalServicesMonitor.getLegacyBridgeReport();
```

### Logs:
```
✅ EditorService initialized successfully
✅ TemplateService initialized with UnifiedTemplateRegistry
🔄 [Persistence] Salvando reordenação do step step-05
⏰ [Persistence] Auto-save ativado (intervalo: 30000ms)
✅ [Persistence] Mudanças aplicadas com sucesso
```

---

## 📚 Referências

### Documentação Canonical Services:
- `src/services/canonical/README.md` (se existir)
- `src/services/canonical/types.ts` - Tipos base
- `src/services/canonical/monitoring.ts` - Sistema de monitoramento

### Exemplos de Uso:
- `src/services/HybridTemplateService.ts` - Bridge para TemplateService
- `src/services/UnifiedTemplateService.ts` - Bridge para TemplateService
- `src/services/canonical/data/ParticipantDataService.ts` - Exemplo completo

---

## 🎉 Benefícios da Migração

1. **Consolidação**: 108 services → 12 canonical services
2. **Manutenibilidade**: Código centralizado e organizado
3. **Performance**: Singleton pattern + cache inteligente
4. **Debugging**: Logs padronizados e monitoramento
5. **Escalabilidade**: Arquitetura event-driven
6. **Confiabilidade**: Result pattern + validação automática
7. **DX (Developer Experience)**: API unificada e consistente

---

**Status**: ✅ Migração da persistência concluída
**Próxima etapa**: Migrar componentes de canvas para usar EditorService diretamente
