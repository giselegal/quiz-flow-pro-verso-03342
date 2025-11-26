/**
 * 🎯 STEP 13 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step13: Block[] = [
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
      }
    },
    {
      "id": "step-13-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?"
      }
    },
    {
      "id": "question-hero-13",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
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
      }
    },
    {
      "id": "options-grid-13",
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
      }
    },
    {
      "id": "navigation-step-13",
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

export default step13;
