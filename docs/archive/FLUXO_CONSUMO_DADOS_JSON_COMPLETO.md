# 🔄 Fluxo Completo de Consumo de Dados JSON

## 📋 Resumo Executivo

Este documento explica **como os componentes consomem os dados do JSON** armazenados no Supabase, desde o banco de dados até a renderização final na tela.

---

## 🗂️ Camadas da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CAMADA DE PERSISTÊNCIA (Supabase/localStorage)          │
│    - JSON estruturado em tabelas: funnels + funnel_pages   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CAMADA DE SERVIÇO (schemaDrivenFunnelService)           │
│    - Busca dados do Supabase                                │
│    - Fallback para localStorage                             │
│    - Transforma em interfaces TypeScript                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CAMADA DE ESTADO GLOBAL (FunnelsContext)                │
│    - Distribui dados via Context API                        │
│    - Hook: useFunnels()                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. CAMADA DE ADAPTAÇÃO (Quiz21StepsProvider)               │
│    - Adapta estrutura para componentes específicos          │
│    - Integra lógica de quiz                                  │
│    - Hook: useQuiz21Steps()                                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. CAMADA DE COMPONENTES (UniversalBlockRenderer)          │
│    - Recebe block.properties via props                       │
│    - Renderiza UI baseado no block.type                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Estrutura do JSON no Supabase

### Tabela: `funnels`
```json
{
  "id": "uuid-123",
  "name": "Meu Quiz de Estilo",
  "status": "active",
  "created_at": "2025-01-20T10:00:00Z",
  "updated_at": "2025-01-20T15:30:00Z",
  "theme": {
    "primaryColor": "#3b82f6",
    "fontFamily": "Inter"
  }
}
```

### Tabela: `funnel_pages`
```json
{
  "id": "uuid-456",
  "funnel_id": "uuid-123",
  "order": 1,
  "title": "Qual seu estilo favorito?",
  "blocks": [
    {
      "id": "block-789",
      "type": "quiz-question-inline",
      "order": 1,
      "properties": {
        "question": "Qual seu estilo favorito?",
        "options": [
          {
            "id": "opt-1",
            "text": "Clássico",
            "value": "classico",
            "image": "https://example.com/classic.jpg",
            "score": { "classico": 10, "natural": 0, "romantico": 0 }
          }
        ],
        "required": true,
        "multipleSelection": false,
        "showImages": true,
        "validation": {
          "enabled": true,
          "message": "Por favor, selecione uma opção"
        }
      }
    }
  ]
}
```

---

## 🔧 Camada 1: Serviço de Persistência

### Arquivo: `schemaDrivenFunnelService.ts`

```typescript
// ✅ BUSCA O FUNIL DO SUPABASE (ou localStorage como fallback)
export async function getFunnel(funnelId: string): Promise<SchemaDrivenFunnelData | null> {
  try {
    // 1️⃣ Verifica autenticação
    const user = await getAuthenticatedUser();
    
    // 2️⃣ Busca o funil principal
    const { data: funnelData, error: funnelError } = await supabase
      .from('funnels')
      .select('*')
      .eq('id', funnelId)
      .single();

    if (funnelError) throw funnelError;

    // 3️⃣ Busca as páginas do funil
    const { data: pagesData, error: pagesError } = await supabase
      .from('funnel_pages')
      .select('*')
      .eq('funnel_id', funnelId)
      .order('order', { ascending: true });

    if (pagesError) throw pagesError;

    // 4️⃣ Monta estrutura unificada
    return {
      id: funnelData.id,
      name: funnelData.name,
      pages: pagesData.map(page => ({
        id: page.id,
        title: page.title,
        blocks: page.blocks || [] // ⬅️ JSON contém array de blocos
      })),
      theme: funnelData.theme || {},
      config: funnelData.config || {}
    };
    
  } catch (error) {
    console.error('Erro ao buscar funil:', error);
    
    // 🔄 FALLBACK: tenta localStorage
    return getFromLocalStorage(funnelId);
  }
}
```

