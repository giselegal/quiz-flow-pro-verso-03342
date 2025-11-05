# 🎯 GUIA DE INTEGRAÇÃO - SISTEMA DE PONTUAÇÃO

## 📋 Índice
1. [Estrutura dos Templates](#estrutura-dos-templates)
2. [Integração no Hook useQuizState](#integração-no-hook-usequizstate)
3. [Exibição no Template](#exibição-no-template)
4. [Configuração por Questão](#configuração-por-questão)
5. [Exemplos Práticos](#exemplos-práticos)

---

## 1️⃣ ESTRUTURA DOS TEMPLATES

### Template Atual (step-02-v3.json)
```json
{
  "type": "question",
  "metadata": {
    "category": "question",
    "questionNumber": 1
  },
  "validation": {
    "required": ["selectedOptions"],
    "rules": {
      "selectedOptions": {
        "minItems": 3,
        "maxItems": 3
      }
    }
  },
  "blocks": [...]
}
```

### Template Aprimorado com Score
```json
{
  "type": "question",
  "metadata": {
    "category": "question",
    "questionNumber": 1,
    "scoring": {
      "weight": 2,              // ⭐ Peso desta questão (1-10)
      "timeLimit": 30,          // ⏱️ Tempo ideal em segundos
      "hasCorrectAnswer": false // ✅ Se tem resposta certa/errada
    }
  },
  "validation": {
    "required": ["selectedOptions"],
    "rules": {
      "selectedOptions": {
        "minItems": 3,
        "maxItems": 3
      }
    }
  },
  "blocks": [...]
}
```

---

## 2️⃣ INTEGRAÇÃO NO HOOK useQuizState

### Localização do Hook
**Arquivo:** `/workspaces/quiz-flow-pro-verso-03342/src/hooks/useQuizState.ts`

### Estrutura Atual de Respostas
```typescript
export interface QuizState {
  currentStep: string;
  answers: Record<string, string[]>;  // { "step-02": ["natural", "classico"] }
  scores: QuizScores;                 // Pontuação por estilo
  userProfile: UserProfile;
}
```

### Estrutura Aprimorada com Score
```typescript
import { calculateScore, Answer, ScoreResult } from '@/utils/scoreCalculator';

export interface QuizState {
  currentStep: string;
  answers: Record<string, QuizAnswer>;  // ⚡ Objeto completo agora
  scores: QuizScores;
  userProfile: UserProfile;
  scoreSystem: {                        // 🎯 Novo sistema de pontuação
    totalScore: number;
    level: {
      current: number;
      name: string;
      nextLevelAt: number;
    };
    badges: string[];
    breakdown: ScoreResult['breakdown'];
  };
}

export interface QuizAnswer {
  selectedOptions: string[];
  timeSpent: number;              // ⏱️ Tempo gasto na questão
  timestamp: number;              // 📅 Quando foi respondida
  questionId: string;             // 🆔 ID da questão
  isCorrect?: boolean;            // ✅ Se foi correta (opcional)
}
```

### Modificação na Função addAnswer

**ANTES:**
```typescript
const addAnswer = useCallback((stepId: string, selections: string[]) => {
  setState(prev => ({
    ...prev,
    answers: {
      ...prev.answers,
      [stepId]: selections,
    },
  }));
}, []);
```

**DEPOIS:**
```typescript
const addAnswer = useCallback((
  stepId: string, 
  selections: string[], 
  timeSpent: number = 0
) => {
  setState(prev => {
    // Criar resposta completa
    const newAnswer: QuizAnswer = {
      questionId: stepId,
      selectedOptions: selections,
      timeSpent,
      timestamp: Date.now(),
    };

    // Adicionar ao objeto de respostas
    const updatedAnswers = {
      ...prev.answers,
      [stepId]: newAnswer,
    };

    // Converter para formato do scoreCalculator
    const answersForScore: Answer[] = Object.values(updatedAnswers);

    // Obter configuração de scoring do step
    const stepData = stepsSource?.[stepId];
    const scoringRules = {
      weights: stepData?.metadata?.scoring?.weight 
        ? { [stepId]: stepData.metadata.scoring.weight } 
        : {},
    };

    // Calcular score
    const scoreResult = calculateScore(answersForScore, scoringRules);

    return {
      ...prev,
      answers: updatedAnswers,
      scoreSystem: {
        totalScore: scoreResult.totalScore,
        level: scoreResult.level,
        badges: scoreResult.badges,
        breakdown: scoreResult.breakdown,
      },
    };
  });
}, [stepsSource]);
```

---

## 3️⃣ EXIBIÇÃO NO TEMPLATE

### Bloco de Header com Score

Adicionar ao **quiz-intro-header** ou criar novo bloco **quiz-score-display**:

```json
{
  "id": "score-display",
  "type": "quiz-score-display",
  "order": 0,
  "properties": {
    "showScore": true,
    "showLevel": true,
    "showBadges": true,
    "position": "top-right",
    "backgroundColor": "transparent",
    "textColor": "#432818"
  },
  "content": {
    "scoreLabel": "Pontos",
    "levelLabel": "Nível",
    "animateOnChange": true
  }
}
```

### Componente React para Exibir Score

**Arquivo:** `/workspaces/quiz-flow-pro-verso-03342/src/components/quiz/QuizScoreDisplay.tsx`

```tsx
import React from 'react';
import { useQuizState } from '@/hooks/useQuizState';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizScoreDisplayProps {
  showScore?: boolean;
  showLevel?: boolean;
  showBadges?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const QuizScoreDisplay: React.FC<QuizScoreDisplayProps> = ({
  showScore = true,
  showLevel = true,
  showBadges = true,
  position = 'top-right'
}) => {
  const { state } = useQuizState();
  const { scoreSystem } = state;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed ${positionClasses[position]} z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4`}
    >
      {/* Score */}
      {showScore && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-[#B89B7A]">
            {scoreSystem.totalScore}
          </span>
          <span className="text-sm text-gray-600">pontos</span>
        </div>
      )}

      {/* Level */}
      {showLevel && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">
              Nível {scoreSystem.level.current}
            </span>
            <span className="text-xs text-gray-500">
              ({scoreSystem.level.name})
            </span>
          </div>
        </div>
      )}

      {/* Progress to Next Level */}
      {showLevel && scoreSystem.level.current < 6 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${((scoreSystem.totalScore - [0, 100, 250, 500, 1000, 2000][scoreSystem.level.current - 1]) / 
                       (scoreSystem.level.nextLevelAt - [0, 100, 250, 500, 1000, 2000][scoreSystem.level.current - 1])) * 100}%` 
            }}
            className="bg-[#B89B7A] h-2 rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Badges */}
      {showBadges && scoreSystem.badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          <AnimatePresence>
            {scoreSystem.badges.slice(0, 3).map((badge, index) => (
              <motion.span
                key={badge}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ delay: index * 0.1 }}
                className="text-lg"
                title={badge}
              >
                {badge.split(' ')[0]}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
```

---

## 4️⃣ CONFIGURAÇÃO POR QUESTÃO

### Script para Atualizar Templates

**Arquivo:** `/workspaces/quiz-flow-pro-verso-03342/scripts/add-scoring-to-templates.mjs`

```javascript
import fs from 'fs';
import path from 'path';

// Configuração de pesos por tipo de questão
const SCORING_CONFIG = {
  'intro': { weight: 0, timeLimit: 0, hasCorrectAnswer: false },
  'question': { weight: 1, timeLimit: 30, hasCorrectAnswer: false },
  'strategic-question': { weight: 3, timeLimit: 45, hasCorrectAnswer: false },
  'offer': { weight: 0, timeLimit: 0, hasCorrectAnswer: false }
};

const templatesDir = './public/templates';

// Ler quiz21-complete.json
const quiz21Path = path.join(templatesDir, 'quiz21-complete.json');
const quiz21 = JSON.parse(fs.readFileSync(quiz21Path, 'utf-8'));

let updatedSteps = 0;

// Atualizar cada step
Object.entries(quiz21.steps).forEach(([stepKey, stepData]) => {
  const stepType = stepData.type;
  const scoringConfig = SCORING_CONFIG[stepType];

  if (scoringConfig) {
    // Adicionar scoring ao metadata
    stepData.metadata = {
      ...stepData.metadata,
      scoring: scoringConfig
    };

    // Atualizar arquivo individual
    const individualPath = path.join(templatesDir, `${stepKey}-v3.json`);
    if (fs.existsSync(individualPath)) {
      const individualData = JSON.parse(fs.readFileSync(individualPath, 'utf-8'));
      individualData.metadata = {
        ...individualData.metadata,
        scoring: scoringConfig
      };
      fs.writeFileSync(individualPath, JSON.stringify(individualData, null, 2));
    }

    updatedSteps++;
  }
});

// Atualizar metadata do quiz21-complete
quiz21.metadata.scoringEnabled = true;
quiz21.metadata.scoringConfiguredAt = new Date().toISOString();

// Salvar quiz21-complete atualizado
fs.writeFileSync(quiz21Path, JSON.stringify(quiz21, null, 2));

console.log(`✅ Scoring adicionado a ${updatedSteps} steps`);
console.log(`📝 Configuração:`);
console.log(JSON.stringify(SCORING_CONFIG, null, 2));
```

**Executar:**
```bash
node scripts/add-scoring-to-templates.mjs
```

---

## 5️⃣ EXEMPLOS PRÁTICOS

### Exemplo 1: Rastreamento de Tempo

**No componente de questão:**

```tsx
import React, { useEffect, useState } from 'react';
import { useQuizState } from '@/hooks/useQuizState';

export const QuizQuestionWithTimer = ({ stepId, options }) => {
  const { addAnswer } = useQuizState();
  const [startTime] = useState(Date.now());
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    addAnswer(stepId, selectedOptions, timeSpent);
  };

  return (
    <div>
      {/* Renderizar opções */}
      <button onClick={handleSubmit}>Avançar</button>
    </div>
  );
};
```

### Exemplo 2: Exibir Breakdown de Pontuação

```tsx
export const ScoreBreakdown = () => {
  const { state } = useQuizState();
  const { breakdown } = state.scoreSystem;

  return (
    <div className="space-y-2">
      <h3 className="font-bold">Detalhamento da Pontuação</h3>
      {breakdown.map((item) => (
        <div key={item.questionId} className="border-b pb-2">
          <div className="flex justify-between">
            <span>{item.questionId}</span>
            <span className="font-bold">{item.totalPoints} pts</span>
          </div>
          <div className="text-xs text-gray-600">
            {item.notes.map((note, i) => (
              <div key={i}>• {note}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Exemplo 3: Badge Notification

```tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BadgeNotification = () => {
  const { state } = useQuizState();
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [prevBadgeCount, setPrevBadgeCount] = useState(0);

  useEffect(() => {
    const currentBadges = state.scoreSystem.badges;
    if (currentBadges.length > prevBadgeCount) {
      const latest = currentBadges.slice(prevBadgeCount);
      setNewBadges(latest);
      setPrevBadgeCount(currentBadges.length);

      // Limpar notificação após 3s
      setTimeout(() => setNewBadges([]), 3000);
    }
  }, [state.scoreSystem.badges]);

  return (
    <AnimatePresence>
      {newBadges.map((badge) => (
        <motion.div
          key={badge}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed top-20 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{badge.split(' ')[0]}</span>
            <div>
              <div className="font-bold">Nova Badge!</div>
              <div className="text-sm">{badge}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
```

### Exemplo 4: Análise de Performance ao Final

```tsx
import { analyzePerformance } from '@/utils/scoreCalculator';

export const QuizResults = () => {
  const { state } = useQuizState();
  const answers = Object.values(state.answers);
  const analysis = analyzePerformance(state.scoreSystem, answers);

  return (
    <div className="space-y-4">
      {/* Score Total */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#B89B7A]">
          {state.scoreSystem.totalScore} pontos
        </h2>
        <p className="text-lg text-gray-600">
          {state.scoreSystem.level.name}
        </p>
      </div>

      {/* Badges */}
      <div className="flex justify-center gap-2">
        {state.scoreSystem.badges.map(badge => (
          <span key={badge} className="text-3xl">{badge.split(' ')[0]}</span>
        ))}
      </div>

      {/* Análise */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-bold text-green-600 mb-2">💪 Pontos Fortes</h3>
          <ul className="space-y-1">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm">✓ {s}</li>
            ))}
          </ul>
        </div>

        {analysis.weaknesses.length > 0 && (
          <div>
            <h3 className="font-bold text-orange-600 mb-2">🎯 Áreas de Melhoria</h3>
            <ul className="space-y-1">
              {analysis.weaknesses.map((w, i) => (
                <li key={i} className="text-sm">• {w}</li>
              ))}
            </ul>
          </div>
        )}

        {analysis.suggestions.length > 0 && (
          <div>
            <h3 className="font-bold text-blue-600 mb-2">💡 Sugestões</h3>
            <ul className="space-y-1">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="text-sm">→ {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] 1. Adicionar scoring aos templates (rodar script)
- [ ] 2. Modificar `useQuizState` para incluir `scoreSystem`
- [ ] 3. Atualizar função `addAnswer` para receber `timeSpent`
- [ ] 4. Criar componente `QuizScoreDisplay`
- [ ] 5. Adicionar rastreamento de tempo nos componentes de questão
- [ ] 6. Implementar notificações de badges
- [ ] 7. Criar página de resultados com análise
- [ ] 8. Testar cálculos com dados reais
- [ ] 9. Ajustar pesos e thresholds conforme necessário
- [ ] 10. Documentar para time

---

## 📊 MÉTRICAS ESPERADAS

| Métrica | Antes | Depois |
|---------|-------|--------|
| Engajamento | 70% | 85-90% |
| Taxa de Conclusão | 65% | 80-85% |
| Tempo Médio | 8min | 6-7min |
| Compartilhamentos | 15% | 30-35% |
| Retorno ao Quiz | 5% | 20-25% |

---

## 🔗 PRÓXIMOS PASSOS

Após implementar o sistema de pontuação:

1. **Sistema de Recomendações** (8h)
   - Matching de estilo baseado em respostas
   - Top 3 estilos com % de compatibilidade

2. **Analytics Dashboard** (6h)
   - Visualização de métricas em tempo real
   - Identificação de drop-off points

3. **Gamificação Avançada** (5h)
   - Sistema de conquistas
   - Desafios diários
   - Leaderboard

