/**
 * 🎯 TEMPLATE COMPLETO - QUIZ DE ESTILO PESSOAL (21 ETAPAS)
 * 
 * Este template contém a configuração completa do quiz de estilo com:
 * - Etapa 1: Coleta de nome
 * - Etapas 2-11: 10 questões pontuadas (3 seleções obrigatórias)
 * - Etapa 12: Transição para questões estratégicas
 * - Etapas 13-18: 6 questões estratégicas (1 seleção obrigatória)
 * - Etapa 19: Transição para resultado
 * - Etapa 20: Página de resultado personalizada
 * - Etapa 21: Página de oferta
 */

import { Block } from '@/types/editor';

export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = {
  // 🎯 ETAPA 1: COLETA DO NOME
  'step-1': [
    {
      id: 'step1-quiz-header',
      type: 'quiz-intro-header',
      order: 0,
      content: {
        title: 'Descubra seu Estilo Predominante',
        subtitle: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',
        description: 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.'
      },
      properties: {
        backgroundColor: '#F8F9FA',
        textAlign: 'center',
        showBackground: true
      }
    },
    {
      id: 'step1-lead-form',
      type: 'form-container',
      order: 1,
      content: {
        title: 'NOME',
        placeholder: 'Digite seu nome',
        buttonText: 'Quero Descobrir meu Estilo Agora!'
      },
      properties: {
        requiredMessage: 'Por favor, digite seu nome para continuar',
        validationMessage: 'Digite seu nome para continuar',
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        fieldType: 'text',
        required: true,
        autoAdvanceOnComplete: true,
        dataKey: 'userName'
      }
    },
    {
      id: 'step1-privacy-text',
      type: 'text',
      order: 2,
      content: {
        text: 'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade'
      },
      properties: {
        fontSize: '12px',
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 16
      }
    },
    {
      id: 'step1-footer',
      type: 'text',
      order: 3,
      content: {
        text: '2025 - Gisele Galvão - Todos os direitos reservados'
      },
      properties: {
        fontSize: '12px',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 24
      }
    }
  ],

  // 🎯 ETAPA 2: QUESTÃO 1 - TIPO DE ROUPA FAVORITA
  'step-2': [
    {
      id: 'step2-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        options: [
          {
            id: 'natural_q1',
            text: 'Conforto, leveza e praticidade no vestir',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp'
          },
          {
            id: 'classico_q1',
            text: 'Discrição, caimento clássico e sobriedade',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp'
          },
          {
            id: 'contemporaneo_q1',
            text: 'Praticidade com um toque de estilo atual',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp'
          },
          {
            id: 'elegante_q1',
            text: 'Elegância refinada, moderna e sem exageros',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp'
          },
          {
            id: 'romantico_q1',
            text: 'Delicadeza em tecidos suaves e fluidos',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp'
          },
          {
            id: 'sexy_q1',
            text: 'Sensualidade com destaque para o corpo',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp'
          },
          {
            id: 'dramatico_q1',
            text: 'Impacto visual com peças estruturadas e assimétricas',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp'
          },
          {
            id: 'criativo_q1',
            text: 'Mix criativo com formas ousadas e originais',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp'
          }
        ]
      },
      properties: {
        questionId: 'q1_roupa_favorita',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true
      }
    }
  ],

  // 🎯 ETAPA 4: QUESTÃO 3 - QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
  'step-4': [
    {
      id: 'step4-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        options: [
          {
            id: 'natural_q3',
            text: 'Visual leve, despojado e natural',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'
          },
          {
            id: 'classico_q3',
            text: 'Visual clássico e tradicional',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp'
          },
          {
            id: 'contemporaneo_q3',
            text: 'Visual casual com toque atual',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp'
          },
          {
            id: 'elegante_q3',
            text: 'Visual refinado e imponente',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp'
          },
          {
            id: 'romantico_q3',
            text: 'Visual romântico, feminino e delicado',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp'
          },
          {
            id: 'sexy_q3',
            text: 'Visual sensual, com saia justa e decote',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp'
          },
          {
            id: 'dramatico_q3',
            text: 'Visual marcante e urbano (jeans + jaqueta)',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp'
          },
          {
            id: 'criativo_q3',
            text: 'Visual criativo, colorido e ousado',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp'
          }
        ]
      },
      properties: {
        questionId: 'q3_visual_identificacao',
        showImages: true,
        imageSize: 'custom',
        imageWidth: 300,
        imageHeight: 300,
        columns: 2,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'border',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 16,
        responsiveColumns: true
      }
    }
  ],

  // 🎯 ETAPA 5: QUESTÃO 4 - QUAIS DETALHES VOCÊ GOSTA?
  'step-5': [
    {
      id: 'step5-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'QUAIS DETALHES VOCÊ GOSTA?',
        options: [
          {
            id: 'natural_q4',
            text: 'Poucos detalhes, básico e prático'
          },
          {
            id: 'classico_q4',
            text: 'Bem discretos e sutis, clean e clássico'
          },
          {
            id: 'contemporaneo_q4',
            text: 'Básico, mas com um toque de estilo'
          },
          {
            id: 'elegante_q4',
            text: 'Detalhes refinados, chic e que deem status'
          },
          {
            id: 'romantico_q4',
            text: 'Detalhes delicados, laços, babados'
          },
          {
            id: 'sexy_q4',
            text: 'Roupas que valorizem meu corpo: couro, zíper, fendas'
          },
          {
            id: 'dramatico_q4',
            text: 'Detalhes marcantes, firmeza e peso'
          },
          {
            id: 'criativo_q4',
            text: 'Detalhes diferentes do convencional, produções ousadas'
          }
        ]
      },
      properties: {
        questionId: 'q4_detalhes',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false
      }
    }
  ],

  // 🎯 ETAPA 3: QUESTÃO 2 - PERSONALIDADE
  'step-3': [
    {
      id: 'step3-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: 'RESUMA A SUA PERSONALIDADE:',
        options: [
          {
            id: 'natural_q2',
            text: 'Informal, espontânea, alegre, essencialista'
          },
          {
            id: 'classico_q2',
            text: 'Conservadora, séria, organizada'
          },
          {
            id: 'contemporaneo_q2',
            text: 'Informada, ativa, prática'
          },
          {
            id: 'elegante_q2',
            text: 'Exigente, sofisticada, seletiva'
          },
          {
            id: 'romantico_q2',
            text: 'Feminina, meiga, delicada, sensível'
          },
          {
            id: 'sexy_q2',
            text: 'Glamorosa, vaidosa, sensual'
          },
          {
            id: 'dramatico_q2',
            text: 'Cosmopolita, moderna e audaciosa'
          },
          {
            id: 'criativo_q2',
            text: 'Exótica, aventureira, livre'
          }
        ]
      },
      properties: {
        questionId: 'q2_personalidade',
        showImages: false,
        columns: 1,
        requiredSelections: 3,
        maxSelections: 3,
        minSelections: 3,
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true,
        validationMessage: 'Selecione 3 opções para continuar',
        progressMessage: 'Você selecionou {count} de {required} opções',
        showSelectionCount: true,
        selectionStyle: 'background',
        selectedColor: '#3B82F6',
        hoverColor: '#EBF5FF',
        gridGap: 12,
        responsiveColumns: false
      }
    }
  ]

  // 🎯 CONTINUA... (implementarei todas as 21 etapas)
};

// Lista completa das questões do quiz
export const QUIZ_QUESTIONS_COMPLETE = {
  1: 'Coleta do nome',
  2: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
  3: 'RESUMA A SUA PERSONALIDADE:',
  4: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
  5: 'QUAIS DETALHES VOCÊ GOSTA?',
  6: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
  7: 'QUAL CASACO É SEU FAVORITO?',
  8: 'QUAL SUA CALÇA FAVORITA?',
  9: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
  10: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
  11: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
  12: 'Página de transição para questões estratégicas',
  13: 'Como você se vê hoje?',
  14: 'O que mais te desafia na hora de se vestir?',
  15: 'Com que frequência você se pega pensando: "Com que roupa eu vou?"',
  16: 'Pense no quanto você já gastou com roupas que não usa...',
  17: 'Se esse conteúdo completo custasse R$ 97,00...',
  18: 'Qual desses resultados você mais gostaria de alcançar?',
  19: 'Página de transição para resultado',
  20: 'Página de resultado personalizada',
  21: 'Página de oferta direta'
};

export default QUIZ_STYLE_21_STEPS_TEMPLATE;
