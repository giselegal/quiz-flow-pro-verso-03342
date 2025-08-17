# 🧮 LÓGICA DE CÁLCULOS, SELEÇÕES E REGRAS NO EDITOR

## 🎯 COMO FUNCIONA O SISTEMA DE PONTUAÇÃO E RESULTADOS

O sistema possui uma **arquitetura robusta** para cálculos de resultados baseada em pontuação por categorias de estilo.

## 📊 ESTRUTURA DE PONTUAÇÃO

### 1️⃣ **Opções com Pontos por Categoria**

```typescript
// Exemplo de opção em clothingQuestions.ts
{
  id: '1a',
  text: 'Conforto, leveza e praticidade no vestir.',
  imageUrl: 'https://res.cloudinary.com/.../11_hqmr8l.webp',
  styleCategory: 'Natural',    // Categoria do estilo
  points: 1                    // Pontos atribuídos
}
```

### 2️⃣ **8 Categorias de Estilo**

```typescript
const styleCounter: Record<string, number> = {
  Natural: 0,
  Clássico: 0,
  Contemporâneo: 0,
  Elegante: 0,
  Romântico: 0,
  Sexy: 0,
  Dramático: 0,
  Criativo: 0,
};
```

## 🔢 ALGORITMO DE CÁLCULO DE RESULTADOS

### **Função `calculateResults` (useQuizLogic.ts):**

```typescript
const calculateResults = useCallback(
  (clickOrderInternal: string[] = []) => {
    const styleCounter: Record<string, number> = {
      Natural: 0,
      Clássico: 0,
      Contemporâneo: 0,
      Elegante: 0,
      Romântico: 0,
      Sexy: 0,
      Dramático: 0,
      Criativo: 0,
    };

    let totalSelections = 0;

    // 1. CONTAR PONTOS POR CATEGORIA
    Object.entries(answers).forEach(([questionId, optionIds]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (!question) return;

      optionIds.forEach(optionId => {
        const option = question.options.find(o => o.id === optionId);
        if (option) {
          styleCounter[option.styleCategory]++;
          totalSelections++;
        }
      });
    });

    // 2. CALCULAR PERCENTUAIS
    const styleResults: StyleResult[] = Object.entries(styleCounter)
      .map(([category, score]) => ({
        category: category as StyleResult['category'],
        score,
        percentage: totalSelections > 0 ? Math.round((score / totalSelections) * 100) : 0,
      }))

      // 3. ORDENAR COM CRITÉRIO DE DESEMPATE
      .sort((a, b) => {
        // Se pontuação igual, usar ordem de clique (primeiro que clicou)
        if (a.score === b.score && clickOrderInternal.length > 0) {
          const indexA = clickOrderInternal.indexOf(a.category);
          const indexB = clickOrderInternal.indexOf(b.category);
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB; // Primeiro que foi clicado ganha
          }
        }
        return b.score - a.score; // Maior pontuação primeiro
      });

    // 4. DEFINIR ESTILO PRIMÁRIO E SECUNDÁRIOS
    const primaryStyle = styleResults[0] || null;
    const secondaryStyles = styleResults.slice(1);

    const result: QuizResult = {
      primaryStyle,
      secondaryStyles,
      totalSelections,
      userName: 'User',
    };

    return result;
  },
  [answers, strategicAnswers]
);
```

## 🎲 EXEMPLO PRÁTICO: QUIZ DE 21 ETAPAS

### **Pergunta 1: "Qual o seu tipo de roupa favorita?"**

```typescript
// Usuário seleciona 3 opções:
selectedOptions = ['1a', '1d', '1f'];

// Pontuação gerada:
styleCounter = {
  Natural: 1, // opção '1a'
  Elegante: 1, // opção '1d'
  Sexy: 1, // opção '1f'
  // outras categorias: 0
};
```

### **Pergunta 2: "Qual visual você mais se identifica?"**

```typescript
// Usuário seleciona 3 opções:
selectedOptions = ['3a', '3a', '3d'];

// Pontuação acumulada:
styleCounter = {
  Natural: 2, // +1 da pergunta anterior, +1 desta
  Elegante: 2, // +1 da pergunta anterior, +1 desta
  Sexy: 1, // da pergunta anterior
  // outras categorias: 0
};
```

### **Após 21 Perguntas - Resultado Final:**

