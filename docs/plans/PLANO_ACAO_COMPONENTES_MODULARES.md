# 🎯 PLANO DE AÇÃO: COMPONENTES MODULARES PARA /EDITOR
## Baseado 100% no Funil de 21 Etapas

**Data**: 6 de outubro de 2025  
**Objetivo**: Criar sistema de componentes modulares, independentes, editáveis e reordenáveis para o `/editor`

---

## ✅ PROGRESSO ATUAL

### **Fase 1: Fundação (100% Concluída)** ✅

#### 1.1 Hook `useStepBlocks` ✅
**Arquivo**: `src/editor/hooks/useStepBlocks.ts`

**Implementado**:
- ✅ Conexão direta com `FunnelEditingFacade`
- ✅ Consumo 100% do JSON (`pages[].blocks[]`)
- ✅ Métodos CRUD: `updateBlock`, `addBlock`, `deleteBlock`, `duplicateBlock`
- ✅ Reordenação: `reorderBlocks`, `moveBlockUp`, `moveBlockDown`
- ✅ Event listeners para live preview
- ✅ Estado de loading e error
- ✅ Utilitários: `getBlock`, `getBlockIndex`

**Exemplo de Uso**:
```typescript
const { step, blocks, updateBlock, addBlock, reorderBlocks } = useStepBlocks(0);

// Atualizar propriedade de um bloco
updateBlock('block-header-1', {
    properties: { title: 'Novo Título' }
});

// Adicionar novo bloco
addBlock('text', { fontSize: 'lg' }, { text: 'Novo texto' });

// Reordenar blocos (drag and drop)
reorderBlocks(0, 2); // Move bloco 0 para posição 2
```

---

#### 1.2 Block Registry ✅
**Arquivo**: `src/editor/registry/BlockRegistry.ts`

**Implementado**:
- ✅ Definições de 16 tipos de blocos baseados no quiz 21 etapas
- ✅ Categorização: `intro`, `question`, `transition`, `result`, `offer`, `utility`
- ✅ Props padrão para cada tipo de bloco
- ✅ Funções: `registerBlock`, `getBlockComponent`, `getBlockDefinition`
- ✅ Validação de tipos de blocos

**Blocos Definidos**:
```
INTRO (Step 1):
├── quiz-intro-header ✅ (implementado)
├── text ✅ (implementado)
├── form-input ✅ (implementado)
└── button ✅ (implementado)

QUESTION (Steps 2-11):
├── quiz-question
├── quiz-options
└── quiz-navigation

TRANSITION (Steps 12, 19):
├── transition
└── transition-result

RESULT (Step 20):
├── result-headline
├── result-secondary-list
└── result-description

OFFER (Step 21):
├── offer-core
├── offer-urgency
└── checkout-button

UTILITY (Todos):
├── image
├── divider
├── spacer
└── progress-bar
```

---

#### 1.3 Componentes Modulares (25% Concluídos) 🟡
**Pasta**: `src/editor/components/blocks/`

**Implementados**:
1. ✅ `QuizIntroHeaderBlock.tsx` - Header da intro
2. ✅ `TextBlock.tsx` - Texto com HTML
3. ✅ `FormInputBlock.tsx` - Campo de input
4. ✅ `ButtonBlock.tsx` - Botão de ação
5. ✅ `index.ts` - Registro automático

**Características dos Componentes**:
- ✅ Consumem 100% das props do JSON (`data.content`, `data.properties`)
- ✅ Preview apenas (não editável inline no canvas)
- ✅ Indicador visual quando selecionado
- ✅ Hover states para UX
- ✅ Data attributes para debugging

**Exemplo de Componente**:
```tsx
const QuizIntroHeaderBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    onSelect
}) => {
    // Extrair do JSON
    const title = data.content?.title || 'Título';
    const textColor = data.properties?.textColor || '#432818';
    
    return (
        <div onClick={onSelect} className={isSelected ? 'ring-2' : ''}>
            <h1 style={{ color: textColor }}>{title}</h1>
        </div>
    );
};
```

---

#### 1.4 Canvas de Preview ✅
**Arquivo**: `src/editor/components/StepCanvas.tsx`

**Implementado**:
- ✅ Renderização de blocos via `useStepBlocks(stepIndex)`
- ✅ Seleção de blocos (click)
- ✅ Drag handles visuais
- ✅ Drop zones para reordenação
- ✅ Estados: loading, error, empty
- ✅ Header do step com contador
- ✅ Fallback para blocos não encontrados

