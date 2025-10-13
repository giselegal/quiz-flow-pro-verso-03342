# 🚀 Guia Rápido: Como Adicionar Novos Schemas

**Para desenvolvedores que precisam adicionar novos componentes ao editor**

---

## 📝 Passo a Passo

### 1️⃣ Criar o Componente React

```tsx
// src/components/editor/blocks/MeuNovoBlock.tsx
import React from 'react';

interface MeuNovoBlockProps {
  data: {
    properties: {
      title?: string;
      description?: string;
      color?: string;
      // ... outras propriedades
    };
  };
}

export default function MeuNovoBlock({ data }: MeuNovoBlockProps) {
  const { title, description, color } = data.properties;
  
  return (
    <div style={{ color }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### 2️⃣ Registrar no EnhancedBlockRegistry

```tsx
// src/components/editor/blocks/EnhancedBlockRegistry.tsx

// Adicionar import (estático ou lazy)
import MeuNovoBlock from '@/components/editor/blocks/MeuNovoBlock';
// OU
// const MeuNovoBlock = lazy(() => import('@/components/editor/blocks/MeuNovoBlock'));

// Adicionar ao registry
export const ENHANCED_BLOCK_REGISTRY: Record<string, ComponentType<any>> = {
  // ... componentes existentes
  
  'meu-novo-block': MeuNovoBlock, // ✅ Adicionar aqui
};
```

### 3️⃣ Criar o Schema

```typescript
// src/config/blockPropertySchemas.ts

export const blockPropertySchemas: Record<string, BlockSchema> = {
  // ... schemas existentes
  
  'meu-novo-block': {
    label: 'Meu Novo Bloco',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        required: true,
        defaultValue: 'Título padrão',
        description: 'Título principal do bloco'
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        group: 'content',
        defaultValue: 'Descrição padrão',
        description: 'Texto descritivo'
      },
      {
        key: 'color',
        label: 'Cor do Texto',
        type: 'color',
        group: 'style',
        defaultValue: '#000000',
        description: 'Cor do texto'
      },
      {
        key: 'fontSize',
        label: 'Tamanho da Fonte',
        type: 'select',
        group: 'style',
        options: [
          { label: 'Pequeno', value: '14px' },
          { label: 'Médio', value: '16px' },
          { label: 'Grande', value: '20px' }
        ],
        defaultValue: '16px'
      },
      {
        key: 'showIcon',
        label: 'Mostrar Ícone',
        type: 'boolean',
        group: 'content',
        defaultValue: true
      },
      {
        key: 'className',
        label: 'Classes CSS',
        type: 'text',
        group: 'style',
        description: 'Classes Tailwind personalizadas'
      }
    ]
  },
};
```

### 4️⃣ Verificar

```bash
# Verificar se não há componentes faltando
node scripts/analyze-missing-components.mjs

