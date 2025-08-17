# 🔗 GUIA DE IMPLEMENTAÇÃO COMPLETA - INTEGRAÇÃO TEMPLATES-HOOKS-SUPABASE

## ✅ **STATUS ATUAL - IMPLEMENTADO**

### **🏗️ COMPONENTES PRINCIPAIS CRIADOS:**

1. **ConnectedTemplateWrapper.tsx (6KB)**
   - Event bridge que conecta UI aos hooks centrais
   - Escuta `quiz-form-complete`, `quiz-selection-change`
   - Chama métodos do `useQuizLogic` e `useSupabaseQuiz`
   - Gerencia fluxo por tipo de etapa (intro, question, strategic, result)

2. **ConnectedLeadForm.tsx (5KB)**
   - Formulário inteligente para captura de nome (Step 1)
   - Validação em tempo real
   - Dispara eventos customizados para integração
   - UX otimizada com feedback visual

3. **Templates Conectados:**
   - `Step01Template.tsx` - Integrado com ConnectedLeadForm
   - `Step02TemplateConnected.tsx` - Exemplo completo de questão
   - `Step20Result.tsx` - Modificado para usar useQuizLogic.quizResult

### **🔄 FLUXO DE DADOS FUNCIONANDO:**

```mermaid
graph TD
    A[Step 1: Nome] --> B[ConnectedLeadForm]
    B --> C[quiz-form-complete event]
    C --> D[ConnectedTemplateWrapper]
    D --> E[useQuizLogic.setUserNameFromInput()]

    F[Step 2-11: Questões] --> G[OptionsGrid]
    G --> H[quiz-selection-change event]
    H --> D
    D --> I[useQuizLogic.answerQuestion()]

    J[Step 19-21: Resultado] --> D
    D --> K[useQuizLogic.completeQuiz()]
    K --> L[Cálculo automático de scores]
```

## 🎯 **PRÓXIMOS PASSOS - IMPLEMENTAÇÃO**

### **PRIORIDADE 1: Conectar Steps 3-19**

Para cada Step template restante, seguir o padrão do `Step02TemplateConnected.tsx`:

#### **1. Criar Template Conectado:**

```typescript
// src/components/steps/Step[XX]TemplateConnected.tsx
import ConnectedTemplateWrapper from '@/components/quiz/ConnectedTemplateWrapper';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';

const Step[XX]TemplateConnected: React.FC<{sessionId: string, onNext?: () => void}> = ({ sessionId, onNext }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Determinar stepType baseado no número
  const stepType = stepNumber <= 11 ? 'question' : stepNumber <= 18 ? 'strategic' : 'result';

  const handleOptionSelect = (optionId: string) => {
    const newSelected = /* lógica de seleção */;
    setSelectedOptions(newSelected);

    // Disparar evento para ConnectedTemplateWrapper
    window.dispatchEvent(
      new CustomEvent('quiz-selection-change', {
        detail: {
          blockId: `step${stepNumber.toString().padStart(2, '0')}-options-grid`,
          selectedOptions: newSelected,
          isValid: newSelected.length >= minRequired,
          minSelections: minRequired,
          maxSelections: maxAllowed,
        },
      })
    );
  };

  return (
    <ConnectedTemplateWrapper
      stepNumber={[XX]}
      stepType={stepType}
      sessionId={sessionId}
    >
      {/* Conteúdo da questão */}
    </ConnectedTemplateWrapper>
  );
};
```

#### **2. Mapear Opções com Pontuação:**

Para cada step, definir opções baseadas no JSON template correspondente:

```typescript
const options = [
  {
    id: 'option-id',
    text: 'Texto da opção',
    imageUrl: 'URL da imagem',
    category: 'Categoria do estilo', // Natural, Clássico, etc.
    points: 1, // Pontuação para cálculo
  },
  // ... mais opções
];
```

### **PRIORIDADE 2: Automatizar Conversão JSON → TSX**

#### **1. Criar Conversor Automático:**

```typescript
// src/utils/templateConverter.ts
export const convertJsonToConnectedTemplate = (jsonTemplate: any, stepNumber: number) => {
  const stepType = getStepType(stepNumber);
  const options = extractOptions(jsonTemplate);

  return generateConnectedTemplate(stepNumber, stepType, options);
};

const getStepType = (stepNumber: number): 'intro' | 'question' | 'strategic' | 'result' => {
  if (stepNumber === 1) return 'intro';
  if (stepNumber <= 11) return 'question';
  if (stepNumber <= 18) return 'strategic';
  return 'result';
};
```

#### **2. Integrar com TemplateManager:**

