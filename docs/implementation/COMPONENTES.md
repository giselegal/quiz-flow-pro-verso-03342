# Guia de Componentes - Quiz Quest

## 📦 Sistema de Componentes

### Hierarquia e Organização

```
components/
├── editor/          # Sistema de edição visual
├── blocks/          # Blocos modulares do editor
├── quiz/            # Componentes específicos de quiz
├── ui/              # Componentes base da interface
└── layout/          # Componentes de estrutura
```

## 🎯 Componentes do Editor

### SchemaDrivenEditorResponsive

**Localização**: `/client/src/components/editor/SchemaDrivenEditorResponsive.tsx`

#### Funcionalidades

- ✅ **Responsividade completa**: Mobile, tablet, desktop
- ✅ **Drag & Drop**: Arraste blocos para criar layouts
- ✅ **Sidebar adaptativo**: Overlay no mobile, fixo no desktop
- ✅ **Sistema de propriedades**: Painel dinâmico por tipo de bloco
- ✅ **Save/Publish**: Sistema integrado v2.0
- ✅ **Auto-save**: Salvamento automático a cada 3 segundos
- ✅ **Cross-compatibility**: Compatível com outros editores

#### Props Interface

```typescript
interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string; // ID do funil (opcional)
  initialBlocks?: Block[]; // Blocos iniciais
  onSave?: (project: Project) => void; // Callback de salvamento
}
```

#### Estados Gerenciados

```typescript
// Estado principal do editor
const [blocks, setBlocks] = useState<Block[]>([]);
const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
const [sidebarOpen, setSidebarOpen] = useState(false);

// Estados de UI
const [isLoading, setIsLoading] = useState(false);
const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
const [isDragging, setIsDragging] = useState(false);
```

### SchemaDrivenComponentsSidebar

**Localização**: `/client/src/components/editor/SchemaDrivenComponentsSidebar.tsx`

#### Funcionalidades

- 📋 **Biblioteca de componentes**: Todos os blocos disponíveis
- 🏷️ **Categorização**: Quiz, Conteúdo, CTA, Layout
- 🔍 **Busca**: Filtro por nome ou categoria
- 📱 **Responsivo**: Overlay no mobile

### DynamicPropertiesPanel

**Localização**: `/client/src/components/editor/DynamicPropertiesPanel.tsx`

#### Funcionalidades

- ⚙️ **Propriedades dinâmicas**: Baseado no tipo de bloco selecionado
- 🎨 **Editor de estilos**: Cores, fontes, espaçamentos
- 🖼️ **Upload de imagens**: Integração com Cloudinary
- 💾 **Auto-save**: Mudanças salvas automaticamente

## 🧩 Blocos Modulares

### 1. Blocos de Quiz

#### QuizQuestionBlock

```typescript
// Pergunta de múltipla escolha
interface QuizQuestionContent {
  question: string;
  options: Array<{
    id: string;
    text: string;
    imageUrl?: string;
  }>;
  multipleSelection: boolean;
  maxSelections?: number;
  minSelections?: number;
  showImages: boolean;
  progressPercent: number;
  logoUrl?: string;
  showBackButton: boolean;
  optionLayout: 'list' | 'grid';
}
```

#### QuizProgressBlock

```typescript
// Barra de progresso do quiz
interface QuizProgressContent {
  percentage: number;
  showText: boolean;
  color: string;
  backgroundColor?: string;
}
```

#### QuizResultBlock

```typescript
// Exibição de resultado
interface QuizResultContent {
  resultType: string;
  resultPercentage: number;
  resultDescription: string;
  resultImage?: string;
  secondaryResults?: Array<{
    type: string;
    percentage: number;
  }>;
}
```

### 2. Blocos de Conteúdo

#### HeadlineBlock

```typescript
// Títulos e subtítulos
interface HeadlineContent {
  title: string;
  subtitle?: string;
  alignment: 'left' | 'center' | 'right';
  titleSize: 'sm' | 'md' | 'lg' | 'xl';
  subtitleSize: 'sm' | 'md' | 'lg';
}
```

#### TextBlock

```typescript
// Blocos de texto
interface TextContent {
  text: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  fontSize: 'sm' | 'md' | 'lg';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
}
```

#### ImageBlock

```typescript
// Componente de imagem
interface ImageContent {
  imageUrl: string;
  imageAlt: string;
  alignment: 'left' | 'center' | 'right';
  width?: number;
  height?: number;
  borderRadius?: BorderRadiusType;
}
```

### 3. Blocos de CTA

#### CTAButtonBlock

```typescript
// Botão de call-to-action
interface CTAButtonContent {
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  fullWidth: boolean;
  backgroundColor?: string;
  textColor?: string;
}
```

#### PricingBlock

```typescript
// Bloco de preços
interface PricingContent {
  title: string;
  price: string;
  regularPrice?: string;
  ctaText: string;
  ctaUrl: string;
  features?: string[];
  alignment: 'left' | 'center' | 'right';
}
```

### 4. Blocos Especiais

#### TestimonialsBlock

```typescript
// Depoimentos
interface TestimonialsContent {
  title?: string;
  testimonials: Array<{
    id: string;
    name: string;
    role?: string;
    content: string;
    rating?: number;
    image?: string;
  }>;
  layout: 'list' | 'grid' | 'carousel';
  showRating: boolean;
  showAvatar: boolean;
}
```

