/**
 * 🎯 STEP 18 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step18: Block[] = [
    {
      "id": "progress-bar-step-18",
      "type": "question-progress",
      "order": 0,
      "properties": {
        "padding": 8
      },
      "content": {
        "stepNumber": 18,
        "totalSteps": 21,
        "showPercentage": true,
        "barColor": "#B89B7A",
        "backgroundColor": "#e5e7eb"
      }
    },
    {
      "id": "step-18-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "Qual desses resultados você mais gostaria de alcançar?"
      }
    },
    {
      "id": "question-hero-18",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "questionNumber": "Q16 - RESULTADO",
        "questionText": "Qual desses resultados você mais gostaria de alcançar?",
        "currentQuestion": 16,
        "totalQuestions": 13,
        "progressValue": 81,
        "showProgress": true,
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão"
      }
    },
    {
      "id": "options-grid-18",
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
            "id": "montar-looks-facilidade",
            "text": "Montar looks com mais facilidade e confiança",
            "value": "montar-looks-facilidade"
          },
          {
            "id": "usar-que-tenho",
            "text": "Usar o que já tenho e me sentir estilosa",
            "value": "usar-que-tenho"
          },
          {
            "id": "comprar-consciencia",
            "text": "Comprar com mais consciência e sem culpa",
            "value": "comprar-consciencia"
          },
          {
            "id": "ser-admirada",
            "text": "Ser admirada pela imagem que transmito",
            "value": "ser-admirada"
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
      "id": "navigation-step-18",
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

export default step18;
