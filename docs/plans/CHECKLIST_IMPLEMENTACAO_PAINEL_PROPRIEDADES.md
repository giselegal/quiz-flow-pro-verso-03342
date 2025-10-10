# ✅ CHECKLIST DE IMPLEMENTAÇÃO - PAINEL DE PROPRIEDADES

**Data:** 11 de setembro de 2025  
**Responsável:** GitHub Copilot + Equipe de Desenvolvimento  
**Duração Estimada:** 2-3 sprints (2-3 semanas)

---

## 🎯 PRIORIDADE ALTA - GAPS CRÍTICOS (Sprint 1)

### **1.1. Propriedades Faltantes - quiz-intro-header**
- [ ] **showPrimaryStyleName** - Adicionar switch com description clara
- [ ] **showPrimaryStyleDescription** - Adicionar switch com description clara  
- [ ] **showPrimaryStyleProgress** - Adicionar switch com description clara
- [ ] **showPrimaryStyleImage** - Adicionar switch com description clara
- [ ] **showPrimaryStyleGuide** - Adicionar switch com description clara
- [ ] **contentMaxWidth** - Adicionar select com opções predefinidas
- [ ] **progressHeight** - Adicionar range slider 2-20px

### **1.2. Propriedades Faltantes - options-grid**
- [ ] **scoreValues** - Implementar editor de objeto estruturado
- [ ] **animationType** - Adicionar select com preview das animações
- [ ] **responsiveColumns** - Implementar editor de grid responsivo
- [ ] **questionId** - Adicionar text input com validação
- [ ] **Melhorar OptionsArrayEditor** - Adicionar campos image, category

### **1.3. Propriedades Faltantes - form-input**
- [ ] **storeAsUserName** - Adicionar switch com description
- [ ] **resultDisplayKey** - Adicionar text input com placeholder
- [ ] **validationPattern** - Melhorar com preview de regex
- [ ] **Integração Supabase** - Opções dinâmicas para tables/columns

### **1.4. Propriedades Faltantes - button-inline**
- [ ] **showDisabledState** - Adicionar switch
- [ ] **disabledOpacity** - Adicionar range slider 0.1-1
- [ ] **effectType** - Adicionar select com opções de efeito
- [ ] **shadowType** - Adicionar select com opções de sombra
- [ ] **Melhorar sistema de ações** - Select com opções dinâmicas

---

## 🔧 PRIORIDADE MÉDIA - EDITORES AVANÇADOS (Sprint 2)

### **2.1. BoxModelEditor - Margens e Padding Visual**
- [ ] **Criar componente BoxModelEditor**
  - [ ] Layout visual em formato de box model CSS
  - [ ] 4 inputs interligados (top, right, bottom, left)
  - [ ] Toggle para link/unlink valores
  - [ ] Support para múltiplas unidades (px, rem, %)
  - [ ] Preview em tempo real
- [ ] **Integrar ao propertyEditors.tsx**
- [ ] **Aplicar para marginTop, marginBottom, etc.**

### **2.2. GridLayoutEditor - Layout Responsivo**
- [ ] **Criar componente GridLayoutEditor**
  - [ ] Tabs para mobile/tablet/desktop
  - [ ] Preview visual do grid
  - [ ] Sliders para número de colunas
  - [ ] Controle de gap/espaçamento
  - [ ] Preview com items simulados
- [ ] **Integrar ao propertyEditors.tsx**
- [ ] **Aplicar para gridColumns, responsiveColumns**

### **2.3. EnhancedUploadEditor - Upload Real**
- [ ] **Criar componente EnhancedUploadEditor**
  - [ ] Drag & drop area
  - [ ] Progress bar de upload
  - [ ] Preview de imagens/arquivos
  - [ ] Validação de tipo e tamanho
  - [ ] Integração com Cloudinary/Supabase
  - [ ] Fallback para URL manual
- [ ] **Integrar providers de upload**
- [ ] **Aplicar para src, logoUrl, imageUrl, etc.**

### **2.4. AnimationPreviewEditor - Animações com Preview**
- [ ] **Criar componente AnimationPreviewEditor**
  - [ ] Select com opções de animação
  - [ ] Preview box com animação em loop
  - [ ] Controles de duração/delay
  - [ ] Checkbox para enable/disable
