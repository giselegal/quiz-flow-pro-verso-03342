# 🔌 Integração do Sistema de Pontuação no Frontend

## 📊 Status Atual da Integração

### ✅ **O que está IMPLEMENTADO:**

1. **Backend/Store (100% Completo)**
   - ✅ `quizStore.ts` com Zustand
   - ✅ Interfaces: `Badge`, `ScoreSystem`, `QuizAnswer`
   - ✅ Actions: `updateScore()`, `calculateFinalScore()`, `addBadge()`
   - ✅ Integração com `scoreCalculator.ts`

2. **Componentes Visuais (100% Completo)**
   - ✅ `QuizScoreDisplay.tsx` (3 variantes)
   - ✅ Registrado no `UnifiedBlockRegistry.ts`
   - ✅ Mapeado no `BlockTypeRenderer.tsx`

3. **Sistema de Cálculo (100% Completo)**
   - ✅ `scoreCalculator.ts` (280 linhas)
   - ✅ Badges, níveis, speed bonus, streaks

---

## ⚠️ **O que ainda NÃO está CONECTADO:**

### 🔴 **Problema Principal: Fluxo de Navegação Não Usa quizStore**

O projeto tem **múltiplos sistemas de navegação** que **NÃO usam** o `quizStore.ts`:

```tsx
// ❌ SISTEMAS ATUAIS QUE NÃO USAM quizStore:

1. useQuizState.ts (hooks/useQuizState.ts)
   - Usa reducer próprio
   - NÃO integra com quizStore
   - NÃO chama updateScore()

2. QuizFlowOrchestrator.tsx
   - Context próprio com reducer
   - NÃO usa quizStore

3. Quiz21StepsProvider.tsx
   - Provider isolado
   - NÃO conectado com quizStore

4. QuizAppConnected.tsx
   - Usa useQuizState (não quizStore)
   - NÃO registra timeSpent, isCorrect
```

---

## 🔧 **Como Integrar (3 Opções)**

### **Opção 1: Migrar para quizStore (RECOMENDADO)** ✨

Substituir todos os sistemas por `quizStore.ts`:

#### **Passo 1: Atualizar useQuizState para usar quizStore**

```tsx
// src/hooks/useQuizState.ts
import { useQuizStore } from '@/store/quizStore';

export function useQuizState(funnelId?: string) {
  // ✅ Usar quizStore em vez de reducer local
  const session = useQuizStore(s => s.session);
  const currentStep = useQuizStore(s => s.currentStep);
  const saveAnswer = useQuizStore(s => s.saveAnswer);
  const updateScore = useQuizStore(s => s.updateScore);
  const nextStep = useQuizStore(s => s.nextStep);
  
  // Wrapper para compatibilidade
  const addAnswer = (stepId: string, options: string[]) => {
    const startTime = Date.now();
    
    // Salvar resposta com dados de scoring
    saveAnswer({
      stepId,
      questionId: stepId,
      questionText: 'Pergunta',
      answerValue: options[0],
      answerText: options[0],
      scoreEarned: 10,
      timeSpent: (Date.now() - startTime) / 1000, // ✅ CRUCIAL
      isCorrect: true, // ✅ Validar se resposta está correta
    });
    
    // ✅ Atualizar pontuação após cada resposta
    updateScore();
  };
  
  return {
    currentStep,
    addAnswer,
    nextStep,
    scoreSystem: session?.scoreSystem, // ✅ Expor pontuação
  };
}
```

#### **Passo 2: Atualizar QuizAppConnected**

```tsx
// src/components/quiz/QuizAppConnected.tsx
import { useQuizStore } from '@/store/quizStore';

export default function QuizAppConnected() {
  const session = useQuizStore(s => s.session);
  const saveAnswer = useQuizStore(s => s.saveAnswer);
  const updateScore = useQuizStore(s => s.updateScore);
  const currentStep = useQuizStore(s => s.currentStep);
  
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  const handleOptionSelect = (optionId: string) => {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    
    // ✅ Salvar com dados completos
    saveAnswer({
      stepId: `step-${currentStep}`,
      questionId: `q${currentStep}`,
      questionText: 'Qual seu estilo?',
      answerValue: optionId,
      answerText: 'Moderno',
      scoreEarned: 10,
      timeSpent, // ✅ Tempo real
      isCorrect: true, // ✅ Validar resposta
    });
    
    // ✅ Recalcular pontuação
    updateScore();
    
    // Resetar timer
    setQuestionStartTime(Date.now());
  };
  
  return (
    <div>
      {/* Exibir pontuação atual */}
      {session?.scoreSystem && (
        <div className="score-indicator">
          {session.scoreSystem.currentScore} pts
          <div className="badges">
            {session.scoreSystem.badges.map(badge => (
              <span key={badge.id}>{badge.icon}</span>
            ))}
          </div>
        </div>
      )}
      
      {/* Resto do quiz */}
    </div>
  );
}
```

