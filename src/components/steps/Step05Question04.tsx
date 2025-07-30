import React from 'react';

export interface Step05Question04Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step05Question04: React.FC<Step05Question04Props> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-05-question-04">
      {/* Conteúdo da Etapa 5 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 5 - QUESTÃO 4: DETALHES
export const getStep05Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 25,
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
        content: 'Escolha até 3 elementos que mais te atraem',
        fontSize: 'text-lg',
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
            id: '4a',
            text: 'Texturas naturais e acabamentos rústicos.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735337/41_afkkev.webp',
            styleCategory: 'Natural',
            points: 1
          },
          {
            id: '4b',
            text: 'Detalhes discretos e acabamentos perfeitos.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735338/42_zywvuq.webp',
            styleCategory: 'Clássico',
            points: 1
          },
          {
            id: '4c',
            text: 'Elementos geométricos e linhas limpas.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735338/43_i9sxgs.webp',
            styleCategory: 'Contemporâneo',
            points: 1
          },
          {
            id: '4d',
            text: 'Acabamentos luxuosos e sofisticados.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735339/44_ozp0ns.webp',
            styleCategory: 'Elegante',
            points: 1
          },
          {
            id: '4e',
            text: 'Rendas, babados e detalhes delicados.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735339/45_kptqec.webp',
            styleCategory: 'Romântico',
            points: 1
          },
          {
            id: '4f',
            text: 'Recortes marcantes e transparências.',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735340/46_bsgqhr.webp',
            styleCategory: 'Sexy',
            points: 1
          }
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: 'Selecione de 1 a 3 elementos',
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

export default Step05Question04;
