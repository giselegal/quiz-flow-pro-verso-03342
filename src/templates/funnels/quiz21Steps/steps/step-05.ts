/**
 * 🎯 STEP 5 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step5: Block[] = [
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
      }
    },
    {
      "id": "step-05-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "QUAIS DETALHES VOCÊ GOSTA?"
      }
    },
    {
      "id": "question-hero-05",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
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
      }
    },
    {
      "id": "options-grid-05",
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
      }
    },
    {
      "id": "navigation-step-05",
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

export default step5;
