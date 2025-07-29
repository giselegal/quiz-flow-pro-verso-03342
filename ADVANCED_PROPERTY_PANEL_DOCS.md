# 🎨 Painel de Propriedades Avançado - Documentação

## 📋 Visão Geral

O **AdvancedPropertyPanel** é um painel de propriedades moderno e responsivo para o editor de quiz das 21 etapas. Utiliza as melhores práticas de UI/UX modernas com componentes acessíveis e estilização utilitária.

## ✨ Funcionalidades

### 🏗️ **Layout**
- **Layout**: Vertical, Horizontal ou Grade
- **Direção**: Linha ou Coluna
- **Alinhamento**: Esquerda, Centro, Direita, Justificado
- **Espaçamento**: Slider de 0-64px
- **Colunas**: Para layout em grade (1-6 colunas)

### 🎯 **Opções**
- **Descrição**: Editor de texto enriquecido
- **Lista de Opções**: Gerenciamento dinâmico com arrastar e soltar
- **Texto e Imagem**: Campos editáveis para cada opção
- **Contador**: Badge mostrando número de opções

### ✅ **Validações**
- **Múltipla Escolha**: Switch para habilitar seleções múltiplas
- **Obrigatório**: Tornar campo obrigatório
- **Auto-avançar**: Avançar automaticamente após seleção
- **Máximo de Seleções**: Slider para limitar seleções (1-10)

### 🎨 **Estilização**
- **Cores**: Color pickers para fundo, texto e borda
- **Bordas**: Sliders para raio e espessura da borda
- **Sombras**: Seletor com 5 níveis (nenhuma, pequena, média, grande, extra grande)

### ✏️ **Personalização**
- **Título/Subtítulo**: Campos de texto para cabeçalhos
- **Placeholder**: Texto de placeholder
- **Texto do Botão**: Personalização do CTA

### ⚙️ **Avançado**
- **CSS Personalizado**: Editor de CSS com syntax highlighting
- **Animações**: Fade, Slide, Bounce
- **Delay**: Slider para timing de animação (0-2000ms)

### 🌐 **Geral**
- **Visibilidade**: Switch para mostrar/ocultar
- **ID do Elemento**: Campo para ID personalizado
- **Classes CSS**: Campo para classes adicionais

## 🔧 Como Usar

### Integração Básica

```tsx
import { AdvancedPropertyPanel } from './AdvancedPropertyPanel';

<AdvancedPropertyPanel
  selectedBlockId={selectedBlockId}
  properties={blockProperties}
  onPropertyChange={(key, value) => {
    // Atualizar propriedade do bloco
    updateBlock(selectedBlockId, { [key]: value });
  }}
  onDeleteBlock={() => {
    // Deletar bloco selecionado
    deleteBlock(selectedBlockId);
  }}
/>
```

### Interface de Propriedades

```typescript
interface BlockProperties {
  // Layout
  layout?: 'vertical' | 'horizontal' | 'grid';
  direction?: 'row' | 'column';
  alignment?: 'left' | 'center' | 'right' | 'justify';
  spacing?: number;
  columns?: number;
  
  // Opções
  options?: Array<{
    id: string;
    text: string;
    image?: string;
    value: string;
  }>;
  description?: string;
  
  // Validações
  required?: boolean;
  multipleChoice?: boolean;
  autoAdvance?: boolean;
  maxSelections?: number;
  
  // Estilização
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // E mais...
}
```

## 🎯 Casos de Uso

### 1. **Quiz de Múltipla Escolha**
```tsx
const quizProperties = {
  layout: 'vertical',
  multipleChoice: true,
  maxSelections: 3,
  required: true,
  autoAdvance: false,
  options: [
    { id: '1', text: 'Opção A', value: 'a' },
    { id: '2', text: 'Opção B', value: 'b' },
    { id: '3', text: 'Opção C', value: 'c' }
  ]
};
```

### 2. **Estilização Personalizada**
```tsx
const styledProperties = {
  backgroundColor: '#f3f4f6',
  textColor: '#1f2937',
  borderRadius: 12,
  borderWidth: 2,
  shadow: 'lg',
  animation: 'fade',
  delay: 300
};
```

