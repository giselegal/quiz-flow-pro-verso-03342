/**
 * 🎯 CONFIGURAÇÃO OTIMIZADA DAS 21 ETAPAS
 * ======================================
 *
 * Gerado automaticamente pelo configurador.
 * Contém toda a estrutura otimizada do funil.
 */

export const OPTIMIZED_FUNNEL_CONFIG = {
  id: "optimized-21-steps-funnel",
  name: "Quiz de Estilo - 21 Etapas Otimizadas",
  description: "Funil completo otimizado com componentes core reutilizáveis",
  version: "2.0.0",
  createdAt: "2025-08-06T19:21:42.982Z",
  metadata: {
    totalSteps: 21,
    coreComponents: 13,
    hasCalculations: true,
    hasPersonalization: true,
    hasConversion: true,
    optimization: "complete",
  },
  steps: [
    {
      id: "step-1",
      name: "Introdução",
      description: "Página inicial do quiz com coleta de nome",
      order: 1,
      type: "intro",
      blocks: [
        {
          id: "header-logo",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 0,
            showProgress: false,
            backgroundColor: "#F9F5F1",
            height: 80,
          },
        },
        {
          id: "main-title",
          type: "heading-inline",
          properties: {
            content: "Descubra Seu Estilo Predominante",
            level: "h1",
            textAlign: "center",
            color: "#432818",
            fontWeight: "bold",
          },
        },
        {
          id: "description",
          type: "text-inline",
          properties: {
            text: "Responda algumas perguntas rápidas e descubra qual dos 7 estilos universais combina mais com você. Este quiz foi desenvolvido por uma consultora de imagem certificada.",
            fontSize: "1.125rem",
            alignment: "center",
            color: "#6B5B4E",
          },
        },
        {
          id: "decorative-separator",
          type: "decorative-bar-inline",
          properties: {
            height: 4,
            color: "#B89B7A",
            marginTop: 20,
            marginBottom: 30,
          },
        },
        {
          id: "name-input",
          type: "form-input",
          properties: {
            label: "Qual é o seu nome?",
            placeholder: "Digite seu primeiro nome",
            required: true,
            type: "text",
            backgroundColor: "#FFFFFF",
            borderColor: "#B89B7A",
          },
        },
        {
          id: "start-button",
          type: "button-inline",
          properties: {
            text: "Iniciar Quiz Gratuitamente",
            style: "primary",
            size: "large",
            backgroundColor: "#B89B7A",
            textColor: "#FFFFFF",
          },
        },
        {
          id: "legal-notice",
          type: "legal-notice-inline",
          properties: {
            privacyText: "Política de privacidade",
            copyrightText: "© 2025 Gisele Galvão Consultoria",
            termsText: "Termos de uso",
            fontSize: "text-xs",
            textAlign: "center",
            color: "#8F7A6A",
          },
        },
      ],
    },
    {
      id: "step-2",
      name: "Q1 - Qual seu estilo de vida?",
      description: "Como você descreveria sua rotina diária?",
      order: 2,
      type: "question",
      questionData: {
        id: "q1",
        title: "Qual seu estilo de vida?",
        text: "Como você descreveria sua rotina diária?",
        options: [
          {
            id: "a",
            text: "Prática e dinâmica",
            score: {
              natural: 3,
              classico: 1,
            },
          },
          {
            id: "b",
            text: "Organizada e estruturada",
            score: {
              classico: 3,
              elegante: 1,
            },
          },
          {
            id: "c",
            text: "Criativa e flexível",
            score: {
              romantico: 2,
              criativo: 3,
            },
          },
          {
            id: "d",
            text: "Sofisticada e refinada",
            score: {
              elegante: 3,
              dramatico: 1,
            },
          },
        ],
      },
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 5,
            showProgress: true,
            backgroundColor: "#F9F5F1",
            height: 80,
          },
        },
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: "Qual seu estilo de vida?",
            level: "h2",
            textAlign: "center",
            color: "#432818",
            fontWeight: "600",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: "Como você descreveria sua rotina diária?",
            columns: "2",
            gap: 16,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: true,
            imagePosition: "top",
            options: [
              {
                id: "a",
                text: "Prática e dinâmica",
                score: {
                  natural: 3,
                  classico: 1,
                },
              },
              {
                id: "b",
                text: "Organizada e estruturada",
                score: {
                  classico: 3,
                  elegante: 1,
                },
              },
              {
                id: "c",
                text: "Criativa e flexível",
                score: {
                  romantico: 2,
                  criativo: 3,
                },
              },
              {
                id: "d",
                text: "Sofisticada e refinada",
                score: {
                  elegante: 3,
                  dramatico: 1,
                },
              },
            ],
          },
        },
        {
          id: "progress-bar",
          type: "quiz-progress",
          properties: {
            currentStep: 2,
            totalSteps: 21,
            showNumbers: true,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            height: 8,
            animated: true,
          },
        },
      ],
    },
    {
      id: "step-3",
      name: "Q2 - Qual sua peça favorita?",
      description: "Que tipo de roupa você se sente mais confortável?",
      order: 3,
      type: "question",
      questionData: {
        id: "q2",
        title: "Qual sua peça favorita?",
        text: "Que tipo de roupa você se sente mais confortável?",
        options: [
          {
            id: "a",
            text: "Jeans e camiseta básica",
            score: {
              natural: 3,
              contemporaneo: 1,
            },
          },
          {
            id: "b",
            text: "Blazer e calça social",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Vestido fluido e delicado",
            score: {
              romantico: 3,
              natural: 1,
            },
          },
          {
            id: "d",
            text: "Peças estruturadas e marcantes",
            score: {
              dramatico: 3,
              elegante: 1,
            },
          },
        ],
      },
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 10,
            showProgress: true,
            backgroundColor: "#F9F5F1",
            height: 80,
          },
        },
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: "Qual sua peça favorita?",
            level: "h2",
            textAlign: "center",
            color: "#432818",
            fontWeight: "600",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: "Que tipo de roupa você se sente mais confortável?",
            columns: "2",
            gap: 16,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: true,
            imagePosition: "top",
            options: [
              {
                id: "a",
                text: "Jeans e camiseta básica",
                score: {
                  natural: 3,
                  contemporaneo: 1,
                },
              },
              {
                id: "b",
                text: "Blazer e calça social",
                score: {
                  classico: 3,
                  elegante: 2,
                },
              },
              {
                id: "c",
                text: "Vestido fluido e delicado",
                score: {
                  romantico: 3,
                  natural: 1,
                },
              },
              {
                id: "d",
                text: "Peças estruturadas e marcantes",
                score: {
                  dramatico: 3,
                  elegante: 1,
                },
              },
            ],
          },
        },
        {
          id: "progress-bar",
          type: "quiz-progress",
          properties: {
            currentStep: 3,
            totalSteps: 21,
            showNumbers: true,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            height: 8,
            animated: true,
          },
        },
      ],
    },
    {
      id: "step-4",
      name: "Q3 - Cores que mais te atraem?",
      description: "Qual paleta de cores você prefere?",
      order: 4,
      type: "question",
      questionData: {
        id: "q3",
        title: "Cores que mais te atraem?",
        text: "Qual paleta de cores você prefere?",
        options: [
          {
            id: "a",
            text: "Tons terrosos e neutros",
            score: {
              natural: 3,
              classico: 1,
            },
          },
          {
            id: "b",
            text: "Cores sólidas e atemporais",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Pastéis e tons suaves",
            score: {
              romantico: 3,
              criativo: 1,
            },
          },
          {
            id: "d",
            text: "Cores vibrantes e contrastantes",
            score: {
              dramatico: 3,
              contemporaneo: 2,
            },
          },
        ],
      },
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 15,
            showProgress: true,
            backgroundColor: "#F9F5F1",
            height: 80,
          },
        },
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: "Cores que mais te atraem?",
            level: "h2",
            textAlign: "center",
            color: "#432818",
            fontWeight: "600",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: "Qual paleta de cores você prefere?",
            columns: "2",
            gap: 16,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: true,
            imagePosition: "top",
            options: [
              {
                id: "a",
                text: "Tons terrosos e neutros",
                score: {
                  natural: 3,
                  classico: 1,
                },
              },
              {
                id: "b",
                text: "Cores sólidas e atemporais",
                score: {
                  classico: 3,
                  elegante: 2,
                },
              },
              {
                id: "c",
                text: "Pastéis e tons suaves",
                score: {
                  romantico: 3,
                  criativo: 1,
                },
              },
              {
                id: "d",
                text: "Cores vibrantes e contrastantes",
                score: {
                  dramatico: 3,
                  contemporaneo: 2,
                },
              },
            ],
          },
        },
        {
          id: "progress-bar",
          type: "quiz-progress",
          properties: {
            currentStep: 4,
            totalSteps: 21,
            showNumbers: true,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            height: 8,
            animated: true,
          },
        },
      ],
    },
    {
      id: "step-5",
      name: "Q4 - Ocasiões especiais",
      description: "Para que tipo de evento você gosta de se arrumar?",
      order: 5,
      type: "question",
      questionData: {
        id: "q4",
        title: "Ocasiões especiais",
        text: "Para que tipo de evento você gosta de se arrumar?",
        options: [
          {
            id: "a",
            text: "Eventos ao ar livre e casuais",
            score: {
              natural: 3,
              contemporaneo: 1,
            },
          },
          {
            id: "b",
            text: "Reuniões formais e corporativas",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Jantares românticos e festas",
            score: {
              romantico: 3,
              elegante: 1,
            },
          },
          {
            id: "d",
            text: "Eventos exclusivos e gala",
            score: {
              dramatico: 3,
              elegante: 2,
            },
          },
        ],
      },
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 24,
            showProgress: true,
            backgroundColor: "#F9F5F1",
            height: 80,
          },
        },
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: "Ocasiões especiais",
            level: "h2",
            textAlign: "center",
            color: "#432818",
            fontWeight: "600",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: "Para que tipo de evento você gosta de se arrumar?",
            columns: "2",
            gap: 16,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: false,
            imagePosition: "top",
            options: [
              {
                id: "a",
                text: "Eventos ao ar livre e casuais",
                score: {
                  natural: 3,
                  contemporaneo: 1,
                },
              },
              {
                id: "b",
                text: "Reuniões formais e corporativas",
                score: {
                  classico: 3,
                  elegante: 2,
                },
              },
              {
                id: "c",
                text: "Jantares românticos e festas",
                score: {
                  romantico: 3,
                  elegante: 1,
                },
              },
              {
                id: "d",
                text: "Eventos exclusivos e gala",
                score: {
                  dramatico: 3,
                  elegante: 2,
                },
              },
            ],
          },
        },
        {
          id: "step-6",
          name: "Q5 - Estilo de cabelo",
          description: "Qual tipo de penteado combina mais com você?",
          order: 6,
          type: "question",
          questionData: {
            id: "q5",
            title: "Estilo de cabelo",
            text: "Qual tipo de penteado combina mais com você?",
            options: [
              {
                id: "a",
                text: "Solto e natural",
                score: {
                  natural: 3,
                  romantico: 1,
                },
              },
              {
                id: "b",
                text: "Bem estruturado e arrumado",
                score: {
                  classico: 3,
                  elegante: 2,
                },
              },
              {
                id: "c",
                text: "Com ondas e textura",
                score: {
                  romantico: 3,
                  criativo: 1,
                },
              },
              {
                id: "d",
                text: "Liso e impecável",
                score: {
                  dramatico: 2,
                  elegante: 3,
                },
              },
            ],
          },
          blocks: [
            {
              id: "header-progress",
              type: "quiz-intro-header",
              properties: {
                logoUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                logoAlt: "Logo Gisele Galvão",
                progressValue: 29,
                showProgress: true,
                backgroundColor: "#F9F5F1",
                height: 80,
              },
            },
            {
              id: "question-title",
              type: "heading-inline",
              properties: {
                content: "Estilo de cabelo",
                level: "h2",
                textAlign: "center",
                color: "#432818",
                fontWeight: "600",
              },
            },
            {
              id: "options-grid",
              type: "options-grid",
              properties: {
                question: "Qual tipo de penteado combina mais com você?",
                columns: "2",
                gap: 16,
                selectionMode: "single",
                primaryColor: "#B89B7A",
                accentColor: "#D4C2A8",
                showImages: false,
                imagePosition: "top",
                options: [
                  {
                    id: "a",
                    text: "Solto e natural",
                    score: {
                      natural: 3,
                      romantico: 1,
                    },
                  },
                  {
                    id: "b",
                    text: "Bem estruturado e arrumado",
                    score: {
                      classico: 3,
                      elegante: 2,
                    },
                  },
                  {
                    id: "c",
                    text: "Com ondas e textura",
                    score: {
                      romantico: 3,
                      criativo: 1,
                    },
                  },
                  {
                    id: "d",
                    text: "Liso e impecável",
                    score: {
                      dramatico: 2,
                      elegante: 3,
                    },
                  },
                ],
              },
            },
            {
              id: "step-7",
              name: "Q6 - Acessórios favoritos",
              description: "Que tipo de acessórios você prefere?",
              order: 7,
              type: "question",
              questionData: {
                id: "q6",
                title: "Acessórios favoritos",
                text: "Que tipo de acessórios você prefere?",
                options: [
                  {
                    id: "a",
                    text: "Minimalistas e funcionais",
                    score: {
                      natural: 2,
                      classico: 2,
                    },
                  },
                  {
                    id: "b",
                    text: "Clássicos e atemporais",
                    score: {
                      classico: 3,
                      elegante: 1,
                    },
                  },
                  {
                    id: "c",
                    text: "Delicados e femininos",
                    score: {
                      romantico: 3,
                      natural: 1,
                    },
                  },
                  {
                    id: "d",
                    text: "Marcantes e chamativos",
                    score: {
                      dramatico: 3,
                      criativo: 2,
                    },
                  },
                ],
              },
              blocks: [
                {
                  id: "header-progress",
                  type: "quiz-intro-header",
                  properties: {
                    logoUrl:
                      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                    logoAlt: "Logo Gisele Galvão",
                    progressValue: 33,
                    showProgress: true,
                    backgroundColor: "#F9F5F1",
                    height: 80,
                  },
                },
                {
                  id: "question-title",
                  type: "heading-inline",
                  properties: {
                    content: "Acessórios favoritos",
                    level: "h2",
                    textAlign: "center",
                    color: "#432818",
                    fontWeight: "600",
                  },
                },
                {
                  id: "options-grid",
                  type: "options-grid",
                  properties: {
                    question: "Que tipo de acessórios você prefere?",
                    columns: "2",
                    gap: 16,
                    selectionMode: "single",
                    primaryColor: "#B89B7A",
                    accentColor: "#D4C2A8",
                    showImages: false,
                    imagePosition: "top",
                    options: [
                      {
                        id: "a",
                        text: "Minimalistas e funcionais",
                        score: {
                          natural: 2,
                          classico: 2,
                        },
                      },
                      {
                        id: "b",
                        text: "Clássicos e atemporais",
                        score: {
                          classico: 3,
                          elegante: 1,
                        },
                      },
                      {
                        id: "c",
                        text: "Delicados e femininos",
                        score: {
                          romantico: 3,
                          natural: 1,
                        },
                      },
                      {
                        id: "d",
                        text: "Marcantes e chamativos",
                        score: {
                          dramatico: 3,
                          criativo: 2,
                        },
                      },
                    ],
                  },
                },
                {
                  id: "step-8",
                  name: "Q7 - Estampa preferida",
                  description: "Que tipo de estampa mais te atrai?",
                  order: 8,
                  type: "question",
                  questionData: {
                    id: "q7",
                    title: "Estampa preferida",
                    text: "Que tipo de estampa mais te atrai?",
                    options: [
                      {
                        id: "a",
                        text: "Lisas ou com texturas sutis",
                        score: {
                          natural: 2,
                          classico: 2,
                        },
                      },
                      {
                        id: "b",
                        text: "Listras e xadrez clássicos",
                        score: {
                          classico: 3,
                          contemporaneo: 1,
                        },
                      },
                      {
                        id: "c",
                        text: "Florais e estampas delicadas",
                        score: {
                          romantico: 3,
                          criativo: 1,
                        },
                      },
                      {
                        id: "d",
                        text: "Geométricas e contrastantes",
                        score: {
                          dramatico: 3,
                          contemporaneo: 2,
                        },
                      },
                    ],
                  },
                  blocks: [
                    {
                      id: "header-progress",
                      type: "quiz-intro-header",
                      properties: {
                        logoUrl:
                          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                        logoAlt: "Logo Gisele Galvão",
                        progressValue: 38,
                        showProgress: true,
                        backgroundColor: "#F9F5F1",
                        height: 80,
                      },
                    },
                    {
                      id: "question-title",
                      type: "heading-inline",
                      properties: {
                        content: "Estampa preferida",
                        level: "h2",
                        textAlign: "center",
                        color: "#432818",
                        fontWeight: "600",
                      },
                    },
                    {
                      id: "options-grid",
                      type: "options-grid",
                      properties: {
                        question: "Que tipo de estampa mais te atrai?",
                        columns: "2",
                        gap: 16,
                        selectionMode: "single",
                        primaryColor: "#B89B7A",
                        accentColor: "#D4C2A8",
                        showImages: false,
                        imagePosition: "top",
                        options: [
                          {
                            id: "a",
                            text: "Lisas ou com texturas sutis",
                            score: {
                              natural: 2,
                              classico: 2,
                            },
                          },
                          {
                            id: "b",
                            text: "Listras e xadrez clássicos",
                            score: {
                              classico: 3,
                              contemporaneo: 1,
                            },
                          },
                          {
                            id: "c",
                            text: "Florais e estampas delicadas",
                            score: {
                              romantico: 3,
                              criativo: 1,
                            },
                          },
                          {
                            id: "d",
                            text: "Geométricas e contrastantes",
                            score: {
                              dramatico: 3,
                              contemporaneo: 2,
                            },
                          },
                        ],
                      },
                    },
                    {
                      id: "step-9",
                      name: "Q8 - Calçados preferidos",
                      description: "Que tipo de sapato você mais usa?",
                      order: 9,
                      type: "question",
                      questionData: {
                        id: "q8",
                        title: "Calçados preferidos",
                        text: "Que tipo de sapato você mais usa?",
                        options: [
                          {
                            id: "a",
                            text: "Tênis e sapatos baixos",
                            score: {
                              natural: 3,
                              contemporaneo: 1,
                            },
                          },
                          {
                            id: "b",
                            text: "Scarpin e sapatos clássicos",
                            score: {
                              classico: 3,
                              elegante: 2,
                            },
                          },
                          {
                            id: "c",
                            text: "Sapatilhas e sandálias delicadas",
                            score: {
                              romantico: 3,
                              natural: 1,
                            },
                          },
                          {
                            id: "d",
                            text: "Botas e sapatos statement",
                            score: {
                              dramatico: 3,
                              criativo: 1,
                            },
                          },
                        ],
                      },
                      blocks: [
                        {
                          id: "header-progress",
                          type: "quiz-intro-header",
                          properties: {
                            logoUrl:
                              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                            logoAlt: "Logo Gisele Galvão",
                            progressValue: 43,
                            showProgress: true,
                            backgroundColor: "#F9F5F1",
                            height: 80,
                          },
                        },
                        {
                          id: "question-title",
                          type: "heading-inline",
                          properties: {
                            content: "Calçados preferidos",
                            level: "h2",
                            textAlign: "center",
                            color: "#432818",
                            fontWeight: "600",
                          },
                        },
                        {
                          id: "options-grid",
                          type: "options-grid",
                          properties: {
                            question: "Que tipo de sapato você mais usa?",
                            columns: "2",
                            gap: 16,
                            selectionMode: "single",
                            primaryColor: "#B89B7A",
                            accentColor: "#D4C2A8",
                            showImages: false,
                            imagePosition: "top",
                            options: [
                              {
                                id: "a",
                                text: "Tênis e sapatos baixos",
                                score: {
                                  natural: 3,
                                  contemporaneo: 1,
                                },
                              },
                              {
                                id: "b",
                                text: "Scarpin e sapatos clássicos",
                                score: {
                                  classico: 3,
                                  elegante: 2,
                                },
                              },
                              {
                                id: "c",
                                text: "Sapatilhas e sandálias delicadas",
                                score: {
                                  romantico: 3,
                                  natural: 1,
                                },
                              },
                              {
                                id: "d",
                                text: "Botas e sapatos statement",
                                score: {
                                  dramatico: 3,
                                  criativo: 1,
                                },
                              },
                            ],
                          },
                        },
                        {
                          id: "step-10",
                          name: "Q9 - Maquiagem preferida",
                          description: "Como você gosta de usar maquiagem?",
                          order: 10,
                          type: "question",
                          questionData: {
                            id: "q9",
                            title: "Maquiagem preferida",
                            text: "Como você gosta de usar maquiagem?",
                            options: [
                              {
                                id: "a",
                                text: "Natural e minimalista",
                                score: {
                                  natural: 3,
                                  classico: 1,
                                },
                              },
                              {
                                id: "b",
                                text: "Bem feita e discreta",
                                score: {
                                  classico: 3,
                                  elegante: 1,
                                },
                              },
                              {
                                id: "c",
                                text: "Suave com destaque nos olhos",
                                score: {
                                  romantico: 3,
                                  elegante: 1,
                                },
                              },
                              {
                                id: "d",
                                text: "Marcante e impactante",
                                score: {
                                  dramatico: 3,
                                  criativo: 2,
                                },
                              },
                            ],
                          },
                          blocks: [
                            {
                              id: "header-progress",
                              type: "quiz-intro-header",
                              properties: {
                                logoUrl:
                                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                                logoAlt: "Logo Gisele Galvão",
                                progressValue: 48,
                                showProgress: true,
                                backgroundColor: "#F9F5F1",
                                height: 80,
                              },
                            },
                            {
                              id: "question-title",
                              type: "heading-inline",
                              properties: {
                                content: "Maquiagem preferida",
                                level: "h2",
                                textAlign: "center",
                                color: "#432818",
                                fontWeight: "600",
                              },
                            },
                            {
                              id: "options-grid",
                              type: "options-grid",
                              properties: {
                                question: "Como você gosta de usar maquiagem?",
                                columns: "2",
                                gap: 16,
                                selectionMode: "single",
                                primaryColor: "#B89B7A",
                                accentColor: "#D4C2A8",
                                showImages: false,
                                imagePosition: "top",
                                options: [
                                  {
                                    id: "a",
                                    text: "Natural e minimalista",
                                    score: {
                                      natural: 3,
                                      classico: 1,
                                    },
                                  },
                                  {
                                    id: "b",
                                    text: "Bem feita e discreta",
                                    score: {
                                      classico: 3,
                                      elegante: 1,
                                    },
                                  },
                                  {
                                    id: "c",
                                    text: "Suave com destaque nos olhos",
                                    score: {
                                      romantico: 3,
                                      elegante: 1,
                                    },
                                  },
                                  {
                                    id: "d",
                                    text: "Marcante e impactante",
                                    score: {
                                      dramatico: 3,
                                      criativo: 2,
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              id: "step-11",
                              name: "Q10 - Ambiente de trabalho",
                              description: "Como é seu ambiente de trabalho?",
                              order: 11,
                              type: "question",
                              questionData: {
                                id: "q10",
                                title: "Ambiente de trabalho",
                                text: "Como é seu ambiente de trabalho?",
                                options: [
                                  {
                                    id: "a",
                                    text: "Casual e flexível",
                                    score: {
                                      natural: 3,
                                      contemporaneo: 2,
                                    },
                                  },
                                  {
                                    id: "b",
                                    text: "Formal e corporativo",
                                    score: {
                                      classico: 3,
                                      elegante: 2,
                                    },
                                  },
                                  {
                                    id: "c",
                                    text: "Criativo e descontraído",
                                    score: {
                                      criativo: 3,
                                      contemporaneo: 1,
                                    },
                                  },
                                  {
                                    id: "d",
                                    text: "Executivo e sofisticado",
                                    score: {
                                      elegante: 3,
                                      dramatico: 1,
                                    },
                                  },
                                ],
                              },
                              blocks: [
                                {
                                  id: "header-progress",
                                  type: "quiz-intro-header",
                                  properties: {
                                    logoUrl:
                                      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                                    logoAlt: "Logo Gisele Galvão",
                                    progressValue: 52,
                                    showProgress: true,
                                    backgroundColor: "#F9F5F1",
                                    height: 80,
                                  },
                                },
                                {
                                  id: "question-title",
                                  type: "heading-inline",
                                  properties: {
                                    content: "Ambiente de trabalho",
                                    level: "h2",
                                    textAlign: "center",
                                    color: "#432818",
                                    fontWeight: "600",
                                  },
                                },
                                {
                                  id: "options-grid",
                                  type: "options-grid",
                                  properties: {
                                    question: "Como é seu ambiente de trabalho?",
                                    columns: "2",
                                    gap: 16,
                                    selectionMode: "single",
                                    primaryColor: "#B89B7A",
                                    accentColor: "#D4C2A8",
                                    showImages: false,
                                    imagePosition: "top",
                                    options: [
                                      {
                                        id: "a",
                                        text: "Casual e flexível",
                                        score: {
                                          natural: 3,
                                          contemporaneo: 2,
                                        },
                                      },
                                      {
                                        id: "b",
                                        text: "Formal e corporativo",
                                        score: {
                                          classico: 3,
                                          elegante: 2,
                                        },
                                      },
                                      {
                                        id: "c",
                                        text: "Criativo e descontraído",
                                        score: {
                                          criativo: 3,
                                          contemporaneo: 1,
                                        },
                                      },
                                      {
                                        id: "d",
                                        text: "Executivo e sofisticado",
                                        score: {
                                          elegante: 3,
                                          dramatico: 1,
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  id: "progress-bar",
                                  type: "quiz-progress",
                                  properties: {
                                    currentStep: 11,
                                    totalSteps: 21,
                                    showNumbers: true,
                                    showPercentage: true,
                                    barColor: "#B89B7A",
                                    backgroundColor: "#E5E7EB",
                                    height: 8,
                                    animated: true,
                                  },
                                },
                              ],
                            },
                            {
                              id: "progress-bar",
                              type: "quiz-progress",
                              properties: {
                                currentStep: 10,
                                totalSteps: 21,
                                showNumbers: true,
                                showPercentage: true,
                                barColor: "#B89B7A",
                                backgroundColor: "#E5E7EB",
                                height: 8,
                                animated: true,
                              },
                            },
                          ],
                        },
                        {
                          id: "progress-bar",
                          type: "quiz-progress",
                          properties: {
                            currentStep: 9,
                            totalSteps: 21,
                            showNumbers: true,
                            showPercentage: true,
                            barColor: "#B89B7A",
                            backgroundColor: "#E5E7EB",
                            height: 8,
                            animated: true,
                          },
                        },
                      ],
                    },
                    {
                      id: "progress-bar",
                      type: "quiz-progress",
                      properties: {
                        currentStep: 8,
                        totalSteps: 21,
                        showNumbers: true,
                        showPercentage: true,
                        barColor: "#B89B7A",
                        backgroundColor: "#E5E7EB",
                        height: 8,
                        animated: true,
                      },
                    },
                  ],
                },
                {
                  id: "progress-bar",
                  type: "quiz-progress",
                  properties: {
                    currentStep: 7,
                    totalSteps: 21,
                    showNumbers: true,
                    showPercentage: true,
                    barColor: "#B89B7A",
                    backgroundColor: "#E5E7EB",
                    height: 8,
                    animated: true,
                  },
                },
              ],
            },
            {
              id: "progress-bar",
              type: "quiz-progress",
              properties: {
                currentStep: 6,
                totalSteps: 21,
                showNumbers: true,
                showPercentage: true,
                barColor: "#B89B7A",
                backgroundColor: "#E5E7EB",
                height: 8,
                animated: true,
              },
            },
          ],
        },
        {
          id: "progress-bar",
          type: "quiz-progress",
          properties: {
            currentStep: 5,
            totalSteps: 21,
            showNumbers: true,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            height: 8,
            animated: true,
          },
        },
      ],
    },
    {
      id: "step-12",
      name: "Análise Parcial",
      description: "Processando suas respostas...",
      order: 12,
      type: "transition",
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 60,
            showProgress: true,
            backgroundColor: "#F9F5F1",
          },
        },
        {
          id: "transition-title",
          type: "heading-inline",
          properties: {
            content: "Ótimo! Agora vamos conhecer você melhor...",
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "transition-text",
          type: "text-inline",
          properties: {
            text: "Estamos analisando suas respostas e preparando perguntas mais específicas para definir seu estilo com precisão.",
            fontSize: "1.125rem",
            alignment: "center",
            color: "#6B5B4E",
          },
        },
        {
          id: "loading-progress",
          type: "quiz-progress",
          properties: {
            currentStep: 12,
            totalSteps: 21,
            showNumbers: false,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            animated: true,
          },
        },
        {
          id: "continue-button",
          type: "button-inline",
          properties: {
            text: "Continuar Análise",
            style: "primary",
            backgroundColor: "#B89B7A",
            textColor: "#FFFFFF",
          },
        },
      ],
    },
    {
      id: "step-13",
      name: "Estratégica 1 - Orçamento para roupas",
      description: "Quanto você investe mensalmente em roupas?",
      order: 13,
      type: "strategic",
      questionData: {
        id: "s1",
        title: "Orçamento para roupas",
        text: "Quanto você investe mensalmente em roupas?",
        options: [
          {
            id: "a",
            text: "Até R$ 200",
            segment: "economica",
          },
          {
            id: "b",
            text: "R$ 200 - R$ 500",
            segment: "moderada",
          },
          {
            id: "c",
            text: "R$ 500 - R$ 1000",
            segment: "premium",
          },
          {
            id: "d",
            text: "Acima de R$ 1000",
            segment: "luxury",
          },
        ],
      },
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 60,
            showProgress: true,
            backgroundColor: "#F9F5F1",
          },
        },
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: "Orçamento para roupas",
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: "Quanto você investe mensalmente em roupas?",
            columns: "1",
            gap: 12,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: false,
            options: [
              {
                id: "a",
                text: "Até R$ 200",
                segment: "economica",
              },
              {
                id: "b",
                text: "R$ 200 - R$ 500",
                segment: "moderada",
              },
              {
                id: "c",
                text: "R$ 500 - R$ 1000",
                segment: "premium",
              },
              {
                id: "d",
                text: "Acima de R$ 1000",
                segment: "luxury",
              },
            ],
          },
        },
      ],
    },
    {
      id: "step-14",
      name: "Estratégica 2 - Idade",
      description: "Qual sua faixa etária?",
      order: 14,
      type: "strategic",
      questionData: {
        id: "s2",
        title: "Faixa etária",
        text: "Qual sua faixa etária?",
        options: [
          {
            id: "a",
            text: "18-25 anos",
            segment: "jovem",
          },
          {
            id: "b",
            text: "26-35 anos",
            segment: "adulta_jovem",
          },
          {
            id: "c",
            text: "36-45 anos",
            segment: "adulta",
          },
          {
            id: "d",
            text: "46+ anos",
            segment: "madura",
          },
        ],
      },
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 67,
            showProgress: true,
            backgroundColor: "#F9F5F1",
            height: 80,
          },
        },
        {
          id: "question-title",
          type: "heading-inline",
          properties: {
            content: "Faixa etária",
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "options-grid",
          type: "options-grid",
          properties: {
            question: "Qual sua faixa etária?",
            columns: "1",
            gap: 12,
            selectionMode: "single",
            primaryColor: "#B89B7A",
            accentColor: "#D4C2A8",
            showImages: false,
            options: [
              {
                id: "a",
                text: "18-25 anos",
                segment: "jovem",
              },
              {
                id: "b",
                text: "26-35 anos",
                segment: "adulta_jovem",
              },
              {
                id: "c",
                text: "36-45 anos",
                segment: "adulta",
              },
              {
                id: "step-15",
                name: "Estratégica 3 - Profissão",
                description: "Qual área profissional você atua?",
                order: 15,
                type: "strategic",
                questionData: {
                  id: "s3",
                  title: "Área profissional",
                  text: "Qual área profissional você atua?",
                  options: [
                    {
                      id: "a",
                      text: "Saúde/Educação",
                      segment: "cuidado",
                    },
                    {
                      id: "b",
                      text: "Corporativo/Executivo",
                      segment: "corporativo",
                    },
                    {
                      id: "c",
                      text: "Criativo/Artístico",
                      segment: "criativo",
                    },
                    {
                      id: "d",
                      text: "Empreendedora/Autônoma",
                      segment: "empreendedora",
                    },
                  ],
                },
                blocks: [
                  {
                    id: "header-progress",
                    type: "quiz-intro-header",
                    properties: {
                      logoUrl:
                        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                      logoAlt: "Logo Gisele Galvão",
                      progressValue: 71,
                      showProgress: true,
                      backgroundColor: "#F9F5F1",
                      height: 80,
                    },
                  },
                  {
                    id: "question-title",
                    type: "heading-inline",
                    properties: {
                      content: "Área profissional",
                      level: "h2",
                      textAlign: "center",
                      color: "#432818",
                    },
                  },
                  {
                    id: "options-grid",
                    type: "options-grid",
                    properties: {
                      question: "Qual área profissional você atua?",
                      columns: "1",
                      gap: 12,
                      selectionMode: "single",
                      primaryColor: "#B89B7A",
                      accentColor: "#D4C2A8",
                      showImages: false,
                      options: [
                        {
                          id: "a",
                          text: "Saúde/Educação",
                          segment: "cuidado",
                        },
                        {
                          id: "b",
                          text: "Corporativo/Executivo",
                          segment: "corporativo",
                        },
                        {
                          id: "c",
                          text: "Criativo/Artístico",
                          segment: "criativo",
                        },
                        {
                          id: "step-16",
                          name: "Estratégica 4 - Objetivos",
                          description: "Qual seu principal objetivo com o estilo?",
                          order: 16,
                          type: "strategic",
                          questionData: {
                            id: "s4",
                            title: "Objetivos com estilo",
                            text: "Qual seu principal objetivo com o estilo?",
                            options: [
                              {
                                id: "a",
                                text: "Mais confiança",
                                segment: "autoestima",
                              },
                              {
                                id: "b",
                                text: "Profissionalismo",
                                segment: "carreira",
                              },
                              {
                                id: "c",
                                text: "Expressão pessoal",
                                segment: "criatividade",
                              },
                              {
                                id: "d",
                                text: "Elegância",
                                segment: "sofisticacao",
                              },
                            ],
                          },
                          blocks: [
                            {
                              id: "header-progress",
                              type: "quiz-intro-header",
                              properties: {
                                logoUrl:
                                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                                logoAlt: "Logo Gisele Galvão",
                                progressValue: 76,
                                showProgress: true,
                                backgroundColor: "#F9F5F1",
                                height: 80,
                              },
                            },
                            {
                              id: "question-title",
                              type: "heading-inline",
                              properties: {
                                content: "Objetivos com estilo",
                                level: "h2",
                                textAlign: "center",
                                color: "#432818",
                              },
                            },
                            {
                              id: "options-grid",
                              type: "options-grid",
                              properties: {
                                question: "Qual seu principal objetivo com o estilo?",
                                columns: "1",
                                gap: 12,
                                selectionMode: "single",
                                primaryColor: "#B89B7A",
                                accentColor: "#D4C2A8",
                                showImages: false,
                                options: [
                                  {
                                    id: "a",
                                    text: "Mais confiança",
                                    segment: "autoestima",
                                  },
                                  {
                                    id: "b",
                                    text: "Profissionalismo",
                                    segment: "carreira",
                                  },
                                  {
                                    id: "c",
                                    text: "Expressão pessoal",
                                    segment: "criatividade",
                                  },
                                  {
                                    id: "step-17",
                                    name: "Finalizando Análise",
                                    description: "Últimos ajustes na sua análise...",
                                    order: 17,
                                    type: "transition",
                                    blocks: [
                                      {
                                        id: "header-progress",
                                        type: "quiz-intro-header",
                                        properties: {
                                          logoUrl:
                                            "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                                          logoAlt: "Logo Gisele Galvão",
                                          progressValue: 81,
                                          showProgress: true,
                                          backgroundColor: "#F9F5F1",
                                          height: 80,
                                        },
                                      },
                                      {
                                        id: "transition-title",
                                        type: "heading-inline",
                                        properties: {
                                          content: "Analisando suas respostas...",
                                          level: "h2",
                                          textAlign: "center",
                                          color: "#432818",
                                        },
                                      },
                                      {
                                        id: "transition-text",
                                        type: "text-inline",
                                        properties: {
                                          text: "Estamos processando suas respostas para criar seu perfil personalizado.",
                                          fontSize: "1.125rem",
                                          alignment: "center",
                                          color: "#6B5B4E",
                                        },
                                      },
                                      {
                                        id: "step-18",
                                        name: "Calculando Resultado",
                                        description: "Processando seu perfil completo...",
                                        order: 18,
                                        type: "processing",
                                        blocks: [
                                          {
                                            id: "header-progress",
                                            type: "quiz-intro-header",
                                            properties: {
                                              logoUrl:
                                                "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
                                              logoAlt: "Logo Gisele Galvão",
                                              progressValue: 86,
                                              showProgress: true,
                                              backgroundColor: "#F9F5F1",
                                              height: 80,
                                            },
                                          },
                                          {
                                            id: "processing-title",
                                            type: "heading-inline",
                                            properties: {
                                              content: "Calculando seu resultado...",
                                              level: "h2",
                                              textAlign: "center",
                                              color: "#432818",
                                            },
                                          },
                                          {
                                            id: "loading-progress",
                                            type: "quiz-progress",
                                            properties: {
                                              currentStep: 18,
                                              totalSteps: 21,
                                              showNumbers: false,
                                              showPercentage: true,
                                              barColor: "#B89B7A",
                                              backgroundColor: "#E5E7EB",
                                              animated: true,
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        id: "continue-button",
                                        type: "button-inline",
                                        properties: {
                                          text: "Continuar",
                                          style: "primary",
                                          backgroundColor: "#B89B7A",
                                          textColor: "#FFFFFF",
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    id: "d",
                                    text: "Elegância",
                                    segment: "sofisticacao",
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        {
                          id: "d",
                          text: "Empreendedora/Autônoma",
                          segment: "empreendedora",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                id: "d",
                text: "46+ anos",
                segment: "madura",
              },
            ],
          },
        },
      ],
    },
    {
      id: "step-19",
      name: "Preparando Resultado",
      description: "Processando suas respostas...",
      order: 19,
      type: "transition",
      blocks: [
        {
          id: "header-progress",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            progressValue: 95,
            showProgress: true,
            backgroundColor: "#F9F5F1",
          },
        },
        {
          id: "transition-title",
          type: "heading-inline",
          properties: {
            content: "Analisando seu perfil completo...",
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "transition-text",
          type: "text-inline",
          properties: {
            text: "Estamos calculando seu estilo predominante e preparando seu resultado personalizado.",
            fontSize: "1.125rem",
            alignment: "center",
            color: "#6B5B4E",
          },
        },
        {
          id: "loading-progress",
          type: "quiz-progress",
          properties: {
            currentStep: 12,
            totalSteps: 21,
            showNumbers: false,
            showPercentage: true,
            barColor: "#B89B7A",
            backgroundColor: "#E5E7EB",
            animated: true,
          },
        },
        {
          id: "continue-button",
          type: "button-inline",
          properties: {
            text: "Continuar Análise",
            style: "primary",
            backgroundColor: "#B89B7A",
            textColor: "#FFFFFF",
          },
        },
      ],
    },
    {
      id: "step-20",
      name: "Seu Resultado",
      description: "Resultado personalizado do quiz",
      order: 20,
      type: "result",
      blocks: [
        {
          id: "header-clean",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            showProgress: false,
            backgroundColor: "#F9F5F1",
          },
        },
        {
          id: "result-title",
          type: "heading-inline",
          properties: {
            content: "Parabéns! Seu estilo predominante é:",
            level: "h1",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "quiz-results",
          type: "quiz-results",
          properties: {
            title: "Análise Completa",
            showScores: true,
            showPercentages: true,
            showRanking: false,
            primaryColor: "#B89B7A",
            secondaryColor: "#D4C2A8",
            layout: "vertical",
            showImages: true,
            animatedEntry: true,
          },
        },
        {
          id: "style-results",
          type: "style-results",
          properties: {
            title: "Características do Seu Estilo",
            showAllStyles: false,
            showGuideImage: true,
            guideImageUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
            primaryStyle: "Natural",
            layout: "card",
            showDescription: true,
            showPercentage: true,
          },
        },
        {
          id: "result-image",
          type: "image-display-inline",
          properties: {
            src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
            alt: "Guia do Estilo Natural",
            width: "100%",
            height: "auto",
            borderRadius: 12,
            shadow: true,
            alignment: "center",
          },
        },
        {
          id: "cta-offer",
          type: "button-inline",
          properties: {
            text: "Quero Meu Guia Personalizado",
            style: "primary",
            size: "large",
            backgroundColor: "#4CAF50",
            textColor: "#FFFFFF",
          },
        },
      ],
    },
    {
      id: "step-21",
      name: "Oferta Personalizada",
      description: "Oferta exclusiva baseada no seu resultado",
      order: 21,
      type: "offer",
      blocks: [
        {
          id: "header-offer",
          type: "quiz-intro-header",
          properties: {
            logoUrl:
              "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
            logoAlt: "Logo Gisele Galvão",
            showProgress: false,
            backgroundColor: "#F9F5F1",
          },
        },
        {
          id: "final-step-header",
          type: "final-step",
          properties: {
            stepNumber: 21,
            title: "Oferta Exclusiva Para Seu Estilo Natural",
            subtitle: "Transforme seu guarda-roupa com um guia personalizado",
            showNavigation: false,
            showProgress: false,
            backgroundColor: "#F9F5F1",
            accentColor: "#4CAF50",
            layout: "centered",
          },
        },
        {
          id: "offer-title",
          type: "heading-inline",
          properties: {
            content: "Leve Sua Transformação Para o Próximo Nível",
            level: "h2",
            textAlign: "center",
            color: "#432818",
          },
        },
        {
          id: "offer-image",
          type: "image-display-inline",
          properties: {
            src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp",
            alt: "Guia Completo Personalizado",
            width: "100%",
            height: "auto",
            borderRadius: 12,
            shadow: true,
            alignment: "center",
          },
        },
        {
          id: "offer-description",
          type: "text-inline",
          properties: {
            text: "Receba um guia completo e personalizado para seu estilo, com orientações específicas, paleta de cores ideal, peças-chave para seu guarda-roupa e dicas exclusivas de uma consultora certificada.",
            fontSize: "1.125rem",
            alignment: "center",
            color: "#6B5B4E",
          },
        },
        {
          id: "payment-options",
          type: "options-grid",
          properties: {
            question: "Escolha sua forma de pagamento:",
            columns: "2",
            gap: 16,
            selectionMode: "single",
            primaryColor: "#4CAF50",
            accentColor: "#66BB6A",
            showImages: false,
            options: [
              {
                id: "parcelado",
                text: "5x de R$ 8,83",
                subtext: "sem juros",
              },
              {
                id: "avista",
                text: "R$ 39,90 à vista",
                subtext: "10% desconto",
              },
            ],
          },
        },
        {
          id: "bonus-list",
          type: "text-inline",
          properties: {
            text: "🎁 BÔNUS INCLUSOS:\n• Guia das Peças-Chave do Guarda-Roupa\n• Manual de Visagismo Facial\n• Acesso vitalício ao material\n• Suporte direto com a consultora",
            fontSize: "1rem",
            alignment: "left",
            color: "#4CAF50",
          },
        },
        {
          id: "final-cta",
          type: "button-inline",
          properties: {
            text: "Garantir Meu Guia Personalizado",
            style: "primary",
            size: "large",
            backgroundColor: "#4CAF50",
            textColor: "#FFFFFF",
          },
        },
        {
          id: "guarantee",
          type: "legal-notice-inline",
          properties: {
            privacyText: "Garantia de 7 dias",
            copyrightText: "Pagamento 100% seguro",
            termsText: "Satisfação garantida",
            fontSize: "text-sm",
            textAlign: "center",
            color: "#4CAF50",
            linkColor: "#4CAF50",
          },
        },
      ],
    },
  ],
  quizData: {
    questions: [
      {
        id: "q1",
        title: "Qual seu estilo de vida?",
        text: "Como você descreveria sua rotina diária?",
        options: [
          {
            id: "a",
            text: "Prática e dinâmica",
            score: {
              natural: 3,
              classico: 1,
            },
          },
          {
            id: "b",
            text: "Organizada e estruturada",
            score: {
              classico: 3,
              elegante: 1,
            },
          },
          {
            id: "c",
            text: "Criativa e flexível",
            score: {
              romantico: 2,
              criativo: 3,
            },
          },
          {
            id: "d",
            text: "Sofisticada e refinada",
            score: {
              elegante: 3,
              dramatico: 1,
            },
          },
        ],
      },
      {
        id: "q2",
        title: "Qual sua peça favorita?",
        text: "Que tipo de roupa você se sente mais confortável?",
        options: [
          {
            id: "a",
            text: "Jeans e camiseta básica",
            score: {
              natural: 3,
              contemporaneo: 1,
            },
          },
          {
            id: "b",
            text: "Blazer e calça social",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Vestido fluido e delicado",
            score: {
              romantico: 3,
              natural: 1,
            },
          },
          {
            id: "d",
            text: "Peças estruturadas e marcantes",
            score: {
              dramatico: 3,
              elegante: 1,
            },
          },
        ],
      },
      {
        id: "q3",
        title: "Cores que mais te atraem?",
        text: "Qual paleta de cores você prefere?",
        options: [
          {
            id: "a",
            text: "Tons terrosos e neutros",
            score: {
              natural: 3,
              classico: 1,
            },
          },
          {
            id: "b",
            text: "Cores sólidas e atemporais",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Pastéis e tons suaves",
            score: {
              romantico: 3,
              criativo: 1,
            },
          },
          {
            id: "d",
            text: "Cores vibrantes e contrastantes",
            score: {
              dramatico: 3,
              contemporaneo: 2,
            },
          },
        ],
      },
      {
        id: "q4",
        title: "Ocasiões especiais",
        text: "Para que tipo de evento você gosta de se arrumar?",
        options: [
          {
            id: "a",
            text: "Eventos ao ar livre e casuais",
            score: {
              natural: 3,
              contemporaneo: 1,
            },
          },
          {
            id: "b",
            text: "Reuniões formais e corporativas",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Jantares românticos e festas",
            score: {
              romantico: 3,
              elegante: 1,
            },
          },
          {
            id: "d",
            text: "Eventos exclusivos e gala",
            score: {
              dramatico: 3,
              elegante: 2,
            },
          },
        ],
      },
      {
        id: "q5",
        title: "Estilo de cabelo",
        text: "Qual tipo de penteado combina mais com você?",
        options: [
          {
            id: "a",
            text: "Solto e natural",
            score: {
              natural: 3,
              romantico: 1,
            },
          },
          {
            id: "b",
            text: "Bem estruturado e arrumado",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Com ondas e textura",
            score: {
              romantico: 3,
              criativo: 1,
            },
          },
          {
            id: "d",
            text: "Liso e impecável",
            score: {
              dramatico: 2,
              elegante: 3,
            },
          },
        ],
      },
      {
        id: "q6",
        title: "Acessórios favoritos",
        text: "Que tipo de acessórios você prefere?",
        options: [
          {
            id: "a",
            text: "Minimalistas e funcionais",
            score: {
              natural: 2,
              classico: 2,
            },
          },
          {
            id: "b",
            text: "Clássicos e atemporais",
            score: {
              classico: 3,
              elegante: 1,
            },
          },
          {
            id: "c",
            text: "Delicados e femininos",
            score: {
              romantico: 3,
              natural: 1,
            },
          },
          {
            id: "d",
            text: "Marcantes e chamativos",
            score: {
              dramatico: 3,
              criativo: 2,
            },
          },
        ],
      },
      {
        id: "q7",
        title: "Estampa preferida",
        text: "Que tipo de estampa mais te atrai?",
        options: [
          {
            id: "a",
            text: "Lisas ou com texturas sutis",
            score: {
              natural: 2,
              classico: 2,
            },
          },
          {
            id: "b",
            text: "Listras e xadrez clássicos",
            score: {
              classico: 3,
              contemporaneo: 1,
            },
          },
          {
            id: "c",
            text: "Florais e estampas delicadas",
            score: {
              romantico: 3,
              criativo: 1,
            },
          },
          {
            id: "d",
            text: "Geométricas e contrastantes",
            score: {
              dramatico: 3,
              contemporaneo: 2,
            },
          },
        ],
      },
      {
        id: "q8",
        title: "Calçados preferidos",
        text: "Que tipo de sapato você mais usa?",
        options: [
          {
            id: "a",
            text: "Tênis e sapatos baixos",
            score: {
              natural: 3,
              contemporaneo: 1,
            },
          },
          {
            id: "b",
            text: "Scarpin e sapatos clássicos",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Sapatilhas e sandálias delicadas",
            score: {
              romantico: 3,
              natural: 1,
            },
          },
          {
            id: "d",
            text: "Botas e sapatos statement",
            score: {
              dramatico: 3,
              criativo: 1,
            },
          },
        ],
      },
      {
        id: "q9",
        title: "Maquiagem preferida",
        text: "Como você gosta de usar maquiagem?",
        options: [
          {
            id: "a",
            text: "Natural e minimalista",
            score: {
              natural: 3,
              classico: 1,
            },
          },
          {
            id: "b",
            text: "Bem feita e discreta",
            score: {
              classico: 3,
              elegante: 1,
            },
          },
          {
            id: "c",
            text: "Suave com destaque nos olhos",
            score: {
              romantico: 3,
              elegante: 1,
            },
          },
          {
            id: "d",
            text: "Marcante e impactante",
            score: {
              dramatico: 3,
              criativo: 2,
            },
          },
        ],
      },
      {
        id: "q10",
        title: "Ambiente de trabalho",
        text: "Como é seu ambiente de trabalho?",
        options: [
          {
            id: "a",
            text: "Casual e flexível",
            score: {
              natural: 3,
              contemporaneo: 2,
            },
          },
          {
            id: "b",
            text: "Formal e corporativo",
            score: {
              classico: 3,
              elegante: 2,
            },
          },
          {
            id: "c",
            text: "Criativo e descontraído",
            score: {
              criativo: 3,
              contemporaneo: 1,
            },
          },
          {
            id: "d",
            text: "Executivo e sofisticado",
            score: {
              elegante: 3,
              dramatico: 1,
            },
          },
        ],
      },
    ],
    strategicQuestions: [
      {
        id: "s1",
        title: "Orçamento para roupas",
        text: "Quanto você investe mensalmente em roupas?",
        options: [
          {
            id: "a",
            text: "Até R$ 200",
            segment: "economica",
          },
          {
            id: "b",
            text: "R$ 200 - R$ 500",
            segment: "moderada",
          },
          {
            id: "c",
            text: "R$ 500 - R$ 1000",
            segment: "premium",
          },
          {
            id: "d",
            text: "Acima de R$ 1000",
            segment: "luxury",
          },
        ],
      },
      {
        id: "s2",
        title: "Faixa etária",
        text: "Qual sua faixa etária?",
        options: [
          {
            id: "a",
            text: "18-25 anos",
            segment: "jovem",
          },
          {
            id: "b",
            text: "26-35 anos",
            segment: "adulta_jovem",
          },
          {
            id: "c",
            text: "36-45 anos",
            segment: "adulta",
          },
          {
            id: "d",
            text: "46+ anos",
            segment: "madura",
          },
        ],
      },
      {
        id: "s3",
        title: "Área profissional",
        text: "Qual área profissional você atua?",
        options: [
          {
            id: "a",
            text: "Saúde/Educação",
            segment: "cuidado",
          },
          {
            id: "b",
            text: "Corporativo/Executivo",
            segment: "corporativo",
          },
          {
            id: "c",
            text: "Criativo/Artístico",
            segment: "criativo",
          },
          {
            id: "d",
            text: "Empreendedora/Autônoma",
            segment: "empreendedora",
          },
        ],
      },
      {
        id: "s4",
        title: "Objetivos com estilo",
        text: "Qual seu principal objetivo com o estilo?",
        options: [
          {
            id: "a",
            text: "Mais confiança",
            segment: "autoestima",
          },
          {
            id: "b",
            text: "Profissionalismo",
            segment: "carreira",
          },
          {
            id: "c",
            text: "Expressão pessoal",
            segment: "criatividade",
          },
          {
            id: "d",
            text: "Elegância",
            segment: "sofisticacao",
          },
        ],
      },
    ],
    styles: {
      natural: {
        name: "Natural",
        description: "Você valoriza o conforto e a praticidade sem abrir mão do estilo.",
        characteristics: ["Confortável", "Prática", "Autêntica", "Descomplicada"],
        colors: ["#8B7355", "#A0956B", "#6B5B73"],
        guideImage:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
      },
      classico: {
        name: "Clássico",
        description: "Você prefere peças atemporais, elegantes e bem estruturadas.",
        characteristics: ["Atemporal", "Elegante", "Sofisticada", "Refinada"],
        colors: ["#2C3E50", "#34495E", "#7F8C8D"],
        guideImage:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_CLASSICO_abc123.webp",
      },
      romantico: {
        name: "Romântico",
        description: "Você adora peças femininas, delicadas e com detalhes especiais.",
        characteristics: ["Feminina", "Delicada", "Suave", "Detalhista"],
        colors: ["#F8BBD9", "#E8A2C0", "#D7819F"],
        guideImage:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_ROMANTICO_def456.webp",
      },
      dramatico: {
        name: "Dramático",
        description: "Você gosta de peças marcantes, estruturadas e com presença.",
        characteristics: ["Marcante", "Poderosa", "Estruturada", "Impactante"],
        colors: ["#000000", "#8B0000", "#4B0082"],
        guideImage:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_DRAMATICO_ghi789.webp",
      },
      elegante: {
        name: "Elegante",
        description: "Você aprecia sofisticação, qualidade e peças bem cortadas.",
        characteristics: ["Sofisticada", "Refinada", "Polida", "Impecável"],
        colors: ["#1C1C1C", "#8B4513", "#CD853F"],
        guideImage:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_ELEGANTE_jkl012.webp",
      },
      criativo: {
        name: "Criativo",
        description: "Você gosta de experimentar, misturar e criar looks únicos.",
        characteristics: ["Criativa", "Ousada", "Única", "Experimental"],
        colors: ["#FF6B35", "#F7931E", "#FFD23F"],
        guideImage:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_CRIATIVO_mno345.webp",
      },
      contemporaneo: {
        name: "Contemporâneo",
        description: "Você acompanha tendências mas adapta ao seu estilo pessoal.",
        characteristics: ["Moderna", "Atualizada", "Versátil", "Inovadora"],
        colors: ["#95A5A6", "#BDC3C7", "#ECF0F1"],
        guideImage:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_CONTEMPORANEO_pqr678.webp",
      },
    },
  },
  calculations: {
    scoreWeights: {
      questions: 0.7,
      strategic: 0.3,
    },
    minimumConfidence: 0.6,
    fallbackStyle: "natural",
  },
  conversion: {
    offerPrice: {
      installments: {
        value: 8.83,
        count: 5,
      },
      oneTime: {
        value: 39.9,
        discount: 0.1,
      },
    },
    guaranteeDays: 7,
    bonusItems: [
      "Guia das Peças-Chave",
      "Manual de Visagismo",
      "Acesso vitalício",
      "Suporte consultora",
    ],
  },
} as const;

export type OptimizedStepConfig = (typeof OPTIMIZED_FUNNEL_CONFIG.steps)[0];
export type QuizDataConfig = typeof OPTIMIZED_FUNNEL_CONFIG.quizData;
export type StyleConfig = typeof OPTIMIZED_FUNNEL_CONFIG.quizData.styles.natural;

export default OPTIMIZED_FUNNEL_CONFIG;
