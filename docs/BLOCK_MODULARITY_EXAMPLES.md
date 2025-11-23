# 🧩 Exemplos Práticos de Modularidade de Blocks

**Data:** 23 de Novembro de 2025  
**Versão:** 1.0

---

## 📋 ÍNDICE

1. [Estrutura de Blocks](#estrutura-de-blocks)
2. [Operações de Editor](#operações-de-editor)
3. [Exemplos de Uso Real](#exemplos-de-uso-real)
4. [API de Manipulação](#api-de-manipulação)
5. [Garantias de Modularidade](#garantias-de-modularidade)

---

## 1️⃣ ESTRUTURA DE BLOCKS

### Block Base

Cada block é um objeto JSON independente:

```typescript
interface Block {
  id: string;           // Identificador único (ex: "step-02-title")
  type: BlockType;      // Tipo do componente (ex: "question-title")
  order: number;        // Ordem de renderização (0, 1, 2, ...)
  properties: any;      // Props do componente React
  content: any;         // Dados específicos do block
  parentId?: string;    // ID do block pai (para hierarquia)
  metadata?: {          // Configurações do editor
    editable: boolean;
    reorderable: boolean;
    reusable: boolean;
    deletable: boolean;
  };
}
```

### Step com Blocks

```json
{
  "id": "step-02",
  "type": "question",
  "order": 2,
  "blocks": [
    {
      "id": "progress-bar-step-02",
      "type": "question-progress",
      "order": 0,
      "properties": { "padding": 8 },
      "content": { "stepNumber": 2, "totalSteps": 21 }
    },
    {
      "id": "step-02-title",
      "type": "question-title",
      "order": 1,
      "properties": { "padding": 16 },
      "content": { "text": "Pergunta 1 de 10" }
    },
    {
      "id": "step-02-options",
      "type": "options-grid",
      "order": 2,
      "properties": { "columns": 2, "gap": 16 },
      "content": { "options": [...], "minSelections": 3 }
    },
    {
      "id": "navigation-step-02",
      "type": "question-navigation",
      "order": 3,
      "properties": { "showBack": true },
      "content": { "nextLabel": "Avançar" }
    }
  ]
}
```

---

## 2️⃣ OPERAÇÕES DE EDITOR

### ➕ Adicionar Block

**Caso de uso:** Usuário clica em "Adicionar Texto" no editor

```typescript
function addBlock(step: QuizStep, blockType: BlockType): Block {
  const newBlock: Block = {
    id: `${step.id}-${blockType}-${Date.now()}`,
    type: blockType,
    order: step.blocks.length, // Adiciona no final
    properties: getDefaultProperties(blockType),
    content: getDefaultContent(blockType)
  };
  
  step.blocks.push(newBlock);
  return newBlock;
}

// Uso:
const textBlock = addBlock(step, 'text-inline');
// Resultado: Block com order=4 (após navigation)
```

### 🔄 Reordenar Blocks

**Caso de uso:** Usuário arrasta block para nova posição (drag-and-drop)

```typescript
function reorderBlock(
  step: QuizStep, 
  blockId: string, 
  newOrder: number
): void {
  const block = step.blocks.find(b => b.id === blockId);
  if (!block) return;
  
  const oldOrder = block.order;
  
  // Atualizar ordem do block movido
  block.order = newOrder;
  
  // Ajustar ordem dos outros blocks
  step.blocks.forEach(b => {
    if (b.id === blockId) return;
    
    if (newOrder < oldOrder) {
      // Moveu para cima
      if (b.order >= newOrder && b.order < oldOrder) {
        b.order += 1;
      }
    } else {
      // Moveu para baixo
      if (b.order > oldOrder && b.order <= newOrder) {
        b.order -= 1;
      }
    }
  });
  
  // Reordenar array
  step.blocks.sort((a, b) => a.order - b.order);
}

// Uso:
// ANTES: [progress(0), title(1), options(2), navigation(3)]
reorderBlock(step, 'navigation-step-02', 1);
// DEPOIS: [progress(0), navigation(1), title(2), options(3)]
```

### ✏️ Editar Block

**Caso de uso:** Usuário altera texto do título

```typescript
function updateBlock(
  step: QuizStep,
  blockId: string,
  updates: Partial<Block>
): Block | null {
  const index = step.blocks.findIndex(b => b.id === blockId);
  if (index < 0) return null;
  
  step.blocks[index] = {
    ...step.blocks[index],
    ...updates
  };
  
  return step.blocks[index];
}

// Uso:
updateBlock(step, 'step-02-title', {
  content: {
    ...step.blocks[1].content,
    text: 'Qual seu estilo preferido?'
  }
});
```

### 🗑️ Remover Block

**Caso de uso:** Usuário clica em "Deletar" no block

```typescript
function removeBlock(step: QuizStep, blockId: string): boolean {
  const initialLength = step.blocks.length;
  step.blocks = step.blocks.filter(b => b.id !== blockId);
  
  // Reajustar orders
  step.blocks.forEach((b, index) => {
    b.order = index;
  });
  
  return step.blocks.length < initialLength;
}

// Uso:
removeBlock(step, 'progress-bar-step-02');
// Resultado: Step sem barra de progresso
```

### 📋 Duplicar Block

**Caso de uso:** Usuário clica em "Duplicar" no block

```typescript
function duplicateBlock(step: QuizStep, blockId: string): Block | null {
  const original = step.blocks.find(b => b.id === blockId);
  if (!original) return null;
  
  const duplicate: Block = {
    ...JSON.parse(JSON.stringify(original)), // Deep clone
    id: `${original.id}-copy-${Date.now()}`,
    order: step.blocks.length // Adiciona no final
  };
  
  step.blocks.push(duplicate);
  return duplicate;
}

// Uso:
duplicateBlock(step, 'step-02-options');
// Resultado: Duas grids de opções idênticas
```

### 🔁 Reutilizar Block (entre steps)

**Caso de uso:** Usuário copia block de step-02 para step-03

```typescript
function copyBlockToStep(
  quiz: QuizSchema,
  sourceStepId: string,
  blockId: string,
  targetStepId: string
): Block | null {
  const sourceStep = quiz.steps.find(s => s.id === sourceStepId);
  const targetStep = quiz.steps.find(s => s.id === targetStepId);
  const block = sourceStep?.blocks.find(b => b.id === blockId);
  
  if (!block || !targetStep) return null;
  
  const reused: Block = {
    ...JSON.parse(JSON.stringify(block)),
    id: `${targetStepId}-${block.type}-${Date.now()}`,
    order: targetStep.blocks.length
  };
  
  targetStep.blocks.push(reused);
  return reused;
}

// Uso:
copyBlockToStep(quiz, 'step-02', 'step-02-title', 'step-03');
// Resultado: step-03 agora tem o mesmo título de step-02
```

---

## 3️⃣ EXEMPLOS DE USO REAL

### Exemplo 1: Remover Barra de Progresso

**Situação:** Cliente não quer mostrar progresso no quiz

```typescript
// ANTES
{
  "blocks": [
    { "id": "progress-bar-step-02", "type": "question-progress", "order": 0 },
    { "id": "step-02-title", "type": "question-title", "order": 1 },
    { "id": "step-02-options", "type": "options-grid", "order": 2 }
  ]
}

// AÇÃO
quiz.steps.forEach(step => {
  step.blocks = step.blocks.filter(b => b.type !== 'question-progress');
  step.blocks.forEach((b, i) => b.order = i); // Reajustar orders
});

// DEPOIS
{
  "blocks": [
    { "id": "step-02-title", "type": "question-title", "order": 0 },
    { "id": "step-02-options", "type": "options-grid", "order": 1 }
  ]
}
```

### Exemplo 2: Adicionar Texto Explicativo

**Situação:** Cliente quer adicionar instrução antes das opções

```typescript
// ANTES
{
  "blocks": [
    { "id": "step-02-title", "type": "question-title", "order": 0 },
    { "id": "step-02-options", "type": "options-grid", "order": 1 }
  ]
}

// AÇÃO
const instructionBlock: Block = {
  id: `step-02-instruction-${Date.now()}`,
  type: 'text-inline',
  order: 1, // Entre título e opções
  properties: {
    fontSize: '14px',
    color: '#666',
    padding: 8
  },
  content: {
    text: 'Selecione 3 opções que mais combinam com você'
  }
};

step.blocks.push(instructionBlock);
step.blocks.sort((a, b) => a.order - b.order);

// Reajustar orders subsequentes
step.blocks.forEach((b, i) => {
  if (i > 1) b.order = i;
});

// DEPOIS
{
  "blocks": [
    { "id": "step-02-title", "type": "question-title", "order": 0 },
    { "id": "step-02-instruction-...", "type": "text-inline", "order": 1 },
    { "id": "step-02-options", "type": "options-grid", "order": 2 }
  ]
}
```

### Exemplo 3: Reordenar para Navegação no Topo

**Situação:** Cliente quer botões no topo da página

```typescript
// ANTES
{
  "blocks": [
    { "id": "progress", "order": 0 },
    { "id": "title", "order": 1 },
    { "id": "options", "order": 2 },
    { "id": "navigation", "order": 3 }
  ]
}

// AÇÃO
reorderBlock(step, 'navigation', 0);

// DEPOIS (automático)
{
  "blocks": [
    { "id": "navigation", "order": 0 },  // ← Movido para topo
    { "id": "progress", "order": 1 },    // ← Ajustado +1
    { "id": "title", "order": 2 },       // ← Ajustado +1
    { "id": "options", "order": 3 }      // ← Ajustado +1
  ]
}
```

### Exemplo 4: Grid de 2 Colunas → 3 Colunas

**Situação:** Cliente quer mais opções por linha

```typescript
// ANTES
{
  "id": "step-02-options",
  "type": "options-grid",
  "properties": {
    "columns": 2,
    "gap": 16
  }
}

// AÇÃO
updateBlock(step, 'step-02-options', {
  properties: {
    ...block.properties,
    columns: 3
  }
});

// DEPOIS
{
  "id": "step-02-options",
  "type": "options-grid",
  "properties": {
    "columns": 3,  // ← Alterado
    "gap": 16
  }
}
```

### Exemplo 5: Reutilizar Header em Todos os Steps

**Situação:** Cliente quer mesmo header em todas as páginas

```typescript
// Step 1 tem header customizado
const headerBlock = step1.blocks.find(b => b.type === 'quiz-intro-header');

// Copiar para todos os outros steps
quiz.steps.slice(1).forEach(step => {
  const reused = {
    ...JSON.parse(JSON.stringify(headerBlock)),
    id: `${step.id}-header-${Date.now()}`,
    order: 0
  };
  
  // Inserir no início
  step.blocks.forEach(b => b.order += 1);
  step.blocks.unshift(reused);
});

// Resultado: Todos os steps têm o mesmo header
```

---

## 4️⃣ API DE MANIPULAÇÃO

### Block Manager Class

```typescript
export class BlockManager {
  private step: QuizStep;
  
  constructor(step: QuizStep) {
    this.step = step;
  }
  
  // CRUD Operations
  
  add(type: BlockType, content?: any): Block {
    const block: Block = {
      id: `${this.step.id}-${type}-${Date.now()}`,
      type,
      order: this.step.blocks.length,
      properties: {},
      content: content || {}
    };
    this.step.blocks.push(block);
    return block;
  }
  
  update(blockId: string, updates: Partial<Block>): Block | null {
    const index = this.step.blocks.findIndex(b => b.id === blockId);
    if (index < 0) return null;
    
    this.step.blocks[index] = {
      ...this.step.blocks[index],
      ...updates
    };
    return this.step.blocks[index];
  }
  
  remove(blockId: string): boolean {
    const initialLength = this.step.blocks.length;
    this.step.blocks = this.step.blocks.filter(b => b.id !== blockId);
    this.reorderAll();
    return this.step.blocks.length < initialLength;
  }
  
  duplicate(blockId: string): Block | null {
    const original = this.step.blocks.find(b => b.id === blockId);
    if (!original) return null;
    
    const duplicate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `${original.id}-copy-${Date.now()}`,
      order: this.step.blocks.length
    };
    this.step.blocks.push(duplicate);
    return duplicate;
  }
  
  // Reordering
  
  reorder(blockId: string, newOrder: number): void {
    const block = this.step.blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const oldOrder = block.order;
    block.order = newOrder;
    
    this.step.blocks.forEach(b => {
      if (b.id === blockId) return;
      
      if (newOrder < oldOrder) {
        if (b.order >= newOrder && b.order < oldOrder) {
          b.order += 1;
        }
      } else {
        if (b.order > oldOrder && b.order <= newOrder) {
          b.order -= 1;
        }
      }
    });
    
    this.step.blocks.sort((a, b) => a.order - b.order);
  }
  
  moveUp(blockId: string): boolean {
    const block = this.step.blocks.find(b => b.id === blockId);
    if (!block || block.order === 0) return false;
    
    this.reorder(blockId, block.order - 1);
    return true;
  }
  
  moveDown(blockId: string): boolean {
    const block = this.step.blocks.find(b => b.id === blockId);
    if (!block || block.order === this.step.blocks.length - 1) return false;
    
    this.reorder(blockId, block.order + 1);
    return true;
  }
  
  moveToTop(blockId: string): void {
    this.reorder(blockId, 0);
  }
  
  moveToBottom(blockId: string): void {
    this.reorder(blockId, this.step.blocks.length - 1);
  }
  
  // Utilities
  
  private reorderAll(): void {
    this.step.blocks.forEach((b, i) => b.order = i);
  }
  
  getById(blockId: string): Block | undefined {
    return this.step.blocks.find(b => b.id === blockId);
  }
  
  getByType(type: BlockType): Block[] {
    return this.step.blocks.filter(b => b.type === type);
  }
  
  getAll(): Block[] {
    return [...this.step.blocks].sort((a, b) => a.order - b.order);
  }
  
  count(): number {
    return this.step.blocks.length;
  }
  
  exists(blockId: string): boolean {
    return this.step.blocks.some(b => b.id === blockId);
  }
}

// Uso:
const manager = new BlockManager(step);

// Adicionar
const newBlock = manager.add('text-inline', { text: 'Hello' });

// Editar
manager.update(newBlock.id, { 
  content: { text: 'Hello World' } 
});

// Reordenar
manager.moveUp(newBlock.id);

// Duplicar
const copy = manager.duplicate(newBlock.id);

// Remover
manager.remove(copy.id);
```

---

## 5️⃣ GARANTIAS DE MODULARIDADE

### ✅ Checklist de Modularidade

- [x] **Blocks são objetos JSON simples** - Fácil serialização/deserialização
- [x] **Cada block tem ID único** - Identificação inequívoca
- [x] **Property `order` controla renderização** - Reordenação trivial
- [x] **Sem dependências entre blocks** - Podem existir independentemente
- [x] **CRUD completo via JSON** - Add/Update/Delete/Reorder
- [x] **Deep clone funciona** - Duplicação e reutilização simples
- [x] **Validação via Zod** - Type-safety garantida
- [x] **Editor visual não afeta estrutura** - JSON permanece clean

### 🔒 Princípios Preservados

1. **Single Responsibility** - Cada block tem uma única função
2. **Open/Closed** - Adicionar novos tipos de block sem modificar existentes
3. **Liskov Substitution** - Qualquer block pode ser substituído por outro
4. **Interface Segregation** - Cada block type tem sua própria interface
5. **Dependency Inversion** - Blocks não dependem de implementação concreta

### 📊 Comparação: Antes vs Depois da Consolidação

| Aspecto | Antes (212 arquivos) | Depois (1 arquivo) |
|---------|---------------------|-------------------|
| **Modularidade** | ✅ Sim | ✅ Sim (idêntica) |
| **Reordenação** | ✅ Via `order` | ✅ Via `order` |
| **Edição** | ✅ Alterar JSON | ✅ Alterar JSON |
| **Reutilização** | ✅ Copiar block | ✅ Copiar block |
| **Validação** | ❌ Apenas TS | ✅ Zod runtime |
| **Performance** | ❌ 212 requests | ✅ 1 request |
| **Manutenção** | ❌ Difícil | ✅ Fácil |

---

## 🚀 CONCLUSÃO

### A consolidação dos JSONs:

✅ **PRESERVA** - Estrutura de blocks  
✅ **PRESERVA** - Independência dos componentes  
✅ **PRESERVA** - Capacidade de reordenação  
✅ **PRESERVA** - Reutilização entre steps  
✅ **PRESERVA** - Editabilidade via JSON  

❌ **NÃO REMOVE** - Nenhuma funcionalidade  
❌ **NÃO QUEBRA** - Nenhuma operação existente  
❌ **NÃO LIMITA** - Nenhuma capacidade do editor  

✨ **ADICIONA** - Validação Zod  
✨ **ADICIONA** - Type-safety runtime  
✨ **MELHORA** - Performance (1 request vs 212)  
✨ **MELHORA** - Manutenibilidade  
✨ **MELHORA** - Developer Experience  

---

**Última atualização:** 23/11/2025  
**Autor:** GitHub Copilot + giselegal  
**Status:** ✅ Documentação completa
