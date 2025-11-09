# 🎯 Template Usado em /quiz-estilo

## 📊 Resposta Rápida

A rota `/quiz-estilo` **NÃO USA nenhum dos templates investigados** (nem JSON, nem TypeScript `quiz21StepsComplete.ts`).

### **Usa um sistema próprio: `QUIZ_STEPS` do arquivo `quizSteps.ts`**

---

## 🔍 Evidências Técnicas

### 1. **Rota Principal** (`/quiz-estilo`)
```tsx
// src/App.tsx - Linha 351
<Route path="/quiz-estilo">
  <QuizEstiloPessoalPage />
</Route>
```

---

### 2. **Componente da Página**
```tsx
// src/pages/QuizEstiloPessoalPage.tsx

export default function QuizEstiloPessoalPage({ funnelId }: QuizEstiloPessoalPageProps) {
    // Prioridade: query ?draft > prop funnelId de rota > fallback fixo
    const effectiveFunnelId = queryDraftId || funnelId || 'quiz-estilo-21-steps';
    
    return (
        <main className="min-h-screen">
            <QuizApp funnelId={effectiveFunnelId} />
        </main>
    );
}
```

**Observação:** O `funnelId` padrão é `'quiz-estilo-21-steps'`, mas isso é apenas um identificador, não carrega template.

---

### 3. **Componente Principal do Quiz**
```tsx
// src/components/quiz/QuizApp.tsx

export default function QuizApp({ funnelId, externalSteps }: QuizAppProps) {
    const {
        state,
        currentStepData,
        progress,
        nextStep,
        setUserName,
        addAnswer,
        addStrategicAnswer,
        getOfferKey,
    } = useQuizState(funnelId, externalSteps); // ← Hook que gerencia estado
    
    return (
        <div className="min-h-screen">
            <UnifiedStepRenderer
                stepId={currentStepId}
                mode="production"
                stepProps={currentStepData} // ← Dados vêm do useQuizState
                quizState={unifiedQuizState}
                onStepUpdate={...}
                onNext={...}
            />
        </div>
    );
}
```

---

### 4. **Hook de Estado (FONTE DOS DADOS)**
```typescript
// src/hooks/useQuizState.ts - Linha 76

export function useQuizState(funnelId?: string, externalSteps?: Record<string, any>) {
  const [state, setState] = useState<QuizState>(initialState);
  const [loadedSteps, setLoadedSteps] = useState<Record<string, any> | null>(null);

  // 🎯 Tentativa de carregar do bridge (se tiver funnelId)
  useEffect(() => {
    if (funnelId && !externalSteps) {
      quizEditorBridge.loadForRuntime(funnelId)
        .then(steps => {
          console.log('✅ Steps carregados do bridge:', Object.keys(steps).length);
          setLoadedSteps(steps);
        })
        .catch(err => {
          console.error('❌ Erro ao carregar steps:', err);
          setLoadedSteps(QUIZ_STEPS); // ← FALLBACK PARA QUIZ_STEPS
        });
    }
  }, [funnelId, externalSteps]);

  // ✅ Determinar source dos steps
  const stepsSource = externalSteps || loadedSteps || QUIZ_STEPS; // ← QUIZ_STEPS é o default
  
  // ... resto do código
}
```

**O que acontece:**
1. Tenta carregar do `quizEditorBridge` usando `funnelId`
2. Se falhar, usa `QUIZ_STEPS` como fallback
3. Na prática, `/quiz-estilo` sempre usa `QUIZ_STEPS`

---

### 5. **Estrutura QUIZ_STEPS (TEMPLATE REAL)**
```typescript
// src/data/quizSteps.ts - Linha 52

export const QUIZ_STEPS: Record<string, QuizStep> = {
    'step-01': {
        type: 'intro',
        title: '<span style="color: #B89B7A;">Chega</span> de um guarda-roupa lotado...',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/...',
        nextStep: 'step-02',
    },

    'step-02': {
        type: 'question',
        questionNumber: '1 de 10',
        questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        requiredSelections: 3,
        options: [
            { id: 'natural', text: 'Conforto, leveza e praticidade...', image: '...' },
            { id: 'classico', text: 'Discrição, caimento clássico...', image: '...' },
            // ... 8 opções
        ],
        nextStep: 'step-03',
    },

    'step-03': {
        type: 'question',
        questionNumber: '2 de 10',
        questionText: 'RESUMA A SUA PERSONALIDADE:',
        // ...
    },

    // ... steps 04-21
};
```

**Características:**
- ✅ 21 steps hardcoded no arquivo TypeScript
- ✅ Estrutura simplificada (type, title, options, nextStep)
- ✅ Sem metadados extras (analytics, validation, layout)
- ✅ Focado em conteúdo do quiz (perguntas, opções, textos)

---

## 🎯 Comparação: 3 Sistemas de Templates

