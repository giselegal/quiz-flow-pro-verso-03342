/**
 * 🎯 STEP 2 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step2: Block[] = [
    {
      "id": "progress-bar-step-02",
      "type": "question-progress",
      "order": 0,
      "properties": {
        "padding": 8
      },
      "content": {
        "stepNumber": 2,
        "totalSteps": 21,
        "showPercentage": true,
        "barColor": "#B89B7A",
        "backgroundColor": "#e5e7eb"
      }
    },
    {
      "id": "step-02-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "backgroundColor": "transparent",
        "padding": 16,
        "type": "fade",
        "duration": 300
      },
      "content": {
        "text": "Pergunta 1 de 10",
        "subtitle": "QUAL O SEU TIPO DE ROUPA FAVORITA?"
      }
    },
    {
      "id": "step-02-options",
      "type": "options-grid",
      "order": 2,
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
            "text": "Conforto, leveza e praticidade no vestir",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp"
          },
          {
            "id": "classico",
            "text": "Discrição, caimento clássico e sobriedade",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp"
          },
          {
            "id": "contemporaneo",
            "text": "Praticidade com um toque de estilo atual",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp"
          },
          {
            "id": "elegante",
            "text": "Elegância refinada, moderna e sem exageros",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp"
          },
          {
            "id": "romantico",
            "text": "Delicadeza em tecidos suaves e fluidos",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp"
          },
          {
            "id": "sexy",
            "text": "Sensualidade com destaque para o corpo",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp"
          },
          {
            "id": "dramatico",
            "text": "Impacto visual com peças estruturadas e assimétricas",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp"
          },
          {
            "id": "criativo",
            "text": "Mix criativo com formas ousadas e originais",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp"
          }
        ],
        "columns": 2,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": true
      }
    },
    {
      "id": "navigation-step-02",
      "type": "question-navigation",
      "order": 3,
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

export default step2;
