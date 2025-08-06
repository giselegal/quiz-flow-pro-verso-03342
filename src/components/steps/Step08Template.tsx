import React from "react";

export interface Step08Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step08 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step08Props) => {
  return <div className="step-08">{/* Conteúdo da Etapa 8 renderizado aqui */}</div>;
};
// 🎯 TEMPLATE DE BLOCOS DA ETAPA 8 - Quando o assunto são estampas, você prefere:
export const getStep08Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "quiz-header-step08",
      type: "quiz-header",
      properties: {
        logoUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 40,
        progressMax: 100,
        showBackButton: true,
        showProgress: true,
        stepNumber: "8 de 21",
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step08",
      type: "decorative-bar-inline",
      properties: {
        width: "100%",
        height: 3,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 2,
        marginTop: 6,
        marginBottom: 20,
        showShadow: true,
      },
    },

    // 📝 PERGUNTA PRINCIPAL
    {
      id: "question-text-step08",
      type: "text-inline",
      properties: {
        content: "Quando o assunto são estampas, você prefere:",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 24,
        lineHeight: "1.3",
      },
    },

    // 🖼️ IMAGEM DA PERGUNTA
    {
      id: "question-image-step08",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838139/20250509_2144_Estampas_e_Padr%C3%B5es_simple_compose_01jtvt6y84tcz2w0tqp7j3rbpy_nwevaw.webp",
        alt: "Imagem da pergunta 8",
        width: 400,
        height: 300,
        className: "object-cover w-full max-w-md h-64 rounded-lg mx-auto shadow-md",
        textAlign: "text-center",
        marginBottom: 24,
      },
    },

    // 🎯 OPÇÕES DE RESPOSTA
    
    {
      id: "option-1-step08",
      type: "quiz-option",
      properties: {
        optionId: "sem-estampas",
        label: "Prefiro sem estampas - lisas e elegantes",
        value: "sem-estampas",
        points: {"elegante":3,"casual":2,"criativo":1,"classico":3,"romantico":1,"minimalista":3,"boho":1},
        
        
        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },
    {
      id: "option-2-step08",
      type: "quiz-option",
      properties: {
        optionId: "listras-classicas",
        label: "Listras clássicas",
        value: "listras-classicas",
        points: {"elegante":2,"casual":3,"criativo":1,"classico":3,"romantico":1,"minimalista":2,"boho":1},
        
        
        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },
    {
      id: "option-3-step08",
      type: "quiz-option",
      properties: {
        optionId: "florais-delicadas",
        label: "Florais delicadas e femininas",
        value: "florais-delicadas",
        points: {"elegante":1,"casual":2,"criativo":2,"classico":2,"romantico":3,"minimalista":1,"boho":3},
        
        
        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },
    {
      id: "option-4-step08",
      type: "quiz-option",
      properties: {
        optionId: "geometricas-modernas",
        label: "Geométricas e modernas",
        value: "geometricas-modernas",
        points: {"elegante":2,"casual":1,"criativo":3,"classico":1,"romantico":1,"minimalista":2,"boho":2},
        
        
        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },

    // 🎯 BOTÃO CONTINUAR
    {
      id: "continue-button-step08",
      type: "button-inline",
      properties: {
        text: "Continuar →",
        variant: "primary",
        size: "large",
        fullWidth: true,
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        requiresSelection: true,
        textAlign: "text-center",
        borderRadius: "rounded-full",
        padding: "py-3 px-6",
        fontSize: "text-base",
        fontWeight: "font-semibold",
        marginTop: 24,
        disabled: true,
      },
    },
  ];
};

export default Step08;