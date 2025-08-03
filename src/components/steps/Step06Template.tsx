import React from 'react';

export interface Step07Question06Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step07Question06: React.FC<Step07Question06Props> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-07-question-06">
      {/* Conteúdo da Etapa 7 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 7 - QUESTÃO 6: QUAL CASACO É SEU FAVORITO?
export const getStep06Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 60,
        progressMax: 100,
        showBackButton: true
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'QUAL CASACO É SEU FAVORITO?',
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
        content: 'Questão 6 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
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
            text: "Cardigã bege confortável e casual", 
            value: "6a", 
            category: "Natural", 
            styleCategory: "Natural", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp'
          },
          { 
            id: "6b", 
            text: "Blazer clássico e elegante", 
            value: "6b", 
            category: "Clássico", 
            styleCategory: "Clássico", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735374/30_lbfjk5.webp'
          },
          { 
            id: "6c", 
            text: "Blazer moderno e atual", 
            value: "6c", 
            category: "Contemporâneo", 
            styleCategory: "Contemporâneo", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735375/31_d6xo3f.webp'
          },
          { 
            id: "6d", 
            text: "Casaco elegante e sofisticado", 
            value: "6d", 
            category: "Elegante", 
            styleCategory: "Elegante", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735376/32_dxhxon.webp'
          },
          { 
            id: "6e", 
            text: "Casaco rosa romântico e delicado", 
            value: "6e", 
            category: "Romântico", 
            styleCategory: "Romântico", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_ejhsra.webp'
          },
          { 
            id: "6f", 
            text: "Jaqueta vinho de couro estilosa", 
            value: "6f", 
            category: "Sexy", 
            styleCategory: "Sexy", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp'
          },
          { 
            id: "6g", 
            text: "Jaqueta preta estilo rocker", 
            value: "6g", 
            category: "Dramático", 
            styleCategory: "Dramático", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp'
          },
          { 
            id: "6h", 
            text: "Casaco estampado criativo e colorido", 
            value: "6h", 
            category: "Criativo", 
            styleCategory: "Criativo", 
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp'
          }
        ],
        columns: 2,
        showImages: true,
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

export default Step07Question06;
