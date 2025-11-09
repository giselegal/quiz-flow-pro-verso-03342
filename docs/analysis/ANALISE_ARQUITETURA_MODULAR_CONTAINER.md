# 🏗️ ANÁLISE: Modular como Container + BlockTypeRenderer

## 🎯 PROPOSTA

**Ideia:** Usar `ModularQuestionStep`, `ModularIntroStep`, etc. como **containers/orquestradores** que gerenciam apenas:
- DnD (arrastar/soltar blocos)
- Seleção de blocos
- Callbacks de edição
- Estrutura do step

E delegar a **renderização visual** dos blocos para `BlockTypeRenderer` (blocos atômicos do registry).

---

## 📊 SITUAÇÃO ATUAL

### ❌ **Arquitetura Atual (Problemática)**

```tsx
ModularQuestionStep
  ├─ DndContext + SortableContext ✅
  ├─ Lógica de navegação ✅
  ├─ Validação de respostas ✅
  └─ UI HARDCODED ❌
      ├─ <div>Barra de progresso</div>
      ├─ <div>Título da pergunta</div>
      ├─ <div>Grid de opções</div> (custom)
      └─ <button>Navegar</button>
```

**Problemas:**
1. ❌ UI hardcoded = difícil personalizar
2. ❌ Mistura de responsabilidades (container + renderização)
3. ❌ JSONs com tipos inventados (`question-hero`, `transition-hero`)
4. ❌ Blocos não são reutilizáveis entre steps
5. ❌ Não usa o sistema de registry de blocos

---

## ✅ PROPOSTA: Arquitetura "Container + Renderer"

### **Arquitetura Nova (Limpa)**

```tsx
ModularQuestionStep (CONTAINER)
  ├─ DndContext + SortableContext ✅
  ├─ Lógica de navegação ✅
  ├─ Validação de respostas ✅
  └─ RENDERIZAÇÃO DELEGADA ✅
      └─ blocks.map(block => 
            <BlockTypeRenderer 
              block={block}
              isEditable={isEditable}
              onSelect={onBlockSelect}
            />
          )
```

**JSON correspondente:**
```json
{
  "id": "step-02",
  "type": "question",
  "blocks": [
    { "type": "question-progress", "properties": {...} },
    { "type": "question-title", "properties": {...} },
    { "type": "options-grid", "properties": {...} },
    { "type": "question-navigation", "properties": {...} }
  ]
}
```

---

## ⚖️ PRÓS E CONTRAS

### ✅ **PRÓS (Benefícios)**

#### 1. **Separação Clara de Responsabilidades**
```
Container (ModularQuestionStep):
  - Gerencia estrutura do step
  - DnD, seleção, validação
  - Lógica de navegação
  - Estado local (respostas)

Renderer (BlockTypeRenderer):
  - Renderiza blocos individuais
  - Usa registry de blocos
  - Componentes reutilizáveis
```

#### 2. **Blocos Reutilizáveis**
- ✅ `options-grid` pode ser usado em question E strategic-question
- ✅ `question-progress` reutilizado em todos os steps de pergunta
- ✅ `cta-inline` reutilizado em transition E result

#### 3. **JSONs Padronizados**
- ✅ Todos os tipos vêm do registry (não inventados)
- ✅ Fácil validar (schema do registry)
- ✅ Consistência entre steps

#### 4. **Facilita Edição Visual**
- ✅ Painel de propriedades funciona automaticamente (registry)
- ✅ Adicionar/remover blocos fica mais simples
- ✅ Drag & drop entre steps funciona melhor

#### 5. **Manutenção Simplificada**
- ✅ Corrigir um bloco = corrige em todos os steps que o usam
- ✅ Adicionar novo tipo de bloco = automático via registry
- ✅ Menos código duplicado

#### 6. **Performance**
- ✅ BlockTypeRenderer já tem memoização
- ✅ Re-renders isolados por bloco
- ✅ Lazy loading de blocos funciona melhor

#### 7. **Escalabilidade**
- ✅ Adicionar novo step type = copiar container + definir blocos JSON
- ✅ Adicionar novo bloco = registrar uma vez, usar em qualquer step
- ✅ Customização por cliente = trocar blocos no JSON

---

### ❌ **CONTRAS (Desafios)**

