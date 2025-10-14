# 🏗️ Sistema Modular de Schemas

## 📋 Visão Geral

Sistema profissional de schemas para edição de propriedades de componentes, com arquitetura modular, presets reutilizáveis, lazy loading e type-safety completo.

## 🎯 Características Principais

✅ **Modularidade**: Schemas divididos em arquivos individuais
✅ **Presets Reutilizáveis**: Campos pré-configurados para consistência
✅ **Type-Safety**: TypeScript com generics para inferência de tipos
✅ **Lazy Loading**: Carregamento sob demanda para otimização de bundle
✅ **Builder Pattern**: API fluente para criação DRY de schemas
✅ **Backward Compatible**: Adapter para código legado

## 📁 Estrutura de Arquivos

```
src/config/schemas/
├── base/
│   ├── types.ts          # Tipos base e interfaces
│   ├── presets.ts        # Campos pré-configurados reutilizáveis
│   ├── builder.ts        # Builder pattern para schemas
│   └── index.ts          # Exportações centralizadas
├── blocks/
│   ├── headline.ts       # Schema do bloco headline
│   ├── image.ts          # Schema do bloco image
│   ├── button.ts         # Schema do bloco button
│   ├── options-grid.ts   # Schema do bloco options-grid
│   └── ...               # Outros blocos
├── dynamic.ts            # Sistema de registro com lazy loading
├── adapter.ts            # Adapter para compatibilidade
├── index.ts              # Exportação principal
└── README.md             # Esta documentação
```

## 🚀 Uso Básico

### Criar um Novo Schema

```typescript
import { createSchema, titleField, colorFields } from '@/config/schemas';

export const myBlockSchema = createSchema('my-block', 'Meu Bloco')
  .description('Descrição do bloco')
  .category('content')
  .icon('Star')
  .addGroup('content', 'Conteúdo', { order: 1 })
  .addGroup('style', 'Estilo', { order: 2 })
  .addField(titleField('content'))
  .addFields(...colorFields('style'))
  .version('1.0.0')
  .build();
```

### Usar Presets Existentes

```typescript
import { 
  templates, 
  titleField, 
  subtitleField, 
  imageFields, 
  buttonFields,
  typographyFields
} from '@/config/schemas';

export const richBlockSchema = templates
  .full('rich-block', 'Bloco Rico')
  .addFields(
    titleField('content'),
    subtitleField('content')
  )
  .addFields(...imageFields('content'))
  .addFields(...buttonFields('content'))
  .addFields(...typographyFields('style'))
  .build();
```

### Carregar Schema Dinamicamente

```typescript
import { SchemaAPI } from '@/config/schemas';

// Assíncrono (carrega sob demanda)
const schema = await SchemaAPI.get('headline');

// Síncrono (apenas cache)
const cachedSchema = SchemaAPI.getSync('headline');

// Pré-carregar múltiplos schemas
await SchemaAPI.preload('headline', 'button', 'options-grid');
```

### Usar em Componente React

```typescript
import React, { useEffect, useState } from 'react';
import { SchemaAPI } from '@/config/schemas';
import type { BlockSchema } from '@/config/schemas';

function PropertiesEditor({ blockType }: { blockType: string }) {
  const [schema, setSchema] = useState<BlockSchema | null>(null);

  useEffect(() => {
    SchemaAPI.get(blockType).then(setSchema);
  }, [blockType]);

  if (!schema) return <div>Carregando...</div>;

  return (
    <div>
      <h3>{schema.label}</h3>
      {/* Renderizar campos */}
    </div>
  );
}
```

## 🎨 Presets Disponíveis

### Campos de Conteúdo
- `titleField()` - Título principal
- `subtitleField()` - Subtítulo
- `descriptionField()` - Descrição longa
- `textField()` - Texto simples
- `headlineField()` - Headline destacado
- `labelField()` - Label/rótulo

### Campos de Imagem
- `imageUrlField()` - URL da imagem
- `imageAltField()` - Texto alternativo
- `imageFields()` - Conjunto completo (URL + Alt)

### Campos de Estilo
- `backgroundColorField()` - Cor de fundo
- `textColorField()` - Cor do texto
- `borderColorField()` - Cor da borda
- `borderRadiusField()` - Raio da borda
- `fontSizeField()` - Tamanho da fonte
- `fontWeightField()` - Peso da fonte
- `colorFields()` - Conjunto de cores (background, text, border)
- `typographyFields()` - Conjunto de tipografia (size, weight)

### Campos de Layout
- `alignmentField()` - Alinhamento (left, center, right)
- `paddingField()` - Espaçamento interno
- `marginField()` - Espaçamento externo
- `widthField()` - Largura
- `heightField()` - Altura
- `spacingFields()` - Conjunto de espaçamento (padding, margin)
- `dimensionFields()` - Conjunto de dimensões (width, height)

### Campos de Interação
- `buttonTextField()` - Texto do botão
- `buttonUrlField()` - URL do botão
- `placeholderField()` - Placeholder de input
- `buttonFields()` - Conjunto completo de botão

### Campos de Lógica
- `requiredField()` - Campo obrigatório
- `disabledField()` - Campo desabilitado
- `visibleField()` - Visibilidade

### Campos de Animação
- `animationField()` - Tipo de animação
- `durationField()` - Duração da animação

## 🛠️ Templates Disponíveis

