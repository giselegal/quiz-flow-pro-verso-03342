# 🔍 Diagnóstico: Informações Faltando no Painel de Propriedades

## 🎯 Problema Relatado

O usuário reporta que **faltam informações no Painel de Propriedades**, mesmo com:
- ✅ Código completo no `QuestionPropertyEditor.tsx` (linhas 450-550 têm editor de opções)
- ✅ Fluxo de dados funcionando corretamente (JSON → Service → Context → Props)
- ✅ Testes passando 100% (18/18 testes)

## 🔎 Possíveis Causas

### 1. **Bloco Selecionado Sem Properties Populadas**

**Problema:** O bloco pode ter sido criado sem o objeto `properties` inicial.

```typescript
// ❌ BLOCO SEM PROPERTIES
{
  id: "block-123",
  type: "quiz-question-inline",
  // properties: undefined ← PROBLEMA!
}

// ✅ BLOCO COM PROPERTIES VAZIAS
{
  id: "block-123",
  type: "quiz-question-inline",
  properties: {
    options: [],
    question: "",
    required: true
  }
}
```

**Onde verificar:**
```typescript
// QuizModularProductionEditor.tsx - Linha ~1920
<PropertiesPanel
  selectedBlock={selectedBlock}  // ← verificar se selectedBlock.properties existe
  onUpdate={(updates) => {...}}
/>
```

**Como testar:**
```typescript
// Adicionar no início do QuestionPropertyEditor.tsx
console.log('🔍 DEBUG selectedBlock:', block);
console.log('🔍 DEBUG block.properties:', block.properties);
console.log('🔍 DEBUG block.properties.options:', block.properties?.options);
```

---

### 2. **Renderização Condicional Escondendo Campos**

**Problema:** Os campos podem estar renderizados mas com `display: none` ou dentro de tabs não visíveis.

**Verificar no QuestionPropertyEditor.tsx:**

```typescript
// Linha ~260 - Sistema de Tabs
const [activeTab, setActiveTab] = useState<string>("general");

// ⚠️ Se activeTab !== "general", o editor de opções não aparece
{activeTab === "general" && (
  <Card>
    <CardHeader>
      <CardTitle>Opções da Questão</CardTitle>
    </CardHeader>
    {/* Editor de opções aqui */}
  </Card>
)}
```

**Possível causa:** Tab inicial não está sendo mostrada.

**Como verificar:**
1. Abrir DevTools
2. Inspecionar elemento do Painel de Propriedades
3. Procurar por tabs ou divs com `display: none`

---

### 3. **Conflito entre QuestionPropertyEditor e UnifiedProperties**

**Problema:** Há 2 sistemas rodando simultaneamente:

```typescript
// PropertiesPanel.tsx - Linha ~75
const isQuestionBlock = selectedBlock.type === 'quiz-question-inline';

if (isQuestionBlock) {
  return <QuestionPropertyEditor block={questionBlock} />;
}

// ⬇️ Se não cair no if, usa o sistema unificado
const { properties, updateProperty } = useUnifiedProperties(
  selectedBlock.type,
  selectedBlock.id,
  selectedBlock,
  onUpdate
);
```

**Verificar:**
- O tipo do bloco está sendo reconhecido corretamente?
- `isQuestionBlock` está retornando `true`?

**Como testar:**
```typescript
// Adicionar no PropertiesPanel.tsx - antes do if
console.log('🔍 selectedBlock.type:', selectedBlock.type);
console.log('🔍 isQuestionBlock:', isQuestionBlock);
```

---

### 4. **Adaptação de Dados Perdendo Informações**

**Problema:** A adaptação do bloco pode estar perdendo dados:

```typescript
// PropertiesPanel.tsx - Linha ~80
const questionBlock = {
  id: selectedBlock.id,
  type: selectedBlock.type,
  properties: {
    question: selectedBlock.properties?.question || selectedBlock.properties?.text || '',
    options: selectedBlock.properties?.options || [],
    // ... outros campos
    ...selectedBlock.properties  // ← Isso deveria preservar tudo
  },
  content: selectedBlock.content
};
```

