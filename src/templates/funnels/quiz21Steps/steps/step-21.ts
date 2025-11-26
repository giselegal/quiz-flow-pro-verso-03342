/**
 * 🎯 STEP 21 - Auto-gerado pela migração
 * 
 * Migrado de: src/templates/quiz21StepsComplete.ts
 */

import type { Block } from '../../../schemas';

export const step21: Block[] = [
    {
      "id": "offer-hero-21",
      "type": "offer-hero",
      "order": 0,
      "properties": {
        "type": "scale",
        "duration": 500
      },
      "content": {
        "title": "{userName}, Transforme Seu Guarda-Roupa e Sua Confiança Hoje!",
        "subtitle": "Oferta exclusiva para quem completou o quiz de estilo",
        "description": "Descubra como valorizar seu estilo único e se sentir confiante em qualquer ocasião com o método exclusivo 5 Passos.",
        "urgencyMessage": "Oferta por tempo limitado!"
      }
    },
    {
      "id": "pricing-21",
      "type": "pricing",
      "order": 1,
      "properties": {
        "type": "slideUp",
        "duration": 500
      },
      "content": {
        "pricing": {
          "originalPrice": 447,
          "salePrice": 97,
          "currency": "R$",
          "installments": {
            "count": 8,
            "value": 14.11
          }
        },
        "title": "Investimento que Transforma",
        "ctaText": "Quero Transformar Meu Estilo Agora!",
        "ctaUrl": "https://pay.kiwify.com.br/DkYC1Aj"
      }
    }
  ];

export default step21;
