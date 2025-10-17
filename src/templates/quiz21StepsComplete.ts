/**
 * 🎯 TEMPLATE COMPLETO - QUIZ DE ESTILO PESSOAL (21 ETAPAS)
 * 
 * ⚠️  ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITE MANUALMENTE!
 * 
 * Este arquivo é gerado pelo script scripts/generate-templates.ts
 * a partir dos JSONs em public/templates/
 * 
 * Para editar os templates:
 * 1. Edite os arquivos JSON em public/templates/
 * 2. Execute: npm run generate:templates
 * 3. Commit ambos: JSON + este arquivo TS
 * 
 * Gerado em: 2025-10-17T01:55:22.923Z
 * Versão: 3.0.0
 */

import { Block } from '../types/editor';

// 🔧 PERFORMANCE E CACHE OTIMIZADO
const TEMPLATE_CACHE = new Map<string, any>();
const FUNNEL_TEMPLATE_CACHE = new Map<string, any>();

// 🚀 FUNÇÃO DE CARREGAMENTO OTIMIZADO PARA PERFORMANCE
export function getStepTemplate(stepId: string): any {
  if (TEMPLATE_CACHE.has(stepId)) {
    return TEMPLATE_CACHE.get(stepId);
  }

  const template = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (template) {
    TEMPLATE_CACHE.set(stepId, template);
    return template;
  }

  console.warn(`⚠️ Template ${stepId} not found`);
  return null;
}

// 🎯 NOVA FUNÇÃO: Template personalizado por funil
export function getPersonalizedStepTemplate(stepId: string, funnelId?: string): any {
  if (!funnelId) {
    return getStepTemplate(stepId);
  }

  const cacheKey = `${funnelId}:${stepId}`;

  if (FUNNEL_TEMPLATE_CACHE.has(cacheKey)) {
    return FUNNEL_TEMPLATE_CACHE.get(cacheKey);
  }

  const baseTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (!baseTemplate) {
    console.warn(`⚠️ Template ${stepId} not found for funnel ${funnelId}`);
    return null;
  }

  const personalizedTemplate = personalizeTemplateForFunnel(baseTemplate, funnelId, stepId);
  FUNNEL_TEMPLATE_CACHE.set(cacheKey, personalizedTemplate);

  return personalizedTemplate;
}

// 🎨 FUNÇÃO DE PERSONALIZAÇÃO baseada no funnelId
function personalizeTemplateForFunnel(template: any[], funnelId: string, _stepId: string): any[] {
  if (!Array.isArray(template)) return template;

  const funnelSeed = generateSeedFromFunnelId(funnelId);
  
  return template.map((block) => {
    const personalizedBlock = JSON.parse(JSON.stringify(block));

    if (personalizedBlock.id) {
      personalizedBlock.id = `${personalizedBlock.id}-fnl${funnelSeed}`;
    }

    return personalizedBlock;
  });
}

function generateSeedFromFunnelId(funnelId: string): number {
  let hash = 0;
  for (let i = 0; i < funnelId.length; i++) {
    hash = ((hash << 5) - hash) + funnelId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 1000);
}

// Environment check for tests
const IS_TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const MINIMAL_TEST_TEMPLATE: Record<string, Block[]> = {
  'step-1': [],
  'step-2': [],
};