```typescript
// Modificar TemplateManager para usar templates conectados
export class TemplateManager {
  static async loadConnectedTemplate(stepId: string): Promise<ConnectedTemplateComponent> {
    const jsonTemplate = await this.loadStepBlocks(stepId);
    return convertJsonToConnectedTemplate(jsonTemplate, getStepNumber(stepId));
  }
}
```

### **PRIORIDADE 3: Ativar Persistência Supabase**

#### **1. Conectar useSupabaseQuiz em ConnectedTemplateWrapper:**

```typescript
// No ConnectedTemplateWrapper.tsx
const handleNameCapture = useCallback(async (event: CustomEvent) => {
  const { formData } = event.detail;

  // Conectar ao useQuizLogic (já feito)
  quizLogic.setUserNameFromInput(formData.name);

  // ✅ ATIVAR: Iniciar sessão no Supabase
  await supabaseQuiz.startQuiz({
    name: formData.name,
    email: formData.email || '',
    quizId: sessionId,
  });
}, []);

const handleQuestionAnswer = useCallback(async (event: CustomEvent) => {
  const { selectedOptions } = event.detail;

  // Processar cada resposta
  for (const optionId of selectedOptions) {
    quizLogic.answerQuestion(questionId, optionId);

    // ✅ ATIVAR: Salvar no Supabase
    await supabaseQuiz.saveAnswer(questionId, optionId);
  }
}, []);
```

#### **2. Completar Integração no Step20:**

```typescript
// No Step20Result.tsx - já parcialmente implementado
useEffect(() => {
  if (quizResult && answers.length > 0) {
    // ✅ ATIVAR: Salvar resultado final no Supabase
    supabaseQuiz.completeQuiz().then(result => {
      console.log('✅ Resultado salvo no Supabase:', result);
    });
  }
}, [quizResult, answers.length]);
```

### **PRIORIDADE 4: Testes e Validação**

#### **1. Teste de Fluxo Completo:**

```bash
# Abrir navegador em modo desenvolvimento
npm run dev

# Testar sequência:
# 1. Step01: Inserir nome → verificar console.log
# 2. Step02: Selecionar opções → verificar eventos
# 3. Step20: Verificar se resultado aparece automaticamente
```

#### **2. Debug em Navegador:**

```javascript
// Console do navegador para debug
window.addEventListener('quiz-form-complete', e => {
  console.log('🎯 Nome capturado:', e.detail);
});

window.addEventListener('quiz-selection-change', e => {
  console.log('📊 Seleção mudou:', e.detail);
});

// Verificar estado do useQuizLogic
// (disponível via React DevTools)
```

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **Fase 1: Templates Conectados (Steps 3-19)**

- [ ] Step03TemplateConnected - Questão 2
- [ ] Step04TemplateConnected - Questão 3
- [ ] Step05TemplateConnected - Questão 4
- [ ] Step06TemplateConnected - Questão 5
- [ ] Step07TemplateConnected - Questão 6
- [ ] Step08TemplateConnected - Questão 7
- [ ] Step09TemplateConnected - Questão 8
- [ ] Step10TemplateConnected - Questão 9
- [ ] Step11TemplateConnected - Questão 10
- [ ] Step12TemplateConnected - Estratégica 1
- [ ] Step13TemplateConnected - Estratégica 2
- [ ] Step14TemplateConnected - Estratégica 3
- [ ] Step15TemplateConnected - Estratégica 4
- [ ] Step16TemplateConnected - Estratégica 5
- [ ] Step17TemplateConnected - Estratégica 6
- [ ] Step18TemplateConnected - Estratégica 7
- [ ] Step19TemplateConnected - Cálculo inicial

### **Fase 2: Automação**

- [ ] Conversor JSON → TSX automático
- [ ] Integração com TemplateManager
- [ ] Gerador de templates baseado em configuração

### **Fase 3: Supabase Completo**

- [ ] Ativar persistência em ConnectedTemplateWrapper
- [ ] Completar integração Step20Result
- [ ] Testar salvamento/carregamento de dados
- [ ] Implementar cache local para offline

### **Fase 4: Testes e Otimização**

- [ ] Testes unitários para ConnectedTemplateWrapper
- [ ] Testes de integração E2E
- [ ] Performance optimization
- [ ] Error handling e fallbacks

## 🎯 **RESULTADO ESPERADO**

Após implementação completa:

1. **Usuário insere nome (Step 1)** → Salvo no useQuizLogic + Supabase
2. **Usuário responde questões (Steps 2-11)** → Respostas acumuladas para cálculo
3. **Usuário responde estratégicas (Steps 12-18)** → Dados complementares coletados
4. **Sistema calcula resultado (Steps 19-21)** → Scores calculados automaticamente + Supabase
5. **Usuário vê resultado personalizado** → Com nome e dados reais do quiz

**Integração 100% funcional entre Templates TSX, JSON, Hooks e Supabase! ✅**
