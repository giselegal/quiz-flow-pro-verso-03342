import React from 'react';

export interface Step04Question03Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step04Question03: React.FC<Step04Question03Props> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-04-question-03">
      {/* Conteúdo da Etapa 4 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 4 - QUESTÃO 3: VISUAL
export const getStep04Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 20,
        progressMax: 100,
        showBackButton: true
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
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
        content: 'Selecione até 3 visuais que mais te representam',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24
      }
    },
    {
      type: 'options-grid',
      properties: {
        questionId: 'q3',
        options: [
          {
            id: '3a',
            text: 'Casual e confortável.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735334/31_uuzpdc.webp',
            styleCategory: 'Natural',
            points: 1
          },
          {
            id: '3b',
            text: 'Conservador e atemporal.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735335/32_zsmdnj.webp',
            styleCategory: 'Clássico',
            points: 1
          },
          {
            id: '3c',
            text: 'Moderno e versátil.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735335/33_iwqbcp.webp',
            styleCategory: 'Contemporâneo',
            points: 1
          },
          {
            id: '3d',
            text: 'Sofisticado e impecável.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735336/34_njwxau.webp',
            styleCategory: 'Elegante',
            points: 1
          },
          {
            id: '3e',
            text: 'Delicado e feminino.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735336/35_yilngj.webp',
            styleCategory: 'Romântico',
            points: 1
          },
          {
            id: '3f',
            text: 'Marcante e sedutor.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735337/36_lw4nrh.webp',
            styleCategory: 'Sexy',
            points: 1
          }
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: 'Selecione de 1 a 3 visuais',
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

export default Step04Question03;
