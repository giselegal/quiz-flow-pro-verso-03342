import { QuizTemplate } from '@/types/quizBuilder';

export const realQuizTemplates = {
  styleQuiz: {
    id: 'quiz-estilo',
    name: 'Quiz de Estilo Pessoal',
    description: 'Descubra seu estilo pessoal único',
    settings: {
      theme: 'modern',
      allowSkip: false,
      showProgress: true,
      multiSelect: true
    },
    questions: [
      {
        id: 'q1',
        text: 'Qual destas peças de roupa mais te agrada?',
        type: 'normal',
        options: [
          { id: "1a", text: "Jeans skinny", imageUrl: "/images/quiz/q1/1a.png", value: "1a", category: "Calças" },
          { id: "1b", text: "Vestido floral", imageUrl: "/images/quiz/q1/1b.png", value: "1b", category: "Vestidos" },
          { id: "1c", text: "Blazer estruturado", imageUrl: "/images/quiz/q1/1c.png", value: "1c", category: "Blazers" },
          { id: "1d", text: "Camiseta básica", imageUrl: "/images/quiz/q1/1d.png", value: "1d", category: "Camisetas" },
          { id: "1e", text: "Saia lápis", imageUrl: "/images/quiz/q1/1e.png", value: "1e", category: "Saias" },
          { id: "1f", text: "Macacão", imageUrl: "/images/quiz/q1/1f.png", value: "1f", category: "Macacão" },
          { id: "1g", text: "Calça de alfaiataria", imageUrl: "/images/quiz/q1/1g.png", value: "1g", category: "Calças" },
          { id: "1h", text: "Suéter oversized", imageUrl: "/images/quiz/q1/1h.png", value: "1h", category: "Suéteres" }
        ]
      },
      {
        id: 'q2',
        text: 'Qual destas atividades você mais gosta de fazer no fim de semana?',
        type: 'normal',
        options: [
          { id: "2a", text: "Explorar museus e galerias de arte", imageUrl: "/images/quiz/q2/2a.png", value: "2a", category: "Atividades Culturais" },
          { id: "2b", text: "Relaxar em um café charmoso com um bom livro", imageUrl: "/images/quiz/q2/2b.png", value: "2b", category: "Relaxamento" },
          { id: "2c", text: "Fazer compras em boutiques e lojas vintage", imageUrl: "/images/quiz/q2/2c.png", value: "2c", category: "Compras" },
          { id: "2d", text: "Caminhar no parque e apreciar a natureza", imageUrl: "/images/quiz/q2/2d.png", value: "2d", category: "Natureza" },
          { id: "2e", text: "Sair para dançar em uma festa com amigos", imageUrl: "/images/quiz/q2/2e.png", value: "2e", category: "Vida Noturna" },
          { id: "2f", text: "Cozinhar uma refeição gourmet em casa", imageUrl: "/images/quiz/q2/2f.png", value: "2f", category: "Culinária" },
          { id: "2g", text: "Assistir a um filme clássico em um cinema antigo", imageUrl: "/images/quiz/q2/2g.png", value: "2g", category: "Cinema" },
          { id: "2h", text: "Visitar um mercado de produtores locais", imageUrl: "/images/quiz/q2/2h.png", value: "2h", category: "Mercado Local" }
        ]
      },
      {
        id: 'q3',
        text: 'Qual acessório você considera indispensável no seu dia a dia?',
        type: 'normal',
        options: [
          { id: "3a", text: "Bolsa tote de couro", imageUrl: "/images/quiz/q3/3a.png", value: "3a", category: "Bolsas" },
          { id: "3b", text: "Lenço de seda estampado", imageUrl: "/images/quiz/q3/3b.png", value: "3b", category: "Lenços" },
          { id: "3c", text: "Relógio clássico", imageUrl: "/images/quiz/q3/3c.png", value: "3c", category: "Relógios" },
          { id: "3d", text: "Chapéu de feltro", imageUrl: "/images/quiz/q3/3d.png", value: "3d", category: "Chapéus" },
          { id: "3e", text: "Óculos de sol oversized", imageUrl: "/images/quiz/q3/3e.png", value: "3e", category: "Óculos de Sol" },
          { id: "3f", text: "Cinto de couro com fivela", imageUrl: "/images/quiz/q3/3f.png", value: "3f", category: "Cintos" },
          { id: "3g", text: "Colar de pérolas", imageUrl: "/images/quiz/q3/3g.png", value: "3g", category: "Colares" },
          { id: "3h", text: "Mochila de lona", imageUrl: "/images/quiz/q3/3h.png", value: "3h", category: "Mochilas" }
        ]
      },
      {
        id: 'q4',
        text: 'Qual ambiente mais te inspira?',
        type: 'normal',
        options: [
          { id: "4a", text: "Um jardim secreto cheio de flores", imageUrl: "/images/quiz/q4/4a.png", value: "4a", category: "Natureza" },
          { id: "4b", text: "Uma biblioteca antiga com livros do chão ao teto", imageUrl: "/images/quiz/q4/4b.png", value: "4b", category: "Ambientes Culturais" },
          { id: "4c", text: "Um café aconchegante com música suave", imageUrl: "/images/quiz/q4/4c.png", value: "4c", category: "Cafés" },
          { id: "4d", text: "Uma galeria de arte moderna com obras vibrantes", imageUrl: "/images/quiz/q4/4d.png", value: "4d", category: "Arte Moderna" },
          { id: "4e", text: "Um terraço com vista para a cidade", imageUrl: "/images/quiz/q4/4e.png", value: "4e", category: "Paisagens Urbanas" },
          { id: "4f", text: "Uma praia deserta com o som das ondas", imageUrl: "/images/quiz/q4/4f.png", value: "4f", category: "Praias" },
          { id: "4g", text: "Um ateliê de moda com manequins e tecidos", imageUrl: "/images/quiz/q4/4g.png", value: "4g", category: "Ateliês de Moda" },
          { id: "4h", text: "Um estúdio de dança com espelhos e música", imageUrl: "/images/quiz/q4/4h.png", value: "4h", category: "Estúdios de Dança" }
        ]
      },
      {
        id: 'q5',
        text: 'Qual estampa você prefere usar em suas roupas?',
        type: 'normal',
        options: [
          { id: "5a", text: "Listras clássicas", imageUrl: "/images/quiz/q5/5a.png", value: "5a", category: "Clássico" },
          { id: "5b", text: "Floral delicado", imageUrl: "/images/quiz/q5/5b.png", value: "5b", category: "Romântico" },
          { id: "5c", text: "Animal print ousado", imageUrl: "/images/quiz/q5/5c.png", value: "5c", category: "Sexy" },
          { id: "5d", text: "Xadrez moderno", imageUrl: "/images/quiz/q5/5d.png", value: "5d", category: "Contemporâneo" },
          { id: "5e", text: "Poá divertido", imageUrl: "/images/quiz/q5/5e.png", value: "5e", category: "Criativo" },
          { id: "5f", text: "Étnico vibrante", imageUrl: "/images/quiz/q5/5f.png", value: "5f", category: "Dramático" },
          { id: "5g", text: "Tie-dye psicodélico", imageUrl: "/images/quiz/q5/5g.png", value: "5g", category: "Criativo" },
          { id: "5h", text: "Geométrico abstrato", imageUrl: "/images/quiz/q5/5h.png", value: "5h", category: "Moderno" }
        ]
      },
      {
        id: 'q6',
        text: 'Qual casaco você escolheria para um dia frio?',
        type: 'normal',
        options: [
          { id: "6a", text: "Trench coat elegante", imageUrl: "/images/quiz/q6/6a.png", value: "6a", category: "Clássico" },
          { id: "6b", text: "Jaqueta de couro estilosa", imageUrl: "/images/quiz/q6/6b.png", value: "6b", category: "Sexy" },
          { id: "6c", text: "Parka utilitária", imageUrl: "/images/quiz/q6/6c.png", value: "6c", category: "Natural" },
          { id: "6d", text: "Casaco de lã oversized", imageUrl: "/images/quiz/q6/6d.png", value: "6d", category: "Confortável" },
          { id: "6e", text: "Blazer de veludo", imageUrl: "/images/quiz/q6/6e.png", value: "6e", category: "Elegante" },
          { id: "6f", text: "Jaqueta bomber moderna", imageUrl: "/images/quiz/q6/6f.png", value: "6f", category: "Contemporâneo" },
          { id: "6g", text: "Sobretudo dramático", imageUrl: "/images/quiz/q6/6g.png", value: "6g", category: "Dramático" },
          { id: "6h", text: "Puffer jacket divertida", imageUrl: "/images/quiz/q6/6h.png", value: "6h", category: "Criativo" }
        ]
      },
      {
        id: 'q7',
        text: 'Qual tipo de calça você considera mais versátil?',
        type: 'normal',
        options: [
          { id: "7a", text: "Calça de alfaiataria clássica", imageUrl: "/images/quiz/q7/7a.png", value: "7a", category: "Clássico" },
          { id: "7b", text: "Jeans skinny moderno", imageUrl: "/images/quiz/q7/7b.png", value: "7b", category: "Contemporâneo" },
          { id: "7c", text: "Pantalona elegante", imageUrl: "/images/quiz/q7/7c.png", value: "7c", category: "Elegante" },
          { id: "7d", text: "Legging confortável", imageUrl: "/images/quiz/q7/7d.png", value: "7d", category: "Natural" },
          { id: "7e", text: "Calça flare retrô", imageUrl: "/images/quiz/q7/7e.png", value: "7e", category: "Boho" },
          { id: "7f", text: "Calça cargo utilitária", imageUrl: "/images/quiz/q7/7f.png", value: "7f", category: "Aventura" },
          { id: "7g", text: "Calça clochard fashionista", imageUrl: "/images/quiz/q7/7g.png", value: "7g", category: "Criativo" },
          { id: "7h", text: "Calça de couro ousada", imageUrl: "/images/quiz/q7/7h.png", value: "7h", category: "Sexy" }
        ]
      },
      {
        id: 'q8',
        text: 'Qual sapato você usaria para um evento especial?',
        type: 'normal',
        options: [
          { id: "8a", text: "Scarpin clássico", imageUrl: "/images/quiz/q8/8a.png", value: "8a", category: "Clássico" },
          { id: "8b", text: "Sandália de salto elegante", imageUrl: "/images/quiz/q8/8b.png", value: "8b", category: "Elegante" },
          { id: "8c", text: "Bota de cano alto moderna", imageUrl: "/images/quiz/q8/8c.png", value: "8c", category: "Sexy" },
          { id: "8d", text: "Sapatilha confortável", imageUrl: "/images/quiz/q8/8d.png", value: "8d", category: "Natural" },
          { id: "8e", text: "Oxford estiloso", imageUrl: "/images/quiz/q8/8e.png", value: "8e", category: "Andrógino" },
          { id: "8f", text: "Mocassim fashionista", imageUrl: "/images/quiz/q8/8f.png", value: "8f", category: "Contemporâneo" },
          { id: "8g", text: "Plataforma ousada", imageUrl: "/images/quiz/q8/8g.png", value: "8g", category: "Criativo" },
          { id: "8h", text: "Ankle boot moderna", imageUrl: "/images/quiz/q8/8h.png", value: "8h", category: "Fashionista" }
        ]
      },
      {
        id: 'q9',
        text: 'Qual acessório de moda te define?',
        type: 'normal',
        options: [
          { id: "9a", text: "Bolsa estruturada", imageUrl: "/images/quiz/q9/9a.png", value: "9a", category: "Clássico" },
          { id: "9b", text: "Joias delicadas", imageUrl: "/images/quiz/q9/9b.png", value: "9b", category: "Romântico" },
          { id: "9c", text: "Óculos de sol statement", imageUrl: "/images/quiz/q9/9c.png", value: "9c", category: "Moderno" },
          { id: "9d", text: "Cinto de grife", imageUrl: "/images/quiz/q9/9d.png", value: "9d", category: "Elegante" },
          { id: "9e", text: "Chapéu estiloso", imageUrl: "/images/quiz/q9/9e.png", value: "9e", category: "Boho" },
          { id: "9f", text: "Cachecol de seda", imageUrl: "/images/quiz/q9/9f.png", value: "9f", category: "Sofisticado" },
          { id: "9g", text: "Pulseiras divertidas", imageUrl: "/images/quiz/q9/9g.png", value: "9g", category: "Criativo" },
          { id: "9h", text: "Brincos chamativos", imageUrl: "/images/quiz/q9/9h.png", value: "9h", category: "Dramático" }
        ]
      },
      {
        id: 'q10',
        text: 'Qual tecido você mais gosta de usar?',
        type: 'normal',
        options: [
          { id: "10a", text: "Algodão", value: "10a", category: "Natural" },
          { id: "10b", text: "Seda", value: "10b", category: "Elegante" },
          { id: "10c", text: "Linho", value: "10c", category: "Verão" },
          { id: "10d", text: "Veludo", value: "10d", category: "Inverno" },
          { id: "10e", text: "Couro", value: "10e", category: "Rock" },
          { id: "10f", text: "Renda", value: "10f", category: "Romântico" },
          { id: "10g", text: "Jeans", value: "10g", category: "Casual" },
          { id: "10h", text: "Lã", value: "10h", category: "Aconchegante" }
        ]
      }
    ]
  }
};

