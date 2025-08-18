# Arquitetura do Sistema Quiz Quest

## 🏛️ Visão Geral da Arquitetura

### Stack Tecnológico

```
Frontend: React 18 + TypeScript + Vite
├── UI Framework: Tailwind CSS
├── Routing: Wouter (Client-side)
├── State Management: React Hooks + Context
├── Drag & Drop: @dnd-kit
├── Icons: Lucide React
└── Persistence: localStorage v2.0
```

## 📁 Estrutura de Componentes

### 1. Editor System (`/client/src/components/editor/`)

#### SchemaDrivenEditorResponsive.tsx

```typescript
// Editor principal com responsividade completa
- Mobile-first design
- Sidebar overlay para mobile
- Grid system responsivo
- Drag & drop universal
- Sistema de propriedades dinâmico
- Auto-save + manual save
- Cross-compatibility com outros editores
```

#### Hooks Principais

- `useSchemaEditorFixed`: Estado global do editor
- `useDragAndDrop`: Lógica de arrastar e soltar
- `useResponsiveLayout`: Adaptação de layout

### 2. Block System (`/client/src/components/blocks/`)

#### Hierarquia de Componentes

```
blocks/
├── quiz/                    # Componentes de quiz
│   ├── QuizQuestion.tsx
│   ├── QuizProgress.tsx
│   └── QuizResult.tsx
├── content/                 # Conteúdo geral
│   ├── Headline.tsx
│   ├── TextBlock.tsx
│   ├── ImageBlock.tsx
│   └── TestimonialBlock.tsx
├── cta/                     # Call-to-action
│   ├── CTAButton.tsx
│   ├── PricingBlock.tsx
│   └── GuaranteeBlock.tsx
└── layout/                  # Layout e estrutura
    ├── HeaderBlock.tsx
    ├── SpacerBlock.tsx
    └── DividerBlock.tsx
```

### 3. UI Components (`/client/src/components/ui/`)

#### Design System

```typescript
// Componentes base reutilizáveis
- Button: Variações primary/secondary/outline
- Input: Campos de formulário padronizados
- Modal: Sistema de modais responsivos
- Card: Containers com estilo consistente
- Badge: Elementos de destaque
- Progress: Barras de progresso
```

## 🔄 Fluxo de Dados

### 1. Estado Global

```typescript
interface EditorState {
  // Projeto atual
  currentProject: Project | null;

  // Blocos ativos
  blocks: Block[];

  // Configurações do editor
  editorSettings: {
    viewMode: 'mobile' | 'tablet' | 'desktop';
    sidebarOpen: boolean;
    previewMode: boolean;
  };

  // Estados de UI
  isDragging: boolean;
  selectedBlockId: string | null;
  isLoading: boolean;
}
```

### 2. Sistema de Persistência v2.0

```typescript
// Dual storage para compatibilidade
localStorage keys:
├── `schema-editor-${projectId}`: Formato principal
├── `editor-${projectId}`: Formato compatibilidade
├── `schema-editor-settings`: Configurações globais
└── `editor-projects-list`: Lista de projetos
```

### 3. Fluxo de Salvamento

```
User Action → State Update → Auto-save (3s delay) → localStorage
                          ↓
                     Manual Save → Explicit save → localStorage + UI feedback
                          ↓
                     Publish → Mark as published → localStorage + URL generation
```

## 🎨 Sistema de Design

### 1. Tokens de Design

```css
/* Cores principais */
--primary-brown:
  #432818 --secondary-beige: #b89b7a --background-light: #f9f5f1 --background-white: #ffffff
    /* Tipografia */ --font-primary: Inter,
  system-ui --font-weights: 400, 500, 600,
  700 /* Espaçamentos */ --spacing-xs: 4px --spacing-sm: 8px --spacing-md: 16px --spacing-lg: 24px
    --spacing-xl: 32px /* Border radius */ --radius-sm: 4px --radius-md: 8px --radius-lg: 12px
    --radius-full: 9999px;
```

### 2. Breakpoints Responsivos

```css
/* Mobile first approach */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## 🧩 Extensibilidade

### 1. Criação de Novos Blocos

```typescript
// 1. Definir tipo no sistema
export type NewBlockType = 'my-custom-block';

// 2. Criar componente
export const MyCustomBlock: React.FC<BlockProps> = ({ content, style }) => {
  return <div>Custom content</div>;
};

// 3. Registrar no sistema
export const blockDefinitions = {
  'my-custom-block': {
    component: MyCustomBlock,
    label: 'Meu Bloco Customizado',
    category: 'custom',
    defaultContent: getDefaultContentForType('my-custom-block')
  }
};

// 4. Adicionar defaults
case 'my-custom-block':
  return { text: 'Default content', alignment: 'center' };
```

### 2. Propriedades Dinâmicas

```typescript
// Sistema automático de propriedades baseado no content
interface BlockContent {
  // Propriedades são inferidas automaticamente
  text?: string; // → Text input
  alignment?: Alignment; // → Select dropdown
  style?: BlockStyle; // → Style panel
  imageUrl?: string; // → Image uploader
}
```

## 🔧 Sistema de Build

### 1. Configuração Vite

```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: { port: 5000 },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          editor: ['@dnd-kit/core', '@dnd-kit/sortable'],
        },
      },
    },
  },
});
```

### 2. Otimizações

- **Code splitting**: Componentes carregados sob demanda
- **Tree shaking**: Eliminação de código não utilizado
- **Bundle analysis**: Otimização de tamanho
- **Hot reload**: Desenvolvimento ágil

## 🔍 Debugging e Monitoring

### 1. Debug Tools

```typescript
// Console helpers disponíveis globalmente
window.editorDebug = {
  getState: () => editorState,
  exportProject: () => JSON.stringify(currentProject),
  clearStorage: () => localStorage.clear(),
  logBlocks: () => console.table(blocks),
};
```

### 2. Error Boundaries

```typescript
// Captura de erros em componentes
<ErrorBoundary fallback={<ErrorFallback />}>
  <Block type={blockType} content={content} />
</ErrorBoundary>
```

## 📊 Performance

### 1. Métricas

- **Lighthouse Score**: 90+ em todas as categorias
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 2s em 3G
- **First Paint**: < 1s

### 2. Otimizações Implementadas

- **Lazy loading**: Componentes e imagens
- **Memoization**: React.memo nos componentes
- **Virtual scrolling**: Para listas grandes
- **Debounced saves**: Evita saves excessivos

## 🚀 Deploy e CI/CD

### 1. Build Process

```bash
npm run build     # → dist/ folder
npm run preview   # Test build locally
```

### 2. Environment Variables

```env
VITE_API_URL=https://api.example.com
VITE_CLOUDINARY_URL=https://cloudinary.com
VITE_ENV=production
```

## 🔮 Roadmap Técnico

### Próximas Melhorias

- [ ] **PWA Support**: Service workers + cache offline
- [ ] **Real-time Collaboration**: WebSockets + operational transforms
- [ ] **Plugin System**: API para extensões de terceiros
- [ ] **Advanced Analytics**: Tracking detalhado de uso
- [ ] **Export Options**: PDF, HTML, JSON
- [ ] **Theme System**: Múltiplos temas visuais

### Melhorias de Performance

- [ ] **Web Workers**: Processamento pesado em background
- [ ] **CDN Integration**: Assets otimizados
- [ ] **GraphQL**: Query otimizada de dados
- [ ] **Caching Strategy**: Redis/Memcached

---

**Versão da Arquitetura**: 2.0  
**Última revisão**: Janeiro 2025  
**Status**: Em produção ✅
