# 📋 **ANÁLISE DO COMPONENTE DE OPÇÕES DAS QUESTÕES**

## 🔍 **ANÁLISE DO HTML FORNECIDO**

### **🏗️ Estrutura Identificada:**

#### **1. Container Principal:**
```html
<div class="grid grid-cols-2 gap-2" data-sentry-component="EditableOptions">
```

#### **2. Estrutura de Cada Opção:**
```html
<button class="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option border-zinc-200 bg-background hover:bg-primary hover:text-foreground px-4 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex h-auto py-2 flex-col items-center justify-start border drop-shadow-none option-button">
    
    <!-- Imagem da Opção -->
    <img src="..." alt="..." width="256" height="256" class="w-full rounded-t-md bg-white h-full">
    
    <!-- Conteúdo da Opção -->
    <div class="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
        <div class="break-words w-full custom-quill quill ql-editor quill-option text-centered mt-2">
            <p>A) <strong>Poucos detalhes</strong>, básico e prático.</p>
        </div>
    </div>
</button>
```

### **🎨 Características Visuais:**
- **Layout:** Grid 2 colunas com gap
- **Cada opção:** Botão vertical com imagem + texto
- **Imagem:** 256x256px, ocupando toda largura do botão
- **Texto:** HTML rico com formatação (strong, p)
- **Prefixos:** A), B), C), etc.
- **Hover:** Efeito de sombra e mudança de cor

---

## 🎯 **IMPLEMENTAÇÃO NECESSÁRIA**

### **1. ✅ Criar EditableOptionsGrid**

```tsx
interface EditableOptionsGridProps {
    options: Array<{
        id: string;
        text: string;
        prefix?: string; // A), B), C)
        image?: string;
    }>;
    selectedOptions?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    multiSelect?: boolean;
    maxSelections?: number;
    columns?: 1 | 2 | 3 | 4;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}
```

### **2. ✅ Estrutura do Componente:**

```tsx
return (
    <div className={`grid grid-cols-${columns} gap-2`}>
        {options.map((option, index) => (
            <button
                key={option.id}
                className="option border-zinc-200 bg-background hover:bg-primary hover:text-foreground px-4 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex h-auto py-2 flex-col items-center justify-start border drop-shadow-none option-button"
                onClick={() => handleOptionClick(option.id)}
            >
                {option.image && (
                    <img
                        src={option.image}
                        alt={option.text}
                        className="w-full rounded-t-md bg-white h-full"
                    />
                )}
                
                <div className="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
                    <div className="break-words w-full custom-quill quill ql-editor quill-option text-centered mt-2">
                        <p>
                            {option.prefix && <span>{option.prefix} </span>}
                            <span dangerouslySetInnerHTML={{ __html: option.text }} />
                        </p>
                    </div>
                </div>
            </button>
        ))}
    </div>
);
```

### **3. ✅ Propriedades Configuráveis:**

#### **Seção Layout:**
- **Número de Colunas:** 1, 2, 3, 4
- **Gap entre opções:** 1, 2, 4, 6, 8
- **Orientação das opções:** Vertical, Horizontal

#### **Seção Seleção:**
- **Tipo de seleção:** Única, Múltipla
- **Máximo de seleções:** 1-10
- **Mostrar prefixos:** A), B), C) ou 1), 2), 3)

#### **Seção Visual:**
- **Mostrar imagens:** Sim/Não
- **Tamanho das imagens:** Pequeno, Médio, Grande
- **Estilo dos botões:** Padrão, Outline, Ghost

#### **Seção Avançado:**
- **CSS personalizado:** Campo de texto
- **Classe adicional:** Campo de texto

---

## 🔧 **INTEGRAÇÃO COM O SISTEMA**

### **1. ✅ Adicionar ao ExtendedStepType:**
```tsx
type ExtendedStepType = QuizStep['type'] | 'header' | 'spacer' | 'advanced-options' | 'button' | 'script' | 'heading' | 'options-grid';
```

### **2. ✅ Adicionar à EditableQuizStep:**
```tsx
} | {
    type: 'options-grid';
    options?: Array<{
        id: string;
        text: string;
        prefix?: string;
        image?: string;
    }>;
    selectedOptions?: string[];
    multiSelect?: boolean;
    maxSelections?: number;
    columns?: 1 | 2 | 3 | 4;
    gap?: number;
    showImages?: boolean;
    showPrefixes?: boolean;
    buttonStyle?: 'default' | 'outline' | 'ghost';
}
```

