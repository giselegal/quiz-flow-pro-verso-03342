/**
 * 🎯 STEP 17 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step17: Block[] = [
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
      }
    },
    {
      "id": "step-17-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?"
      }
    },
    {
      "id": "question-hero-17",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
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
      }
    },
    {
      "id": "options-grid-17",
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
      }
    },
    {
      "id": "navigation-step-17",
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

export default step17;
