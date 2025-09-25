/**
 * 🧭 NAVEGADOR DE TIPOS DE FUNIS
 * 
 * Componente simples para navegar entre diferentes tipos de funis no editor
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Target,
    FileText,
    ShoppingCart,
    Users,
    ArrowRight,
    Sparkles
} from 'lucide-react';

interface FunnelTypeCard {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    demoUrl: string;
    category: string;
    features: string[];
}

const FUNNEL_TYPES_CARDS: FunnelTypeCard[] = [
    {
        id: 'quiz-estilo-21-steps',
        name: 'Quiz de Estilo Pessoal',
        description: 'Quiz completo com 21 etapas para descoberta do estilo pessoal',
        icon: Target,
        demoUrl: '/editor/quiz-estilo-demo',
        category: 'Quiz',
        features: ['21 etapas', 'IA integrada', 'Lógica customizada', 'Resultados personalizados']
    },
    {
        id: 'landing-page',
        name: 'Landing Page',
        description: 'Página de captura ou conversão com formulário',
        icon: FileText,
        demoUrl: '/editor/landing-demo',
        category: 'Landing',
        features: ['3 etapas', 'Formulário captura', 'Drag & Drop', 'Conversão otimizada']
    },
    {
        id: 'sales-funnel',
        name: 'Funil de Vendas',
        description: 'Funil completo com apresentação e checkout',
        icon: ShoppingCart,
        demoUrl: '/editor/sales-demo',
        category: 'E-commerce',
        features: ['7 etapas', 'Checkout integrado', 'Upsell/Cross-sell', 'Pagamentos']
    },
    {
        id: 'lead-magnet',
        name: 'Lead Magnet',
        description: 'Captura de leads com material gratuito',
        icon: Users,
        demoUrl: '/editor/lead-demo',
        category: 'Lead Gen',
        features: ['4 etapas', 'Material gratuito', 'Email marketing', 'Automação']
    }
];

const FunnelTypeNavigator: React.FC = () => {
    const handleOpenEditor = (demoUrl: string) => {
        window.open(demoUrl, '_blank');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Editor de Funis Multi-Tipo
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Escolha o tipo de funil que deseja editar. O sistema detectará automaticamente
                    o tipo e carregará as configurações apropriadas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FUNNEL_TYPES_CARDS.map((funnel) => {
                    const IconComponent = funnel.icon;

                    return (
                        <Card key={funnel.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                                            <IconComponent className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{funnel.name}</CardTitle>
                                            <Badge variant="outline" className="text-xs">
                                                {funnel.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    {funnel.description}
                                </p>

                                <div className="mb-4">
                                    <p className="text-xs font-medium text-gray-500 mb-2">CARACTERÍSTICAS:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {funnel.features.map((feature, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        className="flex-1"
                                        onClick={() => handleOpenEditor(funnel.demoUrl)}
                                    >
                                        Abrir Editor
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const customId = prompt(`Digite um ID personalizado para ${funnel.name}:`, `meu-${funnel.id}-123`);
                                            if (customId) {
                                                handleOpenEditor(`/editor/${customId}`);
                                            }
                                        }}
                                    >
                                        ID Custom
                                    </Button>
                                </div>

                                <div className="mt-3 text-xs text-gray-500">
                                    <strong>URL Demo:</strong> {funnel.demoUrl}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">💡 Como Usar</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Demo:</strong> Use os botões "Abrir Editor" para testar com dados de exemplo</li>
                    <li>• <strong>ID Custom:</strong> Crie funis personalizados com seu próprio ID</li>
                    <li>• <strong>URL Direta:</strong> Acesse <code>/editor/SEU-ID</code> diretamente</li>
                    <li>• <strong>Detecção Automática:</strong> O sistema detecta o tipo baseado no ID</li>
                </ul>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Para o <strong>Quiz de Estilo Pessoal</strong>, o sistema usa o HybridTemplateService
                    com 21 etapas e lógica avançada de pontuação.
                </p>
            </div>
        </div>
    );
};

export default FunnelTypeNavigator;