#### GuaranteeBlock

```typescript
// Garantia
interface GuaranteeContent {
  title: string;
  text: string;
  imageUrl?: string;
  badgeText?: string;
  alignment: 'left' | 'center' | 'right';
}
```

## 🎨 Sistema de Estilos

### BlockStyle Interface

```typescript
interface BlockStyle {
  // Cores
  backgroundColor?: string;
  color?: string;
  borderColor?: string;

  // Espaçamentos
  paddingY?: string;
  paddingX?: string;
  marginY?: string;
  marginX?: string;

  // Bordas
  borderRadius?: BorderRadiusType;
  borderWidth?: string;

  // Tipografia
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;

  // Layout
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  minHeight?: string;
}
```

### Classes Tailwind Padronizadas

```typescript
// Cores do tema
const themeColors = {
  primary: '#432818', // Marrom principal
  secondary: '#B89B7A', // Bege secundário
  accent: '#4CAF50', // Verde CTA
  background: '#F9F5F1', // Fundo claro
  white: '#ffffff', // Branco
  text: '#432818', // Texto principal
  textLight: '#8F7A6A', // Texto secundário
};

// Espaçamentos consistentes
const spacing = {
  xs: '4px', // space-1
  sm: '8px', // space-2
  md: '16px', // space-4
  lg: '24px', // space-6
  xl: '32px', // space-8
  xxl: '48px', // space-12
};
```

## 📱 Responsividade

### Breakpoints

```typescript
const breakpoints = {
  mobile: '0px', // < 640px
  tablet: '640px', // 640px - 1023px
  desktop: '1024px', // >= 1024px
};
```

### Padrões Responsivos

```typescript
// Sidebar adaptativo
<div className={`
  ${viewMode === 'mobile'
    ? 'fixed inset-y-0 left-0 z-50 transform transition-transform' +
      (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
    : 'relative w-80 flex-shrink-0'
  }
`}>
```

## 🔧 Hooks Customizados

### useSchemaEditorFixed

```typescript
// Hook principal do editor
const {
  blocks,
  setBlocks,
  selectedBlockId,
  selectBlock,
  addBlock,
  updateBlock,
  removeBlock,
  moveBlock,
} = useSchemaEditorFixed();
```

### useResponsiveLayout

```typescript
// Hook para responsividade
const { viewMode, setViewMode, isMobile, isTablet, isDesktop } = useResponsiveLayout();
```

### useDragAndDrop

```typescript
// Hook para drag & drop
const { sensors, handleDragStart, handleDragEnd, isDragging } = useDragAndDrop({
  blocks,
  setBlocks,
  onDragStart: () => setIsDragging(true),
  onDragEnd: () => setIsDragging(false),
});
```

## 🛠️ Utilitários

### Block Factory

```typescript
// Criação padronizada de blocos
export const createBlock = (
  type: BlockType,
  position?: number,
  customContent?: Partial<EditableContent>
): Block => ({
  id: generateId(),
  type,
  content: {
    ...getDefaultContentForType(type),
    ...customContent,
  },
  style: getDefaultStyleForType(type),
  position: position || 0,
});
```

### Content Validators

```typescript
// Validação de conteúdo por tipo
export const validateBlockContent = (type: BlockType, content: EditableContent): boolean => {
  switch (type) {
    case 'quiz-question':
      return !!(content.question && content.options?.length);
    case 'headline':
      return !!content.title;
    case 'text':
      return !!content.text;
    // ... outros validadores
  }
};
```

## 🎯 Boas Práticas

### 1. Criação de Novos Componentes

```typescript
// 1. Defina a interface do conteúdo
interface MyBlockContent {
  title: string;
  description?: string;
}

// 2. Crie o componente com forwardRef
const MyBlock = forwardRef<HTMLDivElement, BlockProps>(
  ({ content, style }, ref) => {
    return (
      <div ref={ref} className="my-block" style={style}>
        <h2>{content.title}</h2>
        {content.description && <p>{content.description}</p>}
      </div>
    );
  }
);

// 3. Registre no sistema
export const blockDefinitions = {
  'my-block': {
    component: MyBlock,
    label: 'Meu Bloco',
    category: 'content',
    defaultContent: { title: 'Título padrão' }
  }
};
```

### 2. Padrões de Estilo

```typescript
// Use classes consistentes
const buttonClasses = cn(
  'px-4 py-2 rounded-md font-medium transition-colors',
  variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
  variant === 'secondary' && 'bg-secondary text-white hover:bg-secondary/90',
  size === 'sm' && 'text-sm px-3 py-1',
  size === 'lg' && 'text-lg px-6 py-3'
);
```

### 3. Performance

```typescript
// Memorize componentes pesados
const ExpensiveBlock = React.memo(({ content, style }: BlockProps) => {
  // Processamento pesado aqui
  return <div>{content}</div>;
});

// Use callback para funções
const handleBlockUpdate = useCallback((blockId: string, newContent: EditableContent) => {
  updateBlock(blockId, newContent);
}, [updateBlock]);
```

---

**Versão**: 2.0  
**Componentes disponíveis**: 25+  
**Status**: Produção ✅
