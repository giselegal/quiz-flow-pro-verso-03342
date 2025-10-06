# 🎨 COMO FUNCIONAM OS COMPONENTES MODULARES POR ETAPA

## 🎯 CONCEITO PRINCIPAL

Cada `EditableQuizStep` tem **propriedades** (title, subtitle, questionText, options, etc).

Vamos **DECOMPOR** essas propriedades em **blocos modulares visuais** que o usuário pode:
- ✅ Ver no canvas (preview)
- ✅ Selecionar clicando
- ✅ Editar no painel de propriedades (direita)
- ✅ Reordenar com drag & drop

---

## 📊 MAPEAMENTO: STEP → BLOCOS MODULARES

### **STEP 1: INTRO** (`type: 'intro'`)

```typescript
// Estrutura do step no banco
{
    id: "intro-1",
    type: "intro",
    title: "Descubra Seu Estilo em 2 Minutos! ✨",
    subtitle: "Quiz personalizado e gratuito",
    description: "Responda 10 perguntas rápidas...",
    image: "/images/intro-bg.jpg",
    buttonText: "Começar Agora",
    buttonColor: "#FF6B9D"
}

// ↓ DECOMPOR EM BLOCOS ↓

CANVAS RENDERIZA:
┌─────────────────────────────────────────┐
│ 📝 BLOCO 1: QuizIntroHeaderBlock        │
│    - Propriedades: title, subtitle      │
│    - Editável: ✅ (clique → painel)     │
│                                         │
│ [Descubra Seu Estilo em 2 Minutos! ✨] │
│ [Quiz personalizado e gratuito]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📄 BLOCO 2: TextBlock                   │
│    - Propriedades: description          │
│    - Editável: ✅                       │
│                                         │
│ [Responda 10 perguntas rápidas...]     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🖼️ BLOCO 3: ImageBlock                  │
│    - Propriedades: image                │
│    - Editável: ✅                       │
│                                         │
│ [        PREVIEW DA IMAGEM       ]     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔘 BLOCO 4: ButtonBlock                 │
│    - Propriedades: buttonText, color    │
│    - Editável: ✅                       │
│                                         │
│ [    🚀 Começar Agora    ]              │
└─────────────────────────────────────────┘
```

---

### **STEP 2-11: QUESTION** (`type: 'question'`)

```typescript
// Estrutura do step
{
    id: "q1",
    type: "question",
    questionText: "Qual seu estilo preferido?",
    image: "/images/q1.jpg",
    options: [
        { id: "opt1", text: "Casual", value: "casual", points: 10 },
        { id: "opt2", text: "Elegante", value: "elegant", points: 20 },
        { id: "opt3", text: "Esportivo", value: "sport", points: 15 }
    ]
}

// ↓ DECOMPOR EM BLOCOS ↓

┌─────────────────────────────────────────┐
│ ❓ BLOCO 1: QuizQuestionHeaderBlock     │
│    - Propriedades: questionText         │
│                                         │
│ [Qual seu estilo preferido?]           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🖼️ BLOCO 2: ImageBlock                  │
│    - Propriedades: image                │
│                                         │
│ [     IMAGEM DA PERGUNTA     ]         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ☑️ BLOCO 3: QuizOptionsBlock            │
│    - Propriedades: options[]            │
│    - SUB-BLOCOS (cada option):          │
│                                         │
│    ○ Casual                             │
│    ○ Elegante                           │
│    ○ Esportivo                          │
└─────────────────────────────────────────┘
```

---

### **STEP 12-18: STRATEGIC QUESTION** (`type: 'strategic-question'`)

```typescript
// Similar a question, mas com campos extras
{
    id: "sq1",
    type: "strategic-question",
    questionText: "Qual seu maior desafio?",
    description: "Isso nos ajuda a personalizar...",
    options: [...],
    leadCapture: true  // Campo especial
}

// ↓ BLOCOS ↓

┌─────────────────────────────────────────┐
│ 🎯 QuizStrategicQuestionBlock           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 📄 TextBlock (description)              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ ☑️ QuizOptionsBlock                     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 📧 FormInputBlock (se leadCapture)      │
└─────────────────────────────────────────┘
```