- [ ] **Integrar ao propertyEditors.tsx**
- [ ] **Aplicar para animationType**

---

## 🎨 PRIORIDADE BAIXA - UX E VALIDAÇÃO (Sprint 3)

### **3.1. Sistema de Tooltips Inteligentes**
- [ ] **Criar componente PropertyTooltip**
  - [ ] Base de dados de descrições por propriedade
  - [ ] Examples contextuais
  - [ ] Links para propriedades relacionadas
  - [ ] Screenshots quando aplicável
- [ ] **Integrar a todos os editores**
- [ ] **Criar banco de conteúdo de help**

### **3.2. Validação Visual em Tempo Real**
- [ ] **Criar wrapper ValidatedPropertyField**
  - [ ] Estados de validação (valid, invalid, loading)
  - [ ] Mensagens de erro contextual
  - [ ] Ícones de status
  - [ ] Highlighting visual
- [ ] **Implementar validações por tipo**
  - [ ] Regex para text inputs
  - [ ] Range validation para números
  - [ ] URL validation para links
  - [ ] Required field validation
- [ ] **Debounce para performance**

### **3.3. Preview em Tempo Real**
- [ ] **Implementar preview sistema**
  - [ ] Preview component mini
  - [ ] Update em tempo real
  - [ ] Toggle para show/hide preview
  - [ ] Responsive preview (mobile/tablet/desktop)
- [ ] **Integrar aos editores complexos**

---

## 🚀 IMPLEMENTAÇÃO STEP-BY-STEP

### **PASSO 1: Preparar useUnifiedProperties.ts**

```typescript
// Adicionar ao useUnifiedProperties.ts - quiz-intro-header

// ✅ ESTILOS PREDOMINANTES - Melhorar descriptions
createProperty(
  'showPrimaryStyleName',
  currentBlock?.properties?.showPrimaryStyleName ?? false,
  PropertyType.SWITCH,
  'Mostrar Nome do Estilo Predominante',
  PropertyCategory.BEHAVIOR,
  { 
    description: 'Exibe o nome do estilo calculado (ex: "Romântico Clássico") no header do resultado',
    conditional: { key: 'enableProgressBar', value: true }
  }
),

createProperty(
  'showPrimaryStyleImage',
  currentBlock?.properties?.showPrimaryStyleImage ?? false,
  PropertyType.SWITCH,
  'Mostrar Imagem do Estilo',
  PropertyCategory.BEHAVIOR,
  { 
    description: 'Exibe a imagem representativa do estilo predominante ao lado do título',
    conditional: { key: 'showPrimaryStyleName', value: true }
  }
),

// ✅ PROPRIEDADES DE SISTEMA - Tornar editáveis
createProperty(
  'contentMaxWidth',
  currentBlock?.properties?.contentMaxWidth || '800px',
  PropertyType.SELECT,
  'Largura Máxima do Conteúdo',
  PropertyCategory.LAYOUT,
  { 
    options: [
      { value: '600px', label: '600px (Compacto)' },
      { value: '800px', label: '800px (Padrão)' },
      { value: '1000px', label: '1000px (Largo)' },
      { value: '1200px', label: '1200px (Extra Largo)' },
      { value: '100%', label: '100% (Tela Cheia)' },
    ],
    description: 'Define a largura máxima do container de conteúdo do header'
  }
),

createProperty(
  'progressHeight',
  currentBlock?.properties?.progressHeight || 4,
  PropertyType.RANGE,
  'Altura da Barra de Progresso',
  PropertyCategory.STYLE,
  { 
    min: 2, 
    max: 20, 
    step: 1, 
    unit: 'px',
    description: 'Altura em pixels da barra de progresso quando habilitada',
    conditional: { key: 'enableProgressBar', value: true }
  }
),
```

### **PASSO 2: Criar BoxModelEditor.tsx**