**Saída (TypeScript Interface):**
```typescript
interface SchemaDrivenFunnelData {
  id: string;
  name: string;
  pages: Array<{
    id: string;
    title: string;
    blocks: Block[]; // ⬅️ Array de blocos
  }>;
  theme: Record<string, any>;
  config: Record<string, any>;
}
```

---

## 🌐 Camada 2: Estado Global com Context

### Arquivo: `FunnelsContext.tsx`

```typescript
// ✅ CONTEXT QUE DISTRIBUI DADOS GLOBALMENTE
export const FunnelsContext = createContext<FunnelsContextType>({
  steps: [],
  currentFunnelId: null,
  loading: false,
  error: null,
  loadFunnel: async () => {},
  updateStep: () => {}
});

// Provider que carrega dados do serviço
export const FunnelsProvider = ({ children }: { children: ReactNode }) => {
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFunnel = async (funnelId: string) => {
    setLoading(true);
    
    // 🔌 CHAMA O SERVIÇO
    const funnelData = await schemaDrivenFunnelService.getFunnel(funnelId);
    
    if (funnelData) {
      // 🔄 TRANSFORMA pages[] em steps[]
      const convertedSteps = funnelData.pages.map(page => ({
        id: page.id,
        title: page.title,
        blocks: page.blocks // ⬅️ Passa os blocos adiante
      }));
      
      setSteps(convertedSteps);
    }
    
    setLoading(false);
  };

  return (
    <FunnelsContext.Provider value={{ steps, loadFunnel, loading }}>
      {children}
    </FunnelsContext.Provider>
  );
};

// Hook para consumir
export const useFunnels = () => useContext(FunnelsContext);
```

---

## 🎯 Camada 3: Adaptação para Quiz

### Arquivo: `Quiz21StepsProvider.tsx`

```typescript
// ✅ ADAPTER QUE CONSOME O CONTEXT E ADAPTA PARA QUIZ
export const Quiz21StepsProvider = ({ children }: { children: ReactNode }) => {
  // 1️⃣ CONSOME O CONTEXT GLOBAL
  const funnelsContext = useFunnels();
  
  // 2️⃣ ADAPTA OS DADOS
  const adaptedSteps = useMemo(() => {
    if (!funnelsContext?.steps) return [];
    
    return funnelsContext.steps.map(step => adaptLegacyStep(step));
  }, [funnelsContext?.steps]);

  // 3️⃣ INTEGRA LÓGICA DE QUIZ
  const quizLogic = useQuizLogic({
    steps: adaptedSteps,
    onComplete: handleQuizComplete
  });

  // 4️⃣ FORNECE CONTEXTO ESPECIALIZADO
  return (
    <Quiz21Context.Provider value={{
      steps: adaptedSteps, // ⬅️ Steps adaptados
      currentStep: quizLogic.currentStep,
      answers: quizLogic.answers,
      navigation: quizLogic.navigation
    }}>
      {children}
    </Quiz21Context.Provider>
  );
};

// Função de adaptação
function adaptLegacyStep(legacyStep: FunnelStep): AdaptedFunnelStep {
  return {
    id: legacyStep.id,
    title: legacyStep.title,
    blocks: legacyStep.blocks.map(block => ({
      ...block,
      // ✅ GARANTE QUE properties EXISTE
      properties: block.properties || {}
    }))
  };
}

// Hook para consumir
export const useQuiz21Steps = () => useContext(Quiz21Context);
```

---

## 🎨 Camada 4: Renderização de Blocos

### Arquivo: `UniversalBlockRenderer.tsx`