---

### **STEP 19: RESULT** (`type: 'result'`)

```typescript
{
    id: "result",
    type: "result",
    resultTitle: "Seu Perfil: Elegante Clássico! 👗",
    resultDescription: "Você valoriza sofisticação...",
    image: "/results/elegant.jpg",
    cta: {
        text: "Ver Recomendações",
        action: "next"
    }
}

// ↓ BLOCOS ↓

┌─────────────────────────────────────────┐
│ 🏆 ResultHeadlineBlock                  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 📄 ResultDescriptionBlock               │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 🖼️ ImageBlock                           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 🔘 ButtonBlock (CTA)                    │
└─────────────────────────────────────────┘
```

---

### **STEP 20: OFFER** (`type: 'offer'`)

```typescript
{
    id: "offer",
    type: "offer",
    offerTitle: "Oferta Exclusiva Para Você! 🎁",
    offerDescription: "Kit completo de styling...",
    price: "R$ 197,00",
    discount: "50% OFF",
    urgency: "Apenas 3 vagas restantes!",
    image: "/offers/kit.jpg",
    ctaText: "Quero Garantir Minha Vaga"
}

// ↓ BLOCOS ↓

┌─────────────────────────────────────────┐
│ 💰 OfferHeaderBlock                     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 📄 OfferDescriptionBlock                │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 💵 PriceBlock                           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ ⏰ UrgencyBlock                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 🖼️ ImageBlock                           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 🔘 ButtonBlock (CTA)                    │
└─────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### **1. Converter Step → Blocos Virtuais**

```typescript
// src/editor/hooks/useStepToBlocks.ts

export function stepToBlocks(step: EditableQuizStep): VirtualBlock[] {
    const blocks: VirtualBlock[] = [];
    
    switch (step.type) {
        case 'intro':
            if (step.title || step.subtitle) {
                blocks.push({
                    id: `${step.id}-header`,
                    type: 'quiz-intro-header',
                    stepId: step.id,
                    properties: {
                        title: step.title,
                        subtitle: step.subtitle
                    }
                });
            }
            
            if (step.description) {
                blocks.push({
                    id: `${step.id}-description`,
                    type: 'text',
                    stepId: step.id,
                    properties: {
                        content: step.description
                    }
                });
            }
            
            if (step.image) {
                blocks.push({
                    id: `${step.id}-image`,
                    type: 'image',
                    stepId: step.id,
                    properties: {
                        src: step.image
                    }
                });
            }
            
            if (step.buttonText) {
                blocks.push({
                    id: `${step.id}-button`,
                    type: 'button',
                    stepId: step.id,
                    properties: {
                        text: step.buttonText,
                        color: step.buttonColor
                    }
                });
            }
            break;
            
        case 'question':
            blocks.push({
                id: `${step.id}-question`,
                type: 'quiz-question',
                stepId: step.id,
                properties: {
                    questionText: step.questionText
                }
            });
            
            if (step.options?.length) {
                blocks.push({
                    id: `${step.id}-options`,
                    type: 'quiz-options',
                    stepId: step.id,
                    properties: {
                        options: step.options
                    }
                });
            }
            break;
            
        // ... outros tipos
    }
    
    return blocks;
}
```

---

### **2. StepCanvas Renderiza Blocos**

```typescript
// src/editor/components/StepCanvas.tsx