```typescript
// Criar /src/components/editor/properties/core/BoxModelEditor.tsx

interface BoxModelEditorProps extends PropertyEditorProps {
  type: 'margin' | 'padding';
}

const BoxModelEditor: React.FC<BoxModelEditorProps> = ({ 
  property, 
  onChange,
  type = 'margin' 
}) => {
  // Get individual values or use current single value for all sides
  const currentValue = property.value || 0;
  const [values, setValues] = useState({
    top: currentValue,
    right: currentValue, 
    bottom: currentValue,
    left: currentValue,
  });
  const [isLinked, setIsLinked] = useState(true);
  const [unit, setUnit] = useState<'px' | 'rem' | '%'>('px');
  
  const updateValue = (side: keyof typeof values, newValue: number) => {
    if (isLinked) {
      // Update all sides
      const allSides = { top: newValue, right: newValue, bottom: newValue, left: newValue };
      setValues(allSides);
      onChange(property.key, newValue); // For backward compatibility with single value
    } else {
      // Update only this side  
      const newValues = { ...values, [side]: newValue };
      setValues(newValues);
      onChange(property.key, newValues); // Pass object with all sides
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{property.label}</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLinked(!isLinked)}
            className={`h-6 w-6 p-0 ${isLinked ? 'text-blue-600' : 'text-gray-400'}`}
          >
            {isLinked ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
          </Button>
          <Select value={unit} onValueChange={(u: any) => setUnit(u)}>
            <SelectTrigger className="w-16 h-6 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">px</SelectItem>
              <SelectItem value="rem">rem</SelectItem>
              <SelectItem value="%">%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Visual Box Model */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border">
        <div className="relative border-2 border-dashed border-gray-300 rounded p-4">
          
          {/* Top */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Input
              type="number"
              value={values.top}
              onChange={(e) => updateValue('top', Number(e.target.value))}
              className="w-16 h-8 text-xs text-center"
              min={type === 'margin' ? -100 : 0}
              max={100}
            />
          </div>
          
          {/* Right */}
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
            <Input
              type="number"
              value={values.right}
              onChange={(e) => updateValue('right', Number(e.target.value))}
              className="w-16 h-8 text-xs text-center"
              min={type === 'margin' ? -100 : 0}
              max={100}
            />
          </div>
          
          {/* Bottom */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <Input
              type="number"
              value={values.bottom}
              onChange={(e) => updateValue('bottom', Number(e.target.value))}
              className="w-16 h-8 text-xs text-center"
              min={type === 'margin' ? -100 : 0}
              max={100}
            />
          </div>
          
          {/* Left */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
            <Input
              type="number"
              value={values.left}
              onChange={(e) => updateValue('left', Number(e.target.value))}
              className="w-16 h-8 text-xs text-center"
              min={type === 'margin' ? -100 : 0}
              max={100}
            />
          </div>
          
          {/* Content Box */}
          <div className="bg-white border border-gray-400 rounded p-6 text-center text-sm text-gray-600 min-h-[60px] flex items-center justify-center">
            Content Area
            <br />
            <span className="text-xs text-gray-400">
              {type === 'margin' ? 'Margin' : 'Padding'}: {
                isLinked ? 
                `${values.top}${unit}` : 
                `${values.top}${unit} ${values.right}${unit} ${values.bottom}${unit} ${values.left}${unit}`
              }
            </span>
          </div>
        </div>
      </div>
      
      {/* Quick Presets */}
      <div className="flex gap-2 text-xs">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => updateValue('top', 0)}
          className="h-6 px-2"
        >
          Reset
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => updateValue('top', 8)}
          className="h-6 px-2"
        >
          Small (8px)
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => updateValue('top', 16)}
          className="h-6 px-2"
        >
          Medium (16px)
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => updateValue('top', 24)}
          className="h-6 px-2"
        >
          Large (24px)
        </Button>
      </div>
    </div>
  );
};

export default BoxModelEditor;
```

### **PASSO 3: Atualizar propertyEditors.tsx**