**Verificar:**
- O spread `...selectedBlock.properties` está no final (correto)?
- As properties originais existem antes da adaptação?

---

### 5. **Estado Local Não Sincronizado**

**Problema:** O `QuestionPropertyEditor` usa estado local:

```typescript
// QuestionPropertyEditor.tsx - Linha ~180
const [localOptions, setLocalOptions] = useState<QuestionOption[]>([]);

useEffect(() => {
  if (block?.properties?.options) {
    setLocalOptions(block.properties.options);
  }
}, [block?.properties?.options]);
```

**Verificar:**
- O `useEffect` está sendo chamado?
- `block.properties.options` tem valor?

**Como testar:**
```typescript
useEffect(() => {
  console.log('🔍 useEffect chamado - options:', block?.properties?.options);
  if (block?.properties?.options) {
    setLocalOptions(block.properties.options);
  }
}, [block?.properties?.options]);
```

---

### 6. **Callback `onUpdate` Não Propagando Mudanças**

**Problema:** As mudanças feitas no painel podem não estar sendo salvas:

```typescript
// QuestionPropertyEditor.tsx
const handleOptionUpdate = (index: number, updates: Partial<QuestionOption>) => {
  const updated = [...localOptions];
  updated[index] = { ...updated[index], ...updates };
  setLocalOptions(updated);
  
  // ⚠️ Verifica se onUpdate existe e está sendo chamado
  onUpdate?.({ options: updated });
};
```

**Verificar:**
- `onUpdate` está definido?
- O callback chega até o `updateBlockProperties`?

---

## 🛠️ Plano de Debug

### Passo 1: Adicionar Logs no PropertiesPanel

```typescript
// PropertiesPanel.tsx - após linha 48
console.group('🔍 DEBUG PropertiesPanel');
console.log('selectedBlock:', selectedBlock);
console.log('selectedBlock.type:', selectedBlock?.type);
console.log('selectedBlock.properties:', selectedBlock?.properties);
console.log('isQuestionBlock:', isQuestionBlock);
console.groupEnd();
```

### Passo 2: Adicionar Logs no QuestionPropertyEditor

```typescript
// QuestionPropertyEditor.tsx - após linha 170
console.group('🔍 DEBUG QuestionPropertyEditor');
console.log('block:', block);
console.log('block.properties:', block.properties);
console.log('block.properties.options:', block.properties?.options);
console.log('localOptions:', localOptions);
console.groupEnd();
```

### Passo 3: Verificar Tabs

```typescript
// QuestionPropertyEditor.tsx - após linha 260
console.log('🔍 activeTab:', activeTab);
```

### Passo 4: Verificar onUpdate

```typescript
// QuestionPropertyEditor.tsx - em handleOptionUpdate
const handleOptionUpdate = (index: number, updates: Partial<QuestionOption>) => {
  console.log('🔍 handleOptionUpdate chamado:', { index, updates });
  const updated = [...localOptions];
  updated[index] = { ...updated[index], ...updates };
  setLocalOptions(updated);
  
  console.log('🔍 Chamando onUpdate com:', { options: updated });
  onUpdate?.({ options: updated });
};
```

---

## 🎯 Cenários Mais Prováveis

### **Cenário 1: Bloco Criado Sem Properties (80% probabilidade)**

```typescript
// Ao criar novo bloco, pode estar faltando:
const newBlock = {
  id: generateId(),
  type: 'quiz-question-inline',
  // properties: {} ← FALTA ISSO!
};

// SOLUÇÃO: Garantir properties ao criar
const newBlock = {
  id: generateId(),
  type: 'quiz-question-inline',
  properties: {
    question: '',
    options: [],
    required: true,
    multipleSelection: false,
    showImages: true
  }
};
```

