import React from 'react';

export interface Step04TemplateProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step04Template: React.FC<Step04TemplateProps> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-04-template">
      {/* Conteúdo da Etapa 4 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 4 - QUESTÃO 4: QUAIS DETALHES VOCÊ GOSTA?
export const getStep04Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 40,
        progressMax: 100,
        showBackButton: true
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'QUAIS DETALHES VOCÊ GOSTA?',
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
        content: 'Questão 4 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24
      }
    },
    {
      type: 'options-grid',
      properties: {
        questionId: 'q4',
        options: [
          { 
            id: "4a", 
            text: "Poucos detalhes, básico e prático", 
            value: "4a", 
            category: "Natural", 
            styleCategory: "Natural", 
            points: 1 
          },
          { 
            id: "4b", 
            text: "Bem discretos e sutis, clean e clássico", 
            value: "4b", 
            category: "Clássico", 
            styleCategory: "Clássico", 
            points: 1 
          },
          { 
            id: "4c", 
            text: "Básico, mas com um toque de estilo", 
            value: "4c", 
            category: "Contemporâneo", 
            styleCategory: "Contemporâneo", 
            points: 1 
          },
          { 
            id: "4d", 
            text: "Detalhes refinados, chic e que deem status", 
            value: "4d", 
            category: "Elegante", 
            styleCategory: "Elegante", 
            points: 1 
          },
          { 
            id: "4e", 
            text: "Detalhes delicados, laços, babados", 
            value: "4e", 
            category: "Romântico", 
            styleCategory: "Romântico", 
            points: 1 
          },
          { 
            id: "4f", 
            text: "Roupas que valorizem meu corpo: couro, zíper, fendas", 
            value: "4f", 
            category: "Sexy", 
            styleCategory: "Sexy", 
            points: 1 
          },
          { 
            id: "4g", 
            text: "Detalhes marcantes, firmeza e peso", 
            value: "4g", 
            category: "Dramático", 
            styleCategory: "Dramático", 
            points: 1 
          },
          { 
            id: "4h", 
            text: "Detalhes diferentes do convencional, produções ousadas", 
            value: "4h", 
            category: "Criativo", 
            styleCategory: "Criativo", 
            points: 1 
          }
        ],
        columns: 1,
        showImages: false,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 3,
        validationMessage: 'Selecione exatamente 3 opções',
        gridGap: 12,
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

export default getStep04Template;
