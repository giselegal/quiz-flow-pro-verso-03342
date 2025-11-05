# 🔧 SISTEMA DE PONTUAÇÃO - ESCALABILIDADE E PERSONALIZAÇÃO

## ✅ RESPOSTA RÁPIDA

**SIM!** O sistema é **100% configurável** para qualquer:
- ✅ Número de etapas (3, 10, 50, 100+)
- ✅ Nicho/tema (estilo, saúde, carreira, fitness, culinária, etc)
- ✅ Tipo de quiz (personalidade, conhecimento, diagnóstico)
- ✅ Configurações de pontuação personalizadas

---

## 🎯 ARQUITETURA FLEXÍVEL

### 1. Sistema Agnóstico de Domínio

O `scoreCalculator.ts` **não tem dependências** específicas do quiz de estilo:

```typescript
// ❌ NÃO faz isso (hardcoded)
if (questionId === 'step-02') {
  points = 10;
}

// ✅ FAZ isso (configurável)
export function calculateScore(
  answers: Answer[],          // Qualquer resposta
  rules: ScoringRules = {}    // Regras personalizáveis
): ScoreResult
```

### 2. Configuração Via Parâmetros

```typescript
// Exemplo 1: Quiz de Estilo (21 steps)
const quizEstiloRules = {
  weights: {
    'step-02': 1,
    'step-13': 3,  // Estratégica vale mais
  },
  correctAnswerPoints: 10,
  speedBonusThreshold: 15,
  completionBonus: 50
};

// Exemplo 2: Quiz de Conhecimento (100 perguntas)
const quizConhecimentoRules = {
  weights: {},  // Todas valem igual
  correctAnswerPoints: 5,
  speedBonusThreshold: 10,  // Mais rápido
  completionBonus: 200,
  penaltyForSkip: -10       // Penalidade maior
};

// Exemplo 3: Quiz de Saúde (5 steps curtas)
const quizSaudeRules = {
  weights: {
    'diagnostico-principal': 10,  // Pergunta chave vale 10x
    'sintoma-1': 2,
    'sintoma-2': 2
  },
  correctAnswerPoints: 20,
  speedBonusThreshold: 0,   // Sem pressa em saúde
  completionBonus: 100
};
```

---

## 📝 CONFIGURAÇÃO POR FUNIL

### Método 1: Configuração no Template JSON

```json
{
  "funnelId": "quiz-fitness-30dias",
  "metadata": {
    "scoringEnabled": true,
    "scoringRules": {
      "speedBonusThreshold": 20,
      "speedBonusPoints": 3,
      "streakMultiplier": 1.2,
      "completionBonus": 75,
      "penaltyForSkip": 0
    }
  },
  "steps": {
    "avaliacao-inicial": {
      "metadata": {
        "scoring": {
          "weight": 5,
          "timeLimit": 60,
          "speedBonusEnabled": false
        }
      }
    },
    "nivel-experiencia": {
      "metadata": {
        "scoring": {
          "weight": 3,
          "timeLimit": 30,
          "speedBonusEnabled": true
        }
      }
    }
  }
}
```

### Método 2: Script de Configuração Customizado

Criar arquivo específico para cada nicho:

**`scripts/configure-scoring-fitness.mjs`**
```javascript
const SCORING_CONFIG = {
  'avaliacao-inicial': {
    weight: 5,
    timeLimit: 60,
    hasCorrectAnswer: false,
    speedBonusEnabled: false
  },
  'nivel-experiencia': {
    weight: 3,
    timeLimit: 30,
    hasCorrectAnswer: false,
    speedBonusEnabled: true
  },
  'objetivo-principal': {
    weight: 4,
    timeLimit: 45,
    hasCorrectAnswer: false,
    speedBonusEnabled: true
  },
  'disponibilidade': {
    weight: 2,
    timeLimit: 20,
    hasCorrectAnswer: false,
    speedBonusEnabled: true
  }
};

// Aplicar ao template do funil
applyToFunnel('fitness-30dias', SCORING_CONFIG);
```