// Metadados de scoring e validação para as questões
export const QUIZ_QUESTIONS_METADATA = {
  q1: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q2: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q3: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q4: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q5: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q6: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q7: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q8: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q9: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  },
  q10: { 
    type: 'normal',
    scoring: true,
    multiSelect: 3,
    minSelections: 1,
    maxSelections: 3,
    validationRequired: true,
    scoreWeight: 1,
    exactSelections: false
  }
} as const;

// Categorias de estilo disponíveis
export const STYLE_CATEGORIES = [
  'Natural',
  'Clássico', 
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo'
] as const;

export type StyleCategory = typeof STYLE_CATEGORIES[number];

// Configurações de pontuação
export const SCORING_CONFIG = {
  pointsPerSelection: 1,
  maxSelectionsPerQuestion: 3,
  minSelectionsPerQuestion: 1,
  totalQuestions: 10,
  passageThreshold: 0.6,
  tieBreakingMethod: 'firstSelection' as const
};

// Helper function to get question metadata
export function getQuestionMetadata(questionId: string) {
  const metadata = QUIZ_QUESTIONS_METADATA[questionId as keyof typeof QUIZ_QUESTIONS_METADATA];
  return metadata || null;
}

// Helper function to validate question selection
export function validateQuestionSelection(questionId: string, selectedCount: number): boolean {
  const metadata = getQuestionMetadata(questionId);
  if (!metadata) return false;
  
  return selectedCount >= metadata.minSelections && selectedCount <= metadata.maxSelections;
}