# Deve mostrar:
# ✅ Tipos no Registry: 78
# ✅ Tipos no Schema: 78
# ✅ Faltando: 0
```

---

## 🎨 Tipos de Campos Disponíveis

### `text` - Texto Simples
```typescript
{
  key: 'title',
  label: 'Título',
  type: 'text',
  group: 'content',
  defaultValue: 'Valor padrão',
  required: true,
  description: 'Descrição do campo'
}
```

### `textarea` - Texto Multi-linha
```typescript
{
  key: 'description',
  label: 'Descrição',
  type: 'textarea',
  group: 'content',
  defaultValue: 'Texto longo...'
}
```

### `number` - Número
```typescript
{
  key: 'width',
  label: 'Largura (px)',
  type: 'number',
  group: 'layout',
  defaultValue: 300,
  min: 0,
  max: 1000
}
```

### `range` - Slider
```typescript
{
  key: 'opacity',
  label: 'Opacidade',
  type: 'range',
  group: 'style',
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 100
}
```

### `color` - Seletor de Cor
```typescript
{
  key: 'backgroundColor',
  label: 'Cor de Fundo',
  type: 'color',
  group: 'style',
  defaultValue: '#ffffff'
}
```

### `boolean` - Checkbox
```typescript
{
  key: 'visible',
  label: 'Visível',
  type: 'boolean',
  group: 'content',
  defaultValue: true
}
```

### `select` - Dropdown
```typescript
{
  key: 'size',
  label: 'Tamanho',
  type: 'select',
  group: 'style',
  options: [
    { label: 'Pequeno', value: 'sm' },
    { label: 'Médio', value: 'md' },
    { label: 'Grande', value: 'lg' }
  ],
  defaultValue: 'md'
}
```

### `json` - Objeto JSON
```typescript
{
  key: 'items',
  label: 'Lista de Itens',
  type: 'json',
  group: 'content',
  description: 'Array de objetos: [{title, value}]',
  defaultValue: []
}
```

---

## 📦 Grupos (Categories)

Organize os campos em grupos lógicos:

- **`content`** - Conteúdo principal (texto, imagens, links)
- **`style`** - Estilos visuais (cores, fontes, bordas)
- **`layout`** - Layout e espaçamento (margin, padding, width)
- **`behavior`** - Comportamento (animações, interatividade)
- **`config`** - Configurações técnicas (APIs, integrações)
- **`advanced`** - Configurações avançadas

---

## 🔍 Validação

### Campos Obrigatórios
```typescript
{
  key: 'email',
  label: 'Email',
  type: 'text',
  required: true, // ✅ Campo obrigatório
  description: 'Email é obrigatório'
}
```

### Limites
```typescript
{
  key: 'age',
  label: 'Idade',
  type: 'number',
  min: 18, // ✅ Valor mínimo
  max: 100, // ✅ Valor máximo
  defaultValue: 25
}
```

### Campos Condicionais
```typescript
{
  key: 'details',
  label: 'Detalhes',
  type: 'textarea',
  showIf: 'showDetails === true', // ✅ Mostrar apenas se...
  group: 'content'
}
```

---

## 🎯 Boas Práticas

### ✅ DO (Faça)

1. **Use nomes descritivos**
   ```typescript
   key: 'primaryButtonText' // ✅ Claro e específico
   ```

2. **Sempre forneça valores padrão**
   ```typescript
   defaultValue: 'Clique aqui' // ✅ Evita valores undefined
   ```

3. **Adicione descrições úteis**
   ```typescript
   description: 'URL completa incluindo https://' // ✅ Ajuda o usuário
   ```

4. **Organize por grupos**
   ```typescript
   group: 'content' // ✅ Facilita navegação
   ```

5. **Use o tipo correto**
   ```typescript
   type: 'color' // ✅ Para cores
   type: 'number' // ✅ Para números
   ```

### ❌ DON'T (Não Faça)

1. **Nomes genéricos**
   ```typescript
   key: 'text' // ❌ Muito genérico
   key: 'buttonPrimaryText' // ✅ Melhor
   ```

2. **Sem valores padrão**
   ```typescript
   defaultValue: undefined // ❌ Pode causar erros
   defaultValue: '' // ✅ Sempre defina
   ```

3. **Sem agrupamento**
   ```typescript
   // ❌ Todos os campos soltos
   group: 'content' // ✅ Organize por grupo
   ```

4. **Tipos errados**
   ```typescript
   type: 'text' // ❌ Para cor
   type: 'color' // ✅ Use o tipo correto
   ```

---

## 🧪 Testar o Componente

### 1. No Editor
```bash
npm run dev
# Abrir o editor
# Adicionar o novo componente
# Verificar painel de propriedades
```

### 2. Verificar Schema
```bash
node scripts/analyze-missing-components.mjs
```

### 3. Verificar TypeScript
```bash
npx tsc --noEmit
```

---

## 📚 Exemplos Completos

### Exemplo Simples - Card
```typescript
'simple-card': {
  label: 'Card Simples',
  fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content', required: true },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style' }
  ]
}
```

### Exemplo Avançado - Hero Section
```typescript
'hero-section': {
  label: 'Seção Hero',
  fields: [
    { key: 'headline', label: 'Headline', type: 'text', group: 'content', required: true, defaultValue: 'Título Principal' },
    { key: 'subheadline', label: 'Subheadline', type: 'textarea', group: 'content' },
    { key: 'ctaText', label: 'Texto do CTA', type: 'text', group: 'content', defaultValue: 'Começar' },
    { key: 'ctaUrl', label: 'URL do CTA', type: 'text', group: 'content', defaultValue: '#' },
    { key: 'backgroundImage', label: 'Imagem de Fundo', type: 'text', group: 'style' },
    { key: 'overlay', label: 'Overlay Escuro', type: 'boolean', group: 'style', defaultValue: true },
    { key: 'overlayOpacity', label: 'Opacidade do Overlay', type: 'range', group: 'style', min: 0, max: 100, defaultValue: 50 },
    { key: 'minHeight', label: 'Altura Mínima', type: 'text', group: 'layout', defaultValue: '600px' },
    { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [
      { label: 'Esquerda', value: 'left' },
      { label: 'Centro', value: 'center' },
      { label: 'Direita', value: 'right' }
    ], defaultValue: 'center' }
  ]
}
```

---

## 🆘 Troubleshooting

### Problema: Componente não aparece no painel
**Solução:** Verificar se o tipo no Registry é exatamente igual ao tipo no Schema

### Problema: Propriedades não salvam
**Solução:** Verificar se as keys dos campos correspondem às propriedades do componente

### Problema: Valores padrão não aparecem
**Solução:** Adicionar `defaultValue` em todos os campos

### Problema: TypeScript reclama de tipos
**Solução:** Verificar se o tipo do campo está correto (`text`, `number`, `color`, etc.)

---

## 📞 Suporte

- **Documentação Completa:** [RELATORIO_SCHEMAS_COMPLETOS.md](./RELATORIO_SCHEMAS_COMPLETOS.md)
- **Análise de Componentes:** `node scripts/analyze-missing-components.mjs`
- **Gerador de Schemas:** `node scripts/generate-missing-schemas.mjs`

---

**Criado em:** 13 de outubro de 2025  
**Última Atualização:** 13 de outubro de 2025  
**Versão:** 1.0.0