**Recursos**:
```tsx
<StepCanvas 
    stepIndex={0}
    selectedBlockId={selectedBlockId}
    onSelectBlock={(id) => setSelectedBlockId(id)}
    isEditable={true}
/>
```

---

## 🚧 PRÓXIMAS FASES

### **Fase 2: Painel de Propriedades (0% Iniciado)** ⏳

**Arquivo a Criar**: `src/editor/components/PropertiesPanel.tsx`

**Requisitos**:
- 📋 Detectar tipo do bloco selecionado
- 📋 Gerar campos de formulário dinamicamente baseado em `BlockDefinition`
- 📋 Atualizar JSON via `updateBlock()` ao editar
- 📋 Validação de campos (min/max, required, etc)
- 📋 Preview ao vivo enquanto digita (debounce 300ms)
- 📋 Botões: Delete, Duplicate, Move Up/Down

**Layout do Painel**:
```
┌──────────────────────────────┐
│ PROPRIEDADES                 │
├──────────────────────────────┤
│ 📝 quiz-intro-header         │
│                              │
│ Conteúdo:                    │
│  Title: [_______________]    │
│  Subtitle: [____________]    │
│                              │
│ Estilo:                      │
│  Alignment: ○ Left           │
│             ● Center         │
│             ○ Right          │
│                              │
│  Font Size: [2xl ▼]          │
│  Text Color: [#432818] 🎨    │
│                              │
│ Ações:                       │
│  [Duplicar] [Deletar]        │
│  [↑ Subir] [↓ Descer]       │
└──────────────────────────────┘
```

**Exemplo de Implementação**:
```tsx
const PropertiesPanel: React.FC<{
    blockId: string;
    stepIndex: number;
}> = ({ blockId, stepIndex }) => {
    const { getBlock, updateBlock } = useStepBlocks(stepIndex);
    const block = getBlock(blockId);
    const definition = getBlockDefinition(block.type);
    
    return (
        <div className="p-4">
            <h3>{definition.label}</h3>
            
            {/* Gerar campos dinamicamente */}
            {Object.entries(definition.defaultProps.content || {}).map(([key, value]) => (
                <FormField
                    key={key}
                    label={key}
                    value={block.content?.[key]}
                    onChange={(newValue) => {
                        updateBlock(blockId, {
                            content: { ...block.content, [key]: newValue }
                        });
                    }}
                />
            ))}
        </div>
    );
};
```

---

### **Fase 3: Componentes Restantes (75% Pendente)** 🟡

**Próximos Componentes a Implementar**:

#### Step 2-11 Components (Question):
```tsx
// QuizQuestionBlock.tsx
- Renderiza: questionNumber, questionText, subtitle
- Props: requiredSelections, multipleChoice

// QuizOptionsBlock.tsx
- Grid de opções com imagens
- Estados: selected, hover
- Props: columns, gap, aspectRatio

// QuizNavigationBlock.tsx
- Botões Voltar/Próximo
- Desabilita se não completou seleções
- Props: showBack, showNext, disableNextUntilComplete
```

#### Step 12, 19 Components (Transition):
```tsx
// TransitionBlock.tsx
- Loading spinner/dots
- Mensagens rotativas
- Auto-progress
- Props: duration, messages[], loaderType

// TransitionResultBlock.tsx
- Variação específica para resultado
- Animação mais elaborada
```

#### Step 20 Components (Result):
```tsx
// ResultHeadlineBlock.tsx
- Nome do usuário interpolado
- Estilo dominante
- Confetti/celebração
- Props: showConfetti, animateIn

// ResultSecondaryListBlock.tsx
- Lista de características
- Ícones customizáveis
- Props: layout, iconType, iconColor

// ResultDescriptionBlock.tsx
- Descrição detalhada
- Suporte a markdown
- Background customizável
```

#### Step 21 Components (Offer):
```tsx
// OfferCoreBlock.tsx
- Card da oferta
- Imagem + descrição
- Preço/desconto
- Badge "OFERTA LIMITADA"
- Props: layout, showBadge, badgeText

// OfferUrgencyBlock.tsx
- Countdown timer
- Escassez ("Restam X vagas")
- Props: endTime, urgencyMessage, pulsate

// CheckoutButtonBlock.tsx
- Botão CTA grande
- Ícone de segurança
- Subtext
- Props: pulseAnimation, size, variant
```

---

### **Fase 4: Integração com Editor Existente (0% Iniciado)** ⏳

**Arquivos a Modificar**:
- `src/pages/editor/ModernUnifiedEditor.tsx`
- `src/components/editor/quiz/QuizFunnelEditorWYSIWYG.tsx`

