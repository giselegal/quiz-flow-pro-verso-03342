/**
 * 🎯 STEP 12 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step12: Block[] = [
    {
      "id": "transition-hero-12",
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
        "title": "🕐 Enquanto calculamos o seu resultado...",
        "subtitle": "Estamos montando seu perfil de estilo personalizado",
        "message": "Continue para descobrir ainda mais sobre seu estilo único!",
        "autoAdvanceDelay": 3500,
        "description": "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão."
      }
    },
    {
      "id": "step-12-transition-text",
      "type": "transition-text",
      "order": 1,
      "properties": {
        "type": "fade",
        "duration": 300
      },
      "content": {
        "text": "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão."
      }
    },
    {
      "id": "step-12-transition-cta",
      "type": "button",
      "order": 2,
      "properties": {},
      "content": {
        "label": "Continuar",
        "href": "#next",
        "variant": "primary",
        "size": "medium"
      }
    }
  ];

export default step12;
