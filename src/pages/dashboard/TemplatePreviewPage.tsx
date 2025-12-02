/**
 * 👁️ TemplatePreviewPage
 * 
 * Página simples de preview para templates registrados.
 * Exibe informações, imagem de preview e ações para usar o template no editor.
 */

import React, { useState, useEffect } from 'react';
import { getUnifiedTemplates, UnifiedTemplate } from '@/config/unifiedTemplatesRegistry';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';

const TemplatePreviewPage: React.FC = () => {
    const [, params] = useRoute('/templates/preview/:id');
    const templateId = params?.id || '';
    const [template, setTemplate] = useState<UnifiedTemplate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const templates = getUnifiedTemplates();
        const found = templates.find((t: UnifiedTemplate) => t.id === templateId);
        setTemplate(found || null);
        setLoading(false);
    }, [templateId]);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }

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
        const editorUrl = '/editor';
        const url = `${editorUrl}?funnel=${newFunnelId}&template=${template.id}`;
        window.location.href = url;
    };

    const previewImage = template.image || 'https://placehold.co/400x240/EEE/999?text=Preview';
    const category = template.category || 'quiz';
    const stepCount = template.stepCount || 0;

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
                                src={previewImage}
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
                                        <Badge variant="outline">{category}</Badge>
                                        {template.version && <Badge variant="outline">v{template.version}</Badge>}
                                        <span className="text-xs text-gray-500">{stepCount} etapas</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed">{template.description}</p>

                            {template.tags && template.tags.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-gray-700 mb-2">Tags</p>
                                    <div className="flex flex-wrap gap-1">
                                        {template.tags.slice(0, 6).map((tag: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button onClick={handleUseTemplate} className="bg-blue-600 hover:bg-blue-700">Usar este template</Button>
                                <a href={`/editor?template=${template.id}`} className="inline-flex">
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