```typescript
// ✅ RENDERIZADOR UNIVERSAL DE BLOCOS
const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = ({
  block,
  isSelected,
  onUpdate
}) => {
  // 1️⃣ RESOLVE O COMPONENTE BASEADO NO TIPO
  const BlockComponent = useBlockComponent(block.type);

  // 2️⃣ RENDERIZA COM AS PROPERTIES DO JSON
  if (!BlockComponent) {
    return <div>Componente não encontrado: {block.type}</div>;
  }

  return (
    <BlockComponent
      block={block}
      isSelected={isSelected}
      onUpdate={onUpdate}
      // ⬅️ PASSA TODAS AS PROPERTIES DO JSON
      {...block.properties}
    />
  );
};

// Registry de componentes
const BlockComponentRegistry: Record<string, React.FC<any>> = {
  'quiz-question-inline': QuizQuestionBlock,
  'text-inline': TextInlineBlock,
  'button-inline': ButtonInlineBlock,
  'image': ImageBlock,
  // ... 30+ tipos de blocos
};

// Hook que resolve componentes do registry
const useBlockComponent = (blockType: string): React.ComponentType<any> | null => {
  return useMemo(() => {
    // Verifica cache primeiro
    const cached = componentCache.get(blockType);
    if (cached) return cached;

    // Busca no registry
    const component = BlockComponentRegistry[blockType];
    
    if (component) {
      componentCache.set(blockType, component);
      return component;
    }

    return null;
  }, [blockType]);
};
```

---

## 🧩 Camada 5: Componente Específico

### Arquivo: `QuizQuestionBlock.tsx`

```typescript
// ✅ COMPONENTE QUE CONSOME AS PROPERTIES DO JSON
interface QuizQuestionBlockProps {
  block: Block;
  onUpdate?: (updates: any) => void;
}

const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({ 
  block,
  onUpdate 
}) => {
  // 🎯 EXTRAI DADOS DO JSON VIA block.properties
  const {
    question = 'Pergunta não definida',
    options = [],
    required = true,
    multipleSelection = false,
    showImages = true,
    validation = { enabled: false }
  } = block.properties;

  // 📊 ESTADO LOCAL
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // 🎨 RENDERIZA UI BASEADO NOS DADOS
  return (
    <div className="quiz-question-block">
      {/* Título da pergunta */}
      <h3 className="text-xl font-semibold mb-4">
        {question}
        {required && <span className="text-red-500">*</span>}
      </h3>

      {/* Grid de opções */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option: any) => (
          <div
            key={option.id}
            className={cn(
              "p-4 border rounded-lg cursor-pointer",
              selectedOptions.includes(option.id) && "border-blue-500 bg-blue-50"
            )}
            onClick={() => handleOptionClick(option.id)}
          >
            {/* Imagem (se showImages = true) */}
            {showImages && option.image && (
              <img 
                src={option.image} 
                alt={option.text}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            
            {/* Texto da opção */}
            <p className="text-sm font-medium">{option.text}</p>
            
            {/* Valor (se configurado) */}
            {option.value && (
              <span className="text-xs text-gray-500">{option.value}</span>
            )}
          </div>
        ))}
      </div>

      {/* Validação */}
      {validation?.enabled && selectedOptions.length === 0 && (
        <p className="text-red-500 text-sm mt-2">
          {validation.message || 'Por favor, selecione uma opção'}
        </p>
      )}
    </div>
  );

  // Lógica de seleção
  function handleOptionClick(optionId: string) {
    if (multipleSelection) {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }

    // Callback para atualizar estado global
    onUpdate?.({ selectedOptions: [optionId] });
  }
};
```

---

## 🔄 Fluxo Completo Passo a Passo

### 1️⃣ **Usuário acessa `/editor?funnel=uuid-123`**

```typescript
// QuizModularProductionEditor.tsx
useEffect(() => {
  const funnelId = searchParams.get('funnel');
  if (funnelId) {
    loadFunnelForEdit(funnelId);
  }
}, [searchParams]);
```

### 2️⃣ **Editor carrega dados via Context**

