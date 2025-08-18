import fs from 'fs/promises';

const QUESTIONS = [
  {
    step: 5,
    title: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    options: [
      {
        id: 'natural_q5',
        text: 'Estampas clean, com poucas informações',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
      },
      {
        id: 'classico_q5',
        text: 'Estampas clássicas e atemporais',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
      },
      {
        id: 'contemporaneo_q5',
        text: 'Atemporais, mas que tenham uma pegada de atual e moderna',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
      },
      {
        id: 'elegante_q5',
        text: 'Estampas clássicas e atemporais, mas sofisticadas',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
      },
      {
        id: 'romantico_q5',
        text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
      },
      {
        id: 'sexy_q5',
        text: 'Estampas de animal print, como onça, zebra e cobra',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
      },
      {
        id: 'dramatico_q5',
        text: 'Estampas geométricas, abstratas e exageradas como grandes poás',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
      },
      {
        id: 'criativo_q5',
        text: 'Estampas diferentes do usual, como africanas, xadrez grandes',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
      },
    ],
  },
  {
    step: 6,
    title: 'QUAL CASACO É SEU FAVORITO?',
    options: [
      {
        id: 'natural_q6',
        text: 'Cardigã bege confortável e casual',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp',
      },
      {
        id: 'classico_q6',
        text: 'Blazer verde estruturado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp',
      },
      {
        id: 'contemporaneo_q6',
        text: 'Trench coat bege tradicional',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp',
      },
      {
        id: 'elegante_q6',
        text: 'Blazer branco refinado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp',
      },
      {
        id: 'romantico_q6',
        text: 'Casaco pink vibrante e moderno',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp',
      },
      {
        id: 'sexy_q6',
        text: 'Jaqueta vinho de couro estilosa',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp',
      },
      {
        id: 'dramatico_q6',
        text: 'Jaqueta preta estilo rocker',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp',
      },
      {
        id: 'criativo_q6',
        text: 'Casaco estampado criativo e colorido',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp',
      },
    ],
  },
];

const generateQuestionBlock = question => {
  return `
  // 🎯 ETAPA ${question.step}: ${question.title}
  'step-${question.step}': [
    {
      id: 'step${question.step}-question',
      type: 'options-grid',
      order: 0,
      content: {
        question: '${question.title}',
        options: ${JSON.stringify(question.options, null, 2)}
      },
      properties: {
        questionId: 'q${question.step}_identifier',
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
`;
};

const blocks = QUESTIONS.map(q => generateQuestionBlock(q)).join('\n');

const template = `
export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = {
  ${blocks}
};
`;

await fs.writeFile('src/templates/quiz-steps-5-21.ts', template);
console.log('✅ Template gerado com sucesso!');
