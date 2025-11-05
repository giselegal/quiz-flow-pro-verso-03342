# 🧮 OPORTUNIDADES DE CÁLCULOS E FÓRMULAS AUTOMÁTICAS

## 🎯 Visão Geral

Além do **progresso automático** já implementado, existem **10+ áreas** onde fórmulas e cálculos podem criar uma experiência muito mais rica, personalizada e inteligente.

---

## 📊 1. TEMPO ESTIMADO DE CONCLUSÃO

### Fórmula Dinâmica

```typescript
function calculateEstimatedTime(steps: Step[]): number {
    let totalSeconds = 0;
    
    steps.forEach(step => {
        // Tempo base por tipo de step
        const baseTime = {
            'intro': 15,           // 15s para ler introdução
            'question': 30,        // 30s para responder pergunta
            'multiple-choice': 20, // 20s para múltipla escolha
            'text-input': 45,      // 45s para input de texto
            'image-choice': 25,    // 25s para escolher imagem
            'transition': 10,      // 10s para transição
            'result': 60,          // 60s para ler resultado
            'offer': 90            // 90s para avaliar oferta
        }[step.type] || 30;
        
        // Ajuste por número de opções
        const optionCount = step.blocks?.filter(b => b.type.includes('option'))?.length || 0;
        const optionPenalty = optionCount > 5 ? (optionCount - 5) * 3 : 0;
        
        // Ajuste por complexidade do conteúdo
        const textLength = JSON.stringify(step).length;
        const complexityBonus = textLength > 1000 ? 10 : 0;
        
        totalSeconds += baseTime + optionPenalty + complexityBonus;
    });
    
    return Math.ceil(totalSeconds / 60); // Retornar em minutos
}
```

### Uso no Header

```json
{
  "type": "quiz-intro-header",
  "properties": {
    "subtitle": "⏱️ Tempo estimado: {calculatedTime} minutos",
    "calculatedTime": 8  // Auto-calculado!
  }
}
```

---

## 🎯 2. PONTUAÇÃO E SCORE DINÂMICO

### Sistema de Pontos Ponderados

```typescript
interface ScoringConfig {
    weights: {
        [questionId: string]: number; // Peso da questão (1-10)
    };
    bonuses: {
        speedBonus: boolean;      // Bonus por responder rápido
        streakBonus: boolean;     // Bonus por sequência correta
        completionBonus: number;  // Bonus por completar 100%
    };
}

function calculateScore(
    answers: Record<string, any>,
    config: ScoringConfig,
    timeSpent: Record<string, number>
): number {
    let totalScore = 0;
    
    Object.entries(answers).forEach(([questionId, answer]) => {
        const weight = config.weights[questionId] || 1;
        const basePoints = answer.isCorrect ? 10 * weight : 0;
        
        // Speed bonus (respondeu em < 50% do tempo médio)
        if (config.bonuses.speedBonus) {
            const avgTime = 30; // segundos
            const actualTime = timeSpent[questionId] || avgTime;
            if (actualTime < avgTime * 0.5) {
                totalScore += 5 * weight;
            }
        }
        
        totalScore += basePoints;
    });
    
    // Completion bonus
    const completionRate = Object.keys(answers).length / Object.keys(config.weights).length;
    if (completionRate === 1 && config.bonuses.completionBonus) {
        totalScore += config.bonuses.completionBonus;
    }
    
    return Math.round(totalScore);
}
```

### Exibição em Tempo Real

```tsx
<div className="score-display">
    <span>Pontuação: {calculatedScore}</span>
    <span className="max-score">/ {maxPossibleScore}</span>
    <ProgressBar value={(calculatedScore / maxPossibleScore) * 100} />
</div>
```

---

## 💎 3. SISTEMA DE RECOMENDAÇÕES PERSONALIZADAS

### Cálculo de Match/Afinidade

