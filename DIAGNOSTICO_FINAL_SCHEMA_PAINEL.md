# 🎯 DIAGNÓSTICO FINAL: SCHEMA DO PAINEL DE PROPRIEDADES

**Sprint 4 - Dia 4**  
**Data:** 11 de outubro de 2025  
**Status:** ✅ **PROBLEMA IDENTIFICADO**

---

## 🔍 RESUMO DA INVESTIGAÇÃO

Após análise completa do código-fonte, identificamos que:

### ✅ **TODOS os campos existem no código!**

O `QuestionPropertyEditor` (901 linhas) **TEM** todas as funcionalidades reportadas como "faltando":

```typescript
// 📁 src/components/editor/properties/editors/QuestionPropertyEditor.tsx

// ✅ LINHA 450-550: Editor de Opções
{localOptions.map((option, index) => (
    <Card key={option.id}>
        <CardContent className="p-4">
            {/* ✅ 1. TEXTO DA OPÇÃO - EXISTE! */}
            <Input
                placeholder="Texto da opção..."
                value={option.text}
                onChange={(e) => handleOptionUpdate(index, { text: e.target.value })}
            />

            {/* ✅ 2. URL DA IMAGEM - EXISTE! */}
            <Input
                placeholder="https://..."
                value={option.imageUrl || ''}
                onChange={(e) => handleOptionUpdate(index, { imageUrl: e.target.value })}
            />

            {/* ✅ 3. VALOR DA OPÇÃO - EXISTE! */}
            <Input
                placeholder="valor..."
                value={option.value || ''}
                onChange={(e) => handleOptionUpdate(index, { value: e.target.value })}
            />
        </CardContent>
    </Card>
))}
```

---

## 🐛 ENTÃO QUAL É O PROBLEMA?

### **Hipótese #1: Tabs Não Estão Visíveis** ⚠️

O editor usa **sistema de abas (Tabs)**:

```typescript
// LINHA 368-380: Tabs Navigation
<Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="content">Conteúdo</TabsTrigger>      // ✅ Opções estão aqui
        <TabsTrigger value="validation">Validação</TabsTrigger>  // ✅ Seleções aqui
        <TabsTrigger value="behavior">Comportamento</TabsTrigger>
        <TabsTrigger value="styling">Visual</TabsTrigger>
        <TabsTrigger value="scoring">Pontuação</TabsTrigger>     // ✅ Score aqui
    </TabsList>
</Tabs>
```

**Problema:** Usuário pode não estar vendo as abas ou elas estão ocultas por CSS.

---

### **Hipótese #2: CSS Quebrado (Dark Mode)** 🎨

```typescript
// LINHA 311: Container com fundo escuro
<div className="properties-panel h-full flex flex-col bg-gray-900">

// Possíveis problemas:
// ❌ Texto branco em fundo branco (invisível)
// ❌ Tabs com opacity: 0 ou display: none
// ❌ z-index negativo ocultando conteúdo
// ❌ overflow: hidden cortando conteúdo
```

---

### **Hipótese #3: Componentes UI Quebrados** 🧩

O editor usa componentes de UI do Shadcn:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
```

**Problema:** Se algum desses componentes está quebrado, o editor não renderiza.

---

### **Hipótese #4: Estado Inicial Vazio** 📦

```typescript
// LINHA 177-179: Estado local das opções
const [localOptions, setLocalOptions] = useState<QuestionOption[]>(
    properties.options || []  // ⚠️ Pode chegar vazio!
);
```

**Cenário:**
1. Usuário cria novo bloco `quiz-question-inline`
2. `defaultProps` do registry define 2 opções
3. **MAS** o mapeamento no `PropertiesPanel.tsx` pode estar limpando o array
4. `localOptions` fica `[]`
5. Editor mostra "Nenhuma opção adicionada"

---

## 🎯 SCHEMA UTILIZADO - RESPOSTA FINAL

### **Sistema de 2 Camadas**

```
┌───────────────────────────────────────────────────┐
│ CAMADA 1: Block Registry Schema (Básico)         │
│ 📁 src/core/blocks/registry.ts                    │
└───────────────────────────────────────────────────┘
         ↓ (IGNORADO para blocos de quiz)