**Onde corrigir:**
- `QuizModularProductionEditor.tsx` - função `addBlock()`
- `BlockRegistry.ts` - defaults do bloco

---

### **Cenário 2: Tab Sistema Escondendo Campos (15% probabilidade)**

```typescript
// Se o sistema de tabs estiver ativo mas escondido
// SOLUÇÃO: Verificar CSS ou remover tabs

// Remover sistema de tabs temporariamente:
// const [activeTab, setActiveTab] = useState<string>("general");

// Renderizar tudo direto sem tabs
```

---

### **Cenário 3: Tipo de Bloco Errado (5% probabilidade)**

```typescript
// Se block.type não for exatamente 'quiz-question-inline'
if (selectedBlock.type === 'quiz-question-inline') {
  // ← Pode não estar entrando aqui
  return <QuestionPropertyEditor />;
}

// SOLUÇÃO: Verificar tipos permitidos
const QUESTION_TYPES = [
  'quiz-question-inline',
  'quiz-question',
  'options-grid',
  'form-input'
];

if (QUESTION_TYPES.includes(selectedBlock.type)) {
  return <QuestionPropertyEditor />;
}
```

---

## 🔧 Correção Sugerida

Vou criar uma versão com debug ativado para identificar o problema:

```typescript
// 1. Adicionar no PropertiesPanel.tsx
if (isQuestionBlock) {
  // 🔍 DEBUG
  console.group('🔍 Roteando para QuestionPropertyEditor');
  console.log('selectedBlock completo:', selectedBlock);
  console.log('properties:', selectedBlock.properties);
  console.groupEnd();

  const questionBlock = {
    id: selectedBlock.id,
    type: selectedBlock.type,
    properties: {
      // ✅ Garantir defaults
      question: '',
      options: [],
      required: true,
      multipleSelection: false,
      showImages: true,
      // Sobrescrever com valores reais
      ...selectedBlock.properties
    },
    content: selectedBlock.content
  };

  return (
    <QuestionPropertyEditor
      block={questionBlock}
      onUpdate={(updates) => {
        console.log('🔍 onUpdate chamado com:', updates);
        if (onUpdate) {
          onUpdate(updates);
        }
      }}
      onDelete={onDelete}
      isPreviewMode={false}
    />
  );
}
```

---

## ✅ Próximos Passos

1. **Adicionar logs de debug** nos 3 pontos principais
2. **Abrir o editor** e selecionar um bloco quiz
3. **Verificar no Console** do navegador:
   - Se `selectedBlock.properties` existe
   - Se `localOptions` está populado
   - Se o roteamento está correto
4. **Inspecionar no DevTools** se os campos estão renderizados mas invisíveis
5. **Reportar os logs** encontrados para análise final

---

## 📊 Checklist de Verificação

- [ ] `selectedBlock` não é `null` ou `undefined`
- [ ] `selectedBlock.type` é `'quiz-question-inline'`
- [ ] `selectedBlock.properties` é um objeto (não `undefined`)
- [ ] `selectedBlock.properties.options` é um array
- [ ] `isQuestionBlock` retorna `true`
- [ ] `QuestionPropertyEditor` está sendo renderizado
- [ ] `localOptions` state está populado
- [ ] Tabs estão visíveis (se existirem)
- [ ] `onUpdate` callback está definido
- [ ] Console não mostra erros JavaScript

---

## 🎯 Conclusão Preliminar

Baseado na análise do código, o problema mais provável é:

**O bloco está sendo criado SEM o objeto `properties` inicial, então quando o `QuestionPropertyEditor` tenta acessar `block.properties.options`, retorna `undefined` e os campos não aparecem.**

**Solução rápida:**
Adicionar defaults de properties ao criar novos blocos de quiz.

**Solução robusta:**
Adicionar logs de debug e verificar todo o fluxo desde a criação até a renderização.
