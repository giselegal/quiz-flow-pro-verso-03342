/**
 * 🎯 STEP 10 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step10: Block[] = [
    {
      "id": "progress-bar-step-10",
      "type": "question-progress",
      "order": 0,
      "properties": {
        "padding": 8
      },
      "content": {
        "stepNumber": 10,
        "totalSteps": 21,
        "showPercentage": true,
        "barColor": "#B89B7A",
        "backgroundColor": "#e5e7eb"
      }
    },
    {
      "id": "step-10-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?"
      }
    },
    {
      "id": "question-hero-10",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "questionNumber": "9 de 10",
        "questionText": "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?",
        "currentQuestion": 9,
        "totalQuestions": 13,
        "progressValue": 48,
        "showProgress": true,
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão"
      }
    },
    {
      "id": "options-grid-10",
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
        "validationMessage": "Selecione 3 opções para continuar",
        "requiredSelections": 3
      }
    },
    {
      "id": "navigation-step-10",
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

export default step10;