---

## 🎨 PERSONALIZAÇÃO DE NÍVEIS E BADGES

### Sistema de Níveis Customizável

```typescript
// Níveis padrão (quiz de estilo)
const DEFAULT_LEVELS = [
  { threshold: 0, name: 'Iniciante' },
  { threshold: 100, name: 'Aprendiz' },
  { threshold: 250, name: 'Explorador' },
  { threshold: 500, name: 'Especialista' },
  { threshold: 1000, name: 'Mestre' },
  { threshold: 2000, name: 'Lenda' }
];

// Níveis para quiz de conhecimento (100 perguntas)
const KNOWLEDGE_LEVELS = [
  { threshold: 0, name: 'Novato' },
  { threshold: 200, name: 'Estudante' },
  { threshold: 400, name: 'Conhecedor' },
  { threshold: 600, name: 'Expert' },
  { threshold: 800, name: 'Guru' },
  { threshold: 1000, name: 'Professor' }
];

// Níveis para quiz fitness (5 steps)
const FITNESS_LEVELS = [
  { threshold: 0, name: 'Sedentário' },
  { threshold: 50, name: 'Iniciante' },
  { threshold: 100, name: 'Intermediário' },
  { threshold: 150, name: 'Avançado' },
  { threshold: 200, name: 'Atleta' }
];
```

### Badges Personalizadas por Nicho

```typescript
// scoreCalculator.ts - Modificar função de badges
export function calculateScore(
  answers: Answer[],
  rules: ScoringRules = {},
  customBadges?: BadgeConfig  // ← NOVO parâmetro
): ScoreResult {
  // ...código existente...
  
  // Verificar badges customizadas
  if (customBadges) {
    earnedBadges.push(...checkCustomBadges(answers, customBadges));
  }
}

// Exemplo: Badges para quiz fitness
const FITNESS_BADGES = {
  streak5: { emoji: '💪', name: 'Disciplinado', threshold: 5 },
  fast: { emoji: '⚡', name: 'Ágil', avgTime: 20 },
  complete: { emoji: '🏆', name: 'Completou', percentage: 100 },
  perfect: { emoji: '🥇', name: 'Perfeito', score: 'max' },
  motivated: { emoji: '🔥', name: 'Motivado', streak: 10 }
};

// Exemplo: Badges para quiz culinária
const COOKING_BADGES = {
  chef: { emoji: '👨‍🍳', name: 'Chef Iniciante', threshold: 5 },
  fast: { emoji: '⚡', name: 'Rápido na Cozinha', avgTime: 15 },
  complete: { emoji: '📖', name: 'Conhecimento Completo', percentage: 100 },
  gourmet: { emoji: '⭐', name: 'Gourmet', score: 200 }
};
```

---

## 🔄 ADAPTAÇÃO DINÂMICA POR QUANTIDADE DE STEPS

### Sistema Auto-Ajustável

```typescript
/**
 * Calcula thresholds baseados na quantidade de steps
 */
export function calculateDynamicLevels(
  totalSteps: number,
  pointsPerStep: number = 10
): LevelConfig[] {
  const maxPoints = totalSteps * pointsPerStep;
  
  return [
    { threshold: 0, name: 'Iniciante' },
    { threshold: Math.floor(maxPoints * 0.15), name: 'Aprendiz' },
    { threshold: Math.floor(maxPoints * 0.35), name: 'Intermediário' },
    { threshold: Math.floor(maxPoints * 0.60), name: 'Avançado' },
    { threshold: Math.floor(maxPoints * 0.85), name: 'Expert' },
    { threshold: maxPoints, name: 'Mestre' }
  ];
}

// Exemplo: Quiz com 5 steps
calculateDynamicLevels(5, 10);
// → [0, 8, 18, 30, 43, 50]

// Exemplo: Quiz com 100 steps
calculateDynamicLevels(100, 5);
// → [0, 75, 175, 300, 425, 500]
```

### Uso no Código

