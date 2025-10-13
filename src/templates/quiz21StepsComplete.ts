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
 * Gerado em: 2025-10-13T00:26:03.448Z
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
  'step-01': [
    {
      "id": "step01-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 0,
        "progressMax": 100,
        "showProgress": false,
        "showBackButton": false,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "intro-decorative-bar",
      "type": "decorative-bar-inline",
      "order": 1,
      "content": {},
      "properties": {
        "width": "100%",
        "height": 4,
        "color": "#B89B7A",
        "backgroundColor": "#B89B7A",
        "marginTop": 0,
        "marginBottom": 24,
        "containerWidth": "full"
      }
    },
    {
      "id": "intro-main-title",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "<",
        "1": "s",
        "2": "p",
        "3": "a",
        "4": "n",
        "5": " ",
        "6": "s",
        "7": "t",
        "8": "y",
        "9": "l",
        "10": "e",
        "11": "=",
        "12": "\"",
        "13": "c",
        "14": "o",
        "15": "l",
        "16": "o",
        "17": "r",
        "18": ":",
        "19": " ",
        "20": "#",
        "21": "B",
        "22": "8",
        "23": "9",
        "24": "B",
        "25": "7",
        "26": "A",
        "27": "\"",
        "28": ">",
        "29": "C",
        "30": "h",
        "31": "e",
        "32": "g",
        "33": "a",
        "34": "<",
        "35": "/",
        "36": "s",
        "37": "p",
        "38": "a",
        "39": "n",
        "40": ">",
        "41": " ",
        "42": "d",
        "43": "e",
        "44": " ",
        "45": "u",
        "46": "m",
        "47": " ",
        "48": "g",
        "49": "u",
        "50": "a",
        "51": "r",
        "52": "d",
        "53": "a",
        "54": "-",
        "55": "r",
        "56": "o",
        "57": "u",
        "58": "p",
        "59": "a",
        "60": " ",
        "61": "l",
        "62": "o",
        "63": "t",
        "64": "a",
        "65": "d",
        "66": "o",
        "67": " ",
        "68": "e",
        "69": " ",
        "70": "d",
        "71": "a",
        "72": " ",
        "73": "s",
        "74": "e",
        "75": "n",
        "76": "s",
        "77": "a",
        "78": "ç",
        "79": "ã",
        "80": "o",
        "81": " ",
        "82": "d",
        "83": "e",
        "84": " ",
        "85": "q",
        "86": "u",
        "87": "e",
        "88": " ",
        "89": "n",
        "90": "a",
        "91": "d",
        "92": "a",
        "93": " ",
        "94": "c",
        "95": "o",
        "96": "m",
        "97": "b",
        "98": "i",
        "99": "n",
        "100": "a",
        "101": " ",
        "102": "c",
        "103": "o",
        "104": "m",
        "105": " ",
        "106": "<",
        "107": "s",
        "108": "p",
        "109": "a",
        "110": "n",
        "111": " ",
        "112": "s",
        "113": "t",
        "114": "y",
        "115": "l",
        "116": "e",
        "117": "=",
        "118": "\"",
        "119": "c",
        "120": "o",
        "121": "l",
        "122": "o",
        "123": "r",
        "124": ":",
        "125": " ",
        "126": "#",
        "127": "B",
        "128": "8",
        "129": "9",
        "130": "B",
        "131": "7",
        "132": "A",
        "133": "\"",
        "134": ">",
        "135": "V",
        "136": "o",
        "137": "c",
        "138": "ê",
        "139": "<",
        "140": "/",
        "141": "s",
        "142": "p",
        "143": "a",
        "144": "n",
        "145": ">",
        "146": "."
      },
      "properties": {
        "content": "<span style=\"color: #B89B7A\">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com <span style=\"color: #B89B7A\">Você</span>.",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "marginBottom": 16,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "intro-image",
      "type": "image-display-inline",
      "order": 3,
      "content": {},
      "properties": {
        "src": "https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif",
        "alt": "Descubra seu estilo predominante",
        "width": 300,
        "height": 204,
        "containerPosition": "center",
        "marginBottom": 16,
        "containerWidth": "full"
      }
    },
    {
      "id": "intro-subtitle",
      "type": "text-inline",
      "order": 4,
      "content": {
        "0": "D",
        "1": "e",
        "2": "s",
        "3": "c",
        "4": "u",
        "5": "b",
        "6": "r",
        "7": "a",
        "8": " ",
        "9": "s",
        "10": "e",
        "11": "u",
        "12": " ",
        "13": "<",
        "14": "s",
        "15": "t",
        "16": "r",
        "17": "o",
        "18": "n",
        "19": "g",
        "20": ">",
        "21": "E",
        "22": "S",
        "23": "T",
        "24": "I",
        "25": "L",
        "26": "O",
        "27": " ",
        "28": "P",
        "29": "R",
        "30": "E",
        "31": "D",
        "32": "O",
        "33": "M",
        "34": "I",
        "35": "N",
        "36": "A",
        "37": "N",
        "38": "T",
        "39": "E",
        "40": "<",
        "41": "/",
        "42": "s",
        "43": "t",
        "44": "r",
        "45": "o",
        "46": "n",
        "47": "g",
        "48": ">",
        "49": " ",
        "50": "e",
        "51": "m",
        "52": " ",
        "53": "a",
        "54": "p",
        "55": "e",
        "56": "n",
        "57": "a",
        "58": "s",
        "59": " ",
        "60": "a",
        "61": "l",
        "62": "g",
        "63": "u",
        "64": "n",
        "65": "s",
        "66": " ",
        "67": "m",
        "68": "i",
        "69": "n",
        "70": "u",
        "71": "t",
        "72": "o",
        "73": "s",
        "74": "!"
      },
      "properties": {
        "content": "Descubra seu <strong>ESTILO PREDOMINANTE</strong> em apenas alguns minutos!",
        "fontSize": "text-lg",
        "fontWeight": "font-medium",
        "textAlign": "text-center",
        "color": "#432818",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "intro-lead-form",
      "type": "lead-form",
      "order": 5,
      "content": {},
      "properties": {
        "showNameField": true,
        "showEmailField": false,
        "showPhoneField": false,
        "nameLabel": "Como posso te chamar?",
        "namePlaceholder": "Digite seu primeiro nome aqui...",
        "submitText": "Quero Descobrir meu Estilo Agora!",
        "loadingText": "Digite seu nome para continuar",
        "successText": "Perfeito! Vamos descobrir seu estilo!",
        "requiredFields": "name",
        "backgroundColor": "#FFFFFF",
        "borderColor": "#B89B7A",
        "textColor": "#432818",
        "primaryColor": "#B89B7A",
        "marginTop": 0,
        "marginBottom": 16,
        "fieldSpacing": 6
      }
    }
  ],

  'step-02': [
    {
      "id": "step02-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 10,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step02-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "1",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "R",
        "6": "O",
        "7": "U",
        "8": "P",
        "9": "A",
        "10": " ",
        "11": "F",
        "12": "A",
        "13": "V",
        "14": "O",
        "15": "R",
        "16": "I",
        "17": "T",
        "18": "A"
      },
      "properties": {
        "content": "Q1 - ROUPA FAVORITA",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step02-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "1",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 1 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step02-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "2a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "2a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "2b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "2b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "2c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "2c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "2d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "2d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step02-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-03': [
    {
      "id": "step03-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 14,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step03-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "2",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "N",
        "6": "O",
        "7": "M",
        "8": "E",
        "9": " ",
        "10": "P",
        "11": "E",
        "12": "S",
        "13": "S",
        "14": "O",
        "15": "A",
        "16": "L"
      },
      "properties": {
        "content": "Q2 - NOME PESSOAL",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step03-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "2",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 2 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step03-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "3a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "3a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "3b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "3b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "3c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "3c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "3d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "3d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step03-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-04': [
    {
      "id": "step04-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 19,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step04-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "3",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "E",
        "6": "S",
        "7": "T",
        "8": "I",
        "9": "L",
        "10": "O",
        "11": " ",
        "12": "P",
        "13": "E",
        "14": "S",
        "15": "S",
        "16": "O",
        "17": "A",
        "18": "L"
      },
      "properties": {
        "content": "Q3 - ESTILO PESSOAL",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step04-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "3",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 3 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step04-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "4a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "4a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "4b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "4b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "4c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "4c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "4d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "4d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step04-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-05': [
    {
      "id": "step05-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 24,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step05-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "4",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "O",
        "6": "C",
        "7": "A",
        "8": "S",
        "9": "I",
        "10": "Õ",
        "11": "E",
        "12": "S"
      },
      "properties": {
        "content": "Q4 - OCASIÕES",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step05-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "4",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 4 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step05-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "5a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "5a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "5b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "5b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "5c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "5c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "5d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "5d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step05-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-06': [
    {
      "id": "step06-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 29,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step06-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "5",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "C",
        "6": "O",
        "7": "R",
        "8": "E",
        "9": "S"
      },
      "properties": {
        "content": "Q5 - CORES",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step06-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "5",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 5 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step06-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "6a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "6a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "6b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "6b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "6c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "6c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "6d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "6d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step06-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-07': [
    {
      "id": "step07-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 33,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step07-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "6",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "T",
        "6": "E",
        "7": "X",
        "8": "T",
        "9": "U",
        "10": "R",
        "11": "A"
      },
      "properties": {
        "content": "Q6 - TEXTURA",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step07-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "6",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 6 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step07-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "7a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "7a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "7b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "7b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "7c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "7c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "7d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "7d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step07-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-08': [
    {
      "id": "step08-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 38,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step08-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "7",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "S",
        "6": "I",
        "7": "L",
        "8": "H",
        "9": "U",
        "10": "E",
        "11": "T",
        "12": "A"
      },
      "properties": {
        "content": "Q7 - SILHUETA",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step08-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "7",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 7 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step08-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "8a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "8a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "8b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "8b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "8c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "8c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "8d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "8d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step08-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-09': [
    {
      "id": "step09-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 43,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step09-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "8",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "A",
        "6": "C",
        "7": "E",
        "8": "S",
        "9": "S",
        "10": "Ó",
        "11": "R",
        "12": "I",
        "13": "O",
        "14": "S"
      },
      "properties": {
        "content": "Q8 - ACESSÓRIOS",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step09-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "8",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 8 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step09-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "9a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "9a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "9b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "9b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "9c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "9c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "9d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "9d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step09-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-10': [
    {
      "id": "step10-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 48,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step10-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "9",
        "2": " ",
        "3": "-",
        "4": " ",
        "5": "I",
        "6": "N",
        "7": "S",
        "8": "P",
        "9": "I",
        "10": "R",
        "11": "A",
        "12": "Ç",
        "13": "Ã",
        "14": "O"
      },
      "properties": {
        "content": "Q9 - INSPIRAÇÃO",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step10-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "9",
        "9": " ",
        "10": "d",
        "11": "e",
        "12": " ",
        "13": "1",
        "14": "3"
      },
      "properties": {
        "content": "Questão 9 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step10-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "10a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "10a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "10b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "10b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "10c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "10c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "10d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "10d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step10-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-11': [
    {
      "id": "step11-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 52,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step11-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "1",
        "2": "0",
        "3": " ",
        "4": "-",
        "5": " ",
        "6": "C",
        "7": "O",
        "8": "N",
        "9": "F",
        "10": "O",
        "11": "R",
        "12": "T",
        "13": "O"
      },
      "properties": {
        "content": "Q10 - CONFORTO",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step11-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "1",
        "9": "0",
        "10": " ",
        "11": "d",
        "12": "e",
        "13": " ",
        "14": "1",
        "15": "3"
      },
      "properties": {
        "content": "Questão 10 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step11-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "11a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "11a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "11b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "11b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "11c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "11c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "11d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "11d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione 3 opções para continuar",
        "autoAdvance": true,
        "autoAdvanceOnComplete": true,
        "autoAdvanceDelay": 1500
      }
    },
    {
      "id": "step11-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione 3 opções para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-12': [
    {
      "id": "step12-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 57,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step12-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "1",
        "2": "1",
        "3": " ",
        "4": "-",
        "5": " ",
        "6": "T",
        "7": "E",
        "8": "N",
        "9": "D",
        "10": "Ê",
        "11": "N",
        "12": "C",
        "13": "I",
        "14": "A",
        "15": "S"
      },
      "properties": {
        "content": "Q11 - TENDÊNCIAS",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step12-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "1",
        "9": "1",
        "10": " ",
        "11": "d",
        "12": "e",
        "13": " ",
        "14": "1",
        "15": "3"
      },
      "properties": {
        "content": "Questão 11 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step12-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "12a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "12a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "12b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "12b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "12c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "12c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "12d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "12d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": true,
        "minSelections": 1,
        "maxSelections": 3,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16
      }
    },
    {
      "id": "step12-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Próxima Questão →",
        "textWhenDisabled": "Selecione pelo menos 1 opção",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24
      }
    }
  ],

  'step-13': [
    {
      "id": "step13-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 62,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step13-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "1",
        "2": "2",
        "3": " ",
        "4": "-",
        "5": " ",
        "6": "I",
        "7": "N",
        "8": "V",
        "9": "E",
        "10": "S",
        "11": "T",
        "12": "I",
        "13": "M",
        "14": "E",
        "15": "N",
        "16": "T",
        "17": "O"
      },
      "properties": {
        "content": "Q12 - INVESTIMENTO",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step13-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "1",
        "9": "2",
        "10": " ",
        "11": "d",
        "12": "e",
        "13": " ",
        "14": "1",
        "15": "3"
      },
      "properties": {
        "content": "Questão 12 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step13-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "13a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "13a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "13b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "13b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "13c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "13c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "13d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "13d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione uma opção para continuar",
        "autoAdvance": false,
        "autoAdvanceOnComplete": false,
        "autoAdvanceDelay": 0
      }
    },
    {
      "id": "step13-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Continuar →",
        "textWhenDisabled": "Selecione uma opção para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-14': [
    {
      "id": "step14-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 67,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step14-question-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "Q",
        "1": "1",
        "2": "3",
        "3": " ",
        "4": "-",
        "5": " ",
        "6": "P",
        "7": "E",
        "8": "R",
        "9": "S",
        "10": "O",
        "11": "N",
        "12": "A",
        "13": "L",
        "14": "I",
        "15": "D",
        "16": "A",
        "17": "D",
        "18": "E"
      },
      "properties": {
        "content": "Q13 - PERSONALIDADE",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step14-question-counter",
      "type": "text-inline",
      "order": 2,
      "content": {
        "0": "Q",
        "1": "u",
        "2": "e",
        "3": "s",
        "4": "t",
        "5": "ã",
        "6": "o",
        "7": " ",
        "8": "1",
        "9": "3",
        "10": " ",
        "11": "d",
        "12": "e",
        "13": " ",
        "14": "1",
        "15": "3"
      },
      "properties": {
        "content": "Questão 13 de 13",
        "fontSize": "text-sm",
        "textAlign": "text-center",
        "color": "#6B7280",
        "marginBottom": 24,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step14-options-grid",
      "type": "options-grid",
      "order": 3,
      "content": {},
      "properties": {
        "options": [
          {
            "id": "14a",
            "text": "Opção A - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "14a",
            "category": "Natural",
            "points": 1
          },
          {
            "id": "14b",
            "text": "Opção B - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "14b",
            "category": "Clássico",
            "points": 2
          },
          {
            "id": "14c",
            "text": "Opção C - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "14c",
            "category": "Contemporâneo",
            "points": 2
          },
          {
            "id": "14d",
            "text": "Opção D - Descrição personalizada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "14d",
            "category": "Elegante",
            "points": 3
          }
        ],
        "columns": 2,
        "imageSize": 256,
        "showImages": true,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "borderColor": "#E5E7EB",
        "selectedBorderColor": "#B89B7A",
        "hoverColor": "#F3E8D3",
        "containerWidth": "full",
        "spacing": "small",
        "marginBottom": 16,
        "validationMessage": "Selecione uma opção para continuar",
        "autoAdvance": false,
        "autoAdvanceOnComplete": false,
        "autoAdvanceDelay": 0
      }
    },
    {
      "id": "step14-continue-button",
      "type": "button-inline",
      "order": 4,
      "content": {},
      "properties": {
        "text": "Continuar →",
        "textWhenDisabled": "Selecione uma opção para continuar",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "enableOnSelection": true,
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "requiresValidSelection": true
      }
    }
  ],

  'step-15': [
    {
      "id": "step15-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 71,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step15-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "A",
        "1": "N",
        "2": "A",
        "3": "L",
        "4": "I",
        "5": "S",
        "6": "A",
        "7": "N",
        "8": "D",
        "9": "O",
        "10": " ",
        "11": "S",
        "12": "E",
        "13": "U",
        "14": " ",
        "15": "E",
        "16": "S",
        "17": "T",
        "18": "I",
        "19": "L",
        "20": "O",
        "21": ".",
        "22": ".",
        "23": "."
      },
      "properties": {
        "content": "ANALISANDO SEU ESTILO...",
        "fontSize": "text-3xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step15-loading",
      "type": "loading-animation",
      "order": 2,
      "content": {},
      "properties": {
        "type": "spinner",
        "color": "#B89B7A",
        "size": "large",
        "containerWidth": "full",
        "spacing": "small"
      }
    }
  ],

  'step-16': [
    {
      "id": "step16-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 76,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step16-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "P",
        "1": "R",
        "2": "E",
        "3": "P",
        "4": "A",
        "5": "R",
        "6": "A",
        "7": "N",
        "8": "D",
        "9": "O",
        "10": " ",
        "11": "S",
        "12": "E",
        "13": "U",
        "14": " ",
        "15": "R",
        "16": "E",
        "17": "S",
        "18": "U",
        "19": "L",
        "20": "T",
        "21": "A",
        "22": "D",
        "23": "O",
        "24": " ",
        "25": "P",
        "26": "E",
        "27": "R",
        "28": "S",
        "29": "O",
        "30": "N",
        "31": "A",
        "32": "L",
        "33": "I",
        "34": "Z",
        "35": "A",
        "36": "D",
        "37": "O",
        "38": ".",
        "39": ".",
        "40": "."
      },
      "properties": {
        "content": "PREPARANDO SEU RESULTADO PERSONALIZADO...",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step16-progress-bar",
      "type": "progress-bar",
      "order": 2,
      "content": {},
      "properties": {
        "value": 100,
        "animated": true,
        "color": "#B89B7A",
        "containerWidth": "full",
        "spacing": "small"
      }
    }
  ],

  'step-17': [
    {
      "id": "step17-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 81,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step17-result-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "S",
        "1": "E",
        "2": "U",
        "3": " ",
        "4": "E",
        "5": "S",
        "6": "T",
        "7": "I",
        "8": "L",
        "9": "O",
        "10": " ",
        "11": "P",
        "12": "E",
        "13": "S",
        "14": "S",
        "15": "O",
        "16": "A",
        "17": "L",
        "18": " ",
        "19": "É",
        "20": ":"
      },
      "properties": {
        "content": "SEU ESTILO PESSOAL É:",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step17-result-card",
      "type": "result-card",
      "order": 2,
      "content": {},
      "properties": {
        "title": "Estilo Elegante",
        "description": "Você tem preferência por peças clássicas e refinadas...",
        "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step17-continue-button",
      "type": "button-inline",
      "order": 3,
      "content": {},
      "properties": {
        "text": "Continuar →",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24,
        "enableOnSelection": true,
        "requiresValidSelection": true,
        "textWhenDisabled": "Selecione uma opção para continuar"
      }
    }
  ],

  'step-18': [
    {
      "id": "step18-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 86,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step18-result-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "S",
        "1": "E",
        "2": "U",
        "3": " ",
        "4": "E",
        "5": "S",
        "6": "T",
        "7": "I",
        "8": "L",
        "9": "O",
        "10": " ",
        "11": "P",
        "12": "E",
        "13": "S",
        "14": "S",
        "15": "O",
        "16": "A",
        "17": "L",
        "18": " ",
        "19": "É",
        "20": ":"
      },
      "properties": {
        "content": "SEU ESTILO PESSOAL É:",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step18-result-card",
      "type": "result-card",
      "order": 2,
      "content": {},
      "properties": {
        "title": "Estilo Elegante",
        "description": "Você tem preferência por peças clássicas e refinadas...",
        "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step18-continue-button",
      "type": "button-inline",
      "order": 3,
      "content": {},
      "properties": {
        "text": "Ver Mais →",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24
      }
    }
  ],

  'step-19': [
    {
      "id": "step19-header",
      "type": "quiz-intro-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 90,
        "progressTotal": 100,
        "showProgress": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step19-result-title",
      "type": "text-inline",
      "order": 1,
      "content": {
        "0": "S",
        "1": "E",
        "2": "U",
        "3": " ",
        "4": "E",
        "5": "S",
        "6": "T",
        "7": "I",
        "8": "L",
        "9": "O",
        "10": " ",
        "11": "P",
        "12": "E",
        "13": "S",
        "14": "S",
        "15": "O",
        "16": "A",
        "17": "L",
        "18": " ",
        "19": "É",
        "20": ":"
      },
      "properties": {
        "content": "SEU ESTILO PESSOAL É:",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step19-result-card",
      "type": "result-card",
      "order": 2,
      "content": {},
      "properties": {
        "title": "Estilo Elegante",
        "description": "Você tem preferência por peças clássicas e refinadas...",
        "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "step19-continue-button",
      "type": "button-inline",
      "order": 3,
      "content": {},
      "properties": {
        "text": "Continuar →",
        "variant": "primary",
        "size": "large",
        "fullWidth": true,
        "backgroundColor": "#B89B7A",
        "textColor": "#ffffff",
        "containerWidth": "full",
        "spacing": "small",
        "marginTop": 24
      }
    }
  ],

  'step-20': {
    "templateVersion": "3.0",
    "metadata": {
      "id": "step-20-resultado-v3",
      "name": "Página de Resultado - 5 Passos Vista-se de Você",
      "description": "Página completa de resultado do quiz com oferta integrada",
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
      "author": "Gisele Galvão - Branding & Imagem Pessoal"
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
      "responsive": true
    },
    "sections": [
      {
        "id": "hero",
        "type": "HeroSection",
        "enabled": true,
        "order": 1,
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
        "order": 2,
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
        "order": 3,
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
        "order": 4,
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
        "order": 5,
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
        "order": 6,
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
        "order": 7,
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
        "order": 8,
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
        "order": 9,
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
        "order": 10,
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
        "order": 11,
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
        "scores"
      ],
      "optional": [
        "secondaryStyles",
        "keywords",
        "specialTips"
      ]
    },
    "analytics": {
      "events": [
        "page_view",
        "step_completed",
        "cta_primary_click",
        "cta_secondary_click",
        "cta_final_click",
        "section_viewed",
        "offer_viewed"
      ],
      "trackingId": "step-20-v3",
      "utmParams": true,
      "customEvents": [
        "component_mounted",
        "user_interaction",
        "scroll_depth",
        "time_on_page"
      ],
      "pixelId": "PIXEL_CHECKOUT_PRIMARY"
    }
  },

  'step-21': [
    {
      "id": "offer-header",
      "type": "offer-header",
      "order": 0,
      "content": {},
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 180,
        "logoHeight": 80,
        "isSticky": true,
        "backgroundColor": "rgba(255, 255, 255, 0.9)",
        "backdropBlur": true,
        "containerWidth": "full",
        "spacing": "small"
      }
    },
    {
      "id": "hero-section",
      "type": "offer-hero-section",
      "order": 1,
      "content": {},
      "properties": {
        "badgeText": "3000+ mulheres transformadas",
        "badgeIcon": "Award",
        "title": "Etapa 21:",
        "titleHighlight": "Oferta Exclusiva",
        "titleSuffix": "Para Seu Estilo!",
        "subtitle": "Leve sua transformação de estilo para o próximo nível com nosso **Guia Completo personalizado** para seu resultado",
        "heroImageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp",
        "heroImageAlt": "Transformação de guarda-roupa",
        "heroImageWidth": 600,
        "heroImageHeight": 400,
        "ctaText": "Sim! Quero Garantir Meu Acesso",
        "ctaIcon": "ArrowRight",
        "ctaUrl": "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
        "trustElements": [
          {
            "icon": "Lock",
            "text": "100% Seguro"
          },
          {
            "icon": "Shield",
            "text": "7 Dias Garantia"
          }
        ],
        "containerWidth": "full",
        "spacing": "large"
      }
    },
    {
      "id": "problem-section",
      "type": "offer-problem-section",
      "order": 2,
      "content": {},
      "properties": {
        "title": "Você se identifica com isso?",
        "problems": [
          "**Guarda-roupa cheio** mas nunca tem o que vestir?",
          "**Compra peças** que nunca combinam com nada?",
          "**Sente que \"nada fica bom\"** em você?"
        ],
        "highlightText": "Isso acontece porque você ainda não descobriu seu **estilo predominante**.",
        "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp",
        "imageAlt": "Frustração com guarda-roupa",
        "imageWidth": 500,
        "imageHeight": 350,
        "layout": "side-by-side",
        "containerWidth": "full",
        "spacing": "large"
      }
    },
    {
      "id": "solution-section",
      "type": "offer-solution-section",
      "order": 3,
      "content": {},
      "properties": {
        "title": "A Solução: Quiz de Estilo",
        "description": "Método preciso para identificar seu estilo entre os **7 estilos universais** + guia personalizado completo.",
        "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1746650306/oie_1_gcozz9.webp",
        "imageAlt": "Quiz de Estilo",
        "imageWidth": 400,
        "imageHeight": 300,
        "ctaText": "Fazer o Quiz Agora",
        "ctaIcon": "ShoppingBag",
        "ctaUrl": "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
        "showCountdown": true,
        "countdownInitial": {
          "hours": 1,
          "minutes": 59,
          "seconds": 59
        },
        "containerWidth": "full",
        "spacing": "large"
      }
    },
    {
      "id": "product-showcase",
      "type": "offer-product-showcase",
      "order": 4,
      "content": {},
      "properties": {
        "title": "Transformação Completa",
        "subtitle": "Tudo que você precisa para descobrir e aplicar seu estilo",
        "products": [
          {
            "id": "main-guide",
            "title": "Guia Personalizado",
            "description": "Para seu estilo específico",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp",
            "imageAlt": "Guia Personalizado",
            "imageWidth": 250,
            "imageHeight": 312
          },
          {
            "id": "bonus-key-pieces",
            "title": "Bônus: Peças-Chave",
            "description": "Guarda-roupa funcional",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911687/C%C3%B3pia_de_MOCKUPS_12_w8fwrn.webp",
            "imageAlt": "Bônus Peças-Chave",
            "imageWidth": 250,
            "imageHeight": 312
          },
          {
            "id": "bonus-visagism",
            "title": "Bônus: Visagismo",
            "description": "Valorize seus traços",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp",
            "imageAlt": "Bônus Visagismo",
            "imageWidth": 250,
            "imageHeight": 312
          }
        ],
        "pricing": {
          "installments": {
            "quantity": 5,
            "amount": "8,83"
          },
          "fullPrice": "39,90",
          "discount": "77% OFF",
          "savings": "R$ 135,10",
          "limitedOffer": true
        },
        "finalCtaText": "Garantir Minha Transformação",
        "finalCtaIcon": "ShoppingCart",
        "finalCtaUrl": "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
        "containerWidth": "full",
        "spacing": "large"
      }
    },
    {
      "id": "guarantee-section",
      "type": "offer-guarantee-section",
      "order": 5,
      "content": {},
      "properties": {
        "title": "7 Dias de Garantia",
        "description": "Se não ficar satisfeita, devolvemos **100% do seu dinheiro**. Sem perguntas.",
        "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744916216/C%C3%B3pia_de_01._P%C3%A1gina_-_Produto_de_Entrada_2_hamaox.webp",
        "imageAlt": "Garantia 7 dias",
        "imageWidth": 200,
        "imageHeight": 200,
        "layout": "centered",
        "containerWidth": "full",
        "spacing": "large"
      }
    },
    {
      "id": "faq-section",
      "type": "offer-faq-section",
      "order": 6,
      "content": {},
      "properties": {
        "title": "Perguntas Frequentes",
        "questions": [
          {
            "question": "Quanto tempo leva para fazer o quiz?",
            "answer": "O quiz leva apenas alguns minutos para ser completado. São perguntas simples e objetivas sobre suas preferências e estilo de vida."
          },
          {
            "question": "Como recebo os materiais após a compra?",
            "answer": "Imediatamente após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso a todos os materiais."
          },
          {
            "question": "Os guias servem para qualquer tipo físico?",
            "answer": "Sim! Os guias foram desenvolvidos considerando a diversidade de tipos físicos. O mais importante é o seu estilo predominante, e as orientações são adaptáveis para valorizar seu corpo único."
          },
          {
            "question": "Preciso ter conhecimento prévio sobre moda?",
            "answer": "Não! Os guias foram criados justamente para quem quer aprender do zero ou aprimorar seus conhecimentos sobre estilo pessoal. Tudo é explicado de forma clara e didática."
          },
          {
            "question": "Posso acessar os materiais pelo celular?",
            "answer": "Sim! Todos os materiais são digitais e podem ser acessados por qualquer dispositivo: computador, tablet ou smartphone."
          },
          {
            "question": "E se eu não gostar do conteúdo?",
            "answer": "Você tem 7 dias de garantia incondicional. Se não ficar satisfeita, basta solicitar o reembolso e devolveremos 100% do seu investimento."
          },
          {
            "question": "Quanto tempo terei acesso aos materiais?",
            "answer": "O acesso é vitalício! Você poderá consultar os guias sempre que precisar, sem prazo de expiração."
          },
          {
            "question": "Os guias funcionam para qualquer idade?",
            "answer": "Absolutamente! Os princípios de estilo pessoal são atemporais e adaptáveis para mulheres de todas as idades. O importante é expressar sua essência, independente da sua fase de vida."
          }
        ],
        "containerWidth": "full",
        "spacing": "large"
      }
    }
  ],
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