```typescript
interface PersonalityProfile {
    romantic: number;    // 0-100
    natural: number;
    dramatic: number;
    classic: number;
    gamine: number;
    creative: number;
}

function calculateStyleMatch(
    userAnswers: Record<string, string[]>,
    styleProfiles: Record<string, PersonalityProfile>
): { style: string; match: number }[] {
    const userProfile: PersonalityProfile = {
        romantic: 0,
        natural: 0,
        dramatic: 0,
        classic: 0,
        gamine: 0,
        creative: 0
    };
    
    // Mapear respostas para traços de personalidade
    Object.values(userAnswers).forEach(selectedOptions => {
        selectedOptions.forEach(option => {
            // Cada opção contribui para traços específicos
            const traits = getTraitsForOption(option);
            Object.entries(traits).forEach(([trait, value]) => {
                userProfile[trait] += value;
            });
        });
    });
    
    // Normalizar perfil (0-100)
    const total = Object.values(userProfile).reduce((a, b) => a + b, 0);
    Object.keys(userProfile).forEach(key => {
        userProfile[key] = (userProfile[key] / total) * 100;
    });
    
    // Calcular similaridade com cada estilo (distância euclidiana)
    const matches = Object.entries(styleProfiles).map(([style, profile]) => {
        const distance = Math.sqrt(
            Object.keys(profile).reduce((sum, trait) => {
                return sum + Math.pow(userProfile[trait] - profile[trait], 2);
            }, 0)
        );
        
        // Converter distância para score de match (0-100)
        const maxDistance = Math.sqrt(6 * 10000); // 6 traits × 100²
        const match = Math.round((1 - distance / maxDistance) * 100);
        
        return { style, match };
    });
    
    return matches.sort((a, b) => b.match - a.match);
}
```

### Resultado Personalizado

```json
{
  "type": "result-header",
  "properties": {
    "title": "Seu estilo predominante: {topStyle}",
    "subtitle": "{matchPercentage}% de compatibilidade",
    "topStyle": "Romântico",
    "matchPercentage": 87
  }
}
```

---

## ✅ 4. VALIDAÇÃO INTELIGENTE DE CONSISTÊNCIA

### Detector de Respostas Conflitantes

```typescript
function validateConsistency(answers: Record<string, any[]>): {
    isConsistent: boolean;
    conflicts: string[];
    suggestions: string[];
} {
    const conflicts: string[] = [];
    const suggestions: string[] = [];
    
    // Exemplo: Verificar contradições
    const prefersComfort = answers['q8']?.includes('comfort');
    const prefersHeels = answers['q10']?.includes('high-heels');
    
    if (prefersComfort && prefersHeels) {
        conflicts.push('Você indicou preferir conforto, mas também saltos altos');
        suggestions.push('Considere sapatos de salto anatômico como compromisso');
    }
    
    // Verificar padrões de resposta
    const allCasual = Object.values(answers).every(ans => 
        ans.some(a => a.includes('casual'))
    );
    const selectedFormal = answers['q5']?.includes('formal-events');
    
    if (allCasual && selectedFormal) {
        conflicts.push('Todas respostas indicam estilo casual, mas você frequenta eventos formais');
        suggestions.push('Talvez precise investir em peças versáteis que funcionem em ambos contextos');
    }
    
    return {
        isConsistent: conflicts.length === 0,
        conflicts,
        suggestions
    };
}
```

---

## 📈 5. ANALYTICS E INSIGHTS AUTOMÁTICOS

### Métricas Calculadas em Tempo Real

```typescript
interface QuizAnalytics {
    // Engajamento
    completionRate: number;        // % que completam
    avgTimePerStep: number;        // Tempo médio por step
    dropOffPoints: string[];       // Steps com maior abandono
    
    // Performance
    avgScore: number;              // Pontuação média
    scoreDistribution: number[];   // Distribuição de scores
    
    // Conversão
    conversionRate: number;        // % que convertem na oferta
    revenuePerUser: number;        // Receita média por usuário
    
    // Qualidade
    answerQuality: number;         // Consistência das respostas
    timeToDecision: number;        // Tempo até decisão de compra
}

function calculateAnalytics(
    sessions: QuizSession[]
): QuizAnalytics {
    const completed = sessions.filter(s => s.status === 'completed');
    
    return {
        completionRate: (completed.length / sessions.length) * 100,
        
        avgTimePerStep: sessions.reduce((sum, s) => 
            sum + (s.totalTime / s.stepsCompleted), 0
        ) / sessions.length,
        
        dropOffPoints: identifyDropOffPoints(sessions),
        
        avgScore: completed.reduce((sum, s) => 
            sum + s.finalScore, 0
        ) / completed.length,
        
        conversionRate: (completed.filter(s => 
            s.converted).length / completed.length) * 100,
        
        // ... outros cálculos
    };
}
```

