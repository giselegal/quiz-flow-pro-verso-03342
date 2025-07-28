
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
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
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
  CheckCircle
};

export const getIconByName = (name: string): LucideIcon => {
  return iconMap[name] || Type;
};

export default getIconByName;
