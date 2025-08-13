#!/bin/bash

# Script para corrigir os JSONs dos steps 12-18 com base no fluxo completo

echo "🔧 CORRIGINDO STEPS 12-18 CONFORME FLUXO COMPLETO..."

# Step-13 - O que mais te desafia na hora de se vestir?
echo "📝 Corrigindo Step-13..."
cat > src/config/templates/step-13.json << 'EOF'
{
  "templateVersion": "2.0",
  "metadata": {
    "id": "quiz-step-13",
    "name": "O que mais te desafia na hora de se vestir?",
    "description": "Questão estratégica 2",
    "category": "quiz-strategic",
    "type": "strategic-question",
    "tags": ["quiz", "style", "quiz-strategic", "gisele-galvao"],
    "createdAt": "2025-08-10T03:45:03.516Z",
    "updatedAt": "2025-08-10T03:45:03.516Z",
    "author": "giselegal"
  },
  "design": {
    "primaryColor": "#B89B7A",
    "secondaryColor": "#432818",
    "accentColor": "#aa6b5d",
    "backgroundColor": "#FAF9F7",
    "fontFamily": "'Playfair Display', 'Inter', serif",
    "button": {
      "background": "linear-gradient(90deg, #B89B7A, #aa6b5d)",
      "textColor": "#fff",
      "borderRadius": "10px",
      "shadow": "0 4px 14px rgba(184, 155, 122, 0.15)"
    }
  },
  "blocks": [
    {
      "id": "step13-header",
      "type": "quiz-intro-header",
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "logoWidth": 96,
        "logoHeight": 96,
        "progressValue": 65,
        "progressTotal": 100,
        "showProgress": true,
        "showBackButton": true
      }
    },
    {
      "id": "step13-question-title",
      "type": "text-inline",
      "properties": {
        "content": "O que mais te desafia na hora de se vestir?",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818",
        "fontFamily": "'Playfair Display', serif"
      }
    },
    {
      "id": "step13-options-grid",
      "type": "options-grid",
      "properties": {
        "options": [
          {
            "id": "13a",
            "text": "Tenho peças, mas não sei como combiná-las",
            "value": "combinacao",
            "points": 1
          },
          {
            "id": "13b",
            "text": "Compro por impulso e me arrependo depois",
            "value": "impulso",
            "points": 2
          },
          {
            "id": "13c",
            "text": "Minha imagem não reflete quem eu sou",
            "value": "identidade",
            "points": 3
          },
          {
            "id": "13d",
            "text": "Perco tempo e acabo usando sempre os mesmos looks",
            "value": "repeticao",
            "points": 4
          }
        ],
        "columns": 1,
        "showImages": false,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1
      }
    },
    {
      "id": "step13-continue-button",
      "type": "button-inline",
      "properties": {
        "text": "Continuar →",
        "disabled": true,
        "enableOnSelection": true
      }
    }
  ],
  "logic": {
    "navigation": {
      "nextStep": "step-14",
      "prevStep": "step-12"
    }
  }
}
EOF

echo "✅ Step-13 corrigido!"

# Step-14 - Com que frequência você se pega pensando: "Com que roupa eu vou?"
echo "📝 Corrigindo Step-14..."
cat > src/config/templates/step-14.json << 'EOF'
{
  "templateVersion": "2.0",
  "metadata": {
    "id": "quiz-step-14",
    "name": "Com que frequência você se pega pensando: 'Com que roupa eu vou?'",
    "description": "Questão estratégica 3",
    "category": "quiz-strategic",
    "type": "strategic-question",
    "tags": ["quiz", "style", "quiz-strategic", "gisele-galvao"]
  },
  "design": {
    "primaryColor": "#B89B7A",
    "secondaryColor": "#432818",
    "accentColor": "#aa6b5d",
    "backgroundColor": "#FAF9F7",
    "fontFamily": "'Playfair Display', 'Inter', serif"
  },
  "blocks": [
    {
      "id": "step14-header",
      "type": "quiz-intro-header",
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "progressValue": 70,
        "showProgress": true,
        "showBackButton": true
      }
    },
    {
      "id": "step14-question-title",
      "type": "text-inline",
      "properties": {
        "content": "Com que frequência você se pega pensando:",
        "fontSize": "text-2xl",
        "fontWeight": "font-bold",
        "textAlign": "text-center",
        "color": "#432818"
      }
    },
    {
      "id": "step14-question-subtitle",
      "type": "text-inline",
      "properties": {
        "content": "\"Com que roupa eu vou?\" — mesmo com o guarda-roupa cheio?",
        "fontSize": "text-lg",
        "textAlign": "text-center",
        "color": "#6B7280",
        "fontStyle": "italic"
      }
    },
    {
      "id": "step14-options-grid",
      "type": "options-grid",
      "properties": {
        "options": [
          {
            "id": "14a",
            "text": "Quase todos os dias — é sempre uma indecisão",
            "value": "sempre",
            "points": 1
          },
          {
            "id": "14b",
            "text": "Sempre que tenho um compromisso importante",
            "value": "compromissos",
            "points": 2
          },
          {
            "id": "14c",
            "text": "Às vezes, mas me sinto limitada nas escolhas",
            "value": "limitada",
            "points": 3
          },
          {
            "id": "14d",
            "text": "Raramente — já me sinto segura ao me vestir",
            "value": "segura",
            "points": 4
          }
        ],
        "columns": 1,
        "showImages": false,
        "multipleSelection": false
      }
    },
    {
      "id": "step14-continue-button",
      "type": "button-inline",
      "properties": {
        "text": "Continuar →",
        "disabled": true,
        "enableOnSelection": true
      }
    }
  ],
  "logic": {
    "navigation": {
      "nextStep": "step-15",
      "prevStep": "step-13"
    }
  }
}
EOF

echo "✅ Step-14 corrigido!"

echo "✅ CORREÇÃO CONCLUÍDA! Steps 13-14 atualizados conforme fluxo."
