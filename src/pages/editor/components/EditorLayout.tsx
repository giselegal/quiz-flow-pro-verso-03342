/**
 * 🎨 EDITOR LAYOUT COMPONENTS
 * 
 * Componentes de layout específicos para o editor visual
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Layout,
    Layers,
    BarChart3,
    Sparkles,
    Crown,
    FileText
} from 'lucide-react';

// ===============================
// 🎯 EDITOR NAVIGATION
// ===============================

const EditorNavigation: React.FC = () => {
    const navigationItems = [
        {
            id: 'editor',
            name: 'Editor Visual',
            icon: Layout,
            path: '/editor',
            description: 'Editor visual com drag & drop',
            badge: 'Principal'
        },
        {
            id: 'builder',
            name: 'Builder System',
            icon: Layers,
            path: '/editor/builder',
            description: 'Sistema de construção avançado',
            badge: 'Premium'
        },
        {
            id: 'templates',
            name: 'Templates',
            icon: FileText,
            path: '/editor/templates',
            description: 'Biblioteca de templates',
            badge: 'IA'
        },
        {
            id: 'analytics',
            name: 'Analytics',
            icon: BarChart3,
            path: '/editor/analytics',
            description: 'Dashboard de métricas',
            badge: 'Insights'
        }
    ];

    return (
        <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-500" />
                        <h1 className="text-xl font-bold text-gray-900">Universal Editor</h1>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Sistema Unificado
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <Button
                                key={item.id}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <IconComponent className="w-4 h-4" />
                                {item.name}
                                {item.badge && (
                                    <Badge variant="outline" className="text-xs">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ===============================
// 🎨 EDITOR LAYOUT WRAPPER
// ===============================

interface EditorLayoutProps {
    children?: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <EditorNavigation />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

// ===============================
// 🔧 RESIZABLE PANEL COMPONENT
// ===============================

interface ResizablePanelProps {
    children: React.ReactNode;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    position: 'left' | 'right';
    onResize?: (width: number) => void;
    className?: string;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
    children,
    width = 320,
    minWidth = 250,
    maxWidth = 500,
    position,
    onResize,
    className = ''
}) => {
    const [isResizing, setIsResizing] = React.useState(false);
    const [currentWidth, setCurrentWidth] = React.useState(width);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!isResizing) return;

        const container = document.getElementById('editor-container');
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        let newWidth: number;

        if (position === 'left') {
            newWidth = e.clientX - containerRect.left;
        } else {
            newWidth = containerRect.right - e.clientX;
        }

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        setCurrentWidth(newWidth);
        onResize?.(newWidth);
    }, [isResizing, position, minWidth, maxWidth, onResize]);

    const handleMouseUp = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    React.useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, handleMouseMove, handleMouseUp]);

    return (
        <div
            className={`relative ${className}`}
            style={{ width: currentWidth }}
        >
            {children}

            {/* Resize Handle */}
            <div
                className={`
          absolute top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-500
          transition-colors duration-150 z-10
          ${position === 'left' ? 'right-0' : 'left-0'}
          ${isResizing ? 'bg-blue-500' : ''}
        `}
                onMouseDown={handleMouseDown}
            />

            {/* Resize indicator */}
            {isResizing && (
                <div className="absolute inset-0 bg-blue-50 bg-opacity-50 pointer-events-none" />
            )}
        </div>
    );
};

// ===============================
// 🎯 CANVAS CONTAINER
// ===============================

interface CanvasContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
    children,
    className = ''
}) => {
    return (
        <div
            id="canvas-container"
            className={`flex-1 relative overflow-auto bg-gray-100 ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

// ===============================
// 📊 MINI ANALYTICS WIDGET
// ===============================

export const MiniAnalyticsWidget: React.FC = () => {
    const [metrics, setMetrics] = React.useState({
        activeElements: 0,
        renderTime: 0,
        memoryUsage: 0
    });

    React.useEffect(() => {
        // Simulate metrics updates
        const interval = setInterval(() => {
            setMetrics({
                activeElements: Math.floor(Math.random() * 20) + 5,
                renderTime: Math.floor(Math.random() * 50) + 10,
                memoryUsage: Math.floor(Math.random() * 30) + 20
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="absolute bottom-4 right-4 w-64 z-50">
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Performance</h3>
                    <Badge variant="outline" className="text-xs">Tempo Real</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                        <div className="font-semibold text-blue-600">{metrics.activeElements}</div>
                        <div className="text-gray-500">Elementos</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-green-600">{metrics.renderTime}ms</div>
                        <div className="text-gray-500">Render</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-purple-600">{metrics.memoryUsage}MB</div>
                        <div className="text-gray-500">Memória</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// ===============================
// 🎨 GRID OVERLAY
// ===============================

interface GridOverlayProps {
    visible: boolean;
    size?: number;
    color?: string;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
    visible,
    size = 20,
    color = 'rgba(0,0,0,0.1)'
}) => {
    if (!visible) return null;

    const gridStyle = {
        backgroundImage: `
      linear-gradient(to right, ${color} 1px, transparent 1px),
      linear-gradient(to bottom, ${color} 1px, transparent 1px)
    `,
        backgroundSize: `${size}px ${size}px`
    };

    return (
        <div
            className="absolute inset-0 pointer-events-none z-0"
            style={gridStyle}
        />
    );
};

export default EditorLayout;