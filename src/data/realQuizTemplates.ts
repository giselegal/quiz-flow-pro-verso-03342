// Templates para o quiz de estilo pessoal
export const QUIZ_TEMPLATES = {
  basicQuiz: {
    id: "basic-quiz",
    name: "Quiz Básico de Estilo",
    description: "Template básico para quiz de descoberta de estilo pessoal",
  },
  styleQuiz: {
    id: "style-quiz",
    name: "Quiz de Estilo Pessoal",
    description: "Quiz completo para descobrir estilo pessoal",
  },
  intro: {
    id: "intro",
    title: "Descubra Seu Estilo Pessoal",
    type: "intro" as const,
    progress: 0,
    showHeader: true,
    showProgress: false,
    blocks: [
      {
        id: 'intro-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 120,
          logoHeight: 120,
          progressValue: 0,
          progressMax: 100,
          showBackButton: false,
          showProgress: false
        }
      },
      {
        id: 'intro-decorative-bar',
        type: 'decorative-bar-inline',
        properties: {
          width: '100%',
          height: 4,
          color: '#B89B7A',
          gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
          borderRadius: 3,
          marginTop: 8,
          marginBottom: 24,
          showShadow: true
        }
      },
      {
        id: 'intro-main-heading',
        type: 'text-inline',
        properties: {
          content: '<span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">Descubra</span> <span style="font-family: \'Playfair Display\', serif;">Seu Estilo Pessoal</span>',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          fontFamily: 'Playfair Display, serif',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 32,
          lineHeight: '1.2'
        }
      },
      {
        id: 'intro-subtitle',
        type: 'text-inline',
        properties: {
          content: 'Responda algumas perguntas rápidas e descubra qual estilo combina mais com você',
          fontSize: 'text-xl',
          textAlign: 'text-center',
          color: '#8F7A6A',
          marginTop: 0,
          marginBottom: 40,
          lineHeight: '1.6'
        }
      }
    ],
    settings: {
      showProgress: false,
      progressValue: 0,
      backgroundColor: '#ffffff',
      textColor: '#432818',
      maxWidth: 'max-w-4xl',
      padding: 'p-6'
    }
  },
  transition: {
    id: "transition",
    title: "Quase lá!",
    type: "transition" as const,
    progress: 75,
    showHeader: true,
    showProgress: true,
    blocks: [
      {
        id: 'transition-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: 75,
          progressMax: 100,
          showBackButton: true
        }
      },
      {
        id: 'transition-title',
        type: 'heading-inline',
        properties: {
          content: 'Quase terminando!',
          level: 'h2',
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 16
        }
      }
    ],
    settings: {
      showProgress: true,
      progressValue: 75,
      backgroundColor: '#ffffff',
      textColor: '#432818',
      maxWidth: 'max-w-4xl',
      padding: 'p-6'
    }
  },
  loading: {
    id: "loading",
    title: "Calculando resultado...",
    type: "loading" as const,
    progress: 90,
    showHeader: true,
    showProgress: true,
    blocks: [
      {
        id: 'loading-header',
        type: 'quiz-intro-header',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: 90,
          progressMax: 100,
          showBackButton: false
        }
      },
      {
        id: 'loading-title',
        type: 'heading-inline',
        properties: {
          content: 'Analisando suas respostas...',
          level: 'h2',
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 16
        }
      },
      {
        id: 'loading-animation',
        type: 'loading-animation',
        properties: {
          type: 'spinner',
          size: 'large',
          color: '#B89B7A',
          duration: 3000
        }
      }
    ],
    settings: {
      showProgress: true,
      progressValue: 90,
      backgroundColor: '#ffffff',
      textColor: '#432818',
      maxWidth: 'max-w-4xl',
      padding: 'p-6'
    }
  },
  result: {
    id: "result",
    title: "Seu Resultado",
    type: "result" as const,
    progress: 100,
    showHeader: true,
    showProgress: false,
    blocks: [
      {
        id: 'result-header',
        type: 'result-header-inline',
        properties: {
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          userName: 'dinamicUserName',
          showProgress: false
        }
      },
      {
        id: 'result-title',
        type: 'heading-inline',
        properties: {
          content: 'Seu Estilo é...',
          level: 'h1',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 24
        }
      }
    ],
    settings: {
      showProgress: false,
      progressValue: 100,
      backgroundColor: '#ffffff',
      textColor: '#432818',
      maxWidth: 'max-w-4xl',
      padding: 'p-6'
    }
  },
  offer: {
    id: "offer",
    title: "Oferta Especial",
    type: "offer" as const,
    progress: 100,
    showHeader: true,
    showProgress: false,
    blocks: [
      {
        id: 'offer-title',
        type: 'heading-inline',
        properties: {
          content: 'Oferta Especial Para Você',
          level: 'h1',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 16
        }
      },
      {
        id: 'offer-pricing',
        type: 'quiz-offer-pricing-inline',
        properties: {
          originalPrice: 197,
          discountedPrice: 97,
          discountPercentage: 51,
          currency: 'BRL',
          installments: {
            number: 12,
            value: 8.83
          },
          features: [
            'Guia Completo do Seu Estilo (PDF)',
            'Análise Personalizada Detalhada',
            'Dicas de Combinações',
            'Lista de Compras Estratégicas',
            'Suporte por 30 dias'
          ],
          highlighted: true
        }
      }
    ],
    settings: {
      showProgress: false,
      progressValue: 100,
      backgroundColor: '#ffffff',
      textColor: '#432818',
      maxWidth: 'max-w-4xl',
      padding: 'p-6'
    }
  }
};

