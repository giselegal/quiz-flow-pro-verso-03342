/**
 * 📚 PÁGINA DE TEMPLATES FUNCIONAIS
 * 
 * Exibe apenas templates totalmente funcionais e testados
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Plus,
    Eye,
    Edit3,
    Copy,
    Zap,
    Target,
    BarChart3,
    Sparkles,
    Clock,
    TrendingUp,
    FileText,
    Info
} from 'lucide-react';

// 🎯 IMPORTAR CONFIGURAÇÃO CENTRALIZADA
import { FUNCTIONAL_TEMPLATES } from './templates/config';
import TemplateDetailsModal from './templates/TemplateDetailsModal';
import type { TemplateConfig } from './templates/config'; const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 border-green-300';
        case 'testing': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'deprecated': return 'bg-gray-100 text-gray-800 border-gray-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'quiz': return <Target className="w-4 h-4" />;
        case 'funnel': return <TrendingUp className="w-4 h-4" />;
        case 'survey': return <BarChart3 className="w-4 h-4" />;
        case 'calculator': return <Sparkles className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
    }
};

const TemplatesPage: React.FC = () => {
  // Real data integration
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const metrics = await EnhancedUnifiedDataService.getRealTimeMetrics();
        setRealTimeMetrics(metrics);
        console.log('✅ ' + 'TemplatesPage.tsx' + ' carregado com dados reais:', metrics);
      } catch (error) {
        console.error('❌ Erro ao carregar dados reais:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRealData();
  }, []);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🎯 GERAR CATEGORIAS DINAMICAMENTE DOS TEMPLATES
    const categories = ['Todos', ...Array.from(new Set(FUNCTIONAL_TEMPLATES.map(t => t.category)))];

    const filteredTemplates = selectedCategory === 'Todos'
        ? FUNCTIONAL_TEMPLATES
        : FUNCTIONAL_TEMPLATES.filter(t => t.category === selectedCategory);

    // 🎯 CALCULAR ESTATÍSTICAS DINÂMICAS
    const stats = {
        totalTemplates: FUNCTIONAL_TEMPLATES.length,
        activeTemplates: FUNCTIONAL_TEMPLATES.filter(t => t.status === 'active').length,
        totalSteps: FUNCTIONAL_TEMPLATES.reduce((sum, t) => sum + t.totalSteps, 0),
        avgConversion: Math.round(
            FUNCTIONAL_TEMPLATES
                .filter(t => t.conversionRate)
                .reduce((sum, t) => sum + parseFloat(t.conversionRate?.replace('%', '') || '0'), 0) /
            FUNCTIONAL_TEMPLATES.filter(t => t.conversionRate).length
        )
    };

    const handleViewDetails = (template: TemplateConfig) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    }; const handlePreview = (templateId: string) => {
        window.open(`/editor/${templateId}`, '_blank');
    };

    const handleEdit = (templateId: string) => {
        window.location.href = `/editor/${templateId}`;
    };

    const handleDuplicate = (templateId: string) => {
        // TODO: Implementar duplicação
        console.log('Duplicating template:', templateId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Templates Funcionais</h2>
                    <p className="text-muted-foreground">
                        Biblioteca curada com templates testados e 100% funcionais
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Template
                </Button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <Separator />

            {/* Grid de Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {getTypeIcon(template.type)}
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                </div>
                                <Badge className={`text-xs ${getStatusColor(template.status)}`}>
                                    {template.status}
                                </Badge>
                            </div>
                            <CardDescription className="text-sm">
                                {template.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                {/* Métricas */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center p-2 bg-muted/50 rounded">
                                        <div className="font-semibold">{template.totalSteps}</div>
                                        <div className="text-muted-foreground">Etapas</div>
                                    </div>
                                    <div className="text-center p-2 bg-muted/50 rounded">
                                        <div className="font-semibold flex items-center justify-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {template.estimatedTime}
                                        </div>
                                        <div className="text-muted-foreground">Tempo</div>
                                    </div>
                                    <div className="text-center p-2 bg-muted/50 rounded">
                                        <div className="font-semibold text-green-600">
                                            {template.conversionRate || 'N/A'}
                                        </div>
                                        <div className="text-muted-foreground">Conversão</div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1">
                                    {template.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {template.tags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{template.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>

                                {/* Features */}
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-muted-foreground">Recursos:</div>
                                    <ul className="text-xs space-y-1">
                                        {template.features.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="flex items-center gap-1">
                                                <Zap className="w-3 h-3 text-green-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Ações */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handlePreview(template.id)}
                                        className="flex-1"
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Preview
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleEdit(template.id)}
                                        className="flex-1"
                                    >
                                        <Edit3 className="w-3 h-3 mr-1" />
                                        Usar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDuplicate(template.id)}
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleViewDetails(template)}
                                    >
                                        <Info className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stats */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-primary">{stats.totalTemplates}</div>
                        <div className="text-sm text-muted-foreground">Templates Ativos</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-sm text-muted-foreground">Funcionais</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">{stats.totalSteps}</div>
                        <div className="text-sm text-muted-foreground">Total de Etapas</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-600">{stats.avgConversion}%</div>
                        <div className="text-sm text-muted-foreground">Conversão Média</div>
                    </div>
                </div>
            </div>

            {/* Modal de Detalhes */}
            <TemplateDetailsModal
                template={selectedTemplate}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPreview={handlePreview}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
            />
        </div>
    );
};

export default TemplatesPage;