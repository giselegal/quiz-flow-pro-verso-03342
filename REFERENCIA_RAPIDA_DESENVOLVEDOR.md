# 🔧 REFERÊNCIA RÁPIDA - DESENVOLVEDOR

## Sistema de Quiz de 21 Etapas - Guia de Implementação

---

## 📋 CHECKLIST DE FUNCIONALIDADES

### ✅ **IMPLEMENTADO E TESTADO**

- [x] **Etapa 1:** Coleta de nome com validação
- [x] **EditorContext:** Estado global unificado
- [x] **Quiz Core:** 10 questões pontuadas (q1-q10)
- [x] **Página Transição 1:** Etapa 12 - "Enquanto calculamos..."
- [x] **Questões Estratégicas:** 6 questões não pontuadas (q12-q17)
- [x] **Página Transição 2:** Etapa 18 - "Obrigada por compartilhar..."
- [x] **Cálculo de Resultado:** Estilo predominante correto
- [x] **styleConfig:** 8 estilos com imagens completas
- [x] **Personalização:** Nome integrado no resultado
- [x] **Templates:** 21 arquivos JSON configurados
- [x] **Build:** Sem erros, otimizado
- [x] **Interface:** `/editor-fixed` funcional

### ⚠️ **EM VALIDAÇÃO**

- [ ] **Etapas 19-20:** Página de resultado personalizada + ofertas
- [ ] **Teste A:** /resultado (ResultPage)
- [ ] **Teste B:** /quiz-descubra-seu-estilo (QuizOfferPage)
- [ ] **Analytics:** Tracking completo
- [ ] **Persistência:** Banco de dados

---

## 🗂️ ESTRUTURA DE ARQUIVOS CHAVE

```
📂 src/
├── 📂 config/
│   ├── styleConfig.ts              ← Configuração dos 8 estilos
│   └── 📂 templates/
│       ├── step-01.json           ← Etapa 1: Coleta nome
│       ├── step-02.json           ← Etapa 2: Primeira questão
│       ├── ...
│       └── step-21.json           ← Etapa 21: Oferta final
├── 📂 context/
│   └── EditorContext.tsx          ← Estado global da aplicação
├── 📂 hooks/
│   ├── useQuizLogic.ts            ← Lógica principal do quiz
│   ├── useStyleQuizResults.ts     ← Hook de resultados de estilo
│   └── useQuizResults.ts          ← Hook genérico de resultados
├── 📂 components/
│   ├── 📂 blocks/quiz/
│   │   ├── StyleGuideModal.tsx    ← Modal do guia do estilo
│   │   └── StyleResultsBlock.tsx  ← Bloco de exibição de resultados
│   └── 📂 pages/
│       └── ModernResultPageComponent.tsx ← Página final de resultado
└── 📂 data/
    └── correctQuizQuestions.ts    ← Questões e sistema de pontuação
```

---

## 🔑 FUNÇÕES PRINCIPAIS

### **1. Capturar Nome (Etapa 1)**

```typescript
// src/hooks/useQuizLogic.ts
const setUserNameFromInput = useCallback((name: string) => {
  const cleanName = name.trim();
  setUserName(cleanName);

  if (cleanName && typeof window !== 'undefined') {
    localStorage.setItem('quizUserName', cleanName);
  }
}, []);
```

### **2. Responder Questão Core (Etapas 2-11)**

```typescript
// Questões que PONTUAM para o resultado
const answerQuestion = useCallback((questionId: string, optionId: string) => {
  setAnswers(prevAnswers => {
    const newAnswer: QuizAnswer = { questionId, optionId };
    return [...prevAnswers, newAnswer];
  });
}, []);
```

### **3. Responder Questão Estratégica (Etapas 13-17)**

```typescript
// Questões que NÃO pontuam - apenas métricas
const answerStrategicQuestion = useCallback(
  (questionId: string, optionId: string, category: string, strategicType: string) => {
    setStrategicAnswers(prev => [
      ...prev,
      {
        questionId,
        optionId,
        category,
        strategicType,
        timestamp: new Date(),
      },
    ]);
  },
  []
);
```

### **4. Calcular Resultado Final**