```typescript
import { templates } from '@/config/schemas';

// Template básico: conteúdo + estilo
const basicSchema = templates.basic('type', 'Label')
  .addFields(...)
  .build();

// Template completo: conteúdo + estilo + layout
const fullSchema = templates.full('type', 'Label')
  .addFields(...)
  .build();

// Template interativo: conteúdo + estilo + lógica
const interactiveSchema = templates.interactive('type', 'Label')
  .addFields(...)
  .build();

// Template animado: conteúdo + estilo + animação
const animatedSchema = templates.animated('type', 'Label')
  .addFields(...)
  .build();
```

## 🔄 Compatibilidade com Código Legado

O sistema inclui um adapter para manter compatibilidade total:

```typescript
import { getBlockSchema, getBlockSchemaSync } from '@/config/schemas/adapter';

// Usa novo sistema se disponível, fallback para legado
const legacySchema = getBlockSchemaSync('my-block');
```

## 📊 Estatísticas e Debug

```typescript
import { SchemaAPI } from '@/config/schemas';

// Ver estatísticas do registry
const stats = SchemaAPI.stats();
console.log(stats);
// {
//   registered: 15,
//   cached: 5,
//   types: ['headline', 'button', ...]
// }

// Listar todos os tipos registrados
const types = SchemaAPI.list();

// Verificar se schema existe
const exists = SchemaAPI.has('headline');

// Limpar cache (útil em desenvolvimento)
SchemaAPI.clearCache();
```

## 🎯 Benefícios

### Performance
- **Lazy Loading**: Schemas carregados sob demanda
- **Code Splitting**: Bundle menor no carregamento inicial
- **Caching**: Schemas carregados ficam em cache

### Manutenibilidade
- **DRY**: Presets eliminam duplicação
- **Modularidade**: Um arquivo por schema
- **Type-Safety**: TypeScript com generics

### Escalabilidade
- **Fácil Adicionar**: Novo schema = novo arquivo
- **Sem Conflitos**: Arquivos separados = menos merge conflicts
- **Versionamento**: Cada schema tem sua versão

## 🔧 Registrar Novo Schema

1. Criar arquivo em `blocks/`:

```typescript
// blocks/my-new-block.ts
import { templates } from '../base/builder';
import { titleField, colorFields } from '../base/presets';

export const myNewBlockSchema = templates
  .full('my-new-block', 'Meu Novo Bloco')
  .addField(titleField('content'))
  .addFields(...colorFields('style'))
  .build();
```

2. Registrar em `dynamic.ts`:

```typescript
registerSchema('my-new-block', () => 
  import('./blocks/my-new-block').then(m => m.myNewBlockSchema)
);
```

3. Exportar em `index.ts` (opcional):

```typescript
export { myNewBlockSchema } from './blocks/my-new-block';
```

## 📝 Exemplo Completo

```typescript
import { 
  createSchema, 
  titleField, 
  descriptionField,
  colorFields,
  alignmentField,
  BlockFieldSchema 
} from '@/config/schemas';

// Campo customizado
const customField: BlockFieldSchema<number> = {
  key: 'customValue',
  label: 'Valor Customizado',
  type: 'number',
  group: 'content',
  min: 0,
  max: 100,
  default: 50,
  validate: (value) => {
    if (value < 10) return 'Valor muito baixo';
    return null;
  },
};

// Schema completo
export const advancedBlockSchema = createSchema('advanced-block', 'Bloco Avançado')
  .description('Bloco com validações e lógica complexa')
  .category('advanced')
  .icon('Zap')
  .addGroup('content', 'Conteúdo', { order: 1 })
  .addGroup('style', 'Estilo', { order: 2 })
  .addGroup('layout', 'Layout', { order: 3 })
  .addFields(
    titleField('content'),
    descriptionField('content'),
    customField
  )
  .addFields(...colorFields('style'))
  .addField(alignmentField('layout'))
  .version('1.0.0')
  .build();
```

## 🚀 Inicialização

No arquivo principal da aplicação (App.tsx ou index.tsx):

```typescript
import { initializeSchemaRegistry } from '@/config/schemas';

// Inicializar o registry ao carregar a aplicação
initializeSchemaRegistry();
```

## 📚 Tipos Disponíveis

```typescript
type FieldType =
  | 'string'      // Input text
  | 'richtext'    // Textarea
  | 'number'      // Input number
  | 'boolean'     // Checkbox
  | 'color'       // Color picker
  | 'select'      // Dropdown
  | 'enum'        // Select fixo
  | 'options-list' // Lista de opções editáveis
  | 'array'       // Array genérico
  | 'object'      // Objeto
  | 'json';       // JSON editor
```

## 🎓 Boas Práticas

1. **Use Presets**: Sempre que possível, use presets existentes
2. **Nomeie Consistentemente**: Use padrão `{tipo}Field` para campos customizados
3. **Agrupe Logicamente**: Organize campos em grupos semânticos
4. **Valide Inputs**: Adicione validações onde necessário
5. **Documente**: Adicione descriptions para campos complexos
6. **Versione**: Mantenha `version` atualizado em schemas

## 🐛 Troubleshooting

### Schema não carrega

```typescript
// Verificar se está registrado
if (!SchemaAPI.has('my-block')) {
  console.error('Schema não registrado!');
}

// Ver estatísticas
console.log(SchemaAPI.stats());
```

### Performance

```typescript
// Pré-carregar schemas críticos no início
await SchemaAPI.preload('headline', 'button', 'options-grid');
```

### Limpar cache em desenvolvimento

```typescript
SchemaAPI.clearCache();
```

---

**Criado por:** Sistema Modular de Schemas v2.0.0  
**Data:** 2024  
**Status:** ✅ Produção