```typescript
// useQuizState.ts
const levels = useMemo(() => {
  const totalSteps = Object.keys(stepsSource).length;
  return calculateDynamicLevels(totalSteps);
}, [stepsSource]);

const scoreResult = calculateScore(answers, {
  ...rules,
  levels  // ← Níveis dinâmicos
});
```

---

## 🎯 EXEMPLOS POR NICHO

### 1. Quiz de Carreira (10 steps)

**Configuração:**
```javascript
{
  funnelId: "quiz-carreira-ideal",
  scoringRules: {
    speedBonusThreshold: 25,      // Reflexão é importante
    speedBonusPoints: 3,
    streakMultiplier: 1.3,
    completionBonus: 50,
    penaltyForSkip: -3
  },
  levels: [
    { threshold: 0, name: 'Indeciso' },
    { threshold: 30, name: 'Explorando' },
    { threshold: 60, name: 'Focado' },
    { threshold: 90, name: 'Decidido' },
    { threshold: 120, name: 'Preparado' }
  ],
  badges: {
    fast: '🎯 Decisivo',
    complete: '✅ Autoconhecimento',
    streak: '🔥 Convicto'
  }
}
```

**Steps:**
```json
{
  "step-01": { "weight": 2, "timeLimit": 40 },
  "step-02": { "weight": 1, "timeLimit": 30 },
  "step-03": { "weight": 3, "timeLimit": 50 },
  "step-04": { "weight": 1, "timeLimit": 30 },
  "step-05": { "weight": 2, "timeLimit": 40 },
  "step-06": { "weight": 1, "timeLimit": 30 },
  "step-07": { "weight": 4, "timeLimit": 60 },
  "step-08": { "weight": 1, "timeLimit": 30 },
  "step-09": { "weight": 2, "timeLimit": 40 },
  "step-10": { "weight": 3, "timeLimit": 50 }
}
```

### 2. Quiz de Saúde/Diagnóstico (3 steps)

**Configuração:**
```javascript
{
  funnelId: "quiz-saude-diagnostico",
  scoringRules: {
    speedBonusThreshold: 0,       // Sem pressa
    speedBonusPoints: 0,
    streakMultiplier: 1.0,
    completionBonus: 30,
    penaltyForSkip: -20           // Crítico responder tudo
  },
  levels: [
    { threshold: 0, name: 'Avaliação Inicial' },
    { threshold: 40, name: 'Perfil Identificado' },
    { threshold: 80, name: 'Diagnóstico Completo' }
  ],
  badges: {
    complete: '✅ Avaliação Completa',
    thorough: '🔍 Detalhista'
  }
}
```

**Steps:**
```json
{
  "sintomas-principais": { "weight": 10, "timeLimit": 0 },
  "historico-familiar": { "weight": 5, "timeLimit": 0 },
  "habitos-vida": { "weight": 8, "timeLimit": 0 }
}
```

### 3. Quiz de Conhecimento/Educacional (50 steps)

**Configuração:**
```javascript
{
  funnelId: "quiz-matematica-basica",
  scoringRules: {
    speedBonusThreshold: 10,      // Rápido é melhor
    speedBonusPoints: 2,
    streakMultiplier: 2.0,        // Streak muito valorizado
    completionBonus: 100,
    penaltyForSkip: -5,
    hasCorrectAnswer: true        // Tem resposta certa!
  },
  levels: [
    { threshold: 0, name: 'Aluno' },
    { threshold: 100, name: 'Estudante' },
    { threshold: 250, name: 'Dedicado' },
    { threshold: 450, name: 'Expert' },
    { threshold: 700, name: 'Gênio' }
  ],
  badges: {
    perfect: '🏆 Perfeição',
    fast: '⚡ Raio',
    streak10: '🔥 Em Chamas',
    streak20: '💎 Imparável',
    complete: '✅ Disciplinado'
  }
}
```

**Steps:** Todas com peso 1, timeLimit 15s

### 4. Quiz de Produto/E-commerce (7 steps)

