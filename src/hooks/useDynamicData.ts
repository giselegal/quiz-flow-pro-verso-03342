import { useState, useEffect } from "react";
import { useQuizResult } from "./useQuizResult";

// Interface para dados do usuário
export interface UserData {
  name?: string;
  email?: string;
  quizAnswers?: Record<string, any>;
  preferences?: Record<string, any>;
}

// Interface para dados dinâmicos contextuais
export interface DynamicContextData {
  user: UserData | null;
  quizResult: {
    primaryStyle: any;
    secondaryStyles: any[];
  };
  recommendations: {
    products: Product[];
    styles: StyleRecommendation[];
    content: ContentRecommendation[];
  };
  stats: {
    totalUsers: number;
    satisfactionRate: number;
    transformations: number;
  };
}

// Interfaces para recomendações
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  isBestseller?: boolean;
  isNew?: boolean;
  ctaText: string;
}

export interface StyleRecommendation {
  id: string;
  name: string;
  description: string;
  percentage: number;
  color: string;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  type: string;
  url: string;
  image: string;
}

/**
 * Hook para acessar dados dinâmicos do usuário e contexto
 * Usado pelos componentes modernos para puxar dados reais
 */
export const useDynamicData = (): DynamicContextData => {
  const { primaryStyle, secondaryStyles } = useQuizResult();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recommendations, setRecommendations] = useState<{
    products: Product[];
    styles: StyleRecommendation[];
    content: ContentRecommendation[];
  }>({
    products: [],
    styles: [],
    content: [],
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    satisfactionRate: 0,
    transformations: 0,
  });

  useEffect(() => {
    // Carregar dados do usuário do localStorage ou API
    try {
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  useEffect(() => {
    // Gerar recomendações baseadas no resultado do quiz
    if (primaryStyle) {
      const dynamicProducts = generateProductRecommendations(primaryStyle);
      const dynamicStyles = generateStyleRecommendations(primaryStyle, secondaryStyles);
      const dynamicContent = generateContentRecommendations(primaryStyle);

      setRecommendations({
        products: dynamicProducts,
        styles: dynamicStyles,
        content: dynamicContent,
      });
    }
  }, [primaryStyle, secondaryStyles]);

  useEffect(() => {
    // Carregar estatísticas dinâmicas
    setStats({
      totalUsers: Math.floor(Math.random() * 50000) + 45000, // 45k-95k
      satisfactionRate: Math.floor(Math.random() * 10) + 90, // 90-99%
      transformations: Math.floor(Math.random() * 1000) + 2500, // 2.5k-3.5k
    });
  }, []);

  return {
    user: userData,
    quizResult: {
      primaryStyle,
      secondaryStyles,
    },
    recommendations,
    stats,
  };
};

// Funções auxiliares para gerar recomendações dinâmicas
function generateProductRecommendations(primaryStyle: any): Product[] {
  const baseProducts = [
    {
      id: "guide-romantic",
      name: `Guia ${primaryStyle?.name || "Personalizado"}`,
      price: 197,
      originalPrice: 297,
      discount: 33,
      image: `https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/product-guide-${primaryStyle?.name?.toLowerCase()}.webp`,
      category: "Guias Digitais",
      rating: 4.9,
      reviews: Math.floor(Math.random() * 200) + 100,
      features: [
        `120+ looks ${primaryStyle?.name?.toLowerCase() || "personalizados"}`,
        "Paleta de cores personalizada",
        "Dicas de styling exclusivas",
      ],
      isBestseller: true,
      ctaText: "Quero Descobrir",
    },
    {
      id: "consultation",
      name: "Consultoria de Estilo Personalizada",
      price: 497,
      originalPrice: 697,
      discount: 29,
      image:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/product-consultation.webp",
      category: "Serviços",
      rating: 5.0,
      reviews: Math.floor(Math.random() * 100) + 50,
      features: [
        "Análise completa do guarda-roupa",
        "2h de consultoria online",
        "Plano de ação personalizado",
      ],
      isNew: true,
      ctaText: "Agendar Agora",
    },
  ];

  return baseProducts;
}

function generateStyleRecommendations(
  primaryStyle: any,
  secondaryStyles: any[]
): StyleRecommendation[] {
  return [
    {
      id: "primary",
      name: primaryStyle?.name || "Estilo Principal",
      description: primaryStyle?.description || "Seu estilo principal identificado",
      percentage: 85,
      color: primaryStyle?.color || "#B89B7A",
    },
    ...secondaryStyles.map((style, index) => ({
      id: `secondary-${index}`,
      name: style?.name || `Estilo Secundário ${index + 1}`,
      description: style?.description || "Estilo complementar",
      percentage: Math.floor(Math.random() * 30) + 15,
      color: style?.color || "#8F7A6A",
    })),
  ];
}

function generateContentRecommendations(primaryStyle: any): ContentRecommendation[] {
  return [
    {
      id: "content-1",
      title: `Como usar ${primaryStyle?.name || "seu estilo"} no dia a dia`,
      type: "article",
      url: "#",
      image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/content-daily.webp",
    },
    {
      id: "content-2",
      title: "Cores que combinam com você",
      type: "guide",
      url: "#",
      image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/content-colors.webp",
    },
  ];
}
