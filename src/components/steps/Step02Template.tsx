import React from 'react';

export interface Step02Question01Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onBlockAdd?: (block: any) => void;
}

export const Step02Question01: React.FC<Step02Question01Props> = ({ onNext, onPrevious, onBlockAdd }) => {
  return (
    <div className="step-02-question-01">
      {/* Conteúdo da Etapa 2 renderizado aqui */}
    </div>
  );
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 2 - QUESTÃO 1: ROUPA FAVORITA (REAL)
export const getStep02Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 10,
        progressMax: 100,
        showBackButton: true
      }
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
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
        content: 'Questão 1 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24
      }
    },
    {
      type: 'options-grid',
      properties: {
        questionId: 'q1',
        options: [
          { 
            id: "1a", 
            text: "Conforto, leveza e praticidade no vestir",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
            value: "1a",
            category: "Natural",
            styleCategory: "Natural",
            points: 1
          },
          { 
            id: "1b", 
            text: "Discrição, caimento clássico e sobriedade",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
            value: "1b",
            category: "Clássico",
            styleCategory: "Clássico",
            points: 1
          },
          { 
            id: "1c", 
            text: "Praticidade com um toque de estilo atual",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
            value: "1c",
            category: "Contemporâneo",
            styleCategory: "Contemporâneo",
            points: 1
          },
          { 
            id: "1d", 
            text: "Elegância refinada, moderna e sem exageros",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
            value: "1d",
            category: "Elegante",
            styleCategory: "Elegante",
            points: 1
          },
          { 
            id: "1e", 
            text: "Delicadeza em tecidos suaves e fluidos",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
            value: "1e",
            category: "Romântico",
            styleCategory: "Romântico",
            points: 1
          },
          { 
            id: "1f", 
            text: "Sensualidade com destaque para o corpo",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
            value: "1f",
            category: "Sexy",
            styleCategory: "Sexy",
            points: 1
          },
          { 
            id: "1g", 
            text: "Impacto visual com peças estruturadas e assimétricas",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
            value: "1g",
            category: "Dramático",
            styleCategory: "Dramático",
            points: 1
          },
          { 
            id: "1h", 
            text: "Mix criativo com formas ousadas e originais",
            imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
            value: "1h",
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