```json
{
  "primaryStyle": {
    "category": "Natural",
    "score": 15,
    "percentage": 25
  },
  "secondaryStyles": [
    { "category": "Elegante", "score": 12, "percentage": 20 },
    { "category": "Contemporâneo", "score": 10, "percentage": 17 },
    { "category": "Clássico", "score": 8, "percentage": 13 }
    // etc...
  ],
  "totalSelections": 60
}
```

## 🔧 COMPONENTES E SUAS FUNÇÕES

### **1. QuizQuestionBlock.tsx - Captura de Seleções**

```typescript
const handleOptionClick = (optionId: string) => {
  const newSelected = new Set(selectedOptions);

  if (allowMultiple) {
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else if (newSelected.size < maxSelections) {
      newSelected.add(optionId);
    }
  } else {
    newSelected.clear();
    newSelected.add(optionId);
  }

  setSelectedOptions(newSelected);

  // AUTO-AVANÇO com delay
  if (autoAdvance && newSelected.size === maxSelections) {
    setTimeout(() => onNext?.(), autoAdvanceDelay);
  }
};
```

**Funcionalidades:**

- ✅ **Seleção múltipla**: Até 3 opções por pergunta
- ✅ **Auto-avanço**: Avança automaticamente quando atinge máximo
- ✅ **Validação**: Não permite mais seleções que o limite
- ✅ **Estado visual**: Feedback imediato de seleção

### **2. QuizResultMainCardBlock.tsx - Exibição de Resultados**

```typescript
const styleConfig = {
  elegante: {
    name: 'Elegante',
    image: 'https://res.cloudinary.com/.../ELEGANTE_PREDOMINANTE.webp',
    description: 'Seu estilo reflete sofisticação e refinamento.',
    characteristics: [
      'Peças estruturadas e bem cortadas',
      'Cores neutras e sóbrias',
      'Acessórios refinados',
      'Tecidos nobres e de qualidade',
    ],
  },
  // outros estilos...
};
```

**Funcionalidades:**

- 🎨 **Personalização visual**: Cores, fontes, layout
- 📊 **Características detalhadas**: Lista de atributos do estilo
- 🖼️ **Imagem representativa**: Visual do estilo predominante
- 📱 **Responsivo**: Layout adaptável

## ⚙️ REGRAS DE NEGÓCIO

### **1. Seleção por Pergunta:**

- **Mínimo**: 1 opção (seleção única)
- **Máximo**: 3 opções (seleção múltipla)
- **Obrigatório**: Deve selecionar o máximo para avançar

### **2. Pontuação:**

- **1 ponto** por opção selecionada
- **Acumulativo** entre perguntas
- **Por categoria** de estilo

### **3. Critério de Desempate:**

- **Primeiro critério**: Maior pontuação total
- **Segundo critério**: Ordem de clique (primeiro que foi selecionado)
- **Resultado**: Estilo com mais pontos vira "primário"

### **4. Auto-avanço:**

- **Ativado por padrão**: `autoAdvance = true`
- **Delay**: 1.5 segundos após atingir máximo de seleções
- **Seleção única**: Avanço imediato
- **Seleção múltipla**: Avanço quando atinge máximo (3 opções)

## 📊 TRACKING E ANALYTICS

### **Eventos Rastreados:**

```typescript
// Clique em opção
analyticsService.trackQuestionAnswer(quizId, questionId, answer, userId);

// Avanço de página
analyticsService.trackPageView(quizId, pageId, userId);

// Conclusão do quiz
analyticsService.trackQuizCompletion(quizId, result, userId);
```

### **Dados Coletados:**

- ✅ **Tempo por pergunta**: Quanto tempo para responder
- ✅ **Opções selecionadas**: Quais escolhas foram feitas
- ✅ **Taxa de abandono**: Em que pergunta desistiu
- ✅ **Padrões de seleção**: Sequência de cliques
- ✅ **Resultado final**: Estilo predominante calculado

## 🎯 FLUXO COMPLETO

1. **Usuário acessa** → Pergunta 1 carregada
2. **Seleciona 3 opções** → Pontos somados por categoria
3. **Auto-avanço ativado** → Vai para Pergunta 2
4. **Repete 21 vezes** → Acumula pontos
5. **Cálculo final** → Determina estilo predominante
6. **Resultado exibido** → Características e recomendações
7. **Analytics salvo** → Dados para otimização

**O sistema é completamente data-driven, permitindo ajustes finos na pontuação e regras sem alterar código!** 🚀
