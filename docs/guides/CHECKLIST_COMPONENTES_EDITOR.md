# ✅ CHECKLIST - Componentes Editáveis no Editor Fixed

## 📋 Lista de Verificação Completa para Componentes

### 🎯 **1. DEFINIÇÃO DO COMPONENTE**

#### ✅ **Interface TypeScript**

```typescript
interface ComponentProps {
  // Propriedades básicas (OBRIGATÓRIAS)
  id: string;
  className?: string;
  style?: React.CSSProperties;

  // Propriedades editáveis (CUSTOMIZÁVEIS)
  properties?: {
    // Controles principais
    enabled?: boolean;

    // Conteúdo
    text?: string;
    content?: string;

    // Estilo visual
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    alignment?: 'left' | 'center' | 'right';
    width?: string;
    maxWidth?: string;

    // Configurações específicas do componente
    // ... adicionar conforme necessário
  };

  // Propriedades de edição (OBRIGATÓRIAS)
  isEditing?: boolean;
  isSelected?: boolean;
  onUpdate?: (id: string, updates: any) => void;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}
```

#### ✅ **Exportação do Componente**

```typescript
export const ComponentName: React.FC<ComponentProps> = ({
  id,
  className = '',
  style = {},
  properties = {
    // Valores padrão aqui
    enabled: true,
    text: 'Texto padrão',
    color: '#000000',
    fontSize: '16px',
    alignment: 'left',
    width: '100%',
  },
  isEditing = false,
  isSelected = false,
  onUpdate,
  onClick,
  onPropertyChange,
}) => {
  // Implementação do componente
};
```

---

### 🎨 **2. INTEGRAÇÃO NO PAINEL DE PROPRIEDADES**

#### ✅ **Função de Renderização Específica**

```typescript
// Em ComponentSpecificPropertiesPanel.tsx
const renderComponentNameProperties = () => (
  <div className="space-y-4">
    {/* Switch para habilitar/desabilitar */}
    <div className="flex items-center space-x-2">
      <Switch
        id="component-enabled"
        checked={selectedBlock.properties?.enabled !== false}
        onCheckedChange={checked => handlePropertyUpdate("enabled", checked)}
      />
      <Label htmlFor="component-enabled">Habilitar componente</Label>
    </div>

    {/* Campo de texto */}
    <div className="space-y-2">
      <Label htmlFor="component-text">Texto</Label>
      <Input
        id="component-text"
        value={selectedBlock.properties?.text || ""}
        onChange={e => handlePropertyUpdate("text", e.target.value)}
        placeholder="Digite o texto..."
      />
    </div>

    {/* Seletor de cor */}
    <div className="space-y-2">
      <Label htmlFor="component-color">Cor</Label>
      <div className="flex space-x-2">
        <Input
          type="color"
          value={selectedBlock.properties?.color || "#000000"}
          onChange={e => handlePropertyUpdate("color", e.target.value)}
          className="w-12 h-10 p-1"
        />
        <Input
          value={selectedBlock.properties?.color || "#000000"}
          onChange={e => handlePropertyUpdate("color", e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>

    {/* Seletor de tamanho da fonte */}
    <div className="space-y-2">
      <Label>Tamanho da Fonte</Label>
      <Select
        value={selectedBlock.properties?.fontSize || "16px"}
        onValueChange={value => handlePropertyUpdate("fontSize", value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12px">12px</SelectItem>
          <SelectItem value="14px">14px</SelectItem>
          <SelectItem value="16px">16px</SelectItem>
          <SelectItem value="18px">18px</SelectItem>
          <SelectItem value="20px">20px</SelectItem>
          <SelectItem value="24px">24px</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Botões de alinhamento */}
    <div className="space-y-2">
      <Label>Alinhamento</Label>
      <div className="flex space-x-2">
        {[
          { value: "left", icon: <AlignLeft className="w-4 h-4" />, label: "Esquerda" },
          { value: "center", icon: <AlignCenter className="w-4 h-4" />, label: "Centro" },
          { value: "right", icon: <AlignRight className="w-4 h-4" />, label: "Direita" },
        ].map(align => (
          <Button
            key={align.value}
            variant={selectedBlock.properties?.alignment === align.value ? "default" : "outline"}
            size="sm"
            onClick={() => handlePropertyUpdate("alignment", align.value)}
            className="flex-1"
          >
            {align.icon}
          </Button>
        ))}
      </div>
    </div>

    {/* Controle de largura */}
    <div className="space-y-2">
      <Label>Largura do Elemento</Label>
      <Select
        value={selectedBlock.properties?.width || "100%"}
        onValueChange={value => handlePropertyUpdate("width", value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Automática</SelectItem>
          <SelectItem value="25%">25%</SelectItem>
          <SelectItem value="50%">50%</SelectItem>
          <SelectItem value="75%">75%</SelectItem>
          <SelectItem value="100%">100%</SelectItem>
          <SelectItem value="fit-content">Ajustar ao conteúdo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);
```

