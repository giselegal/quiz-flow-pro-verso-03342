/**
 * 🎯 STEP 8 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step8: Block[] = [
    {
      "id": "progress-bar-step-08",
      "type": "question-progress",
      "order": 0,
      "properties": {
        "padding": 8
      },
      "content": {
        "stepNumber": 8,
        "totalSteps": 21,
        "showPercentage": true,
        "barColor": "#B89B7A",
        "backgroundColor": "#e5e7eb"
      }
    },
    {
      "id": "step-08-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "QUAL SUA CALÇA FAVORITA?"
      }
    },
    {
      "id": "question-hero-08",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "questionNumber": "7 de 10",
        "questionText": "QUAL SUA CALÇA FAVORITA?",
        "currentQuestion": 7,
        "totalQuestions": 13,
        "progressValue": 38,
        "showProgress": true,
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão"
      }
    },
    {
      "id": "options-grid-08",
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
            "text": "Calça fluida acetinada bege",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Calça de alfaiataria cinza",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Jeans reto e básico",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Calça reta bege de tecido",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Calça ampla rosa alfaiatada",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Legging preta de couro",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Calça reta preta de couro",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Calça estampada floral leve e ampla",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp",
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
      "id": "navigation-step-08",
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

export default step8;