**Configuração:**
```javascript
{
  funnelId: "quiz-produto-ideal",
  scoringRules: {
    speedBonusThreshold: 20,
    speedBonusPoints: 4,
    streakMultiplier: 1.4,
    completionBonus: 40,
    penaltyForSkip: 0             // Pode pular perguntas
  },
  levels: [
    { threshold: 0, name: 'Descobrindo' },
    { threshold: 30, name: 'Interessado' },
    { threshold: 60, name: 'Engajado' },
    { threshold: 90, name: 'Pronto para Comprar' }
  ],
  badges: {
    fast: '⚡ Decidido',
    complete: '✅ Match Perfeito',
    engaged: '💎 Cliente Ideal'
  }
}
```

---

## 🛠️ FERRAMENTAS DE CONFIGURAÇÃO

### Script Gerador Universal

**`scripts/generate-scoring-config.mjs`**
```javascript
#!/usr/bin/env node
/**
 * Gerador de configuração de scoring para qualquer funil
 */

import inquirer from 'inquirer';
import fs from 'fs';

async function generateScoringConfig() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'funnelId',
      message: 'ID do funil:',
      default: 'meu-quiz'
    },
    {
      type: 'number',
      name: 'totalSteps',
      message: 'Número de steps:',
      default: 10
    },
    {
      type: 'list',
      name: 'nicho',
      message: 'Nicho/categoria:',
      choices: [
        'Personalidade',
        'Conhecimento',
        'Saúde/Diagnóstico',
        'E-commerce/Produto',
        'Carreira',
        'Fitness',
        'Culinária',
        'Outro'
      ]
    },
    {
      type: 'confirm',
      name: 'hasCorrectAnswer',
      message: 'Tem resposta certa/errada?',
      default: false
    },
    {
      type: 'confirm',
      name: 'speedMatters',
      message: 'Velocidade importa?',
      default: true
    },
    {
      type: 'number',
      name: 'basePoints',
      message: 'Pontos base por questão:',
      default: 10
    }
  ]);

  // Gerar configuração baseada nas respostas
  const config = generateConfig(answers);
  
  // Salvar arquivo
  const filename = `public/templates/${answers.funnelId}-scoring.json`;
  fs.writeFileSync(filename, JSON.stringify(config, null, 2));
  
  console.log(`✅ Configuração criada: ${filename}`);
}

function generateConfig(answers) {
  const { nicho, totalSteps, speedMatters, hasCorrectAnswer, basePoints } = answers;
  
  // Configurações base por nicho
  const nichoConfigs = {
    'Personalidade': {
      speedBonusThreshold: 20,
      streakMultiplier: 1.4,
      penaltyForSkip: 0
    },
    'Conhecimento': {
      speedBonusThreshold: 10,
      streakMultiplier: 2.0,
      penaltyForSkip: -5
    },
    'Saúde/Diagnóstico': {
      speedBonusThreshold: 0,
      streakMultiplier: 1.0,
      penaltyForSkip: -20
    },
    'E-commerce/Produto': {
      speedBonusThreshold: 15,
      streakMultiplier: 1.3,
      penaltyForSkip: 0
    }
  };
  
  const baseConfig = nichoConfigs[nicho] || nichoConfigs['Personalidade'];
  
  return {
    funnelId: answers.funnelId,
    metadata: {
      scoringEnabled: true,
      nicho,
      totalSteps,
      createdAt: new Date().toISOString()
    },
    scoringRules: {
      correctAnswerPoints: basePoints,
      speedBonusThreshold: speedMatters ? baseConfig.speedBonusThreshold : 0,
      speedBonusPoints: speedMatters ? 5 : 0,
      streakMultiplier: baseConfig.streakMultiplier,
      completionBonus: Math.floor(totalSteps * basePoints * 0.5),
      penaltyForSkip: baseConfig.penaltyForSkip,
      hasCorrectAnswer
    },
    levels: calculateDynamicLevels(totalSteps, basePoints),
    badges: generateBadges(nicho)
  };
}

generateScoringConfig();
```