#### ✅ **Registro no Switch Principal**

```typescript
// Em ComponentSpecificPropertiesPanel.tsx
const renderProperties = () => {
  const blockType = selectedBlock.type;
  const normalizedType = blockType
    .replace("-inline", "")
    .replace("-display", "")
    .replace("-component", "");

  // Verificar tipos específicos primeiro
  if (blockType === "component-name") {
    return renderComponentNameProperties();
  }

  switch (normalizedType) {
    case "text":
      return renderTextProperties();
    case "button":
      return renderButtonProperties();
    case "component":  // Adicionar o novo tipo aqui
      return renderComponentNameProperties();
    default:
      return (
        <div className="text-center text-gray-500 py-8">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Propriedades não disponíveis para este tipo de componente.</p>
        </div>
      );
  }
};
```

---

### 🧪 **3. INTEGRAÇÃO NO SISTEMA DE TESTES**

#### ✅ **Adição ao ComponentTestingPanel**

```typescript
// Em ComponentTestingPanel.tsx
const testComponents = [
  // ... outros componentes
  {
    id: "component-test-1",
    type: "component-name",
    category: "Categoria",
    name: "Nome do Componente",
    component: (
      <div
        onClick={() => handleSelectComponent("component-test-1", "component-name")}
        className="cursor-pointer"
      >
        <ComponentName
          id="component-test-1"
          properties={{
            // Propriedades padrão
            enabled: true,
            text: "Texto de exemplo",
            color: "#000000",
            fontSize: "16px",
            alignment: "left",
            width: "100%",
            // Propriedades dinâmicas
            ...getComponentProps("component-test-1"),
          }}
          isEditing={selectedComponent === "component-test-1"}
          isSelected={selectedComponent === "component-test-1"}
          onClick={() => handleSelectComponent("component-test-1", "component-name")}
          onUpdate={(_, updates: any) => {
            console.log("ComponentName onUpdate:", updates);
            handlePropertyChange("component-test-1", "properties", updates);
          }}
          onPropertyChange={(key: string, value: any) =>
            handlePropertyChange("component-test-1", key, value)
          }
        />
      </div>
    ),
  },
];
```

#### ✅ **Ícone de Categoria**

```typescript
// Em ComponentTestingPanel.tsx
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Texto":
      return <Type className="w-4 h-4" />;
    case "Botão":
      return <Settings className="w-4 h-4" />;
    case "Categoria": // Adicionar nova categoria
      return <Palette className="w-4 h-4" />;
    default:
      return <Settings className="w-4 h-4" />;
  }
};
```

---

### 🏷️ **4. NOME AMIGÁVEL NO PAINEL**

#### ✅ **Função de Nome de Exibição**

```typescript
// Em ComponentSpecificPropertiesPanel.tsx
const getComponentDisplayName = (type: string) => {
  // Verificar tipos específicos primeiro
  if (type === 'component-name') {
    return 'Nome Amigável do Componente';
  }

  const normalizedType = type
    .replace('-inline', '')
    .replace('-display', '')
    .replace('-component', '');

  const names: Record<string, string> = {
    text: 'Texto',
    button: 'Botão',
    image: 'Imagem',
    component: 'Componente Personalizado', // Adicionar aqui
  };

  return names[normalizedType] || normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
};
```

---

### 🎨 **5. ESTILOS E VISUAL**

#### ✅ **Estilos Responsivos**

