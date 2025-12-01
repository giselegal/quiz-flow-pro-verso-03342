# 📝 Templates Services - Estrutura Modular (PLANEJADO)

**Status:** 🟡 Planejado (não implementado ainda)  
**Prioridade:** Média  
**Risco:** Alto (TemplateService tem 2128 linhas, 43 métodos, usado em +50 arquivos)

---

## 🎯 OBJETIVO

Quebrar `src/services/canonical/TemplateService.ts` (2128 linhas) em módulos especializados menores.

---

## 📊 ANÁLISE DO TEMPLATESERVICE ATUAL

### Tamanho
- **2128 linhas**
- **43 métodos públicos/privados**
- **~50+ arquivos** importando

### Responsabilidades Identificadas

#### 1. **Cache Management** (~300 linhas)
```typescript
// Métodos:
- invalidateTemplate(id)
- invalidateStepCache(stepId)
- clearCache()
- getCacheStats()
- logCacheReport()
```

#### 2. **Template Loading** (~400 linhas)
```typescript
// Métodos:
- loadV4Template()
- getTemplate(id)
- getStep(stepId)
- getStepV4(stepId)
- getAllSteps()
- getAllStepsSync()
```

#### 3. **Validation** (~200 linhas)
```typescript
// Métodos:
- validateTemplate(template)
- validateStep(stepId, blocks)
- normalizeBlocks(blocks)
- normalizeBlockType(type)
```

#### 4. **Preload/Lazy Loading** (~400 linhas)
```typescript
// Métodos:
- lazyLoadStep(stepId, preloadNeighbors)
- preloadTemplates(ids)
- prepareTemplate(templateId)
- preloadTemplate(templateId)
- unloadInactiveSteps(inactiveMinutes)
```

#### 5. **CRUD Operations** (~300 linhas)
```typescript
// Métodos:
- saveTemplate(template)
- updateTemplate(id, updates)
- deleteTemplate(id)
- saveStep(stepId, blocks)
- createBlock(stepId, dto)
- updateBlock(stepId, blockId, updates)
- deleteBlock(stepId, blockId)
```

#### 6. **Query/Search** (~200 linhas)
```typescript
// Métodos:
- listTemplates(filters)
- searchTemplates(query)
- listSteps(templateId)
- getTemplateMetadata(id)
```

#### 7. **Active State** (~100 linhas)
```typescript
// Métodos:
- setActiveTemplate(templateId, totalSteps)
- setActiveFunnel(funnelId)
- getActiveTemplate()
- getActiveFunnel()
```

#### 8. **Health/Utility** (~200 linhas)
```typescript
// Métodos:
- healthCheck()
- getStepOrder()
- hasStep(stepId)
- resolveTemplateId(templateId)
- resolveFunnelId(funnelId)
- extractStepNumber(stepId)
```

---

## 🏗️ ESTRUTURA PROPOSTA

```
src/services/templates/
├── index.ts                    # Exports públicos
├── TemplateService.ts          # Orquestrador principal (~300 linhas)
├── TemplateLoader.ts           # Load/fetch templates (~400 linhas)
├── TemplateCache.ts            # Cache strategy (~300 linhas)
├── TemplateValidator.ts        # Zod validation (~200 linhas)
├── TemplatePreloader.ts        # Lazy loading (~400 linhas)
├── TemplateCRUD.ts             # CRUD ops (~300 linhas)
├── TemplateQuery.ts            # Search/list (~200 linhas)
└── README.md                   # Docs
```

---

## ⚠️ POR QUE NÃO IMPLEMENTAR AGORA?

### Riscos Altos
1. **TemplateService está em produção** - usado em +50 arquivos
2. **2128 linhas** de lógica complexa e interconectada
3. **Dependências circulares** potenciais entre módulos
4. **Testes podem quebrar** sem cobertura adequada
5. **Tempo estimado:** 5-7 dias + 3 dias de testes

### Abordagem Mais Segura

