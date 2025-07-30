import React from 'react';

export interface Step06Question05Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step06Question05: React.FC<Step06Question05Props> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-06-question-05">
      {/* Conteúdo da Etapa 6 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 6 - QUESTÃO 5: ESTAMPAS (REAL)
export const getStep06Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 50,
        progressMax: 100,
        showBackButton: true
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
        level: 'h2',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 8
      }
    },
    {
      type: 'text-inline',
      properties: {
        content: 'Questão 5 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24
      }
    },
    {
      type: 'options-grid',
      properties: {
        questionId: 'q5',
        options: [
          { 
            id: "5a", 
            text: "Estampas clean, com poucas informações",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp",
            value: "5a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1
          },
          { 
            id: "5b", 
            text: "Estampas clássicas e atemporais",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp",
            value: "5b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1
          },
          { 
            id: "5c", 
            text: "Atemporais, mas que tenham uma pegada de atual e moderna",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp",
            value: "5c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1
          },
          { 
            id: "5d", 
            text: "Estampas clássicas e atemporais, mas sofisticadas",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp",
            value: "5d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1
          },
          { 
            id: "5e", 
            text: "Estampas florais e/ou delicadas como bolinhas, borboletas e corações",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp",
            value: "5e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1
          },
          { 
            id: "5f", 
            text: "Estampas de animal print, como onça, zebra e cobra",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp",
            value: "5f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1
          },
          { 
            id: "5g", 
            text: "Estampas geométricas, abstratas e exageradas como grandes poás",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp",
            value: "5g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1
          },
          { 
            id: "5h", 
            text: "Estampas diferentes do usual, como africanas, xadrez grandes",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp",
            value: "5h",
            category: "Criativo",
            styleCategory: "Criativo",
            points: 1
          }
        ],
        columns: 2,
        showImages: true,
        imageSize: 'large',
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: 'Selecione até 3 opções',
        gridGap: 16,
        responsiveColumns: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 800,
        requiredSelections: 3,
        enableButtonOnlyWhenValid: true,
        showValidationFeedback: true
      }
    },
    {
      type: 'button-inline',
      properties: {
        text: 'Continuar',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabled: true,
        requiresValidSelection: true
      }
    }
  ];
};

export default Step06Question05;
