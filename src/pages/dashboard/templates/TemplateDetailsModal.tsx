/**
 * 🎯 MODAL DE DETALHES DO TEMPLATE
 * 
 * Componente para exibir detalhes completos de um template
 * com preview, recursos, integrações e métricas.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Clock,
    Users,
    TrendingUp,
    Zap,
    Star,
    Eye,
    Edit3,
    Copy,
    ExternalLink,
    CheckCircle,
    Target,
    BarChart3,
    Sparkles
} from 'lucide-react';
import type { TemplateConfig } from './config';

interface TemplateDetailsModalProps {
    template: TemplateConfig | null;
    isOpen: boolean;
    onClose: () => void;
    onPreview: (templateId: string) => void;
    onEdit: (templateId: string) => void;
    onDuplicate: (templateId: string) => void;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'quiz': return <Target className="w-5 h-5" />;
        case 'funnel': return <TrendingUp className="w-5 h-5" />;
        case 'survey': return <BarChart3 className="w-5 h-5" />;
        case 'calculator': return <Sparkles className="w-5 h-5" />;
        default: return <Target className="w-5 h-5" />;
    }
};

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'beginner': return 'bg-green-100 text-green-800';
        case 'intermediate': return 'bg-yellow-100 text-yellow-800';
        case 'advanced': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const TemplateDetailsModal: React.FC<TemplateDetailsModalProps> = ({
    template,
    isOpen,
    onClose,
    onPreview,
    onEdit,
    onDuplicate
}) => {
    if (!template) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {getTypeIcon(template.type)}
                        {template.name}
                        <Badge variant="secondary" className="ml-2">
                            {template.status}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)]">
                    <div className="space-y-6">
                        {/* Descrição e Métricas Principais */}
                        <div className="space-y-4">
                            <p className="text-muted-foreground text-lg">
                                {template.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">{template.totalSteps}</div>
                                    <div className="text-sm text-muted-foreground">Etapas</div>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                                        <Clock className="w-5 h-5" />
                                        {template.estimatedTime}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Duração</div>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {template.conversionRate || 'N/A'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Conversão</div>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        {template.analytics.rating || 'N/A'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Avaliação</div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Tags e Categorias */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Categorias e Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="default">{template.category}</Badge>
                                {template.subcategory && (
                                    <Badge variant="outline">{template.subcategory}</Badge>
                                )}
                                <Badge className={getDifficultyColor(template.difficulty)}>
                                    {template.difficulty}
                                </Badge>
                                {template.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Recursos e Funcionalidades */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Recursos Inclusos</h4>
                            <div className="grid md:grid-cols-2 gap-3">
                                {template.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Integrações */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Integrações Disponíveis</h4>
                            <div className="flex flex-wrap gap-2">
                                {template.integrations.map((integration) => (
                                    <Badge key={integration} variant="outline" className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        {integration}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Customizações */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Opções de Customização</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className={`text-center p-3 rounded-lg ${template.customizations.colors
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <div className="font-medium">Cores</div>
                                    <div className="text-xs">
                                        {template.customizations.colors ? 'Disponível' : 'Limitado'}
                                    </div>
                                </div>
                                <div className={`text-center p-3 rounded-lg ${template.customizations.layout
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <div className="font-medium">Layout</div>
                                    <div className="text-xs">
                                        {template.customizations.layout ? 'Disponível' : 'Limitado'}
                                    </div>
                                </div>
                                <div className={`text-center p-3 rounded-lg ${template.customizations.content
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <div className="font-medium">Conteúdo</div>
                                    <div className="text-xs">
                                        {template.customizations.content ? 'Disponível' : 'Limitado'}
                                    </div>
                                </div>
                                <div className={`text-center p-3 rounded-lg ${template.customizations.logic
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <div className="font-medium">Lógica</div>
                                    <div className="text-xs">
                                        {template.customizations.logic ? 'Disponível' : 'Limitado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Analytics e Dados */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Dados de Performance</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {template.analytics.views && (
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">
                                            {template.analytics.views.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-blue-600">Visualizações</div>
                                    </div>
                                )}
                                {template.analytics.uses && (
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-lg font-bold text-purple-600">
                                            {template.analytics.uses.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-purple-600">Usos</div>
                                    </div>
                                )}
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">
                                        {new Date(template.analytics.lastUpdated).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="text-xs text-green-600">Última Atualização</div>
                                </div>
                            </div>
                        </div>

                        {/* Prerequisites (se existir) */}
                        {template.prerequisites && template.prerequisites.length > 0 && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <h4 className="font-semibold">Pré-requisitos</h4>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <ul className="space-y-1">
                                            {template.prerequisites.map((prereq, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-yellow-600" />
                                                    {prereq}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>

                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={() => onPreview(template.id)} variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button onClick={() => onEdit(template.id)} className="flex-1">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Usar Template
                    </Button>
                    <Button onClick={() => onDuplicate(template.id)} variant="outline">
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                    </Button>
                    <Button variant="outline" size="icon">
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TemplateDetailsModal;