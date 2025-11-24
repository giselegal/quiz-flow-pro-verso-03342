# 🎯 Serviços Canônicos e Fonte Única de Verdade

**Fase 1 - Fundação Técnica | Quiz Flow Pro**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Contexto do Problema](#contexto-do-problema)
3. [Objetivos desta Fase](#objetivos-desta-fase)
4. [Conceito de Serviços Canônicos](#conceito-de-serviços-canônicos)
5. [Estrutura de Diretórios](#estrutura-de-diretórios)
6. [Feature Flags para Migração](#feature-flags-para-migração)
7. [Single Source of Truth: Supabase + React Query](#single-source-of-truth-supabase--react-query)
8. [Guia para Desenvolvedores](#guia-para-desenvolvedores)
9. [Roadmap de Migração](#roadmap-de-migração)
10. [FAQ](#faq)

---

## Visão Geral

Este documento descreve a implementação da **Fase 1** do plano de consolidação arquitetural do Quiz Flow Pro, que visa:

- ✅ Consolidar **239 → 35 serviços** através de serviços canônicos
- ✅ Estabelecer **Supabase + React Query** como fonte única de verdade
- ✅ Eliminar múltiplas camadas de cache fragmentadas
- ✅ Preparar terreno para remoção segura de código deprecated

### Status Atual

- **Fase Atual**: Fase 3 - Deprecação Forte + Canônicos como Padrão ✅
- **Próxima Fase**: Fase 4 - Limpeza Final
- **Data de Início**: 2025-11-24
- **Última Atualização**: 2025-11-24
- **Versão**: 3.0.0

---

## Contexto do Problema

### Situação Anterior

O Quiz Flow Pro sofria de **fragmentação arquitetural severa**:

#### 🔴 Problemas Identificados

1. **Duplicação Massiva de Serviços**
   - 20+ variações de `TemplateService` (stepTemplateService, UnifiedTemplateRegistry, HybridTemplateService, etc.)
   - 15+ variações de `FunnelService` (FunnelUnifiedService, EnhancedFunnelService, ContextualFunnelService, etc.)
   - Total: **239 serviços** no sistema

2. **Múltiplas Fontes de Verdade**
   ```
   Dados de Template podem vir de:
   ├── localStorage (cache local)
   ├── sessionStorage (cache de sessão)
   ├── Zustand store (state management)
   ├── UnifiedTemplateRegistry (cache interno)
   ├── TemplatesCacheService (outra camada)
   ├── JSON files (built-in)
   └── Supabase (banco de dados)
   ```

3. **Inconsistências de Cache**
   - Templates carregados do localStorage podem estar desatualizados
   - Zustand pode ter versão diferente do Supabase
   - Nenhuma sincronização automática entre camadas

4. **Dificuldade de Manutenção**
   - Impossível saber qual serviço usar
   - Risco alto de bugs ao modificar código
   - Testes complexos devido às múltiplas variações

### Análise de Impacto

```
📊 Métricas do Problema:
├── 239 serviços total
├── 20+ Template services
├── 15+ Funnel services
├── 7+ Storage/Cache services
├── 5+ camadas de cache
└── 0 fonte única de verdade clara
```

---

## Objetivos desta Fase

### Fase 1 - Fundação Técnica (Atual) ✅

1. ✅ **Criar estrutura de serviços canônicos**
   - Estabelecer `src/services/canonical/` como diretório oficial
   - Criar/atualizar serviços únicos com interface clara

2. ✅ **Implementar feature flags para migração controlada**
   - Permitir rollout gradual sem quebrar código existente
   - Flags desligadas por padrão para segurança

3. ✅ **Estabelecer Supabase + React Query como SSOT**
   - Criar hooks React Query para templates e funnels
   - Preparar infraestrutura para cache unificado

4. ✅ **Preparar limpeza de múltiplas camadas**
   - Marcar código legado com @deprecated
   - Criar helpers de transição

5. ✅ **Estabelecer infra de testes**
   - Testes de contrato para serviços canônicos
   - Garantir qualidade do código novo

6. ✅ **Documentar arquitetura**
   - Este documento
   - Guias para desenvolvedores

---

## Conceito de Serviços Canônicos

### O que é um Serviço Canônico?

Um **serviço canônico** é:

> ⭐ A **ÚNICA** implementação oficial e autoritativa de uma responsabilidade específica no sistema.

### Características

1. **Single Source of Truth**
   - Uma única classe/módulo por responsabilidade
   - Todas as operações passam por ele
   - Elimina ambiguidade

2. **Interface Clara e Estável**
   - API bem definida e documentada
   - Tipos TypeScript fortes
   - Padrão ServiceResult<T> para resultados

3. **Singleton Pattern**
   - Instância única compartilhada
   - Estado consistente
   - Gerenciamento de lifecycle

4. **Documentação Explícita**
   - JSDoc completo
   - Marcação SSOT (Single Source of Truth)
   - Roadmap de migração embutido

### Exemplo

```typescript
/**
 * 📝 TEMPLATE SERVICE - Canonical Service (SINGLE SOURCE OF TRUTH)
 * 
 * ⭐ Este é o ÚNICO serviço canônico para gestão de templates no sistema.
 * Toda operação relacionada a templates DEVE passar por este serviço.
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */
export class TemplateService extends BaseCanonicalService {
  private static instance: TemplateService;
  
  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }
  
  // API pública clara e documentada
  async getTemplate(id: string): Promise<ServiceResult<Template>> { ... }
  async saveTemplate(template: Template): Promise<ServiceResult<void>> { ... }
}
```

---

## Estrutura de Diretórios

### Layout Atual

```
src/services/
├── canonical/              ⭐ SERVIÇOS OFICIAIS ÚNICOS
│   ├── TemplateService.ts  // 1 única versão canônica
│   ├── FunnelService.ts    // 1 única versão canônica
│   ├── StorageService.ts   // 1 única versão canônica
│   ├── CacheService.ts     // 1 única versão canônica
│   ├── types.ts            // Tipos compartilhados
│   ├── monitoring.ts       // Monitoring unificado
│   └── __tests__/          // Testes dos serviços canônicos
│       ├── TemplateService.test.ts
│       ├── FunnelService.test.ts
│       ├── StorageService.test.ts
│       └── CacheService.test.ts
│
├── storage/                // Helpers de transição
│   └── legacyLocalStorage.ts  // @deprecated - migração
│
├── core/                   // Serviços de suporte
├── integrations/           // Integrações externas
└── deprecated/             // Código marcado para remoção futura
```

### Convenções

1. **Nomeação**
   - Serviços canônicos: `{Domain}Service.ts` (singular)
   - Testes: `{Domain}Service.test.ts`
   - Tipos: `types.ts` ou `{Domain}Types.ts`

2. **Localização**
   - Serviços canônicos sempre em `src/services/canonical/`
   - Nunca criar serviços similares fora desta pasta

3. **Documentação**
   - Todo serviço canônico DEVE ter header com "SINGLE SOURCE OF TRUTH"
   - Todo serviço canônico DEVE ter roadmap de migração
   - Todo serviço canônico DEVE ter JSDoc completo

---

## Feature Flags para Migração

### Configuração

Arquivo: `src/config/flags.ts`

**🎯 FASE 3 - INVERSÃO DO MODELO**: As flags agora seguem o padrão opt-out (canônicos por padrão, legado em rollback).

```typescript
export const featureFlags = {
  // 🎯 CANONICAL SERVICES - PADRÃO OFICIAL (Fase 3)
  
  /**
   * ⚠️ FLAG GLOBAL DE ROLLBACK DE EMERGÊNCIA
   * 
   * Quando true: desabilita TODOS os serviços canônicos e força uso de legados
   * Quando false: comportamento normal (canônicos ativos)
   * 
   * USO: Apenas em emergências críticas de produção
   * @default false
   */
  DISABLE_CANONICAL_SERVICES_GLOBAL: false,
  
  /**
   * Usar TemplateService canônico ao invés de serviços legados
   * @default true (padrão oficial na Fase 3)
   */
  USE_CANONICAL_TEMPLATE_SERVICE: true,
  
  /**
   * Usar FunnelService canônico ao invés de serviços legados
   * @default false (rollout gradual)
   */
  USE_CANONICAL_FUNNEL_SERVICE: false,
  
  /**
   * Usar StorageService canônico ao invés de serviços legados
   * @default false (rollout gradual)
   */
  USE_CANONICAL_STORAGE_SERVICE: false,
  
  /**
   * Usar CacheService canônico ao invés de acessos diretos
   * @default false (rollout gradual)
   */
  USE_CANONICAL_CACHE_SERVICE: false,
  
  // 🔄 REACT QUERY HOOKS
  
  /**
   * Usar React Query hooks para templates
   * @default false (rollout gradual)
   */
  USE_REACT_QUERY_TEMPLATES: false,
  
  /**
   * Usar React Query hooks para funnels
   * @default false (rollout gradual)
   */
  USE_REACT_QUERY_FUNNELS: false,
} as const;
```

### Como Usar

#### 1. Importar Flags

```typescript
import { featureFlags } from '@/config/flags';
```

#### 2. Implementar Switch

```typescript
// Exemplo: Carregar template
function loadTemplate(id: string) {
  if (featureFlags.USE_CANONICAL_TEMPLATE_SERVICE) {
    // Usar serviço canônico
    return templateService.getTemplate(id);
  } else {
    // Usar serviço legado (comportamento atual)
    return legacyTemplateService.get(id);
  }
}
```

#### 3. Habilitar Gradualmente

```typescript
// Fase 2: Habilitar para testes internos
export const featureFlags = {
  USE_CANONICAL_TEMPLATE_SERVICE: true, // ✅ Habilitado
  // ... outros flags ainda false
};

// Fase 3: Habilitar para beta users
// Fase 4: Habilitar para todos
// Fase 5: Remover código legado
```

### Monitoramento

```typescript
// Log de uso (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('[FeatureFlags]', {
    canonicalServices: {
      template: featureFlags.USE_CANONICAL_TEMPLATE_SERVICE,
      funnel: featureFlags.USE_CANONICAL_FUNNEL_SERVICE,
      storage: featureFlags.USE_CANONICAL_STORAGE_SERVICE,
      cache: featureFlags.USE_CANONICAL_CACHE_SERVICE,
    },
    reactQuery: {
      templates: featureFlags.USE_REACT_QUERY_TEMPLATES,
      funnels: featureFlags.USE_REACT_QUERY_FUNNELS,
    },
  });
}
```

---

## Single Source of Truth: Supabase + React Query

### Arquitetura

```
┌─────────────────────────────────────────────────────┐
│              React Components                       │
│                                                     │
│  ┌───────────┐  ┌────────────┐  ┌────────────┐   │
│  │ Template  │  │   Funnel   │  │   Editor   │   │
│  │  Editor   │  │   Editor   │  │   Canvas   │   │
│  └─────┬─────┘  └──────┬─────┘  └──────┬─────┘   │
└────────┼────────────────┼────────────────┼─────────┘
         │                │                │
         ▼                ▼                ▼
┌─────────────────────────────────────────────────────┐
│          React Query Hooks (Cache Layer)            │
│                                                     │
│  ┌──────────────┐         ┌──────────────┐        │
│  │ useTemplate  │         │  useFunnel   │        │
│  │useUpdate...  │         │useUpdate...  │        │
│  └──────┬───────┘         └──────┬───────┘        │
└─────────┼──────────────────────────┼───────────────┘
          │                          │
          ▼                          ▼
┌─────────────────────────────────────────────────────┐
│            Supabase (Single Source of Truth)        │
│                                                     │
│  ┌──────────────┐         ┌──────────────┐        │
│  │  templates   │         │   funnels    │        │
│  │    table     │         │    table     │        │
│  └──────────────┘         └──────────────┘        │
└─────────────────────────────────────────────────────┘
```

### Benefícios

1. **Cache Automático**
   - React Query gerencia cache
   - Invalidação automática
   - Sincronização entre componentes

2. **Otimistic Updates**
   - UI atualiza imediatamente
   - Rollback automático em caso de erro

3. **Background Refetch**
   - Dados sempre frescos
   - Revalida em foco da janela

4. **Eliminação de Camadas**
   ```
   ❌ ANTES:
   Component → Zustand → localStorage → TemplateService → Cache → Supabase
   
   ✅ DEPOIS:
   Component → React Query → Supabase
   ```

### Hooks Disponíveis

#### Templates

```typescript
import { useTemplate, useUpdateTemplate } from '@/hooks/useTemplate';

// Ler template
const { data: template, isLoading, error } = useTemplate('template-123');

// Atualizar template
const updateTemplate = useUpdateTemplate();
await updateTemplate.mutateAsync({
  id: 'template-123',
  name: 'New Name',
  blocks: updatedBlocks,
});
```

#### Funnels

```typescript
import { useFunnel, useUpdateFunnel } from '@/hooks/useFunnel';

// Ler funnel
const { data: funnel, isLoading, error } = useFunnel('funnel-456');

// Atualizar funnel
const updateFunnel = useUpdateFunnel();
await updateFunnel.mutateAsync({
  id: 'funnel-456',
  name: 'Updated Name',
  config: newConfig,
});
```

---

## Guia para Desenvolvedores

### Como Desenvolver Novos Serviços

#### 1. Seguir o Padrão Canônico

```typescript
/**
 * 🎯 {DOMAIN} SERVICE - Canonical Service (SINGLE SOURCE OF TRUTH)
 * 
 * ⭐ Este é o ÚNICO serviço canônico para {domain} no sistema.
 * Toda operação relacionada a {domain} DEVE passar por este serviço.
 * 
 * CONSOLIDA (239 → 35 serviços - Fase 1):
 * - {LegacyService1}
 * - {LegacyService2}
 * ...
 * 
 * 🎯 ROADMAP DE MIGRAÇÃO:
 * - Fase 1 (Atual): Estrutura canônica estabelecida
 * - Fase 2: Migração progressiva de consumidores
 * - Fase 3: Deprecação completa dos serviços legados
 * - Fase 4: Remoção dos serviços deprecated
 * 
 * 📋 TODO - PRÓXIMAS MIGRAÇÕES:
 * - [ ] Item 1
 * - [ ] Item 2
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */
export class {Domain}Service extends BaseCanonicalService {
  private static instance: {Domain}Service;
  
  private constructor() {
    super('{Domain}Service', '1.0.0');
  }
  
  static getInstance(): {Domain}Service {
    if (!{Domain}Service.instance) {
      {Domain}Service.instance = new {Domain}Service();
    }
    return {Domain}Service.instance;
  }
  
  // Implementação...
}

// Export singleton
export const {domain}Service = {Domain}Service.getInstance();
```

#### 2. Usar ServiceResult Pattern

```typescript
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

// Exemplo de uso
async getItem(id: string): Promise<ServiceResult<Item>> {
  try {
    const item = await fetchItem(id);
    return { success: true, data: item };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}
```

#### 3. Adicionar Testes

```typescript
// src/services/canonical/__tests__/{Domain}Service.test.ts

describe('{Domain}Service - Canonical Service Tests', () => {
  let service: {Domain}Service;
  
  beforeEach(() => {
    service = {Domain}Service.getInstance();
  });
  
  describe('Instanciação e Singleton', () => {
    it('deve criar instância singleton', () => {
      const instance1 = {Domain}Service.getInstance();
      const instance2 = {Domain}Service.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('API Pública - Contrato', () => {
    it('deve expor método getItem', () => {
      expect(typeof service.getItem).toBe('function');
    });
    
    // ... mais testes
  });
});
```

### Como Migrar Código Existente

#### Passo 1: Identificar Uso de Serviço Legado

```typescript
// ❌ Código Antigo
import { oldTemplateService } from '@/services/oldTemplateService';

function MyComponent() {
  const template = oldTemplateService.get('template-123');
  // ...
}
```

#### Passo 2: Opção A - Usar Serviço Canônico (Fase 2)

```typescript
// ✅ Migração para Serviço Canônico
import { templateService } from '@/services/canonical/TemplateService';
import { featureFlags } from '@/config/flags';

function MyComponent() {
  const result = await templateService.getTemplate('template-123');
  
  if (result.success) {
    const template = result.data;
    // ...
  }
}
```

#### Passo 3: Opção B - Usar React Query (Fase 3 - Recomendado)

```typescript
// ✅✅ Migração para React Query (RECOMENDADO)
import { useTemplate } from '@/hooks/useTemplate';

function MyComponent() {
  const { data: template, isLoading, error } = useTemplate('template-123');
  
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!template) return <NotFound />;
  
  return <TemplateView template={template} />;
}
```

### Padrões de Migração

#### localStorage/sessionStorage → CacheService

```typescript
// ❌ ANTES
localStorage.setItem('template-123', JSON.stringify(template));
const cached = JSON.parse(localStorage.getItem('template-123'));

// ✅ DEPOIS
import { cacheService } from '@/services/canonical/CacheService';

cacheService.templates.set('template-123', template);
const result = cacheService.templates.get('template-123');
```

#### Zustand para dados de negócio → React Query

```typescript
// ❌ ANTES
import { useTemplateStore } from '@/stores/templateStore';

const template = useTemplateStore((state) => state.template);

// ✅ DEPOIS
import { useTemplate } from '@/hooks/useTemplate';

const { data: template } = useTemplate(templateId);
```

---

## Roadmap de Migração

### Fase 1 - Fundação Técnica ✅ (Concluída)

**Duração**: 1 sprint  
**Status**: ✅ Completo

- [x] Criar estrutura de serviços canônicos
- [x] Implementar feature flags
- [x] Criar hooks React Query
- [x] Estabelecer helpers de transição
- [x] Adicionar testes básicos
- [x] Documentar arquitetura

### Fase 2 - Migração Progressiva ✅ (Concluída)

**Duração**: 2-3 sprints  
**Status**: ✅ Completo

- [x] Habilitar flags para testes internos
- [x] Migrar componentes críticos para serviços canônicos
- [x] Adicionar @deprecated em serviços legados
- [x] Monitorar métricas de uso
- [x] Corrigir bugs identificados

**Componentes Migrados**:
1. ✅ Templates (principais fluxos usando TemplateService canônico)
2. 🔄 Funnels (planejado para próxima iteração)
3. 🔄 Storage (planejado para próxima iteração)
4. 🔄 Cache (planejado para próxima iteração)

### Fase 3 - Deprecação Forte ✅ (Atual - Em Progresso)

**Duração**: 2 sprints  
**Status**: ✅ Em Andamento

- [x] Inverter modelo de flags (opt-in → opt-out)
- [x] Adicionar flag global de rollback (DISABLE_CANONICAL_SERVICES_GLOBAL)
- [x] Definir serviços canônicos como padrão (USE_CANONICAL_TEMPLATE_SERVICE = true)
- [x] Definir React Query como padrão (USE_REACT_QUERY_TEMPLATES = true)
- [x] Marcar uso de localStorage/sessionStorage como deprecated
- [x] Adicionar avisos de deprecação em código legado
- [x] Atualizar testes para verificar comportamento de rollback
- [x] Documentar mudanças e guias de migração
- [ ] Migrar 100% dos fluxos de template para caminho canônico
- [ ] Eliminar localStorage/sessionStorage para dados de template em produção
- [ ] Consolidar Zustand para UI state apenas

**Mudanças Principais**:
- ⚠️ **BREAKING**: Serviços canônicos agora são o padrão oficial
- ⚠️ **BREAKING**: React Query é agora a fonte única de verdade para templates
- 🔄 Flag `DISABLE_CANONICAL_SERVICES_GLOBAL` adicionada para rollback de emergência
- 📝 Código legado marcado com avisos de deprecação
- ✅ Testes atualizados para Phase 3

### Fase 4 - Limpeza Final (Futura)

**Duração**: 1 sprint  
**Status**: 📋 Planejada

- [ ] Remover serviços deprecated
- [ ] Limpar código morto
- [ ] Atualizar documentação
- [ ] Celebrar 🎉

---

## FAQ

### Por que não migrar tudo de uma vez?

**Resposta**: Migração incremental é mais segura:
- ✅ Permite testar mudanças gradualmente
- ✅ Reduz risco de quebrar funcionalidades
- ✅ Facilita rollback se necessário
- ✅ Mantém sistema funcionando durante transição

### Posso usar serviços legados enquanto migro?

**Resposta**: Sim, temporariamente:
- ✅ Feature flags permitem convivência
- ⚠️ Marque com TODO para migração
- ⚠️ Não adicione novos usos de código legado
- ❌ Não crie novos serviços similares

### Como sei qual serviço usar?

**Resposta**: Hierarquia clara:
1. **Melhor**: React Query hooks (`useTemplate`, `useFunnel`)
2. **Bom**: Serviços canônicos (`templateService`, `funnelService`)
3. **Legado**: Serviços antigos (marcados @deprecated)
4. **Nunca**: localStorage/sessionStorage direto para dados

### E se eu encontrar um bug no serviço canônico?

**Resposta**: Processo claro:
1. Reportar issue no GitHub
2. Corrigir no serviço canônico (não criar nova versão!)
3. Adicionar teste para prevenir regressão
4. Atualizar documentação se necessário

### Como testar código que usa serviços canônicos?

**Resposta**: Exemplos:

```typescript
// Mock do serviço
vi.mock('@/services/canonical/TemplateService', () => ({
  templateService: {
    getTemplate: vi.fn(),
  },
}));

// Teste
it('should load template', async () => {
  templateService.getTemplate.mockResolvedValue({
    success: true,
    data: mockTemplate,
  });
  
  // ... test component
});
```

### Onde encontro mais exemplos?

**Resposta**: Locais de referência:
- `src/services/canonical/__tests__/` - Testes de exemplo
- `src/hooks/useTemplate.ts` - Hooks React Query
- `src/services/storage/legacyLocalStorage.ts` - Padrão de migração
- Este documento - Guias e padrões

---

## Contato e Suporte

### Dúvidas?

- 📖 Consulte este documento primeiro
- 🐛 Issues técnicos: GitHub Issues
- 💬 Discussões: GitHub Discussions
- 📧 Emergências: Contate tech lead

### Contribuindo

Para contribuir com melhorias nesta arquitetura:

1. Leia este documento completamente
2. Siga os padrões estabelecidos
3. Adicione testes
4. Atualize documentação
5. Abra PR com descrição clara

---

**Última atualização**: 2025-11-24  
**Versão do documento**: 1.0.0  
**Autor**: AI Agent - Fase 1 Consolidação  
**Revisores**: Tech Lead, Architecture Team

---

## Apêndice

### A. Checklist de Migração

Use este checklist ao migrar um componente:

- [ ] Identificar todos os usos de serviços legados
- [ ] Substituir por serviço canônico ou React Query
- [ ] Remover imports de serviços legados
- [ ] Adicionar/atualizar testes
- [ ] Testar manualmente
- [ ] Code review
- [ ] Deploy gradual com feature flag

### B. Glossário

- **SSOT**: Single Source of Truth
- **Canonical**: Único, oficial, autoritativo
- **Feature Flag**: Flag de controle para habilitar/desabilitar features
- **ServiceResult**: Padrão de retorno com success/data/error
- **React Query**: Biblioteca para cache e sincronização de dados server-side
- **Supabase**: Backend as a Service (BaaS) - banco de dados e storage

### C. Referências Externas

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Feature Flags Pattern](https://martinfowler.com/articles/feature-toggles.html)
