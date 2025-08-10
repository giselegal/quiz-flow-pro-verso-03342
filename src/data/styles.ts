import type { Style, StyleType } from "@/types/quiz";

// Definição dos 8 estilos do CaktoQuiz
export const STYLES: Record<StyleType, Style> = {
  classico: {
    id: "classico",
    name: "Clássico",
    description:
      "Seu estilo é atemporal e sofisticado. Você valoriza peças de qualidade, cores neutras e um visual elegante que nunca sai de moda. Prefere investir em básicos versáteis que podem ser combinados de várias formas.",
    imageUrl: "/estilos/classico-personal.jpg",
    guideImageUrl: "/estilos/classico-guide.jpg",
    colors: {
      primary: "#2C3E50",
      secondary: "#BDC3C7",
      accent: "#34495E",
    },
    keywords: ["atemporal", "sofisticado", "elegante", "neutro", "versátil"],
  },
  romântico: {
    id: "romântico",
    name: "Romântico",
    description:
      "Seu estilo é delicado e feminino. Você adora peças com detalhes florais, rendas, babados e cores suaves. Sua personalidade doce se reflete nas escolhas de roupas que fazem você se sentir especial e única.",
    imageUrl: "/estilos/romantico-personal.jpg",
    guideImageUrl: "/estilos/romantico-guide.jpg",
    colors: {
      primary: "#F8BBD9",
      secondary: "#FCE4EC",
      accent: "#E91E63",
    },
    keywords: ["delicado", "feminino", "floral", "suave", "doce"],
  },
  dramático: {
    id: "dramático",
    name: "Dramático",
    description:
      "Seu estilo é marcante e impactante. Você não tem medo de se destacar e adora peças com contrastes fortes, geometrias definidas e elementos que causam impacto visual. Você é uma pessoa confiante e isso transpareece no seu visual.",
    imageUrl: "/estilos/dramatico-personal.jpg",
    guideImageUrl: "/estilos/dramatico-guide.jpg",
    colors: {
      primary: "#000000",
      secondary: "#FFFFFF",
      accent: "#E74C3C",
    },
    keywords: ["marcante", "impactante", "contraste", "geométrico", "confiante"],
  },
  natural: {
    id: "natural",
    name: "Natural",
    description:
      "Seu estilo é descomplicado e confortável. Você prioriza o conforto sem abrir mão da beleza, optando por tecidos naturais, cores terrosas e peças que permitem movimento livre. Sua autenticidade é sua maior marca.",
    imageUrl: "/estilos/natural-personal.jpg",
    guideImageUrl: "/estilos/natural-guide.jpg",
    colors: {
      primary: "#8D6E63",
      secondary: "#D7CCC8",
      accent: "#4CAF50",
    },
    keywords: ["descomplicado", "confortável", "natural", "terroso", "autêntico"],
  },
  criativo: {
    id: "criativo",
    name: "Criativo",
    description:
      "Seu estilo é único e expressivo. Você adora experimentar, misturar estampas, brincar com cores e criar looks que ninguém mais pensou. Sua criatividade não tem limites e isso se reflete nas suas escolhas de moda.",
    imageUrl: "/estilos/criativo-personal.jpg",
    guideImageUrl: "/estilos/criativo-guide.jpg",
    colors: {
      primary: "#9C27B0",
      secondary: "#FF9800",
      accent: "#2196F3",
    },
    keywords: ["único", "expressivo", "experimental", "colorido", "criativo"],
  },
  elegante: {
    id: "elegante",
    name: "Elegante",
    description:
      "Seu estilo é refinado e polido. Você aprecia a alta qualidade, o caimento perfeito e os detalhes bem acabados. Cada peça do seu guarda-roupa é escolhida com cuidado para transmitir sofisticação e bom gosto.",
    imageUrl: "/estilos/elegante-personal.jpg",
    guideImageUrl: "/estilos/elegante-guide.jpg",
    colors: {
      primary: "#1A237E",
      secondary: "#C5CAE9",
      accent: "#3F51B5",
    },
    keywords: ["refinado", "polido", "qualidade", "sofisticação", "bom gosto"],
  },
  sexy: {
    id: "sexy",
    name: "Sexy",
    description:
      "Seu estilo é sedutor e confiante. Você não tem medo de mostrar sua feminilidade e sabe usar peças que realçam suas curvas e destacam sua personalidade marcante. Você se sente poderosa quando está bem vestida.",
    imageUrl: "/estilos/sexy-personal.jpg",
    guideImageUrl: "/estilos/sexy-guide.jpg",
    colors: {
      primary: "#B71C1C",
      secondary: "#FFCDD2",
      accent: "#000000",
    },
    keywords: ["sedutor", "confiante", "feminino", "marcante", "poderosa"],
  },
  contemporâneo: {
    id: "contemporâneo",
    name: "Contemporâneo",
    description:
      "Seu estilo é moderno e atual. Você está sempre antenada nas últimas tendências, mas sabe adaptá-las ao seu gosto pessoal. Gosta de peças com design inovador e não tem medo de experimentar o que há de novo na moda.",
    imageUrl: "/estilos/contemporaneo-personal.jpg",
    guideImageUrl: "/estilos/contemporaneo-guide.jpg",
    colors: {
      primary: "#607D8B",
      secondary: "#ECEFF1",
      accent: "#FF5722",
    },
    keywords: ["moderno", "atual", "tendência", "inovador", "experimental"],
  },
};

// Helper para obter estilo por ID
export const getStyleById = (styleId: StyleType): Style => {
  return STYLES[styleId];
};

// Helper para obter todos os estilos como array
export const getAllStyles = (): Style[] => {
  return Object.values(STYLES);
};

// Helper para obter nome do estilo
export const getStyleName = (styleId: StyleType): string => {
  return STYLES[styleId].name;
};
