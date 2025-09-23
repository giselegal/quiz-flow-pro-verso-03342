# Plano de Ação para Implantação do Quiz de Estilo Pessoal

## 1. Análise e Estruturação do Projeto
- Revisar o HTML fornecido e identificar todos os componentes e lógicas essenciais (etapas, estilos, imagens, resultados, ofertas, etc).
- Definir a stack tecnológica (React, Next.js, Tailwind CSS, integração com Gemini API, etc).
- Planejar a estrutura de pastas e arquivos para separar lógica, dados e apresentação.

## 2. Modelagem dos Dados
- Estruturar os dados dos estilos (styleConfig) em um arquivo separado (ex: `src/data/styles.ts`).
- Estruturar as etapas do quiz (QUIZ_STEPS) em um arquivo separado (ex: `src/data/quizSteps.ts`).
- Garantir que imagens, descrições, dicas e ofertas estejam centralizadas e facilmente editáveis.

## 3. Implementação do Frontend
- Criar o componente principal do Quiz (`QuizApp`), responsável pelo estado global e navegação entre etapas.
- Implementar componentes reutilizáveis para:
  - Etapas de introdução, perguntas, transições, resultado e oferta.
  - Cartões de opções com imagens e seleção múltipla.
  - Barra de progresso e navegação.
- Aplicar o design visual conforme o HTML (cores, fontes, responsividade, classes Tailwind).

## 4. Lógica do Quiz
- Implementar a lógica de navegação entre etapas e armazenamento das respostas.
- Calcular o estilo predominante e secundários com base nas respostas.
- Exibir o resultado personalizado, incluindo imagens, descrição, dicas e oferta.
- Implementar perguntas estratégicas e lógica condicional para ofertas.

## 5. Integração com APIs Externas
- Integrar com Gemini API para geração de conteúdo e imagens, se necessário.
- Garantir que a chave da API seja fornecida em tempo de execução e não exposta no frontend.

## 6. Testes e Validação
- Testar todos os fluxos do quiz (desktop e mobile).
- Validar a exibição correta de imagens, textos, dicas e ofertas.
- Garantir acessibilidade e usabilidade.

## 7. Deploy e Monitoramento
- Configurar ambiente de produção (Vercel, Netlify, etc).
- Realizar deploy e validar funcionamento em ambiente real.
- Monitorar uso e coletar feedbacks para melhorias.

## 8. Documentação
- Documentar a estrutura do projeto, principais componentes e pontos de customização.
- Incluir instruções para manutenção e atualização dos dados do quiz.

---

## 9. Modelo do Código Fornecido

### Estrutura HTML Base
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz de Estilo Pessoal - Gisele Galvão</title>
  <!-- Fontes Google: Inter + Playfair Display -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
```

### Paleta de Cores e Estilos
```css
/* Cores principais */
background-color: #FAF9F7; /* Fundo geral */
color: #432818; /* Texto principal */
border-color: #B89B7A; /* Cor de destaque/botões */

/* Classes especiais */
.special-tips { background-color: #F8F9FA; border-left: 4px solid #B89B7A; }
.option-selected { border: 2px solid #432818; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.quiz-button { background-color: #B89B7A; }
.quiz-button-disabled { background-color: #E6DDD4; cursor: not-allowed; }
```

### Estado Global do Quiz
```javascript
const quizState = {
  currentStep: 'step-1',
  answers: {}, // Respostas por etapa
  scores: {
    natural: 0, classico: 0, contemporaneo: 0, elegante: 0,
    romantico: 0, sexy: 0, dramatico: 0, criativo: 0
  },
  userProfile: {
    userName: '',
    resultStyle: '',
    secondaryStyles: [],
    strategicAnswers: {}
  }
};
```

### Configuração dos Estilos
```javascript
const styleConfig = {
  Natural: {
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
    description: 'Você valoriza o conforto e a praticidade...',
    category: 'Conforto & Praticidade',
    keywords: ['conforto', 'praticidade', 'descontraído', 'autêntico'],
    specialTips: ['Invista em peças de algodão, linho e malha.', ...]
  },
  // ... outros estilos (Clássico, Contemporâneo, Elegante, Romântico, Sexy, Dramático, Criativo)
};
```

### Estrutura das Etapas do Quiz
```javascript
const QUIZ_STEPS = {
  'step-1': {
    type: 'intro',
    title: 'Chega de um guarda-roupa lotado...',
    formQuestion: 'Como posso te chamar?',
    placeholder: 'Digite seu primeiro nome aqui...',
    buttonText: 'Quero Descobrir meu Estilo Agora!',
    image: 'https://...',
    nextStep: 'step-2'
  },
  'step-2': {
    type: 'question',
    questionNumber: '1 de 10',
    questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    requiredSelections: 3,
    options: [
      { id: 'natural', text: 'Conforto, leveza e praticidade...', image: '...' },
      // ... 8 opções com IDs dos estilos
    ],
    nextStep: 'step-3'
  },
  // ... steps 3-11: perguntas do quiz (10 total)
  'step-12': { type: 'transition', title: '🕐 Enquanto calculamos...' },
  // ... steps 13-18: perguntas estratégicas
  'step-19': { type: 'transition-result' },
  'step-20': { type: 'result' },
  'step-21': { type: 'offer', offerMap: {...} }
};
```

### Lógica de Cálculo do Resultado
```javascript
function calculateResult() {
  const scoreMap = {
    'natural': 'Natural', 'classico': 'Clássico', 
    'contemporaneo': 'Contemporaneo', 'elegante': 'Elegante',
    // ... mapeamento de IDs para nomes
  };

  // Conta pontos por estilo baseado nas respostas
  for (const step in quizState.answers) {
    quizState.answers[step].forEach(selectionId => {
      const style = scoreMap[selectionId];
      if (style) quizState.scores[style] += 1;
    });
  }

  // Define estilo principal e secundários
  const sortedStyles = Object.keys(quizState.scores)
    .sort((a, b) => quizState.scores[b] - quizState.scores[a]);
  
  quizState.userProfile.resultStyle = sortedStyles[0];
  quizState.userProfile.secondaryStyles = sortedStyles.slice(1, 3);
}
```

### Estrutura da Oferta Personalizada
```javascript
// Em step-21, mapa de ofertas baseado nas respostas estratégicas
offerMap: {
  'Montar looks com mais facilidade e confiança': {
    title: '{userName}, encontramos a solução...',
    description: 'Chega de incertezas...',
    buttonText: 'Quero aprender a combinar...',
    testimonial: { quote: '...', author: 'Márcia Silva, 38 anos, Advogada' }
  },
  // ... outras 3 ofertas personalizadas
}
```

### Fluxo de Navegação
1. **Introdução** (step-1): Coleta nome do usuário
2. **Quiz Principal** (steps 2-11): 10 perguntas com 3 seleções obrigatórias cada
3. **Transição** (step-12): Loading enquanto calcula
4. **Perguntas Estratégicas** (steps 13-18): 6 perguntas para personalizar oferta
5. **Transição Resultado** (step-19): Loading final
6. **Resultado** (step-20): Exibe estilo predominante + dicas
7. **Oferta** (step-21): Oferta personalizada baseada nas respostas estratégicas

### APIs Externas
```javascript
// Configuração Gemini API (chave fornecida em runtime)
const apiKey = ""; 
const textApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
const imageApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
```

---

**Observações:**
- O plano pode ser adaptado conforme a stack e requisitos do projeto.
- Recomenda-se versionar o código e realizar deploy incremental para facilitar testes e ajustes.
