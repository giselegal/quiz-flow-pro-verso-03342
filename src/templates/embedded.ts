/**
 * 🏗️ BUILD-TIME TEMPLATES EMBEDDED
 * 
 * Gerado automaticamente em: 2025-10-28T14:23:04.424Z
 * Total de steps: 21
 * Total de blocos: 99
 * 
 * ⚠️ NÃO EDITAR MANUALMENTE - executar: npm run build:templates
 */

export interface Block {
  id: string;
  type: string;
  order: number;
  properties: Record<string, any>;
  content: Record<string, any>;
  parentId?: string | null;
}

const embedded: Record<string, Block[]> = {
    "step-01": [
      {
        "id": "intro-title",
        "type": "heading-inline",
        "order": 0,
        "properties": {
          "padding": 16,
          "type": "fade",
          "duration": 300
        },
        "content": {
          "title": "Bem-vinda ao Quiz de Estilo"
        },
        "parentId": null
      },
      {
        "id": "intro-subtitle",
        "type": "text-inline",
        "order": 1,
        "properties": {},
        "content": {
          "text": "Descubra seu <strong>ESTILO PREDOMINANTE</strong> em apenas alguns minutos!"
        },
        "parentId": null
      },
      {
        "id": "intro-form",
        "type": "intro-form",
        "order": 2,
        "properties": {
          "padding": 16,
          "type": "slideUp",
          "duration": 300
        },
        "content": {
          "label": "Qual é o seu nome?",
          "placeholder": "Digite seu nome aqui",
          "buttonText": "Começar Agora",
          "required": true
        },
        "parentId": null
      }
    ],
    "step-02": [
      {
        "id": "progress-bar-step-02",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 2,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-02-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "backgroundColor": "transparent",
          "padding": 16,
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Pergunta 1 de 10"
        },
        "parentId": null
      },
      {
        "id": "step-02-options",
        "type": "options grid",
        "order": 2,
        "properties": {
          "backgroundColor": "transparent",
          "padding": 16,
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Natural",
              "imageUrl": "/quiz-assets/natural.webp"
            },
            {
              "id": "classico",
              "text": "Clássico",
              "imageUrl": "/quiz-assets/classico.webp"
            },
            {
              "id": "contemporaneo",
              "text": "Contemporâneo",
              "imageUrl": "/quiz-assets/contemporaneo.webp"
            },
            {
              "id": "elegante",
              "text": "Elegante",
              "imageUrl": "/quiz-assets/elegante.webp"
            },
            {
              "id": "romantico",
              "text": "Romântico",
              "imageUrl": "/quiz-assets/romantico.webp"
            },
            {
              "id": "sexy",
              "text": "Sexy",
              "imageUrl": "/quiz-assets/sexy.webp"
            },
            {
              "id": "dramatico",
              "text": "Dramático",
              "imageUrl": "/quiz-assets/dramatico.webp"
            },
            {
              "id": "criativo",
              "text": "Criativo",
              "imageUrl": "/quiz-assets/criativo.webp"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true
        },
        "parentId": null
      }
    ],
    "step-03": [
      {
        "id": "progress-bar-step-03",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 3,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-03-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "backgroundColor": "transparent",
          "padding": 16,
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Pergunta 2 de 10"
        },
        "parentId": null
      },
      {
        "id": "options-grid-03",
        "type": "options grid",
        "order": 2,
        "properties": {
          "backgroundColor": "transparent",
          "padding": 16,
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Informal, espontânea, alegre, essencialista",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Conservadora, séria, organizada",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Informada, ativa, prática",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Exigente, sofisticada, seletiva",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Feminina, meiga, delicada, sensível",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Glamorosa, vaidosa, sensual",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Cosmopolita, moderna e audaciosa",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Exótica, aventureira, livre",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-03-cta-next",
        "type": "CTAButton",
        "order": 3,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-04": [
      {
        "id": "progress-bar-step-04",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 4,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-04-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-04",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "backgroundColor": "transparent",
          "padding": 16,
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        },
        "content": {
          "questionNumber": "3 de 10",
          "questionText": "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
          "currentQuestion": 3,
          "totalQuestions": 13,
          "progressValue": 19,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-04",
        "type": "options grid",
        "order": 3,
        "properties": {
          "backgroundColor": "transparent",
          "padding": 16,
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Visual leve, despojado e natural",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Visual clássico e tradicional",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Visual casual com toque atual",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Visual refinado e imponente",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Visual romântico, feminino e delicado",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Visual sensual, com saia justa e decote",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Visual marcante e urbano (jeans + jaqueta)",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Visual criativo, colorido e ousado",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-04-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-05": [
      {
        "id": "progress-bar-step-05",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 5,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-05-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "QUAIS DETALHES VOCÊ GOSTA?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-05",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "4 de 10",
          "questionText": "QUAIS DETALHES VOCÊ GOSTA?",
          "currentQuestion": 4,
          "totalQuestions": 13,
          "progressValue": 24,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-05",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Poucos detalhes, básico e prático",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Bem discretos e sutis, clean e clássico",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Básico, mas com um toque de estilo",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Detalhes refinados, chic e que deem status",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Detalhes delicados, laços, babados",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Roupas que valorizem meu corpo: couro, zíper, fendas",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Detalhes marcantes, firmeza e peso",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Detalhes diferentes do convencional, produções ousadas",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-05-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-06": [
      {
        "id": "progress-bar-step-06",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 6,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-06-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-06",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "5 de 10",
          "questionText": "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
          "currentQuestion": 5,
          "totalQuestions": 13,
          "progressValue": 29,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-06",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Estampas clean, com poucas informações",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Estampas clássicas e atemporais",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Atemporais, mas que tenham uma pegada atual e moderna",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Estampas clássicas e atemporais, mas sofisticadas",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Estampas florais e/ou delicadas como bolinhas, borboletas e corações",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Estampas de animal print, como onça, zebra e cobra",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Estampas geométricas, abstratas e exageradas como grandes poás",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Estampas diferentes do usual, como africanas, xadrez grandes",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-06-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-07": [
      {
        "id": "progress-bar-step-07",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 7,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-07-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "QUAL CASACO É SEU FAVORITO?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-07",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "6 de 10",
          "questionText": "QUAL CASACO É SEU FAVORITO?",
          "currentQuestion": 6,
          "totalQuestions": 13,
          "progressValue": 33,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-07",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Cardigã bege confortável e casual",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Blazer verde estruturado",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Trench coat bege tradicional",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Blazer branco refinado",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Casaco pink vibrante e moderno",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Jaqueta vinho de couro estilosa",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Jaqueta preta estilo rocker",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Casaco estampado criativo e colorido",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-07-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-08": [
      {
        "id": "progress-bar-step-08",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 8,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-08-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "QUAL SUA CALÇA FAVORITA?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-08",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "7 de 10",
          "questionText": "QUAL SUA CALÇA FAVORITA?",
          "currentQuestion": 7,
          "totalQuestions": 13,
          "progressValue": 38,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-08",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Calça fluida acetinada bege",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Calça de alfaiataria cinza",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Jeans reto e básico",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Calça reta bege de tecido",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Calça ampla rosa alfaiatada",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Legging preta de couro",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Calça reta preta de couro",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Calça estampada floral leve e ampla",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-08-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-09": [
      {
        "id": "progress-bar-step-09",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 9,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-09-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-09",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "8 de 10",
          "questionText": "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
          "currentQuestion": 8,
          "totalQuestions": 13,
          "progressValue": 43,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-09",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Tênis nude casual e confortável",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Scarpin nude de salto baixo",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Sandália dourada com salto bloco",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Scarpin nude salto alto e fino",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Sandália anabela off white",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Sandália rosa de tiras finas",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Scarpin preto moderno com vinil transparente",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Scarpin colorido estampado",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-09-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-10": [
      {
        "id": "progress-bar-step-10",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 10,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-10-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-10",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "9 de 10",
          "questionText": "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?",
          "currentQuestion": 9,
          "totalQuestions": 13,
          "progressValue": 48,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-10",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Pequenos e discretos, às vezes nem uso",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.png",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Brincos pequenos e discretos. Corrente fininha",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.png",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Acessórios que elevem meu look com um toque moderno",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.png",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Acessórios sofisticados, joias ou semijoias",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.png",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Peças delicadas e com um toque feminino",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/59_dwaqrx.png",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Brincos longos, colares que valorizem minha beleza",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735487/63_lwgokn.png",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Acessórios pesados, que causem um impacto",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735485/62_mno8wg.png",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Acessórios diferentes, grandes e marcantes",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735480/58_njdjoh.png",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-10-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-11": [
      {
        "id": "progress-bar-step-11",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 11,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-11-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES..."
        },
        "parentId": null
      },
      {
        "id": "question-hero-11",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "10 de 10",
          "questionText": "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...",
          "currentQuestion": 10,
          "totalQuestions": 13,
          "progressValue": 52,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-11",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "São fáceis de cuidar",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "São de excelente qualidade",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "São fáceis de cuidar e modernos",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "São sofisticados",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "São delicados",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "São perfeitos ao meu corpo",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "São diferentes, e trazem um efeito para minha roupa",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "São exclusivos, criam identidade no look",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar",
          "requiredSelections": 3
        },
        "parentId": null
      },
      {
        "id": "step-11-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Avançar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-12": [
      {
        "id": "transition-hero-12",
        "type": "transition-hero",
        "order": 0,
        "properties": {
          "backgroundColor": "#FAF9F7",
          "textColor": "#432818",
          "padding": 32,
          "type": "scale",
          "duration": 500,
          "delay": 0,
          "easing": "ease-out"
        },
        "content": {
          "title": "🕐 Enquanto calculamos o seu resultado...",
          "subtitle": "Estamos montando seu perfil de estilo personalizado",
          "message": "Continue para descobrir ainda mais sobre seu estilo único!",
          "autoAdvanceDelay": 3500,
          "description": "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão."
        },
        "parentId": null
      },
      {
        "id": "step-12-transition-text",
        "type": "text-inline",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão."
        },
        "parentId": null
      },
      {
        "id": "step-12-transition-cta",
        "type": "CTAButton",
        "order": 2,
        "properties": {},
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "medium"
        },
        "parentId": null
      }
    ],
    "step-13": [
      {
        "id": "progress-bar-step-13",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 13,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-13-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-13",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "Q11 - OBJETIVOS",
          "questionText": "Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?",
          "currentQuestion": 11,
          "totalQuestions": 13,
          "progressValue": 57,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-13",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "desconectada",
              "text": "Me sinto desconectada da mulher que sou hoje",
              "value": "desconectada"
            },
            {
              "id": "duvidas",
              "text": "Tenho dúvidas sobre o que realmente me valoriza",
              "value": "duvidas"
            },
            {
              "id": "as-vezes-acerto",
              "text": "Às vezes acerto, às vezes erro",
              "value": "as-vezes-acerto"
            },
            {
              "id": "segura-evoluir",
              "text": "Me sinto segura, mas sei que posso evoluir",
              "value": "segura-evoluir"
            }
          ],
          "columns": 2,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500
        },
        "parentId": null
      },
      {
        "id": "step-13-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-14": [
      {
        "id": "progress-bar-step-14",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 14,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-14-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "O que mais te desafia na hora de se vestir?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-14",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "Q12 - DESAFIOS",
          "questionText": "O que mais te desafia na hora de se vestir?",
          "currentQuestion": 12,
          "totalQuestions": 13,
          "progressValue": 62,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-14",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "combinar-pecas",
              "text": "Tenho peças, mas não sei como combiná-las",
              "value": "combinar-pecas"
            },
            {
              "id": "comprar-impulso",
              "text": "Compro por impulso e me arrependo depois",
              "value": "comprar-impulso"
            },
            {
              "id": "imagem-nao-reflete",
              "text": "Minha imagem não reflete quem eu sou",
              "value": "imagem-nao-reflete"
            },
            {
              "id": "perco-tempo",
              "text": "Perco tempo e acabo usando sempre os mesmos looks",
              "value": "perco-tempo"
            }
          ],
          "columns": 2,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500
        },
        "parentId": null
      },
      {
        "id": "step-14-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-15": [
      {
        "id": "progress-bar-step-15",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 15,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-15-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Com que frequência você se pega pensando: \"Com que roupa eu vou?\" — mesmo com o guarda-roupa cheio?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-15",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "Q13 - PRIORIDADES",
          "questionText": "Com que frequência você se pega pensando: \"Com que roupa eu vou?\" — mesmo com o guarda-roupa cheio?",
          "currentQuestion": 13,
          "totalQuestions": 13,
          "progressValue": 67,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-15",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "quase-todos-dias",
              "text": "Quase todos os dias — é sempre uma indecisão",
              "value": "quase-todos-dias"
            },
            {
              "id": "compromissos-importantes",
              "text": "Sempre que tenho um compromisso importante",
              "value": "compromissos-importantes"
            },
            {
              "id": "as-vezes-limitada",
              "text": "Às vezes, mas me sinto limitada nas escolhas",
              "value": "as-vezes-limitada"
            },
            {
              "id": "raramente-segura",
              "text": "Raramente — já me sinto segura ao me vestir",
              "value": "raramente-segura"
            }
          ],
          "columns": 2,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500
        },
        "parentId": null
      },
      {
        "id": "step-15-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-16": [
      {
        "id": "progress-bar-step-16",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 16,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-16-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-16",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "Q14 - INVESTIMENTO",
          "questionText": "Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?",
          "currentQuestion": 14,
          "totalQuestions": 13,
          "progressValue": 71,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-16",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "sim-quero",
              "text": "Sim! Se existisse algo assim, eu quero",
              "value": "sim-quero"
            },
            {
              "id": "sim-momento-certo",
              "text": "Sim, mas teria que ser no momento certo",
              "value": "sim-momento-certo"
            },
            {
              "id": "tenho-duvidas",
              "text": "Tenho dúvidas se funcionaria pra mim",
              "value": "tenho-duvidas"
            },
            {
              "id": "nao-prefiro-continuar",
              "text": "Não, prefiro continuar como estou",
              "value": "nao-prefiro-continuar"
            }
          ],
          "columns": 2,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500
        },
        "parentId": null
      },
      {
        "id": "step-16-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-17": [
      {
        "id": "progress-bar-step-17",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 17,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-17-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-17",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "Q15 - TRANSFORMAÇÃO",
          "questionText": "Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?",
          "currentQuestion": 15,
          "totalQuestions": 13,
          "progressValue": 76,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-17",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "sim-vale-muito",
              "text": "Sim! Por esse resultado, vale muito",
              "value": "sim-vale-muito"
            },
            {
              "id": "sim-se-certeza",
              "text": "Sim, mas só se eu tiver certeza de que funciona pra mim",
              "value": "sim-se-certeza"
            },
            {
              "id": "talvez-depende",
              "text": "Talvez — depende do que está incluso",
              "value": "talvez-depende"
            },
            {
              "id": "nao-nao-pronta",
              "text": "Não, ainda não estou pronta para investir",
              "value": "nao-nao-pronta"
            }
          ],
          "columns": 2,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500
        },
        "parentId": null
      },
      {
        "id": "step-17-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-18": [
      {
        "id": "progress-bar-step-18",
        "type": "question-progress",
        "order": 0,
        "properties": {
          "padding": 8
        },
        "content": {
          "stepNumber": 18,
          "totalSteps": 21,
          "showPercentage": true,
          "barColor": "#B89B7A",
          "backgroundColor": "#e5e7eb"
        },
        "parentId": null
      },
      {
        "id": "step-18-question-title",
        "type": "question-title",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "text": "Qual desses resultados você mais gostaria de alcançar?"
        },
        "parentId": null
      },
      {
        "id": "question-hero-18",
        "type": "question-hero",
        "order": 2,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {
          "questionNumber": "Q16 - RESULTADO",
          "questionText": "Qual desses resultados você mais gostaria de alcançar?",
          "currentQuestion": 16,
          "totalQuestions": 13,
          "progressValue": 81,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "parentId": null
      },
      {
        "id": "options-grid-18",
        "type": "options grid",
        "order": 3,
        "properties": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        },
        "content": {
          "options": [
            {
              "id": "montar-looks-facilidade",
              "text": "Montar looks com mais facilidade e confiança",
              "value": "montar-looks-facilidade"
            },
            {
              "id": "usar-que-tenho",
              "text": "Usar o que já tenho e me sentir estilosa",
              "value": "usar-que-tenho"
            },
            {
              "id": "comprar-consciencia",
              "text": "Comprar com mais consciência e sem culpa",
              "value": "comprar-consciencia"
            },
            {
              "id": "ser-admirada",
              "text": "Ser admirada pela imagem que transmito",
              "value": "ser-admirada"
            }
          ],
          "columns": 2,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": true,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500
        },
        "parentId": null
      },
      {
        "id": "step-18-cta-next",
        "type": "CTAButton",
        "order": 4,
        "properties": {},
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "parentId": null
      }
    ],
    "step-19": [
      {
        "id": "transition-hero-19",
        "type": "transition-hero",
        "order": 0,
        "properties": {
          "backgroundColor": "#FAF9F7",
          "textColor": "#432818",
          "padding": 32,
          "type": "scale",
          "duration": 500,
          "delay": 0,
          "easing": "ease-out"
        },
        "content": {
          "title": "Obrigada por compartilhar.",
          "subtitle": "Preparando seu resultado personalizado",
          "message": "Em instantes você descobrirá qual estilo te representa e como valorizar sua essência!",
          "autoAdvanceDelay": 3000
        },
        "parentId": null
      },
      {
        "id": "step-19-transition-text",
        "type": "text-inline",
        "order": 1,
        "properties": {
          "type": "fade",
          "duration": 300
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "step-19-transition-cta",
        "type": "CTAButton",
        "order": 2,
        "properties": {},
        "content": {
          "label": "...",
          "variant": "outline",
          "size": "small"
        },
        "parentId": null
      }
    ],
    "step-20": [
      {
        "id": "result-congrats",
        "type": "result-congrats",
        "order": 0,
        "properties": {
          "enabled": true,
          "order": 1,
          "props": {
            "showCelebration": true,
            "celebrationEmoji": "🎉",
            "celebrationAnimation": "bounce",
            "greetingFormat": "Olá, {userName}!",
            "titleFormat": "Seu Estilo Predominante é:",
            "styleNameDisplay": "{styleName}",
            "colors": {
              "greeting": "#432818",
              "greetingHighlight": "#B89B7A",
              "title": "#432818",
              "styleName": "#B89B7A"
            },
            "spacing": {
              "padding": "3rem 1.5rem",
              "marginBottom": "2.5rem"
            }
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "result-main",
        "type": "result-main",
        "order": 1,
        "properties": {
          "enabled": true,
          "order": 2,
          "props": {
            "layout": "two-column",
            "imagePosition": "left",
            "showStyleImage": true,
            "styleImage": {
              "aspectRatio": "4/5",
              "showDecorations": true,
              "decorationColor": "#B89B7A",
              "fallbackEnabled": true
            },
            "showIntroText": true,
            "introText": "Esse é o estilo que mais traduz a sua essência. Ele revela muito sobre como você se conecta com o mundo e a forma como expressa sua energia.",
            "showDescription": true
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "result-progress-bars",
        "type": "result-progress-bars",
        "order": 2,
        "properties": {
          "enabled": true,
          "order": 3,
          "props": {
            "topCount": 3,
            "showPercentage": true,
            "percentageFormat": "{percentage}%",
            "animationDelay": 200,
            "colors": {
              "primary": "#B89B7A",
              "secondary": "#a08966",
              "tertiary": "#8c7757"
            },
            "titleFormat": "Além do {primaryStyle}, você também tem traços de:"
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "result-secondary-styles",
        "type": "result-secondary-styles",
        "order": 3,
        "properties": {
          "enabled": true,
          "order": 4,
          "props": {
            "showKeywords": true,
            "keywordsTitle": "Palavras que te definem:",
            "tagColor": "#B89B7A",
            "tagStyle": "rounded-full"
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "result-image",
        "type": "result-image",
        "order": 4,
        "properties": {
          "enabled": true,
          "order": 5,
          "props": {
            "position": "center",
            "aspectRatio": "4/5",
            "maxWidth": "28rem",
            "centered": true,
            "showDecorations": false
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "result-description",
        "type": "result-description",
        "order": 5,
        "properties": {
          "enabled": true,
          "order": 6,
          "props": {
            "showTransitionText": true,
            "transitionText": "Mas lembre-se: você não é só um estilo.",
            "showPersuasiveQuestions": true,
            "persuasiveQuestionsTitle": "💭 Você já se perguntou...",
            "persuasiveQuestionsIcon": "❓",
            "showClosingMessage": true,
            "closingMessage": "✨ É a mistura desses elementos que torna a sua imagem única."
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "button-cta-primary",
        "type": "result-cta",
        "order": 6,
        "properties": {
          "enabled": true,
          "order": 7
        },
        "content": {
          "text": "{ctaPrimaryText}",
          "url": "{ctaPrimaryUrl}",
          "variant": "primary",
          "size": "large",
          "fullWidth": true,
          "backgroundColor": "#B89B7A",
          "textColor": "#ffffff",
          "hoverColor": "#a08966"
        },
        "parentId": null
      },
      {
        "id": "result-share",
        "type": "result-share",
        "order": 7,
        "properties": {
          "enabled": true,
          "order": 8
        },
        "content": {
          "title": "Compartilhe seu resultado",
          "message": "Descubri meu estilo predominante! Faça o quiz e descubra o seu:",
          "platforms": [
            "facebook",
            "twitter",
            "whatsapp",
            "linkedin"
          ]
        },
        "parentId": null
      },
      {
        "id": "transformation-benefits",
        "type": "text-inline",
        "order": 8,
        "properties": {
          "enabled": true,
          "order": 8,
          "props": {
            "content": "<h3>Transforme Sua Imagem, Revele Sua Essência</h3><p>Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser.</p><ul><li>🎯 Clareza de estilo para se vestir com facilidade todos os dias</li><li>🎨 Cores e formas que comunicam quem você é e o que você quer</li><li>💼 Imagem que chega primeiro: autoridade sem perder autenticidade</li><li>👗 Guarda-roupa estratégico que conversa entre si</li></ul>",
            "align": "left",
            "style": "rich-text"
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "method-steps",
        "type": "text-inline",
        "order": 9,
        "properties": {
          "enabled": true,
          "order": 9,
          "props": {
            "content": "<h3>O que você vai aprender no Método 5 Passos</h3><div><h4>🪞 Passo 1 — Estilo de Ser</h4><p>Descubra seus 3 estilos predominantes e entenda como traduzir sua personalidade no vestir.</p></div><div><h4>🎨 Passo 2 — Cores</h4><p>As cores são uma linguagem emocional. Aprenda como escolher tons que valorizam sua beleza natural.</p></div><div><h4>🧍‍♀️ Passo 3 — Biotipo</h4><p>Entenda as linhas e proporções do seu corpo e como se vestir para equilibrar formas.</p></div><div><h4>🧹 Passo 4 — Detox do Guarda-Roupa</h4><p>Um processo de autoconhecimento através do desapego.</p></div><div><h4>👗 Passo 5 — Guarda-Roupa de Sucesso</h4><p>Monte um guarda-roupa funcional e inteligente, com peças-chave e combinações rápidas.</p></div>",
            "align": "left",
            "style": "rich-text"
          }
        },
        "content": {},
        "parentId": null
      },
      {
        "id": "button-cta-final",
        "type": "result-cta",
        "order": 10,
        "properties": {
          "enabled": true,
          "order": 10
        },
        "content": {
          "text": "{ctaSecondaryText}",
          "url": "{ctaSecondaryUrl}",
          "variant": "primary",
          "size": "large",
          "fullWidth": true,
          "backgroundColor": "#B89B7A",
          "textColor": "#ffffff",
          "hoverColor": "#a08966"
        },
        "parentId": null
      }
    ],
    "step-21": [
      {
        "id": "offer-hero-21",
        "type": "offer-hero",
        "order": 0,
        "properties": {
          "type": "scale",
          "duration": 500
        },
        "content": {
          "title": "{userName}, Transforme Seu Guarda-Roupa e Sua Confiança Hoje!",
          "subtitle": "Oferta exclusiva para quem completou o quiz de estilo",
          "description": "Descubra como valorizar seu estilo único e se sentir confiante em qualquer ocasião com o método exclusivo 5 Passos.",
          "urgencyMessage": "Oferta por tempo limitado!"
        },
        "parentId": null
      },
      {
        "id": "pricing-21",
        "type": "pricing",
        "order": 1,
        "properties": {
          "type": "slideUp",
          "duration": 500
        },
        "content": {
          "pricing": {
            "originalPrice": 447,
            "salePrice": 97,
            "currency": "R$",
            "installments": {
              "count": 8,
              "value": 14.11
            }
          },
          "title": "Investimento que Transforma",
          "ctaText": "Quero Transformar Meu Estilo Agora!",
          "ctaUrl": "https://pay.kiwify.com.br/DkYC1Aj"
        },
        "parentId": null
      }
    ]
  };

export { embedded };
export default embedded;