---

## 🎮 6. GAMIFICAÇÃO COM SISTEMA DE NÍVEIS

### Progressão e Badges

```typescript
interface GamificationSystem {
    levels: {
        name: string;
        requiredXP: number;
        rewards: string[];
    }[];
}

function calculateLevel(
    totalXP: number,
    config: GamificationSystem
): {
    currentLevel: number;
    levelName: string;
    xpToNextLevel: number;
    progressToNext: number;
} {
    let currentLevel = 1;
    let levelName = 'Iniciante';
    
    for (let i = 0; i < config.levels.length; i++) {
        if (totalXP >= config.levels[i].requiredXP) {
            currentLevel = i + 1;
            levelName = config.levels[i].name;
        } else {
            const xpToNextLevel = config.levels[i].requiredXP - totalXP;
            const xpInCurrentLevel = totalXP - (config.levels[i - 1]?.requiredXP || 0);
            const xpNeededForLevel = config.levels[i].requiredXP - (config.levels[i - 1]?.requiredXP || 0);
            const progressToNext = (xpInCurrentLevel / xpNeededForLevel) * 100;
            
            return {
                currentLevel,
                levelName,
                xpToNextLevel,
                progressToNext: Math.round(progressToNext)
            };
        }
    }
    
    return {
        currentLevel,
        levelName,
        xpToNextLevel: 0,
        progressToNext: 100
    };
}

// XP por ações
const XP_REWARDS = {
    completeStep: 10,
    fastAnswer: 5,
    perfectScore: 50,
    shareQuiz: 25,
    referFriend: 100,
    purchaseCourse: 500
};
```

---

## 🔄 7. PERSONALIZAÇÃO DINÂMICA DE CONTEÚDO

### Ajuste de Conteúdo Baseado em Respostas

```typescript
function getDynamicContent(
    stepId: string,
    userAnswers: Record<string, any>
): Partial<Block> {
    // Exemplo: Ajustar imagem baseado em estilo
    const stylePreference = detectStyleFromAnswers(userAnswers);
    
    if (stepId === 'step-20' && stylePreference) {
        return {
            properties: {
                introImageUrl: `https://cloudinary.com/styles/${stylePreference}.jpg`,
                title: `Você é ${STYLE_NAMES[stylePreference]}!`,
                description: STYLE_DESCRIPTIONS[stylePreference]
            }
        };
    }
    
    // Exemplo: Ajustar oferta baseado em budget
    const budgetRange = userAnswers['q16']?.[0]; // low, medium, high
    
    if (stepId === 'step-21' && budgetRange) {
        const offers = {
            'low': { price: 97, features: ['básico'] },
            'medium': { price: 197, features: ['básico', 'premium'] },
            'high': { price: 497, features: ['básico', 'premium', 'vip'] }
        };
        
        return {
            properties: {
                offerPrice: offers[budgetRange].price,
                offerFeatures: offers[budgetRange].features.join(', ')
            }
        };
    }
    
    return {};
}
```

---

## 📊 8. TAXA DE CONVERSÃO E OTIMIZAÇÃO

### Cálculo de Métricas de Funil

```typescript
interface FunnelMetrics {
    steps: {
        stepId: string;
        entered: number;
        completed: number;
        dropOffRate: number;
        avgTime: number;
    }[];
    overallConversion: number;
    bottlenecks: string[];
}