```typescript
const styles: React.CSSProperties = {
  // Propriedades básicas
  width: properties.width || '100%',
  maxWidth: properties.maxWidth,
  color: properties.color || '#000000',
  fontSize: properties.fontSize || '16px',
  fontWeight: properties.fontWeight || 'normal',
  textAlign: properties.alignment as 'left' | 'center' | 'right',

  // Box model
  margin: 0,
  padding: isEditing ? '8px' : 0,
  boxSizing: 'border-box',

  // Visual feedback
  cursor: isEditing ? 'pointer' : 'default',
  border: isSelected ? '2px dashed #B89B7A' : 'transparent',
  borderRadius: '4px',
  minHeight: isEditing ? '24px' : 'auto',
  transition: 'all 0.2s ease',

  // Estados especiais
  opacity: properties.enabled === false ? 0.5 : 1,
  pointerEvents: properties.enabled === false ? 'none' : 'auto',
};
```

#### ✅ **Estados de Interação**

```typescript
const handleClick = (e: React.MouseEvent) => {
  e.stopPropagation();

  // Notificar seleção
  onClick?.();

  // Lógica específica do componente
  if (isEditing && properties.enabled) {
    // Ações de edição
  }
};

const handleUpdate = (updates: any) => {
  onUpdate?.(id, updates);
  console.log(`${id} updated:`, updates);
};
```

---

### 🔧 **6. DEBUG E MONITORAMENTO**

#### ✅ **Sistema de Logs**

```typescript
// Adicionar logs para debug
useEffect(() => {
  if (isEditing) {
    console.log(`Component ${id} entered editing mode`);
  }
}, [isEditing, id]);

useEffect(() => {
  console.log(`Component ${id} properties updated:`, properties);
}, [properties, id]);
```

#### ✅ **Modo de Desenvolvimento**

```typescript
// Adicionar indicadores visuais no modo de edição
{isEditing && (
  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
    {type}
  </div>
)}
```

---

### 📝 **7. DOCUMENTAÇÃO**

#### ✅ **Comentários JSDoc**

````typescript
/**
 * Componente editável para o sistema de quiz
 *
 * @param id - Identificador único do componente
 * @param properties - Propriedades configuráveis do componente
 * @param isEditing - Se o componente está em modo de edição
 * @param onUpdate - Callback para atualizações de propriedades
 *
 * @example
 * ```tsx
 * <ComponentName
 *   id="example-1"
 *   properties={{ enabled: true, text: "Exemplo" }}
 *   isEditing={true}
 *   onUpdate={(id, updates) => console.log(updates)}
 * />
 * ```
 */
````

---

## 🚀 **CHECKLIST FINAL**

### ✅ **Arquivo do Componente**

- [ ] Interface TypeScript completa
- [ ] Propriedades padrão definidas
- [ ] Callbacks de edição implementados
- [ ] Estilos responsivos configurados
- [ ] Estados de interação funcionais
- [ ] Sistema de logs para debug

### ✅ **Integração no Editor**

- [ ] Função de renderização no ComponentSpecificPropertiesPanel
- [ ] Registro no switch principal de tipos
- [ ] Nome amigável configurado
- [ ] Ícone de categoria definido

### ✅ **Sistema de Testes**

- [ ] Componente adicionado ao ComponentTestingPanel
- [ ] Propriedades de teste configuradas
- [ ] Callbacks de atualização implementados
- [ ] Debug ativo para monitoramento

### ✅ **Funcionalidades**

- [ ] Edição em tempo real
- [ ] Sincronização bidirecional
- [ ] Propriedades persistentes
- [ ] Feedback visual de estados

### ✅ **Qualidade**

- [ ] Código formatado com Prettier
- [ ] Zero erros de TypeScript
- [ ] Testes funcionais passando
- [ ] Documentação atualizada

---

## 🎯 **EXEMPLO COMPLETO DE IMPLEMENTAÇÃO**

Ver os arquivos:

- `src/components/blocks/inline/TextInline.tsx` (exemplo de componente)
- `src/components/editor/quiz/QuizIntroHeaderBlock.tsx` (exemplo complexo)
- `src/components/editor/properties/ComponentSpecificPropertiesPanel.tsx` (painel)
- `src/components/editor/testing/ComponentTestingPanel.tsx` (testes)

---

**✅ Todos os itens desta checklist devem estar implementados para um componente ser totalmente funcional no editor!**