export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, any> = IS_TEST ? MINIMAL_TEST_TEMPLATE : {
  'step-01': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-01-intro-v3",
      "name": "Introdução - Bem-vindo ao Quiz de Estilo",
      "description": "Página inicial do quiz com apresentação e coleta do nome do usuário",
      "category": "intro",
      "tags": [
        "quiz",
        "style",
        "intro",
        "welcome",
        "name-input"
      ],
      "createdAt": "2025-01-13T00:00:00.000Z",
      "updatedAt": "2025-01-13T00:00:00.000Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "intro-hero",
        "id": "intro-hero-01",
        "content": {
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão - Consultoria de Estilo",
          "logoWidth": 96,
          "logoHeight": 96,
          "title": "<span style=\"color: #B89B7A\">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com <span style=\"color: #B89B7A\">Você</span>.",
          "subtitle": "Descubra seu <strong>ESTILO PREDOMINANTE</strong> em apenas alguns minutos!",
          "imageUrl": "https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif",
          "imageAlt": "Descubra seu estilo predominante",
          "description": "Um quiz personalizado que vai revelar qual estilo te representa e como valorizar sua essência através das roupas.",
          "showProgress": false,
          "progressValue": 0
        },
        "style": {
          "backgroundColor": "#FAF9F7",
          "textColor": "#432818",
          "padding": 24
        },
        "animation": {
          "type": "fade",
          "duration": 500,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "welcome-form",
        "id": "intro-form-01",
        "content": {
          "questionText": "Antes de começarmos, como posso te chamar?",
          "nameLabel": "Seu primeiro nome",
          "namePlaceholder": "Digite seu primeiro nome aqui...",
          "submitText": "Quero Descobrir meu Estilo Agora!",
          "loadingText": "Preparando seu quiz personalizado...",
          "successText": "Perfeito! Vamos descobrir seu estilo!",
          "showNameField": true,
          "showEmailField": false,
          "requiredFields": "name",
          "validationMessage": "Por favor, digite seu nome para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 400,
          "delay": 200,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "userName"
      ],
      "rules": {
        "userName": {
          "minLength": 2,
          "maxLength": 50,
          "pattern": "^[a-zA-ZÀ-ÿ\\s]+$",
          "errorMessage": "Por favor, digite um nome válido (apenas letras)"
        }
      }
    },
    "navigation": {
      "nextStep": "step-02",
      "prevStep": null,
      "allowBack": false,
      "requiresUserInput": true,
      "autoAdvance": false
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "field_focus",
        "form_submit",
        "validation_error"
      ],
      "trackingId": "step-01-intro-v3",
      "fbPixelId": null,
      "gaTrackingId": null
    },
    "seo": {
      "title": "Quiz de Estilo Pessoal - Descubra seu Estilo Predominante",
      "description": "Descubra qual estilo te representa em apenas alguns minutos. Quiz personalizado de consultoria de estilo por Gisele Galvão.",
      "keywords": [
        "quiz de estilo",
        "estilo pessoal",
        "consultoria de estilo",
        "guarda-roupa",
        "moda feminina"
      ]
    }
  },

  'step-02': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-02-question-v3",
      "name": "Q1 - Roupa Favorita",
      "description": "Primeira questão sobre preferências de estilo de roupa",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question",
        "roupa",
        "preferencias"
      ],
      "questionNumber": 1,
      "totalQuestions": 13,
      "createdAt": "2025-01-13T00:00:00.000Z",
      "updatedAt": "2025-01-13T00:00:00.000Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-02",
        "content": {
          "questionNumber": "Q1 - ROUPA FAVORITA",
          "questionText": "Qual tipo de roupa você mais se identifica?",
          "currentQuestion": 1,
          "totalQuestions": 13,
          "progressValue": 10,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-02",
        "content": {
          "options": [
            {
              "id": "2a",
              "text": "Vestidos fluidos e confortáveis",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "2a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "2b",
              "text": "Blazers estruturados e calças alfaiataria",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "2b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "2c",
              "text": "Peças modernas com toque minimalista",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "2c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "2d",
              "text": "Vestidos sofisticados e acessórios marcantes",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "2d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-03",
      "prevStep": "step-01",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-02-question-v3",
      "fbPixelId": null,
      "gaTrackingId": null
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "2a": {
          "category": "Natural",
          "points": 1
        },
        "2b": {
          "category": "Clássico",
          "points": 2
        },
        "2c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "2d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-03': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-03-question-v3",
      "name": "Q2 - Nome pessoal",
      "description": "Questão 2 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 2,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.714Z",
      "updatedAt": "2025-10-13T00:32:31.714Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-03",
        "content": {
          "questionNumber": "Q2 - NOME PESSOAL",
          "questionText": "Como você prefere que as pessoas te chamem no dia a dia?",
          "currentQuestion": 2,
          "totalQuestions": 13,
          "progressValue": 14,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-03",
        "content": {
          "options": [
            {
              "id": "3a",
              "text": "Opção A para Q2",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "3a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "3b",
              "text": "Opção B para Q2",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "3b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "3c",
              "text": "Opção C para Q2",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "3c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "3d",
              "text": "Opção D para Q2",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "3d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-04",
      "prevStep": "step-02",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-03-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "3a": {
          "category": "Natural",
          "points": 1
        },
        "3b": {
          "category": "Clássico",
          "points": 2
        },
        "3c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "3d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-04': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-04-question-v3",
      "name": "Q3 - Estilo pessoal",
      "description": "Questão 3 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 3,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.720Z",
      "updatedAt": "2025-10-13T00:32:31.720Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-04",
        "content": {
          "questionNumber": "Q3 - ESTILO PESSOAL",
          "questionText": "Qual palavra melhor descreve seu estilo?",
          "currentQuestion": 3,
          "totalQuestions": 13,
          "progressValue": 19,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-04",
        "content": {
          "options": [
            {
              "id": "4a",
              "text": "Opção A para Q3",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "4a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "4b",
              "text": "Opção B para Q3",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "4b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "4c",
              "text": "Opção C para Q3",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "4c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "4d",
              "text": "Opção D para Q3",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "4d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-05",
      "prevStep": "step-03",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-04-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "4a": {
          "category": "Natural",
          "points": 1
        },
        "4b": {
          "category": "Clássico",
          "points": 2
        },
        "4c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "4d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-05': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-05-question-v3",
      "name": "Q4 - Ocasiões",
      "description": "Questão 4 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 4,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.721Z",
      "updatedAt": "2025-10-13T00:32:31.721Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-05",
        "content": {
          "questionNumber": "Q4 - OCASIÕES",
          "questionText": "Para quais ocasiões você mais compra roupas?",
          "currentQuestion": 4,
          "totalQuestions": 13,
          "progressValue": 24,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-05",
        "content": {
          "options": [
            {
              "id": "5a",
              "text": "Opção A para Q4",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "5a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "5b",
              "text": "Opção B para Q4",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "5b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "5c",
              "text": "Opção C para Q4",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "5c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "5d",
              "text": "Opção D para Q4",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "5d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-06",
      "prevStep": "step-04",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-05-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "5a": {
          "category": "Natural",
          "points": 1
        },
        "5b": {
          "category": "Clássico",
          "points": 2
        },
        "5c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "5d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-06': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-06-question-v3",
      "name": "Q5 - Cores favoritas",
      "description": "Questão 5 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 5,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.723Z",
      "updatedAt": "2025-10-13T00:32:31.723Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-06",
        "content": {
          "questionNumber": "Q5 - CORES FAVORITAS",
          "questionText": "Quais cores mais aparecem no seu guarda-roupa?",
          "currentQuestion": 5,
          "totalQuestions": 13,
          "progressValue": 29,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-06",
        "content": {
          "options": [
            {
              "id": "6a",
              "text": "Opção A para Q5",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "6a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "6b",
              "text": "Opção B para Q5",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "6b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "6c",
              "text": "Opção C para Q5",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "6c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "6d",
              "text": "Opção D para Q5",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "6d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-07",
      "prevStep": "step-05",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-06-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "6a": {
          "category": "Natural",
          "points": 1
        },
        "6b": {
          "category": "Clássico",
          "points": 2
        },
        "6c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "6d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-07': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-07-question-v3",
      "name": "Q6 - Acessórios",
      "description": "Questão 6 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 6,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.723Z",
      "updatedAt": "2025-10-13T00:32:31.723Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-07",
        "content": {
          "questionNumber": "Q6 - ACESSÓRIOS",
          "questionText": "Que tipo de acessórios você mais usa?",
          "currentQuestion": 6,
          "totalQuestions": 13,
          "progressValue": 33,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-07",
        "content": {
          "options": [
            {
              "id": "7a",
              "text": "Opção A para Q6",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "7a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "7b",
              "text": "Opção B para Q6",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "7b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "7c",
              "text": "Opção C para Q6",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "7c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "7d",
              "text": "Opção D para Q6",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "7d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-08",
      "prevStep": "step-06",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-07-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "7a": {
          "category": "Natural",
          "points": 1
        },
        "7b": {
          "category": "Clássico",
          "points": 2
        },
        "7c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "7d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-08': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-08-question-v3",
      "name": "Q7 - Conforto",
      "description": "Questão 7 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 7,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.723Z",
      "updatedAt": "2025-10-13T00:32:31.723Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-08",
        "content": {
          "questionNumber": "Q7 - CONFORTO",
          "questionText": "O que é mais importante para você ao escolher uma roupa?",
          "currentQuestion": 7,
          "totalQuestions": 13,
          "progressValue": 38,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-08",
        "content": {
          "options": [
            {
              "id": "8a",
              "text": "Opção A para Q7",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "8a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "8b",
              "text": "Opção B para Q7",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "8b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "8c",
              "text": "Opção C para Q7",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "8c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "8d",
              "text": "Opção D para Q7",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "8d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-09",
      "prevStep": "step-07",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-08-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "8a": {
          "category": "Natural",
          "points": 1
        },
        "8b": {
          "category": "Clássico",
          "points": 2
        },
        "8c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "8d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-09': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-09-question-v3",
      "name": "Q8 - Inspiração",
      "description": "Questão 8 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 8,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.724Z",
      "updatedAt": "2025-10-13T00:32:31.724Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-09",
        "content": {
          "questionNumber": "Q8 - INSPIRAÇÃO",
          "questionText": "Onde você busca inspiração de moda?",
          "currentQuestion": 8,
          "totalQuestions": 13,
          "progressValue": 43,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-09",
        "content": {
          "options": [
            {
              "id": "9a",
              "text": "Opção A para Q8",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "9a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "9b",
              "text": "Opção B para Q8",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "9b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "9c",
              "text": "Opção C para Q8",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "9c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "9d",
              "text": "Opção D para Q8",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "9d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-10",
      "prevStep": "step-08",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-09-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "9a": {
          "category": "Natural",
          "points": 1
        },
        "9b": {
          "category": "Clássico",
          "points": 2
        },
        "9c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "9d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-10': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-10-question-v3",
      "name": "Q9 - Sapatos",
      "description": "Questão 9 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 9,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.724Z",
      "updatedAt": "2025-10-13T00:32:31.724Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-10",
        "content": {
          "questionNumber": "Q9 - SAPATOS",
          "questionText": "Qual tipo de sapato você mais usa no dia a dia?",
          "currentQuestion": 9,
          "totalQuestions": 13,
          "progressValue": 48,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-10",
        "content": {
          "options": [
            {
              "id": "10a",
              "text": "Opção A para Q9",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "10a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "10b",
              "text": "Opção B para Q9",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "10b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "10c",
              "text": "Opção C para Q9",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "10c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "10d",
              "text": "Opção D para Q9",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "10d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-11",
      "prevStep": "step-09",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-10-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "10a": {
          "category": "Natural",
          "points": 1
        },
        "10b": {
          "category": "Clássico",
          "points": 2
        },
        "10c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "10d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-11': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-11-question-v3",
      "name": "Q10 - Peças-chave",
      "description": "Questão 10 sobre preferências de estilo",
      "category": "quiz-question",
      "tags": [
        "quiz",
        "style",
        "question"
      ],
      "questionNumber": 10,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:32:31.725Z",
      "updatedAt": "2025-10-13T00:32:31.725Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-11",
        "content": {
          "questionNumber": "Q10 - PEÇAS-CHAVE",
          "questionText": "Qual peça você não pode viver sem?",
          "currentQuestion": 10,
          "totalQuestions": 13,
          "progressValue": 52,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-11",
        "content": {
          "options": [
            {
              "id": "11a",
              "text": "Opção A para Q10",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "11a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "11b",
              "text": "Opção B para Q10",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "11b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "11c",
              "text": "Opção C para Q10",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "11c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "11d",
              "text": "Opção D para Q10",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "11d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-12",
      "prevStep": "step-10",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-11-question-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "11a": {
          "category": "Natural",
          "points": 1
        },
        "11b": {
          "category": "Clássico",
          "points": 2
        },
        "11c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "11d": {
          "category": "Elegante",
          "points": 3
        }
      }
    }
  },

  'step-12': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-12-transition-v3",
      "name": "Transição Mid-Quiz",
      "description": "Página de transição no meio do quiz com mensagem motivacional",
      "category": "transition",
      "tags": [
        "quiz",
        "transition",
        "loading",
        "mid-quiz"
      ],
      "createdAt": "2025-01-13T00:00:00.000Z",
      "updatedAt": "2025-01-13T00:00:00.000Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "transition-hero",
        "id": "transition-hero-12",
        "content": {
          "title": "Analisando suas respostas...",
          "subtitle": "Estamos montando seu perfil de estilo personalizado",
          "message": "Continue para descobrir ainda mais sobre seu estilo único!",
          "autoAdvanceDelay": 3000
        },
        "style": {
          "backgroundColor": "#FAF9F7",
          "textColor": "#432818",
          "padding": 32
        },
        "animation": {
          "type": "scale",
          "duration": 500,
          "delay": 0,
          "easing": "ease-out"
        }
      }
    ],
    "navigation": {
      "nextStep": "step-13",
      "prevStep": "step-11",
      "allowBack": false,
      "requiresUserInput": false,
      "autoAdvance": true,
      "autoAdvanceDelay": 3000
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "auto_advance"
      ],
      "trackingId": "step-12-transition-v3",
      "fbPixelId": null,
      "gaTrackingId": null
    }
  },

  'step-13': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-13-strategic-v3",
      "name": "Q11 - Objetivos (Estratégica)",
      "description": "Questão estratégica 1 sobre objetivos e resultados",
      "category": "strategic-question",
      "tags": [
        "quiz",
        "style",
        "strategic",
        "goals"
      ],
      "questionNumber": 11,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:33:47.492Z",
      "updatedAt": "2025-10-13T00:33:47.492Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-13",
        "content": {
          "questionNumber": "Q11 - OBJETIVOS",
          "questionText": "Qual é o seu principal objetivo com seu guarda-roupa?",
          "currentQuestion": 11,
          "totalQuestions": 13,
          "progressValue": 57,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-13",
        "content": {
          "options": [
            {
              "id": "13a",
              "text": "Opção A para Q11",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "13a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "13b",
              "text": "Opção B para Q11",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "13b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "13c",
              "text": "Opção C para Q11",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "13c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "13d",
              "text": "Opção D para Q11",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "13d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-14",
      "prevStep": "step-12",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-13-strategic-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "13a": {
          "category": "Natural",
          "points": 1
        },
        "13b": {
          "category": "Clássico",
          "points": 2
        },
        "13c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "13d": {
          "category": "Elegante",
          "points": 3
        }
      }
    },
    "strategic": {
      "isStrategic": true,
      "weight": 1.5,
      "impactsOffer": false
    }
  },

  'step-14': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-14-strategic-v3",
      "name": "Q12 - Desafios (Estratégica)",
      "description": "Questão estratégica 2 sobre objetivos e resultados",
      "category": "strategic-question",
      "tags": [
        "quiz",
        "style",
        "strategic",
        "goals"
      ],
      "questionNumber": 12,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:33:47.497Z",
      "updatedAt": "2025-10-13T00:33:47.497Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-14",
        "content": {
          "questionNumber": "Q12 - DESAFIOS",
          "questionText": "Qual é o seu maior desafio ao se vestir?",
          "currentQuestion": 12,
          "totalQuestions": 13,
          "progressValue": 62,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-14",
        "content": {
          "options": [
            {
              "id": "14a",
              "text": "Opção A para Q12",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "14a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "14b",
              "text": "Opção B para Q12",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "14b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "14c",
              "text": "Opção C para Q12",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "14c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "14d",
              "text": "Opção D para Q12",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "14d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-15",
      "prevStep": "step-13",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-14-strategic-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "14a": {
          "category": "Natural",
          "points": 1
        },
        "14b": {
          "category": "Clássico",
          "points": 2
        },
        "14c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "14d": {
          "category": "Elegante",
          "points": 3
        }
      }
    },
    "strategic": {
      "isStrategic": true,
      "weight": 1.5,
      "impactsOffer": false
    }
  },

  'step-15': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-15-strategic-v3",
      "name": "Q13 - Prioridades (Estratégica)",
      "description": "Questão estratégica 3 sobre objetivos e resultados",
      "category": "strategic-question",
      "tags": [
        "quiz",
        "style",
        "strategic",
        "goals"
      ],
      "questionNumber": 13,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:33:47.497Z",
      "updatedAt": "2025-10-13T00:33:47.497Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-15",
        "content": {
          "questionNumber": "Q13 - PRIORIDADES",
          "questionText": "O que você prioriza ao escolher uma roupa?",
          "currentQuestion": 13,
          "totalQuestions": 13,
          "progressValue": 67,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-15",
        "content": {
          "options": [
            {
              "id": "15a",
              "text": "Opção A para Q13",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "15a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "15b",
              "text": "Opção B para Q13",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "15b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "15c",
              "text": "Opção C para Q13",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "15c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "15d",
              "text": "Opção D para Q13",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "15d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-16",
      "prevStep": "step-14",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-15-strategic-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "15a": {
          "category": "Natural",
          "points": 1
        },
        "15b": {
          "category": "Clássico",
          "points": 2
        },
        "15c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "15d": {
          "category": "Elegante",
          "points": 3
        }
      }
    },
    "strategic": {
      "isStrategic": true,
      "weight": 1.5,
      "impactsOffer": false
    }
  },

  'step-16': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-16-strategic-v3",
      "name": "Q14 - Investimento (Estratégica)",
      "description": "Questão estratégica 4 sobre objetivos e resultados",
      "category": "strategic-question",
      "tags": [
        "quiz",
        "style",
        "strategic",
        "goals"
      ],
      "questionNumber": 14,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:33:47.498Z",
      "updatedAt": "2025-10-13T00:33:47.498Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-16",
        "content": {
          "questionNumber": "Q14 - INVESTIMENTO",
          "questionText": "Onde você prefere investir mais?",
          "currentQuestion": 14,
          "totalQuestions": 13,
          "progressValue": 71,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-16",
        "content": {
          "options": [
            {
              "id": "16a",
              "text": "Opção A para Q14",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "16a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "16b",
              "text": "Opção B para Q14",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "16b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "16c",
              "text": "Opção C para Q14",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "16c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "16d",
              "text": "Opção D para Q14",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "16d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-17",
      "prevStep": "step-15",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-16-strategic-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "16a": {
          "category": "Natural",
          "points": 1
        },
        "16b": {
          "category": "Clássico",
          "points": 2
        },
        "16c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "16d": {
          "category": "Elegante",
          "points": 3
        }
      }
    },
    "strategic": {
      "isStrategic": true,
      "weight": 1.5,
      "impactsOffer": false
    }
  },

  'step-17': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-17-strategic-v3",
      "name": "Q15 - Transformação (Estratégica)",
      "description": "Questão estratégica 5 sobre objetivos e resultados",
      "category": "strategic-question",
      "tags": [
        "quiz",
        "style",
        "strategic",
        "goals"
      ],
      "questionNumber": 15,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:33:47.498Z",
      "updatedAt": "2025-10-13T00:33:47.498Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-17",
        "content": {
          "questionNumber": "Q15 - TRANSFORMAÇÃO",
          "questionText": "O que você mais gostaria de mudar?",
          "currentQuestion": 15,
          "totalQuestions": 13,
          "progressValue": 76,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-17",
        "content": {
          "options": [
            {
              "id": "17a",
              "text": "Opção A para Q15",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "17a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "17b",
              "text": "Opção B para Q15",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "17b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "17c",
              "text": "Opção C para Q15",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "17c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "17d",
              "text": "Opção D para Q15",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "17d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-18",
      "prevStep": "step-16",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-17-strategic-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "17a": {
          "category": "Natural",
          "points": 1
        },
        "17b": {
          "category": "Clássico",
          "points": 2
        },
        "17c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "17d": {
          "category": "Elegante",
          "points": 3
        }
      }
    },
    "strategic": {
      "isStrategic": true,
      "weight": 1.5,
      "impactsOffer": false
    }
  },

  'step-18': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-18-strategic-v3",
      "name": "Q16 - Resultado (Estratégica)",
      "description": "Questão estratégica 6 sobre objetivos e resultados",
      "category": "strategic-question",
      "tags": [
        "quiz",
        "style",
        "strategic",
        "goals"
      ],
      "questionNumber": 16,
      "totalQuestions": 13,
      "createdAt": "2025-10-13T00:33:47.498Z",
      "updatedAt": "2025-10-13T00:33:47.498Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB",
        "selected": "#B89B7A",
        "hover": "#F3E8D3"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "question-hero",
        "id": "question-hero-18",
        "content": {
          "questionNumber": "Q16 - RESULTADO",
          "questionText": "Qual resultado você mais gostaria de alcançar?",
          "currentQuestion": 16,
          "totalQuestions": 13,
          "progressValue": 81,
          "showProgress": true,
          "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "logoAlt": "Logo Gisele Galvão"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-18",
        "content": {
          "options": [
            {
              "id": "18a",
              "text": "Opção A para Q16",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "18a",
              "category": "Natural",
              "points": 1
            },
            {
              "id": "18b",
              "text": "Opção B para Q16",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "18b",
              "category": "Clássico",
              "points": 2
            },
            {
              "id": "18c",
              "text": "Opção C para Q16",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "18c",
              "category": "Contemporâneo",
              "points": 2
            },
            {
              "id": "18d",
              "text": "Opção D para Q16",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "18d",
              "category": "Elegante",
              "points": 3
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 100,
          "easing": "ease-out"
        }
      }
    ],
    "validation": {
      "required": [
        "selectedOptions"
      ],
      "rules": {
        "selectedOptions": {
          "minItems": 3,
          "maxItems": 3,
          "errorMessage": "Por favor, selecione exatamente 3 opções"
        }
      }
    },
    "navigation": {
      "nextStep": "step-19",
      "prevStep": "step-17",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": true,
      "autoAdvanceDelay": 1500
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "option_selected",
        "validation_error",
        "completion"
      ],
      "trackingId": "step-18-strategic-v3"
    },
    "scoring": {
      "method": "points",
      "categories": [
        "Natural",
        "Clássico",
        "Contemporâneo",
        "Elegante"
      ],
      "options": {
        "18a": {
          "category": "Natural",
          "points": 1
        },
        "18b": {
          "category": "Clássico",
          "points": 2
        },
        "18c": {
          "category": "Contemporâneo",
          "points": 2
        },
        "18d": {
          "category": "Elegante",
          "points": 3
        }
      }
    },
    "strategic": {
      "isStrategic": true,
      "weight": 1.5,
      "impactsOffer": true
    }
  },

  'step-19': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-19-transition-v3",
      "name": "Transição Pré-Resultado",
      "description": "Página de transição antes da exibição do resultado final",
      "category": "transition-result",
      "tags": [
        "quiz",
        "transition",
        "loading",
        "result",
        "pre-result"
      ],
      "createdAt": "2025-01-13T00:00:00.000Z",
      "updatedAt": "2025-01-13T00:00:00.000Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "transition-hero",
        "id": "transition-hero-19",
        "content": {
          "title": "Calculando seu estilo predominante...",
          "subtitle": "Preparando seu resultado personalizado",
          "message": "Em instantes você descobrirá qual estilo te representa e como valorizar sua essência!",
          "autoAdvanceDelay": 3000
        },
        "style": {
          "backgroundColor": "#FAF9F7",
          "textColor": "#432818",
          "padding": 32
        },
        "animation": {
          "type": "scale",
          "duration": 500,
          "delay": 0,
          "easing": "ease-out"
        }
      }
    ],
    "navigation": {
      "nextStep": "step-20",
      "prevStep": "step-18",
      "allowBack": false,
      "requiresUserInput": false,
      "autoAdvance": true,
      "autoAdvanceDelay": 3000
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "auto_advance",
        "result_preview"
      ],
      "trackingId": "step-19-transition-v3",
      "fbPixelId": null,
      "gaTrackingId": null
    }
  },

  'step-20': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-20-hybrid",
      "name": "Resultado com Cálculos + Visual Moderno",
      "description": "Híbrido: lógica v.2 + visual v.3",
      "category": "quiz-result",
      "tags": [
        "quiz",
        "style",
        "result",
        "offer",
        "conversion"
      ],
      "createdAt": "2025-10-11T10:44:14.174Z",
      "updatedAt": "2025-10-11T23:30:00.000Z",
      "author": "Gisele Galvão - Branding & Imagem Pessoal",
      "mergedAt": "2025-10-15T14:38:32.847Z"
    },
    "offer": {
      "productName": "5 Passos – Vista-se de Você",
      "mentor": "Gisele Galvão",
      "mentorTitle": "Consultora de Imagem e Branding Pessoal",
      "description": "Uma metodologia de autoconhecimento, imagem estratégica e transformação pessoal, criada para te guiar da confusão diante do espelho à clareza de uma imagem que comunica quem você realmente é.",
      "pricing": {
        "originalPrice": 447,
        "salePrice": 97,
        "currency": "BRL",
        "installments": {
          "count": 8,
          "value": 14.11
        },
        "discount": {
          "percentage": 78,
          "label": "78% de desconto"
        }
      },
      "links": {
        "checkout": "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
        "salesPage": null
      },
      "guarantee": {
        "days": 7,
        "description": "Se não fizer sentido pra você, o reembolso é simples e sem perguntas."
      },
      "features": {
        "totalLessons": 31,
        "accessType": "Acesso imediato",
        "format": "Online"
      }
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "secondary": "#432818",
        "background": "#fffaf7",
        "text": "#432818",
        "accent": "#a08966",
        "success": "#2d5f3f",
        "warning": "#d97706"
      },
      "fonts": {
        "heading": "Playfair Display",
        "body": "Inter",
        "fallback": "system-ui, -apple-system, sans-serif"
      },
      "spacing": {
        "section": "3rem",
        "block": "1.5rem"
      },
      "borderRadius": {
        "small": "0.5rem",
        "medium": "0.75rem",
        "large": "1rem"
      }
    },
    "layout": {
      "containerWidth": "full",
      "maxWidth": "1280px",
      "spacing": "comfortable",
      "backgroundColor": "#fffaf7",
      "responsive": true,
      "supportsCalculation": true,
      "calculationMode": "server_side"
    },
    "sections": [
      {
        "id": "result-calculation",
        "type": "ResultCalculationSection",
        "enabled": true,
        "order": 0,
        "title": "Processamento de Resultados",
        "props": {
          "calculationMethod": "weighted_sum",
          "scoreMapping": {
            "romantico": {
              "min": 0,
              "max": 100,
              "label": "Romântico"
            },
            "classico": {
              "min": 0,
              "max": 100,
              "label": "Clássico"
            },
            "moderno": {
              "min": 0,
              "max": 100,
              "label": "Moderno"
            },
            "criativo": {
              "min": 0,
              "max": 100,
              "label": "Criativo"
            },
            "dramatico": {
              "min": 0,
              "max": 100,
              "label": "Dramático"
            }
          },
          "resultLogic": {
            "winnerSelection": "highest_score",
            "tieBreaker": "secondary_scores",
            "minThreshold": 20
          },
          "leadCapture": {
            "id": "step20-form",
            "type": "lead-form",
            "position": 2,
            "properties": {
              "fields": [
                "name",
                "email",
                "phone"
              ],
              "submitText": "Receber Guia Gratuito",
              "containerWidth": "full",
              "spacing": "small"
            }
          }
        }
      },
      {
        "id": "hero",
        "type": "HeroSection",
        "enabled": true,
        "order": 2,
        "title": "Comemoração e Apresentação do Estilo",
        "props": {
          "showCelebration": true,
          "celebrationEmoji": "🎉",
          "celebrationAnimation": "bounce",
          "greetingFormat": "Olá, {userName}!",
          "titleFormat": "Seu Estilo Predominante é:",
          "styleNameDisplay": "{styleName}",
          "colors": {
            "greeting": "text",
            "greetingHighlight": "primary",
            "title": "secondary",
            "styleName": "primary"
          },
          "spacing": {
            "padding": "3rem 1.5rem",
            "marginBottom": "2.5rem"
          }
        }
      },
      {
        "id": "style-profile",
        "type": "StyleProfileSection",
        "enabled": true,
        "order": 3,
        "title": "Perfil Completo de Estilo",
        "props": {
          "layout": "two-column",
          "imagePosition": "left",
          "showStyleImage": true,
          "styleImage": {
            "aspectRatio": "4/5",
            "showDecorations": true,
            "decorationColor": "primary",
            "fallbackEnabled": true
          },
          "showIntroText": true,
          "introText": {
            "enabled": true,
            "text": "Esse é o estilo que mais traduz a sua essência. Ele revela muito sobre como você se conecta com o mundo e a forma como expressa sua energia.",
            "style": "italic",
            "background": "primary/5",
            "borderLeft": true
          },
          "showDescription": true,
          "showTransitionText": true,
          "transitionText": "Mas lembre-se: você não é só um estilo.",
          "showProgressBars": true,
          "progressBars": {
            "topCount": 3,
            "showPercentage": true,
            "percentageFormat": "{percentage}%",
            "animationDelay": 200,
            "colors": {
              "primary": "primary to accent",
              "secondary": "primary/80 to accent/80",
              "tertiary": "primary/60 to accent/60"
            },
            "titleFormat": "Além do {primaryStyle}, você também tem traços de:"
          },
          "showKeywords": true,
          "keywords": {
            "title": "Palavras que te definem:",
            "tagColor": "primary",
            "tagStyle": "rounded-full"
          },
          "showPersuasiveQuestions": true,
          "persuasiveQuestions": {
            "title": "💭 Você já se perguntou...",
            "icon": "❓",
            "style": "italic",
            "background": "primary/5",
            "border": "primary/30"
          },
          "showClosingMessage": true,
          "closingMessage": {
            "text": "✨ É a mistura desses elementos que torna a sua imagem única.",
            "style": "italic",
            "fontWeight": "medium",
            "background": "gradient primary/10 to accent/10",
            "textAlign": "center"
          },
          "showGuideImage": true,
          "guideImage": {
            "position": "below",
            "aspectRatio": "4/5",
            "maxWidth": "28rem",
            "centered": true
          }
        }
      },
      {
        "id": "cta-primary",
        "type": "CTAButton",
        "enabled": true,
        "order": 4,
        "title": "CTA Principal (Após Perguntas Persuasivas)",
        "props": {
          "text": "Quero Dominar Meu Estilo em 5 Passos",
          "icon": "ShoppingCart",
          "iconAnimation": "bounce-on-hover",
          "style": "gradient",
          "colors": {
            "from": "primary",
            "to": "accent"
          },
          "size": "large",
          "fullWidthMobile": true,
          "position": "after-questions",
          "showTransition": true,
          "transition": {
            "title": "💡 Decodifique sua Imagem de Sucesso em 5 Passos",
            "subtitle": "Método completo: Autoconhecimento + estratégia visual 👇",
            "background": "gradient primary/10 to accent/10",
            "border": "primary/20"
          },
          "analytics": {
            "eventName": "cta_primary_click",
            "category": "conversion",
            "label": "after_questions"
          }
        }
      },
      {
        "id": "transformation",
        "type": "TransformationSection",
        "enabled": true,
        "order": 5,
        "title": "Transformação e Valor",
        "props": {
          "mainTitle": "Transforme Sua Imagem, Revele Sua Essência",
          "highlightWords": [
            "Revele Sua Essência"
          ],
          "highlightColor": "primary",
          "subtitle": "Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser.",
          "layout": "grid-2x2",
          "benefits": [
            {
              "icon": "🎯",
              "text": "Clareza de estilo para se vestir com facilidade todos os dias"
            },
            {
              "icon": "🎨",
              "text": "Cores e formas que comunicam quem você é e o que você quer"
            },
            {
              "icon": "💼",
              "text": "Imagem que chega primeiro: autoridade sem perder autenticidade"
            },
            {
              "icon": "👗",
              "text": "Guarda-roupa estratégico que conversa entre si"
            }
          ],
          "benefitStyle": {
            "background": "primary/5",
            "iconSize": "2xl",
            "textAlign": "left",
            "padding": "1rem"
          }
        }
      },
      {
        "id": "method-steps",
        "type": "MethodStepsSection",
        "enabled": true,
        "order": 6,
        "title": "O Método 5 Passos",
        "props": {
          "sectionTitle": "O que você vai aprender no Método 5 Passos",
          "steps": [
            {
              "number": 1,
              "icon": "🪞",
              "title": "Passo 1 — Estilo de Ser",
              "description": "Descubra seus 3 estilos predominantes e entenda como traduzir sua personalidade no vestir. Você vai aprender a reconhecer o que te representa e como alinhar sua imagem à sua essência — sem regras, apenas consciência."
            },
            {
              "number": 2,
              "icon": "🎨",
              "title": "Passo 2 — Cores",
              "description": "As cores são uma linguagem emocional. Você vai aprender como escolher tons que valorizam sua beleza natural, comunicar autoridade, leveza ou proximidade — e criar harmonia entre cor, textura e intenção."
            },
            {
              "number": 3,
              "icon": "🧍‍♀️",
              "title": "Passo 3 — Biotipo",
              "description": "Entenda as linhas e proporções do seu corpo e como se vestir para equilibrar formas, valorizar o que ama e acolher o que deseja transformar. Um olhar sem crítica, com amor e propósito."
            },
            {
              "number": 4,
              "icon": "🧹",
              "title": "Passo 4 — Detox do Guarda-Roupa",
              "description": "Um processo de autoconhecimento através do desapego. Você vai aprender a manter apenas o que faz sentido, o que representa a mulher que você é hoje — criando um espaço leve, organizado e inspirador."
            },
            {
              "number": 5,
              "icon": "👗",
              "title": "Passo 5 — Guarda-Roupa de Sucesso",
              "description": "O encerramento prático do método. Aqui você aprende a montar um guarda-roupa funcional e inteligente, com peças-chave, terceira peça, combinações rápidas e looks que comunicam confiança e autenticidade todos os dias."
            }
          ],
          "stepStyle": {
            "layout": "card",
            "background": "white",
            "border": "primary/20",
            "padding": "1.5rem",
            "iconColor": "primary",
            "titleColor": "secondary",
            "descriptionColor": "text"
          }
        }
      },
      {
        "id": "bonus",
        "type": "BonusSection",
        "enabled": true,
        "order": 7,
        "title": "Bônus Exclusivos",
        "props": {
          "sectionTitle": "💎 Bônus Exclusivos",
          "items": [
            {
              "title": "Guia de Visagismo Facial (PDF)",
              "description": "Descubra os melhores cortes, cores e acessórios para realçar seu rosto.",
              "icon": "📄",
              "image": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp"
            },
            {
              "title": "Peças-Chave do Guarda-Roupa de Sucesso (PDF)",
              "description": "Lista completa e adaptável ao seu estilo.",
              "icon": "📄",
              "image": "https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Detox_Guarda-roupa_fnjehu.jpg"
            },
            {
              "title": "Inventário do Guarda-Roupa (Planilha)",
              "description": "Para manter tudo prático, leve e funcional.",
              "icon": "📊",
              "image": "https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Invent%C3%A1rio_do_Guada-Roupa_m92ilf.jpg"
            }
          ],
          "layout": "grid-3",
          "cardStyle": {
            "background": "primary/5",
            "border": "primary/20",
            "padding": "1.5rem"
          }
        }
      },
      {
        "id": "social-proof",
        "type": "SocialProofSection",
        "enabled": true,
        "order": 8,
        "title": "Transformações Reais",
        "props": {
          "sectionTitle": "Veja os Resultados de Quem Já Transformou Sua Imagem",
          "layout": "grid-3",
          "testimonials": [
            {
              "name": "Maria Silva",
              "role": "Advogada",
              "text": "Finalmente descobri como me vestir com elegância e profissionalismo. Meu guarda-roupa nunca fez tanto sentido!",
              "rating": 5,
              "image": null,
              "verified": true
            },
            {
              "name": "Ana Costa",
              "role": "Empresária",
              "text": "O método me ajudou a encontrar meu estilo pessoal. Agora me sinto confiante em qualquer ocasião.",
              "rating": 5,
              "image": null,
              "verified": true
            },
            {
              "name": "Julia Santos",
              "role": "Designer",
              "text": "Economizei muito dinheiro parando de comprar peças que não combinam comigo. Recomendo!",
              "rating": 5,
              "image": null,
              "verified": true
            }
          ],
          "cardStyle": {
            "background": "primary/5",
            "padding": "1.5rem",
            "showStars": true,
            "starColor": "primary"
          }
        }
      },
      {
        "id": "offer",
        "type": "OfferSection",
        "enabled": true,
        "order": 9,
        "title": "Oferta Principal",
        "props": {
          "layout": "centered-card",
          "maxWidth": "42rem",
          "showUrgency": false,
          "pricing": {
            "showOriginalPrice": true,
            "originalPrice": 447,
            "salePrice": 97,
            "installments": {
              "show": true,
              "count": 8,
              "value": 14.11
            },
            "discount": {
              "show": true,
              "percentage": 78,
              "label": "78% de desconto",
              "style": "badge",
              "color": "success"
            }
          },
          "includes": {
            "title": "O Que Você Recebe Hoje",
            "items": [
              {
                "icon": "✅",
                "text": "Acesso imediato às 31 aulas",
                "highlight": false
              },
              {
                "icon": "✅",
                "text": "Método completo 5 Passos",
                "highlight": true
              },
              {
                "icon": "✅",
                "text": "3 Bônus Exclusivos (PDFs + Planilha)",
                "highlight": false
              },
              {
                "icon": "✅",
                "text": "Garantia de 7 dias",
                "highlight": false
              }
            ]
          },
          "background": {
            "type": "gradient",
            "from": "primary/10",
            "to": "accent/5"
          }
        }
      },
      {
        "id": "cta-secondary",
        "type": "CTAButton",
        "enabled": true,
        "order": 10,
        "title": "CTA Secundário (Após Oferta)",
        "props": {
          "text": "Começar Minha Transformação Agora",
          "icon": "ShoppingCart",
          "iconAnimation": "bounce-on-hover",
          "style": "gradient",
          "colors": {
            "from": "primary",
            "to": "accent"
          },
          "size": "xlarge",
          "fullWidthMobile": true,
          "showTransition": false,
          "analytics": {
            "eventName": "cta_secondary_click",
            "category": "conversion",
            "label": "after_offer"
          }
        }
      },
      {
        "id": "guarantee",
        "type": "GuaranteeSection",
        "enabled": true,
        "order": 11,
        "title": "Garantia",
        "props": {
          "days": 7,
          "icon": "🕊️",
          "title": "Garantia de Satisfação Total",
          "description": "Você tem 7 dias para experimentar o método. Se não fizer sentido pra você, o reembolso é simples e sem perguntas.",
          "badgeText": "Compra 100% Segura",
          "background": {
            "type": "solid",
            "color": "primary/5"
          },
          "border": {
            "show": true,
            "color": "primary/20"
          },
          "layout": "centered",
          "iconSize": "3xl"
        }
      },
      {
        "id": "cta-final",
        "type": "CTAButton",
        "enabled": true,
        "order": 12,
        "title": "CTA Final (Após Garantia)",
        "props": {
          "text": "Garantir Minha Vaga com 7 Dias de Garantia",
          "icon": "ShoppingCart",
          "iconAnimation": "bounce-on-hover",
          "style": "gradient",
          "colors": {
            "from": "primary",
            "to": "accent"
          },
          "size": "large",
          "fullWidthMobile": true,
          "showTransition": false,
          "analytics": {
            "eventName": "cta_final_click",
            "category": "conversion",
            "label": "after_guarantee"
          }
        }
      }
    ],
    "validation": {
      "required": [
        "userName",
        "styleName",
        "scores",
        "calculatedResult"
      ],
      "minAnswers": 1,
      "maxAnswers": 3,
      "validationMessage": "Selecione pelo menos uma opção!"
    },
    "analytics": {
      "events": [
        "page_view",
        "option_selected",
        "validation_error",
        "completion",
        "page_view",
        "step_completed",
        "cta_primary_click",
        "cta_secondary_click",
        "cta_final_click",
        "section_viewed",
        "offer_viewed"
      ],
      "trackingId": "step-20-hybrid"
    }
  },

  'step-21': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-21-offer-v3",
      "name": "Oferta Final - 5 Passos Vista-se de Você",
      "description": "Página de oferta final do produto após resultado do quiz",
      "category": "offer",
      "tags": [
        "quiz",
        "offer",
        "conversion",
        "product",
        "cta"
      ],
      "createdAt": "2025-01-13T00:00:00.000Z",
      "updatedAt": "2025-01-13T00:00:00.000Z",
      "author": "Quiz Flow Pro",
      "version": "3.0.0"
    },
    "offer": {
      "productName": "5 Passos – Vista-se de Você",
      "mentorName": "Gisele Galvão",
      "pricing": {
        "originalPrice": 447,
        "salePrice": 97,
        "currency": "R$",
        "installments": {
          "count": 8,
          "value": 14.11
        }
      },
      "links": {
        "checkout": "https://pay.kiwify.com.br/DkYC1Aj",
        "sales": "https://giselegaviao.com/5passos"
      },
      "guarantee": {
        "days": 7,
        "description": "Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do seu investimento."
      },
      "features": [
        "5 módulos completos sobre estilo pessoal",
        "Acesso vitalício ao conteúdo",
        "Suporte direto com Gisele Galvão",
        "Materiais bônus exclusivos",
        "Comunidade privada de alunas",
        "Certificado de conclusão"
      ]
    },
    "theme": {
      "colors": {
        "primary": "#B89B7A",
        "primaryHover": "#A68B6A",
        "primaryLight": "#F3E8D3",
        "secondary": "#432818",
        "background": "#FAF9F7",
        "text": "#1F2937",
        "border": "#E5E7EB"
      },
      "fonts": {
        "heading": "Playfair Display, serif",
        "body": "Inter, sans-serif"
      },
      "spacing": {
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12,
        "xl": 16
      }
    },
    "sections": [
      {
        "type": "offer-hero",
        "id": "offer-hero-21",
        "content": {
          "title": "{userName}, Transforme Seu Guarda-Roupa e Sua Confiança Hoje!",
          "subtitle": "Oferta exclusiva para quem completou o quiz de estilo",
          "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
          "imageAlt": "5 Passos - Vista-se de Você",
          "description": "Descubra como valorizar seu estilo único e se sentir confiante em qualquer ocasião com o método exclusivo 5 Passos.",
          "urgencyMessage": "Oferta por tempo limitado!"
        },
        "style": {
          "backgroundColor": "#FAF9F7",
          "textColor": "#432818",
          "padding": 24
        },
        "animation": {
          "type": "scale",
          "duration": 500,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "pricing",
        "id": "pricing-21",
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
          "subtitle": "Desconto exclusivo para participantes do quiz",
          "ctaText": "Quero Transformar Meu Estilo Agora!",
          "ctaUrl": "https://pay.kiwify.com.br/DkYC1Aj",
          "features": [
            "✓ 5 módulos completos sobre estilo pessoal",
            "✓ Acesso vitalício ao conteúdo",
            "✓ Suporte direto com Gisele Galvão",
            "✓ Materiais bônus exclusivos",
            "✓ Comunidade privada de alunas",
            "✓ Certificado de conclusão",
            "✓ Garantia de 7 dias"
          ]
        },
        "style": {
          "backgroundColor": "#FFFFFF",
          "padding": 24
        },
        "animation": {
          "type": "slideUp",
          "duration": 500,
          "delay": 200,
          "easing": "ease-out"
        }
      }
    ],
    "navigation": {
      "nextStep": null,
      "prevStep": "step-20",
      "allowBack": true,
      "requiresUserInput": false,
      "autoAdvance": false
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view",
        "cta_click",
        "offer_viewed"
      ],
      "trackingId": "step-21-offer-v3",
      "fbPixelId": null,
      "gaTrackingId": null,
      "conversionEvents": [
        {
          "event": "ViewContent",
          "params": {
            "content_name": "5 Passos Vista-se de Você",
            "content_category": "Offer",
            "value": 97,
            "currency": "BRL"
          }
        }
      ]
    },
    "seo": {
      "title": "Oferta Exclusiva - 5 Passos Vista-se de Você",
      "description": "Transforme seu guarda-roupa e sua confiança com o método exclusivo 5 Passos. Oferta especial para participantes do quiz.",
      "keywords": [
        "consultoria de estilo",
        "guarda-roupa",
        "transformação pessoal",
        "moda feminina",
        "estilo pessoal"
      ]
    }
  },
};

// 📋 ALIAS para compatibilidade com código legado
export const QUIZ_QUESTIONS_COMPLETE = QUIZ_STYLE_21_STEPS_TEMPLATE;


// 🔧 SCHEMA DE PERSISTÊNCIA (preservado do arquivo original)
export const FUNNEL_PERSISTENCE_SCHEMA = {
  // Metadados básicos
  id: 'quiz21StepsComplete',
  name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
  description: 'Template completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e ofertas.',
  version: '2.0.0',
  category: 'quiz',
  templateType: 'quiz-complete',

  // Configurações de persistência  
  persistence: {
    enabled: true,
    storage: ['localStorage', 'supabase', 'session'] as const,
    autoSave: true,
    autoSaveInterval: 30000, // 30 segundos
    compression: true,
    encryption: false,
    backupEnabled: true,
    lazyLoading: true, // ✨ NOVO: Carregamento sob demanda
    cacheEnabled: true, // ✨ NOVO: Cache inteligente

    // Estrutura de dados para armazenamento
    dataStructure: {
      funnel_data: {
        id: 'string',
        name: 'string',
        description: 'string',
        category: 'string',
        user_id: 'string?',
        is_published: 'boolean',
        created_at: 'timestamp',
        updated_at: 'timestamp',

        // Dados do funil
        settings: 'FunnelSettings',
        steps: 'FunnelStep[]',
        blocks: 'Block[]',
        metadata: 'FunnelMetadata',

        // Dados da sessão do usuário
        user_session: {
          userName: 'string',
          email: 'string?',
          phone: 'string?',
          startedAt: 'timestamp',
          completedAt: 'timestamp?',
          currentStep: 'number',
          progress: 'number',

          // Respostas do quiz
          quiz_answers: {
            question_id: 'string',
            selected_options: 'string[]',
            scores: 'Record<string, number>',
            timestamp: 'timestamp'
          },

          // Respostas estratégicas
          strategic_answers: {
            question_id: 'string',
            answer: 'string',
            timestamp: 'timestamp'
          },

          // Resultado final
          result: {
            primary_style: 'string',
            secondary_styles: 'string[]',
            total_score: 'number',
            style_scores: 'Record<string, number>',
            personalized_recommendations: 'string[]'
          }
        }
      }
    }
  },

  // Configurações de analytics e tracking
  analytics: {
    enabled: true,
    realTime: true,
    trackingId: 'GA4-XXXXXXXXX', // Para ser configurado

    // Eventos personalizados
    events: [
      'funnel_started',
      'step_completed',
      'quiz_question_answered',
      'strategic_question_answered',
      'result_calculated',
      'offer_viewed',
      'conversion_completed',
      'user_drop_off',
      'session_timeout'
    ],

    // Métricas de performance
    performance: {
      trackPageLoad: true,
      trackInteractions: true,
      trackScrollDepth: true,
      trackTimeOnStep: true,
      trackCompletionRate: true
    },

    // Configurações de heatmap e session recording
    heatmap: {
      enabled: true,
      hotjarId: '1234567', // Para ser configurado
      recordSessions: true,
      trackClicks: true,
      trackScrolls: true
    }
  }
};

// 🔧 CONFIGURAÇÃO GLOBAL (preservada do arquivo original)
export const QUIZ_GLOBAL_CONFIG = {
  // SEO Configuration - Otimizada para conversão
  seo: {
    title: 'Descubra Seu Estilo Pessoal - Quiz Interativo | Gisele Galvão',
    description: 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança. Consultoria de imagem profissional.',
    keywords: 'estilo pessoal, consultoria de imagem, quiz de estilo, moda feminina, guarda-roupa, personal stylist, Gisele Galvão, quiz interativo, descobrir estilo, transformação visual',

    // Open Graph otimizado para redes sociais
    ogTitle: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
    ogDescription: 'Faça nosso quiz personalizado e descubra qual é o seu estilo predominante. Transforme seu guarda-roupa e se vista com mais confiança.',
    ogImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/og-image-style-quiz-gisele.webp',
    ogType: 'website',
    ogLocale: 'pt_BR',

    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterTitle: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
    twitterDescription: 'Faça nosso quiz personalizado e descubra qual é o seu estilo predominante.',
    twitterImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/og-image-style-quiz-gisele.webp',
    twitterSite: '@giselegaalvao',

    // Meta tags técnicas
    favicon: '/favicon.ico',
    canonicalUrl: 'https://quiz-sell-genius.com/',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    themeColor: '#B89B7A',

    // Structured Data (JSON-LD) para SEO
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Quiz de Estilo Pessoal',
      description: 'Descubra seu estilo predominante através de perguntas personalizadas',
      author: {
        '@type': 'Person',
        name: 'Gisele Galvão',
        url: 'https://giselegaalvao.com'
      },
      provider: {
        '@type': 'Organization',
        name: 'Gisele Galvão - Consultoria de Imagem',
        url: 'https://giselegaalvao.com'
      }
    },

    customMetaTags: `
      <meta name="author" content="Gisele Galvão">
      <meta name="robots" content="index, follow">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="theme-color" content="#B89B7A">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="default">
      <meta name="format-detection" content="telephone=no">
      <link rel="canonical" href="https://quiz-sell-genius.com/">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://www.google-analytics.com">
      <link rel="prefetch" href="https://res.cloudinary.com/dqljyf76t/">
    `
  },

  // Domain & Hosting - Configuração completa de domínios
  domain: {
    primaryDomain: 'quiz-sell-genius.com',
    customDomains: [
      'quiz-descubra-seu-estilo.com',
      'estilopessoal.gisele.com',
      'quiz.giselegaalvao.com'
    ],
    ssl: true,
    enforceHTTPS: true,

    // Configurações de CDN
    cdn: {
      enabled: true,
      provider: 'cloudflare',
      regions: ['US', 'BR', 'EU'],
      cacheSettings: {
        static: '30d',
        dynamic: '1h',
        api: '5m'
      }
    },

    // Redirecionamentos
    redirects: `
      /quiz -> /
      /estilo -> /
      /descobrir-estilo -> /
      /quiz-style -> /
      /style-quiz -> /
      /consultoria -> /resultado
    `,

    // Configurações de CORS
    cors: {
      allowedOrigins: ['https://giselegaalvao.com', 'https://quiz-sell-genius.com'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },

  // Tracking & Analytics - Configuração completa de rastreamento
  tracking: {
    // Google Analytics 4
    googleAnalytics: {
      measurementId: 'GA4-XXXXXXXXX', // Para ser configurado
      enhanced: true,
      demographics: true,
      advertising: true,

      // Eventos personalizados
      customEvents: [
        'quiz_started',
        'quiz_completed',
        'step_completed',
        'offer_viewed',
        'conversion'
      ]
    },

    // Facebook Pixel
    facebookPixel: {
      pixelId: '123456789012345', // Para ser configurado
      enabled: true,

      // Eventos do Facebook
      events: [
        'PageView',
        'ViewContent',
        'CompleteRegistration',
        'Lead',
        'Purchase'
      ],

      // Configurações avançadas
      advanced: {
        automaticMatching: true,
        firstPartyData: true,
        serverSideEvents: false
      }
    },

    // Google Tag Manager
    googleTagManager: {
      containerId: 'GTM-XXXXXXX', // Para ser configurado
      enabled: true,
      dataLayer: 'dataLayer',

      // Configurações personalizadas
      custom: {
        trackFormSubmissions: true,
        trackClicks: true,
        trackScrollDepth: true,
        trackFileDownloads: true
      }
    },

    // Hotjar para heatmaps
    hotjar: {
      siteId: '1234567', // Para ser configurado
      enabled: true,

      // Configurações de privacy
      respectDNT: true,
      cookieless: false,

      // Configurações de recording
      sessionRecording: {
        enabled: true,
        sampleRate: 100,
        recordConsoleErrors: true
      }
    },

    // Scripts personalizados
    customScripts: `
      <!-- Criativo Ads Tracking -->
      <script>
        window.criativoTracking = {
          campaign: 'quiz_style_abtest_2025',
          source: 'facebook',
          medium: 'cpc',
          version: '2.0.0'
        };
        
        // Tracking personalizado para etapas do quiz
        window.quizTracking = {
          trackStepCompletion: function(step, data) {
            gtag('event', 'quiz_step_completed', {
              'custom_step': step,
              'custom_data': JSON.stringify(data)
            });
          },
          
          trackQuizCompletion: function(result) {
            gtag('event', 'quiz_completed', {
              'custom_primary_style': result.primaryStyle,
              'custom_score': result.totalScore
            });
            
            // Facebook Pixel
            fbq('track', 'CompleteRegistration', {
              content_name: 'Quiz de Estilo Pessoal',
              status: 'completed'
            });
          }
        };
      </script>
    `,

    enableTracking: true,
    privacyCompliant: true,
    gdprCompliant: true
  },

  // UTM & Campaign - Integração com campanhas de marketing
  campaign: {
    defaultSource: 'facebook',
    defaultMedium: 'cpc',
    defaultCampaign: 'quiz_style_abtest_2025',
    autoUTM: true,
    trackingPrefix: 'qsq',

    // Configurações de attribution
    attribution: {
      window: 30, // dias
      model: 'last_click',
      crossDevice: true
    },

    // Parâmetros UTM personalizados
    customParameters: [
      'creative_id',
      'ad_set_id',
      'placement',
      'audience'
    ],

    // Referência ao arquivo UTM existente
    utmConfigPath: '/src/config/utmConfig.js',

    // Configurações de A/B testing
    abTesting: {
      enabled: true,
      platform: 'facebook',

      variants: [
        {
          id: 'variant_a',
          name: 'Quiz Focus',
          traffic: 50,
          utmContent: 'quiz_focus'
        },
        {
          id: 'variant_b',
          name: 'Result Focus',
          traffic: 50,
          utmContent: 'result_focus'
        }
      ]
    }
  },

  // Webhooks & Integrations - Integrações com ferramentas externas
  webhooks: {
    // Configurações gerais
    enableWebhooks: true,
    secretKey: 'your-webhook-secret-key-here',
    timeout: 10000, // 10 segundos
    retryAttempts: 3,
    retryDelay: 1000, // 1 segundo

    // URLs de webhook por evento
    endpoints: {
      leadCapture: 'https://hooks.zapier.com/hooks/catch/123456/lead-capture/',
      formSubmission: 'https://hooks.zapier.com/hooks/catch/123456/form-submit/',
      purchaseComplete: 'https://hooks.zapier.com/hooks/catch/123456/purchase/',
      quizComplete: 'https://hooks.zapier.com/hooks/catch/123456/quiz-complete/',
      stepCompleted: 'https://hooks.zapier.com/hooks/catch/123456/step-completed/',
      userDropOff: 'https://hooks.zapier.com/hooks/catch/123456/user-drop-off/'
    },

    // Configurações específicas para cada evento
    events: {
      leadCapture: {
        fields: ['userName', 'email', 'phone', 'quizScore', 'resultStyle', 'timestamp'],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        includeMetadata: true
      },

      quizComplete: {
        fields: [
          'userName', 'email', 'answers', 'score', 'resultStyle',
          'secondaryStyles', 'recommendations', 'timestamp', 'sessionDuration'
        ],
        method: 'POST',
        includeTimestamp: true,
        includeUserAgent: true,
        includeReferrer: true
      },

      stepCompleted: {
        fields: ['stepId', 'stepName', 'timeSpent', 'answers', 'timestamp'],
        method: 'POST',
        batchMode: true,
        batchSize: 10
      }
    },

    // Integrações específicas
    integrations: {
      // Zapier
      zapier: {
        enabled: true,
        webhookUrl: 'https://hooks.zapier.com/hooks/catch/123456/main/',
        fields: ['all']
      },

      // ActiveCampaign
      activeCampaign: {
        enabled: false,
        apiUrl: 'https://youraccountname.api-us1.com',
        apiKey: '', // Para ser configurado
        listId: '', // Para ser configurado
        tags: ['quiz-lead', 'style-interested']
      },

      // Mailchimp
      mailchimp: {
        enabled: false,
        apiKey: '', // Para ser configurado
        audienceId: '', // Para ser configurado
        tags: ['quiz-completed', 'style-quiz']
      },

      // RD Station
      rdStation: {
        enabled: false,
        token: '', // Para ser configurado
        eventName: 'quiz_completed'
      }
    }
  },

  // Branding & Design - Identidade visual completa
  branding: {
    // Cores primárias
    colors: {
      primary: '#B89B7A',
      secondary: '#432818',
      accent: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',

      // Gradientes
      gradients: {
        primary: 'linear-gradient(135deg, #B89B7A, #D4C2A8)',
        accent: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
        warm: 'linear-gradient(135deg, #B89B7A, #432818)'
      },

      // Backgrounds
      backgrounds: {
        primary: '#FAF9F7',
        secondary: '#FFFFFF',
        card: '#FEFEFE',
        border: '#E6DDD4'
      }
    },

    // Tipografia
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headingFont: "'Playfair Display', serif",

      // Tamanhos
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },

      // Pesos
      weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },

    // Logos e imagens
    assets: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Gisele Galvão - Consultoria de Imagem',
      faviconUrl: '/favicon.ico',

      // Imagens padrão
      defaultImages: {
        placeholder: 'https://via.placeholder.com/400x300/B89B7A/FFFFFF?text=Carregando...',
        error: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Erro+ao+carregar'
      }
    },

    // Layout e espaçamento
    layout: {
      maxWidth: '1200px',
      containerPadding: '1rem',

      // Breakpoints responsivos
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },

      // Espaçamentos
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      }
    },

    // CSS customizado
    customCSS: `
      :root {
        --brand-primary: #B89B7A;
        --brand-secondary: #432818;
        --brand-accent: #3B82F6;
        --brand-bg: #FAF9F7;
        --brand-border: #E6DDD4;
        --brand-shadow: rgba(184, 155, 122, 0.1);
        --brand-gradient: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
      }
      
      .quiz-container {
        font-family: var(--brand-font-family);
        background-color: var(--brand-bg);
        min-height: 100vh;
      }
      
      .brand-gradient {
        background: var(--brand-gradient);
      }
      
      .brand-shadow {
        box-shadow: 0 4px 6px -1px var(--brand-shadow), 0 2px 4px -1px var(--brand-shadow);
      }
      
      .brand-glow {
        box-shadow: 0 0 20px var(--brand-shadow);
      }
      
      @media (prefers-reduced-motion: reduce) {
        .animate-pulse, .animate-bounce, .animate-spin {
          animation: none;
        }
      }
    `
  },

  // Legal & Compliance - Conformidade legal completa
  legal: {
    // URLs de políticas
    privacyPolicyUrl: '/privacy',
    termsOfServiceUrl: '/terms',
    cookiePolicyUrl: '/cookies',

    // Configurações de cookies
    cookies: {
      showBanner: true,
      bannerText: 'Este site utiliza cookies para melhorar sua experiência e personalizar o conteúdo. Ao continuar navegando, você concorda com nossa política de cookies.',
      acceptText: 'Aceitar todos',
      rejectText: 'Recusar opcionais',
      settingsText: 'Configurar',

      // Categorias de cookies
      categories: {
        necessary: {
          name: 'Essenciais',
          description: 'Necessários para o funcionamento básico do site',
          required: true
        },
        analytics: {
          name: 'Analíticos',
          description: 'Nos ajudam a entender como você usa o site',
          required: false
        },
        marketing: {
          name: 'Marketing',
          description: 'Usados para personalizar anúncios e conteúdo',
          required: false
        }
      }
    },

    // Conformidade GDPR/LGPD
    dataProtection: {
      gdprCompliant: true,
      lgpdCompliant: true,

      // Direitos do usuário
      userRights: [
        'access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'
      ],

      // Configurações de consentimento
      consent: {
        explicit: true,
        granular: true,
        withdrawable: true,
        recordKeeping: true
      }
    },

    // Informações da empresa
    companyInfo: {
      name: 'Gisele Galvão - Consultoria de Imagem',
      legalName: 'Gisele Galvão ME',
      cnpj: '00.000.000/0001-00', // Para ser configurado
      address: {
        street: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '00000-000',
        country: 'Brasil'
      },
      contact: {
        phone: '(11) 99999-9999',
        email: 'contato@giselegaalvao.com',
        website: 'https://giselegaalvao.com'
      }
    },

    // Disclaimers
    disclaimers: {
      quiz: 'Os resultados deste quiz são baseados em suas respostas e têm caráter orientativo.',
      consultation: 'Para uma análise completa, recomendamos uma consultoria personalizada.',
      results: 'Os resultados podem variar de pessoa para pessoa.'
    }
  },

  // A/B Testing Configuration - Testes A/B avançados
  abTesting: {
    enabled: true,

    // Configurações globais
    settings: {
      cookieDuration: 30, // dias
      trafficSplit: 'equal',
      statisticalSignificance: 0.95,
      minimumSampleSize: 100
    },

    // Testes ativos
    activeTests: [
      {
        id: 'homepage_variant_2025',
        name: 'Homepage Quiz vs Landing',
        status: 'active',
        trafficPercentage: 100,

        variants: [
          {
            id: 'control',
            name: 'Quiz Direto',
            path: '/',
            weight: 50,
            description: 'Página com quiz interativo direto'
          },
          {
            id: 'landing',
            name: 'Landing Page',
            path: '/landing',
            weight: 50,
            description: 'Landing page com apresentação + quiz'
          }
        ],

        goals: [
          {
            name: 'quiz_completion',
            type: 'conversion',
            priority: 'primary'
          },
          {
            name: 'email_capture',
            type: 'conversion',
            priority: 'secondary'
          }
        ]
      }
    ]
  },

  // Performance & Optimization - Otimizações de performance
  performance: {
    // Configurações de cache
    caching: {
      enableBrowserCache: true,
      enableServiceWorker: true,
      cacheStrategy: 'stale-while-revalidate',

      // TTL por tipo de resource
      cacheTTL: {
        static: 2592000, // 30 dias
        images: 604800,  // 7 dias
        api: 300,        // 5 minutos
        html: 3600       // 1 hora
      }
    },

    // Compressão
    compression: {
      enableGzip: true,
      enableBrotli: true,
      compressionLevel: 6
    },

    // Otimização de imagens
    images: {
      enableLazyLoading: true,
      enableWebP: true,
      enableAVIF: true,

      // Formatos por device
      responsive: {
        mobile: { width: 375, format: 'webp' },
        tablet: { width: 768, format: 'webp' },
        desktop: { width: 1200, format: 'webp' }
      },

      // CDN settings
      cdn: {
        provider: 'cloudinary',
        baseUrl: 'https://res.cloudinary.com/dqljyf76t/',
        transformations: 'f_auto,q_auto'
      }
    },

    // Preloading crítico
    criticalResources: [
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ],

    // Configurações de loading
    loading: {
      showSkeletons: true,
      showProgressBar: true,
      enablePrefetch: true,
      enablePreconnect: true
    },

    // Monitoramento de performance
    monitoring: {
      enableWebVitals: true,
      reportToGA: true,

      // Thresholds de alerta
      thresholds: {
        LCP: 2500,  // Largest Contentful Paint
        FID: 100,   // First Input Delay
        CLS: 0.1    // Cumulative Layout Shift
      }
    }
  },

  // Configurações de segurança
  security: {
    // Headers de segurança
    headers: {
      contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' *.google-analytics.com *.googletagmanager.com *.facebook.net *.hotjar.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.cloudinary.com *.google-analytics.com *.facebook.com *.hotjar.com; connect-src 'self' *.google-analytics.com *.hotjar.com *.supabase.co;",
      frameOptions: 'DENY',
      contentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin'
    },

    // Rate limiting
    rateLimiting: {
      enabled: true,
      requests: 100,
      window: 3600000, // 1 hora
      skipSuccessfulRequests: true
    },

    // Validation
    inputValidation: {
      enableXSSProtection: true,
      enableSQLInjectionProtection: true,
      maxInputLength: 1000,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp']
    }
  }
};
