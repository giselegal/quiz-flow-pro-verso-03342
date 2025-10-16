# 🧩 Sistema de Componentes Modulares

## 🎯 Visão Geral

Sistema unificado que garante que TODOS os blocos sejam:
- ✅ 100% modulares e independentes
- ✅ Totalmente editáveis via painel de propriedades
- ✅ Reordenáveis via drag & drop
- ✅ Reutilizáveis em qualquer step

---

## 📐 Arquitetura

### Hierarquia de Componentes

```
UniversalBlockProperties (Interface Base)
    ├─ Layout Properties (width, height, maxWidth)
    ├─ Spacing Properties (margins, paddings)
    ├─ Visual Properties (colors, borders, shadows)
    ├─ Typography Properties (fontSize, fontWeight, textAlign)
    ├─ Image Properties (src, alt, objectFit)
    └─ Behavior Properties (onClick, href, disabled)
```

### Componentes Modulares Implementados

#### 🏷️ Quiz Components
1. **QuizLogoBlock** (`quiz-logo`)
   - Logo isolado com dimensões editáveis
   - Suporte a URL de imagem customizada
   - Sistema universal de margens e padding

2. **QuizProgressBlock** (`quiz-progress-bar`)
   - Barra de progresso independente
   - Mostra/oculta dinamicamente
   - Estilos de cor e altura customizáveis

3. **QuizBackButtonBlock** (`quiz-back-button`)
   - Botão de navegação isolado
   - Variantes de estilo (default, outline, ghost, link)
   - Ícone opcional

4. **ImageDisplayInlineBlock** (`image-display-inline`)
   - Imagem com propriedades universais completas
   - Controles de objectFit (contain, cover, fill, etc.)
   - Sistema de bordas e sombras

---

## 🛠️ Como Criar Novos Blocos Modulares

### Passo 1: Criar o Componente

```typescript
// src/components/editor/blocks/MeuBlocoModular.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps, UniversalBlockProperties } from '@/types/blocks';

interface MeuBlocoModularProps extends BlockComponentProps {
  properties?: UniversalBlockProperties & {
    // Propriedades específicas do seu bloco
    minhaPropCustom?: string;
  };
}

export const MeuBlocoModular: React.FC<MeuBlocoModularProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    marginTop = 0,
    marginBottom = 0,
    backgroundColor = 'transparent',
    borderRadius = 0,
    // ... suas props
  } = properties;

  const containerStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
  };

  return (
    <div
      className={cn(
        'transition-all',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      {/* Seu conteúdo aqui */}
    </div>
  );
};

export default MeuBlocoModular;
```

### Passo 2: Registrar no EnhancedBlockRegistry

```typescript
// src/components/editor/blocks/EnhancedBlockRegistry.tsx

// Adicionar lazy import
const MeuBlocoModular = React.lazy(() => import('./MeuBlocoModular'));

// Adicionar ao registry
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
    // ... outros blocos
    'meu-bloco-modular': MeuBlocoModular,
};

// Adicionar aos componentes disponíveis
export const AVAILABLE_COMPONENTS = [
    // ... outros componentes
    {
        type: 'meu-bloco-modular',
        label: 'Meu Bloco',
        category: 'custom',
        description: 'Descrição do meu bloco',
    },
];
```

### Passo 3: Usar no Template

```typescript
// src/templates/quiz21StepsComplete.ts

'step-XX': [
    {
        id: 'stepXX-meu-bloco-1',
        type: 'meu-bloco-modular',
        order: 0,
        properties: {
            marginTop: 16,
            marginBottom: 16,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            minhaPropCustom: 'valor',
        },
        content: {},
    },
]
```

---

## 🎨 Sistema de Propriedades Universais

### Categorias de Propriedades

#### 📐 Layout
```typescript
{
  width?: string | number;          // 'auto', '100%', 300
  height?: string | number;         // 'auto', '50vh', 200
  maxWidth?: string | number;       // '100%', 800
  minHeight?: string | number;      // 'auto', 100
}
```

#### 📏 Spacing
```typescript
{
  marginTop?: number;        // 0-100 (pixels)
  marginBottom?: number;     // 0-100
  marginLeft?: number;       // 0-100
  marginRight?: number;      // 0-100
  paddingTop?: number;       // 0-100
  paddingBottom?: number;    // 0-100
  paddingLeft?: number;      // 0-100
  paddingRight?: number;     // 0-100
}
```

#### 🎨 Visual
```typescript
{
  backgroundColor?: string;  // '#ffffff', 'hsl(var(--primary))'
  borderColor?: string;      // '#000000'
  borderWidth?: number;      // 0-10
  borderRadius?: number;     // 0-50
  boxShadow?: string;        // '0 4px 6px rgba(0,0,0,0.1)'
  opacity?: number;          // 0-1
}
```