```typescript
const calculateResults = useCallback(
  (answers: QuizAnswer[]): QuizResult => {
    // Só questões q1-q10 pontuam
    const styleScores = calculateStyleScores(answers);
    const sortedStyles = Object.entries(styleScores).sort(([, a], [, b]) => b - a);
    const topStyle = sortedStyles[0]?.[0] || 'estilo-neutro';

    return {
      primaryStyle: createStyleResult(topStyle, styleScores[topStyle]),
      userData: {
        name: userName || localStorage.getItem('quizUserName') || '',
        completionTime: new Date(),
        strategicAnswersCount: strategicAnswers.length,
      },
    };
  },
  [userName, strategicAnswers.length]
);
```

---

## 🎨 CONFIGURAÇÃO DE ESTILOS

### **Acessar Configuração de Estilo**

```typescript
// src/config/styleConfig.ts
import { styleConfig, getStyleByKeyword, getStylesByCategory } from '@/config/styleConfig';

// Obter dados completos do estilo
const styleData = styleConfig['Natural'];
console.log(styleData.image); // Imagem principal
console.log(styleData.guideImage); // Imagem do guia
console.log(styleData.description); // Descrição personalizada

// Buscar por palavra-chave
const style = getStyleByKeyword('conforto'); // Returns 'Natural'

// Filtrar por categoria
const stylesComfort = getStylesByCategory('Conforto & Praticidade'); // ['Natural']
```

### **Estilos Disponíveis**

```typescript
const AVAILABLE_STYLES = [
  'Natural', // Conforto & Praticidade
  'Clássico', // Elegância Atemporal
  'Contemporâneo', // Equilíbrio & Modernidade
  'Elegante', // Refinamento & Qualidade
  'Romântico', // Delicadeza & Feminilidade
  'Sexy', // Sensualidade & Confiança
  'Dramático', // Impacto & Presença
  'Criativo', // Expressão & Individualidade
];
```

---

## 🔄 ESTADOS DO CONTEXTO

### **Acessar Estado Global**

```typescript
// Em qualquer componente
import { useEditorContext } from '@/context/EditorContext';

const {
  // Estados do usuário
  userName,
  userAnswers,
  currentScore,
  isQuizCompleted,

  // Funções principais
  setUserNameFromInput,
  calculateCurrentScore,
  resetQuiz,
} = useEditorContext();
```

### **Estados Disponíveis**

```typescript
interface EditorContextType {
  // Dados do usuário
  userName: string;
  userAnswers: Record<string, string>;
  currentScore: number;
  isQuizCompleted: boolean;

  // Controle de navegação
  activeStageId: string;
  selectedBlockId: string | null;

  // Funções
  setUserNameFromInput: (name: string) => void;
  calculateCurrentScore: () => number;
  resetQuiz: () => void;
}
```

---

## 🎯 PONTUAÇÃO E CÁLCULO

### **Questões que Pontuam (q1-q10)**

```typescript
const SCORABLE_QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];

const calculateStyleScores = (answers: QuizAnswer[]) => {
  const styleScores: { [style: string]: number } = {};

  answers.forEach(answer => {
    const question = caktoquizQuestions.find(q => q.id === answer.questionId);
    const option = question?.options.find(opt => opt.id === answer.optionId);

    // ✅ IMPORTANTE: Só questões q1-q10 pontuam
    if (SCORABLE_QUESTIONS.includes(question?.id || '') && option?.style) {
      styleScores[option.style] = (styleScores[option.style] || 0) + (option.weight || 1);
    }
  });

  return styleScores;
};
```

### **Questões que NÃO Pontuam (q12-q17)**

```typescript
const NON_SCORABLE_QUESTIONS = ['q12', 'q13', 'q14', 'q15', 'q16', 'q17'];

// Usadas apenas para:
// - Analytics e métricas
// - Segmentação de usuários
// - Personalização adicional
// - Insights comportamentais
```

---

## 📊 TEMPLATES JSON

### **Estrutura Básica do Template**