```typescript
// EditorProvider.tsx
const loadRealFunnelData = async (funnelId: string) => {
  // 🔌 CHAMA O SERVIÇO
  const funnelData = await schemaDrivenFunnelService.getFunnel(funnelId);
  
  if (funnelData) {
    setSteps(funnelData.pages); // ⬅️ Atualiza estado global
  }
};
```

### 3️⃣ **Context distribui para componentes**

```typescript
// FunnelsProvider distribui via Context API
<FunnelsContext.Provider value={{ steps, loadFunnel }}>
  <QuizModularProductionEditor />
</FunnelsContext.Provider>
```

### 4️⃣ **Editor renderiza blocos**

```typescript
// QuizModularProductionEditor.tsx
const renderBlockPreview = (block: EditorBlockComponent) => {
  // Passa o bloco com properties do JSON
  return <UniversalBlockRenderer block={block} />;
};

// Renderiza todos os blocos da página
{currentStep?.blocks.map(block => (
  <div key={block.id}>
    {renderBlockPreview(block)}
  </div>
))}
```

### 5️⃣ **UniversalBlockRenderer resolve componente**

```typescript
// UniversalBlockRenderer.tsx
const BlockComponent = useBlockComponent(block.type);
// block.type = "quiz-question-inline" → QuizQuestionBlock

return <BlockComponent block={block} {...block.properties} />;
```

### 6️⃣ **Componente final renderiza na tela**

```typescript
// QuizQuestionBlock.tsx renderiza UI
<div>
  <h3>{block.properties.question}</h3>
  {block.properties.options.map(option => (
    <div>{option.text}</div>
  ))}
</div>
```

---

## 📈 Diagrama Completo do Fluxo

```
USER                    SUPABASE DB           SERVICE           CONTEXT         COMPONENT
  │                         │                    │                │                │
  │  GET /editor?funnel=123 │                    │                │                │
  ├────────────────────────>│                    │                │                │
  │                         │                    │                │                │
  │                         │  SELECT * FROM     │                │                │
  │                         │  funnels WHERE     │                │                │
  │                         │  id = '123'        │                │                │
  │                         ├───────────────────>│                │                │
  │                         │                    │                │                │
  │                         │  JSON Response     │                │                │
  │                         │<───────────────────┤                │                │
  │                         │                    │                │                │
  │                         │                    │  setSteps([])  │                │
  │                         │                    ├───────────────>│                │
  │                         │                    │                │                │
  │                         │                    │                │  useFunnels()  │
  │                         │                    │                │<───────────────┤
  │                         │                    │                │                │
  │                         │                    │                │  steps[]       │
  │                         │                    │                ├───────────────>│
  │                         │                    │                │                │
  │                         │                    │                │  RENDERIZA     │
  │                         │                    │                │  block.properties
  │  HTML Renderizado       │                    │                │                │
  │<────────────────────────┴────────────────────┴────────────────┴────────────────┤
  │                                                                                 │
```

---

## 🎯 Exemplo Concreto

### JSON Original (Supabase)
```json
{
  "id": "block-123",
  "type": "quiz-question-inline",
  "properties": {
    "question": "Qual seu estilo?",
    "options": [
      { "id": "1", "text": "Clássico", "image": "url", "score": {"classico": 10} }
    ],
    "required": true,
    "showImages": true
  }
}
```

### Transformações no Fluxo

**1. Serviço (schemaDrivenFunnelService):**
```typescript
// Retorna interface tipada
const funnelData: SchemaDrivenFunnelData = {
  pages: [{
    blocks: [
      { id: "block-123", type: "quiz-question-inline", properties: {...} }
    ]
  }]
}
```

**2. Context (FunnelsContext):**
```typescript
// Distribui via Context
const context = {
  steps: [{ blocks: [{ id: "block-123", type: "...", properties: {...} }] }]
}
```

