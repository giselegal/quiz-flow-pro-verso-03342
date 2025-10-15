/**
 * 🎯 ADMIN LAYOUT UNIFICADO - Sidebar + Content
 * Layout moderno com navegação lateral e dados reais do Supabase
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  FlaskConical,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const navigationItems = [
  {
    title: 'Principal',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
      { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Conteúdo',
    items: [
      { title: 'Meus Funis', url: '/admin/funnels', icon: Layers },
      { title: 'Templates', url: '/admin/templates', icon: FileText },
      { title: 'Participantes', url: '/admin/participants', icon: Users },
    ]
  },
  {
    title: 'Ferramentas',
    items: [
      { title: 'Testes A/B', url: '/admin/ab-tests', icon: FlaskConical },
      { title: 'Criativos', url: '/admin/creatives', icon: Image },
      { title: 'Integrações', url: '/admin/integrations', icon: Zap },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { title: 'Configurações', url: '/admin/settings', icon: Settings },
    ]
  }
];

// ============================================================================
// ADMIN SIDEBAR
// ============================================================================

function AdminSidebar() {
  const { collapsed } = useSidebar();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <Sidebar className={cn(collapsed ? 'w-14' : 'w-64', 'transition-all duration-300')}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
        )}
        <SidebarTrigger className="ml-auto" />
      </div>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            {!collapsed && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

// ============================================================================
// MAIN LAYOUT
// ============================================================================

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="h-14 border-b bg-card flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </header>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
