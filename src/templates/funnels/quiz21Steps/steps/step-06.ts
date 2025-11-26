/**
 * 🎯 STEP 6 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step6: Block[] = [
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
      }
    },
    {
      "id": "step-06-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?"
      }
    },
    {
      "id": "question-hero-06",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
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
      }
    },
    {
      "id": "options-grid-06",
      "type": "options-grid",
      "order": 3,
      "properties": {
        "type": "slideUp",
        "duration": 300,
        "delay": 100,
        "easing": "ease-out",
        "columns": 2,
        "gap": 16
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
      }
    },
    {
      "id": "navigation-step-06",
      "type": "question-navigation",
      "order": 4,
      "properties": {
        "showBack": true,
        "showNext": true,
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar",
        "backVariant": "outline",
        "nextVariant": "default"
      }
    }
  ];

export default step6;
