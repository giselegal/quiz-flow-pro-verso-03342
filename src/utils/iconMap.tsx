import {
  AlertCircle,
  Heart,
  ShoppingBag,
  Clock,
  Users,
  Crown,
  Target,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Shield,
  Award,
  Gift,
  Zap,
  TrendingUp,
  Eye,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react';

// Mapa de nomes de ícones para componentes
const iconMap: Record<string, LucideIcon> = {
  AlertCircle,
  Heart,
  ShoppingBag,
  Clock,
  Users,
  Crown,
  Target,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Shield,
  Award,
  Gift,
  Zap,
  TrendingUp,
  Eye,
  BadgeCheck,
};

/**
 * Renderiza um ícone Lucide baseado no nome fornecido
 *
 * @param iconName - Nome do ícone (ex: 'Heart', 'ShoppingBag')
 * @param className - Classes CSS para aplicar ao ícone
 * @param fallback - Ícone padrão caso o nome não seja encontrado
 * @returns Componente do ícone ou ícone padrão
 */
export const renderLucideIcon = (
  iconName: string,
  className?: string,
  fallback: LucideIcon = AlertCircle
): React.ReactElement => {
  const IconComponent = iconMap[iconName] || fallback;
  return React.createElement(IconComponent, { className });
};

/**
 * Obtém o componente do ícone baseado no nome
 *
 * @param iconName - Nome do ícone
 * @param fallback - Ícone padrão caso o nome não seja encontrado
 * @returns Componente do ícone
 */
export const getLucideIcon = (iconName: string, fallback: LucideIcon = AlertCircle): LucideIcon => {
  return iconMap[iconName] || fallback;
};

/**
 * Lista de todos os ícones disponíveis para uso no editor
 */
export const availableIcons = Object.keys(iconMap);

export default iconMap;
