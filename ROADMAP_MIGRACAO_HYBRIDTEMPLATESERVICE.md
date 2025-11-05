# 🛣️ Roadmap de Migração: HybridTemplateService → TemplateService

**Data**: 2025-11-05  
**Status**: Planejamento  
**Prioridade**: Média (Dívida Técnica)

---

## 📊 Análise Atual

### Estado Atual
- **HybridTemplateService**: 166 referências identificadas
- **Localização**: `src/services/deprecated/HybridTemplateService.ts`
- **Arquitetura**: Wrapper que delega para `TemplateService` canônico
- **Comportamento**: Logs de deprecação em desenvolvimento

### Distribuição de Uso

```
38 imports diretos encontrados:
├─ Components (Admin)         2 arquivos
├─ Hooks                       2 arquivos  
├─ Orchestrators              3 arquivos
├─ Pages                      1 arquivo
├─ Services (internos)        4 arquivos
├─ Utils                      3 arquivos
├─ Tests                      3 arquivos
└─ Docs/Archive              20 arquivos
```

---

## 🎯 Objetivos da Migração

1. **Eliminar camada de indireção**: Reduzir overhead de delegation
2. **Simplificar arquitetura**: Uma única fonte de verdade para templates
3. **Melhorar performance**: Acesso direto ao serviço canônico
4. **Facilitar manutenção**: Menos código duplicado/wrapper

---

## 📋 Inventário Completo

### 🔴 Crítico - Produção Ativa

#### Components (2)
```typescript
// src/components/admin/StepConfigurationPanel.tsx
import { HybridTemplateService } from '@/services/aliases';

// src/components/admin/ResultConfigurationPanel.tsx  
import { HybridTemplateService } from '@/services/aliases';
```

#### Orchestrators (3)
```typescript
// src/orchestrators/QuizAutoBootstrap.ts
import { HybridTemplateService } from '@/services/aliases';

// src/orchestrators/QuizDataPipeline.ts
import { HybridTemplateService } from '@/services/aliases';

// src/orchestrators/QuizOrchestrator.ts
import { HybridTemplateService } from '@/services/aliases';
```

#### Pages (1)
```typescript
// src/pages/dashboard/QuizEditorPage.tsx
import { HybridTemplateService } from '@/services/aliases';
```

---

### 🟡 Moderado - Funcionalidade Auxiliar

#### Hooks (2)
```typescript
// src/hooks/useFunnelAI.ts
import { HybridTemplateService } from '@/services/aliases';
import { AIEnhancedHybridTemplateService } from '@/services/AIEnhancedHybridTemplateService';
```

#### Engines (1)
```typescript
// src/engines/SmartNavigation.ts
import { HybridTemplateService } from '@/services/aliases';
```

#### Utils (3)
```typescript
// src/utils/funnelAIActivator.ts
import { HybridTemplateService } from '@/services/aliases';
import { AIEnhancedHybridTemplateService } from '@/services/AIEnhancedHybridTemplateService';

// src/utils/hybridIntegration.ts
import { HybridTemplateService } from '@/services/aliases';
```

---

### 🟢 Baixo - Serviços Internos

#### Services (4)
```typescript
// src/services/ServiceAliases.ts
import HybridTemplateServiceClass from './HybridTemplateService';
export { default as HybridTemplateService } from './HybridTemplateService';

// src/services/aliases/index.ts  
export { default as HybridTemplateService } from '@/services/deprecated/HybridTemplateService';

// src/services/deprecated/TemplateEditorService.ts
import HybridTemplateService from './HybridTemplateService';

// src/services/FunnelTypesRegistry.ts
import HybridTemplateService from './deprecated/HybridTemplateService';
```

---

### 🔵 Informativo - Tests/Docs

#### Tests (3)
```typescript
// src/__tests__/canonical-migration.test.ts
// src/__tests__/HybridTemplateService.test.ts
// src/__tests__/integration.test.ts
```

#### Archive/Docs (20+)
- Arquivos em `.archive/` e `docs/` - Apenas referências históricas

---

## 🗺️ Estratégia de Migração

### Fase 1: Preparação (1 semana)
**Objetivo**: Garantir compatibilidade total entre serviços

#### Tarefas:
1. ✅ **Análise Completa**
   - [x] Mapear todas as 166 referências
   - [x] Categorizar por criticidade
   - [x] Identificar padrões de uso

