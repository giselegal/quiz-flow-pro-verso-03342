# 🎯 FLUXO VISUAL - Sistema de Pontuação

## 📊 ARQUITETURA DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                        TEMPLATES (JSON)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  step-02     │  │  step-03     │  │  step-14     │         │
│  │  weight: 1   │  │  weight: 1   │  │  weight: 3   │         │
│  │  time: 30s   │  │  time: 30s   │  │  time: 45s   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     COMPONENTE DE QUESTÃO                       │
│                                                                 │
│  Timer Start: Date.now() ⏱️                                    │
│  ↓                                                              │
│  [Usuário seleciona opções]                                    │
│  ↓                                                              │
│  Timer End: Date.now()                                         │
│  timeSpent = (end - start) / 1000                              │
│                                                                 │
│  handleSubmit() → addAnswer(stepId, selections, timeSpent)     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    HOOK: useQuizState                           │
│                                                                 │
│  addAnswer(stepId, selections, timeSpent) {                    │
│    1. Criar QuizAnswer object                                  │
│    2. Atualizar estado.answers                                 │
│    3. Chamar calculateScore(allAnswers)                        │
│    4. Atualizar estado.scoreSystem                             │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  UTILS: scoreCalculator.ts                      │
│                                                                 │
│  calculateScore(answers, rules) {                              │
│    ├─ Calcular pontos base (weight × 10)                       │
│    ├─ Adicionar speed bonus (< 15s = +5)                       │
│    ├─ Multiplicar streak (3+ = 1.5x)                           │
│    ├─ Desbloquear badges                                       │
│    ├─ Calcular nível (XP thresholds)                           │
│    └─ Retornar ScoreResult                                     │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      UI COMPONENTS                              │
│                                                                 │
│  QuizScoreDisplay (header):                                    │
│  ┌─────────────────────────────────────────────────┐           │
│  │ 250 pts    Nível 3 · Explorador    🔥💎⚡      │           │
│  │ ████████░░ 80% para Nível 4                    │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  BadgeNotification (popup):                                    │
│  ┌──────────────────────────┐                                  │
│  │ 🔥 Nova Badge!           │                                  │
│  │ Hot Streak               │                                  │
│  │ 5 acertos consecutivos   │                                  │
│  └──────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE DADOS DETALHADO

### 1. Início do Quiz
```
Estado Inicial:
{
  scoreSystem: {
    totalScore: 0,
    level: { current: 1, name: 'Iniciante', nextLevelAt: 100 },
    badges: [],
    breakdown: []
  },
  answers: {}
}
```

### 2. Questão 1 (step-02)
```
Componente:
┌─────────────────────────────────────┐
│ Q1: Qual seu tipo de roupa favorita?│
│                                     │
│ ⏱️ 12s                              │
│                                     │
│ [x] Natural   [ ] Clássico         │
│ [x] Elegante  [x] Romântico        │
│                                     │
│ [Avançar]                           │
└─────────────────────────────────────┘

Ao clicar Avançar:
addAnswer('step-02', ['natural', 'elegante', 'romantico'], 12)

Cálculo:
- Base: 10 pts (weight 1)
- Speed: +5 pts (12s < 15s)
- Total: 15 pts

Estado Atualizado:
{
  totalScore: 15,
  level: { current: 1, name: 'Iniciante', nextLevelAt: 100 },
  badges: [],
  answers: {
    'step-02': {
      questionId: 'step-02',
      selectedOptions: ['natural', 'elegante', 'romantico'],
      timeSpent: 12,
      timestamp: 1699200000000
    }
  }
}
```

### 3. Questão 2 (step-03)
```
⏱️ 10s

addAnswer('step-03', ['option1', 'option2'], 10)

Cálculo:
- Base: 10 pts
- Speed: +5 pts (10s < 15s)
- Total questão: 15 pts
- TOTAL ACUMULADO: 30 pts

Estado:
{
  totalScore: 30,
  level: { current: 1, name: 'Iniciante', nextLevelAt: 100 },
  badges: []
}
```

### 4. Questão 3 (step-04)
```
⏱️ 11s

addAnswer('step-04', ['optionA'], 11)

Cálculo:
- Base: 10 pts
- Speed: +5 pts
- Streak: +5 pts (3 acertos rápidos consecutivos)
- Total questão: 20 pts
- TOTAL: 50 pts

Estado:
{
  totalScore: 50,
  level: { current: 1, name: 'Iniciante', nextLevelAt: 100 },
  badges: [] // Ainda não atingiu 5 para Hot Streak
}
```

### 5. Questão 5 (step-06) - Badge Desbloqueada!
```
⏱️ 13s

Cálculo:
- Base: 10 pts
- Speed: +5 pts
- Streak: +7 pts (5 acertos = 1.5x multiplier)
- Total: 22 pts
- ACUMULADO: 92 pts

🏆 BADGE DESBLOQUEADA!

Estado:
{
  totalScore: 92,
  level: { current: 1, name: 'Iniciante', nextLevelAt: 100 },
  badges: ['🔥 Hot Streak'] // ← NOVO!
}

UI mostra:
┌──────────────────────────┐
│ 🔥 Nova Badge!           │
│ Hot Streak               │
│ 5 acertos consecutivos   │
└──────────────────────────┘
```

### 6. Questão 10 (step-11)
```
⏱️ 28s (sem speed bonus)

Cálculo:
- Base: 10 pts
- Speed: 0 (28s > 15s)
- Streak: RESETADO (não foi rápido)
- Total: 10 pts
- ACUMULADO: 182 pts

Estado:
{
  totalScore: 182,
  level: { current: 2, name: 'Aprendiz', nextLevelAt: 250 }, // ← LEVEL UP!
  badges: ['🔥 Hot Streak']
}
```

### 7. Questão Estratégica (step-14)
```
⏱️ 20s
weight: 3 (vale 3x mais!)

Cálculo:
- Base: 30 pts (10 × 3)
- Speed: 0 (20s > 15s)
- Total: 30 pts
- ACUMULADO: 212 pts

Nota: Questões estratégicas valem mais mas são mais difíceis!
```

### 8. Completar Todas (step-21)
```
Todas as 16 questões respondidas!

Cálculo Final:
- Soma de todas: 330 pts
- Completion Bonus: +50 pts
- TOTAL FINAL: 380 pts

Estado Final:
{
  totalScore: 380,
  level: { current: 3, name: 'Explorador', nextLevelAt: 500 },
  badges: [
    '🔥 Hot Streak',
    '⚡ Speed Demon',     // Média < 20s
    '✅ Completou Tudo'   // 100% respondido
  ],
  breakdown: [...] // 16 itens com detalhamento
}

Análise de Performance:
{
  strengths: [
    'Respostas muito rápidas - boa intuição!',
    'Completou todas as questões - comprometimento alto!',
    'Conquistou 3 badges!'
  ],
  weaknesses: [],
  suggestions: [],
  overall: 'excellent'
}
```

---

## 📊 VISUALIZAÇÃO DO PROGRESSO

### Barra de Progresso para Próximo Nível
```
Nível 3 → Nível 4
Precisa: 500 pts
Atual: 380 pts
Faltam: 120 pts

Progresso Visual:
┌────────────────────────────────────────────────────┐
│ Nível 3 · Explorador                     76% ▶️ 4 │
│ ██████████████████████████████████░░░░░░░░░░░░░░  │
│ 380 / 500 pts                   Faltam 120 pts    │
└────────────────────────────────────────────────────┘
```

### Timeline de Conquistas
```
Questão  Tempo  Pontos  Conquista
───────────────────────────────────
Q1       12s    15      Speed bonus!
Q2       10s    15      Speed bonus!
Q3       11s    20      Streak x3!
Q4       14s    20      Streak x4!
Q5       13s    22      🔥 Hot Streak!
Q6       8s     25      Streak x6!
Q7       35s    10      Streak resetado
Q8       25s    10      -
Q9       18s    10      -
Q10      28s    10      -
Q11      15s    15      Speed bonus!
Q12      32s    30      Estratégica!
Q13      40s    30      Estratégica!
Q14      20s    30      Estratégica!
Q15      38s    30      Estratégica!
Q16      25s    30      Estratégica!
ALL      -      50      ✅ Completou Tudo!
───────────────────────────────────
TOTAL           380     🏆 Nível 3!
```

---

## 🎨 ESTADOS DA UI

### Durante o Quiz
```
┌────────────────────────────────────────────────────────┐
│  HEADER (fixo no topo)                                 │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 182 pts  Nível 2 · Aprendiz   🔥    [10/16]    │ │
│  │ ██████████░░░░░░░░░░░░░░░░░░ 72%                │ │
│  └──────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│  CONTEÚDO (scroll)                                     │
│                                                        │
│  ⏱️ 15s                              Peso: 1x         │
│                                                        │
│  Q10: Como você se sente melhor?                      │
│                                                        │
│  [x] Opção A    [ ] Opção B                          │
│  [ ] Opção C    [x] Opção D                          │
│                                                        │
│  [Avançar →]                                          │
│                                                        │
└────────────────────────────────────────────────────────┘

Se aparecer badge:
┌──────────────────────────┐
│ 🔥 Nova Badge!           │ ← Popup animado
│ Hot Streak               │   (3s, depois desaparece)
│ 5 acertos consecutivos   │
└──────────────────────────┘
```

### Tela Final de Resultado
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                      380                               │
│                    PONTOS                              │
│                                                        │
│              95% de aproveitamento                     │
│           Nível 3 · Explorador 🗺️                     │
│                                                        │
├────────────────────────────────────────────────────────┤
│  🏆 Conquistas                                         │
│  ┌──────────┬──────────┬──────────┐                  │
│  │    🔥    │    ⚡    │    ✅    │                  │
│  │   Hot    │  Speed   │ Completou │                  │
│  │  Streak  │  Demon   │   Tudo    │                  │
│  └──────────┴──────────┴──────────┘                  │
├────────────────────────────────────────────────────────┤
│  💪 Pontos Fortes           💡 Sugestões              │
│  ✓ Respostas rápidas        → Continue assim!        │
│  ✓ 100% completado          → Performance            │
│  ✓ 3 badges                   excelente!             │
├────────────────────────────────────────────────────────┤
│  📊 Detalhamento (expandir)                           │
│  Q1  ●●●●○ 15 pts  (Speed bonus: +5)                 │
│  Q2  ●●●●○ 15 pts  (Speed bonus: +5)                 │
│  Q3  ●●●●● 20 pts  (Streak x3: +5)                   │
│  ...                                                   │
│  ALL ●●●●● 50 pts  (Completion bonus)                │
├────────────────────────────────────────────────────────┤
│  [Ver Recomendações de Estilo]  [Refazer Quiz]       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 RESUMO DOS PONTOS-CHAVE

### Entrada (Input)
```
✅ stepId (string)
✅ selectedOptions (string[])
✅ timeSpent (number)
```

### Processamento
```
1. Criar QuizAnswer object
2. Buscar peso do step (template.metadata.scoring.weight)
3. Calcular pontos base (10 × weight)
4. Verificar speed bonus (< 15s)
5. Verificar streak (3+ consecutivos)
6. Verificar badges (thresholds)
7. Calcular nível (XP total)
```

### Saída (Output)
```
{
  totalScore: number,
  level: { current, name, nextLevelAt },
  badges: string[],
  breakdown: Array<{ questionId, points, notes }>
}
```

### UI Atualizada
```
✅ Header: score + level + badges
✅ Progress bar: % para próximo nível
✅ Notificações: badges desbloqueadas
✅ Resultado: análise completa
```

---

## 📝 NOTAS IMPORTANTES

1. **Timer SEMPRE ativo** → iniciar ao exibir questão
2. **timeSpent é crítico** → sem ele, sem speed bonus
3. **Streak reseta** → se resposta lenta ou errada
4. **Badges animadas** → 3s na tela, depois desaparece
5. **Recálculo automático** → a cada nova resposta
6. **Pesos respeitados** → strategic vale 3x mais

---

**Tudo pronto para implementar!** 🚀