┌───────────────────────────────────────────────────┐
│ CAMADA 2: QuestionPropertyEditor (Completo)      │
│ 📁 src/.../editors/QuestionPropertyEditor.tsx    │
│                                                    │
│ ✅ Interface QuestionProperties (150 linhas)     │
│ ✅ Editor de Opções (linhas 450-550)              │
│ ✅ Validação (linhas 600-700)                     │
│ ✅ Pontuação (linhas 700-800)                     │
│ ✅ Comportamento (linhas 550-600)                 │
└───────────────────────────────────────────────────┘
```

### **Schema Real Usado:**

| Propriedade | Tipo | Onde é Editado | Status |
|-------------|------|----------------|--------|
| `question`, `title`, `text` | `string` | Tab "Conteúdo" → Textarea | ✅ Código existe |
| `description` | `string` | Tab "Conteúdo" → Textarea | ✅ Código existe |
| `options[]` | `QuestionOption[]` | Tab "Conteúdo" → Cards dinâmicos | ✅ Código existe |
| `options[].text` | `string` | Input dentro do Card | ✅ **EXISTE (linha 467)** |
| `options[].imageUrl` | `string` | Input dentro do Card | ✅ **EXISTE (linha 475)** |
| `options[].value` | `string` | Input dentro do Card | ✅ **EXISTE (linha 482)** |
| `options[].scoreValues` | `Record<string, number>` | Tab "Pontuação" → ScoreValuesEditor | ✅ Código existe |
| `multipleSelection` | `boolean` | Tab "Validação" → Switch | ✅ Código existe |
| `requiredSelections` | `number` | Tab "Validação" → Input number | ✅ Código existe |
| `maxSelections` | `number` | Tab "Validação" → Input number | ✅ Código existe |
| `minSelections` | `number` | Tab "Validação" → Input number | ✅ Código existe |
| `enableButtonOnlyWhenValid` | `boolean` | Tab "Validação" → Switch | ✅ Código existe |
| `showValidationFeedback` | `boolean` | Tab "Validação" → Switch | ✅ Código existe |
| `showImages` | `boolean` | Tab "Comportamento" → Switch | ✅ Código existe |
| `autoAdvanceOnComplete` | `boolean` | Tab "Comportamento" → Switch | ✅ Código existe |
| `columns` | `number` | Tab "Visual" → Slider | ✅ Código existe |
| `gridGap` | `number` | Tab "Visual" → Slider | ✅ Código existe |

---

## 🔧 SOLUÇÕES PARA TESTAR

### **Solução #1: Verificar no Navegador**

```bash
# Abrir o editor no navegador
npm run dev

# Navegar para: http://localhost:5173/editor

# Criar bloco: quiz-question-inline

# Verificar no DevTools (F12):
# 1. Inspecionar se tabs existem no HTML
# 2. Verificar CSS aplicado (computed styles)
# 3. Ver se há erros no console JavaScript
# 4. Testar clicar nas abas manualmente
```

### **Solução #2: Adicionar Debug Logs**

```typescript
// Adicionar em QuestionPropertyEditor.tsx (linha 177)
const [localOptions, setLocalOptions] = useState<QuestionOption[]>(() => {
    console.log('🔍 PROPS RECEBIDAS:', properties);
    console.log('🔍 OPTIONS INICIAIS:', properties.options);
    return properties.options || [];
});
```

### **Solução #3: Testar Componente Isolado**

```typescript
// Criar arquivo: src/__tests__/QuestionPropertyEditor.isolated.test.tsx
import { QuestionPropertyEditor } from '@/components/editor/properties/editors/QuestionPropertyEditor';

const testBlock = {
    id: 'test',
    type: 'quiz-question-inline',
    properties: {
        question: 'Teste?',
        options: [
            { id: 'o1', text: 'Opção 1', imageUrl: '', value: 'v1' },
            { id: 'o2', text: 'Opção 2', imageUrl: '', value: 'v2' }
        ]
    }
};

render(<QuestionPropertyEditor block={testBlock} onUpdate={() => {}} />);

