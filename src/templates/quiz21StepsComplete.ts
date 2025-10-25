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
 * Gerado em: 2025-10-25T00:01:59.286Z
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
        "type": "quiz-intro-header",
        "id": "intro-header-01",
        "content": {
          "logoUrl": "https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png",
          "logoAlt": "Logo Gisele Galvão",
          "logoWidth": 132,
          "logoHeight": 55,
          "showBar": true,
          "barColor": "#B89B7A",
          "barHeight": 3,
          "barMaxWidth": 300
        },
        "style": {
          "backgroundColor": "#FAF9F7",
          "textColor": "#432818",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 400,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "intro-title",
        "id": "intro-title-01",
        "content": {
          "titleHtml": "<span style=\"color: #B89B7A; font-weight: 700;\">Chega</span> de um guarda-roupa lotado e da sensação de que <span style=\"color: #B89B7A; font-weight: 700;\">nada combina com você</span>.",
          "title": "Chega de um guarda-roupa lotado e da sensação de que nada combina com você."
        },
        "style": {
          "textColor": "#432818",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 400,
          "delay": 100,
          "easing": "ease-out"
        }
      },
      {
        "type": "intro-image",
        "id": "intro-image-01",
        "content": {
          "imageUrl": "https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png",
          "imageAlt": "Descubra seu estilo predominante",
          "width": 300,
          "height": 204,
          "objectFit": "contain",
          "maxWidth": 300
        },
        "style": {
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 400,
          "delay": 150,
          "easing": "ease-out"
        }
      },
      {
        "type": "intro-description",
        "id": "intro-description-01",
        "content": {
          "text": "Em poucos minutos, descubra seu <strong style=\"color:#B89B7A\">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua <strong style=\"color:#432818\">essência</strong>, com praticidade e <strong style=\"color:#432818\">confiança</strong>."
        },
        "style": {
          "textColor": "#6B7280",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 400,
          "delay": 180,
          "easing": "ease-out"
        }
      },
      {
        "type": "intro-form",
        "id": "intro-form-01",
        "content": {
          "formQuestion": "Como posso te chamar?",
          "nameLabel": "Seu primeiro nome",
          "namePlaceholder": "Digite seu primeiro nome aqui...",
          "submitText": "Quero Descobrir meu Estilo Agora!",
          "validationMessage": "Por favor, digite seu nome para continuar",
          "helperText": "Seu nome é necessário para personalizar sua experiência.",
          "showNameField": true,
          "showEmailField": false,
          "requiredFields": "name"
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
      },
      {
        "type": "footer-copyright",
        "id": "intro-footer-01",
        "content": {
          "text": "© 2025 Gisele Galvão - Todos os direitos reservados"
        },
        "style": {
          "textAlign": "center",
          "padding": 16
        },
        "animation": {
          "type": "fade",
          "duration": 300,
          "delay": 300,
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
        "type": "question-progress",
        "id": "q2-progress",
        "content": {
          "currentQuestion": 1,
          "totalQuestions": 10,
          "progressValue": 10,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q2-number",
        "content": {
          "text": "1 de 10",
          "questionNumber": "1 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q2-text",
        "content": {
          "text": "QUAL O SEU TIPO DE ROUPA FAVORITA?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q2-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-02",
        "content": {
          "options": [
            {
              "id": "natural",
              "text": "Conforto, leveza e praticidade no vestir",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Discrição, caimento clássico e sobriedade",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Praticidade com um toque de estilo atual",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Elegância refinada, moderna e sem exageros",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Delicadeza em tecidos suaves e fluidos",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Sensualidade com destaque para o corpo",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Impacto visual com peças estruturadas e assimétricas",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Mix criativo com formas ousadas e originais",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
              "value": "criativo"
            }
          ],
          "columns": 2,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": true,
          "imageSize": 600,
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
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
          "options": [
            {
              "id": "natural",
              "text": "Conforto, leveza e praticidade no vestir",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
              "value": "natural"
            },
            {
              "id": "classico",
              "text": "Discrição, caimento clássico e sobriedade",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
              "value": "classico"
            },
            {
              "id": "contemporaneo",
              "text": "Praticidade com um toque de estilo atual",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
              "value": "contemporaneo"
            },
            {
              "id": "elegante",
              "text": "Elegância refinada, moderna e sem exageros",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
              "value": "elegante"
            },
            {
              "id": "romantico",
              "text": "Delicadeza em tecidos suaves e fluidos",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
              "value": "romantico"
            },
            {
              "id": "sexy",
              "text": "Sensualidade com destaque para o corpo",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
              "value": "sexy"
            },
            {
              "id": "dramatico",
              "text": "Impacto visual com peças estruturadas e assimétricas",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
              "value": "dramatico"
            },
            {
              "id": "criativo",
              "text": "Mix criativo com formas ousadas e originais",
              "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
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
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q2-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q3-progress",
        "content": {
          "currentQuestion": 2,
          "totalQuestions": 10,
          "progressValue": 20,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q3-number",
        "content": {
          "text": "2 de 10",
          "questionNumber": "2 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q3-text",
        "content": {
          "text": "RESUMA A SUA PERSONALIDADE:"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q3-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-03",
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
          "columns": 1,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": false,
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
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q3-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q4-progress",
        "content": {
          "currentQuestion": 3,
          "totalQuestions": 10,
          "progressValue": 30,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q4-number",
        "content": {
          "text": "3 de 10",
          "questionNumber": "3 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q4-text",
        "content": {
          "text": "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q4-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-04",
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q4-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q5-progress",
        "content": {
          "currentQuestion": 4,
          "totalQuestions": 10,
          "progressValue": 40,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q5-number",
        "content": {
          "text": "4 de 10",
          "questionNumber": "4 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q5-text",
        "content": {
          "text": "QUAIS DETALHES VOCÊ GOSTA?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q5-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-05",
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
          "columns": 1,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": false,
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
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "columns": 1,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q5-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q6-progress",
        "content": {
          "currentQuestion": 5,
          "totalQuestions": 10,
          "progressValue": 50,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q6-number",
        "content": {
          "text": "5 de 10",
          "questionNumber": "5 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q6-text",
        "content": {
          "text": "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q6-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-06",
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q6-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q7-progress",
        "content": {
          "currentQuestion": 6,
          "totalQuestions": 10,
          "progressValue": 60,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q7-number",
        "content": {
          "text": "6 de 10",
          "questionNumber": "6 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q7-text",
        "content": {
          "text": "QUAL CASACO É SEU FAVORITO?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q7-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-07",
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q7-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q8-progress",
        "content": {
          "currentQuestion": 7,
          "totalQuestions": 10,
          "progressValue": 70,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q8-number",
        "content": {
          "text": "7 de 10",
          "questionNumber": "7 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q8-text",
        "content": {
          "text": "QUAL SUA CALÇA FAVORITA?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q8-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-08",
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q8-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q9-progress",
        "content": {
          "currentQuestion": 8,
          "totalQuestions": 10,
          "progressValue": 80,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q9-number",
        "content": {
          "text": "8 de 10",
          "questionNumber": "8 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q9-text",
        "content": {
          "text": "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q9-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-09",
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q9-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q10-progress",
        "content": {
          "currentQuestion": 9,
          "totalQuestions": 10,
          "progressValue": 90,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q10-number",
        "content": {
          "text": "9 de 10",
          "questionNumber": "9 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q10-text",
        "content": {
          "text": "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q10-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-10",
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
          "validationMessage": "Selecione 3 opções para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q10-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
        "type": "question-progress",
        "id": "q11-progress",
        "content": {
          "currentQuestion": 10,
          "totalQuestions": 10,
          "progressValue": 100,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q11-number",
        "content": {
          "text": "10 de 10",
          "questionNumber": "10 de 10"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q11-text",
        "content": {
          "text": "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES..."
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q11-instructions",
        "content": {
          "text": "Selecione exatamente 3 opções para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-11",
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
          "columns": 1,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": false,
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
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "columns": 1,
          "multipleSelection": true,
          "minSelections": 3,
          "maxSelections": 3,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": true,
          "autoAdvanceDelay": 1500,
          "validationMessage": "Selecione 3 opções para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q11-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
        "Elegante",
        "Romântico",
        "Sexy",
        "Dramático",
        "Criativo"
      ],
      "options": {
        "natural": {
          "category": "Natural",
          "points": 1
        },
        "classico": {
          "category": "Clássico",
          "points": 1
        },
        "contemporaneo": {
          "category": "Contemporâneo",
          "points": 1
        },
        "elegante": {
          "category": "Elegante",
          "points": 1
        },
        "romantico": {
          "category": "Romântico",
          "points": 1
        },
        "sexy": {
          "category": "Sexy",
          "points": 1
        },
        "dramatico": {
          "category": "Dramático",
          "points": 1
        },
        "criativo": {
          "category": "Criativo",
          "points": 1
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
          "title": "🕐 Enquanto calculamos o seu resultado...",
          "autoAdvanceDelay": 0
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
      },
      {
        "type": "text-inline",
        "id": "step-12-transition-text",
        "content": {
          "text": "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão."
        },
        "style": {
          "textAlign": "center",
          "marginTop": 8
        },
        "animation": {
          "type": "fade",
          "duration": 250,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "CTAButton",
        "id": "step-12-transition-cta",
        "content": {
          "label": "Continuar",
          "href": "#next",
          "variant": "primary",
          "size": "medium"
        },
        "style": {
          "textAlign": "center",
          "marginTop": 12
        },
        "animation": {
          "type": "fade",
          "duration": 250,
          "delay": 50,
          "easing": "ease-out"
        }
      }
    ],
    "navigation": {
      "nextStep": "step-13",
      "prevStep": "step-11",
      "allowBack": false,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
    },
    "analytics": {
      "events": [
        "page_view",
        "section_view"
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
      "updatedAt": "2025-10-21T00:00:00.000Z",
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
        "type": "question-progress",
        "id": "q13-progress",
        "content": {
          "currentQuestion": 1,
          "totalQuestions": 6,
          "progressValue": 16,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q13-number",
        "content": {
          "text": "1 de 6",
          "questionNumber": "1 de 6"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q13-text",
        "content": {
          "text": "Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q13-instructions",
        "content": {
          "text": "Selecione 1 opção para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-13",
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q13-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
          "minItems": 1,
          "maxItems": 1,
          "errorMessage": "Por favor, selecione 1 opção"
        }
      }
    },
    "navigation": {
      "nextStep": "step-14",
      "prevStep": "step-12",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
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
        "type": "question-progress",
        "id": "q14-progress",
        "content": {
          "currentQuestion": 2,
          "totalQuestions": 6,
          "progressValue": 33,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q14-number",
        "content": {
          "text": "2 de 6",
          "questionNumber": "2 de 6"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q14-text",
        "content": {
          "text": "O que mais te desafia na hora de se vestir?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q14-instructions",
        "content": {
          "text": "Selecione 1 opção para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-14",
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q14-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
          "minItems": 1,
          "maxItems": 1,
          "errorMessage": "Por favor, selecione 1 opção"
        }
      }
    },
    "navigation": {
      "nextStep": "step-15",
      "prevStep": "step-13",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
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
        "type": "question-progress",
        "id": "q15-progress",
        "content": {
          "currentQuestion": 3,
          "totalQuestions": 6,
          "progressValue": 50,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q15-number",
        "content": {
          "text": "3 de 6",
          "questionNumber": "3 de 6"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q15-text",
        "content": {
          "text": "Com que frequência você se pega pensando: \"Com que roupa eu vou?\" — mesmo com o guarda-roupa cheio?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q15-instructions",
        "content": {
          "text": "Selecione 1 opção para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-15",
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q15-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
          "minItems": 1,
          "maxItems": 1,
          "errorMessage": "Por favor, selecione 1 opção"
        }
      }
    },
    "navigation": {
      "nextStep": "step-16",
      "prevStep": "step-14",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
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
        "type": "question-progress",
        "id": "q16-progress",
        "content": {
          "currentQuestion": 4,
          "totalQuestions": 6,
          "progressValue": 66,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q16-number",
        "content": {
          "text": "4 de 6",
          "questionNumber": "4 de 6"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q16-text",
        "content": {
          "text": "Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q16-instructions",
        "content": {
          "text": "Selecione 1 opção para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-16",
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
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
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q16-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
          "minItems": 1,
          "maxItems": 1,
          "errorMessage": "Por favor, selecione 1 opção"
        }
      }
    },
    "navigation": {
      "nextStep": "step-17",
      "prevStep": "step-15",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
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
        "type": "question-progress",
        "id": "q17-progress",
        "content": {
          "currentQuestion": 5,
          "totalQuestions": 6,
          "progressValue": 83,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q17-number",
        "content": {
          "text": "5 de 6",
          "questionNumber": "5 de 6"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q17-text",
        "content": {
          "text": "Você acredita que ter um passo a passo para alinhar seu estilo à sua essência pode acelerar sua transformação?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q17-instructions",
        "content": {
          "text": "Selecione 1 opção para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-17",
        "content": {
          "options": [
            {
              "id": "sim-totalmente",
              "text": "Sim! Sozinha é mais difícil manter consistência",
              "value": "sim-totalmente"
            },
            {
              "id": "sim-ajudaria",
              "text": "Sim, ter um método claro ajudaria muito",
              "value": "sim-ajudaria"
            },
            {
              "id": "talvez",
              "text": "Talvez — se for algo prático e fácil de aplicar",
              "value": "talvez"
            },
            {
              "id": "nao-pronta",
              "text": "Ainda não sei se estou pronta pra isso",
              "value": "nao-pronta"
            }
          ],
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
          "options": [
            {
              "id": "sim-totalmente",
              "text": "Sim! Sozinha é mais difícil manter consistência",
              "value": "sim-totalmente"
            },
            {
              "id": "sim-ajudaria",
              "text": "Sim, ter um método claro ajudaria muito",
              "value": "sim-ajudaria"
            },
            {
              "id": "talvez",
              "text": "Talvez — se for algo prático e fácil de aplicar",
              "value": "talvez"
            },
            {
              "id": "nao-pronta",
              "text": "Ainda não sei se estou pronta pra isso",
              "value": "nao-pronta"
            }
          ],
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q17-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
          "minItems": 1,
          "maxItems": 1,
          "errorMessage": "Por favor, selecione 1 opção"
        }
      }
    },
    "navigation": {
      "nextStep": "step-18",
      "prevStep": "step-16",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
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
        "type": "question-progress",
        "id": "q18-progress",
        "content": {
          "currentQuestion": 6,
          "totalQuestions": 6,
          "progressValue": 100,
          "showProgress": true
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 8
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-number",
        "id": "q18-number",
        "content": {
          "text": "6 de 6",
          "questionNumber": "6 de 6"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 4
        },
        "animation": {
          "type": "fade",
          "duration": 220,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-text",
        "id": "q18-text",
        "content": {
          "text": "Se você tivesse o acompanhamento certo, qual dessas mudanças mais te faria sentir realizada?"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "question-instructions",
        "id": "q18-instructions",
        "content": {
          "text": "Selecione 1 opção para continuar"
        },
        "style": {
          "textAlign": "center",
          "marginBottom": 12
        },
        "animation": {
          "type": "fade",
          "duration": 240,
          "delay": 60,
          "easing": "ease-out"
        }
      },
      {
        "type": "options-grid",
        "id": "options-grid-18",
        "content": {
          "options": [
            {
              "id": "seguranca-expressao",
              "text": "Ter segurança para expressar quem eu sou através da minha imagem",
              "value": "seguranca-expressao"
            },
            {
              "id": "confianca-presenca",
              "text": "Me sentir confiante e com presença em qualquer ambiente",
              "value": "confianca-presenca"
            },
            {
              "id": "clareza-estilo",
              "text": "Ter clareza sobre meu estilo e como usá-lo no dia a dia",
              "value": "clareza-estilo"
            },
            {
              "id": "guarda-roupa-intencional",
              "text": "Construir um guarda-roupa intencional que comunique minha essência",
              "value": "guarda-roupa-intencional"
            }
          ],
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        },
        "style": {
          "backgroundColor": "transparent",
          "padding": 16
        },
        "animation": {
          "type": "slideUp",
          "duration": 300,
          "delay": 80,
          "easing": "ease-out"
        },
        "properties": {
          "options": [
            {
              "id": "seguranca-expressao",
              "text": "Ter segurança para expressar quem eu sou através da minha imagem",
              "value": "seguranca-expressao"
            },
            {
              "id": "confianca-presenca",
              "text": "Me sentir confiante e com presença em qualquer ambiente",
              "value": "confianca-presenca"
            },
            {
              "id": "clareza-estilo",
              "text": "Ter clareza sobre meu estilo e como usá-lo no dia a dia",
              "value": "clareza-estilo"
            },
            {
              "id": "guarda-roupa-intencional",
              "text": "Construir um guarda-roupa intencional que comunique minha essência",
              "value": "guarda-roupa-intencional"
            }
          ],
          "columns": 1,
          "multipleSelection": false,
          "minSelections": 1,
          "maxSelections": 1,
          "showImages": false,
          "imageSize": 256,
          "autoAdvance": false,
          "autoAdvanceDelay": 0,
          "validationMessage": "Selecione 1 opção para continuar"
        }
      },
      {
        "type": "question-navigation",
        "id": "q18-navigation",
        "content": {
          "backLabel": "Voltar",
          "nextLabel": "Avançar"
        },
        "properties": {
          "showBack": true,
          "enableWhenValid": true
        },
        "style": {
          "marginTop": 16,
          "textAlign": "center"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
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
          "minItems": 1,
          "maxItems": 1,
          "errorMessage": "Por favor, selecione 1 opção"
        }
      }
    },
    "navigation": {
      "nextStep": "step-19",
      "prevStep": "step-17",
      "allowBack": true,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
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
          "title": "Você chegou até aqui — e isso já diz muito sobre você.",
          "subtitle": null,
          "message": null,
          "autoAdvanceDelay": 0
        },
        "style": {
          "backgroundColor": "#fffaf7",
          "textColor": "#3a3a3a",
          "padding": 32
        },
        "animation": {
          "type": "scale",
          "duration": 500,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "text-inline",
        "id": "step-19-paragraph-1",
        "content": {
          "text": "Poucas mulheres se permitem parar e olhar para si com tanta intenção. E o que vem agora é mais do que um simples resultado — é o início de uma nova forma de se enxergar."
        },
        "style": {
          "textAlign": "center",
          "marginTop": 8,
          "color": "#3a3a3a"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
          "delay": 0,
          "easing": "ease-out"
        }
      },
      {
        "type": "text-inline",
        "id": "step-19-paragraph-2",
        "content": {
          "text": "Seu Estilo Predominante vai revelar muito sobre como você comunica sua essência ao mundo. Mas o mais importante é o que você vai fazer com essa descoberta."
        },
        "style": {
          "textAlign": "center",
          "marginTop": 8,
          "color": "#3a3a3a"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
          "delay": 20,
          "easing": "ease-out"
        }
      },
      {
        "type": "text-inline",
        "id": "step-19-paragraph-3",
        "content": {
          "text": "Em seguida, você vai conhecer um caminho completo para aplicar o seu estilo na prática — com leveza, estratégia e propósito. Um método criado para transformar não só o seu guarda-roupa, mas também a forma como você se apresenta e se sente todos os dias."
        },
        "style": {
          "textAlign": "center",
          "marginTop": 8,
          "color": "#3a3a3a"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
          "delay": 40,
          "easing": "ease-out"
        }
      },
      {
        "type": "CTAButton",
        "id": "step-19-cta-show-result",
        "content": {
          "label": "Ver meu resultado agora",
          "href": "#next",
          "variant": "primary",
          "size": "large"
        },
        "style": {
          "textAlign": "center",
          "marginTop": 16,
          "backgroundColor": "#B89B7A",
          "color": "#FFFFFF",
          "hoverColor": "#a08968"
        },
        "animation": {
          "type": "fade",
          "duration": 250,
          "delay": 60,
          "easing": "ease-out"
        }
      }
    ],
    "navigation": {
      "nextStep": "step-20",
      "prevStep": "step-18",
      "allowBack": false,
      "requiresUserInput": true,
      "autoAdvance": false,
      "autoAdvanceDelay": 0
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