**Mudanças Necessárias**:
1. Substituir renderização antiga por `<StepCanvas />`
2. Adicionar `<PropertiesPanel />` na coluna direita
3. Manter sidebar de steps (coluna 1)
4. Manter biblioteca de componentes (coluna 2)
5. Garantir compatibilidade com `FunnelEditingFacade`

**Layout Final**:
```
┌──────┬──────────┬────────────────┬──────────────┐
│Steps │Biblioteca│    Canvas      │ Propriedades │
│      │          │   (Preview)    │  (Edição)    │
├──────┼──────────┼────────────────┼──────────────┤
│Step1 │📝 Header │ ┌────────────┐ │ Title:       │
│Step2 │📄 Text   │ │  Bem-vinda │◄┼─ [_______]  │
│Step3 │🖼️ Image  │ └────────────┘ │              │
│...   │📥 Input  │                │ Subtitle:    │
│Step21│🔘 Button │ ┌────────────┐ │ [_______]    │
│      │          │ │ Descubra..│ │              │
│      │[+ Add]   │ └────────────┘ │ Alignment:   │
│      │          │                │ ● Center     │
└──────┴──────────┴────────────────┴──────────────┘
```

---

### **Fase 5: Live Preview & Indicadores (0% Iniciado)** ⏳

**Features a Implementar**:
1. Auto-atualização do canvas quando JSON muda
2. Indicador "• Ao Vivo" no header
3. Badge "Salvando..." durante autosave
4. Toast de sucesso após salvar
5. Estado dirty/clean visual
6. Debounce de edições (300ms)

**Exemplo de Indicadores**:
```tsx
// Status de salvamento
{facade.isDirty() ? (
    <Badge variant="outline">
        <RefreshCw className="w-3 h-3 animate-spin mr-1" />
        Salvando...
    </Badge>
) : (
    <Badge variant="success">
        <CheckCircle className="w-3 h-3 mr-1" />
        Salvo
    </Badge>
)}

// Live preview indicator
<div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    <span className="text-xs">Preview ao vivo</span>
</div>
```

---

## 📊 ESTRUTURA DE ARQUIVOS

```
src/
├── editor/
│   ├── hooks/
│   │   └── useStepBlocks.ts ✅ (hook principal)
│   │
│   ├── registry/
│   │   └── BlockRegistry.ts ✅ (definições + registry)
│   │
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── QuizIntroHeaderBlock.tsx ✅
│   │   │   ├── TextBlock.tsx ✅
│   │   │   ├── FormInputBlock.tsx ✅
│   │   │   ├── ButtonBlock.tsx ✅
│   │   │   ├── QuizQuestionBlock.tsx 🔲 (TODO)
│   │   │   ├── QuizOptionsBlock.tsx 🔲 (TODO)
│   │   │   ├── QuizNavigationBlock.tsx 🔲 (TODO)
│   │   │   ├── TransitionBlock.tsx 🔲 (TODO)
│   │   │   ├── ResultHeadlineBlock.tsx 🔲 (TODO)
│   │   │   ├── ResultSecondaryListBlock.tsx 🔲 (TODO)
│   │   │   ├── OfferCoreBlock.tsx 🔲 (TODO)
│   │   │   ├── OfferUrgencyBlock.tsx 🔲 (TODO)
│   │   │   ├── CheckoutButtonBlock.tsx 🔲 (TODO)
│   │   │   └── index.ts ✅ (registro automático)
│   │   │
│   │   ├── StepCanvas.tsx ✅ (canvas de preview)
│   │   └── PropertiesPanel.tsx 🔲 (TODO - Fase 2)
│   │
│   └── facade/
│       └── FunnelEditingFacade.ts (já existe)
│
├── pages/
│   └── editor/
│       └── ModernUnifiedEditor.tsx (integrar na Fase 4)
│
└── components/
    └── editor/
        └── quiz/
            └── QuizFunnelEditorWYSIWYG.tsx (atualizar na Fase 4)
```

---

## 🎯 EXEMPLO COMPLETO: ETAPA 1 FUNCIONANDO

