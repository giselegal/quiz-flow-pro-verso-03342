/**
 * 🎯 STEP 4 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step4: Block[] = [
    {
      "id": "progress-bar-step-04",
      "type": "question-progress",
      "order": 0,
      "properties": {
        "padding": 8
      },
      "content": {
        "stepNumber": 4,
        "totalSteps": 21,
        "showPercentage": true,
        "barColor": "#B89B7A",
        "backgroundColor": "#e5e7eb"
      }
    },
    {
      "id": "step-04-question-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300,
        "padding": 16
      },
      "content": {
        "text": "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?"
      }
    },
    {
      "id": "question-hero-04",
      "type": "question-hero",
      "order": 2,
      "properties": {
        "backgroundColor": "transparent",
        "padding": 16,
        "type": "fade",
        "duration": 300,
        "delay": 0,
        "easing": "ease-out"
      },
      "content": {
        "questionNumber": "3 de 10",
        "questionText": "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
        "currentQuestion": 3,
        "totalQuestions": 13,
        "progressValue": 19,
        "showProgress": true,
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão"
      }
    },
    {
      "id": "options-grid-04",
      "type": "options-grid",
      "order": 3,
      "properties": {
        "backgroundColor": "transparent",
        "padding": 16,
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
            "text": "Visual leve, despojado e natural",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Visual clássico e tradicional",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Visual casual com toque atual",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Visual refinado e imponente",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Visual romântico, feminino e delicado",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Visual sensual, com saia justa e decote",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Visual marcante e urbano (jeans + jaqueta)",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Visual criativo, colorido e ousado",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp",
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
      "id": "navigation-step-04",
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

export default step4;