2. **Criar Guia de Migração**
   ```markdown
   # Guia de Migração Rápida
   
   ## Antes
   ```typescript
   import { HybridTemplateService } from '@/services/aliases';
   const template = await HybridTemplateService.getTemplate('step-01');
   ```
   
   ## Depois  
   ```typescript
   import { TemplateService } from '@/services/canonical/TemplateService';
   const template = await TemplateService.getInstance().getTemplate('step-01');
   ```
   ```

3. **Validar API Parity**
   ```typescript
   // Verificar que TemplateService possui todos os métodos:
   - getTemplate(id: string): Promise<Template>
   - getStepConfig(stepId: string): Promise<StepConfig>
   - getMasterTemplate(funnel: string): Promise<MasterTemplate>
   - getBlocks(stepId: string): Promise<Block[]>
   ```

---

### Fase 2: Migração Gradual (2-3 semanas)

#### Semana 1: Infraestrutura (🟢 Baixo)
**Prioridade**: Services internos que são wrappers

```typescript
// 1. ServiceAliases.ts
- export { TemplateService as HybridTemplateService }
+ Manter alias temporário com deprecation warning

// 2. FunnelTypesRegistry.ts  
- import HybridTemplateService from './deprecated/HybridTemplateService'
+ import { TemplateService } from './canonical/TemplateService'
```

**Estimativa**: 2 dias  
**Risco**: Baixo  
**Testes**: Unitários existentes

---

#### Semana 2: Camada de Aplicação (🟡 Moderado)

**Hooks & Utils**
```typescript
// useFunnelAI.ts, funnelAIActivator.ts, hybridIntegration.ts
const templateService = TemplateService.getInstance();
```

**Engines**
```typescript
// SmartNavigation.ts
const templateService = TemplateService.getInstance();
```

**Estimativa**: 3 dias  
**Risco**: Médio  
**Testes**: Integração + E2E

---

#### Semana 3: Componentes Críticos (🔴 Crítico)

**Admin Panels**
```typescript
// StepConfigurationPanel.tsx
// ResultConfigurationPanel.tsx
const templateService = TemplateService.getInstance();
```

**Orchestrators**
```typescript
// QuizAutoBootstrap.ts, QuizDataPipeline.ts, QuizOrchestrator.ts
const templateService = TemplateService.getInstance();
```

**Pages**
```typescript
// QuizEditorPage.tsx
const templateService = TemplateService.getInstance();
```

**Estimativa**: 5 dias  
**Risco**: Alto  
**Testes**: E2E completo + Smoke test em staging

---

### Fase 3: Limpeza (1 semana)

#### Tarefas:
1. **Remover HybridTemplateService**
   ```bash
   rm src/services/deprecated/HybridTemplateService.ts
   ```

2. **Remover AIEnhancedHybridTemplateService**
   ```bash
   rm src/services/deprecated/AIEnhancedHybridTemplateService.ts
   rm src/services/AIEnhancedHybridTemplateService.ts
   ```

3. **Atualizar Tests**
   ```typescript
   // Substituir todos os mocks
   jest.mock('@/services/canonical/TemplateService');
   ```

4. **Limpar Aliases**
   ```typescript
   // ServiceAliases.ts - remover exports deprecated
   - export { HybridTemplateService }
   ```

5. **Atualizar Docs**
   - Adicionar migration notes
   - Atualizar arquitetura diagrams
   - Marcar docs antigos como deprecated

---

## 🧪 Estratégia de Testes

### Testes Unitários
```typescript
describe('TemplateService Migration', () => {
  it('should load templates with same behavior as HybridTemplateService', async () => {
    const oldService = new HybridTemplateService();
    const newService = TemplateService.getInstance();
    
    const oldResult = await oldService.getTemplate('step-01');
    const newResult = await newService.getTemplate('step-01');
    
    expect(newResult).toEqual(oldResult);
  });
});
```

### Testes de Integração
```typescript
describe('End-to-End Template Loading', () => {
  it('should load quiz21StepsComplete without HybridTemplateService', async () => {
    // Simular fluxo completo do editor
    const templateService = TemplateService.getInstance();
    const funnel = await templateService.getMasterTemplate('quiz21StepsComplete');
    
    expect(funnel.steps).toHaveLength(21);
    expect(funnel.steps[0].blocks).toBeDefined();
  });
});
```

