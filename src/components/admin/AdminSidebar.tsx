// @ts-nocheck
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  Code,
  Eye,
  FileText,
  Home,
  Layers,
  Palette,
  Settings,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

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
    title: 'Editor de Quiz',
    href: '/admin/quiz-editor',
    icon: BookOpen,
    description: 'Editor integrado de quizzes',
  },
  {
    title: 'Funis',
    href: '/admin/funis',
    icon: Layers,
    description: 'Gerenciar funis de vendas',
  },
  {
    title: 'Templates',
    href: '/admin/templates',
    icon: FileText,
    description: 'Gerenciar templates salvos',
  },
  {
    title: 'Testes A/B',
    href: '/admin/ab-tests',
    icon: Target,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    description: 'Pixel, UTM, URL, Tokens API',
  },
  {
    title: 'Criativos',
    href: '/admin/criativos',
    icon: TrendingUp,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Editor',
    href: '/editor-fixed',
    icon: Code,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white border-r border-[#D4C4A0] h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#432818]">Admin Panel</h2>
      </div>

      <nav className="px-4 space-y-2">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col gap-1 px-4 py-3 rounded-lg transition-colors',
                isActive ? 'bg-[#B89B7A] text-white' : 'text-[#432818] hover:bg-[#F5F2E9]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </div>
              {item.description && (
                <span className={cn('text-xs ml-8', isActive ? 'text-white/70' : 'text-[#8F7A6A]')}>
                  {item.description}
                </span>
              )}
            </Link>
          );
        })}
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