#### 1. **Refatoração Grande** 🔴 **ALTO IMPACTO**
```diff
- 5 arquivos ModularXXXStep.tsx (~2500 linhas de UI hardcoded)
+ 5 arquivos ModularXXXStep.tsx (~500 linhas apenas container)
+ Migração de JSONs (21 steps)
+ Testes precisam ser refeitos
```
**Tempo estimado:** 2-3 dias de trabalho

#### 2. **Lógica Distribuída** 🟡 **MÉDIO IMPACTO**

**Antes (tudo em um lugar):**
```tsx
// ModularQuestionStep.tsx
const handleOptionClick = (id) => {
  // Lógica aqui, fácil debugar
}
return <div onClick={handleOptionClick}>...</div>
```

**Depois (dividido):**
```tsx
// ModularQuestionStep.tsx (container)
const handleOptionClick = useCallback((id) => {
  // Lógica aqui
}, []);

// BlockTypeRenderer.tsx
<OptionsGrid onOptionSelect={handleOptionClick} />

// OptionsGridBlock.tsx
<button onClick={() => onOptionSelect(id)}>
```

**Solução:** Callbacks bem definidos + documentação clara

#### 3. **Estado Compartilhado** 🟡 **MÉDIO IMPACTO**

Alguns blocos precisam de estado do container:

```tsx
// Container tem o estado
const [currentAnswers, setCurrentAnswers] = useState([]);

// Bloco precisa acessar/modificar
<BlockTypeRenderer 
  block={optionsBlock}
  // ❓ Como passar currentAnswers para options-grid?
  context={{ currentAnswers, onAnswersChange }}
/>
```

**Solução:** Props `context` ou `stepContext` no BlockTypeRenderer

#### 4. **Navegação/Callbacks Complexos** 🟡 **MÉDIO IMPACTO**

Alguns blocos precisam navegar (ex: botão "Próximo"):

```tsx
// question-navigation precisa:
- Validar se pode avançar
- Navegar para próximo step
- Aplicar lógica condicional (skipTo)
```

**Solução:** Callbacks padronizados (`onNext`, `onBack`, `onValidate`)

#### 5. **Tipos Legados nos JSONs** 🟢 **BAIXO IMPACTO**

Precisa mapear tipos antigos → novos:

```tsx
const TYPE_MIGRATION_MAP = {
  'question-hero': 'question-title',     // Renomear
  'transition-hero': 'transition-title', // Renomear
  'CTAButton': 'cta-inline',             // Renomear
};
```

**Solução:** Script de migração automático

#### 6. **Blocos Compostos** 🟡 **MÉDIO IMPACTO**

Alguns "blocos" são compostos:

```tsx
// "question-hero" na verdade é:
- question-title (título)
- question-text (subtítulo)
- question-image (imagem opcional)
```

**Solução:** 
- Opção A: Criar blocos individuais no JSON
- Opção B: Manter "hero" como bloco composto no registry

---

## 🏗️ ARQUITETURA DETALHADA

### **1. Container (ModularQuestionStep)**

