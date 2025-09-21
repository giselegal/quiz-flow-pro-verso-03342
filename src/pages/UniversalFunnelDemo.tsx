/**
 * 🎪 UNIVERSAL FUNNEL EDITOR DEMO
 * 
 * Página de demonstração mostrando o editor universal em ação
 * com diferentes tipos de funis
 */

import React, { useState } from 'react';
import { UniversalFunnelIntegration } from '../core/UniversalFunnelIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Zap,
    Users,
    User,
    ShoppingCart,
    Video,
    Settings,
    Eye,
    Plus,
    Sparkles
} from 'lucide-react';

interface FunnelTemplate {
    id: string;
    name: string;
    type: string;
    description: string;
    icon: React.ReactNode;
    preview: string;
    features: string[];
    color: string;
}

const FUNNEL_TEMPLATES: FunnelTemplate[] = [
    {
        id: 'quiz21StepsComplete',
        name: 'Quiz 21 Steps Complete',
        type: 'quiz',
        description: 'Quiz interativo completo com 21 etapas para engajamento máximo',
        icon: <Zap className="w-6 h-6" />,
        preview: '/api/preview/quiz21StepsComplete',
        features: ['21 Etapas Interativas', 'Sistema de Pontuação', 'Resultados Personalizados', 'Analytics Avançado'],
        color: 'bg-blue-500'
    },
    {
        id: 'lead-magnet-ebook',
        name: 'Lead Magnet - E-book',
        type: 'lead-magnet',
        description: 'Funil de captura para distribuição de e-book gratuito',
        icon: <Users className="w-6 h-6" />,
        preview: '/api/preview/lead-magnet-ebook',
        features: ['Landing Page Otimizada', 'Formulário de Captura', 'Página de Download', 'E-mail de Confirmação'],
        color: 'bg-green-500'
    },
    {
        id: 'personal-branding-coach',
        name: 'Personal Branding - Coach',
        type: 'personal-branding',
        description: 'Site pessoal para coaches e consultores',
        icon: <User className="w-6 h-6" />,
        preview: '/api/preview/personal-branding-coach',
        features: ['Hero Section', 'Sobre Mim', 'Serviços', 'Depoimentos', 'Contato'],
        color: 'bg-purple-500'
    },
    {
        id: 'ecommerce-checkout',
        name: 'E-commerce Checkout',
        type: 'ecommerce',
        description: 'Funil de checkout otimizado para vendas online',
        icon: <ShoppingCart className="w-6 h-6" />,
        preview: '/api/preview/ecommerce-checkout',
        features: ['Página de Produto', 'Carrinho', 'Checkout', 'Upsell', 'Confirmação'],
        color: 'bg-orange-500'
    },
    {
        id: 'webinar-registration',
        name: 'Webinar Registration',
        type: 'webinar',
        description: 'Funil completo para registro e acompanhamento de webinar',
        icon: <Video className="w-6 h-6" />,
        preview: '/api/preview/webinar-registration',
        features: ['Landing de Registro', 'Confirmação', 'Lembrete', 'Sala de Webinar', 'Follow-up'],
        color: 'bg-red-500'
    }
];

export const UniversalFunnelDemo: React.FC = () => {
    const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'gallery' | 'editor'>('gallery');

    if (viewMode === 'editor' && selectedFunnel) {
        const template = FUNNEL_TEMPLATES.find(t => t.id === selectedFunnel);

        return (
            <UniversalFunnelIntegration
                funnelId={selectedFunnel}
                funnelType={template?.type}
                onCancel={() => {
                    setViewMode('gallery');
                    setSelectedFunnel(null);
                }}
                onSave={async (data) => {
                    console.log('Salvando funil:', data);
                    // Implementar salvamento
                    alert('Funil salvo com sucesso!');
                }}
                onPreview={(funnel) => {
                    console.log('Preview do funil:', funnel);
                    // Implementar preview
                    alert('Abrindo preview...');
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-blue-600" />
                                Universal Funnel Editor
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Editor universal que permite editar qualquer tipo de funil de forma intuitiva
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Configurações
                            </Button>
                            <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Funil
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tipos Suportados</p>
                                    <p className="text-2xl font-bold text-gray-900">5+</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Blocos Disponíveis</p>
                                    <p className="text-2xl font-bold text-gray-900">15+</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Templates</p>
                                    <p className="text-2xl font-bold text-gray-900">{FUNNEL_TEMPLATES.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Compatibilidade</p>
                                    <p className="text-2xl font-bold text-gray-900">100%</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Templates Gallery */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Templates Disponíveis
                        </h2>
                        <div className="text-sm text-gray-600">
                            Clique em "Editar" para começar a personalizar
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FUNNEL_TEMPLATES.map((template) => (
                            <Card key={template.id} className="group hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                                            {template.icon}
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {template.type}
                                        </Badge>
                                    </div>

                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        {template.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600">
                                        {template.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="space-y-4">
                                        {/* Features */}
                                        <div>
                                            <p className="text-xs font-medium text-gray-700 mb-2">Características:</p>
                                            <div className="space-y-1">
                                                {template.features.map((feature, index) => (
                                                    <div key={index} className="text-xs text-gray-600 flex items-center">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedFunnel(template.id);
                                                    setViewMode('editor');
                                                }}
                                                className="flex-1"
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    // Implementar preview
                                                    window.open(template.preview, '_blank');
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-blue-600" />
                            Recursos do Editor Universal
                        </CardTitle>
                        <CardDescription>
                            Um editor que funciona com qualquer tipo de funil
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Edição Visual</h3>
                                <p className="text-sm text-gray-600">
                                    Interface drag & drop intuitiva para edição de qualquer bloco
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Universal</h3>
                                <p className="text-sm text-gray-600">
                                    Funciona com quiz, lead magnet, personal branding e mais
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Preview em Tempo Real</h3>
                                <p className="text-sm text-gray-600">
                                    Veja suas mudanças instantaneamente durante a edição
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UniversalFunnelDemo;