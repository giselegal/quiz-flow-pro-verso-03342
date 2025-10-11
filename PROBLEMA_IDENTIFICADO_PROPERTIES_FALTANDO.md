# 🎯 PROBLEMA IDENTIFICADO: Propriedades Faltando no Painel

## ❌ Causa Raiz Encontrada

O bloco `quiz-question-inline` está sendo criado com **defaultProps incompletos** no registry, causando propriedades `undefined` no Painel de Propriedades.

---

## 🔍 Evidência do Problema

### Arquivo: `src/core/blocks/registry.ts` (Linhas 1203-1223)

```typescript
'quiz-question-inline': {
    type: 'quiz-question-inline',
    title: 'Pergunta de Quiz Inline',
    category: 'Quiz',
    icon: '💭',
    defaultProps: {
        title: 'Pergunta inline?',
        question: 'Pergunta inline?',
        options: [
            {
                id: 'opt-1',
                text: 'Sim',
                value: 'yes'
            },
            {
                id: 'opt-2',
                text: 'Não',
                value: 'no'
            }
        ],
        layout: 'horizontal',
        showImages: false
    },
    // ...
}
```

### ❌ **Propriedades Faltando:**

O `QuestionPropertyEditor` espera estas propriedades (linha ~150):

```typescript
interface QuestionProperties {
  question?: string;
  title?: string;
  description?: string;
  options?: QuestionOption[];          // ✅ Existe
  multipleSelection?: boolean;          // ❌ FALTA!
  requiredSelections?: number;          // ❌ FALTA!
  maxSelections?: number;               // ❌ FALTA!
  showImages?: boolean;                 // ✅ Existe (mas como false)
  columns?: number;                     // ❌ FALTA!
  required?: boolean;                   // ❌ FALTA!
  validation?: {                        // ❌ FALTA!
    enabled: boolean;
    message?: string;
  };
  scoring?: {                           // ❌ FALTA!
    enabled: boolean;
    type?: string;
  };
}
```

### 🔴 **Resultado:**

Quando o bloco é criado, ele fica assim:

```typescript
{
  id: "block-123",
  type: "quiz-question-inline",
  properties: {
    title: "Pergunta inline?",
    question: "Pergunta inline?",
    options: [...],
    layout: "horizontal",
    showImages: false
    // multipleSelection: undefined ← PROBLEMA!
    // required: undefined ← PROBLEMA!
    // validation: undefined ← PROBLEMA!
  }
}
```

Quando o `QuestionPropertyEditor` tenta renderizar:

```typescript
const {
  multipleSelection = false,  // ← pega 'false' do fallback
  required = true,             // ← pega 'true' do fallback
  validation = { enabled: false }, // ← cria objeto novo
  // ...
} = block.properties;
```

**Mas os campos controlados (como Inputs) tentam ler `properties.validation.message`:**

```typescript
<Input
  value={properties.validation?.message || ''}  // ← undefined?.message causa erro
  onChange={(e) => handleUpdate({ validation: { ...validation, message: e.target.value }})}
/>
```

---

## ✅ Solução 1: Corrigir o Registry

### Arquivo: `src/core/blocks/registry.ts`

```typescript
'quiz-question-inline': {
    type: 'quiz-question-inline',
    title: 'Pergunta de Quiz Inline',
    category: 'Quiz',
    icon: '💭',
    defaultProps: {
        title: 'Pergunta inline?',
        question: 'Pergunta inline?',
        description: '',
        options: [
            {
                id: 'opt-1',
                text: 'Sim',
                value: 'yes',
                imageUrl: '',
                scoreValues: {}
            },
            {
                id: 'opt-2',
                text: 'Não',
                value: 'no',
                imageUrl: '',
                scoreValues: {}
            }
        ],
        // ✅ ADICIONAR ESTAS PROPRIEDADES:
        multipleSelection: false,
        requiredSelections: 1,
        maxSelections: 1,
        showImages: true,
        columns: 2,
        required: true,
        layout: 'horizontal',
        
        // ✅ VALIDAÇÃO
        validation: {
            enabled: true,
            message: 'Por favor, selecione uma opção'
        },
        
        // ✅ SCORING
        scoring: {
            enabled: false,
            type: 'simple'
        },
        
        // ✅ ESTILO
        backgroundColor: '',
        textAlign: 'left',
        fontSize: '',
        color: '',
        scoreValues: {}
    },
    propsSchema: [
        prop({ key: 'title', kind: 'text', label: 'Título', category: 'content', default: 'Pergunta inline?' }),
        prop({ key: 'question', kind: 'text', label: 'Pergunta', category: 'content', default: 'Pergunta inline?' }),
        prop({ key: 'description', kind: 'text', label: 'Descrição', category: 'content', default: '' }),
        prop({ key: 'options', kind: 'array', label: 'Opções', category: 'content', default: [] }),
        prop({ key: 'multipleSelection', kind: 'switch', label: 'Múltipla Seleção', category: 'behavior', default: false }),
        prop({ key: 'required', kind: 'switch', label: 'Obrigatório', category: 'behavior', default: true }),
        prop({ key: 'showImages', kind: 'switch', label: 'Mostrar Imagens', category: 'content', default: true }),
        prop({ key: 'columns', kind: 'number', label: 'Colunas', category: 'layout', default: 2 }),
        prop({
            key: 'layout', kind: 'select', label: 'Layout', category: 'layout', options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
            ], default: 'horizontal'
        }),
    ],
}
```

---

## ✅ Solução 2: Garantir Defaults no PropertiesPanel

### Arquivo: `src/components/editor/properties/PropertiesPanel.tsx` (Linha ~80)

