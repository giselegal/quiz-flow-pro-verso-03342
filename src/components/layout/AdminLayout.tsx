/**
 * 🏢 LAYOUT ADMINISTRATIVO CONSISTENTE
 * 
 * Layout wrapper para todas as páginas administrativas com:
 * - Navegação lateral consistente
 * - Breadcrumbs automáticos
 * - Header unificado
 * - Estrutura responsiva
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Users,
  Target,
  Edit3,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  active?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle, actions }) => {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigationItems: NavigationItem[] = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: location === '/admin'
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: BarChart3,
      active: location === '/admin/analytics'
    },
    {
      href: '/admin/settings',
      label: 'Configurações',
      icon: Settings,
      active: location === '/admin/settings'
    },
    {
      href: '/editor',
      label: 'Editor',
      icon: Edit3,
      badge: 'Novo'
    }
  ];

  const breadcrumbs = React.useMemo(() => {
    const segments = location.split('/').filter(Boolean);
    
    const breadcrumbMap: Record<string, string> = {
      'admin': 'Administração',
      'analytics': 'Analytics',
      'settings': 'Configurações',
      'dashboard': 'Dashboard'
    };

    return segments.map((segment, index) => ({
      label: breadcrumbMap[segment] || segment,
      path: '/' + segments.slice(0, index + 1).join('/'),
      isLast: index === segments.length - 1
    }));
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Admin</h2>
              <p className="text-xs text-muted-foreground">Painel de controle</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                item.active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </a>
            </Link>
          ))}
        </nav>

        {/* Quick stats in sidebar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-accent rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status do sistema</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Última atualização: agora
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>

              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/">
                  <a className="hover:text-foreground transition-colors">Home</a>
                </Link>
                {breadcrumbs.map((crumb) => (
                  <React.Fragment key={crumb.path}>
                    <ChevronRight className="w-4 h-4" />
                    {crumb.isLast ? (
                      <span className="text-foreground font-medium">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.path}>
                        <a className="hover:text-foreground transition-colors">{crumb.label}</a>
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {actions}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">Administrador</p>
                  <p className="text-xs text-muted-foreground">admin@empresa.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page header */}
          {(title || subtitle) && (
            <div className="px-6 pb-4">
              {title && (
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </header>

        {/* Main content area */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;