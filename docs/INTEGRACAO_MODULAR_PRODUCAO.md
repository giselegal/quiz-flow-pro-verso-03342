# 🎯 INTEGRAÇÃO: ARQUITETURA MODULAR ↔ PRODUÇÃO (/quiz-estilo)

## ✅ **CONFIRMADO: MESMA FONTE DE DADOS E LÓGICA**

### **📊 FONTE DE DADOS COMPARTILHADA**

```typescript
// 🎯 AMBOS USAM OS MESMOS DADOS BASE
/quiz-estilo (produção) ← → Arquitetura Modular (editor)
        ↓                           ↓
    QuizApp.tsx                StepRenderer.tsx
        ↓                           ↓
   useQuizState.ts              useQuizLogic.ts
        ↓                           ↓
    QUIZ_STEPS                  QUIZ_STEPS
 (quizSteps.ts)              (quizSteps.ts)
```

#### **Arquivos de Dados Compartilhados:**
- `src/data/quizSteps.ts` - **21 etapas completas**
- `src/data/caktoquizQuestions.ts` - **Questões e opções**
- `src/data/styles.ts` - **Configuração dos 8 estilos**
- `src/templates/quiz21StepsComplete.ts` - **Templates visuais**

### **🧮 LÓGICA DE CÁLCULO IDÊNTICA**

#### **Sistema Atual de Produção:**
```typescript
// src/pages/QuizEstiloPessoalPage.tsx
export default function QuizEstiloPessoalPage({ funnelId }) {
    return (
        <QuizApp funnelId={funnelId} />  // ← Página de produção
    );
}

// src/components/quiz/QuizApp.tsx
export default function QuizApp({ funnelId }) {
    const {
        state,
        currentStepData,
        progress,
        nextStep,
        setUserName,
        addAnswer,
        addStrategicAnswer,
        getOfferKey,
    } = useQuizState(funnelId);  // ← Hook principal
}

// src/hooks/useQuizState.ts
const calculateResult = useCallback(() => {
    console.log('🔄 Calculando resultado do quiz...');
    const newScores = { ...initialScores };

    // ✅ ALGORITMO DE CÁLCULO (igual para ambos)
    Object.entries(state.answers).forEach(([stepId, selections]) => {
        const step = QUIZ_STEPS[stepId];
        if (step?.type === 'question' && selections) {
            selections.forEach(selectionId => {
                if (selectionId in newScores) {
                    (newScores as any)[selectionId] += 1;
                }
            });
        }
    });
}, [state.answers]);
```

#### **Sistema Modular Proposto:**
```typescript
// src/components/steps/step-02/hooks/useQuestionLogic.ts
export const useQuestionLogic = ({ stepData, onSave }) => {
    // ✅ USA O MESMO useQuizState internamente
    const { addAnswer, calculateResult } = useQuizState();

    const handleAnswer = useCallback((selections: string[]) => {
        // ✅ MESMA LÓGICA DE SAVE
        addAnswer(stepData.id, selections);
        onSave({ selections });
    }, [stepData.id, addAnswer, onSave]);

    return { handleAnswer };
};

// src/components/step-registry/StepRenderer.tsx
export const StepRenderer: React.FC<StepRendererProps> = (props) => {
    // ✅ CONECTA COM O MESMO SISTEMA DE ESTADO
    const quizState = useQuizState(props.funnelId);
    
    const stepComponent = stepRegistry.get(props.stepId);
    const Component = stepComponent.component;
    
    return <Component {...props} quizState={quizState} />;
};
```

### **🎯 PROPÓSITO: SUBSTITUIR E MELHORAR**

#### **Atual (QuizApp.tsx - 152 linhas):**
```typescript
// ❌ MONOLÍTICO: Tudo em um componente
export default function QuizApp({ funnelId }) {
    const { state, currentStepData, progress, ... } = useQuizState(funnelId);

    // 🔥 PROBLEMA: Switch gigante com todos os tipos
    return (
        <div className="min-h-screen">
            {currentStepData.type === 'intro' && (
                <IntroStep data={currentStepData} onNameSubmit={...} />
            )}
            {currentStepData.type === 'question' && (
                <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                    <QuestionStep data={currentStepData} ... />
                </div>
            )}
            {currentStepData.type === 'strategic-question' && (
                <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                    <StrategicQuestionStep data={currentStepData} ... />
                </div>
            )}
            // ... mais 4 tipos de step com código duplicado
        </div>
    );
}
```