export const generateRealQuestionTemplates = () => {
  return [
    // QUESTÃO 1: QUAL O SEU TIPO DE ROUPA FAVORITA?
    {
      id: "q1",
      title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
      type: "question" as const,
      progress: 10,
      showHeader: true,
      showProgress: true,
      questionType: "both", // texto + imagem
      multiSelect: 3,
      scoringEnabled: true,
      validationRules: {
        minSelections: 1,
        maxSelections: 3,
        required: true,
        customMessage: 'Escolha de 1 a 3 tipos de roupa que mais combinam com você'
      },
      blocks: [
        {
          id: 'q1-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 10,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q1-title',
          type: 'heading-inline',
          properties: {
            content: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q1-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 1 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q1-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "1a", 
                text: "Conforto, leveza e praticidade no vestir",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
                value: "1a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "1b", 
                text: "Discrição, caimento clássico e sobriedade",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
                value: "1b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "1c", 
                text: "Praticidade com um toque de estilo atual",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
                value: "1c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "1d", 
                text: "Elegância refinada, moderna e sem exageros",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
                value: "1d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "1e", 
                text: "Delicadeza em tecidos suaves e fluidos",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
                value: "1e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "1f", 
                text: "Sensualidade com destaque para o corpo",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
                value: "1f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "1g", 
                text: "Impacto visual com peças estruturadas e assimétricas",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
                value: "1g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "1h", 
                text: "Mix criativo com formas ousadas e originais",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
                value: "1h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 2,
            showImages: true,
            imageSize: 'large',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 16,
            responsiveColumns: true
          }
        },
        {
          id: 'q1-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 10,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 2: RESUMA A SUA PERSONALIDADE
    {
      id: "q2",
      title: "RESUMA A SUA PERSONALIDADE:",
      type: "question" as const,
      progress: 20,
      showHeader: true,
      showProgress: true,
      questionType: "text",
      multiSelect: 3,
      scoringEnabled: true,
      validationRules: {
        minSelections: 1,
        maxSelections: 3,
        required: true,
        customMessage: 'Selecione de 1 a 3 características que melhor definem sua personalidade'
      },
      blocks: [
        {
          id: 'q2-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 20,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q2-title',
          type: 'heading-inline',
          properties: {
            content: 'RESUMA A SUA PERSONALIDADE:',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q2-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 2 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q2-options',
          type: 'options-grid',
          properties: {
            options: [
              { id: "2a", text: "Informal, espontânea, alegre, essencialista", value: "2a", category: "Natural", styleCategory: "Natural", points: 1 },
              { id: "2b", text: "Conservadora, séria, organizada", value: "2b", category: "Clássico", styleCategory: "Clássico", points: 1 },
              { id: "2c", text: "Informada, ativa, prática", value: "2c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
              { id: "2d", text: "Exigente, sofisticada, seletiva", value: "2d", category: "Elegante", styleCategory: "Elegante", points: 1 },
              { id: "2e", text: "Feminina, meiga, delicada, sensível", value: "2e", category: "Romântico", styleCategory: "Romântico", points: 1 },
              { id: "2f", text: "Glamorosa, vaidosa, sensual", value: "2f", category: "Sexy", styleCategory: "Sexy", points: 1 },
              { id: "2g", text: "Cosmopolita, moderna e audaciosa", value: "2g", category: "Dramático", styleCategory: "Dramático", points: 1 },
              { id: "2h", text: "Exótica, aventureira, livre", value: "2h", category: "Criativo", styleCategory: "Criativo", points: 1 }
            ],
            columns: 1,
            showImages: false,
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 12,
            responsiveColumns: true
          }
        },
        {
          id: 'q2-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 20,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 3: QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
    {
      id: "q3",
      title: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
      type: "question" as const,
      progress: 30,
      showHeader: true,
      showProgress: true,
      questionType: "both",
      multiSelect: 3,
      blocks: [
        {
          id: 'q3-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 30,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q3-title',
          type: 'heading-inline',
          properties: {
            content: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q3-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 3 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q3-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "3a", 
                text: "Visual leve, despojado e natural",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
                value: "3a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "3b", 
                text: "Look sóbrio, elegante e atemporal",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/3_vwxqcg.webp",
                value: "3b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "3c", 
                text: "Estilo moderno com toques da moda",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
                value: "3c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "3d", 
                text: "Sofisticação refinada e impecável",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_tbnajq.webp",
                value: "3d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "3e", 
                text: "Feminilidade suave e delicada",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/6_tblhsy.webp",
                value: "3e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "3f", 
                text: "Sensualidade marcante e provocante",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/7_l9mywn.webp",
                value: "3f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "3g", 
                text: "Drama e impacto visual forte",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735318/8_xm6ifa.webp",
                value: "3g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "3h", 
                text: "Criatividade e originalidade única",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735318/9_ufomxb.webp",
                value: "3h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 2,
            showImages: true,
            imageSize: 'large',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 16,
            responsiveColumns: true
          }
        },
        {
          id: 'q3-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 30,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 4: QUAIS DETALHES VOCÊ GOSTA?
    {
      id: "q4",
      title: "QUAIS DETALHES VOCÊ GOSTA?",
      type: "question" as const,
      progress: 40,
      showHeader: true,
      showProgress: true,
      questionType: "text",
      multiSelect: 3,
      blocks: [
        {
          id: 'q4-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 40,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q4-title',
          type: 'heading-inline',
          properties: {
            content: 'QUAIS DETALHES VOCÊ GOSTA?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q4-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 4 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q4-options',
          type: 'options-grid',
          properties: {
            options: [
              { id: "4a", text: "Poucos detalhes, básico e prático", value: "4a", category: "Natural", styleCategory: "Natural", points: 1 },
              { id: "4b", text: "Bem discretos e sutis, clean e clássico", value: "4b", category: "Clássico", styleCategory: "Clássico", points: 1 },
              { id: "4c", text: "Básico, mas com um toque de estilo", value: "4c", category: "Contemporâneo", styleCategory: "Contemporâneo", points: 1 },
              { id: "4d", text: "Detalhes refinados, chic e que deem status", value: "4d", category: "Elegante", styleCategory: "Elegante", points: 1 },
              { id: "4e", text: "Detalhes delicados, laços, babados", value: "4e", category: "Romântico", styleCategory: "Romântico", points: 1 },
              { id: "4f", text: "Roupas que valorizem meu corpo: couro, zíper, fendas", value: "4f", category: "Sexy", styleCategory: "Sexy", points: 1 },
              { id: "4g", text: "Detalhes marcantes, firmeza e peso", value: "4g", category: "Dramático", styleCategory: "Dramático", points: 1 },
              { id: "4h", text: "Detalhes diferentes do convencional, produções ousadas", value: "4h", category: "Criativo", styleCategory: "Criativo", points: 1 }
            ],
            columns: 1,
            showImages: false,
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 12,
            responsiveColumns: true
          }
        },
        {
          id: 'q4-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 40,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 5: QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
    {
      id: "q5",
      title: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
      type: "question" as const,
      progress: 50,
      showHeader: true,
      showProgress: true,
      questionType: "both",
      multiSelect: 3,
      blocks: [
        {
          id: 'q5-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 50,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q5-title',
          type: 'heading-inline',
          properties: {
            content: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q5-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 5 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q5-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "5a", 
                text: "Estampas clean, com poucas informações",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp",
                value: "5a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "5b", 
                text: "Estampas clássicas e atemporais",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp",
                value: "5b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "5c", 
                text: "Atemporais, mas que tenham uma pegada de atual e moderna",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp",
                value: "5c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "5d", 
                text: "Estampas clássicas e atemporais, mas sofisticadas",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp",
                value: "5d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "5e", 
                text: "Estampas florais e/ou delicadas como bolinhas, borboletas e corações",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp",
                value: "5e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "5f", 
                text: "Estampas de animal print, como onça, zebra e cobra",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp",
                value: "5f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "5g", 
                text: "Estampas geométricas, abstratas e exageradas como grandes poás",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp",
                value: "5g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "5h", 
                text: "Estampas diferentes do usual, como africanas, xadrez grandes",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp",
                value: "5h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 2,
            showImages: true,
            imageSize: 'large',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 16,
            responsiveColumns: true
          }
        },
        {
          id: 'q5-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 50,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

        // QUESTÃO 6: QUAL CASACO É SEU FAVORITO?
    {
      id: "q6",
      title: "QUAL CASACO É SEU FAVORITO?",
      type: "question" as const,
      progress: 60,
      showHeader: true,
      showProgress: true,
      questionType: "both",
      multiSelect: 3,
      blocks: [
        {
          id: 'q6-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 60,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q6-title',
          type: 'heading-inline',
          properties: {
            content: 'QUAL CASACO É SEU FAVORITO?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q6-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 6 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q6-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "6a", 
                text: "Cardigã bege confortável e casual",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp",
                value: "6a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "6b", 
                text: "Blazer verde estruturado",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp",
                value: "6b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "6c", 
                text: "Trench coat bege tradicional",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp",
                value: "6c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "6d", 
                text: "Blazer branco refinado",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp",
                value: "6d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "6e", 
                text: "Casaco pink vibrante e moderno",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp",
                value: "6e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "6f", 
                text: "Jaqueta vinho de couro estilosa",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp",
                value: "6f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "6g", 
                text: "Jaqueta preta estilo rocker",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp",
                value: "6g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "6h", 
                text: "Casaco estampado criativo e colorido",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp",
                value: "6h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 2,
            showImages: true,
            imageSize: 'large',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 16,
            responsiveColumns: true
          }
        },
        {
          id: 'q6-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 60,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 7: QUAL SUA CALÇA FAVORITA?
    {
      id: "q7",
      title: "QUAL SUA CALÇA FAVORITA?",
      type: "question" as const,
      progress: 70,
      showHeader: true,
      showProgress: true,
      questionType: "both",
      multiSelect: 3,
      blocks: [
        {
          id: 'q7-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 70,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q7-title',
          type: 'heading-inline',
          properties: {
            content: 'QUAL SUA CALÇA FAVORITA?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q7-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 7 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q7-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "7a", 
                text: "Calça fluida acetinada bege",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp",
                value: "7a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "7b", 
                text: "Calça de alfaiataria cinza",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp",
                value: "7b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "7c", 
                text: "Jeans reto e básico",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp",
                value: "7c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "7d", 
                text: "Calça reta bege de tecido",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp",
                value: "7d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "7e", 
                text: "Calça ampla rosa alfaiatada",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp",
                value: "7e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "7f", 
                text: "Legging preta de couro",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp",
                value: "7f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "7g", 
                text: "Calça reta preta de couro",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp",
                value: "7g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "7h", 
                text: "Calça estampada floral leve e ampla",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp",
                value: "7h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 2,
            showImages: true,
            imageSize: 'large',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 16,
            responsiveColumns: true
          }
        },
        {
          id: 'q7-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 70,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 8: QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?
    {
      id: "q8",
      title: "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
      type: "question" as const,
      progress: 80,
      showHeader: true,
      showProgress: true,
      questionType: "both",
      multiSelect: 3,
      blocks: [
        {
          id: 'q8-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 80,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q8-title',
          type: 'heading-inline',
          properties: {
            content: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q8-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 8 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q8-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "8a", 
                text: "Tênis nude casual e confortável",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp",
                value: "8a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "8b", 
                text: "Scarpin nude de salto baixo",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp",
                value: "8b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "8c", 
                text: "Sandália dourada com salto bloco",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp",
                value: "8c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "8d", 
                text: "Scarpin nude salto alto e fino",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp",
                value: "8d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "8e", 
                text: "Sandália anabela off white",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp",
                value: "8e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "8f", 
                text: "Sandália rosa de tiras finas",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp",
                value: "8f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "8g", 
                text: "Scarpin preto moderno com vinil transparente",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp",
                value: "8g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "8h", 
                text: "Scarpin colorido estampado",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp",
                value: "8h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 2,
            showImages: true,
            imageSize: 'large',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 16,
            responsiveColumns: true
          }
        },
        {
          id: 'q8-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 80,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 9: QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?
    {
      id: "q9",
      title: "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?",
      type: "question" as const,
      progress: 90,
      showHeader: true,
      showProgress: true,
      questionType: "both",
      multiSelect: 3,
      blocks: [
        {
          id: 'q9-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 90,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q9-title',
          type: 'heading-inline',
          properties: {
            content: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q9-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 9 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q9-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "9a", 
                text: "Pequenos e discretos, às vezes nem uso.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.webp",
                value: "9a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "9b", 
                text: "Brincos pequenos e discretos. Corrente fininha.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp",
                value: "9b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "9c", 
                text: "Acessórios que elevem meu look com um toque moderno.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.webp",
                value: "9c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "9d", 
                text: "Acessórios sofisticados, joias ou semijoias.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.webp",
                value: "9d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "9e", 
                text: "Peças delicadas e com um toque feminino.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/59_dwaqrx.webp",
                value: "9e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "9f", 
                text: "Brincos longos, colares que valorizem minha beleza.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735487/63_lwgokn.webp",
                value: "9f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "9g", 
                text: "Acessórios pesados, que causem um impacto.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735485/62_mno8wg.webp",
                value: "9g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "9h", 
                text: "Acessórios diferentes, grandes e marcantes.",
                imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735480/58_njdjoh.webp",
                value: "9h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 2,
            showImages: true,
            imageSize: 'large',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 16,
            responsiveColumns: true
          }
        },
        {
          id: 'q9-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 90,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    },

    // QUESTÃO 10: VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...
    {
      id: "q10",
      title: "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...",
      type: "question" as const,
      progress: 100,
      showHeader: true,
      showProgress: true,
      questionType: "text",
      multiSelect: 3,
      blocks: [
        {
          id: 'q10-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 100,
            progressMax: 100,
            showBackButton: true
          }
        },
        {
          id: 'q10-title',
          type: 'heading-inline',
          properties: {
            content: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 8
          }
        },
        {
          id: 'q10-progress-label',
          type: 'text-inline',
          properties: {
            content: 'Questão 10 de 10',
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 24
          }
        },
        {
          id: 'q10-options',
          type: 'options-grid',
          properties: {
            options: [
              { 
                id: "10a", 
                text: "São fáceis de cuidar",
                value: "10a",
                category: "Natural",
                styleCategory: "Natural",
                points: 1
              },
              { 
                id: "10b", 
                text: "São de excelente qualidade",
                value: "10b",
                category: "Clássico",
                styleCategory: "Clássico",
                points: 1
              },
              { 
                id: "10c", 
                text: "São fáceis de cuidar e modernos",
                value: "10c",
                category: "Contemporâneo",
                styleCategory: "Contemporâneo",
                points: 1
              },
              { 
                id: "10d", 
                text: "São sofisticados",
                value: "10d",
                category: "Elegante",
                styleCategory: "Elegante",
                points: 1
              },
              { 
                id: "10e", 
                text: "São delicados",
                value: "10e",
                category: "Romântico",
                styleCategory: "Romântico",
                points: 1
              },
              { 
                id: "10f", 
                text: "São perfeitos ao meu corpo",
                value: "10f",
                category: "Sexy",
                styleCategory: "Sexy",
                points: 1
              },
              { 
                id: "10g", 
                text: "São diferentes, e trazem um efeito para minha roupa",
                value: "10g",
                category: "Dramático",
                styleCategory: "Dramático",
                points: 1
              },
              { 
                id: "10h", 
                text: "São exclusivos, criam identidade no look",
                value: "10h",
                category: "Criativo",
                styleCategory: "Criativo",
                points: 1
              }
            ],
            columns: 1,
            showImages: false,
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            validationMessage: 'Selecione até 3 opções',
            gridGap: 12,
            responsiveColumns: true
          }
        },
        {
          id: 'q10-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            disabled: true,
            requiresValidSelection: true
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 100,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    }
  ];
};

// Metadados de scoring e validação para as questões
export const QUIZ_QUESTIONS_METADATA = {
  "q1": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q2": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q3": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q4": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q5": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q6": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q7": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q8": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q9": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  },
  "q10": {
    "type": "normal",
    "scoring": true,
    "multiSelect": 3,
    "minSelections": 3,
    "maxSelections": 3,
    "validationRequired": true,
    "scoreWeight": 1,
    "exactSelections": true
  }
};

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
  minSelectionsPerQuestion: 3, // Obrigatório 3 seleções
  exactSelectionsRequired: 3, // Exatamente 3 seleções obrigatórias
  totalQuestions: 10,
  passageThreshold: 1.0, // 100% das questões respondidas obrigatoriamente
  tieBreakingMethod: 'firstSelection', // ou 'timestamp'
  
  // Configurações de validação
  validation: {
    requireAllQuestions: true,
    allowPartialResults: false,
    minimumSelectionPercentage: 100,
    exactSelectionsRequired: true, // Exige exatamente 3 seleções por questão
    enforceSelectionCount: true
  },
  
  // Configurações de UX e Comportamento
  behavior: {
    enableButtonOnlyWhenValid: true, // Botão só ativa com 3 seleções
    autoAdvanceOnComplete: true, // Autoavanço quando completar 3 seleções
    autoAdvanceDelay: 800, // Delay em ms antes do autoavanço
    showValidationFeedback: true, // Mostrar feedback visual
    disableIncompleteNavigation: true // Impedir avanço sem completar
  },
  
  // Mapeamento de categorias para tipos de estilo
  categoryMapping: {
    'Natural': 'natural',
    'Clássico': 'classico', 
    'Contemporâneo': 'contemporaneo',
    'Elegante': 'elegante',
    'Romântico': 'romantico',
    'Sexy': 'sensual',
    'Dramático': 'dramatico',
    'Criativo': 'criativo'
  }
};

// Funções utilitárias para o sistema de quiz
export const QuizUtils = {
  /**
   * Valida se uma questão tem seleções suficientes
   */
  validateQuestionResponse: (selectedOptions: string[], questionId: string) => {
    const metadata = QUIZ_QUESTIONS_METADATA[questionId];
    if (!metadata) return { isValid: false, error: 'Questão não encontrada' };
    
    const requiredSelections = 3; // Sempre 3 seleções obrigatórias
    
    // Validação específica: exatamente 3 seleções obrigatórias
    if (selectedOptions.length !== requiredSelections) {
      return { 
        isValid: false, 
        error: `Você deve selecionar exatamente ${requiredSelections} opções. Selecionadas: ${selectedOptions.length}` 
      };
    }
    
    return { isValid: true, error: null };
  },

  /**
   * Calcula o progresso do quiz baseado nas respostas
   */
  calculateProgress: (answeredQuestions: string[]) => {
    const totalQuestions = SCORING_CONFIG.totalQuestions;
    const progress = (answeredQuestions.length / totalQuestions) * 100;
    return Math.round(progress);
  },

  /**
   * Verifica se o quiz está completo
   */
  isQuizComplete: (answeredQuestions: string[]) => {
    return answeredQuestions.length === SCORING_CONFIG.totalQuestions;
  },

  /**
   * Verifica se todas as questões têm exatamente 3 seleções
   */
  validateAllQuestions: (allAnswers: Record<string, string[]>) => {
    const errors: string[] = [];
    
    for (let i = 1; i <= SCORING_CONFIG.totalQuestions; i++) {
      const questionId = `q${i}`;
      const answers = allAnswers[questionId] || [];
      
      if (answers.length !== 3) {
        errors.push(`Questão ${i}: Selecione exatamente 3 opções (${answers.length} selecionadas)`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors,
      canProceed: errors.length === 0
    };
  },

  /**
   * Obtém metadados de uma questão específica
   */
  getQuestionMetadata: (questionId: string) => {
    return QUIZ_QUESTIONS_METADATA[questionId] || null;
  },

  /**
   * Verifica se o botão "Avançar" deve estar habilitado
   */
  isAdvanceButtonEnabled: (selectedOptions: string[], questionId: string) => {
    const validation = QuizUtils.validateQuestionResponse(selectedOptions, questionId);
    return validation.isValid && selectedOptions.length === 3;
  },

  /**
   * Verifica se deve fazer autoavanço automático
   */
  shouldAutoAdvance: (selectedOptions: string[], questionId: string) => {
    if (!SCORING_CONFIG.behavior.autoAdvanceOnComplete) return false;
    return QuizUtils.isAdvanceButtonEnabled(selectedOptions, questionId);
  },

  /**
   * Obtém configurações de comportamento para uma questão
   */
  getQuestionBehaviorConfig: (questionId: string) => {
    const metadata = QUIZ_QUESTIONS_METADATA[questionId];
    if (!metadata) return null;
    
    return {
      requireExactSelections: metadata.exactSelections,
      requiredSelections: metadata.minSelections,
      enableButtonOnlyWhenValid: SCORING_CONFIG.behavior.enableButtonOnlyWhenValid,
      autoAdvanceOnComplete: SCORING_CONFIG.behavior.autoAdvanceOnComplete,
      autoAdvanceDelay: SCORING_CONFIG.behavior.autoAdvanceDelay,
      showValidationFeedback: SCORING_CONFIG.behavior.showValidationFeedback
    };
  },

  /**
   * Calcula o tempo de delay antes do autoavanço
   */
  getAutoAdvanceDelay: () => {
    return SCORING_CONFIG.behavior.autoAdvanceDelay;
  },

  /**
   * Mapeia categoria para tipo de estilo usado no cálculo
   */
  mapCategoryToStyleType: (category: StyleCategory) => {
    return SCORING_CONFIG.categoryMapping[category] || category.toLowerCase();
  }
};
