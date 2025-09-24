/**
 * 🏗️ UNIFIED DASHBOARD LAYOUT
 * 
 * Layout consolidado que substitui implementações duplicadas
 * Fornece estrutura consistente para todos os dashboards
 * 
 * ✅ Design system unificado
 * ✅ Navegação consistente
 * ✅ Responsividade otimizada
 * ✅ Performance melhorada
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from 'wouter';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    Plus,
    Bell,
    Search,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// INTERFACES
// ============================================================================

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    headerActions?: React.ReactNode;
    className?: string;
}

interface NavigationItem {
    href: string;
    label: string;
    icon: React.ComponentType<any>;
    badge?: string | number;
    description?: string;
}

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

const navigationItems: NavigationItem[] = [
    {
        href: '/dashboard',
        label: 'Visão Geral',
        icon: LayoutDashboard,
        description: 'Dashboard principal com métricas'
    },
    {
        href: '/dashboard/participants',
        label: 'Participantes',
        icon: Users,
        description: 'Gerenciar participantes e respostas'
    },
    {
        href: '/dashboard/analytics',
        label: 'Analytics',
        icon: BarChart3,
        description: 'Análises e relatórios detalhados'
    },
    {
        href: '/dashboard/templates',
        label: 'Templates',
        icon: Plus,
        description: 'Modelos de funis disponíveis'
    },
    {
        href: '/dashboard/settings',
        label: 'Configurações',
        icon: Settings,
        description: 'Configurações do sistema'
    }
];

// ============================================================================
// COMPONENTS
// ============================================================================

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [location] = useLocation();

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return location === '/dashboard' || location === '/dashboard/';
        }
        return location.startsWith(href);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-50 lg:relative lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo & Close Button */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A0F3D] to-[#2E1A6B] flex items-center justify-center">
                                <LayoutDashboard className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-[#1A0F3D]">Quiz Quest</h2>
                                <p className="text-xs text-gray-500">Dashboard</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="lg:hidden"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigationItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <a
                                    onClick={() => onClose()}
                                    className={cn(
                                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                                        isActive(item.href)
                                            ? "bg-[#1A0F3D]/10 text-[#1A0F3D] border border-[#1A0F3D]/20"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-[#1A0F3D]"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5",
                                        isActive(item.href) ? "text-[#2E1A6B]" : "text-gray-400 group-hover:text-[#2E1A6B]"
                                    )} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        {item.description && !isActive(item.href) && (
                                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A0F3D] to-[#2E1A6B] flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    Admin User
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    admin@quizquest.com
                                </p>
                            </div>
                        </div>
                        <Separator className="my-3" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-gray-600 hover:text-red-600"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

interface TopBarProps {
    title?: string;
    subtitle?: string;
    onMenuClick: () => void;
    headerActions?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({
    title,
    subtitle,
    onMenuClick,
    headerActions
}) => {
    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMenuClick}
                        className="lg:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    {/* Title */}
                    <div>
                        {title && (
                            <h1 className="text-xl font-semibold text-[#1A0F3D]">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-sm text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    {/* Search */}
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                        <Search className="w-4 h-4" />
                    </Button>

                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>

                    {/* Custom Actions */}
                    {headerActions}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    title,
    subtitle,
    headerActions,
    className
}) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleMenuClick = () => {
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={handleSidebarClose}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <TopBar
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={handleMenuClick}
                    headerActions={headerActions}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className={cn("h-full", className)}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

// ============================================================================
// LAYOUT VARIANTS
// ============================================================================

interface DashboardPageProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
    children,
    title,
    subtitle,
    actions,
    className
}) => (
    <DashboardLayout
        title={title}
        subtitle={subtitle}
        headerActions={actions}
        className={className}
    >
        {children}
    </DashboardLayout>
);

interface DashboardCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    subtitle,
    children,
    actions,
    className
}) => (
    <Card className={cn("h-full", className)}>
        <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-[#1A0F3D]">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center space-x-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
        <div className="p-6">
            {children}
        </div>
    </Card>
);

// ============================================================================
// EXPORTS
// ============================================================================

export default DashboardLayout;
export { DashboardPage, DashboardCard };