### Smoke Tests (Staging)
```bash
# Checklist manual
□ /editor?template=quiz21StepsComplete carrega
□ Cache funciona (verificar hits no console)
□ Steps navegam corretamente  
□ Blocos renderizam com estilos
□ Admin panels funcionam
□ Salvamento de configurações OK
```

---

## 📦 Compatibilidade Durante Migração

### Abordagem: Shim Layer Temporário

```typescript
// src/services/aliases/index.ts
import { TemplateService } from '@/services/canonical/TemplateService';

/**
 * @deprecated Use TemplateService.getInstance() directly
 * Temporary shim for backward compatibility during migration
 */
export class HybridTemplateServiceShim {
  private static instance = TemplateService.getInstance();
  
  static getTemplate(id: string) {
    console.warn('[DEPRECATED] Use TemplateService.getInstance().getTemplate()');
    return this.instance.getTemplate(id);
  }
  
  static getStepConfig(stepId: string) {
    console.warn('[DEPRECATED] Use TemplateService.getInstance().getStepConfig()');
    return this.instance.getStepConfig(stepId);
  }
  
  // ... outros métodos
}

export { HybridTemplateServiceShim as HybridTemplateService };
```

**Benefícios**:
- ✅ Zero breaking changes durante migração
- ✅ Warnings visíveis em dev mode
- ✅ Fácil identificar código não migrado
- ✅ Remove apenas no final da Fase 3

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Breaking changes em prod | Baixa | Alto | Shim layer + testes E2E |
| Cache inconsistencies | Média | Médio | Limpar localStorage na release |
| Performance regression | Baixa | Baixo | Benchmarks antes/depois |
| Tests flaky | Média | Baixo | Mock TemplateService adequadamente |

---

## 📈 Métricas de Sucesso

### Durante Migração
- [ ] 0 erros em produção relacionados
- [ ] 100% dos testes passando
- [ ] Performance ≥ baseline (tempo de carregamento)

### Pós-Migração  
- [ ] Redução de 194 linhas de código (HybridTemplateService removido)
- [ ] Redução de ~166 imports indiretos
- [ ] Documentação atualizada
- [ ] Zero warnings de deprecation

---

## 🎯 Quick Wins (Opcional)

**Se tempo limitado**, priorizar apenas:

1. **Services internos** (2 dias, baixo risco)
2. **Utils & Hooks** (3 dias, médio risco)  
3. **Manter shim** indefinidamente para components críticos

**Trade-off**: Mantém código legacy mas remove complexidade interna rapidamente.

---

## 📚 Referências

### Arquivos Chave
- `src/services/deprecated/HybridTemplateService.ts` (194 linhas)
- `src/services/canonical/TemplateService.ts` (serviço alvo)
- `src/services/aliases/index.ts` (ponto de entrada)

### Commits Relevantes
- Initial HybridTemplateService: [buscar hash]
- TemplateService refactor: [buscar hash]

### Docs Relacionados
- `docs/DEPRECATED_SERVICES.md`
- `docs/SERVICES_MIGRATION_PHASE3.md`

---

## ✅ Checklist de Execução

### Pré-Migração
- [x] Análise completa de referências
- [ ] Validar API parity  
- [ ] Criar guia de migração
- [ ] Setup monitoring/alerting
- [ ] Comunicar equipe

### Durante Migração
- [ ] Fase 1: Services (Week 1)
- [ ] Fase 2: App Layer (Week 2)  
- [ ] Fase 3: Critical Components (Week 3)
- [ ] Cada PR: tests + code review
- [ ] Deploy gradual (dev → staging → prod)

### Pós-Migração
- [ ] Remover HybridTemplateService
- [ ] Remover shim layer
- [ ] Atualizar docs
- [ ] Celebrar! 🎉

---

## 💡 Notas Finais

**Recomendação**: Executar migração gradual em 4 semanas totais.

**Alternativa Rápida**: Se urgência, implementar apenas Fase 1 + shim permanente (5 dias).

**Quando NÃO migrar**: 
- Se HybridTemplateService estiver sendo usado para features em desenvolvimento ativo
- Se não houver tempo para testes E2E adequados
- Se sistema estiver em code freeze

**Quando DEVE migrar**:
- ✅ Agora é bom momento: arquitetura estabilizada, cache funcionando
- ✅ Reduz dívida técnica antes de escalar
- ✅ Simplifica onboarding de novos devs

---

**Última atualização**: 2025-11-05  
**Próxima revisão**: Após Fase 1 completa