**3. Adapter (Quiz21StepsProvider):**
```typescript
// Adapta para quiz
const adaptedSteps = [{
  blocks: [{ id: "block-123", type: "...", properties: {...} }]
}]
```

**4. Renderer (UniversalBlockRenderer):**
```typescript
// Resolve componente
<QuizQuestionBlock block={block} {...block.properties} />
```

**5. Componente Final:**
```tsx
// Renderiza UI
<div>
  <h3>Qual seu estilo?</h3>
  <div>
    <img src="url" />
    <p>Clássico</p>
  </div>
</div>
```

---

## ✅ Benefícios desta Arquitetura

### 1. **Type Safety**
- Cada camada tem interfaces TypeScript claras
- Autocomplete em todo o código
- Erros detectados em tempo de desenvolvimento

### 2. **Separação de Responsabilidades**
- Persistência ≠ Estado ≠ Renderização
- Cada camada tem uma única responsabilidade
- Fácil de testar isoladamente

### 3. **Reusabilidade**
- Serviço pode ser usado em múltiplos contextos
- Componentes são genéricos e reutilizáveis
- Context pode alimentar diferentes providers

### 4. **Performance**
- Cache em múltiplos níveis (LRU Cache)
- Memoização com useMemo/useCallback
- Lazy loading de componentes

### 5. **Fallback Robusto**
- Supabase falha → localStorage
- Componente não encontrado → Fallback UI
- Dados inválidos → Valores default

---

## 🔍 Comparação com Alternativas

### ❌ Consumo Direto (SEM CAMADAS)
```typescript
// RUIM: Componente acessa Supabase diretamente
const QuizQuestion = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    supabase.from('blocks').select('*').then(setData);
  }, []);
  
  return <div>{data?.question}</div>;
};
```
**Problemas:**
- ❌ Acoplamento alto (componente depende do banco)
- ❌ Difícil de testar (precisa mockar Supabase)
- ❌ Sem cache (busca sempre)
- ❌ Duplicação de lógica

### ✅ Arquitetura em Camadas (ATUAL)
```typescript
// BOM: Componente recebe dados via props
const QuizQuestion = ({ block }: { block: Block }) => {
  return <div>{block.properties.question}</div>;
};

// Dados vêm do Context
const Parent = () => {
  const { steps } = useFunnels();
  return <QuizQuestion block={steps[0].blocks[0]} />;
};
```
**Benefícios:**
- ✅ Baixo acoplamento (componente só conhece props)
- ✅ Fácil de testar (mock props)
- ✅ Cache automático
- ✅ Lógica centralizada

---

## 📝 Resumo Final

### Como os Componentes Consomem JSON:

1. **JSON no Supabase** (`funnels` + `funnel_pages`)
2. **Serviço busca e transforma** (`schemaDrivenFunnelService`)
3. **Context distribui globalmente** (`FunnelsContext`)
4. **Adapter especializa** (`Quiz21StepsProvider`)
5. **Renderer resolve componente** (`UniversalBlockRenderer`)
6. **Componente renderiza UI** (`QuizQuestionBlock`)

### Padrão de Consumo:
```typescript
JSON (Supabase)
  → Service.getFunnel(id)
  → Context.setSteps([])
  → Component useFunnels()
  → <BlockRenderer block={...} />
  → <QuizQuestionBlock properties={...} />
  → HTML na tela
```

### Vantagens:
- ✅ Type-safe em todas as camadas
- ✅ Testável isoladamente
- ✅ Performance otimizada (cache)
- ✅ Fallback robusto (localStorage)
- ✅ Reusável em múltiplos contextos

---

## 🚀 Próximos Passos

Se você quiser **melhorar** esta arquitetura:

1. **React Query** para cache automático e sincronização
2. **Zustand** para estado global mais performático
3. **Supabase Realtime** para colaboração em tempo real
4. **Optimistic Updates** para UX mais rápida

Mas a arquitetura atual já é **sólida e segue as melhores práticas do React**! 🎉