```tsx
export default function ModularQuestionStep({
  data,
  blocks = [],      // ✅ Blocos do JSON/provider
  currentAnswers,
  onAnswersChange,
  isEditable,
  selectedBlockId,
  onBlockSelect,
  onBlocksReorder,
}) {
  // ✅ Gerencia lógica do step
  const [validationError, setValidationError] = useState(null);
  
  // ✅ Callbacks para blocos
  const stepContext = useMemo(() => ({
    currentAnswers,
    onAnswersChange,
    onNext: handleNext,
    onBack: handleBack,
    onValidate: validateAnswers,
  }), [currentAnswers, ...]);

  // ✅ DnD
  const handleDragEnd = (event) => {
    // Reordenar blocos
  };

  // ✅ Renderização DELEGADA
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map(b => b.id)}>
        {blocks.map(block => (
          <SortableBlock key={block.id} block={block}>
            <BlockTypeRenderer
              block={block}
              isEditable={isEditable}
              isSelected={block.id === selectedBlockId}
              onSelect={() => onBlockSelect(block.id)}
              context={stepContext} // ✅ Passa contexto
            />
          </SortableBlock>
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### **2. Renderer (BlockTypeRenderer)**

```tsx
export function BlockTypeRenderer({ 
  block, 
  isEditable, 
  onSelect,
  context, // ✅ Recebe contexto do container
}) {
  // ✅ Resolve componente do registry
  const Component = blockRegistry.get(block.type);
  
  if (!Component) {
    return <UnknownBlock type={block.type} />;
  }

  return (
    <Component
      {...block.properties}
      isEditable={isEditable}
      onSelect={onSelect}
      // ✅ Passa contexto para blocos que precisam
      context={context}
    />
  );
}
```

### **3. Bloco Individual (OptionsGridBlock)**

```tsx
export function OptionsGridBlock({
  options,
  isEditable,
  context, // ✅ Recebe do renderer
}) {
  const { currentAnswers, onAnswersChange } = context || {};

  const handleClick = (optionId) => {
    if (isEditable) return; // Não responde em modo edição
    onAnswersChange?.([...currentAnswers, optionId]);
  };

  return (
    <div className="options-grid">
      {options.map(opt => (
        <button 
          key={opt.id}
          onClick={() => handleClick(opt.id)}
          className={currentAnswers?.includes(opt.id) ? 'selected' : ''}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );
}
```

---

## 📋 PLANO DE MIGRAÇÃO

### **Fase 1: Preparação** (4h)
- [ ] Criar interface `StepContext` padronizada
- [ ] Atualizar `BlockTypeRenderer` para aceitar `context`
- [ ] Criar script de migração de tipos legados
- [ ] Documentar padrões de callbacks

### **Fase 2: Migração de Blocos** (8h)
- [ ] Migrar `question-hero` → blocos atômicos
- [ ] Migrar `transition-hero` → blocos atômicos
- [ ] Adicionar blocos faltantes ao registry
- [ ] Atualizar JSONs com script

### **Fase 3: Refatorar Containers** (12h)
- [ ] ModularQuestionStep (mais complexo)
- [ ] ModularTransitionStep
- [ ] ModularResultStep
- [ ] ModularIntroStep (já parcialmente correto)
- [ ] ModularOfferStep

### **Fase 4: Testes** (4h)
- [ ] Testar edição visual
- [ ] Testar navegação
- [ ] Testar DnD
- [ ] Testar preview

**TOTAL: ~28 horas (3-4 dias)**

---

## 🎯 RECOMENDAÇÃO

### ✅ **SIM, É VIÁVEL E RECOMENDADO!**

**Porque:**
1. ✅ Arquitetura limpa e escalável
2. ✅ Facilita manutenção futura
3. ✅ Blocos reutilizáveis
4. ✅ JSONs padronizados
5. ✅ Alinha com padrões de design (SRP, composição)

**MAS:**
- ⚠️ Requer refatoração significativa (~3 dias)
- ⚠️ Precisa migrar JSONs existentes
- ⚠️ Requer testes extensivos

---

## 🚀 ALTERNATIVA: Migração Gradual

Se não puder fazer tudo de uma vez:

### **Abordagem Híbrida**

1. **Manter containers atuais funcionando**
2. **Criar nova prop `useBlockRenderer`**
3. **Migrar step por step**

```tsx
function ModularQuestionStep({ useBlockRenderer = false, ... }) {
  if (useBlockRenderer) {
    // ✅ Nova arquitetura
    return renderWithBlockTypeRenderer();
  }
  
  // ❌ Arquitetura antiga (fallback)
  return renderLegacyUI();
}
```

**Vantagem:** Pode testar nova arquitetura sem quebrar existente

---

## 📊 RESUMO EXECUTIVO

| Critério | Avaliação | Nota |
|----------|-----------|------|
| **Viabilidade Técnica** | ✅ Totalmente viável | 9/10 |
| **Benefícios a Longo Prazo** | ✅ Muito alto | 10/10 |
| **Custo de Implementação** | ⚠️ Médio-Alto (3 dias) | 6/10 |
| **Risco** | 🟡 Médio (requer testes) | 7/10 |
| **ROI** | ✅ Alto | 9/10 |

### **Conclusão:** 
✅ **VALE A PENA!** A arquitetura proposta é superior e deve ser implementada, preferencialmente de forma gradual para reduzir riscos.

---

**Próximos Passos Sugeridos:**
1. Começar com **ModularIntroStep** (mais simples, já usa BlockTypeRenderer parcialmente)
2. Criar **script de migração de JSONs**
3. Documentar **padrão de StepContext**
4. Refatorar demais steps gradualmente