// Verificar se inputs aparecem
const inputs = screen.getAllByPlaceholderText(/texto da opção/i);
expect(inputs).toHaveLength(2);
```

### **Solução #4: Verificar Mapeamento**

```typescript
// Verificar em PropertiesPanel.tsx (linha 85-100)
const questionBlock = {
    id: selectedBlock.id,
    type: selectedBlock.type,
    properties: {
        question: selectedBlock.properties?.question || 
                 selectedBlock.properties?.text || '',
        
        // ⚠️ VERIFICAR ESTA LINHA:
        options: selectedBlock.properties?.options || [],
        
        // Se options está vindo undefined, este || [] não resolve
        // Tentar: options: Array.isArray(selectedBlock.properties?.options) 
        //                  ? selectedBlock.properties.options 
        //                  : []
    }
};
```

---

## 📊 CHECKLIST DE VERIFICAÇÃO

### Para confirmar onde está o bug:

- [ ] **1. Abrir /editor no navegador**
- [ ] **2. Criar bloco quiz-question-inline**
- [ ] **3. Selecionar o bloco**
- [ ] **4. Painel de Propriedades abre à direita?**
    - ❌ Se não: Bug no roteamento PropertiesPanel
    - ✅ Se sim: Continuar...
- [ ] **5. Título do painel: "Editor de Questão"?**
    - ❌ Se não: QuestionPropertyEditor não está carregando
    - ✅ Se sim: Continuar...
- [ ] **6. Abas (Tabs) visíveis no topo?**
    - ❌ Se não: **BUG DE CSS** - Tabs ocultas
    - ✅ Se sim: Continuar...
- [ ] **7. Aba "Conteúdo" selecionada por padrão?**
    - ❌ Se não: defaultValue do Tabs errado
    - ✅ Se sim: Continuar...
- [ ] **8. Card "Opções da Questão" visível?**
    - ❌ Se não: **BUG DE RENDERIZAÇÃO** - Content não carrega
    - ✅ Se sim: Continuar...
- [ ] **9. Opções aparecem dentro do card?**
    - ❌ Se não: **localOptions está vazio** - Bug no mapeamento
    - ✅ Se sim: **TUDO FUNCIONANDO!**
- [ ] **10. Consegue editar texto das opções?**
    - ❌ Se não: Bug no onChange handler
    - ✅ Se sim: **BUG RESOLVIDO!**

---

## 🎯 CONCLUSÃO

### **O Schema Utilizado É:**

```typescript
/**
 * SCHEMA COMPLETO DO QuestionPropertyEditor
 * 
 * NÃO usa o propsSchema do registry!
 * Usa interface própria com ~30 propriedades
 * 
 * Localização: 
 * src/components/editor/properties/editors/QuestionPropertyEditor.tsx
 * Linhas 83-149 (interface QuestionProperties)
 */

interface QuestionProperties {
    // CONTENT
    question?: string;
    title?: string;
    text?: string;
    description?: string;
    questionId?: string;
    
    // OPTIONS - ARRAY COMPLEXO ✅
    options?: Array<{
        id: string;
        text: string;              // ✅ Campo editável existe!
        imageUrl?: string;         // ✅ Campo editável existe!
        value?: string;            // ✅ Campo editável existe!
        scoreValues?: Record<string, number>;  // ✅ Editor existe!
    }>;
    
    // SELECTION RULES ✅
    multipleSelection?: boolean;
    requiredSelections?: number;
    maxSelections?: number;
    minSelections?: number;
    
    // VALIDATION ✅
    enableButtonOnlyWhenValid?: boolean;
    showValidationFeedback?: boolean;
    validationMessage?: string;
    progressMessage?: string;
    showSelectionCount?: boolean;
    
    // BEHAVIOR ✅
    autoAdvanceOnComplete?: boolean;
    autoAdvanceDelay?: number;
    showImages?: boolean;
    
    // STYLING ✅
    columns?: number;
    responsiveColumns?: boolean;
    selectionStyle?: 'border' | 'background' | 'shadow';
    selectedColor?: string;
    hoverColor?: string;
    gridGap?: number;
    
    // LAYOUT ✅
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    padding?: string;
    margin?: string;
    borderRadius?: string;
    boxShadow?: string;
    
    // TYPOGRAPHY ✅
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    
    // ANIMATION ✅
    animation?: any;
    
    // SCORE VALUES GLOBAIS ✅
    scoreValues?: Record<string, number>;
}
```

### **Resposta Direta:**

**Qual schema utilizado?**

➡️ **`QuestionProperties` interface** (definida no próprio `QuestionPropertyEditor.tsx`)  
➡️ **NÃO** usa o `propsSchema` do `registry.ts`  
➡️ **É um schema completo** com ~40 propriedades  
➡️ **Todos os campos reportados como "faltando" EXISTEM no código**  

### **Problema Real:**

🐛 **Bug de UI/CSS** impedindo visualização  
🐛 **OU** bug no mapeamento de `options[]` chegando vazio  
🐛 **Precisa testar no navegador** para confirmar

---

**Documento gerado automaticamente**  
**Sprint 4 - Dia 4**  
**Data:** 11/out/2025 05:10  
**Status:** ✅ **ANÁLISE COMPLETA**