```typescript
// Adicionar ao propertyEditors.tsx

import BoxModelEditor from './BoxModelEditor';

// Dispatcher especializado para propriedades de espaçamento
const SpacingEditor: React.FC<PropertyEditorProps> = (props) => {
  const key = props.property.key.toLowerCase();
  
  // Detect margin/padding patterns
  if (key.includes('margin')) {
    return <BoxModelEditor {...props} type="margin" />;
  }
  
  if (key.includes('padding')) {
    return <BoxModelEditor {...props} type="padding" />;
  }
  
  // Fallback to range editor
  return <RangeEditor {...props} />;
};

// Atualizar o dispatcher principal
export const pickPropertyEditor = (property: any) => {
  const type = String(property?.type ?? 'text');
  const key = String(property?.key ?? '').toLowerCase();
  
  // Spacing properties
  if (key.includes('margin') || key.includes('padding')) {
    return SpacingEditor;
  }
  
  // Arrays
  if (type === 'array') {
    if (key === 'options') return OptionsArrayEditor;
    return ArrayJsonEditor;
  }
  
  // Objects  
  if (type === 'object' || type === 'json') {
    if (key.includes('border')) return BorderEditor;
    if (key.includes('background')) return BackgroundEditor;
    if (key === 'scoreValues') return ScoreValuesEditor; // New!
    return type === 'json' ? JsonEditor : ObjectEditor;
  }
  
  // Upload
  if (type === 'upload') return UploadEditor;
  
  // Range with special cases
  if (type === 'range') {
    if (key === 'progressHeight') return ProgressHeightEditor; // New!
    return RangeEditor;
  }
  
  // Default registry
  return propertyEditors[type] || TextEditor;
};
```

### **PASSO 4: Testar e Validar**

- [ ] **Testar quiz-intro-header** com novas propriedades
- [ ] **Testar BoxModelEditor** com margins/paddings
- [ ] **Testar validação** de propriedades obrigatórias
- [ ] **Testar performance** com muitas propriedades
- [ ] **Testar responsividade** do painel

---

## ⚡ COMANDOS RÁPIDOS PARA IMPLEMENTAÇÃO

### **Criar arquivos necessários:**
```bash
# Criar editores especializados
touch src/components/editor/properties/core/BoxModelEditor.tsx
touch src/components/editor/properties/core/GridLayoutEditor.tsx  
touch src/components/editor/properties/core/EnhancedUploadEditor.tsx
touch src/components/editor/properties/core/AnimationPreviewEditor.tsx
touch src/components/editor/properties/core/ScoreValuesEditor.tsx

# Criar utilitários
touch src/components/editor/properties/core/PropertyTooltip.tsx
touch src/components/editor/properties/core/ValidatedPropertyField.tsx
touch src/components/editor/properties/core/helpContent.ts
```

### **Instalar dependências se necessário:**
```bash
npm install @radix-ui/react-tooltip lucide-react
npm install react-dropzone # Para upload drag & drop
npm install @cloudinary/react # Para integração Cloudinary
```

---

## 🎯 CRITÉRIOS DE SUCESSO

### **Funcionalidade:**
- [ ] ✅ **100% das propriedades** definidas são editáveis visualmente
- [ ] ✅ **Validação em tempo real** para todas propriedades obrigatórias  
- [ ] ✅ **Preview funcionamento** para propriedades visuais
- [ ] ✅ **Upload de arquivos** integrado e funcional

### **UX:**
- [ ] ✅ **Tooltips explicativos** para todas propriedades complexas
- [ ] ✅ **Feedback visual** para estados de validação
- [ ] ✅ **Navegação fluída** entre categorias
- [ ] ✅ **Busca funcionamento** em todas propriedades

### **Performance:**
- [ ] ✅ **Lazy loading** para editores complexos
- [ ] ✅ **Debounce adequado** para inputs de texto
- [ ] ✅ **Re-render otimizado** com React.memo
- [ ] ✅ **Memory leaks** zero após uso prolongado

### **Compatibilidade:**
- [ ] ✅ **Mobile responsive** para tablets
- [ ] ✅ **Keyboard navigation** completa  
- [ ] ✅ **Screen reader** compatibility
- [ ] ✅ **Browser compatibility** Chrome/Firefox/Safari

---

**Status:** ✅ **Pronto para implementação**  
**Próximo passo:** Começar Sprint 1 - Implementar gaps críticos  
**Estimativa:** 2-3 semanas para implementação completa
