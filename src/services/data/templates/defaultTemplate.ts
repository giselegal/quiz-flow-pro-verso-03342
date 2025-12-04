/**
 * Default Template V4 - Fallback quando JSON não disponível
 */

export const DEFAULT_QUIZ_TEMPLATE = {
  version: "4.0.0",
  schemaVersion: "4.0",
  metadata: {
    id: "quiz21StepsComplete",
    name: "Quiz de Estilo Pessoal",
    title: "Quiz de Estilo Pessoal",
    description: "Template v4.0 para quiz interativo",
    slug: "quiz-estilo-pessoal",
    author: "Sistema",
    category: "quiz",
    tags: ["quiz", "estilo", "v4"],
    language: "pt-BR",
    status: "published",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-12-04T00:00:00.000Z"
  },
  theme: {
    colors: {
      primary: "#B89B7A",
      primaryHover: "#A68B6A",
      primaryLight: "#F3E8D3",
      secondary: "#432818",
      background: "#FAF9F7",
      text: "#1F2937",
      border: "#E5E7EB"
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Inter, sans-serif"
    },
    spacing: { sm: 8, md: 16, lg: 24, xl: 32 },
    borderRadius: { sm: 4, md: 8, lg: 12, xl: 16 }
  },
  settings: {
    scoring: { mode: "weighted", maxScore: 100, passingScore: 50 },
    navigation: { showProgress: true, allowBack: true, autoAdvance: false },
    validation: { requireAllAnswers: true, showErrors: true }
  },
  steps: [
    {
      id: "step-01",
      type: "intro",
      order: 1,
      title: "Bem-vindo",
      description: "Introdução ao quiz",
      blocks: [
        {
          id: "block-01-header",
          type: "header",
          order: 0,
          properties: { title: "Descubra seu Estilo", subtitle: "Responda algumas perguntas", alignment: "center" }
        },
        {
          id: "block-01-button",
          type: "button",
          order: 1,
          properties: { text: "Começar Quiz", variant: "primary", action: "next" }
        }
      ],
      navigation: { nextStep: "step-02", conditions: [] },
      validation: { required: false, rules: {} }
    },
    {
      id: "step-02",
      type: "question",
      order: 2,
      title: "Pergunta 1",
      description: "Estilo de vida",
      blocks: [
        {
          id: "block-02-header",
          type: "header",
          order: 0,
          properties: { title: "Como você descreveria seu estilo de vida?", alignment: "center" }
        },
        {
          id: "block-02-options",
          type: "quiz-option",
          order: 1,
          properties: {
            options: [
              { id: "opt-modern", text: "Moderno e dinâmico", value: "modern", score: 10 },
              { id: "opt-classic", text: "Clássico e elegante", value: "classic", score: 10 },
              { id: "opt-minimalist", text: "Minimalista e funcional", value: "minimalist", score: 10 }
            ],
            allowMultiple: false
          }
        }
      ],
      navigation: { nextStep: "step-result", conditions: [] },
      validation: { required: true, rules: {} }
    },
    {
      id: "step-result",
      type: "result",
      order: 3,
      title: "Resultado",
      description: "Seu resultado personalizado",
      blocks: [
        {
          id: "block-result-header",
          type: "header",
          order: 0,
          properties: { title: "Seu Estilo", subtitle: "Baseado nas suas respostas", alignment: "center" }
        },
        {
          id: "block-result-content",
          type: "text",
          order: 1,
          properties: { content: "Parabéns! Você completou o quiz.", alignment: "center" }
        }
      ],
      navigation: { nextStep: null, conditions: [] },
      validation: { required: false, rules: {} }
    }
  ],
  outcomes: [
    { id: "outcome-modern", title: "Estilo Moderno", description: "Você tem um estilo moderno", minScore: 0, maxScore: 50, conditions: [] },
    { id: "outcome-classic", title: "Estilo Clássico", description: "Você tem um estilo clássico", minScore: 51, maxScore: 100, conditions: [] }
  ]
} as const;

export default DEFAULT_QUIZ_TEMPLATE;