#### **FASE 1.2A: Documentação e Isolamento (1 dia)**
- ✅ Criar README.md explicando responsabilidades
- ✅ Adicionar comentários de seção no TemplateService.ts
- ✅ Identificar imports críticos
- ⚠️ **NÃO MOVER CÓDIGO AINDA**

#### **FASE 1.2B: Testes de Cobertura (2 dias)**
- ✅ Garantir >70% coverage do TemplateService
- ✅ Testes E2E dos fluxos principais
- ✅ Mocks para quebrar dependências

#### **FASE 1.2C: Extração Gradual (5 dias)**
- ✅ Começar com TemplateValidator (mais isolado)
- ✅ Depois TemplateCache
- ✅ Por último: Loader e Preloader (mais acoplados)

---

## 📝 DECISÃO: FASE 1.2 REDUZIDA

**IMPLEMENTAR AGORA:**
1. ✅ Documentar responsabilidades (este arquivo)
2. ✅ Adicionar comentários de seção no TemplateService.ts
3. ✅ Criar índice de métodos por categoria

**POSTERGAR:**
- ❌ Extração real de código (risco muito alto)
- ❌ Quebrar TemplateService (sem testes suficientes)

---

## 🎯 MAPEAMENTO DE MÉTODOS

### 🔄 Cache Management (5 métodos)
```typescript
TemplateService.invalidateTemplate(id: string): void
TemplateService.invalidateStepCache(stepId: string): void
TemplateService.clearCache(): void
TemplateService.getCacheStats(): { ... }
TemplateService.logCacheReport(): void
```

### 📥 Loading (8 métodos)
```typescript
TemplateService.loadV4Template(): Promise<ServiceResult<any>>
TemplateService.getTemplate(id: string): Promise<ServiceResult<Template>>
TemplateService.getStep(stepId: string, options?: ServiceOptions): Promise<ServiceResult<Block[]>>
TemplateService.getStepV4(stepId: string): Promise<ServiceResult<any>>
TemplateService.getAllSteps(): Promise<Record<string, any>>
TemplateService.getAllStepsSync(): Record<string, any>
TemplateService.getStepOrder(): string[]
TemplateService.hasStep(stepId: string): boolean
```

### ✅ Validation (4 métodos)
```typescript
TemplateService.validateTemplate(template: Template): ValidationResult
TemplateService.validateStep(stepId: string, blocks: any[]): Promise<ServiceResult<ValidationResult>>
TemplateService.normalizeBlocks(blocks: any[]): Block[]
TemplateService.normalizeBlockType(type: string): string  // private
```

### 🚀 Preload/Lazy (5 métodos)
```typescript
TemplateService.lazyLoadStep(stepId: string, preloadNeighbors?: boolean): Promise<any>
TemplateService.preloadTemplates(ids: string[]): Promise<void>
TemplateService.prepareTemplate(templateId: string, options?: ServiceOptions): Promise<ServiceResult<void>>
TemplateService.preloadTemplate(templateId: string, options?: ServiceOptions): Promise<ServiceResult<void>>
TemplateService.unloadInactiveSteps(inactiveMinutes?: number): void
```

### 💾 CRUD (7 métodos)
```typescript
TemplateService.saveTemplate(template: Template): Promise<ServiceResult<void>>
TemplateService.updateTemplate(id: string, updates: Partial<Template>): Promise<ServiceResult<void>>
TemplateService.deleteTemplate(id: string): Promise<ServiceResult<void>>
TemplateService.saveStep(stepId: string, blocks: Block[], options?: ServiceOptions): Promise<ServiceResult<void>>
TemplateService.createBlock(stepId: string, dto: CreateBlockDTO): Promise<ServiceResult<Block>>
TemplateService.updateBlock(stepId: string, blockId: string, updates: Partial<Block>): Promise<ServiceResult<void>>
TemplateService.deleteBlock(stepId: string, blockId: string): Promise<ServiceResult<void>>
```