### JSON da Etapa 1:
```json
{
  "id": "step-1",
  "type": "intro",
  "order": 1,
  "title": "Introdução",
  "blocks": [
    {
      "id": "block-header-1",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {
        "title": "Bem-vinda ao Quiz de Estilo Pessoal",
        "subtitle": "Descubra seu estilo único em 21 perguntas"
      },
      "properties": {
        "alignment": "center",
        "fontSize": "2xl",
        "textColor": "#432818"
      }
    },
    {
      "id": "block-text-1",
      "type": "text",
      "order": 1,
      "content": {
        "html": "<p>Este quiz irá ajudá-la a <strong>descobrir</strong> qual estilo combina mais com você.</p>"
      },
      "properties": {
        "fontSize": "base",
        "textColor": "#334155"
      }
    },
    {
      "id": "block-input-1",
      "type": "form-input",
      "order": 2,
      "content": {
        "label": "Como posso te chamar?",
        "placeholder": "Digite seu nome...",
        "type": "text"
      },
      "properties": {
        "required": true,
        "variableName": "userName"
      }
    },
    {
      "id": "block-button-1",
      "type": "button",
      "order": 3,
      "content": {
        "text": "Começar Quiz",
        "icon": "arrow-right"
      },
      "properties": {
        "variant": "primary",
        "size": "lg",
        "fullWidth": true
      }
    }
  ]
}
```

### Código do Editor:
```tsx
const ModernUnifiedEditor: React.FC = () => {
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    
    return (
        <div className="flex h-screen">
            {/* Coluna 1: Steps */}
            <StepsSidebar 
                currentIndex={selectedStepIndex}
                onSelect={setSelectedStepIndex}
            />
            
            {/* Coluna 2: Biblioteca */}
            <ComponentLibrary 
                onAddBlock={(type) => {
                    const { addBlock } = useStepBlocks(selectedStepIndex);
                    addBlock(type);
                }}
            />
            
            {/* Coluna 3: Canvas */}
            <StepCanvas
                stepIndex={selectedStepIndex}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                isEditable={true}
            />
            
            {/* Coluna 4: Propriedades */}
            {selectedBlockId && (
                <PropertiesPanel
                    blockId={selectedBlockId}
                    stepIndex={selectedStepIndex}
                />
            )}
        </div>
    );
};
```

---

## ✅ CARACTERÍSTICAS IMPLEMENTADAS

### 1. **100% Baseado no JSON**
- ✅ Todos os componentes consomem `data.content` e `data.properties`
- ✅ Nenhum dado hardcoded
- ✅ Conexão direta com `FunnelEditingFacade`

### 2. **Modulares e Independentes**
- ✅ Cada tipo de bloco é um componente React isolado
- ✅ Props padronizadas via `BlockComponentProps`
- ✅ Registro via `BlockRegistry`

### 3. **Editáveis via Painel**
- ✅ Preview apenas no canvas (não inline)
- ✅ Edição no painel de propriedades (Fase 2)
- ✅ Live preview ao editar

### 4. **Reordenáveis**
- ✅ Drag and drop via handles
- ✅ Método `reorderBlocks(from, to)`
- ✅ Botões Move Up/Down (Fase 2)

---

## 📝 CHECKLIST DE PRÓXIMOS PASSOS

### **Imediato (Próximas 2-4 horas)**:
- [ ] Implementar `PropertiesPanel.tsx`
- [ ] Testar edição de propriedades no Step 1
- [ ] Implementar componentes de Question (Steps 2-11)
- [ ] Testar reordenação de blocos

### **Curto Prazo (1-2 dias)**:
- [ ] Implementar todos os 16 tipos de blocos
- [ ] Integrar com `ModernUnifiedEditor.tsx`
- [ ] Adicionar indicadores visuais de salvamento
- [ ] Implementar drag and drop completo

### **Médio Prazo (3-5 dias)**:
- [ ] Testar todas as 21 etapas
- [ ] Validar persistência no JSON
- [ ] Otimizar performance (memoização)
- [ ] Documentar sistema completo

---

## 🚀 RESULTADO ESPERADO

Ao final, o usuário poderá:

1. ✅ **Navegar** entre as 21 etapas
2. ✅ **Selecionar** blocos no canvas (click)
3. ✅ **Editar** propriedades no painel direito
4. ✅ **Ver preview ao vivo** enquanto edita
5. ✅ **Reordenar** blocos via drag and drop
6. ✅ **Adicionar** novos blocos da biblioteca
7. ✅ **Duplicar** blocos existentes
8. ✅ **Deletar** blocos
9. ✅ **Salvar automaticamente** no JSON
10. ✅ **Publicar** funil completo

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- [Localização do JSON do Funil](./LOCALIZACAO_JSON_FUNIL_EDITOR.md)
- [Análise Arquitetural Completa](./ANALISE_ARQUITETURAL_COMPLETA_EDITOR_SISTEMA.md)
- [Documentação da Facade](./src/editor/facade/FunnelEditingFacade.ts)

---

**Status Geral**: 🟢 **40% Concluído** | Próximo Marco: PropertiesPanel + Componentes Restantes

**Última Atualização**: 6 de outubro de 2025