function calculateFunnelMetrics(
    sessions: QuizSession[]
): FunnelMetrics {
    const stepMetrics = new Map<string, any>();
    
    sessions.forEach(session => {
        session.steps.forEach(stepData => {
            const existing = stepMetrics.get(stepData.stepId) || {
                entered: 0,
                completed: 0,
                totalTime: 0
            };
            
            existing.entered++;
            if (stepData.completed) existing.completed++;
            existing.totalTime += stepData.timeSpent;
            
            stepMetrics.set(stepData.stepId, existing);
        });
    });
    
    const steps = Array.from(stepMetrics.entries()).map(([stepId, data]) => ({
        stepId,
        entered: data.entered,
        completed: data.completed,
        dropOffRate: ((data.entered - data.completed) / data.entered) * 100,
        avgTime: data.totalTime / data.entered
    }));
    
    // Identificar gargalos (drop-off > 20%)
    const bottlenecks = steps
        .filter(s => s.dropOffRate > 20)
        .map(s => s.stepId);
    
    const startCount = sessions.length;
    const endCount = sessions.filter(s => s.status === 'completed').length;
    
    return {
        steps: steps.sort((a, b) => a.stepId.localeCompare(b.stepId)),
        overallConversion: (endCount / startCount) * 100,
        bottlenecks
    };
}
```

---

## ⏱️ 9. TEMPO DE LEITURA E ACESSIBILIDADE

### Cálculo de Legibilidade

```typescript
function calculateReadability(text: string): {
    readingTime: number;      // minutos
    wordCount: number;
    complexity: 'easy' | 'medium' | 'hard';
    fleschScore: number;      // 0-100 (maior = mais fácil)
} {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const syllables = countSyllables(text);
    
    // Fórmula Flesch Reading Ease
    const fleschScore = 206.835 
        - 1.015 * (words.length / sentences.length)
        - 84.6 * (syllables / words.length);
    
    // Tempo de leitura (assumindo 200 palavras/min)
    const readingTime = Math.ceil(words.length / 200);
    
    // Complexidade
    const complexity = fleschScore > 70 ? 'easy' 
        : fleschScore > 50 ? 'medium' 
        : 'hard';
    
    return {
        readingTime,
        wordCount: words.length,
        complexity,
        fleschScore: Math.round(fleschScore)
    };
}
```

---

## 🧪 10. A/B TESTING AUTOMÁTICO

### Calculadora de Significância Estatística

```typescript
interface ABTestResult {
    variant: 'A' | 'B';
    conversions: number;
    total: number;
    conversionRate: number;
}

