import { styleConfig } from "@/config/styleConfig";
import type { StyleResult } from "@/types/quiz";
import { useEffect, useState } from "react";

interface StyleAnalysis {
  name: string;
  description: string;
  imageUrl: string;
  guideUrl?: string;
  details: {
    strengthLevel: "forte" | "moderado" | "suave";
    expressionLevel: number; // 0-100
    personalityMatch: string[];
  };
  visualElements: {
    primaryColor?: string;
    secondaryColors?: string[];
    keyPieces?: string[];
    avoidElements?: string[];
  };
}

export const usePredominantStyle = (primaryStyle: StyleResult | null) => {
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!primaryStyle) {
      setError("Estilo primário não fornecido");
      setIsLoading(false);
      return;
    }

    try {
      const styleData = styleConfig[primaryStyle.category];

      if (!styleData) {
        setError("Configuração de estilo não encontrada");
        setIsLoading(false);
        return;
      }

      // Determinar nível de força do estilo baseado na porcentagem
      const getStrengthLevel = (percentage: number): "forte" | "moderado" | "suave" => {
        if (percentage >= 70) return "forte";
        if (percentage >= 40) return "moderado";
        return "suave";
      };

      // Análise detalhada do estilo
      const styleAnalysis: StyleAnalysis = {
        name: primaryStyle.category,
        description: styleData.description,
        imageUrl: styleData.image,
        guideUrl: styleData.guideImage,
        details: {
          strengthLevel: getStrengthLevel(primaryStyle.percentage),
          expressionLevel: primaryStyle.percentage,
          personalityMatch: generatePersonalityMatch(primaryStyle.category),
        },
        visualElements: getVisualElements(primaryStyle.category),
      };

      setAnalysis(styleAnalysis);
      setError(null);
    } catch (err) {
      setError("Erro ao analisar estilo predominante");
      console.error("Erro na análise de estilo:", err);
    } finally {
      setIsLoading(false);
    }
  }, [primaryStyle]);

  // Função auxiliar para gerar características de personalidade baseadas no estilo
  const generatePersonalityMatch = (styleCategory: string): string[] => {
    const personalityTraits = {
      Natural: ["autêntica", "prática", "descontraída", "versátil"],
      Clássico: ["elegante", "sofisticada", "tradicional", "refinada"],
      Moderno: ["contemporânea", "inovadora", "atual", "dinâmica"],
      Romântico: ["delicada", "feminina", "suave", "graciosa"],
      Criativo: ["artística", "expressiva", "original", "única"],
      Dramático: ["marcante", "impactante", "ousada", "intensa"],
    };

    return personalityTraits[styleCategory as keyof typeof personalityTraits] || [];
  };

  // Função auxiliar para definir elementos visuais baseados no estilo
  const getVisualElements = (styleCategory: string) => {
    const elements = {
      Natural: {
        primaryColor: "#8B7355", // Tom terroso
        secondaryColors: ["#A0522D", "#8FBC8F", "#DAA520"],
        keyPieces: ["Jeans", "Camisetas", "Peças em algodão", "Sapatos confortáveis"],
        avoidElements: ["Brilhos excessivos", "Estruturas muito rígidas", "Saltos muito altos"],
      },
      Clássico: {
        primaryColor: "#000080", // Azul marinho
        secondaryColors: ["#2F4F4F", "#800000", "#4B0082"],
        keyPieces: ["Blazer", "Camisa branca", "Calça alfaiataria", "Scarpin"],
        avoidElements: ["Peças muito trendy", "Estampas chamativas", "Acessórios exagerados"],
      },
      Moderno: {
        primaryColor: "#4A4A4A", // Cinza urbano
        secondaryColors: ["#000000", "#FFFFFF", "#B8860B"],
        keyPieces: ["Peças minimalistas", "Cortes clean", "Acessórios geométricos"],
        avoidElements: ["Babados", "Peças muito românticas", "Excessos decorativos"],
      },
      Romântico: {
        primaryColor: "#FFB6C1", // Rosa suave
        secondaryColors: ["#E6E6FA", "#FFF0F5", "#DDA0DD"],
        keyPieces: ["Vestidos fluidos", "Saias midi", "Blusas com laços"],
        avoidElements: [
          "Peças muito estruturadas",
          "Looks monocromáticos escuros",
          "Visual pesado",
        ],
      },
      Criativo: {
        primaryColor: "#9370DB", // Púrpura médio
        secondaryColors: ["#BA55D3", "#FF4500", "#20B2AA"],
        keyPieces: ["Peças únicas", "Mix de estampas", "Acessórios artísticos"],
        avoidElements: ["Looks muito básicos", "Combinações óbvias", "Visual convencional"],
      },
      Dramático: {
        primaryColor: "#8B0000", // Vermelho escuro
        secondaryColors: ["#000000", "#4B0082", "#BDB76B"],
        keyPieces: ["Peças statement", "Shapes marcantes", "Acessórios bold"],
        avoidElements: ["Looks discretos", "Cores suaves", "Peças muito delicadas"],
      },
    };

    return elements[styleCategory as keyof typeof elements] || {};
  };

  // Funções utilitárias para uso externo
  const getImageUrl = () => analysis?.imageUrl;
  const getGuideUrl = () => analysis?.guideUrl;
  const getDescription = () => analysis?.description;
  const getStrengthLevel = () => analysis?.details.strengthLevel;
  const getPersonalityTraits = () => analysis?.details.personalityMatch;
  const getVisualRecommendations = () => analysis?.visualElements;

  return {
    analysis,
    isLoading,
    error,
    // Funções utilitárias
    getImageUrl,
    getGuideUrl,
    getDescription,
    getStrengthLevel,
    getPersonalityTraits,
    getVisualRecommendations,
  };
};