### 3. **Layout Responsivo**
```tsx
const responsiveProperties = {
  layout: 'grid',
  columns: 2,
  spacing: 24,
  alignment: 'center'
};
```

## 🚀 Tecnologias Utilizadas

- **React 18**: Hooks e componentes funcionais
- **Radix UI**: Componentes acessíveis (Switch, Select, Slider, Collapsible)
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Lucide Icons**: Ícones SVG modernos
- **TypeScript**: Tipagem forte e intellisense

## 📱 Responsividade

O painel é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout otimizado com grids responsivos
- **Mobile**: Interface compacta mas funcional

## ♿ Acessibilidade

- **ARIA Labels**: Todos os controles têm labels descritivos
- **Navegação por Teclado**: Suporte completo para navegação via teclado
- **Contraste**: Cores com contraste adequado (WCAG AA)
- **Focus Management**: Indicadores visuais claros

## 🔄 Estados dos Componentes

### Seções Colapsáveis
Cada categoria (Layout, Opções, Validações, etc.) pode ser expandida/colapsada independentemente.

### Estados de Loading
Componentes mostram estados de carregamento durante operações assíncronas.

### Feedback Visual
Animações suaves e feedback visual para todas as interações.

## 📝 Exemplos de Implementação

### Painel Standalone
```tsx
// Para uso em outros projetos
import { AdvancedPropertyPanel } from '@/components/editor/AdvancedPropertyPanel';

function MyEditor() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [properties, setProperties] = useState({});

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        {/* Canvas do editor */}
      </div>
      <div className="w-80">
        <AdvancedPropertyPanel
          selectedBlockId={selectedBlock?.id}
          properties={properties}
          onPropertyChange={(key, value) => {
            setProperties(prev => ({ ...prev, [key]: value }));
          }}
        />
      </div>
    </div>
  );
}
```

### Integração com Context
```tsx
// Usando Context para gerenciar estado global
const EditorContext = createContext();

function EditorProvider({ children }) {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const updateBlockProperty = useCallback((blockId, key, value) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, properties: { ...block.properties, [key]: value } }
        : block
    ));
  }, []);

  return (
    <EditorContext.Provider value={{
      blocks,
      selectedBlockId,
      updateBlockProperty
    }}>
      {children}
    </EditorContext.Provider>
  );
}
```

## 🛠️ Personalização

### Tema Personalizado
```tsx
// Customizar cores do tema
const customTheme = {
  colors: {
    layout: 'blue-600',
    options: 'green-600',
    validations: 'orange-600',
    styling: 'purple-600',
    customization: 'pink-600',
    advanced: 'indigo-600',
    general: 'gray-600'
  }
};
```

### Componentes Customizados
```tsx
// Substituir componentes internos
const CustomColorPicker = ({ value, onChange }) => {
  // Implementação personalizada
};

// Passar como prop
<AdvancedPropertyPanel
  components={{
    ColorPicker: CustomColorPicker
  }}
/>
```

## 📊 Performance

- **Lazy Loading**: Seções são carregadas sob demanda
- **Memoização**: Componentes usam React.memo e useMemo
- **Debouncing**: Atualizações de propriedades são debounced
- **Virtual Scrolling**: Para listas grandes de opções

## 🔐 Segurança

- **Sanitização**: Entradas são sanitizadas para prevenir XSS
- **Validação**: Propriedades são validadas antes da aplicação
- **CSP**: Compatível com Content Security Policies

## 📈 Roadmap

### Versão 2.0
- [ ] Drag & Drop nativo para reordenação
- [ ] Editor WYSIWYG mais avançado
- [ ] Suporte a temas dinâmicos
- [ ] Export/Import de configurações
- [ ] Histórico de undo/redo

### Versão 2.1
- [ ] Integração com bibliotecas de design system
- [ ] Plugins customizáveis
- [ ] Modo escuro nativo
- [ ] Colaboração em tempo real
