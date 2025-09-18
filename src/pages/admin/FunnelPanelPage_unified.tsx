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
import { ThumbnailImage } from '@/components/ui/EnhancedOptimizedImage';
import { funnelLocalStore } from '@/services/funnelLocalStore';
import { Play, Plus, Sparkles, Zap, Copy, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';
import { unifiedTemplateManager, type UnifiedTemplateData, type TemplateSearchFilters } from '@/core/templates/UnifiedTemplateManager';

const FunnelPanelPageUnified: React.FC = () => {
    const [, setLocation] = useLocation();

    // Estados locais
    const [templates, setTemplates] = React.useState<UnifiedTemplateData[]>([]);
    const [loading, setLoading] = React.useState(true);
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

    // Carregar templates usando UnifiedTemplateManager
    React.useEffect(() => {
        loadTemplates();
    }, [category, sort, activeTab]);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            console.log('🔄 Carregando templates via UnifiedTemplateManager...');

            const filters: TemplateSearchFilters = {
                sortBy: sort,
                ...(category !== 'all' && { category }),
                ...(activeTab === 'official' && { isCustom: false }),
                ...(activeTab === 'custom' && { isCustom: true })
            };

            const allTemplates = await unifiedTemplateManager.getAllTemplates(filters);
            setTemplates(allTemplates);

            console.log(`✅ ${allTemplates.length} templates carregados`);
        } catch (error) {
            console.error('❌ Erro ao carregar templates:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar templates por busca
    const filteredTemplates = React.useMemo(() => {
        if (!search) return templates;

        const searchLower = search.toLowerCase();
        return templates.filter(template =>
            template.name.toLowerCase().includes(searchLower) ||
            template.description.toLowerCase().includes(searchLower) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }, [templates, search]);

    // Função para personalizar template
    const handleCustomizeTemplate = (template: UnifiedTemplateData) => {
        setSelectedTemplateToCustomize(template);
        setCustomizationForm({
            name: `${template.name} (Personalizado)`,
            description: template.description || '',
            category: template.category || 'custom',
            theme: template.theme || 'modern',
            notes: ''
        });
        setIsCustomizeModalOpen(true);
    };

    // Função para salvar template personalizado
    const handleSaveCustomTemplate = async () => {
        if (!selectedTemplateToCustomize) return;

        try {
            console.log('💾 Criando template personalizado...');

            const customTemplateId = await unifiedTemplateManager.createCustomTemplate({
                name: customizationForm.name,
                description: customizationForm.description,
                category: customizationForm.category,
                theme: customizationForm.theme,
                templateId: selectedTemplateToCustomize.id
            });

            if (customTemplateId) {
                console.log('✅ Template personalizado criado:', customTemplateId);

                // Recarregar templates
                await loadTemplates();
                setIsCustomizeModalOpen(false);

                // Mudar para aba de templates personalizados
                setActiveTab('custom');
            } else {
                throw new Error('Falha ao criar template personalizado');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar template personalizado:', error);
            alert('Erro ao criar template personalizado. Tente novamente.');
        }
    };

    // Função para excluir template personalizado
    const handleDeleteCustomTemplate = async (templateId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este template personalizado?')) {
            try {
                const success = await unifiedTemplateManager.deleteCustomTemplate(templateId);
                if (success) {
                    console.log('✅ Template personalizado excluído');
                    await loadTemplates(); // Recarregar lista
                } else {
                    throw new Error('Falha ao excluir template');
                }
            } catch (error) {
                console.error('❌ Erro ao excluir template:', error);
                alert('Erro ao excluir template. Tente novamente.');
            }
        }
    };

    // Função para usar template
    const handleUseTemplate = async (templateId: string) => {
        try {
            console.log('🎯 Usando template via UnifiedTemplateManager:', templateId);

            const template = await unifiedTemplateManager.getTemplateById(templateId);
            if (!template) {
                throw new Error('Template não encontrado');
            }

            // Criar funil via UnifiedTemplateManager
            const funnelId = await unifiedTemplateManager.createFunnelFromTemplate(
                templateId,
                `${template.name} - ${new Date().toLocaleDateString()}`
            );

            if (funnelId) {
                console.log('✅ Funil criado:', funnelId);

                // Adicionar à lista local para compatibilidade
                const newFunnel = {
                    id: funnelId,
                    name: template.name,
                    status: 'draft' as const,
                    updatedAt: new Date().toISOString()
                };

                const list = funnelLocalStore.list();
                list.push(newFunnel);
                funnelLocalStore.saveList(list);

                // Navegar para o editor
                setLocation(`/editor?funnel=${encodeURIComponent(funnelId)}&template=${templateId}`);
            } else {
                throw new Error('Falha ao criar funil');
            }
        } catch (error) {
            console.error('❌ Erro ao usar template:', error);
            // Fallback: navegar só com template
            setLocation(`/editor?template=${templateId}`);
        }
    };

    const handleCreateCustom = () => {
        setLocation('/editor');
    };

    // Buscar categorias disponíveis
    const categories = unifiedTemplateManager.getCategories();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8">
                <AdminBreadcrumbs
                    items={[
                        { label: 'Admin', href: '/admin' },
                        { label: 'Funis', href: '/admin/funnels' }
                    ]}
                />

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Templates de Funis
                    </h1>
                    <p className="text-lg text-gray-600">
                        Escolha um template para começar seu funil ou crie um personalizado
                    </p>
                </div>

                {/* Controles */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap gap-4">
                        {/* Busca */}
                        <div className="flex-1 min-w-64">
                            <Input
                                placeholder="Buscar templates..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Categoria */}
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Categorias</SelectItem>
                                {Object.entries(categories).map(([key, cat]) => (
                                    <SelectItem key={key} value={key}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Ordenação */}
                        <Select value={sort} onValueChange={(value: any) => setSort(value)}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Nome</SelectItem>
                                <SelectItem value="usageCount">Mais Usados</SelectItem>
                                <SelectItem value="createdAt">Mais Novos</SelectItem>
                                <SelectItem value="updatedAt">Atualizados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="official">Templates Oficiais</TabsTrigger>
                            <TabsTrigger value="custom">Meus Templates</TabsTrigger>
                        </TabsList>

                        {/* Botão Criar Personalizado */}
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleCreateCustom} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Criar Funil Personalizado
                            </Button>
                        </div>

                        {/* Templates Oficiais */}
                        <TabsContent value="official" className="mt-6">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-gray-600">Carregando templates...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTemplates
                                        .filter(t => !t.isCustom)
                                        .map((template) => (
                                            <TemplateCard
                                                key={template.id}
                                                template={template}
                                                onUse={() => handleUseTemplate(template.id)}
                                                onCustomize={() => handleCustomizeTemplate(template)}
                                                showCustomizeButton={true}
                                            />
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Templates Personalizados */}
                        <TabsContent value="custom" className="mt-6">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-gray-600">Carregando templates...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTemplates
                                        .filter(t => t.isCustom)
                                        .map((template) => (
                                            <TemplateCard
                                                key={template.id}
                                                template={template}
                                                onUse={() => handleUseTemplate(template.id)}
                                                onDelete={() => handleDeleteCustomTemplate(template.id)}
                                                showDeleteButton={true}
                                                isCustom={true}
                                            />
                                        ))}
                                </div>
                            )}

                            {!loading && filteredTemplates.filter(t => t.isCustom).length === 0 && (
                                <div className="text-center py-12">
                                    <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        Nenhum Template Personalizado
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Personalize um template oficial para começar
                                    </p>
                                    <Button onClick={() => setActiveTab('official')} variant="outline">
                                        Ver Templates Oficiais
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Modal de Personalização */}
                <Dialog open={isCustomizeModalOpen} onOpenChange={setIsCustomizeModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Personalizar Template</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome do Template</Label>
                                <Input
                                    id="name"
                                    value={customizationForm.name}
                                    onChange={(e) => setCustomizationForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nome do seu template"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    value={customizationForm.description}
                                    onChange={(e) => setCustomizationForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Descreva seu template personalizado"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Categoria</Label>
                                <Select
                                    value={customizationForm.category}
                                    onValueChange={(value) => setCustomizationForm(prev => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(categories).map(([key, cat]) => (
                                            <SelectItem key={key} value={key}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notas (Opcional)</Label>
                                <Textarea
                                    id="notes"
                                    value={customizationForm.notes}
                                    onChange={(e) => setCustomizationForm(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Suas anotações sobre este template"
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setIsCustomizeModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveCustomTemplate}>
                                    Criar Template
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

// Componente Card do Template
interface TemplateCardProps {
    template: UnifiedTemplateData;
    onUse: () => void;
    onCustomize?: () => void;
    onDelete?: () => void;
    showCustomizeButton?: boolean;
    showDeleteButton?: boolean;
    isCustom?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
    template,
    onUse,
    onCustomize,
    onDelete,
    showCustomizeButton = false,
    showDeleteButton = false,
    isCustom = false
}) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
                <ThumbnailImage
                    src={template.image}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    {template.isOfficial && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Oficial
                        </Badge>
                    )}
                    {isCustom && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Personalizado
                        </Badge>
                    )}
                </div>
            </div>

            <CardContent className="p-4">
                <div className="mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                    </p>
                </div>

                <div className="mb-3 flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{template.stepCount} etapas</span>
                    <span>↗ {template.conversionRate}</span>
                    <span>{template.usageCount} usos</span>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onUse} className="flex-1" size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Usar Template
                    </Button>

                    {showCustomizeButton && onCustomize && (
                        <Button onClick={onCustomize} variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                        </Button>
                    )}

                    {showDeleteButton && onDelete && (
                        <Button onClick={onDelete} variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default FunnelPanelPageUnified;
