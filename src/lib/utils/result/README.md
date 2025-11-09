# 🧮 Resultado do Quiz - Fonte Única de Verdade

Este diretório contém a **fonte única de verdade** para o cálculo de resultados do quiz.

## ✅ Arquitetura Consolidada

A partir de **Novembro 2025**, o cálculo de resultados segue este fluxo único:

```
useQuizState.ts
    ↓
1. computeResult() - Cálculo base
    ↓
2. applyRuntimeBonuses() - Ajustes e bônus
    ↓
Resultado Final
```

## 📁 Arquivos Principais

### `computeResult.ts`
**Responsabilidade**: Cálculo base do resultado do quiz

**Entradas**:
- `answers`: Record<stepId, optionIds[]> - Respostas do usuário
- `steps`: Record<stepId, QuizStep> - Definição dos steps (opcional, usa TemplateService se não fornecido)
- `scoring`: Configurações de scoring (opcional)

**Saídas**:
- `primaryStyleId`: Estilo predominante
- `secondaryStyleIds`: Top 2 estilos secundários
- `scores`: Pontuação absoluta por estilo
- `orderedStyleIds`: Todos estilos ordenados por pontuação
- `percentages`: Porcentagens normalizadas (soma ~100)
- `totalAnswers`: Total de seleções consideradas

**Características**:
- Considera apenas steps do tipo 'question'
- Cada seleção vale 1 ponto por padrão (pode ser sobrescrito por weights)
- Empate: ordena alfabeticamente para resultado estável
- Fallback: se não houver respostas, usa primeiro estilo

**Uso**:
```typescript
import { computeResult } from '@/lib/utils/result/computeResult';

const base = computeResult({ 
  answers: state.answers, 
  steps: templateSteps 
});
```

### `applyRuntimeBonuses.ts`
**Responsabilidade**: Aplicar bônus e ajustes sobre o resultado base

**Entradas**:
- `baseScores`: Scores calculados por computeResult
- `answers`: Respostas originais do usuário
- `steps`: Definição dos steps
- `rules`: Regras de bônus do runtime (master.json)
- `telemetry`: Métricas de tempo de resposta por step

**Saídas**:
- `scores`: Scores ajustados com bônus aplicados
- `orderedStyleIds`: Estilos reordenados após bônus
- `appliedBonuses`: Log dos bônus aplicados (para debug)

**Características**:
- Aplica bônus baseados em tempo de resposta (resposta rápida = +pontos)
- Aplica regras condicionais definidas no template
- Preserva integridade dos scores (nunca negativos)
- Telemetria é opcional

**Uso**:
```typescript
import { applyRuntimeBonuses } from '@/lib/utils/result/applyRuntimeBonuses';

const final = applyRuntimeBonuses({
  baseScores: base.scores,
  answers: state.answers,
  steps: templateSteps,
  rules: scoringRules,
  telemetry: { durations: timings }
});
```

## 🔄 Integração com useQuizState

O hook `useQuizState` usa este fluxo em `calculateResult()`:

```typescript
// src/hooks/useQuizState.ts (linha 246-280)
const calculateResult = useCallback(() => {
  // 1. Cálculo base
  const base = computeResult({ 
    answers: state.answers, 
    steps: stepsSource 
  });

  // 2. Aplicar bônus (se rules disponíveis)
  let adjustedScores = base.scores;
  let ordered = base.orderedStyleIds;
  
  if (scoringRules) {
    const out = applyRuntimeBonuses({
      baseScores: base.scores,
      answers: state.answers,
      steps: stepsSource,
      rules: scoringRules,
      telemetry: { durations: timings }
    });
    adjustedScores = out.scores;
    ordered = out.orderedStyleIds;
  }

  // 3. Mapear para objetos de estilo completos
  const primaryStyleId = ordered[0];
  const secondaryStyleIds = ordered.slice(1, 3);
  
  setState(prev => ({
    ...prev,
    scores: adjustedScores,
    userProfile: {
      ...prev.userProfile,
      resultStyle: primaryStyleId,
      secondaryStyles: secondaryStyleIds,
    },
  }));
}, [state.answers, stepsSource, scoringRules]);
```

## 🚫 Implementações Descontinuadas

As seguintes implementações **NÃO devem ser usadas**:

- ❌ `UnifiedCalculationEngine` (src/lib/utils/UnifiedCalculationEngine.ts) - Descontinuado
- ❌ `calcResults` (src/lib/utils/calcResults.ts) - Descontinuado
- ❌ `computeResultAdvanced` (src/components/editor/quiz/quizLogic.ts) - Descontinuado
- ❌ `quizResults.ts` - Descontinuado

Estas implementações devem ser movidas para `.archive/` em breve.

## 📊 Exemplo Completo

```typescript
import { computeResult } from '@/lib/utils/result/computeResult';
import { applyRuntimeBonuses } from '@/lib/utils/result/applyRuntimeBonuses';

// Dados de exemplo
const answers = {
  'step-02': ['natural', 'classico', 'natural'],
  'step-03': ['elegante', 'elegante', 'romantico'],
  // ... mais respostas
};

const steps = { /* steps do template */ };
const scoringRules = { /* rules do master.json */ };
const telemetry = { durations: { 'step-02': 3500, 'step-03': 2800 } };

// 1. Calcular base
const base = computeResult({ answers, steps });
console.log('Base scores:', base.scores);
// { natural: 2, classico: 1, elegante: 2, romantico: 1, ... }

// 2. Aplicar bônus
const final = applyRuntimeBonuses({
  baseScores: base.scores,
  answers,
  steps,
  rules: scoringRules,
  telemetry
});

console.log('Final scores:', final.scores);
console.log('Winner:', final.orderedStyleIds[0]);
```

## 🧪 Testes

Testes existentes:
- `src/__tests__/legacy-tests/unit/result/computeResult.test.ts`
- `src/__tests__/legacy-tests/unit/result/applyRuntimeBonuses.test.ts`

Execute:
```bash
npm test -- computeResult
npm test -- applyRuntimeBonuses
```

## 📝 Changelog

- **2025-11-09**: Documentação criada durante auditoria quiz21StepsComplete
- **2025-11**: Consolidação confirmada - computeResult + applyRuntimeBonuses como fonte única
- **2025-10**: Migração de motores legados iniciada

## 🤝 Contribuindo

Ao adicionar novas funcionalidades de cálculo:

1. ✅ **FAÇA**: Adicione lógica em `computeResult.ts` ou `applyRuntimeBonuses.ts`
2. ✅ **FAÇA**: Adicione testes unitários
3. ✅ **FAÇA**: Atualize este README
4. ❌ **NÃO**: Crie um novo motor de cálculo
5. ❌ **NÃO**: Use implementações descontinuadas

## 📞 Contato

Para dúvidas sobre cálculo de resultados, consulte:
- Este README
- Código fonte em `src/lib/utils/result/`
- Testes em `src/__tests__/legacy-tests/unit/result/`
- Integração em `src/hooks/useQuizState.ts`