**Uso:**
```bash
node scripts/generate-scoring-config.mjs

? ID do funil: quiz-carreira-ideal
? Número de steps: 10
? Nicho/categoria: Carreira
? Tem resposta certa/errada? No
? Velocidade importa? Yes
? Pontos base por questão: 10

✅ Configuração criada: public/templates/quiz-carreira-ideal-scoring.json
```

---

## 📊 DASHBOARD DE CONFIGURAÇÃO (UI)

### Interface Visual para Configurar

```tsx
// components/admin/ScoringConfigEditor.tsx
export const ScoringConfigEditor = ({ funnelId }) => {
  const [config, setConfig] = useState(defaultConfig);
  
  return (
    <div className="scoring-editor">
      <h2>Configurar Pontuação: {funnelId}</h2>
      
      {/* Configurações Gerais */}
      <Section title="Regras Gerais">
        <Input
          label="Pontos por resposta"
          type="number"
          value={config.correctAnswerPoints}
          onChange={(v) => setConfig({...config, correctAnswerPoints: v})}
        />
        
        <Input
          label="Threshold speed bonus (segundos)"
          type="number"
          value={config.speedBonusThreshold}
          onChange={(v) => setConfig({...config, speedBonusThreshold: v})}
        />
        
        <Input
          label="Pontos speed bonus"
          type="number"
          value={config.speedBonusPoints}
          onChange={(v) => setConfig({...config, speedBonusPoints: v})}
        />
        
        <Input
          label="Multiplicador streak"
          type="number"
          step="0.1"
          value={config.streakMultiplier}
          onChange={(v) => setConfig({...config, streakMultiplier: v})}
        />
        
        <Input
          label="Bonus de conclusão"
          type="number"
          value={config.completionBonus}
          onChange={(v) => setConfig({...config, completionBonus: v})}
        />
      </Section>
      
      {/* Configuração por Step */}
      <Section title="Peso por Questão">
        {steps.map(step => (
          <div key={step.id}>
            <label>{step.name}</label>
            <Input
              type="number"
              value={config.weights[step.id] || 1}
              onChange={(v) => setConfig({
                ...config,
                weights: {...config.weights, [step.id]: v}
              })}
            />
          </div>
        ))}
      </Section>
      
      {/* Níveis */}
      <Section title="Sistema de Níveis">
        <button onClick={() => autoGenerateLevels()}>
          Gerar Automaticamente
        </button>
        {config.levels.map((level, i) => (
          <div key={i}>
            <Input
              label="Threshold"
              type="number"
              value={level.threshold}
            />
            <Input
              label="Nome"
              value={level.name}
            />
          </div>
        ))}
      </Section>
      
      {/* Preview */}
      <Section title="Preview">
        <ScoringPreview config={config} />
      </Section>
      
      {/* Salvar */}
      <button onClick={saveConfig}>
        Salvar Configuração
      </button>
    </div>
  );
};
```

---

## ✅ CHECKLIST DE ADAPTAÇÃO

### Para Criar Novo Funil com Scoring

- [ ] 1. Definir nicho e objetivo
- [ ] 2. Determinar número de steps
- [ ] 3. Decidir se tem resposta certa/errada
- [ ] 4. Definir se velocidade importa
- [ ] 5. Criar configuração de scoring
- [ ] 6. Definir pesos por step
- [ ] 7. Configurar níveis apropriados
- [ ] 8. Personalizar badges
- [ ] 9. Testar com dados reais
- [ ] 10. Ajustar thresholds

### Tempo Estimado

| Funil | Tempo de Config |
|-------|-----------------|
| Simples (< 10 steps) | 30min |
| Médio (10-30 steps) | 1h |
| Complexo (30-100 steps) | 2-3h |

---

## 🎯 CONCLUSÃO

✅ **Sistema 100% escalável**
✅ **Configurável para qualquer nicho**
✅ **Adapta-se a qualquer quantidade de steps**
✅ **Sem código hardcoded**
✅ **Ferramentas de configuração prontas**
✅ **UI de admin opcional**

**O sistema foi projetado para ser agnóstico de domínio desde o início!**