### 🔍 Query/Search (3 métodos)
```typescript
TemplateService.listTemplates(filters?: TemplateFilters): ServiceResult<Template[]>
TemplateService.searchTemplates(query: string): ServiceResult<Template[]>
TemplateService.listSteps(templateId?: string, options?: ServiceOptions): Promise<ServiceResult<StepInfo[]>>
TemplateService.getTemplateMetadata(id: string): Promise<ServiceResult<TemplateMetadata>>
```

### 🎯 Active State (4 métodos)
```typescript
TemplateService.setActiveTemplate(templateId: string, totalSteps: number): void
TemplateService.setActiveFunnel(funnelId: string | null): void
TemplateService.getActiveTemplate(): string | null
TemplateService.getActiveFunnel(): string | null
```

### 🔧 Utilities (7 métodos)
```typescript
TemplateService.getInstance(options?: ServiceOptions): TemplateService  // static
TemplateService.healthCheck(): Promise<boolean>
TemplateService.resolveTemplateId(templateId: string): string  // private
TemplateService.resolveFunnelId(funnelId: string): string  // private
TemplateService.extractStepNumber(stepId: string): number | null  // private
```

**Total:** 43 métodos

---

## 🛠️ IMPLEMENTAÇÃO FUTURA (quando for seguro)

### Passo 1: TemplateValidator (mais isolado)

```typescript
// src/services/templates/TemplateValidator.ts
import { Template, Block, ValidationResult } from './types';

export class TemplateValidator {
  validateTemplate(template: Template): ValidationResult {
    // Move lógica de TemplateService.validateTemplate()
  }

  validateStep(stepId: string, blocks: Block[]): Promise<ValidationResult> {
    // Move lógica de TemplateService.validateStep()
  }

  normalizeBlocks(blocks: any[]): Block[] {
    // Move lógica de TemplateService.normalizeBlocks()
  }

  private normalizeBlockType(type: string): string {
    // Move lógica de TemplateService.normalizeBlockType()
  }
}
```

### Passo 2: TemplateCache (delegação ao CacheService)

```typescript
// src/services/templates/TemplateCache.ts
import { cacheService } from '@/services/canonical/CacheService';

export class TemplateCache {
  invalidate(id: string): void {
    cacheService.templates.invalidate(id);
  }

  invalidateStep(stepId: string): void {
    cacheService.templates.invalidate(stepId);
  }

  clear(): void {
    cacheService.clearStore('templates');
  }

  getStats() {
    return cacheService.getStats('templates');
  }
}
```

### Passo 3: TemplateLoader (complexo - requer cuidado)

```typescript
// src/services/templates/TemplateLoader.ts
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

export class TemplateLoader {
  async loadTemplate(id: string): Promise<Template> {
    // Move lógica de TemplateService.getTemplate()
  }

  async loadStep(stepId: string): Promise<Block[]> {
    // Move lógica de TemplateService.getStep()
  }

  // ... outros métodos
}
```

---

## 📋 CHECKLIST ANTES DE EXTRAIR

- [ ] Cobertura de testes >70% no TemplateService
- [ ] Testes E2E dos fluxos principais
- [ ] Mapeamento de todas as dependências
- [ ] Feature flag para rollback
- [ ] Aprovação do time
- [ ] Janela de manutenção agendada

---

## 🎓 LIÇÕES APRENDIDAS

### Por que TemplateService ficou tão grande?

1. **Responsabilidade única violada** - faz tudo relacionado a templates
2. **Sem arquitetura modular** desde o início
3. **Features adicionadas incrementalmente** sem refactor
4. **Acoplamento com CacheService, HierarchicalSource**
5. **Singleton pattern** dificulta testes unitários

### Como evitar no futuro?

- ✅ Começar com módulos pequenos desde o início
- ✅ Limite: 300 linhas por arquivo
- ✅ Interface clara entre módulos
- ✅ Dependency injection em vez de singleton
- ✅ Testes desde o dia 1

---

**Status:** Documentado e pronto para extração futura quando for seguro.
