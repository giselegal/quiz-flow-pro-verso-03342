// Template para a Etapa 21 - Resultados do Quiz de Estilo
export const getStep21Template = () => [
  {
    id: "step21-header",
    type: "quiz-intro-header",
    properties: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 100,
      progressMax: 100,
      showBackButton: false,
    },
  },
  {
    id: "step21-final-title",
    type: "heading",
    properties: {
      content: "Seu Estilo Predominante",
      level: "h2",
      fontSize: "text-3xl",
      fontWeight: "font-bold",
      textAlign: "text-center",
      color: "#432818",
      marginBottom: 4,
    },
  },
  {
    id: "step21-final-subtitle",
    type: "text",
    properties: {
      content: "Descubra seu estilo único e as melhores escolhas para você",
      fontSize: "text-lg",
      textAlign: "text-center",
      color: "#6B7280",
      marginBottom: 24,
    },
  },
  {
    id: "step21-style-results",
    type: "style-results-block",
    properties: {
      result: {
        id: "style-Natural",
        title: "Natural",
        description:
          "Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico.",
        imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
        category: "Natural",
        minScore: 0,
        maxScore: 100,
        displayOrder: 1,
      },
      categoryScores: {
        Natural: 10,
        Clássico: 7,
        Elegante: 5,
        Romântico: 3,
        Contemporâneo: 2,
        Sexy: 1,
        Dramático: 1,
        Criativo: 1,
      },
      showAllStyles: false,
      showGuideImage: true,
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
    },
  },
  {
    id: "step21-final-button",
    type: "button",
    properties: {
      text: "Agendar Consultoria Personalizada",
      variant: "primary",
      size: "large",
      fullWidth: true,
      backgroundColor: "#B89B7A",
      textColor: "#ffffff",
      marginTop: 24,
    },
  },
];

export default getStep21Template;
