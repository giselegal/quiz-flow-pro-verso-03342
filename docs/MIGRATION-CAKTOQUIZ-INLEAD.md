# 🚀 Migração para Arquitetura CaktoQuiz/Inlead

## Visão Geral

Este documento descreve a estratégia de migração evolutiva do projeto para alinhar com os princípios e práticas de plataformas como **CaktoQuiz** e **Inlead**.

### Objetivos

- ✅ Estabelecer contratos claros e oficiais (types)
- ✅ Separar responsabilidades: Editor / Runtime / Core
- ✅ Migração gradual e incremental (SEM reescrever tudo)
- ✅ Manter compatibilidade durante a transição
- ✅ Melhorar manutenibilidade e extensibilidade

### Princípios

1. **Contratos Oficiais**: Tipos definidos como fonte única da verdade
2. **Separação de Concerns**: Core → Runtime → Editor (camadas bem definidas)
3. **Backward Compatibility**: Aliases e adaptadores para código legado
4. **Validação em Camadas**: Validação progressiva (básica → intermediária → rigorosa)
5. **Migração Evolutiva**: Wave-based implementation (não big-bang)

---

## 📋 Wave 1: Definição do Núcleo Oficial

**Status**: ✅ COMPLETO

### Entregas

#### 1. Tipos Oficiais (Contratos)

**Arquivos criados:**
- `src/core/quiz/templates/types.ts` - Tipos de Funil/Template e Step
- `src/core/quiz/blocks/types.ts` - Tipos de Block

**Principais tipos:**
- `FunnelTemplate` - Estrutura completa do funil
- `FunnelStep` - Estrutura de cada etapa
- `FunnelMetadata` - Metadata do template
- `BlockDefinition` - Definição de tipo de bloco
- `BlockInstance` - Instância de bloco em um step

#### 2. BlockRegistry Centralizado

**Arquivo criado:**
- `src/core/quiz/blocks/registry.ts`

**Funcionalidades:**
- Registro de definições de blocos
- Mapeamento de tipos legados → oficiais
- Consulta de propriedades e defaults
- Suporte a aliases para compatibilidade

**Blocos registrados (inicial):**
- **Intro**: `intro-logo-header`, `intro-form`, `intro-title`, `intro-description`, `intro-image`, `intro-logo`
- **Question**: `question-progress`, `question-number`, `question-text`, `question-options`
- **Result**: `result-header`, `result-score`
- **Offer**: `offer-cta`

**Aliases configurados:**
- `intro-hero` → `intro-logo-header`
- `quiz-intro-header` → `intro-logo-header`
- `hero-block` → `intro-logo-header`
- `welcome-form` → `intro-form`
- E outros...

#### 3. Formato JSON Oficial

**Arquivo criado:**
- `src/core/quiz/templates/example-funnel.json`

Este JSON documenta o formato oficial esperado pelo sistema, incluindo:
- Metadata completa
- Settings globais (tema, navegação, scoring, integrações)
- Steps ordenados com referência a blocos
- Lista de blocos utilizados

#### 4. TemplateService Oficial

**Arquivo criado:**
- `src/services/TemplateService.ts`

Service canônico que consome os contratos oficiais, com:
- Cache inteligente
- Validação de templates
- Transformação de dados legados
- Suporte a múltiplas fontes (Supabase/API/Local)

#### 5. Marcação de Services Legados

**Services marcados com @legacy:**
- `src/services/templateService.ts` (lowercase)
- `src/services/FunnelTypesRegistry.ts`
- `src/services/TemplateRegistry.ts`
- `src/services/TemplateLoader.ts`
- `src/services/TemplateProcessor.ts`

Todos incluem comentário `@legacy DEPRECATED` com instrução de migração.

### Próximos Passos (Wave 2)

Ver seção Wave 2 abaixo.

---

## 📋 Wave 2: Editor e Runtime - Integração

**Status**: 🚧 A IMPLEMENTAR

### Objetivos

- Migrar Editor para consumir BlockRegistry oficial
- Criar adaptadores de compatibilidade
- Implementar validação com Zod
- Carregar templates do formato JSON oficial

### Tarefas

#### 2.1 Adaptadores de Blocos

**Criar:**
- `src/core/quiz/blocks/adapters.ts` - Adaptadores legado → oficial
- `src/core/quiz/blocks/validators.ts` - Validação com Zod

**Implementar:**
- Transformadores de propriedades legadas
- Validação em runtime de BlockInstance
- Migração automática de dados antigos

