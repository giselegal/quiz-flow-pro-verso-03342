# 🎯 SISTEMA EDITOR UNIFICADO - GUIA DE USO

## 📚 Como Usar o Sistema Unificado

### 1. **Importação Básica**

```typescript
// Importação completa do sistema
import {
  EditorUnified,
  UnifiedEditorProvider,
  useUnifiedEditor,
  UnifiedCalculationEngine,
  createCalculationEngine,
} from '@/unified/editor';

// Ou importação específica
import EditorUnified from '@/unified/editor/EditorUnified';
import { useUnifiedEditor } from '@/unified/editor/UnifiedEditorProvider';
```

### 2. **Setup Básico do Editor**

```typescript
import React from 'react';
import { UnifiedEditorProvider, EditorUnified } from '@/unified/editor';

function App() {
  const handleSave = async (data) => {
    console.log('Salvando dados:', data);
    // Salvar no Supabase ou outro backend
  };

  const handleCalculate = async (answers) => {
    const engine = createCalculationEngine();
    return await engine.calculate(answers);
  };

  const handleAnalytics = async (event) => {
    console.log('Evento analytics:', event);
    // Enviar para serviço de analytics
  };

  return (
    <UnifiedEditorProvider
      config={{
        showToolbar: true,
        showStages: true,
        showComponents: true,
        showProperties: true,
        enableAutoSave: true,
        autoSaveInterval: 30000,
      }}
      funnelId="quiz-personalidade"
      onSave={handleSave}
      onCalculate={handleCalculate}
      onAnalytics={handleAnalytics}
    >
      <EditorUnified />
    </UnifiedEditorProvider>
  );
}
```

### 3. **Usando o Hook useUnifiedEditor**

```typescript
import React from 'react';
import { useUnifiedEditor } from '@/unified/editor';

function CustomComponent() {
  const { state, actions, computed, config } = useUnifiedEditor();

  const handleAddTextBlock = () => {
    actions.addBlock('text', {
      content: 'Novo bloco de texto',
      style: { fontSize: '16px', color: '#333' }
    });
  };

  const handleNextStep = () => {
    if (computed.canGoNext) {
      actions.nextStep();
    }
  };

  return (
    <div>
      <h3>Etapa {state.currentStep} de 21</h3>
      <p>Progresso: {computed.progress.toFixed(1)}%</p>
      <p>Blocos na etapa atual: {computed.currentStepBlocks.length}</p>

      <button onClick={handleAddTextBlock}>
        Adicionar Texto
      </button>

      <button
        onClick={handleNextStep}
        disabled={!computed.canGoNext}
      >
        Próxima Etapa
      </button>

      {state.hasUnsavedChanges && (
        <button onClick={actions.save}>
          Salvar Alterações
        </button>
      )}
    </div>
  );
}
```

### 4. **Sistema de Cálculo**

```typescript
import { createCalculationEngine } from '@/unified/editor';

// Configuração personalizada
const engine = createCalculationEngine({
  enableDebug: true,
  confidenceThreshold: 0.7,
  minAnswersRequired: 15,
  weightingAlgorithm: 'adaptive',
});

// Calculando resultados
async function calculatePersonality(answers) {
  try {
    const results = await engine.calculate(answers);

    console.log('Perfil principal:', results.styleProfile.primaryStyle);
    console.log('Confiança:', results.confidence?.overall);
    console.log('Insights:', results.insights);

    return results;
  } catch (error) {
    console.error('Erro no cálculo:', error);
  }
}

// Exemplo de uso
const sampleAnswers = [
  {
    questionId: 'prefer_data_decisions',
    optionId: 'option_1',
    value: 4,
    type: 'scale',
    step: 1,
    timestamp: new Date(),
  },
  // ... mais respostas
];

calculatePersonality(sampleAnswers);
```

### 5. **Manipulação Avançada de Blocos**