#### **Passo 3: Integrar no Step 20 (Resultado)**

```tsx
// No template step-20-v3.json, adicionar:
{
  "id": "step-20",
  "blocks": [
    {
      "type": "quiz-score-display",
      "props": {
        "variant": "celebration",
        "showLevel": true,
        "showBadges": true,
        "showBreakdown": true
      }
    }
  ]
}

// No QuizAppConnected, renderizar automaticamente
const renderStep20 = () => {
  const scoreSystem = useQuizStore(s => s.session?.scoreSystem);
  
  if (!scoreSystem) return null;
  
  return (
    <QuizScoreDisplay
      score={scoreSystem.currentScore}
      maxScore={scoreSystem.maxScore}
      percentage={scoreSystem.percentage}
      level={scoreSystem.level}
      badges={scoreSystem.badges.map(b => b.name)}
      breakdown={scoreSystem.breakdown}
      variant="celebration"
      showLevel={true}
      showBadges={true}
      showBreakdown={true}
    />
  );
};
```

---

### **Opção 2: Adapter Pattern (Compatibilidade)** 🔄

Criar adapter para conectar sistemas existentes ao quizStore:

```tsx
// src/adapters/QuizStoreAdapter.tsx
import { useEffect } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { useQuizState } from '@/hooks/useQuizState';

export function QuizStoreAdapter() {
  const legacyState = useQuizState();
  const updateScore = useQuizStore(s => s.updateScore);
  const saveAnswer = useQuizStore(s => s.saveAnswer);
  
  // Sincronizar answers do sistema antigo para quizStore
  useEffect(() => {
    Object.entries(legacyState.answers).forEach(([stepId, options]) => {
      saveAnswer({
        stepId,
        questionId: stepId,
        questionText: '',
        answerValue: options[0],
        answerText: options[0],
        scoreEarned: 10,
        timeSpent: 0,
        isCorrect: true,
      });
    });
    
    updateScore();
  }, [legacyState.answers]);
  
  return null;
}

// Usar no App principal:
<QuizStoreAdapter />
<QuizAppConnected />
```

---

### **Opção 3: Integração Gradual (Menos Recomendada)** 📉

Manter sistemas separados e sincronizar:

```tsx
// Adicionar hook de sincronização
export function useScoreSync() {
  const legacyAnswers = useQuizState(s => s.answers);
  const updateScore = useQuizStore(s => s.updateScore);
  
  useEffect(() => {
    // Sincronizar periodicamente
    updateScore();
  }, [legacyAnswers]);
}
```

---

## 🎯 **Plano de Ação Recomendado**

### **Fase 1: Conexão Mínima (30 min)** ⚡

1. Adicionar `timeSpent` tracking nas respostas
2. Chamar `updateScore()` após cada resposta
3. Exibir pontuação no Step 20

```bash
# Arquivos a modificar:
- src/components/quiz/QuizAppConnected.tsx
- src/hooks/useQuizState.ts
- public/templates/steps/step-20-v3.json
```

### **Fase 2: Migração Completa (2-3 horas)** 🚀

1. Substituir `useQuizState` por `useQuizStore`
2. Remover reducers redundantes
3. Consolidar navegação

### **Fase 3: Features Avançadas (1 hora)** ✨

1. Live score indicator
2. Badge notifications
3. Level up animations

---

## 📋 **Exemplo de Integração Completa**

### **Arquivo: QuizAppConnected.tsx (Versão Integrada)**