const StepCanvas: React.FC<StepCanvasProps> = ({
    step,  // ← Recebe step completo agora
    selectedBlockId,
    onSelectBlock
}) => {
    // Converter step em blocos virtuais
    const blocks = useMemo(() => stepToBlocks(step), [step]);
    
    return (
        <div className="canvas-container">
            {blocks.map((block) => {
                const Component = getBlockComponent(block.type);
                
                return (
                    <div
                        key={block.id}
                        onClick={() => onSelectBlock(block.id)}
                        className={cn(
                            'block-wrapper',
                            selectedBlockId === block.id && 'ring-2 ring-blue-500'
                        )}
                    >
                        <Component
                            data={block.properties}
                            isSelected={selectedBlockId === block.id}
                            isEditable={false}  // Canvas = preview apenas
                        />
                    </div>
                );
            })}
        </div>
    );
};
```

---

### **3. PropertiesPanel Edita Step**

```typescript
// src/editor/components/PropertiesPanel.tsx

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    blockId,
    step,
    onUpdateStep
}) => {
    if (!blockId) return <EmptyState />;
    
    // Encontrar qual propriedade do step corresponde ao bloco
    const blockInfo = parseBlockId(blockId);  // Ex: "intro-1-header" → property: "title"
    
    const handleChange = (property: string, value: any) => {
        onUpdateStep(step.id, {
            [property]: value
        });
    };
    
    return (
        <div className="properties-panel">
            {blockInfo.type === 'quiz-intro-header' && (
                <>
                    <Input
                        label="Título"
                        value={step.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                    <Input
                        label="Subtítulo"
                        value={step.subtitle || ''}
                        onChange={(e) => handleChange('subtitle', e.target.value)}
                    />
                </>
            )}
            
            {blockInfo.type === 'text' && (
                <Textarea
                    label="Descrição"
                    value={step.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            )}
            
            {/* ... outros tipos */}
        </div>
    );
};
```

---

### **4. Fluxo Completo de Edição**

```
1. USUÁRIO CLICA NO BLOCO "TÍTULO" NO CANVAS
   ↓
2. StepCanvas chama: onSelectBlock('intro-1-header')
   ↓
3. ModularEditorLayout atualiza: setSelectedBlockId('intro-1-header')
   ↓
4. PropertiesPanel renderiza campos:
   - Input "Título" com valor atual
   - Input "Subtítulo" com valor atual
   ↓
5. USUÁRIO EDITA O TÍTULO
   ↓
6. PropertiesPanel chama: onUpdateStep('intro-1', { title: 'Novo título' })
   ↓
7. ModularEditorLayout atualiza state:
   setSteps(prev => prev.map(s => 
       s.id === 'intro-1' ? { ...s, title: 'Novo título' } : s
   ))
   ↓
8. StepCanvas RE-RENDERIZA automaticamente (React)
   ↓
9. USUÁRIO VÊ MUDANÇA AO VIVO NO CANVAS! ✨
```

---

## 🎨 VANTAGENS DESSA ABORDAGEM

✅ **Modulares**: Cada propriedade = 1 bloco visual independente  
✅ **Reutilizáveis**: Mesmo componente (TextBlock) usado em vários steps  
✅ **Editáveis**: Clica no canvas → edita no painel  
✅ **Live Preview**: Mudanças aparecem instantaneamente  
✅ **Tipo-Safe**: TypeScript valida todas as propriedades  
✅ **Escalável**: Adicionar novo step type = adicionar mapeamento  

---

## 📦 ESTRUTURA DE ARQUIVOS

```
src/editor/
├── hooks/
│   └── useStepToBlocks.ts        ← Converte step → blocos virtuais
│
├── components/
│   ├── StepCanvas.tsx            ← Renderiza blocos no canvas
│   ├── PropertiesPanel.tsx       ← Edita propriedades do step
│   └── ModularEditorLayout.tsx   ← Coordena tudo
│
└── components/blocks/
    ├── QuizIntroHeaderBlock.tsx  ← Componente visual
    ├── TextBlock.tsx
    ├── ImageBlock.tsx
    ├── ButtonBlock.tsx
    ├── QuizQuestionBlock.tsx
    ├── QuizOptionsBlock.tsx
    ├── ResultHeadlineBlock.tsx
    ├── OfferCoreBlock.tsx
    └── ... (16 componentes totais)
```

---

## 🚀 PRÓXIMO PASSO

Vou implementar:
1. ✅ `useStepToBlocks.ts` - Converter step → blocos
2. ✅ Atualizar `StepCanvas` - Receber step e renderizar blocos
3. ✅ Atualizar `PropertiesPanel` - Editar properties do step
4. ✅ Conectar tudo no `ModularEditorLayout`

**Isso vai fazer o canvas FINALMENTE renderizar os componentes modulares!** 🎉
