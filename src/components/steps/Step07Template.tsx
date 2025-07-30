import React from 'react';

export interface Step07TemplateProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step07Template: React.FC<Step07TemplateProps> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-07-template">
      {/* Conteúdo da Etapa 7 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 7 - QUESTÃO 7: QUAL SUA CALÇA FAVORITA?
export const getStep07Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 70,
        progressMax: 100,
        showBackButton: true
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'QUAL SUA CALÇA FAVORITA?',
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
        content: 'Questão 7 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24
      }
    },
    {
      type: 'options-grid',
      properties: {
        questionId: 'q7',
        options: [
          { 
            id: "7a", 
            text: "Jeans reto e confortável",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735383/36_e17jrn.webp",
            value: "7a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1
          },
          { 
            id: "7b", 
            text: "Calça social clássica",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735383/37_ipqpqu.webp",
            value: "7b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1
          },
          { 
            id: "7c", 
            text: "Calça de alfaiataria moderna",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735384/38_w3cz9j.webp",
            value: "7c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1
          },
          { 
            id: "7d", 
            text: "Calça de alfaiataria premium",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735384/39_jaxnnn.webp",
            value: "7d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1
          },
          { 
            id: "7e", 
            text: "Calça com detalhes femininos",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735385/40_mgabrr.webp",
            value: "7e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1
          },
          { 
            id: "7f", 
            text: "Calça justa e marcada",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735385/41_sgl8vf.webp",
            value: "7f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1
          },
          { 
            id: "7g", 
            text: "Calça de cintura alta e estruturada",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735386/42_rjmr3s.webp",
            value: "7g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1
          },
          { 
            id: "7h", 
            text: "Calça diferente e única",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735386/43_k4e7t6.webp",
            value: "7h",
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
        minSelections: 3,
        validationMessage: 'Selecione exatamente 3 opções',
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
        marginBottom: 24
      }
    },
    {
      type: 'options-grid',
      properties: {
        questionId: 'q6',
        options: [
          { 
            id: "6a", 
            text: "Jennifer Aniston - Casual, natural, sem complicação", 
            value: "6a", 
            category: "Casual Natural", 
            styleCategory: "Natural", 
            points: 1 
          },
          { 
            id: "6b", 
            text: "Kate Middleton - Elegante, tradicional, refinada", 
            value: "6b", 
            category: "Elegância Real", 
            styleCategory: "Clássico", 
            points: 1 
          },
          { 
            id: "6c", 
            text: "Emma Stone - Moderna, versátil, jovial", 
            value: "6c", 
            category: "Moderna Jovial", 
            styleCategory: "Contemporâneo", 
            points: 1 
          },
          { 
            id: "6d", 
            text: "Cate Blanchett - Sofisticada, minimalista, luxuosa", 
            value: "6d", 
            category: "Sofisticação", 
            styleCategory: "Elegante", 
            points: 1 
          },
          { 
            id: "6e", 
            text: "Blake Lively - Romântica, feminina, delicada", 
            value: "6e", 
            category: "Romance", 
            styleCategory: "Romântico", 
            points: 1 
          },
          { 
            id: "6f", 
            text: "Scarlett Johansson - Glamorosa, sensual, marcante", 
            value: "6f", 
            category: "Glamour", 
            styleCategory: "Sexy", 
            points: 1 
          },
          { 
            id: "6g", 
            text: "Tilda Swinton - Avant-garde, geométrica, impactante", 
            value: "6g", 
            category: "Vanguarda", 
            styleCategory: "Dramático", 
            points: 1 
          },
          { 
            id: "6h", 
            text: "Helena Bonham Carter - Excêntrica, artística, única", 
            value: "6h", 
            category: "Arte", 
            styleCategory: "Criativo", 
            points: 1 
          }
        ],
        columns: 1,
        showImages: false,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: 'Selecione até 3 opções',
        gridGap: 12,
        responsiveColumns: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 800,
        requiredSelections: 1,
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

export default getStep07Template;