function calculateABTestSignificance(
    variantA: ABTestResult,
    variantB: ABTestResult
): {
    winner: 'A' | 'B' | 'inconclusive';
    confidenceLevel: number;
    improvementPercent: number;
    sampleSizeNeeded: number;
} {
    const pA = variantA.conversions / variantA.total;
    const pB = variantB.conversions / variantB.total;
    
    // Cálculo Z-score
    const pooledP = (variantA.conversions + variantB.conversions) / 
                    (variantA.total + variantB.total);
    
    const se = Math.sqrt(
        pooledP * (1 - pooledP) * (1/variantA.total + 1/variantB.total)
    );
    
    const zScore = Math.abs((pA - pB) / se);
    
    // Nível de confiança (aproximação)
    const confidenceLevel = Math.min(
        99.99,
        (1 - Math.exp(-Math.pow(zScore, 2) / 2)) * 100
    );
    
    const winner = confidenceLevel > 95 
        ? (pA > pB ? 'A' : 'B')
        : 'inconclusive';
    
    const improvementPercent = Math.abs((pB - pA) / pA * 100);
    
    // Cálculo de amostra necessária para 95% confiança
    const requiredSampleSize = Math.ceil(
        16 * Math.pow(se / (pB - pA), 2)
    );
    
    return {
        winner,
        confidenceLevel: Math.round(confidenceLevel * 100) / 100,
        improvementPercent: Math.round(improvementPercent * 100) / 100,
        sampleSizeNeeded: Math.max(0, requiredSampleSize - (variantA.total + variantB.total))
    };
}
```

---

## 🎨 11. CÁLCULO DE CORES E DESIGN HARMÔNICO

### Gerador de Paleta Baseado em Escolhas

```typescript
function generateHarmoniousPalette(
    userColorPreferences: string[]
): {
    primary: string;
    secondary: string;
    accent: string;
    contrast: string;
    harmonyType: 'complementary' | 'analogous' | 'triadic';
} {
    // Converter cores para HSL
    const hslColors = userColorPreferences.map(hexToHSL);
    
    // Calcular cor média
    const avgHue = hslColors.reduce((sum, c) => sum + c.h, 0) / hslColors.length;
    const avgSat = hslColors.reduce((sum, c) => sum + c.s, 0) / hslColors.length;
    const avgLight = hslColors.reduce((sum, c) => sum + c.l, 0) / hslColors.length;
    
    // Gerar paleta harmônica
    return {
        primary: hslToHex(avgHue, avgSat, avgLight),
        secondary: hslToHex((avgHue + 30) % 360, avgSat, avgLight),
        accent: hslToHex((avgHue + 180) % 360, avgSat + 10, avgLight - 10),
        contrast: hslToHex((avgHue + 180) % 360, avgSat, 100 - avgLight),
        harmonyType: determineHarmonyType(avgHue, hslColors)
    };
}
```

---

## 💰 12. CÁLCULO DE ROI E VALOR DO CLIENTE

### Lifetime Value Prediction

```typescript
function predictCustomerLifetimeValue(
    userProfile: {
        quizScore: number;
        engagementLevel: number;
        budgetRange: string;
        timeSpent: number;
    },
    historicalData: CustomerData[]
): {
    predictedLTV: number;
    confidence: number;
    segment: 'high' | 'medium' | 'low';
} {
    // Machine learning simplificado (regressão linear)
    const weights = {
        quizScore: 0.3,
        engagementLevel: 0.4,
        budgetRange: { low: 1, medium: 2, high: 3 },
        timeSpent: 0.3
    };
    
    const score = 
        (userProfile.quizScore / 100) * weights.quizScore +
        (userProfile.engagementLevel / 100) * weights.engagementLevel +
        (weights.budgetRange[userProfile.budgetRange] / 3) * 0.3 +
        (Math.min(userProfile.timeSpent, 600) / 600) * weights.timeSpent;
    
    // Mapear score para LTV baseado em dados históricos
    const avgLTV = historicalData.reduce((sum, c) => sum + c.totalSpent, 0) / historicalData.length;
    const predictedLTV = avgLTV * (score * 2); // score 0-1 → multiplica por 0-2
    
    return {
        predictedLTV: Math.round(predictedLTV),
        confidence: Math.min(95, score * 100),
        segment: predictedLTV > avgLTV * 1.5 ? 'high'
            : predictedLTV > avgLTV * 0.7 ? 'medium'
            : 'low'
    };
}
```

---

## 📋 RESUMO DE IMPLEMENTAÇÃO

### Prioridades Sugeridas

| Prioridade | Cálculo | Impacto | Complexidade | Tempo Estimado |
|------------|---------|---------|--------------|----------------|
| 🔥 **Alta** | Tempo estimado | Alto | Baixa | 2h |
| 🔥 **Alta** | Sistema de score | Alto | Média | 4h |
| 🔥 **Alta** | Recomendações personalizadas | Muito Alto | Alta | 8h |
| ⚡ **Média** | Validação de consistência | Médio | Média | 3h |
| ⚡ **Média** | Analytics/Insights | Alto | Média | 6h |
| ⚡ **Média** | Gamificação | Médio | Média | 5h |
| 💡 **Baixa** | Personalização dinâmica | Alto | Alta | 10h |
| 💡 **Baixa** | Funil de conversão | Médio | Média | 4h |
| 💡 **Baixa** | Tempo de leitura | Baixo | Baixa | 1h |
| 💡 **Baixa** | A/B Testing | Médio | Alta | 8h |
| 💡 **Baixa** | Paleta de cores | Baixo | Média | 3h |
| 💡 **Baixa** | Predição LTV | Médio | Alta | 6h |

### Próximos Passos Recomendados

1. **Começar com wins rápidos:**
   - ✅ Tempo estimado (já temos progresso!)
   - Sistema de score básico
   - Tempo de leitura

2. **Implementar high-impact:**
   - Sistema de recomendações (core do quiz)
   - Analytics dashboard
   - Validação de consistência

3. **Expandir gradualmente:**
   - Gamificação
   - Personalização dinâmica
   - A/B testing

---

## 🎯 CONCLUSÃO

Com esses **12 sistemas de cálculos automáticos**, você transforma um quiz simples em uma **experiência inteligente, personalizada e orientada por dados**!

**Benefícios esperados:**
- 📈 **+30-50% conversão** (recomendações personalizadas)
- 🎮 **+40% engajamento** (gamificação + score)
- 💰 **+25% ticket médio** (ofertas dinâmicas)
- 📊 **Decisões data-driven** (analytics + A/B testing)
- ✨ **Experiência única** (personalização total)