```typescript
function AdvancedBlockManager() {
  const { actions, computed } = useUnifiedEditor();

  const createQuizQuestion = async () => {
    const questionId = await actions.addBlock('question', {
      title: 'Como você prefere tomar decisões?',
      type: 'multiple-choice',
      options: [
        { id: '1', text: 'Baseado em dados e análise', weight: { Analista: 0.9 } },
        { id: '2', text: 'Rapidamente, com base na intuição', weight: { Diretor: 0.8 } },
        { id: '3', text: 'Consultando outras pessoas', weight: { Relacional: 0.9 } },
        { id: '4', text: 'Explorando opções criativas', weight: { Expressivo: 0.8 } },
      ],
      required: true,
    });

    // Selecionar o bloco recém-criado
    actions.selectBlock(questionId);
  };

  const reorderBlocks = async () => {
    const blockIds = computed.currentStepBlocks.map(block => block.id);
    const reordered = [...blockIds].reverse(); // Exemplo: inverter ordem

    await actions.reorderBlocks(reordered);
  };

  return (
    <div>
      <button onClick={createQuizQuestion}>
        Criar Pergunta do Quiz
      </button>

      <button onClick={reorderBlocks}>
        Reordenar Blocos
      </button>
    </div>
  );
}
```

### 6. **Sistema de Analytics**

```typescript
function AnalyticsExample() {
  const { actions } = useUnifiedEditor();

  const trackCustomEvent = () => {
    actions.trackEvent({
      event: 'custom_interaction',
      properties: {
        component: 'AdvancedBlockManager',
        action: 'create_question',
        step: 5,
        userType: 'premium',
      },
    });
  };

  const trackQuizCompletion = async () => {
    const results = await actions.calculateResults();

    actions.trackEvent({
      event: 'quiz_completed',
      properties: {
        primaryStyle: results.styleProfile.primaryStyle.style,
        confidence: results.confidence?.overall,
        totalTime: Date.now() - startTime,
        stepCount: 21,
      },
    });
  };

  return (
    <div>
      <button onClick={trackCustomEvent}>
        Registrar Evento Customizado
      </button>
    </div>
  );
}
```

### 7. **Configuração Avançada**

```typescript
// Configuração para diferentes contextos
const developmentConfig = {
  showToolbar: true,
  showStages: true,
  showComponents: true,
  showProperties: true,
  enableAnalytics: false, // Desabilitar em dev
  enableAutoSave: false, // Salvar manual em dev
  enableDragDrop: true,
  enablePreview: true,
};

const productionConfig = {
  showToolbar: false,
  showStages: true,
  showComponents: false,
  showProperties: false,
  enableAnalytics: true,
  enableAutoSave: true,
  autoSaveInterval: 15000, // Salvar mais frequentemente
  enableDragDrop: false, // Modo somente leitura
  enablePreview: true,
};

// Uso condicional
const config = process.env.NODE_ENV === 'development' ? developmentConfig : productionConfig;
```

### 8. **Migração de Código Existente**

```typescript
// ANTES (código antigo)
import EditorPro from '@/components/editor/EditorPro';
import { calcResults } from '@/services/calcResults';

function OldComponent() {
  const [editorState, setEditorState] = useState({});

  const handleSave = () => {
    // Lógica de save manual
  };

  return (
    <EditorPro
      state={editorState}
      onStateChange={setEditorState}
      onSave={handleSave}
    />
  );
}

// DEPOIS (sistema unificado)
import { UnifiedEditorProvider, EditorUnified } from '@/unified/editor';

function NewComponent() {
  return (
    <UnifiedEditorProvider
      config={{ enableAutoSave: true }}
      onSave={async (data) => {
        // Auto-save automático
        await saveToSupabase(data);
      }}
    >
      <EditorUnified />
    </UnifiedEditorProvider>
  );
}
```

---

## 🎯 **BENEFÍCIOS DO SISTEMA UNIFICADO**

### ✅ **Para Desenvolvedores**

- **1 componente** ao invés de 16+ editores
- **Tipos centralizados** - autocomplete e type safety
- **Estado global** - sem props drilling
- **Auto-save** - sem gestão manual de estado
- **Analytics** - tracking automático

### ✅ **Para Performance**

- **Bundle menor** - código consolidado
- **Menos re-renders** - estado otimizado
- **Lazy loading** - componentes sob demanda
- **Memory efficient** - cleanup automático

### ✅ **Para Manutenção**

- **Código centralizado** - bugs corrigidos uma vez
- **Testes centralizados** - cobertura melhor
- **Documentação única** - fonte de verdade
- **Versionamento claro** - controle de breaking changes

---

## 📈 **PRÓXIMOS PASSOS**

1. **Implementar este exemplo** em uma página de teste
2. **Migrar componente existente** usando o guia acima
3. **Configurar testes** para validar funcionamento
4. **Documentar padrões** específicos do projeto
5. **Treinamento da equipe** nos novos padrões

---

**🚀 O Sistema Unificado está pronto para uso em produção!**
