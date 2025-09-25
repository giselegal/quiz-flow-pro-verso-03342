/**
 * 🏢 LAYOUT MODERNO DO DASHBOARD
 * 
 * Layout unificado e responsivo para todo o dashboard administrativo com:
 * - Sidebar moderna com agrupamento de funcionalidades
 * - Header com breadcrumbs e ações contextuais
 * - Design responsivo mobile-first
 * - Navegação intuitiva e acessível
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
    LayoutDashboard,
    BarChart3,
    Settings,
    Target,
    Edit3,
    ChevronRight,
    Menu,
    X,
    Home,
    Zap,
    Database,
    TestTube,
    Palette,
    Bell,
    Search,
    User,
    LogOut,
    ChevronDown,
    Activity,
    Copy,
    Shield,
    Brain,
    HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ModernDashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

interface NavigationGroup {
    label: string;
    items: NavigationItem[];
}

interface NavigationItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    isExternal?: boolean;
}

const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({
    children,
    title,
    subtitle,
    actions
}) => {
    const [location] = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigationGroups: NavigationGroup[] = [
        {
            label: 'Principal',
            items: [
                {
                    href: '/dashboard',
                    label: 'Overview',
                    icon: LayoutDashboard
                },
                {
                    href: '/dashboard/analytics',
                    label: 'Analytics',
                    icon: BarChart3,
                    badge: 'Novo',
                    badgeVariant: 'default'
                },
                {
                    href: '/dashboard/real-time',
                    label: 'Tempo Real',
                    icon: Activity
                },
                {
                    href: '/dashboard/monitoring',
                    label: 'Monitoramento',
                    icon: Shield,
                    badge: 'Live',
                    badgeVariant: 'default'
                }
            ]
        },
        {
            label: 'Conteúdo',
            items: [
                {
                    href: '/dashboard/funnels',
                    label: 'Meus Funis',
                    icon: Target,
                    badge: 'Live',
                    badgeVariant: 'default'
                },
                {
                    href: '/dashboard/funnel-templates',
                    label: 'Templates de Funis',
                    icon: Copy,
                    badge: 'Templates',
                    badgeVariant: 'secondary'
                },
                {
                    href: '/dashboard/templates',
                    label: 'Biblioteca de Templates',
                    icon: Database
                }
            ]
        },
        {
            label: 'IA & Otimização',
            items: [
                {
                    href: '/dashboard/ai-optimization',
                    label: 'IA & Otimização',
                    icon: Brain,
                    badge: 'AI',
                    badgeVariant: 'default'
                },
                {
                    href: '/dashboard/backup',
                    label: 'Backup & Recovery',
                    icon: HardDrive,
                    badge: 'Pro',
                    badgeVariant: 'secondary'
                }
            ]
        },
        {
            label: 'Ferramentas',
            items: [
                {
                    href: '/editor',
                    label: 'Editor',
                    icon: Edit3,
                    badge: 'Editor',
                    badgeVariant: 'secondary',
                    isExternal: true
                },
                {
                    href: '/dashboard/ab-tests',
                    label: 'Testes A/B',
                    icon: TestTube
                },
                {
                    href: '/dashboard/creatives',
                    label: 'Criativos',
                    icon: Palette
                }
            ]
        },
        {
            label: 'Sistema',
            items: [
                {
                    href: '/dashboard/settings',
                    label: 'Configurações',
                    icon: Settings
                },
                {
                    href: '/dashboard/integrations',
                    label: 'Integrações',
                    icon: Zap
                }
            ]
        }
    ];

    const isCurrentPath = (href: string) => {
        if (href === '/dashboard') {
            return location === '/dashboard' || location === '/dashboard/';
        }
        return location.startsWith(href);
    };

    const breadcrumbs = React.useMemo(() => {
        const segments = location.split('/').filter(Boolean);

        const breadcrumbMap: Record<string, string> = {
            'dashboard': 'Dashboard',
            'analytics': 'Analytics',
            'real-time': 'Tempo Real',
            'monitoring': 'Monitoramento',
            'ai-optimization': 'IA & Otimização',
            'backup': 'Backup & Recovery',
            'funnels': 'Funis',
            'quizzes': 'Quizzes',
            'participants': 'Participantes',
            'templates': 'Templates',
            'ab-tests': 'Testes A/B',
            'creatives': 'Criativos',
            'settings': 'Configurações',
            'integrations': 'Integrações'
        };

        return segments.map((segment, index) => ({
            label: breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
            path: '/' + segments.slice(0, index + 1).join('/'),
            isLast: index === segments.length - 1
        }));
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">Quiz Quest</span>
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

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    {navigationGroups.map((group) => (
                        <div key={group.label}>
                            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {group.label}
                            </h3>
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = isCurrentPath(item.href);
                                    const IconComponent = item.icon;

                                    const linkContent = (
                                        <div className={cn(
                                            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors",
                                            isActive
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        )}>
                                            <div className="flex items-center space-x-3">
                                                <IconComponent className={cn(
                                                    "w-5 h-5",
                                                    isActive ? "text-blue-600" : "text-gray-500"
                                                )} />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <Badge variant={item.badgeVariant || 'default'} className="text-xs">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <li key={item.href}>
                                            <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                                                {linkContent}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                                AD
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                Admin
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                admin@quizquest.com
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem>
                                    <User className="w-4 h-4 mr-2" />
                                    Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configurações
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Left: Mobile menu + Breadcrumbs */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>

                            {/* Breadcrumbs */}
                            <nav className="flex items-center space-x-1 text-sm text-gray-500">
                                <Link href="/" className="hover:text-gray-700 transition-colors">
                                    <Home className="w-4 h-4" />
                                </Link>
                                {breadcrumbs.map((crumb) => (
                                    <React.Fragment key={crumb.path}>
                                        <ChevronRight className="w-4 h-4" />
                                        {crumb.isLast ? (
                                            <span className="font-medium text-gray-900">{crumb.label}</span>
                                        ) : (
                                            <Link href={crumb.path} className="hover:text-gray-700 transition-colors">
                                                {crumb.label}
                                            </Link>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        </div>

                        {/* Right: Search + Actions + Notifications */}
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="hidden md:block relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="search"
                                    placeholder="Buscar..."
                                    className="w-64 pl-10 pr-4 py-2 text-sm"
                                />
                            </div>

                            {/* Notifications */}
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Button>

                            {/* Custom Actions */}
                            {actions}
                        </div>
                    </div>

                    {/* Page Title Section */}
                    {(title || subtitle) && (
                        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    {title && (
                                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                    )}
                                    {subtitle && (
                                        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ModernDashboardLayout;