#### 2.2 Runtime Consumption

**Atualizar:**
- `src/components/editor/blocks/` - Componentes de blocos
- `src/core/runtime/` - Runtime engine

**Implementar:**
- Carregar definições do BlockRegistry
- Renderizar baseado em BlockRenderConfig
- Suporte a blocos dinâmicos

#### 2.3 Editor Integration

**Atualizar:**
- Painel de propriedades para consumir `BlockDefinition.properties`
- Toolbar/biblioteca de blocos do BlockRegistry
- Validação em tempo real no editor

**Criar:**
- Hook `useBlockDefinition(type)` para acessar registry
- Hook `useBlockValidation(instance)` para validar blocos
- Context `BlockRegistryContext` para compartilhar registry

#### 2.4 Template Loading

**Implementar:**
- Carregamento de templates JSON locais
- Integração com Supabase (se disponível)
- Cache de templates com TTL
- Fallback automático

**Arquivos a criar:**
- `src/core/quiz/templates/loader.ts`
- `src/core/quiz/templates/cache.ts`

#### 2.5 Validation Layer

**Implementar com Zod:**
- Schema de FunnelTemplate
- Schema de BlockInstance
- Validação progressiva (strict/loose modes)

**Arquivos a criar:**
- `src/core/quiz/templates/schemas.ts`
- `src/core/quiz/blocks/schemas.ts`

### Guidelines de Implementação

#### Padrão de Migração Gradual

```typescript
// ANTES (legado)
import { oldBlockType } from '@/types/blocks';

// DURANTE (compatibilidade)
import { BlockDefinition } from '@/core/quiz/blocks/types';
import { BlockRegistry } from '@/core/quiz/blocks/registry';

const definition = BlockRegistry.getDefinition(oldBlockType);
// usar definition.properties para renderizar painel

// DEPOIS (oficial)
// Todo código usa apenas BlockRegistry e contratos oficiais
```

#### Exemplo de Adaptador

```typescript
// src/core/quiz/blocks/adapters.ts
export function adaptLegacyBlock(legacyBlock: any): BlockInstance {
  const officialType = BlockRegistry.resolveType(legacyBlock.type);
  const definition = BlockRegistry.getDefinition(officialType);
  
  return {
    id: legacyBlock.id,
    type: officialType,
    properties: transformProperties(legacyBlock.properties, definition),
    order: legacyBlock.order || 1,
  };
}
```

### Testing Strategy

- Unit tests para cada adaptador
- Integration tests Editor → BlockRegistry
- Snapshot tests para JSON templates
- E2E tests para fluxos completos

---

## 📋 Wave 3: Consolidação e Performance

**Status**: 📅 PLANEJADO

### Objetivos

- Otimizar carregamento de templates
- Remover código legado descontinuado
- Hardening e testes completos
- Documentação final

### Tarefas

#### 3.1 Performance Optimization

- Lazy loading de definições de blocos
- Code splitting por categoria
- Caching agressivo
- Preload de templates mais usados

#### 3.2 Legacy Code Removal

- Remover aliases após migração completa
- Remover adaptadores não mais necessários
- Limpar services @legacy
- Consolidar duplicações

#### 3.3 Testing & Quality

- Cobertura de testes >= 80%
- Performance benchmarks
- Testes de carga
- Testes de regressão visual

#### 3.4 Documentation

- API docs completos (TypeDoc)
- Guias de uso para desenvolvedores
- Exemplos de extensão (novos blocos)
- Diagramas de arquitetura

---

## 📊 Tracking de Progresso

### Wave 1: Núcleo Oficial ✅

- [x] Tipos oficiais criados
- [x] BlockRegistry implementado
- [x] Example JSON documentado
- [x] TemplateService oficial criado
- [x] Services legados marcados
- [x] Documentação inicial

### Wave 2: Integração 🚧

- [ ] Adaptadores de blocos
- [ ] Validação Zod
- [ ] Template loading
- [ ] Editor integration
- [ ] Runtime consumption
- [ ] Testes de integração

### Wave 3: Consolidação 📅

- [ ] Performance tuning
- [ ] Legacy cleanup
- [ ] Testing completo
- [ ] Documentação final
- [ ] Release notes

---

## 🎯 Guia de Migração para Desenvolvedores

### Para usar o novo sistema

#### 1. Importar tipos oficiais