### 1. **QUIZ_STEPS** (quizSteps.ts) ← **USADO EM /quiz-estilo** ✅
```typescript
// Localização: src/data/quizSteps.ts
// Usado por: /quiz-estilo (produção)

export const QUIZ_STEPS: Record<string, QuizStep> = {
  'step-01': {
    type: 'intro',
    title: '...',
    formQuestion: '...',
    buttonText: '...',
    image: '...'
  },
  'step-02': {
    type: 'question',
    questionNumber: '1 de 10',
    questionText: '...',
    options: [...]
  }
  // ... 21 steps
};
```

**Características:**
- ✅ Estrutura simplificada
- ✅ Foco em conteúdo (perguntas, textos, imagens)
- ✅ Sem configurações complexas
- ✅ Carregamento direto (import)
- ✅ TypeScript nativo
- ❌ Sem metadados (analytics, validation)
- ❌ Sem lazy loading

---

### 2. **QUIZ_STYLE_21_STEPS_TEMPLATE** (quiz21StepsComplete.ts) ← **USADO NO /editor** ⚠️
```typescript
// Localização: src/templates/quiz21StepsComplete.ts
// Usado por: /editor (FunnelsContext, QuizModularProductionEditor, etc.)

export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = {
  'step-1': [
    {
      id: 'step1-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {...},
      properties: {...}
    },
    {
      id: 'step1-main-text',
      type: 'text-inline',
      order: 1,
      properties: {...}
    }
    // ... múltiplos blocos por step
  ],
  'step-2': [...]
  // ... 21 steps com blocos
};
```

**Características:**
- ✅ Estrutura completa de blocos (Block[])
- ✅ Configurações globais (SEO, tracking, branding)
- ✅ Personalização dinâmica por funil
- ✅ TypeScript type-safe
- ❌ Arquivo gigante (3742 linhas)
- ❌ Sem lazy loading
- ❌ Complexo para manter

---

### 3. **Templates JSON** (step-##.json) ← **NÃO USADO** ❌
```json
// Localização: /templates/step-01-template.json
// Status: CRIADO MAS NÃO CONECTADO

{
  "templateVersion": "2.0",
  "metadata": {...},
  "layout": {...},
  "validation": {...},
  "analytics": {...},
  "blocks": [...]
}
```

**Características:**
- ✅ Estrutura moderna (v2.0)
- ✅ Metadados ricos
- ✅ Lazy loading nativo
- ✅ Performance superior
- ❌ Não conectado ao código
- ❌ Hook criado mas não usado
- ❌ Código morto

---

## 📊 Arquitetura Atual

```
/quiz-estilo (Produção)
    ↓
QuizEstiloPessoalPage
    ↓
QuizApp
    ↓
useQuizState(funnelId)
    ↓
quizEditorBridge.loadForRuntime(funnelId)
    ↓ (se falhar ou não houver funnelId)
QUIZ_STEPS (fallback)
    ↓
UnifiedStepRenderer
    ↓
Renderização do Quiz


/editor (Editor de Funis)
    ↓
QuizModularProductionEditor
    ↓
FunnelsContext
    ↓
QUIZ_STYLE_21_STEPS_TEMPLATE (import direto)
    ↓
PropertiesPanel, BlockRenderer
    ↓
Edição visual de blocos
```

---

## 🎯 Por Que Sistemas Diferentes?

### **Quiz em Produção** (`/quiz-estilo`)
- **Objetivo:** Experiência de usuário final
- **Necessidade:** Simplicidade, performance, conteúdo direto
- **Solução:** `QUIZ_STEPS` (estrutura leve focada em conteúdo)

### **Editor de Funis** (`/editor`)
- **Objetivo:** Edição visual de funis
- **Necessidade:** Blocos customizáveis, propriedades editáveis
- **Solução:** `QUIZ_STYLE_21_STEPS_TEMPLATE` (blocos complexos)

### **Templates JSON** (não usado)
- **Objetivo:** Modernizar sistema
- **Status:** Criado mas não conectado
- **Problema:** Faltou integração com código existente

---

## 🔧 Estrutura de Dados Comparada

### QUIZ_STEPS (Produção)
```typescript
interface QuizStep {
  type: 'intro' | 'question' | 'strategic-question' | 'result' | 'offer';
  title?: string;
  questionNumber?: string;
  questionText?: string;
  formQuestion?: string;
  placeholder?: string;
  buttonText?: string;
  options?: QuizOption[];
  nextStep?: string;
}
```

**Foco:** Conteúdo do quiz (perguntas, opções, textos)

---

### QUIZ_STYLE_21_STEPS_TEMPLATE (Editor)
```typescript
interface Block {
  id: string;
  type: string; // 'text-inline', 'button-inline', 'quiz-question', etc.
  order: number;
  content?: Record<string, any>;
  properties: Record<string, any>;
}

type StepTemplate = Record<string, Block[]>;
```

