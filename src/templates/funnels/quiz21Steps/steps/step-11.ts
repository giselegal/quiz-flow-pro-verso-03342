/**
 * 🎯 STEP 11 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step11: Block[] = [
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
      }
    },
    {
      "id": "step-11-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES..."
      }
    },
    {
      "id": "question-hero-11",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
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
      }
    },
    {
      "id": "options-grid-11",
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
      }
    },
    {
      "id": "navigation-step-11",
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

export default step11;