```typescript
import type { 
  FunnelTemplate, 
  FunnelStep,
  BlockInstance 
} from '@/core/quiz/templates/types';

import type { 
  BlockDefinition 
} from '@/core/quiz/blocks/types';
```

#### 2. Acessar BlockRegistry

```typescript
import { BlockRegistry } from '@/core/quiz/blocks/registry';

// Obter definição de um bloco
const definition = BlockRegistry.getDefinition('intro-logo-header');

// Listar blocos por categoria
const questionBlocks = BlockRegistry.getByCategory('question');

// Resolver tipo legado
const officialType = BlockRegistry.resolveType('hero-block'); // → 'intro-logo-header'
```

#### 3. Usar TemplateService oficial

```typescript
import { TemplateService } from '@/services/TemplateService';

// Carregar template
const template = await TemplateService.getTemplate('example-quiz-fashion');

// Validar template
const validation = TemplateService.validateTemplate(template);
if (!validation.valid) {
  console.error('Template inválido:', validation.errors);
}
```

#### 4. Criar novo tipo de bloco

```typescript
import { BlockRegistry } from '@/core/quiz/blocks/registry';
import type { BlockDefinition } from '@/core/quiz/blocks/types';

const myBlockDefinition: BlockDefinition = {
  type: 'my-custom-block',
  name: 'Meu Bloco Customizado',
  description: 'Descrição do bloco',
  category: 'custom',
  properties: [
    {
      key: 'text',
      type: 'text',
      label: 'Texto',
      defaultValue: '',
      required: true,
      category: 'content',
    }
  ],
  defaultProperties: {
    text: 'Valor padrão',
  },
  tags: ['custom'],
};

// Registrar
BlockRegistry.register(myBlockDefinition);
```

### Code Review Checklist

Ao revisar código:
- [ ] Usa tipos oficiais de `@/core/quiz/`?
- [ ] Consulta BlockRegistry ao invés de hardcode?
- [ ] Evita importar de services `@legacy`?
- [ ] Valida dados de entrada?
- [ ] Adiciona testes?

---

## 🔍 Troubleshooting

### Bloco não encontrado no registry

**Problema:** `BlockRegistry.getDefinition()` retorna `undefined`

**Solução:**
1. Verificar se o tipo está registrado: `BlockRegistry.hasType(type)`
2. Verificar aliases: `BlockRegistry.resolveType(type)`
3. Registrar o bloco se necessário

### Template inválido

**Problema:** Validação falha ao carregar template

**Solução:**
1. Verificar estrutura do JSON contra `example-funnel.json`
2. Conferir campos obrigatórios: `metadata.id`, `steps`, etc.
3. Validar referências de blocos em `blocksUsed`

### Propriedades de bloco incorretas

**Problema:** Bloco renderiza com propriedades erradas

**Solução:**
1. Consultar `BlockDefinition.properties` para schema correto
2. Usar `defaultProperties` como fallback
3. Implementar adaptador se dados são legados

---

## 📚 Referências

### Arquivos Principais

- **Types**: `src/core/quiz/{templates,blocks}/types.ts`
- **Registry**: `src/core/quiz/blocks/registry.ts`
- **Service**: `src/services/TemplateService.ts`
- **Example**: `src/core/quiz/templates/example-funnel.json`

### Documentação Relacionada

- `docs/ARCHITECTURE.md` - Arquitetura geral
- `docs/BLOCK_TYPE_MAPPING.md` - Mapeamento de tipos de bloco
- `docs/TEMPLATE_SYSTEM.md` - Sistema de templates (legado)

### Inspirações

- **CaktoQuiz**: Sistema de quiz builder com tipos fortes
- **Inlead**: Plataforma de funnels com separação editor/runtime
- **Webflow**: No-code editor com contratos claros

---

## 💡 Próximas Iterações

### Após Wave 3

- **Plugin System**: Permitir blocos de terceiros
- **Visual Builder**: Editor drag-and-drop avançado
- **A/B Testing**: Variantes de templates
- **Analytics Integration**: Tracking nativo
- **Multi-idioma**: i18n para templates

---

## 🤝 Contribuindo

Para contribuir com a migração:

1. Escolher uma tarefa da Wave atual
2. Seguir os guidelines deste documento
3. Adicionar testes
4. Atualizar documentação
5. Criar PR com prefixo `[MIGRATION]`

---

**Última atualização:** 2025-11-22  
**Versão:** 1.0.0  
**Status:** Wave 1 Completo, Wave 2 Planejado