#### 📝 Typography
```typescript
{
  fontSize?: string | number;       // '16px', '1rem', 16
  fontWeight?: string | number;     // '400', 'bold', 700
  fontFamily?: string;              // 'Inter', 'sans-serif'
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;                   // '#000000'
  lineHeight?: string;              // '1.5', '24px'
}
```

#### 🖼️ Image
```typescript
{
  src?: string;              // URL da imagem
  alt?: string;              // Texto alternativo
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}
```

---

## 🔧 Painel Universal de Propriedades

O `UniversalPropertiesPanel` renderiza dinamicamente os campos de edição baseado no tipo de bloco:

### Categorias Renderizadas

1. **Layout** - Todos os blocos
2. **Spacing** - Todos os blocos
3. **Visual** - Todos os blocos
4. **Typography** - Apenas blocos de texto
5. **Image** - Apenas blocos de imagem

### Exemplo de Uso

```typescript
<UniversalPropertiesPanel
  blockType="quiz-logo"
  properties={currentBlock.properties}
  onPropertyChange={(key, value) => {
    updateBlockProperty(currentBlock.id, key, value);
  }}
/>
```

---

## 📊 Componentes por Categoria

### 🧩 Quiz (4 componentes)
- `quiz-logo` - Logo do Quiz
- `quiz-progress-bar` - Barra de Progresso
- `quiz-back-button` - Botão Voltar
- `quiz-intro-header` - Cabeçalho (Legacy - será removido)

### 📝 Content (8 componentes)
- `text-inline` - Texto Inline
- `heading-inline` - Título
- `image-display-inline` - Imagem Display (✨ Novo Modular)
- `button-inline` - Botão
- `decorative-bar-inline` - Barra Decorativa
- `form-input` - Campo de Formulário
- `options-grid` - Grid de Opções
- `video` - Vídeo

### 🎯 Interactive (3 componentes)
- `button-inline` - Botão Clicável
- `form-input` - Input de Formulário
- `options-grid` - Opções Clicáveis

---

## 🚀 Próximos Passos

### Fase 6: Expandir para Steps 2-21

#### Steps 2-11 (Perguntas)
- [ ] `QuizQuestionHeaderBlock` - Cabeçalho da pergunta
- [ ] `QuizOptionsGridBlock` - Grid de opções (validar modularidade)
- [ ] `QuizQuestionFooterBlock` - Rodapé da pergunta

#### Step 12 (Transição)
- [ ] `QuizTransitionLoaderBlock` - Loader animado
- [ ] `QuizTransitionTextBlock` - Texto de transição

#### Steps 13-18 (Perguntas Estratégicas)
- [ ] `QuizStrategicQuestionBlock` - Pergunta estratégica
- [ ] `QuizStyleCardsGridBlock` - Grid de cards de estilo

#### Step 19 (Processamento)
- [ ] `QuizProcessingLoaderBlock` - Loader com texto dinâmico

#### Step 20 (Resultado)
- [ ] `QuizResultHeaderBlock` - Cabeçalho do resultado
- [ ] `QuizStyleRevealBlock` - Revelação do estilo
- [ ] `QuizSecondaryStylesBlock` - Estilos secundários
- [ ] `QuizCompatibilityBlock` - Compatibilidade

#### Step 21 (Oferta)
- [ ] `QuizOfferHeroBlock` - Hero da oferta
- [ ] `QuizBenefitsListBlock` - Lista de benefícios
- [ ] `QuizTestimonialsGridBlock` - Grid de depoimentos
- [ ] `QuizPricingBlock` - Bloco de preço

---

## 🐛 Troubleshooting

### Problema: Bloco não aparece na sidebar
**Solução:** Verificar se foi adicionado ao `AVAILABLE_COMPONENTS` no `EnhancedBlockRegistry.tsx`

### Problema: Propriedades não salvam
**Solução:** Garantir que `onPropertyChange` está sendo chamado corretamente e que o bloco implementa `BlockComponentProps`

### Problema: Drag & drop não funciona
**Solução:** Verificar se o bloco está envolvido pelo `DndContext` e se tem `id` único

### Problema: Preview não renderiza igual ao editor
**Solução:** Garantir que o bloco usa as mesmas propriedades em ambos os modos (edit e preview)

---

## 📚 Referências

- [STEP-01-STRUCTURE.md](./STEP-01-STRUCTURE.md) - Estrutura detalhada do Step 1
- [BlockInterfaces.ts](../src/types/core/BlockInterfaces.ts) - Tipos unificados
- [EnhancedBlockRegistry.tsx](../src/components/editor/blocks/EnhancedBlockRegistry.tsx) - Registro de blocos

---

**Versão:** 1.0.0  
**Data:** 2025-01-17  
**Status:** ✅ Fase 1-5 Implementadas | 🚧 Fase 6-7 Pendentes
