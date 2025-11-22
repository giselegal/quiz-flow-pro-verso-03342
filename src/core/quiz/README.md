# 🎯 Core Quiz System - Official Architecture

Sistema oficial de Quiz/Funil alinhado aos princípios CaktoQuiz/Inlead.

## 📋 Visão Geral

Este módulo implementa a arquitetura oficial para criação e gerenciamento de quizzes/funis, com:

- ✅ **Contratos Oficiais** (Types) - Fonte única da verdade
- ✅ **BlockRegistry** - Registro centralizado de blocos
- ✅ **Validação Zod** - Type-safety em runtime
- ✅ **Adaptadores** - Migração gradual de código legado
- ✅ **Template Loading** - Múltiplas fontes de dados
- ✅ **React Hooks** - Integração fácil com editor

## 🗂️ Estrutura

```
src/core/quiz/
├── blocks/
│   ├── types.ts          # Tipos de blocos
│   ├── registry.ts       # BlockRegistry (singleton)
│   ├── adapters.ts       # Adaptadores legado → oficial
│   └── schemas.ts        # Validação Zod
├── templates/
│   ├── types.ts          # Tipos de templates/funis
│   ├── schemas.ts        # Validação Zod
│   ├── loader.ts         # Template loader
│   └── example-funnel.json  # Formato oficial
├── hooks/
│   ├── useBlockDefinition.ts  # Hook para registry
│   └── useBlockValidation.ts  # Hook para validação
├── examples/
│   └── usage-example.tsx      # Exemplos práticos
├── __tests__/
│   ├── blockRegistry.test.ts  # Testes registry
│   └── adapters.test.ts       # Testes adapters
├── index.ts              # Exports unificados
└── README.md             # Este arquivo
```

## 🚀 Quick Start

### Importar módulo

```typescript
import {
  // Types
  type BlockInstance,
  type FunnelTemplate,
  // Registry
  BlockRegistry,
  // Hooks
  useBlockDefinition,
  useBlockValidation,
} from '@/core/quiz';
```

### Exemplo básico - Acessar Registry

```typescript
// Obter definição de um bloco
const definition = BlockRegistry.getDefinition('intro-logo-header');

// Listar blocos de uma categoria
const questionBlocks = BlockRegistry.getByCategory('question');

// Resolver alias para tipo oficial
const officialType = BlockRegistry.resolveType('hero-block');
// → 'intro-logo-header'
```

### Exemplo - Usar Hooks no Editor

```typescript
function BlockPropertiesPanel({ blockType }: { blockType: string }) {
  const definition = useBlockDefinition(blockType);
  
  if (!definition) return <div>Tipo desconhecido</div>;

  return (
    <div>
      <h3>{definition.name}</h3>
      {definition.properties.map((prop) => (
        <div key={prop.key}>
          <label>{prop.label}</label>
          {/* Renderizar input baseado em prop.type */}
        </div>
      ))}
    </div>
  );
}
```

### Exemplo - Validar Bloco

```typescript
import { useBlockValidation } from '@/core/quiz';

function BlockEditor({ block }: { block: BlockInstance }) {
  const validation = useBlockValidation(block);

  return (
    <div>
      {validation.isValid ? (
        <span>✓ Válido</span>
      ) : (
        <ul>
          {validation.errors.map((error) => (
            <li key={error.property}>{error.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Exemplo - Carregar Template

```typescript
import { TemplateLoader } from '@/core/quiz';

async function loadTemplate() {
  const result = await TemplateLoader.loadTemplate('example-quiz-fashion', {
    source: 'local',
    validate: true,
  });

  if (result.success) {
    console.log('Template:', result.template);
  } else {
    console.error('Errors:', result.errors);
  }
}
```

### Exemplo - Adaptar Código Legado

```typescript
import { adaptLegacyBlock } from '@/core/quiz';

const legacyBlock = {
  id: 'old-1',
  type: 'intro-hero', // alias
  properties: { title: 'Test' },
  order: 1,
};

const officialBlock = adaptLegacyBlock(legacyBlock);
// → { id: 'old-1', type: 'intro-logo-header', ... }
```

## 📖 Documentação Completa

Para documentação completa sobre a migração e arquitetura, veja:

- **Migração**: `docs/MIGRATION-CAKTOQUIZ-INLEAD.md`
- **Exemplos**: `src/core/quiz/examples/usage-example.tsx`

## 🧪 Testes

```bash
# Rodar testes do módulo
npm test src/core/quiz/__tests__

# Rodar apenas BlockRegistry tests
npm test src/core/quiz/__tests__/blockRegistry.test.ts

# Rodar com cobertura
npm test -- --coverage src/core/quiz
```

## 🎨 Tipos Principais

### BlockInstance

```typescript
interface BlockInstance {
  id: string;
  type: string; // Tipo registrado no BlockRegistry
  properties: Record<string, any>;
  order: number;
  metadata?: {
    label?: string;
    notes?: string;
    locked?: boolean;
  };
  children?: BlockInstance[];
}
```

### BlockDefinition

```typescript
interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: BlockCategoryEnum;
  icon?: string;
  properties: BlockPropertyDefinition[];
  defaultProperties: Record<string, any>;
  tags?: string[];
}
```

### FunnelTemplate

```typescript
interface FunnelTemplate {
  metadata: FunnelMetadata;
  settings: FunnelSettings;
  steps: FunnelStep[];
  blocksUsed: string[];
  validationSchema?: string;
}
```

## 🔌 Extensibilidade

### Registrar Novo Tipo de Bloco

```typescript
import { BlockRegistry } from '@/core/quiz';

BlockRegistry.register({
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
    },
  ],
  defaultProperties: {
    text: 'Valor padrão',
  },
});
```

### Criar Validação Customizada

```typescript
import { validateBlockInstance } from '@/core/quiz';

function customValidation(instance: BlockInstance) {
  const result = validateBlockInstance(instance);
  
  if (!result.success) {
    // Validação falhou
    console.error(result.error);
  }
  
  // Adicionar validações customizadas
  // ...
  
  return result.success;
}
```

## 📊 Waves Implementadas

### ✅ Wave 1: Núcleo Oficial
- Tipos oficiais definidos
- BlockRegistry implementado
- Example JSON documentado
- Services legados marcados

### ✅ Wave 2: Integração
- Adaptadores de blocos
- Validação com Zod
- Template loader
- React hooks
- TemplateService integrado

### ✅ Wave 3: Consolidação
- Testes unitários e integração
- Exemplos de uso
- Documentação completa
- Performance otimizada

## 🤝 Contribuindo

Para adicionar novos blocos ou funcionalidades:

1. Definir tipos em `blocks/types.ts` ou `templates/types.ts`
2. Registrar no `BlockRegistry` se for bloco
3. Adicionar testes em `__tests__/`
4. Atualizar exemplos se necessário
5. Documentar em `README.md` ou `docs/`

## 📚 Referências

- **Inspiração**: CaktoQuiz, Inlead, Webflow
- **Princípios**: Separação de concerns, Type-safety, Extensibilidade
- **Padrões**: Registry Pattern, Adapter Pattern, Factory Pattern

## 📝 Changelog

### v1.0.0 (2025-11-22)
- ✅ Wave 1: Core types e registry
- ✅ Wave 2: Validation e adapters
- ✅ Wave 3: Tests e documentation
- 🎉 Sistema completamente funcional e testado

---

**Desenvolvido com ❤️ seguindo os princípios CaktoQuiz/Inlead**