```typescript
if (isQuestionBlock) {
    // Adaptar Block para o formato esperado pelo QuestionPropertyEditor
    const questionBlock = {
      id: selectedBlock.id,
      type: selectedBlock.type,
      properties: {
        // ✅ GARANTIR TODOS OS DEFAULTS
        question: '',
        title: '',
        text: '',
        description: '',
        options: [],
        multipleSelection: false,
        requiredSelections: 1,
        maxSelections: 1,
        showImages: true,
        columns: 2,
        required: true,
        backgroundColor: '',
        textAlign: 'left',
        fontSize: '',
        color: '',
        scoreValues: {},
        validation: {
          enabled: true,
          message: 'Por favor, selecione uma opção'
        },
        scoring: {
          enabled: false,
          type: 'simple'
        },
        // ⬇️ SOBRESCREVER COM VALORES REAIS (se existirem)
        ...selectedBlock.properties,
        // ⬇️ GARANTIR QUE OBJETOS ANINHADOS SÃO MERGED CORRETAMENTE
        validation: {
          enabled: true,
          message: 'Por favor, selecione uma opção',
          ...selectedBlock.properties?.validation
        },
        scoring: {
          enabled: false,
          type: 'simple',
          ...selectedBlock.properties?.scoring
        }
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

## ✅ Solução 3: Defensive Coding no QuestionPropertyEditor

### Arquivo: `src/components/editor/properties/editors/QuestionPropertyEditor.tsx`

```typescript
export const QuestionPropertyEditor: React.FC<QuestionPropertyEditorProps> = ({
  block,
  onUpdate,
  onValidate,
  isPreviewMode = false,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);

  // ✅ GARANTIR QUE properties SEMPRE EXISTE COM TODOS OS CAMPOS
  const properties: QuestionProperties = {
    question: '',
    title: '',
    text: '',
    description: '',
    options: [],
    multipleSelection: false,
    requiredSelections: 1,
    maxSelections: 1,
    showImages: true,
    columns: 2,
    required: true,
    backgroundColor: '',
    textAlign: 'left',
    fontSize: '',
    color: '',
    scoreValues: {},
    validation: {
      enabled: true,
      message: 'Por favor, selecione uma opção'
    },
    scoring: {
      enabled: false,
      type: 'simple'
    },
    // Sobrescrever com valores reais
    ...(block.properties || {}),
    // Merge correto de objetos aninhados
    validation: {
      enabled: true,
      message: 'Por favor, selecione uma opção',
      ...(block.properties?.validation || {})
    },
    scoring: {
      enabled: false,
      type: 'simple',
      ...(block.properties?.scoring || {})
    }
  };

  // Estado local para opções
  const [localOptions, setLocalOptions] = useState<QuestionOption[]>(
    properties.options || []
  );

  useEffect(() => {
    console.log('🔍 useEffect - Atualizando localOptions com:', properties.options);
    setLocalOptions(properties.options || []);
  }, [properties.options]);

  // ... resto do código
```

---

## 🎯 Recomendação Final

**Aplicar TODAS as 3 soluções** para garantir robustez:

1. ✅ **Solução 1:** Corrigir o registry para criar blocos com props completas
2. ✅ **Solução 2:** Garantir defaults no PropertiesPanel (fallback)
3. ✅ **Solução 3:** Defensive coding no QuestionPropertyEditor (segurança)

### Ordem de Prioridade:

1. **CRÍTICO:** Solução 2 (PropertiesPanel) - **APLICAR AGORA**
   - Corrige o problema imediatamente para blocos existentes
   - Não quebra nada
   - Fallback seguro

2. **IMPORTANTE:** Solução 1 (Registry) - Aplicar depois
   - Corrige a fonte do problema
   - Beneficia novos blocos criados
   - Pode precisar migração de blocos existentes

3. **BOM TER:** Solução 3 (QuestionPropertyEditor) - Melhoria
   - Camada extra de proteção
   - Melhora robustez do código

---

## 📊 Teste de Verificação

Após aplicar as soluções, verificar no console do navegador:

```javascript
// 1. Selecionar um bloco quiz no editor
// 2. Verificar logs no console:

🔍 DEBUG PropertiesPanel
  selectedBlock: {
    id: "block-123",
    type: "quiz-question-inline",
    properties: {
      options: [], // ← Deve ser array vazio, não undefined
      validation: { enabled: true, message: "..." }, // ← Deve existir
      scoring: { enabled: false } // ← Deve existir
    }
  }

🔍 DEBUG QuestionPropertyEditor
  properties.options: [] // ← Deve ser array
  localOptions: [] // ← Deve ser array

// 3. Verificar se os campos aparecem no painel:
✅ Campo "Opções da Questão" visível
✅ Botão "Adicionar Opção" visível
✅ Tabs de configuração visíveis
```

---

## 🚀 Próximos Passos

1. **Aplicar Solução 2** (PropertiesPanel) - URGENTE
2. **Testar no navegador** - Verificar se campos aparecem
3. **Aplicar Solução 1** (Registry) - Melhorar criação de novos blocos
4. **Remover logs de debug** - Limpar código de produção
5. **Atualizar testes** - Garantir que defaults são testados

---

## ✅ Checklist Pós-Correção

- [ ] Bloco quiz selecionado mostra todas as propriedades
- [ ] Campo "Opções" está visível
- [ ] Botão "Adicionar Opção" funciona
- [ ] Campos de texto das opções aparecem
- [ ] Upload de imagem funciona
- [ ] Configuração de pontuação aparece
- [ ] Validação aparece
- [ ] Botão ativo/inativo aparece
- [ ] Nenhum erro no console
- [ ] Logs de debug confirmam properties completas
