import React from 'react';

export interface Step06TemplateProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step06Template: React.FC<Step06TemplateProps> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-06-template">
      {/* Conteúdo da Etapa 6 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 6 - QUESTÃO 5: CORES FAVORITAS
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
        content: 'QUAIS CORES VOCÊ MAIS GOSTA DE USAR?',
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
            text: "Neutros: bege, branco, cáqui, marrom", 
            value: "5a", 
            category: "Neutros Terrosos", 
            styleCategory: "Natural", 
            points: 1 
          },
          { 
            id: "5b", 
            text: "Clássicos: azul marinho, preto, branco, cinza", 
            value: "5b", 
            category: "Neutros Clássicos", 
            styleCategory: "Clássico", 
            points: 1 
          },
          { 
            id: "5c", 
            text: "Modernos: cinza, preto, branco com detalhes coloridos", 
            value: "5c", 
            category: "Modernos", 
            styleCategory: "Contemporâneo", 
            points: 1 
          },
          { 
            id: "5d", 
            text: "Sofisticados: tons monocromáticos e texturas", 
            value: "5d", 
            category: "Monocromáticos", 
            styleCategory: "Elegante", 
            points: 1 
          },
          { 
            id: "5e", 
            text: "Suaves: rosa, lavanda, azul claro, verde menta", 
            value: "5e", 
            category: "Pastéis", 
            styleCategory: "Romântico", 
            points: 1 
          },
          { 
            id: "5f", 
            text: "Vibrantes: vermelho, pink, dourado, animal print", 
            value: "5f", 
            category: "Vibrantes", 
            styleCategory: "Sexy", 
            points: 1 
          },
          { 
            id: "5g", 
            text: "Intensos: preto, vermelho, branco contrastante", 
            value: "5g", 
            category: "Contrastantes", 
            styleCategory: "Dramático", 
            points: 1 
          },
          { 
            id: "5h", 
            text: "Únicos: misturas inusitadas, estampas étnicas", 
            value: "5h", 
            category: "Étnicos", 
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

export default getStep06Template;