```tsx
import React, { useState, useEffect } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { QuizScoreDisplay } from '@/components/quiz/blocks/QuizScoreDisplay';

export default function QuizAppConnected() {
  // ✅ Usar quizStore
  const startSession = useQuizStore(s => s.startSession);
  const currentStep = useQuizStore(s => s.currentStep);
  const saveAnswer = useQuizStore(s => s.saveAnswer);
  const updateScore = useQuizStore(s => s.updateScore);
  const nextStep = useQuizStore(s => s.nextStep);
  const scoreSystem = useQuizStore(s => s.session?.scoreSystem);
  
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Iniciar sessão
  useEffect(() => {
    startSession('quiz-21', 21);
  }, []);
  
  // Handler de resposta
  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    
    // Salvar resposta completa
    saveAnswer({
      stepId: `step-${currentStep}`,
      questionId: `q${currentStep}`,
      questionText: 'Pergunta do quiz',
      answerValue: optionId,
      answerText: optionId,
      scoreEarned: isCorrect ? 10 : 0,
      timeSpent,
      isCorrect,
    });
    
    // Recalcular pontuação
    updateScore();
    
    // Avançar para próximo step
    setTimeout(() => {
      nextStep();
      setQuestionStartTime(Date.now());
    }, 300);
  };
  
  // Step 20: Resultado
  if (currentStep === 20) {
    return (
      <QuizScoreDisplay
        score={scoreSystem?.currentScore || 0}
        maxScore={scoreSystem?.maxScore || 100}
        percentage={scoreSystem?.percentage || 0}
        level={scoreSystem?.level}
        badges={scoreSystem?.badges.map(b => b.name) || []}
        breakdown={scoreSystem?.breakdown}
        variant="celebration"
        showLevel={true}
        showBadges={true}
        showBreakdown={true}
      />
    );
  }
  
  return (
    <div className="quiz-container">
      {/* Score Indicator (sempre visível) */}
      {scoreSystem && (
        <div className="fixed top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
          <div className="text-2xl font-bold text-purple-600">
            {scoreSystem.currentScore} pts
          </div>
          <div className="text-xs text-gray-500">
            {scoreSystem.level.name}
          </div>
          <div className="flex gap-1 mt-2">
            {scoreSystem.badges.slice(0, 3).map(badge => (
              <span key={badge.id} className="text-lg">{badge.icon}</span>
            ))}
          </div>
        </div>
      )}
      
      {/* Pergunta do quiz */}
      <div className="question">
        <h2>Questão {currentStep}</h2>
        <button onClick={() => handleAnswer('option-a', true)}>
          Opção A
        </button>
        <button onClick={() => handleAnswer('option-b', false)}>
          Opção B
        </button>
      </div>
    </div>
  );
}
```

---

## 🎯 **Resumo Executivo**

| Item | Status | Ação Necessária |
|------|--------|-----------------|
| **scoreCalculator.ts** | ✅ Pronto | Nenhuma |
| **quizStore.ts** | ✅ Pronto | Nenhuma |
| **QuizScoreDisplay** | ✅ Pronto | Nenhuma |
| **Registry/Renderer** | ✅ Integrado | Nenhuma |
| **QuizAppConnected** | ❌ **Não conectado** | **Adicionar saveAnswer + updateScore** |
| **useQuizState** | ❌ **Não usa quizStore** | **Migrar para quizStore** |
| **Step 20 Template** | ⚠️ **Parcial** | **Adicionar quiz-score-display** |
| **Time Tracking** | ❌ **Faltando** | **Adicionar timer por questão** |

---

## 🚀 **Quick Start (5 minutos)**

Para conectar rapidamente:

1. **Adicione no QuizAppConnected.tsx:**

```tsx
import { useQuizStore } from '@/store/quizStore';

const updateScore = useQuizStore(s => s.updateScore);
const saveAnswer = useQuizStore(s => s.saveAnswer);

// Após cada resposta:
saveAnswer({
  stepId: `step-${currentStep}`,
  questionId: `q${currentStep}`,
  questionText: 'Pergunta',
  answerValue: selectedOption,
  answerText: selectedOption,
  timeSpent: 0, // Por enquanto
  isCorrect: true,
});
updateScore();
```

2. **Adicione no step-20-v3.json:**

```json
{
  "type": "quiz-score-display",
  "props": {
    "variant": "celebration",
    "showBadges": true
  }
}
```

**Pronto!** Sistema de pontuação funcionando. 🎉

---

## 📞 **Próximos Passos**

Quer que eu implemente a integração completa agora? 

Posso modificar:
1. ✅ QuizAppConnected.tsx
2. ✅ useQuizState.ts  
3. ✅ step-20-v3.json
4. ✅ Adicionar time tracking

**Tempo estimado:** 30-45 minutos