**Foco:** Blocos editáveis visualmente

---

### Templates JSON (Não usado)
```typescript
interface TemplateJSON {
  templateVersion: string;
  metadata: {
    id: string;
    name: string;
    category: string;
    tags: string[];
  };
  layout: {
    containerWidth: string;
    spacing: string;
    backgroundColor: string;
  };
  validation: {...};
  analytics: {...};
  blocks: Block[];
}
```

**Foco:** Template completo com metadados

---

## 🚀 Conclusão

### **Resposta Final: Qual template `/quiz-estilo` usa?**

## ✅ `QUIZ_STEPS` (src/data/quizSteps.ts)

**Motivos:**
1. É o fallback padrão em `useQuizState`
2. Estrutura simples focada em conteúdo
3. Carregamento direto (sem async)
4. Usado em produção há mais tempo
5. Funciona perfeitamente

**Não usa:**
- ❌ `QUIZ_STYLE_21_STEPS_TEMPLATE` (esse é do editor)
- ❌ Templates JSON (não conectados)

---

## 🎯 Sistema Híbrido Real

```
PRODUÇÃO (/quiz-estilo):
  QUIZ_STEPS (quizSteps.ts)
    ↓
  410 linhas, estrutura simples
    ↓
  Foco em conteúdo e UX

EDITOR (/editor):
  QUIZ_STYLE_21_STEPS_TEMPLATE (quiz21StepsComplete.ts)
    ↓
  3742 linhas, blocos completos
    ↓
  Foco em edição visual

FUTURO (planejado):
  Templates JSON (step-##.json)
    ↓
  21 arquivos modernos
    ↓
  Não conectado ainda
```

---

## 📋 Diferenças Críticas

| Aspecto | QUIZ_STEPS | QUIZ_STYLE_21_STEPS | Templates JSON |
|---------|------------|---------------------|----------------|
| **Usado em** | /quiz-estilo ✅ | /editor ✅ | Nenhum ❌ |
| **Tamanho** | 410 linhas | 3742 linhas | ~4000 linhas total |
| **Estrutura** | QuizStep[] | Block[][] | JSON completo |
| **Foco** | Conteúdo | Blocos editáveis | Template moderno |
| **Complexidade** | Simples | Complexa | Média |
| **Performance** | Ótima | Boa | Excelente (lazy) |
| **Manutenção** | Fácil | Difícil | Fácil |

---

## 🔗 Arquivos Relacionados

### Sistema de Produção (/quiz-estilo)
- `src/data/quizSteps.ts` (410 linhas) - **TEMPLATE REAL** ✅
- `src/hooks/useQuizState.ts` (345 linhas) - Hook de estado
- `src/components/quiz/QuizApp.tsx` (180 linhas) - Componente principal
- `src/pages/QuizEstiloPessoalPage.tsx` (82 linhas) - Página da rota

### Sistema de Editor (/editor)
- `src/templates/quiz21StepsComplete.ts` (3742 linhas)
- `src/contexts/funnel/FunnelsContext.tsx` (importa QUIZ_STYLE_21_STEPS_TEMPLATE)
- `src/components/editor/quiz/QuizModularProductionEditor.tsx`

### Sistema JSON (Não usado)
- `templates/step-01-template.json` até `step-21-template.json` (21 arquivos)
- `src/hooks/useTemplateLoader.ts` (hook não usado)
- `src/config/templates/templates.ts` (loader não conectado)

---

## 💡 Recomendações

### Para /quiz-estilo:
✅ **Continue usando QUIZ_STEPS**
- Funciona perfeitamente
- Estrutura adequada para produção
- Sem necessidade de mudança

### Para /editor:
✅ **Continue usando QUIZ_STYLE_21_STEPS_TEMPLATE**
- Sistema de blocos necessário para edição
- Refatorar seria muito trabalho
- Funciona bem para o propósito

### Para Templates JSON:
⚠️ **Avalie necessidade real**
- Foi criado mas nunca usado
- Pode remover (código morto)
- Ou conectar futuramente se houver tempo

---

## 🎯 Lição Aprendida

### **Três sistemas diferentes para três propósitos:**

1. **QUIZ_STEPS** → Quiz de produção (simples, rápido, focado)
2. **QUIZ_STYLE_21_STEPS_TEMPLATE** → Editor visual (complexo, editável)
3. **Templates JSON** → Tentativa de modernização (não concluída)

### **Não há problema ter sistemas diferentes!**
- Cada um serve seu propósito
- Produção precisa ser simples
- Editor precisa ser flexível
- JSON pode ser removido (não é usado)

---

**Status:** ✅ Análise Completa Concluída
**Última atualização:** 11 de outubro de 2025
**Template usado em /quiz-estilo:** `QUIZ_STEPS` (quizSteps.ts) ✅
