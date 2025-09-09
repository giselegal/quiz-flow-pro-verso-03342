import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { Play, Plus, Sparkles, Zap, Copy, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { useUnifiedContext } from '@/core/contexts/UnifiedContextProvider';
import { LegacyCompatibilityWrapper } from '@/core/contexts/LegacyCompatibilityWrapper';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { type UnifiedTemplateData, type TemplateSearchFilters } from '@/core/templates/UnifiedTemplateManager';

/**
 * 🎯 FUNNEL PANEL PAGE COM CONTEXTO UNIFICADO
 * 
 * Versão modernizada que usa UnifiedContextProvider para:
 * - Template management centralizado
 * - Estado persistente
 * - Performance otimizada
 * - Compatibilidade com componentes legacy
 */

const FunnelPanelPageUnifiedContent: React.FC = () => {
    const [, setLocation] = useLocation();
    const unifiedContext = useUnifiedContext();

    // Estados locais
    const [search, setSearch] = React.useState('');
    const [category, setCategory] = React.useState('all');
    const [sort, setSort] = React.useState<'name' | 'usageCount' | 'createdAt' | 'updatedAt'>('name');
    const [activeTab, setActiveTab] = React.useState<'official' | 'custom'>('official');
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = React.useState(false);
    const [selectedTemplateToCustomize, setSelectedTemplateToCustomize] = React.useState<UnifiedTemplateData | null>(null);
    const [customizationForm, setCustomizationForm] = React.useState({
        name: '',
        description: '',
        category: 'custom',
        theme: 'modern',
        notes: ''
    });

    // Dados do contexto unificado
    const { templates } = unifiedContext;

    // Carregar templates quando filtros mudarem
    React.useEffect(() => {
        loadTemplates();
    }, [category, sort, activeTab]);

    const loadTemplates = async () => {
        try {
            console.log('🔄 Carregando templates via UnifiedContext...');

            const filters: TemplateSearchFilters = {
                sortBy: sort,
                ...(category !== 'all' && { category }),
                ...(activeTab === 'official' && { isCustom: false }),
                ...(activeTab === 'custom' && { isCustom: true }),
                ...(search && { search })
            };

            // O UnifiedContext gerencia o loading automaticamente
            // Podemos disparar um refresh dos templates se necessário
            console.log('✅ Templates carregados via UnifiedContext:', {
                count: templates.available.length,
                filters
            });
        } catch (error) {
            console.error('❌ Erro ao carregar templates:', error);
        }
    };

    // Filtrar templates baseado nos critérios locais
    const filteredTemplates = React.useMemo(() => {
        let filtered = templates.available;

        // Filtro por tipo (official/custom)
        if (activeTab === 'official') {
            filtered = filtered.filter(t => !t.isCustom);
        } else if (activeTab === 'custom') {
            filtered = filtered.filter(t => t.isCustom);
        }

        // Filtro por categoria
        if (category !== 'all') {
            filtered = filtered.filter(t => t.category === category);
        }

        // Filtro por busca
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(searchLower) ||
                t.description.toLowerCase().includes(searchLower) ||
                (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
        }

        // Ordenação
        filtered.sort((a, b) => {
            switch (sort) {
                case 'usageCount':
                    // Fallback for missing metadata property
                    return 0;
                case 'createdAt':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                case 'updatedAt':
                    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [templates.available, activeTab, category, search, sort]);

    // Usar template via UnifiedContext
    const handleUseTemplate = async (templateId: string) => {
        try {
            console.log('🎯 Usando template via UnifiedContext:', templateId);

            // Usar o template através do contexto unificado
            await unifiedContext.loadTemplate(templateId);

            // Salvar no localStorage para compatibilidade
            const templateData = templates.available.find(t => t.id === templateId);
            if (templateData) {
                const funnelItem = {
                    id: `funnel-${Date.now()}`,
                    name: `Funil: ${templateData.name}`,
                    templateId: templateId,
                    status: 'draft' as const,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                funnelLocalStore.upsert(funnelItem);
            }

            // Navegar para o editor
            setLocation('/editor');
        } catch (error) {
            console.error('❌ Erro ao usar template:', error);
        }
    };

    // Customizar template
    const handleCustomizeTemplate = (template: UnifiedTemplateData) => {
        setSelectedTemplateToCustomize(template);
        setCustomizationForm({
            name: `${template.name} (Customizado)`,
            description: template.description,
            category: 'custom',
            theme: template.theme || 'modern',
            notes: ''
        });
        setIsCustomizeModalOpen(true);
    };

    // Salvar customização via UnifiedContext
    const handleSaveCustomization = async () => {
        if (!selectedTemplateToCustomize) return;

        try {
            const customizedTemplate: UnifiedTemplateData = {
                ...selectedTemplateToCustomize,
                id: `custom-${Date.now()}`,
                name: customizationForm.name,
                description: customizationForm.description,
                category: customizationForm.category,
                theme: customizationForm.theme,
                isCustom: true,
                // Remove metadata references for now
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Salvar via UnifiedContext (quando implementado)
            await unifiedContext.saveAsTemplate(customizedTemplate.name, customizedTemplate.description);

            console.log('✅ Template customizado salvo:', customizedTemplate.id);
            setIsCustomizeModalOpen(false);
            setSelectedTemplateToCustomize(null);

            // Recarregar templates
            loadTemplates();
        } catch (error) {
            console.error('❌ Erro ao salvar customização:', error);
        }
    };

    // Duplicar template
    const handleDuplicateTemplate = async (template: UnifiedTemplateData) => {
        try {
            const duplicatedTemplate: UnifiedTemplateData = {
                ...template,
                id: `copy-${Date.now()}`,
                name: `${template.name} (Cópia)`,
                isCustom: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Duplicar via UnifiedContext
            await unifiedContext.saveAsTemplate(duplicatedTemplate.name, duplicatedTemplate.description);

            console.log('✅ Template duplicado:', duplicatedTemplate.id);
            loadTemplates();
        } catch (error) {
            console.error('❌ Erro ao duplicar template:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <AdminBreadcrumbs items={[
                { label: 'Admin', href: '/admin' },
                { label: 'Templates', href: '/admin/funnels' }
            ]} />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Templates de Funil</h1>
                    <p className="text-gray-600 mt-2">
                        Escolha um template para começar seu funil.
                        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                            Unified Context
                        </Badge>
                    </p>
                </div>
                <Button
                    onClick={() => setLocation('/admin/templates/new')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Template
                </Button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
                <Input
                    placeholder="Buscar templates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                />

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        <SelectItem value="lead-generation">Geração de Leads</SelectItem>
                        <SelectItem value="product-launch">Lançamento</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sort} onValueChange={(value: any) => setSort(value)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Nome</SelectItem>
                        <SelectItem value="usageCount">Mais usados</SelectItem>
                        <SelectItem value="createdAt">Mais recentes</SelectItem>
                        <SelectItem value="updatedAt">Atualizados</SelectItem>
                    </SelectContent>
                </Select>

                <div className="text-sm text-gray-500">
                    {filteredTemplates.length} template(s) encontrado(s)
                    {templates.loading && (
                        <span className="ml-2 text-blue-500">(Carregando...)</span>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="official">Templates Oficiais</TabsTrigger>
                    <TabsTrigger value="custom">Meus Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="official" className="space-y-4">
                    <TemplateGrid
                        templates={filteredTemplates}
                        onUse={handleUseTemplate}
                        onCustomize={handleCustomizeTemplate}
                        onDuplicate={handleDuplicateTemplate}
                        isLoading={templates.loading}
                    />
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                    <TemplateGrid
                        templates={filteredTemplates}
                        onUse={handleUseTemplate}
                        onCustomize={handleCustomizeTemplate}
                        onDuplicate={handleDuplicateTemplate}
                        isLoading={templates.loading}
                        showCustomActions={true}
                    />
                </TabsContent>
            </Tabs>

            {/* Modal de Customização */}
            <Dialog open={isCustomizeModalOpen} onOpenChange={setIsCustomizeModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Customizar Template</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="custom-name">Nome</Label>
                            <Input
                                id="custom-name"
                                value={customizationForm.name}
                                onChange={(e) => setCustomizationForm(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="custom-description">Descrição</Label>
                            <Textarea
                                id="custom-description"
                                value={customizationForm.description}
                                onChange={(e) => setCustomizationForm(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="custom-notes">Notas</Label>
                            <Textarea
                                id="custom-notes"
                                placeholder="Descreva suas modificações..."
                                value={customizationForm.notes}
                                onChange={(e) => setCustomizationForm(prev => ({
                                    ...prev,
                                    notes: e.target.value
                                }))}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                onClick={handleSaveCustomization}
                                className="flex-1"
                            >
                                Salvar Template
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsCustomizeModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Componente de Grid de Templates
interface TemplateGridProps {
    templates: UnifiedTemplateData[];
    onUse: (templateId: string) => void;
    onCustomize: (template: UnifiedTemplateData) => void;
    onDuplicate: (template: UnifiedTemplateData) => void;
    isLoading: boolean;
    showCustomActions?: boolean;
}

const TemplateGrid: React.FC<TemplateGridProps> = ({
    templates,
    onUse,
    onCustomize,
    onDuplicate,
    isLoading,
    showCustomActions = false
}) => {
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-9 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (templates.length === 0) {
        return (
            <div className="text-center py-12">
                <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum template encontrado
                </h3>
                <p className="text-gray-500">
                    Tente ajustar seus filtros ou criar um novo template.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map(template => (
                <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {template.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {template.tags?.slice(0, 3).map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {template.isCustom && (
                                        <Badge variant="outline" className="text-xs">
                                            Personalizado
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail placeholder - will be implemented when thumbnailUrl is available */}
                            {false && (
                                <div className="ml-4 flex-shrink-0">
                                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => onUse(template.id)}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                                size="sm"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Usar
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onCustomize(template)}
                            >
                                <Zap className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDuplicate(template)}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>

                            {showCustomActions && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Componente principal com provider
const FunnelPanelPageUnified: React.FC = () => {
    return (
        <LegacyCompatibilityWrapper
            enableWarnings={false}
            initialContext={FunnelContext.EDITOR}
        >
            <FunnelPanelPageUnifiedContent />
        </LegacyCompatibilityWrapper>
    );
};

export default FunnelPanelPageUnified;
