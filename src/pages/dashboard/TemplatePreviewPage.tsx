/**
 * 👁️ TemplatePreviewPage
 * 
 * Página simples de preview para templates registrados em '@/config/templates'.
 * Exibe informações, imagem de preview e ações para usar o template no editor.
 */

import React from 'react';
import { TemplateService } from '@/config/templates';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedTemplateService } from '@/services/ServiceAliases';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const TemplatePreviewPage: React.FC = () => {
    const [, params] = useRoute('/templates/preview/:id');
    const templateId = params?.id || '';
    const template = TemplateService.getTemplate(templateId);

    if (!template) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6 text-center space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Template não encontrado</h2>
                        <p className="text-gray-600">ID: {templateId}</p>
                        <div className="flex items-center justify-center gap-2">
                            <a href="/admin/modelos" className="text-blue-600 hover:text-blue-800 underline">Voltar aos modelos</a>
                            <span className="text-gray-400">•</span>
                            <a href="/admin" className="text-blue-600 hover:text-blue-800 underline">Ir ao dashboard</a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleUseTemplate = () => {
        // Gera um novo funnelId e abre o editor com o template
        const newFunnelId = `funnel-${template.id}-${Date.now()}`;
        const url = `${template.editorUrl}${template.editorUrl.includes('?') ? '&' : '?'}funnel=${newFunnelId}`;
        window.location.href = url;
    };

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-4">
                    <a href="/admin/modelos" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar aos modelos
                    </a>
                </div>

                <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-gray-50 p-6 flex items-center justify-center">
                            {/* Preview image */}
                            <img
                                src={template.preview}
                                alt={`Preview ${template.name}`}
                                className="rounded-lg shadow-md max-h-[320px] object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x240/EEE/999?text=Preview+Indisponivel';
                                }}
                            />
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl text-gray-900">{template.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline">{template.category}</Badge>
                                        <Badge variant="outline">{template.difficulty}</Badge>
                                        <span className="text-xs text-gray-500">{template.stepCount} etapas</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed">{template.description}</p>

                            <div>
                                <p className="text-xs font-medium text-gray-700 mb-2">Diferenciais</p>
                                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                    {template.features.slice(0, 6).map((f, i) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button onClick={handleUseTemplate} className="bg-blue-600 hover:bg-blue-700">Usar este template</Button>
                                <a href={template.editorUrl} className="inline-flex">
                                    <Button variant="outline">
                                        Abrir no Editor <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TemplatePreviewPage;
