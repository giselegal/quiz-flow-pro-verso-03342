import React from "react";
import {
  Type,
  Image,
  Square,
  MousePointer,
  List,
  BarChart3,
  User,
  Star,
  Play,
  Volume2,
  ImageIcon,
  Zap,
  Palette,
  Monitor,
  Clock,
  TrendingUp,
  DollarSign,
  RefreshCw,
  PieChart,
  Anchor,
  Shield,
  Award,
  CheckCircle,
} from "lucide-react";

export interface ComponentDefinition {
  id: string;
  type: string;
  label: string;
  icon: any;
  category: string;
  description: string;
  defaultProps: Record<string, any>;
  requiredFeature?: string;
  isPremium?: boolean;
}

export const COMPONENT_CATEGORIES = [
  { id: "basic", name: "Básicos", icon: Type },
  { id: "media", name: "Mídia", icon: Play },
  { id: "interactive", name: "Interativos", icon: MousePointer },
  { id: "advanced", name: "Avançados", icon: Zap },
  { id: "premium", name: "Premium", icon: Star },
];

export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  // COMPONENTES BÁSICOS
  {
    id: "heading",
    type: "heading",
    label: "Título",
    icon: Type,
    category: "basic",
    description: "Títulos e subtítulos para estruturar o conteúdo",
    defaultProps: {
      content: "Seu Título Aqui",
      level: 1,
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: "#1a1a1a",
      marginBottom: 20,
    },
  },
  {
    id: "text",
    type: "text",
    label: "Texto",
    icon: Type,
    category: "basic",
    description: "Parágrafos e textos corridos",
    defaultProps: {
      content: "Adicione seu texto aqui...",
      fontSize: 16,
      lineHeight: 1.6,
      textAlign: "left",
      color: "#4a4a4a",
      marginBottom: 16,
    },
  },
  {
    id: "button",
    type: "button",
    label: "Botão",
    icon: MousePointer,
    category: "basic",
    description: "Botões de ação e chamadas para ação",
    defaultProps: {
      text: "Clique Aqui",
      url: "#",
      backgroundColor: "#3b82f6",
      textColor: "#ffffff",
      borderRadius: 8,
      padding: "12px 24px",
      fontWeight: "semibold",
      marginTop: 20,
    },
  },
  {
    id: "image",
    type: "image",
    label: "Imagem",
    icon: Image,
    category: "basic",
    description: "Imagens estáticas simples",
    defaultProps: {
      src: "https://via.placeholder.com/400x200",
      alt: "Imagem",
      width: 400,
      height: 200,
      objectFit: "cover",
      borderRadius: 8,
    },
  },
];

// Função para filtrar componentes baseado nas permissões do usuário
export const getAvailableComponents = (
  userFeatures: string[] = [],
  hasPremiumFeatures: boolean = false
) => {
  return COMPONENT_REGISTRY.filter(component => {
    // Se não é premium, sempre disponível
    if (!component.isPremium) return true;

    // Se é premium mas usuário tem acesso premium
    if (component.isPremium && hasPremiumFeatures) {
      // Verificar se tem a feature específica
      if (component.requiredFeature) {
        return (
          userFeatures.includes(component.requiredFeature) || userFeatures.includes("all-features")
        );
      }
      return true;
    }

    return false;
  });
};

export default COMPONENT_REGISTRY;
