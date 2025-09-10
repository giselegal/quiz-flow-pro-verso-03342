import { cn } from '@/lib/utils';
import {
  BarChart3,
  Code,
  Eye,
  FileText,
  Home,
  Layers,
  Palette,
  Settings,
  Target,
  TrendingUp,
  Users,
  Zap,
  Activity,
  Award,
  Brain,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Badge } from '../ui/badge';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Quiz',
    href: '/admin/quiz',
    icon: Palette,
  },
  {
    title: 'Editor (novo)',
    href: '/editor',
    icon: Code,
    description: 'Editor unificado',
  },
  {
    title: 'Funis',
    href: '/admin/funis',
    icon: Layers,
    description: 'Gerenciar funis de vendas',
  },
];

// 🎯 FUNCIONALIDADES AVANÇADAS DESTACADAS
const advancedFeatures = [
  {
    title: '🚀 Showcase Completo',
    href: '/admin/funcionalidades-avancadas',
    icon: Award,
    description: 'Ver todas as funcionalidades ativadas',
    isNew: true,
    badge: 'NOVO',
  },
  {
    title: '🧠 Inteligência Artificial',
    href: '/admin/funcionalidades-ia',
    icon: Brain,
    description: 'Sistemas de IA, ML e automação',
    isNew: true,
    badge: 'IA',
  },
  {
    title: 'Analytics Avançado',
    href: '/admin/analytics',
    icon: Activity,
    description: 'Dashboard empresarial, A/B tests, conversão',
    isNew: true,
    badge: 'Empresarial',
  },
  {
    title: 'Testes A/B',
    href: '/admin/ab-tests',
    icon: Target,
    description: 'Comparação e otimização de performance',
    isNew: true,
    badge: 'Avançado',
  },
  {
    title: 'Métricas Pro',
    href: '/admin/metricas',
    icon: TrendingUp,
    description: 'Análise de performance e ROI',
    isNew: true,
    badge: 'Pro',
  },
];

const regularItems = [
  {
    title: 'Configuração',
    href: '/admin/configuracao',
    icon: Settings,
    description: 'SEO, Domínio, Pixel, UTM',
  },
  {
    title: 'Modelos de Funis',
    href: '/admin/funis',
    icon: FileText,
    description: 'Biblioteca de modelos prontos (21 etapas)',
  },
  {
    title: 'Meus Funis',
    href: '/admin/meus-funis',
    icon: Layers,
    description: 'Funis em edição e publicados',
  },
  {
    title: 'Meus Templates',
    href: '/admin/meus-templates',
    icon: FileText,
    description: 'Templates personalizados criados por você',
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configurações avançadas',
  },
  {
    title: 'Criativos',
    href: '/admin/criativos',
    icon: BarChart3,
  },
  {
    title: 'Participantes',
    href: '/admin/participantes',
    icon: Users,
    description: 'Respostas e progresso dos usuários',
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  // Renderizar item do sidebar com badge opcional
  const renderSidebarItem = (item: any, isAdvanced = false) => {
    const Icon = item.icon;
    const isActive = location === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex flex-col gap-1 px-4 py-3 rounded-lg transition-colors relative',
          isActive
            ? isAdvanced
              ? 'bg-gradient-to-r from-[#B89B7A] to-[#A08968] text-white shadow-md'
              : 'bg-[#B89B7A] text-white'
            : 'text-[#432818] hover:bg-[#F5F2E9]'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-medium">{item.title}</span>
          {item.isNew && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-2 py-0.5 ml-auto",
                isActive ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
              )}
            >
              {item.badge || 'Novo'}
            </Badge>
          )}
        </div>
        {item.description && (
          <span className={cn(
            'text-xs ml-8',
            isActive ? 'text-white/70' : 'text-[#8F7A6A]'
          )}>
            {item.description}
          </span>
        )}
        {isAdvanced && (
          <div className="absolute top-1 right-1">
            <Zap className="w-3 h-3 text-yellow-400" />
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-[#D4C4A0] h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#432818]">Admin Panel</h2>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="default" className="bg-green-500 text-white text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Modo Avançado
          </Badge>
        </div>
      </div>

      <nav className="px-4 space-y-2">
        {/* Seção principal */}
        {sidebarItems.map(item => renderSidebarItem(item))}

        {/* Divisor para funcionalidades avançadas */}
        <div className="my-4 px-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px bg-[#E5DDD5] flex-1"></div>
            <span className="text-xs text-[#B89B7A] font-medium flex items-center gap-1">
              <Award className="w-3 h-3" />
              FUNCIONALIDADES AVANÇADAS
            </span>
            <div className="h-px bg-[#E5DDD5] flex-1"></div>
          </div>
        </div>

        {/* Funcionalidades avançadas destacadas */}
        {advancedFeatures.map(item => renderSidebarItem(item, true))}

        {/* Divisor para itens regulares */}
        <div className="my-4 px-4">
          <div className="h-px bg-[#E5DDD5]"></div>
        </div>

        {/* Outros itens */}
        {regularItems.map(item => renderSidebarItem(item))}
      </nav>

      <div className="absolute bottom-4 px-4 w-64">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-[#B89B7A] hover:bg-[#F5F2E9] rounded-lg transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span className="font-medium">Ver Site</span>
        </Link>
      </div>
    </div>
  );
}