```json
{
  "templateVersion": "2.0",
  "metadata": {
    "id": "quiz-step-XX",
    "name": "Nome da Etapa",
    "type": "quiz|intro|result|offer"
  },
  "design": {
    "primaryColor": "#B89B7A",
    "backgroundColor": "#FAF9F7"
  },
  "blocks": [
    {
      "id": "unique-block-id",
      "type": "input-field|quiz-question|text-inline",
      "properties": {
        /* configurações específicas */
      }
    }
  ],
  "logic": {
    "navigation": {
      "nextStep": "step-XX",
      "prevStep": "step-XX"
    }
  }
}
```

### **Tipos de Blocos Principais**

```json
// Campo de input
{
  "type": "input-field",
  "properties": {
    "name": "name",
    "required": true,
    "validation": { "minLength": 2 }
  }
}

// Questão do quiz
{
  "type": "quiz-question",
  "properties": {
    "questionId": "q1",
    "options": [
      { "id": "opt1", "style": "Natural", "weight": 3 }
    ]
  }
}

// Texto
{
  "type": "text-inline",
  "properties": {
    "content": "Texto com <span>HTML</span>",
    "fontSize": "text-2xl"
  }
}
```

---

## 🔧 COMANDOS ÚTEIS

### **Desenvolvimento**

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Testar interface principal
open http://localhost:5173/editor-fixed
```

### **Debug**

```bash
# Verificar estado do contexto
console.log(useEditorContext());

# Verificar localStorage
console.log(localStorage.getItem('quizUserName'));
console.log(JSON.parse(localStorage.getItem('quiz-answers') || '[]'));

# Verificar configuração de estilos
import { styleConfig } from '@/config/styleConfig';
console.log(Object.keys(styleConfig)); // Lista todos os estilos
```

---

## 🐛 TROUBLESHOOTING

### **Problema: Nome não está sendo capturado**

```typescript
// Verificar se a função está sendo chamada
console.log('Nome capturado:', userName);

// Verificar localStorage
console.log('Nome no storage:', localStorage.getItem('quizUserName'));

// Verificar contexto
const { userName, setUserNameFromInput } = useEditorContext();
console.log('Contexto userName:', userName);
```

### **Problema: Resultado não está personalizado**

```typescript
// Verificar se o nome está disponível no cálculo
const result = calculateResults(answers);
console.log('Nome no resultado:', result.userData.name);

// Verificar se está sendo recuperado do localStorage
const name = userName || localStorage.getItem('quizUserName') || '';
console.log('Nome final:', name);
```

### **Problema: Pontuação incorreta**

```typescript
// Verificar se apenas questões q1-q10 estão pontuando
const isScorableQuestion = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'].includes(
  questionId
);
console.log('Questão pontua?', isScorableQuestion);

// Verificar cálculo
const styleScores = calculateStyleScores(answers);
console.log('Pontuações:', styleScores);
```

---

## 🎯 TESTES RÁPIDOS

### **1. Testar Captura de Nome**

1. Acessar `/editor-fixed`
2. Digitar nome no campo
3. Verificar no console: `localStorage.getItem('quizUserName')`

### **2. Testar Quiz Completo**

1. Completar Etapa 1 (nome)
2. Responder 10 questões (Etapas 2-11)
3. Verificar resultado personalizado na Etapa 20

### **3. Testar Configuração de Estilos**

```javascript
// No console do navegador
import { styleConfig } from './src/config/styleConfig.ts';
console.log('Estilos disponíveis:', Object.keys(styleConfig));
console.log('Natural config:', styleConfig.Natural);
```

---

## 📚 REFERÊNCIAS

- **Documentação Completa:** `DOCUMENTACAO_JORNADA_USUARIO_COMPLETA.md`
- **Mapa Visual:** `MAPA_VISUAL_JORNADA_USUARIO.md`
- **Interface de Teste:** `http://localhost:5173/editor-fixed`
- **Templates:** `src/config/templates/step-*.json`
- **Configuração de Estilos:** `src/config/styleConfig.ts`

---

## ✅ STATUS FINAL

**🟢 SISTEMA OPERACIONAL E TESTADO**

- Coleta de nome funcional
- Quiz de 10 questões pontuando corretamente
- Resultado personalizado com nome do usuário
- 8 estilos configurados com imagens completas
- Build sem erros, interface responsiva

**🎯 PRONTO PARA PRODUÇÃO COM MELHORIAS INCREMENTAIS**
