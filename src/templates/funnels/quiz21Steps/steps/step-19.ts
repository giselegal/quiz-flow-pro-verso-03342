/**
 * 🎯 STEP 19 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step19: Block[] = [
    {
      "id": "transition-hero-19",
      "type": "transition-hero",
      "order": 0,
      "properties": {
        "backgroundColor": "#FAF9F7",
        "textColor": "#432818",
        "padding": 32,
        "type": "scale",
        "duration": 500,
        "delay": 0,
        "easing": "ease-out"
      },
      "content": {
        "title": "Obrigada por compartilhar.",
        "subtitle": "Preparando seu resultado personalizado",
        "message": "Em instantes você descobrirá qual estilo te representa e como valorizar sua essência!",
        "autoAdvanceDelay": 3000
      }
    },
    {
      "id": "step-19-transition-text",
      "type": "transition-text",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300
      },
      "content": {}
    },
    {
      "id": "step-19-transition-cta",
      "type": "button",
      "order": 2,
      "properties": {},
      "content": {
        "label": "...",
        "variant": "outline",
        "size": "small"
      }
    }
  ];

export default step19;
