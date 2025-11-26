/**
 * 🎯 STEP 3 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step3: Block[] = [
    {
      "id": "progress-bar-step-03",
      "type": "question-progress",
      "order": 0,
      "properties": {
        "padding": 8
      },
      "content": {
        "stepNumber": 3,
        "totalSteps": 21,
        "showPercentage": true,
        "barColor": "#B89B7A",
        "backgroundColor": "#e5e7eb"
      }
    },
    {
      "id": "step-03-title",
      "type": "question-title",
      "order": 1,
      "properties": {
        "backgroundColor": "transparent",
        "padding": 16,
        "type": "fade",
        "duration": 300
      },
      "content": {
        "text": "Pergunta 2 de 10"
      }
    },
    {
      "id": "options-grid-03",
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
            "text": "Informal, espontânea, alegre, essencialista",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Conservadora, séria, organizada",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Informada, ativa, prática",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Exigente, sofisticada, seletiva",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Feminina, meiga, delicada, sensível",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Glamorosa, vaidosa, sensual",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Cosmopolita, moderna e audaciosa",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Exótica, aventureira, livre",
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
      "id": "navigation-step-03",
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

export default step3;
