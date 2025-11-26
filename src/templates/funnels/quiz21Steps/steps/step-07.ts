/**
 * 🎯 STEP 7 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step7: Block[] = [
    {
      "id": "progress-bar-step-07",
      "type": "question-progress",
      "order": 0,
      "properties": {
        "padding": 8
      },
      "content": {
        "stepNumber": 7,
        "totalSteps": 21,
        "showPercentage": true,
        "barColor": "#B89B7A",
        "backgroundColor": "#e5e7eb"
      }
    },
    {
      "id": "step-07-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "QUAL CASACO É SEU FAVORITO?"
      }
    },
    {
      "id": "question-hero-07",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "questionNumber": "6 de 10",
        "questionText": "QUAL CASACO É SEU FAVORITO?",
        "currentQuestion": 6,
        "totalQuestions": 13,
        "progressValue": 33,
        "showProgress": true,
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão"
      }
    },
    {
      "id": "options-grid-07",
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
            "text": "Cardigã bege confortável e casual",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Blazer verde estruturado",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Trench coat bege tradicional",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Blazer branco refinado",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Casaco pink vibrante e moderno",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Jaqueta vinho de couro estilosa",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Jaqueta preta estilo rocker",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Casaco estampado criativo e colorido",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp",
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
      "id": "navigation-step-07",
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

export default step7;