### **3. ✅ Adicionar ao createBlankStep:**
```tsx
case 'options-grid':
    return {
        id: baseId,
        type: 'options-grid',
        options: [
            { id: 'opt-1', text: '<strong>Opção A</strong>, descrição da opção.', prefix: 'A)', image: '' },
            { id: 'opt-2', text: '<strong>Opção B</strong>, descrição da opção.', prefix: 'B)', image: '' },
            { id: 'opt-3', text: '<strong>Opção C</strong>, descrição da opção.', prefix: 'C)', image: '' },
            { id: 'opt-4', text: '<strong>Opção D</strong>, descrição da opção.', prefix: 'D)', image: '' }
        ],
        selectedOptions: [],
        multiSelect: true,
        maxSelections: 3,
        columns: 2,
        gap: 2,
        showImages: true,
        showPrefixes: true,
        buttonStyle: 'default'
    };
```

### **4. ✅ Renderização no Switch:**
```tsx
case 'options-grid':
    return (
        <WrapperComponent blockId={`${step.id}-options-grid`} label="Grade de Opções" isEditable={isEditMode}>
            <EditableOptionsGrid
                options={(step as any).options || []}
                selectedOptions={(step as any).selectedOptions || []}
                multiSelect={(step as any).multiSelect !== false}
                maxSelections={(step as any).maxSelections || 3}
                columns={(step as any).columns || 2}
                isEditable={false}
                onEdit={(field, value) => updateStep(step.id, { [field]: value })}
                onSelectionChange={(selected) => updateStep(step.id, { selectedOptions: selected })}
            />
        </WrapperComponent>
    );
```

---

## 🎨 **PAINEL DE PROPRIEDADES**

### **Seção Layout:**
```tsx
<div className="space-y-3 p-3 bg-gray-50 rounded border">
    <h4 className="text-xs font-semibold text-gray-700">Layout</h4>
    
    <div>
        <label>Colunas</label>
        <select value={columns} onChange={e => updateStep(id, { columns: parseInt(e.target.value) })}>
            <option value={1}>1 Coluna</option>
            <option value={2}>2 Colunas</option>
            <option value={3}>3 Colunas</option>
            <option value={4}>4 Colunas</option>
        </select>
    </div>
    
    <div>
        <label>Espaçamento</label>
        <input type="range" min="1" max="8" value={gap} onChange={e => updateStep(id, { gap: parseInt(e.target.value) })} />
    </div>
</div>
```

### **Seção Opções:**
```tsx
<div className="space-y-3 p-3 bg-gray-50 rounded border">
    <h4 className="text-xs font-semibold text-gray-700">Opções</h4>
    
    {options.map((option, index) => (
        <div key={option.id} className="border rounded p-2">
            <input 
                placeholder="Texto da opção"
                value={option.text}
                onChange={e => updateOption(index, 'text', e.target.value)}
            />
            <input 
                placeholder="URL da imagem"
                value={option.image}
                onChange={e => updateOption(index, 'image', e.target.value)}
            />
            <button onClick={() => removeOption(index)}>Remover</button>
        </div>
    ))}
    
    <button onClick={addOption}>+ Adicionar Opção</button>
</div>
```

---

## 🎯 **COMPATIBILIDADE COM DADOS EXISTENTES**

### **Migração Automática:**
```tsx
// Converter opções existentes do quiz para o novo formato
const migrateToOptionsGrid = (step: QuizStep) => {
    if (step.type === 'question' && step.options) {
        return {
            ...step,
            components: [
                {
                    id: `${step.id}-options-grid`,
                    type: 'options-grid',
                    options: step.options.map((opt, index) => ({
                        id: opt.id,
                        text: opt.text,
                        prefix: `${String.fromCharCode(65 + index)})`, // A), B), C)
                        image: opt.image || ''
                    })),
                    selectedOptions: [],
                    multiSelect: step.requiredSelections > 1,
                    maxSelections: step.requiredSelections || 3,
                    columns: 2,
                    showImages: true,
                    showPrefixes: true
                }
            ]
        };
    }
    return step;
};
```

---

## 🏆 **RESULTADO ESPERADO**

### **Componente Final:**
- ✅ **Grade responsiva** com 1-4 colunas
- ✅ **Opções clicáveis** com imagem + texto HTML
- ✅ **Seleção múltipla/única** configurável
- ✅ **Prefixos automáticos** (A), B), C)
- ✅ **Edição via Painel** com gerenciamento completo de opções
- ✅ **Compatibilidade** com dados existentes do quiz

### **UX Aprimorada:**
- ✅ **Interface visual** idêntica ao modelo original
- ✅ **Configuração intuitiva** via painel de propriedades
- ✅ **Reutilização** em diferentes tipos de questões
- ✅ **Performance otimizada** com componente dedicado

---

**Status:** 📋 **ANÁLISE COMPLETA - PRONTO PARA IMPLEMENTAÇÃO**  
**Próximos Passos:** Criar componente EditableOptionsGrid e integrar ao sistema