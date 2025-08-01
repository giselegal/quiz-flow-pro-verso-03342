import React from 'react';
export interface Step05TemplateProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step05Template: React.FC<Step05TemplateProps> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-05-template">
      {/* Conteúdo da Etapa 5 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 5 - QUESTÃO 5: QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
export const getStep05Template = () => {
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
            text: "Sem estampas, prefiro liso",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/21_liso_natural.webp",
            value: "5a", 
            category: "Natural", 
            styleCategory: "Natural", 
            points: 1 
          },
          { 
            id: "5b", 
            text: "Listras clássicas e discretas",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/22_listras_classico.webp",
            value: "5b", 
            category: "Clássico", 
            styleCategory: "Clássico", 
            points: 1 
          },
          { 
            id: "5c", 
            text: "Estampas geométricas modernas",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/23_geometrico_contemporaneo.webp",
            value: "5c", 
            category: "Contemporâneo", 
            styleCategory: "Contemporâneo", 
            points: 1 
          },
          { 
            id: "5d", 
            text: "Estampas sofisticadas e elegantes",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/24_sofisticado_elegante.webp",
            value: "5d", 
            category: "Elegante", 
            styleCategory: "Elegante", 
            points: 1 
          },
          { 
            id: "5e", 
            text: "Estampas florais delicadas",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/25_floral_romantico.webp",
            value: "5e", 
            category: "Romântico", 
            styleCategory: "Romântico", 
            points: 1 
          },
          { 
            id: "5f", 
            text: "Animal print e estampas marcantes",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/26_animal_print_sexy.webp",
            value: "5f", 
            category: "Sexy", 
            styleCategory: "Sexy", 
            points: 1 
          },
          { 
            id: "5g", 
            text: "Estampas grandes e impactantes",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/27_impactante_dramatico.webp",
            value: "5g", 
            category: "Dramático", 
            styleCategory: "Dramático", 
            points: 1 
          },
          { 
            id: "5h", 
            text: "Estampas únicas e diferentes",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/28_unico_criativo.webp",
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
        autoAdvanceOnComplete: false,
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

export default getStep05Template;