#### **Modular (Substituição):**
```typescript
// ✅ MODULAR: Renderizador universal
export default function ModularQuizApp({ funnelId }) {
    const { currentStepId, isEditable } = useQuizFlow();

    return (
        <div className="min-h-screen">
            <StepRenderer
                stepId={currentStepId}
                funnelId={funnelId}
                isEditable={isEditable}
                // ✅ MESMOS DADOS, LÓGICA E CÁLCULOS
            />
        </div>
    );
}
```

### **📈 MIGRAÇÃO PROGRESSIVA**

#### **Fase 1: Manter Compatibilidade Total**
```typescript
// src/pages/QuizEstiloPessoalPage.tsx
export default function QuizEstiloPessoalPage({ funnelId }) {
    // ✅ FEATURE FLAG para testar modular
    const useModularSystem = process.env.NEXT_PUBLIC_USE_MODULAR === 'true';
    
    if (useModularSystem) {
        return <ModularQuizApp funnelId={funnelId} />; // ← Novo sistema
    }
    
    return <QuizApp funnelId={funnelId} />; // ← Sistema atual
}
```

#### **Fase 2: Substituir Gradualmente**
```typescript
// Migrar step por step
Step01Container → substituir IntroStep
Step02Container → substituir QuestionStep  
Step20Container → substituir ResultStep
// ... etc
```

#### **Fase 3: Deprecar Sistema Antigo**
```typescript
// src/pages/QuizEstiloPessoalPage.tsx
export default function QuizEstiloPessoalPage({ funnelId }) {
    return <ModularQuizApp funnelId={funnelId} />; // ← Só o modular
}
```

### **🚀 VANTAGENS DA SUBSTITUIÇÃO**

#### **Performance:**
```typescript
// ❌ ATUAL: Carrega todos os componentes
import IntroStep from './IntroStep';           // ~50KB
import QuestionStep from './QuestionStep';     // ~80KB  
import StrategicQuestionStep from './StrategicQuestionStep'; // ~60KB
import TransitionStep from './TransitionStep'; // ~30KB
import ResultStep from './ResultStep';         // ~120KB
import OfferStep from './OfferStep';          // ~90KB
// Total: ~430KB carregados sempre

// ✅ MODULAR: Lazy loading por step
const Step01Container = lazy(() => import('./steps/step-01')); // ~25KB
const Step02Container = lazy(() => import('./steps/step-02')); // ~30KB
// Carrega apenas o step atual: ~25-30KB por vez
```

#### **Manutenibilidade:**
```typescript
// ❌ ATUAL: Mudança no Step 1 = recompilar QuizApp inteiro
// ✅ MODULAR: Mudança no Step 1 = recompilar só Step01Container
```

#### **Desenvolvimento:**
```typescript
// ❌ ATUAL: 1 dev trabalhando = bloqueia outros
// ✅ MODULAR: 5 devs trabalhando em paralelo em steps diferentes
```

### **🎯 RESPOSTA FINAL**

**SIM, seria exatamente a mesma fonte de dados e lógica:**

1. **Dados:** Mesmos arquivos (`quizSteps.ts`, `caktoquizQuestions.ts`)
2. **Cálculos:** Mesmo `useQuizState` e algoritmos
3. **Navegação:** Mesma sequência de 21 etapas
4. **Resultado:** Mesma lógica de pontuação e ofertas

**O propósito é SUBSTITUIR o sistema atual por um mais:**
- ✅ **Modular** (cada step independente)
- ✅ **Performático** (lazy loading)
- ✅ **Manutenível** (código organizado)
- ✅ **Escalável** (fácil adicionar novos steps)

**Seria uma evolução natural do `/quiz-estilo` atual, mantendo toda a funcionalidade mas com arquitetura superior!** 🚀