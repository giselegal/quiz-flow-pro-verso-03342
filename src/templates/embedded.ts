/**
 * 🏗️ BUILD-TIME TEMPLATES EMBEDDED
 * 
 * Gerado automaticamente em: 2025-10-24T04:30:55.680Z
 * Total de steps: 21
 * Total de blocos: 124
 * 
 * ⚠️ NÃO EDITAR MANUALMENTE - executar: npm run build:templates
 */

export interface Block {
  id: string;
  type: string;
  order: number;
  properties: Record<string, any>;
  content: Record<string, any>;
  parentId?: string | null;
}

const embedded: Record<string, Block[]> = {
  "step-01": [
    {
      "id": "block-intro-header",
      "type": "quiz-intro-header",
      "order": 0,
      "properties": {},
      "content": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão - Consultoria de Estilo",
        "showProgress": false,
        "progressValue": 0
      },
      "parentId": null
    },
    {
      "id": "block-intro-title",
      "type": "text-inline",
      "order": 1,
      "properties": {
        "textAlign": "center",
        "fontSize": "text-2xl sm:text-3xl md:text-4xl",
        "fontWeight": "font-normal",
        "className": "text-[#432818]",
        "fontFamily": "\"Playfair Display\", serif"
      },
      "content": {
        "text": "<span style=\"color: #B89B7A; font-weight: 700;\">Chega</span> de um guarda-roupa lotado e da sensação de que <span style=\"color: #B89B7A; font-weight: 700;\">nada combina com você</span>."
      },
      "parentId": null
    },
    {
      "id": "block-intro-image",
      "type": "image-display-inline",
      "order": 2,
      "properties": {
        "src": "https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png",
        "alt": "Descubra seu estilo predominante",
        "maxWidth": "300px",
        "objectFit": "contain",
        "rounded": true
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "block-intro-description",
      "type": "text-inline",
      "order": 3,
      "properties": {
        "textAlign": "center",
        "fontSize": "text-sm md:text-base",
        "className": "text-gray-700"
      },
      "content": {
        "text": "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança."
      },
      "parentId": null
    },
    {
      "id": "block-intro-form",
      "type": "intro-form",
      "order": 4,
      "properties": {
        "label": "Antes de começarmos, como posso te chamar?",
        "placeholder": "Digite seu primeiro nome aqui...",
        "buttonText": "Quero Descobrir meu Estilo Agora!",
        "buttonVariant": "primary",
        "privacyNotice": "Seu nome é necessário para personalizar sua experiência."
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "block-footer-copyright",
      "type": "text-inline",
      "order": 5,
      "properties": {
        "textAlign": "center",
        "fontSize": "text-xs",
        "className": "text-gray-500 pt-6"
      },
      "content": {
        "text": "© {currentYear} Gisele Galvão - Todos os direitos reservados"
      },
      "parentId": null
    }
  ],
  "step-02": [
    {
      "id": "q2-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 1,
        "totalQuestions": 10,
        "progressValue": 10,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q2-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "1 de 10",
        "questionNumber": "1 de 10"
      },
      "parentId": null
    },
    {
      "id": "q2-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUAL O SEU TIPO DE ROUPA FAVORITA?"
      },
      "parentId": null
    },
    {
      "id": "q2-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-02",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "natural",
            "text": "Conforto, leveza e praticidade no vestir",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Discrição, caimento clássico e sobriedade",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Praticidade com um toque de estilo atual",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Elegância refinada, moderna e sem exageros",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Delicadeza em tecidos suaves e fluidos",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Sensualidade com destaque para o corpo",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Impacto visual com peças estruturadas e assimétricas",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Mix criativo com formas ousadas e originais",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "content": {
        "options": [
          {
            "id": "natural",
            "text": "Conforto, leveza e praticidade no vestir",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Discrição, caimento clássico e sobriedade",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Praticidade com um toque de estilo atual",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Elegância refinada, moderna e sem exageros",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Delicadeza em tecidos suaves e fluidos",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Sensualidade com destaque para o corpo",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Impacto visual com peças estruturadas e assimétricas",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Mix criativo com formas ousadas e originais",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
            "value": "criativo"
          }
        ],
        "columns": 2,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": true,
        "imageSize": 600,
        "autoAdvance": true,
        "autoAdvanceDelay": 1500,
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q2-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-03": [
    {
      "id": "q3-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 2,
        "totalQuestions": 10,
        "progressValue": 20,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q3-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "2 de 10",
        "questionNumber": "2 de 10"
      },
      "parentId": null
    },
    {
      "id": "q3-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "RESUMA A SUA PERSONALIDADE:"
      },
      "parentId": null
    },
    {
      "id": "q3-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-03",
      "type": "options-grid",
      "order": 4,
      "properties": {
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
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": true,
        "autoAdvanceDelay": 1500,
        "validationMessage": "Selecione 3 opções para continuar"
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
        "columns": 1,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": true,
        "autoAdvanceDelay": 1500,
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q3-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-04": [
    {
      "id": "q4-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 3,
        "totalQuestions": 10,
        "progressValue": 30,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q4-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "3 de 10",
        "questionNumber": "3 de 10"
      },
      "parentId": null
    },
    {
      "id": "q4-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?"
      },
      "parentId": null
    },
    {
      "id": "q4-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-04",
      "type": "options-grid",
      "order": 4,
      "properties": {
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
        "validationMessage": "Selecione 3 opções para continuar"
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q4-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-05": [
    {
      "id": "q5-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 4,
        "totalQuestions": 10,
        "progressValue": 40,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q5-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "4 de 10",
        "questionNumber": "4 de 10"
      },
      "parentId": null
    },
    {
      "id": "q5-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUAIS DETALHES VOCÊ GOSTA?"
      },
      "parentId": null
    },
    {
      "id": "q5-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-05",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "natural",
            "text": "Poucos detalhes, básico e prático",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Bem discretos e sutis, clean e clássico",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Básico, mas com um toque de estilo",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Detalhes refinados, chic e que deem status",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Detalhes delicados, laços, babados",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Roupas que valorizem meu corpo: couro, zíper, fendas",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Detalhes marcantes, firmeza e peso",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Detalhes diferentes do convencional, produções ousadas",
            "value": "criativo"
          }
        ],
        "columns": 1,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": true,
        "autoAdvanceDelay": 1500,
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "content": {
        "options": [
          {
            "id": "natural",
            "text": "Poucos detalhes, básico e prático",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Bem discretos e sutis, clean e clássico",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Básico, mas com um toque de estilo",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Detalhes refinados, chic e que deem status",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Detalhes delicados, laços, babados",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Roupas que valorizem meu corpo: couro, zíper, fendas",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Detalhes marcantes, firmeza e peso",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Detalhes diferentes do convencional, produções ousadas",
            "value": "criativo"
          }
        ],
        "columns": 1,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": true,
        "autoAdvanceDelay": 1500,
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q5-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-06": [
    {
      "id": "q6-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 5,
        "totalQuestions": 10,
        "progressValue": 50,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q6-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "5 de 10",
        "questionNumber": "5 de 10"
      },
      "parentId": null
    },
    {
      "id": "q6-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?"
      },
      "parentId": null
    },
    {
      "id": "q6-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-06",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "natural",
            "text": "Estampas clean, com poucas informações",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Estampas clássicas e atemporais",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Atemporais, mas que tenham uma pegada atual e moderna",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Estampas clássicas e atemporais, mas sofisticadas",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Estampas florais e/ou delicadas como bolinhas, borboletas e corações",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Estampas de animal print, como onça, zebra e cobra",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Estampas geométricas, abstratas e exageradas como grandes poás",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Estampas diferentes do usual, como africanas, xadrez grandes",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp",
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "content": {
        "options": [
          {
            "id": "natural",
            "text": "Estampas clean, com poucas informações",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Estampas clássicas e atemporais",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Atemporais, mas que tenham uma pegada atual e moderna",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Estampas clássicas e atemporais, mas sofisticadas",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Estampas florais e/ou delicadas como bolinhas, borboletas e corações",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Estampas de animal print, como onça, zebra e cobra",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Estampas geométricas, abstratas e exageradas como grandes poás",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Estampas diferentes do usual, como africanas, xadrez grandes",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp",
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q6-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-07": [
    {
      "id": "q7-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 6,
        "totalQuestions": 10,
        "progressValue": 60,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q7-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "6 de 10",
        "questionNumber": "6 de 10"
      },
      "parentId": null
    },
    {
      "id": "q7-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUAL CASACO É SEU FAVORITO?"
      },
      "parentId": null
    },
    {
      "id": "q7-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-07",
      "type": "options-grid",
      "order": 4,
      "properties": {
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
        "validationMessage": "Selecione 3 opções para continuar"
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q7-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-08": [
    {
      "id": "q8-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 7,
        "totalQuestions": 10,
        "progressValue": 70,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q8-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "7 de 10",
        "questionNumber": "7 de 10"
      },
      "parentId": null
    },
    {
      "id": "q8-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUAL SUA CALÇA FAVORITA?"
      },
      "parentId": null
    },
    {
      "id": "q8-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-08",
      "type": "options-grid",
      "order": 4,
      "properties": {
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
        "validationMessage": "Selecione 3 opções para continuar"
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q8-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-09": [
    {
      "id": "q9-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 8,
        "totalQuestions": 10,
        "progressValue": 80,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q9-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "8 de 10",
        "questionNumber": "8 de 10"
      },
      "parentId": null
    },
    {
      "id": "q9-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?"
      },
      "parentId": null
    },
    {
      "id": "q9-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-09",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "natural",
            "text": "Tênis nude casual e confortável",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Scarpin nude de salto baixo",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Sandália dourada com salto bloco",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Scarpin nude salto alto e fino",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Sandália anabela off white",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Sandália rosa de tiras finas",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Scarpin preto moderno com vinil transparente",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Scarpin colorido estampado",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp",
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "content": {
        "options": [
          {
            "id": "natural",
            "text": "Tênis nude casual e confortável",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "Scarpin nude de salto baixo",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "Sandália dourada com salto bloco",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "Scarpin nude salto alto e fino",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "Sandália anabela off white",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/51_xbgntp.webp",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "Sandália rosa de tiras finas",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/52_edlp0e.webp",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "Scarpin preto moderno com vinil transparente",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/53_bfdp6f.webp",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "Scarpin colorido estampado",
            "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/54_xnilkc.webp",
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q9-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-10": [
    {
      "id": "q10-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 9,
        "totalQuestions": 10,
        "progressValue": 90,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q10-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "9 de 10",
        "questionNumber": "9 de 10"
      },
      "parentId": null
    },
    {
      "id": "q10-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?"
      },
      "parentId": null
    },
    {
      "id": "q10-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-10",
      "type": "options-grid",
      "order": 4,
      "properties": {
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
        "validationMessage": "Selecione 3 opções para continuar"
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
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q10-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-11": [
    {
      "id": "q11-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 10,
        "totalQuestions": 10,
        "progressValue": 100,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q11-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "10 de 10",
        "questionNumber": "10 de 10"
      },
      "parentId": null
    },
    {
      "id": "q11-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES..."
      },
      "parentId": null
    },
    {
      "id": "q11-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione exatamente 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-11",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "natural",
            "text": "São fáceis de cuidar",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "São de excelente qualidade",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "São fáceis de cuidar e modernos",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "São sofisticados",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "São delicados",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "São perfeitos ao meu corpo",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "São diferentes, e trazem um efeito para minha roupa",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "São exclusivos, criam identidade no look",
            "value": "criativo"
          }
        ],
        "columns": 1,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": true,
        "autoAdvanceDelay": 1500,
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "content": {
        "options": [
          {
            "id": "natural",
            "text": "São fáceis de cuidar",
            "value": "natural"
          },
          {
            "id": "classico",
            "text": "São de excelente qualidade",
            "value": "classico"
          },
          {
            "id": "contemporaneo",
            "text": "São fáceis de cuidar e modernos",
            "value": "contemporaneo"
          },
          {
            "id": "elegante",
            "text": "São sofisticados",
            "value": "elegante"
          },
          {
            "id": "romantico",
            "text": "São delicados",
            "value": "romantico"
          },
          {
            "id": "sexy",
            "text": "São perfeitos ao meu corpo",
            "value": "sexy"
          },
          {
            "id": "dramatico",
            "text": "São diferentes, e trazem um efeito para minha roupa",
            "value": "dramatico"
          },
          {
            "id": "criativo",
            "text": "São exclusivos, criam identidade no look",
            "value": "criativo"
          }
        ],
        "columns": 1,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": true,
        "autoAdvanceDelay": 1500,
        "validationMessage": "Selecione 3 opções para continuar"
      },
      "parentId": null
    },
    {
      "id": "q11-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-12": [
    {
      "id": "transition-hero-12",
      "type": "transition-hero",
      "order": 0,
      "properties": {},
      "content": {
        "title": "🕐 Enquanto calculamos o seu resultado...",
        "autoAdvanceDelay": 0
      },
      "parentId": null
    },
    {
      "id": "step-12-transition-text",
      "type": "text-inline",
      "order": 1,
      "properties": {},
      "content": {
        "text": "Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão."
      },
      "parentId": null
    },
    {
      "id": "step-12-transition-cta",
      "type": "CTAButton",
      "order": 2,
      "properties": {},
      "content": {
        "label": "Continuar",
        "href": "#next",
        "variant": "primary",
        "size": "medium"
      },
      "parentId": null
    }
  ],
  "step-13": [
    {
      "id": "q13-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 1,
        "totalQuestions": 6,
        "progressValue": 16,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q13-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "1 de 6",
        "questionNumber": "1 de 6"
      },
      "parentId": null
    },
    {
      "id": "q13-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?"
      },
      "parentId": null
    },
    {
      "id": "q13-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-13",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "desconectada",
            "text": "Me sinto desconectada da mulher que sou hoje",
            "value": "desconectada"
          },
          {
            "id": "duvidas",
            "text": "Tenho dúvidas sobre o que realmente me valoriza",
            "value": "duvidas"
          },
          {
            "id": "as-vezes-acerto",
            "text": "Às vezes acerto, às vezes erro",
            "value": "as-vezes-acerto"
          },
          {
            "id": "segura-evoluir",
            "text": "Me sinto segura, mas sei que posso evoluir",
            "value": "segura-evoluir"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "content": {
        "options": [
          {
            "id": "desconectada",
            "text": "Me sinto desconectada da mulher que sou hoje",
            "value": "desconectada"
          },
          {
            "id": "duvidas",
            "text": "Tenho dúvidas sobre o que realmente me valoriza",
            "value": "duvidas"
          },
          {
            "id": "as-vezes-acerto",
            "text": "Às vezes acerto, às vezes erro",
            "value": "as-vezes-acerto"
          },
          {
            "id": "segura-evoluir",
            "text": "Me sinto segura, mas sei que posso evoluir",
            "value": "segura-evoluir"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "q13-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-14": [
    {
      "id": "q14-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 2,
        "totalQuestions": 6,
        "progressValue": 33,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q14-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "2 de 6",
        "questionNumber": "2 de 6"
      },
      "parentId": null
    },
    {
      "id": "q14-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "O que mais te desafia na hora de se vestir?"
      },
      "parentId": null
    },
    {
      "id": "q14-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-14",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "combinar-pecas",
            "text": "Tenho peças, mas não sei como combiná-las",
            "value": "combinar-pecas"
          },
          {
            "id": "comprar-impulso",
            "text": "Compro por impulso e me arrependo depois",
            "value": "comprar-impulso"
          },
          {
            "id": "imagem-nao-reflete",
            "text": "Minha imagem não reflete quem eu sou",
            "value": "imagem-nao-reflete"
          },
          {
            "id": "perco-tempo",
            "text": "Perco tempo e acabo usando sempre os mesmos looks",
            "value": "perco-tempo"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "content": {
        "options": [
          {
            "id": "combinar-pecas",
            "text": "Tenho peças, mas não sei como combiná-las",
            "value": "combinar-pecas"
          },
          {
            "id": "comprar-impulso",
            "text": "Compro por impulso e me arrependo depois",
            "value": "comprar-impulso"
          },
          {
            "id": "imagem-nao-reflete",
            "text": "Minha imagem não reflete quem eu sou",
            "value": "imagem-nao-reflete"
          },
          {
            "id": "perco-tempo",
            "text": "Perco tempo e acabo usando sempre os mesmos looks",
            "value": "perco-tempo"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "q14-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-15": [
    {
      "id": "q15-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 3,
        "totalQuestions": 6,
        "progressValue": 50,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q15-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "3 de 6",
        "questionNumber": "3 de 6"
      },
      "parentId": null
    },
    {
      "id": "q15-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "Com que frequência você se pega pensando: \"Com que roupa eu vou?\" — mesmo com o guarda-roupa cheio?"
      },
      "parentId": null
    },
    {
      "id": "q15-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-15",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "quase-todos-dias",
            "text": "Quase todos os dias — é sempre uma indecisão",
            "value": "quase-todos-dias"
          },
          {
            "id": "compromissos-importantes",
            "text": "Sempre que tenho um compromisso importante",
            "value": "compromissos-importantes"
          },
          {
            "id": "as-vezes-limitada",
            "text": "Às vezes, mas me sinto limitada nas escolhas",
            "value": "as-vezes-limitada"
          },
          {
            "id": "raramente-segura",
            "text": "Raramente — já me sinto segura ao me vestir",
            "value": "raramente-segura"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "content": {
        "options": [
          {
            "id": "quase-todos-dias",
            "text": "Quase todos os dias — é sempre uma indecisão",
            "value": "quase-todos-dias"
          },
          {
            "id": "compromissos-importantes",
            "text": "Sempre que tenho um compromisso importante",
            "value": "compromissos-importantes"
          },
          {
            "id": "as-vezes-limitada",
            "text": "Às vezes, mas me sinto limitada nas escolhas",
            "value": "as-vezes-limitada"
          },
          {
            "id": "raramente-segura",
            "text": "Raramente — já me sinto segura ao me vestir",
            "value": "raramente-segura"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "q15-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-16": [
    {
      "id": "q16-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 4,
        "totalQuestions": 6,
        "progressValue": 66,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q16-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "4 de 6",
        "questionNumber": "4 de 6"
      },
      "parentId": null
    },
    {
      "id": "q16-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?"
      },
      "parentId": null
    },
    {
      "id": "q16-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-16",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "sim-quero",
            "text": "Sim! Se existisse algo assim, eu quero",
            "value": "sim-quero"
          },
          {
            "id": "sim-momento-certo",
            "text": "Sim, mas teria que ser no momento certo",
            "value": "sim-momento-certo"
          },
          {
            "id": "tenho-duvidas",
            "text": "Tenho dúvidas se funcionaria pra mim",
            "value": "tenho-duvidas"
          },
          {
            "id": "nao-prefiro-continuar",
            "text": "Não, prefiro continuar como estou",
            "value": "nao-prefiro-continuar"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "content": {
        "options": [
          {
            "id": "sim-quero",
            "text": "Sim! Se existisse algo assim, eu quero",
            "value": "sim-quero"
          },
          {
            "id": "sim-momento-certo",
            "text": "Sim, mas teria que ser no momento certo",
            "value": "sim-momento-certo"
          },
          {
            "id": "tenho-duvidas",
            "text": "Tenho dúvidas se funcionaria pra mim",
            "value": "tenho-duvidas"
          },
          {
            "id": "nao-prefiro-continuar",
            "text": "Não, prefiro continuar como estou",
            "value": "nao-prefiro-continuar"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "q16-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-17": [
    {
      "id": "q17-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 5,
        "totalQuestions": 6,
        "progressValue": 83,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q17-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "5 de 6",
        "questionNumber": "5 de 6"
      },
      "parentId": null
    },
    {
      "id": "q17-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "Você acredita que ter um passo a passo para alinhar seu estilo à sua essência pode acelerar sua transformação?"
      },
      "parentId": null
    },
    {
      "id": "q17-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-17",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "sim-totalmente",
            "text": "Sim! Sozinha é mais difícil manter consistência",
            "value": "sim-totalmente"
          },
          {
            "id": "sim-ajudaria",
            "text": "Sim, ter um método claro ajudaria muito",
            "value": "sim-ajudaria"
          },
          {
            "id": "talvez",
            "text": "Talvez — se for algo prático e fácil de aplicar",
            "value": "talvez"
          },
          {
            "id": "nao-pronta",
            "text": "Ainda não sei se estou pronta pra isso",
            "value": "nao-pronta"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "content": {
        "options": [
          {
            "id": "sim-totalmente",
            "text": "Sim! Sozinha é mais difícil manter consistência",
            "value": "sim-totalmente"
          },
          {
            "id": "sim-ajudaria",
            "text": "Sim, ter um método claro ajudaria muito",
            "value": "sim-ajudaria"
          },
          {
            "id": "talvez",
            "text": "Talvez — se for algo prático e fácil de aplicar",
            "value": "talvez"
          },
          {
            "id": "nao-pronta",
            "text": "Ainda não sei se estou pronta pra isso",
            "value": "nao-pronta"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "q17-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-18": [
    {
      "id": "q18-progress",
      "type": "question-progress",
      "order": 0,
      "properties": {},
      "content": {
        "currentQuestion": 6,
        "totalQuestions": 6,
        "progressValue": 100,
        "showProgress": true
      },
      "parentId": null
    },
    {
      "id": "q18-number",
      "type": "question-number",
      "order": 1,
      "properties": {},
      "content": {
        "text": "6 de 6",
        "questionNumber": "6 de 6"
      },
      "parentId": null
    },
    {
      "id": "q18-text",
      "type": "question-text",
      "order": 2,
      "properties": {},
      "content": {
        "text": "Se você tivesse o acompanhamento certo, qual dessas mudanças mais te faria sentir realizada?"
      },
      "parentId": null
    },
    {
      "id": "q18-instructions",
      "type": "question-instructions",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "options-grid-18",
      "type": "options-grid",
      "order": 4,
      "properties": {
        "options": [
          {
            "id": "seguranca-expressao",
            "text": "Ter segurança para expressar quem eu sou através da minha imagem",
            "value": "seguranca-expressao"
          },
          {
            "id": "confianca-presenca",
            "text": "Me sentir confiante e com presença em qualquer ambiente",
            "value": "confianca-presenca"
          },
          {
            "id": "clareza-estilo",
            "text": "Ter clareza sobre meu estilo e como usá-lo no dia a dia",
            "value": "clareza-estilo"
          },
          {
            "id": "guarda-roupa-intencional",
            "text": "Construir um guarda-roupa intencional que comunique minha essência",
            "value": "guarda-roupa-intencional"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "content": {
        "options": [
          {
            "id": "seguranca-expressao",
            "text": "Ter segurança para expressar quem eu sou através da minha imagem",
            "value": "seguranca-expressao"
          },
          {
            "id": "confianca-presenca",
            "text": "Me sentir confiante e com presença em qualquer ambiente",
            "value": "confianca-presenca"
          },
          {
            "id": "clareza-estilo",
            "text": "Ter clareza sobre meu estilo e como usá-lo no dia a dia",
            "value": "clareza-estilo"
          },
          {
            "id": "guarda-roupa-intencional",
            "text": "Construir um guarda-roupa intencional que comunique minha essência",
            "value": "guarda-roupa-intencional"
          }
        ],
        "columns": 1,
        "multipleSelection": false,
        "minSelections": 1,
        "maxSelections": 1,
        "showImages": false,
        "imageSize": 256,
        "autoAdvance": false,
        "autoAdvanceDelay": 0,
        "validationMessage": "Selecione 1 opção para continuar"
      },
      "parentId": null
    },
    {
      "id": "q18-navigation",
      "type": "question-navigation",
      "order": 5,
      "properties": {
        "showBack": true,
        "enableWhenValid": true
      },
      "content": {
        "backLabel": "Voltar",
        "nextLabel": "Avançar"
      },
      "parentId": null
    }
  ],
  "step-19": [
    {
      "id": "transition-hero-19",
      "type": "transition-hero",
      "order": 0,
      "properties": {},
      "content": {
        "title": "Você chegou até aqui — e isso já diz muito sobre você.",
        "subtitle": null,
        "message": null,
        "autoAdvanceDelay": 0
      },
      "parentId": null
    },
    {
      "id": "step-19-paragraph-1",
      "type": "text-inline",
      "order": 1,
      "properties": {},
      "content": {
        "text": "Poucas mulheres se permitem parar e olhar para si com tanta intenção. E o que vem agora é mais do que um simples resultado — é o início de uma nova forma de se enxergar."
      },
      "parentId": null
    },
    {
      "id": "step-19-paragraph-2",
      "type": "text-inline",
      "order": 2,
      "properties": {},
      "content": {
        "text": "Seu Estilo Predominante vai revelar muito sobre como você comunica sua essência ao mundo. Mas o mais importante é o que você vai fazer com essa descoberta."
      },
      "parentId": null
    },
    {
      "id": "step-19-paragraph-3",
      "type": "text-inline",
      "order": 3,
      "properties": {},
      "content": {
        "text": "Em seguida, você vai conhecer um caminho completo para aplicar o seu estilo na prática — com leveza, estratégia e propósito. Um método criado para transformar não só o seu guarda-roupa, mas também a forma como você se apresenta e se sente todos os dias."
      },
      "parentId": null
    },
    {
      "id": "step-19-cta-show-result",
      "type": "CTAButton",
      "order": 4,
      "properties": {},
      "content": {
        "label": "Ver meu resultado agora",
        "href": "#next",
        "variant": "primary",
        "size": "large"
      },
      "parentId": null
    }
  ],
  "step-20": [
    {
      "id": "result-calculation",
      "type": "ResultCalculationSection",
      "order": 0,
      "properties": {
        "calculationMethod": "weighted_sum",
        "scoreMapping": {
          "romantico": {
            "min": 0,
            "max": 100,
            "label": "Romântico"
          },
          "classico": {
            "min": 0,
            "max": 100,
            "label": "Clássico"
          },
          "moderno": {
            "min": 0,
            "max": 100,
            "label": "Moderno"
          },
          "criativo": {
            "min": 0,
            "max": 100,
            "label": "Criativo"
          },
          "dramatico": {
            "min": 0,
            "max": 100,
            "label": "Dramático"
          }
        },
        "resultLogic": {
          "winnerSelection": "highest_score",
          "tieBreaker": "secondary_scores",
          "minThreshold": 20
        },
        "leadCapture": {
          "id": "step20-form",
          "type": "lead-form",
          "position": 2,
          "properties": {
            "fields": [
              "name",
              "email",
              "phone"
            ],
            "submitText": "Receber Guia Gratuito",
            "containerWidth": "full",
            "spacing": "small"
          }
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "hero",
      "type": "HeroSection",
      "order": 2,
      "properties": {
        "showCelebration": true,
        "celebrationEmoji": "🎉",
        "celebrationAnimation": "bounce",
        "greetingFormat": "Olá, {userName}!",
        "titleFormat": "Seu Estilo Predominante é:",
        "styleNameDisplay": "{styleName}",
        "colors": {
          "greeting": "text",
          "greetingHighlight": "primary",
          "title": "secondary",
          "styleName": "primary"
        },
        "spacing": {
          "padding": "3rem 1.5rem",
          "marginBottom": "2.5rem"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "style-profile",
      "type": "StyleProfileSection",
      "order": 3,
      "properties": {
        "layout": "two-column",
        "imagePosition": "left",
        "showStyleImage": true,
        "styleImage": {
          "aspectRatio": "4/5",
          "showDecorations": true,
          "decorationColor": "primary",
          "fallbackEnabled": true
        },
        "showIntroText": true,
        "introText": {
          "enabled": true,
          "text": "Esse é o estilo que mais traduz a sua essência. Ele revela muito sobre como você se conecta com o mundo e a forma como expressa sua energia.",
          "style": "italic",
          "background": "primary/5",
          "borderLeft": true
        },
        "showDescription": true,
        "showTransitionText": true,
        "transitionText": "Mas lembre-se: você não é só um estilo.",
        "showProgressBars": true,
        "progressBars": {
          "topCount": 3,
          "showPercentage": true,
          "percentageFormat": "{percentage}%",
          "animationDelay": 200,
          "colors": {
            "primary": "primary to accent",
            "secondary": "primary/80 to accent/80",
            "tertiary": "primary/60 to accent/60"
          },
          "titleFormat": "Além do {primaryStyle}, você também tem traços de:"
        },
        "showKeywords": true,
        "keywords": {
          "title": "Palavras que te definem:",
          "tagColor": "primary",
          "tagStyle": "rounded-full"
        },
        "showPersuasiveQuestions": true,
        "persuasiveQuestions": {
          "title": "💭 Você já se perguntou...",
          "icon": "❓",
          "style": "italic",
          "background": "primary/5",
          "border": "primary/30"
        },
        "showClosingMessage": true,
        "closingMessage": {
          "text": "✨ É a mistura desses elementos que torna a sua imagem única.",
          "style": "italic",
          "fontWeight": "medium",
          "background": "gradient primary/10 to accent/10",
          "textAlign": "center"
        },
        "showGuideImage": true,
        "guideImage": {
          "position": "below",
          "aspectRatio": "4/5",
          "maxWidth": "28rem",
          "centered": true
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "cta-primary",
      "type": "CTAButton",
      "order": 4,
      "properties": {
        "text": "Quero Dominar Meu Estilo em 5 Passos",
        "icon": "ShoppingCart",
        "iconAnimation": "bounce-on-hover",
        "style": "gradient",
        "colors": {
          "from": "primary",
          "to": "accent"
        },
        "size": "large",
        "fullWidthMobile": true,
        "position": "after-questions",
        "showTransition": true,
        "transition": {
          "title": "💡 Decodifique sua Imagem de Sucesso em 5 Passos",
          "subtitle": "Método completo: Autoconhecimento + estratégia visual 👇",
          "background": "gradient primary/10 to accent/10",
          "border": "primary/20"
        },
        "analytics": {
          "eventName": "cta_primary_click",
          "category": "conversion",
          "label": "after_questions"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "transformation",
      "type": "TransformationSection",
      "order": 5,
      "properties": {
        "mainTitle": "Transforme Sua Imagem, Revele Sua Essência",
        "highlightWords": [
          "Revele Sua Essência"
        ],
        "highlightColor": "primary",
        "subtitle": "Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser.",
        "layout": "grid-2x2",
        "benefits": [
          {
            "icon": "🎯",
            "text": "Clareza de estilo para se vestir com facilidade todos os dias"
          },
          {
            "icon": "🎨",
            "text": "Cores e formas que comunicam quem você é e o que você quer"
          },
          {
            "icon": "💼",
            "text": "Imagem que chega primeiro: autoridade sem perder autenticidade"
          },
          {
            "icon": "👗",
            "text": "Guarda-roupa estratégico que conversa entre si"
          }
        ],
        "benefitStyle": {
          "background": "primary/5",
          "iconSize": "2xl",
          "textAlign": "left",
          "padding": "1rem"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "method-steps",
      "type": "MethodStepsSection",
      "order": 6,
      "properties": {
        "sectionTitle": "O que você vai aprender no Método 5 Passos",
        "steps": [
          {
            "number": 1,
            "icon": "🪞",
            "title": "Passo 1 — Estilo de Ser",
            "description": "Descubra seus 3 estilos predominantes e entenda como traduzir sua personalidade no vestir. Você vai aprender a reconhecer o que te representa e como alinhar sua imagem à sua essência — sem regras, apenas consciência."
          },
          {
            "number": 2,
            "icon": "🎨",
            "title": "Passo 2 — Cores",
            "description": "As cores são uma linguagem emocional. Você vai aprender como escolher tons que valorizam sua beleza natural, comunicar autoridade, leveza ou proximidade — e criar harmonia entre cor, textura e intenção."
          },
          {
            "number": 3,
            "icon": "🧍‍♀️",
            "title": "Passo 3 — Biotipo",
            "description": "Entenda as linhas e proporções do seu corpo e como se vestir para equilibrar formas, valorizar o que ama e acolher o que deseja transformar. Um olhar sem crítica, com amor e propósito."
          },
          {
            "number": 4,
            "icon": "🧹",
            "title": "Passo 4 — Detox do Guarda-Roupa",
            "description": "Um processo de autoconhecimento através do desapego. Você vai aprender a manter apenas o que faz sentido, o que representa a mulher que você é hoje — criando um espaço leve, organizado e inspirador."
          },
          {
            "number": 5,
            "icon": "👗",
            "title": "Passo 5 — Guarda-Roupa de Sucesso",
            "description": "O encerramento prático do método. Aqui você aprende a montar um guarda-roupa funcional e inteligente, com peças-chave, terceira peça, combinações rápidas e looks que comunicam confiança e autenticidade todos os dias."
          }
        ],
        "stepStyle": {
          "layout": "card",
          "background": "white",
          "border": "primary/20",
          "padding": "1.5rem",
          "iconColor": "primary",
          "titleColor": "secondary",
          "descriptionColor": "text"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "bonus",
      "type": "BonusSection",
      "order": 7,
      "properties": {
        "sectionTitle": "💎 Bônus Exclusivos",
        "items": [
          {
            "title": "Guia de Visagismo Facial (PDF)",
            "description": "Descubra os melhores cortes, cores e acessórios para realçar seu rosto.",
            "icon": "📄",
            "image": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp"
          },
          {
            "title": "Peças-Chave do Guarda-Roupa de Sucesso (PDF)",
            "description": "Lista completa e adaptável ao seu estilo.",
            "icon": "📄",
            "image": "https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Detox_Guarda-roupa_fnjehu.jpg"
          },
          {
            "title": "Inventário do Guarda-Roupa (Planilha)",
            "description": "Para manter tudo prático, leve e funcional.",
            "icon": "📊",
            "image": "https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Invent%C3%A1rio_do_Guada-Roupa_m92ilf.jpg"
          }
        ],
        "layout": "grid-3",
        "cardStyle": {
          "background": "primary/5",
          "border": "primary/20",
          "padding": "1.5rem"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "social-proof",
      "type": "SocialProofSection",
      "order": 8,
      "properties": {
        "sectionTitle": "Veja os Resultados de Quem Já Transformou Sua Imagem",
        "layout": "grid-3",
        "testimonials": [
          {
            "name": "Maria Silva",
            "role": "Advogada",
            "text": "Finalmente descobri como me vestir com elegância e profissionalismo. Meu guarda-roupa nunca fez tanto sentido!",
            "rating": 5,
            "image": null,
            "verified": true
          },
          {
            "name": "Ana Costa",
            "role": "Empresária",
            "text": "O método me ajudou a encontrar meu estilo pessoal. Agora me sinto confiante em qualquer ocasião.",
            "rating": 5,
            "image": null,
            "verified": true
          },
          {
            "name": "Julia Santos",
            "role": "Designer",
            "text": "Economizei muito dinheiro parando de comprar peças que não combinam comigo. Recomendo!",
            "rating": 5,
            "image": null,
            "verified": true
          }
        ],
        "cardStyle": {
          "background": "primary/5",
          "padding": "1.5rem",
          "showStars": true,
          "starColor": "primary"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "offer",
      "type": "OfferSection",
      "order": 9,
      "properties": {
        "layout": "centered-card",
        "maxWidth": "42rem",
        "showUrgency": false,
        "pricing": {
          "showOriginalPrice": true,
          "originalPrice": 447,
          "salePrice": 97,
          "installments": {
            "show": true,
            "count": 8,
            "value": 14.11
          },
          "discount": {
            "show": true,
            "percentage": 78,
            "label": "78% de desconto",
            "style": "badge",
            "color": "success"
          }
        },
        "includes": {
          "title": "O Que Você Recebe Hoje",
          "items": [
            {
              "icon": "✅",
              "text": "Acesso imediato às 31 aulas",
              "highlight": false
            },
            {
              "icon": "✅",
              "text": "Método completo 5 Passos",
              "highlight": true
            },
            {
              "icon": "✅",
              "text": "3 Bônus Exclusivos (PDFs + Planilha)",
              "highlight": false
            },
            {
              "icon": "✅",
              "text": "Garantia de 7 dias",
              "highlight": false
            }
          ]
        },
        "background": {
          "type": "gradient",
          "from": "primary/10",
          "to": "accent/5"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "cta-secondary",
      "type": "CTAButton",
      "order": 10,
      "properties": {
        "text": "Começar Minha Transformação Agora",
        "icon": "ShoppingCart",
        "iconAnimation": "bounce-on-hover",
        "style": "gradient",
        "colors": {
          "from": "primary",
          "to": "accent"
        },
        "size": "xlarge",
        "fullWidthMobile": true,
        "showTransition": false,
        "analytics": {
          "eventName": "cta_secondary_click",
          "category": "conversion",
          "label": "after_offer"
        }
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "guarantee",
      "type": "GuaranteeSection",
      "order": 11,
      "properties": {
        "days": 7,
        "icon": "🕊️",
        "title": "Garantia de Satisfação Total",
        "description": "Você tem 7 dias para experimentar o método. Se não fizer sentido pra você, o reembolso é simples e sem perguntas.",
        "badgeText": "Compra 100% Segura",
        "background": {
          "type": "solid",
          "color": "primary/5"
        },
        "border": {
          "show": true,
          "color": "primary/20"
        },
        "layout": "centered",
        "iconSize": "3xl"
      },
      "content": {},
      "parentId": null
    },
    {
      "id": "cta-final",
      "type": "CTAButton",
      "order": 12,
      "properties": {
        "text": "Garantir Minha Vaga com 7 Dias de Garantia",
        "icon": "ShoppingCart",
        "iconAnimation": "bounce-on-hover",
        "style": "gradient",
        "colors": {
          "from": "primary",
          "to": "accent"
        },
        "size": "large",
        "fullWidthMobile": true,
        "showTransition": false,
        "analytics": {
          "eventName": "cta_final_click",
          "category": "conversion",
          "label": "after_guarantee"
        }
      },
      "content": {},
      "parentId": null
    }
  ],
  "step-21": [
    {
      "id": "offer-hero-21",
      "type": "offer-hero",
      "order": 0,
      "properties": {},
      "content": {
        "title": "{userName}, Transforme Seu Guarda-Roupa e Sua Confiança Hoje!",
        "subtitle": "Oferta exclusiva para quem completou o quiz de estilo",
        "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "imageAlt": "5 Passos - Vista-se de Você",
        "description": "Descubra como valorizar seu estilo único e se sentir confiante em qualquer ocasião com o método exclusivo 5 Passos.",
        "urgencyMessage": "Oferta por tempo limitado!"
      },
      "parentId": null
    },
    {
      "id": "pricing-21",
      "type": "pricing",
      "order": 1,
      "properties": {},
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
        "subtitle": "Desconto exclusivo para participantes do quiz",
        "ctaText": "Quero Transformar Meu Estilo Agora!",
        "ctaUrl": "https://pay.kiwify.com.br/DkYC1Aj",
        "features": [
          "✓ 5 módulos completos sobre estilo pessoal",
          "✓ Acesso vitalício ao conteúdo",
          "✓ Suporte direto com Gisele Galvão",
          "✓ Materiais bônus exclusivos",
          "✓ Comunidade privada de alunas",
          "✓ Certificado de conclusão",
          "✓ Garantia de 7 dias"
        ]
      },
      "parentId": null
    }
  ]
};

export { embedded };
export default embedded;
