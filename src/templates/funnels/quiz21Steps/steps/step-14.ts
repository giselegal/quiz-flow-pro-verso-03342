/**
 * 🎯 STEP 14 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step14: Block[] = [
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
      }
    },
    {
      "id": "step-14-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "O que mais te desafia na hora de se vestir?"
      }
    },
    {
      "id": "question-hero-14",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
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
      }
    },
    {
      "id": "options-grid-14",
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
      }
    },
    {
      "id": "navigation-step-14",
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
        "nextLabel": "Continuar",
        "backVariant": "outline",
        "nextVariant": "default"
      }
    }
  ];

export default step14;
