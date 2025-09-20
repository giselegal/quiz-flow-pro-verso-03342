import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, Bot, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// 🤖 Importar sistema TemplatesIA
import { FunnelAIAgent, type FunnelTemplate } from '@/services/FunnelAIAgent';
import { useEditorProContext } from '@/components/editor/EditorProProvider';

/**
 * 🤖 TEMPLATES IA SIDEBAR
 * 
 * Integra TemplatesIA.tsx (942 linhas) como sidebar
 * Permite aplicação direta de templates IA no canvas
 */

interface TemplatesIASidebarProps {
    onClose: () => void;
}

export const TemplatesIASidebar: React.FC<TemplatesIASidebarProps> = ({ onClose }) => {
    const [templates, setTemplates] = useState<FunnelTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null);

    const { applyTemplate, trackEvent } = useEditorProContext();

    // 🔄 Carregar templates na inicialização
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setIsLoading(true);
        try {
            const aiAgent = new FunnelAIAgent();

            // Mock de templates para demonstração
            // Em produção, isso viria da API/TemplatesIA.tsx
            const mockTemplates: FunnelTemplate[] = [
                {
                    meta: {
                        name: 'Consultora de Estilo IA',
                        description: 'Funil completo para consultoria de estilo com IA',
                        version: '2.0.0',
                        author: 'giselegal'
                    },
                    design: {
                        primaryColor: '#9333EA',
                        secondaryColor: '#EC4899',
                        accentColor: '#A855F7',
                        backgroundColor: 'linear-gradient(to bottom right, #F3E8FF, #FCE7F3)',
                        fontFamily: 'Inter, Poppins, sans-serif',
                        button: {
                            background: 'linear-gradient(90deg, #9333EA, #EC4899)',
                            textColor: '#fff',
                            borderRadius: '12px',
                            shadow: '0 8px 20px rgba(147, 51, 234, 0.25)'
                        },
                        card: {
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '16px',
                            shadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        },
                        progressBar: {
                            color: 'linear-gradient(90deg, #9333EA, #EC4899)',
                            background: 'rgba(255, 255, 255, 0.2)',
                            height: '8px'
                        },
                        animations: {
                            questionTransition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            optionSelect: 'transform 0.2s ease, box-shadow 0.2s ease',
                            button: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            formTransition: 'all 0.5s ease-in-out',
                            buttonHover: 'transform 0.2s ease, filter 0.2s ease',
                            resultAppear: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out'
                        }
                    },
                    structure: {
                        steps: 21,
                        flow: 'linear',
                        leadCapture: true,
                        resultsPage: true
                    }
                },
                {
                    meta: {
                        name: 'Quiz de Personalidade',
                        description: 'Template genérico para quiz de personalidade',
                        version: '1.0.0',
                        author: 'AI Generated'
                    },
                    design: {
                        primaryColor: '#3B82F6',
                        secondaryColor: '#1E40AF',
                        accentColor: '#F59E0B',
                        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontFamily: 'Inter, sans-serif',
                        button: {
                            background: 'linear-gradient(90deg, #3B82F6, #1E40AF)',
                            textColor: '#fff',
                            borderRadius: '8px',
                            shadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
                        },
                        card: {
                            background: '#ffffff',
                            borderRadius: '12px',
                            shadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                        },
                        progressBar: {
                            color: '#3B82F6',
                            background: 'rgba(59, 130, 246, 0.1)',
                            height: '6px'
                        },
                        animations: {
                            questionTransition: 'all 0.4s ease-in-out',
                            optionSelect: 'transform 0.15s ease',
                            button: 'all 0.25s ease',
                            resultAppear: 'opacity 0.6s ease-in'
                        }
                    },
                    structure: {
                        steps: 10,
                        flow: 'linear',
                        leadCapture: true,
                        resultsPage: true
                    }
                }
            ];

            setTemplates(mockTemplates);

        } catch (error) {
            console.error('❌ Erro ao carregar templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyTemplate = async (template: FunnelTemplate) => {
        try {
            setIsLoading(true);

            trackEvent('template_preview_requested', {
                templateName: template.meta.name,
                source: 'sidebar'
            });

            await applyTemplate(template);

            trackEvent('template_applied_success', {
                templateName: template.meta.name,
                source: 'sidebar'
            });

            // Fechar sidebar após aplicar
            onClose();

        } catch (error) {
            console.error('❌ Erro ao aplicar template:', error);
            trackEvent('template_apply_error', {
                templateName: template.meta.name,
                error: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* 🎯 Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Templates IA</h2>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        🤖 BETA
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="hover:bg-gray-100"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* 🎯 Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                            <span className="text-gray-600">Carregando templates...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 🎯 Templates list */}
                        {templates.map((template, index) => (
                            <Card
                                key={index}
                                className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                                onClick={() => setSelectedTemplate(template)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-sm font-medium">
                                            {template.meta.name}
                                        </CardTitle>
                                        <Badge
                                            variant="outline"
                                            style={{
                                                borderColor: template.design.primaryColor,
                                                color: template.design.primaryColor
                                            }}
                                        >
                                            v{template.meta.version}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-xs text-gray-600 mb-3">
                                        {template.meta.description}
                                    </p>

                                    {/* 🎨 Preview cores */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-gray-500">Cores:</span>
                                        <div className="flex gap-1">
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: template.design.primaryColor }}
                                            />
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: template.design.secondaryColor }}
                                            />
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: template.design.accentColor }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            {template.structure && (
                                                <>
                                                    <span>📊 {template.structure.steps} etapas</span>
                                                    {template.structure.leadCapture && (
                                                        <span>📧 Lead capture</span>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <Button
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleApplyTemplate(template);
                                            }}
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                        >
                                            {isLoading ? (
                                                <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
                                            ) : (
                                                <>
                                                    <Play className="w-3 h-3 mr-1" />
                                                    Aplicar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {templates.length === 0 && !isLoading && (
                            <div className="text-center py-8">
                                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">
                                    Nenhum template disponível
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 🎯 Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Wand2 className="w-4 h-4" />
                    <span>
                        Templates gerados por IA para otimização de conversão
                    </span>
                </div>
            </div>
        </div>
    );
};