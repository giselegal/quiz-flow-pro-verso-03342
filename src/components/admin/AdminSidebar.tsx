import { cn } from '@/lib/utils';
import {
  Code,
  Eye,
  FileText,
  Home,
  Layers,
  Palette,
  Settings,
  Target,
  Users,
  Zap,
  Brain,
  LineChart,
  Database,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Badge } from '../ui/badge';

// 🏠 SEÇÃO PRINCIPAL - DASHBOARD
const dashboardItems = [
  {
    title: 'Overview',
    href: '/admin',
    icon: Home,
    description: 'KPIs principais e insights gerais',
  },
];

// 🎯 CORE BUSINESS - FUNCIONALIDADES PRINCIPAIS
const coreBusinessItems = [
  {
    title: 'Editor Unificado',
    href: '/editor',
    icon: Code,
    description: 'Editor drag & drop principal',
  },
  {
    title: 'Configurações NoCode',
    href: '/admin/configuracao',
    icon: Zap,
    description: 'SEO, Analytics, Domínios - Sem código',
    badge: 'NoCode',
    isAdvanced: false,
    priority: true,
  },
  {
    title: 'Quiz Manager',
    href: '/admin/quiz',
    icon: Palette,
    description: 'Configuração de quizzes',
  },
  {
    title: 'Funis & Templates',
    href: '/admin/funis',
    icon: Layers,
    description: 'Gerenciar funis e templates',
  },
  {
    title: 'Meus Funis',
    href: '/admin/meus-funis',
    icon: FileText,
    description: 'Funis criados e publicados',
  },
  {
    title: 'Leads',
    href: '/admin/participantes',
    icon: Users,
    description: 'Leads e dados dos usuários',
  },
];

// 📊 ANALYTICS & IA - INTELIGÊNCIA
const analyticsItems = [
  {
    title: 'Analytics Real-Time',
    href: '/admin/analytics/real-time',
    icon: LineChart,
    description: 'Métricas em tempo real',
    isAdvanced: true,
    badge: 'Pro',
  },
  {
    title: 'A/B Testing',
    href: '/admin/ab-testing',
    icon: Target,
    description: 'Testes e otimização',
    isAdvanced: true,
    badge: 'Pro',
  },
  {
    title: 'Insights de IA',
    href: '/admin/ia-insights',
    icon: Brain,
    description: 'Recomendações inteligentes',
    isAdvanced: true,
    badge: 'IA',
  },
];

// ⚙️ CONFIGURAÇÃO - SISTEMA
const configItems = [
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configurações do sistema',
  },
  {
    title: 'Templates',
    href: '/admin/meus-templates',
    icon: Database,
    description: 'Biblioteca de templates',
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  // Renderizar item do sidebar com badge opcional
  const renderSidebarItem = (item: any, isAdvanced = false) => {
    const Icon = item.icon;
    const isActive = location === item.href;
    const isPriority = item.priority;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex flex-col gap-1 px-4 py-3 rounded-lg transition-colors relative',
          isActive
            ? isAdvanced
              ? 'bg-gradient-to-r from-[#B89B7A] to-[#A08968] text-white shadow-md'
              : isPriority
              ? 'bg-gradient-to-r from-[#B89B7A] to-[#D4A574] text-white shadow-lg border-2 border-[#E8D5B7]'
              : 'bg-[#B89B7A] text-white'
            : isPriority
            ? 'text-[#432818] hover:bg-[#F5F2E9] bg-gradient-to-r from-[#FBF8F3] to-[#F8F5F0] border border-[#E8D5B7]'
            : 'text-[#432818] hover:bg-[#F5F2E9]'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-5 h-5", isPriority && "text-[#B89B7A]")} />
          <span className={cn("font-medium", isPriority && "font-semibold")}>{item.title}</span>
          {(item.badge || item.isAdvanced) && (
            <Badge
              variant={item.isAdvanced ? "default" : "secondary"}
              className={cn(
                "text-xs px-2 py-0.5 ml-auto",
                isActive 
                  ? "bg-white/20 text-white" 
                  : item.isAdvanced 
                  ? "bg-purple-100 text-purple-700" 
                  : isPriority 
                  ? "bg-[#B89B7A] text-white font-medium"
                  : "bg-green-100 text-green-700"
              )}
            >
              {item.badge || 'Pro'}
            </Badge>
          )}
        </div>
        {item.description && (
          <span className={cn(
            'text-xs ml-8',
            isActive ? 'text-white/70' : isPriority ? 'text-[#8F7A6A] font-medium' : 'text-[#8F7A6A]'
          )}>
            {item.description}
          </span>
        )}
        {(isAdvanced || isPriority) && (
          <div className="absolute top-1 right-1">
            <Zap className={cn("w-3 h-3", isAdvanced ? "text-yellow-400" : "text-[#B89B7A]")} />
          </div>
        )}
      </Link>
    );
  };

  // Renderizar seção com título
  const renderSection = (title: string, items: any[], isAdvanced = false, icon?: any) => {
    const SectionIcon = icon;
    return (
      <div className="space-y-2">
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B89B7A] uppercase tracking-wide">
            {SectionIcon && <SectionIcon className="w-4 h-4" />}
            {title}
          </div>
        </div>
        {items.map(item => renderSidebarItem(item, isAdvanced))}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-[#D4C4A0] h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#432818]">Quiz Quest</h2>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="default" className="bg-green-500 text-white text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Pro Active
          </Badge>
        </div>
      </div>

      <nav className="px-4 space-y-6">
        {/* Dashboard Principal */}
        {renderSection('Dashboard', dashboardItems, false, Home)}

        {/* Core Business */}
        {renderSection('Core Business', coreBusinessItems, false, Target)}

        {/* Analytics & IA */}
        {renderSection('Analytics & IA', analyticsItems, true, Brain)}

        {/* Configuração */}
        {renderSection('Configuração', configItems, false, Settings)}
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