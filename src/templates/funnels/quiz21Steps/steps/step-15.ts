/**
 * 🎯 STEP 15 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step15: Block[] = [
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
      }
    },
    {
      "id": "step-15-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "Com que frequência você se pega pensando: \"Com que roupa eu vou?\" — mesmo com o guarda-roupa cheio?"
      }
    },
    {
      "id": "question-hero-15",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
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
      }
    },
    {
      "id": "options-grid-15",
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
      }
    },
    {
      "id": "navigation-step-15",
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

export default step15;
